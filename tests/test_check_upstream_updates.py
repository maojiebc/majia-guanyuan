"""Synthetic upstream checks: failures never become 'unchanged' or advance baselines."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location(
    'upstream_check', Path(__file__).resolve().parents[1] / 'scripts/check_upstream_updates.py')
check = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check)


class UpstreamChecks(unittest.TestCase):
    def baseline(self):
        return {'schemaVersion': 1, 'repository': check.BUILDER_REPO,
                'reviewedCommit': 'a' * 40, 'reviewedVersion': '4.8.1'}

    def npm_current(self):
        result = {p: {'version': '1.0.0', 'dependencies': {}} for p in check.PACKAGES}
        result[check.PACKAGES[0]]['dependencies'] = dict.fromkeys(check.PACKAGES[1:], '1.0.0')
        result['@guandata/guancli']['version'] = '1.0.1'
        return result

    def test_lag_keeps_an_exact_install_set_and_independent_review_target(self):
        plan = check.review_plan(self.npm_current())
        self.assertFalse(plan['latestSetCoherent'])
        self.assertTrue(plan['canReviewIndependently'])
        self.assertEqual(plan['aggregatePackages']['@guandata/guancli'], '1.0.0')
        self.assertEqual(plan['additionalReviewPackages'], {'@guandata/guancli': '1.0.1'})

    def test_non_exact_aggregate_dependency_rejected_instead_of_mixed(self):
        current = self.npm_current()
        current[check.PACKAGES[0]]['dependencies']['@guandata/guancli'] = '^1.0.0'
        with self.assertRaises(ValueError):
            check.review_plan(current)

    def test_already_reviewed_lag_is_not_a_new_update(self):
        current = self.npm_current()
        baseline = {p: v['version'] for p, v in current.items()}
        dependencies = current[check.PACKAGES[0]]['dependencies']
        self.assertEqual(check.compare(baseline, current)['status'], 'review_required')
        result = check.compare(baseline, current, dependencies)
        self.assertEqual(result['status'], 'unchanged')
        self.assertEqual(len(result['aggregateMismatches']), 1)

    def test_changed_aggregate_pin_requires_review_even_when_latest_is_unchanged(self):
        current = self.npm_current()
        baseline = {p: v['version'] for p, v in current.items()}
        reviewed = dict(current[check.PACKAGES[0]]['dependencies'])
        current[check.PACKAGES[0]]['dependencies']['@guandata/guancli'] = '1.0.1'
        result = check.compare(baseline, current, reviewed)
        self.assertEqual(result['status'], 'review_required')
        self.assertEqual(result['aggregateChanges'][0]['package'], '@guandata/guancli')

    def test_version_is_read_only_from_frontmatter(self):
        self.assertEqual(check.builder_version('---\nversion: "4.8.2"\n---\n# v9.0.0'), '4.8.2')
        with self.assertRaises(ValueError):
            check.builder_version('---\nname: example\n---\nversion: "4.8.2"')

    def test_same_version_new_commit_requires_review(self):
        result = check.compare_builder(self.baseline(), {'commit': 'b' * 40, 'version': '4.8.1'})
        self.assertEqual(result['status'], 'review_required')

    def test_changed_version_same_commit_requires_review(self):
        self.assertEqual(check.compare_builder(self.baseline(),
                         {'commit': 'a' * 40, 'version': '4.8.2'})['status'], 'review_required')

    def test_unchanged_commit_and_version(self):
        self.assertEqual(check.compare_builder(self.baseline(),
                         {'commit': 'a' * 40, 'version': '4.8.1'})['status'], 'unchanged')

    def test_invalid_repository_rejected_before_network(self):
        baseline = self.baseline(); baseline['repository'] = 'other/example'
        with patch.object(check.urllib.request, 'urlopen') as call:
            with self.assertRaises(ValueError):
                check.fetch_builder(baseline)
            call.assert_not_called()

    def test_github_failure_is_not_no_update_and_does_not_write_baselines(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); npm = root / 'npm.json'; builder = root / 'builder.json'
            npm.write_text(json.dumps({'schemaVersion': 1, 'skillVersion': 'example',
                                      'packages': dict.fromkeys(check.PACKAGES, '1.0.0')}))
            builder.write_text(json.dumps(self.baseline()))
            before = (npm.read_bytes(), builder.read_bytes())
            current = lambda p: {'version': '1.0.0', 'dependencies':
                                dict.fromkeys(check.PACKAGES[1:], '1.0.0')}
            with patch('sys.argv', ['check', '--baseline', str(npm), '--builder-baseline', str(builder)]), \
                    patch.object(check, 'fetch', side_effect=current), \
                    patch.object(check, 'fetch_builder', side_effect=TimeoutError), \
                    contextlib.redirect_stdout(io.StringIO()) as output:
                code = check.main()
            self.assertEqual(code, 1)
            self.assertEqual(json.loads(output.getvalue())['status'], 'check_failed')
            self.assertEqual(before, (npm.read_bytes(), builder.read_bytes()))


if __name__ == '__main__':
    unittest.main()
