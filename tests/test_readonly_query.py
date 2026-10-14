"""Process cleanup and command target guards shared by both new query tools."""
from pathlib import Path
import signal
import subprocess
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from readonly_query import QueryError, ReadOnlyCLI, validate_command


class ReadOnlyGuardsTests(unittest.TestCase):
    def test_timeout_ends_only_its_own_new_process_group(self):
        class Proc:
            pid = 424242
            def __init__(self):
                self.calls = 0
            def communicate(self, timeout):
                self.calls += 1
                if self.calls == 1:
                    raise subprocess.TimeoutExpired('synthetic', timeout)
                return '', ''
        proc = Proc()
        with patch('readonly_query.subprocess.Popen', return_value=proc) as popen, \
                patch('readonly_query.os.killpg') as kill:
            with self.assertRaises(subprocess.TimeoutExpired):
                ReadOnlyCLI('synthetic').run('guancli', ['ds', 'preview', 'dataset-example', '--raw', '--limit', '20'])
        self.assertTrue(popen.call_args.kwargs['start_new_session'])
        self.assertEqual([call.args for call in kill.call_args_list],
                         [(424242, signal.SIGTERM), (424242, signal.SIGKILL)])

    def test_explicit_profile_removes_target_overrides(self):
        proc = subprocess.CompletedProcess([], 0, '{}', '')
        class FakeProc:
            returncode = 0
            def communicate(self, timeout):
                return '{}', ''
        with patch.dict('os.environ', {'GUANCLI_PROFILE': 'other', 'GUANCLI_TOKEN': 'synthetic-token',
                                      'GUANCLI_OIDC_BASE_URL': 'https://example.invalid'}), \
                patch('readonly_query.subprocess.Popen', return_value=FakeProc()) as popen:
            ReadOnlyCLI('synthetic').run('guancli', ['ds', 'get', 'dataset-example', '--raw'])
        self.assertEqual(popen.call_args.args[0][:3], ['guancli', '--profile', 'synthetic'])
        self.assertEqual(popen.call_args.kwargs['env']['GUANCLI_PROFILE'], 'synthetic')
        self.assertNotIn('GUANCLI_TOKEN', popen.call_args.kwargs['env'])
        self.assertNotIn('GUANCLI_OIDC_BASE_URL', popen.call_args.kwargs['env'])

    def test_explicit_profile_cannot_be_redirected_by_oauth2_environment(self):
        class FakeProc:
            returncode = 0
            def communicate(self, timeout):
                return '{}', ''
        overrides = {'GUANCLI_OAUTH2_BASE_URL': 'https://example.invalid',
                     'GUANCLI_OAUTH2_ACCESS_TOKEN': 'synthetic-token',
                     'GUANCLI_OAUTH2_UID': 'example', 'GUANCLI_OAUTH2_LOGIN_ID': 'example'}
        with patch.dict('os.environ', overrides), \
                patch('readonly_query.subprocess.Popen', return_value=FakeProc()) as popen:
            ReadOnlyCLI('synthetic').run('guancli', ['ds', 'get', 'dataset-example', '--raw'])
        self.assertFalse(set(overrides) & set(popen.call_args.kwargs['env']))

    def test_serial_and_bounded_flags_cannot_be_overridden(self):
        for args in (['preview', 'id_1', '--dir', '/tmp/demo', '--max-parallel', '2'],
                     ['preview', 'id_1', '--dir', '/tmp/demo', '--max-parallel', '1', '--timeout', '121'],
                     ['export', '--dir', '/tmp/demo', '--dir', '/tmp/other']):
            with self.assertRaises(QueryError):
                validate_command('guanetl', args)


if __name__ == '__main__':
    unittest.main()
