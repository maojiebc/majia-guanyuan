我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: q2154240ed0334aec8883ae8
- 数据集名称: ads_活动权益复盘
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_活动权益复盘
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 50 行
- 字段列数: 17 列

## 时间信息
- 创建时间: 2026-05-21 09:22:04+0800
- 更新时间: 2026-05-21 12:21:23+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 17
- **普通字段**: 17 个
- **计算字段**: 0 个
- **维度字段**: 6 个
- **度量字段**: 11 个

### 字段列表

- 活动ID (fdId: n514c734d258249be94bfa8b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动名称 (fdId: ue9946327e98c4c7fbc2857a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动类型 (fdId: e182d348c7a524e81ba6d5e7)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动渠道 (fdId: e5fff999be7dc4e799716b08)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 开始日期 (fdId: u21458b1ea8584533b6ecd78)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 结束日期 (fdId: ffbd4ab3b62c74cdf8951442)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 预算 (fdId: t50cb5c92d11a4626881bdd1)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 券发放数 (fdId: je5a380a46b57442c99954d3)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 券核销数 (fdId: c6b2198c38c474e3fa80a366)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总折扣 (fdId: r0e5a9a0c6e2a4e0e9edcb5e)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达人数 (fdId: hb8c5fa0465fb46c4ae7380c)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 查看人数 (fdId: ldbd5e93d2aa14da0a054935)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 转化人数 (fdId: ea0d1ae71fb3742f094b5150)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 拉动销售 (fdId: ub98523b3916e41cba56f8e2)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 券核销率 (fdId: r18e52bb1a1d94a62996d7bd)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总体转化率 (fdId: v41860dce5f734c88836dce0)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 券ROI (fdId: r2613749c2149495f907037d)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_活动权益复盘` is table('q2154240ed0334aec8883ae8') extend {
  // Base columns from table:
  //   - 活动ID (STRING)
  //   - 活动名称 (STRING)
  //   - 活动类型 (STRING)
  //   - 活动渠道 (STRING)
  //   - 开始日期 (DATE)
  //   - 结束日期 (DATE)
  //   - 预算 (LONG)
  //   - 券发放数 (LONG)
  //   - 券核销数 (LONG)
  //   - 总折扣 (DOUBLE)
  //   - 触达人数 (LONG)
  //   - 查看人数 (LONG)
  //   - 转化人数 (LONG)
  //   - 拉动销售 (DOUBLE)
  //   - 券核销率 (DOUBLE)
  //   - 总体转化率 (DOUBLE)
  //   - 券ROI (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_ads_活动权益复盘 (17节点·C+G+F+C+G×2+S+J×3+C)** (DATA_PROCESS_ETL)
  - ID: g75c5f907f4bb4e87938fa35

### 下游资源 (1)
- **05-活动权益复盘** (DATA_ANALYSIS_PAGE)
  - ID: t1400adf655d5974c9cfb990
