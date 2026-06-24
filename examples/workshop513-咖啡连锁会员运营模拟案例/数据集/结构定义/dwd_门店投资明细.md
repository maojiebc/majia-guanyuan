我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: dd5f37d14b97f4ee38c4b0dc
- 数据集名称: dwd_门店投资明细
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_门店投资明细
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 3962 行
- 字段列数: 8 列

## 时间信息
- 创建时间: 2026-05-21 14:35:21+0800
- 更新时间: 2026-05-21 14:35:26+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 8
- **普通字段**: 8 个
- **计算字段**: 0 个
- **维度字段**: 7 个
- **度量字段**: 1 个

### 字段列表

- 投资明细ID (fdId: h138333d9374f4ce6a20a2fd)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: se78adb7ced2f4e209befcae)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 加盟商ID (fdId: h2bf0fc4e9d1f4c0eb117c4c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 投资项 (fdId: q182b6482bbb646948f23469)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 投资金额 (fdId: g0682199d3a354c718fad6b9)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 投资日期 (fdId: k473af4d37e6a4ff9b797e54)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 投资类型 (fdId: t1c2d60142f974764805758e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 回收性质 (fdId: ha63c3ba0d67942ab94ecd8a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_门店投资明细` is table('dd5f37d14b97f4ee38c4b0dc') extend {
  // Base columns from table:
  //   - 投资明细ID (STRING)
  //   - 门店ID (STRING)
  //   - 加盟商ID (STRING)
  //   - 投资项 (STRING)
  //   - 投资金额 (LONG)
  //   - 投资日期 (DATE)
  //   - 投资类型 (STRING)
  //   - 回收性质 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (1)
- **etl_dws_加盟回本测算 (9节点·S×3+J+C)** (DATA_PROCESS_ETL)
  - ID: n844deaa4fe2957780f0f542
