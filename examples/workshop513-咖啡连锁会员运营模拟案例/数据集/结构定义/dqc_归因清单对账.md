我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: q3393c3949cbb4592a529d6c
- 数据集名称: dqc_归因清单对账
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dqc_归因清单对账
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 9 行
- 字段列数: 6 列

## 时间信息
- 创建时间: 2026-06-13 01:08:52+0800
- 更新时间: 2026-06-24 10:46:44+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 6
- **普通字段**: 6 个
- **计算字段**: 0 个
- **维度字段**: 6 个
- **度量字段**: 0 个

### 字段列表

- 序号 (fdId: m6a83ce6891d24d19b037105)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 检查类别 (fdId: a65a7e464ebfc492d932b43b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 检查项 (fdId: e684318c1dbf94de780c60e8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 期望值 (fdId: wf6bc88fa72c2489098ea911)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 实际值 (fdId: re3f41c9a322149849ec76d3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 状态 (fdId: ff72684ada7b14a18944842e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dqc_归因清单对账` is table('q3393c3949cbb4592a529d6c') extend {
  // Base columns from table:
  //   - 序号 (STRING)
  //   - 检查类别 (STRING)
  //   - 检查项 (STRING)
  //   - 期望值 (STRING)
  //   - 实际值 (STRING)
  //   - 状态 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
