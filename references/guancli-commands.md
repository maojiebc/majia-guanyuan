# guancli 补充命令（只读探索 + 表单 CRUD）

> 由 SKILL.md V1.4.0 拆分而出。SKILL.md 主文档只保留"何时用 guancli vs guandata.py"的决策表；具体子命令查这里。

---

guancli 是观远官方 CLI（`npm install -g @guandata/guancli`），与 guandata.py **互补**：
- **guandata.py** → 建卡、取数、删卡、发布页面（写操作）
- **guancli** → 搜索、探索、ETL/指标/任务/表单（读操作 + 表单CRUD）

**全局 flag**：
- `--brief` — 省 token 模式（输出缩减 50%+），探索阶段必用
- `-f csv` / `-f json` / `-f table` / `-f expanded` / `-f excel` — 切换输出格式
  - `-f excel` 是 1.0.20 新增的 Excel 2003 XML 格式（目前主要在 `card preview` 走通，重定向 `> out.xls` 直接打开；其余子命令视支持范围）
- `--raw` — 原始 JSON（调试用）
- `--profile <name>` — 临时切环境，等价于 `GUANCLI_PROFILE=<name>`（V2.0 起）

**错误捕获（V2.1.4 起 / guancli 1.0.21）**：1.0.21 修了运行时报错附带 usage 帮助的 bug，`guancli ... 2>&1 | head -n 5` 之类的脚本现在能直接拿到干净错误信息，**不会再被一长串 `Usage:` / `Available Commands:` 淹没**。本 skill 的 Part B 报错速查表里所有 `head -n 3` 样式的提示都更可靠了。

---

## 数据集探索（替代 list-datasets）

```bash
# 搜索数据集（比 list-datasets 全量拉取快得多）
guancli ds search "会员"
guancli ds search "会员" --brief        # 省 token

# 数据集目录树
guancli ds tree
guancli ds tree --brief

# 数据集详情（字段列表 + 元信息）
guancli ds get <ds_id>
guancli ds get <ds_id> --brief          # 1894 字符 vs 完整 7468 字符

# 预览数据（自动精简列，干净表格）
guancli ds preview <ds_id> --limit 10
guancli ds preview <ds_id> --limit 10 -f csv   # CSV 格式
```

## 数据集直查 SQL（`ds execute-sql`，V2.1.14 起 / guancli 1.0.26）

对一个或多个数据集跑**只读 SQL**（调 `/api/data-source/execute-sql-query`）。适合少量结果预览、轻量分析、跨数据集 JOIN 探查，**不适合拉全量**（接口仅支持查询语句）。BI 侧需支持该接口并开启"高级 SQL 查询"，否则自动走旧版 public-api fallback。

```bash
# 单数据集：数据集名称当临时表名（中文/空格/特殊字符用反引号包裹）
guancli ds execute-sql --inputs <ds_id> --sql 'SELECT * FROM `会员明细` LIMIT 20'
guancli ds execute-sql --inputs <ds_id> --sql 'SELECT 城市, COUNT(*) AS 人数 FROM `会员明细` GROUP BY 城市' -f json

# 多数据集 JOIN：--inputs 逗号分隔，SQL 里各自用数据集名做表名
guancli ds execute-sql --inputs <ds1>,<ds2> \
  --sql 'SELECT a.`城市`, SUM(b.`营业额`) FROM `门店` a JOIN `流水` b ON a.`门店ID`=b.`门店ID` GROUP BY a.`城市`'

# --limit 默认 1000；旧接口 fallback 时 limit 在 CLI 渲染前本地截断，--raw 保留后端原始响应
guancli ds execute-sql --inputs <ds_id> --sql 'SELECT * FROM `会员明细` LIMIT 100' --limit 100 -f csv
```

> 不知道数据集名称/字段时，先 `guancli ds get <ds_id> --brief` 看名称和字段列表。
> 与 guandata.py 的 `create-and-get` **互补**：execute-sql 适合"临时跑个 SQL 看眼数据 / 做关联探查"，create-and-get 适合"建一张能留存的卡片"。

## ETL 探索（guandata.py 无此能力）

```bash
# 搜索 ETL
guancli etl search "会员"
guancli etl search "会员" --brief

# ETL 目录树
guancli etl tree

# ETL 详情（节点列表、SQL、血缘）
guancli etl get <etl_id>
guancli etl get <etl_id> --brief        # 省略 Malloy/血缘/公式细节

# 预览 ETL 节点数据
guancli etl preview <etl_id> --node <node_id> --limit 10
```

## 指标平台（guandata.py 无此能力）

```bash
# 列指标主题（V2.1.14 起 / 1.0.27）：先缩范围，再到主题里搜指标
guancli metric project              # 列全部可访问主题（主题 ID / 名称 / 备注 / 累计指标数）
guancli metric project 经营         # 按主题名关键词模糊筛
guancli metric project 经营 -f json

# 搜索指标
guancli metric search "营业额"

# 指标目录树
guancli metric tree

# 指标详情
guancli metric get <metric_id>

# 查询指标数据（基础）
guancli metric query <metric_id>
guancli metric query <metric_id> --limit 20
guancli metric query <metric_id> --dim 日期 --dim 城市
guancli metric query <metric_id> --filter "城市 EQ 上海"
guancli metric query <metric_id> --sort-desc 订购数量 --columns "日期,订购数量"
guancli metric query <metric_id> -f json | jq '.[0]'
```

### V2.1.4 起：`metric query` 泛化查询（guancli 1.0.20 新增）

guancli 1.0.20 给 `metric query` 加了一整套"高级指标分析"flag，把同比环比、累计、最近 N 周期、占比、Top N 排名这些常见业务问数能力下放到 CLI 端，**等价于在 BI 里点开"高级计算"面板的全部模式**。这意味着以前要先在 BI 后台配一个新指标实例才能算的同比/累计/占比，现在用一行命令直接出数。

```bash
# 同比 / 环比 / 周环 / 日环（compare: yoy|mom|qoq|wow|dod）
guancli metric query <metric_id> --compare yoy                       # 默认 value，绝对值
guancli metric query <metric_id> --compare mom --compare-value rate  # 环比变化率
guancli metric query <metric_id> --compare yoy --compare-value rawdata  # 同期原值

# 累计（xtd: ytd|qtd|mtd|wtd|dtd）
guancli metric query <metric_id> --xtd ytd          # 年累计
guancli metric query <metric_id> --xtd mtd          # 月累计

# 最近 N 周期（recent: 7d|4w|3m|2q|2y）
guancli metric query <metric_id> --recent 7d                          # 默认以今天为基准
guancli metric query <metric_id> --recent 4w --recent-base 2026-05-15 # 指定基准日

# 占比（必须配 --percentage-dim 指定占比维度）
guancli metric query <metric_id> --percentage --percentage-dim 城市

# Top N 排名
guancli metric query <metric_id> --rank-top 10 --rank-dim 城市 --rank-order desc

# 期末值（cumulative 期末快照）
guancli metric query <metric_id> --last

# 终极兜底：直接传原始 AdvMetricSetting JSON
guancli metric query <metric_id> --adv-calc-json '{"calcType":"yoy",...}'
```

**何时用哪个**：
- 用户问"同比/环比/比去年" → `--compare yoy|mom`，要绝对差还是比率走 `--compare-value rate`
- 用户问"年累计/月累计/今年到今天" → `--xtd ytd|mtd`
- 用户问"最近一周/最近一个月" → `--recent 7d|4w`，不要手算日期再传 `--filter`
- 用户问"各城市占比/份额" → `--percentage --percentage-dim 城市`
- 用户问"Top 10 / 排名前 N" → `--rank-top N --rank-dim 维度 --rank-order desc`
- 复杂叠加（同比 + Top N + 占比同时要）→ 用 `--adv-calc-json` 直接构造 payload

> **版本要求**：泛化查询要求 BI 版本 ≥ 8.2.1。不确定环境版本先跑 `guancli server-version`（见下方「BI 版本查询」小节）。
>
> **注意**：泛化查询的所有 flag 都对应 BI 后端的 `AdvMetricSetting`，能不能算成功取决于指标定义本身是否带"时间维度"、"占比维度"等元信息。报错 `400 AdvMetricSetting invalid` 一般是指标没配时间维度 → 先 `guancli metric get <metric_id>` 检查再说。

## 指标归因分析（guandata.py 无此能力）

```bash
# 搜索指标树
guancli metric_attribution search "营业额"

# 指标树详情
guancli metric_attribution get <tree_id>

# 查询贡献数据
guancli metric_attribution query <tree_id>
```

## 任务监控（guandata.py 无此能力）

```bash
# 查看运行中任务
guancli task running

# 任务历史
guancli task history

# 任务详情
guancli task get <task_id>
guancli task detail <task_id>
```

## 页面 & 卡片探索

```bash
# 搜索页面（替代 list-pages 全量拉取）
guancli page search "门店"

# 页面详情（卡片列表 + 布局）
guancli page get <pg_id>
guancli page get <pg_id> --brief
guancli page get <pg_id> --raw          # 返回根字段是 .data

# 卡片元信息（数据集、类型、筛选条件）
guancli card get <card_id>
guancli card get <card_id> --raw        # 返回根字段是 .response（注意：和 page get 不同）

# 预览卡片数据（V2.1 起：没有 --pg-id flag，老写法 `card data --pg-id` 已废弃）
guancli card preview <card_id>
guancli card preview <card_id> --limit 1 --raw
guancli card preview <card_id> -f json
guancli card preview <card_id> --filter '城市 EQ 上海' -f json
guancli card preview <card_id> --filter '门店类型 EQ 交通枢纽店' -f json
guancli --profile <env> card preview <card_id> -f json    # 多环境

# V2.1.4 起（guancli 1.0.20）：Excel 导出 + 默认 limit 抬到 10000
guancli card preview <card_id> -f excel > out.xls         # Excel 2003 XML，直接 .xls 打开
guancli card preview <card_id> -f excel --limit 50000 > full.xls   # 大数据量场景
# --limit 默认值已抬到 10000（老版本默认 50），平时不再需要手动指定
# --sort-asc/--sort-desc 排序取数下限固定 10000 行，仍受更大 --limit 限制；
# 服务端继续截断时命令会拒绝排序（避免输出半截、顺序不可信）

# V2.1.14 起（1.0.28 / 1.0.29）：动态字段/参数 + 输出文件 + 列裁剪
guancli card preview <card_id> --dynamic-field "维度=区域"           # 动态维度卡：指定取哪个字段（也支持 dzId=fdId / dzId:key）
guancli card preview <card_id> --dynamic-param "结束时间=2026-05-29"  # 动态参数覆盖（"参数名=值" 或 "dpId=值"，仅图表卡片）
guancli card preview <card_id> --columns "城市,营业额" --sort-desc 营业额  # 只取指定列 + 排序
guancli card preview <card_id> -o data.csv -f csv                   # 写文件（-o；未指定且结果>1000行时自动落文件）
guancli card preview <card_id> --precision 2                        # 数值小数位（-1 保留原始精度）
# --dynamic-field/--dynamic-param 只影响运行态取数、不改卡片配置；动态字段名 / dzId / fdId 用 card get <cd_id> 查
```

### jq 兼容速查（V2.1.1 新增）

不同子命令返回根字段不一致，写脚本时统一用 `.data // .response // .`：

```bash
ROOT='.data // .response // .'

# 通用读法
guancli page get <pg_id> --raw | jq "$ROOT.cards | length"
guancli card get <cd_id> --raw | jq "$ROOT.settings"

# selector 联动回读（验证 patch_selector_linkage 是否生效）
guancli card get <selector_id> --raw \
  | jq "$ROOT.settings.asFilter.targetCdIds | length"
```

`settings` 字段可能是 object（线上 API）也可能是 JSON string（资源包 descriptor），统一兼容：

```jq
if (.settings|type)=="string" then (.settings|fromjson) else .settings end
```

### 中文字段名用 bracket 语法

```bash
# ❌ jq: syntax error, unexpected INVALID_CHARACTER
jq -r '.[0].销售额'

# ✅
jq -r '.[0]["销售额"]'
guancli card preview <id> -f json | jq '.[0]["销售额"]'
```

涉及 HTML 应用看板的完整 selector linkage + dataView 验收命令面，见 [`part-c-html-dashboard.md` §10 / §11](./part-c-html-dashboard.md)。

## 表单填报 CRUD

```bash
# 列出表单
guancli form list
guancli form list --tree              # 显示目录结构

# 查看表单字段结构
guancli form schema <form_id>

# 查询表单数据
guancli form query <form_id>
guancli form query <form_id> -f csv   # CSV 格式

# 插入数据
guancli form add <form_id> '{"字段1":"值1","字段2":"值2"}'

# 更新数据
guancli form update <form_id> <record_id> '{"字段1":"新值"}'

# 删除数据
guancli form delete <form_id> <record_id>
```

## 通用 API 调用（万能兜底）

```bash
# GET 请求
guancli fetch GET /api/health

# POST 请求
guancli fetch POST /api/resource '{"key":"value"}'

# stdin 传大 body
echo '{"large":"json"}' | guancli fetch POST /api/some-endpoint --stdin

# 上传文件
guancli fetch POST /api/import/upload-files/CSV --upload file0=/path/to/data.csv
```

---

## ChatBI 主题问数 / L2 洞察（V2.0 新增）

`@guandata/guancli@1.0.19` 新增 `chatbi` 子命令，调 ChatBI Public API。后端需要部署 `/api/chat/public-api/...` 路由，没启用的实例会报 `5001 No static resource`（自有 BI 实例 2026-05-12 实测如此）。

```bash
# 列所有可用主题
guancli chatbi list-theme
guancli chatbi list-theme --insight        # 仅列洞察主题

# L1 主题问数
guancli chatbi query --theme-name "经营主题" --message "最近30天营业收入是多少？"

# L2 洞察分析（解释"为什么变化"）
guancli chatbi insight --theme-id <theme_id> --message "分析最近30天营业收入变化原因"
```

`chatbi` 复用当前 profile 的 `uIdToken`，无需额外认证。

## SuperApp 模板（V2.0 新增）

```bash
# 基于 SuperApp 模版创建新项目
guancli app create

# 发布到平台
guancli app publish
```

详细参数走 `guancli app create --help` / `guancli app publish --help`。

## 连接状态检查（V2.0 新增）

```bash
# 探测当前 profile 的 base_url 接口连通
guancli status
```

区别于 `guancli auth status`：后者只看本地 token 是否有效，前者真发请求探接口。

## BI 版本查询（`server-version`，V2.1.14 起 / 1.0.25）

```bash
guancli server-version                 # 输出当前 BI 实例版本号
guancli bi-version                     # 同一命令的别名
guancli server-version --profile uat   # 查指定环境的版本
```

**何时用**：`metric query` 泛化查询要求 BI ≥ 8.2.1；遇到"新接口报 5001 / 404"或要做版本兼容判断时，先 `server-version` 确认实例版本，再决定走新接口还是旧版 fallback。

## 认证与多环境管理（V2.0 补全）

> token 持久化路径：`~/Library/Application Support/guancli/config.json`，含 `profiles.<name>.uIdToken` + `token_refresh_interval_seconds`。401 自动重登已默认启用。

```bash
# 首次配置
guancli auth login                          # 交互式输入 base_url / domain / 账号 / 密码
guancli auth detect-domain --url https://...  # 不知道 domain 时先探

# 多环境管理
guancli auth list                           # 列出所有已配 profile
guancli auth use <name>                     # 切默认 profile
guancli auth modify <name>                  # 改某个 profile（base_url / domain / 账号 / 密码）
guancli auth remove <name>                  # 删 profile

# 当前会话信息
guancli auth status                         # token 剩余有效期、登录方式
guancli auth whoami                         # 当前登录用户 + 实例 ID

# 临时切换 profile（不改默认）
guancli --profile <name> ds search "..."
export GUANCLI_PROFILE=<name>               # 或环境变量持久切
```

**何时建多 profile**：
- 生产 vs UAT vs 镜像并行测试
- 不同账号权限（普通账号 vs admin）
- 跨多家公司的 BI 实例（外包/咨询场景）

---

## 工具选择决策表

| 场景 | 用什么 | 原因 |
|---|---|---|
| 建卡+取数、数据分析 | `guandata.py create-and-get` | guancli 不支持写操作 |
| 删卡/发布页面 | `guandata.py delete-cards / release-page` | 同上 |
| 搜索数据集/页面/ETL | `guancli xx search` | 比全量拉取快，省 token |
| 查 ETL 结构/SQL/血缘 | `guancli etl get` | guandata.py 无此能力 |
| 查指标平台 | `guancli metric` | guandata.py 无此能力 |
| 缩指标主题范围 | `guancli metric project` | V2.1.14 新增，先筛主题再搜指标 |
| 任务排查 | `guancli task` | guandata.py 无此能力 |
| 快速预览数据 | `guancli ds preview` | 自动精简列，输出干净 |
| 对数据集跑 SQL / 跨集 JOIN 探查 | `guancli ds execute-sql` | V2.1.14 新增，只读 SQL，不落卡片 |
| 表单 CRUD | `guancli form` | guandata.py 无此能力 |
| 主题问数 / 洞察分析 | `guancli chatbi` | V2.0 新增，需后端启用 ChatBI Public API |
| SuperApp 创建/发布 | `guancli app` | V2.0 新增 |
| 接口连通性探测 | `guancli status` | V2.0 新增，区别于 `auth status` |
| 查 BI 实例版本 / 兼容判断 | `guancli server-version` | V2.1.14 新增，泛化查询要 BI ≥ 8.2.1 |
| 多环境切换 | `guancli --profile` / `GUANCLI_PROFILE` | V2.0 补全 |
| 调未封装的 API | `guancli fetch` | 万能兜底 |
