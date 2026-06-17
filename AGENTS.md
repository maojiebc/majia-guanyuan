# AGENTS.md — majia-guanyuan

This file is read by:
- **OpenAI Codex** as project-level instructions (when cwd is inside this repo)
- **Hermes / gbrain** as a resolver file (alternative to `RESOLVER.md`)
- Other AGENTS.md-aware tools (e.g., **Cursor**, **Aider**)

## What this repo is

A Claude Code Skill for **Guandata BI (观远 BI)** — a tool-agnostic agent skill packaged so it works with **Claude Code**, **OpenClaw**, **Hermes/gbrain**, **Codex**, and any other agent that recognizes `SKILL.md` frontmatter.

**V3.0.0 重定位 — 「马甲实战版」**: after the official Guandata BI skill family went public on 2026-06-03 (`@guandata/guanskill`: guancli / guanvis / guanetl / guanwf / guands + per-skill AI skills; guanadmin / guanexport left the public family on 2026-06-04, current family = 5), this skill was refactored ground-up from a self-built full-stack + fallback into a **battle-tested gain-layer on top of the official family**. The self-built HTTP client `scripts/guandata.py` (2789 lines) was retired and ~1600 lines of dead code removed. **Standard query / card / ETL / dataset CRUD all route to the official family**; this skill keeps only what the official DSL/commands can't reach.

Current structure — a router layer plus the hard-bone Parts:
- **🧭 Router layer** — standard query/card/ETL/dataset CRUD routed to the official family (`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands`)
- **Part B** — ETL governance, write, delete (incl. SmartETL full-chain rewrite methodology and ExecPlan workflow)
- **Part C** — Custom chart HTML/CSS/JS injection & debugging on existing pages
- **Part C-12** — HTML application-style dashboard generation (descriptor patch linking selector → custom-chart dataView)
- **Part D** — V7 Page/Card publish pipeline (draft/release state-machine bypass + node-level silent traps + mobile phoneLayout ZIP-inject)
- **Part E** — SuperApp open-app development pipeline (reverse-engineering)
- **AI-native ADS design methodology** — philosophy-layer doc (governance vs rebuild judgment)
- **Restaurant-chain BI formula playbook** — 60+ SQL / RFM / Comp / DWD wide-table patterns

## Required reading order for any task

Before performing any work in this repo, always:

1. Read `SKILL.md` (the main doc, ~1060 lines). The `## 🧭 Part 选择` table at the top tells you which Part (router layer / B / C / C-12 / D / E / ADS / restaurant formulas) covers the user's request.
2. Read only the relevant Part section in detail. Don't load the whole SKILL.md unnecessarily — each Part points to its own `references/` playbook for the full tables.
3. Authentication is via `guancli auth login` (the whole official family shares one profile). This skill no longer reads `config.json` — credentials live in the guancli profile, not in this repo.

## Tool-specific entry points

| Tool | Install path | Entry |
|---|---|---|
| Claude Code | `~/.claude/skills/majia-guanyuan/` | `SKILL.md` |
| OpenClaw | `~/.openclaw/skills/majia-guanyuan/` or `<workspace>/skills/majia-guanyuan/` | `SKILL.md` |
| Codex | `~/.codex/skills/majia-guanyuan/` or `<repo>/.codex/skills/majia-guanyuan/` | `SKILL.md` (this `AGENTS.md` provides project-level instructions) |
| Hermes / gbrain | `<workspace>/skills/majia-guanyuan/` | `SKILL.md` (this `AGENTS.md` serves as the resolver pointer) |
| Other agents | Anywhere; see `manifest.json` and `SKILL.md` frontmatter | `SKILL.md` |

The `SKILL.md` frontmatter (`name: majia-guanyuan`, `description: ...`, `metadata.version: "3.1.2"`) is the universal handshake every agent should parse.

## Hard rules (do not violate)

- **Authentication is via `guancli auth login`** — the official family shares one profile; this skill no longer reads `config.json`. Do not commit any `config.json` (still in `.gitignore` defensively). `config.example.json` is kept as a legacy schema reference only.
- **Do not re-route standard work to self-built code** — standard query / card / ETL / dataset CRUD all go to the official family (`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands`). This skill keeps only what the official DSL/commands can't reach (governance judgment, engine-level error playbooks, state-machine bypass, reverse-engineering, business formulas). The self-built `scripts/guandata.py` was retired in v3.0.0 (recover from git tag `v2.1.14` if ever needed).
- **Do not edit contributor originals in `references/`** — `etl-rewrite-original.md` + `custom-chart-playbook.md` (CTO Zhang Jin), `execplan-spec.md` + `agents-rule.md` (OpenAI Codex) are verbatim. Cite, don't edit. (The 马甲-distilled references and `restaurant-bi-formulas/` are maintained docs and may be updated.)
- **Do not strip version frontmatter** in `SKILL.md`. Bump `metadata.version` and update the version log section per the changelog convention when making changes.
- **Do not add tool-specific code paths** (e.g., `if claude_code: ...`) inside scripts or SKILL.md. The skill is tool-agnostic on purpose.

## Repo layout (one-liner per file)

    SKILL.md              ← Main agent doc (router layer + key rules; progressive disclosure).
    AGENTS.md             ← This file (Codex/Hermes/Cursor entry).
    README.md             ← Human-facing 中文 README.
    README.en.md          ← Human-facing English README.
    CHANGELOG.md          ← Full version history.
    ATTRIBUTIONS.md       ← Credits to contributors.
    SECURITY.md           ← Security policy.
    LICENSE               ← MIT.
    llms.txt              ← llms.txt index.
    manifest.json         ← Tool-agnostic metadata (name/version/compatibility/entry).
    package.json          ← npm package descriptor (scoped @supermajia).
    config.example.json   ← Legacy credential schema (auth now via `guancli auth login`).
    .gitignore
    .npmignore            ← Defense-in-depth alongside package.json `files` whitelist.
    bin/
      install.js          ← npm CLI: install/list/uninstall to 4 agent tools.
    scripts/
      inject_phone_layout.py  ← Part D mobile phoneLayout ZIP-inject helper (stdlib only).
    templates/            ← html-dashboard template pack (Part C-12).
    docs/                 ← Supplementary docs.
    references/            ← Progressive-disclosure playbooks (13 .md files + restaurant-bi-formulas/ dir):
      part-b-errors.md           ← Part B 10-category error fixes detailed.
      part-b-payload.md          ← ETL payload schema deep-dive.
      part-b-sdk.md              ← v2→v3 bulk refactoring SDK.
      part-b17-fullchain-rewrite.md  ← Full B-17 SmartETL full-chain rewrite methodology.
      part-c-payload-json.md     ← C-3 payload_json troubleshooting.
      part-c-html-dashboard.md   ← Part C-12 HTML application-style dashboard methodology.
      v7-page-card-publish-pipeline.md  ← Part D v7 publish pipeline (16 sections).
      part-e-superapp-pipeline.md  ← Part E SuperApp open-app development pipeline.
      ai-native-ads-design.md    ← AI-native ADS design methodology (philosophy layer).
      restaurant-bi-formulas/    ← Restaurant-chain BI formula playbook (dir: README + 9 topic files).
      execplan-spec.md           ← OpenAI Codex ExecPlan full spec (contributor original).
      agents-rule.md             ← OpenAI Codex minimal scheduling rule (contributor original).
      etl-rewrite-original.md    ← CTO Zhang Jin SmartETL rewrite (contributor original).
      custom-chart-playbook.md   ← CTO Zhang Jin custom chart playbook (contributor original).

## Verification

After modifying anything, run a sanity check that no real credentials leak:

    git ls-files | grep -E "config\.json$|\.cache/|columns_cache/"

The output must be empty (the only `config*` file tracked is `config.example.json`).
