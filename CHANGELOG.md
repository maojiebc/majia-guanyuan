# Changelog

All notable changes to **majia-guanyuan** are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/) — see SKILL.md for
the project's specific patch / minor / major rules.

## [2.1.2] — 2026-05-14

### Fixed

- **`package.json#files`** —— 补上遗漏的 `templates/` 条目。V2.1.1 引入的
  `templates/html-dashboard/` 模板包（GDHTML runtime + 2 起手模块 +
  `patch_selector_linkage.js`）在 V2.1.1 时因 `files` 字段没列 `templates/`，
  导致 `npm publish` 打出来的 tarball 不包含整个目录 —— **通过 `npm install
  @supermajia/majia-guanyuan` 安装的用户拿不到任何模板文件**。这次补上后，
  npm 安装路径也能拿到完整的 V2.1.1 内容。

### Notes

- **零内容变更** —— V2.1.2 相比 V2.1.1 只差一行 `"templates/"`（加进 files
  数组）+ 版本号同步。`references/part-c-html-dashboard.md` /
  `templates/html-dashboard/` / `references/guancli-commands.md` 等所有
  V2.1.1 引入的内容保持原样。
- **其他安装路径不受影响** —— GitHub clone / `gh skill install` /
  ClawHub install / `npx github:maojiebc/majia-guanyuan install` 在 V2.1.1
  时就已经拿到完整 `templates/`（它们走 git 而不是 npm tarball）。**只有 npm
  install 用户需要装 2.1.2 才能拿到模板包**。
- **npm 用户建议直接跳过 2.1.1**：V2.1.1 的 npm 包是不完整的，从
  V2.1.0 升到 V2.1.2 等同于完整拿到 V2.1.1 的所有内容 + npm files 修正。

### How this was caught

`npm pack --dry-run` 在 V2.1.1 上线后对比 35 个 tarball 文件清单时发现 ——
references/ 都在但 templates/ 整个目录缺失。GitHub Release / ClawHub
package id `k97adk7c2m92w508gpskxv3dw986p8xk` / 4 个本地 agent 副本均
正常含 templates/。Hotfix 路线选择 patch-of-patch (v2.1.2) 而非 force-push
v2.1.1 tag，以避免已 clone 用户的 ref 漂移。

## [2.1.1] — 2026-05-14

### Added — Part C-12：HTML 应用化看板生成

- **`references/part-c-html-dashboard.md`**（~360 行）— 完整方法论 15 节，把
  2026-05-14 在 `app.guandata.com` 上 `<demo-domain>` 实例的 `马甲—测试`
  页面实测沉淀的 18 个核心要点固化为可执行手册（所有资源 ID 与销售数值已脱敏
  为占位符与粗粒度）：
  - 何时切到 HTML 应用看板（用户说"更高级/应用化/不限标准看板"的触发词清单）
  - 6 模块默认故事线（总览 → 趋势 → 结构 → 四象限 → 行动队列）
  - **SDK vs ECHARTS_LITE 决策**（混排型 / 经营叙事一律走 `CustomChartSubType.SDK`）
  - **dataView contract** —— HTML 模块的真实数据接口，列式 `data[N][i] = {name, data}`
  - 共享 runtime `GDHTML` 的 12 个 API（safeCols / rows / col / money / yuan /
    pct / esc / bar / stacked / lineSvg / scatterSvg / mount）
  - **24 字符 alphanumeric ID 严格校验** + dataView 不跨 custom chart 复用
  - **selector → custom chart dataView 联动 descriptor patch**（弥补 `guanvis-skill`
    DSL `.linkToAll()` 的盲区，绕开 `/api/card/.../edit/session` 的"只能在草稿页面
    执行" 60004 报错）
  - 12 步 pack → patch → upload → verify 工作流（含 zsh `noglob` / `find -delete`
    glob 兼容、`._package.zip` 不固定名解决方案）
  - **字段粒度后缀兼容**（`月份` / `月份 (月)` / `年月` / `year_month` 互认）
  - 四层 API 验收清单（打包 / Page 卡数 / custom chart 内容 / dataView 出数 +
    selector 联动），明确"浏览器截图不可靠（iframe / GPU 渲染黑屏），API 回读
    为主验收"
  - 12 类常见错误表（Card ID 25 字符、resource ID already used、selector 不影响
    HTML 模块、`/api/card/.../edit/session` 60004、`fromjson` object cannot be parsed、
    趋势图月份列空、`card data --pg-id` 不存在、中文 jq 字段报错、zsh `no matches
    found`、`._package.zip`、Chrome 截图黑屏、`data[0]` undefined）

- **`templates/html-dashboard/`** —— 起手模板包：
  - `charts/html_common.js` — GDHTML 共享 runtime（safeCols / money / yuan / pct /
    esc / bar / stacked / lineSvg / scatterSvg / mount + 粒度后缀别名表）
  - `charts/html_base.css` — 共享样式（gd-card / gd-kpi / gd-list / gd-table /
    gd-tag / gd-grid-2/3/4 响应式）
  - `charts/html_executive.html` + `.js` — 经营驾驶舱（KPI 行 + 城市 Top + 低效/
    样板门店双列）
  - `charts/html_trend.html` + `.js` — 月度渠道趋势（折线 + 12 个月堆叠条 + 图例）
  - `scripts/patch_selector_linkage.js` — CLI 参数化 patch 脚本（`--selector
    <name>:<fdId>` + `--targets <cdId,...>`），自动写 `descriptor.json.bak`
    备份，兼容 `card.settings` 的 string / object 两种形态
  - `README.md` — 模板使用说明 + 起步命令

### Changed

- SKILL.md frontmatter `description` 扩词，加入 `HTML 看板/应用化/更高级/
  不限标准看板` 等 V2.1.1 触发词，让 agent 在用户说"更高级"时主动路由到本
  skill 而不是按标准 BI 看板交付。
- SKILL.md Part 选择表新增 Part C-12 路由行。
- SKILL.md Part C 末尾新增 **C-12 章节**（路由说明 + 两条不能跳的坑 +
  references/templates 链接）。
- SKILL.md References 目录新增 `part-c-html-dashboard.md` 索引行。
- **`references/guancli-commands.md`** —— 修正 `card preview` 命令面（V2.1 起
  没有 `--pg-id` flag，老写法 `card data <id> --pg-id <pg_id>` 已废弃），
  新增 `.data // .response // .` jq 兼容速查、`settings` string/object 双形态
  jq 兼容、中文字段 bracket 语法（`jq -r '.[0]["销售额"]'`）。
- SKILL.md 标题行、frontmatter `metadata.version`、`manifest.json#version`、
  `package.json#version` 与 description、README / README.en 徽章版本号、
  "版本记录" 段全部对齐到 V2.1.1 / 2026-05-14。

### Notes

- **没改 v2.1.0 新建的 `internal-nexus-install.md`** —— guanvis-skill 内网安装
  路径保持不变。
- **没改 Part C-1 ~ C-11**（既有的"既有页面注入 hack"路线）—— 与 Part C-12
  的"从零生成 HTML 应用看板"路线并行存在，共享 runtime 契约
  `renderChart(data, ...)`、dataView 取数模型、API 验证规则，但工具链不同
  （C-11 是 runtime DOM hack，C-12 是发布期 DSL + descriptor patch）。
- **没改 dependencies / engines** —— V2.1.1 是 patch 版本，纯文档与模板增量；
  `templates/html-dashboard/` 不需要新 npm 依赖（patch_selector_linkage.js
  纯 Node fs/path，无外部依赖）。

### Verified

- 6 个 HTML 模块全量上线（`guanvis-skill upload` 报 `42 succeeded`）✅
- 目标页卡数 `41`、`城市` / `门店类型` selector 目标从 11 扩到 22 ✅
- HTML dataView 全量 ~7.37 亿 / `城市 EQ 上海` 过滤后 ~6800 万 /
  `门店类型 EQ 交通枢纽店` 过滤后 ~9700 万 ✅（粗粒度，原始精确值已脱敏）

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
