# 官方 CLI 更新兼容说明

核验日期：2026-09-20。适用于 majia-guanyuan v3.2.1。依据 npm 官方发布包的 CHANGELOG、随包 Skill 与本机命令帮助核对；没有在生产 BI 上重跑业务读写。

## 当前版本与来源

`@guandata/guanskill@0.1.39` 发布于 2026-09-19；本机与聚合包精确依赖一致。六组件 latest 另行检查，不能把聚合包版本当成全部上游发布状态。机器可读记录见 [official-cli-baseline.json](official-cli-baseline.json)。

| 组件 | 上次基线 | 当前版本 | 官方随包变更记录 |
|---|---|---|---|
| guanskill | 0.1.35 | 0.1.39 | [CHANGELOG](https://unpkg.com/@guandata/guanskill@0.1.39/CHANGELOG.md) |
| guancli | 1.0.58 | 1.0.62 | [CHANGELOG](https://unpkg.com/@guandata/guancli@1.0.62/CHANGELOG.md) |
| guanvis | 0.1.47 | 0.1.49 | [CHANGELOG](https://unpkg.com/@guandata/guanvis@0.1.49/CHANGELOG.md) |
| guanetl | 0.1.34 | 0.1.37 | [CHANGELOG](https://unpkg.com/@guandata/guanetl@0.1.37/CHANGELOG.md) |
| guanwf | 0.1.833 | 0.1.836 | [CHANGELOG](https://unpkg.com/@guandata/guanwf@0.1.836/CHANGELOG.md) |
| guands | 0.1.32 | 0.1.35 | [CHANGELOG](https://unpkg.com/@guandata/guands@0.1.35/CHANGELOG.md) |
| guanmetric | 0.1.15 | 0.1.18 | [CHANGELOG](https://unpkg.com/@guandata/guanmetric@0.1.18/CHANGELOG.md) |

## 1.0.59–1.0.62 需要调整的行为

批量查询用于自动处理时加 `--fail-on-error`：任一项失败会非零退出，但仍保留完整 JSON；默认行为仍可能部分失败却退出 0，必须逐项读 `results[].status`。需要计算又需要展示时指定 `valueFormat: "both"`，一次返回原始 `rows` 和 `formattedRows`，计算只使用原始值。

筛选支持 `=`、`!=`、`<>`、`<`、`<=`、`>`、`>=`，条件组键名是 `conditions`，不是 `children`。指标维度、筛选、排序现在校验真实字段；`METRIC_UNSUPPORTED_DIMENSION` / `FILTER_UNKNOWN_FIELD` 应回查指标详情后纠正字段，不删除原条件重跑。公共维度名只有唯一映射时可直接用，有歧义不能猜。

`ds execute-sql -o result.csv` 可直接保存结果，不必为换输出格式再查一次；该功能不保证旧 BI 环境的 SQL 接口可用。`ds get <ds_id> --validate-downstream` 核对血缘里的残留资源：只有业务状态 1002 或 HTTP 404 才判不存在；认证、网络和解析失败必须保留。单次最多 100 个下游、总超时 30 秒，不能把未检查部分说成无依赖，也不能据此自动删除资源。

`app publish --overwrite-settings` 仅 BI >= 8.3.2 生效。低版本或版本查询失败、无法解析时保留线上 `settings.json`；显式传参不代表一定覆盖成功。

内部 OAuth2 应用认证须由宿主注入服务地址、访问凭据及用户身份。CLI 不保存、交换或刷新该凭据；OAuth2 与 OIDC 环境同时存在会报错，不回退本地 profile。不要把宿主环境凭据写进 Skill 或发布包。PAT 登录现保存 Domain，多 profile 可按 Domain 筛选。

`guanwf schedule set --failure-strategy` 已废弃，仅兼容 CONTINUE；END 在本地失败且不写入，失败后的走向由 FAILURE / ALL 连线决定。Python 版本优先从 `/api/python-images/list` 的 `pythonVersion` 读取；旧接口降级读 `/api/system-images/list?type=PYTHON` 的 `runtimeEnv`；字段缺失或不能识别才回退兼容契约 Python 3.8，不从镜像名称或说明猜版本。

1.0.62 及对应五个原生组件改为按系统和架构下载平台包，命令用法不变。缺平台包或版本不匹配时按启动器提示修复安装，不改业务命令绕过。guanvis 本轮无新增建卡行为，主要同步共享认证与内部依赖。

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

本轮核对 npm 版本、精确依赖、七个官方 Skill 的逐文件一致性，以及批量查询、下游检查和调度的命令帮助。发布前检查 Skill 格式、版本一致性、敏感信息和架构图；先前本地 analyze 合成数据验证保留为历史记录，不冒充本轮重跑。

上述不代表新版在任意 BI 版本都已通过线上写入验收。历史生产案例保留原日期和适用环境；批量取数、审批、草稿重置、表单同步及工作流输出绑定的线上结果，须在具体业务任务中按目标环境验收。
