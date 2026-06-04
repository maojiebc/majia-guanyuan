# Part C-12：HTML 应用化看板生成

> **来源**：2026-05-14 在 `app.guandata.com` / domain `<demo-domain>` 的 `马甲—测试` 页面（`<page_id>`）实测沉淀。一次把标准 BI 看板升级成"HTML 化经营分析应用"的完整方法论，含 41 张卡 / 6 个 HTML 模块 / 22 个 selector 目标 / 三层数据验证。
>
> **版本**：随 majia-guanyuan **V2.1.1** (2026-05-14) 首次落地。
>
> **何时回到这里**：用户说"生成看板""做一份分析页""自动生成"，并且 **任一**触发词命中"更高级 / 更复杂 / 更好 / 应用 / 自定义模块 / 不要限制在标准看板 / 最完美版本 / HTML 看板"——立刻把路线切到本章，不要按 Part A 的标准 KPI/折线/柱状图套路交付。

---

## §0 一句话定位

**应用化看板 = 原生 Page + 原生 selector + HTML SDK 可见层 + DATA_GRID dataView 数据层**。

- 观远后端负责权限、刷新、聚合、筛选、selector 联动
- 前端负责叙事、布局、SVG/HTML 可视化、混排（指标卡 + 列表 + 表格 + SVG）
- 标准图表卡退到 **数据供给层 / 历史资源** 角色，不再做主视觉

判断标准：用户要的不是"几张漂亮图表"，而是"一个完整的经营分析页面"。

---

## §1 何时切到 HTML 应用看板

| 触发场景 | 走哪条路 |
|---|---|
| 用户说 "标准 KPI + 折线 + 柱状图就够了" | Part A（标准卡片）|
| 用户说 "需要双 Y 轴、ECharts 自定义、tooltip HTML" | guanvis JS DSL（V2.1 路由）|
| 用户说 "更高级 / 应用化 / 自定义模块 / 不限标准 / 最完美" | **本章 — HTML 应用看板** |
| 既有页面要做固定卡片、overlay、注入式改造 | Part C §C-4（HTML/JS 注入 hack） |

**默认故事线**（HTML 应用看板的页面骨架，6 个模块为起步参考）：

```text
总览 → 趋势 → 结构 → 四象限 → 行动队列
经营驾驶舱 → 月度渠道增长 → 城市维度分析 → 门店效能矩阵 → 城市渠道结构 → 经营动作看板
```

不要堆图表，每个模块都要服务于一段叙事。

---

## §2 总体架构

```text
观远 Page
├─ 原生 selector：城市、门店类型、时间、… （走 guanvis 的 selector DSL）
├─ 可见层：HTML SDK 自定义卡片（6 个起步）
│  ├─ 经营驾驶舱       (createCustomChart + SDK + html_executive)
│  ├─ 月度渠道增长     (createCustomChart + SDK + html_trend)
│  ├─ 城市维度分析     (createCustomChart + SDK + html_city)
│  ├─ 门店效能矩阵     (createCustomChart + SDK + html_matrix)
│  ├─ 城市渠道结构     (createCustomChart + SDK + html_structure)
│  └─ 经营动作看板     (createCustomChart + SDK + html_actions)
└─ 数据层：DATA_GRID dataView / 标准图表卡（一对一绑定 custom chart，不跨模块复用）
```

---

## §3 SDK vs ECHARTS_LITE 决策

V2.1 之前 Part C 里凡是写 "用自定义图表，不用 Lite" 都默认指 ECharts SDK。HTML 应用看板进一步细化：

| 场景 | 用 |
|---|---|
| 纯 ECharts 散点、矩阵、地图、自定义渲染 | `ECHARTS_LITE` |
| 像产品页面 / 分析应用 / 管理驾驶舱 / 含混排（指标卡 + 列表 + 表格 + SVG） | **`CustomChartSubType.SDK`**（HTML 模式） |
| 经营叙事、复杂卡片布局、自定义交互、后续要注入复杂逻辑 | **`CustomChartSubType.SDK`** |

**写法**：

```javascript
createCustomChart("HTML经营驾驶舱")
  .setSubType(CustomChartSubType.SDK)
  .loadContent("charts/html_executive")
  .addDataView(kpiDataView)
  .addDataView(cityDataView);
```

SDK 模式 iframe 开销更大，但表达力换得来。**不要为了省 iframe 开销牺牲表达能力。**

---

## §4 dataView contract — HTML 模块的真实数据接口

### §4.1 dataView 的本质

自定义图表 **不能直接随意调用数据集**。稳定路径：把一张 `DATA_GRID` 卡作为 dataView 添加到 custom chart：

```javascript
var kpiData = createCard(ChartType.DATA_GRID, "HTML-总览KPI数据")
  .bindDataset(DS_MONTHLY)
  .addMetric(...);

var htmlCard = createCustomChart("HTML经营驾驶舱")
  .setSubType(CustomChartSubType.SDK)
  .loadContent("charts/html_executive")
  .addDataView(kpiData);
```

观远 runtime 传给 `renderChart(data, ...)` 的 `data` 是 **列式结构**：

```javascript
data[0][0] = { name: "销售额", data: [...] }
data[0][1] = { name: "订单",   data: [...] }
data[1][0] = { name: "城市",   data: [...] }  // 第二个 dataView
```

`data[N]` 对应 `addDataView` 的第 N 次调用。

### §4.2 每个 HTML 模块的 dataView 清单（实战参考）

| HTML 模块 | dataView 序列 |
|---|---|
| 经营驾驶舱 | `data[0]` KPI / `data[1]` 城市 / `data[2]` 低效门店 / `data[3]` 样板门店 |
| 月度渠道趋势 | `data[0]` 月度渠道趋势 |
| 城市维度分析 | `data[0]` 城市经营数据 |
| 门店效能矩阵 | `data[0]` 门店四象限 |
| 城市渠道结构 | `data[0]` 城市渠道结构 |
| 经营动作看板 | `data[0]` 低效门店 / `data[1]` 样板门店 / `data[2]` 城市分层 |

### §4.3 写 data contract 当文档

每个 HTML 模块顶部都要写 data contract 注释：

```javascript
/**
 * data[0] = KPI 数据   (字段：销售额、订单数、客单价)
 * data[1] = 城市数据   (字段：城市、销售额、订单数)
 * data[2] = 低效门店   (字段：门店名、销售额、店龄)
 * data[3] = 样板门店   (字段：门店名、销售额、店龄)
 */
```

并用 `safeCols(data, index)` 解析，**不要假设 `data[0]` 永远存在**（dataView 缺失或后端报错时会塌成 undefined）：

```javascript
var kpi = GDHTML.safeCols(data, 0);
if (!kpi.length) return mountEmpty("HTML经营驾驶舱：KPI dataView 缺失");
```

---

## §5 共享 runtime — `html_common.js` + `html_base.css`

### §5.1 为什么要抽

6 个 HTML 模块都要重复实现：数据解析、数字格式化、百分比格式化、HTML escape、SVG 折线、SVG 散点、list/table/bar/stacked bar。每张卡都复制一份等同于无法维护。

### §5.2 文件布局

```text
templates/html-dashboard/
├─ charts/
│  ├─ html_common.js     # 共享 runtime（API 见 §5.3）
│  ├─ html_base.css      # 共享样式
│  ├─ html_executive.html / .js
│  ├─ html_trend.html / .js
│  ├─ html_city.html / .js
│  ├─ html_matrix.html / .js
│  ├─ html_structure.html / .js
│  └─ html_actions.html / .js
├─ scripts/
│  └─ patch_selector_linkage.js   # §7 用
└─ README.md
```

### §5.3 内嵌 + 挂载

每个 HTML 模块的 `.js` 头部：

```javascript
var __gdHtmlCommon = __asset_text("./html_common.js")__;
var __gdHtmlCss    = __asset_text("./html_base.css")__;
(new Function(__gdHtmlCommon))();   // 装载 GDHTML 命名空间
```

每个模块的入口：

```javascript
GDHTML.mount("html-executive", "executive", html, __gdHtmlCss);
```

### §5.4 GDHTML 最小 API

`html_common.js` 至少暴露：

```text
safeCols(data, index)   — 取第 N 个 dataView 的列数组，缺失返回 []
rows(cols)              — 把列式转行式（[{字段A: v, 字段B: v}, ...]）
col(cols, name)         — 按 name（兼容粒度后缀，见 §9）找列
money(value)            — 4567890 → "456.79 万"
yuan(value)             — 4567890 → "¥4,567,890"
pct(value)              — 0.1234  → "12.34%"
esc(value)              — HTML escape，防 XSS
bar(value, max)         — 单值水平条 SVG
stacked(parts)          — 堆叠水平条 SVG
lineSvg(points, opts)   — SVG 折线
scatterSvg(points, opts)— SVG 散点
mount(rootId, name, html, css) — iframe 安全挂载
```

完整实现见 `templates/html-dashboard/charts/html_common.js`。

---

## §6 ID 规则严格校验

### §6.1 24 字符 alphanumeric

自定义卡 / dataView 的 ID 必须 **正好 24 位、纯字母数字**。实测错误：

```text
Card ID must be exactly 24 alphanumeric characters, got 25
Custom chart ID must be exactly 24 alphanumeric characters, got 25
```

### §6.2 dataView 不跨 custom chart 复用

```text
resource ID 'xxx' is already used by ...
```

同一个 dataView 不能被多个 custom chart 复用。即使两个 HTML 模块字段完全相同的城市数据，也要建两张：

```text
HTML-城市经营数据         (cdId: aaa...)  → 给城市维度分析
HTML-城市维度卡片数据     (cdId: bbb...)  → 给经营驾驶舱
```

### §6.3 生成前先校验

```bash
guanvis genid <count>     # 官方 ID 生成器
```

或本地用稳定 ID 生成器，必须自检：
- 长度 = 24
- `^[a-z0-9]{24}$`
- 页面内唯一
- 不跨 custom chart 复用

---

## §7 selector → custom chart dataView 联动补丁

### §7.1 问题：DSL 的 linkToAll 联不上 HTML 模块

`guanvis` 的 `.linkToAll()` 只会把 selector 联到 **普通图表卡** 的同名字段 zone，**不会** 把 custom chart 内部的 dataView 暴露成 selector 目标。

实测现象：

- 页面已有 6 个 HTML 模块。
- HTML 模块背后已有 `HTML-*数据` dataView。
- selector 的 `settings.asFilter.targetCdIds` 仍然只包含旧标准图表卡。
- 在 selector 脚本里写 `.linkTo(16)` 也无效——custom chart 没有同名字段 zone 可匹配。

回读片段：

```bash
guancli card get <selector_id> --raw \
  | jq '.response.settings.asFilter.targetCdIds'
```

```json
["<html-dv-1>", "<html-dv-2>", ...]
# 没有 HTML dataView ID
```

### §7.2 解法：导入包级 patch

绕开 DSL，直接改 `descriptor.json` 里的 `meta.card.settings.asFilter`：

```text
1. guanvis pack .                           # 打包
2. unzip <pkg>.zip -d /tmp/pkg                    # 解压
3. node scripts/patch_selector_linkage.js \      # patch
     --descriptor /tmp/pkg/descriptor.json \
     --selector 城市:<fdId-城市> \
     --selector 门店类型:<fdId-门店类型> \
     --targets <html_dataview_id1>,<html_dataview_id2>,...
4. cd /tmp/pkg && zip -r /tmp/patched.zip .       # 重新打包
5. guanvis upload /tmp/patched.zip          # 上传
```

### §7.3 patch 的字段映射

对 `城市` selector（<demo-domain> 实例样本）：

```json
{
  "cdId": "<selector-cdId>",
  "dsId": "<dataset-dsId>",
  "fdId": "<fdId-城市>",
  "name": "城市"
}
```

对 `门店类型` selector：

```json
{
  "cdId": "<selector-cdId>",
  "dsId": "<dataset-dsId>",
  "fdId": "<fdId-门店类型>",
  "name": "门店类型"
}
```

`cdId` / `dsId` 是 selector 自己的，`fdId` 是 selector 绑定的字段 ID。脚本要在 `asFilter.targetCdIds` 追加 HTML dataView 卡 ID，并在 `asFilter.columnMappings[].targetFields` 追加 `{ cdId, dsId, fdId }` 字段映射。

### §7.4 不要走的路径

直接调用线上卡片编辑接口：

```bash
guancli fetch GET /api/card/<selector_id>/edit/session
guancli fetch GET /api/card/<selector_id>/edit
```

会返回：

```json
{ "status": 60004, "message": "此操作只能在草稿页面执行" }
```

**结论**：改 selector 联动一律走 descriptor patch + upload，不要走 `/api/card/.../edit/session` 或 `/api/card/.../save`，除非已经明确处在草稿态且自己验证过接口可写。

---

## §8 pack/patch/upload 标准工作流

完整 12 步（HTML 应用看板的发布流水线）：

```text
 1. 读取源页面 / 业务说明
 2. 识别数据集、字段、核心指标
 3. 生成 schema.js（数据集/字段引用）
 4. 生成标准数据卡和 DATA_GRID dataView
 5. 生成 HTML SDK 自定义模块（charts/html_*.html + .js）
 6. 落 templates/html-dashboard/charts/html_common.js + html_base.css
 7. 生成 page.js（只放 HTML 可见模块 + 原生 selector）
 8. guanvis preview         # 本地结构校验
 9. guanvis pack             # 打 tarball
10. patch_selector_linkage.js     # §7 注入 selector 联动
11. guanvis upload patched.zip
12. 四层回读验收（见 §11）
```

### §8.1 zsh 兼容性

不要写裸 glob 删除：

```bash
rm -f ./*.zip       # zsh 下报 "no matches found"
```

改用 `find -delete`：

```bash
find . -maxdepth 1 -name "*.zip" -delete
```

或 `noglob rm -f ./*.zip`。

### §8.2 pack 输出名不固定

`guanvis pack` 在某些目录下输出 `._package.zip`（不是预期的 `<dir>_package.zip`）。**不要硬编码包名**：

```bash
zip_path=$(find . -maxdepth 1 -type f -name "*.zip" -print -quit)
mv "$zip_path" /tmp/majia_html_linkage_patch.zip
```

---

## §9 字段名兼容（粒度后缀）

DSL 里写：

```javascript
.addRow(field(DS_MONTHLY, "月份", { granularity: Granularity.MONTH }))
```

但 `card preview -f json` 回来的字段名带粒度后缀：

```json
{ "月份 (月)": "2022-03" }
```

如果 HTML JS 写死 `row["月份"]`，趋势模块就会空。

**统一在 GDHTML.col / 业务层做兼容**：

```javascript
function monthOf(row) {
  return row["月份"] || row["月份 (月)"] || row["年月"] || "";
}
```

涉及日期粒度的 HTML 模块都要兼容这些别名：

```text
日期 / 日期 (日)
月份 / 月份 (月) / 年月 / year_month
季度 / 季度 (季)
年份 / 年份 (年)
```

`GDHTML.col(cols, name)` 内部按这张候选表逐个尝试。

---

## §10 guancli 命令面（V2.1 现行）

### §10.1 card preview 替代 card data --pg-id

旧心智：

```bash
guancli card data <id> --pg-id <pg_id>   # 不存在
```

当前真实命令（V2.1）：

```bash
guancli --profile <demo-domain> card preview <cd_id> --limit 1 --raw
guancli --profile <demo-domain> card preview <cd_id> -f json
guancli card preview <cd_id> --filter '城市 EQ 上海' -f json
guancli card preview <cd_id> --filter '门店类型 EQ 交通枢纽店' -f json
```

### §10.2 返回结构兼容 `.data` 和 `.response`

不同子命令的根结构不一致：

| 命令 | 根字段 |
|---|---|
| `page get --raw` | `.data` |
| `card get --raw` | `.response` |
| `card preview --raw` | 直接是数组或 `.response` |

统一在 jq 里写兼容选择：

```bash
ROOT='.data // .response // .'
guancli page get <pg_id> --raw | jq "$ROOT.cards | length"
guancli card get <cd_id> --raw | jq "$ROOT.settings"
```

### §10.3 settings 可能是 object 也可能是 JSON string

资源包 `descriptor.json` 的 `card.settings` 是 JSON 字符串，但线上 `card get --raw` 回来的 `settings` 已经是对象。jq 兼容：

```jq
if (.settings|type)=="string" then (.settings|fromjson) else .settings end
```

JS patch 脚本：

```javascript
function readSettings(card) {
  if (!card.settings) return {};
  return typeof card.settings === "string"
    ? JSON.parse(card.settings)
    : card.settings;
}

function writeSettings(card, settings) {
  card.settings = JSON.stringify(settings);   // 写回 descriptor 时必须 stringify
}
```

### §10.4 中文字段 jq 用 bracket 语法

```bash
jq -r '.[0].销售额'        # ❌ jq: syntax error, unexpected INVALID_CHARACTER
jq -r '.[0]["销售额"]'      # ✅
```

所有中文字段统一用 `["字段名"]`。

---

## §11 验收清单（四层）

`guanvis upload` succeeded 不等于看板做对了。**API 验收必须是主验收，浏览器截图只作辅助**（Chrome 截图在 iframe / GPU 渲染 / 系统截图权限下会黑屏，不可靠）。

### §11.1 第一层：打包验收

- [ ] `guanvis preview` 通过（本地结构校验）
- [ ] `guanvis pack` 产物可解压、`descriptor.json` 可被 patch 脚本读懂
- [ ] `guanvis upload patched.zip` 返回 `N succeeded, 0 failed`

### §11.2 第二层：Page 卡片清单

```bash
guancli page get <pg_id> --raw | jq "$ROOT.cards | length"
guancli page get <pg_id> --raw | jq "$ROOT.cards[].name" | grep "HTML"
```

- [ ] 卡片总数符合预期（实测样例 41 张）
- [ ] 6 个 HTML 可见模块名都存在

### §11.3 第三层：custom chart 内容

```bash
guancli card get <html_card_id> --raw | jq "$ROOT.settings"
```

- [ ] `content.script` 非空、含 mount 调用
- [ ] `content.html` 含模板 root 节点
- [ ] `dataViews` 数量正确

### §11.4 第四层：dataView 出数 + selector 联动

```bash
# dataView 取数验证
guancli card preview <data_view_id> -f json
guancli card preview <data_view_id> --filter '城市 EQ 上海' -f json
guancli card preview <data_view_id> --filter '门店类型 EQ 交通枢纽店' -f json

# selector 联动验证
guancli card get <selector_id> --raw \
  | jq "$ROOT.settings.asFilter.targetCdIds | length"
guancli card get <selector_id> --raw \
  | jq "$ROOT.settings.asFilter.targetCdIds" \
  | grep <html_dataview_id>
```

- [ ] 全量取数有值（实测样例：销售额 `~7.37 亿（粗粒度，原始精确值已脱敏）`）
- [ ] `城市 EQ 上海` 过滤后值变小（实测样例：`~6800 万`）
- [ ] `门店类型 EQ 交通枢纽店` 过滤后值变小（实测样例：`~9700 万`）
- [ ] selector `targetCdIds` 长度从 11 扩到 22（含 HTML dataView）
- [ ] selector `columnMappings[0].targetFields` 包含正确的 `fdId`

---

## §12 常见错误表

| 错误 / 现象 | 原因 | 修法 |
|---|---|---|
| `Card ID must be exactly 24 alphanumeric characters, got 25` | ID 长度不是 24 | `guanvis genid` 或本地稳定生成器，自检 `^[a-z0-9]{24}$` |
| `Custom chart ID must be exactly 24 alphanumeric characters` | 同上 | 同上 |
| `resource ID 'xxx' is already used by ...` | dataView 被多个 custom chart 复用 | 每个 custom chart 独占 dataView，字段相同也要分两张卡 |
| selector 切换后 HTML 模块不响应 | `linkToAll` 没联到 custom chart 内部 dataView | 跑 §7 的 patch_selector_linkage.js |
| `/api/card/.../edit/session` 报 `60004 此操作只能在草稿页面执行` | 直接改线上卡片不可行 | 改走 pack/descriptor patch/upload |
| `fromjson` 报 `object only strings can be parsed` | settings 已是对象 | jq / JS 同时兼容 string / object（见 §10.3）|
| 趋势图月份列全空 | 字段名是 `月份 (月)` | 前端按 §9 兼容粒度后缀 |
| `card data --pg-id` 不存在 | guancli 命令面已变 | 改用 `card preview <id>`（§10.1）|
| `jq: syntax error, unexpected INVALID_CHARACTER` | 中文字段用点语法 | 改用 `["字段名"]` 语法（§10.4）|
| `zsh: no matches found: ./*.zip` | zsh 裸 glob | `find . -name "*.zip" -delete` 或 `noglob`（§8.1） |
| `Package saved to ._package.zip` | pack 输出名不固定 | 用 `find ... -print -quit` 动态发现（§8.2） |
| Chrome 截图黑屏 | 截图链路不可靠 | 以 API 回读 + dataView 出数为主验收（§11） |
| HTML 模块加载但页面空 | `data[0]` 不存在 | 用 `GDHTML.safeCols(data, N)` 而非直接索引 |

---

## §13 模板包索引

本 skill V2.1.1 起，模板落在：

```text
templates/html-dashboard/
├─ charts/
│  ├─ html_common.js          — GDHTML 共享 runtime（§5.4 完整实现）
│  ├─ html_base.css           — 共享样式（卡片底色、字体、间距、SVG 配色）
│  ├─ html_executive.html / .js   — 经营驾驶舱（KPI + 城市 + 门店）
│  └─ html_trend.html / .js       — 月度渠道趋势（折线 + 堆叠柱）
├─ scripts/
│  └─ patch_selector_linkage.js   — §7 实测可用脚本（CLI 参数化版）
└─ README.md                       — 模板使用说明
```

复制起手：

```bash
SKILL_DIR=~/.claude/skills/majia-guanyuan   # 或对应 agent 的安装路径
cp -r "$SKILL_DIR/templates/html-dashboard/charts" ./my-page/
cp "$SKILL_DIR/templates/html-dashboard/scripts/patch_selector_linkage.js" ./my-page/scripts/
```

剩下 4 个 HTML 模块（city / matrix / structure / actions）按 executive / trend 的形式扩出来——data contract、mount 调用、SVG 渲染都同构。

---

## §14 与 Part C 其他章节的关系

- **C-1 ~ C-11**（既有内容）：处理"既有页面的 HTML/JS 注入 hack" —— 注入卡、overlay、固定卡片、payload_json、z-index、路由清理。
- **C-12（本章）**：处理"从零生成 HTML 应用看板" —— 不 hack 既有页，而是用 guanvis 的 DSL 全量生成 page + custom charts + dataViews。

两条线工具不同（C-11 是 runtime DOM hack，C-12 是发布期 DSL + descriptor patch），但都共享：

- runtime 契约 `renderChart(data, ...)`（C-2）
- payload / dataView 取数模型（C-3 / 本章 §4）
- 浏览器验证 + API 验证双轨（C-9 / 本章 §11）

---

## §15 一句话总结

观远 BI 可以被自动生成成 "HTML 化分析应用"，**最稳架构是：原生 Page + 原生 selector + HTML SDK 可见层 + DATA_GRID dataView 数据层**。`guanvis` 当前 DSL 还不能自动把 selector 联到 custom chart 内部 dataView，必须走资源包级 descriptor patch（§7）。这条路实测跑通且比直接 `/api/card/.../edit` 稳定，已经固化为 V2.1.1 起的高级看板默认策略。
