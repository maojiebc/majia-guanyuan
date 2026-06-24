我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: ff7b4cae808ca4ecab894f53
- 数据集名称: dwd_门店成本明细
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_门店成本明细
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 37288 行
- 字段列数: 12 列

## 时间信息
- 创建时间: 2026-05-21 14:34:18+0800
- 更新时间: 2026-05-21 14:34:25+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 12
- **普通字段**: 12 个
- **计算字段**: 0 个
- **维度字段**: 9 个
- **度量字段**: 3 个

### 字段列表

- 成本明细ID (fdId: tdc32f13aff8b4caf827d203)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: q5cdbc97a9414406fa1e81d2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: d9416f735b3784d2087369b0)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本科目ID (fdId: uedfe7d9aef2e4d5da2f9c82)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本科目名称 (fdId: fe72760e541c940ccb607817)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本大类 (fdId: j530bc53d55d445a98c3dc91)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本金额 (fdId: m0880ccddaf39460e8a121d8)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 营收基数 (fdId: g02081c4dc7d54367845dbb6)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 成本占比 (fdId: edaa52b04555d4630adcd1cd)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 数据来源 (fdId: kdf1e019e0d744acf894b805)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 数据状态 (fdId: b314d9a41298a426e928ffc3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 录入日期 (fdId: j7775697f6103472693f98ab)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_门店成本明细` is table('ff7b4cae808ca4ecab894f53') extend {
  // Base columns from table:
  //   - 成本明细ID (STRING)
  //   - 门店ID (STRING)
  //   - 月份 (DATE)
  //   - 成本科目ID (STRING)
  //   - 成本科目名称 (STRING)
  //   - 成本大类 (STRING)
  //   - 成本金额 (DOUBLE)
  //   - 营收基数 (DOUBLE)
  //   - 成本占比 (DOUBLE)
  //   - 数据来源 (STRING)
  //   - 数据状态 (STRING)
  //   - 录入日期 (DATE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_dws_成本结构汇总 (7节点·J+S+C)** (DATA_PROCESS_ETL)
  - ID: rf6700ab6181258fe671c0e7
- **etl_dws_单店利润月汇总 (11节点·F+C+G+S×2+J+C)** (DATA_PROCESS_ETL)
  - ID: b4a8c005f26f3a6092d6d4b5
