"""Synthetic cap -> split -> complete example, without any official CLI invocation."""
import argparse
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / 'scripts'), str(ROOT / 'tests')]
from test_bounded_extract import Clock, FakeCLI
from bounded_extract import Extractor, load_plan

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--out', required=True)
args = parser.parse_args()
out = Path(args.out).resolve()
out.mkdir(parents=True, exist_ok=True)
plan = {'schemaVersion': 1, 'profile': 'synthetic', 'datasetId': 'dataset-example',
        'dateField': 'day', 'start': '2026-01-01', 'end': '2026-01-02',
        'columns': ['day', 'key', 'value'], 'maxRows': 3, 'out': str(out / 'rows'),
        'minFreeBytes': 0}
path = out / 'plan.json'; path.write_text(json.dumps(plan, indent=2) + '\n')
clock = Clock(); fake = FakeCLI(clock)
runner = Extractor(load_plan(path), fake, clock, clock.advance, out / 'synthetic-guards')
state = runner.run(3)
assert state['status'] == 'complete' and len(fake.calls) == 3
print(json.dumps({'status': state['status'], 'requests': len(fake.calls),
                  'rows': sum(x.get('rows', 0) for x in state['chunks']),
                  'syntheticOnly': True}, ensure_ascii=False))
