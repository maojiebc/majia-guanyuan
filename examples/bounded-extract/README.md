# 合成分块示例

四条假记录先触顶，再拆成两个互斥日期范围。两个相同候选键的行全部保留，最后输出 JSONL 和进度账本，不调用真实 CLI。

```bash
python3 examples/bounded-extract/offline_demo.py --out /private/tmp/extract-example
```

真实计划、队列恢复及完整性范围见 [方法说明](../../references/bounded-extraction.md)。
