你是一个BI专家, 当前在查看如下的一个可视化页面(包含一个或多个卡片)

(注: 关于layout, w代表宽度, 并最多12列; 布局各个组件时, 每行最好占满)

下面是页面的具体信息:

页面标题: 09-总览(ECharts重构)
页面ID: q1b7aa4885f342775e4d4507
页面类型: PAGE
父目录ID: n54e6884410c345328f1b528
目录路径: 根目录 / 马甲的模拟看板 / 09-总览(ECharts重构)
创建时间: 2026-05-21 15:55:53+0800
更新时间: 2026-06-22 09:51:20+0800

UniformResourceType: DATA_ANALYSIS_PAGE


# Card 1: 总览 (ECharts 重构)

**ID:** u83cd012dd3d7403d6e1eb8e

**Type:** CUSTOM

**位置:** 页面画布

**Layout:** {"h":32,"w":12,"x":0,"y":0}




# Card 2 [未布局/未知位置]: KPI 汇总

**ID:** e6546627ed02e2b61476cd2d

**Type:** DATA_GRID

**位置:** 未布局/未知位置




## Malloy 查询语法
```malloy
run: l6ee75fc812be413583215e4 -> {
  group_by:
    `直营加盟类型`
  aggregate:
    `月营收` is sum(`月营收`),
    `订单数` is sum(`订单数`),
    `店面贡献利润` is sum(`店面贡献利润`),
    `店面贡献利润率` is avg(`店面贡献利润率`),
    `堂食占比` is avg(`堂食占比`),
    `客单价` is avg(`客单价`),
    `门店ID` is (`门店ID`)
}
```

# Card 3 [未布局/未知位置]: 月度趋势

**ID:** fe6116023890e61cba683364

**Type:** DATA_GRID

**位置:** 未布局/未知位置




## Malloy 查询语法
```malloy
run: l6ee75fc812be413583215e4 -> {
  group_by:
    `月份`
  aggregate:
    `月营收` is sum(`月营收`),
    `堂食营收` is sum(`堂食营收`),
    `外卖营收` is sum(`外卖营收`),
    `店面贡献利润` is sum(`店面贡献利润`),
    `店面贡献利润率` is avg(`店面贡献利润率`)
}
```

# Card 4 [未布局/未知位置]: 城市效能对比

**ID:** k778a0da7978aad6d142ce8a

**Type:** DATA_GRID

**位置:** 未布局/未知位置




## Malloy 查询语法
```malloy
run: l6ee75fc812be413583215e4 -> {
  group_by:
    `城市`
  aggregate:
    `月营收` is sum(`月营收`),
    `店面贡献利润` is sum(`店面贡献利润`),
    `店面贡献利润率` is avg(`店面贡献利润率`),
    `堂食占比` is avg(`堂食占比`),
    `门店ID` is (`门店ID`)
}
```

# Card 5 [未布局/未知位置]: 门店类型分布

**ID:** h498a740e650579279773402

**Type:** DATA_GRID

**位置:** 未布局/未知位置




## Malloy 查询语法
```malloy
run: l6ee75fc812be413583215e4 -> {
  group_by:
    `门店类型`
  aggregate:
    `月营收` is sum(`月营收`),
    `店面贡献利润` is sum(`店面贡献利润`),
    `店面贡献利润率` is avg(`店面贡献利润率`),
    `堂食占比` is avg(`堂食占比`),
    `客单价` is avg(`客单价`),
    `门店ID` is (`门店ID`)
}
```

# Card 6 [未布局/未知位置]: 城市层级月份

**ID:** o94a91e7047991342103f63f

**Type:** DATA_GRID

**位置:** 未布局/未知位置




## Malloy 查询语法
```malloy
run: l6ee75fc812be413583215e4 -> {
  group_by:
    `城市层级`,
    `月份`
  aggregate:
    `月营收` is sum(`月营收`),
    `店面贡献利润` is sum(`店面贡献利润`)
}
```

# Card 7 [未布局/未知位置]: 门店标杆

**ID:** s8b2be6200d4550a49c3adf9

**Type:** DATA_GRID

**位置:** 未布局/未知位置




## Malloy 查询语法
```malloy
run: l6ee75fc812be413583215e4 -> {
  group_by:
    `门店名称`,
    `城市`,
    `门店类型`
  aggregate:
    `月营收` is sum(`月营收`),
    `店面贡献利润` is sum(`店面贡献利润`),
    `店面贡献利润率` is avg(`店面贡献利润率`)
}
```


---

## 血缘关系

### 上游资源 (1)
- **dws_单店利润月汇总** (DATA_SET_ETL)
  - ID: l6ee75fc812be413583215e4
