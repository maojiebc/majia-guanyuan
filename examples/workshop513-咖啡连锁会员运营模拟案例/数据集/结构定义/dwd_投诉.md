我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: l1b7c38276d9d483b9e1f712
- 数据集名称: dwd_投诉
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_投诉
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 3000 行
- 字段列数: 9 列

## 时间信息
- 创建时间: 2026-05-21 09:08:41+0800
- 更新时间: 2026-05-21 09:09:00+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 9
- **普通字段**: 9 个
- **计算字段**: 0 个
- **维度字段**: 8 个
- **度量字段**: 1 个

### 字段列表

- 投诉ID (fdId: h2a605511c36d4677ba3d8b0)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: p874fa3a6f535455ab051dda)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单ID (fdId: t8f246d992b5b49fe848b967)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: c6ecbbb5094654faab2a855b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 投诉类型 (fdId: v2e1d9fbee14849cb93d4960)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 投诉时间 (fdId: hc3cc0910905b42f881eaee4)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 状态 (fdId: g98023c8dc09d4cf0adc00bf)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 处理人ID (fdId: ta644473d28f547a89a87d75)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 处理时长_小时 (fdId: q7f5d23e3608f4a5fbfebdb3)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_投诉` is table('l1b7c38276d9d483b9e1f712') extend {
  // Base columns from table:
  //   - 投诉ID (STRING)
  //   - 会员ID (STRING)
  //   - 订单ID (STRING)
  //   - 门店ID (STRING)
  //   - 投诉类型 (STRING)
  //   - 投诉时间 (TIMESTAMP)
  //   - 状态 (STRING)
  //   - 处理人ID (STRING)
  //   - 处理时长_小时 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (1)
- **etl_dws_体验口碑汇总** (DATA_PROCESS_ETL)
  - ID: ocfa4fd3c434b418dbdf34f7
