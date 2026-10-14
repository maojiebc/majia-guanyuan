# 官方 CLI 更新兼容说明

核验日期：2026-10-13（本机客户端日期；官方部分包标注2026-10-14）。适用于 majia-guanyuan v3.5.0。依据 npm 官方发布包的 CHANGELOG、随包 Skill 与本机命令帮助核对；没有在生产 BI 上重跑业务读写。

## 当前版本与来源

`@guandata/guanskill@0.1.46` 官方包标注2026-10-14；本机、聚合包精确依赖和六组件 npm latest 一致。机器可读审阅记录见 [official-cli-baseline.json](official-cli-baseline.json)。CLI 与已安装 Skill 分开验证。

| 组件 | 上次已审阅基线 | 当前版本 | 官方随包变更记录 |
|---|---|---|---|
| guanskill | 0.1.44 | 0.1.46 | [CHANGELOG](https://unpkg.com/@guandata/guanskill@0.1.46/CHANGELOG.md) |
| guancli | 1.0.65 | 1.0.66 | [CHANGELOG](https://unpkg.com/@guandata/guancli@1.0.66/CHANGELOG.md) |
| guanvis | 0.1.53 | 0.1.55 | [CHANGELOG](https://unpkg.com/@guandata/guanvis@0.1.55/CHANGELOG.md) |
| guanetl | 0.1.40 | 0.1.41 | [CHANGELOG](https://unpkg.com/@guandata/guanetl@0.1.41/CHANGELOG.md) |
| guanwf | 0.1.838 | 0.1.839 | [CHANGELOG](https://unpkg.com/@guandata/guanwf@0.1.839/CHANGELOG.md) |
| guands | 0.1.37 | 0.1.37 | [CHANGELOG](https://unpkg.com/@guandata/guands@0.1.37/CHANGELOG.md) |
| guanmetric | 0.1.21 | 0.1.21 | [CHANGELOG](https://unpkg.com/@guandata/guanmetric@0.1.21/CHANGELOG.md) |

## 本轮官方更新：本地排名、编辑保护与预览范围

实际入口是 `guancli analyze report`，不是顶层 report；它只读取本地 CSV/JSON，不连接 BI、不隐式聚合。先确认完整候选池与业务粒度，再选择 --group-by 或 --global、声明 --complete-input。这个开关只是调用方声明，不证明后端分页完成。补充指标用显式键做 left 对齐，补充侧必须唯一，未匹配保持 null，不让补充对象扩大候选池；不能从某指标的 TopN 子集推导另一指标全池排名。批量 envelope 选择成功的 --result-id，计算只取原始值。详情以官方 analysis-primitives.md 和当前帮助为准。本地分块验收提供范围与文件证据，不自动授予排名候选池或业务口径正确性。

参数候选值改名使用官方 mapParameterValues，与编辑前快照一起核对当前工程公式、独立选项和默认值，先 preview/diff 与 parameter update --dry-run。映射只覆盖注册资源，不能据此称其他页面或数据集已同步。全局参数更新与页面发布是两个独立写入，分别回读；失败保留分步状态，不宣称原子完成，不通过 pack/upload 绕过引用校验。未变历史引用可以按官方规则保留并警告；新增或修改引用无法核验则停止发布。真实写入未在本轮执行。

多键 JOIN 保留并核对全部关联键，不能把两个输入字段各自列表当作只有首键有效的条件。guanetl 0.1.41 已修复原生复合条件兼容；升级不证明业务键类型、基数、匹配率或输出口径已正确，仍用限定范围 preview 对照。数据库输入的 preview 位于 action 顶层，编辑已有节点优先保留有效范围。普通 DATAFLOW 的默认 LIMITED/10000 与 DB_DATAFLOW 的 ALL/config.limit=10000 有不同含义：ALL 不受该 limit 限流，不能把这个数字当安全样本预算。旧节点原有范围不靠重建改成默认值。

本项目的受限读取包装显式使用 profile，并剥离外部 OAuth2 与 OIDC 目标覆盖变量；否则已选择的测试环境仍可能被宿主注入身份重定向。标准官方 CLI 的宿主认证仍遵守官方合同，此保护只作用于本项目的私有 profile 取数路径。

## 2026-10-12 官方更新：类型化 SQL 与数据保全

SQL 直查可用且需要程序计算时使用 `guancli ds execute-sql -f json --typed`：NULL 为 null，数值列按后端 fdType 输出 JSON 数字；不加 typed 的旧 JSON 仍是字符串、NULL 为空串。消费长整数和小数时不要先转有限精度浮点。此参数不改变 SQL 接口所需版本/高级 SQL 开关，也不保证大表全量；旧 fallback 的 limit 可只是本地渲染截断。临时 ETL 汇总仍是 terminal-text，不套用 typed 的类型保证。

请求转发/API Gateway 的配置、创建、查找和调用使用官方 `guancli gateway`。先读官方 gateway.md，检查路由状态、方法、权限、必填参数与目标合同；应用代码只访问 BI 网关，不写目标地址或真实凭据。先形成可审阅配置，再 dry-run；实际调用可能让外部接口写入，不能因为路径经过 BI 就当只读。认证跨源重定向会被拒绝，不能换站点携带原凭据重试。指标目录可用 `metric tree --dir-id <主题ID>` 收窄到已有主题。

表单子行更新会全量回写旧行，旧行读取必须包含有效 data、count 和行标识。分页不完整、总数变化或身份缺失就停止；短页不是读取完成证据，读全也不等于并发安全。不改权限或直接拼 API 绕过保护。

ETL 保存接口即使 HTTP 200，success=false 仍是失败；列出输入校验项并处理，不据 HTTP 状态宣布保存成功。保存前无法获取服务端当前版本时停止，不能用过期本地基线覆盖；首次保存的本地回退仅限官方定义的明确不存在且身份一致场景。初始化工作区会清旧导出结果，已有成果先备份，临时预览仍每轮用新目录。

日期筛选器没有来源数据集绑定时，guanvis 0.1.53 可保留原日期映射与时间宏。来源身份不完整的旧配置仅能原样保留，改映射或联动前先取得可靠来源；无法确认时停止，不补猜测的 dsId/fdId。删除图表字段时，仍用于其他绘图区的字段须保留排序、筛选与提示引用。

guands 0.1.36 的 dataset import/get JSON 不再混入轮询诊断，诊断在 stderr；无权限的受限详情明确失败，不能消费不完整对象。计算字段更新/批量应用拒绝把物理列改成计算字段，未声明 fdType 的文件不凭空补类型；需要模型变更另行审阅，不删物理列重建绕过保护。

六组件统一加强共享配置并发写保护与 npm 12 发布兼容；这些不替代 BI 资源读回、业务口径验收或跨应用任务协调。本轮只核官方包、Skill 和命令帮助，没有生产 BI 请求或写入。


## 2026-09-24 官方更新：查询计划与指标创建恢复

### 单条指标查询先核对计划

执行 `guancli metric query` 前，以同一组查询参数加 `--explain-requests -f json`，检查 `data.requestPlan.requests[]` 的 method/path/body。它读取指标和卡片元数据，但不创建编辑会话、不发 POST、不取业务数据；只有计划有效、可执行且符合业务意图时才移除 explain 执行。`--dry-run` 只做快速校验，不生成完整请求体；两者互斥，explain 也不能与 `--raw` 混用。

同一查询只选一个高级计算主模式；附属参数必须有对应主模式，升降序不能同时指定，排序列须是当前计算实际生成的列名。`batch-query` 沿用独立批量输入，不支持 explain；不能给每项套单条参数。错误计划不能通过删除业务条件来“修复”，多分支 OR 计划也不代表能实际执行。参数模式以官方 guancli Skill 的 `metric-query-recipes.md` 为准。

### 指标创建和编辑使用官方专用入口

`guanmetric 0.1.19` 的 Flow 是按依赖顺序创建、记录进度并验收指标的官方流程。标准 Excel 的真实指标行都达到“可创建”，并核对过口径与落位后，用 `flow generate` 生成计划，不手写替代模板的 Flow JSON；它读取元数据并运行 plan 校验，但不创建指标。核对生成计划保留取数字段、维度、业务属性、负责人、格式、引用与上线方式，才执行 `flow apply --state ... --confirm`。计划成功不等于后端业务校验或实际创建成功。

保留原计划和状态文件。每个创建成功的 ID 立即落入状态；上游审批中或验证失败时不继续提交下游。`usable` 要求 PUBLISHED、canUse=true 且一次限一行查询成功（0 行也合法）；`draft` 只验证草稿定义，不执行取数。审批后先 `flow verify`，再用同一计划与状态继续剩余项。

超时、断线或任何没有取得创建 ID 的响应，都不能证明服务端没有创建。`FLOW_CREATE_RESULT_UNKNOWN` / `blocked/reconcile` 必须先只读核对候选，再 `flow reconcile` 预览；定义与提交快照一致且授权明确后加 `--confirm`，只绑定本地状态，不写 BI。不能凭同名认领、手改 state、删除重建或盲重跑 apply。详情参见官方 guanmetric Skill 的 `metric-flow.md`。

编辑原子、复合、衍生指标分别走 `edit`、`composite edit`、`derived edit`，先 dry-run 核对完整更新请求；专用命令按允许写入的字段构造请求并保留取数字段，不能把详情读取结果整体交给 fetch 回写。主题、目录、指标树等资源管理也先走官方入口，保留 ID、权限和下游关系。官方示例环境的测试不能当成本租户或 PAT 认证已验收。

### ETL 类型和页面文件保护

`guanetl 0.1.38` 导出与校验输入节点时以数据集详情的实际类型为准，修正旧版误判；不要仅凭旧导出的节点类型强行改回。仍先 preview 与 save dry-run，并核对输出绑定和下游影响；本轮未做线上 ETL 验收。

`guanvis 0.1.50 init` 发现已有 `schema.js` 且未传 `--force` 时保留文件，跳过认证和 API 请求。重新初始化前检查已有成果；只有确需覆盖且已有授权/备份时使用 force。init 的成功退出不证明 schema 已刷新，须确认实际是否跳过。

## 1.0.59–1.0.62 需要调整的行为

批量查询用于自动处理时加 `--fail-on-error`：任一项失败会非零退出，但仍保留完整 JSON；默认行为仍可能部分失败却退出 0，必须逐项读 `results[].status`。需要计算又需要展示时指定 `valueFormat: "both"`，一次返回原始 `rows` 和 `formattedRows`，计算只使用原始值。

筛选支持 `=`、`!=`、`<>`、`<`、`<=`、`>`、`>=`，条件组键名是 `conditions`，不是 `children`。指标维度、筛选、排序现在校验真实字段；`METRIC_UNSUPPORTED_DIMENSION` / `FILTER_UNKNOWN_FIELD` 应回查指标详情后纠正字段，不删除原条件重跑。公共维度名只有唯一映射时可直接用，有歧义不能猜。

`ds execute-sql -o result.csv` 可直接保存结果，不必为换输出格式再查一次；该功能不保证旧 BI 环境的 SQL 接口可用。`ds get <ds_id> --validate-downstream` 核对血缘里的残留资源：只有业务状态 1002 或 HTTP 404 才判不存在；认证、网络和解析失败必须保留。单次最多 100 个下游、总超时 30 秒，不能把未检查部分说成无依赖，也不能据此自动删除资源。

`app publish --overwrite-settings` 仅 BI >= 8.3.2 生效。低版本或版本查询失败、无法解析时保留线上 `settings.json`；显式传参不代表一定覆盖成功。

内部 OAuth2 应用认证须由宿主注入服务地址、访问凭据及用户身份。CLI 不保存、交换或刷新该凭据；OAuth2 与 OIDC 环境同时存在会报错，不回退本地 profile。不要把宿主环境凭据写进 Skill 或发布包。PAT 登录现保存 Domain，多 profile 可按 Domain 筛选。

`guanwf schedule set --failure-strategy` 已废弃，仅兼容 CONTINUE；END 在本地失败且不写入，失败后的走向由 FAILURE / ALL 连线决定。Python 版本优先从 `/api/python-images/list` 的 `pythonVersion` 读取；旧接口降级读 `/api/system-images/list?type=PYTHON` 的 `runtimeEnv`；字段缺失或不能识别才回退兼容契约 Python 3.8，不从镜像名称或说明猜版本。

1.0.62 及对应五个原生组件改为按系统和架构下载平台包，命令用法不变。缺平台包或版本不匹配时按启动器提示修复安装，不改业务命令绕过。当时的 guanvis 更新主要同步共享认证与内部依赖。

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
| guanmetric | 0.1.21 | 0.1.21 | [CHANGELOG](https://unpkg.com/@guandata/guanmetric@0.1.21/CHANGELOG.md) |
| guanetl | 0.1.40 | 0.1.41 | [CHANGELOG](https://unpkg.com/@guandata/guanetl@0.1.41/CHANGELOG.md) |
| guands | 0.1.37 | 0.1.37 | [CHANGELOG](https://unpkg.com/@guandata/guands@0.1.37/CHANGELOG.md) |
| 新资源目录 | ETL 本体目录与输出数据集目录来自不同树；页面、数据集也须使用对应类型的真实目录。先核对环境、资源名、目录路径与 ID，已有授权覆盖具体落位时直接继续；缺少会改变结果的目标信息才确认。完成后回读路径、链接和资源状态。 |
| guanwf | 0.1.838 | 0.1.839 | [CHANGELOG](https://unpkg.com/@guandata/guanwf@0.1.839/CHANGELOG.md) |

`guanetl rmdir` 只删除空 ETL 目录，是不可恢复的物理删除，需明确授权目标并传 `--yes`；它不是 ETL 删除命令。WebService 数据集写入仍由官方 CLI 拒绝，不能用内部 API 或其他数据集类型绕过。修改资源必须保持原 ID 与下游引用，不能删除后重建同名资源。

## 页面与 SuperApp：先走官方正常路径

`guanvis 0.1.47` 在覆盖发布后重置被替换页面的草稿。先核对覆盖对象和未发布编辑，保留覆盖前备份；发布后分别查看浏览态和编辑态，避免只看到新发布页却没检查编辑器。交叉表新增跨视图 `filterBy` 逐格校验；pack/publish 报错时按合法父格、表头及从 A1 起步的规则修正，不跳过校验。高级筛选器、卡片池和配置保真优先用官方 DSL。

已有页面编辑保留未修改配置；改字段用 update/patch，整组 set 会替换原字段区。需要独立副本时用官方 `page save-as`，不自行复制 JSON 改 ID。C-12 的 selector 脚本、v7 的 60004 和 phoneLayout 参考继续保留，但只在目标环境确实需要时使用；草稿重置并不能证明这些兼容问题全部消失。

表单结构创建、导出、原地编辑、改名、移动用 `guands form`；数据行 CRUD 用 `guancli form`。`form create -f json` 已返回 fmId 等稳定字段；关联 GUAN_FORM 数据集结构变化时使用 `dataset sync-schema plan/apply`，保留并回读数据集和映射字段 ID。普通 refresh 不会同步模型结构。Part E 的建表反向工程降为历史参考。

SuperApp 已支持 list/download。更新已知应用先定位 appId 并显式传入；`--update-if-exists` 是同名更新选项，不替代目标核验。`app publish --skip-build` 仅用于可信且已验证的 dist；`--overwrite-settings` 控制是否覆盖线上 `settings.json`，非交互未指定时保留线上配置。以当前 `--help` 的 settings.json 拼写为准，CHANGELOG 个别条目写作 setting.json。

## 本次验证范围

核对当前聚合包精确依赖与六组件，安装官方聚合包后显式 install-skill，七个官方 Skill 的153个随包文件与本机逐文件一致。实际读取 analyze report 和数据集预览帮助，并在已授权的独立测试环境完成两次小范围预览与本地验收；生产 BI 未请求，ETL/页面/参数未实写。安装器提示 PromptScript 不支持全局安装，不把其汇总结果当作所有助手已安装。

附属项目从4.8.2到4.8.5新增三个提交。审阅固定提交的 CHANGELOG 与相关变更，工作台数组渲染和首次开场白与当前工具无关，不移植；4.8.4 的数字出处须附期间、筛选与口径纪律已吸收，原实现来源及MIT保持。作者反馈 PR #3 尚待审阅，不重复提交。机器基线仅在审阅完成后推进，安装与离线测试均不代表任意生产租户已经验收。
