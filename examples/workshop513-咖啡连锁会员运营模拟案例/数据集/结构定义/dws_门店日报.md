我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: l335bc476e2f343ed8c721bd
- 数据集名称: dws_门店日报
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dws_门店日报
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 105524 行
- 字段列数: 30 列

## 时间信息
- 创建时间: 2026-05-21 09:19:46+0800
- 更新时间: 2026-05-21 15:31:59+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 30
- **普通字段**: 30 个
- **计算字段**: 0 个
- **维度字段**: 13 个
- **度量字段**: 17 个

### 字段列表

- 门店ID (fdId: qac931ac382904248971b95f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: ra888d853eaa145d489d0c23)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: d3c7803613a454b728bba91d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: n3e8df7772ae3493ab645313)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: wf0ff0b3bab8e42d384fb8d8)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店型 (fdId: r8d8ecddec6ef476c9134dbd)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: x39ed43bbdff64f61a922022)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商圈 (fdId: wa47a738b5dae4cb08006801)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 品牌线 (fdId: f165deee910664e6d9651d23)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 直营加盟类型 (fdId: x3fb3964984cc4264907e95b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否90天内新店 (fdId: f17db353089074b85a1a062e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 新店标签 (fdId: h2303bc345bb84ba6b4d989d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: r61fd3f5b95f5416685e3f6e)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单数 (fdId: w4c30d5df0fcb4ad2a87e974)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 销售额 (fdId: oe748aa23bcbb415abb3d319)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 原价销售额 (fdId: c73e703a9be654c699dbeb25)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 折扣金额合计 (fdId: se0ba8741d6da480ca619427)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 商品件数合计 (fdId: t19de5e6f34f14e1192f32df)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员订单数 (fdId: g382fae24fbee4474b30f98b)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店销售额 (fdId: i61ccda549f4e4367a1b8a9b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖销售额 (fdId: u8130ec41d54c46d6af7ac08)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店订单数 (fdId: pebb64fd7d5a34744901073c)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖订单数 (fdId: r7b8ab4f0c32f451cbc5d659)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 去重会员数 (fdId: h56841cde233147bc9a97376)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均客单价 (fdId: v45b9806607f04c899ff45cc)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员订单占比 (fdId: l8bf32a75b4a5456a946ffe5)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 折扣率 (fdId: q15131ef726c547f0b314a62)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店占比 (fdId: db54e121437804ecabee0e9b)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖占比 (fdId: b3e50e5551a50453596617e3)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均件数 (fdId: j55e575a4002a47d385dd40c)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dws_门店日报` is table('l335bc476e2f343ed8c721bd') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 店型 (STRING)
  //   - 门店类型 (STRING)
  //   - 商圈 (STRING)
  //   - 品牌线 (STRING)
  //   - 直营加盟类型 (STRING)
  //   - 是否90天内新店 (STRING)
  //   - 新店标签 (STRING)
  //   - 业务日期 (DATE)
  //   - 订单数 (LONG)
  //   - 销售额 (DOUBLE)
  //   - 原价销售额 (DOUBLE)
  //   - 折扣金额合计 (DOUBLE)
  //   - 商品件数合计 (LONG)
  //   - 会员订单数 (LONG)
  //   - 到店销售额 (DOUBLE)
  //   - 外卖销售额 (DOUBLE)
  //   - 到店订单数 (LONG)
  //   - 外卖订单数 (LONG)
  //   - 去重会员数 (LONG)
  //   - 平均客单价 (DOUBLE)
  //   - 会员订单占比 (DOUBLE)
  //   - 折扣率 (DOUBLE)
  //   - 到店占比 (DOUBLE)
  //   - 外卖占比 (DOUBLE)
  //   - 平均件数 (DOUBLE)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **etl_dws_门店日报 (10节点·F+C+G+S×2+J+C)** (DATA_PROCESS_ETL)
  - ID: e49dac524140f47c6bf8ff76

### 下游资源 (12)
- **test1** (DATA_ANALYSIS_PAGE)
  - ID: v88f228f095944d268ee6a43_draft
- **opencode演示4** (DATA_ANALYSIS_PAGE)
  - ID: t55a56796c01a46c6a1431e0
- **测试页面2** (DATA_ANALYSIS_PAGE)
  - ID: i0e7c50d0256d413b8ece087
- **opencode演示2** (DATA_ANALYSIS_PAGE)
  - ID: jf1fb8be519064a9a89f881a
- **opencode测试页面** (DATA_ANALYSIS_PAGE)
  - ID: df1ac3f4446fb4b11b2695bb
- **test** (DATA_ANALYSIS_PAGE)
  - ID: e56485e90a39445a9976f591
- **新建页面** (DATA_ANALYSIS_PAGE)
  - ID: lf0cc0b75c4664b8f82bc1b8_draft
- **电商履约与订单洞察** (DATA_ANALYSIS_PAGE)
  - ID: t496fc8f616719fc89695fd3
- **新建页面** (DATA_ANALYSIS_PAGE)
  - ID: lf0cc0b75c4664b8f82bc1b8
- **电商履约与订单洞察** (DATA_ANALYSIS_PAGE)
  - ID: t496fc8f616719fc89695fd3_draft
- **opencode演示3** (DATA_ANALYSIS_PAGE)
  - ID: k1ad8e6744e53461cb7096ec
- **opencode演示** (DATA_ANALYSIS_PAGE)
  - ID: u21bfc12037124d8f85c8574
