# 看板口径档案与只读验收

用于把已有看板变成能复查、能发现变化的取数依据。先记录卡片字段、公式、隐藏筛选与选择器联动，再按页面默认条件取原始值，最后验证指定数据行的指定字段。普通查询仍走官方 `guancli`；这里补充本地证据管理与验收，不提供另一套 BI 客户端。

参考 Jeremy 的 [guanbi-agent-builder](https://github.com/JeremyWXL/guanbi-agent-builder) 看板学习、口径档案、采样及问答验收思路。基于真实后台对照，重新实现了取数范围、数值校验和变化检测；来源、固定参考版本及 MIT 原文见 [ATTRIBUTIONS.md](../ATTRIBUTIONS.md)。

## 何时使用

给已有看板接 AI、回答要能对账、卡片数值与 AI 答案不一致、维护长期口径档案时，运行 `scripts/dashboard_evidence.py`。只想查一个数时，直接用官方查询即可。

脚本只会调用 `guancli page get` 和 `guancli card preview`，不会新建、保存、删除、刷新或改权限。认证使用现有官方 profile；先用官方 `auth list --url <BI地址>` 确认环境，再传明确的 profile。验证第三方工具时，正式页面与数据集只作参考，产物保存在本地私有目录。

## 实际操作

前置：Python >= 3.9（标准库即可），已验证基线为 guancli 1.0.63。JSON 文件含真实配置、门店、筛选和数值，不能提交到公开仓库。下面 `dashboard-evidence/` 已被仓库和安装包排除；也可以使用仓库外的私有目录。

```bash
# 记录页面定义，产出业务确认状态为 draft 的档案。
python3 scripts/dashboard_evidence.py snapshot \
  --profile <现有profile> --page-id <页面ID> \
  --out dashboard-evidence/page-before.json

# 明确挑选需要验收的普通图表或自定义卡背后的 DATA_GRID。
# 日期/门店条件按实际字段给出；同一批的 --filter 会应用于每张所选卡片。
python3 scripts/dashboard_evidence.py sample \
  --snapshot dashboard-evidence/page-before.json \
  --card <卡片ID> --filter '订单日期 toDate EQ 2026-09-01' \
  --out dashboard-evidence/run-001

python3 scripts/dashboard_evidence.py verify \
  --samples dashboard-evidence/run-001/samples.json \
  --cases dashboard-evidence/cases.json \
  --out dashboard-evidence/verification.json

# 看板后续变更时重新读取并比较；变化后重新确认口径、重新采样。
python3 scripts/dashboard_evidence.py snapshot \
  --profile <现有profile> --page-id <页面ID> \
  --out dashboard-evidence/page-after.json
python3 scripts/dashboard_evidence.py diff \
  --before dashboard-evidence/page-before.json \
  --after dashboard-evidence/page-after.json \
  --out dashboard-evidence/diff.json
```

每次采样使用新的目录，避免失败后读到上次成功的文件。卡片数据强制 `--with-default-filters --page-id ... --value-format raw --precision -1 -f json -o ...`，直接读取明确的文件路径，不猜测 stdout 是否 JSON。官方 CLI 负责求值 FIRST_PICK、MAX 及级联选择器；解析后的筛选日志随证据保留。显式筛选覆盖同字段的默认条件，不能在报错后删掉条件重跑。

## 验收用例

`cases.json` 是数组。将相应卡片在 `samples.json` 中的 `scopeFingerprint` 原样填入；它绑定 profile、页面/卡片定义、默认筛选实际值、显式筛选、取数时刻及行数限制。每个用例必须有唯一 `id`，指定输出字段和能唯一定位数据行的条件。

以下数字和门店全部为合成数据：

```json
[
  {
    "id": "pos-revenue",
    "cardId": "card-demo",
    "scopeFingerprint": "填入本次该卡片的scopeFingerprint",
    "where": {"订单日期": "2026-09-01", "门店名称": "演示一店", "渠道名称": "POS"},
    "field": "营业额",
    "expected": 123.45,
    "absoluteTolerance": 0
  }
]
```

对单行 KPI 可用 `where: {}`；多行结果必须写出完整行条件，有多条匹配就失败。日期或名称用 `valueType: "text"` 精确比较。数值默认精确比较；展示四舍五入需要显式声明 `absoluteTolerance` 或 `relativeTolerance`，不能放宽整个答案的容差。原始比例 0.08 就填 0.08；单位和百分号展示另行处理，不把带单位的字符串剥成数字。

验证的是同一行里的同一字段，不是在整个结果中寻找关键词和某个金额。POS 行不能拿另一个渠道的金额通过；空值不能当零；门店、日期或筛选证据不同，不能沿用旧验收结果。它检查结构化断言，不宣称自动理解任意自然语言答案或测出大模型问答准确率。由 AI 生成断言时，应在业务答案旁保留取数出处，并用独立参照值复核；不能拿同一结果生成 expected 后再自证正确。

## 档案记录什么

卡片别名与原字段分别保留；`CNT_DISTINCT` 标为去重计数，不能跨门店或期间直接相加。`displayUnit` 只记录展示单位，原始值的计量单位仍需确认。SUM/COUNT 仍需核对数据粒度；未知聚合、计算公式与高级计算留待确认，不自动归类成安全可汇总指标。所有档案始终保留 `businessConfirmation: "draft"`，脚本成功不等于用户确认业务口径。

变化指纹涵盖数据集、字段/公式/聚合、高级计算、隐藏时间宏、选择器默认值与排序、页面联动，以及自定义 HTML/CSS/JS 内容。排除嵌入数据集的刷新时间、行数、体积及版本等运行信息；样式或布局变化也可能提示复查。它不追踪上游 ETL SQL、数据修正、权限变化或外部服务内容。采样前后都会检查定义；中途发生变化则整批证据不能通过。

## 通过与未通过的边界

采样默认取最多 1000 行，可显式改 `--limit`。到达行数上限即标记 `possibly-truncated`，不猜测结果完整；失败、空数据、缺文件或疑似截断都会阻止验收。`sample` 成功仅表示所选卡片可用，`verify` 成功仅表示写出的断言通过；两者都不等于整页、全部数据或前端渲染已经验收。

CUSTOM 前端卡不会执行，也不会把空 preview 记作成功。它背后的普通 DATA_GRID 可以单独对账；JS 里二次聚合、日期窗口、显示单位、交互与布局仍按 Part C 的前端验收流程检查。TEXT 与 SELECTOR 作为定义参考，不当作数据卡采样。

时间戳以 UTC 保存，默认以 Asia/Singapore 标注阅读时区。`--timezone` 不改变 BI 或官方 CLI 的时间宏求值。相对日期应结合日期卡和平台实际时区确认；固定日期验收优先显式筛选，不把本机“昨天”当成已确认的业务期间。

本租户的指标平台权限和 SQL 直查仍存在独立限制；本能力只用已验证的卡片读取路径，不为绕过限制创建临时 ETL、开权限或修改生产配置。

退出码：snapshot 成功为 0；sample/verify 通过为 0、未通过为 2；diff 未变为 0、发现变化为 1；参数、文件或查询错误为 2。完整报告在明确的输出文件中。

## 可复现的脱敏检查

```bash
python3 -m unittest discover -s tests -p 'test_dashboard_evidence.py'
python3 examples/dashboard-evidence/offline_demo.py --out dashboard-evidence/offline-demo
```

离线示例验证合成 POS 金额正确时通过、拿另一渠道金额或错误范围时拒绝。真实后台验证的公开摘要见 [docs/dashboard-evidence-validation.md](../docs/dashboard-evidence-validation.md)；原始资源 ID、生产金额、门店及日志保留在私有证据目录。
