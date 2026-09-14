# 官方 CLI 更新兼容说明

核验日期：2026-09-14。适用于 majia-guanyuan v3.1.11。本次依据 npm 官方发布包的 CHANGELOG、随包 Skill 和本机 `--help` 对齐；本地分析用合成数据验证。未重新运行线上 BI 业务链，也未用生产数据测试写入。

## 当前版本与来源

`@guandata/guanskill@0.1.35` 发布于 2026-09-11；npm latest、聚合包精确依赖与本机 `guanskill version` 一致。CLI 和 Skill 文件分别核验；安装完成后应逐文件比较随包 Skill 与已安装目录，不能仅看版本号。

| 组件 | 上次基线 | 当前版本 | 官方随包变更记录 |
|---|---|---|---|
| guanskill | 0.1.29 | 0.1.35 | [CHANGELOG](https://unpkg.com/@guandata/guanskill@0.1.35/CHANGELOG.md) |
| guancli | 1.0.53 | 1.0.58 | [CHANGELOG](https://unpkg.com/@guandata/guancli@1.0.58/CHANGELOG.md) |
| guanvis | 0.1.41 | 0.1.47 | [CHANGELOG](https://unpkg.com/@guandata/guanvis@0.1.47/CHANGELOG.md) |
| guanetl | 0.1.29 | 0.1.34 | [CHANGELOG](https://unpkg.com/@guandata/guanetl@0.1.34/CHANGELOG.md) |
| guanwf | 0.1.828 | 0.1.833 | [CHANGELOG](https://unpkg.com/@guandata/guanwf@0.1.833/CHANGELOG.md) |
| guands | 0.1.28 | 0.1.32 | [CHANGELOG](https://unpkg.com/@guandata/guands@0.1.32/CHANGELOG.md) |
| guanmetric | 0.1.10 | 0.1.15 | [CHANGELOG](https://unpkg.com/@guandata/guanmetric@0.1.15/CHANGELOG.md) |

## 指标取数：先保住数值和结果结构

单条 `metric query` 默认按指标配置格式化，数值可能成为带单位、百分号或千分位的字符串。后续要计算时显式用 `--value-format raw`，它保留数值；`--raw` 则直接返回后端原始协议，两者不能混用。`metric search/get/tree/query -f json` 已统一为 `schemaVersion: "1.0"` 的 envelope（带版本和结果位置的外层对象）：先确认命令成功，再按 `resultMode` 读取内联 `data` 或 `path` 指向的行数组。文件中的行数组不是另一个 envelope。不要把 stderr 混进 JSON。

多个查询在本轮已确定、相互独立、且都属于基础指标时，使用一次 `guancli metric batch-query --input queries.json`；输入为对象数组，每项必须有唯一 `id` 和真实 `metricId`，日期写入 `filters`。不要生成逐项 Shell 循环或自行并发。同比、累计、recent、占比和排名等高级计算仍用单条 `metric query`；下一轮依赖当前结果的查询须读完结果再生成。

批量默认 `valueFormat: "raw"`，与单条查询默认值不同。返回 `results` 与输入同序，用 `id` 对齐每项；成功项内的 `columns: [{name, role}]` 与二维 `rows` 按位置对应。发现真实列名和角色后精确选列，不硬编码展示名，不把单条 `data` 的解析方式套在批量结果上。

| 情况 | 应如何判定 |
|---|---|
| 批量查询退出 0 | 有效批次已输出，仍可能 `partial_failure`；逐项检查 `success/error/planned` |
| 批量查询 dry-run | 读取元数据后生成计划，未验证实际取数权限与数据完整性 |
| 分页 | `offset + limit` 最多 10000；非零 offset 必须排序，非唯一排序和数据变动可能导致跨页不稳定，不能宣称全量导出 |
| 筛选不支持 | 保留错误；不能删掉条件重跑，也不能拼接多次聚合结果冒充 OR 筛选 |
| 多页面卡片 | 先确认对应页面，应用 `--with-default-filters` 并报告实际生效条件；不支持时不能静默裸取数 |

本地 CSV/JSON 的规范化、按键对齐、基础运算和分组 TopN，优先用 `guancli analyze normalize/align/calculate/topn`。它只提供通用处理，不内置复购、同比或预算口径。输出为 `analysis/v1`；重复键、空值、除零和分母范围必须按业务要求明确处理。字段粒度不同先在上游聚合，不把多对多连接当成对齐。

详细输入和消费示例以官方 guancli Skill 的 `metric-batch-query.md`、`metric-json-migration.md`、`analysis-primitives.md` 为准。

## 写入与执行：逐项回读，不靠进程成功猜结果

| 组件 | 当前边界 |
|---|---|
| guanmetric | `batch online/offline` 先 dry-run；`--file` 输入为 `{"ids":[...]}`，依赖指标按基础到下游排序。`failed/blocked` 时完整输出但非零退出，已成功项不回滚；不要整批盲重试。口径冲突或下游影响须确认后才可 `--confirm`。请求接受不等于最终上线，审批状态须回读。 |
| guanetl | 0.1.34 移除全局 `task`，任务 ID 不再作为对外等待入口。首次执行用 `run <etl_id> --wait`；已触发但不知结果时只读 `guancli etl get <etl_id>`。再次 run 可能重跑并重复追加，不能用重跑代替查询。 |
| guands | 0.1.32 移除全局 `task`。创建/刷新时使用对应命令的 `--wait`，import 默认等待；已提交后先读数据集状态，不再调用旧 task 命令。append-data/replace-data 真正写入需 `--yes`，不加时只打印计划并非零退出。 |
| 新资源目录 | ETL 本体目录与输出数据集目录来自不同树；页面、数据集也须使用对应类型的真实目录。先核对环境、资源名、目录路径与 ID，已有授权覆盖具体落位时直接继续；缺少会改变结果的目标信息才确认。完成后回读路径、链接和资源状态。 |
| guanwf | 0.1.829 起增加 Python 运行环境、内存预检及输出绑定；NO_GO/UNKNOWN 按官方规则处理，不把未知判成安全。CREATE_NEW 首跑成功后须完成绑定并发布保存，才可继续运行。`run --validate` 只在已有草稿执行且不注册真实输出；它不是纯本地验证，不用于试跑生产工作流。写入的 `--confirm`、并发检查、保存回读及输出验收保留。 |

`guanetl rmdir` 只删除空 ETL 目录，是不可恢复的物理删除，需明确授权目标并传 `--yes`；它不是 ETL 删除命令。WebService 数据集写入仍由官方 CLI 拒绝，不能用内部 API 或其他数据集类型绕过。修改资源必须保持原 ID 与下游引用，不能删除后重建同名资源。

## 页面与 SuperApp：先走官方正常路径

`guanvis 0.1.47` 在覆盖发布后重置被替换页面的草稿。先核对覆盖对象和未发布编辑，保留覆盖前备份；发布后分别查看浏览态和编辑态，避免只看到新发布页却没检查编辑器。交叉表新增跨视图 `filterBy` 逐格校验；pack/publish 报错时按合法父格、表头及从 A1 起步的规则修正，不跳过校验。高级筛选器、卡片池和配置保真优先用官方 DSL。

已有页面编辑保留未修改配置；改字段用 update/patch，整组 set 会替换原字段区。需要独立副本时用官方 `page save-as`，不自行复制 JSON 改 ID。C-12 的 selector 脚本、v7 的 60004 和 phoneLayout 参考继续保留，但只在目标环境确实需要时使用；草稿重置并不能证明这些兼容问题全部消失。

表单结构创建、导出、原地编辑、改名、移动用 `guands form`；数据行 CRUD 用 `guancli form`。`form create -f json` 已返回 fmId 等稳定字段；关联 GUAN_FORM 数据集结构变化时使用 `dataset sync-schema plan/apply`，保留并回读数据集和映射字段 ID。普通 refresh 不会同步模型结构。Part E 的建表反向工程降为历史参考。

SuperApp 已支持 list/download。更新已知应用先定位 appId 并显式传入；`--update-if-exists` 是同名更新选项，不替代目标核验。`app publish --skip-build` 仅用于可信且已验证的 dist；`--overwrite-settings` 控制是否覆盖线上 `settings.json`，非交互未指定时保留线上配置。以当前 `--help` 的 settings.json 拼写为准，CHANGELOG 个别条目写作 setting.json。

## 本次验证范围

核对 npm 版本、精确依赖、七个入口的已安装 Skill 内容，以及相关命令帮助。用合成本地 CSV/JSON 验证 analyze 的对齐、除零、TopN 分母及失败时保留输出。发布前另检查 Skill 格式、版本一致性、敏感信息、包内容和架构图。

上述不代表新版在任意 BI 版本都已通过线上写入验收。历史生产案例保留原日期和适用环境；批量取数、审批、草稿重置、表单同步及工作流输出绑定的线上结果，须在具体业务任务中按目标环境验收。
