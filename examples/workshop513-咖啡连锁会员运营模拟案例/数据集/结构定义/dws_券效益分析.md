我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: h6c06660548ba4d8daaf2bd3
- 数据集名称: dws_券效益分析
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_券效益分析
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 3598 行
- 字段列数: 12 列

## 时间信息
- 创建时间: 2026-05-21 09:20:20+0800
- 更新时间: 2026-05-21 09:32:22+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 12
- **普通字段**: 12 个
- **计算字段**: 0 个
- **维度字段**: 5 个
- **度量字段**: 7 个

### 字段列表

- 券模板ID (fdId: j404bc974c6974f13bb9d815)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 券名称 (fdId: gdd76909bf39e4601b2e8b09)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 券类型 (fdId: nccb567bf116e4f8aa64e0c6)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 优惠形式 (fdId: a1744dc9bb509498faa8bd21)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: j24e82f99b0a4419da1dca77)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 发放数 (fdId: a7b864822c8ff4dca88f3614)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 核销数 (fdId: f84a61067af644c2991ea0ae)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 核销率 (fdId: af432cd3de0a3453f9972018)
  - 字段类型: DECIMAL
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 总折扣金额 (fdId: p70dec3df27d2467e97eb2ae)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 拉动销售额 (fdId: s88f1cef31f8f46a987e4fc5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 拉动订单数 (fdId: hbe0bdcb38d7c4856aaa38a6)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- ROI (fdId: vfa6138f15e7b420a99a0ff6)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_券效益分析` is table('h6c06660548ba4d8daaf2bd3') extend {
  // Base columns from table:
  //   - 券模板ID (STRING)
  //   - 券名称 (STRING)
  //   - 券类型 (STRING)
  //   - 优惠形式 (STRING)
  //   - 业务日期 (DATE)
  //   - 发放数 (LONG)
  //   - 核销数 (LONG)
  //   - 核销率 (DECIMAL)
  //   - 总折扣金额 (DOUBLE)
  //   - 拉动销售额 (DOUBLE)
  //   - 拉动订单数 (LONG)
  //   - ROI (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_券效益分析** (DATA_PROCESS_ETL)
  - ID: v0a6e6562f9984c789f8a8cc

### 下游资源 (1)
- **test** (DATA_ANALYSIS_PAGE)
  - ID: e56485e90a39445a9976f591
