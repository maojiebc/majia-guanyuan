我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: nd177a0ac0eda44ac98c75bc
- 数据集名称: ads_门店每日指挥台
- 显示类型: DATAFLOW
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>ads_门店每日指挥台
- UniformResourceType: DATA_SET_ETL

## 数据规模
- 数据行数: 105524 行
- 字段列数: 23 列

## 时间信息
- 创建时间: 2026-05-21 09:21:36+0800
- 更新时间: 2026-06-12 02:49:22+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 23
- **普通字段**: 23 个
- **计算字段**: 0 个
- **维度字段**: 12 个
- **度量字段**: 11 个

### 字段列表

- 门店ID (fdId: d87a8804d48d24569b4d0801)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店名称 (fdId: o812d933b0d7345639bb488f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 省份 (fdId: xbffe4f6ac7de4eacbd070f3)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市 (fdId: m1a32b5b17f5545d6a1fcc01)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 城市层级 (fdId: ef8397e47db01480c92386f7)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 店型 (fdId: p5ec27dc8c36946efbae9762)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店类型 (fdId: qc1ffa8ebba2c4432a6d17ab)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 商圈 (fdId: o49c98a839ff84aee9eebf82)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否90天内新店 (fdId: f0e93207a093e41f08e3cd50)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 新店标签 (fdId: o9241388a4a12405cb710b4a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: w410e7caed241415c8201116)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单数 (fdId: j768bf7ab818346fe9831faa)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 销售额 (fdId: i8497f7bd4d1f4f38baa6391)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 平均客单价 (fdId: keb2eb788986e4117aa69ae4)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员订单数 (fdId: tecc3cf4bd3da4936b7204ef)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店订单数 (fdId: c50f08add6588460ca72021b)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 外卖订单数 (fdId: f4d336662443d4388b996baf)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 会员订单占比 (fdId: qbd80d3880f1941e9bf972c3)
  - 字段类型: DECIMAL
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 到店占比 (fdId: s010acc8a4a934043b3ee992)
  - 字段类型: DECIMAL
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 折扣率 (fdId: g965710fbab8b4236b11de52)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 当日评分 (fdId: v6c4d305bd96c43ae8980292)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 未回复负评数 (fdId: o978cc5cee11342a884b0050)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 今日异常 (fdId: ka5f39637baf04646bf98c4f)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `ads_门店每日指挥台` is table('nd177a0ac0eda44ac98c75bc') extend {
  // Base columns from table:
  //   - 门店ID (STRING)
  //   - 门店名称 (STRING)
  //   - 省份 (STRING)
  //   - 城市 (STRING)
  //   - 城市层级 (STRING)
  //   - 店型 (STRING)
  //   - 门店类型 (STRING)
  //   - 商圈 (STRING)
  //   - 是否90天内新店 (STRING)
  //   - 新店标签 (STRING)
  //   - 业务日期 (DATE)
  //   - 订单数 (LONG)
  //   - 销售额 (DOUBLE)
  //   - 平均客单价 (DOUBLE)
  //   - 会员订单数 (LONG)
  //   - 到店订单数 (LONG)
  //   - 外卖订单数 (LONG)
  //   - 会员订单占比 (DECIMAL)
  //   - 到店占比 (DECIMAL)
  //   - 折扣率 (DOUBLE)
  //   - 当日评分 (DOUBLE)
  //   - 未回复负评数 (LONG)
  //   - 今日异常 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 上游资源 (1)
- **ads_门店每日指挥台** (DATA_PROCESS_ETL)
  - ID: dac2c29f10005463a8aea769

### 下游资源 (5)
- **test1** (DATA_PROCESS_ETL)
  - ID: v7d131a615f7446cbae4f7ae
- **门店异常清单** (DATA_PROCESS_ETL)
  - ID: l5a7acc1b4d0c4a148671d81
- **etl_ads_异常归因清单** (DATA_PROCESS_ETL)
  - ID: teb265115511846f1bc47f0b
- **etl_dqc_归因清单对账** (DATA_PROCESS_ETL)
  - ID: l63a55ec75d7f45418e42823
- **04-门店每日指挥台** (DATA_ANALYSIS_PAGE)
  - ID: vb6be7ea0684b060b6b9a69e
