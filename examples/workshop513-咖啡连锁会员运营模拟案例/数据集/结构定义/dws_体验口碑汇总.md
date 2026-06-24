我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: g52a667122e214eefb542bf6
- 数据集名称: dws_体验口碑汇总
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_体验口碑汇总
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 25665 行
- 字段列数: 18 列

## 时间信息
- 创建时间: 2026-05-21 09:21:06+0800
- 更新时间: 2026-05-21 15:34:22+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 18
- **普通字段**: 18 个
- **计算字段**: 0 个
- **维度字段**: 9 个
- **度量字段**: 9 个

### 字段列表

- 门店ID (fdId: ufd065519ebc747aab77029b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: fada5adc5a90f48198a24987)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: ga1df9e3a62dc45a08202f90)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: nefe1f75e0ba842b0b16198b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: m94b4adc4ba1f4a2792a23ba)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店型 (fdId: sc44680d2176748ab9c77789)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: sea382e37f3f54d3b9d1ef83)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: w8e7075a6319c472fba34706)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 评价数 (fdId: sd330c26b399641ec8174829)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均评分 (fdId: t78239236546f4e5a9e999b5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 负评数 (fdId: de447d0001bfe474a98e9880)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 好评数 (fdId: c1547de91732346438590b80)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 未回复负评数 (fdId: l0d1d39b39b6d4415aff3696)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 负评率 (fdId: s69ec83aa3d2444ee81db222)
  - 字段类型: DECIMAL
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 投诉数 (fdId: c7309bead27284813b325a90)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 待处理投诉 (fdId: u02ede1d5b1f64a448d41b57)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均处理时长 (fdId: r675976a6fba44e15a42985e)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 体验风险等级 (fdId: i507922e36bca4d708d286d8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_体验口碑汇总` is table('g52a667122e214eefb542bf6') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 店型 (STRING)
  //   - 门店类型 (STRING)
  //   - 业务日期 (DATE)
  //   - 评价数 (LONG)
  //   - 平均评分 (DOUBLE)
  //   - 负评数 (LONG)
  //   - 好评数 (LONG)
  //   - 未回复负评数 (LONG)
  //   - 负评率 (DECIMAL)
  //   - 投诉数 (LONG)
  //   - 待处理投诉 (LONG)
  //   - 平均处理时长 (DOUBLE)
  //   - 体验风险等级 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_体验口碑汇总** (DATA_PROCESS_ETL)
  - ID: ocfa4fd3c434b418dbdf34f7

### 下游资源 (3)
- **etl_ads_异常归因清单** (DATA_PROCESS_ETL)
  - ID: teb265115511846f1bc47f0b
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
- **06-体验风险专题** (DATA_ANALYSIS_PAGE)
  - ID: la7a43a3d77650394ede85f2
