# 官方连续计算的离线示例

需要官方guancli1.0.72。全部输入均为合成数据，只读取本地文件，不连接BI。由官方pipeline完成两行汇总、相除，并生成精确JSON和同源CSV/Markdown；本项目不实现另一套计算器。

从仓库根目录执行，结果目录必须尚不存在且位于私有位置：

```bash
guancli analyze pipeline examples/local-analysis-plan/plan.json --validate
guancli analyze pipeline examples/local-analysis-plan/plan.json --output-dir /tmp/guanyuan-local-analysis-example
```

预期Amount为0.30、Ratio的精确分数为1/3、展示为33.33%。计算只继续使用result-1.json里的精确值，不反读舍入后的CSV。原始输入路径相对plan.json；展示unit仅为标签，不做单位换算。

completeInput:true只是调用方声明，真实取数须另证来源范围、业务粒度、行数和分页完结。官方会拒绝已达到上限、非零offset或rowCount不符的完整表；不能靠该声明把样本变成全量。--validate不读取数据，计划通过不代表输入有效或口径正确。不得向CLI交入未受信任路径；宿主须先快照授权文件，连file回执指向的实际行文件也要一起处理。

本轮实际运行正例，并验证触及上限的输入与已有结果目录均拒绝；没有BI请求或生产业务验收。完整来源与限制见[官方兼容说明](../../references/official-cli-compatibility.md)。
