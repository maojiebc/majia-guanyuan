"""Synthetic aggregate provenance example; never invokes the real official CLI."""
import argparse
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path[:0] = [str(ROOT / 'scripts'), str(ROOT / 'tests')]
from test_etl_preview_aggregate import Clock, FakeCLI
from etl_preview_aggregate import AggregateRunner

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--out', required=True)
args = parser.parse_args()
root = Path(args.out).resolve(); root.mkdir(parents=True, exist_ok=True)
allowlist = root / 'synthetic-allowlist.json'
allowlist.write_text(json.dumps({'schemaVersion': 1, 'hosts': [{'profile': 'synthetic', 'etlId': 'host-example'}]}))
sql = root / 'q.sql'; sql.write_text('SELECT COUNT(*) AS source_count FROM input1\n')
clock = Clock(); cli = FakeCLI(clock)
runner = AggregateRunner('synthetic', 'host-example', allowlist, cli, clock, clock.advance, root / 'synthetic-guards')
result = runner.run(['dataset-example'], sql, root / 'result', calibrate=True)
assert result['status'] == 'success' and result['calibration']['passed']
print(json.dumps({'status': result['status'], 'provenance': str(root / 'result/provenance.json'), 'syntheticOnly': True}))
