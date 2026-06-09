# majia-guanyuan · 观远 BI 实战增益层 · 马甲实战版

> **官方全家桶之上的实战增益层** —— 观远官方 BI 全家桶（`guancli` 查数 / `guanvis` 建卡发布截图 / `guanetl` ETL / `guanwf` 数据流 / `guands` 数据源）2026-06-03 全部公网化后，本 skill **不再自造轮子**：标准查数/建卡/ETL/数据集 CRUD 一律**路由官方全家桶**，只攻官方 DSL/命令够不着的硬骨头 —— ETL 治理判断 + 引擎报错手册、自定义图表注入 + descriptor patch、v7 状态机绕过、SuperApp 反向工程、AI-native ADS 方法论、餐饮公式库。
> 兼容 **Claude Code** · **OpenClaw** · **Codex** · **Hermes (gbrain)** 等所有支持 SKILL.md 的 agent 工具。
> 60+ 张 ETL 创建/重构/修复 + 治理扫描 + 自定义图表注入排障的真实战场记录。

[![Skill Version](https://img.shields.io/badge/skill-v3.0.5-blue)](./SKILL.md)
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

**[English README](README.en.md)** · 中文文档 ↓

---

## 概述

**V3.0.0 重定位**：观远官方已把"查数 / 建卡 / ETL / 数据流 / 数据源 / 截图 / 管理"做成公网全家桶（`npm i -g @guandata/guanskill`）。本 skill 从早期"自造全栈 + fallback"**彻底重构为「官方全家桶之上的实战增益层」**——退役 2789 行自造 HTTP 客户端 `guandata.py`、删 ~1600 行死代码、砍掉所有镜像官方命令的章节。

两层分工：
- **🧭 路由层**：标准查数 / 建卡 / ETL / 数据集 CRUD 一律**路由给官方全家桶**（`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands`），本 skill 不再自造这些轮子。
- **💪 实战增益层（本 skill 主体）**：只攻官方 DSL/命令覆盖不到的硬骨头——3 大支柱：① **治理与引擎踩坑**（Part B ETL 整库治理判断 + 10 类引擎报错手册 + 双源审计 + B-17 全链路重写）② **前端注入与发布状态机**（Part C 既有页自定义图表注入排障 + Part C-12 HTML 应用化看板 descriptor patch + Part D v7 草稿-发布状态机绕过 + phoneLayout）③ **反向工程与方法论**（Part E SuperApp 开放应用反向工程 + AI-native ADS 数据架构方法论 + 餐饮 BI 公式实战库）。

<p align="center">
  <img src="https://raw.githubusercontent.com/maojiebc/majia-guanyuan/main/docs/architecture.png" alt="majia-guanyuan v3.0.5 · 马甲实战版 架构图：官方全家桶路由层（guancli 查数 / guanvis 建卡发布截图 / guanetl ETL / guanwf 数据流 / guands 数据源，2026-06-03 全部公网化）+ 本 skill 实战增益层 3 支柱——① 治理与引擎踩坑（Part B ETL 整库治理判断 + 10 类引擎报错手册 + 双源字段审计 + B-17 全链路重写/ExecPlan）② 前端注入与发布状态机（Part C 既有页自定义图表 HTML/JS 注入排障 + Part C-12 HTML 应用化看板 descriptor patch 联 dataView + Part D v7 草稿-发布状态机绕过 + customChart autoBootstrap + 移动端 phoneLayout ZIP inject）③ 反向工程与方法论（Part E SuperApp 开放应用反向工程 + form 建表 + LLM 中转 ILLEGAL_JSON_RES 三路径解析 + AI-native ADS 设计方法论 + 餐饮 BI 公式实战库）" width="100%"/>
</p>

| 层 | 你想做 | 走 |
|---|---|---|
| 🧭 **路由层** | 查数据、建卡、出报表、标准 ETL / 数据集 CRUD | 交给官方全家桶（`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands`） |
| 🅱️ **Part B** | ETL 整库治理判断 + 引擎报错手册 + 双源字段审计 | "扫一遍 ETL 看哪些可以删" / "direct-save 报错怎么修" / "字段裁剪安不安全" |
| 🅱️ **B-17** | 全链路重写方法论 | "把这条 SmartETL 链整个改成 SQL 版" / "副本页验收 / 卡片级对比" |
| 🆎 **Part C / C-12** | 自定义图表注入排障 + HTML 应用化看板 | "payload_json 解析失败" / "固定卡片错位" / "更高级/应用化看板" |
| 🇩 **Part D** | v7 草稿-发布状态机绕过 + phoneLayout | "v7 page+card 被 60004 卡住" / "移动端 phoneLayout 怎么注入" |
| 🇪 **Part E** | SuperApp 开放应用反向工程 | "form 建表脚手架没暴露" / "LLM 中转 ILLEGAL_JSON_RES" |
| 🧠 **方法论 / 公式库** | AI-native ADS 判断 + 餐饮 BI 公式 | "想给现有 BI 接 AI，该治理还是该重搭" / "复购率/RFM/客单价怎么算" |

---

## ✨ 效果

### 🧭 路由层（标准活交给官方全家桶）

- ✅ 标准查数 / 同环比 / Top N / 归因 / ChatBI 问数 → `guancli`
- ✅ 74 种图表 JS DSL 建卡 + Page 装配 + 服务端截图出 PNG → `guanvis`
- ✅ 单个 ETL 新建/改/lint/preview/save/run/schedule/delete → `guanetl`
- ✅ 工作流数据流 Dataflow（DB 直连回写、增量输出）→ `guanwf`
- ✅ 数据源 + 数据集 CRUD（建连接、create-db/import/replace-data）→ `guands`
- ⚠️ 管理员级操作（dynamicCode / svc SQL）：`guanadmin` **2026-06-04 已退出全家桶**（需另装 standalone 或走 BI UI）
- 一句话路由：**标准查数 → `guancli`；标准建卡/发布/截图 → `guanvis`；标准 ETL → `guanetl`；数据流 → `guanwf`；数据源/数据集 → `guands`。** 遇到官方够不着的字段/报错/状态机/反向工程/业务口径 → 回到本 skill 对应 Part。

### ETL 治理写入侧（Part B）

- ✅ **11 个已实测 BI HTTP API endpoint**（POST/GET/DELETE/OPTIONS 全覆盖）
- ✅ **批量治理扫描**：构建依赖图 → 检测循环依赖 → 计算复杂度 → 8 维 ETL + 4 维字段去留判断
- ✅ **ODS/DIM/DWD/DWS/APP 五层架构**重组指引
- ✅ **字段使用度双源审计**（page + etl 双源 grep，避免**仅看板会高估 8 倍可裁字段**）
- ✅ **POST /api/etl/direct-save** create + update 同接口的完整 payload schema
- ✅ **task error 真错误定位**（`status:FINISHED` 是任务触发结果，真错误在 `GET /api/task/<id>.response.result.error`）
- ✅ **删除拓扑**：`DELETE /api/data-source/` 必须先于 `DELETE /api/etl/`
- ✅ **v2→v3 批量改造 SDK**：`transformV2ToV3()` 7 步重写 + 节点 ID 重映射
- ✅ **CTO 张进的全链路重写方法论**：4 件交付 + 8 条硬规则 + 5 步标准工作流 + 三层验收 + 差异追踪 5 步法 + 空快照处理标准

### 自定义图表侧（Part C）

- ✅ **`renderChart` 4 参数 runtime 契约**详解（不是把第一个参数当 DOM 根节点）
- ✅ **5 种 `data` 形态**识别
- ✅ **payload_json 截断判断 3 步**（`Unterminated string` → 优先改数据方案，不堆兼容逻辑）
- ✅ **拆列推荐方案**（替代单字段长 JSON）
- ✅ **z-index 基线**（容器 8 / mask 1 / 固定卡 20）
- ✅ **生命周期管理**（URL 不匹配/编辑态/phoneView/路由离开 → 销毁注入物）
- ✅ **MutationObserver 死循环陷阱**（用低频轮询 + 精准 rect 比较替代）
- ✅ **复制页 card id 重定位**（不会显式报错，只会悄悄失效）
- ✅ **真实浏览器验收 8 项**

### 报错修复手册

- 🔧 **10 类 ETL 高频报错**：`请输入ETL名称` / `保存路径无效` / 上游运行权限不足 / 字段隐藏换行 / `<> NULL` / relativeFieldAlias 错位 / CTE 内 `;` / self-join 别名同名 / UNION 列差 / 字符串字面量与 DATE 比较

---

## ✅ 适合 / ❌ 不适合

### ✅ 适合

- 已经装了官方全家桶（`@guandata/guanskill`），想在标准命令之上补"官方够不着的硬骨头"
- 做 ETL 治理（识别循环依赖、判断字段去留、重新分层、整库扫描）
- 批量重建 ETL（30+ 张 v2→v3 改造）/ SmartETL 全链路重写 + 副本页验收 + 卡片级对比
- 自定义图表 HTML/CSS/JS 注入开发与排障 / HTML 应用化看板（descriptor patch 联 dataView）
- v7 草稿-发布状态机绕过 / SuperApp 开放应用反向工程
- 给客户做"治理 vs 重搭"判断 / AI-native ADS 数据架构提案 / 餐饮连锁 BI 业务公式
- 不会写代码但想让 AI 帮你完成上面这些事

### ❌ 不适合

- 用其他 BI 平台（Tableau / Power BI / Superset）—— 本 skill 只针对**观远 BI / Guandata**
- **只做标准查数 / 标准建卡 / 标准 ETL** —— 那是官方全家桶的活，直接用 `guancli` / `guanvis` / `guanetl`，不需要本 skill
- 完全不允许调用底层 HTTP API 的合规环境
- 没有 BI 账号 + 写权限（Part B 写入需要 ETL 创建权限 + 数据集运行权限）

---

## 🔌 兼容性 / Compatibility

本 skill **工具无关**，凡是支持 `SKILL.md` frontmatter 标准的 agent 都能加载。已在以下工具上验证：

| 工具 | 状态 | 安装路径 | 入口文件 | 备注 |
|---|:---:|---|---|---|
| **Claude Code** | ✅ 已验证 | `~/.claude/skills/majia-guanyuan/` | `SKILL.md` | 原生支持 |
| **OpenClaw** | ✅ 已验证 | `~/.openclaw/skills/majia-guanyuan/` 或 `<workspace>/skills/majia-guanyuan/` | `SKILL.md` | 大小写敏感 |
| **Codex (OpenAI)** | ✅ 已验证 | `~/.codex/skills/majia-guanyuan/` 或 `<repo>/.codex/skills/majia-guanyuan/` | `SKILL.md` + 仓库根 `AGENTS.md`（项目指令） | 见 [Codex skills docs](https://developers.openai.com/codex/skills) |
| **Hermes / gbrain** | ✅ 已验证 | `<workspace>/skills/majia-guanyuan/` | `SKILL.md` + 仓库根 `AGENTS.md`（resolver） | 见 [garrytan/gbrain](https://github.com/garrytan/gbrain) |
| **Cursor / Aider** 等 AGENTS.md-aware | 🟡 理论兼容 | 任意 | `AGENTS.md` 作项目指令 | 仅会用到路由层 + Part B/C/D/E 的 navigation pointer |
| 其他 | 🟡 通用清单 | 任意 | `manifest.json` 作工具无关元数据 | frontmatter + manifest 双保险 |

## 📦 安装

> **本仓库以 git 为唯一 source of truth**，未发布到 npm registry。但保留了一行 install 体验——通过 `node bin/install.js` 或 `npx github:` 直接走 GitHub。

### 方式 0：GitHub CLI `gh skill`（GitHub CLI 2.90.0+）

```bash
# 安装到用户级 Codex / Claude Code / OpenClaw / Qoder 等 agent
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent codex --scope user
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent claude-code --scope user
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent openclaw --scope user
gh skill install maojiebc/majia-guanyuan majia-guanyuan --agent qoder --scope user

# 安装前预览
gh skill preview maojiebc/majia-guanyuan majia-guanyuan
```

### ⭐ 方式 1：克隆 + 内置 install CLI（推荐）

```bash
# 一键克隆 + 自动安装到当前机器上所有已装的 agent 工具
git clone https://github.com/maojiebc/majia-guanyuan.git ~/majia-guanyuan
cd ~/majia-guanyuan
node bin/install.js install                  # 自动检测全装
node bin/install.js install --tool claude-code
node bin/install.js install --tool openclaw
node bin/install.js install --tool codex
node bin/install.js install --tool hermes
node bin/install.js install --tool all       # 4 个全装

# 其他命令
node bin/install.js list                     # 列出当前安装情况
node bin/install.js uninstall --tool codex   # 移除该工具下的 skill
```

### 方式 2：`npx` 直接走 GitHub URL（不需要 clone）

```bash
# 一行装，npx 自动从 GitHub 拉取并跑 bin/install.js
npx github:maojiebc/majia-guanyuan install --tool claude-code
npx github:maojiebc/majia-guanyuan install --tool all
```

**`bin/install.js` 行为**（两种方式相同）：
- 自动复制 `SKILL.md` / `AGENTS.md` / `manifest.json` / `scripts/` / `references/` / `templates/` 等到目标工具的 skill 目录
- 已装时默认跳过，要 `--force` 才覆盖
- **认证不在 skill 内**：本 skill 不再带 `config.json`——认证统一走官方全家桶的 `guancli auth login`（见下「前置依赖」）

### 方式 3：手动 `git clone` 直接放到工具 skill 目录

```bash
# Claude Code
git clone https://github.com/maojiebc/majia-guanyuan.git ~/.claude/skills/majia-guanyuan

# OpenClaw（个人级）
git clone https://github.com/maojiebc/majia-guanyuan.git ~/.openclaw/skills/majia-guanyuan

# Codex（个人级）
git clone https://github.com/maojiebc/majia-guanyuan.git ~/.codex/skills/majia-guanyuan

# Codex（项目级）
git clone https://github.com/maojiebc/majia-guanyuan.git <your-repo>/.codex/skills/majia-guanyuan

# Hermes / gbrain（workspace 级）
git clone https://github.com/maojiebc/majia-guanyuan.git <your-workspace>/skills/majia-guanyuan
```

### 方式 4：OpenClaw / ClawHub 一键安装

```bash
openclaw skills install majia-guanyuan
clawhub install majia-guanyuan
```

> V3.0.0 起本 skill 已退役自造 HTTP 客户端 `guandata.py`，**不再在本地发送任何登录凭据**——查数/写入全部委托官方全家桶命令，认证走 `guancli auth login`（凭据由官方 CLI 管理）。安全说明见 [SECURITY.md](./SECURITY.md)。

### 方式 5：Hermes skillpack 安装（如发布到 gbrain registry）

```bash
gbrain skillpack install majia-guanyuan
```

### 🔑 前置依赖：官方全家桶（所有工具相同）

本 skill 的标准活全部路由给官方全家桶，所以**先装官方聚合包并登录一次**：

```bash
# 1. 一键装齐官方全家桶（guancli / guanvis / guanetl / guanwf / guands + 各自 AI skill）
npm i -g @guandata/guanskill
guanskill install-skill

# 2. 认证（全家桶共用一套 profile，本 skill 不再单独要 config.json）
guancli auth login
```

| 命令 | 角色 | 路由什么需求给它 |
|---|---|---|
| `guancli` | 只读分析中枢 + 表单 CRUD | 查 ETL/dsId/page/card/血缘、`ds execute-sql`、`metric query` 同环比/Top N、归因、ChatBI 问数、取数导出 |
| `guanvis` | 标准建卡 + Page 装配 + 服务端截图 | 74 种图表 JS DSL、selector 联动、custom chart、`guanvis pack/publish/upload`、`guanvis screenshot` 出 PNG |
| `guanetl` | ETL 写操作闭环 | 单个 ETL 新建/改/lint/preview/save/run/schedule/delete |
| `guanwf` | 工作流数据流 Dataflow | 工作流引擎里建/编/存/跑数据流（DB 直连回写、增量输出） |
| `guands` | 数据源 + 数据集 CRUD | 建连接、`dataset create-db/create-query/import/replace-data`、批量移删、增量更新 |
| ~~`guanadmin`~~ | 已退出全家桶（2026-06-04） | 管理员操作不再在公开全家桶，需另装 standalone |

> ⚠️ **认证不再用 `config.json`**：V3.0.0 退役了自造客户端 `guandata.py`，凭据统一由 `guancli auth login` 管理，本 skill 不再读写 `config.json`。

---

## 🚀 快速开始

### 🧭 路由层：标准查数 / 建卡（交给官方全家桶）

```bash
# 标准查数 → guancli（不需要本 skill）
guancli ds search 营业额 --raw
guancli metric query --ds <ds_id> --dim 城市 --metric 销售额:SUM \
  --filter 营业日期:BT:2026-02-01,2026-02-28

# 标准建卡 + 服务端截图 → guanvis
guanvis publish .
guanvis screenshot <page_id> -o out.png
```

> 标准查数/建卡是官方全家桶的活，本 skill **不再自造**。只有遇到下面这些"官方够不着"的场景才进对应 Part。

### Part B：建 ETL（数据建模）

```bash
# 1. 治理扫描
guancli etl tree
guancli --raw etl get <id> > raw/<id>.json
# 本地脚本分析依赖图、循环组、复杂度 → analysis.json + governance-report.md

# 2. 建 v2 目录（ETL + DATA_SET 各一个）
guancli fetch POST /api/directory \
  '{"name":"warehouse_v2","parentDirId":"<父>","dirType":"ETL"}'
guancli fetch POST /api/directory \
  '{"name":"warehouse_v2","parentDirId":"<父>","dirType":"DATA_SET"}'

# 3. 写入 + 执行
guancli fetch POST /api/etl/direct-save --stdin < payload.json
guancli fetch POST /api/etl/execute '{"dataFlowId":"<id>"}'

# 4. 失败定位（关键！别只看 status:FINISHED）
guancli fetch GET /api/task/<taskId> | jq '.response.result.error'
```

### Part C：自定义图表（前端排障）

```javascript
// 观远 runtime 真实签名（不是把第一个参数当 DOM 根节点！）
function renderChart(data, clickFunc, config, helpers) {
  // data 常见形态：
  // [[ {name:"payload_json",data:["{...}"]}, {name:"report_date",data:["2026-03-18"]} ]]

  // 关键：如果 JSON.parse(payload_json) 报 Unterminated string
  //  → 优先判断为"数据链路截断"，改数据方案（拆列），不堆前端兼容逻辑
}

new GDPlugin().init(renderChart);
```

---

## 📁 目录结构

```text
majia-guanyuan/
├── SKILL.md                          # AI 读的主文档（路由层 + Part B/C/D/E + 方法论）
├── AGENTS.md                         # Codex 项目指令 / Hermes resolver（V1.3 新增）
├── manifest.json                     # 工具无关 skill 元数据（V1.3 新增）
├── README.md                         # 本文件（中文）
├── README.en.md                      # English README
├── CHANGELOG.md                      # 完整变更历史
├── ATTRIBUTIONS.md                   # 致谢与来源
├── LICENSE                           # MIT
├── .gitignore
├── scripts/
│   └── inject_phone_layout.py        # Part D 移动端 phoneLayout ZIP inject 工具
├── templates/
│   └── html-dashboard/               # Part C-12 HTML 应用化看板模板包（GDHTML runtime + 起手模块 + selector 联动 patch）
└── references/                       # 深度参考资料（V3.0.0 后 13 份）
    ├── part-b-errors.md              # Part B 10 类报错详方案
    ├── part-b-payload.md             # ETL payload schema 详解
    ├── part-b-sdk.md                 # v2→v3 批量改造 SDK
    ├── part-b17-fullchain-rewrite.md # B-17 全链路重写方法论全章节 + ExecPlan 工作法
    ├── part-c-payload-json.md        # C-3 payload_json 排障详解
    ├── part-c-html-dashboard.md      # C-12 HTML 应用化看板生成方法论
    ├── v7-page-card-publish-pipeline.md  # Part D v7 草稿/发布状态机 + 节点化静默坑 + phoneLayout
    ├── part-e-superapp-pipeline.md   # Part E SuperApp 反向工程流水线
    ├── ai-native-ads-design.md       # AI-native ADS 设计方法论（哲学层文档）
    ├── restaurant-bi-formulas/       # 餐饮 BI 公式实战库（README + 9 篇分册）
    ├── custom-chart-playbook.md      # CTO 张进自定义图表完整排障手册原文（V1.1）
    ├── etl-rewrite-original.md       # CTO 张进 SmartETL 改写经验原文（V1.1）
    ├── execplan-spec.md              # OpenAI Codex ExecPlan 规范（V1.2）
    └── agents-rule.md                # OpenAI Codex 极简调度规则（V1.2）
```

---

## 🎯 路由速查：标准活给官方，硬骨头进对应 Part

| 用户需求 | 走 |
|---|---|
| "查一下 2 月各城市营业额" / "做一张交叉表" / "删掉这张卡片" | 🧭 官方全家桶（`guancli` / `guanvis`） |
| "建一个标准 ETL" / "上传个数据集" / "建数据连接" | 🧭 官方全家桶（`guanetl` / `guands`） |
| "扫一遍 BI 的 ETL 看哪些可以删" / "ETL 之间有循环依赖怎么办" | **B** |
| "direct-save 报错怎么修" / "字段使用度审计安不安全裁" | **B** |
| "把这条 SmartETL 链整个改成 SQL 版" / "做副本页验收 / 卡片级对比" | **B-17** |
| "上游空快照怎么写结论" / "差异定位到底在 SQL 还是执行时点" | **B-17** |
| "30+ 表跨多日工程怎么管 / 给我 ExecPlan 骨架" | **B-17.11** |
| "自定义图表脚本不执行 / payload_json 报错" / "固定卡片错位 / overlay 切页残留" | **C** |
| "更高级 / 应用化看板 / selector 联不到 custom chart dataView" | **C-12** |
| "v7 page+card 被 60004 草稿页面卡住" / "移动端 phoneLayout 怎么注入" | **D** |
| "form 建表脚手架没暴露 API" / "LLM 中转报 ILLEGAL_JSON_RES" | **E** |
| "想给现有 BI 接 AI，该治理还是该重搭" / "AI-native ADS 怎么设计" | **方法论** |
| "复购率 / 客单价 / RFM / 同店增长怎么算" | **餐饮公式库** |

---

## 👤 作者 / 联系

**马甲（@maojiebc）** · 超级马甲

如果这份 skill 帮到你，欢迎在以下任意渠道找我交流踩坑实录、提需求、报 bug，也欢迎切磋用户运营 / 数据中台 / BI 工程的实战经验：

| 渠道 | 链接 |
|---|---|
| 📧 Email | [m9224@163.com](mailto:m9224@163.com) |
| 🐙 GitHub | [github.com/maojiebc](https://github.com/maojiebc) |
| 🪝 ClawHub | [clawhub.ai/p/maojiebc](https://clawhub.ai/p/maojiebc) |
| 🐦 X | [@maojiebc](https://x.com/maojiebc) |
| 📕 小红书 | [超级马甲](https://xhslink.com/m/4fQMJeHHWKC) |
| 📰 微信公众号 | **超级马甲** |

> 这份 skill 是 14 年用户运营 + 观远 BI 实战 + 60+ 张 ETL 写入实证沉淀出来的，问题/合作随时聊。

---

## ❤️ 致谢与来源

本 skill 站在多个前辈项目和经验贡献者的肩膀上，详细致谢见 [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)：

- **[guandata-bi @ ClawHub](https://clawhub.ai/skills/guandata-bi)** — 观远 BI 通用版 skill，本项目最早的灵感来源
- **[zhengyuhe123/guandata](https://github.com/zhengyuhe123/guandata)** — guandata 原始 GitHub 项目
- **小小郑3号 · guandata70** — 观远 7.0+ 适配版（draft/release 机制），本项目 Part A 的直接前身
- **观远 BI CTO 张进** — Part B-17（SmartETL 全链路重写方法论）+ Part C（自定义图表开发与排障）的核心经验贡献者
- **OpenAI Codex** — V1.2 引入的 [ExecPlan 规范](./references/execplan-spec.md)（自包含活文档 + 四章节项目管理结构），用于 30+ 张表跨多日 SmartETL 重写工程的项目化追踪
- **马甲（@maojiebc）** — Part A/B 实战整合与 60+ 张 ETL 写入实证记录

> 没有 ClawHub / 张进 / 小小郑3号 / OpenAI Codex 的开源精神，这份 skill 不可能存在。

---

## 📋 版本记录

**最新：V3.0.5** (2026-06-09) — **官方全家桶 06-09 版本对齐**。guancli 1.0.32→**1.0.33**、guanvis 0.1.23→**0.1.24**（新增 AreaTitle + CardGroup 布局组件）、guanetl 0.1.13→**0.1.14**（移除 delete 命令 + 修复 save 绑定输出 bug）。路由表 + B-0.5 + 清理坑段落同步更新。

**V3.0.4** (2026-06-05) — **新增 B-0.5：guanetl `edit` 失效时改现有 ETL 的实测绕过**。workshop513 一次性 ETL 全链路实测（建→复现空 etl.go→重建→save→回查→删，净零），确认空 `etl.go` bug 之外还有三道连带墙：① 重建 etl.go 撞 0.1.13 新增的输出绑定 guard（DSL 表达不出输出 dsId）② `save` 合并对身份字段 base 优先（改名 3/3 被覆盖）③ 输出 dsId churn。实战路径：纯改名走 `guands rename/alias`、改逻辑走**不可变重建**、高级逃生用手工 `_exported.json`；并记 BI API 是 cookie 认证（token 直 curl 401）+ `delete --cascade` 删除顺序坑。修正旧 callout 的"清空风险"措辞（0.1.13 guard 会拦下）。给观远的报告已加深度复测段。

**V3.0.3** (2026-06-05) — **官方全家桶 7→5 + 06-04 版本对齐**。观远 2026-06-04 又发一轮：**`guanexport` + `guanadmin` 退出全家桶**（从 `guanskill` 聚合包移除、npm 下架）→ 官方现 **5 件**（guancli/guanvis/guanetl/guanwf/guands）；版本 guancli 1.0.31→**1.0.32**、guanvis 0.1.22→**0.1.23**、guanetl 0.1.12→**0.1.13**、guands 0.1.13→**0.1.14**。新能力：**guancli `metric` 从只读转可写**（建/改/删指标）、**guanvis 指标卡片构建（metric init）+ publish 覆盖前自动备份**、guands `dataset alias` 改字段展示名。

完整变更历史见 [CHANGELOG.md](CHANGELOG.md) 或 [GitHub Releases](https://github.com/maojiebc/majia-guanyuan/releases)。

## 🤝 贡献

欢迎 issue 和 PR：

- 🐛 发现报错没在手册里的：欢迎提交 issue 描述报错信息 + payload + 真实错误（`/api/task/<id>.response.result.error`）
- 📝 你跑通了新的 BI HTTP API endpoint：欢迎补充到 Part B 的 API 全图
- 🎨 自定义图表新场景：欢迎补充到 Part C
- 📚 文档优化、翻译、错别字修正：直接 PR

---

## 📄 License

[MIT](./LICENSE) © 2026 [maojiebc](https://github.com/maojiebc) and contributors.

本 skill 基于他人开源工作整合而成，详细 attribution 见 [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)。
