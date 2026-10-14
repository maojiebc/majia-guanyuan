"""Independently verify a bounded extract locally; never query BI or edit its ledger."""
import argparse
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation, localcontext
import hashlib
import json
from pathlib import Path
import re
import sys

from bounded_extract import load_plan, scope
from readonly_query import QueryError, atomic_json, digest, private_output


def json_value(data, decimal=False):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise QueryError('Duplicate JSON key')
            result[key] = value
        return result

    def invalid(_):
        raise QueryError('Nonfinite JSON number')

    options = {'object_pairs_hook': pairs, 'parse_constant': invalid}
    if decimal:
        options['parse_float'] = Decimal
    return json.loads(data, **options)


def day(value):
    if not isinstance(value, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
        raise QueryError('Scope verification requires an exact DATE value')
    return date.fromisoformat(value)


def predicates(plan):
    checks = []
    for condition in plan['filters']:
        match = re.fullmatch(r'(.+) (EQ|BT|IS_NULL|NOT_NULL)(?: (.+))?', condition)
        if not match:
            raise QueryError('Unsupported base filter; cannot certify scope')
        field, operator, value = match.groups()
        if operator in {'IS_NULL', 'NOT_NULL'}:
            if value is not None:
                raise QueryError('Null filter has an unexpected value')
        elif value is None:
            raise QueryError('Filter value missing')
        elif operator == 'BT':
            bounds = value.split(',')
            if len(bounds) != 2 or day(bounds[0]) > day(bounds[1]):
                raise QueryError('Only DATE BT filters can be verified')
            value = (day(bounds[0]), day(bounds[1]))
        checks.append((field, operator, value))
    return checks


def check_row(row, chunk, plan, checks):
    value = day(row.get(plan['dateField']))
    if not day(chunk['start']) <= value <= day(chunk['end']):
        raise QueryError('Row lies outside its chunk date scope')
    if chunk['prefix'] is not None:
        value = row.get(plan['prefixField'])
        if not isinstance(value, str) or not value.startswith(chunk['prefix']):
            raise QueryError('Row lies outside its chunk prefix scope')
    for field, operator, expected in checks:
        if field not in row:
            raise QueryError('Filter field missing from projected rows')
        value = row[field]
        if operator == 'IS_NULL':
            valid = value is None
        elif operator == 'NOT_NULL':
            valid = value is not None
        elif operator == 'BT':
            valid = expected[0] <= day(value) <= expected[1]
        else:
            # No type guessing for strings, NULL or booleans. Numeric JSON
            # values can compare to an explicit numeric CLI token.
            if isinstance(value, (int, Decimal)) and not isinstance(value, bool):
                try:
                    valid = Decimal(expected).is_finite() and Decimal(value) == Decimal(expected)
                except InvalidOperation:
                    valid = False
            else:
                valid = isinstance(value, str) and value == expected
        if not valid:
            raise QueryError('Row violates a base filter')


def add_decimal(total, value):
    if isinstance(value, bool) or not isinstance(value, (int, Decimal, str)):
        raise QueryError('Sum requires explicit finite numeric cells')
    try:
        number = Decimal(value)
    except InvalidOperation:
        raise QueryError('Sum contains a nonnumeric cell') from None
    if not number.is_finite():
        raise QueryError('Sum contains a nonfinite cell')
    # Precision derives from both coefficients and exponent distance, rather
    # than the global 28-digit context. This is exact for stored JSONL values.
    if abs(number.as_tuple().exponent) > 1000 or len(number.as_tuple().digits) > 1000:
        raise QueryError('Numeric cell exceeds supported precision')
    with localcontext() as context:
        context.prec = max(len(total.as_tuple().digits), len(number.as_tuple().digits)) + \
            abs(total.as_tuple().exponent - number.as_tuple().exponent) + 2
        return total + number


def build_report(plan_path, sum_columns=()):
    plan = load_plan(plan_path)
    ledger_path = Path(plan['out']) / 'ledger.json'
    ledger_bytes = ledger_path.read_bytes()
    state = json_value(ledger_bytes)
    fingerprint = digest(plan)
    if (state.get('schemaVersion') != 1 or state.get('status') != 'complete' or
            state.get('planFingerprint') != fingerprint or digest(state.get('plan')) != fingerprint):
        raise QueryError('Completed exact-plan ledger required')
    chunks = state.get('chunks')
    if not isinstance(chunks, list) or not chunks:
        raise QueryError('Chunk evidence missing')
    sums = list(sum_columns)
    if len(set(sums)) != len(sums) or any(not isinstance(x, str) or not x for x in sums):
        raise QueryError('Sum columns must be unique names')
    checks = predicates(plan)
    required = {plan['dateField'], *sums, *(field for field, _, _ in checks)}
    if plan.get('prefixField'):
        required.add(plan['prefixField'])
    if plan['columns'] and not required.issubset(plan['columns']):
        raise QueryError('Project partition/filter/sum fields before scope acceptance')

    leaves, seen, versions = [], set(), []
    for chunk in chunks:
        if not isinstance(chunk, dict):
            raise QueryError('Invalid chunk evidence')
        begin, end = day(chunk['start']), day(chunk['end'])
        if (begin > end or begin < day(plan['start']) or end > day(plan['end']) or
                chunk['prefix'] not in plan['prefixes'] or
                chunk['id'] != scope(chunk['start'], chunk['end'], chunk['prefix'])['id'] or
                chunk['id'] in seen):
            raise QueryError('Chunk identity or range differs from plan')
        seen.add(chunk['id'])
        if chunk['status'] == 'complete':
            leaves.append(chunk)
            versions.append(chunk.get('sourceVersion'))
        elif chunk['status'] not in {'split', 'abandoned'}:
            raise QueryError('Unfinished or failed chunk cannot be accepted')
    for prefix in plan['prefixes']:
        expected = day(plan['start'])
        for chunk in sorted((x for x in leaves if x['prefix'] == prefix), key=lambda x: x['start']):
            if day(chunk['start']) != expected:
                raise QueryError('Chunk coverage has a gap or overlap')
            expected = day(chunk['end']) + timedelta(days=1)
        if expected != day(plan['end']) + timedelta(days=1):
            raise QueryError('Chunk coverage does not reach the end of plan')
    observed = {json.dumps(v, sort_keys=True) for v in versions if v is not None}
    if len(observed) > 1 or (observed and json.dumps(state.get('sourceVersion'), sort_keys=True) not in observed):
        raise QueryError('Source version evidence drifted')

    totals = {name: Decimal(0) for name in sums}
    nonnull = {name: 0 for name in sums}
    nulls = {name: 0 for name in sums}
    verified, all_rows, schema = [], 0, None
    output = Path(plan['out']).resolve()
    for chunk in leaves:
        count = chunk.get('rows')
        if (not isinstance(count, int) or isinstance(count, bool) or count < 0 or
                any(type(chunk.get(k)) is not int or chunk.get(k) != count for k in ('returned', 'rowCount')) or
                count >= plan['maxRows']):
            raise QueryError('Chunk count/completeness contract failed')
        expected_file = 'chunk-' + chunk['id'] + '.jsonl'
        if chunk.get('file') != expected_file:
            raise QueryError('Chunk file identity differs')
        path = output / expected_file
        if path.is_symlink() or path.resolve().parent != output:
            raise QueryError('Chunk path escapes its output directory')
        before = path.stat()
        hasher, actual = hashlib.sha256(), 0
        with path.open('rb') as stream:
            for line in stream:
                hasher.update(line)
                row = json_value(line, decimal=True)
                if not isinstance(row, dict) or not required.issubset(row):
                    raise QueryError('Projected row fields missing')
                fields = set(row)
                if (plan['columns'] and fields != set(plan['columns'])) or (schema is not None and fields != schema):
                    raise QueryError('Row schema drifted')
                schema = fields
                check_row(row, chunk, plan, checks)
                for name in sums:
                    if row[name] is None:
                        nulls[name] += 1
                    else:
                        totals[name] = add_decimal(totals[name], row[name])
                        nonnull[name] += 1
                actual += 1
        after = path.stat()
        if (actual != count or hasher.hexdigest() != chunk.get('sha256') or
                (before.st_ino, before.st_size, before.st_mtime_ns) !=
                (after.st_ino, after.st_size, after.st_mtime_ns)):
            raise QueryError('Chunk hash/row count changed; never refetch here')
        all_rows += actual
        verified.append({k: chunk[k] for k in ('id', 'start', 'end', 'prefix', 'file', 'sha256', 'rows')})
    if ledger_path.read_bytes() != ledger_bytes:
        raise QueryError('Ledger changed during acceptance')
    return {'schemaVersion': 1, 'status': 'passed', 'checkedAt': datetime.now(timezone.utc).isoformat(),
            'profile': plan['profile'], 'datasetId': plan['datasetId'], 'planFingerprint': fingerprint,
            'ledgerSha256': hashlib.sha256(ledger_bytes).hexdigest(),
            'scope': {k: plan.get(k) for k in ('start', 'end', 'dateField', 'prefixField', 'prefixes', 'filters')},
            'columns': plan['columns'] or sorted(schema or required),
            'coverage': 'complete_for_plan', 'rows': all_rows, 'chunks': verified,
            'sourceVersionEvidence': 'observed_consistent' if all(v is not None for v in versions) else 'missing',
            'snapshot': 'not_frozen', 'businessAccepted': False,
            'sums': {name: {'value': format(totals[name], 'f') if nonnull[name] else None,
                            'nullRows': nulls[name]} for name in sums},
            'limits': ['Account-visible planned scope only; no proof of historical universe.',
                       'Local ledger and hashes are evidence, not signed server attestations.',
                       'Explicit sums do not establish business additivity or original server precision.']}


def write_report(report, target):
    target = private_output(target)
    target.mkdir(parents=True, exist_ok=False)
    atomic_json(target / 'acceptance.json', report)
    numbers = '\n'.join(f"{name}：{value['value'] if value['value'] is not None else '无非空数值'}；空值行 {value['nullRows']}"
                        for name, value in report['sums'].items())
    text = (f"来源：{report['profile']} / {report['datasetId']}\n"
            f"范围：{report['scope']['start']} 至 {report['scope']['end']}；"
            f"前缀字段：{report['scope']['prefixField'] or '未指定'}；"
            f"前缀：{json.dumps(report['scope']['prefixes'], ensure_ascii=False)}；"
            f"基础筛选：{json.dumps(report['scope']['filters'], ensure_ascii=False)}\n"
            f"已核对 {len(report['chunks'])} 块、{report['rows']} 行，覆盖计划范围且互斥；重复行原样保留。\n"
            f"计划指纹：{report['planFingerprint']}\n账本哈希：{report['ledgerSha256']}\n"
            f"来源版本证据：{report['sourceVersionEvidence']}；不是冻结快照。\n{numbers}\n"
            "仅核验账号可见计划范围；历史全集、业务口径、可相加性与单位仍需确认。\n")
    (target / 'source-note.txt').write_text(text, encoding='utf-8')
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--sum', action='append', default=[], dest='sums')
    args = parser.parse_args()
    try:
        report = build_report(args.plan, args.sums)
        target = write_report(report, args.out)
        print(json.dumps({'status': 'passed', 'rows': report['rows'],
                          'report': str(target / 'acceptance.json')}, ensure_ascii=False))
        return 0
    except QueryError as error:
        # QueryError messages in this module are fixed diagnostics, never cells.
        print('Local acceptance failed: ' + str(error), file=sys.stderr)
        return 2
    except (ValueError, KeyError, TypeError, OSError, OverflowError):
        # No input rows, resource names or partial sums in failure output.
        print('Local acceptance failed; inspect plan and evidence privately. No BI request or retry was sent.', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
