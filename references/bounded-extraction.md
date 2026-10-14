# 有边界的分块读取

`scripts/bounded_extract.py` 编排官方 `guancli ds preview --raw`，不提供另一套 API。Python 3.9+，macOS/Linux；仅标准库。先确认目标 profile、范围和同账号其他取数任务。外置盘用前先核本机现行资产说明，不能复用旧路径。

## 大数据量先说明范围与成本

先明确问题是否真的需要全量明细；必要的汇总优先采用已确认口径，不能擅自缩小时间或组织范围改变问题。大量明细开始前说明预计范围、分批过程、BI 负载和上下文成本；需求与授权已经明确时直接按预算执行，不逐片重复询问。卡片 preview 图表默认最多10000行，超过1000行且未指定输出文件时会自动落盘；本项目采样显式限制1000行，数据集分块另用60000上限，不能混用。达到限制只证明可能截断，仍需总数/范围证据；即使写入文件也不代表全量。卡片本地排序也不证明全量Top N。参考附属项目v4.8.2，来源和限制见 [致谢](../ATTRIBUTIONS.md)。

## 计划与执行

以下为合成配置。实际计划和输出放仓库外私有目录；仓库内仅允许已被 gitignore 排除的目录。

```json
{
  "schemaVersion": 1,
  "profile": "existing-profile",
  "datasetId": "dataset-example",
  "columns": ["business_day", "record_id", "value"],
  "filters": [],
  "dateField": "business_day",
  "start": "2026-01-01",
  "end": "2026-01-31",
  "prefixField": "record_id",
  "prefixes": ["A", "B"],
  "maxRows": 60000,
  "out": "/private/tmp/bounded-extract-demo"
}
```

日期按 DATE 字段的闭区间 BT 切分：左段结束日后一天开始右段，范围互斥。时间戳字段须先确认 BT 的端点语义，不能直接当 DATE 用。前缀不得互相包含；指定前缀只覆盖这些范围，不证明覆盖全部来源。基础筛选不能再约束分块字段。

本次发现 `--raw` 会跳过 CLI 的显示列选择，即使带 --columns，原始响应仍含全部列。脚本校验全部列与行宽后，再按计划在本地投影，只把所选列写入 JSONL；不能把 --columns 宣称为服务端减少读取字段或降低扫描量的证明。

```bash
python3 scripts/bounded_extract.py run --plan /private/path/plan.json --max-requests 2
python3 scripts/bounded_extract.py status --plan /private/path/plan.json
python3 scripts/bounded_extract.py resume --plan /private/path/plan.json --max-requests 2
```

默认单并发，请求开始间隔至少 5 秒；最多 60000 行、120 秒超时。完整响应超过 60 秒时保存并读回已完成块，然后暂停；至少冷却 60 秒，并显式 resume。冷却不解除未知服务端请求。一次最多请求数由 max-requests 控制，默认 1。requireMount 要求已挂载的目录且输出位于其内；minFreeBytes 默认 1 GiB。安装包里的 guard 与所有运行目录共享同 profile 的本地锁和在途标记，不影响其他进程的 BI 队列，也不能发现网页端请求。

## 完整性与恢复

`response.rowCount` 必须是当前账号、当前筛选的总数；返回行数与它相等且严格小于 limit 才接受。新租户先用小范围确认这个契约。触顶或数量不一致时丢弃该响应，二分日期；单日仍不全则停，改用更细的已审阅维度。没有 rowCount、字段/数据集不符、来源版本漂移都停止，不能猜成完整。无 version 时账本记录缺失，跨请求不具备冻结快照证明。

JSONL 保留每一行，候选键重复也不去重；空结果写空文件，不补零。每块记录范围、原始总数、耗时、来源版本、行数与 sha256，写后读回；续跑首先复核所有已完成文件，哈希不符停止且不重取。输出范围指纹变了必须另开目录。父块 split 不计入最终总量；重叠范围也不能相加。中断遗留 running 会转为 unknown。

超时、错误或中断后不自动重发。超时后的客户端进程组会被终止，但服务端状态仍未知，同 profile 的新运行也被阻止。先从独立的服务端终态证据确认该请求已结束；没有可用接口时保持阻碍，不能按时间解除。resolve-unknown 接收人工核验的 JSON：profile、planFingerprint、chunkId、serverCompleted=true、observedAt（含时区）、reviewedBy、evidence。它只记录审阅声明，不自行证明服务器终态；账本会保留证据哈希和审阅信息。解析失败/来源漂移队列须独立复核，不通过重启来恢复。

```bash
python3 scripts/bounded_extract.py resolve-unknown --plan /private/path/plan.json --evidence /private/path/terminal-review.json
```

获证后原未知块保留为 abandoned，只新增更小的互斥日期子块。单日未知块不能自动重试，须另外审阅拆分维度。已完成块始终不重发。

## 数字能证明什么

读完只能证明这些账号可见筛选范围的返回完整性。当前门店或组织名单不证明历史覆盖，空行不证明停业。用原始行聚合前先核业务粒度，不默认按最新同步时间去重。总量、去重人数、退款和渠道等分别用独立汇总或卡片对照，见 [受限取数速查](restricted-query-playbook.md) 和 [看板口径档案](dashboard-evidence.md)。同来源版本也不代替业务验收。

退出码：complete、paused-budget 为 0；慢请求暂停、未知、失败、阻碍为 2。paused-budget 只是本轮达到请求预算，不能报告全量完成。status 检查已完成文件但不连接 BI。

## 离线验证

```bash
python3 -m unittest discover -s tests -p 'test_bounded_extract.py'
python3 examples/bounded-extract/offline_demo.py --out /private/tmp/bounded-extract-offline
```

合成示例先触顶，再分成两个互斥日期块，四行全部保留，其中包含重复候选键。真实环境验收状态另见发布验证文档；离线通过不表示生产取数已经验证。

## 完成后独立验收

status=complete 后再按 [取数验收](extraction-evidence.md) 核对覆盖、互斥及实际数据范围，并产生可复查的数字出处。计划投影保留日期、前缀和基础筛选字段；否则不能核实范围。验收只读本地文件，不增加 BI 查询。
