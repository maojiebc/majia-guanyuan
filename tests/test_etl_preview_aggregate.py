"""Closed-command and terminal-result regressions using entirely synthetic input."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import etl_preview_aggregate as ag
from readonly_query import QueryError, validate_command
from test_bounded_extract import Clock


def table(rows='6', backend=1, clipped=1, node='id_92001', host='host-example', column='source_count'):
    return '%s\n%s\n\n---\netlId: %s  nodeId: %s  后端预览样本行数: %d  耗时: 1.0s  --limit 截取后行数: %d\n[%d rows x 1 columns]\n' % (
        column, rows, host, node, backend, clipped, clipped)


class FakeCLI:
    def __init__(self, clock, calibration_count=6, truncate=False, timeout=False):
        self.calls = []
        self.clock = clock
        self.count, self.truncate, self.timeout = calibration_count, truncate, timeout

    def run(self, tool, args, timeout=120):
        validate_command(tool, args)
        self.calls.append((tool, list(args)))
        self.clock.advance(1)
        if args[:2] == ['ds', 'get']:
            return json.dumps({'dsId': 'dataset-example', 'columns': [{'name': 'value', 'fdType': 'DOUBLE'}],
                               'version': 'synthetic-v1', 'utime': '2026-01-01T00:00:00Z'})
        if args[:2] == ['ds', 'preview']:
            return json.dumps({'response': {'dsId': 'dataset-example', 'rowCount': self.count}})
        workspace = Path(args[args.index('--dir') + 1])
        if args[0] == 'edit':
            (workspace / '_guanetl_state.json').write_text(json.dumps({'etlId': 'host-example'}))
            (workspace / '_base_etl.json').write_text('{"uId":"synthetic-person","userInfo":{}}')
            return 'imported'
        if args[0] == 'export':
            (workspace / '_exported.json').write_text(json.dumps({'meta': [
                {'type': 'INPUT_DATASET', 'inputDsId': 'dataset-example'}, {'type': 'SQL_SCRIPT'}]}))
            return 'exported'
        if self.timeout:
            raise subprocess.TimeoutExpired('synthetic', 120)
        if self.truncate:
            return table(rows='\n'.join(['6'] * 20), backend=20, clipped=20)
        return table()


class AggregateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.root = Path(self.temp.name)
        self.clock = Clock()
        self.allowlist = self.root / 'allowlist.json'
        self.allowlist.write_text(json.dumps({'schemaVersion': 1, 'hosts': [
            {'profile': 'synthetic', 'etlId': 'host-example'}]}))
        self.sql = self.root / 'q.sql'; self.sql.write_text('SELECT COUNT(*) AS source_count FROM input1')

    def tearDown(self):
        self.temp.cleanup()

    def runner(self, **changes):
        self.cli = FakeCLI(self.clock, **changes)
        return ag.AggregateRunner('synthetic', 'host-example', self.allowlist, self.cli,
                                  self.clock, self.clock.advance, self.root / 'guards')

    def test_normal_result_provenance_and_cleanup(self):
        runner = self.runner()
        result = runner.run(['dataset-example'], self.sql, self.root / 'out', calibrate=True)
        self.assertEqual(result['status'], 'success')
        self.assertTrue(result['calibration']['passed'])
        self.assertEqual(result['returnedRows'], 1)
        self.assertEqual(len(result['sqlSha256']), 64)
        self.assertFalse(list((self.root / 'out').glob('preview-workspace-*')))
        self.assertEqual(json.loads((self.root / 'out/result.json').read_text())['rows'], [['6']])

    def test_calibration_mismatch_does_not_write_success_result(self):
        runner = self.runner(calibration_count=7)
        result = runner.run(['dataset-example'], self.sql, self.root / 'out', calibrate=True)
        self.assertEqual(result['status'], 'failed')
        self.assertFalse(result['calibration']['passed'])
        self.assertFalse((self.root / 'out/result.json').exists())

    def test_cap_and_renderer_truncation_rejected(self):
        result = self.runner(truncate=True).run(['dataset-example'], self.sql, self.root / 'out')
        self.assertEqual(result['status'], 'failed')
        self.assertTrue(result['possiblyTruncated'])
        with self.assertRaises(QueryError):
            ag.parse_table(table(backend=19, clipped=2), 'host-example', 'id_92001', 20)

    def test_workspace_keep_removes_identity_but_keeps_own_source(self):
        result = self.runner().run(['dataset-example'], self.sql, self.root / 'out', keep=True)
        self.assertEqual(result['status'], 'success')
        workspace = next((self.root / 'out').glob('preview-workspace-*'))
        files = sorted(str(x.relative_to(workspace)) for x in workspace.rglob('*') if x.is_file())
        self.assertEqual(files, ['etl/aggregate.sql', 'etl/etl.go'])
        self.assertFalse(any('userInfo' in x.read_text() for x in workspace.rglob('*') if x.is_file()))

    def test_repository_output_rejected_before_cli(self):
        runner = self.runner()
        with self.assertRaises(QueryError):
            runner.run(['dataset-example'], self.sql, Path(__file__).resolve().parents[1] / 'public-data')
        self.assertEqual(self.cli.calls, [])

    def test_wrong_sandbox_rejected(self):
        with self.assertRaises(QueryError):
            ag.AggregateRunner('synthetic', 'unapproved-host', self.allowlist)

    def test_sql_and_command_writes_rejected(self):
        for sql in ('DELETE FROM input1', 'SELECT 1; DROP TABLE x',
                    'WITH q AS (DELETE FROM input1) SELECT * FROM q'):
            with self.assertRaises(QueryError):
                ag.validate_sql(sql)
        for verb in ('create', 'save', 'run', 'schedule', 'move', 'mkdir', 'rmdir'):
            with self.assertRaises(QueryError):
                validate_command('guanetl', [verb, '--dir', '/tmp/synthetic'])

    def test_timeout_leaves_profile_hold_and_no_retry(self):
        runner = self.runner(timeout=True)
        self.assertEqual(runner.run(['dataset-example'], self.sql, self.root / 'out')['status'], 'failed')
        before = len(self.cli.calls)
        self.assertEqual(runner.run(['dataset-example'], self.sql, self.root / 'again')['status'], 'failed')
        self.assertEqual(len(self.cli.calls), before)

    def test_seed_host_is_checked_without_editing_production(self):
        seed = self.root / 'seed'; seed.mkdir()
        for name in ('_guanetl_state.json', '_base_etl.json', '_input.json'):
            (seed / name).write_text(json.dumps({'etlId': 'host-example'}))
        value = json.loads(self.allowlist.read_text()); value['hosts'][0]['seedWorkspace'] = str(seed)
        self.allowlist.write_text(json.dumps(value))
        result = self.runner().run(['dataset-example'], self.sql, self.root / 'out')
        self.assertEqual(result['status'], 'success')
        self.assertFalse(any(args[0] == 'edit' for tool, args in self.cli.calls))

    def test_ambiguous_text_or_wrong_host_rejected(self):
        for value in (table(rows='含宽字符'), table(host='other'), table(column='bad alias'), table(rows='')):
            with self.assertRaises(QueryError):
                ag.parse_table(value, 'host-example', 'id_92001', 20)

    def test_sql_filters_are_escaped_in_control(self):
        query = ag.calibration_sql(["field EQ O'Neil", 'day BT 2026-01-01,2026-01-02'])
        self.assertIn("O\\'Neil", query)
        self.assertIn('BETWEEN', query)
        with self.assertRaises(QueryError):
            ag.calibration_sql(['field NOT_ALLOWED 1'])


if __name__ == '__main__':
    unittest.main()
