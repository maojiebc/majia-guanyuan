"""Synthetic cap/split/extract/acceptance workflow; no BI account or CLI calls."""
import argparse
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
from bounded_extract import Extractor, load_plan
from extraction_evidence import build_report, write_report
from readonly_query import validate_command


class SyntheticCLI:
    def __init__(self):
        self.now = 1700000000.0
        self.rows = [['2026-01-01', 'A', '0.1'], ['2026-01-01', 'A', '0.2'],
                     ['2026-01-02', 'B', '0.3'], ['2026-01-02', 'C', '0.4']]
        self.requests = 0

    def sleep(self, seconds):
        self.now += seconds

    def run(self, tool, args, timeout=120):
        validate_command(tool, args)
        self.requests += 1
        self.now += 1
        condition = next(args[i + 1] for i, value in enumerate(args) if value == '--filter')
        start, end = condition[len('day BT '):].split(',')
        rows = [row for row in self.rows if start <= row[0] <= end]
        limit = int(args[args.index('--limit') + 1])
        return json.dumps({'result': 'ok', 'response': {'dsId': 'synthetic-dataset',
                          'rowCount': len(rows), 'version': 'synthetic-v1', 'preview': rows[:limit],
                          'columns': [{'name': name} for name in ('day', 'key', 'amount')]}})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    root = Path(args.out).resolve()
    root.mkdir(parents=True, exist_ok=False)
    plan = {'schemaVersion': 1, 'profile': 'synthetic', 'datasetId': 'synthetic-dataset',
            'dateField': 'day', 'start': '2026-01-01', 'end': '2026-01-02',
            'columns': ['day', 'key', 'amount'], 'maxRows': 3,
            'out': str(root / 'rows'), 'minFreeBytes': 0}
    path = root / 'plan.json'; path.write_text(json.dumps(plan))
    cli = SyntheticCLI()
    runner = Extractor(load_plan(path), cli, lambda: cli.now, cli.sleep, root / 'guards')
    assert runner.run(3)['status'] == 'complete'
    report = build_report(path, ['amount'])
    write_report(report, root / 'acceptance')
    assert report['rows'] == 4 and report['sums']['amount']['value'] == '1.0'
    print(json.dumps({'syntheticOnly': True, 'requests': cli.requests, 'rows': report['rows'],
                      'status': report['status'], 'sum': report['sums']['amount']['value']}))


if __name__ == '__main__':
    main()
