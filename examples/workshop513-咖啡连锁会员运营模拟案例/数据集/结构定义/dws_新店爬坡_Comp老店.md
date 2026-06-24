我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: o88b336d58b5047de98993b1
- 数据集名称: dws_新店爬坡_Comp老店
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_新店爬坡_Comp老店
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 105524 行
- 字段列数: 18 列

## 时间信息
- 创建时间: 2026-05-21 09:20:28+0800
- 更新时间: 2026-05-21 12:18:38+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 18
- **普通字段**: 18 个
- **计算字段**: 0 个
- **维度字段**: 12 个
- **度量字段**: 6 个

### 字段列表

- 门店ID (fdId: e93b7591e759e4ef6a5dc0a3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: bbd127854924d490dad102fa)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: lb97c40fad82142f6a0c1d4b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: h6746abfae66b48dba084616)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店型 (fdId: s9fb930a1077c4a2e9d070cf)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商圈 (fdId: jd8acf5e9d0db426ba915cb9)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 新店标签 (fdId: x103fc1a0d7164e128a9ff90)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否90天内新店 (fdId: s2f594a62589249acb801eb2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 开业日期 (fdId: dcbeb446cf9594c859d42801)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: e2b46cbbe3e4642c1a9e6505)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单数 (fdId: w0a524ce3431642c19ded53b)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 销售额 (fdId: r4bd313149da84e0abfead37)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员订单数 (fdId: wd5b7bfe875bf439fb409db8)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 开业天数 (fdId: g8ed3da059e5c475089be3d4)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 爬坡阶段 (fdId: r60f5008a9ad14e37a0d1ab5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店成长类型 (fdId: mdf1ef821e4ff46048252ce9)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 平均客单价 (fdId: k177fc7bd1cb0444a8eaf991)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员订单占比 (fdId: g64ee3e7fdd3c4ecbba9f96a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_新店爬坡_Comp老店` is table('o88b336d58b5047de98993b1') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 店型 (STRING)
  //   - 商圈 (STRING)
  //   - 新店标签 (STRING)
  //   - 是否90天内新店 (STRING)
  //   - 开业日期 (DATE)
  //   - 业务日期 (DATE)
  //   - 订单数 (LONG)
  //   - 销售额 (DOUBLE)
  //   - 会员订单数 (LONG)
  //   - 开业天数 (LONG)
  //   - 爬坡阶段 (STRING)
  //   - 门店成长类型 (STRING)
  //   - 平均客单价 (DOUBLE)
  //   - 会员订单占比 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_新店爬坡_Comp老店 (8节点·F+C+G+J)** (DATA_PROCESS_ETL)
  - ID: ac735a03291e64e459a661aa
