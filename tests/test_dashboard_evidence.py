"""Synthetic regressions for failures observed during read-only dashboard validation."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).resolve().parents[1] / "scripts/dashboard_evidence.py"
spec = importlib.util.spec_from_file_location("dashboard_evidence", SCRIPT)
ev = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ev)


def page():
    metric = {"name": "客户标识", "alias": "新增客户", "fdId": "field-example",
              "aggrType": "CNT_DISTINCT", "fieldFormat": {"numberFormat": {"suffix": "人"}}}
    return {"pgId": "page-example", "name": "演示日报", "utime": "old",
            "meta": {"linkages": {"selector-example": ["card-example"]}}, "settings": {},
            "cards": [{"cdId": "card-example", "name": "客户", "cdType": "CHART",
                       "content": {"dsId": "dataset-example", "chartType": "KPI_CARD",
                                   "dsInfo": {"rowCount": 20, "utime": "old", "columns": []},
                                   "meta": {"chartMain": {"zoneData": {
                                       "metric": [metric], "row": [],
                                       "filters": [{"name": "日期", "filterType": "CUSTOM",
                                                    "advFilter": "YESTERDAY", "filterValue": []}]}}}}},
                      {"cdId": "selector-example", "name": "门店", "cdType": "SELECTOR",
                       "content": {"defaultValue": {"valueType": "FIXED_VALUE", "value": ["演示店"]}}},
                      {"cdId": "custom-example", "name": "演示应用", "cdType": "CUSTOM",
                       "content": {"script": "renderChart = () => 1"}}]}


class FakeCLI:
    """Network boundary only: use real JSON files and the real verifier."""
    profile = "demo"

    def __init__(self, rows=None, error=False, changed=False):
        self.rows = [{"渠道": "POS", "金额": 123.45}, {"渠道": "平台甲", "金额": 678.90}] if rows is None else rows
        self.error, self.changed, self.reads, self.commands = error, changed, 0, []

    def read_page(self, page_id):
        self.reads += 1
        p = page()
        if self.changed and self.reads > 1:
            p["cards"][0]["content"]["meta"]["chartMain"]["zoneData"]["metric"][0]["aggrType"] = "COUNT"
        return p

    def preview(self, card_id, page_id, output, filters, limit):
        self.commands.append((card_id, page_id, list(filters), limit))
        if self.error:
            raise ev.EvidenceError("query failed")
        output.write_text(json.dumps(self.rows), encoding="utf-8")
        return "已应用页面默认筛选: page=page-example; 筛选: 门店 EQ 演示店"


class SnapshotTests(unittest.TestCase):
    def test_alias_and_distinct_are_metric_definitions(self):
        snapshot = ev.make_snapshot(page(), "demo")
        card = snapshot["cards"][0]
        field = card["fields"][0]
        self.assertEqual(field["outputName"], "新增客户")
        self.assertEqual(field["aggregation"], "CNT_DISTINCT")
        self.assertEqual(field["aggregationSemantics"], "distinct-count")
        self.assertEqual(field["displayUnit"], "人")
        self.assertEqual(snapshot["businessConfirmation"], "draft")

    def test_macros_and_selector_values_are_preserved(self):
        s = ev.make_snapshot(page(), "demo")
        self.assertEqual(s["cards"][0]["filters"][0]["advFilter"], "YESTERDAY")
        self.assertEqual(s["cards"][1]["definition"]["content"]["defaultValue"]["value"], ["演示店"])

    def test_each_semantic_change_invalidates_fingerprint(self):
        base = ev.make_snapshot(page(), "demo")
        variants = []
        for key, value in [("aggrType", "SUM"), ("formula", "SUM([销售额])"), ("advCalc", {"advType": "RANK"})]:
            p = page(); p["cards"][0]["content"]["meta"]["chartMain"]["zoneData"]["metric"][0][key] = value
            variants.append(p)
        p = page(); p["cards"][0]["content"]["meta"]["chartMain"]["zoneData"]["filters"][0]["advFilter"] = "MONTH_TO_YESTERDAY"; variants.append(p)
        p = page(); p["cards"][0]["content"]["dsId"] = "other-dataset"; variants.append(p)
        p = page(); p["cards"][1]["content"]["defaultValue"]["value"] = ["另一演示店"]; variants.append(p)
        p = page(); p["meta"]["linkages"] = {}; variants.append(p)
        p = page(); p["cards"][2]["content"]["script"] = "renderChart = () => 2"; variants.append(p)
        for p in variants:
            with self.subTest(page=p):
                self.assertNotEqual(base["definitionFingerprint"], ev.make_snapshot(p, "demo")["definitionFingerprint"])

    def test_refresh_metadata_does_not_change_definition(self):
        p = page(); p["utime"] = "new"; p["cards"][0]["content"]["dsInfo"].update(rowCount=99, utime="new")
        self.assertEqual(ev.make_snapshot(page(), "demo")["definitionFingerprint"], ev.make_snapshot(p, "demo")["definitionFingerprint"])

    def test_unknown_aggregation_is_not_declared_additive(self):
        p = page(); p["cards"][0]["content"]["meta"]["chartMain"]["zoneData"]["metric"][0]["aggrType"] = "MYSTERY"
        self.assertEqual(ev.make_snapshot(p, "demo")["cards"][0]["fields"][0]["aggregationSemantics"], "unknown")


class SamplingAndVerificationTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.directory = Path(self.tmp.name) / "samples"
        self.snapshot = ev.make_snapshot(page(), "demo")

    def tearDown(self):
        self.tmp.cleanup()

    def sample(self, cli=None, **kwargs):
        result = ev.collect_samples(self.snapshot, ["card-example"], self.directory, cli or FakeCLI(), **kwargs)
        return result

    def case(self, sample, **kwargs):
        case = {"id": "pos", "cardId": "card-example", "scopeFingerprint": sample["cards"][0]["scopeFingerprint"],
                "where": {"渠道": "POS"}, "field": "金额", "expected": 123.45}
        case.update(kwargs)
        return case

    def verify(self, sample, cases):
        return ev.verify_cases(sample, cases, self.directory)

    def test_correct_cell_passes_and_other_channels_value_fails(self):
        sample = self.sample()
        self.assertTrue(self.verify(sample, [self.case(sample)])["passed"])
        self.assertFalse(self.verify(sample, [self.case(sample, expected=678.90)])["passed"])

    def test_raw_people_and_store_counts_and_explicit_rounding(self):
        sample = self.sample(FakeCLI([{"新增客户": 321, "门店数": 12, "店均": 26.75}]))
        cases = [self.case(sample, id="people", where={}, field="新增客户", expected=321),
                 self.case(sample, id="stores", where={}, field="门店数", expected=12),
                 self.case(sample, id="average", where={}, field="店均", expected=26.8, absoluteTolerance=0.05)]
        self.assertTrue(self.verify(sample, cases)["passed"])
        self.assertFalse(self.verify(sample, [dict(cases[2], absoluteTolerance=0)])["passed"])

    def test_scope_mismatch_is_rejected(self):
        sample = self.sample()
        self.assertFalse(self.verify(sample, [self.case(sample, scopeFingerprint="wrong-period-or-store")])["passed"])

    def test_query_records_resolved_defaults_filters_and_explicit_file(self):
        cli = FakeCLI(); sample = self.sample(cli, filters=["日期 EQ 2026-01-02"])
        self.assertEqual(cli.commands[0], ("card-example", "page-example", ["日期 EQ 2026-01-02"], 1000))
        card = sample["cards"][0]
        self.assertIn("演示店", card["scope"]["defaultFilterTrace"])
        self.assertTrue((self.directory / card["dataFile"]).is_file())

    def test_large_file_output_is_read_without_parsing_stdout(self):
        sample = self.sample(FakeCLI([{"序号": n, "金额": n} for n in range(1001)]), limit=2000)
        self.assertEqual(sample["cards"][0]["rowCount"], 1001)
        self.assertTrue(self.verify(sample, [self.case(sample, where={"序号": 1000}, expected=1000)])["passed"])

    def test_empty_failed_missing_and_truncated_samples_cannot_pass(self):
        for rows, error, limit in [([], False, 1000), ([{"x": 1}], True, 1000), ([{"x": 1}], False, 1)]:
            with self.subTest(rows=rows, error=error):
                d = Path(self.tmp.name) / f"sample-{error}-{limit}-{len(rows)}"
                s = ev.collect_samples(self.snapshot, ["card-example"], d, FakeCLI(rows, error), limit=limit)
                self.assertFalse(s["passed"])
                self.assertFalse(ev.verify_cases(s, [], d)["passed"])
        s = self.sample(); (self.directory / s["cards"][0]["dataFile"]).unlink()
        self.assertFalse(self.verify(s, [self.case(s)])["passed"])

    def test_ambiguous_row_and_wrong_field_are_rejected(self):
        s = self.sample()
        self.assertFalse(self.verify(s, [self.case(s, where={})])["passed"])
        self.assertFalse(self.verify(s, [self.case(s, field="订单数")])["passed"])

    def test_null_is_not_zero_and_bool_is_not_number(self):
        s = self.sample(FakeCLI([{"渠道": "POS", "金额": None, "标记": True}]))
        self.assertFalse(self.verify(s, [self.case(s, expected=0)])["passed"])
        self.assertFalse(self.verify(s, [self.case(s, field="标记", expected=1)])["passed"])

    def test_formatted_value_is_not_silently_stripped(self):
        s = self.sample(FakeCLI([{"渠道": "POS", "金额": "123.45万元"}]))
        self.assertFalse(self.verify(s, [self.case(s)])["passed"])

    def test_custom_card_is_not_counted_as_empty_success(self):
        cli = FakeCLI(); s = ev.collect_samples(self.snapshot, ["custom-example"], self.directory, cli)
        self.assertEqual(s["cards"][0]["status"], "unsupported")
        self.assertFalse(s["passed"])
        self.assertEqual(cli.commands, [])

    def test_definition_change_during_query_invalidates_samples(self):
        s = self.sample(FakeCLI(changed=True))
        self.assertFalse(s["passed"])
        self.assertFalse(self.verify(s, [self.case(s)])["passed"])

    def test_data_integrity_and_duplicate_case_ids_are_checked(self):
        s = self.sample(); c = self.case(s)
        self.assertFalse(self.verify(s, [c, c])["passed"])
        (self.directory / s["cards"][0]["dataFile"]).write_text('[{"渠道":"POS","金额":999}]', encoding="utf-8")
        self.assertFalse(self.verify(s, [c])["passed"])

    def test_missing_unasserted_sample_also_blocks_batch_verification(self):
        p = page(); extra = copy.deepcopy(p["cards"][0]); extra["cdId"] = "card-other"; p["cards"].append(extra)
        class TwoCardsCLI(FakeCLI):
            def read_page(self, page_id):
                return p
        snapshot = ev.make_snapshot(p, "demo")
        s = ev.collect_samples(snapshot, ["card-example", "card-other"], self.directory, TwoCardsCLI())
        (self.directory / s["cards"][1]["dataFile"]).unlink()
        self.assertFalse(self.verify(s, [self.case(s)])["passed"])

    def test_existing_evidence_directory_is_not_reused(self):
        self.sample()
        with self.assertRaises(ev.EvidenceError):
            self.sample()

    def test_stale_snapshot_stops_before_querying(self):
        cli = FakeCLI(); self.snapshot["definition"]["name"] = "another definition"
        with self.assertRaises(ev.EvidenceError):
            self.sample(cli)
        self.assertEqual(cli.commands, [])

    def test_custom_queryable_flag_cannot_override_real_card_type(self):
        self.snapshot["cards"][2]["queryable"] = True
        with self.assertRaises(ev.EvidenceError):
            ev.collect_samples(self.snapshot, ["custom-example"], self.directory, FakeCLI())

    def test_sample_scope_must_match_parent_page_and_card(self):
        s = self.sample()
        s["cards"][0]["scope"]["cardId"] = "another-card"
        s["cards"][0]["scopeFingerprint"] = ev.fingerprint(s["cards"][0]["scope"])
        self.assertFalse(self.verify(s, [self.case(s)])["passed"])

    def test_failed_envelope_and_invalid_numbers_are_rejected(self):
        for payload in [{"success": False, "rows": [{"金额": 1}]}, {"status": "partial", "rows": []}]:
            with self.assertRaises(ev.EvidenceError):
                ev.parse_rows(payload)
        for value in [float("nan"), float("inf"), "NaN"]:
            with self.assertRaises(ev.EvidenceError):
                ev.decimal_number(value)

    def test_empty_cases_never_pass(self):
        self.assertFalse(self.verify(self.sample(), [])["passed"])


class OfficialCLITests(unittest.TestCase):
    def test_page_get_unwraps_official_data_envelope(self):
        cli = ev.ReadOnlyCLI("demo")
        result = subprocess.CompletedProcess([], 0, json.dumps({"data": page()}), "")
        with patch("subprocess.run", return_value=result):
            self.assertEqual(cli.read_page("page-example")["pgId"], "page-example")

    def test_only_read_commands_are_allowed(self):
        cli = ev.ReadOnlyCLI("demo")
        with patch("subprocess.run") as run:
            for command in [["card", "delete", "x"], ["fetch", "/api/page/x"], ["page", "save", "x"]]:
                with self.assertRaises(ev.EvidenceError):
                    cli.run(command)
            run.assert_not_called()

    def test_preview_uses_raw_page_defaults_output_and_original_precision(self):
        cli = ev.ReadOnlyCLI("demo")
        with patch("subprocess.run", return_value=subprocess.CompletedProcess([], 0, "file output", "trace")) as run:
            cli.preview("card-example", "page-example", Path("sample.json"), ["日期 EQ 2026-01-02"], 1000)
        args = run.call_args.args[0]
        for flag, value in [("--profile", "demo"), ("--page-id", "page-example"), ("--value-format", "raw"),
                            ("--precision", "-1"), ("-o", "sample.json"), ("--limit", "1000")]:
            self.assertEqual(args[args.index(flag)+1], value)
        self.assertIn("--with-default-filters", args)


if __name__ == "__main__":
    unittest.main()
