#!/usr/bin/env python3
"""Local dashboard definitions, scoped samples and cell-bound assertions.

Inspired by JeremyWXL/guanbi-agent-builder (MIT); implementation rewritten for
the official CLI gain layer. See ATTRIBUTIONS.md and references/third-party/.
No HTTP client, BI writes, SQL execution or automatic business confirmation.
"""
import argparse
import copy
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from zoneinfo import ZoneInfo


SCHEMA_VERSION = 1


class EvidenceError(ValueError):
    pass


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def fingerprint(value):
    content = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")


def stable_content(value):
    """Retain definitions; exclude embedded dataset execution/size/version metadata."""
    if isinstance(value, list):
        return [stable_content(item) for item in value]
    if not isinstance(value, dict):
        return value
    result = {}
    for key, item in value.items():
        if key == "dsInfo" and isinstance(item, dict):
            result[key] = {k: stable_content(item[k]) for k in ("dsId", "aliasMap", "columns") if k in item}
        else:
            result[key] = stable_content(item)
    return result


def card_definition(card):
    return {key: stable_content(card[key]) for key in
            ("cdId", "cdType", "name", "parentId", "content", "settings") if key in card}


def page_definition(page):
    if not isinstance(page, dict) or not page.get("pgId") or not isinstance(page.get("cards"), list):
        raise EvidenceError("Expected a raw page definition with pgId and cards")
    ids = [card.get("cdId") for card in page["cards"]]
    if any(not item for item in ids) or len(set(ids)) != len(ids):
        raise EvidenceError("Missing or duplicate card IDs")
    result = {key: copy.deepcopy(page[key]) for key in
              ("pgId", "pgType", "name", "description", "parentDirId", "meta", "settings") if key in page}
    result["cards"] = sorted([card_definition(card) for card in page["cards"]], key=lambda card: card["cdId"])
    return result


def zone_fields(value, path="content"):
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "zoneData" and isinstance(item, dict):
                for zone, fields in item.items():
                    if isinstance(fields, list):
                        for field in fields:
                            if isinstance(field, dict) and (field.get("name") or field.get("fdId")):
                                yield path + ".zoneData." + zone, zone, field
            else:
                yield from zone_fields(item, path + "." + key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from zone_fields(item, path + f"[{index}]")


def aggregation_semantics(aggregation, formula):
    if formula:
        return "formula-review"
    name = str(aggregation or "").upper()
    if name in {"CNT_DISTINCT", "COUNT_DISTINCT", "COUNTDISTINCT", "DISTINCT_COUNT", "DCOUNT"}:
        return "distinct-count"
    if name == "SUM":
        return "sum-requires-grain-review"
    if name in {"COUNT", "CNT"}:
        return "count-requires-grain-review"
    if name in {"AVG", "AVERAGE", "MIN", "MAX"}:
        return name.lower()
    return "unknown"


def make_snapshot(page, profile, record_timezone="Asia/Singapore"):
    if not profile:
        raise EvidenceError("An explicit official CLI profile is required")
    ZoneInfo(record_timezone)
    definition = page_definition(page)
    cards = []
    for card in page["cards"]:
        content = card.get("content") or {}
        declared = {field.get("fdId"): field for field in content.get("dsInfo", {}).get("columns", [])}
        fields, filters = [], []
        for path, zone, field in zone_fields(content):
            formula = field.get("formula") or declared.get(field.get("fdId"), {}).get("formula")
            number_format = field.get("fieldFormat", {}).get("numberFormat", {})
            fields.append({"path": path, "zone": zone, "fieldId": field.get("fdId"),
                           "sourceName": field.get("name"), "outputName": field.get("alias") or field.get("name"),
                           "aggregation": field.get("aggrType"), "formula": formula,
                           "advancedCalculation": copy.deepcopy(field.get("advCalc")),
                           "aggregationSemantics": aggregation_semantics(field.get("aggrType"), formula),
                           "displayUnit": number_format.get("suffix") or number_format.get("prefix") or None,
                           "definition": copy.deepcopy(field)})
            if zone == "filters":
                filters.append(copy.deepcopy(field))
        cd_def = card_definition(card)
        dataset = content.get("dsId") or content.get("dsInfo", {}).get("dsId")
        queryable = card.get("cdType") == "CHART" and bool(dataset)
        cards.append({"cardId": card["cdId"], "name": card.get("name"), "cardType": card.get("cdType"),
                      "chartType": content.get("chartType"), "datasetId": dataset,
                      "queryable": queryable, "reviewStatus": "definition-only" if queryable else "manual-review",
                      "fields": fields, "filters": filters, "definition": cd_def,
                      "definitionFingerprint": fingerprint(cd_def)})
    return {"schemaVersion": SCHEMA_VERSION, "artifactType": "dashboard-definition",
            "capturedAt": timestamp(), "sourceUpdatedAt": page.get("utime"), "recordTimezone": record_timezone, "profile": profile,
            "pageId": page["pgId"], "businessConfirmation": "draft", "cards": cards,
            "definition": definition, "definitionFingerprint": fingerprint(definition)}


def validate_snapshot(snapshot):
    if snapshot.get("schemaVersion") != SCHEMA_VERSION or snapshot.get("artifactType") != "dashboard-definition":
        raise EvidenceError("Unsupported dashboard definition schema")
    if fingerprint(snapshot["definition"]) != snapshot.get("definitionFingerprint"):
        raise EvidenceError("Definition fingerprint mismatch; capture a fresh snapshot")
    if snapshot.get("pageId") != snapshot["definition"].get("pgId") or not snapshot.get("profile"):
        raise EvidenceError("Snapshot source page/profile mismatch")
    expected = {card["cdId"]: card for card in snapshot["definition"]["cards"]}
    if len(expected) != len(snapshot["cards"]):
        raise EvidenceError("Snapshot card inventory mismatch")
    for card in snapshot["cards"]:
        if card.get("definition") != expected.get(card["cardId"]) or fingerprint(card["definition"]) != card.get("definitionFingerprint"):
            raise EvidenceError("Card definition fingerprint mismatch")
        source = card["definition"]
        content = source.get("content") or {}
        dataset = content.get("dsId") or content.get("dsInfo", {}).get("dsId")
        if card.get("queryable") != (source.get("cdType") == "CHART" and bool(dataset)):
            raise EvidenceError("Queryable flag differs from the actual card definition")


class ReadOnlyCLI:
    def __init__(self, profile, audit_path=None):
        if not profile:
            raise EvidenceError("An explicit official CLI profile is required")
        self.profile, self.audit_path = profile, Path(audit_path) if audit_path else None

    def run(self, args):
        if tuple(args[:2]) not in {("page", "get"), ("card", "preview")}:
            raise EvidenceError("Only page get and card preview are permitted")
        command = ["guancli", "--profile", self.profile, *map(str, args)]
        started_at = timestamp()
        try:
            result = subprocess.run(command, capture_output=True, text=True, timeout=120)
        except (OSError, subprocess.TimeoutExpired) as error:
            raise EvidenceError(f"Official CLI did not complete: {error}") from error
        if self.audit_path:
            self.audit_path.parent.mkdir(parents=True, exist_ok=True)
            with self.audit_path.open("a", encoding="utf-8") as file:
                file.write(json.dumps({"startedAt": started_at, "finishedAt": timestamp(), "argv": command,
                                       "returncode": result.returncode}, ensure_ascii=False) + "\n")
        if result.returncode:
            raise EvidenceError(f"Official CLI failed ({result.returncode}): {result.stderr.strip()}")
        return result

    def read_page(self, page_id):
        payload = json.loads(self.run(["page", "get", page_id, "--raw", "-f", "json"]).stdout)
        if isinstance(payload, dict) and not payload.get("pgId"):
            if payload.get("success") is False:
                raise EvidenceError("Page query envelope reports failure")
            payload = payload.get("data", payload.get("response"))
        if not isinstance(payload, dict) or payload.get("pgId") != page_id:
            raise EvidenceError("Page query did not return the requested page")
        return payload

    def preview(self, card_id, page_id, output, filters, limit):
        args = ["card", "preview", card_id, "--with-default-filters", "--page-id", page_id,
                "--value-format", "raw", "--precision", "-1", "--limit", str(limit), "-f", "json", "-o", str(output)]
        for condition in filters:
            args.extend(["--filter", condition])
        return self.run(args).stderr


def parse_rows(payload):
    truncated = False
    if isinstance(payload, dict):
        if payload.get("success") is False or payload.get("status") in {"failed", "error", "partial"}:
            raise EvidenceError("Query envelope reports failure or partial results")
        truncated = bool(payload.get("truncated") or payload.get("hasMore"))
        data = payload.get("rows", payload.get("data"))
        if isinstance(data, dict):
            truncated = truncated or bool(data.get("truncated") or data.get("hasMore"))
            data = data.get("rows")
        payload = data
    if not isinstance(payload, list) or any(not isinstance(row, dict) for row in payload):
        raise EvidenceError("Expected JSON row records from card preview -f json")
    fingerprint(payload)  # Also reject NaN/infinity from invalid JSON producers.
    return payload, truncated


def collect_samples(snapshot, card_ids, output_dir, cli, filters=(), limit=1000):
    validate_snapshot(snapshot)
    if cli.profile != snapshot["profile"]:
        raise EvidenceError("Query profile differs from the definition profile")
    if not card_ids or len(set(card_ids)) != len(card_ids) or limit <= 0:
        raise EvidenceError("Select distinct card IDs and a positive row limit")
    inventory = {card["cardId"]: card for card in snapshot["cards"]}
    if any(card_id not in inventory for card_id in card_ids):
        raise EvidenceError("Selected card is absent from this page definition")
    output_dir = Path(output_dir)
    if output_dir.exists() and any(output_dir.iterdir()):
        raise EvidenceError("Use a new evidence directory; stale files must not be reused")
    output_dir.mkdir(parents=True, exist_ok=True)
    before = page_definition(cli.read_page(snapshot["pageId"]))
    if fingerprint(before) != snapshot["definitionFingerprint"]:
        raise EvidenceError("Page definition changed; capture and review a fresh snapshot before querying")
    samples = []
    for index, card_id in enumerate(card_ids):
        card = inventory[card_id]
        sample = {"cardId": card_id, "cardDefinitionFingerprint": card["definitionFingerprint"]}
        if not card["queryable"]:
            sample.update(status="unsupported", error="Selectors/text/custom frontend logic require separate review")
            samples.append(sample)
            continue
        data_path = output_dir / f"card-{index + 1:03d}.json"
        try:
            observed_at = timestamp()
            stderr = cli.preview(card_id, snapshot["pageId"], data_path, filters, limit)
            trace = "\n".join(line for line in stderr.splitlines() if "已应用页面默认筛选:" in line)
            if not trace:
                raise EvidenceError("Missing resolved default-filter evidence; check the official CLI version")
            rows, truncated = parse_rows(read_json(data_path))
            scope = {"profile": snapshot["profile"], "pageId": snapshot["pageId"], "cardId": card_id,
                     "pageDefinitionFingerprint": snapshot["definitionFingerprint"],
                     "cardDefinitionFingerprint": card["definitionFingerprint"], "withDefaultFilters": True,
                     "explicitFilters": list(filters), "defaultFilterTrace": trace,
                     "observedAt": observed_at, "recordTimezone": snapshot["recordTimezone"],
                     "valueFormat": "raw", "limit": limit}
            status = "empty" if not rows else "possibly-truncated" if truncated or len(rows) >= limit else "ok"
            sample.update(status=status, rowCount=len(rows), dataFile=data_path.name,
                          dataFingerprint=fingerprint(read_json(data_path)), scope=scope,
                          scopeFingerprint=fingerprint(scope), stderr=stderr)
        except (EvidenceError, OSError, ValueError, TypeError) as error:
            sample.update(status="failed", error=str(error))
        samples.append(sample)
    issues = []
    try:
        after = page_definition(cli.read_page(snapshot["pageId"]))
        if fingerprint(after) != snapshot["definitionFingerprint"]:
            issues.append("Page definition changed during sampling")
    except (EvidenceError, OSError, ValueError) as error:
        issues.append(f"Could not recheck page definition: {error}")
    result = {"schemaVersion": SCHEMA_VERSION, "artifactType": "dashboard-samples", "capturedAt": timestamp(),
              "profile": snapshot["profile"], "pageId": snapshot["pageId"],
              "definitionFingerprint": snapshot["definitionFingerprint"], "requestedCards": list(card_ids),
              "cards": samples, "issues": issues,
              "passed": not issues and all(card["status"] == "ok" for card in samples),
              "coverage": "selected-card-results-only", "businessConfirmation": "draft"}
    write_json(output_dir / "samples.json", result)
    return result


def decimal_number(value):
    if isinstance(value, bool) or value is None or not isinstance(value, (int, float, str)):
        raise EvidenceError("Expected a raw numeric value; null and booleans are not zero/one")
    try:
        result = Decimal(str(value))
    except InvalidOperation as error:
        raise EvidenceError("Formatted/unit-bearing text is not a raw number") from error
    if not result.is_finite():
        raise EvidenceError("Numeric values must be finite")
    return result


def load_sample_rows(samples, card, evidence_dir):
    if card.get("status") != "ok":
        raise EvidenceError("Card has no usable sample")
    scope = card["scope"]
    if fingerprint(scope) != card.get("scopeFingerprint"):
        raise EvidenceError("Sample scope fingerprint changed")
    if any(scope.get(key) != expected for key, expected in
           [("cardId", card["cardId"]), ("pageId", samples["pageId"]), ("profile", samples["profile"]),
            ("pageDefinitionFingerprint", samples["definitionFingerprint"]),
            ("cardDefinitionFingerprint", card["cardDefinitionFingerprint"]), ("valueFormat", "raw"),
            ("withDefaultFilters", True)]):
        raise EvidenceError("Sample scope does not match its parent page/card/source")
    data_path = Path(evidence_dir) / card["dataFile"]
    if data_path.resolve().parent != Path(evidence_dir).resolve():
        raise EvidenceError("Sample data file must stay inside its evidence directory")
    payload = read_json(data_path)
    if fingerprint(payload) != card.get("dataFingerprint"):
        raise EvidenceError("Sample file fingerprint changed")
    rows, truncated = parse_rows(payload)
    if truncated or not rows or len(rows) != card["rowCount"] or len(rows) >= scope["limit"]:
        raise EvidenceError("Sample row coverage changed, is empty or may be truncated")
    return rows


def verify_cases(samples, cases, evidence_dir):
    results, issues = [], []
    if samples.get("schemaVersion") != SCHEMA_VERSION or samples.get("artifactType") != "dashboard-samples":
        issues.append("Unsupported samples schema")
    cards = {card["cardId"]: card for card in samples.get("cards", [])}
    if not samples.get("passed") or samples.get("issues") or any(card.get("status") != "ok" for card in cards.values()):
        issues.append("Sampling is incomplete, unsupported, empty, truncated or failed")
    if set(cards) != set(samples.get("requestedCards", [])) or len(cards) != len(samples.get("cards", [])):
        issues.append("Requested sample inventory is incomplete or duplicated")
    rows_by_card, errors_by_card = {}, {}
    for card_id, card in cards.items():
        try:
            rows_by_card[card_id] = load_sample_rows(samples, card, evidence_dir)
        except (EvidenceError, OSError, ValueError, TypeError, KeyError) as error:
            errors_by_card[card_id] = str(error)
            issues.append(f"{card_id}: {error}")
    if not isinstance(cases, list) or not cases:
        issues.append("At least one explicit assertion is required")
        cases = []
    ids = [case.get("id") for case in cases]
    if any(not item for item in ids) or len(set(ids)) != len(ids):
        issues.append("Assertion IDs must be present and unique")
    for case in cases:
        result = {"id": case.get("id"), "cardId": case.get("cardId"), "passed": False}
        try:
            card = cards.get(case.get("cardId"))
            if not card or card["cardId"] in errors_by_card:
                raise EvidenceError(errors_by_card.get(case.get("cardId"), "Card has no usable sample"))
            if case.get("scopeFingerprint") != card["scopeFingerprint"]:
                raise EvidenceError("Assertion scope differs from the sampled page/card/filter/time evidence")
            rows = rows_by_card[card["cardId"]]
            where = case.get("where")
            if not isinstance(where, dict) or not case.get("field") or "expected" not in case:
                raise EvidenceError("Specify where, field and expected for this exact cell")
            matched = [row for row in rows if all(key in row and type(row[key]) is type(value) and row[key] == value
                                                   for key, value in where.items())]
            if len(matched) != 1:
                raise EvidenceError(f"Expected exactly one matching row, found {len(matched)}")
            if case["field"] not in matched[0]:
                raise EvidenceError("Named value field is missing from the matching row")
            actual, expected = matched[0][case["field"]], case["expected"]
            if case.get("valueType", "number") == "text":
                if not isinstance(actual, str) or not isinstance(expected, str):
                    raise EvidenceError("Text assertions require text values")
                result["passed"] = actual == expected
            elif case.get("valueType", "number") == "number":
                absolute = decimal_number(case.get("absoluteTolerance", 0))
                relative = decimal_number(case.get("relativeTolerance", 0))
                if absolute < 0 or relative < 0:
                    raise EvidenceError("Tolerances cannot be negative")
                expected_num, actual_num = decimal_number(expected), decimal_number(actual)
                result["passed"] = abs(actual_num - expected_num) <= max(absolute, relative * abs(expected_num))
            else:
                raise EvidenceError("valueType must be number or text")
            result.update(field=case["field"], where=where, actual=actual, expected=expected)
            if not result["passed"]:
                result["error"] = "Value mismatch in the named field of the matching row"
        except (EvidenceError, OSError, ValueError, TypeError, KeyError) as error:
            result["error"] = str(error)
        results.append(result)
    return {"schemaVersion": SCHEMA_VERSION, "artifactType": "dashboard-verification", "checkedAt": timestamp(),
            "passed": bool(results) and not issues and all(result["passed"] for result in results),
            "issues": issues, "results": results, "coverage": "explicit-assertions-only",
            "businessConfirmation": "draft"}


def compare_snapshots(old, new):
    validate_snapshot(old); validate_snapshot(new)
    if old["profile"] != new["profile"] or old["pageId"] != new["pageId"]:
        raise EvidenceError("Compare snapshots of the same page and official CLI profile")
    before, after = ({card["cardId"]: card for card in s["cards"]} for s in (old, new))
    return {"schemaVersion": SCHEMA_VERSION, "artifactType": "dashboard-definition-diff",
            "changed": old["definitionFingerprint"] != new["definitionFingerprint"],
            "addedCards": sorted(set(after) - set(before)), "removedCards": sorted(set(before) - set(after)),
            "changedCards": sorted(card_id for card_id in set(before) & set(after)
                                   if before[card_id]["definitionFingerprint"] != after[card_id]["definitionFingerprint"]),
            "oldFingerprint": old["definitionFingerprint"], "newFingerprint": new["definitionFingerprint"]}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    snap = sub.add_parser("snapshot", help="Read a page definition into a local draft contract")
    snap.add_argument("--profile", required=True); snap.add_argument("--page-id", required=True)
    snap.add_argument("--timezone", default="Asia/Singapore", help="Record display timezone; does not change BI date macros")
    snap.add_argument("--out", required=True)
    sample = sub.add_parser("sample", help="Read selected cards with page defaults into explicit JSON files")
    sample.add_argument("--snapshot", required=True); sample.add_argument("--card", action="append", required=True)
    sample.add_argument("--filter", action="append", default=[]); sample.add_argument("--limit", type=int, default=1000)
    sample.add_argument("--out", required=True, help="New, private evidence directory")
    verify = sub.add_parser("verify", help="Check scoped row-and-field assertions, not free text")
    verify.add_argument("--samples", required=True); verify.add_argument("--cases", required=True); verify.add_argument("--out", required=True)
    diff = sub.add_parser("diff", help="Detect definition changes requiring renewed review")
    diff.add_argument("--before", required=True); diff.add_argument("--after", required=True); diff.add_argument("--out", required=True)
    args = parser.parse_args(argv)
    try:
        if args.command == "snapshot":
            cli = ReadOnlyCLI(args.profile, Path(args.out).with_suffix(".audit.jsonl"))
            result = make_snapshot(cli.read_page(args.page_id), args.profile, args.timezone)
            write_json(args.out, result); code = 0
        elif args.command == "sample":
            snapshot = read_json(args.snapshot)
            # The audit file sits alongside the new directory, so it cannot contaminate its stale-file check.
            cli = ReadOnlyCLI(snapshot["profile"], Path(args.out).with_suffix(".audit.jsonl"))
            result = collect_samples(snapshot, args.card, args.out, cli, args.filter, args.limit)
            code = 0 if result["passed"] else 2
        elif args.command == "verify":
            result = verify_cases(read_json(args.samples), read_json(args.cases), Path(args.samples).parent)
            write_json(args.out, result); code = 0 if result["passed"] else 2
        else:
            result = compare_snapshots(read_json(args.before), read_json(args.after))
            write_json(args.out, result); code = 1 if result["changed"] else 0
        print(json.dumps({"command": args.command, "output": args.out, "passed": result.get("passed"),
                          "changed": result.get("changed"), "cards": len(result.get("cards", []))}, ensure_ascii=False))
        return code
    except (EvidenceError, OSError, ValueError, KeyError, TypeError) as error:
        print(f"dashboard-evidence: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
