# 主文下沉记录

以下规则从 v3.3.0 路由主文完整迁移，仅调整相对链接及脱敏环境代称。旧版本修复、绕过方案和 API 经验是历史记录；优先按当前官方 Skill 与主文硬边界处理，不能用它覆盖本轮只读授权或自动删除重建。

# 🆎 Part C：自定义图表开发与排障（V1.1 新增）

> **并行参考（V2.0 标注）**：观远 maintainer wubaoqi 在 2026-04-29 发布了 `@wubaoqi/guan-chart-kit`（React + ECharts 组件库，专为观远 BI 设计）和 `@wubaoqi/guan-chart-kit-usage-skill`（agent-skill，教 SuperApp 接 chart-kit）。两条路线区别：
> - **chart-kit 路线**（wubaoqi）：从零搭新看板，走**组件接入** + npm 依赖管理，适合标准化复用
> - **本 Part C 路线**：在既有卡片上做 HTML/CSS/JS 注入 hack，绕过组件直接改 DOM/data，适合改造既有页面、临时 overlay、固定卡片
>
> 两者互补，按"是新搭还是改造"分流。

> 来源：观远 CTO 张进的自定义图表注入实战经验。涵盖 HTML/CSS/JS 注入、runtime 取数、固定卡片、遮罩层、z-index/stacking context、路由清理，以及任何**必须在真实观远页面里做浏览器验证**的前端问题。

## C-〇. 何时用 Part C

任务涉及观远 BI **自定义图表**的：
- 前端代码（HTML/CSS/JS）
- 运行时取数（`renderChart` 的 `data` 参数解析）
- 页面级 DOM 操作（固定卡片、overlay、mask）
- 浏览器层级问题（z-index、stacking context、pointer-events）
- 路由切换清理、复制页 card id 重定位
- 懒加载导致脚本不执行
- 必须在真实页面验证的问题

不用 Part C 的情况：只是在观远 UI 里点几下做卡片配置，不写代码 → 走路由层（标准建卡交 guanvis）。

## C-1. 快速开始原则（6 条）

1. **要注入 HTML/CSS/JS** → 用「自定义图表」，不用「自定义图表 Lite」
2. **先在真实观远页面复现问题，再改代码**
3. **先确认 live 页实际运行的是哪份脚本**，再判断问题
4. **脚本开始漂移或多次局部修补失效时，优先给完整 JS**，不要继续发零碎 diff
5. **每次结构性修改后回浏览器重新验证**
6. **遇到取数问题，先看 `GDPlugin().init(renderChart)` 的 runtime 入参**，不要先假设它等于 `/api/card/.../data` 的 HTTP 包裹层

## C-2. runtime 契约（必须知道）

观远当前的 runtime 回调签名是：

```javascript
function renderChart(data, clickFunc, config, helpers) {}
```

⚠️ **常见误解**：
- ❌ 把第一个参数 `data` 当 DOM 根节点 —— 错。要自己从 `document.querySelector(...)` 或 `document.body` 获取 DOM。
- ✅ `helpers` 常见为 `{ refreshData, clickFunc }`

`data` 形态多变，常见 5 种：

```javascript
// 形态 1（最常见）
[
  [
    { name: "payload_json", data: ["{...}"] },
    { name: "report_date", data: ["2026-03-18"] }
  ]
]

// 形态 2
[{ name, data }, ...]

// 形态 3
{ chartMain: { columns: [...] } }

// 形态 4
{ response: { viewData: [...] } }

// 形态 5
[{ payload_json, report_date }]
```

**结论**：优先围绕 runtime `data` 写解析逻辑。`/api/card/.../data` 只用于核对证据，不要把它当 callback 结构直接照搬。

## C-3. payload_json 取数排障（速查）

📖 **[references/part-c-payload-json.md](../references/part-c-payload-json.md)** — 三种"拿不到 payload"的细分 / 最快判断方式 / `JSON.parse` 硬规则 / 截断错误（`Unterminated string` / `Unexpected end of JSON input`）的判断 / 推荐方案：拆列而非整包 JSON。

**最简结论**：JSON.parse 失败且报截断错时，**优先判断为数据链路把长字符串截断了**，不要继续堆兼容解析逻辑。改数据方案——把整份报告拆成多列（`report_date` / `key_insights_md` / 各 section 列）传给前端，比 runtime 再 `JSON.parse(payload_json)` 稳得多。

## C-4. 固定卡片 / overlay 场景

### C-4.1 保守做法

- ✅ **只移动目标卡片内容**，不要把整页都抽进 overlay
- ✅ overlay 和 mask **挂到当前页面根节点**，**不要挂到 `body`**
  - 挂到 body 的后果：切页后残留 / 与原生浮层打架 / 跟右侧锚点导航层级冲突
- ✅ overlay 的 z-index 要够用，但**不能压过观远原生导航、浮层、工具条**
- ✅ 卡片尺寸变化时，主动派发 `resize`（立即一次 + 延迟几次）让图表重排

### C-4.2 z-index 基线（已验证）

```text
overlay 容器     约 8
mask            约 1
固定卡项        约 20，按需要递减
```

目标：**高于滚动内容，低于观远原生导航、菜单、工具层。**

### C-4.3 让加载器看得到注入卡，但用户不必看到

- 观远自定义图表 iframe **是懒加载的**
- 注入卡放在首屏以下 → 初次进页时脚本可能根本不执行

**可靠做法**：
1. 把注入卡**放在首屏**
2. 查看态视觉隐藏
3. **编辑态恢复可见**（让用户能找到并编辑）

## C-5. 页面生命周期管理

### C-5.1 必须主动销毁注入物的场景

- URL 不再匹配目标 page id
- 进入编辑态
- 切到 `pageRenderType=phoneView`
- 客户端路由离开当前页

**只在目标桌面查看态重建。**

### C-5.2 复制页面后 card id 全变

- 观远复制页面会生成新的 card id
- 继续使用原页面硬编码 id 通常**不会显式报错，只会悄悄失效**
- 复制页一定要重新确认 card id

### C-5.3 MutationObserver 死循环陷阱

- 监听 `body subtree` 后又在回调里改样式 → 容易反复触发，卡死页面
- ✅ 更稳的做法：低频轮询 + 精准 rect 比较

## C-6. 浏览器排障清单

### C-6.1 改代码前先看 live runtime

检查：
- 当前 URL 和 page id
- `window` 上是否已有旧版注入 key
- `__gd_overlay__` 和 `__gd_overlay_mask__` 是否存在
- 页面里是否留有历史实验节点

### C-6.2 找到真正可点击的 DOM

不要把"看到的文本节点"误当成真正交互节点。对右侧锚点导航，真正有用的目标往往是：
- 打开按钮图标
- tab 按钮
- pin 图标

### C-6.3 用 `elementFromPoint` 查层级问题

控件可见但点不动时，查控件中心点命中的真实元素：
- 命中 fixed card 或 overlay 子节点 → 层级问题
- 命中正确控件但还不工作 → 之前点错节点 / 某个祖先禁用了 pointer events

### C-6.4 最终用真实浏览器点击验收

不要只靠 `page.evaluate(... click())`。要用真实浏览器点击，确认：
- tab 切换是否真的生效
- 页面滚动位置是否真的变化
- pin 状态是否真的切换

## C-7. 保留原生浮动 UI

- ❌ 没必要时，**不要重绘或克隆**观远原生浮动控件
- ✅ 优先修 stacking context、pointer-events、opacity，而不是复制一套控件

原生控件不可点时，按这个顺序排查：
1. overlay 是否盖住它
2. mask 是否拦截事件
3. 祖先节点是否被设成 `pointer-events: none`
4. 原控件是否被历史实验隐藏

## C-8. 交付规则

- ✅ 用户要手工粘贴时，**默认给完整 JS**，不给局部片段
- ✅ 如有需要，同时明确给出 HTML / CSS
- ✅ 脚本不稳定时，完整替换优于局部修改
- ✅ 页面已经完全坏掉时，先给最小恢复版救回来：

```javascript
function renderChart() {}
new GDPlugin().init(renderChart);
```

提醒用户执行：**保存 → 发布 → 强刷查看页**。

## C-9. 最终验收清单

最终一定要在真实页面验证：
- [x] 页面加载
- [x] 查询 / 筛选切换
- [x] 滚动
- [x] 左侧栏展开收起
- [x] 路由切页
- [x] 编辑态进出
- [x] 桌面 / 手机态切换
- [x] 原生浮动控件是否仍可见、可点

## C-11. 深度参考资料

遇到复杂的固定卡片 / overlay / 锚点导航问题时，读：

- [references/custom-chart-playbook.md](../references/custom-chart-playbook.md) — 张进的完整自定义图表排障手册原文（含固定层与真实布局错位修正、右侧原生导航失效详细处理、elementFromPoint 实战、MutationObserver 死循环深入分析）
- [references/etl-rewrite-original.md](../references/etl-rewrite-original.md) — 张进的 SmartETL 改写经验原文（B-17 章节就是基于它整合的，这里是未删减版）

## C-12. HTML 应用化看板生成（V2.1.1 新增）

> **触发**：用户说"更高级 / 更复杂 / 更好 / 应用 / 自定义模块 / 不要限制在标准看板 / 最完美版本 / HTML 看板"——立刻切到这条路线，**不要**按 guanvis 标准 KPI/折线/柱状图套路交付。
>
> **架构**：原生 Page + 原生 selector + HTML SDK 可见层（`createCustomChart().setSubType(CustomChartSubType.SDK).loadContent(...)`）+ DATA_GRID dataView 数据层。后端负责权限/刷新/聚合/筛选，前端负责叙事/布局/SVG-HTML 可视化。
>
> **不能跳的两条坑**（2026-05-14 `app.guandata.com` 上 `<demo-domain>` 实例实测）：
> 1. `guanvis` DSL 的 `.linkToAll()` **不会** 把 selector 联到 custom chart 内部 dataView——必须走 **资源包级 descriptor patch**（不要去调 `/api/card/.../edit/session`，会返回 `60004 此操作只能在草稿页面执行`）。
> 2. `guancli card preview` 的命令面 V2.1 起 **不再有 `--pg-id`**，老写法 `card data <id> --pg-id <pg_id>` 已废弃；同时不同子命令返回根字段不同（`page get → .data`、`card get → .response`），jq 统一写 `.data // .response // .`。

📖 **[references/part-c-html-dashboard.md](../references/part-c-html-dashboard.md)** — 完整方法论 15 节：何时切到 HTML 应用看板 / 总体架构 / SDK vs ECHARTS_LITE 决策 / dataView contract / 共享 runtime API / 24 字符 ID 校验 / selector → custom chart dataView 联动补丁 / 12 步 pack-patch-upload 工作流 / 字段粒度后缀兼容（`月份` / `月份 (月)` / `年月`）/ guancli V2.1 命令面（含 `.data // .response` 兼容）/ **五层验收清单（四层管道 + §11.5 视觉验收）** / 13 类常见错误表 / 模板包索引。

🎨 **视觉设计底线（V3.1.0 新增）**：[references/part-c-design-baseline.md](../references/part-c-design-baseline.md) — 管道通了 ≠ 看板能看。模块第一视觉位=数据判断 / KPI 3-4 个 + 28-32px + 单位/对比基准 / 图表真实性（禁 CSS 假图表）/ token 硬上限 / 反 AI 味红线表（命中即重做）/ `guanvis screenshot` 视觉验收。吸收 design-taste-skills（MIT），覆盖 C-12 / Part D / Part E 三场景。

🧰 **模板包**：[`templates/html-dashboard/`](templates/html-dashboard/) — `charts/html_common.js` (GDHTML runtime) + `html_base.css`（V3.1.0 按设计底线校准）+ 2 个起手模块（executive / trend）+ `scripts/patch_selector_linkage.js`（CLI 参数化，弥补 `linkToAll` 联不到 custom chart dataView 的盲区）。🆕 **guanvis 0.1.29 起官方新增「页面筛选器过滤自定义图表 + custom chart dataView 作点击联动来源」**——新页可先试官方 selector 联动，覆盖到位则此脚本可省；旧版/未覆盖场景仍用兜底（官方能力未净零实测，暂并存）。

**手机成绩单 V2**：新增专供ETL与确定性异常规则、周期明细标题、冻结表头及券转化。沿用单卡结构，见 [V2实践](../references/part-c-store-mobile-scorecard-v2.md) 与 [离线示例](examples/store-mobile-scorecard-v2/README.md)。

📱 **门店手机成绩单（V1 版）**：加盟店老板每天打开的单卡成绩单，不要按本章六模块驾驶舱去堆，也不要把桌面看板缩小。产品规则、19 视图契约、换店滤空、列名识别、对比不写家数、不取 RFM 见 [references/part-c-store-mobile-scorecard.md](../references/part-c-store-mobile-scorecard.md)；可离线点的脱敏 HTML 在 [examples/store-mobile-scorecard/](examples/store-mobile-scorecard/)。

---
