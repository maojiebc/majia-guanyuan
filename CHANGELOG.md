# Changelog

All notable changes to **majia-guanyuan** are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/) — see SKILL.md for
the project's specific patch / minor / major rules.

## [3.0.4] — 2026-06-05

### Added

- **B-0.5「guanetl `edit` 失效时改现有 ETL 的实测绕过」**：workshop513 一次性 ETL 全链路实测（create→复现空 etl.go→重建→save→回查→delete，净零改动）。确认空 `etl.go` bug 之外的三道连带墙——① 手写重建 etl.go 撞 0.1.13 新增的「输出数据集绑定风险」guard（DSL `BasicOutputDataset*` 表达不出服务端输出 `dsId`）② `save` 合并对身份字段 base 优先（改 ETL 名/输入节点名/输出节点名 3/3 被覆盖）③ 每次 save 输出 `dsId` churn。给出实战路径：纯改名→`guands rename/alias`、改逻辑→不可变重建、高级逃生→手工 `_exported.json`（保留 `dataSource.dsId`）。

### Changed / Fixed

- 修正 Part B 旧 callout 的"`save` 清空线上 ETL 风险"措辞：0.1.13 的输出绑定 guard 实测会**拦下**危险保存（0.1.12 无 guard 才有清空风险）。
- 记录 BI API 为 **cookie/session 认证**（`Authorization: Bearer` / `X-AUTH-TOKEN` 直连 401，别拿 config token curl `direct-save`）。
- 记录 `guanetl delete --cascade` 删除顺序坑（数据集先删→6001；应先删 ETL）+ churn 绑定的 `NOT_FOUND` 幽灵现象。
- 给观远官方的 bug 报告追加「深度复测（2026-06-05）」段。

### Notes

- 无功能 / 无 Part 结构改动；架构图仅 bump 版本标。用户首屏版本记录保留 V3.0.4 / V3.0.3 / V3.0.2。

## [3.0.3] — 2026-06-05

### Changed

- **官方全家桶 7 → 5**：观远 2026-06-04 又发一轮，`guanexport` + `guanadmin` **退出全家桶**（从 `guanskill` 0.1.3 聚合包移除、npm 也下架）。官方现 5 件 = guancli / guanvis / guanetl / guanwf / guands。SKILL.md 路由表、frontmatter description / install bins、架构图（7→5 mini-card）全部对齐。
- **版本对齐**：guancli 1.0.31→**1.0.32**、guanvis 0.1.22→**0.1.23**、guanetl 0.1.12→**0.1.13**、guands 0.1.13→**0.1.14**、guanskill 0.1.2→0.1.3（guanwf 0.1.4 不变）。
- **新能力记入路由**：guancli `metric` **从只读转可写**（create/edit/delete 指标）；guanvis **指标卡片构建**（`metric init`）+ `publish --allow-overwrite` 覆盖前自动建迁移备份；guands `dataset alias` 改字段展示名。

### Notes

- **guanetl `edit` round-trip bug 在 0.1.13 复测仍复现**（6 节点 ETL → 空 etl.go）——0.1.13 只动 lint/create/save，未碰 edit/import 逆向链路。提交观远的报告已更新。
- 无功能 / 无 Part 结构改动；本地全家桶同步升级到 0.1.3（含卸载 guanexport/guanadmin + 清孤儿 skill 目录）。
- 用户首屏版本记录保留 V3.0.3 / V3.0.2 / V3.0.1。

## [3.0.2] — 2026-06-05

### Added

- **workshop513 实盘实测沉淀**（BI 8.2.1-hf6，全 7 个官方 skill 读写跑通）—— v3 路由全部验证正确；新增 2 条只有真跑才知道的硬边界：
  - **Part B**：`guanetl edit` 逆向在此实例 **5/5 全失败**（API direct-save / BI UI / guanetl 自己 create+save 出来的全中，生成空 `etl.go`、`-v` 无报错、紧接 `save` 有清空线上 ETL 风险）→ 改现有 ETL 继续走 Part B `guancli fetch`。最小复现已提交观远官方。
  - **Part D**：删 guanvis-published 页面唯一可行 `DELETE /api/page/<id>?force=true`（卡片内嵌 `page.cards`、`/api/card` 删报 1002、guanvis 拒覆盖空页）；删 ETL `DELETE /api/etl/<id>` 连带删输出集（先 ETL 后 ds，别用 `guanetl delete --cascade`）。

### Notes

- **无功能 / 无 Part 结构改动**——纯实测边界 + 路由验证。guanvis build→preview→publish(3.1s)/screenshot、guancli 读路径、guands calc-field 写均实测通过。
- 用户首屏版本记录保留最新 3 条（V3.0.2 / V3.0.1 / V3.0.0），V2.1.15 归 CHANGELOG。

## [3.0.1] — 2026-06-04

### Changed

- **README 架构图改绝对 URL + 新增 `docs/architecture.png`** —— `<img src>` 从相对路径 `./docs/architecture.svg` 改成 `https://raw.githubusercontent.com/maojiebc/majia-guanyuan/main/docs/architecture.png`。**根因**：相对路径只在 GitHub 仓库页解析；ClawHub / npm 包页渲染 README 但不托管仓库文件，相对路径拿不到图 → 首图整块空白。新增 PNG（Chrome headless 2x 渲染，2880×1840，CJK 走系统 PingFang SC），绝对 raw PNG 在 GitHub / ClawHub / npm 三处都渲染。
- **清掉 references 目录树的 `（V2.1.x）` 历史版本标注** —— README / README.en「📁 目录结构」段里 `…（V2.1.1）` 这类"引入版本"标注在 v3 页面上读着像残留，去掉。
- **ClawHub 14 个 tag 版本钉刷齐** —— v3.0.0 发布只带了部分 tag，`agent-skills / business-intelligence / chinese / claude-code / data-analysis / guandata-bi / metric-query / mobile-adaptation / phonelayout / rfm-analysis` 还钉在 2.1.x；3.0.1 重发带全 tag 刷到 3.0.1。
- svg / png 版本标 v3.0.0 → v3.0.1，badge / H1 / metadata.version 同步。

### Notes

- **无功能 / 无 Part 结构改动** —— 纯 registry 渲染 + 元数据补丁。催生 majia-ota-skill v0.17.0：README 引用的 visual asset 必须用**绝对 URL**（相对路径在 ClawHub / npm 不渲染）；ClawHub 页 = README 冻结/不可改，发版必带全 tag 刷版本钉。

## [3.0.0] — 2026-06-04

> **Ground-up 重构 ——「官方全家桶之上的实战增益层」重定位。** 观远官方 BI 全家桶 2026-06-03 全部公网化后，本 skill 不再"非官方起家、自造全栈 + fallback"，而是退到官方之上的增益层：标准能力一律路由官方，只留官方够不着的硬骨头。共约 **-5500 行**。

### Changed

- **定位整体重写** —— 从"非官方起家、自造全栈 + fallback" → **「官方全家桶之上的实战增益层」**。观远官方全家桶（`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands` / `guanadmin`）2026-06-03 全部公网化后，标准查数 / 建卡 / ETL / 数据集 CRUD 一律路由官方，本 skill 只保留官方够不着的硬骨头。
- **Part A 整段重写为「路由层」** —— 官方全家桶 ↔ 本 skill 分工总表 + 一句话路由 + 降歧义；标准查数→`guancli`、建卡/发布/截图→`guanvis`、ETL→`guanetl`、数据流→`guanwf`、数据源/数据集→`guands`、管理员→`guanadmin`，本 skill 不再自造这些。
- **前置依赖** `@guandata/guancli@^1.0.31` → 官方聚合包 **`@guandata/guanskill`**；**认证**从 `config.json` 明文 → **`guancli auth login`**（与全家桶共用 profile，不再要 config.json）。
- **品牌字统一「马甲实战版」**（H1 / README / `manifest.json` `displayName` 等）。
- **纠正旧结论** —— "数据集上传 BI 无原生 API（`POST /api/data-source/*` 全失败）"已过时：**`guands` 已支持 `create-db` / `import` / `replace-data`**。
- **frontmatter `description` 重写** —— 改为 v3 实战增益层定位 + 触发词（932 字符，< 1024）。

### Removed

总计约 **-5500 行**（砍冗余 / 历史包袱）：

- **`scripts/guandata.py`**（2789 行自造 BI HTTP 客户端）—— **退役**。建卡→`guanvis`、取数→`guancli`、数据集 CRUD→`guands`、发布→`guanvis publish` 全有官方接手；旧实现可从 git **`v2.1.14`** tag 取回。
- **`scripts/zonedata_builder/`**（~1600 行死代码，含字节级重复嵌套副本，零引用）。
- **4 个 references** —— `guancli-commands.md`（391 行官方命令镜像，永远滞后）、`part-a-commands.md` + `part-a-cards.md`（`guandata.py` / 建卡文档，→`guanvis`）、`internal-nexus-install.md`（已被公网取代）。
- **frontmatter** `requires.config: config.json` + `install.pip httpx`（`guandata.py` 退役后无 Python 运行期依赖）。

### Notes

- **Breaking** —— `scripts/guandata.py` 退役是 breaking change（故 major **3.0.0**）；直接 `import` / 调用 `guandata.py` 的外部脚本需改用官方命令（旧实现可从 git `v2.1.14` tag 取回）。
- 用户首屏版本记录段（README / README.en / SKILL.md 末尾）按 HARD GATE 保留最新 3 条（V3.0.0 / V2.1.15 / V2.1.14），更早的归入本 CHANGELOG。
- **官方盲区护城河全部保留强化** —— Part B 整库治理判断 + 10 类引擎报错 + 双源审计 + B-17 全链路重写、Part C 既有页注入排障 + Part C-12 自定义图表 + descriptor patch 联 dataView、Part D v7 状态机绕过 + 节点化静默坑 + phoneLayout、Part E SuperApp 反向工程、AI-native ADS 方法论、餐饮 BI 公式库。

## [2.1.15] — 2026-06-04

### Added

- **官方观远 BI skill 全家桶首次公网化**（2026-06-03）—— 观远把整套 BI skill 打成聚合安装包 **`@guandata/guanskill`** 推上公网 npm：`npm i -g @guandata/guanskill` 一次拿齐 7 个命令，`guanskill install-skill` 把对应 AI skill 全装进 `~/.agents/skills/`（覆盖 Antigravity / Claude Code / OpenClaw / Codex / Gemini CLI / Copilot 等 16+ agent 环境）。
- **`SKILL.md` 新增「V2.1.15 新对齐：1.0.30 → 1.0.31 增量」子节**（1.0.31 二进制实测）：`card preview` 值格式化 + 保留 raw、`--dynamic-field` 多选覆盖（1.0.30）、`ds execute-sql` 认证默认不再发 `X-AUTH-TOKEN`（1.0.31）、`--brief` 简版资源详情提速、`install-skill` 加 WorkBuddy 路径。
- **新成员 `guanwf@0.1.4`** —— 工作流数据流（Dataflow）编辑闭环（`edit → export → save-draft → save`，源文件 `etl/etl.go` + SQL + `node_*.json`），写进「与官方全家桶的共存」路由矩阵。

### Changed

- **「与官方 guancli skill 的共存」整段重写为「与官方全家桶的共存」** —— 三件套（guancli / guanvis-skill / majia-guanyuan）升级为全家桶 7+1 路由矩阵；删除"guanvis-skill 仅内网 Nexus、其余四兄弟未确认发包"的过期描述。
- **包/命令名去 `-skill` 后缀** —— `guanvis-skill` → `guanvis`（`@guandata/guanvis@0.1.22`），SKILL.md 所有 `guanvis-skill publish/pack/upload` 命令例改 `guanvis ...`；`guanvis screenshot` 为页面服务端截图新入口（`guanexport` 的 PNG 截图已迁移至此并逐步下线）。
- **版本矩阵更新**：`guancli@1.0.31` · `guanvis@0.1.22` · `guands@0.1.13` · `guanetl@0.1.12` · `guanexport@0.1.9` · `guanadmin@0.1.6` · `guanwf@0.1.4`。
- **依赖** `@guandata/guancli` `^1.0.29` → **`^1.0.31`**（`manifest.json` + `package.json` + `SKILL.md` frontmatter / 版本行）。
- **`references/internal-nexus-install.md`** 顶部加「已被公网取代」横幅（公网 npm 现已可装，内网四步法仅留作历史 / 内网 pre-release 兜底）。
- **README / manifest / package.json** 版本徽章、架构图 alt、描述前导同步到 V2.1.15。

### Notes

- **纯生态对齐 + 文档** —— 无 Part 结构变化、无 breaking、无代码改动。本地工具链同步升级到全家桶（`guancli` 1.0.29 → 1.0.31 + 6 兄弟 + guanwf）。
- 用户首屏版本记录段（README / README.en / SKILL.md 末尾）按 HARD GATE 保留最新 3 条（V2.1.15 / V2.1.14 / V2.1.13），V2.1.12 归入本 CHANGELOG。

## [2.1.14] — 2026-05-29

### Added

- **`references/guancli-commands.md`** 补齐 guancli 1.0.25 → 1.0.29 的新命令面（参数用 1.0.29 二进制实测确认，不臆造）：
  - **`ds execute-sql`**（1.0.26）—— 对一个 / 多个数据集跑只读 SQL（含跨数据集 JOIN）：数据集名称当临时表名、中文/空格用反引号、`--inputs` / `--sql` / `--limit`、JSON/CSV/表格输出、旧版 public-api fallback。新增独立章节「数据集直查 SQL」，并在 `part-a-commands.md` 加「临时 SQL 直查」指针（与 `create-and-get` 互补：一个探查、一个留存）。
  - **`metric project [keyword]`**（1.0.27）—— 列指标主题（ID / 名称 / 备注 / 指标数），可按关键词模糊筛，先缩范围再 `metric search`。
  - **`server-version` / `bi-version`**（1.0.25）—— 查 BI 实例版本号，新增独立小节；并在 `metric query` 泛化查询段标注「泛化查询要求 BI ≥ 8.2.1，先 `server-version` 确认」。
  - **`card preview` 增强**（1.0.28 / 1.0.29）—— `--dynamic-field`（动态维度卡指定取哪个字段）、`--dynamic-param`（动态参数覆盖，仅图表卡片）、`-o/--output`（写文件，结果 >1000 行自动落文件）、`--columns` / `--precision`。
  - **工具选择决策表**新增 3 行：`ds execute-sql` / `metric project` / `server-version`。

### Changed

- **依赖** `@guandata/guancli` `^1.0.24` → **`^1.0.29`**（`manifest.json` + `SKILL.md` frontmatter / 版本行）。
- **`SKILL.md`** guancli 路由章节标题与正文版本号 `1.0.21` → `1.0.29`，新增「V2.1.14 新对齐：1.0.22 → 1.0.29 增量」子节；三件套共存表「官方 guancli」行 `1.0.21` → `1.0.29`（能力补 数据集直查 SQL / 动态字段），本 skill 行 `2.1.7` → `2.1.14`；Part B 引子 `1.0.21` → `1.0.29`。
- **`ATTRIBUTIONS.md`** guancli 版本 `1.0.21` → `1.0.29`。

### Notes

- **纯命令面对齐 + 文档补充** —— 无 Part 结构变化、无 breaking、无代码改动。本地 guancli 同步从 1.0.19 升级到 1.0.29。
- 用户首屏版本记录段（README / README.en / SKILL.md 末尾）按 HARD GATE 保留最新 3 条（V2.1.14 / V2.1.13 / V2.1.12），V2.1.11 归入本 CHANGELOG。

## [2.1.13] — 2026-05-22

### Added

- **`references/ai-native-ads-design.md`** — AI-native ADS 设计方法论完整指南
  （~340 行，9 个 §小节，majia-guanyuan **哲学层文档**，不是操作手册，是范式判断）。
  沉淀自 v2.1.12 SuperApp demo 跑完后用户的根判断：「光数据治理没用，必须按适配 AI
  的方式数据架构重搭一遍，要是在历史业务积累上做东西，估计全是阻碍」。这条心得
  不是凑出来的策略，是反复对照"新建底表一路畅通"和"历史宽表寸步难行"两种状态
  后蒸馏出来的范式判断。本文展开为可落地的方法论：

  - **§1 现象层：demo 一路畅通 vs 历史包袱寸步难行**。回头看
    `ads_会员经营任务池` 32 字段，每个字段的设计本身就是 AI-native 的：
    `推荐动作 / 推荐权益 / 推荐原因` 推荐结果预计算 + 落字符串 → LLM 直接当
    prompt 输入；`会员等级 / 人群标签 / 角色标签` 低基数中文枚举 → LLM 一眼看懂
    "沉睡 / 流失 / 活跃"；`任务优先级` P0/P1/P2 标准化标签；
    `任务生成 / 截止 / 失效时间` 全 TIMESTAMP；`门店名称` 城市+地标+编号拼成完整
    字符串 → LLM 自动用"0783 店小张"做角色扮演。**反过来历史业务积累的宽表**：
    `proc_act_type_v3 = 'P_CB_VCH'`（要查 dim_action_type 码表）/ `seg_id = 7`
    （要 LEFT JOIN dim_segment）/ `store_code = 'S00769'`（要 JOIN dim_store
    拼名字）/ `coupon_rule_json = '{"rule_type":3,...}'`（LLM 还得 parse 业务规则）
    → LLM 根本看不懂码值，prompt 里塞这些写不出"老熟客闲聊"话术。
  - **§2 本质层：两种 schema 假设的根本差异**。传统 BI 默认消费者是「写 SQL 的人」
    （可以查码表、可以 JOIN、可以 parse JSON、可以现场拼字段），AI-native ADS 默认
    消费者是「LLM + 业务方」（LLM 的"现场计算能力"远不如 SQL 引擎，**所有该问的、
    能猜的、要算的东西都要提前 ETL 进去**）。9 个维度的对比表（消费者 / 字段命名 /
    维度取值 / 复合语义 / 推荐 / 标签 / 时间 / 优先级 / 行级权限 / 主要服务）说清这
    一假设差。
  - **§3 推倒重来 ≠ 重做 ODS / DWD**：**只动 ADS 层**。业务系统不动（一线零干扰）/
    ODS 不动（合规 + 审计源头）/ DIM 不动（企业级标准码值）/ DWD 不动（按
    `restaurant-bi-formulas/08-etl-engineering-patterns.md` 的"10-CTE DWD 宽表底座"
    那套）/ ADS **整层重建**（这才是给 LLM + SuperApp 直接消费的层）。一个客户可能
    有 1 张 DWD 主宽表 + N 张 AI-native ADS（每个 AI 应用一张）。
  - **§4 七条字段约束**（每条都给具体对照 + LLM 友好性原因）：
    1. 维度全用中文枚举值（`人群标签="沉睡"` 不要 `seg_id=7`）
    2. 推荐 / 标签字段提前 ETL 算好（不让 LLM 临时拼）
    3. 复合语义直接拼好（`门店名称="上海CBD0769店"` 不要 `store_code`）
    4. 时间字段统一 `TIMESTAMP YYYY-MM-DD HH:mm:ss`（不要 epoch / 不要数字格式）
    5. 优先级 / 排序字段强约束取值（P0/P1/P2 不要 1/2/3 不要 high/mid/low）
    6. 数值字段提前算好（不让 LLM 算 ROI / 净利率 / 折扣率）
    7. 行级权限字段冗余进表（不让 LLM 推断或拼多表 JOIN）
  - **§5 完整命名公约模板**：直接给 `ads_会员经营任务池` 的字段示例（任务ID /
    任务优先级 STRING / 任务类型 STRING / 推荐动作 STRING / 预计价值 DOUBLE /
    任务生成时间 TIMESTAMP / 触达状态 STRING / 转化阶段 STRING 等），核心特征：全部
    中文字段名 + 全部字符串枚举值 + 复合字段提前拼好 + 时间统一格式 + 推荐字段是
    ETL 算法的输出。
  - **§6 客户视角的预算分配建议**：旧叙事（治理 100% / 12 个月项目周期 / 产出：删
    冗余 + 改命名 / 业务方无感知）vs 新叙事（治理 30% + 重搭 ADS 30% + AI 应用 40% /
    3 个月项目周期 / 产出：3-5 个 AI 应用上线 / 业务方天天用 / 可量化 ROI）。
    **关键判断**：**治理预算的一半挪去重搭 ADS + 上 AI 应用，产出比直接治理高一个
    数量级**——治理只清"脏数据"，重搭才换"schema 假设"。
  - **§7 与既有 Part 的关系表**：Part A 数据查询（正交）/ Part B ETL 治理（**正交补充**，
    Part B 是 ETL 操作手册"怎么写 / 怎么治"，本文是"要不要治 vs 要不要重搭"的判断）/
    Part B-17 全链路重写（**同源**：B-17 是把一条 SmartETL 链改写成 SQL 版，本文是
    战略升级版"为什么要重搭一整层 ADS"）/ Part C 自定义图表（互补）/ Part D V7 Page
    （正交）/ **Part E SuperApp 强依赖本文**（前置假设：SuperApp 能跑顺的前提是 ADS
    是 AI-native）/ `restaurant-bi-formulas` 餐饮 BI 公式实战库（**兼容**：DWD 宽表
    底座不动，新建 DWD 之上的 ADS 层）。
  - **§8 反模式 8 条**：从"enum code 落 ADS 表"、"通用宽表覆盖所有场景"、"epoch 时间
    字段"、"推荐字段让 LLM 现场算"、到 **"把 SuperApp 当目标，跳过 ADS 重搭"**
    （最严重——历史宽表喂给 LLM 出不来好结果，demo 永远做不通）。
  - **§9 何时回到这份文档**：6 种触发场景 → 跳转表。

### Changed

- **SKILL.md 路由层**新增"客户问治理 vs 重搭"路由行（不属于 Part A-E 任一，单独放
  方法论位）。`metadata.version` `2.1.12` → `2.1.13`；主标题 `V2.1.12` → `V2.1.13`；
  顶部 banner 版本字符串同步；frontmatter `description` 加 AI-native ADS 关键词组
  （AI-native ADS / 数据架构重搭 / 底表治理 vs 重搭 / AI 友好字段 / 中文枚举 /
  预算分配）。版本记录段 ≤ 3 条规则：V2.1.10 推到 CHANGELOG，保留 V2.1.13 /
  V2.1.12 / V2.1.11。
- **README.md / README.en.md** Skill Version badge `v2.1.12` → `v2.1.13`；架构图 alt
  `v2.1.12 功能图` → `v2.1.13 功能图` 把 AI-native ADS 方法论写进去（哲学层文档：
  客户上 LLM/SuperApp 前判断治理 vs 重搭、ODS/DIM/DWD 不动 ADS 重建、7 条字段约束、
  预算分配 30+30+40）。"📋 版本记录" / "📋 Version History" 段加 V2.1.13 entry +
  删 V2.1.10（≤ 3 条规则）。
- **`package.json` / `manifest.json`** version `2.1.12` → `2.1.13`；description 顶部
  加 V2.1.13 一句话短摘要 + 整体能力描述从 "Six capabilities" 改为 "Six capabilities
  + philosophy doc"。

### Zero changes

- 已有 `references/` 一行未改（除了新增 ai-native-ads-design.md 自身）
- 已有 `templates/` / `scripts/` 一行未改
- 命令面 / 依赖版本（`@guandata/guancli@^1.0.24`）一行未改
- 既有 Part A/B/C/D/E 章节一行未改

### Rationale

patch bump 2.1.12 → 2.1.13 —— 新增的是 **哲学层方法论文档**（不是新脚本 / 不是新命令
/ 不是新依赖），属于 "docs + 知识沉淀" 范畴。沿用 v2.1.9 / v2.1.10 / v2.1.12 同类
"新增 reference 文档"都用 patch 的惯例。

这条心得的特殊之处在于**它不是 Part 而是横切层**——不像 Part A-E 各自管一类操作，
本文是给 Part E（SuperApp）和 restaurant-bi-formulas（ETL 工程范式）做**前置判断**
的：客户值不值得做 SuperApp / 做之前要不要先重搭 ADS / 怎么跟客户算预算账。所以在
Part 选择表里单独放一行，不归到任何已有 Part 下。

## [2.1.12] — 2026-05-22

### Added

- **`references/part-e-superapp-pipeline.md`** — SuperApp 开放应用开发流水线完整指南
  （~620 行，18 个 §小节）。沉淀自同一天在 workshop513 域（`https://app.guandata.com`）
  上从零跑通一个完整 SuperApp demo「会员经营任务池 OS」的多轮反向工程：
  - **§1-4 SuperApp 定位 + 三 API + guancli app 命令实测**：`open-apps` 是后端实体名，
    URL 模式 `/<bi-host>/open-apps/<appId>/`，必须 SPA，复用 BI 同源 `/api`、`/static`、
    cookie，发布需管理员权限。关键坑：**`guancli app publish` CLI 不读 `.env` 的
    `VITE_APP_ID`**（只对脚手架自带 `/publish` UI 生效），不传 `--app-id` 默认走 create
    新建一个 app —— 我这次第一次踩到，平台上多了一条占位 app 才发现。
  - **§5 数据集异步预览三步链路**：`previewDatasetDataWithFilterAsync(dsId, {limit})`
    拿 taskId → `getTaskStatus(taskId)` 轮询直到 `FINISHED`（`result.response.value` 双层
    嵌套拿 fileName）→ `readDatasetPreviewFile({taskId, fileName})` 拿
    `columns: BIField[] + preview: string[][]`。**`columns` 用 `col.name` 索引**而非
    `col.fdId` / `col.title`。
  - **§6 BI 表单建表反向工程**（脚手架 `bi-services/form.ts` 完全没暴露建表 API）：
    实测尝试 `/form/create` / `/folder/create-form` / `/forms` / `/api/directory/FORM` 等
    8 个候选端点全部 404 / 405 / 500，最终找到 **`POST /survey-engine/api/form/add`**
    是真正的建表入口。Body 必填 `settings: {}` 否则 NPE on `Form.getSettings()`；
    字段 `fdId` 后端重写为 `a_xxx-yyyy-...` 38 字符（传什么都被覆盖）；字段 `keyId`
    开发者控制但 DB 是 **varchar(20)**（UUID 36 字符爆 `PSQLException: value too long for
    type character varying(20)`），应该用 `task_id` / `member_id` 这种语义化短串；
    **查询返回行按 `fdId` 索引**而非 keyId/name，代码需要先 `getFormDetail` 缓存
    `keyId → fdId` 映射；字段值可能裸字符串也可能数组要兼容；删除数据 API 报
    `NPE on submitterEditable`（建表 settings 字段不全），是个遗留坑下次建表得补。
  - **§7 BI 的 LLM 中转两个 JSON 校验 bug**：
    - `/api/llm-config/list` 返回**裸数组**（不是 BIUniversalJsonResponse 包装），脚手架
      `listAvailableLLMServices()` 默认走 `unwrapBIResponse` 拿 `data.response` 得到
      undefined，调用方 `configs[0]` 触发 TypeError 被 catch 吞，前端误以为"未配置 LLM"。
    - `/api/llm/chat/completions` **stream=true 报 `NOT_JSON_RES`**（期望 JSON 但 LLM
      返回 SSE），**stream=false 报 `ILLEGAL_JSON_RES` 但完整 LLM 响应被塞在
      `error_message` 字段**：`"非法的JSON结构: {\"choices\":[{...}]}"`。
    - **三路径解析模板**：Path 1 `json.response.choices[0].message.content` (BI 标准包装) /
      Path 2 `json.choices[0].message.content` (BI pass-through) / Path 3 从
      `error_message` 用正则 `^非法的JSON结构:\s*({[\s\S]+})$` 抠 JSON.parse
      （实测命中这条）。
    - 拿不到真流式 → **客户端模拟流式**：按字符切片 + `setTimeout 30ms tick`（60 步走完），
      视觉上有"AI 正在打字"效果。
    - **prompt 模板**针对餐饮触达话术（claude-opus-4-6 实测命中率高，自动用门店编号做
      角色扮演 + 自然语气 + 时间锚点，避开"您好""尊敬的会员"营销腔）。
  - **§8 脚手架 `core/request.ts` 的 `get` / `getJSON` 陷阱**：默认 `responseType: 'auto'` +
    `validateStatus: 200-299`，但 SuperApp **生产域**里 cookie 透传不稳（实测 `get()`
    调 `/api/llm-config/list` 失败，curl 直接打能正常拿数组）。**稳妥做法**：BI 内部 API
    用原生 `fetch(url, { credentials: 'include' })`。`fetchFromLLMChat` 用
    `responseType: 'response'` 拿原始 Response 绕过 unwrap 是对的。
  - **§9-13 路由 / dev vs 生产 URL / 设计纪律 / ESLint / 部署细节**：`<base href>` 自动
    注入（`/open-apps/<appId>/`），`BrowserRouter basename` 自动适配；dev 走
    `dev-proxy.mjs` 转发 `VITE_BI_HOST`、生产走 `detectBIBaseRouteUrl(pathname)`；
    设计纪律沿用 `docs/design/DESIGN-workbench-light.md`（单数 ≤ 40px / 圆角 ≤ 8px /
    三层 token / 禁紫蓝渐变 / `npm run design:lint` 机械自检）；ESLint 单文件 ≤ 400 行 /
    单函数复杂度 ≤ 10。
  - **§14 SuperApp vs Page 边界决策树**：只是"看数据"用 Page；需要"写回 / 触发动作 /
    嵌入 LLM"任一动作类需求才走 SuperApp。反面案例：把 SuperApp 当"换皮 Page" —— 工程
    成本高 10×，无价值增量。
  - **§15 实战案例数据全集**：appId `ve2f78b92e329450e95549ff` / 数据底座
    `ads_会员经营任务池` (dsId `nda316bda403346669b3fa1d`, 50000 行 / 32 字段) / 写回表
    `form_任务执行记录` (fmId `a_5ab553-4754-4d89-a7f2-7d7ab38f27fa`, 8 字段) / LLM
    claude-opus-4-6 (llmConfigId `u7c1aaf61fc6d40f1ab6f332`) / 包大小 172 KB JS /
    14 KB CSS（gzip 57 + 3.5 KB）。
  - **§16 反模式表**（8 条）：从 "把 SuperApp 当换皮 Page"、"用 MPA"、"用 UUID 36 字符
    做 keyId"、到 "把执行历史存 localStorage" —— 每条都对应一个替代方案。
  - **§17 工程目录参考结构** + **§18 何时回查表**：12 种触发场景 → 对应 §小节快速跳转。

### Changed

- **SKILL.md 路由层**新增 Part E 入口行（Part 选择表 + References 目录）。`metadata.version`
  `2.1.11` → `2.1.12`；主标题 `V2.1.11` → `V2.1.12`；frontmatter `description` 加
  SuperApp 关键词组（控制在 1024 字符内通过 skills-ref validate）。版本记录段 ≤ 3 条
  规则：V2.1.9 推到 CHANGELOG，保留 V2.1.12 / V2.1.11 / V2.1.10。
- **README.md / README.en.md** Skill Version badge `v2.1.11` → `v2.1.12`；架构图 alt
  `v2.1.11 功能图` → `v2.1.12 功能图` 把 Part E 写进去（注意 svg 本身没重画，alt 同步即可
  —— 这次只是 ota-skill HARD GATE 的 alt 同步要求，下次有时间再重画）。
  "📋 版本记录" / "📋 Version History" 段加 V2.1.12 entry + 删 V2.1.9（≤ 3 条规则）。
- **`package.json` / `manifest.json`** version `2.1.11` → `2.1.12`；description 顶部加
  V2.1.12 一句话短摘要 + 把整体能力从 "Five capabilities" 改为 "Six capabilities"
  （Part A/B/C/C-12/D + Part E）。

### Zero changes

- 已有 `references/` 一行未改（除了新增 Part E 文档自身）
- 已有 `templates/` / `scripts/` 一行未改
- 命令面 / 依赖版本（`@guandata/guancli@^1.0.24`）一行未改

### Rationale

patch bump 2.1.11 → 2.1.12 —— 虽然新增了完整一个 Part 的 reference 文档（620 行 + 18 个
小节 + 6 个反向工程发现 + 实战案例完整数据集），但**未引入新脚本 / 未改命令面 / 未升
依赖**，属于 "docs + 知识沉淀" 范畴。沿用 v2.1.10 / v2.1.9 / v2.1.8 同类"新增 reference
文档"都用 patch 的惯例。

## [2.1.11] — 2026-05-22

### Changed

- **首次落地 ota-skill v0.14.0 Step 5.5（README/SKILL.md 用户首屏 HARD GATE）**。
  v2.1.10 发布时 README 堆了 V2.1.10/.9/.8/.7/.6/.5/.4/.3/.2/.1/.0 一长串 11 条
  版本记录，翻不到底；README 顶部架构图 alt 还标着 "v2.1.3 功能图" 实际是 v2.1.10。
  这两类隐患在 ota-skill v0.14.0 升级为 HARD GATE 后，这里执行首次落地：

  1. **版本记录段截断到最新 3 条 entry**：
     - `README.md` "## 📋 版本记录" 段 V2.1.10..V2.1.0 共 11 条 → 留 V2.1.11/V2.1.10/V2.1.9 共 3 条
     - `README.en.md` "## 📋 Version History" 同样裁剪
     - `SKILL.md` 末尾 "## 📋 版本记录" 同样裁剪
     - 三个文件都保留段末 "完整变更历史见 CHANGELOG.md / GitHub Releases" wrap-up
     - CHANGELOG.md（本文件）**不动**，继续承担完整 keep-a-changelog 历史的角色

  2. **架构图 alt 文字同步到 v2.1.11**：
     - `README.md` 顶部 `<img src="./docs/architecture.svg" alt="majia-guanyuan v2.1.3 功能图..."/>` → 改成 v2.1.11，把 Part D（V7 发布流水线 + customChart autoBootstrap + chip toolbar + 移动端 phoneLayout ZIP inject）+ 餐饮 BI 公式实战库都写进 alt 文字
     - `README.en.md` 同样
     - **注意**：本次只改 alt 文字，没重新生成 svg/png 内容（svg 上还画着 v2.1.3 时代的"三块拼图"+ Part C-12 NEW 高亮，未反映后续 V2.1.5 餐饮库 / V2.1.6-V2.1.10 Part D 五段新增能力）。重画 svg 留给下一次有时间时做。

  3. **所有 version 字符串对齐**：
     - `README.md` / `README.en.md` Skill Version badge `v2.1.10-blue` → `v2.1.11-blue`
     - `SKILL.md` 主标题 `（V2.1.10）` → `（V2.1.11）`
     - `SKILL.md` 末尾"版本"字符串 `V2.1.10（2026-05-21）` → `V2.1.11（2026-05-22）`
     - `SKILL.md` `metadata.version: "2.1.10"` → `"2.1.11"`
     - `manifest.json` + `package.json` version → 2.1.11，description 顶部加 V2.1.11 一句话短摘要

  4. **新增 V2.1.11 entry** 写进 README.md / README.en.md / SKILL.md 末尾的版本记录段，保持 ≤ 3 条规则下三个文件全部以 V2.1.11/V2.1.10/V2.1.9 收尾。

### Zero changes

- `references/` 一行未改
- `templates/` / `scripts/` 一行未改
- 命令面 / 依赖版本 一行未改

纯文档整理 + 工程治理 patch — patch bump 2.1.10 → 2.1.11 合规。

## [2.1.10] — 2026-05-21

### Added

- **`references/v7-page-card-publish-pipeline.md` §16 移动端 phoneLayout 完整指南 + v7 草稿 save API 死路**
  —— 来自同一天给 9 个 demo 看板（01-高层经营驾驶舱 / 02-会员私域驾驶舱 /
  03-会员经营任务池 / 04-门店每日指挥台 / 05-活动权益复盘 / 06-体验风险专题 /
  07-单店利润健康 / 08-加盟商单店报告 / 09-总览-ECharts 重构）做移动端适配的
  30+ 轮 API 探索结果。9 节 ~330 行。
  - **§16.1 v7 BI 草稿/发布机制画像** —— `/page/<pgId>/edit` URL 自动跳
    `/page/<pgId>_draft/edit`，BI 后端创建草稿，所有 cdId 重新生成临时 ID
    (`r...` / `h...` / `n...`)；用户在编辑器里拖动 / 改样式走**非 REST 通道**
    (WebSocket 或 Redux 内部 batch)；点"发布"调 `POST /api/page/<pgId>/release`
    草稿状态发布到正式，cdId 重映射后草稿被销毁。
  - **§16.2 草稿 save API 是死路（8 个候选实测全 stub / 404）** —— 完整探测表：
    `/save` 200 但 GET 回来字段不变（stub）/ `/saveMeta` 404 / `/save-meta` 404 /
    `/update` 404 / `/draft/save` 404 / `/api/v2/.../save` 500 / `/api/page/save` 500 /
    `/phoneLayout` 500 / `PUT /phoneLayout` 404 / `PUT /<dpg>` body `{meta:{...}}` 404；
    body 格式排除：`{meta:{...}}` / 整 page 对象 / `{page:{...}}` / `{pgId,meta}` /
    `{meta,version}` 全部失败。**chrome network panel 抓 BI 编辑器"发布"按钮**
    只调一个 `POST /api/page/<pgId>/release`，确认 save 在拖动那一瞬间通过
    非 REST 通道完成。结论：放弃草稿 save 走 §16.3。
  - **§16.3 唯一可行路径：guanvis-skill pack → Python 注入 → upload** ——
    `guanvis-skill upload` 走 transfer API（`/api/manual/template/transfer` +
    `needIdMapping=false`）**直接覆盖发布版 meta** 不经过草稿。ZIP 结构：
    `PK-<uuid>/descriptor.json` 含 resource 数组（cards + page）+ `meta.json`
    包元数据。**关键坑：`page.meta` 必须是 JSON 字符串**不是 object，第一次
    把 inner meta 当 object 写回报 `error.expected.jsstring`；必须
    `json.dumps(inner, ensure_ascii=False)` 回字符串再 zip。
  - **§16.4 phoneLayout 数据结构标准（五字段）** ——
    `layoutSetting` (col:6, rowHeight:14, mobileHeightUnit:60) +
    `layout` (每项 `i/w/h/x/y/minW/minH/moved/static/isDraggable/isResizable`) +
    `layoutItemMap` (selector 必须包在 `group_AUTO_PHONE` 容器里, `cdIds:[selCd]`) +
    `tabMap: {}` + `mobileAnchorCds: []`。高度换算：customChart 像素 = `h × 14 + 12`，
    h=15 默认 222px 装不下 4 KPI + 4 图表；h=40 推荐 572px 完整呈现；h=50+ 适合
    长看板。selector group h=3 是输入框 + label 最小高度。
  - **§16.5 CSS @media 移动端响应式模板（9 看板验证版）** —— 768px 断点：
    KPI / grid-2 / grid-3 全 `grid-template-columns: 1fr 1fr !important` (4→2)，
    `.kpi-value` 28px → 18px，`.chip-toolbar` 自动换行，`.chart-body` 高度统一
    200/160/180/240px。480px 断点：grid-2 → 1 col。**两个关键 fix**：
    (a) `html, body { height: auto !important; overflow-y: auto !important }`
    解锁 PC 端 height:100% 锁死的手机 iframe 滚动；
    (b) `#dash-root` 加 `-webkit-overflow-scrolling: touch` iOS Safari 惯性滚动。
  - **§16.6 实战脚本** —— `inject_phone_layout.py` 完整实现（解 ZIP → 自动检测
    selector cdType=6 → 保留主卡片 cdId → 字符串化 meta → 重新打包）；批量 9 看板
    shell 模板 `for d in 01-* ... 09-*; do pack → inject → upload; done`。
  - **§16.7 副作用提示** —— ZIP upload 绕过草稿直接覆盖发布版，用户之前手动
    拖过的草稿状态会被废；想保留用户值就先 GET 现有 `phoneLayout.layout[].h`
    再传脚本。下次进编辑器 BI 会基于新发布版重新生成草稿。
  - **§16.8 何时用 ZIP inject / 何时用编辑器拖** —— 单看板 ad-hoc 5 秒拖；
    批量 ≥ 3 个 / DSL 升级前 / guanvis-skill page DSL 还不原生支持 phoneLayout
    时走 ZIP inject；复杂混合布局（多张普通卡 + customChart 各自高度不同）
    脚本不处理（只处理"单 customChart + 0~1 selector"），编辑器拖。
  - **§16.9 验证 / 排查 checklist** —— `guancli fetch GET /api/page/<pgId>`
    看 `meta.phoneLayout.layout` 一行 Python 提取；浏览器
    `?pageRenderType=phoneView` 直接看渲染；常见错误对应表（5 类症状 → 根因 → 解）。

- **`scripts/inject_phone_layout.py`** —— §16.6 的脚本本体直接进 skill scripts/，
  用户可以 `cp ~/.agents/skills/majia-guanyuan/scripts/inject_phone_layout.py .`
  直接用，不用再从 markdown 里复制。CLI：`python3 inject_phone_layout.py
  <input.zip> <output.zip> <chart_h>`。

### Changed

- **`SKILL.md` frontmatter `description` 加入 V2.1.10 关键触发词** —— Part D
  描述追加"移动端 phoneLayout ZIP inject"，触发词集合增加：移动端适配 /
  phoneView / phoneLayout / mobileHeightUnit / _draft 草稿 save API 失败 /
  error.expected.jsstring / ZIP 注入 phoneLayout / transfer API 覆盖发布版。

- **`SKILL.md` 主标题 `# 观远 BI · 马甲专版（V2.1.9）` → `（V2.1.10）`** —— 版本同步。

- **`SKILL.md` 末尾版本字符串 `V2.1.7` → `V2.1.10`、`metadata.version 2.1.9 → 2.1.10`** ——
  V2.1.7/V2.1.8/V2.1.9 的末尾版本字符串遗漏未升，这次一并修复。

- **`SKILL.md` references 表行数 `~340` → `~1120`** —— v7-page-card-publish-pipeline.md
  从 V2.1.6 的 12 节扩到现在的 16 节，行数翻三倍；触发关键词扩到 V2.1.8/V2.1.9/V2.1.10
  全覆盖。

- **`SKILL.md` Part D `📖 完整 13 节` → `完整 16 节`** —— 同步章节数。

- **`SKILL.md` 版本记录段补齐 V2.1.8 / V2.1.9 entry** —— 之前 SKILL.md 跳过了
  这两版（CHANGELOG.md 是齐的），现在 SKILL.md 末尾"版本记录"段把 V2.1.8/V2.1.9
  也补上，和 CHANGELOG.md 对齐。

- **`manifest.json` + `package.json` version `2.1.9` → `2.1.10`** + description
  重写覆盖 V2.1.10 §16 / V2.1.9 §15 / V2.1.8 §14 全部新增能力。

## [2.1.9] — 2026-05-21

### Added

- **`references/v7-page-card-publish-pipeline.md` §15 customChart 三大坑 + autoBootstrap + chip toolbar 兜底**
  —— 来自同一天把 8 个 HTML SDK customChart 看板 + selector 联动调通的实战。
  v7 BI 实例上 HTML customChart 有三个嵌套坑，每一个单独都让 demo 演示当场卡死。
  - **§15.1 BI 不自动调 `renderChart`** —— iframe 加载完成、`renderChart` 已定义、
    单 dataView fetch 都能拿到数据，但根 div 永远显示"看板加载中..."。同一份代码
    03-tasks 能跑、07-profit-health 不能跑。BI 内部状态机 race condition，自身
    无重试。唯一兜底：iframe 顶部加 `autoBootstrap`，5s 后若仍"加载中"则主动
    fetch `POST /api/card/<customChartId>/data` 拿全部 viewData 手动喂 `renderChart`。
    含完整代码模板（fetch + credentials + parent.location.origin 拼绝对 URL）。
  - **§15.2 selector 联动 customChart 失败** —— autoBootstrap 让看板渲染了，
    但顶部 selector 选店型不联动。三个根因连环：(1) autoBootstrap fetch 绕过
    BI redux dispatch，server 无法关联 selector state；(2) **实测 7 种 body
    filter 格式 BI 全不认**（`filters` / `globalFilters` / `filterConditions` /
    `selectorFilters` / `cardFilters` / `whereSegments` / `extraFilters`），
    `/api/card/<cdId>/data` 不接受任何 body filter；(3) `window.PAGE_DATA_SDK`
    构造器存在并暴露 `getCardData` / `updateSelectorValue` / `scopeEventEmitter`，
    但 `.initPage()` 卡在 `Cannot read properties of undefined (reading 'pgId')`，
    iframe 内外、React fiber 都找不到现成 SDK 实例。
  - **§15.3 终极兜底 chip toolbar 模式（强烈推荐）** —— 抛弃 BI selector 改在
    customChart 内部加 chip toolbar + JS 侧 filter，完全在 iframe 内闭环。三步：
    每个 dataView 加 `addRow(f("门店类型"))` → JS 顶部加 `ALL_TYPES + activeType` state
    和 `changeType()` re-render → CSS 加 `.chip` / `.chip.active` 渐变样式。实测
    07 单店利润健康：点"写字楼店" KPI 1.15 亿 → 2463.9 万、严重亏损 378 → 0
    instant 刷新，无需点查询/F5。
  - **§15.4 何时用 selector / 何时用 chip toolbar** —— customChart 多 dataView
    复杂看板强烈推荐 chip toolbar；维度基数 ≤ 10 的离散筛选（店型/区域/品牌）
    chip 点击 UX 优于下拉；> 20 基数 / 数值范围 / 日期保留 BI selector。
  - **§15.5 排查 checklist** —— iframe 内 / 父页 两段验证代码片段。

### Changed

- **`SKILL.md` frontmatter `description` 加入 V2.1.9 关键触发词** —— Part D
  描述追加"customChart 渲染/联动三大坑 + chip toolbar 兜底"，触发词集合增加：
  customChart 看板加载中 / renderChart 不调 / autoBootstrap / PAGE_DATA_SDK /
  selector 联动失败 / chip toolbar。

- **`SKILL.md` 主标题 `# 观远 BI · 马甲专版（V2.1.8）` → `（V2.1.9）`** —— 版本同步。

## [2.1.8] — 2026-05-21

### Added

- **`references/v7-page-card-publish-pipeline.md` 新增 §14 SmartETL 节点化两大静默坑**
  —— 来自同一天演示项目把 6 个 ETL 从"全 SQL 三节点版"改成"花式 SmartETL 节点链
  版"实战。把 SQL 三节点拆成 8-17 个节点（INPUT / FILTER_ROWS / CALCULATOR /
  GROUP_BY / JOIN_DATA / SQL_SCRIPT / OUTPUT）时，踩到两个**永远不会出错误日志**
  的静默坑——save 返回 success，execute FINISHED，但数据全错（COUNT_DISTINCT
  字段变成 ID 字符串、JOIN 行数从 10 万爆到 900 万）。这是 demo 演示前一定要查的
  最致命的坑。
  - **§14.1 GROUP_BY 节点不支持 STRING 字段的 COUNT / COUNT_DISTINCT** ——
    BI 把 `aggrType: "COUNT_DISTINCT"` **静默改成 `aggrType: "NUL"`**，等于
    没聚合，输出取了原字段第一个值。修复策略 A：业务唯一字段（订单ID）→
    前置 CALC 派生 1 + GROUP_BY SUM；策略 B：真去重（会员ID）→ **两层
    GROUP_BY 模拟去重**（第一层把粒度细化到去重字段，第二层 SUM 派生 1）；
    策略 C：SQL_SCRIPT 旁路 + JOIN（注意 §14.2 多谓词坑）。
  - **§14.2 JOIN_DATA 节点不支持多谓词** —— `predicates` 数组虽然能传 N 个，
    但 BI 执行时**只用 `predicates[0]`**，第二个及之后全部忽略 → 笛卡尔积爆炸。
    operator=EQ 加了无效，拆 columnFuses 被拒收。唯一修复：**用 SQL_SCRIPT
    替代多键 JOIN**。单键 JOIN 仍走 JOIN_DATA 节点。同时附 FULL_OUTER joinType
    也会被静默吞掉的坑（actions 数量比发出去的少 1 → 下游 `key not found`）。
  - **§14.3 SmartETL builder 函数库参考实现** —— `smart_etl_builder.py` 的
    `node_group_by` / `node_join` 工厂函数文档注释里固定写两个坑的提示，
    aggrType=COUNT/COUNT_DISTINCT 自动把 fdType 改成 LONG，避免 BI 直接拒收。
  - **§14.4 6 个 SmartETL 标杆实战节点链** —— 演示沉淀的 6 个 ETL（10/10/10/8/8/17
    节点）对应的节点链缩写表 + 关键技巧，含命名规范（ETL 名末尾加
    `(N节点·F+C+G+S+J)` 后缀方便和 SQL 三节点版区分）。
  - **§14.5 排查 checklist** —— 5 条 demo 演示前必跑的 `guancli` 自检命令，
    覆盖行数验证 / 预览前 5 行 / 反查 aggrType=NUL / 检查 predicates 数量 /
    比对 actions 数量。

### Changed

- **`SKILL.md` frontmatter `description` 加入 V2.1.8 关键触发词** —— 在 Part D
  描述前缀加入"SmartETL 节点化两大静默坑"，触发词集合增加：SmartETL 节点化 /
  COUNT_DISTINCT 输出空 / aggrType NUL / JOIN 多谓词笛卡尔积 / FULL_OUTER 被吞 /
  两层 GROUP_BY 模拟去重。保证用户撞到这些字面 token 时能正确路由到本 skill。

- **`SKILL.md` 主标题 `# 观远 BI · 马甲专版（V2.1.7）` → `（V2.1.8）`** ——
  版本号同步。

## [2.1.7] — 2026-05-21

### Changed

- **`SKILL.md` frontmatter `description` 大幅扩展** —— 加入 V2.1.6 的 Part D 触发关键词
  和 V2.1.5 的餐饮 BI 公式库触发关键词，把"用户撞到这些场景才触发本 skill"的关键
  字面 token 写进描述里。这是这版最重要的改动：trigger 用的是 frontmatter
  description，原描述只列了 Part A/B/C，Part D（v7 BI / `60004` 草稿 / guanvis-skill /
  CSV 三态 / Spark CTE 中文别名 / `1012` 同名文件）和餐饮库（复购率 / 客单价 / RFM /
  DWD 宽表 / 财务双源对账 / AC / ADS / Comp）的所有用户语料**根本不会路由进来**。
  这次的描述把 5 大能力按"业务标签 + 报错字面量 + 工具关键词"三类全列了进来。

- **`SKILL.md` 新增 `# 🆎 Part D` stub section**（紧跟 Part C C-12 后、References 目录前）——
  原先 Part D 只在主路由表第 44 行出现一个表格项，主文里没有自己的章节，跟
  Part A/B/C 三大块在结构上不对称（即使 Part C-12 这种 reference-only 节也写了
  ~15 行 stub）。这次按 Part C-12 同款模板补齐：触发场景 7 条枚举 / 架构与硬规则 /
  两条"不能跳的硬约束" / 入口指向 `references/v7-page-card-publish-pipeline.md`。
  Progressive disclosure 不变，主文增 ~28 行换 Part D 在 routing/分流上的正式
  地位。

- **三处 V2.1.6 残留版本号修正** ——
  ① `SKILL.md` 主标题 `# 观远 BI · 马甲专版（V2.1.5）` → `（V2.1.7）`，发布
  V2.1.6 时漏改；
  ② `SKILL.md` frontmatter `metadata.openclaw.install` 的 npm 约束 `@guandata/guancli@^1.0.21`
  → `^1.0.24`，对齐 `manifest.json` 和 V2.1.6 body 段 `版本：V2.1.6 ... 依赖：@guandata/guancli@^1.0.24`
  的事实；
  ③ `SKILL.md` "三件套角色互补"表 `majia-guanyuan` 行版本 `2.1.5` → `2.1.7`，
  同时把"主要角色"列加上"V7 发布流水线"，"何时触发"列追加 V2.1.6 一行能力摘要。

- **`SKILL.md` 版本头** `V2.1.6（2026-05-21）` → `V2.1.7（2026-05-21）`，"V2.1.6 新增"
  字样保留为历史注解（"V2.1.6 起"）。

### Updated

- `manifest.json` `version: "2.1.6"` → `"2.1.7"`；`description` 开头把"V2.1.7 是 routing/triggering refresh"
  写明，把这次的具体变更（描述扩展 / Part D stub / 三处版本字符串校对）列出来。
- `package.json` `version: "2.1.6"` → `"2.1.7"`；`description` 重排为 "5 大能力 + V2.1.7 是 routing
  refresh + V2.1.6/V2.1.5 历史摘要"，结构更清晰，npm 详情页可读。
- `README.md` / `README.en.md` 顶部版本记录补 V2.1.7 entry。

### Notes

- **零 references / templates 新文件 / 零 SKILL.md 命令面改动** —— V2.1.7 是 docs-only
  refresh，重点是让 Skill 在用户问"v7 BI 看板被 60004 卡住"、"散客订单算成 100%
  会员订单"、"Spark `WITH 订单汇总 AS` 报错"、"复购率怎么算"、"AC 老店怎么定义"
  这类问题时能正确触发——之前 description 没列这些关键词，trigger 命中率
  低；这次补全后命中率应明显提升。
- **零 breaking change** —— 所有命令面、Part A/B/C/D 主体内容、依赖约束 都保持
  V2.1.6 状态。老用户 `git pull` / `npm i @supermajia/majia-guanyuan@latest` / ClawHub
  一键升级即可。

### Why this is its own version

`@supermajia/majia-guanyuan@2.1.6` 已发布到 npm，registry 拒绝同版本号重发。
本次是 trigger 路由层强化（description 扩描 + Part D stub），按 V2.1.x 既有节奏走
PATCH bump 即可。和 V2.1.4 / V2.1.5 同款 docs-only 模式。

## [2.1.6] — 2026-05-21

### Added

- **`references/v7-page-card-publish-pipeline.md`：V7 Page/Card 发布流水线 + 三态硬规则** ——
  全新一篇 ~340 行 reference，沉淀自 2026-05-20/21 一次"连锁咖啡 BI 演示拍摄录制"全流程实战
  （90 天 / 1200 门店 / 80K 会员 / 20 张表 / 17 个 ETL / 6 个 HTML 应用化看板）的 12 大踩坑：

  - **§1 v7 BI 草稿/发布机制是最大盲区** — 直接 `POST /api/page` + `POST /api/card` + `PUT /api/page/<draft>`
    在 v7 实例上**全部废**（`60004 此操作只能在草稿页面执行`、draft cdId ≠ published cdId 不映射到 published）。
    **银弹是 `guancli ≥ 1.0.24` 自带 `guanvis-skill`** 公网分发，`guancli install-skill` 一键装，
    `guanvis-skill publish .` 30 秒发布整个 page + custom chart + dataView。手撸 API 路径被官方废弃。
  - **§2 HTML 应用化看板 SDK 最小骨架** — 4 文件（schema.js / card_01_html.js / page.js / charts/dashboard.{html,css,js}）+
    `createCustomChart().setSubType(CustomChartSubType.SDK).loadContent("charts/dashboard").addDataView(dv)` DSL。
  - **§3 CSV 三态判断硬规则**（v2 § 12.5 落地标准） — 散客订单 `会员ID` 是空字符串 `""` 而非 NULL，
    `IS NOT NULL` 把所有订单算成会员订单使北极星 #1 "会员销售占比" = 100% 假数据。
    必须 `(会员ID IS NOT NULL AND 会员ID <> '')`。**但日期/数字字段不能 `<> ''`**（Spark 严格类型）。
  - **§4 Spark SQL 4 个硬限制** — CTE 别名必须英文（`WITH 订单汇总 AS` 报 `PARSE_SYNTAX_ERROR Syntax error at or near '订'`）；
    Window function 不能嵌套在 aggregate function；`<> NULL` 永远 unknown；
    `WHERE 日期 < '今天'` 字符串字面量永远不匹配。
  - **§5 ETL Update 模式 OUTPUT_DATASET 必须带 dsId** — 否则 `1012 输出数据集目录中存在同名文件，请修改`。
    reapply 脚本里要自动用 `guancli ds search <output_name>` 查现有 dsId 注入。
  - **§6 数据集上传 BI 无原生 API** — `POST /api/data-source/*` 全失败（OPTIONS 只允许 GET/HEAD/DELETE），
    Claude in Chrome `file_upload` 10MB 限制也走不通。最终方案：BI UI 手动上传（30-45 分钟）。
  - **§7 pandas to_csv 比 to_excel 快 50×** — 50 店 / 90 天 / 45 万订单，openpyxl 写 4-5 分钟，CSV 写 2-3 秒。
    行数 > 5 万自动转 CSV，向量化（`np.repeat + np.bincount`）比 `dict.append + DataFrame()` 快 30 倍。
  - **§8 JOIN 键全局统一命名** — `campaign_id` 在 dim 里叫 "活动ID" 在 fact 里叫 "关联活动ID" 会让 ETL JOIN 写两套，
    必须 `COL_MAP` 里统一（活动ID / 订单ID / 会员ID 全表同名）。
  - **§9 奶白主题 #faf7f2 + 暖蓝 #2563eb** — 业务用户对深色主题（`#0f172a` 等）有强抵触，默认走奶白。
    ECharts 不要用 `dark` 主题。
  - **§10 端到端时间预算** — 完整 demo 真实耗时 5-7 小时（数据生成 2 min / 上传 30-45 min /
    ETL 写入执行 15-25 min / **看板 3-4 h 写代码占大头**），guanvis-skill 把"看板创建"从 2-3 小时探索压到 30 秒发布。
  - **§11 12 类反模式与硬约束总表**
  - **§12 完整 demo 工程目录参考结构**（scripts/ + etl_payloads/ + dashboards-v3/ 6 子目录）
  - **§13 与 Part C-12 的关系** — Part C-12 讲"已有 page+card 后如何写 HTML 内容 + selector descriptor patch"，
    本文件讲"从零到 6 个看板上线"端到端流程。

- **`SKILL.md` 主路由表新增 Part D 入口**，触发关键词：
  - "v7 BI 实例上端到端搭多个 HTML 应用看板"
  - "手撸 POST /api/page+/api/card 被 60004 此操作只能在草稿页面执行 卡住"
  - "CSV 散客 会员ID IS NOT NULL 算出 100% 假指标"
  - "Spark WITH 中文别名 报 PARSE_SYNTAX_ERROR"
  - "ETL update 报 1012 输出数据集目录中存在同名文件"

- **📚 References 目录新增 `v7-page-card-publish-pipeline.md` 条目**

### Changed

- **frontmatter** `version: "2.1.5"` → `"2.1.6"`
- **manifest.json** `version: "2.1.5"` → `"2.1.6"`，`description` 扩展到 5 大能力（新增 Part D）
- **依赖版本升级** `@guandata/guancli@^1.0.21` → `@guandata/guancli@^1.0.24`
  （1.0.24 自带 `guanvis-skill` 公网分发，`guancli install-skill` 一键装到 `~/.agents/skills/`，无需再走内网 Nexus 私服）
- **README 介绍升级提示** `V2.1` 段落补提 `1.0.24` 自带分发新事实（V2.1 时还是内网 Nexus）

### Compatibility

- 纯 docs + 路由表增量，零 breaking change。已有 Part A/B/C/餐饮公式库用户继续按原方式触发。
- 新依赖 `@guandata/guancli@^1.0.24` 向下兼容 `1.0.21+` 的所有命令面（`metric query` / `card preview -f excel` 等）。

## [2.1.5] — 2026-05-18

### Added

- **`references/restaurant-bi-formulas/`：餐饮连锁 BI 公式实战库** ——
  全新一组 10 个 markdown 文件（**2881 行**），蒸馏自两段连续的餐饮 BI 分析师履职 + 39 个生产 ETL，**已完全脱敏**（品牌名 / 字段指纹 / 产品名 / POS 厂商名 / 路径全部抽象化）。Skill 触发关键词扩充：用户问"如何算复购率/客单价/同店增长"/"怎么判新老客"/"用餐时段怎么分桶"/"为什么会员数对不上"/**"我要写 DWD 宽表/评价 pipeline/财务对账"** 都会路由进来。
  - **`README.md`** — 路由表 + 字段词典 + 5 条最易踩坑 TL;DR
  - **`01-date-and-time.md`**（204 行）—— 实时日期范围、T-1 系列、近 N 天/月/周、用餐时段分桶、时间宏 `{{{...}}}` 三花括号规则、月份截取、日期距离、跨月对齐
  - **`02-customer-and-membership.md`**（700 行）—— 顾客标识跨渠道统一化（4 级优先级回填）、新老客（日/周/月维度）、消费频次 3 口径辨析、人均消费、**RFM 8 类 × 参考营销策略对应表**、**R 阈值多档分级**（单档/三档/四档场景决策表）、跨天 vs 非跨天复购口径、90 天复购分桶、注册前后订单 4 层 CTE 嵌套窗口、累计会员/留存/流失
  - **`03-revenue-kpi.md`**（237 行）—— AC、ADS、ADS_HD、ADT、AUD、Comp、TC_CRM%、NS_CRM%、营收/订单/渠道占比（含 `IF` 分母兜底）、客单分桶、累计消费窗口
  - **`04-channel-and-store.md`**（414 行）—— 业务渠道（堂食/外卖）、订单子渠道大 case（2024 跨年映射）、时效类型、StoreDate 门店日键、成长类型（新店/Comp/次新/非Comp）、注册门店优先级回填、营业天数累计窗口、**多渠道评价 Pipeline 4 个 pattern**（跨年 APPEND / 美团 split vs 饿了么 from_json 图片字段差异 / 堂食打卡+订单双源 JOIN / 总聚合分类）
  - **`05-coupon-and-discount.md`**（160 行）—— 核销率、折扣率聚合级 vs 单笔级、折扣分桶 7 档、券类型分流大 case、注册第一张券、30 日优惠订单比例
  - **`06-sql-utils.md`**（349 行）—— 字符串拆解（LEFT/SUBSTR/INSTR/regexp_extract）、数组聚合（explode-split、collect_set-concat_ws）、开窗排名三件套对比、累计窗口、ClickHouse 多表 LEFT JOIN 模板、COALESCE/IFNULL 三态判断、评价归一化技巧
  - **`07-data-quality-traps.md`**（245 行）—— NULL vs 0 vs 空字符串、三态判断（NULL / `''` / `'null'`）、字段口径歧义、TC 三口径、重复字段名教训、**通用字段词典**（餐饮连锁 A vs B vs 通用对照表）、`input1` 约定、日期边界 `>=` + `<` vs `BETWEEN`、CURDATE/current_date/now 区别
  - **`08-etl-engineering-patterns.md`**（288 行）—— **6 大 ETL 工程范式**：① **10-CTE DWD 宽表底座**（1 个 SQL_SCRIPT 串联 6 张维表 + 8 个 CTE 衍生层）② **轻节点重 SQL vs 重节点轻 SQL 工程哲学**（39 ETL 复杂度分布 + 选择经验法则）③ **财务双源对账**（FULL OUTER JOIN + 浮点精度兜底模板）④ **POS 系统识别 + 渠道归一化**（"不可篡改特征 > 数字编码 > 业务语义 > 原值兜底" 优先级原则）⑤ **会员生命周期多输出**（27 节点 ETL，含归属门店优先级回填）⑥ **Cohort 日期×门店网格**（笛卡尔积 + LEFT JOIN 填零模板）
  - **`09-etl-catalog.md`**（217 行）—— **39 个 V1 生产 ETL 索引清单**：按 11 业务域分类（基础维表层 / DWD 订单事实 / 会员档案 / 顾客行为分层 / 财务营收 / 营销目标 / 私域社群 / 活动券 / 评价管理 / 业务标签 / 数据质量），每个 ETL 给出节点数/输入/输出/SQL_SCRIPT 数/价值点；附复用决策表 + "体量 vs SQL_SCRIPT 占比" 统计分布 + V1 → V2 升级建议 + jq 引用方式

- **`SKILL.md` Part 选择路由表新增条目**：
  - 写餐饮业务公式 / 查字段口径 / 排数据质量坑 / ETL 工程范式 → 直接路由进 `references/restaurant-bi-formulas/README.md`
  - 📚 References 目录新增独立分类 **"餐饮 BI 公式实战库（V2.1.5 新建）"**，列出 10 个 reference 文件
  - 路径表 + 三件套版本对齐：本 skill 版本 `2.1.4` → `2.1.5`

### Changed

- `manifest.json` `version: "2.1.4"` → `"2.1.5"`；`description` 追加 V2.1.5 重大增量摘要
- `package.json` 同上版本号同步 + description 重写突出新增的餐饮公式库与 ETL 范式
- `SKILL.md` frontmatter `version: "2.1.4"` → `"2.1.5"`、主标题、版本头日期 `2026-05-15` → `2026-05-18`

### Notes

- **零 breaking change**：纯 docs 增量 + 索引扩充。老用户 `git pull` / `npm i @supermajia/majia-guanyuan@latest` / ClawHub / `gh skill` 一键升级，现有工作流不受影响。
- **所有内容均已脱敏**：品牌名（A 咖啡/B 麻辣烫 → 餐饮连锁 A/B）、产品/品类指纹（藤椒/麻辣烫/姬松茸/冬阴 等 15 类口味 → 商品风味分类示例）、POS 厂商真实名（甩手/哗啦啦/轩亚云/亮店掌/冥晨 → POS_A~POS_E）、路径（iCloud 绝对路径 → 占位说明）、个人后缀（"—马甲"）全部清理。3 轮 grep 扫描通过零命中验证。

## [2.1.4] — 2026-05-15

### Added

- **`references/guancli-commands.md` § 指标平台 — V2.1.4 起：`metric query` 泛化查询（guancli 1.0.20 新增）** ——
  把 1.0.20 给 `guancli metric query` 加的整套"高级指标分析" flag 完整接入：
  - `--compare yoy|mom|qoq|wow|dod` + `--compare-value value|rate|rawdata` —— 同比/环比/周环/日环，配 value 出绝对值、rate 出变化率、rawdata 出同期原值
  - `--xtd ytd|qtd|mtd|wtd|dtd` —— 年/季/月/周/日累计
  - `--recent 7d|4w|3m|2q|2y`（配 `--recent-base YYYY-MM-DD`）—— 最近 N 周期，业务侧"最近 7 天/4 周"不必再手算日期传 `--filter`
  - `--percentage --percentage-dim 城市` —— 占比，必须配维度
  - `--rank-top N --rank-dim 城市 --rank-order asc|desc` —— Top N 排名
  - `--last` —— 期末值（cumulative 期末快照）
  - `--adv-calc-json` —— 终极兜底，直接传 `AdvMetricSetting` JSON
  含"何时用哪个 flag"判断表 + `400 AdvMetricSetting invalid` 排错提示（多半是指标没配时间维度）。
- **`references/guancli-commands.md` § 页面 & 卡片探索 — `card preview -f excel`（guancli 1.0.20 新增）** ——
  Excel 2003 XML 格式导出，重定向 `> out.xls` 直接 Excel 打开。同时记录：
  - `--limit` 默认值从 50 抬到 10000（业务侧默认场景不再需要手指定）
  - `--sort-asc/--sort-desc` 排序取数下限固定 10000 行，服务端继续截断时命令会拒绝排序避免输出顺序不可信
- **`references/guancli-commands.md` § 全局 flag — `-f excel` 入 format 清单 + V2.1.4 错误捕获说明（guancli 1.0.21）** ——
  1.0.21 修了 CLI 运行时报错附带 `Usage:` / `Available Commands:` 大段帮助的 bug。本 skill Part B 的报错速查脚本（`guancli ... 2>&1 | head -n 5` 模式）现在能拿到干净错误信息，不会被 usage 长串覆盖。
- **`SKILL.md` § "guancli V1.0.21 新能力（V2.0 / V2.1.4 同步）"新增子节"V2.1.4 新对齐：1.0.20 / 1.0.21 增量"** ——
  把上述三项增量做成路由级提示，告诉 agent "用户问同比/累计/最近/占比/排名/Excel 导出/Part B 报错捕获" 时该想到这些 flag；详细命令面下沉到 references。

### Changed

- **`SKILL.md` 章节标题 + 元数据**：
  - 章节标题 `## guancli V1.0.19 新能力（V2.0 同步）` → `## guancli V1.0.21 新能力（V2.0 / V2.1.4 同步）`
  - 章节首段 `@guandata/guancli@1.0.19 的命令面` → `@guandata/guancli@1.0.21 的命令面`
  - 三件套角色表：官方 `guancli` 版本 `1.0.19` → `1.0.21`、majia-guanyuan `2.1.3` → `2.1.4`，并在官方 guancli 主要角色栏补"指标泛化查询 + card preview Excel 导出"
  - Part B 引言 `基于 @guandata/guancli@1.0.19 的实证记录` → `基于 @guandata/guancli@1.0.21 的实证记录`
  - 版本头 `V2.1.3（2026-05-14）`/`@guandata/guancli@^1.0.19` → `V2.1.4（2026-05-15）`/`@guandata/guancli@^1.0.21`
  - openclaw install 段 npm package 约束 `^1.0.19` → `^1.0.21`
  - frontmatter `version: "2.1.3"` → `"2.1.4"`
- **`manifest.json`**：`version` 2.1.3 → 2.1.4；`dependencies.node[0]` `@guandata/guancli@^1.0.19` → `@guandata/guancli@^1.0.21`；description 末尾追加 V2.1.4 摘要句。
- **`package.json`**：`version` 2.1.3 → 2.1.4；description 末尾追加 V2.1.4 摘要句（含 metric 泛化 flag 全清单 + card preview excel/limit/sort + 1.0.21 错误输出 fix）。
- **`README.md` / `README.en.md`**：版本记录顶部插入 V2.1.4 entry（中英文），保留 V2.1.3 entry。
- **`ATTRIBUTIONS.md`**：`@guandata/guancli` Version `1.0.19` → `1.0.21`。

### Notes

- **零 references / templates 新文件** —— V2.1.4 是 docs-only refresh + dep bump，完全在 `references/guancli-commands.md` 和 `SKILL.md` 内增量，没有新建 reference 章节或 template 文件。
- **依赖约束语义** —— 老约束 `^1.0.19` 按 semver 已经能装到 1.0.21；这次显式 bump 到 `^1.0.21` 是为了在 manifest / SKILL.md / openclaw install 段把"对齐基线"写明，避免下游 agent 用更老的 1.0.19 跑本 skill 的 metric 泛化查询章节示例时找不到 flag。
- **不引入新工作流** —— `card preview -f excel` 不替代 Part B 的 ds preview / dataset CRUD 任何环节；metric 泛化查询不替代 ChatBI 主题问数。这次只是把已有的 metric/card 探索章节升级到命令面更宽的版本。
- **业务价值校准** —— 1.0.20 的 metric 泛化查询是这次 release 最重要的变化：以前 BI 后台要点开"高级计算"面板才能算的同比/年累计/Top N 现在一行命令出数，Part B 治理扫描完做"指标 → 业务报表"翻译时少一次后台往返。

### Why this is its own version

V2.1.3 已经把 npm + ClawHub + GitHub release 锁定，两个 registry 都拒绝同版本号重发（`ConvexError: Version already exists` / `You cannot publish over the previously published version`）。本次是命令面同步 + 文档增量 + dep bump，按 V2.1.x 既有节奏走 PATCH bump 即可——和 V2.1.3 同款 docs-only 模式，但带 dep 约束 bump，所以不能复用 V2.1.3 tag。

## [2.1.3] — 2026-05-14

### Added

- **`docs/architecture.svg`** —— v2.1.x 功能说明图全面刷新。原图是 V1.5.0 时代
  的"三块拼图"信息架构，没反映：① V2.0.0 的 `majia-guanyuan` 重命名；
  ② V2.1.0 的 `@guandata/guanvis-skill` 内网 Nexus 三件套共存；
  ③ V2.1.1 的 Part C-12 HTML 应用化看板生成。新版图重新设计为：
  - **顶部 header**：版本 chip（v2.1.3 · 2026-05-14，深底黄字 pill）+ 工具无关副标
  - **三件套共存条带**：guancli 1.0.19（公网必装基底，蓝）/ guanvis-skill 0.1.13
    （内网 Nexus 可选增强，紫）/ majia-guanyuan 2.1.3（当前 skill，绿，带"当前"标）
  - **Part A 卡片**：保留 26 图表 / 26 聚合 / 13 操作符等清单，新增"V2.1 路由"
    底部提示框（标准卡片 → guanvis-skill DSL，本 skill `create-and-get` 作 fallback）
  - **Part B 卡片**：保留 11 API / 8 维去留判断 / 五层架构等，新增"B-17 ExecPlan"
    底部高亮（先验数据 → ExecPlan → 重写 → 双跑对比 → 切流，琥珀色块）
  - **Part C 卡片**：上半部分压缩 C-1 ~ C-11 既有路线（renderChart 契约 / 5 种 data
    形态 / z-index 基线 / 生命周期销毁），下半部分新增 **C-12 NEW 高亮模块**
    （粉紫渐变边框 + glow 阴影 + NEW chip）：触发词清单 / 6 模块默认故事线 /
    GDHTML 12 个 API / selector descriptor patch / 12 步工作流 / 4 层验收
  - **底部基础设施条**：10 类报错 / 30 条法则 / 60+ 战例（数字校准为 77 ETL /
    251 数据集 / 86 看板）/ 渐进式披露（标 v1.5 引入，-1.2 万 token / 次）
  - **footer install**：补 npm 安装路径 `npm i @supermajia/majia-guanyuan`，
    与 gh skill / npx skills / `/plugin marketplace` 并列

- **`docs/architecture.png`** —— 2880×1840 @2x DPI 渲染产物，Chrome headless
  生成，覆盖中文字体（-apple-system / PingFang SC / Microsoft YaHei fallback）。
  npm 包页面 / ClawHub package 页面如果不支持 SVG 渲染，可用 PNG 作为
  fallback；社交媒体发布也直接拿 PNG。

### Changed

- **`package.json#files`** —— 把 `docs/` 加进 npm tarball。V2.1.2 修了
  `templates/` 的同一类问题，但 V2.1.1 引入 `docs/architecture.svg` 时也忘了
  列 `docs/`，所以 V2.1.2 之前 npm install 用户在 README 渲染时其实是看不到
  capability map 的（broken image）。
- **`package.json#description`** —— 末尾追加 V2.1.3 摘要句。
- **SKILL.md / README.md / README.en.md** —— 版本号、徽章、alt 文本、
  作者签名版本行、"版本记录"段全部对齐到 V2.1.3 / 2026-05-14。
- **`manifest.json#version`** + **`.skill-sync.json#version`** 同步。

### Notes

- **零 references / templates 变更** —— V2.1.3 是 docs-only patch，
  `references/part-c-html-dashboard.md` / `templates/html-dashboard/` /
  `references/guancli-commands.md` 等所有 V2.1.x 引入的核心内容保持原样。
- **不动现存命令面 / API / 路由规则** —— Part A/B/C 的实操章节、SKILL.md
  Part 选择表、与官方 skill 共存表全部保持 V2.1.2 状态。
- **依旧没有 npm dependencies 变化** —— `docs/architecture.png` 是 build
  产物（headless Chrome 一次性渲染），不需要任何运行时依赖。

### Why this is its own version

V2.1.2 时整个 release pipeline (npm + ClawHub + GitHub release) 已经锁定，
两个 registry 都拒绝同版本号重发 (`ConvexError: Version already exists`),
所以 docs-only 改动必须走 patch bump。两者一致行为：
- npm publish 2.1.2 → "You cannot publish over the previously published version"
- clawhub skill publish --version 2.1.2 → `ConvexError: Version already exists`

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
