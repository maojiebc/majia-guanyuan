# 官方 CLI 更新兼容说明

核验日期：2026-11-11（客户端日期）。适用于 majia-guanyuan v3.5.2。本轮是官方文档/帮助审阅与本地实际运算验证，不是生产BI业务验收。

## 当前版本与安装组合

| 组件 | 上次审阅 | 当前审阅及本机聚合固定版本 |
|---|---|---|
| guanskill | 0.1.52 | 0.1.55 |
| guancli | 1.0.70（另核聚合1.0.69） | 1.0.72 |
| guanvis | 0.1.60 | 0.1.62 |
| guanetl | 0.1.45 | 0.1.45 |
| guanwf | 0.1.842 | 0.1.842 |
| guands | 0.1.40 | 0.1.41 |
| guanmetric | 0.1.23 | 0.1.23 |

聚合0.1.55的六组件精确依赖与latest一致，机器基线见[official-cli-baseline.json](official-cli-baseline.json)。官方随包记录：[聚合](https://unpkg.com/@guandata/guanskill@0.1.55/CHANGELOG.md)、[CLI](https://unpkg.com/@guandata/guancli@1.0.72/CHANGELOG.md)、[可视化](https://unpkg.com/@guandata/guanvis@0.1.62/CHANGELOG.md)、[数据集](https://unpkg.com/@guandata/guands@0.1.41/CHANGELOG.md)。安装组合、审阅范围及真实业务验收分别记录。

## 2026-11-11 更新：精确计算、字段选择与指标快照

### 连续计算直接使用官方pipeline

多个本地步骤使用 `guancli analyze pipeline plan.json --validate` 后再执行 `--output-dir <新的私有结果目录>`，不要另写通用计算器。输入路径相对计划文件，宿主先快照允许访问的文件；原生指标file回执所指的实际数据也必须安全快照并改写路径，不能只保护外层回执。输入只消费raw/both的成功项，批量按唯一resultId选项，不合并失败项或猜嵌套路径。

completeInput:true只是声明；仍要独立确认期间、筛选、候选池、粒度和分页。`--validate`只验结构，不读数据；rowCount不符、offset非零或达到limit的表会拒绝计算。最多50个输入、合计32MiB，每个输入10000行，最多50步/10个输出，预览最多30行不等于完整结果行数。关联必须显式选键及NULL策略，不能让多对多匹配增行或用有值交集替代资格范围；concat保留重复实体，未匹配与除零保持null，不能补成0。

pipeline输出独立的 `analysis-pipeline/v1`，计算值使用numerator/denominator字符串分数；原始标量保留类型。继续计算读取精确JSON，不反读舍入CSV/Markdown；percent消费未乘100的比例，unit只是标签，不替换原始单位或做换算。旧单步analyze和report仍是analysis/v1，不能因底层复用就称其全部改成精确分数。标准输入错误看结构化code，不匹配文案；I/O/超时/交付故障不能冒充参数错误。结果目录必须不存在，失败不交付成功回执；plan.json对外需映射授权路径，不公开私有目录。

[合成离线示例](../examples/local-analysis-plan/README.md)实际得到Amount=3/10、Ratio=1/3及33.33%展示；触及上限的输入和覆盖已有结果目录均被拒绝。没有连接BI，不证明任意真实数据集完整或口径正确。

### 自助取数选择参与查询的真实字段

CUSTOM_REPORT主表格的字段窗格控制zoneFilter，--columns只是返回后裁剪，不能用隐藏列模拟改分组。先读全部可选字段，再把用户表达映射成真实key；不同日期、含税口径或同名候选有歧义时核实，不按相似名称猜。显式选择用 --report-fields key:<key>，默认为replace；它保持字段原区域、顺序、公式和聚合，可能改变查询粒度但不修改页面。字段窗格也不替代 --with-default-filters 的行筛选。

追问“在刚才结果里再加字段”时合并上一轮真实集合并使用replace，同时保留有效行筛选；add是加入页面当前选择，不代表上一轮显式选择。动态维度与zoneFilter不能同时保证生效时停止，不能默默删参数。JSON多级列名含层级路径及转义/重名后缀，后续按实际输出列精确选取；需计算使用 --value-format raw，不把格式化小数和显示单位当原值。本项目本地采样封装不新增report-fields接口，要求显式选择时直接路由当前官方CLI。

### 指标快照不能当作实时权限和取数验收

新工程仍用metric-init；--merge仅刷新指定旧ID并追加新ID，--refresh回读全部旧指标，--force全量替换不是追加。三个选项互斥，已知环境冲突仍拒绝。旧快照环境不全时先明确归属，不能用别名猜Domain；跨8.4协议边界先整体刷新，不能混合新旧条目。Flow/DSL交接必须是flow export的独立文件，核usable、唯一ID和环境，再逐项回读服务端正式状态，不直接用IR/state或历史来源指纹代替。

`guanvis check-metric-snapshot`只读回读同ID定义并重编译工程；unchanged只表示已跟踪投影/查询字段未变，不代表权限、审批、完整血缘或运行态取数通过。changed/incompatible/unverified须分别复核，不自动刷新基线。多公共维度候选时必须在卡片源脚本显式选择publicDimensionId，不选首项、不猜fdId等价；同名指标/维度用实际ID消歧。新选择不修改指标本体，也不凭快照检查通过跳过取数验收。

### 编辑保留与MongoDB路由

Tab内筛选器组在checkout/edit/publish中应保留组结构。guanvis新增page save-as，但服务端PAT权限隔离验收尚未完成，不能仅因命令存在就宣称PAT可交付；目标环境和业务写入仍另行核对。MongoDB使用官方dataset mongodb columns/preview/create/update，不走JDBC建集或普通account探查。先限定集合、字段、样本、筛选和日期转换，再按官方原地编辑保留dsId/fdId，不能删后重建。这些写入本轮未执行。

## 本轮验证与来源交接

使用已授权机械检测器的同轮回执时，先验证成功终态、无模型执行、7包和附属提交、来源main/固定检查器/基线哈希及结果指纹。已消费、已审阅与已发布分别留证；过期按合同做一次有界恢复，不能把脚本review_required当兼容通过。本轮固定检查器代码未变。

本机聚合0.1.55已装，显式install-skill后逐文件核对七个官方Skill的190个文件；PromptScript不支持全局安装的提示保留，不声称所有工具均成功。实际运行官方pipeline合成正例、计划校验、上限拒绝和已有结果保护，并核对相关帮助。附属4.12.1及完整提交未变，没有重复反馈或移植其功能。生产BI请求、保存/运行/调度/权限写入均为0；历史实测和上游自报测试不计为本轮业务验收。

## 2026-11-02 需要调整的行为

**卡片复制与页面编辑。** 已有目标页中复制单卡走 `guancli card copy <cd_id> --page-id <target_page_id> --dry-run`。离线计划不证明权限；真实复制是一次写入，结果未知先查副本，不重发。返回新卡ID不代表布局或发布完成；默认不创建页面/草稿。此前附属项目“没有单卡另存”的版本说明不适用于当前 CLI。整页独立副本仍用 page save-as；不能把旧 attachCard 工程或卡ID搬到新页冒充副本。guanvis 支持文本正文/宏原地编辑，并保护旧复杂报表的只读引用、隐藏卡的 LOD 依赖及高级计算；局部修改不能改成整页重建。洞察配置编辑路由官方 guancli/guanvis，实际目标、写入与发布分别核对。

**指标查询与DSL。** 常规基础指标遵循当前官方只读查询入口；保留同参数 explain 计划核对，但不手工复用旧 session/modify 请求来“查数”。泛化查询最低 BI8.2.0；BI8.4 的指标和公共维度合同以当前 Skill 为准，不把旧JSON字段猜成新字段。指标权限查询仅用于读权限，不授权或撤销权限。guanmetric DSL 先检出/预览/plan，再按现有范围 apply；helper和声明不是不可信代码沙箱，不运行陌生来源工程；preview/plan不是写入成功。恢复沿原state/reconcile，缺失ID或未知响应不得重建。完整新DSL不在本轮移植。

**ETL保存与取消。** Agent编辑/创建用 --require-plan，导出、校验及目标预览后生成新的保存计划；核对 intent=create/new-copy/overwrite 与真实授权，携带同一计划保存。计划失效则重新读取并核对；禁止改保护状态或借保存计划扩大调度/输出/写入范围。v2计划只按稳定节点处理服务端明确 created:false 的临时输出ID，不放松已物化绑定保护。新单根 cascade-run 与旧 run --run-upstream 语义不同，不能混用后补发下游；根成功不证明整链成功，输出元信息检查也不证明数据同代。只读调度资源分析会增加服务负载，应定向限定范围。

预览的明确额度拒绝可由官方有界排队；提交结果未知、轮询失败和超时不得由外层再发同一次请求。原生预览取消必须看明确终态；强制退出、WASI旧宿主或本地超时都不证明远端停止。本项目保持单并发、120秒预算及未知请求留锁纪律，不因新版取消能力自动解锁。单根执行和保存/调度都是独立业务操作，本次未执行。

**数据集。** 文件导出优先 `guands dataset export`，先明确环境、数据集、范围、格式与输出；dry-run不证明全量或权限，服务端行列权限与文件内容、数量仍需验收。不能把受限导出或样本补成全量；受限环境下的计数分块作为有明确理由的后备。WebService、分组字段、飞书建集和行列权限已有官方入口；只读查看配置不等于获准修改权限。高性能模式转换保留dsId但会影响现有计算，需对应业务授权；超时先读转换状态，不能重发、换字段重建或假称回滚。模型同步按物理字段身份核计划，不能只凭别名配对。表单写入成功、关联数据集刷新与结构同步是三个阶段；不因刷新失败重写已成功的表单行。

**代理与认证。** CLI1.0.70 支持API代理地址与BI资源链接分别处理；此次只核版本、帮助及随包资料，未验证真实代理或跨站凭据。不能将资源URL可打开当成API目标已核对；本项目显式profile的认证覆盖隔离仍保留。

## 附属项目审阅与吸收范围

审阅 JeremyWXL/guanbi-agent-builder 从4.8.5至4.12.1的固定提交变化，最新提交 de79210e841931d5efd14854183f75a0c5b9b4ae。原4.8.1实现参考与MIT保留。本轮吸收参数上下文、未知公式不推定可自由聚合、数据集API与卡片读取权限分别判定、产物需实际校验的纪律；未移植向导、诊断评分、分析写作或卡片重建器，不继承其545项测试或真实租户结论。

数据集层动态参数原来被本地快照排除；现保留 dsInfo.dynamicParameters 及 dsInfo.config.dynamicParameters，参数默认值变化会使定义指纹改变。旧参数化快照需重新采集。图表层声明原已保留；缺少声明或期望取值时不猜参数。当前本地采样器不新增动态传参接口，只能说明已核定的默认范围；含 DYNAMIC_PARAMS 的公式不得直接内联SQL，不以默认参数空结果推断全期无数据。UNKNOWN公式保持unknown，单位换算先核原始单位。PR#3仍开放，本轮没有重复评论或提交。

## 本轮验证与限制

本机原已安装聚合0.1.52，显式 install-skill 后七个官方Skill的183个随包文件与 .agents 逐文件哈希一致；安装器提示PromptScript不支持全局安装，未称所有工具都已安装。核对9项帮助/离线计划，包括虚构ID的card copy dry-run，未复制真实卡片。CLI1.0.70隔离安装仅核帮助。检查器的滞后组合、已审阅滞后、新固定依赖、非精确版本拒绝及数据集参数快照合成回归通过。没有BI业务取数、保存、运行、调度、模式或权限变更；上线与业务验收分别记录。

## 2026-10-13 更新：本地排名、编辑保护与预览范围

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
| guanmetric | `batch online/offline` 先 dry-run；`--file` 输入为 `{"ids":[...]}`，依赖指标按基础到下游排序。`failed/blocked` 时完整输出但非零退出，已成功项不回滚；不要整批盲重试。口径冲突或下游影响须确认后才可 `--confirm`。请求接受不等于最终上线，审批状态须回读。 |
| guanetl | 0.1.34 移除全局 `task`，任务 ID 不再作为对外等待入口。首次执行用 `run <etl_id> --wait`；已触发但不知结果时只读 `guancli etl get <etl_id>`。再次 run 可能重跑并重复追加，不能用重跑代替查询。 |
| guands | 0.1.32 移除全局 `task`。创建/刷新时使用对应命令的 `--wait`，import 默认等待；已提交后先读数据集状态，不再调用旧 task 命令。append-data/replace-data 真正写入需 `--yes`，不加时只打印计划并非零退出。 |
| 新资源目录 | ETL 本体目录与输出数据集目录来自不同树；页面、数据集也须使用对应类型的真实目录。先核对环境、资源名、目录路径与 ID，已有授权覆盖具体落位时直接继续；缺少会改变结果的目标信息才确认。完成后回读路径、链接和资源状态。 |
| guanwf | 0.1.829 起增加 Python 运行环境、内存预检及输出绑定；NO_GO/UNKNOWN 按官方规则处理，不把未知判成安全。CREATE_NEW 首跑成功后须完成绑定并发布保存，才可继续运行。`run --validate` 只在已有草稿执行且不注册真实输出；它不是纯本地验证，不用于试跑生产工作流。写入的 `--confirm`、并发检查、保存回读及输出验收保留。 |

`guanetl rmdir` 只删除空 ETL 目录，是不可恢复的物理删除，需明确授权目标并传 `--yes`；它不是 ETL 删除命令。WebService 的创建、编辑、调度及模型同步现有官方入口；追加、替换或其他写入是否受支持须按当前 Skill/命令核实，不能用内部 API 或伪装类型绕过拒绝。修改资源必须保持原 ID 与下游引用，不能删除后重建同名资源。

## 页面与 SuperApp：先走官方正常路径

`guanvis 0.1.47` 在覆盖发布后重置被替换页面的草稿。先核对覆盖对象和未发布编辑，保留覆盖前备份；发布后分别查看浏览态和编辑态，避免只看到新发布页却没检查编辑器。交叉表新增跨视图 `filterBy` 逐格校验；pack/publish 报错时按合法父格、表头及从 A1 起步的规则修正，不跳过校验。高级筛选器、卡片池和配置保真优先用官方 DSL。

已有页面编辑保留未修改配置；改字段用 update/patch，整组 set 会替换原字段区。需要独立副本时用官方 `page save-as`，不自行复制 JSON 改 ID。C-12 的 selector 脚本、v7 的 60004 和 phoneLayout 参考继续保留，但只在目标环境确实需要时使用；草稿重置并不能证明这些兼容问题全部消失。

表单结构创建、导出、原地编辑、改名、移动用 `guands form`；数据行 CRUD 用 `guancli form`。`form create -f json` 已返回 fmId 等稳定字段；关联 GUAN_FORM 数据集结构变化时使用 `dataset sync-schema plan/apply`，保留并回读数据集和映射字段 ID。普通 refresh 不会同步模型结构。Part E 的建表反向工程降为历史参考。

SuperApp 已支持 list/download。更新已知应用先定位 appId 并显式传入；`--update-if-exists` 是同名更新选项，不替代目标核验。`app publish --skip-build` 仅用于可信且已验证的 dist；`--overwrite-settings` 控制是否覆盖线上 `settings.json`，非交互未指定时保留线上配置。以当前 `--help` 的 settings.json 拼写为准，CHANGELOG 个别条目写作 setting.json。

## 2026-10-13 验证范围

核对当前聚合包精确依赖与六组件，安装官方聚合包后显式 install-skill，七个官方 Skill 的153个随包文件与本机逐文件一致。实际读取 analyze report 和数据集预览帮助，并在已授权的独立测试环境完成两次小范围预览与本地验收；生产 BI 未请求，ETL/页面/参数未实写。安装器提示 PromptScript 不支持全局安装，不把其汇总结果当作所有助手已安装。

附属项目从4.8.2到4.8.5新增三个提交。审阅固定提交的 CHANGELOG 与相关变更，工作台数组渲染和首次开场白与当前工具无关，不移植；4.8.4 的数字出处须附期间、筛选与口径纪律已吸收，原实现来源及MIT保持。作者反馈 PR #3 尚待审阅，不重复提交。机器基线仅在审阅完成后推进，安装与离线测试均不代表任意生产租户已经验收。
