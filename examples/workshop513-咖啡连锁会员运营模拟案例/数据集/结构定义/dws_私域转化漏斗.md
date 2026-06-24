我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: u37d100614fbd4abe89f7731
- 数据集名称: dws_私域转化漏斗
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_私域转化漏斗
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 27048 行
- 字段列数: 13 列

## 时间信息
- 创建时间: 2026-05-21 09:20:10+0800
- 更新时间: 2026-05-21 12:17:36+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 13
- **普通字段**: 13 个
- **计算字段**: 0 个
- **维度字段**: 5 个
- **度量字段**: 8 个

### 字段列表

- 活动ID (fdId: ue0f17a1133834343854c461)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动名称 (fdId: b22dd9ded14a84f42a57bd87)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 活动类型 (fdId: w77533b0dd2624a8d85fab0b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: p65dcb1bf9f634a54ae9067b)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达渠道 (fdId: s4ab55f8269c344fbbea3531)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 触达人次 (fdId: wc51d8017c06c40afae8e049)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 查看人次 (fdId: j575903165599411f8055dc9)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 触达人数 (fdId: e03f867656be14733accf260)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 打开率 (fdId: c420bd99102b64434a008c33)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 下单人数 (fdId: ve8c631ee22a944bb9608316)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 下单金额 (fdId: h6977b773830b4420b83a4b9)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 整体转化率 (fdId: b867fe736bc8d4257b8aa359)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 查看转化率 (fdId: hfab3e69a6df24bb499faec5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_私域转化漏斗` is table('u37d100614fbd4abe89f7731') extend {
  // Base columns from table:
  //   - 活动ID (STRING)
  //   - 活动名称 (STRING)
  //   - 活动类型 (STRING)
  //   - 业务日期 (DATE)
  //   - 触达渠道 (STRING)
  //   - 触达人次 (LONG)
  //   - 查看人次 (LONG)
  //   - 触达人数 (LONG)
  //   - 打开率 (DOUBLE)
  //   - 下单人数 (LONG)
  //   - 下单金额 (DOUBLE)
  //   - 整体转化率 (DOUBLE)
  //   - 查看转化率 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_私域转化漏斗 (10节点·F+C+G+C+G+J+C)** (DATA_PROCESS_ETL)
  - ID: g4469ecdd670a4d91bd92055
