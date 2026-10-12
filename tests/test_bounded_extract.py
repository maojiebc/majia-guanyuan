"""Synthetic queue regressions; no real BI profile or data."""
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import bounded_extract as be
from readonly_query import QueryError, private_output, validate_command


class Clock:
    def __init__(self):
        # Whole seconds round-trip exactly through ISO microseconds. A live
        # fractional timestamp can round upward and look future-dated.
        self.now = float(int(time.time()))

    def __call__(self):
        return self.now

    def advance(self, seconds):
        self.now += seconds


class FakeCLI:
    def __init__(self, clock, duration=1, error=None, mismatch=False):
        self.calls = []
        self.clock, self.duration, self.error, self.mismatch = clock, duration, error, mismatch
        # Same candidate key intentionally appears twice; neither row may be dropped.
        self.rows = [['2026-01-01', 'same', 1], ['2026-01-01', 'same', 2],
                     ['2026-01-02', 'other', 3], ['2026-01-02', 'last', 4]]

    def run(self, tool, args, timeout=120):
        validate_command(tool, args)
        self.calls.append((list(args), self.clock()))
        self.clock.advance(self.duration)
        if self.error:
            raise self.error
        limit = int(args[args.index('--limit') + 1])
        condition = next(args[i + 1] for i, x in enumerate(args) if x == '--filter' and args[i + 1].startswith('day BT '))
        start, end = condition[len('day BT '):].split(',')
        rows = [r for r in self.rows if start <= r[0] <= end]
        output = rows[:limit]
        if self.mismatch and start != end:
            output = output[:1]
        return json.dumps({'result': 'ok', 'response': {'dsId': 'dataset-example',
                          'columns': [{'name': x} for x in ('day', 'key', 'value')],
                          'preview': output, 'rowCount': len(rows), 'version': 'synthetic-v1'}})


class ExtractionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.clock = Clock()

    def tearDown(self):
        self.temp.cleanup()

    def plan(self, **changes):
        value = {'schemaVersion': 1, 'profile': 'synthetic', 'datasetId': 'dataset-example',
                 'dateField': 'day', 'start': '2026-01-01', 'end': '2026-01-02',
                 'columns': ['day', 'key', 'value'], 'maxRows': 3,
                 'out': str(self.root / 'output'), 'minFreeBytes': 0}
        value.update(changes)
        p = self.root / 'plan.json'; p.write_text(json.dumps(value))
        return be.load_plan(p)

    def runner(self, plan=None, **kwargs):
        self.cli = FakeCLI(self.clock, **kwargs)
        return be.Extractor(plan or self.plan(), self.cli, self.clock, self.clock.advance,
                            self.root / 'guards')

    def test_cap_splits_without_persisting_partial_data(self):
        runner = self.runner()
        state = runner.run(3)
        self.assertEqual(state['status'], 'complete')
        self.assertEqual([x['status'] for x in state['chunks']], ['split', 'complete', 'complete'])
        self.assertEqual(len(list(runner.out.glob('*.jsonl'))), 2)
        self.assertEqual(sum(x.get('rows', 0) for x in state['chunks']), 4)
        self.assertGreaterEqual(self.cli.calls[1][1] - self.cli.calls[0][1], 5)

    def test_count_mismatch_is_discarded_and_split(self):
        runner = self.runner(self.plan(maxRows=10), mismatch=True)
        state = runner.run(3)
        self.assertEqual(state['status'], 'complete')
        self.assertEqual(state['chunks'][0]['returned'], 1)
        self.assertNotIn('file', state['chunks'][0])

    def test_single_day_at_cap_stops(self):
        runner = self.runner(self.plan(end='2026-01-01', maxRows=2))
        state = runner.run(5)
        self.assertEqual(state['status'], 'blocked')
        self.assertEqual(len(self.cli.calls), 1)

    def test_resume_never_refetches_completed_scope(self):
        runner = self.runner()
        self.assertEqual(runner.run(2)['status'], 'paused-budget')
        self.assertEqual(runner.run(10, resume=True)['status'], 'complete')
        calls = len(self.cli.calls)
        runner.run(10, resume=True)
        self.assertEqual(len(self.cli.calls), calls)

    def test_timeout_is_unknown_and_blocks_another_output_same_profile(self):
        runner = self.runner(error=subprocess.TimeoutExpired('fake', 120))
        self.assertEqual(runner.run(5)['status'], 'unknown')
        with self.assertRaises(QueryError):
            runner.run(5, resume=True)
        other = self.runner(self.plan(out=str(self.root / 'other')))
        with self.assertRaises(QueryError):
            other.run(5)
        self.assertEqual(len(other.cli.calls), 0)

    def test_slow_complete_needs_explicit_resume_and_cooldown(self):
        runner = self.runner(self.plan(maxRows=10), duration=61)
        self.assertEqual(runner.run(5)['status'], 'paused-slow')
        with self.assertRaises(QueryError):
            runner.run(1, resume=True)
        self.clock.advance(60)
        with self.assertRaises(QueryError):
            runner.run(1)
        self.assertEqual(runner.run(1, resume=True)['status'], 'complete')
        self.assertEqual(len(self.cli.calls), 1)

    def test_hash_mismatch_fails_without_refetch(self):
        runner = self.runner(self.plan(maxRows=10)); runner.run(1)
        next(runner.out.glob('*.jsonl')).write_text('{}\n')
        with self.assertRaises(QueryError):
            runner.run(1, resume=True)
        self.assertEqual(len(self.cli.calls), 1)

    def test_changed_plan_rejected(self):
        runner = self.runner(); runner.run(1)
        changed = self.runner(self.plan(maxRows=4))
        with self.assertRaises(QueryError):
            changed.run(1)

    def test_source_version_drift_stops_before_accepting_child(self):
        runner = self.runner()
        original = runner.cli.run
        def changed(tool, args, timeout=120):
            raw = json.loads(original(tool, args, timeout))
            if len(runner.cli.calls) == 2:
                raw['response']['version'] = 'synthetic-v2'
            return json.dumps(raw)
        runner.cli.run = changed
        state = runner.run(3)
        self.assertEqual(state['status'], 'failed')
        self.assertEqual(len(runner.cli.calls), 2)
        self.assertEqual(list(runner.out.glob('*.jsonl')), [])

    def test_empty_result_has_empty_file_not_synthetic_zero(self):
        runner = self.runner(self.plan(start='2026-02-01', end='2026-02-01'))
        state = runner.run(1)
        self.assertEqual(state['chunks'][0]['rows'], 0)
        self.assertEqual(next(runner.out.glob('*.jsonl')).read_bytes(), b'')

    def test_overlapping_prefixes_rejected(self):
        with self.assertRaises(QueryError):
            self.plan(prefixField='key', prefixes=['A', 'AB'])

    def test_missing_count_not_accepted_as_full(self):
        raw = {'response': {'dsId': 'dataset-example', 'columns': [], 'preview': []}}
        with self.assertRaises(QueryError):
            be.decode_preview(raw, 'dataset-example', [], 60000)

    def test_raw_ignores_cli_display_projection_so_project_locally(self):
        raw = {'response': {'dsId': 'dataset-example', 'rowCount': 1,
                           'columns': [{'name': 'day'}, {'name': 'extra'}],
                           'preview': [['2026-01-01', 'synthetic-extra']]}}
        rows, count, version = be.decode_preview(raw, 'dataset-example', ['day'], 20)
        self.assertEqual(rows, [{'day': '2026-01-01'}])

    def test_repository_output_rejected(self):
        with self.assertRaises(QueryError):
            private_output(Path(__file__).resolve().parents[1] / 'examples/private-output')

    def test_write_or_unknown_option_rejected(self):
        for tool, args in [('guancli', ['ds', 'refresh', 'dataset-example']),
                           ('guanetl', ['save', '--dir', '/tmp/demo']),
                           ('guanetl', ['run', 'example']),
                           ('guancli', ['ds', 'preview', 'example', '--raw', '--execute', 'save'])]:
            with self.assertRaises(QueryError):
                validate_command(tool, args)

    def test_unknown_resolution_requires_proof_then_splits_not_retries(self):
        runner = self.runner(error=subprocess.TimeoutExpired('fake', 120))
        state = runner.run(1)
        self.clock.advance(1)
        proof = {'profile': 'synthetic', 'planFingerprint': state['planFingerprint'],
                 'chunkId': state['chunks'][0]['id'], 'serverCompleted': True,
                 'observedAt': datetime.fromtimestamp(self.clock(), timezone.utc).isoformat(),
                 'reviewedBy': 'Synthetic test', 'evidence': 'Synthetic terminal task evidence'}
        path = self.root / 'proof.json'; path.write_text(json.dumps(proof))
        state = runner.resolve_unknown(path)
        self.assertEqual([x['status'] for x in state['chunks']], ['abandoned', 'pending', 'pending'])
        runner.cli.error = None
        self.assertEqual(runner.run(2, resume=True)['status'], 'complete')
        self.assertEqual(len(runner.cli.calls), 3)


if __name__ == '__main__':
    unittest.main()
