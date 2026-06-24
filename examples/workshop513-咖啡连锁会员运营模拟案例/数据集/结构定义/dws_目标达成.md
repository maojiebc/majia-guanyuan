我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: me754bd92ca384667a33a6d1
- 数据集名称: dws_目标达成
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_目标达成
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 14400 行
- 字段列数: 7 列

## 时间信息
- 创建时间: 2026-05-21 09:21:26+0800
- 更新时间: 2026-05-21 09:28:38+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 7
- **普通字段**: 7 个
- **计算字段**: 0 个
- **维度字段**: 3 个
- **度量字段**: 4 个

### 字段列表

- 门店ID (fdId: jc05e72a858bd484fa875f89)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 年月 (fdId: e98a273381dbe4b3f9f7d830)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 目标指标 (fdId: k04fb329abfb44676bcb75bb)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 目标值 (fdId: v5122da112c024e4ca048a6a)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 实际值 (fdId: l3040d86ab2b844d4aec3836)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 达成率 (fdId: uddcdf8227c114209bdbe7a1)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 目标缺口 (fdId: re26cd6537b6a4839aa62d22)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_目标达成` is table('me754bd92ca384667a33a6d1') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 年月 (DATE)
  //   - 目标指标 (STRING)
  //   - 目标值 (LONG)
  //   - 实际值 (DOUBLE)
  //   - 达成率 (DOUBLE)
  //   - 目标缺口 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_目标达成** (DATA_PROCESS_ETL)
  - ID: dea6744905a504af3ae9e35c
