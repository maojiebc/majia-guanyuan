# majia-guanyuan · Guandata BI Battle-Tested Layer · Majia Battle-Tested Edition

> **A battle-tested layer on top of the official family** — after Guandata's official BI family (`guancli` query / `guanvis` card-build & publish & screenshot / `guanetl` ETL / `guanwf` dataflow / `guands` data sources / `guanmetric` metric writes) went public (first five on 2026-06-03, `guanmetric` joined 2026-07-08 making it six), this skill **stops reinventing the wheel**: standard query / card-build / ETL / dataset CRUD all **route to the official family**, and this skill only tackles the hard bones the official DSL/commands can't reach — ETL governance judgment + engine error manual, custom chart injection + descriptor patch, v7 state-machine bypass, SuperApp reverse-engineering, AI-native ADS methodology, restaurant formula library.
> Compatible with **Claude Code** · **OpenClaw** · **Codex** · **Hermes (gbrain)** and any agent that recognizes `SKILL.md` frontmatter.
> Battle-tested with 60+ ETL create/refactor/repair operations + governance scans + custom chart injection debugging.

[![Skill Version](https://img.shields.io/badge/skill-v3.1.7-blue)](./SKILL.md)
[![GitHub Release](https://img.shields.io/github/v/release/maojiebc/majia-guanyuan?label=release&color=success)](https://github.com/maojiebc/majia-guanyuan/releases)
[![skills.sh](https://skills.sh/b/maojiebc/majia-guanyuan)](https://skills.sh/maojiebc/majia-guanyuan)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-✓-orange)](https://docs.claude.com/en/docs/claude-code/skills)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-✓-blueviolet)](https://docs.openclaw.ai/tools/skills)
[![Codex](https://img.shields.io/badge/Codex-✓-black)](https://developers.openai.com/codex/skills)
[![Hermes](https://img.shields.io/badge/Hermes_(gbrain)-✓-darkgreen)](https://github.com/garrytan/gbrain)
[![WorkBuddy](https://img.shields.io/badge/WorkBuddy-compat-1abc9c)](https://www.codebuddy.cn)
[![Qoder](https://img.shields.io/badge/Qoder-compat-fa8231)](https://qoder.com)
[![BI](https://img.shields.io/badge/Guandata-BI_6.x_/_7.x-purple)](https://www.guandata.com/)

**[中文 README](README.md)** · English ↓

---

## Overview

**V3.0.0 repositioning**: Guandata has shipped "query / card-build / ETL / dataflow / data sources / screenshot / admin" as a public family (`npm i -g @guandata/guanskill`). This skill has been **fully refactored from an early "DIY full-stack + fallback" into "a battle-tested layer on top of the official family"** — retiring the 2789-line DIY HTTP client `guandata.py`, deleting ~1600 lines of dead code, and cutting every section that mirrored official commands.

Two layers:
- **🧭 Routing layer**: standard query / card-build / ETL / dataset CRUD all **route to the official family** (`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands` / `guanmetric`); this skill no longer reinvents these wheels.
- **💪 Battle-tested layer (the body of this skill)**: only the hard bones official DSL/commands can't reach — 3 pillars: ① **governance & engine traps** (Part B whole-warehouse ETL governance judgment + 10-category engine error manual + dual-source audit + B-17 full-chain rewrite) ② **front-end injection & publish state machine** (Part C custom chart injection debugging + Part C-12 HTML application dashboard descriptor patch + Part D v7 draft-release state-machine bypass + phoneLayout) ③ **reverse-engineering & methodology** (Part E SuperApp open-app reverse-engineering + AI-native ADS data-architecture methodology + restaurant BI formula library).

<p align="center">
  <img src="https://raw.githubusercontent.com/maojiebc/majia-guanyuan/main/docs/architecture.png" alt="majia-guanyuan v3.1.6 · Majia Battle-Tested Edition architecture: official family routing layer (guancli query / guanvis card-build & publish & screenshot / guanetl ETL / guanwf dataflow / guands data sources / guanmetric metric writes, six components as of 2026-07-08) + this skill's battle-tested layer 3 pillars — ① governance & engine traps (Part B whole-warehouse ETL governance judgment + 10-category engine error manual + dual-source field audit + B-17 full-chain rewrite/ExecPlan) ② front-end injection & publish state machine (Part C custom chart HTML/JS injection debugging + Part C-12 HTML application dashboard descriptor patch linking dataView + Part D v7 draft-release state-machine bypass + customChart autoBootstrap + mobile phoneLayout ZIP inject) ③ reverse-engineering & methodology (Part E SuperApp open-app reverse-engineering + form schema creation + LLM bridge ILLEGAL_JSON_RES triple-path parsing + AI-native ADS design methodology + restaurant BI formulas playbook)" width="100%"/>
</p>

| Layer | What you want | Goes to |
|---|---|---|
| 🧭 **Routing layer** | Query data, build cards, reports, standard ETL / dataset CRUD | The official family (`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands` / `guanmetric`) |
| 🅱️ **Part B** | Whole-warehouse ETL governance + engine error manual + dual-source field audit | "Scan ETLs and tell me what to delete" / "Why does direct-save fail?" / "Is this field cut safe?" |
| 🅱️ **B-17** | Full-chain rewrite methodology | "Rewrite this SmartETL chain as pure SQL" / "Replica page verification / card-level comparison" |
| 🆎 **Part C / C-12** | Custom chart injection debugging + HTML application dashboard | "payload_json parsing fails" / "fixed card misaligned" / "more advanced / application dashboard" |
| 🇩 **Part D** | v7 draft-release state-machine bypass + phoneLayout | "v7 page+card stuck on 60004" / "how to inject mobile phoneLayout" |
| 🇪 **Part E** | SuperApp open-app reverse-engineering | "form schema-creation not exposed by scaffold" / "LLM bridge ILLEGAL_JSON_RES" |
| 🧠 **Methodology / formulas** | AI-native ADS judgment + restaurant BI formulas | "Connect AI to existing BI — govern or rebuild?" / "How to compute repurchase / RFM / avg ticket?" |

---

## ✨ Features

### 🧭 Routing layer (standard work goes to the official family)

- ✅ Standard query / YoY-MoM / Top N / attribution / ChatBI → `guancli`
- ✅ 74 chart-type JS DSL card-build + Page assembly + server-side screenshot → `guanvis`
- ✅ Single-ETL create/edit/lint/preview/save/run/schedule → `guanetl`
- ✅ Workflow Dataflow (DB direct write-back, incremental output) → `guanwf`
- ✅ Data source + dataset CRUD (create connection, create-db/import/replace-data, append/clean, schema sync) → `guands`
- ✅ Metric create/edit/delete + metric projects/dirs + public dimensions + metric Excel standardization → `guanmetric` 🆕 (joined 2026-07-08 as the 6th member)
- ⚠️ Admin-level operations: `guanadmin` **left the family 2026-06-04** (install standalone or use the BI UI)
- One-line routing: **standard query → `guancli`; standard card-build/publish/screenshot → `guanvis`; standard ETL → `guanetl`; dataflow → `guanwf`; data source/dataset → `guands`; metric create/edit/delete + public dimensions → `guanmetric`.** Hit a field/error/state-machine/reverse-engineering/business-semantics the official can't reach → back to the right Part in this skill.

### Part B — ETL Governance & Write

- ✅ **11 battle-tested BI HTTP API endpoints** (POST/GET/DELETE/OPTIONS, full coverage)
- ✅ **Bulk governance scan**: dependency graph → cycle detection → complexity scoring → 8-dim ETL + 4-dim field retention judgment
- ✅ **ODS/DIM/DWD/DWS/APP** five-layer architecture refactoring guide
- ✅ **Field usage dual-source audit** (page + ETL grep — looking only at dashboards **overestimates removable fields by 8×**)
- ✅ **POST /api/etl/direct-save** — full payload schema for create + update (same endpoint)
- ✅ **Real error retrieval** — `status:FINISHED` is just the trigger result; the real error lives in `GET /api/task/<id>.response.result.error`
- ✅ **Delete topology**: `DELETE /api/data-source/` MUST come before `DELETE /api/etl/`
- ✅ **v2→v3 batch refactoring SDK**: `transformV2ToV3()` 7-step rewrite + node ID remapping
- ✅ **CTO Zhang Jin's full-chain rewrite methodology**: 4 deliverables + 8 hard rules + 5-step workflow + three-layer verification + diff tracking 5-step + empty snapshot handling

### Part C — Custom Chart Development

- ✅ **`renderChart` 4-arg runtime contract** explained (NOT what you think — first arg is NOT the DOM root)
- ✅ **5 `data` shape patterns** to recognize
- ✅ **payload_json truncation 3-step diagnosis** (`Unterminated string` → fix the data pipeline, don't pile on JS compatibility hacks)
- ✅ **Recommended: split into columns**, not one big JSON string
- ✅ **z-index baseline** (container 8 / mask 1 / fixed cards 20)
- ✅ **Lifecycle management** (URL mismatch / edit mode / phoneView / route exit → tear down injections)
- ✅ **MutationObserver infinite loop trap** — replace with low-frequency polling + precise rect comparison
- ✅ **Copied page card id relocation** (no error thrown, fails silently)
- ✅ **Real browser verification 8-checklist**

### Error Handling Manual

- 🔧 **10 categories of high-frequency ETL errors** documented with reproduction + root cause + fix:
  `请输入ETL名称` / `保存路径无效` / Upstream no-run permission / Hidden newlines in field names / `<> NULL` / relativeFieldAlias misalignment / CTE inner `;` / Self-join alias collision / UNION column count mismatch / String literal vs DATE comparison

---

## ✅ Suitable / ❌ Not Suitable

### ✅ Suitable

- Already have the official family (`@guandata/guanskill`) installed and want to add "hard bones the official can't reach" on top of the standard commands
- ETL governance (cycle detection, field retention judgment, layer redesign, whole-warehouse scan)
- Bulk ETL rebuilding (30+ table v2→v3 migration) / SmartETL full-chain rewrite + replica page verification + card-level comparison
- Custom chart HTML/CSS/JS injection development & debugging / HTML application dashboard (descriptor patch linking dataView)
- v7 draft-release state-machine bypass / SuperApp open-app reverse-engineering
- "Govern vs rebuild" judgment for clients / AI-native ADS data-architecture proposals / restaurant-chain BI business formulas
- Anyone who can't write code but wants AI to handle the above

### ❌ Not Suitable

- Other BI platforms (Tableau / Power BI / Superset) — this skill targets **Guandata BI ONLY**
- **Only standard query / standard card-build / standard ETL** — that's the official family's job; use `guancli` / `guanvis` / `guanetl` directly, you don't need this skill
- Compliance environments that prohibit raw HTTP API calls
- Users without BI account or write permissions (Part B requires ETL create + dataset run permissions)

---

## 🔌 Compatibility

This skill is **tool-agnostic**. Any agent that supports the `SKILL.md` frontmatter standard can load it. Verified on:

| Tool | Status | Install path | Entry | Notes |
|---|:---:|---|---|---|
| **Claude Code** | ✅ Verified | `~/.claude/skills/majia-guanyuan/` | `SKILL.md` | Native support |
| **OpenClaw** | ✅ Verified | `~/.openclaw/skills/majia-guanyuan/` or `<workspace>/skills/majia-guanyuan/` | `SKILL.md` | Case-sensitive |
| **Codex (OpenAI)** | ✅ Verified | `~/.codex/skills/majia-guanyuan/` or `<repo>/.codex/skills/majia-guanyuan/` | `SKILL.md` + repo-root `AGENTS.md` (project instructions) | See [Codex skills docs](https://developers.openai.com/codex/skills) |
| **Hermes / gbrain** | ✅ Verified | `<workspace>/skills/majia-guanyuan/` | `SKILL.md` + repo-root `AGENTS.md` (resolver) | See [garrytan/gbrain](https://github.com/garrytan/gbrain) |
| **Cursor / Aider** etc. | 🟡 Theoretical | Anywhere | `AGENTS.md` as project instructions | Only the navigation pointer parts apply |
| Others | 🟡 Universal | Anywhere | `manifest.json` as tool-agnostic metadata | frontmatter + manifest dual fallback |

## 📦 Installation

> **This repo uses git as the single source of truth** — not published to the npm registry. The one-line install experience is preserved via `node bin/install.js` and `npx github:` directly.

### Option 0: GitHub CLI `gh skill` (GitHub CLI 2.90.0+)

```bash
# Install to user-level Codex / Claude Code / OpenClaw / Qoder, etc.
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent codex --scope user
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent claude-code --scope user
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent openclaw --scope user
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent qoder --scope user

# Preview before installing
gh skill preview maojiebc/majia-guanyuan majia-guanyuan
```

### ⭐ Option 1: Clone + built-in install CLI (recommended)

```bash
# Clone, then auto-install to every agent tool present on this machine
git clone https://github.com/maojiebc/majia-guanyuan.git ~/majia-guanyuan
cd ~/majia-guanyuan
node bin/install.js install                  # auto-detect all
node bin/install.js install --tool claude-code
node bin/install.js install --tool openclaw
node bin/install.js install --tool codex
node bin/install.js install --tool hermes
node bin/install.js install --tool all       # all four

# Other commands
node bin/install.js list                     # show current install state
node bin/install.js uninstall --tool codex   # remove the skill for that tool
```

### Option 2: `npx` from GitHub URL (no clone required)

```bash
# One-liner; npx fetches from GitHub and runs bin/install.js
npx github:maojiebc/majia-guanyuan install --tool claude-code
npx github:maojiebc/majia-guanyuan install --tool all
```

**`bin/install.js` behavior** (same for both options):
- Copies `SKILL.md` / `AGENTS.md` / `manifest.json` / `scripts/` / `references/` / `templates/` into the target tool's skills directory
- Skips already-installed targets by default; use `--force` to overwrite
- **Auth is not inside the skill**: this skill no longer ships `config.json` — authentication goes through the official family's `guancli auth login` (see "Prerequisites" below)

### Option 3: Manual `git clone` directly into the tool's skill directory

```bash
# Claude Code
git clone https://github.com/maojiebc/majia-guanyuan.git ~/.claude/skills/majia-guanyuan

# OpenClaw (personal)
git clone https://github.com/maojiebc/majia-guanyuan.git ~/.openclaw/skills/majia-guanyuan

# Codex (personal)
git clone https://github.com/maojiebc/majia-guanyuan.git ~/.codex/skills/majia-guanyuan

# Codex (project-local)
git clone https://github.com/maojiebc/majia-guanyuan.git <your-repo>/.codex/skills/majia-guanyuan

# Hermes / gbrain (workspace-level)
git clone https://github.com/maojiebc/majia-guanyuan.git <your-workspace>/skills/majia-guanyuan
```

### Option 4: OpenClaw / ClawHub one-line install

```bash
openclaw skills install majia-guanyuan
clawhub install majia-guanyuan
```

> As of V3.0.0 this skill has retired its DIY HTTP client `guandata.py` and **no longer sends any login credential locally** — all query/write is delegated to official family commands, and authentication goes through `guancli auth login` (credentials managed by the official CLI). See [SECURITY.md](./SECURITY.md).

### Option 5: Hermes skillpack install (if published to gbrain registry)

```bash
gbrain skillpack install majia-guanyuan
```

### 🔑 Prerequisites: the official family (same for all tools)

All standard work routes to the official family, so **install the official aggregator and log in once first**:

```bash
# 1. Install the whole official family in one shot (guancli / guanvis / guanetl / guanwf / guands / guanmetric + their AI skills)
npm i -g @guandata/guanskill
guanskill install-skill

# 2. Authenticate (the whole family shares one profile; this skill no longer needs config.json)
guancli auth login
```

| Command | Role | Route these needs to it |
|---|---|---|
| `guancli` | Read-only analysis hub + form CRUD | Query ETL/dsId/page/card/lineage, `ds execute-sql`, `metric query` YoY-MoM/Top N, attribution, ChatBI, data export |
| `guanvis` | Standard card-build + Page assembly + server-side screenshot | 74 chart-type JS DSL, selector linkage, custom chart, `guanvis pack/publish/upload`, `guanvis screenshot` → PNG |
| `guanetl` | ETL write-op loop | Single-ETL create/edit/lint/preview/save/run/schedule |
| `guanwf` | Workflow Dataflow | Build/edit/save/run dataflows in the workflow engine (DB direct write-back, incremental output) |
| `guands` | Data source + dataset CRUD | Create connections, `dataset create-db/create-query/import/replace-data`, bulk move/delete, incremental update, append/clean data, schema sync |
| `guanmetric` 🆕 | Metric write ops (joined 2026-07-08) | Metric `create`/`edit`/`delete` (all with `--dry-run`), metric projects/dirs, public dimensions, `template normalize` for metric Excel standardization; metric queries stay in `guancli` |
| ~~`guanadmin`~~ | Left the family (2026-06-04) | admin ops no longer in the public family — install standalone |

> ⚠️ **Auth no longer uses `config.json`**: V3.0.0 retired the DIY client `guandata.py`; credentials are managed entirely by `guancli auth login`, and this skill no longer reads/writes `config.json`.

---

## 🚀 Quick Start

### 🧭 Routing layer: standard query / card-build (goes to the official family)

```bash
# Standard query → guancli (no need for this skill)
guancli ds search revenue --raw
guancli metric query --ds <ds_id> --dim city --metric gross_revenue:SUM \
  --filter biz_date:BT:2026-02-01,2026-02-28

# Standard card-build + server-side screenshot → guanvis
guanvis publish .
guanvis screenshot <page_id> -o out.png
```

> Standard query/card-build is the official family's job; this skill **no longer reinvents it**. Only enter the matching Part when you hit one of the "official can't reach" cases below.

### Part B: Build an ETL

```bash
# 1. Governance scan
guancli etl tree
guancli --raw etl get <id> > raw/<id>.json
# Local script analyzes dependency graph, cycles, complexity → analysis.json + governance-report.md

# 2. Create v2 directories (one ETL + one DATA_SET)
guancli fetch POST /api/directory \
  '{"name":"warehouse_v2","parentDirId":"<parent>","dirType":"ETL"}'
guancli fetch POST /api/directory \
  '{"name":"warehouse_v2","parentDirId":"<parent>","dirType":"DATA_SET"}'

# 3. Save & execute
guancli fetch POST /api/etl/direct-save --stdin < payload.json
guancli fetch POST /api/etl/execute '{"dataFlowId":"<id>"}'

# 4. Real error diagnosis (KEY! don't trust status:FINISHED)
guancli fetch GET /api/task/<taskId> | jq '.response.result.error'
```

### Part C: Custom chart

```javascript
// Guandata runtime real signature (the first arg is NOT the DOM root!)
function renderChart(data, clickFunc, config, helpers) {
  // Common data shape:
  // [[ {name:"payload_json",data:["{...}"]}, {name:"report_date",data:["2026-03-18"]} ]]

  // Critical: if JSON.parse(payload_json) throws Unterminated string
  //  → diagnose as "data pipeline truncation", fix the data side (split into columns)
  //  → DO NOT pile on frontend compatibility hacks
}

new GDPlugin().init(renderChart);
```

---

## 📁 Directory Structure

```text
majia-guanyuan/
├── SKILL.md                          # Main doc for AI (routing layer + Part B/C/D/E + methodology)
├── AGENTS.md                         # Codex project instructions / Hermes resolver (V1.3)
├── manifest.json                     # Tool-agnostic skill metadata (V1.3)
├── README.md                         # Chinese README
├── README.en.md                      # This file
├── CHANGELOG.md                      # Full change history
├── ATTRIBUTIONS.md                   # Credits & sources
├── LICENSE                           # MIT
├── .gitignore
├── scripts/
│   └── inject_phone_layout.py        # Part D mobile phoneLayout ZIP inject tool
├── templates/
│   └── html-dashboard/               # Part C-12 HTML application dashboard template pack (GDHTML runtime + starter modules + selector linkage patch)
└── references/                       # Deep reference docs (13 files after V3.0.0)
    ├── part-b-errors.md              # Part B 10-category error detailed fixes
    ├── part-b-payload.md             # ETL payload schema deep-dive
    ├── part-b-sdk.md                 # v2→v3 bulk refactoring SDK
    ├── part-b17-fullchain-rewrite.md # Full B-17 full-chain rewrite methodology + ExecPlan workflow
    ├── part-c-payload-json.md        # C-3 payload_json troubleshooting deep-dive
    ├── part-c-html-dashboard.md      # C-12 HTML application dashboard methodology
    ├── part-c-design-baseline.md     # Visual design baseline for HTML dashboards (V3.1.0, absorbed from design-taste-skills)
    ├── v7-page-card-publish-pipeline.md  # Part D v7 draft-release state machine + node silent traps + phoneLayout
    ├── part-e-superapp-pipeline.md   # Part E SuperApp reverse-engineering pipeline
    ├── ai-native-ads-design.md       # AI-native ADS design methodology (philosophy-layer doc)
    ├── restaurant-bi-formulas/       # ➡️ POINTER: formula library moved to standalone repo majia-huiyuan (公式库/)
    ├── custom-chart-playbook.md      # CTO Zhang Jin's full custom chart playbook (V1.1)
    ├── etl-rewrite-original.md       # CTO Zhang Jin's SmartETL rewrite experience (V1.1)
    ├── execplan-spec.md              # OpenAI Codex ExecPlan specification (V1.2)
    └── agents-rule.md                # OpenAI Codex minimal scheduling rule (V1.2)
```

---

## 🎯 Routing quick-ref: standard work to the official family, hard bones to the right Part

| User request | Goes to |
|---|---|
| "Show February revenue by city" / "Make a pivot table" / "Delete this card" | 🧭 Official family (`guancli` / `guanvis`) |
| "Create a standard ETL" / "Import a dataset" / "Create a data connection" | 🧭 Official family (`guanetl` / `guands`) |
| "Scan our BI ETLs and tell me what can be deleted" / "ETL circular dependencies?" | **B** |
| "How to fix direct-save errors" / "Is this field cut safe to remove?" | **B** |
| "Rewrite this SmartETL chain as pure SQL" / "Replica page verification / card-level comparison" | **B-17** |
| "How to write conclusions for empty upstream snapshots" / "Diff tracking — SQL bug or execution timing?" | **B-17** |
| "30+ table multi-day project — give me an ExecPlan skeleton" | **B-17.11** |
| "Custom chart script not running / payload_json error" / "Fixed card misaligned / overlay leaks across routes" | **C** |
| "More advanced / application dashboard / selector won't link to custom chart dataView" | **C-12** |
| "v7 page+card stuck on 60004 draft page" / "How to inject mobile phoneLayout" | **D** |
| "form schema-creation API not exposed by scaffold" / "LLM bridge throws ILLEGAL_JSON_RES" | **E** |
| "Connect AI to existing BI — govern or rebuild?" / "How to design AI-native ADS" | **Methodology** |
| "How to compute repurchase / avg ticket / RFM / comp-store growth" | **Restaurant formulas** |

---

## 👤 Author / Contact

**Majia (@maojiebc)** · 超级马甲 (Super Majia)

If this skill helps you, find me on any of these channels — happy to chat about field experience, take feature requests, hear bug reports, or trade notes on user operations / data platforms / BI engineering work:

| Channel | Link |
|---|---|
| 📧 Email | [m9224@163.com](mailto:m9224@163.com) |
| 🐙 GitHub | [github.com/maojiebc](https://github.com/maojiebc) |
| 🪝 ClawHub | [clawhub.ai/p/maojiebc](https://clawhub.ai/p/maojiebc) |
| 🐦 X | [@maojiebc](https://x.com/maojiebc) |
| 📕 Xiaohongshu | [Super Majia](https://xhslink.com/m/4fQMJeHHWKC) |
| 📰 WeChat Official Account | **超级马甲** |

> Built from 14 years of user-operations work, hands-on Guandata BI in production, and 60+ verified ETL write operations.

---

## ❤️ Credits & Attribution

This skill stands on the shoulders of multiple predecessors and experience contributors. Detailed credits in [ATTRIBUTIONS.md](./ATTRIBUTIONS.md):

- **[guandata-bi @ ClawHub](https://clawhub.ai/skills/guandata-bi)** — The original general-purpose Guandata BI skill that inspired this project
- **[zhengyuhe123/guandata](https://github.com/zhengyuhe123/guandata)** — Original guandata GitHub project
- **小小郑3号 · guandata70** — Guandata 7.0+ adapter (draft/release mechanism), the direct predecessor of Part A
- **CTO Zhang Jin (张进, Guandata BI)** — Core contributor of Part B-17 (SmartETL full-chain rewrite methodology) and Part C (custom chart dev & debugging)
- **OpenAI Codex** — V1.2 borrows the [ExecPlan specification](./references/execplan-spec.md) (self-contained living docs + four-section project management structure), used to track multi-day, 30+ table SmartETL rewrite engineering work
- **maojiebc (马甲)** — Part A/B integration and 60+ ETL write empirical records

> Without the open-source spirit of ClawHub / Zhang Jin / Xiao Xiao Zheng 3hao / OpenAI Codex, this skill wouldn't exist.

---

## 📋 Version History

**Latest: V3.1.7** (2026-07-12) — **restaurant BI formula playbook moved out to the standalone repo [majia-huiyuan](https://github.com/maojiebc/majia-huiyuan)**, merged with the coffee-chain simulated data platform (54 datasets / 25 ETLs / 12 dashboards, formerly examples/workshop513) into one "open-sourced membership-ops playbook" project with an AI-agent-friendly layer (llms.txt / AGENTS.md). Pointer READMEs remain at references/restaurant-bi-formulas/ and examples/; all SKILL.md formula routes now point to the new repo. Division of labor: **tools & pitfall handbooks in guanyuan, data & formulas in huiyuan**. Playbook migrated verbatim — moat untouched.

**V3.1.6** (2026-07-10) — **official family 07-08/07-10 version alignment · family grows 5→6**. guanskill 0.1.10→**0.1.12**: **guanmetric 0.1.1 joins the family** (metric create/edit/delete + metric projects/dirs + public dimensions split out of guancli; `template normalize` standardizes customer metric Excel sheets), guancli→**1.0.39** (`etl get` shows **effective schedule state**, avoiding stale-trigger misreads after `schedule --disable` + workflow resource queries + metric capability narrowed to read-only), guanvis→**0.1.30** (**checkout live pages into a local project** for edit/diff/write-back + dynamic dimensions/metrics/split charts + pack/preview/lint diagnostics), guanetl→**0.1.19** (**new `move`** + **`run --run-upstream` topological upstream-chain execution** + 40001 wait-for-running + JOIN key-type warning), guands→**0.1.19** (dataset **append/clean data** + **schema sync** + batch calculated fields + form-to-dataset), guanwf→**0.1.7** (offline dev + **dependency analysis/execution plan** for unified-schedule orchestration). Routing table gains a guanmetric row + architecture diagram redrawn for six + manifest baseline pins synced. Moat untouched.

**V3.1.5** (2026-07-01) — **official family 07-01 version alignment**. guanskill 0.1.8→**0.1.10**: guancli→**1.0.38** (**new Personal Access Token (PAT) login** for automation/CI/headless auth), guanvis→**0.1.29** (**selector cascade linkage** + selectors placeable on canvas + **custom-chart dataView as click-linkage source / page selectors can filter custom charts** + table-card dimension-only + compare-card current/comparison period), guanetl→**0.1.18** (clearer ETL directory-type diagnostics), guands→**0.1.18** (`dataset import` per-column type + `replace-data` encoding/delimiter); guanwf **0.1.6** unchanged. Routing table + Part C-12 (guanvis 0.1.29 official selector-linkage note) + manifest baseline pins synced. Moat untouched.



Full changelog: [CHANGELOG.md](CHANGELOG.md) or [GitHub Releases](https://github.com/maojiebc/majia-guanyuan/releases).

## 🤝 Contributing

Issues and PRs welcome:

- 🐛 Found an error not in the manual? Submit an issue with error message + payload + real error (`/api/task/<id>.response.result.error`)
- 📝 Tested a new BI HTTP API endpoint? Add it to Part B's API map
- 🎨 New custom chart scenario? Add it to Part C
- 📚 Doc improvements, translations, typo fixes — PR directly

---

## 📄 License

[MIT](./LICENSE) © 2026 [maojiebc](https://github.com/maojiebc) and contributors.

This skill is built upon other open-source works. See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for detailed attribution.
