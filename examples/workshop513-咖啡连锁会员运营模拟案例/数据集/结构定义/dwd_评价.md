我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: af8234caa4e90486793eaab8
- 数据集名称: dwd_评价
- 显示类型: EXCEL
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_评价
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 30000 行
- 字段列数: 11 列

## 时间信息
- 创建时间: 2026-05-21 09:10:03+0800
- 更新时间: 2026-05-21 09:10:23+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 11
- **普通字段**: 11 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 1 个

### 字段列表

- 评价ID (fdId: r17ca9b5ac7484300b954424)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单ID (fdId: l73229af0932d41d8892b96c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: n4438974588bd47af927acc5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: tcb0acfccf5b8490f9ca8eb5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 评分 (fdId: j33795e44d0a74883b2846d9)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 评价时间 (fdId: j86ff7ac1238f4807b8c918d)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 评价日期 (fdId: nb36e2471bc1149f9a9309b6)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 评价平台 (fdId: i216a4805615244a986c4fde)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 内容摘要Hash (fdId: ceffe0adcea8f4b3f881ecf1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 负评标签 (fdId: r49f20d1bebb84b6dada2641)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 回复状态 (fdId: j96918ed66641430f9320be1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_评价` is table('af8234caa4e90486793eaab8') extend {
  // Base columns from table:
  //   - 评价ID (STRING)
  //   - 订单ID (STRING)
  //   - 会员ID (STRING)
  //   - 门店ID (STRING)
  //   - 评分 (LONG)
  //   - 评价时间 (TIMESTAMP)
  //   - 评价日期 (DATE)
  //   - 评价平台 (STRING)
  //   - 内容摘要Hash (STRING)
  //   - 负评标签 (STRING)
  //   - 回复状态 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (2)
- **etl_dws_体验口碑汇总** (DATA_PROCESS_ETL)
  - ID: ocfa4fd3c434b418dbdf34f7
- **ads_门店每日指挥台** (DATA_PROCESS_ETL)
  - ID: dac2c29f10005463a8aea769
