我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: h516380c018b04b1b90dadf3
- 数据集名称: dim_日期
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dim_日期
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 396 行
- 字段列数: 13 列

## 时间信息
- 创建时间: 2026-05-20 18:02:54+0800
- 更新时间: 2026-05-20 18:03:23+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 13
- **普通字段**: 13 个
- **计算字段**: 0 个
- **维度字段**: 7 个
- **度量字段**: 6 个

### 字段列表

- 日期 (fdId: j9d844dda1e8645e2a71c7ff)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 年份 (fdId: fde7027dd32884531a44874f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 月份 (fdId: b01a13fcf2ed14d998383678)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 日 (fdId: p2234954f5c6c432cb3b413f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 周 (fdId: s30fc3fbbdb92428889e4e67)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 季度 (fdId: t07978ef203bb472c81e5b2f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 年月 (fdId: e20af4bfc0ac74222b40b488)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 星期 (fdId: n3eb2d990d34f45f4a1643d1)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 星期名称 (fdId: b3b568b388e324ed592f231b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否周末 (fdId: i2b495732d2e84b27961871a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否节假日 (fdId: f9767d35999eb49c68da54a2)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 节假日名称 (fdId: d55db3a104966451c88408ab)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 营销周期标签 (fdId: k8e2832cdb0aa44e68669cd4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dim_日期` is table('h516380c018b04b1b90dadf3') extend {
  // Base columns from table:
  //   - 日期 (DATE)
  //   - 年份 (LONG)
  //   - 月份 (LONG)
  //   - 日 (LONG)
  //   - 周 (LONG)
  //   - 季度 (LONG)
  //   - 年月 (DATE)
  //   - 星期 (LONG)
  //   - 星期名称 (STRING)
  //   - 是否周末 (STRING)
  //   - 是否节假日 (STRING)
  //   - 节假日名称 (STRING)
  //   - 营销周期标签 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系
