# 分块取数后的独立验收

示例只用四行合成数据，不连接 BI。先触及三行上限，再拆成两个互斥日期块，最后独立核对完整性和加总。两行使用同一候选键，原样保留，不自动去重。

```bash
python3 examples/extraction-evidence/offline_demo.py --out /private/tmp/extraction-acceptance-demo
```

输出验收报告 acceptance.json 与可作备注底稿的 source-note.txt。目录必须是新的私有目录。示例加总为 1.0，但真实数据的业务可相加性和单位必须另行确认。实操范围见 [验证记录](../../docs/extraction-evidence-validation.md)。
