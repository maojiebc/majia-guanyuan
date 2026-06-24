我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: id526a80527504299850cc18
- 数据集名称: dim_成本科目
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_成本科目
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 8 行
- 字段列数: 7 列

## 时间信息
- 创建时间: 2026-05-21 14:33:52+0800
- 更新时间: 2026-05-21 14:33:57+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 7
- **普通字段**: 7 个
- **计算字段**: 0 个
- **维度字段**: 6 个
- **度量字段**: 1 个

### 字段列表

- 成本科目ID (fdId: s0d691e4cd55e43d5ac5f077)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本科目名称 (fdId: na4e30b8aa50a45eda4e868d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本大类 (fdId: o2b1ef75d88e949ebaa7c08f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 成本性质 (fdId: n83c88f8544004fdf9aeef52)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 默认营收占比 (fdId: paa453898123e4da8bc56f19)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 是否按店型差异化 (fdId: g6551c9489cfb43dc9c723fb)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 适用场景 (fdId: oeeebf19d2ba544dcbdc7d33)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_成本科目` is table('id526a80527504299850cc18') extend {
  // Base columns from table:
  //   - 成本科目ID (STRING)
  //   - 成本科目名称 (STRING)
  //   - 成本大类 (STRING)
  //   - 成本性质 (STRING)
  //   - 默认营收占比 (DOUBLE)
  //   - 是否按店型差异化 (STRING)
  //   - 适用场景 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系
