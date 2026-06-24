我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: c77fc2f1d0a4d4459bd02859
- 数据集名称: dws_成本结构汇总
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_成本结构汇总
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 288 行
- 字段列数: 16 列

## 时间信息
- 创建时间: 2026-05-21 14:42:42+0800
- 更新时间: 2026-05-21 14:42:43+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 16
- **普通字段**: 16 个
- **计算字段**: 0 个
- **维度字段**: 5 个
- **度量字段**: 11 个

### 字段列表

- 门店类型 (fdId: m5db246803ea44dfbbf63464)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: v38ed52f2ed764dbfa7f0e07)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本科目ID (fdId: l4203375a22be4d4c85ea83d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本科目名称 (fdId: v8eb67d4d2d02432fa6d916f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本大类 (fdId: d23ce3eb793964abb93051b6)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店数 (fdId: i2ba37a45d6fd40398690df5)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 成本总额 (fdId: b9dacc8a660e0443a866c983)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 营收总额 (fdId: t75111c0d4fb24c998cfd946)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均占比 (fdId: d2b669c69ec494aff9bd3cc1)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 中位数占比 (fdId: q62ea5c21642642e0ae9d9d7)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- P90占比 (fdId: m1ffc39969c8f444ab075937)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 最低占比 (fdId: bbc7c843323e5421d88596dd)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 最高占比 (fdId: vff4275f6a1da44a99a02ab7)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 科目营收占比 (fdId: i3939bf130c7c4286a76b28e)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 离散度 (fdId: l8cbdfd3a833d49ea93f411e)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- P90vsP50差异 (fdId: x31159cef42e14eea92d4912)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_成本结构汇总` is table('c77fc2f1d0a4d4459bd02859') extend {
  // Base columns from table:
  //   - 门店类型 (STRING)
  //   - 月份 (DATE)
  //   - 成本科目ID (STRING)
  //   - 成本科目名称 (STRING)
  //   - 成本大类 (STRING)
  //   - 门店数 (LONG)
  //   - 成本总额 (DOUBLE)
  //   - 营收总额 (DOUBLE)
  //   - 平均占比 (DOUBLE)
  //   - 中位数占比 (DOUBLE)
  //   - P90占比 (DOUBLE)
  //   - 最低占比 (DOUBLE)
  //   - 最高占比 (DOUBLE)
  //   - 科目营收占比 (DOUBLE)
  //   - 离散度 (DOUBLE)
  //   - P90vsP50差异 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_成本结构汇总 (7节点·J+S+C)** (DATA_PROCESS_ETL)
  - ID: rf6700ab6181258fe671c0e7
