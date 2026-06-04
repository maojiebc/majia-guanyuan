# templates/html-dashboard

HTML 应用化看板模板包，配合 [`references/part-c-html-dashboard.md`](../../references/part-c-html-dashboard.md) 使用。

随 majia-guanyuan **V2.1.1** (2026-05-14) 首次落地，源自 2026-05-14 `app.guandata.com` 上 `<demo-domain>` 实例的 `马甲—测试` 页面（资源 ID 已脱敏为占位符）实测沉淀。

## 文件清单

```text
charts/
├─ html_common.js          GDHTML 共享 runtime（safeCols / money / yuan / pct / esc / bar / stacked / lineSvg / scatterSvg / mount）
├─ html_base.css           共享样式（指标卡 / 列表 / 表格 / 标签 / 网格）
├─ html_executive.html     经营驾驶舱 root 节点
├─ html_executive.js       经营驾驶舱渲染（data[0..3]：KPI / 城市 Top / 低效 / 样板）
├─ html_trend.html         月度渠道趋势 root 节点
└─ html_trend.js           月度渠道趋势渲染（data[0]：月份 + 渠道 + 销售额）

scripts/
└─ patch_selector_linkage.js   把 HTML dataView 注入 selector.asFilter（弥补 guanvis linkToAll 的盲区）
```

## 使用

### 起步

```bash
SKILL_DIR=~/.claude/skills/majia-guanyuan   # 或对应 agent 的安装路径
cp -r "$SKILL_DIR/templates/html-dashboard/charts"   ./my-page/
cp -r "$SKILL_DIR/templates/html-dashboard/scripts"  ./my-page/
```

### 一条命令补 selector 联动

```bash
node ./my-page/scripts/patch_selector_linkage.js \
  --descriptor /tmp/unzipped-pkg/descriptor.json \
  --selector 城市:<fdId-城市> \
  --selector 门店类型:<fdId-门店类型> \
  --targets <html_dv_id_1>,<html_dv_id_2>,...
```

完整 pack → patch → upload → verify 工作流见 [part-c-html-dashboard.md §8](../../references/part-c-html-dashboard.md#8-packpatchupload-标准工作流)。

## 扩展更多模块

模板里只放了 `executive` + `trend` 两个起手模块。实战中常用的另 4 个（city / matrix / structure / actions）按相同的"data contract → GDHTML mount → renderChart 注册"结构扩出来即可，组件可以复用 `GDHTML.bar / stacked / lineSvg / scatterSvg / esc / money / yuan / pct`，不必重写。

## 与 Part C 其他章节的关系

- C-1 ~ C-11：既有页面的 HTML/JS 注入 hack（runtime DOM）
- **C-12 / 本模板**：从零生成 HTML 应用看板（发布期 DSL + descriptor patch）

两者共享 runtime 契约（`renderChart(data, ...)`）和 dataView 取数模型，但工具链完全不同。

## 字段名兼容（重要）

涉及日期粒度的模块都会自动兼容粒度后缀：

```text
日期 / 日期 (日)
月份 / 月份 (月) / 年月 / year_month
季度 / 季度 (季)
年份 / 年份 (年)
```

实现在 `html_common.js` 的 `GDHTML.col()` 里，业务代码直接 `GDHTML.col(cols, "月份")` 即可，不要自己硬编码字段名。
