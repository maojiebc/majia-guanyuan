你是一个BI专家, 当前在查看如下的一个可视化页面(包含一个或多个卡片)

(注: 关于layout, w代表宽度, 并最多12列; 布局各个组件时, 每行最好占满)

下面是页面的具体信息:

页面标题: 外卖业绩近30天GMV增长情况
页面ID: uf0243c3cc9958f1da65976f
页面类型: PAGE
父目录ID: n54e6884410c345328f1b528
目录路径: 根目录 / 马甲的模拟看板 / 外卖业绩近30天GMV增长情况
创建时间: 2026-05-23 13:36:37+0800
更新时间: 2026-06-22 09:51:25+0800
看板用于回答：近 30 天外卖三大子渠道（美团/饿了么/自有App）GMV 整体规模、对比上 30 天的增长情况、日趋势、渠道结构与门店头部排名。目标用户：经营管理层、外卖业务负责人。
UniformResourceType: DATA_ANALYSIS_PAGE


# Card 1: 看板说明

**ID:** i8423e050be5a70560ea8630

**Type:** TEXT

**位置:** 页面画布

**Layout:** {"h":3,"w":12,"x":0,"y":0}




# Card 2: 近30天外卖GMV

**ID:** kd79843c8959f11d9cc4c8e2

**Type:** KPI_CARD

**位置:** 页面画布

**Description:** 业务故事：监控外卖三大子渠道近 30 天的原价 GMV（流水金额），并对比上 30 天看增长趋势。指标口径：原价金额合计，含已完成订单，三个子渠道：美团/饿了么/自有App。

**Layout:** {"h":4,"w":4,"x":0,"y":3}



## 字段格式化信息

** 近30天GMV**
  - specifier: ,.2f
  - prefixUnit: 万
  - divideDataBy: 10000


** 上30天GMV**
  - specifier: ,.2f
  - prefixUnit: 万
  - divideDataBy: 10000



## Malloy 查询语法
```malloy
run: j23ea7e60564e47458b71d82 -> {
  where: q8bcdcb5972be465dad9d2a1 ? '外卖-美团' | '外卖-饿了么' | '外卖-自有App' and idccb0a9eb4e64903941b6d8 >= '2026-03-22' and idccb0a9eb4e64903941b6d8 <= '2026-05-20'
  aggregate:
    `近30天GMV` is sum(case when `业务日期` between date('2026-04-21') and date('2026-05-20') then `原价金额` else 0 end),
    `上30天GMV` is sum(case when `业务日期` between date('2026-03-22') and date('2026-04-20') then `原价金额` else 0 end)
}
```

# Card 3: 近30天外卖订单数

**ID:** k0086d8aa6a519265a0939c1

**Type:** KPI_CARD

**位置:** 页面画布

**Description:** 业务故事：监控外卖三大子渠道近 30 天的订单数（已完成订单），并对比上 30 天看增长趋势。指标口径：订单ID 去重计数。

**Layout:** {"h":4,"w":4,"x":4,"y":3}



## 字段格式化信息

** 近30天订单数**
  - specifier: ,.0f


** 上30天订单数**
  - specifier: ,.0f



## Malloy 查询语法
```malloy
run: j23ea7e60564e47458b71d82 -> {
  where: q8bcdcb5972be465dad9d2a1 ? '外卖-美团' | '外卖-饿了么' | '外卖-自有App' and idccb0a9eb4e64903941b6d8 >= '2026-03-22' and idccb0a9eb4e64903941b6d8 <= '2026-05-20'
  aggregate:
    `近30天订单数` is count(distinct case when `业务日期` between date('2026-04-21') and date('2026-05-20') then `订单ID` end),
    `上30天订单数` is count(distinct case when `业务日期` between date('2026-03-22') and date('2026-04-20') then `订单ID` end)
}
```

# Card 4: 近30天外卖客单价

**ID:** e9880bdac7fbb00c0285b18a

**Type:** KPI_CARD

**位置:** 页面画布

**Description:** 业务故事：客单价 = 近 30 天外卖 GMV / 订单数，反映单笔订单贡献。指标口径：原价金额合计 / 订单ID 去重计数。

**Layout:** {"h":4,"w":4,"x":8,"y":3}



## 字段格式化信息

** 近30天客单价**
  - specifier: $,.1f
  - prefix: ¥


** 上30天客单价**
  - specifier: $,.1f
  - prefix: ¥



## Malloy 查询语法
```malloy
run: j23ea7e60564e47458b71d82 -> {
  where: q8bcdcb5972be465dad9d2a1 ? '外卖-美团' | '外卖-饿了么' | '外卖-自有App' and idccb0a9eb4e64903941b6d8 >= '2026-03-22' and idccb0a9eb4e64903941b6d8 <= '2026-05-20'
  aggregate:
    `近30天客单价` is sum(case when `业务日期` between date('2026-04-21') and date('2026-05-20') then `原价金额` else 0 end) / nullif(count(distinct case when `业务日期` between date('2026-04-21') and date('2026-05-20') then `订单ID` end), 0),
    `上30天客单价` is sum(case when `业务日期` between date('2026-03-22') and date('2026-04-20') then `原价金额` else 0 end) / nullif(count(distinct case when `业务日期` between date('2026-03-22') and date('2026-04-20') then `订单ID` end), 0)
}
```

# Card 5: 近30天外卖GMV日趋势（按子渠道）

**ID:** lda768ecad5cb0f5d248b1ab

**Type:** MULTI_LINE

**位置:** 页面画布

**Description:** 业务故事：直观查看近 30 天外卖三大子渠道日 GMV 走势，识别增长拐点与渠道间差异。指标口径：原价金额合计，按业务日期 + 销售渠道下钻。

**Layout:** {"h":7,"w":12,"x":0,"y":7}



## 字段格式化信息

**GMV 原价金额**
  - specifier: ,.2f
  - prefixUnit: 万
  - divideDataBy: 10000



## Malloy 查询语法
```malloy
run: j23ea7e60564e47458b71d82 -> {
  where: q8bcdcb5972be465dad9d2a1 ? '外卖-美团' | '外卖-饿了么' | '外卖-自有App' and idccb0a9eb4e64903941b6d8 >= '2026-04-21' and idccb0a9eb4e64903941b6d8 <= '2026-05-20'
  group_by:
    `业务日期`,
    `销售渠道` // from column
  aggregate:
    GMV is sum(`原价金额`)
}
```

# Card 6: 外卖子渠道GMV占比

**ID:** p721368669515f3d3faf4e83

**Type:** PIE

**位置:** 页面画布

**Description:** 业务故事：近 30 天美团/饿了么/自有 App 三大外卖子渠道的 GMV 结构占比，反映渠道依赖度。指标口径：原价金额合计。

**Layout:** {"h":8,"w":6,"x":0,"y":14}



## 字段格式化信息

**GMV 原价金额**
  - specifier: ,.2f
  - prefixUnit: 万
  - divideDataBy: 10000



## Malloy 查询语法
```malloy
run: j23ea7e60564e47458b71d82 -> {
  where: q8bcdcb5972be465dad9d2a1 ? '外卖-美团' | '外卖-饿了么' | '外卖-自有App' and idccb0a9eb4e64903941b6d8 >= '2026-04-21' and idccb0a9eb4e64903941b6d8 <= '2026-05-20'
  group_by:
    `销售渠道`
  aggregate:
    GMV is sum(`原价金额`)
}
```

# Card 7: 外卖GMV门店Top10

**ID:** xd1b09a0313a26e6faf61860

**Type:** BASIC_BAR

**位置:** 页面画布

**Description:** 业务故事：近 30 天外卖 GMV 门店 Top10，识别外卖头部门店、为渠道资源倾斜提供依据。指标口径：原价金额合计，按门店ID 聚合。

**Layout:** {"h":8,"w":6,"x":6,"y":14}



## 字段格式化信息

**GMV 原价金额**
  - specifier: ,.2f
  - prefixUnit: 万
  - divideDataBy: 10000



## Malloy 查询语法
```malloy
run: j23ea7e60564e47458b71d82 -> {
  where: q8bcdcb5972be465dad9d2a1 ? '外卖-美团' | '外卖-饿了么' | '外卖-自有App' and idccb0a9eb4e64903941b6d8 >= '2026-04-21' and idccb0a9eb4e64903941b6d8 <= '2026-05-20'
  group_by:
    `门店ID`
  aggregate:
    GMV is sum(`原价金额`)
  order_by: `原价金额` desc
}
```


---

## 血缘关系

### 上游资源 (1)
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
