#!/usr/bin/env python3
"""Read-only npm check. Does not install, publish, or advance the reviewed baseline."""
import argparse
import concurrent.futures
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

PACKAGES = tuple('@guandata/' + n for n in
                 ('guanskill', 'guancli', 'guanvis', 'guanetl', 'guanwf', 'guands', 'guanmetric'))
VERSION = re.compile(r'^[0-9]+\.[0-9]+\.[0-9]+$')
COMMIT = re.compile(r'^[a-f0-9]{40}$')
BUILDER_REPO = 'JeremyWXL/guanbi-agent-builder'


def builder_version(text):
    if not text.startswith('---\n') or '\n---' not in text[4:]:
        raise ValueError('Missing upstream Skill frontmatter')
    frontmatter = text.split('\n---', 1)[0]
    match = re.search(r'^version:\s*[\"\']?(\d+\.\d+\.\d+)[\"\']?\s*$',
                      frontmatter, re.M)
    if not match:
        raise ValueError('Missing stable upstream Skill version')
    return match.group(1)


def fetch_builder(baseline):
    if (baseline.get('schemaVersion') != 1 or baseline.get('repository') != BUILDER_REPO
            or not COMMIT.fullmatch(baseline.get('reviewedCommit', ''))
            or not VERSION.fullmatch(baseline.get('reviewedVersion', ''))):
        raise ValueError('Invalid reviewed builder baseline')
    request = urllib.request.Request(
        'https://api.github.com/repos/' + BUILDER_REPO + '/commits/main',
        headers={'Accept': 'application/vnd.github+json',
                 'User-Agent': 'majia-guanyuan-update-check/2'})
    with urllib.request.urlopen(request, timeout=20) as response:
        commit = json.load(response)
    sha = commit.get('sha', '')
    if not COMMIT.fullmatch(sha):
        raise ValueError('Unexpected upstream commit')
    # Read the version at the exact commit, never the moving branch.
    with urllib.request.urlopen('https://raw.githubusercontent.com/' + BUILDER_REPO
                                + '/' + sha + '/SKILL.md', timeout=20) as response:
        content = response.read(1024 * 1024 + 1)
    if len(content) > 1024 * 1024:
        raise ValueError('Oversized upstream Skill')
    return {'commit': sha, 'version': builder_version(content.decode('utf-8'))}


def compare_builder(baseline, current):
    changed = (baseline['reviewedCommit'] != current['commit']
               or baseline['reviewedVersion'] != current['version'])
    return {'status': 'review_required' if changed else 'unchanged',
            'repository': BUILDER_REPO, 'reviewedCommit': baseline['reviewedCommit'],
            'reviewedVersion': baseline['reviewedVersion'], 'current': current,
            'compareUrl': 'https://github.com/' + BUILDER_REPO + '/compare/'
                          + baseline['reviewedCommit'] + '...' + current['commit']}


def fetch(package):
    request = urllib.request.Request(
        'https://registry.npmjs.org/' + package.replace('/', '%2f') + '/latest',
        headers={'Accept': 'application/json', 'User-Agent': 'majia-guanyuan-update-check/1'})
    with urllib.request.urlopen(request, timeout=20) as response:
        data = json.load(response)
    if data.get('name') != package or not VERSION.fullmatch(data.get('version', '')):
        raise ValueError('Unexpected package identity or stable version')
    return {'version': data['version'], 'dependencies': data.get('dependencies', {})}


def compare(baseline, current):
    changes = [{'package': p, 'reviewed': baseline[p], 'latest': current[p]['version']}
               for p in PACKAGES if baseline[p] != current[p]['version']]
    dependencies = current['@guandata/guanskill']['dependencies']
    mismatches = [{'package': p, 'aggregate': dependencies.get(p), 'latest': current[p]['version']}
                  for p in PACKAGES[1:] if dependencies.get(p) != current[p]['version']]
    downgrades = [c['package'] for c in changes if
                  tuple(map(int, c['latest'].split('.'))) < tuple(map(int, c['reviewed'].split('.')))]
    return {'status': 'review_required' if changes or mismatches else 'unchanged',
            'changes': changes, 'aggregateMismatches': mismatches, 'downgrades': downgrades}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--builder-baseline', type=Path,
                        help='Reviewed companion project commit; any new commit requires review')
    args = parser.parse_args()
    try:
        baseline = json.loads(args.baseline.read_text())
        versions = baseline['packages']
        if baseline.get('schemaVersion') != 1 or set(versions) != set(PACKAGES):
            raise ValueError('Invalid reviewed baseline schema or package set')
        if not all(isinstance(v, str) and VERSION.fullmatch(v) for v in versions.values()):
            raise ValueError('Invalid reviewed baseline version')
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            current = dict(zip(PACKAGES, pool.map(fetch, PACKAGES)))
        result = compare(versions, current)
        if args.builder_baseline:
            builder_baseline = json.loads(args.builder_baseline.read_text())
            result['builder'] = compare_builder(builder_baseline, fetch_builder(builder_baseline))
            if result['builder']['status'] == 'review_required':
                result['status'] = 'review_required'
        result.update({'checkedAt': datetime.now(timezone.utc).isoformat(),
                       'reviewedSkillVersion': baseline['skillVersion'], 'current': current})
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:
        # Do not advance the baseline on partial reads, transport failures, or bad data.
        print(json.dumps({'status': 'check_failed', 'errorType': type(exc).__name__}))
        return 1


if __name__ == '__main__':
    sys.exit(main())
