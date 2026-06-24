我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: l6ee75fc812be413583215e4
- 数据集名称: dws_单店利润月汇总
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_单店利润月汇总
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 4661 行
- 字段列数: 40 列

## 时间信息
- 创建时间: 2026-05-21 14:41:24+0800
- 更新时间: 2026-05-21 14:41:25+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 40
- **普通字段**: 40 个
- **计算字段**: 0 个
- **维度字段**: 13 个
- **度量字段**: 27 个

### 字段列表

- 门店ID (fdId: q47c3ba0198494654809060b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: g4486500027864d44b982ed2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: h3439e2808a9a4a1e92b784e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: n8f1a1b2abd7f4f7eab47e52)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: nfd16fc21a0594f5f80d1b89)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: k14653ac828d74dd49f2003b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商圈 (fdId: f5e1a4ad761204c6e96cb1f2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 品牌线 (fdId: w7997b3a8ed3a4eb08e61ed7)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 直营加盟类型 (fdId: obf73dc3c2f6147dc975d8a4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否90天内新店 (fdId: x1cd6e544254f424f852741c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 新店标签 (fdId: l85070385d27641f4810b230)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 开业日期 (fdId: j78bdc5cbfe1446fe8c7a1f4)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: u94dfb7bab3474ca2a6b83a1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月营收 (fdId: bedd10d2d3bb44b929a6aaec)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食营收 (fdId: v797c07ce10494cb692c6d8c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖营收 (fdId: i26a3cb200bf74b5f861cd0b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 订单数 (fdId: p3877c87085b742f6bc02be2)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 原材料成本 (fdId: f9f557d86d6d747f291583f6)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 包材成本 (fdId: k9e475ee5d9124131a7e2b0f)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平台抽佣 (fdId: m3116c5a4f2094bb9a073ad0)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 人工成本 (fdId: p089b2745a470425db86d1ef)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 房租物业 (fdId: o141c823ff99143f3866b4e8)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 能耗水电 (fdId: gdb53687858964bab894254d)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 设备折旧 (fdId: lb6baba34866743d683db479)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总部分摊 (fdId: k4b07ac870243406f92d38f1)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 变动成本合计 (fdId: s5ea9658c1a9f44ca9f1da79)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 半固定成本合计 (fdId: f3b916ec1d78944df8e76878)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 固定成本合计 (fdId: m20bf9f73c8b34d9fb74c15a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 成本总计 (fdId: v51b0d8c3de1e45ebbc81af4)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利 (fdId: w67f99e6c1fc94059b557e18)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 店面贡献利润 (fdId: wa46efb97359c4cdba95e526)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 单店净利润 (fdId: q25164649d5f4434c8e5df00)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利率 (fdId: t23de46329441410e94a7b1d)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 店面贡献利润率 (fdId: m4b3358c2aa224771949945b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 单店净利率 (fdId: t2f625309b6d449f9a7483e4)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 堂食占比 (fdId: bd6dd4222337341e79f8fabf)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖占比 (fdId: u1b3344fcdd844ff29270038)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 人工占比 (fdId: ie4906d3a37004363bb9d3f9)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 房租占比 (fdId: f6fba846a661c410f9d1ada5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 客单价 (fdId: jb75194c3c4154771b0f65ba)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_单店利润月汇总` is table('l6ee75fc812be413583215e4') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 门店类型 (STRING)
  //   - 商圈 (STRING)
  //   - 品牌线 (STRING)
  //   - 直营加盟类型 (STRING)
  //   - 是否90天内新店 (STRING)
  //   - 新店标签 (STRING)
  //   - 开业日期 (DATE)
  //   - 月份 (STRING)
  //   - 月营收 (DOUBLE)
  //   - 堂食营收 (DOUBLE)
  //   - 外卖营收 (DOUBLE)
  //   - 订单数 (LONG)
  //   - 原材料成本 (DOUBLE)
  //   - 包材成本 (DOUBLE)
  //   - 平台抽佣 (DOUBLE)
  //   - 人工成本 (DOUBLE)
  //   - 房租物业 (DOUBLE)
  //   - 能耗水电 (DOUBLE)
  //   - 设备折旧 (DOUBLE)
  //   - 总部分摊 (DOUBLE)
  //   - 变动成本合计 (DOUBLE)
  //   - 半固定成本合计 (DOUBLE)
  //   - 固定成本合计 (DOUBLE)
  //   - 成本总计 (DOUBLE)
  //   - 毛利 (DOUBLE)
  //   - 店面贡献利润 (DOUBLE)
  //   - 单店净利润 (DOUBLE)
  //   - 毛利率 (DOUBLE)
  //   - 店面贡献利润率 (DOUBLE)
  //   - 单店净利率 (DOUBLE)
  //   - 堂食占比 (DOUBLE)
  //   - 外卖占比 (DOUBLE)
  //   - 人工占比 (DOUBLE)
  //   - 房租占比 (DOUBLE)
  //   - 客单价 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_单店利润月汇总 (11节点·F+C+G+S×2+J+C)** (DATA_PROCESS_ETL)
  - ID: b4a8c005f26f3a6092d6d4b5

### 下游资源 (6)
- **etl_dws_加盟商经营汇总 (7节点·S+J+C)** (DATA_PROCESS_ETL)
  - ID: h6494295926ddfddc3bc9575
- **etl_dws_加盟回本测算 (9节点·S×3+J+C)** (DATA_PROCESS_ETL)
  - ID: n844deaa4fe2957780f0f542
- **etl_ads_单店利润健康 (6节点·J+C+S)** (DATA_PROCESS_ETL)
  - ID: r6e540f679bb0a514080e509
- **etl_ads_加盟商单店报告 (9节点·S+J×2+C)** (DATA_PROCESS_ETL)
  - ID: s951c54cfa317c9e7e17524a
- **09-总览(ECharts重构)** (DATA_ANALYSIS_PAGE)
  - ID: q1b7aa4885f342775e4d4507
- **09-总览(ECharts重构)** (DATA_ANALYSIS_PAGE)
  - ID: q1b7aa4885f342775e4d4507_draft
