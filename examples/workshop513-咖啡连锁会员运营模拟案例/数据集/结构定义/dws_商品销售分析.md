我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: u4551251219e445cab03355f
- 数据集名称: dws_商品销售分析
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_商品销售分析
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 1.508589e+06 行
- 字段列数: 16 列

## 时间信息
- 创建时间: 2026-05-21 09:20:52+0800
- 更新时间: 2026-05-21 09:28:09+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 16
- **普通字段**: 16 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 6 个

### 字段列表

- 一级类目 (fdId: b414e67a734a1482c879c5ad)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 二级类目 (fdId: ie8f4bce376374ea7a4ae223)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商品ID (fdId: o94df206c0a004041a858db5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商品名称 (fdId: w2669e9f0a8e84cd48238248)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: r2c5b8db99d08460d94e686f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: sc06ca5c449274ba099d8dca)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: e9072e45e25574df09f556b4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店型 (fdId: qe2a2d4c442fb48ad8601cd4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 销售渠道 (fdId: f95197f3e9ef345ad99db1cc)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否到店 (fdId: w98dcd8eeef2e42c89ef4b3d)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: w7391aa6610f6412aaf7a807)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单数 (fdId: scbe6e16516a84140b90bb70)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 销量 (fdId: v24ee630579b049079b58da1)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 销售额 (fdId: f7e17cdc4e2f74a71b51ad0a)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总成本 (fdId: dbc9ab291679945d19ec2e52)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 毛利 (fdId: k24f6d49b4a2843ae881c926)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_商品销售分析` is table('u4551251219e445cab03355f') extend {
  // Base columns from table:
  //   - 一级类目 (STRING)
  //   - 二级类目 (STRING)
  //   - 商品ID (STRING)
  //   - 商品名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 店型 (STRING)
  //   - 销售渠道 (STRING)
  //   - 是否到店 (LONG)
  //   - 业务日期 (DATE)
  //   - 订单数 (LONG)
  //   - 销量 (LONG)
  //   - 销售额 (DOUBLE)
  //   - 总成本 (LONG)
  //   - 毛利 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_商品销售分析** (DATA_PROCESS_ETL)
  - ID: l6cf2ad96bdd641c9a02447c
