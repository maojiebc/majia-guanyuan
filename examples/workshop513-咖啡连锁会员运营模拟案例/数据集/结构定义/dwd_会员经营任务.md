我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: u494a5b2caaf446b5b1ed8bf
- 数据集名称: dwd_会员经营任务
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_会员经营任务
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 50000 行
- 字段列数: 21 列

## 时间信息
- 创建时间: 2026-05-21 09:12:04+0800
- 更新时间: 2026-05-21 09:12:17+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 21
- **普通字段**: 21 个
- **计算字段**: 0 个
- **维度字段**: 17 个
- **度量字段**: 4 个

### 字段列表

- 任务ID (fdId: k8530f515b1a14f43b1bc607)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: d039bd982b35640ac8c25388)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 归属门店ID (fdId: v979d519820194288a0b6ad0)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 员工导购ID (fdId: m34dd13be202849718af30c4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务来源 (fdId: mcb03d7db280343328ae05b4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务优先级 (fdId: v8111113841484939bb48e02)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务类型 (fdId: x7a4d23c5a4744181a04190b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 人群标签 (fdId: eaa72ece338d74299a392c1a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 推荐动作 (fdId: sc3f1f8a22c1444a9bc8a9ee)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 推荐权益 (fdId: d3619a5ea718a49929392214)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 推荐原因 (fdId: k5fecaa2278c3461f91a5253)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 预计价值 (fdId: l96c5dcd9107c4327a666893)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 任务生成时间 (fdId: ve5f37a293ebc4343b2523d3)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务截止时间 (fdId: d2f4977e677e9437eb262a28)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 任务失效时间 (fdId: mdd4b7780a1c141d0be4eb0b)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达状态 (fdId: a9a913c3e33394f0d8049961)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达时间 (fdId: ke26d4c3496e94a85b2f47a5)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达方式 (fdId: sb6a961fb3abf49a8aff667b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达后下单 (fdId: h4086f3ad0ae143ce8e8be08)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达后下单金额 (fdId: b071519c2932b45b5b6297ce)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 任务结果 (fdId: l117cf085a48b4b02bbd5261)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_会员经营任务` is table('u494a5b2caaf446b5b1ed8bf') extend {
  // Base columns from table:
  //   - 任务ID (STRING)
  //   - 会员ID (STRING)
  //   - 归属门店ID (STRING)
  //   - 员工导购ID (STRING)
  //   - 任务来源 (STRING)
  //   - 任务优先级 (STRING)
  //   - 任务类型 (STRING)
  //   - 人群标签 (STRING)
  //   - 推荐动作 (STRING)
  //   - 推荐权益 (STRING)
  //   - 推荐原因 (STRING)
  //   - 预计价值 (DOUBLE)
  //   - 任务生成时间 (TIMESTAMP)
  //   - 任务截止时间 (TIMESTAMP)
  //   - 任务失效时间 (TIMESTAMP)
  //   - 触达状态 (STRING)
  //   - 触达时间 (LONG)
  //   - 触达方式 (STRING)
  //   - 触达后下单 (LONG)
  //   - 触达后下单金额 (DOUBLE)
  //   - 任务结果 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_dws_员工导购效能 (8节点·F+S+J+C)** (DATA_PROCESS_ETL)
  - ID: heeb294b1dbc041318ea5aaf
- **ads_会员经营任务池** (DATA_PROCESS_ETL)
  - ID: feb59f5aa87e249c681d88da
