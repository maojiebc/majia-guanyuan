#!/usr/bin/env python3
"""Small read-only SQL previews with provenance; never creates/saves/runs an ETL."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
import time
from readonly_query import (QueryError, ReadOnlyCLI, atomic_json, digest, local_lock,
                            private_output, token)


def stamp():
    return datetime.now(timezone.utc).isoformat()


def dataset_info(raw, dataset):
    value = json.loads(raw)
    data = value.get('response', value.get('data', value))
    if not isinstance(data, dict) or data.get('dsId') != dataset or not isinstance(data.get('columns'), list):
        raise QueryError('Dataset metadata identity/shape mismatch')
    return data


def validate_sql(sql):
    # Conservative closed subset; no comments, compound statements or write verbs.
    value = sql.strip()
    if value.endswith(';'):
        value = value[:-1].strip()
    if (not re.match(r'(?i)^(SELECT|WITH)\b', value) or ';' in value
            or '--' in value or '/*' in value
            or re.search(r'(?i)\b(CREATE|INSERT|UPDATE|DELETE|MERGE|DROP|ALTER|TRUNCATE|GRANT|REVOKE|CALL|COPY|INTO)\b', value)):
        raise QueryError('Only a single SELECT/WITH query without comments or write clauses is supported')
    return value


def parse_table(stdout, host, node, max_rows):
    """Fail closed on the observed guanetl terminal-table contract."""
    if not 1 <= max_rows <= 20:
        raise QueryError('ETL result cap must be between 1 and 20')
    if '\n---\n' not in stdout:
        raise QueryError('Missing official preview summary')
    table, summary = stdout.split('\n---\n', 1)
    match = re.search(r'etlId:\s*(\S+)\s+nodeId:\s*(\S+)\s+后端预览样本行数:\s*(\d+).*?--limit 截取后行数:\s*(\d+)', summary)
    dimensions = re.search(r'\[(\d+) rows x (\d+) columns\]', summary)
    if not match or not dimensions or (match[1], match[2]) != (host, node):
        raise QueryError('Preview host/node/summary contract mismatch')
    backend, clipped = int(match[3]), int(match[4])
    row_count, column_count = int(dimensions[1]), int(dimensions[2])
    if backend >= max_rows or clipped >= max_rows or backend != clipped:
        raise QueryError('possibly-truncated')
    if column_count > 10 or row_count != clipped:
        raise QueryError('Renderer trimmed columns or rows')
    lines = table.strip('\n').splitlines()
    if len(lines) != row_count + 1 or not lines:
        raise QueryError('Rendered row count differs from summary')
    header = lines[0].rstrip()
    columns = re.split(r' {2,}', header)
    if len(columns) != column_count or len(set(columns)) != len(columns):
        raise QueryError('Ambiguous terminal headers')
    if any(not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*', x) for x in columns):
        raise QueryError('Use simple ASCII SQL output aliases for strict terminal parsing')
    positions = [m.start() for m in re.finditer(r'\S+', header)]
    rows = []
    for line in lines[1:]:
        if not line.isascii() or '...' in line or '…' in line:
            raise QueryError('Unsupported wide/truncated terminal cells')
        values = [line[begin:positions[i + 1] if i + 1 < len(positions) else None].strip()
                  for i, begin in enumerate(positions)]
        if any(not value for value in values):
            raise QueryError('Ambiguous empty terminal cell')
        rows.append(values)
    return {'columns': columns, 'rows': rows, 'cellEncoding': 'terminal-text',
            'backendSampleRows': backend, 'returnedRows': row_count, 'possiblyTruncated': False}


def calibration_sql(filters):
    conditions = []
    for condition in filters:
        match = re.fullmatch(r'(.+?) (EQ|BT|IS_NULL|NOT_NULL)(?: (.+))?', condition)
        if not match or '`' in match[1]:
            raise QueryError('Calibration supports EQ/BT/IS_NULL/NOT_NULL only')
        field, op, value = match.groups()
        field = '`' + field + '`'
        def quote(v):
            # Spark string literals: escape backslashes before apostrophes.
            return "'" + v.replace('\\', '\\\\').replace("'", "\\'") + "'"
        if op in {'IS_NULL', 'NOT_NULL'}:
            if value is not None:
                raise QueryError('Null operator takes no value')
            conditions.append(field + (' IS NULL' if op == 'IS_NULL' else ' IS NOT NULL'))
        elif op == 'EQ' and value:
            conditions.append(field + ' = ' + quote(value))
        elif op == 'BT' and value and len(value.split(',')) == 2:
            start, end = value.split(',')
            conditions.append(field + ' BETWEEN ' + quote(start) + ' AND ' + quote(end))
        else:
            raise QueryError('Calibration operator value invalid')
    return 'SELECT COUNT(*) AS source_count FROM input1' + (
        ' WHERE ' + ' AND '.join(conditions) if conditions else '')


def write_graph(workspace, metadata, sql):
    types = {'STRING', 'LONG', 'INT', 'DOUBLE', 'FLOAT', 'BOOLEAN', 'DATE', 'TIMESTAMP'}
    source = workspace / 'etl'
    if source.exists():
        shutil.rmtree(source)
    source.mkdir()
    statements, names = [], []
    for i, data in enumerate(metadata, 1):
        fields = []
        for field in data['columns']:
            name, kind = field.get('name'), field.get('fdType')
            if not isinstance(name, str) or not name or kind not in types:
                raise QueryError('Unsupported input field/schema; do not guess a conversion')
            fields.append('BasicField(%s, FieldType%s)' % (json.dumps(name, ensure_ascii=False), kind))
        variable = 'input%d' % i; names.append(variable)
        statements.append('%s := BasicInputDataset("id_%d", "%s", %s, []Field{%s}, Position{X:100,Y:%d})' % (
            variable, 91000 + i, variable, json.dumps(data['dsId']), ','.join(fields), i * 100))
    statements.append('result := BasicSqlScript("id_92001", "aggregate", []Node{%s}, ReadSQLFile("aggregate.sql"), Position{X:400,Y:100})' % ','.join(names))
    (source / 'aggregate.sql').write_text(sql + '\n')
    (source / 'etl.go').write_text('package main\nimport . "guanetl/internal/framework"\nfunc DefineETL() []Node {\n' +
                                 '\n'.join(statements) + '\nreturn []Node{result}\n}\n')


def clean_workspace(workspace, keep=False):
    if not keep:
        shutil.rmtree(workspace, ignore_errors=True)
        return
    # Keep only our generated source files. Discard *all* CLI snapshots/state/metadata.
    for path in workspace.iterdir():
        if path.name != 'etl':
            if path.is_dir():
                shutil.rmtree(path)
            else:
                path.unlink()
    for path in (workspace / 'etl').iterdir():
        if path.name not in {'etl.go', 'aggregate.sql'}:
            if path.is_dir():
                shutil.rmtree(path)
            else:
                path.unlink()


def cli_versions():
    """Read the selected installed package metadata without expanding the CLI allowlist."""
    result = {}
    for tool in ('guancli', 'guanetl'):
        executable = shutil.which(tool)
        info = {'version': None}
        if executable:
            resolved = Path(executable).resolve()
            info['selectedExecutable'] = str(resolved)
            for parent in resolved.parents:
                package = parent / 'package.json'
                if not package.is_file():
                    continue
                try:
                    data = json.loads(package.read_text())
                    if data.get('name') == '@guandata/' + tool:
                        info['version'] = data.get('version')
                        info['evidence'] = str(package)
                        break
                    if data.get('name') == '@guandata/guanskill':
                        component = parent / 'node_modules' / '@guandata' / tool / 'package.json'
                        if component.is_file():
                            selected = json.loads(component.read_text())
                            if selected.get('name') == '@guandata/' + tool:
                                info['version'] = selected.get('version')
                                info['evidence'] = str(component)
                                info['resolution'] = 'installed aggregate forwarder component'
                                break
                except (ValueError, OSError):
                    continue
        result[tool] = info
    return result


class AggregateRunner:
    def __init__(self, profile, host, allowlist, cli=None, clock=time.time, sleep=time.sleep, guard_root=None):
        self.profile, self.host = token(profile), token(host)
        data = json.loads(Path(allowlist).read_text())
        candidates = [x for x in data.get('hosts', []) if x.get('profile') == profile and x.get('etlId') == host]
        if data.get('schemaVersion') != 1 or len(candidates) != 1:
            raise QueryError('Host/profile must match exactly one locally approved sandbox')
        self.approved = candidates[0]
        self.cli = cli or ReadOnlyCLI(profile)
        self.clock, self.sleep = clock, sleep
        root = guard_root or Path.home() / '.cache/majia-guanyuan/query-guards'
        self.guard = Path(root) / (profile + '.json')
        self.guard.parent.mkdir(parents=True, exist_ok=True)

    def invoke(self, tool, args):
        guard = json.loads(self.guard.read_text()) if self.guard.exists() else {}
        if guard.get('inflight'):
            raise QueryError('Unresolved query for this profile; do not retry')
        if guard.get('resumeAfter', 0) > self.clock():
            raise QueryError('Profile still cooling after a slow query')
        delay = guard.get('lastStarted', 0) + 5 - self.clock()
        if delay > 0:
            self.sleep(delay)
        guard.update(lastStarted=self.clock(), inflight={'purpose': 'aggregate',
                                                       'host': self.host, 'runOut': str(self.out)})
        atomic_json(self.guard, guard)
        try:
            result = self.cli.run(tool, args, timeout=120)
        except BaseException:
            # No assertion that killing a client cancels an already submitted preview.
            raise
        seconds = self.clock() - guard['lastStarted']
        guard.pop('inflight')
        if seconds > 60:
            guard['resumeAfter'] = self.clock() + 60
        atomic_json(self.guard, guard)
        return result

    def seed(self, workspace):
        path = self.approved.get('seedWorkspace')
        if not path:
            self.invoke('guanetl', ['edit', self.host, '--dir', str(workspace)])
            return
        seed = Path(path).expanduser().resolve()
        state = json.loads((seed / '_guanetl_state.json').read_text())
        if state.get('etlId') != self.host:
            raise QueryError('Approved seed workspace host mismatch')
        for name in ('_guanetl_state.json', '_base_etl.json', '_input.json'):
            source = seed / name
            if source.is_symlink() or not source.is_file():
                raise QueryError('Incomplete/untrusted sandbox seed')
            shutil.copyfile(source, workspace / name)

    def preview(self, workspace, metadata, sql, max_rows):
        write_graph(workspace, metadata, sql)
        self.invoke('guanetl', ['export', '--dir', str(workspace)])
        graph = json.loads((workspace / '_exported.json').read_text())
        actions = graph.get('meta')
        if (not isinstance(actions, list) or len(actions) != len(metadata) + 1
                or {x.get('type') for x in actions} != {'INPUT_DATASET', 'SQL_SCRIPT'}
                or {x.get('inputDsId') for x in actions if x.get('type') == 'INPUT_DATASET'} != {x['dsId'] for x in metadata}):
            raise QueryError('Exported graph differs from approved input/SQL-only graph')
        stdout = self.invoke('guanetl', ['preview', 'id_92001', '--dir', str(workspace),
                                       '--max-parallel', '1', '--timeout', '120', '--limit', str(max_rows), '-v'])
        return parse_table(stdout, self.host, 'id_92001', max_rows)

    def run(self, inputs, sql_file, out, calibrate=False, calibration_filters=(), max_rows=20, keep=False):
        if not inputs or len(inputs) != len(set(inputs)):
            raise QueryError('Unique input dataset IDs required')
        for value in inputs:
            token(value)
        sql_bytes = Path(sql_file).read_bytes()
        sql = validate_sql(sql_bytes.decode('utf-8'))
        if not 1 <= max_rows <= 20 or (calibrate and len(inputs) != 1):
            raise QueryError('Small result cap and one calibration source required')
        # Validate this before any BI request.
        calibration = calibration_sql(calibration_filters) if calibrate else None
        self.out = private_output(out)
        self.out.mkdir(parents=True, exist_ok=False)
        provenance = {'schemaVersion': 1, 'profile': self.profile, 'hostEtl': self.host,
                      'inputDatasetIds': inputs, 'sqlSha256': hashlib.sha256(sql_bytes).hexdigest(),
                      'startedAt': stamp(), 'status': 'pending', 'possiblyTruncated': None,
                      'warnings': ['Terminal cells remain text; do not infer numeric types or nulls.',
                                   'Calibration checks the stated source scope, not business definitions.'],
                      'calibration': {'requested': calibrate, 'filters': list(calibration_filters)},
                      'cliVersions': cli_versions()}
        workspace = Path(tempfile.mkdtemp(prefix='preview-workspace-', dir=self.out))
        with local_lock(self.guard.with_suffix('.lock')):
            try:
                metadata = [dataset_info(self.invoke('guancli', ['ds', 'get', x, '--brief', '--raw']), x) for x in inputs]
                provenance['inputs'] = [{'datasetId': x['dsId'], 'version': x.get('version'),
                                         'updatedAt': x.get('config', {}).get('datasourceModifyTime') or x.get('utime')}
                                        for x in metadata]
                self.seed(workspace)
                result = self.preview(workspace, metadata, sql, max_rows)
                provenance.update(returnedRows=result['returnedRows'], possiblyTruncated=False)
                if calibrate:
                    args = ['ds', 'preview', inputs[0], '--raw', '--limit', '1']
                    for condition in calibration_filters:
                        args += ['--filter', condition]
                    raw = json.loads(self.invoke('guancli', args))
                    response = raw.get('response', {})
                    expected = response.get('rowCount')
                    if response.get('dsId') != inputs[0] or not isinstance(expected, int) or isinstance(expected, bool) or expected < 0:
                        raise QueryError('Calibration rowCount identity/shape mismatch')
                    control = self.preview(workspace, metadata, calibration, max_rows)
                    if control['columns'] != ['source_count'] or len(control['rows']) != 1 or not control['rows'][0][0].isdigit():
                        raise QueryError('Calibration must return one integer count')
                    observed = int(control['rows'][0][0])
                    provenance['calibration'].update(expected=expected, observed=observed, passed=(expected == observed))
                    if expected != observed:
                        raise QueryError('Calibration count mismatch')
                after = [dataset_info(self.invoke('guancli', ['ds', 'get', x, '--brief', '--raw']), x) for x in inputs]
                for before, current in zip(metadata, after):
                    if (before.get('version'), before.get('config', {}).get('datasourceModifyTime'), before.get('utime')) != (
                            current.get('version'), current.get('config', {}).get('datasourceModifyTime'), current.get('utime')):
                        raise QueryError('Source changed during preview/calibration')
                if any(x.get('version') is None for x in metadata):
                    provenance['warnings'].append('Source version unavailable; no frozen snapshot proof.')
                provenance['status'] = 'success'
                atomic_json(self.out / 'result.json', result)
                provenance['resultSha256'] = hashlib.sha256((self.out / 'result.json').read_bytes()).hexdigest()
                (self.out / 'source-note.txt').write_text('取数出处：环境 %s；数据集 %s；SQL 指纹（sha256）%s；开始时间 %s；返回 %s 行；校准 %s。结果为终端预览文本，原始类型与精度须另行确认；指标口径、期间与单位请补充。\n' % (
                    self.profile, ','.join(inputs), provenance['sqlSha256'], provenance['startedAt'],
                    result['returnedRows'], provenance['calibration'].get('passed', 'not requested')))
            except BaseException as error:
                provenance.update(status='failed', errorType=type(error).__name__, error=str(error) if isinstance(error, QueryError) else 'Execution interrupted or failed')
                if isinstance(error, QueryError) and str(error) == 'possibly-truncated':
                    provenance['possiblyTruncated'] = True
                if isinstance(error, (KeyboardInterrupt, SystemExit)):
                    raise
            finally:
                provenance['finishedAt'] = stamp()
                clean_workspace(workspace, keep)
                provenance['workspaceKept'] = keep
                atomic_json(self.out / 'provenance.json', provenance)
        return provenance


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='action', required=True)
    run = sub.add_parser('run')
    for name in ('profile', 'host-etl', 'allowlist', 'sql-file', 'out'):
        run.add_argument('--' + name, required=True)
    run.add_argument('--input', action='append', required=True)
    run.add_argument('--calibrate', action='store_true')
    run.add_argument('--calibration-filter', action='append', default=[])
    run.add_argument('--max-rows', type=int, default=20)
    run.add_argument('--keep-workspace', action='store_true')
    args = parser.parse_args()
    try:
        runner = AggregateRunner(args.profile, args.host_etl, args.allowlist)
        result = runner.run(args.input, args.sql_file, args.out, args.calibrate,
                            args.calibration_filter, args.max_rows, args.keep_workspace)
        print(json.dumps({'status': result['status'], 'provenance': str(runner.out / 'provenance.json')}, ensure_ascii=False))
        return 0 if result['status'] == 'success' else 2
    except (QueryError, OSError, ValueError, KeyError) as error:
        print(str(error), file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
