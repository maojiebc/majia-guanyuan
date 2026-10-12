# 合成汇总示例

使用 FakeCLI 演示 result.json、provenance.json 和 source-note.txt，不连接 BI、不创建线上资源。

```bash
python3 examples/etl-preview-aggregate/offline_demo.py --out /private/tmp/aggregate-example
```

实际运行参数和终端文本限制见 [受限取数速查](../../references/restricted-query-playbook.md)。测试输出与真实证据均使用新私有目录，不能覆盖旧运行。
