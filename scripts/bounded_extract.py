#!/usr/bin/env python3
"""Serial, counted, resumable official dataset previews; no BI writes or retries."""
import argparse
from datetime import date, datetime, timedelta, timezone
import hashlib
import json
import re
from pathlib import Path
import shutil
import subprocess
import sys
import time
from readonly_query import (QueryError, ReadOnlyCLI, atomic_json, digest, local_lock,
                            private_output, token)


def stamp():
    return datetime.now(timezone.utc).isoformat()


def load_plan(path):
    plan = json.loads(Path(path).read_text())
    known = {'schemaVersion', 'profile', 'datasetId', 'columns', 'filters', 'dateField',
             'start', 'end', 'prefixField', 'prefixes', 'maxRows', 'out',
             'intervalSeconds', 'timeoutSeconds', 'slowSeconds', 'cooldownSeconds',
             'requireMount', 'minFreeBytes'}
    if set(plan) - known or plan.get('schemaVersion') != 1:
        raise QueryError('Unsupported plan schema/keys')
    token(plan['profile']); token(plan['datasetId'])
    if not all(isinstance(plan.get(k), str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', plan[k]) for k in ('start', 'end')):
        raise QueryError('Dates must be YYYY-MM-DD')
    start, end = date.fromisoformat(plan['start']), date.fromisoformat(plan['end'])
    if start > end:
        raise QueryError('Reversed date range')
    for name in ('dateField', 'prefixField'):
        value = plan.get(name)
        if name == 'prefixField' and value is None:
            continue
        if not isinstance(value, str) or not value.strip() or any(c in value for c in '\n\r,'):
            raise QueryError('Invalid field name')
    columns, filters = plan.get('columns', []), plan.get('filters', [])
    if not isinstance(columns, list) or not all(isinstance(x, str) and x.strip() and
                                               not any(c in x for c in '\n\r,') for x in columns):
        raise QueryError('Columns must be a list of names')
    if len(set(columns)) != len(columns):
        raise QueryError('Duplicate columns')
    if not isinstance(filters, list) or not all(isinstance(x, str) and x.strip() and
                                               '\n' not in x and '\r' not in x for x in filters):
        raise QueryError('Filters must be CLI condition strings')
    for field in (plan['dateField'], plan.get('prefixField')):
        if field and any(x.startswith(field + ' ') for x in filters):
            raise QueryError('Base filters cannot constrain the partition fields')
    prefixes = plan.get('prefixes', [None])
    if prefixes != [None]:
        if not plan.get('prefixField') or not isinstance(prefixes, list) or not prefixes:
            raise QueryError('Prefix field and nonempty list required')
        if not all(isinstance(x, str) and x and not any(c in x for c in '\n\r,') for x in prefixes):
            raise QueryError('Invalid prefix')
        if any(a.startswith(b) for i, a in enumerate(prefixes) for j, b in enumerate(prefixes) if i != j):
            raise QueryError('Prefix scopes overlap')
    elif plan.get('prefixField'):
        raise QueryError('Prefix list required when a field is declared')
    for key, default, minimum, maximum in (
            ('maxRows', 60000, 1, 60000), ('intervalSeconds', 5, 5, None),
            ('timeoutSeconds', 120, 1, 120), ('slowSeconds', 60, 1, 60),
            ('cooldownSeconds', 60, 60, None), ('minFreeBytes', 1073741824, 0, None)):
        val = plan.setdefault(key, default)
        if not isinstance(val, int) or isinstance(val, bool) or val < minimum or (maximum and val > maximum):
            raise QueryError('Invalid safety parameter: ' + key)
    if plan['slowSeconds'] >= plan['timeoutSeconds']:
        raise QueryError('Slow threshold must precede timeout')
    plan['columns'], plan['filters'], plan['prefixes'] = columns, filters, prefixes
    plan['out'] = str(private_output(plan['out']))
    if plan.get('requireMount'):
        plan['requireMount'] = str(Path(plan['requireMount']).expanduser().resolve())
    return plan


def scope(start, end, prefix):
    value = {'start': start, 'end': end, 'prefix': prefix}
    value.update(id=digest(value)[:24], status='pending')
    return value


def decode_preview(raw, dataset, columns, limit):
    if not isinstance(raw, dict) or raw.get('result') not in (None, 'ok'):
        raise QueryError('API response failed')
    response = raw.get('response')
    if not isinstance(response, dict) or response.get('dsId') != dataset:
        raise QueryError('Raw preview dataset/response mismatch')
    count, rows, fields = response.get('rowCount'), response.get('preview'), response.get('columns')
    if not isinstance(count, int) or isinstance(count, bool) or count < 0:
        raise QueryError('Missing nonnegative rowCount')
    if not isinstance(rows, list) or not isinstance(fields, list) or len(rows) > limit:
        raise QueryError('Invalid preview shape/limit')
    names = [x.get('name') if isinstance(x, dict) else None for x in fields]
    if any(not isinstance(x, str) or not x for x in names) or len(set(names)) != len(names):
        raise QueryError('Missing or duplicate column names')
    if columns and not set(columns).issubset(names):
        raise QueryError('Selected column contract differs from response')
    if any(not isinstance(row, list) or len(row) != len(names) for row in rows):
        raise QueryError('Preview row width mismatch')
    selected = columns or names
    indices = [names.index(name) for name in selected]
    return [dict(zip(selected, [row[i] for i in indices])) for row in rows], count, response.get('version')


def readback(path, expected_hash, expected_rows):
    data = Path(path).read_bytes()
    if hashlib.sha256(data).hexdigest() != expected_hash:
        raise QueryError('Completed chunk hash mismatch; never refetch automatically')
    rows = [json.loads(line) for line in data.splitlines()]
    if len(rows) != expected_rows or any(not isinstance(x, dict) for x in rows):
        raise QueryError('Completed chunk row readback mismatch')


class Extractor:
    def __init__(self, plan, cli=None, clock=time.time, sleep=time.sleep, guard_root=None):
        self.plan = plan
        self.out = private_output(plan['out'])
        if plan.get('requireMount'):
            mount = Path(plan['requireMount'])
            if not mount.is_mount() or not self.out.is_relative_to(mount):
                raise QueryError('Required mount unavailable or output outside mount')
        self.out.mkdir(parents=True, exist_ok=True)
        self.cli = cli or ReadOnlyCLI(plan['profile'])
        self.clock, self.sleep = clock, sleep
        root = guard_root or Path.home() / '.cache/majia-guanyuan/query-guards'
        self.guard_path = Path(root) / (token(plan['profile']) + '.json')
        self.guard_path.parent.mkdir(parents=True, exist_ok=True)
        self.state_path = self.out / 'ledger.json'

    def disk_guard(self):
        mount = self.plan.get('requireMount')
        if mount and (not Path(mount).is_mount() or not self.out.is_relative_to(Path(mount))):
            raise QueryError('Required mount unavailable or output outside mount')
        if shutil.disk_usage(self.out).free < self.plan['minFreeBytes']:
            raise QueryError('Insufficient free space')

    def load(self):
        if self.state_path.exists():
            state = json.loads(self.state_path.read_text())
            if state['planFingerprint'] != digest(self.plan):
                raise QueryError('Plan changed; use a new output directory')
        else:
            state = {'schemaVersion': 1, 'planFingerprint': digest(self.plan),
                     'plan': self.plan, 'status': 'ready', 'createdAt': stamp(),
                     'chunks': [scope(self.plan['start'], self.plan['end'], p) for p in self.plan['prefixes']]}
        for chunk in state['chunks']:
            if chunk['status'] == 'running':
                chunk['status'] = 'unknown'
                state['status'] = 'unknown'
        for chunk in state['chunks']:
            if chunk['status'] == 'complete':
                path = (self.out / chunk['file']).resolve()
                if not path.is_relative_to(self.out):
                    raise QueryError('Chunk file escapes output directory')
                readback(path, chunk['sha256'], chunk['rows'])
        return state

    def save(self, state, guard):
        state['updatedAt'] = stamp()
        self.disk_guard()
        atomic_json(self.guard_path, guard)
        atomic_json(self.state_path, state)

    def args(self, chunk):
        args = ['ds', 'preview', self.plan['datasetId'], '--raw', '--limit', str(self.plan['maxRows'])]
        if self.plan['columns']:
            args += ['--columns', ','.join(self.plan['columns'])]
        filters = self.plan['filters'] + [self.plan['dateField'] + ' BT ' + chunk['start'] + ',' + chunk['end']]
        if chunk['prefix'] is not None:
            filters += [self.plan['prefixField'] + ' STARTSWITH ' + chunk['prefix']]
        for value in filters:
            args += ['--filter', value]
        return args

    def resolve_unknown(self, evidence_path):
        """Record a human-verified terminal observation, then split instead of retrying."""
        with local_lock(self.guard_path.with_suffix('.lock')):
            state = self.load()
            guard = json.loads(self.guard_path.read_text())
            proof = json.loads(Path(evidence_path).read_text())
            request = guard.get('inflight', {})
            if (state['status'] != 'unknown' or request.get('out') != str(self.out)
                    or request.get('planFingerprint') != digest(self.plan)
                    or proof.get('profile') != self.plan['profile']
                    or proof.get('planFingerprint') != digest(self.plan)
                    or proof.get('chunkId') != request.get('chunkId')
                    or proof.get('serverCompleted') is not True
                    or not isinstance(proof.get('evidence'), str) or not proof['evidence'].strip()
                    or not isinstance(proof.get('reviewedBy'), str) or not proof['reviewedBy'].strip()):
                raise QueryError('Independent exact-scope server completion evidence required')
            observed = datetime.fromisoformat(proof['observedAt'])
            if observed.tzinfo is None or observed.timestamp() > self.clock():
                raise QueryError('Evidence timestamp must be a past timezone-aware observation')
            chunk = next(x for x in state['chunks'] if x['id'] == request['chunkId'])
            if observed < datetime.fromisoformat(chunk['startedAt']):
                raise QueryError('Evidence predates this request')
            chunk.update(status='abandoned', completionReview=proof,
                         evidenceSha256=hashlib.sha256(Path(evidence_path).read_bytes()).hexdigest())
            begin, end = date.fromisoformat(chunk['start']), date.fromisoformat(chunk['end'])
            if begin == end:
                state['status'] = 'blocked'
                chunk['reason'] = 'Resolved single-day unknown; use a newly reviewed smaller partition dimension'
            else:
                middle = begin + (end - begin) // 2
                index = state['chunks'].index(chunk)
                state['chunks'][index + 1:index + 1] = [
                    scope(str(begin), str(middle), chunk['prefix']),
                    scope(str(middle + timedelta(days=1)), str(end), chunk['prefix'])]
                state['status'] = 'paused-budget'
            guard.pop('inflight')
            self.save(state, guard)
            return state

    def run(self, max_requests=1, resume=False):
        if not isinstance(max_requests, int) or isinstance(max_requests, bool) or max_requests < 1:
            raise QueryError('Positive max_requests required')
        with local_lock(self.guard_path.with_suffix('.lock')):
            self.disk_guard()
            state = self.load()
            guard = json.loads(self.guard_path.read_text()) if self.guard_path.exists() else {}
            if guard.get('inflight'):
                raise QueryError('Unresolved server request for this profile; cannot resume by elapsed time')
            if state['status'] in {'unknown', 'failed', 'blocked'}:
                raise QueryError('Queue requires independent review; no automatic retry')
            if state['status'] == 'paused-slow':
                if not resume:
                    raise QueryError('Completed slow response requires explicit resume')
                if self.clock() < state['resumeAfter']:
                    raise QueryError('Completed slow response cooldown has not elapsed')
            state['status'] = 'ready'
            self.save(state, guard)
            requests = 0
            while requests < max_requests:
                chunk = next((x for x in state['chunks'] if x['status'] == 'pending'), None)
                if chunk is None:
                    state['status'] = 'complete'
                    break
                if guard.get('resumeAfter', 0) > self.clock():
                    raise QueryError('Profile is cooling after a completed slow request')
                wait = guard.get('lastStarted', 0) + self.plan['intervalSeconds'] - self.clock()
                if wait > 0:
                    self.sleep(wait)
                self.disk_guard()
                started = self.clock()
                chunk.update(status='running', startedAt=stamp())
                request = {'out': str(self.out), 'chunkId': chunk['id'], 'planFingerprint': digest(self.plan)}
                guard.update(lastStarted=started, inflight=request)
                state['status'] = 'running'
                self.save(state, guard)
                requests += 1
                try:
                    raw = self.cli.run('guancli', self.args(chunk), timeout=self.plan['timeoutSeconds'])
                except BaseException as error:
                    # Once dispatch began, interruption/error is conservatively unknown.
                    chunk.update(status='unknown', errorType=type(error).__name__)
                    state['status'] = 'unknown'
                    self.save(state, guard)
                    if isinstance(error, (KeyboardInterrupt, SystemExit)):
                        raise
                    return state
                seconds = self.clock() - started
                chunk['seconds'] = seconds
                guard.pop('inflight', None)
                try:
                    rows, count, version = decode_preview(json.loads(raw), self.plan['datasetId'],
                                                          self.plan['columns'], self.plan['maxRows'])
                    if version is not None:
                        if 'sourceVersion' in state and state['sourceVersion'] != version:
                            raise QueryError('Source version changed across chunks')
                        state['sourceVersion'] = version
                    chunk.update(returned=len(rows), rowCount=count, sourceVersion=version)
                    if len(rows) >= self.plan['maxRows'] or len(rows) != count:
                        chunk['status'] = 'split'
                        begin, end = date.fromisoformat(chunk['start']), date.fromisoformat(chunk['end'])
                        if begin == end:
                            chunk['status'], state['status'] = 'blocked', 'blocked'
                            chunk['reason'] = 'Single day still incomplete; change the partition dimension'
                        else:
                            middle = begin + (end - begin) // 2
                            children = [scope(str(begin), str(middle), chunk['prefix']),
                                        scope(str(middle + timedelta(days=1)), str(end), chunk['prefix'])]
                            index = state['chunks'].index(chunk)
                            state['chunks'][index + 1:index + 1] = children
                            state['status'] = 'ready'
                    else:
                        relative = 'chunk-' + chunk['id'] + '.jsonl'
                        path = self.out / relative
                        data = ''.join(json.dumps(row, ensure_ascii=False, allow_nan=False) + '\n' for row in rows).encode()
                        temporary = path.with_suffix('.tmp')
                        with temporary.open('wb') as stream:
                            stream.write(data); stream.flush()
                            import os
                            os.fsync(stream.fileno())
                        self.disk_guard()
                        temporary.replace(path)
                        sha = hashlib.sha256(data).hexdigest()
                        readback(path, sha, len(rows))
                        chunk.update(status='complete', file=relative, rows=len(rows), sha256=sha,
                                     finishedAt=stamp(), empty=(count == 0))
                        state['status'] = 'ready'
                except (QueryError, ValueError, OSError, KeyError) as error:
                    chunk.update(status='failed', errorType=type(error).__name__)
                    state['status'] = 'failed'
                if seconds > self.plan['slowSeconds'] and state['status'] == 'ready':
                    # Only complete accepted chunks can recover through cooldown/resume.
                    if chunk['status'] == 'complete':
                        state['resumeAfter'] = self.clock() + self.plan['cooldownSeconds']
                        guard['resumeAfter'] = state['resumeAfter']
                        state['status'] = 'paused-slow'
                    else:
                        state['status'] = 'blocked'
                        chunk['reason'] = 'Slow incomplete response requires review before smaller queries'
                self.save(state, guard)
                if state['status'] != 'ready':
                    return state
            if state['status'] == 'ready':
                state['status'] = 'complete' if not any(x['status'] == 'pending' for x in state['chunks']) else 'paused-budget'
            self.save(state, guard)
            return state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='action', required=True)
    for name in ('run', 'resume', 'status'):
        p = sub.add_parser(name)
        p.add_argument('--plan', required=True)
        if name != 'status':
            p.add_argument('--max-requests', type=int, default=1)
    p = sub.add_parser('resolve-unknown')
    p.add_argument('--plan', required=True)
    p.add_argument('--evidence', required=True)
    args = parser.parse_args()
    try:
        runner = Extractor(load_plan(args.plan))
        if args.action == 'status':
            state = runner.load()
        elif args.action == 'resolve-unknown':
            state = runner.resolve_unknown(args.evidence)
        else:
            state = runner.run(args.max_requests, args.action == 'resume')
        counts = {name: sum(x['status'] == name for x in state['chunks']) for name in
                  ('complete', 'pending', 'split', 'failed', 'unknown', 'running', 'blocked')}
        print(json.dumps({'status': state['status'], 'chunks': counts,
                          'ledger': str(runner.state_path)}, ensure_ascii=False))
        return 0 if state['status'] in {'complete', 'ready', 'paused-budget'} else 2
    except (QueryError, ValueError, KeyError, OSError) as error:
        print(str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
