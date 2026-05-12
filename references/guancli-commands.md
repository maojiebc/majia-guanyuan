# guancli 补充命令（只读探索 + 表单 CRUD）

> 由 SKILL.md V1.4.0 拆分而出。SKILL.md 主文档只保留"何时用 guancli vs guandata.py"的决策表；具体子命令查这里。

---

guancli 是观远官方 CLI（`npm install -g @guandata/guancli`），与 guandata.py **互补**：
- **guandata.py** → 建卡、取数、删卡、发布页面（写操作）
- **guancli** → 搜索、探索、ETL/指标/任务/表单（读操作 + 表单CRUD）

**全局 flag**：
- `--brief` — 省 token 模式（输出缩减 50%+），探索阶段必用
- `-f csv` / `-f json` / `-f table` — 切换输出格式
- `--raw` — 原始 JSON（调试用）

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
# 搜索指标
guancli metric search "营业额"

# 指标目录树
guancli metric tree

# 指标详情
guancli metric get <metric_id>

# 查询指标数据
guancli metric query <metric_id>
```

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

# 卡片元信息（数据集、类型、筛选条件）
guancli card get <card_id>

# 预览卡片数据
guancli card preview <card_id>
```

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
| 任务排查 | `guancli task` | guandata.py 无此能力 |
| 快速预览数据 | `guancli ds preview` | 自动精简列，输出干净 |
| 表单 CRUD | `guancli form` | guandata.py 无此能力 |
| 主题问数 / 洞察分析 | `guancli chatbi` | V2.0 新增，需后端启用 ChatBI Public API |
| SuperApp 创建/发布 | `guancli app` | V2.0 新增 |
| 接口连通性探测 | `guancli status` | V2.0 新增，区别于 `auth status` |
| 多环境切换 | `guancli --profile` / `GUANCLI_PROFILE` | V2.0 补全 |
| 调未封装的 API | `guancli fetch` | 万能兜底 |
