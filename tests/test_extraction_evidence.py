"""Independent local acceptance of synthetic chunked extracts; no BI requests."""
import hashlib
import importlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from readonly_query import digest, QueryError
from bounded_extract import load_plan, scope


class EvidenceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.out = self.root / 'rows'
        self.out.mkdir()
        self.plan_path = self.root / 'plan.json'
        self.plan = {'schemaVersion': 1, 'profile': 'synthetic', 'datasetId': 'example',
                     'columns': ['day', 'key', 'amount'], 'dateField': 'day',
                     'start': '2026-01-01', 'end': '2026-01-02',
                     'out': str(self.out), 'maxRows': 100, 'minFreeBytes': 0}
        self.rows = [{'day': '2026-01-01', 'key': 'A', 'amount': '0.1'},
                     {'day': '2026-01-02', 'key': 'A', 'amount': '0.2'}]
        self.prepare([('2026-01-01', '2026-01-01', None, self.rows[:1]),
                      ('2026-01-02', '2026-01-02', None, self.rows[1:])])

    def prepare(self, blocks):
        self.plan_path.write_text(json.dumps(self.plan))
        plan = load_plan(self.plan_path)
        chunks = []
        for start, end, prefix, rows in blocks:
            chunk = scope(start, end, prefix)
            file = 'chunk-' + chunk['id'] + '.jsonl'
            data = ''.join(json.dumps(row) + '\n' for row in rows).encode()
            (self.out / file).write_bytes(data)
            chunk.update(status='complete', file=file, sha256=hashlib.sha256(data).hexdigest(),
                         rows=len(rows), returned=len(rows), rowCount=len(rows),
                         sourceVersion='synthetic-v1')
            chunks.append(chunk)
        self.state = {'schemaVersion': 1, 'plan': plan, 'planFingerprint': digest(plan),
                      'status': 'complete', 'sourceVersion': 'synthetic-v1', 'chunks': chunks}
        self.save()

    def save(self):
        (self.out / 'ledger.json').write_text(json.dumps(self.state))

    def report(self, sums=()):
        self.assertTrue((ROOT / 'scripts/extraction_evidence.py').exists(),
                        'Independent extraction acceptance is not implemented')
        module = importlib.import_module('extraction_evidence')
        return module.build_report(self.plan_path, sums)

    def rejected(self):
        with self.assertRaises(QueryError):
            self.report()

    def test_complete_adjacent_blocks_and_decimal_sum_preserve_duplicate_key(self):
        report = self.report(['amount'])
        self.assertEqual(report['status'], 'passed')
        self.assertEqual(report['rows'], 2)
        self.assertEqual(report['sums']['amount'], {'value': '0.3', 'nullRows': 0})
        self.assertEqual(report['snapshot'], 'not_frozen')
        self.assertFalse(report['businessAccepted'])

    def test_deleted_leaf_cannot_prove_complete_coverage(self):
        self.state['chunks'].pop(); self.save(); self.rejected()

    def test_overlapping_leaves_are_rejected_even_if_totals_match(self):
        self.prepare([('2026-01-01', '2026-01-02', None, self.rows),
                      ('2026-01-02', '2026-01-02', None, self.rows[1:])])
        self.rejected()

    def test_actual_row_outside_its_chunk_is_rejected_even_with_valid_hash(self):
        self.prepare([('2026-01-01', '2026-01-01', None, self.rows[1:]),
                      ('2026-01-02', '2026-01-02', None, self.rows[1:])])
        self.rejected()

    def test_unknown_request_cannot_be_reported_as_complete(self):
        self.state['chunks'][0]['status'] = 'unknown'; self.save(); self.rejected()

    def test_hash_damage_is_rejected_without_refetch(self):
        (self.out / self.state['chunks'][0]['file']).write_text('{}\n')
        self.rejected()

    def test_wrong_row_count_is_rejected(self):
        self.state['chunks'][0]['rowCount'] = 2; self.save(); self.rejected()

    def test_non_integer_counts_are_rejected(self):
        for value in (1.0, True, '1'):
            self.state['chunks'][0]['rowCount'] = value
            self.save()
            self.rejected()

    def test_decimal_sum_does_not_round_large_integer(self):
        rows = [dict(self.rows[0], amount='123456789012345678901234567890.01'),
                dict(self.rows[1], amount='0.02')]
        self.prepare([('2026-01-01', '2026-01-02', None, rows)])
        self.assertEqual(self.report(['amount'])['sums']['amount']['value'],
                         '123456789012345678901234567890.03')

    def test_source_version_drift_is_rejected(self):
        self.state['chunks'][1]['sourceVersion'] = 'synthetic-v2'; self.save(); self.rejected()

    def test_missing_source_version_does_not_claim_frozen_snapshot(self):
        self.state.pop('sourceVersion')
        for chunk in self.state['chunks']:
            chunk['sourceVersion'] = None
        self.save()
        self.assertEqual(self.report()['sourceVersionEvidence'], 'missing')

    def test_missing_partition_column_cannot_verify_scope(self):
        self.plan['columns'] = ['key', 'amount']
        rows = [{k: v for k, v in row.items() if k != 'day'} for row in self.rows]
        self.prepare([('2026-01-01', '2026-01-02', None, rows)])
        self.rejected()

    def test_prefix_coverage_is_separate_and_rows_must_match(self):
        self.plan.update(prefixField='key', prefixes=['A', 'B'])
        self.prepare([('2026-01-01', '2026-01-02', 'A', self.rows),
                      ('2026-01-01', '2026-01-02', 'B', [])])
        self.assertEqual(self.report()['rows'], 2)
        self.prepare([('2026-01-01', '2026-01-02', 'A', self.rows),
                      ('2026-01-01', '2026-01-02', 'B', self.rows)])
        self.rejected()

    def test_base_filter_mismatch_is_rejected(self):
        self.plan['filters'] = ['key EQ B']
        self.prepare([('2026-01-01', '2026-01-02', None, self.rows)])
        self.rejected()

    def test_unsupported_filter_cannot_be_silently_ignored(self):
        self.plan['filters'] = ['key REGEX A.*']
        self.prepare([('2026-01-01', '2026-01-02', None, self.rows)])
        self.rejected()

    def test_empty_results_do_not_create_a_zero_sum(self):
        self.prepare([('2026-01-01', '2026-01-02', None, [])])
        report = self.report(['amount'])
        self.assertEqual(report['rows'], 0)
        self.assertEqual(report['sums']['amount']['value'], None)

    def test_null_amount_is_counted_and_not_coerced_to_zero(self):
        rows = [dict(self.rows[0], amount=None), self.rows[1]]
        self.prepare([('2026-01-01', '2026-01-02', None, rows)])
        self.assertEqual(self.report(['amount'])['sums']['amount'],
                         {'value': '0.2', 'nullRows': 1})

    def test_non_numeric_sum_does_not_silently_drop_rows(self):
        rows = [dict(self.rows[0], amount='unknown'), self.rows[1]]
        self.prepare([('2026-01-01', '2026-01-02', None, rows)])
        with self.assertRaises(QueryError):
            self.report(['amount'])

    def test_plan_fingerprint_mismatch_is_rejected(self):
        self.state['plan']['datasetId'] = 'other'; self.save(); self.rejected()

    def test_split_parent_does_not_inflate_totals(self):
        parent = scope('2026-01-01', '2026-01-02', None)
        parent.update(status='split', rowCount=2, returned=2)
        self.state['chunks'].insert(0, parent); self.save()
        self.assertEqual(self.report()['rows'], 2)

    def test_path_escape_is_rejected(self):
        self.state['chunks'][0]['file'] = '../outside.jsonl'; self.save(); self.rejected()

    def test_cli_writes_private_report_without_mutating_ledger(self):
        script = ROOT / 'scripts/extraction_evidence.py'
        self.assertTrue(script.exists(), 'Independent extraction acceptance is not implemented')
        before = (self.out / 'ledger.json').read_bytes()
        target = self.root / 'acceptance'
        result = subprocess.run([sys.executable, str(script), '--plan', str(self.plan_path),
                                 '--out', str(target), '--sum', 'amount'], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        report = json.loads((target / 'acceptance.json').read_text())
        self.assertEqual(report['rows'], 2)
        self.assertIn('0.3', (target / 'source-note.txt').read_text())
        self.assertEqual((self.out / 'ledger.json').read_bytes(), before)
        again = subprocess.run([sys.executable, str(script), '--plan', str(self.plan_path),
                                '--out', str(target)], capture_output=True, text=True)
        self.assertNotEqual(again.returncode, 0)


if __name__ == '__main__':
    unittest.main()
