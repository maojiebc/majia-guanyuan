我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: j23ea7e60564e47458b71d82
- 数据集名称: dwd_订单
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_订单
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 1.294316e+06 行
- 字段列数: 19 列

## 时间信息
- 创建时间: 2026-05-21 09:14:08+0800
- 更新时间: 2026-05-21 09:15:16+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 19
- **普通字段**: 19 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 9 个

### 字段列表

- 订单ID (fdId: o3cdc3e325b5f4e9294050ad)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: l3e3ad9acef104d71bbce14b)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: wb7a1a6de97554b4897c0a3c)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 顾客识别键 (fdId: d0429e4c885844f9cbc71e3e)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 身份匹配置信度 (fdId: jdd5c842e46c04a9e92b6b82)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 下单时间 (fdId: s435671d89bbb4f44a1d86f9)
  - 字段类型: TIMESTAMP
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 业务日期 (fdId: idccb0a9eb4e64903941b6d8)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 原价金额 (fdId: g568717594d4044f19eda63e)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 折扣金额 (fdId: q651d4f8f06c14b8db254959)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 实付金额 (fdId: ec724f4c2565649c799ca959)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 收入口径金额 (fdId: wa654d04e87fd420ca31edbf)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 支付方式 (fdId: ra271dfd287824b8cb979d30)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 销售渠道 (fdId: q8bcdcb5972be465dad9d2a1)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 履约方式 (fdId: i6cf12ce765154c14823dd41)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否到店 (fdId: j22c49761dd9b473f93acfbd)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 订单状态 (fdId: xdfc1cf6d801443f799fe2bc)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 是否用券 (fdId: r157d71c45f5144959eabe0f)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 是否会员首单 (fdId: u42458b41379d4fa1b444b2a)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 商品件数 (fdId: id439f948f3a145dea59976d)
  - 字段类型: LONG
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_订单` is table('j23ea7e60564e47458b71d82') extend {
  // Base columns from table:
  //   - 订单ID (STRING)
  //   - 门店ID (STRING)
  //   - 会员ID (STRING)
  //   - 顾客识别键 (STRING)
  //   - 身份匹配置信度 (DOUBLE)
  //   - 下单时间 (TIMESTAMP)
  //   - 业务日期 (DATE)
  //   - 原价金额 (DOUBLE)
  //   - 折扣金额 (DOUBLE)
  //   - 实付金额 (DOUBLE)
  //   - 收入口径金额 (DOUBLE)
  //   - 支付方式 (STRING)
  //   - 销售渠道 (STRING)
  //   - 履约方式 (STRING)
  //   - 是否到店 (LONG)
  //   - 订单状态 (STRING)
  //   - 是否用券 (LONG)
  //   - 是否会员首单 (LONG)
  //   - 商品件数 (LONG)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (16)
- **etl_dws_会员生命周期** (DATA_PROCESS_ETL)
  - ID: n8c42426e84ac4c81a755a03
- **etl_dws_会员同期群留存** (DATA_PROCESS_ETL)
  - ID: ge6799d1eedb34eda93a502b
- **etl_dws_商品销售分析** (DATA_PROCESS_ETL)
  - ID: l6cf2ad96bdd641c9a02447c
- **etl_dws_渠道迁移分析** (DATA_PROCESS_ETL)
  - ID: c5362567a2d0a402881968b3
- **etl_dws_目标达成** (DATA_PROCESS_ETL)
  - ID: dea6744905a504af3ae9e35c
- **ads_会员私域驾驶舱** (DATA_PROCESS_ETL)
  - ID: n5eed53432fec411f8b3250f
- **etl_dws_券效益分析** (DATA_PROCESS_ETL)
  - ID: v0a6e6562f9984c789f8a8cc
- **ads_高层经营驾驶舱** (DATA_PROCESS_ETL)
  - ID: s85830984b37045b39c1c816
- **etl_ads_活动权益复盘 (17节点·C+G+F+C+G×2+S+J×3+C)** (DATA_PROCESS_ETL)
  - ID: g75c5f907f4bb4e87938fa35
- **etl_dws_会员RFM分层 (10节点·F+C+G+S+J)** (DATA_PROCESS_ETL)
  - ID: c4bd62b609bf4449ca4a09fc
- **etl_dws_新店爬坡_Comp老店 (8节点·F+C+G+J)** (DATA_PROCESS_ETL)
  - ID: ac735a03291e64e459a661aa
- **repro_活动权益复盘_前端编辑bug** (DATA_PROCESS_ETL)
  - ID: p38ae465fd99b47bebd3c5eb
- **etl_dws_单店利润月汇总 (11节点·F+C+G+S×2+J+C)** (DATA_PROCESS_ETL)
  - ID: b4a8c005f26f3a6092d6d4b5
- **etl_dws_门店日报 (10节点·F+C+G+S×2+J+C)** (DATA_PROCESS_ETL)
  - ID: e49dac524140f47c6bf8ff76
- **ads_门店每日指挥台** (DATA_PROCESS_ETL)
  - ID: dac2c29f10005463a8aea769
- **外卖业绩近30天GMV增长情况** (DATA_ANALYSIS_PAGE)
  - ID: uf0243c3cc9958f1da65976f
