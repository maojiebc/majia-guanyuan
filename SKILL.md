---
name: majia-guanyuan
description: 观远 BI（Guandata）实战增益层 Agent Skill —— 架在官方全家桶（guancli 查数 / guanvis 建卡发布截图 / guanetl ETL / guanwf 数据流 / guands 数据源 / guanmetric 指标写）之上，专攻官方 DSL/命令覆盖不到的硬骨头：Part B ETL 整库治理判断 + 10 类 BI 引擎报错手册 + SmartETL 全链路重写/ExecPlan、Part C 既有页自定义图表 HTML/CSS/JS 注入排障 + 固定卡/overlay、Part C-12 HTML 应用化看板（descriptor patch 把 selector 联到 custom chart 内部 dataView + 视觉设计底线/反 AI 味红线/guanvis screenshot 视觉验收）、Part D v7 草稿-发布状态机绕过 + SmartETL 节点化静默坑 + 移动端 phoneLayout ZIP inject、Part E SuperApp 开放应用反向工程（form 建表 /survey-engine/api/form/add + LLM 中转 ILLEGAL_JSON_RES 三路径解析 + 原生 fetch credentials 绕 unwrap）、AI-native ADS 数据架构方法论（治理 vs 重搭 / 7 字段约束 / 30+30+40 预算）、餐饮连锁 BI 公式实战库（60+ SQL/复购/RFM/AC/Comp/DWD 宽表范式/39 ETL 索引）。标准查数/建卡/ETL/数据集 CRUD 一律路由给官方全家桶，本 skill 专攻业务实战与引擎级踩坑。触发：营业额/门店/会员/订单/复购率/客单价/RFM/ETL 治理/payload_json/自定义图表/HTML 看板/应用化/看板太丑/AI 味/设计底线/观远/Guandata/v7 BI/60004 草稿/Spark 中文别名/customChart/phoneLayout/SuperApp/open-apps/form 建表/ILLEGAL_JSON_RES/AI-native ADS/数据架构重搭/DWD 宽表。
license: MIT
metadata:
  version: "3.1.8"
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

# 观远 BI · 马甲实战版（V3.1.8）

> **结构说明（V1.5.0 引入 progressive disclosure）**：本文档是**路由层 + 关键规则**，详细操作手册下沉到 `references/`。每个 Part 的入口章节会指出"何时回到 references/ 查全表"。完整章节索引见末尾的 [📚 References 目录](#-references-目录)。

## 🧭 Part 选择

| 你想做 | 走 |
|---|---|
| 查数据、建卡、出报表、标准 ETL / 数据集 CRUD | **🧭 路由层** → 交给官方全家桶（`guancli` / `guanvis` / `guanetl` / `guands`），见路由总表 |
| 扫整库 ETL 治理 / 新建/修改/删除 ETL / 字段使用度审计 / 修复 ETL 报错 | **Part B：ETL 治理与写入** |
| 把整条 SmartETL 链改写成 SQL 版 + 页面副本验收 + 差异定位 + 空快照阻塞 | **Part B-17：全链路重写方法论**（拆到 [references/part-b17-fullchain-rewrite.md](references/part-b17-fullchain-rewrite.md)） |
| 30+ 张表批量迁移 / 跨多日工程 / 复杂重构需要项目化追踪 | **B-17.11 ExecPlan 工作法**（同上文件 §11） |
| 自定义图表 HTML/CSS/JS 注入、固定卡片/overlay、payload_json 取数、路由清理 | **Part C：自定义图表开发与排障** |
| 从零生成 HTML 化经营分析应用（用户说"更高级 / 应用化 / 自定义模块 / 最完美 / 不限标准看板"）| **Part C-12：HTML 应用化看板生成**（拆到 [references/part-c-html-dashboard.md](references/part-c-html-dashboard.md)） |
| **v7 BI 实例**上端到端搭多个 HTML 应用看板 / 手撸 `POST /api/page+/api/card` 被 `60004 此操作只能在草稿页面执行` 卡住 / CSV 散客 `会员ID IS NOT NULL` 算出 100% 假指标 / Spark `WITH 中文别名` 报 `PARSE_SYNTAX_ERROR` / ETL update 报 `1012 输出数据集目录中存在同名文件` | **Part D：V7 Page/Card 发布流水线 + 三态硬规则**（V2.1.6 新增，拆到 [references/v7-page-card-publish-pipeline.md](references/v7-page-card-publish-pipeline.md)） |
| **SuperApp / 超级应用 / 开放应用**开发流水线 / `guancli app create/publish` / `--app-id` 不传变成每次新建 / 数据集异步预览 3 步 / **`form_xxx` 建表反向工程**（脚手架没暴露建表 API，实测 `POST /survey-engine/api/form/add`）/ **BI 中转 LLM 报 NOT_JSON_RES / ILLEGAL_JSON_RES**（响应被塞在 error_message）/ `/api/llm-config/list` 返回裸数组被脚手架 unwrap 吞 / 同源 fetch credentials 不带 cookie / 客户端模拟流式打字效果 / 任务池工作台「看 + 想 + 选 + 做 + 留痕」闭环 | **Part E：SuperApp 开放应用开发流水线**（V2.1.12 新增，拆到 [references/part-e-superapp-pipeline.md](references/part-e-superapp-pipeline.md)） |
| **客户说"想给现有 BI 接 AI / 上 LLM"** / "我们 ETL 治理做了一年还没出活" / **判断 是该治理还是该重搭** / 客户预算分配讨论 / 评估底表 schema 是否 AI-friendly / 提案"AI-native 数据底座" | **AI-native ADS 设计方法论**（V2.1.13 新增，**majia-guanyuan 的哲学层文档**——不是操作手册而是范式判断，拆到 [references/ai-native-ads-design.md](references/ai-native-ads-design.md)） |
| 写餐饮业务公式（AC / ADS / 复购率 / 新老客 / 用餐时段 / 留存流失 / RFM / Comp 老店）/ 查字段口径 / 排数据质量坑 / **ETL 工程范式（DWD 宽表 / 双源对账 / 评价 pipeline）** | **餐饮 BI 公式实战库**（[majia-huiyuan/公式库](https://github.com/maojiebc/majia-huiyuan/tree/main/公式库)，V2.1.5 蒸馏自两段餐饮连锁 BI 履职 + 39 个生产 ETL，全脱敏；**2026-07-12 迁至独立仓库 majia-huiyuan**，本仓库 references/restaurant-bi-formulas/ 仅留指针） |
| 不知道用哪个 | 看 Part B "推荐工作流" 章节，或直接读各 Part 章节末尾的"实战 ID 速查" |

> **作者**：马甲（Part B/C/D/E 实证）+ 观远 CTO 张进（B-17 SmartETL 改写方法论 + Part C 自定义图表经验）+ OpenAI Codex（ExecPlan 规范）
> **版本**：V3.1.8（2026-07-24）· **环境**：Node ≥20 · **前置**：官方全家桶 `npm i -g @guandata/guanskill && guanskill install-skill`（装齐 guancli / guanvis / guanetl / guanwf / guands / guanmetric + 各自 AI skill）· **认证**：`guancli auth login`（全家桶共用一套 profile，本 skill 不再单独要 config.json）· **作用域**：本地私有 BI 实例
> **安装**：`git clone https://github.com/maojiebc/majia-guanyuan.git`，或 `npx github:maojiebc/majia-guanyuan install`
> **兼容工具**：Claude Code · OpenClaw · Codex · Hermes (gbrain) · 任何支持 `SKILL.md` frontmatter 的 agent。详见 [README · 兼容性](README.md#-兼容性--compatibility) 与 [AGENTS.md](AGENTS.md)。
>
> 🆕 **V3.1.8 更新**（2026-07-24）：**官方全家桶 07-15 + 07-24 两批次一次性对齐**——`guanskill` 0.1.12→0.1.17，六个子包自 v3.1.6（07-10 批）以来的净变更（07-15 中间批 + 07-24 最新批合并记一版）：**`guanwf` 0.1.7→0.1.822**（**版本号直跳不是笔误**——官方 07-15 起换构建号方案跳到 0.1.820、07-24 再进 0.1.822，npm registry 实证，semver 上 82x > 7 故 `@latest` 解析正常；**8.2.0 兼容线 + 破坏性变更（0.1.820 引入、延续至今）**：① 写操作全面加 **`--confirm` 门禁**，`save`/`save-draft`/`run`/`schedule set｜enable｜disable` 一律先 `--dry-run` 看计划再 `--confirm` 才执行，**旧的 `guanwf save --dir X` 直接生效写法失效**；② 工作流参数 `Workflow.Params` + `run --param k=v` + 事件调度 `schedule event get/set/disable`；③ 结构化任务节点强类型 DSL（DATASET/HTTP/SQL/PARAMETER_ASSIGNMENT/SWITCH；SHELL/LOOP 在 8.2.0 后端未注册、CLI 直接拒绝）+ `node add http｜sql` 脚手架；④ 实例诊断 `instance list｜tasks｜logs｜latest` + `resume-failed`；⑤ **失败恢复语义修正**——恢复节点的全部 DAG 后继都会重跑（含先前已 SUCCESS 的），旧文「已成功节点不重跑」不准确；⑥ 8.2.0 三条硬边界：`DatasetNode` 刷不了 `DATA_SET_OFFLINE_DEV`、`ParameterAssignmentNode` 的 `DATASET` 来源不能选直连集（60006）、SHELL/LOOP 不可用；⑦ **0.1.822（07-24）新**：工作流依赖/血缘分析提速、完善已有工作流原地编辑保护（不影响原有调度/权限/引用））、**`guands` 0.1.19→0.1.23**（`account rename` **原地**改数据账户名保留 acId/权限/凭证/数据集引用、**禁止删除后重建** + `dataset primary-key set/clear` 独立子命令（从 `update-setting --primary-keys` 迁出，改主键触发异步数据重写并回读验证）+ `dataset refresh` 提交前查 `status` 防重复提交/误判成功 + **Excel 多 Sheet 必须显式 `--sheet`**（import/append/replace 一律禁止隐式合并）、`import` 默认等 taskId 到终态（以上 0.1.21）；**0.1.23（07-24）新**：数据连接配置安全原地更新（先预览+校验变更再落地）、填报表单导出/编辑/重命名（更新时保留已有字段与数据）、填报表单目录管理（建目录 + 表单在目录间移动））、**`guancli` 1.0.39→1.0.43**（**`card preview` 支持多级表头**——结构化输出列名改用 `父级 > 子级 > 叶子` 完整路径（标题内 `>` 编码为 `\>`、重名追加 ` [2]` 后缀），`--columns`/`--sort-*` 优先吃完整路径 → 同环比/日期层级这类复杂交叉表的导出/选列/排序不再重名丢义 + 权限受限时也能用卡片自带字段信息完成筛选预览 + `form update` 载荷必须带全部业务主键字段（`c_uid` 除外），CLI 不读当前行也不补齐主键（以上 1.0.40）；**1.0.43（07-24）新**：Token 登录引导与状态校验更准确（配置/凭证异常更早暴露）+ 多资源读取提速（Agent 分析页面/数据集/指标响应更快））、**`guanvis` 0.1.30→0.1.33**（`page.setFilterPanelLayout()` 配**筛选栏布局**（只管纯布局，颜色/字体/背景仍归主题）+ `updateMetric`/`patchMetric` 回写**保留未修改的线上配置** + 字段显示名 `alias` 与 Card 标题相互独立（KPI/单值/仪表盘类尤其明显）+ `--allow-overwrite` 覆盖备份**不再沿血缘导出上游数据集/数据账户**，普通用户不因缺上游权限而备份失败（以上 0.1.31）；**0.1.33（07-24）新**：指标图表支持主次指标组 + 数字分组（指标展示层次更清晰）+ 发布前预检无效资源/未挂载卡片/生成错误（页面发布更稳）+ 复杂页面编辑与大型资源导入进一步提速）、**`guanetl` 0.1.19→0.1.21**（07-15 本批无变化；**0.1.21（07-24）新**：JOIN 字段类型检查从 `export` 扩展到 preview/save/run 全过程（数据关联风险更早发现）+ 复杂 ETL 字段识别与多级上游诊断更准、批量检查提速）、**`guanmetric` 0.1.1→0.1.3**（07-15 本批无变化；**0.1.3（07-24）新**：完善已有指标原地编辑保护 + 优化 Agent 批量准备/校验指标配置的效率）。路由总表 6 组件版本/能力刷新 + **官方 `guandata-cli-suite` 统一入口并存注记**（0.1.14 起官方自带纯分派 skill，本表额外承载版本 pin/能力清单/实测边界，护城河不受影响）；架构图 6 卡版本刷新；补回 v3.1.7 漏刷的 marketplace/版本行/自身行 pin。护城河零删减。
>
> 🆕 **V3.1.7 更新**（2026-07-12）：**餐饮 BI 公式实战库 + workshop513 咖啡连锁模拟案例迁出至独立仓库 [`majia-huiyuan`](https://github.com/maojiebc/majia-huiyuan)**——与模拟数据中台合并成「开源会员运营家底」项目，分仓原则是**工具在 guanyuan、数据与公式在 huiyuan**，两边可独立迭代。原路径 `references/restaurant-bi-formulas/` 与 `examples/` 只留指针 README，全仓引用改指新家。
>
> 🆕 **V3.1.6 更新**（2026-07-10）：**官方全家桶 07-08/07-10 版本对齐 —— 家族 5→6 员，新增 `guanmetric` 指标写操作组件**。`guanskill` 0.1.10→0.1.12，子包对齐最新：**`guanmetric` 0.1.1 首次入桶**（指标创建/编辑/删除 + 指标主题/指标目录 + 公共维度管理从 `guancli` 迁出独立；**指标 Excel 标准化** `template normalize` 把客户指标清单整成标准模板 + 校验报告，支持按原子/复合/多类衍生拆分 + 汇总 sheet + 批量创建前校验）、`guancli` 1.0.38→1.0.39（`etl get` 输出**有效调度状态**——综合 enableSchedule/triggerType/CRON/上游级联判真实自动触发、避免 `schedule --disable` 后底层字段残留误判 + 工作流资源查询增强（目录/节点/执行信息）+ 指标能力收敛只读、写操作迁 `guanmetric`）、`guanvis` 0.1.29→0.1.30（**checkout 线上页面到本地工程**——已有仪表板编辑/差异查看/回写 + 动态维度/动态指标/拆分图表 + 筛选器分组/开关类检查 + pack/preview/lint 诊断增强）、`guanetl` 0.1.18→0.1.19（**新增 `move` 移 ETL 到指定目录** + **`run --run-upstream` 递归上游链路拓扑执行**（配 `--dry-run`）+ `run --wait` 遇 40001 已在运行改等现有任务 + `export` JOIN 键类型不一致 warning）、`guands` 0.1.18→0.1.19（数据集**追加数据 + 按条件/全量清理** + **schema 同步/自动同步开关/字段更新预校验** + 批量新增计算字段 + 从填报表单创建数据集 + 行列权限查看）、`guanwf` 0.1.6→0.1.7（离线开发增强（文件夹/实例/权限/告警/调度）+ **依赖分析/执行计划/依赖校验**——把一批作业编排成统一调度主工作流 + 子工作流/事件调度/失败恢复）。路由总表新增 guanmetric 行 + 6 组件版本/能力刷新；Part B 边界补 0.1.19 note；架构图重画 6 件套；manifest/README/package 基线 pin 同步。护城河零删减。

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
| **`guancli`** | 1.0.43 | 只读分析中枢 + 表单 CRUD + 指标查询（只读） | 查 ETL / dsId / page / card / 血缘 / 节点 SQL、`ds execute-sql` 跨集 SQL、`ds search --id` 精确解析、`metric query` 同比/累计/Top N、`metric_attribution` 归因、`metric by-dataset` 按数据集 ID 反查原子指标沿血缘展开下游复合/衍生、`task` 排查、ChatBI 问数、`card preview` 取数导出、form 数据 CRUD、`login status` 服务端 profile 校验 + 数据集字段 raw name/alias 误用提示、SuperApp 创建指导（`guancli app create`）+ 页面资源搜索/展示增强；PAT 登录（自动化/CI/无浏览器环境）+ auth PAT profile 状态展示/修改保护（1.0.38）；`etl get` 输出有效调度状态（避免 `schedule --disable` 后底层字段残留误判）+ 工作流资源查询增强 + 指标写操作迁出至 `guanmetric`、指标能力收敛只读（1.0.39）；**1.0.40 新：`card preview` 支持多级表头——结构化输出（JSON/CSV/Excel）列名改用 `父级 > 子级 > 叶子` 完整路径（标题自带的 `>` 编码成 `\>` 与层级分隔符区分，完整路径仍重名则追加 ` [2]` 稳定后缀保证键唯一），`--columns`/`--sort-*` 优先吃大小写精确的完整路径、末级标题唯一时仍兼容旧写法 → 同环比/日期层级这类复杂交叉表的导出/选列/排序不再因只留末级标题而重名或丢义 + 权限受限时也能用卡片自带字段信息完成筛选预览 + `form update` 载荷必须带表单配置的全部业务主键字段（内置 `c_uid` 除外），CLI 只做字段名映射与请求透传、不读当前行也不补齐主键 → 改数据前先 `form query` 取未编辑主键的当前值** · **1.0.43 新（07-24）**：Token 登录引导与状态校验更准确（配置/凭证异常更早暴露）+ 多资源读取提速（Agent 分析页面/数据集/指标响应更快） |
| **`guanvis`** | 0.1.33 | 标准建卡 + Page 装配 + 服务端截图 | 74 种图表 JS DSL、双 Y 轴、同环比/累计/排名/占比、selector 联动、tab/栅格、AreaTitle 分区标题 + CardGroup 卡片组、custom chart(ECHARTS_LITE/SDK)、`guanvis pack/publish/upload`、`guanvis screenshot` 出 PNG、指标卡片构建（metric init）、`publish --allow-overwrite` 覆盖前自动建迁移备份 + 资源包打包一致性校验、修复自定义图表重复生成数据视图卡片（0.1.28）；筛选器级联联动 + 画布布局可放筛选器 + 自定义图表 dataView 作点击联动来源/页面筛选器可过滤自定义图表 + 表格卡只配维度 + 比较卡本期对比期（0.1.29）；checkout 线上页面到本地工程（编辑/差异查看/回写）+ 动态维度/动态指标/拆分图表 + `pack`/`preview`/`lint` 诊断增强（0.1.30）；**0.1.31 新：`page.setFilterPanelLayout({ type, spacing, padding, labelPosition, actionOrder })` 配筛选栏布局（只管纯布局字段，颜色/字体/背景/控件视觉仍归主题管；术语「快捷筛选区」→「筛选栏」）+ 回写增强——`updateMetric`/`patchMetric` 改已有字段时**保留未设置字段的线上配置**（对比 `setRows/setMetrics` 是整 zone 重建、不继承被替换字段格式且验证时报 warning），发布前用 `guanvis diff <dir>` 或 `preview` 输出里的 `changeSummary` 看 base JSON→最终 payload 的路径级影响面 + 字段显示名 `alias` 与 Card 标题相互独立（`f("营收", { alias: "本月营收" })` / `calcField("整体毛利率_kpi", formula, { alias: "整体毛利率" })`——图例/轴标题/表头/Tooltip/指标标签都吃显示名，`SINGLE_VALUE`/`KPI_CARD`/`KPI_TREND`/仪表盘进度类尤其明显）+ `--allow-overwrite` 的覆盖前备份**不再沿血缘额外导出上游数据集/数据账户** → 普通用户不再因缺上游资源所有者权限而备份失败（备份含 Page 及其组成资源；「备份未成功即中止覆盖」的闸门仍在）** · **0.1.33 新（07-24）**：指标图表支持主次指标组 + 数字分组（指标展示层次更清晰）+ 发布前预检无效资源/未挂载卡片/生成错误（页面发布更稳）+ 复杂页面编辑与大型资源导入进一步提速 |
| **`guanetl`** | 0.1.21 | ETL 写操作闭环 | 单个 ETL 新建/改/`lint`/preview/`save`/`run`/`schedule`/`mkdir-pair`（源文件 `etl/etl.go`+SQL 驱动，黑盒 direct-save）；0.1.14 移除 `delete` 命令（高风险操作不再暴露，删 ETL 走 BI UI 或 API）+ 修 save 空 `dataSource` 覆盖 bug；save 输出数据集保护（保留级联配置）+ `save --dry-run` 影响预览 + `run` 前提示上游失败态 + `preview` LEFT JOIN 桥接列全空告警（0.1.15–0.1.16）；建 ETL 目录类型诊断（0.1.18）；**0.1.19 新增 `move` 移 ETL 到指定目录（接口异常时读回确认）+ `run --run-upstream` 递归解析上游链路按拓扑顺序执行（配 `--dry-run`）+ `run --wait` 遇 40001 已在运行改等现有任务完成（减少级联触发后重复 run 误判失败）+ `export` 静态检查 JOIN 键类型不一致 warning（STRING/LONG 隐式 coercion 风险）** · **0.1.21 新（07-24）**：JOIN 字段类型检查从 `export` 扩展到 preview/save/run 全过程（数据关联风险更早发现）+ 复杂 ETL 字段识别与多级上游诊断更准、批量检查提速 |
| **`guanwf`** | **0.1.822** ⚠️ | 工作流（数据流 + Python 节点多节点 DAG + 编排调度）| 工作流引擎里建/编/存/跑工作流，`workflow.go` DSL 统一数据流创建/编辑/导出/预览/保存/运行；Python 节点 DSL + 本地校验 + 保存三方合并降覆盖风险（0.1.5）；离线开发增强 + 依赖分析/执行计划/依赖校验把一批作业编排为统一调度主工作流（0.1.7）；`guanwf edit <父工作流ID>` → 改 `etl/` → export → save；只读查仍用 `guancli workflow`。**0.1.820 = 8.2.0 兼容线（版本号从 0.1.7 直跳 0.1.820 不是笔误——官方换了构建号方案，npm registry 实证；semver 上 820 > 7，`@latest` 解析正常），含破坏性变更**：① **写操作全面加 `--confirm` 门禁**——`save`/`save-draft`/`run`/`schedule set｜enable｜disable` 一律先 `--dry-run` 看计划、再加 `--confirm` 才真执行（**兼容 `--yes`**，老自动化脚本可用它过闸），**旧的 `guanwf save --dir X` 直接生效写法全部失效**；② 工作流参数 `Workflow.Params`（`ParamRef`/`DynamicParamRef`/`DataDrivenParamRef`，落 `processDefinitionJson.globalParams`），`run --param k=v`、`schedule set --param`、事件调度 `schedule event get/set/disable --rule <dsId>:<taskName>`（原不在命令范围）；③ 结构化任务节点强类型 DSL（DATASET/HTTP/SQL/PARAMETER_ASSIGNMENT/SWITCH），`node add http｜sql` 只生成节点目录 + 可粘贴 DSL 片段、**不自动改 `workflow.go` AST**，未知字段由 `task.json` 无损保留；`create --type` 增 HTTP/SQL；④ 实例诊断 `instance list｜tasks｜logs｜latest`（`--state FAILURE` / `--node` / `--full` / `--log-type ALL` / `-f json`）+ `instance resume-failed <instanceId> --dom-id`；⑤ **失败恢复语义修正**——恢复节点的**全部 DAG 后继都会重跑（含先前已 SUCCESS 的后继）**，旧文「已成功节点不重跑」不准确；恢复种子状态 = FAILURE/STOP/KILL/NEED_FAULT_TOLERANCE；子工作流引用已切换或 DAG 结构已变则拒绝恢复、改 `run --confirm` 重跑整链；⑥ **8.2.0 硬边界**：SHELL/LOOP 后端未注册 TaskParameters（CLI 在脚手架/导出/保存前直接拒绝，仅保留导入模型）· **`DatasetNode` 只负责刷新已有数据集**（空 `datasetId` 曾被误接受、0.1.820 已修；要创建/写入目标数据集得用 DATAFLOW/DB_DATAFLOW 节点），且刷不了 `DATA_SET_OFFLINE_DEV`（8.2.0 会把 BI 文本响应误当 JSON，要更新离线开发产出改用 `SubWorkflowNode` 调产出工作流）· `ParameterAssignmentNode` 的 `DATASET` 来源不能选数据库直连数据集（BI 返 60006，直连表改用 `DataSourceType: "DATABASE"` + 数据账户）；⑦ **凭据安全强化**：`task.json` 统一当前用户受限权限（0600）、精确合并基线 `_parent_merge_snapshot.json` 自动进工作区 `.gitignore`、HTTP URL 查询凭据不落普通权限源码、日志常见键值凭据脱敏；另修 8.2.0 DB Dataflow 预览误用 v1 接口致任务长期 PROCESSING（改走 Core v2 提交 + 通用任务轮询/取消）。节点字段合约见官方 `guanwf/references/TASK_NODE_CONTRACTS.md`** · **0.1.822 新（07-24）**：工作流依赖与血缘分析提速（复杂编排检查等待更少）+ 完善已有工作流原地编辑保护（不影响原有调度/权限/引用）；`--confirm` 门禁沿用 0.1.820 不变 |
| **`guands`** | 0.1.23 | 数据源 + 数据集 CRUD | 建数据连接（MySQL/PG/Oracle）、`dataset create-db/create-query/import/replace-data`、批量移删、增量更新、定时调度、计算字段、`dataset alias`/`update-fields` 批量改字段展示名/注释、import 按列指定字段类型 + `--header-row`/`--encoding`/`--delimiter` + refresh `--overwrite` 全量覆盖（0.1.15–0.1.18）；数据集追加/按条件清理 + schema 同步/自动同步开关/字段更新预校验 + 批量计算字段 + 填报表单建集 + 行列权限查看（0.1.19）；**0.1.20–0.1.21 新（同日两连发）：资源 ID 校验 + 创建结果解析增强（写操作输出契约更清晰，Agent 更稳地拿到新建资源 ID 接着干）+ `account rename <acId> --name "新名"` 原地改数据账户名——保留 acId/权限/凭证/数据集引用，底层返回不支持或回读不一致直接报错，**禁止删除后重建** + `dataset primary-key set/clear` 独立子命令（去重主键从 `update-setting --primary-keys` 迁出；改主键触发异步数据重写，默认等任务完成并回读验证）+ `dataset refresh` 提交前检查数据集 `status`——已有更新时普通 refresh 不重复提交、`--wait` 等已有 taskId、互斥操作（清理数据/改主键/schema 变更）只阻塞 refresh 而不被当成已有更新成功、`--overwrite` 不合并到未知模式任务也不拿其他普通任务的成功冒充覆盖成功（任务 FAILED/CANCELED 只代表该 taskId）+ **Excel 多 Sheet 必须 `--sheet <名称>` 显式指定**（`import`/`append-data`/`replace-data` 一律禁止隐式合并 Sheet，单 Sheet 自动选，Sheet 列表来自 BI 上传接口而非本地解析，CSV 不接受 `--sheet`）、`import` 每次只收一个文件且最多建一个数据集、上传前识别伪装成 `.csv` 的 Excel/ZIP/OLE 容器、默认等本次 taskId 到终态（FAILED/CANCELED/超时均非零退出，大文件用 `--timeout` 调）；`--raw` 是后端原始 JSON、不承诺跨子命令统一 schema（程序化解析仍用 `-f json`）** · **0.1.23 新（07-24）**：数据连接配置支持安全原地更新（先预览+校验变更再落地，延续 `account rename` 的原地治理思路）+ 填报表单支持导出/编辑/重命名（更新时保留已有字段与数据）+ 新增填报表单目录管理（建目录 + 表单在目录间移动） |
| **`guanmetric`** 🆕 | 0.1.3 | 指标写操作（07-08 新成员，第 6 员） | 指标创建/编辑/删除（`create --file`/`edit <metric_id> --file`/`delete`，均支持 `--dry-run`）、指标主题/指标目录创建（`project-create`/`dir-create`）、公共维度管理（`public-dim create`）、**指标 Excel 标准化**（`template normalize 客户指标.xlsx` 整成标准模板 + 校验报告；0.1.1 支持按原子/复合/多类衍生拆分 + 汇总 sheet 总览待建指标/行状态/问题说明 + 批量创建前校验与下一步提示）；**指标查询/数据读取仍走 `guancli`（1.0.39 起指标读写分家）** · **0.1.3 新（07-24）**：完善已有指标的原地编辑保护 + 优化 Agent 批量准备/校验指标配置的效率 |
| **`guanvis screenshot`** | — | 导出 | 页面 PNG/PDF 服务端截图（彻底取代 legacy `guanexport`）|
| ~~`guanexport` / `guanadmin`~~ | **已退出** | — | **2026-06-04 起从 `guanskill` 聚合包移除、npm 也下架**：导出全归 `guanvis screenshot`；管理员级操作（dynamicCode / adminToken / svc SQL）已不在公开全家桶，需另装 standalone 或走 BI UI |
| **`majia-guanyuan`**（本 skill） | **3.1.8** | 业务实战 + 引擎级踩坑 + 方法论 | **Part B** ETL 整库治理判断 + 10 类引擎报错 + 双源字段审计 + B-17 全链路重写/ExecPlan · **Part C** 既有页自定义图表 HTML/JS 注入排障 + 固定卡/overlay · **Part C-12** HTML 应用化看板 + descriptor patch 联 dataView + **视觉设计底线（反 AI 味红线 + 五层验收）** · **Part D** v7 草稿-发布状态机绕过 + 节点化静默坑 + phoneLayout · **Part E** SuperApp 反向工程 · **AI-native ADS** 方法论 · **餐饮 BI 公式库** |

**一句话路由**：标准查数 → `guancli`；标准建卡/发布/截图 → `guanvis`；标准 ETL → `guanetl`；数据流 → `guanwf`；数据源/数据集 → `guands`；指标建/改/删 + 指标主题/目录 + 公共维度 → `guanmetric`。**任何一个遇到官方 DSL/命令够不着的字段、报错、状态机、反向工程、业务口径**——回到本 skill 对应 Part。

> 🆕 **官方 `guanskill` 0.1.14 起自带 `guandata-cli-suite` 统一入口 skill**（六行意图路由表 + 安装引导 + `guancli auth status` 认证检查）——**「该用哪个组件」这件纯分派的事，官方现在自己做了**。本表与它并存不冲突，分工是：官方那份只答"用哪个"，本表额外承载**版本 pin + 能力清单 + 实测边界**（`guanetl` 0.1.14 起没有 `delete`、`guanwf` 0.1.820 写操作要 `--confirm`、`guanvis` 0.1.29 官方联动与 C-12 兜底脚本的并存关系、`guands` 0.1.21 Excel 多 Sheet 必须显式 `--sheet`……这些官方 suite 一条都不带）；Part B–E 护城河它更是整个不覆盖。**装了全家桶的人，纯分派直接用官方 suite 就行；遇到官方够不着的字段/报错/状态机/业务口径再回本 skill。**

**为什么还要本 skill**：官方命令封装在"高层 DSL + 黑盒"那层，遇到 ① 整库治理的判断逻辑（砍哪张表/哪个字段）② BI 引擎运行期/语义报错（`<> NULL` 吞行、CTE 中文别名、UNION 列数）③ v7 草稿-发布状态机绕过 ④ custom chart 内部 dataView 联 selector ⑤ SuperApp 脚手架没暴露的 form 建表 / LLM 中转 bug ⑥ AI-native 的 schema 重搭判断 ⑦ 餐饮业务口径——**官方都够不着，这就是本 skill 的地盘**。

**降歧义**：6 个官方 skill + 本 skill 同时启用时，只读场景（查 dsId/ETL）可能在 `guancli` 与本 skill 间双触发。本 skill **不与官方抢只读**——遇到纯查询/取数，直接路由 `guancli`，别自己拼 API。

## 🔄 官方全家桶更新 SOP（高频操作）

观远官方迭代节奏快（平均每周 1–2 次），本 skill 需要跟着对齐。以下是完整更新链路——从检查到落地，一条龙。

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

如果 npm 版本 > 本机版本 → 继续 Step 1。否则无需更新。

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

落点：`~/.agents/skills/{guancli,guanvis,guanetl,guands,guanwf,guanmetric}/`。这些是 agent 路由用的 skill 定义，和 CLI 二进制分开更新。

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
# 同步到已安装 skill 目录
cp SKILL.md CHANGELOG.md ~/.agents/skills/majia-guanyuan/

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

# 🅱️ Part B：ETL 治理与写入（V1.0）

> 基于 `@guandata/guancli@1.0.43` 的实证记录。所有 API 路径、payload 字段、报错信息、治理判断维度均来自真实跑通的请求。覆盖整库治理扫描 + 60+ 张 ETL 创建/重构/修复/删除的实战。
>
> ⚠️ 官方全家桶已把 BI 写操作拆成兄弟 skill 并**全部公网化**（2026-06-03，`npm i -g @guandata/guanskill`）：标准 ETL 写入有 `guanetl`、工作流数据流有 `guanwf`、数据源/数据集有 `guands`。**但 Part B 这套基于 `guancli fetch` + payload 的实战手册仍是底层事实源**——直接命中 API 路径 / payload 字段 / 报错码 / 治理判断的部分官方命令封装不到。遇到标准化 ETL 写入可路由到 `guanetl`，但**整库治理扫描、direct-save、payload_json、SmartETL 全链路重写、10 类报错速查继续走本 skill**。
>
> 🧪 **实测边界（2026-06-04 · workshop513 · BI 8.2.1-hf6）**：guanetl `edit` 的 base→etl.go 逆向在 **0.1.12 / 0.1.13 完全失效**（空 `return []Node{}`，5/5 ETL 全复现、`-v` 无报错）；`save` 的输出绑定 guard 也误触发。**0.1.14 两个 bug 均已修复**（2026-06-09 workshop513 实测：`ads_会员经营任务池` 6 节点 `edit→export→lint→save` 全链路通过）。改现有 ETL 现在可以走 `guanetl edit` 正常路径了。**B-0.5 绕过方案仍保留作 fallback 参考**（万一其他 BI 版本 / 节点类型仍触发）。
>
> ⚡ **0.1.14 修复确认**（2026-06-09 复测）：① `edit` 空 `etl.go`（Wall 1）→ ✅ 已修，6 节点完整逆向为 `BasicInputDataset×4 + BasicSqlScript + BasicOutputDatasetInDir`；② `save` 输出绑定 guard 误触发（Wall 2）→ ✅ 已修，save 直接成功不再拦截。另：**0.1.14 移除了 `delete` 命令**，删 ETL 改走 BI UI 或直接 `DELETE /api/etl/<id>` API。**0.1.15（2026-06-15）进一步增强 `save` 输出数据集保护（保留级联相关配置）+ 对追加写入场景的行数据结构提前校验**——改 ETL 走 `guanetl edit` 正常路径更稳。**0.1.16（2026-06-17）再加 `save --dry-run` 保存影响预览 + `run` 执行前提示上游数据集失败态 + `preview` 提示 LEFT JOIN 桥接列全空样本**，改 ETL 前可先 `--dry-run` 看影响面。**0.1.17（2026-06-24）仅 `install-skill` 适配 WorkBuddy 目录，ETL 行为无变化。** **0.1.18（2026-07-01）建 ETL 时目录类型诊断更清晰（识别误用工作流/经典数据流目录、提示用智能 ETL 目录）。** **0.1.19（2026-07-08）新增 `move`（移 ETL 到指定目录，接口异常时读回确认）+ `run --run-upstream`（递归解析上游链路按拓扑顺序执行，配 `--dry-run`）+ `run --wait` 遇 40001「已在运行」改为查找并等待现有任务（减少级联触发后重复 run 的误判失败）+ `export` 静态检查 JOIN 键类型不一致 warning（STRING/LONG 隐式 coercion 风险）。**

## B-0.5 guanetl `edit` 失效时的绕过方案（0.1.12–0.1.13 历史；0.1.14 已修复，保留作 fallback）

> 0.1.14 已修复 `edit` 空 etl.go + `save` 输出绑定 guard 两 bug（确认详见上方 Part B 实测边界段），正常直接用 `guanetl edit`；以下绕过方案保留为 fallback——特定 BI 版本 / 节点类型仍触发时用。

**原三道墙**（guanetl 0.1.12–0.1.13，0.1.14 已全部修复）：
1. ~~`edit` 的 base→`etl.go` 逆向出空~~ → **0.1.14 已修**
2. ~~`save` 撞输出绑定 guard 误触发~~ → **0.1.14 已修**
3. `save` 的合并对「身份字段」base 优先（改 ETL 名 / 节点名被覆盖）+ 输出 dsId churn → **未验证是否修复**，改名仍建议走 `guands dataset rename` / `alias`

**→ Fallback 路径**（仅在 `guanetl edit` 仍有问题时使用）：
- **纯改名 / 字段展示名** → 别碰 ETL 图，直接 `guands dataset rename` / `guands dataset alias`。
- **改逻辑 / 改结构（加节点、改 SQL）** → **不可变重建**（最稳）：读 `_base_etl.json` 拿旧定义 → `guanetl create` 写一份**新 outputDsName** 的新 ETL → `export/lint/save/verify` → 旧 ETL 退役。
- **高级逃生**（仅在没法重建时）：手工构造 `_exported.json` = fresh `_base` 的 actions + 保留 output `dataSource.dsId` + 你的**逻辑**改动，再 `guanetl save`。
- **认证别绕**：BI API 是 **cookie/session 认证**——写操作一律走 `guanetl save` / `guands`（它们持有正确会话）。

**清理坑**：~~`guanetl delete --cascade`~~（0.1.14 起无 delete 命令）。删 ETL + 孤儿输出集走 `DELETE` API，**顺序必须先删输出数据集、再删 ETL（与 B-7.1 一致）**；反过来先删 ETL → `2002 输出数据集已存在` 失败。**2026-06-17 · workshop513 实测定案**（独立 DATAFLOW ETL，净零回归）：`DELETE /api/data-source/<输出dsId>`（ETL 还在）→ `DataSource deleted` 成功、**不报 6001**；再 `DELETE /api/etl/<id>` → 成功。churn 出的中间绑定是另一回事——删 ETL 后多为 `NOT_FOUND` 幽灵（`ds get`=1002 但 `ds delete`=6001，不可见、无害）。

## B-〇. 推荐工作流（先治理再重建）

```text
1. 治理扫描     ← 批量抓全部 ETL 原始 JSON，分析依赖、循环、复杂度
2. 决策保留     ← 用 8 维 ETL + 4 维字段判断：保留 / 合并 / 降级 / 删除
3. 设计分层     ← 按 ODS/DIM/DWD/DWS/APP 重新分配
4. 字段审计     ← 双源（page + etl）扫字段使用度，确定砍字段范围
5. 新建目录     ← v2 目录与旧目录并行，不动旧链路
6. 写入 ETL     ← 三节点骨架 INPUT→SQL→OUTPUT，本地编译 payload
7. 预览节点     ← etl preview 先看 OUTPUT 节点能不能出数据
8. 执行落表     ← execute + task get 轮询 + 拿 result.error
9. 对账切流     ← 新旧并行验证，下游看板/ETL 逐张迁移
10. 清理旧链路  ← 先 DELETE data-source，再 DELETE etl（顺序不能反）
```

跳过治理直接动手 = 把同样混乱重做一遍。第 1–4 步是写 ETL 之前最值钱的活。

---

## B-1. API 全图（11 个已实测 endpoint）

```text
🔧 写入类（POST）
POST /api/directory                  ← 建目录（dirType=ETL 或 DATA_SET）
POST /api/etl/direct-save --stdin    ← 创建/更新 ETL（payload 有 dataFlowId 即更新）
POST /api/etl/execute                ← 触发执行 {"dataFlowId":"..."} → taskId

📖 读取类（GET）
GET  /api/etl/<id>                   ← ETL 完整定义（含 actions/sql/relativeFieldAlias）
GET  /api/directory/ETL/authorized-tree       ← ETL 目录树
GET  /api/directory/DATA_SET/authorized-tree  ← 数据集目录树
GET  /api/task/<taskId>              ← 任务状态 + 错误详情（关键修 bug 入口）

🗑️ 删除类（DELETE）
DELETE /api/data-source/<dsId>       ← 删数据集（必须先于 etl 删）
DELETE /api/etl/<id>                 ← 删 ETL（输出数据集还在 → 失败）

🔍 探测类（OPTIONS）
OPTIONS /api/<any-path>              ← 返回 Allow 头，反推支持的 method
```

### B-1.1 反推未知 endpoint 的方法

```bash
# 步骤 1：探 method 集合（最高效）
guancli fetch OPTIONS /api/<path>
# Allow: POST,GET,HEAD,DELETE,OPTIONS

# 步骤 2：盲发 POST，根据错误类型判断
# - "No static resource X"               → endpoint 不存在
# - "Request method 'X' is not supported" → endpoint 存在但方法不对
# - "InvalidJSON" / "missing field"       → endpoint 对，body 不对（开始迭代）
# - "ResourceId(...) ResourceNotExist"    → endpoint 模式错误

# 步骤 3：根据错误反推 schema
```

**血泪经验**：BI 内部 endpoint 命名不一致——`data-source`（带连字符）、`dataflow`（无连字符）、`etl`（无连字符）、`directory/ETL`（驼峰大写）混用。靠 OPTIONS 探测比盲发 POST 高效 10 倍。

---

## B-2. 治理扫描：判断 ETL/字段去留

### B-2.1 为什么扫描

观远 BI 用久了的常见症状：核心表互相循环引用、同份业务规则散落多张计算列、维表混入下游经营字段、大量已创建未运行的废弃 ETL、名实不符。**不扫一遍直接动手，重建出来还是一团乱麻。**

### B-2.2 扫描 3 步走

```bash
# Step 1：列出范围
guancli etl tree                                       # 全库
guancli etl search '' -d <PARENT_ETL_DIR_ID> --raw     # 按目录缩范围

# Step 2：批量抓原始定义（--raw 关键，不带就只输出阉割版）
mkdir -p raw
jq -r '.response.contents[].dataFlowId' etl-list.json | while read id; do
  guancli --raw etl get $id > raw/$id.json
done

# Step 3：本地脚本聚合分析
node analyze.mjs raw/ > analysis.json
```

### B-2.3 分析脚本要算的 10 个指标

| 指标 | 怎么算 |
|---|---|
| 输出数据集 | `actions[].type=="OUTPUT_DATASET"` 的 `outputDsName` |
| 上游 ETL 依赖 | `inputs[]` 里 `displayType=="DATAFLOW"` 的，反查归属哪个 ETL |
| 节点数 | `actions.length` |
| Join 数 | `actions[].type=="JOIN_DATA"` 的个数 |
| 计算列数 | `actions[].type=="CALCULATOR"` 的个数 |
| 透传聚合数 | `actions[].type=="GROUP_BY"` 的个数 |
| 长公式数 | CALCULATOR 里 `formulas[].expr.length > N` 的个数 |
| 输出行数/大小 | 输出 ds 的 `rowCount` / `storageSize` |
| 调度方式 | `cron`（`AFTER_REFRESH` / 具体 cron / 无） |
| 状态 | `status`（`FINISHED` / `CREATED` / `FAILED`） |

构建依赖图（节点 = ETL，边 = "本 ETL 输入了另一个 ETL 的输出表"），DFS 三色标记找循环组，计算 fanIn/fanOut。

### B-2.4 ETL 去留判断（8 维）

| 维度 | 信号 | 处置 |
|---|---|---|
| **循环依赖** | 出现在循环组里 | **必拆**：找共同字段抽到 DIM/DWD，让两下游都读它 |
| **状态异常** | `status=CREATED` 且无输出 / 0 次执行 | 删或重建为明确用途 |
| **本地无下游** | 没有任何其他本地 ETL 引用其输出 | 区分两类：① 给看板用 → 标 APP 层；② 没人用 → 删或归档 |
| **节点复杂度** | 节点 > 25、Join > 5、CALCULATOR > 3、长公式 > 0 | **拆**成多段：基础明细 / 规则映射 / 业务汇总 |
| **输出大小** | 单表 > 1GB 或 > 1000 万行 | 检查是否不必要物化；规则计算应集中 |
| **名实不符** | ETL 名跟输出表名差距大 | 改名或废弃 |
| **历史补数** | 名字含"补齐 / 历史 / 月末"等，调度异常 | 移到补数/归档目录，不挂主链 |
| **未调度** | `cron` 为空且不是被其他 ETL 触发 | 确认是否临时/手工 → 标记或删除 |

### B-2.5 字段去留判断（4 维）

| 维度 | 怎么判断 | 处置 |
|---|---|---|
| **下游 ETL 引用** | 在所有下游 ETL 的 SQL/CALCULATOR/SELECT_COLUMNS 里 grep 字段名 | 0 引用 → 候选删 |
| **看板（page）引用** | 看板/卡片是否用了这个字段 | 有 → 不能删 |
| **业务口径** | 字段名是否含业务规则（"是否会员"、"是否新客"） | 这类是规则字段，集中维护到专门的规则映射 ETL |
| **冗余/派生** | 能否从其他字段推导（开业天数 vs 开业日期） | 派生字段尽量在下游算，不在维表物化 |

详细双源审计方法见 **B-10**。

### B-2.6 ODS/DIM/DWD/DWS/APP 分层

| 层 | 放什么 | 关键约束 |
|---|---|---|
| **ODS** | 原始外部表、DB_EXTRACT、手工源表 | 只做轻清洗，不承载业务口径 |
| **DIM** | 门店、会员、日期、支付通道、顾客标识映射 | **稳定、少依赖、可复用，禁止依赖 DWS/APP** |
| **DWD** | 订单明细、券明细、好友明细、评价明细 | 固定主键和时间粒度 |
| **DWS** | 复购、RFM、拉新、蓄水、门店日报 | 从 DWD/DIM 读，**禁止反向被 DIM 引用** |
| **APP** | 看板专用宽表 | **只服务页面，不再作为基础上游** |

调度按层推进 ODS → DIM → DWD → DWS → APP。

**核心反模式**：维表（DIM）混入了下游经营结果字段——比如门店维表里塞了"近 90 天订单数"。这是循环依赖最常见的根源。

### B-2.7 输出物建议

- `analysis.json`：机器可读分析结果（summaries / cycleGroups / highComplexity / nodeTypes）
- `governance-report.md`：人类可读治理报告（核心结论 + 循环组 + 合并主题域 + 清理对象 + 目标架构 + 实施路线）
- `migration-plan.json`：每个旧 ETL → v2 的对应表（score / targetName / status）

---

## B-3. 第一步：新建目录

### B-3.1 不要试这些路径（全部 5001 失败）

```text
POST /api/directory/create
POST /api/directory/ETL/create
POST /api/directory/ETL/add
POST /api/directory/add
GET  /api/directory                  ← Method 'GET' is not supported
GET  /api/etl/tree                   ← ResourceId(tree)/ResourceKind(DataFlow) ResourceNotExist
POST /api/etl/dir                    ← Method 'POST' is not supported
POST /api/resource-atlas/dir         ← 'resourceTypeName missing'
```

合法 `dirType` 只有 **`ETL`** 和 **`DATA_SET`**（不要写 `DATA_PROCESS_ETL` `SMART_ETL` `DATAFLOW` `DATA_FLOW`）。

### B-3.2 正确做法

ETL 树和数据集树是**两棵独立的树**：

```bash
guancli fetch GET /api/directory/ETL/authorized-tree
guancli fetch GET /api/directory/DATA_SET/authorized-tree
```

**分别建**（同名也得建两次）：

```bash
# ETL 目录
guancli fetch POST /api/directory \
  '{"name":"warehouse_v2","parentDirId":"<parent_etl_dir_id>","dirType":"ETL"}'

# 数据集目录
guancli fetch POST /api/directory \
  '{"name":"warehouse_v2","parentDirId":"<parent_ds_dir_id>","dirType":"DATA_SET"}'
```

记住返回的两个 dirId，写 ETL payload 时**两个都要用**：
- ETL 目录 id → ETL 自身的顶层 `parentDirId`
- 数据集目录 id → OUTPUT_DATASET 节点的 `parentDirId` + `dataSource.parentDirId`

---

## B-4. 第二步：构造 ETL payload（速查）

最小骨架 = 3 节点：

```text
INPUT_DATASET → SQL_SCRIPT → OUTPUT_DATASET
```

**最关键的字段坑**（详细见 references）：
- ⚠️ SQL 节点字段名是 **`sql`，不是 `sqlScript`**。写错时 direct-save 不报错，但 SQL 不生效（最隐蔽 bug）。
- ⚠️ SQL 里 `input1/input2/...` 是**位置式索引**对应 `sources[]`，删除 INPUT 节点会让索引前移，**改 input 节点必须同时改 SQL**。
- ⚠️ INPUT_DATASET 的 `relativeFieldAlias` 决定 SQL 里能引用什么字段名，必须读了再写 SQL。
- ⚠️ OUTPUT_DATASET 的 `parentDirId` 是**数据集目录 id**，不是 ETL 目录 id（错填→"保存路径无效"）。

📖 **[references/part-b-payload.md](references/part-b-payload.md)** — 完整 payload 模板（含 dataSource.dirPath）+ 三种节点的字段速查表 + 9 种已知节点类型 + dataFlowId 控制 create vs update + **B-8 复用模板：从扫描到落表的完整 4 阶段脚本**（治理扫描 → 建目录 → 写入执行 → 删除旧链）。

---

## B-5. 第三步：执行 + 拿真实错误

### B-5.1 触发执行（status 字段误导）

```bash
guancli fetch POST /api/etl/execute '{"dataFlowId":"<etl_id>"}'
# => {"taskId":"<task_uuid>","status":"FINISHED"}
```

⚠️ **status 字段误导最坑**：返回的 `status:"FINISHED"` 是**任务触发**结果，不是 ETL 执行结果。

### B-5.2 查任务详情（修 bug 必经路径）

```bash
guancli fetch GET /api/task/<taskId>
# => {"response":{"taskId":"...","status":"FAILED","result":{"error":"..."},"messages":""}}
```

`response.result.error` 才是 BI 引擎给的真实错误（SQL 报错、字段找不到等）。

### B-5.3 错误定位三步走

```bash
# Step 1：触发 execute 拿 taskId
taskId=$(guancli fetch POST /api/etl/execute "{\"dataFlowId\":\"$DFID\"}" \
  | jq -r '.response.taskId')

# Step 2：等几秒再查 task error
sleep 4
guancli fetch GET "/api/task/$taskId" | jq '.response.result.error'

# Step 3：根据 error 类型对照 references/part-b-errors.md 修复手册
```

### B-5.4 异步轮询写法

```bash
TASK_ID="<task_id>"
for i in $(seq 1 30); do
  st=$(guancli task get $TASK_ID --raw | jq -r '.response.status')
  echo "[$i] $st"
  [ "$st" = "FINISHED" ] || [ "$st" = "FAILED" ] && break
  sleep 10
done
```

复杂表给 5 分钟（30×10s）一般够。

---

## B-6. 第四步：校验工具集

```bash
# 1. ETL 视角
guancli etl search <ETL_NAME> -d <ETL_DIR_ID> --raw \
  | jq '.response.contents[0] | {dataFlowId,name,status,lastExecution,outputs}'

# 2. 节点级预览（不用 execute 也能看任意节点输出 — 修 bug 利器）
guancli etl preview <DFID> <NODE_ID> --limit 5 --timeout 120

# 3. 数据集视角
guancli ds search <OUTPUT_DS_NAME> --raw

# 4. 实际数据预览
guancli ds preview <OUTPUT_DSID> --limit 10

# 5. 行列数对账
guancli ds get <OUTPUT_DSID> --brief
```

⚠️ 保存后 OUTPUT 节点 ID 会变成 `id_<ts>_<n>_out`，preview 时用新 id：

```bash
guancli etl get <DFID> --raw \
  | jq -r '.data.actions[] | select(.type=="OUTPUT_DATASET") | .id'
```

---

## B-7. 第五步：删除拓扑

### ⛔ B-7.0 删除前的硬性安全闸（V1.3.1 新增）

**Agent 在执行任何 `DELETE /api/data-source/` 或 `DELETE /api/etl/` 前必须满足以下全部条件，否则拒绝执行：**

1. **用户已逐项明确确认**：列出本次将删除的所有 dsId / etlId（含 ETL 名 + 输出表名 + 路径），用户回复"确认删除"或等价明确指令。**模糊回复（如"嗯"、"可以"、"清理一下"）不算确认。**
2. **下游引用已切流**：通过 `guancli ds get <dsId> --assoc` 或 B-10 双源审计验证目标 ds 的下游 ETL 与看板（page）已切到 v2，无任何活跃引用。
3. **新链路对账通过**：v2 对应 ETL `status:FINISHED`，行数与 v1 差异 <1%，关键字段一致（参考 B-7.3 checklist）。
4. **批量删除分批确认**：单次删除 ≤ 5 张表；超过 5 张必须分批，每批单独走步骤 1。

**Agent 默认行为**：在 ETL 治理 / 重写 / 字段裁剪等任务里，**永远不要主动建议删除**。把待删清单作为 `governance-report.md` / `migration-status.md` 的一节产出给用户审阅，由用户主动指令"删 X / 删这一批"才执行。**新旧并行是默认终态，不是过渡态**——除非用户明确要求收敛。

> 这条闸跟 B-13 红线、B-17.10 完成标准里的"对账确认后再处理旧表"一脉相承。**误删一张被看板用着的 ds，恢复成本高过保留旧链一年。**

### B-7.1 关键约束：先 ds 后 etl

> ✅ **2026-06-17 · workshop513 实测复核（净零回归）**：独立 DATAFLOW ETL 两个方向各测一次——etl-first 撞 `2002 输出数据集已存在` 失败；ds-first（先 `DELETE /api/data-source/<输出dsId>`，后 `DELETE /api/etl/<id>`）两步皆 `ok`、**不报 6001**。本约束适用所有「ETL + 其输出数据集」清理。`6001 依赖于该数据集` **不**出现在这里，它只属于删*输入*数据集（ETL 仍读它）或 churn `NOT_FOUND` 幽灵场景（见 B-0.5 清理坑）。

```bash
guancli fetch DELETE /api/etl/<etl_id>
# => {"error":{"status":2002,"message":"输出数据集已存在"}}  ← 失败！
```

正确顺序：

```bash
# Step 1：先删数据集
guancli fetch DELETE /api/data-source/<dsId>

# Step 2：再删 ETL
guancli fetch DELETE /api/etl/<etlId>
```

### B-7.2 数据集 endpoint 反推血泪史

```text
DELETE /api/dataset/<id>     ← No static resource dataset/...
DELETE /api/datasource/<id>  ← No static resource datasource/...
DELETE /api/ds/<id>          ← No static resource ds/...
DELETE /api/dataflow/<id>    ← No static resource dataflow/...
✅ 正确：
DELETE /api/data-source/<id>
```

### B-7.3 删除前 checklist

- [ ] v3 对应 ETL Status = FINISHED
- [ ] v3 输出数据集行数 vs v2 行数（差异 < 1%）
- [ ] v3 输出字段集 = v2 字段集 - 设计砍掉的
- [ ] 看板（page）依赖 v2 数据集的，已先切到 v3
- [ ] 下游 ETL 依赖 v2 输出的，已先切到 v3

---

## B-9. 报错修复手册（10 类真坑 · 速查）

每条只列**触发现象 + 一句根因 + 一句修复方向**；完整修复方案 + SQL 示例 + 升级版坑见 **[references/part-b-errors.md](references/part-b-errors.md)**。

| 坑号 | 触发现象 | 根因 / 修复方向 |
|---|---|---|
| **1** | `请输入ETL名称` / `保存路径无效` | 顶层 `parentDirId` 缺失或填错 → 必须是 `dirType=ETL` 那棵树的 id |
| **2** | 保存成功但 execute 数据为空 | 上游 `inputDsId` 只有读权限没运行权限 → 换有权限的输入或写自包含 ETL |
| **3** | 列名带隐藏 `\n` 找不到字段 | SQL 里要 `` `带换行的原字段名` AS `干净别名` ``；升级版坑：fieldAlias 与 SQL 中换行+空格不一致 |
| **4** | `WHERE field <> NULL` 输出 0 行 | SQL 标准里 `<> NULL` 永远是 unknown → 必须 `IS NOT NULL` / `IS NULL` |
| **5** | `cannot resolve column` | 字段引用与 INPUT_DATASET 的 `relativeFieldAlias` 错位 → 编译时按节点级别名替换 |
| **6** | `Syntax error at or near ';'` | CTE 内 trailing `;` + 中文注释 → 用 regex 去除 `FROM n_id_xxx;` 后的 `;` 与注释 |
| **7** | `AMBIGUOUS_REFERENCE` | FROM/JOIN 同表别名同名 → 改 FROM 别名为 s2，对齐 ON 子句 |
| **8** | `s2.xxx 找不到` | FROM 表错位（自连而非 JOIN 不同表） → 修正 JOIN 目标表 |
| **9** | `NUM_COLUMNS_MISMATCH` | UNION 列数不一致（老引擎自动补 NULL，新引擎严格化） → 手工对齐 SELECT，缺的用 `NULL AS xxx` |
| **10** | 日期比较恒为 false | `WHERE order_date < 'today_field'` 字符串字面量 → 改 `date_sub(current_date(), 1)` |

---

## B-10. 字段使用度审计（双源扫描）

### B-10.1 方法论

字段裁剪不能只看看板（page）—— 下游 ETL 也消费字段。**双源 0 引用**才能安全裁。

```bash
# 1. 拉数据集所有下游
guancli ds get <dsId> --assoc
# 输出 N 个下游：M 个 ETL + K 个 PAGE

# 2. 批量 page get + etl get 落本地
for id in <ids>; do
  guancli page get $id > pages/$id.txt
  guancli etl get $id > etls/$id.txt
done

# 3. 对每个字段做 grep 双源统计
for fld in <field_list>; do
  page_cnt=$(grep -c "$fld" pages/*.txt)
  etl_cnt=$(grep -c "$fld" etls/*.txt)
  if [ "$page_cnt" = "0" ] && [ "$etl_cnt" = "0" ]; then
    echo "🟥 $fld → 真 0 引用，可裁"
  fi
done
```

### B-10.2 实测对照（必看）

```text
某千万级订单明细表：43 字段、5GB
全量扫描：29 page + 14 etl
仅看板抽样：17 个 0 引用候选
双源全扫描：仅 2 个真 0 引用
误删任何一个 → 下游 ETL 跑挂
```

**只看看板会高估 8 倍可裁字段，必须 page+etl 双源。**

---

## B-11. v2 → v3 批量改造 SDK（速查）

`v3_sdk.mjs` 三个核心 API：

```js
transformV2ToV3({ v2PayloadFile, v3Name, removeInputs, newSql, inputMap, description })
pushAndExecute(v3Name, payloadPath)   // direct-save → execute
checkStatus(v3Name)                    // guancli etl search → parse Status
```

`transformV2ToV3` 有 4 个关键陷阱，头号坑是 **SQL 字段名是 `sql` 不是 `sqlScript`**（写错不报错、SQL 静默不生效）；完整 4 条清单见下方 reference。

📖 **[references/part-b-sdk.md](references/part-b-sdk.md)** — 完整 7 步实现 + 时间窗口缩减实战（v2 近 3 月 → v3 昨日窗口的 regex 替换样板）。

---

## B-12. 批量迁移工程经验（30+ 表实战）

1. **先治理后写入**：跳过治理直接写 = 把混乱重做一遍。
2. **payload 全部本地生成**：写编译器把每个旧 ETL 的 meta 编译成三段式 payload，存 `payloads/<name>.json`。
3. **分批保存**：一次 5–10 张 direct-save，避免单次失败影响整批。
4. **预览先于执行**：保存完先 `etl preview` 看 OUTPUT 节点能不能出数据；能出来再 execute。
5. **节点 ID 重映射**：保存后 OUTPUT 节点 ID 变成 `id_<ts>_<n>_out`，从 `etl get` 拿新 id。
6. **失败修复就地更新**：改 payload 加 `dataFlowId` 再 POST，不要删了重建。
7. **复用旧 payload**：v2 payload 作为模板，改名+改 SQL+改输入。30 个 ETL 中 22 个用这种方式。
8. **失败定位用 task error**：每个 task 详情里 `result.error` 是真实失败原因，必看。
9. **批量任务异步监控**：`until` 循环 + `etl search | grep -c PROCESSING` 比单 task 轮询效率高。
10. **新旧并行**：v2 链路与 v1 并行，对账无误后再下线 v1。

> 💡 **30+ 张表跨多日的工程必须走 ExecPlan**：不要靠零散 todo + 群消息 + 临时 markdown 来追踪进度。直接走 **B-17.11**（在 [references/part-b17-fullchain-rewrite.md](references/part-b17-fullchain-rewrite.md)）的 ExecPlan 工作法——四个活文档章节（Progress / Surprises & Discoveries / Decision Log / Outcomes & Retrospective）能把治理判断、循环依赖拆法、字段隐藏换行这类"踩坑—修复"轨迹完整落到一份自包含文档里，下一个接手的人不用问任何上下文就能继续。

---

## B-13. ETL 治理与写入红线

- ❌ 不要试 `/api/directory/create` 这类拼凑路径，全部 5001。
- ❌ 不要给 `dirType` 写 `DATA_PROCESS_ETL` `SMART_ETL` `DATAFLOW`，只接受 `ETL` 和 `DATA_SET`。
- ❌ 不要把 `OUTPUT_DATASET.parentDirId` 填成 ETL 目录 id —— 报"保存路径无效"。
- ❌ **不要把 SQL 字段名写成 `sqlScript`**，正确是 `sql`（写错时 direct-save 不报错但 SQL 不生效）。
- ❌ 不要在 SQL 里写 `<> NULL` 或 `= NULL`，用 `IS NOT NULL` / `IS NULL`。
- ❌ 不要假设 INPUT_DATASET 字段名干净 —— 先看 `relativeFieldAlias` 和实际预览。
- ❌ 不要 execute 完就走人 —— `status:FINISHED` 是任务触发结果，不是 ETL 执行结果。要 `GET /api/task/<id>` 拿 `result.error`。
- ❌ 不要假设节点 ID 重排不影响 SQL —— 删除 INPUT_DATASET 后 input 位置式索引会变。
- ❌ **未经用户逐项明确确认，绝不执行任何 DELETE 操作**（含 `/api/data-source/`、`/api/etl/` 和 `/api/page/<id>?force=true` 级联删页）—— Agent 默认行为是把待删清单产出给用户审阅，由用户明确指令才执行。详见 **B-7.0 删除前的硬性安全闸**。模糊回复（"嗯"、"可以"、"清理一下"）不算确认。
- ❌ 不要为了"清理"删旧 ETL —— 并行做新链路、对账确认后再处理旧表。新旧并行是默认终态，不是过渡态。
- ❌ 不要直接 `DELETE /api/etl/<id>` —— 必须先 `DELETE /api/data-source/<dsId>` 再删 ETL。
- ❌ 不要试 `DELETE /api/dataset/`、`/datasource/`、`/ds/` —— 正确是 `/api/data-source/`（带连字符）。
- ❌ 不要给 INPUT_DATASET 用没有运行权限的 dsId —— 保存能过，执行会拿不到数据。
- ❌ 不要复用 OUTPUT 节点 id 作为 preview 参数 —— 保存后会变成 `id_<ts>_<n>_out`。
- ❌ 不要跳过治理扫描直接重建 —— 不识别循环依赖和重复主题域，重建出来还是一团乱麻。
- ❌ 不要把"是不是被引用"等同于"该不该保留" —— 看板 APP 表常常没下游 ETL，要单独看看板侧。
- ❌ 不要让 DIM 维表依赖 DWS/APP 层 —— 这是循环依赖最常见的根源。
- ❌ 不要只看看板做字段裁剪 —— 实测仅看板会高估 8 倍可裁字段，必须 page+etl 双源。
- ❌ 不要假设老 ETL SQL 写法在新引擎也能跑 —— 5 类历史 bug（trailing `;` / UNION 列差 / 字段名换行+空格 / self-join 别名同名 / 字符串字面量与 DATE 比较）会暴露。
- ❌ 不要忘记 OPTIONS 探测 —— 找未知 endpoint 时比盲发 POST 高效 10 倍。

---

## B-14. ETL 写入侧 API 速查

| 操作 | 方法 | 路径 / 命令 |
|---|---|---|
| 探测 method | OPTIONS | `/api/<any-path>` |
| ETL 目录树 | GET | `/api/directory/ETL/authorized-tree` |
| 数据集目录树 | GET | `/api/directory/DATA_SET/authorized-tree` |
| 建目录 | POST | `/api/directory` body: `{name, parentDirId, dirType}` |
| 抓 ETL 详情 | – | `guancli --raw etl get <id>` |
| 写入 ETL（创建/更新） | POST | `/api/etl/direct-save --stdin` |
| 触发执行 | POST | `/api/etl/execute` body: `{dataFlowId}` |
| 查任务真错误 | GET | `/api/task/<taskId>` → `.response.result.error` |
| 节点级预览 | – | `guancli etl preview <DFID> <node_id>` |
| 删数据集（先） | DELETE | `/api/data-source/<dsId>` |
| 删 ETL（后） | DELETE | `/api/etl/<id>` |

---

## B-15. 实战 ID 速查（模板）

> 跨多日的大型重构（B-17 / 30+ 表）建议在仓库根维护一份本地 ID 速查表，避免每次都用 `guancli` 翻树。下面是模板，把 `<...>` 占位符替换成你自己 BI 实例里的真实 ID。**不要把这份表 commit 到公开仓库。**

| 名称 | ID | 说明 |
|---|---|---|
| 旧 ETL 父目录 | `<v1_etl_dir_id>` | v1 ETL 目录 |
| 旧数据集父目录 | `<v1_ds_dir_id>` | v1 数据集目录 |
| **v2 ETL 目录** | `<v2_etl_dir_id>` | 新建 ETL 落这里 |
| **v2 数据集目录** | `<v2_ds_dir_id>` | OUTPUT_DATASET 落这里 |
| 数据集树根目录 | `<ds_root_id>` | dirPath 第一层 |
| ETL 树根目录 | `<etl_root_id>` | – |
| PoC ETL | `<poc_etl_id>` | 第一个跑通的最小 ETL |
| PoC 输出数据集 | `<poc_output_ds_id>` | 同上输出 |
| PoC 输入数据集 | `<poc_input_ds_id>` | 小表，权限可运行 |

如果上面 ID 失效（被删/改名），用以下命令重新拿：

```bash
guancli fetch GET /api/directory/ETL/authorized-tree | jq '.response | .. | objects | select(.name=="<你的 v2 目录名>")'
guancli fetch GET /api/directory/DATA_SET/authorized-tree | jq '.response | .. | objects | select(.name=="<你的 v2 目录名>")'
```

---

## B-17. 全链路重写方法论（CTO 张进）

> 这套是观远 CTO 张进的 SmartETL 完整改写经验。它跟 B-2 治理扫描互补：B-2 解决"有哪些 ETL 该治理"，B-17 解决"具体重写一条链路时怎么做才不留尾巴"。
>
> **核心区别**：B-17 强调**全链路追到原始源**，不接受只重写最终 ADS。如果用户说"把这条链路重新做一遍" / "替换数据源" / "做副本页验收"，必走 B-17。

📖 **[references/part-b17-fullchain-rewrite.md](references/part-b17-fullchain-rewrite.md)** — 完整方法论 11 节：何时用 B-17 / 4 件交付 / 8 条硬规则 / 5 步标准工作流 / 三层验收（数据集/副本页/卡片级）/ 差异追踪 5 步法 / 空快照处理标准 / 标准交付物清单 / 6 类专属常见坑 / 完成标准 6 项 / **B-17.11 用 ExecPlan 管理重写工程**（含 SmartETL 改写专用 ExecPlan 骨架，拿去直接填空）。

**最简口诀**（10 秒决定要不要进 B-17）：
- 只新建 1 个 SQL 节点数据集 → 走 B-3 ~ B-9，不进 B-17
- 涉及"页面副本验收"或"卡片级数值对账"或"全链路追到原始源" → 必进 B-17
- 30+ 表 / 跨多日 / 循环依赖拆解 → 进 B-17 + 走 B-17.11 ExecPlan

---

# 🆎 Part C：自定义图表开发与排障（V1.1 新增）

> **并行参考（V2.0 标注）**：观远 maintainer wubaoqi 在 2026-04-29 发布了 `@wubaoqi/guan-chart-kit`（React + ECharts 组件库，专为观远 BI 设计）和 `@wubaoqi/guan-chart-kit-usage-skill`（agent-skill，教 SuperApp 接 chart-kit）。两条路线区别：
> - **chart-kit 路线**（wubaoqi）：从零搭新看板，走**组件接入** + npm 依赖管理，适合标准化复用
> - **本 Part C 路线**：在既有卡片上做 HTML/CSS/JS 注入 hack，绕过组件直接改 DOM/data，适合改造既有页面、临时 overlay、固定卡片
>
> 两者互补，按"是新搭还是改造"分流。

> 来源：观远 CTO 张进的自定义图表注入实战经验。涵盖 HTML/CSS/JS 注入、runtime 取数、固定卡片、遮罩层、z-index/stacking context、路由清理，以及任何**必须在真实观远页面里做浏览器验证**的前端问题。

## C-〇. 何时用 Part C

任务涉及观远 BI **自定义图表**的：
- 前端代码（HTML/CSS/JS）
- 运行时取数（`renderChart` 的 `data` 参数解析）
- 页面级 DOM 操作（固定卡片、overlay、mask）
- 浏览器层级问题（z-index、stacking context、pointer-events）
- 路由切换清理、复制页 card id 重定位
- 懒加载导致脚本不执行
- 必须在真实页面验证的问题

不用 Part C 的情况：只是在观远 UI 里点几下做卡片配置，不写代码 → 走路由层（标准建卡交 guanvis）。

## C-1. 快速开始原则（6 条）

1. **要注入 HTML/CSS/JS** → 用「自定义图表」，不用「自定义图表 Lite」
2. **先在真实观远页面复现问题，再改代码**
3. **先确认 live 页实际运行的是哪份脚本**，再判断问题
4. **脚本开始漂移或多次局部修补失效时，优先给完整 JS**，不要继续发零碎 diff
5. **每次结构性修改后回浏览器重新验证**
6. **遇到取数问题，先看 `GDPlugin().init(renderChart)` 的 runtime 入参**，不要先假设它等于 `/api/card/.../data` 的 HTTP 包裹层

## C-2. runtime 契约（必须知道）

观远当前的 runtime 回调签名是：

```javascript
function renderChart(data, clickFunc, config, helpers) {}
```

⚠️ **常见误解**：
- ❌ 把第一个参数 `data` 当 DOM 根节点 —— 错。要自己从 `document.querySelector(...)` 或 `document.body` 获取 DOM。
- ✅ `helpers` 常见为 `{ refreshData, clickFunc }`

`data` 形态多变，常见 5 种：

```javascript
// 形态 1（最常见）
[
  [
    { name: "payload_json", data: ["{...}"] },
    { name: "report_date", data: ["2026-03-18"] }
  ]
]

// 形态 2
[{ name, data }, ...]

// 形态 3
{ chartMain: { columns: [...] } }

// 形态 4
{ response: { viewData: [...] } }

// 形态 5
[{ payload_json, report_date }]
```

**结论**：优先围绕 runtime `data` 写解析逻辑。`/api/card/.../data` 只用于核对证据，不要把它当 callback 结构直接照搬。

## C-3. payload_json 取数排障（速查）

📖 **[references/part-c-payload-json.md](references/part-c-payload-json.md)** — 三种"拿不到 payload"的细分 / 最快判断方式 / `JSON.parse` 硬规则 / 截断错误（`Unterminated string` / `Unexpected end of JSON input`）的判断 / 推荐方案：拆列而非整包 JSON。

**最简结论**：JSON.parse 失败且报截断错时，**优先判断为数据链路把长字符串截断了**，不要继续堆兼容解析逻辑。改数据方案——把整份报告拆成多列（`report_date` / `key_insights_md` / 各 section 列）传给前端，比 runtime 再 `JSON.parse(payload_json)` 稳得多。

## C-4. 固定卡片 / overlay 场景

### C-4.1 保守做法

- ✅ **只移动目标卡片内容**，不要把整页都抽进 overlay
- ✅ overlay 和 mask **挂到当前页面根节点**，**不要挂到 `body`**
  - 挂到 body 的后果：切页后残留 / 与原生浮层打架 / 跟右侧锚点导航层级冲突
- ✅ overlay 的 z-index 要够用，但**不能压过观远原生导航、浮层、工具条**
- ✅ 卡片尺寸变化时，主动派发 `resize`（立即一次 + 延迟几次）让图表重排

### C-4.2 z-index 基线（已验证）

```text
overlay 容器     约 8
mask            约 1
固定卡项        约 20，按需要递减
```

目标：**高于滚动内容，低于观远原生导航、菜单、工具层。**

### C-4.3 让加载器看得到注入卡，但用户不必看到

- 观远自定义图表 iframe **是懒加载的**
- 注入卡放在首屏以下 → 初次进页时脚本可能根本不执行

**可靠做法**：
1. 把注入卡**放在首屏**
2. 查看态视觉隐藏
3. **编辑态恢复可见**（让用户能找到并编辑）

## C-5. 页面生命周期管理

### C-5.1 必须主动销毁注入物的场景

- URL 不再匹配目标 page id
- 进入编辑态
- 切到 `pageRenderType=phoneView`
- 客户端路由离开当前页

**只在目标桌面查看态重建。**

### C-5.2 复制页面后 card id 全变

- 观远复制页面会生成新的 card id
- 继续使用原页面硬编码 id 通常**不会显式报错，只会悄悄失效**
- 复制页一定要重新确认 card id

### C-5.3 MutationObserver 死循环陷阱

- 监听 `body subtree` 后又在回调里改样式 → 容易反复触发，卡死页面
- ✅ 更稳的做法：低频轮询 + 精准 rect 比较

## C-6. 浏览器排障清单

### C-6.1 改代码前先看 live runtime

检查：
- 当前 URL 和 page id
- `window` 上是否已有旧版注入 key
- `__gd_overlay__` 和 `__gd_overlay_mask__` 是否存在
- 页面里是否留有历史实验节点

### C-6.2 找到真正可点击的 DOM

不要把"看到的文本节点"误当成真正交互节点。对右侧锚点导航，真正有用的目标往往是：
- 打开按钮图标
- tab 按钮
- pin 图标

### C-6.3 用 `elementFromPoint` 查层级问题

控件可见但点不动时，查控件中心点命中的真实元素：
- 命中 fixed card 或 overlay 子节点 → 层级问题
- 命中正确控件但还不工作 → 之前点错节点 / 某个祖先禁用了 pointer events

### C-6.4 最终用真实浏览器点击验收

不要只靠 `page.evaluate(... click())`。要用真实浏览器点击，确认：
- tab 切换是否真的生效
- 页面滚动位置是否真的变化
- pin 状态是否真的切换

## C-7. 保留原生浮动 UI

- ❌ 没必要时，**不要重绘或克隆**观远原生浮动控件
- ✅ 优先修 stacking context、pointer-events、opacity，而不是复制一套控件

原生控件不可点时，按这个顺序排查：
1. overlay 是否盖住它
2. mask 是否拦截事件
3. 祖先节点是否被设成 `pointer-events: none`
4. 原控件是否被历史实验隐藏

## C-8. 交付规则

- ✅ 用户要手工粘贴时，**默认给完整 JS**，不给局部片段
- ✅ 如有需要，同时明确给出 HTML / CSS
- ✅ 脚本不稳定时，完整替换优于局部修改
- ✅ 页面已经完全坏掉时，先给最小恢复版救回来：

```javascript
function renderChart() {}
new GDPlugin().init(renderChart);
```

提醒用户执行：**保存 → 发布 → 强刷查看页**。

## C-9. 最终验收清单

最终一定要在真实页面验证：
- [x] 页面加载
- [x] 查询 / 筛选切换
- [x] 滚动
- [x] 左侧栏展开收起
- [x] 路由切页
- [x] 编辑态进出
- [x] 桌面 / 手机态切换
- [x] 原生浮动控件是否仍可见、可点

## C-11. 深度参考资料

遇到复杂的固定卡片 / overlay / 锚点导航问题时，读：

- [references/custom-chart-playbook.md](references/custom-chart-playbook.md) — 张进的完整自定义图表排障手册原文（含固定层与真实布局错位修正、右侧原生导航失效详细处理、elementFromPoint 实战、MutationObserver 死循环深入分析）
- [references/etl-rewrite-original.md](references/etl-rewrite-original.md) — 张进的 SmartETL 改写经验原文（B-17 章节就是基于它整合的，这里是未删减版）

## C-12. HTML 应用化看板生成（V2.1.1 新增）

> **触发**：用户说"更高级 / 更复杂 / 更好 / 应用 / 自定义模块 / 不要限制在标准看板 / 最完美版本 / HTML 看板"——立刻切到这条路线，**不要**按 guanvis 标准 KPI/折线/柱状图套路交付。
>
> **架构**：原生 Page + 原生 selector + HTML SDK 可见层（`createCustomChart().setSubType(CustomChartSubType.SDK).loadContent(...)`）+ DATA_GRID dataView 数据层。后端负责权限/刷新/聚合/筛选，前端负责叙事/布局/SVG-HTML 可视化。
>
> **不能跳的两条坑**（2026-05-14 `app.guandata.com` 上 `<demo-domain>` 实例实测）：
> 1. `guanvis` DSL 的 `.linkToAll()` **不会** 把 selector 联到 custom chart 内部 dataView——必须走 **资源包级 descriptor patch**（不要去调 `/api/card/.../edit/session`，会返回 `60004 此操作只能在草稿页面执行`）。
> 2. `guancli card preview` 的命令面 V2.1 起 **不再有 `--pg-id`**，老写法 `card data <id> --pg-id <pg_id>` 已废弃；同时不同子命令返回根字段不同（`page get → .data`、`card get → .response`），jq 统一写 `.data // .response // .`。

📖 **[references/part-c-html-dashboard.md](references/part-c-html-dashboard.md)** — 完整方法论 15 节：何时切到 HTML 应用看板 / 总体架构 / SDK vs ECHARTS_LITE 决策 / dataView contract / 共享 runtime API / 24 字符 ID 校验 / selector → custom chart dataView 联动补丁 / 12 步 pack-patch-upload 工作流 / 字段粒度后缀兼容（`月份` / `月份 (月)` / `年月`）/ guancli V2.1 命令面（含 `.data // .response` 兼容）/ **五层验收清单（四层管道 + §11.5 视觉验收）** / 13 类常见错误表 / 模板包索引。

🎨 **视觉设计底线（V3.1.0 新增）**：[references/part-c-design-baseline.md](references/part-c-design-baseline.md) — 管道通了 ≠ 看板能看。模块第一视觉位=数据判断 / KPI 3-4 个 + 28-32px + 单位/对比基准 / 图表真实性（禁 CSS 假图表）/ token 硬上限 / 反 AI 味红线表（命中即重做）/ `guanvis screenshot` 视觉验收。吸收 design-taste-skills（MIT），覆盖 C-12 / Part D / Part E 三场景。

🧰 **模板包**：[`templates/html-dashboard/`](templates/html-dashboard/) — `charts/html_common.js` (GDHTML runtime) + `html_base.css`（V3.1.0 按设计底线校准）+ 2 个起手模块（executive / trend）+ `scripts/patch_selector_linkage.js`（CLI 参数化，弥补 `linkToAll` 联不到 custom chart dataView 的盲区）。🆕 **guanvis 0.1.29 起官方新增「页面筛选器过滤自定义图表 + custom chart dataView 作点击联动来源」**——新页可先试官方 selector 联动，覆盖到位则此脚本可省；旧版/未覆盖场景仍用兜底（官方能力未净零实测，暂并存）。

---

# 🆎 Part D：V7 Page/Card 发布流水线 + 三态硬规则（V2.1.6 新增）

> **触发**：用户说"v7 BI 实例上端到端搭多个 HTML 应用看板"，或卡在以下任一报错——立刻进 Part D，**不要** 在标准建卡（guanvis）/ Part C 链路上继续挣扎，没用：
> - `POST /api/page` + `POST /api/card` 返回 `60004 此操作只能在草稿页面执行`
> - PUT 草稿页 cdId 后，published page 拿到的 cdId 跟 draft 的不映射，整页拼不出来
> - CSV 散客订单 `会员ID IS NOT NULL` 算出 "会员销售占比 = 100%" 假指标
> - Spark `WITH 订单汇总 AS (...)` 报 `PARSE_SYNTAX_ERROR Syntax error at or near '订'`
> - ETL update 报 `1012 输出数据集目录中存在同名文件，请修改`
> - `dim_是否新店 = '1'` 永远空表（CSV 布尔字段实际是 `'TRUE'/'FALSE'` 字符串）
> - 50 店 / 90 天 / 45 万订单 openpyxl 写 Excel 4-5 分钟
>
> **架构**：v7 BI 的草稿/发布分离机制使**手撸 `/api/page` + `/api/card` 全链路废弃**；银弹是官方 `guanvis`（原 `guanvis-skill`，全家桶成员，现公网 `@guandata/guanvis@0.1.33`），`guanskill install-skill && guanvis publish .` 30 秒一键发布整个 page + custom chart + dataView，跳过所有草稿/发布的状态机。配套硬规则：CSV 散客 `会员ID` 是 `""` 不是 NULL（三态判断必须 `IS NOT NULL AND <> ''`）；STRING 字段才能 `<> ''`，日期/数字 Spark 严格类型不行；Spark CTE 别名必须英文；ETL update 必须带 `OUTPUT_DATASET.dataSource.dsId` 否则 1012；数据集上传 / 建集走官方 `guands`（`create-db` / `import` / `replace-data`，不必再 BI UI 手动）；大表 pandas 用 `to_csv` 而非 `to_excel`（50 倍速差）。
>
> 🗑️ **删除 guanvis-published 页面 / ETL（2026-06-05 · workshop513 实测）**：`guanvis publish` 出的页面，卡片**内嵌在 `page.cards` + `meta.layout`、不是独立 `/api/card` 资源**——所以 `DELETE /api/card/<cdId>` 报 `1002 找不到`、`DELETE /api/page/<id>` 报 `1004 无法删除包含卡片的页面`、guanvis 也不让覆盖成空页（validation 拒 `No layout items`）。**唯一可行**：`guancli fetch DELETE "/api/page/<pgId>?force=true"` → `Page deleted`（级联删卡）。⚠️ **`force=true` 级联删整页内嵌卡片且不可逆，属 B-7.0 安全闸覆盖的 DELETE**：执行前用户须逐项确认页 ID + 页名（模糊回复不算确认）。**仅当本地保有该 page 的 guanvis 源（`page.js` / card 定义）可 `guanvis publish` 重建时，确认即可、无需对账；若是 BI UI 手搭、本地无源的发布页，按不可逆 DELETE 对待、走 B-7.0 完整对账。** 删 ETL + 输出集 → **先删输出数据集、再删 ETL**（与 B-7.1 一致；2026-06-17 实测：反过来先删 ETL 撞 `2002 输出数据集已存在`，ds-first 不报 6001）；`guanetl delete --cascade` 0.1.14 起已无此命令。
>
> **不能跳的硬约束**（2026-05-20/21 v7 demo 实战 · 90 天 / 1200 门店 / 80K 会员 / 20 表 / 17 ETL / 6 HTML 看板）：
> 1. **直接手撸 page+card API 全废**：draft cdId ≠ published cdId 不会自动映射回 published page，光走 `POST /api/page` 拼不出来；走 `guanvis publish` 才能跨过状态机。
> 2. **CSV 类型三态硬规则**：STRING 字段可以 `<> ''`，日期/数字字段不能（Spark 严格类型直接报错）；CSV 布尔字段实际是 `'TRUE'/'FALSE'` 字符串而非 int 1/0，`= '1'` 永远空表。

📖 **[references/v7-page-card-publish-pipeline.md](references/v7-page-card-publish-pipeline.md)** — 完整 16 节：v7 草稿/发布机制详解 / HTML 应用看板 SDK 最小骨架（schema.js + card_01_html.js + page.js + charts/dashboard.{html,css,js} 4 文件） / CSV 三态判断硬规则 / Spark SQL 4 个硬限制（中文别名 / 嵌套窗口 / `<> NULL` / 字面量日期）/ ETL update OUTPUT_DATASET dsId 注入脚本（`guancli ds search` 自动查 dsId 注入）/ 数据集上传 / 建集走官方 `guands` / pandas to_csv vs to_excel 性能对比 + 向量化 30 倍速差 / JOIN 键全局统一命名（COL_MAP）/ 奶白 `#faf7f2` + 暖蓝 `#2563eb` 主题 / 端到端时间预算 / 反模式与硬约束总表 / 工程目录参考结构 / 与 Part C-12 的边界关系 / **§14 SmartETL 节点化两大静默坑（V2.1.8 新增）** / **§15 customChart 三大坑 + autoBootstrap + chip toolbar 兜底（V2.1.9 新增）** / **§16 移动端 phoneLayout ZIP inject + v7 草稿 save API 死路（V2.1.10 新增）**。

---

## 📚 References 目录

> 本 SKILL.md 主文是路由层 + 关键规则；以下马甲蒸馏档（官方够不着的硬骨头）+ 餐饮公式库 + 贡献者原文构成完整知识库。详细索引：

**马甲蒸馏版：**

| 文件 | 何时读 | 行数 |
|---|---|---|
| [part-b-payload.md](references/part-b-payload.md) | 写新 ETL payload / 复用 4 阶段脚本时 | ~175 |
| [part-b-errors.md](references/part-b-errors.md) | execute 失败、对照 `task error` 找修复方案时 | ~150 |
| [part-b-sdk.md](references/part-b-sdk.md) | 30+ 表批量改造、写 `transformV2ToV3` 时 | ~60 |
| [part-b17-fullchain-rewrite.md](references/part-b17-fullchain-rewrite.md) | 全链路 SmartETL 重写、副本页验收、ExecPlan 管理时 | ~290 |
| [part-c-payload-json.md](references/part-c-payload-json.md) | runtime 拿不到 payload_json / JSON.parse 失败时 | ~60 |
| [part-c-html-dashboard.md](references/part-c-html-dashboard.md) | 用户说"更高级 / 应用化 / 不限标准看板"，从零生成 HTML 化分析应用时（V2.1.1 新建） | ~620 |
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

**最新：V3.1.8** (2026-07-24) — **官方全家桶 07-15 + 07-24 两批次一次性对齐**。guanskill 0.1.12→**0.1.17**，六子包自 v3.1.6（07-10 批）以来净变更：guanwf 0.1.7→**0.1.822**（版本号直跳非笔误——官方 07-15 跳 0.1.820、07-24 进 0.1.822；**8.2.0 兼容线 + 破坏性变更（0.1.820 引入）**——写操作全面加 **`--confirm` 门禁**（`save`/`save-draft`/`run`/`schedule` 先 `--dry-run` 看计划、再 `--confirm` 才执行，**旧的 `guanwf save --dir X` 直接生效写法失效**）+ 工作流参数 `Workflow.Params` / `run --param` / 事件调度 + 结构化任务节点强类型 DSL + 实例诊断 `instance list｜tasks｜logs｜latest` + `resume-failed` + **失败恢复语义修正**（恢复节点的全部 DAG 后继都会重跑）+ 8.2.0 三条硬边界；**0.1.822 新**：工作流依赖/血缘分析提速 + 完善已有工作流原地编辑保护）、guands 0.1.19→**0.1.23**（**`account rename` 原地改数据账户名**、禁止删后重建 + **`dataset primary-key set/clear`** 独立子命令 + `dataset refresh` 提交前查 `status` 防重复 + **Excel 多 Sheet 必须显式 `--sheet`**（以上 0.1.21）；**0.1.23 新**：数据连接配置安全原地更新（先预览+校验）+ 填报表单导出/编辑/重命名（保留已有字段与数据）+ 填报表单目录管理）、guancli 1.0.39→**1.0.43**（**`card preview` 支持多级表头** + 权限受限也能用卡片自带字段完成筛选预览 + `form update` 载荷必须带全部业务主键字段（以上 1.0.40）；**1.0.43 新**：Token 登录引导与状态校验更准确 + 多资源读取提速（Agent 分析页面/数据集/指标更快））、guanvis 0.1.30→**0.1.33**（**`setFilterPanelLayout()` 配筛选栏布局** + `updateMetric`/`patchMetric` 回写保留未修改的线上配置 + 字段显示名 `alias` 与 Card 标题相互独立（以上 0.1.31）；**0.1.33 新**：指标图表支持主次指标组 + 数字分组 + 发布前预检无效资源/未挂载卡片/生成错误 + 复杂页面编辑与大型资源导入提速）、guanetl 0.1.19→**0.1.21**（07-15 无变化；**0.1.21 新**：JOIN 字段类型检查从 `export` 扩展到 preview/save/run 全过程 + 复杂 ETL 字段识别/多级上游诊断更准、批量检查提速）、guanmetric 0.1.1→**0.1.3**（07-15 无变化；**0.1.3 新**：完善已有指标原地编辑保护 + 优化 Agent 批量准备/校验指标配置的效率）。路由总表 6 组件版本/能力刷新 + **官方 `guandata-cli-suite` 统一入口并存注记**（0.1.14 起官方自带纯分派 skill，本表额外承载版本 pin/能力清单/实测边界）；架构图 6 卡版本刷新；补回 v3.1.7 漏刷的 marketplace/版本行/自身行 pin。护城河零删减。

**V3.1.7** (2026-07-12) — **餐饮 BI 公式实战库 + workshop513 咖啡连锁模拟案例迁出至独立仓库 [majia-huiyuan](https://github.com/maojiebc/majia-huiyuan)**，与模拟数据中台合并成「开源会员运营家底」项目；分仓原则 = **工具在 guanyuan、数据与公式在 huiyuan**，两边独立迭代。原路径 `references/restaurant-bi-formulas/` 与 `examples/` 只留指针 README，全仓引用改指新家。

**V3.1.6** (2026-07-10) — **官方全家桶 07-08/07-10 版本对齐 · 家族 5→6 员**。guanskill 0.1.10→**0.1.12**：**guanmetric 0.1.1 首次入桶**（指标创建/编辑/删除 + 指标主题/指标目录 + 公共维度管理从 guancli 迁出独立；**指标 Excel 标准化** `template normalize` 按原子/复合/衍生拆分 + 汇总 sheet + 批量创建前校验）、guancli 1.0.38→**1.0.39**（`etl get` 输出**有效调度状态**（避免 `schedule --disable` 后残留误判）+ 工作流资源查询增强 + 指标能力收敛只读）、guanvis 0.1.29→**0.1.30**（**checkout 线上页面到本地工程**（编辑/差异/回写）+ 动态维度/动态指标/拆分图表 + 筛选器分组/开关检查 + pack/preview/lint 诊断增强）、guanetl 0.1.18→**0.1.19**（**新增 `move`** + **`run --run-upstream` 上游链路拓扑执行** + `run --wait` 40001 等现有任务 + `export` JOIN 键类型 warning）、guands 0.1.18→**0.1.19**（数据集**追加/清理数据** + **schema 同步** + 批量计算字段 + 填报表单建数据集 + 行列权限查看）、guanwf 0.1.6→**0.1.7**（离线开发 + **依赖分析/执行计划/依赖校验**批量作业编排统一调度）。路由总表新增 guanmetric 行 + 6 组件刷新；Part B 边界补 0.1.19 note；架构图重画 6 件套；manifest/README/package 基线 pin 同步。护城河零删减。

完整变更历史见 [CHANGELOG.md](CHANGELOG.md) 或 [GitHub Releases](https://github.com/maojiebc/majia-guanyuan/releases)。

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
