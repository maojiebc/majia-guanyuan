# 门店手机成绩单 · 脱敏离线案例

给加盟店老板看的手机成绩单样本。和桌面看板不是同一张页，也不是把桌面缩小。

**V1 版**（2026-09-14 封存）：单卡内滚动，19 个 DATA_GRID，不取 RFM，外卖色 `#FFD100`。不要为了切店先出营业额拆成两张卡。

经验总结（产品规则、19 视图契约、换店滤空、列名识别、对比不写家数、发布链路）：

[`references/part-c-store-mobile-scorecard.md`](../../references/part-c-store-mobile-scorecard.md)

## 打开

双击 `store-mobile-scorecard.html`，或：

```bash
open examples/store-mobile-scorecard/store-mobile-scorecard.html
```

不需要观远、不需要登录、没有网络请求。页顶横条写明：虚构门店、虚构数字、锚点冻在 2026-03-20。

生产页用页面筛选器换店。本样本用页内「示例镇中店 / 示例城南店」代替，方便离线看换店后数字一起变。

## 重新生成

改 `scorecard.js` / `scorecard.css` / `build.mjs` 之后：

```bash
node examples/store-mobile-scorecard/build.mjs
```

生成器会自检：除 RFM 外的视图都能按列名识别（`detectV.rfm === -1`）；昨天合计 ≠ 近 7 天日均；两店数字不同；会员频次高于非会员且两店不同；对比组够 3 家（只用于算名次，页面不展示家数）。

## 点击清单

打开后按这个表点一遍，每一项都应该仍有数：

1. 两店切换（店名、首屏、顾客、私域、商品一起变）
2. 昨天 / 近 7 天 / 近 30 天 / 本月
3. 每日明细
4. 堂食、外卖下钻
5. 近 30 天折线滑块、近 8 周柱
6. 跟其他门店比三张卡 + 弹层（看不见家数、看不见其他店名）
7. 顾客与会员（消费会员跟周期去重、新老客条、当前状态）
8. 会员和非会员（一级模块：人均贡献 + 右侧客单价，下方只有组内营业额）
9. 私域 KPI + 哪些券用得最多（一级模块，不折叠）
10. 饭点条（在热销上面）+ 热销展开、汤底堂食/外卖
11. 口径说明

## 不要用它做什么

不要把这个 HTML 当成 guanvis 工程去 `pack` / `upload`。上线仍是：原生 Page + 门店筛选器 + HTML 父卡 + 19 个 DATA_GRID + 必要时补 `phoneLayout`。
