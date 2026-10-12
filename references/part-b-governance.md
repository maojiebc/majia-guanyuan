# 主文下沉记录

以下规则从 v3.3.0 路由主文完整迁移，仅调整相对链接及脱敏环境代称。旧版本修复、绕过方案和 API 经验是历史记录；优先按当前官方 Skill 与主文硬边界处理，不能用它覆盖本轮只读授权或自动删除重建。

# 🅱️ Part B：ETL 治理与写入（V1.0）

> 当前兼容基线为 `@guandata/guancli@1.0.63`。本 Part 的 API 路径、payload 字段、报错信息与治理判断维度来自既往真实跑通请求；本次 1.0.63 对齐完成 CLI/文档验证，不把未重跑的 BI 业务链冒充新版实证。累计覆盖整库治理扫描 + 60+ 张 ETL 创建/重构/修复/删除实战。
>
> ⚠️ 官方全家桶已把 BI 写操作拆成兄弟 skill 并**全部公网化**（2026-06-03，`npm i -g @guandata/guanskill`）：标准 ETL 写入有 `guanetl`、工作流数据流有 `guanwf`、数据源/数据集有 `guands`。**但 Part B 这套基于 `guancli fetch` + payload 的实战手册仍是底层事实源**——直接命中 API 路径 / payload 字段 / 报错码 / 治理判断的部分官方命令封装不到。遇到标准化 ETL 写入可路由到 `guanetl`，但**整库治理扫描、direct-save、payload_json、SmartETL 全链路重写、10 类报错速查继续走本 skill**。
>
> 🧪 **实测边界（2026-06-04 · example-profile · BI 8.2.1-hf6）**：guanetl `edit` 的 base→etl.go 逆向在 **0.1.12 / 0.1.13 完全失效**（空 `return []Node{}`，5/5 ETL 全复现、`-v` 无报错）；`save` 的输出绑定 guard 也误触发。**0.1.14 两个 bug 均已修复**（2026-06-09 example-profile 实测：`ads_会员经营任务池` 6 节点 `edit→export→lint→save` 全链路通过）。改现有 ETL 现在可以走 `guanetl edit` 正常路径了。**B-0.5 绕过方案仍保留作 fallback 参考**（万一其他 BI 版本 / 节点类型仍触发）。
>
> ⚡ **0.1.14 修复确认**（2026-06-09 复测）：① `edit` 空 `etl.go`（Wall 1）→ ✅ 已修，6 节点完整逆向为 `BasicInputDataset×4 + BasicSqlScript + BasicOutputDatasetInDir`；② `save` 输出绑定 guard 误触发（Wall 2）→ ✅ 已修，save 直接成功不再拦截。另：**0.1.14 移除了 `delete` 命令**，删 ETL 改走 BI UI 或直接 `DELETE /api/etl/<id>` API。**0.1.15（2026-06-15）进一步增强 `save` 输出数据集保护（保留级联相关配置）+ 对追加写入场景的行数据结构提前校验**——改 ETL 走 `guanetl edit` 正常路径更稳。**0.1.16（2026-06-17）再加 `save --dry-run` 保存影响预览 + `run` 执行前提示上游数据集失败态 + `preview` 提示 LEFT JOIN 桥接列全空样本**，改 ETL 前可先 `--dry-run` 看影响面。**0.1.17（2026-06-24）仅 `install-skill` 适配 WorkBuddy 目录，ETL 行为无变化。** **0.1.18（2026-07-01）建 ETL 时目录类型诊断更清晰（识别误用工作流/经典数据流目录、提示用智能 ETL 目录）。** **0.1.19（2026-07-08）新增 `move`（移 ETL 到指定目录，接口异常时读回确认）+ `run --run-upstream`（递归解析上游链路按拓扑顺序执行，配 `--dry-run`）+ `run --wait` 遇 40001「已在运行」改为查找并等待现有任务（减少级联触发后重复 run 的误判失败）+ `export` 静态检查 JOIN 键类型不一致 warning（STRING/LONG 隐式 coercion 风险）。** **0.1.21（07-24）JOIN 类型检查扩至 preview/save/run。** **0.1.22–0.1.27（07-25～08-10）** 写操作回显实际目标环境 + 多节点并行 preview + 运行中任务可直接跟踪 + 输出落位闭环 / JOIN 未知类型拦截 + `save` 影响报告字段级明细 + 首次运行后临时输出集完成生成再做字段检查。

> **2026-09-14 官方对齐**：`guanetl 0.1.34` 新建须明确两类目录，执行按 ETL ID 跟踪且不再提供全局 `task`；0.1.31 已修复历史节点 ID 下划线导出。上述为官方文档与命令核验，未重跑线上 ETL。详见 [兼容说明](../references/official-cli-compatibility.md)。

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

**清理坑**：~~`guanetl delete --cascade`~~（0.1.14 起无 delete 命令）。删 ETL + 孤儿输出集走 `DELETE` API，**顺序必须先删输出数据集、再删 ETL（与 B-7.1 一致）**；反过来先删 ETL → `2002 输出数据集已存在` 失败。**2026-06-17 · example-profile 实测定案**（独立 DATAFLOW ETL，净零回归）：`DELETE /api/data-source/<输出dsId>`（ETL 还在）→ `DataSource deleted` 成功、**不报 6001**；再 `DELETE /api/etl/<id>` → 成功。churn 出的中间绑定是另一回事——删 ETL 后多为 `NOT_FOUND` 幽灵（`ds get`=1002 但 `ds delete`=6001，不可见、无害）。

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

📖 **[references/part-b-payload.md](../references/part-b-payload.md)** — 完整 payload 模板（含 dataSource.dirPath）+ 三种节点的字段速查表 + 9 种已知节点类型 + dataFlowId 控制 create vs update + **B-8 复用模板：从扫描到落表的完整 4 阶段脚本**（治理扫描 → 建目录 → 写入执行 → 删除旧链）。

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

> ✅ **2026-06-17 · example-profile 实测复核（净零回归）**：独立 DATAFLOW ETL 两个方向各测一次——etl-first 撞 `2002 输出数据集已存在` 失败；ds-first（先 `DELETE /api/data-source/<输出dsId>`，后 `DELETE /api/etl/<id>`）两步皆 `ok`、**不报 6001**。本约束适用所有「ETL + 其输出数据集」清理。`6001 依赖于该数据集` **不**出现在这里，它只属于删*输入*数据集（ETL 仍读它）或 churn `NOT_FOUND` 幽灵场景（见 B-0.5 清理坑）。

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

每条只列**触发现象 + 一句根因 + 一句修复方向**；完整修复方案 + SQL 示例 + 升级版坑见 **[references/part-b-errors.md](../references/part-b-errors.md)**。

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

📖 **[references/part-b-sdk.md](../references/part-b-sdk.md)** — 完整 7 步实现 + 时间窗口缩减实战（v2 近 3 月 → v3 昨日窗口的 regex 替换样板）。

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

> 💡 **30+ 张表跨多日的工程必须走 ExecPlan**：不要靠零散 todo + 群消息 + 临时 markdown 来追踪进度。直接走 **B-17.11**（在 [references/part-b17-fullchain-rewrite.md](../references/part-b17-fullchain-rewrite.md)）的 ExecPlan 工作法——四个活文档章节（Progress / Surprises & Discoveries / Decision Log / Outcomes & Retrospective）能把治理判断、循环依赖拆法、字段隐藏换行这类"踩坑—修复"轨迹完整落到一份自包含文档里，下一个接手的人不用问任何上下文就能继续。

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
- ❌ **删除类操作（`DELETE /api/data-source/`、`/api/etl/`、`/api/page/<id>?force=true` 级联删页）一律回到 B-7 删除章节**——安全闸（逐项确认 + 下游切流 + 对账 + 单批 ≤5）见 **B-7.0**；先删数据集再删 ETL 的顺序见 **B-7.1**；正确路径是 `/api/data-source/`（带连字符，别试 `/dataset/`、`/datasource/`、`/ds/`）见 **B-7.2**。未经用户逐项明确确认绝不执行，模糊回复（"嗯"、"可以"、"清理一下"）不算确认；新旧并行是默认终态，不是过渡态。
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

📖 **[references/part-b17-fullchain-rewrite.md](../references/part-b17-fullchain-rewrite.md)** — 完整方法论 11 节：何时用 B-17 / 4 件交付 / 8 条硬规则 / 5 步标准工作流 / 三层验收（数据集/副本页/卡片级）/ 差异追踪 5 步法 / 空快照处理标准 / 标准交付物清单 / 6 类专属常见坑 / 完成标准 6 项 / **B-17.11 用 ExecPlan 管理重写工程**（含 SmartETL 改写专用 ExecPlan 骨架，拿去直接填空）。

**最简口诀**（10 秒决定要不要进 B-17）：
- 只新建 1 个 SQL 节点数据集 → 走 B-3 ~ B-9，不进 B-17
- 涉及"页面副本验收"或"卡片级数值对账"或"全链路追到原始源" → 必进 B-17
- 30+ 表 / 跨多日 / 循环依赖拆解 → 进 B-17 + 走 B-17.11 ExecPlan

---
