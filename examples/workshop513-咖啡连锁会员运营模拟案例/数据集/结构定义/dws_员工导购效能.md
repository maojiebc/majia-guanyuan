我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: v3db361c104114ea8b5997ae
- 数据集名称: dws_员工导购效能
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_员工导购效能
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 7952 行
- 字段列数: 15 列

## 时间信息
- 创建时间: 2026-05-21 09:21:02+0800
- 更新时间: 2026-05-21 12:22:47+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 15
- **普通字段**: 15 个
- **计算字段**: 0 个
- **维度字段**: 6 个
- **度量字段**: 9 个

### 字段列表

- 员工ID (fdId: n81a863733fb04ee7b9ae125)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 姓名 (fdId: l288ce5830d664fb4843f10b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 归属门店ID (fdId: aca0ce448c8c048d7ae03295)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 岗位 (fdId: k8574cdb6cd8e4e22a530974)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 角色标签 (fdId: u9bd635551ef24c23ad86606)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 周起始 (fdId: f740f4e1613724ba08278e7a)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达数 (fdId: h60f1583b6b994969bf37b23)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达会员数 (fdId: pb916da63de4d4800b59dee9)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 查看数 (fdId: a260f0e485eaa4255aaf541e)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 任务数 (fdId: defc9e6b16d2047cbb70753e)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 已触达任务 (fdId: o8c5858463d1d4928b65f118)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 转化任务数 (fdId: o7ea40a63ae9543928a2c122)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 转化金额 (fdId: a75ac93b4ce9f41f6a9ed6da)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 任务完成率 (fdId: t86c3d4925d444ad8bc2db38)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达后转化率 (fdId: dfb84bead53884994b0f108d)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_员工导购效能` is table('v3db361c104114ea8b5997ae') extend {
  // Base columns from table:
  //   - 员工ID (STRING)
  //   - 姓名 (STRING)
  //   - 归属门店ID (STRING)
  //   - 岗位 (STRING)
  //   - 角色标签 (STRING)
  //   - 周起始 (DATE)
  //   - 触达数 (LONG)
  //   - 触达会员数 (LONG)
  //   - 查看数 (LONG)
  //   - 任务数 (LONG)
  //   - 已触达任务 (LONG)
  //   - 转化任务数 (LONG)
  //   - 转化金额 (DOUBLE)
  //   - 任务完成率 (DOUBLE)
  //   - 触达后转化率 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_员工导购效能 (8节点·F+S+J+C)** (DATA_PROCESS_ETL)
  - ID: heeb294b1dbc041318ea5aaf
