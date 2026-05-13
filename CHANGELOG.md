# Changelog

All notable changes to **majia-guanyuan** are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/) — see SKILL.md for
the project's specific patch / minor / major rules.

## [2.1.0] — 2026-05-13

### Added

- **`references/internal-nexus-install.md`** — 通用"内网 Nexus tarball 安装手册"，
  覆盖观远官方 `guan*-skill` 系列从微信传 tarball 到 `<bin> install-skill` 的
  四步法。**重点收录 `xattr -dr com.apple.quarantine` 这一步**——2026-05-13
  装 `guanvis-skill@0.1.13` 时第一次 `--help` 直接 SIGKILL 的根因，没有任何
  stderr 输出，纯靠 `xattr -l` 才查出 `com.apple.quarantine: 0082;...;WeChat;`
  标记。新人/未来的自己肯定再撞，必须沉淀。
- SKILL.md 顶部新增 **"V2.1 升级提示"** 段——明确 `guanvis-skill@0.1.13` 已通过
  观远内网 Nexus 私服 (`https://app.mayidata.com/nexus/repository/guandata-web/`)
  上线，公网 npm 仍 404；其他 4 个兄弟 skill (`guanetl-skill / guands-skill /
  guanexport-skill / guanadmin-skill`) 公网 + 内网均未确认发包。
- SKILL.md "写卡片前必读" 段顶部新增 **V2.1 路由提示**：标准 30+ 图表/Page
  装配需求优先路由到 `guanvis-skill` 的 JS DSL（`card_*.js` / `page.js`），
  本 skill 的 `create-and-get` / `create-card` 保留作为 fallback + payload
  底层参考。超出官方组件能力的视觉定制（双 Y 轴叠加、ECharts 自定义渲染、
  图例改圆点、tooltip HTML 重写、固定卡片/overlay）继续走 Part C。

### Changed

- "与官方 `guancli` skill 的共存" 段从**两件套对照表**升级为**三件套分工表**
  （`guancli` 1.0.19 / `guanvis-skill` 0.1.13 / `majia-guanyuan` 2.1.0），
  每行明确版本、主要角色、何时触发。原表述"5 个兄弟 skill 2026-05-12 全部
  404"修正为"vis 已经能通过内网 Nexus 装，其他 4 个仍 404"。
- Part B 顶部的"全部 404"⚠️警告同步更新，指向 `internal-nexus-install.md`
  作为 `guanvis-skill` 的安装路径，Part B 的 ETL 写入/direct-save/execute
  路径保持不变（等 `guanetl-skill` 落地后再考虑路由切换）。
- SKILL.md frontmatter `metadata.version` `2.0.1` → `2.1.0`；
  `manifest.json` `version` 同步；`package.json` `version` + description
  补充 V2.1 摘要；标题行、作者签名行、"版本记录"段、References 目录索引
  全部对齐到 V2.1.0 / 2026-05-13。
- SKILL.md 作者签名行新增**可选依赖**标记：`@guandata/guanvis-skill@^0.1.13`
  （内网 Nexus 私服分发），与必装的 `@guandata/guancli@^1.0.19` 区分。

### Notes

- **没改 references/ 已有 12 个文件的核心内容**——只新增 `internal-nexus-install.md`。
  Part A 命令面、Part B-17 SmartETL 改写方法论、Part C 自定义图表 playbook、
  ExecPlan 规范、张进 CTO 原文等保持原样。
- **没改 `npm engines` / dependencies**——V2.1 不强制依赖 `guanvis-skill`，
  它是可选增强，没装也不影响 Part B/C 全部功能。
- V1.x 历史叙事（"Renamed guandata70 → guanyuan-majia" 等）继续完整保留。

## [2.0.1] — 2026-05-12

### Changed
- `manifest.json` `displayName`: `"Majia-Guanyuan · Guandata BI Skill"` → `"观远 BI · 马甲实战版"`. ClawHub 卡片大标题从该字段读取，旧值在卡片上显示为英文 "Majia Guanyuan"，与品牌"超级马甲"的中文调性不一致，统一为中文营销名。
- `slug` 保持 `majia-guanyuan`（URL / `npx` / `gh skill install` 仍走该名），仅展示名变更。

## [2.0.0] — 2026-05-12

### BREAKING / Renamed
- **Skill renamed `guanyuan-majia` → `majia-guanyuan`** to align with the
  `majia-*` family naming style (`majia-ota-skill`, `majia-video-png`,
  `majia-txt`, etc.). Three coordinated renames:
  - npm package: `@supermajia/guanyuan-bi` → `@supermajia/majia-guanyuan`
  - GitHub repo: `maojiebc/guanyuan-majia` → `maojiebc/majia-guanyuan`
    (GitHub auto-redirects the old URL; existing clones continue to work
    until users update `git remote set-url origin`)
  - npm bin: `guanyuan-bi` → `majia-guanyuan`
  - All file paths in `manifest.json` `compatibility.installPath`, README
    examples, and SKILL.md install snippets updated.
- Historical narrative in CHANGELOG / README still references the legacy
  names for accuracy (e.g. V1.0 "Renamed guandata70 → guanyuan-majia"
  preserved verbatim).

### Added — command surface aligned with `@guandata/guancli@1.0.19`
- **`guancli chatbi`** documented in `references/guancli-commands.md` —
  `list-theme` / `query` (L1 theme query) / `insight` (L2 root-cause).
  ⚠️ Our test BI instance returns `5001 No static resource` because the
  ChatBI Public API module is not deployed there; the commands are
  reachable on instances with the module enabled.
- **`guancli app`** — `create` / `publish` for SuperApp templates.
- **`guancli status`** — top-level connectivity probe, distinct from
  `auth status` (which only inspects the local token).
- **Multi-environment auth** — full `auth list / use / modify / remove /
  whoami / detect-domain` matrix + `--profile` flag + `GUANCLI_PROFILE`
  env var documented. Token persistence path
  `~/Library/Application Support/guancli/config.json` made explicit.

### Added — SKILL.md routing & coexistence
- New section in SKILL.md Part A: "guancli V1.0.19 新能力（V2.0 同步）"
  routes agents to the new chatbi/app/status/auth blocks.
- New section: "与官方 `guancli` skill 的共存" — clarifies that the
  official `guancli` skill (installed via `guancli install-skill`, 2026-05-11)
  is read-only + ChatBI, while `majia-guanyuan` covers write operations
  + methodology + 60+ ETL war stories. Guidance for resolving double-trigger
  ambiguity by removing `~/.claude/skills/guancli`.
- Part C 章节顶部标注社区平行项目 `@wubaoqi/guan-chart-kit` (React+ECharts
  components for Guandata) + `@wubaoqi/guan-chart-kit-usage-skill` — both
  published 2026-04-29 by Guandata maintainer wubaoqi. Notes the routing
  difference (component vs HTML/JS injection).

### Changed
- `Node.js engines` requirement raised from `>=14.0.0` to `>=20.0.0` to
  match `@guandata/guancli`'s installation guide (Node 20+, 22+ recommended).
- Part B intro note rewritten: previously called out only `guanetl-skill`
  as missing from npm; now names all five sibling skills (`guanetl-skill`
  `/ guanvis-skill / guands-skill / guanexport-skill / guanadmin-skill`)
  with the 2026-05-12 npm 404 verification timestamp.
- `package.json#description` and `manifest.json#displayName` updated to
  reference V2.0 rename.

### Deferred to next release
- **Migrate `scripts/guandata.py` auth to guancli token** — the Python
  client still maintains its own `login() → self._token` flow (2789 lines,
  fully independent of guancli's token storage). Removing the
  `password` field from `config.json` requires reworking `_relogin_if_needed`
  to read `profiles.<name>.uIdToken` from
  `~/Library/Application Support/guancli/config.json`. Scoped out of V2.0
  to keep the release pure-documentation / pure-metadata.
- **`config.example.json` password field removal** — paired with the above.

### Verified
- `npm install -g @guandata/guancli` → 1.0.19 on Node 25.6.1 ✅
- `guancli auth status` shows valid uIdToken, password mode, 401 auto-relogin ✅
- `guancli chatbi list-theme` → 5001 (instance limitation, command shape correct) ✅
- All keyword renames: 0 residuals for `guanyuan-majia`,
  `@supermajia/guanyuan-bi`, `maojiebc/guanyuan-majia`.
- Historical narrative restorations: 8 entries verified manually
  (V1.0 rename, V1.4.0 npm path, V1.5.1 npm-to-git transition).

## [1.7.3] — 2026-05-11

### Added
- **Author/contact block appended to `SKILL.md` end** — ClawHub renders
  `SKILL.md` (not `README.md`) on the skill listing page; without this
  the 6-row channel table that v1.7.2 added to `README.md` wasn't
  visible to ClawHub visitors. Block sits after all agent instructions
  so it doesn't pollute the active context during invocation.

Follows `majia-ota-skill` v0.6.1 two-placements rule.

## [1.7.2] — 2026-05-11

### Changed
- **Author/contact section consolidated** — removed the duplicate `## 作者` /
  `## Author` block at the bottom of `README.md` and `README.en.md` (it duplicated
  channels already covered by the canonical `## 👤 作者 / 联系` template above).
- **Skill version badge** synced from stale `v1.6.0` to `v1.7.2`.

### Fixed
- **ClawHub link** in author/contact template — `https://clawhub.ai/maojiebc`
  → `https://clawhub.ai/p/maojiebc` (followed `majia-ota-skill` v0.5.2 template fix).

## [1.7.1] — 2026-05-11

### Security / Sanitization
- **Removed all business-identifying data** from public docs and code examples.
  Previously, docstring examples in `scripts/guandata.py`, multiple references
  pages, `docs/architecture.svg`, and the B-15 ID quick-reference contained
  real customer brand name, real store name, real internal directory IDs, and
  customer-specific field naming (`销售额`, `实收金额`, `客户数` etc.).
  All replaced with generic equivalents (`销售额`, `实收金额`, `客户数`, `示例门店A`,
  `城市A/B`, `<v2_etl_dir_id>` placeholders). No code behavior change.

## [1.7.0] — 2026-05-11

### Added
- **Token disk persistence** — JWT saved to `.cache/token.json`, survives across
  process restarts. Three-tier auth cascade: disk cache → in-memory → API login.
  Eliminates redundant `/public-api/sign-in` calls on every invocation.
- **401/403 auto-retry** — `get_card_data` now catches server-side token rejection,
  force re-authenticates, and retries the request once before failing.
- **CSV metadata sidecar** — `get-card-data` and `create-and-get` now emit a
  `_meta.json` companion alongside each cached CSV, containing field-level metadata
  (name, type, metaType, fieldId, granularity, alias, annotation, role).
- **`status` command** — one-shot diagnostics: config, token validity, cache stats.
- **`set-token` command** — paste a JWT from the browser to bypass credential login.
- `extract_field_metadata()` static method on `GuandataClient`.
- `ensure_auth()` public method replacing explicit `login()` in all 13 cmd functions.

### Changed
- All cmd functions now call `ensure_auth()` instead of unconditional `login()`.
- Command skeleton in SKILL.md updated from 8 to 10 commands.

## [1.6.0] — 2026-05-10

### Added
- `.claude-plugin/marketplace.json` — enables Claude Code plugin marketplace
  install (`/plugin marketplace add maojiebc/majia-guanyuan`). Adds a fourth
  install path alongside `gh skill`, `npx skills`, and clone+copy.
- `CHANGELOG.md` — this file. Consolidates v1.1 → v1.6.0 history that was
  previously scattered across commit messages and only two GitHub Releases.
- `docs/architecture.svg` — a one-page Part A / B / C capability map embedded
  near the top of the README, so the project's three-pillar story is visible
  before a reader scrolls 22 KB of text.
- README "作者 / 联系" section with email, GitHub, ClawHub, X, 小红书,
  公众号 channels.
- `manifest.json` `contact` block (email + GitHub + ClawHub) so non-README
  consumers (registries, agents, indexers) can reach the author.
- LICENSE copyright line: 中文署名 "超级马甲" alongside `maojiebc`.

### Changed
- README signal density: visual diagram pulled the 60+ ETL stories /
  10 报错手册 / 30 条法则白皮书 numbers out of the body into a glance.

## [1.5.3] — 2026-05-09

### Added
- ClawHub scanner-warning documentation (one of the publish-time warnings is
  expected and explained in SECURITY.md / README).

### Changed
- Distribution metadata polish (manifest, badges, attributions).

## [1.5.2] — 2026-05-09

### Added
- ClawHub initial publication. Skill is now installable via ClawHub /
  OpenClaw registry in addition to GitHub.

## [1.5.1] — 2026-05-09

### Changed
- npm path simplified — git is the single source of truth. Skill is no longer
  published as an npm package; `bin/install.js` and `npx github:` flows still
  work for one-line install.

## [1.5.0] — 2026-05-09

### Changed
- **Progressive disclosure refactor.** `SKILL.md` reduced from 2087 → 913
  lines (-56%) by moving deep references into the `references/` directory,
  loaded on demand. The frontmatter description and the top-level pillars
  stay in context; the war-story detail is fetched only when the user's
  task hits that case.

### Fixed
- README / AGENTS.md / ATTRIBUTIONS.md re-synced to v1.5.0 reality after the
  refactor.

## [1.4.0] — 2026-05-09

### Added
- npm package path: `npx @supermajia/guanyuan-bi install` one-liner for users
  who prefer node-based install over `gh skill` or clone.

## [1.3.1] — 2026-05-09

### Fixed
- External-review patch:
  - Code-fence consistency across SKILL.md
  - DELETE-gate language (delete data-source before etl)
  - Task-traversal fix in audit walker

## [1.3.0] — 2026-05-09

### Added
- **Tool-agnostic compatibility.** Verified install paths for
  Claude Code / OpenClaw / Codex / Hermes(gbrain). `AGENTS.md` added at repo
  root for Codex + Hermes projects that read AGENTS.md as resolver.

## [1.2.0] — 2026-05-09

### Added
- **OpenAI Codex `ExecPlan` spec adopted** for SmartETL rewrite engineering.
  All v2→v3 batch refactor flows now produce ExecPlan-style 4-deliverable
  outputs (plan / sql / verify / dispatch).

## [1.1.0] — 2026-05-09

### Added
- Initial public release. Bundled three pillars:
  - **Part A** — Data query + card creation (26 chart types, 26 aggregations,
    13 filter operators, 6 date granularities)
  - **Part B** — ETL governance + write (11 实测 endpoints, 5-layer
    ODS/DIM/DWD/DWS/APP architecture, dual-source field-usage audit,
    direct-save schema, task-error真错误定位, delete topology)
  - **Part C** — Custom chart development & debugging (renderChart 4-arg
    runtime contract, 5 data shapes, payload_json truncation handling,
    z-index baselines, MutationObserver loop traps)
  - 10 类 ETL 高频报错修复手册
  - CTO 张进的全链路重写方法论（4 件交付 + 8 条硬规则 + 5 步标准工作流）

[2.0.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v2.0.0
[1.7.1]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.7.1
[1.7.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.7.0
[1.6.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.6.0
[1.5.3]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.5.3
[1.5.2]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.5.2
[1.5.1]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.5.1
[1.5.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.5.0
[1.4.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.4.0
[1.3.1]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.3.1
[1.3.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.3.0
[1.2.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.2.0
[1.1.0]: https://github.com/maojiebc/majia-guanyuan/releases/tag/v1.1.0
