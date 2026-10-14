# 取数完成后的验收与数字出处

适用于 bounded_extract.py schemaVersion=1 的计划和账本。取数完成后再运行一次本地验收，不增加 BI 请求、不改账本、不清除未知请求、不自动补取。逐行读取，数据块只做一次哈希，不把整张表载入内存。

```bash
python3 scripts/extraction_evidence.py --plan /private/path/plan.json --out /private/path/acceptance
# 只有已确认这些字段可相加时才显式加总；可重复指定 --sum
python3 scripts/extraction_evidence.py --plan /private/path/plan.json --out /private/path/acceptance-with-sum --sum amount
```

验收核对计划指纹、完成状态、日期范围的完整覆盖与互斥、各前缀的独立覆盖、字段一致性、每行的日期/前缀/基础筛选、文件哈希和返回行数。split 或 abandoned 父块不算进合计；unknown、失败、未完成、漏块、重叠、范围外数据、数量不一致均拒绝。空块可以覆盖一个已确认无返回行的计划范围，不能据此推断停业或业务零值。

计划的 columns 必须包含日期字段、前缀字段、基础筛选字段和要加总的字段。不要先投影丢掉它们，再让验收猜范围。当前仅支持 DATE 字符串 YYYY-MM-DD、字符串前缀、EQ、DATE BT、IS_NULL 与 NOT_NULL；其他筛选或时间戳形态明确拒绝，不删除原条件重跑。数据仍保留在私有目录，用实际返回字段调整投影；不支持的条件继续人工核验，不能宣布全量通过。

acceptance.json 记录每块范围、文件哈希、行数、账本哈希、计划指纹、来源版本观察及所选字段合计。source-note.txt 带来源、期间、前缀、基础筛选、行数和文件证据，可作为报告备注的底稿；指标算法、单位和业务期间仍需确认。首次出现的核心数字须同时说明范围和口径，不只给取数时点。附属项目 v4.8.4 的出处纪律经审阅后吸收，见 [致谢](../ATTRIBUTIONS.md)。

加总按 JSONL 中存储的数字文本做十进制计算，不先转浮点、不去重、不把空值当零；空结果或全空列的 value 为 null，nullRows 单列统计。展示百分比、去重人数、累计快照等不可未经确认相加。此结果不证明原服务端数值未经舍入，也不替代指标平台或看板口径验收。一般表格排名、对齐、计算仍使用官方 guancli analyze；候选池完整且口径明确后才能声明 --complete-input。

passed 只证明本地账本支持账号可见计划范围的完整性。来源版本观察一致不是冻结快照；历史全集、权限覆盖、服务端 rowCount 的实际语义和业务口径仍须独立确认。本地账本不是服务端签名证明。出现中断或未知请求时，先遵守 [分块恢复](bounded-extraction.md)，本脚本没有解锁或重试能力。

输出须为新建私有目录。失败退出 2，不写成功报告；成功退出 0，仍保持 businessAccepted=false 和 snapshot=not_frozen。报告只能在其记录的文件与账本未变时引用；变更后另建报告。不可把真实证据、资源标识、筛选值或来源备注放入公开仓库。
