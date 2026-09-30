#!/usr/bin/env python3
"""Synthetic end-to-end demonstration; never connects to a BI instance."""
import argparse
import copy
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("dashboard_evidence", ROOT / "scripts/dashboard_evidence.py")
ev = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ev)
FIXTURES = Path(__file__).resolve().parent


class SyntheticCLI:
    profile = "synthetic-offline"

    def read_page(self, page_id):
        return ev.read_json(FIXTURES / "page.synthetic.json")

    def preview(self, card_id, page_id, output, filters, limit):
        ev.write_json(output, ev.read_json(FIXTURES / "rows.synthetic.json"))
        return "已应用页面默认筛选: page=page-demo; 筛选: 门店名称 EQ 演示一店 [合成数据]"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    output = Path(args.out)
    snapshot = ev.make_snapshot(ev.read_json(FIXTURES / "page.synthetic.json"), "synthetic-offline")
    ev.write_json(output / "page.json", snapshot)
    samples = ev.collect_samples(snapshot, ["card-demo"], output / "samples", SyntheticCLI())
    correct = {"id": "pos", "cardId": "card-demo", "scopeFingerprint": samples["cards"][0]["scopeFingerprint"],
               "where": {"订单日期": "2026-09-01", "门店名称": "演示一店", "渠道名称": "POS"},
               "field": "营业额", "expected": 123.45}
    ev.write_json(output / "cases.json", [correct])
    positive = ev.verify_cases(samples, [correct], output / "samples")
    negative = []
    for mutation in [{"expected": 678.90}, {"scopeFingerprint": "another-period"},
                     {"where": {"门店名称": "另一演示店"}}, {"field": "missing-field"}]:
        case = copy.deepcopy(correct); case.update(mutation)
        negative.append(ev.verify_cases(samples, [case], output / "samples"))
    result = {"dataSource": "synthetic-offline-only", "positive": positive,
              "negativeControls": negative, "passed": positive["passed"] and all(not item["passed"] for item in negative)}
    ev.write_json(output / "demo-results.json", result)
    print(f"Synthetic demo: {'passed' if result['passed'] else 'failed'}; {output / 'demo-results.json'}")
    return 0 if result["passed"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
