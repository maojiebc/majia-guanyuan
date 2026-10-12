# 主文下沉记录

以下规则从 v3.3.0 路由主文完整迁移，仅调整相对链接及脱敏环境代称。旧版本修复、绕过方案和 API 经验是历史记录；优先按当前官方 Skill 与主文硬边界处理，不能用它覆盖本轮只读授权或自动删除重建。

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
> **架构**：v7 BI 的草稿/发布分离机制使**手撸 `/api/page` + `/api/card` 全链路废弃**；优先使用官方 `guanvis`（原 `guanvis-skill`，全家桶成员，现公网 `@guandata/guanvis@0.1.50`），按官方预览、覆盖前备份和发布流程处理 page + custom chart + dataView；0.1.47 覆盖后会重置草稿，发布后分别验收浏览态与编辑态。桌面端 另有 `guanvis live` 对话式路径（`live project validate/publish` 走完整 DSL；**不得用 P0 命令模拟自定义图表**，C-12 descriptor patch / 60004 / phoneLayout 仍走本 Part）。配套硬规则：CSV 散客 `会员ID` 是 `""` 不是 NULL（三态判断必须 `IS NOT NULL AND <> ''`）；STRING 字段才能 `<> ''`，日期/数字 Spark 严格类型不行；Spark CTE 别名必须英文；ETL update 必须带 `OUTPUT_DATASET.dataSource.dsId` 否则 1012；数据集上传 / 建集走官方 `guands`（`create-db` / `import` / `replace-data`，不必再 BI UI 手动）；大表 pandas 用 `to_csv` 而非 `to_excel`（50 倍速差）。
>
> 🗑️ **删除 guanvis-published 页面 / ETL（2026-06-05 · example-profile 实测）**：`guanvis publish` 出的页面，卡片**内嵌在 `page.cards` + `meta.layout`、不是独立 `/api/card` 资源**——所以 `DELETE /api/card/<cdId>` 报 `1002 找不到`、`DELETE /api/page/<id>` 报 `1004 无法删除包含卡片的页面`、guanvis 也不让覆盖成空页（validation 拒 `No layout items`）。**唯一可行**：`guancli fetch DELETE "/api/page/<pgId>?force=true"` → `Page deleted`（级联删卡）。⚠️ **`force=true` 级联删整页内嵌卡片且不可逆，属 B-7.0 安全闸覆盖的 DELETE**：执行前用户须逐项确认页 ID + 页名（模糊回复不算确认）。**仅当本地保有该 page 的 guanvis 源（`page.js` / card 定义）可 `guanvis publish` 重建时，确认即可、无需对账；若是 BI UI 手搭、本地无源的发布页，按不可逆 DELETE 对待、走 B-7.0 完整对账。** 删 ETL + 输出集 → **先删输出数据集、再删 ETL**（与 B-7.1 一致；2026-06-17 实测：反过来先删 ETL 撞 `2002 输出数据集已存在`，ds-first 不报 6001）；`guanetl delete --cascade` 0.1.14 起已无此命令。
>
> **不能跳的硬约束**（2026-05-20/21 v7 demo 实战 · 90 天 / 1200 门店 / 80K 会员 / 20 表 / 17 ETL / 6 HTML 看板）：
> 1. **直接手撸 page+card API 全废**：draft cdId ≠ published cdId 不会自动映射回 published page，光走 `POST /api/page` 拼不出来；走 `guanvis publish` 才能跨过状态机。
> 2. **CSV 类型三态硬规则**：STRING 字段可以 `<> ''`，日期/数字字段不能（Spark 严格类型直接报错）；CSV 布尔字段实际是 `'TRUE'/'FALSE'` 字符串而非 int 1/0，`= '1'` 永远空表。

📖 **[references/v7-page-card-publish-pipeline.md](../references/v7-page-card-publish-pipeline.md)** — 完整 16 节：v7 草稿/发布机制详解 / HTML 应用看板 SDK 最小骨架（schema.js + card_01_html.js + page.js + charts/dashboard.{html,css,js} 4 文件） / CSV 三态判断硬规则 / Spark SQL 4 个硬限制（中文别名 / 嵌套窗口 / `<> NULL` / 字面量日期）/ ETL update OUTPUT_DATASET dsId 注入脚本（`guancli ds search` 自动查 dsId 注入）/ 数据集上传 / 建集走官方 `guands` / pandas to_csv vs to_excel 性能对比 + 向量化 30 倍速差 / JOIN 键全局统一命名（COL_MAP）/ 奶白 `#faf7f2` + 暖蓝 `#2563eb` 主题 / 端到端时间预算 / 反模式与硬约束总表 / 工程目录参考结构 / 与 Part C-12 的边界关系 / **§14 SmartETL 节点化两大静默坑（V2.1.8 新增）** / **§15 customChart 三大坑 + autoBootstrap + chip toolbar 兜底（V2.1.9 新增）** / **§16 移动端 phoneLayout ZIP inject + v7 草稿 save API 死路（V2.1.10 新增）**。

---
