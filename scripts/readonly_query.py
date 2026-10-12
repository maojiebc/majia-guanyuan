"""Shared local guards for official read-only CLI calls (Python 3.9+, POSIX)."""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import subprocess
from contextlib import contextmanager


class QueryError(ValueError):
    pass


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     allow_nan=False).encode()).hexdigest()


def atomic_json(path, value):
    path = Path(path)
    temp = path.with_name(path.name + '.tmp')
    with temp.open('w', encoding='utf-8') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2, allow_nan=False)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())
    temp.replace(path)


def private_output(path):
    path = Path(path).expanduser().resolve()
    roots = [Path(__file__).resolve().parents[1]]
    for parent in (path, *path.parents):
        if (parent / '.git').exists():
            roots.append(parent)
    for root in roots:
        try:
            relative = path.relative_to(root)
        except ValueError:
            continue
        check = subprocess.run(['git', '-C', str(root), 'check-ignore', '--quiet', str(relative)],
                               capture_output=True, timeout=10)
        if not relative.parts or check.returncode != 0:
            raise QueryError('Output must be outside a repository or explicitly gitignored')
    return path


def token(value):
    if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9_][A-Za-z0-9_.-]*', value):
        raise QueryError('Invalid resource/profile token')
    return value


def validate_command(tool, args):
    """Closed grammar: no shell, arbitrary options, writes, or additional commands."""
    args = list(args)
    if tool == 'guancli' and args[:2] in [['ds', 'get'], ['ds', 'preview']]:
        if len(args) < 3:
            raise QueryError('Dataset ID required')
        token(args[2])
        flags = {'--raw': 0, '--brief': 0} if args[1] == 'get' else {
            '--raw': 0, '--limit': 1, '--filter': 1, '--columns': 1}
        rest = args[3:]
    elif tool == 'guanetl' and args and args[0] in {'edit', 'export', 'preview'}:
        offset = 1 if args[0] == 'export' else 2
        if offset == 2:
            if len(args) < 2:
                raise QueryError('ETL/node ID required')
            token(args[1])
        flags = {'--dir': 1}
        if args[0] == 'preview':
            flags.update({'--max-parallel': 1, '--timeout': 1, '--limit': 1, '-v': 0})
        rest = args[offset:]
    else:
        raise QueryError('Command is outside the read-only allowlist')
    seen = []
    while rest:
        flag = rest.pop(0)
        if flag not in flags or (flag in seen and flag != '--filter'):
            raise QueryError('Unknown or duplicate option')
        seen.append(flag)
        if flags[flag]:
            if not rest or not isinstance(rest[0], str) or not rest[0] or rest[0].startswith('-'):
                raise QueryError('Option value required')
            value = rest.pop(0)
            if flag == '--max-parallel' and value != '1':
                raise QueryError('Previews must be serial')
            if flag in {'--timeout', '--limit'} and not value.isdigit():
                raise QueryError('Positive integer option required')
            if flag == '--timeout' and not 0 < int(value) <= 120:
                raise QueryError('Timeout must be at most 120 seconds')
            if flag == '--limit' and not 0 < int(value) <= 60000:
                raise QueryError('Row cap must be at most 60000')
    if tool == 'guancli' and '--raw' not in seen:
        raise QueryError('Raw response required')
    if tool == 'guanetl' and '--dir' not in seen:
        raise QueryError('Explicit workspace required')
    if tool == 'guanetl' and args[0] == 'preview' and '--max-parallel' not in seen:
        raise QueryError('Explicit serial preview required')


def stop_group(proc):
    for sig in (signal.SIGTERM, signal.SIGKILL):
        try:
            os.killpg(proc.pid, sig)
        except ProcessLookupError:
            pass
        try:
            proc.communicate(timeout=1)
        except subprocess.TimeoutExpired:
            pass


class ReadOnlyCLI:
    def __init__(self, profile):
        self.profile = token(profile)

    def run(self, tool, args, timeout=120):
        validate_command(tool, args)
        if isinstance(timeout, bool) or not 0 < timeout <= 120:
            raise QueryError('Timeout must be positive and at most 120 seconds')
        env = dict(os.environ, GUANCLI_PROFILE=self.profile)
        # OIDC/base URL overrides would silently change the selected target.
        for key in ('GUANCLI_OIDC_BASE_URL', 'GUANCLI_OIDC_ACCESS_TOKEN',
                    'GUANCLI_BASE_URL', 'GUANCLI_TOKEN', 'GUANCLI_PATH'):
            env.pop(key, None)
        command = [tool, *args]
        if tool == 'guancli':
            command = [tool, '--profile', self.profile, *args]
        proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                text=True, env=env, start_new_session=True)
        try:
            stdout, stderr = proc.communicate(timeout=timeout)
        except BaseException:
            stop_group(proc)
            raise
        if proc.returncode:
            # Do not embed partial API output, credentials or business rows in errors.
            raise QueryError('Official CLI failed; queue stopped (exit %s)' % proc.returncode)
        return stdout


@contextmanager
def local_lock(path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise QueryError('Another local query runner holds this profile lock')
        try:
            yield
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)
