"""Keep the progressively disclosed Skill small and every router destination usable."""
from pathlib import Path
import re
import unittest
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]


def headings(text):
    text = re.sub(r'^```[^\n]*\n.*?^```\s*$', '', text, flags=re.M | re.S)
    result, seen = set(), {}
    for heading in re.findall(r'^#{1,6} (.+)$', text, flags=re.M):
        value = re.sub(r'[^\w\s-]', '', heading.strip().lower()).replace(' ', '-')
        count = seen.get(value, 0); seen[value] = count + 1
        result.add(value + ('-' + str(count) if count else ''))
    return result


class SkillLinksTests(unittest.TestCase):
    def test_relative_links_and_fragments_resolve(self):
        skill = (ROOT / 'SKILL.md').read_text()
        for href in re.findall(r'\]\(([^)\s]+)\)', skill):
            if re.match(r'^[a-zA-Z]+://', href) or href.startswith('mailto:'):
                continue
            path, _, anchor = unquote(href).partition('#')
            target = ROOT / path if path else ROOT / 'SKILL.md'
            self.assertTrue(target.exists(), href)
            if anchor and target.is_file() and target.suffix == '.md':
                self.assertIn(anchor, headings(target.read_text()), href)

    def test_all_router_rows_have_a_destination(self):
        text = (ROOT / 'SKILL.md').read_text()
        table = text.split('## 🧭 Part 选择', 1)[1].split('> **作者**', 1)[0]
        rows = [row for row in table.splitlines() if row.startswith('|')][2:]
        self.assertGreaterEqual(len(rows), 14)
        for row in rows:
            self.assertRegex(row, r'\]\([^)]+\)', row)

    def test_skill_below_50000_bytes(self):
        self.assertLessEqual((ROOT / 'SKILL.md').stat().st_size, 50000)


if __name__ == '__main__':
    unittest.main()
