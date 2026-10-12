---
name: majia-guanyuan
description: 观远 BI（Guandata）实战增益层。标准查数、指标批量查询、本地分析、建卡发布、ETL、数据集和表单结构管理、工作流、指标写入路由官方六组件。专攻 ETL 整库治理、SmartETL 全链路重写、引擎报错、自定义图表与 HTML 看板排障、看板口径档案与只读逐格验收、v7 发布兼容、移动端 phoneLayout、门店手机成绩单、SuperApp 的 LLM 中转及历史兼容、AI-native ADS 架构判断。餐饮会员公式见 majia-huiyuan。触发：execute-sql 5001、SQL 直查不可用、ETL 预览汇总、分块取数、历史数据抽取、预览截断、数字出处、看板口径档案、看板答案对账、观远、Guandata、会员、订单、复购率、RFM、ETL 治理、payload_json、自定义图表、HTML 看板、门店手机成绩单、换店滤空、phoneLayout、60004、SuperApp、ILLEGAL_JSON_RES、数据架构。
license: MIT
metadata:
  version: "3.4.1"
  author: "超级马甲 / maojiebc"
  homepage: https://github.com/maojiebc/majia-guanyuan
  openclaw:
    emoji: "📊"
    homepage: https://github.com/maojiebc/majia-guanyuan
    os:
      - macos
      - linux
    requires:
      bins:
        - jq
        - bash
    install:
      - kind: npm
        package: "@guandata/guanskill"
        bins:
          - guancli
          - guanvis
          - guanetl
          - guanwf
          - guands
          - guanmetric
---

# 观远 BI · 马甲实战版（V3.4.1）

> **结构说明（V1.5.0 引入 progressive disclosure）**：本文档是**路由层 + 关键规则**，详细操作手册下沉到 `references/`。每个 Part 的入口章节会指出"何时回到 references/ 查全表"。完整章节索引见末尾的 [📚 References 目录](#-references-目录)。

## 🧭 Part 选择

| 你想做 | 走 |
|---|---|
| 查数据、建卡、出报表、标准 ETL / 数据集 CRUD / 指标写 / 洞察问答 | [官方六组件路由](#官方全家桶--本-skill-分工总表) → 交给官方全家桶（`guancli` / `guanvis` / `guanetl` / `guanwf` / `guands` / `guanmetric`），见路由总表 |
| execute-sql 不可用 / 要全量汇总但只能预览 / 大数据集分块读取 / 预览疑似截断 / 季度或历史取数要留数字出处 | [受限环境取数速查](references/restricted-query-playbook.md)，先核权限、完整性与预览名额，再选择只读汇总或分块读取 |
| 给已有看板接 AI / 固化指标口径 / 核对答案与页面筛选 / 检测公式或隐藏筛选变化 | [看板口径档案与只读验收](references/dashboard-evidence.md)，用 `scripts/dashboard_evidence.py` 管理本地定义、原始取数与逐格断言 |
| 扫整库 ETL 治理 / 新建/修改/删除 ETL / 字段使用度审计 / 修复 ETL 报错 | [Part B：ETL 治理](references/part-b-governance.md) |
| 把整条 SmartETL 链改写成 SQL 版 + 页面副本验收 + 差异定位 + 空快照阻塞 | **Part B-17：全链路重写方法论**（拆到 [references/part-b17-fullchain-rewrite.md](references/part-b17-fullchain-rewrite.md)） |
| 30+ 张表批量迁移 / 跨多日工程 / 复杂重构需要项目化追踪 | [B-17.11 ExecPlan 工作法](references/part-b17-fullchain-rewrite.md)（§11） |
| 自定义图表 HTML/CSS/JS 注入、固定卡片/overlay、payload_json 取数、路由清理 | [Part C：自定义图表](references/part-c-runtime.md) |
| 从零生成 HTML 化经营分析应用（用户说"更高级 / 应用化 / 自定义模块 / 最完美 / 不限标准看板"）| **Part C-12：HTML 应用化看板生成**（拆到 [references/part-c-html-dashboard.md](references/part-c-html-dashboard.md)） |
| 手机成绩单专供ETL / 红色异常提示 / 券转化明细 / 近7天营业额排序 / 核销未匹配订单 | **V2** [实践与口径](references/part-c-store-mobile-scorecard-v2.md)、[离线示例](examples/store-mobile-scorecard-v2/README.md)、[券关联排查](references/coupon-order-link-diagnosis.md) |
| 加盟店老板手机成绩单 / 门店移动看板 / 换店后财务空白 / GDPlugin 视图顺序错位 / 对比组家数泄露 / 要一份可离线点的移动样本 | **Part C 门店手机成绩单**（拆到 [references/part-c-store-mobile-scorecard.md](references/part-c-store-mobile-scorecard.md)，离线 HTML： [examples/store-mobile-scorecard/](examples/store-mobile-scorecard/)） |
| **v7 BI 实例**上端到端搭多个 HTML 应用看板 / 手撸 `POST /api/page+/api/card` 被 `60004 此操作只能在草稿页面执行` 卡住 / CSV 散客 `会员ID IS NOT NULL` 算出 100% 假指标 / Spark `WITH 中文别名` 报 `PARSE_SYNTAX_ERROR` / ETL update 报 `1012 输出数据集目录中存在同名文件` | **Part D：V7 Page/Card 发布流水线 + 三态硬规则**（V2.1.6 新增，拆到 [references/v7-page-card-publish-pipeline.md](references/v7-page-card-publish-pipeline.md)） |
| **SuperApp / 超级应用 / 开放应用**开发流水线 / `guancli app create/publish` / `--app-id` 不传变成每次新建 / 数据集异步预览 3 步 / 表单结构先走 `guands form`；旧脚手架建表兼容问题按 §6/ **BI 中转 LLM 报 NOT_JSON_RES / ILLEGAL_JSON_RES**（响应被塞在 error_message）/ `/api/llm-config/list` 返回裸数组被脚手架 unwrap 吞 / 同源 fetch credentials 不带 cookie / 客户端模拟流式打字效果 / 任务池工作台「看 + 想 + 选 + 做 + 留痕」闭环 | **Part E：SuperApp 开放应用开发流水线**（V2.1.12 新增，拆到 [references/part-e-superapp-pipeline.md](references/part-e-superapp-pipeline.md)） |
| **客户说"想给现有 BI 接 AI / 上 LLM"** / "我们 ETL 治理做了一年还没出活" / **判断 是该治理还是该重搭** / 客户预算分配讨论 / 评估底表 schema 是否 AI-friendly / 提案"AI-native 数据底座" | **AI-native ADS 设计方法论**（V2.1.13 新增，**majia-guanyuan 的哲学层文档**——不是操作手册而是范式判断，拆到 [references/ai-native-ads-design.md](references/ai-native-ads-design.md)） |
| 写餐饮业务公式（AC / ADS / 复购率 / 新老客 / 用餐时段 / 留存流失 / RFM / Comp 老店）/ 查字段口径 / 排数据质量坑 / **ETL 工程范式（DWD 宽表 / 双源对账 / 评价 pipeline）** | **餐饮 BI 公式实战库**（[majia-huiyuan/公式库](https://github.com/maojiebc/majia-huiyuan/tree/main/公式库)，V2.1.5 蒸馏自两段餐饮连锁 BI 履职 + 39 个生产 ETL，全脱敏；**2026-07-12 迁至独立仓库 majia-huiyuan**，本仓库 references/restaurant-bi-formulas/ 仅留指针） |
| 不知道用哪个 | 读 [ETL 治理流程](references/part-b-governance.md)，再选择具体 reference |

> **作者**：马甲（Part B/C/D/E 实证）+ 观远 CTO 张进（B-17 SmartETL 改写方法论 + Part C 自定义图表经验）+ OpenAI Codex（ExecPlan 规范）
> **版本**：V3.4.1（2026-10-12）· **环境**：Node ≥20 · **前置**：官方全家桶 `npm i -g @guandata/guanskill && guanskill install-skill`（装齐 guancli / guanvis / guanetl / guanwf / guands / guanmetric + 各自 AI skill）· **认证**：`guancli auth login`（全家桶共用一套 profile，本 skill 不再单独要 config.json）· **作用域**：本地私有 BI 实例
> **安装**：`git clone https://github.com/maojiebc/majia-guanyuan.git`，或 `npx github:maojiebc/majia-guanyuan install`
> **兼容工具**：Claude Code · OpenClaw · Codex · Hermes (gbrain) · 任何支持 `SKILL.md` frontmatter 的 agent。详见 [README · 兼容性](README.md#-兼容性--compatibility) 与 [AGENTS.md](AGENTS.md)。
>
> **V3.4.1**（2026-10-12）：对齐 guanskill 0.1.44 / guancli 1.0.65；补充 SQL 类型化结果、ETL 保存保护和旧日期筛选器边界。每周同时检查 guanbi-agent-builder，吸收 v4.8.2 的大数据量提醒与分批纪律。

---

# 🧭 路由层：标准活交给官方全家桶

> **V3.0.0 心法**：观远官方已把"查数 / 建卡 / ETL / 数据流 / 数据源 / 截图 / 管理"做成公网全家桶（`npm i -g @guandata/guanskill`）。本 skill **不再自造这些轮子**——标准活一律路由给官方，本 skill 专攻官方 DSL/命令覆盖不到的"业务实战 + 引擎级踩坑"（Part B–E + 方法论 + 公式库）。

## ⚠️ 跨 Part 通用工作原则

1. **所有数值计算必须跑代码** —— 禁止在思考里口算百分比、环比、除法、占比。
2. **必须确认数据范围** —— 用户没明确日期范围时**必须追问**（"看哪段时间？今天 / 本周 / 上月？"），不要自己假设。
3. **遇到意外错误立即落档** —— 把新坑写进对应章节（Part B 报错 → `references/part-b-errors.md`，Part C → `references/part-c-payload-json.md`）或 ExecPlan 的 `Surprises & Discoveries`（B-17.11）。格式：`### [YYYY-MM-DD] 标题` + 场景 / 问题（含 task error 原文、payload 片段）/ 判断。
4. **写操作前先治理、删除前先对账** —— 见 Part B-〇 工作流 + B-7.0 删除安全闸。

## 官方全家桶 ↔ 本 skill 分工总表

> 前置：`npm i -g @guandata/guanskill && guanskill install-skill`（装齐 7 个命令：guanskill + 6 组件，各带 AI skill）；认证 `guancli auth login`，全家桶共用一套 profile。

| skill | 版本 | 角色 | 什么需求路由给它 |
|---|---|---|---|
| **`guancli`** | 1.0.65 | 查询分析、表单数据、SuperApp | 查 ETL/数据集/页面/卡片/血缘、SQL、指标查询/归因、ChatBI、仪表板洞察与 Dashboard Agent；独立基础指标用 `metric batch-query`，高级计算用 `metric query`；`analyze normalize/align/calculate/topn` 处理本地结果；Form 数据 CRUD；SuperApp create/list/download/publish。指标计算显式 `--value-format raw`，按 JSON 版本与 inline/file 分支读取，批量逐项检查状态，自动处理加 `--fail-on-error`；计算兼展示用 `valueFormat: "both"`，计算只读 `rows`。未知筛选字段须纠正，不能删条件重跑。单条查询先以相同参数加 `--explain-requests -f json` 核对请求计划；批量查询不支持此参数。 |
| **`guanvis`** | 0.1.53 | 建卡、页面、发布、截图 | 图表 DSL、checkout/diff/preview/pack/publish/screenshot、指标卡、custom chart、筛选器联动及 `live`；页面与目录原地管理、`page save-as` 原生副本；高级筛选器、卡片池、交叉表 `filterBy` 逐格校验；`init` 遇到已有 `schema.js` 且无 `--force` 时保留文件并跳过认证/请求。新页面先确认目标目录；覆盖前备份，覆盖后重置目标页面草稿。`preview` 默认摘要，完整输出用 `--full`；复杂自定义图表走完整工程，不用 live 基础卡片命令模拟。 |
| **`guanetl`** | 0.1.40 | ETL 编辑与运行 | create/edit/export/lint/preview/save/run/schedule、move、mkdir-pair；`rmdir` 只删空 ETL 目录，物理删除且需 `--yes`；仍无删除 ETL 命令。新建须明确 ETL 与输出数据集各自目录；按 ETL ID 跟踪执行，已移除全局 `task`。导出/校验按数据集详情的实际类型识别输入；历史节点下划线导出修复，DSL 类型化常量兼容旧字符串；保留输出绑定、字段物化、JOIN 类型及 dry-run 影响检查。 |
| **`guanwf`** | 0.1.838 | 工作流与数据流 | workflow.go / Python / 多节点 DAG / 参数与调度 / 实例诊断；写操作先 `--dry-run` 再 `--confirm`（兼容 `--yes`）。新增 Python 运行环境 与内存预检、按 task/output slot 绑定输出；首次 CREATE_NEW 输出须绑定并发布保存后再跑。验证只在已有草稿执行，不注册真实输出；保存后回读、运行后逐项验收输出。调度 `--failure-strategy` 已废弃且仅接受 CONTINUE，失败走向由 FAILURE / ALL 连线决定。Python 版本优先读结构化镜像字段。类型化 DSL 兼容字符串。8.2.0 节点限制与失败恢复范围仍按官方 guanwf Skill 执行。 |
| **`guands`** | 0.1.37 | 数据源、数据集、表单结构 | connector/account/dataset/dir 管理、导入/追加/替换、刷新调度、主键与计算字段；Form create/export/update/rename/move/folder。`dataset sync-schema` 支持 GUAN_FORM 原地同步并回读字段 ID/类型/状态。新建先确认目录，append-data/replace-data 实写需 `--yes`；按数据集 ID 跟踪，已移除全局 `task`。Excel 多 Sheet 必须显式选择。数据集目录不能移动；目录删除不可恢复。 |
| **`guanmetric`** | 0.1.21 | 指标定义与管理 | 指标建/改/删、主题/目录、公共维度、指标树、查询加速、业务字典、Excel 模板及 `--check-only` 预检；标准模板批量创建走 `flow generate/plan/apply/verify`，结果未知先 `reconcile`，不盲重建；编辑用对应类型专用命令保留取数字段；批量上下线用 `batch online/offline`，先 dry-run、按依赖顺序逐项处理。失败不回滚已成功项，blocked 先核对影响再确认；上线请求获接受后仍须回读审批/发布状态。复合指标只引用原子或复合指标；指标查数仍走 guancli。 |
| **`guanvis screenshot`** | — | 导出 | 页面 PNG/PDF 服务端截图（彻底取代 legacy `guanexport`）|
| ~~`guanexport` / `guanadmin`~~ | **已退出** | — | **2026-06-04 起从 `guanskill` 聚合包移除、npm 也下架**：导出全归 `guanvis screenshot`；管理员级操作（dynamicCode / adminToken / svc SQL）已不在公开全家桶，需另装 standalone 或走 BI UI |
| **`majia-guanyuan`**（本 skill） | **见 frontmatter** | 业务实战 + 引擎级踩坑 + 方法论 | **Part B** ETL 整库治理判断 + 10 类引擎报错 + 双源字段审计 + B-17 全链路重写/ExecPlan · **Part C** 既有页自定义图表 HTML/JS 注入排障 + 固定卡/overlay · **Part C-12** HTML 应用化看板 + descriptor patch 联 dataView + **视觉设计底线（反 AI 味红线 + 五层验收）** · **门店手机成绩单**（19 视图 + 列名识别 + 脱敏离线样本） · **Part D** v7 草稿-发布状态机绕过 + 节点化静默坑 + phoneLayout · **Part E** SuperApp 反向工程 · **AI-native ADS** 方法论 · **餐饮 BI 公式库** |

**本轮兼容规则**：SQL 接口可用且要计算时用 `ds execute-sql -f json --typed`，按高精度读取 JSON 数字；它不解决 SQL 接口不可用，也不改变临时 ETL 的 terminal-text 限制。请求转发/API Gateway 走官方 guancli，先读官方 gateway.md；调用可能产生外部写入，不能当普通只读查询。ETL 保存无法读取服务端版本或返回 success=false 时停止，不拿 HTTP 200 当成功；旧日期筛选器来源身份不完整时只原样保留，不能猜字段映射。

**一句话路由**：标准查数 / 洞察 / Dashboard Agent → `guancli`；标准建卡/发布/截图 / `live` 实时工程 → `guanvis`；标准 ETL → `guanetl`；数据流 → `guanwf`；数据源/数据集 → `guands`；指标建/改/删 + 指标主题/目录 + 公共维度 + **指标树 / 查询加速** → `guanmetric`。**任何一个遇到官方 DSL/命令够不着的字段、报错、状态机、反向工程、业务口径**——回到本 skill 对应 Part。

官方 `guandata-cli-suite` 负责选择组件，并已包含原地编辑与删除边界。本表补充本次核验版本及关键兼容规则；参数与完整操作流程以已安装的官方 Skill 为准。此前逐版本变化保存在 CHANGELOG，不在路由表重复累积。

**当前执行边界**：单条指标取数先以相同参数检查 `--explain-requests -f json` 的请求计划；计划不是取数成功证明。同轮独立基础指标走批量查询，逐项检查失败；用于计算的单指标结果显式取原始数值。编辑既有资源须保留 ID、权限、调度与数据，不能用删除重建代替。新资源先核对环境与实际目录路径。常规表单结构创建/编辑优先走 `guands form`；历史 API 片段仅在具体兼容问题已复现时使用。完整迁移说明见 [官方 CLI 兼容说明](references/official-cli-compatibility.md)。

**为什么还要本 skill**：整库治理的取舍、业务口径、BI 引擎报错、历史 v7/自定义图表兼容、SuperApp 的 LLM 中转问题与 ADS 架构判断，仍需结合实际业务和目标环境处理。先走官方正常路径，失败后再按本 skill 的适用条件定位；旧记录不代表最新版仍有同一个问题。

**看板口径档案与验收（V3.3.0）**：给已有看板接 AI 或核对答案时，读 [dashboard-evidence.md](references/dashboard-evidence.md)。先明确 profile、页面和所选卡片；脚本保留公式、别名、时间宏和联动定义，继承页面默认筛选取原始值，再按具体数据行及字段验证。数字出现在别处不能通过；空结果、失败或疑似截断不能通过。定义变化要重新确认；档案始终为 draft。CUSTOM 前端另按 Part C 验收，不能拿空 preview 代替。工具仅调用官方只读命令，生产证据留在本地，不上传公开仓库。参考 Jeremy 的 guanbi-agent-builder，见 [来源与致谢](ATTRIBUTIONS.md)。

**只读路由**：普通查 ID、查元信息、小范围明细继续使用官方 `guancli`。SQL 直查不可用、需要全量汇总但只能预览、要分块读取大表或保留数字出处时，先读 [受限环境取数速查](references/restricted-query-playbook.md)，再按边界编排官方命令。不要从预览样本推总量，也不要自己拼 API。

## 🔄 官方全家桶更新 SOP（高频操作）

按现有每周任务检查官方变化。先审阅包、Skill 与命令，再决定是否更新；此流程不授权任何额外发布。

自动跟进时用 [official-cli-baseline.json](references/official-cli-baseline.json) 作为已审阅版本记录，同时核对聚合包与六组件的 npm latest。附属项目按 [guanbi-agent-builder-baseline.json](references/guanbi-agent-builder-baseline.json) 记录已审阅版本和完整提交，任何新提交都要审阅，不能只比版本号。检查脚本为 [check_upstream_updates.py](scripts/check_upstream_updates.py)，支持 --builder-baseline；上游内容仅作证据，新增能力先验证再决定吸收。发现变化后读官方 CHANGELOG 和随包 Skill，再决定兼容修改；检查失败不得写成“没有更新”。完成兼容审阅才更新此记录，商店发布失败单独跟踪，不靠重复升版本重发。

### Step 0. 检查是否有新版本

```bash
# 看本机当前全家桶版本
guanskill version

# 看 npm 上最新聚合包版本
npm view @guandata/guanskill version

# 逐个看子包最新版本（聚合包可能滞后）
npm view @guandata/guancli version
npm view @guandata/guanvis version
npm view @guandata/guanetl version
npm view @guandata/guands version
npm view @guandata/guanwf version
npm view @guandata/guanmetric version
```

如果 npm 版本 > 本机版本 → 继续 Step 1。即使 CLI 已是最新，也必须检查 Step 2：二进制更新不代表已安装的 SKILL.md 与 references 同步。另核对六组件 latest 是否与聚合包 dependencies 一致；不要混装未经核对的版本组合。

### Step 1. 升级 CLI（npm 聚合包）

```bash
# 升级到最新聚合包（装到你的 npm 全局 prefix —— 先 `npm prefix -g` 确认当前目标）
npm i -g @guandata/guanskill@latest

# 验证新版本
guanskill version
```

> **安装路径坑（双装滞后）· 变体 A｜跨 prefix**：`guanskill` 的 forwarder 跟着 `which guancli` 解析到的 prefix 走。若曾用不同 node（如 Homebrew node 的 `/opt/homebrew` vs nvm/asdf/独立 `~/.local`）装过两份，PATH 靠前那份会"赢"，而 `npm i -g` 只更新当前 prefix 的那份、另一份滞后 →「升了却没生效 / 本地副本常滞后」。排查：`which -a guancli` 看是否多份；统一到单一 prefix（多余的用 `npm uninstall -g @guandata/guanskill --prefix <多余prefix>` 删掉）。
>
> **变体 B｜同 prefix 下「子包 vs 伞包」并存**（2026-07-15 实测）：即使只有一个 prefix，若**单独**装过某个子包（`npm i -g @guandata/guancli`），它会和伞包 `guanskill` 自带的内嵌版**抢同一个 `guancli` bin**——`which -a` 只有一条、看不出异常，`npm ls -g --depth=0` 才看得见两个顶层条目。**排查**：`npm ls -g --depth=1 | grep guan`，顶层应当**只有 `@guandata/guanskill` 一条**，六个组件都该是它的子依赖；顺带 `guancli version` 与 `npm view @guandata/guancli version` 对一下。**清理**：`npm uninstall -g @guandata/guancli` —— ⚠️ **卸载会连带删掉共享的 `guancli` bin symlink**（因为该包也声明了同名 bin），必须紧接着 `npm i -g @guandata/guanskill@latest` 把 bin 装回来，再逐个验 `guancli version` / `guanvis version` / …。

### Step 2. 升级 AI Skill（SKILL.md + references）

```bash
# install-skill 把每个子包的 SKILL.md + references/ 装到 ~/.agents/skills/<name>/
guanskill install-skill
```

落点：`~/.agents/skills/{guancli,guanvis,guanetl,guands,guanwf,guanmetric}/`。这些是 agent 路由用的 skill 定义，和 CLI 二进制分开更新。还需检查 `guandata-cli-suite`。完成后逐文件比较 npm 包 `skills/<name>/` 与已安装目录，至少覆盖 SKILL.md 和 references；退出 0 或一条安装提示不能代替内容一致性验证。

### Step 3. 读 Changelog，摘要变更

```bash
# 各子包 CHANGELOG.md 在 npm 包目录下
GUANSKILL_DIR=$(npm root -g)/@guandata/guanskill/node_modules/@guandata
for pkg in guancli guanvis guanetl guands guanwf guanmetric; do
  echo "=== $pkg ===" && head -30 "$GUANSKILL_DIR/$pkg/CHANGELOG.md" 2>/dev/null && echo
done
```

重点关注：新增/移除命令、DSL 新组件、bug 修复（尤其影响 B-0.5 / Part C / Part D 的）、breaking change。

### Step 4. 迭代 majia-guanyuan

按 changelog 摘要，更新以下位置（有改动的才改）：

| 位置 | 改什么 |
|------|--------|
| **路由总表**（本文件 `官方全家桶 ↔ 本 skill 分工总表`） | 版本号 + 能力描述 |
| **V3.x.x 更新 callout**（本文件顶部 `> 🆕`） | 新版本摘要 |
| **Part B 实测边界 callout** | 如果 guanetl 有 bug 修复 |
| **Part D guanvis 版本引用** | 如果 guanvis 版本变了 |
| **manifest.json / package.json** | `version` + `description` 里的版本号 |
| **README.md / README.en.md** | 版本徽章 + 版本记录段（≤3 条） |
| **CHANGELOG.md** | 新增 `[x.y.z] — YYYY-MM-DD` 条目 |

版本号规则：官方对齐 = **patch**；影响 skill 自身逻辑（如 B-0.5 降级）= **minor**。

### Step 5. 同步 + 发布

```bash
# 同步已发布的整包，包含 references/templates，不能只复制两个 Markdown 文件
python3 ~/.codex/skills/majia-ota/scripts/sync_local_agents.py /path/to/majia-guanyuan --target all

# commit + push（或走 /majia-ota-skill 完整发布链）
```

### 快速一键检查（日常用）

```bash
# 一行看完「本机 vs npm 最新」差异
echo "LOCAL:" && guanskill version && echo "---" && echo "NPM latest:" && npm view @guandata/guanskill version
```

## 通用错误码处理

| 状态码 | 处理 |
|--------|------|
| 500 | 终止，服务器问题 |
| 401 | 终止，登录失效（`guancli auth login` 重登） |
| 403 | 终止，无权限 |
| 404 | 终止，资源不存在 |

---

# Part B：ETL 治理与写入

整库治理、循环依赖、字段使用度或官方路径以外的引擎问题，读 [治理与写入手册](references/part-b-governance.md)。普通修改使用官方 guanetl。

1. 编辑保留 ETL、输出数据集、权限、调度和下游 ID；不能删除重建模拟编辑。
2. 先读原定义与血缘、备份，再只改责任节点；验证输出绑定和新旧对账，不能把保存当刷新完成。
3. 判断分层及循环依赖，再设计迁移；来源/原始行保留，字段审计同时查 page 与 etl。
4. 删除只对明确批准对象执行，先核下游与数据恢复条件；历史 API 顺序见手册，不把旧版本绕过方案当默认路径。
5. 只读取数回到 [受限取数手册](references/restricted-query-playbook.md)，不能套用写入流水线。

全链路重写与 ExecPlan 读 [B-17 专册](references/part-b17-fullchain-rewrite.md)；payload、报错和 SDK 分别读 [payload](references/part-b-payload.md)、[报错](references/part-b-errors.md)、[SDK](references/part-b-sdk.md)。

# Part C：自定义图表开发与排障

既有页的 HTML/CSS/JS、payload_json、overlay 或生命周期问题，读 [运行与交付手册](references/part-c-runtime.md)。

1. 先看真实运行环境与点击路径，再改最小责任代码；保留既有 ID、数据绑定和已可用的移动版。
2. gdPlugin 的 view 与字段契约先核再用，数据缺失不能显示成零；取数异常读 [payload_json](references/part-c-payload-json.md)。
3. 注入物须幂等安装、主动销毁；复制页后 ID 重核，不用死循环 MutationObserver 或遮挡原生浮层。
4. 桌面、手机、空数据和真实点击分别验收，定义/DOM 文本不代表前端已渲染。
5. 自定义图表的二次计算与筛选单独复核，不能用空 preview 证明 CUSTOM 已通过。

## C-12. HTML 应用化看板

从零生成应用式分析看板时，读 [HTML 看板专册](references/part-c-html-dashboard.md) 与 [视觉底线](references/part-c-design-baseline.md)。真实 GDPlugin 数据优先；descriptor patch 只在绑定问题明确复现时使用，保留系统筛选与单位、统计期间、数据时间和口径说明。

# Part D：V7 Page/Card 发布与类型规则

v7 草稿/发布状态机、60004、phoneLayout 或历史输出绑定问题，读 [v7 发布专册](references/v7-page-card-publish-pipeline.md)；[旧引导原文](references/part-d-entry-history.md) 仅用于有日期的故障对照。

1. 先走官方 guanvis 的预览、备份和发布流程；草稿与发布卡片 ID 不能假设相同，浏览态与编辑态分别检查。
2. CSV 字段先看真实类型；NULL、空字符串与零分别处理，数字/日期字段不套字符串比较。
3. 保留既有 OUTPUT_DATASET 的数据集绑定，不能通过换 ID 消除同名或状态机错误。
4. 破坏性操作须明确授权和恢复证据；普通原地更新不走删除重建。
5. 自定义图表、动态筛选和手机布局按各自 reference 验收；大表输出不把样本或 Excel 行上限当全量交付。

## 📚 References 目录

> 本 SKILL.md 主文是路由层 + 关键规则；以下马甲蒸馏档（官方够不着的硬骨头）+ 餐饮公式库 + 贡献者原文构成完整知识库。详细索引：

**马甲蒸馏版：**

| 文件 | 何时读 | 行数 |
|---|---|---|
| [part-b-governance.md](references/part-b-governance.md) | 原 Part B 治理与写入细节、历史修复与删除边界 | 完整下沉 |
| [part-c-runtime.md](references/part-c-runtime.md) | 原 Part C 运行契约、生命周期和浏览器验收 | 完整下沉 |
| [part-d-entry-history.md](references/part-d-entry-history.md) | 历史 v7 引导对照，先读当前发布专册 | 历史 |
| [bounded-extraction.md](references/bounded-extraction.md) | 串行分块、截断拆分、未知状态与恢复证据 | 方法与脚本 |
| [restricted-query-playbook.md](references/restricted-query-playbook.md) | SQL 直查受限、全量汇总、预览截断、分块取数与数字出处 | 14 条 |
| [dashboard-evidence.md](references/dashboard-evidence.md) | 看板接 AI、口径档案、原始值及页面筛选对账、逐格断言与定义变化复查；脚本 `dashboard_evidence.py` | ~100 |
| [part-b-payload.md](references/part-b-payload.md) | 写新 ETL payload / 复用 4 阶段脚本时 | ~175 |
| [part-b-errors.md](references/part-b-errors.md) | execute 失败、对照 `task error` 找修复方案时 | ~150 |
| [part-b-sdk.md](references/part-b-sdk.md) | 30+ 表批量改造、写 `transformV2ToV3` 时 | ~60 |
| [part-b17-fullchain-rewrite.md](references/part-b17-fullchain-rewrite.md) | 全链路 SmartETL 重写、副本页验收、ExecPlan 管理时 | ~290 |
| [part-c-payload-json.md](references/part-c-payload-json.md) | runtime 拿不到 payload_json / JSON.parse 失败时 | ~60 |
| [part-c-html-dashboard.md](references/part-c-html-dashboard.md) | 用户说"更高级 / 应用化 / 不限标准看板"，从零生成 HTML 化分析应用时（V2.1.1 新建） | ~620 |
| [part-c-store-mobile-scorecard.md](references/part-c-store-mobile-scorecard.md) | 加盟店老板手机成绩单 / 换店滤空 / GDPlugin 视图顺序错位 / 对比组家数泄露 / 要离线可点的移动样本时（V3.2.0） | ~280 |
| [part-c-design-baseline.md](references/part-c-design-baseline.md) | 生成/修改任何 HTML 看板的视觉层时；用户说"做好看点 / 太丑 / AI 味重"时；C-12 §11.5 视觉验收时。模块首屏=数据判断 / KPI 与数值口径 / 图表真实性 / token 硬上限 / 反 AI 味红线 / `guanvis screenshot` 验收清单。吸收 [design-taste-skills](https://github.com/xiaomingtx666/design-taste-skills)（MIT），覆盖 C-12 / Part D / Part E（V3.1.0 新建） | ~150 |
| [v7-page-card-publish-pipeline.md](references/v7-page-card-publish-pipeline.md) | V7 BI 实例端到端搭多个 HTML 看板 / 手撸 page+card API 被 `60004` 草稿页面错误卡住 / CSV 散客 `会员ID IS NOT NULL` 算出 100% 假指标 / Spark `WITH 中文别名` 报错 / ETL update `1012 同名文件` / SmartETL `COUNT_DISTINCT`/`JOIN_DATA` 多键/`FULL_OUTER` 节点化坑（V2.1.8）/ HTML customChart `renderChart` 不调 + `autoBootstrap` + chip toolbar 兜底（V2.1.9）/ 移动端 phoneLayout v7 草稿 save API 死路 + ZIP inject 唯一可行路径 + CSS @media 模板（V2.1.10） | ~1120 |
| [part-e-superapp-pipeline.md](references/part-e-superapp-pipeline.md) | SuperApp 开放应用开发流水线 / `guancli app create/publish` 不读 `.env` 必须显式传 `--app-id` / 脚手架 bi-services 速查 / 数据集异步预览 3 步链路 / **`/survey-engine/api/form/add` 建表反向工程**（脚手架没暴露） / **BI LLM 中转 NOT_JSON_RES/ILLEGAL_JSON_RES 三路径解析模板**（含从 error_message 抠 LLM 响应）/ 客户端模拟流式 + prompt 模板 / 原生 fetch + credentials: 'include' 绕过脚手架 `get` unwrap / `<base href>` + Router basename / 设计纪律 + 反模式表 + 决策树（V2.1.12 新建） | ~760 |
| [ai-native-ads-design.md](references/ai-native-ads-design.md) | **majia-guanyuan 哲学层文档**——客户问"想给现有 BI 接 AI"时判断"治理 vs 重搭" / 7 条 AI-native ADS 字段约束（中文枚举 / 推荐预算 / 复合拼好 / TIMESTAMP / 强约束取值 / 数值算好 / 权限冗余） / ODS+DWD 不动 ADS 重建 / 预算分配 30%+30%+40% / 与 Part D/E + 餐饮 BI 公式库的关系 / 反模式 8 条（V2.1.13 新建） | ~260 |

**餐饮 BI 公式实战库（V2.1.5 新建，去敏蒸馏自两段餐饮连锁 BI 履职 + 39 个生产 ETL；➡️ 2026-07-12 已迁至独立仓库 [majia-huiyuan](https://github.com/maojiebc/majia-huiyuan)，下表链接直达新家，本仓库 references/restaurant-bi-formulas/ 仅留指针）：**

| 文件 | 何时读 | 行数 |
|---|---|---|
| [restaurant-bi-formulas/README.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/README.md) | 进入业务公式库的总入口 / 字段词典 / 5 条最常踩坑 | ~70 |
| [restaurant-bi-formulas/01-date-and-time.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/01-date-and-time.md) | 写时间范围（T-1 / 本月 / 上月 / 近 N 天 / 时间宏 / 用餐时段 / 跨月对齐） | ~180 |
| [restaurant-bi-formulas/02-customer-and-membership.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/02-customer-and-membership.md) | 新老客 / 会员属性 / 消费频次（3 口径）/ 复购（跨天 vs 非跨天）/ 留存流失 / RFM / 注册前后行为 / 90 天复购分桶 | ~700 |
| [restaurant-bi-formulas/03-revenue-kpi.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/03-revenue-kpi.md) | AC / ADS / ADT / AUD / Comp / TC_CRM% / NS_CRM% / 营收占比 / 客单分桶 / 累计消费 | ~240 |
| [restaurant-bi-formulas/04-channel-and-store.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/04-channel-and-store.md) | 业务渠道（堂食/外卖）/ 订单子渠道大 case / 时效类型 / 搭配类型 / StoreDate / 成长类型 / 注册门店优先级回填 | ~410 |
| [restaurant-bi-formulas/05-coupon-and-discount.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/05-coupon-and-discount.md) | 核销率 / 折扣率 / 折扣分桶 / 券类型分流 / 注册第一张券 / 30 日优惠订单比例 | ~160 |
| [restaurant-bi-formulas/06-sql-utils.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/06-sql-utils.md) | 字符串拆解 / `explode+split` / `collect_set+concat_ws` / 开窗排名（ROW_NUMBER/RANK/DENSE_RANK）/ 累计窗口 / 多表 LEFT JOIN | ~350 |
| [restaurant-bi-formulas/07-data-quality-traps.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/07-data-quality-traps.md) | `NULL vs 0` / 三态判断 / 口径歧义 / 重复字段名 / A↔B↔通用字段对照表 / 日期边界 | ~250 |
| [restaurant-bi-formulas/08-etl-engineering-patterns.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/08-etl-engineering-patterns.md) | **ETL 工程范式**：10-CTE DWD 宽表底座 / 轻节点重 SQL vs 重节点轻 SQL 哲学 / 财务双源对账 / POS 系统归一化 / 会员生命周期多输出 / Cohort 日期×门店网格（蒸馏自 39 个 V1 生产 ETL）| ~280 |
| [restaurant-bi-formulas/09-etl-catalog.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/09-etl-catalog.md) | **39 个 V1 生产 ETL 索引清单**：按 11 业务域分类（基础维表 / DWD / 会员档案 / 顾客行为 / 财务营收 / 营销目标 / 私域社群 / 活动券 / 评价管理 / 业务标签 / 数据质量）+ 每 ETL 的节点/输入/输出/SQL 速查 + 复用决策表 | ~190 |

> 触发场景："如何算复购率 / 客单价 / 同店增长" / "怎么判新老客" / "用餐时段怎么分桶" / "为什么会员数对不上" / **"我要写 DWD 宽表 / 评价 pipeline / 财务对账"** — 直接进 [restaurant-bi-formulas/README.md](https://github.com/maojiebc/majia-huiyuan/blob/main/公式库/README.md) 路由表。和 Part B/C 正交（按业务领域分，非按平台操作分）。

**贡献者原文（不修改，照引）：**

| 文件 | 来源 |
|---|---|
| [etl-rewrite-original.md](references/etl-rewrite-original.md) | CTO 张进 — SmartETL 改写经验未删减原文 |
| [custom-chart-playbook.md](references/custom-chart-playbook.md) | CTO 张进 — 自定义图表排障完整 playbook |
| [execplan-spec.md](references/execplan-spec.md) | OpenAI Codex — ExecPlan 完整规范 |
| [agents-rule.md](references/agents-rule.md) | OpenAI Codex — AGENTS.md 极简调度规则 |

---

## 📋 版本记录

> 顶部 🆕 callout 是最新版摘要；完整逐版记录见 [CHANGELOG.md](CHANGELOG.md) 或 [GitHub Releases](https://github.com/maojiebc/majia-guanyuan/releases)。以下只留最近三版一句话索引：

- **V3.4.1**（2026-10-12）官方 1.0.65 兼容、保存与字段保护、附属项目每周提交检查。
- **V3.4.0**（2026-10-12）受限取数速查、只读汇总出处、串行分块与恢复、不可相加标记及主文瘦身。
- **V3.3.0**（2026-09-30）新增看板口径档案、页面默认筛选原始取数、逐格对账及变化检测；真实只读验证与来源致谢。
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
