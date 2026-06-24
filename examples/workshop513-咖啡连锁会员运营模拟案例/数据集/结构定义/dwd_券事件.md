我正在查看一个数据集的详细配置信息：

## 基本信息
- 数据集ID: fc906172fbf4b443d92acc24
- 数据集名称: dwd_券事件
- 显示类型: CSV
- 状态: FINISHED
- 完整路径: 根目录>马甲的模拟数据集>dwd_券事件
- UniformResourceType: DATA_SET_FILE
- SourceType: WEB_UPLOAD

## 数据规模
- 数据行数: 1.183768e+06 行
- 字段列数: 11 列

## 时间信息
- 创建时间: 2026-05-21 09:13:27+0800
- 更新时间: 2026-05-21 09:14:43+0800


---

## 字段结构概览

### 字段分类统计
- **总字段数**: 11
- **普通字段**: 11 个
- **计算字段**: 0 个
- **维度字段**: 10 个
- **度量字段**: 1 个

### 字段列表

- 券ID (fdId: ld359faa87beb4ea189cb07a)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 券模板ID (fdId: k7de6f5e0bb05477ebe839d5)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 来源活动ID (fdId: t8af2cbdbfc6f485a95a0149)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 会员ID (fdId: v5f85534dbb0443188f1d677)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 发放日期 (fdId: c090fab84a06b43b4abf59e7)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 失效日期 (fdId: ide413d9172404cdaa7ec647)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 核销日期 (fdId: fd0bc2e8c2fb5423997be4fd)
  - 字段类型: DATE
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 门店ID (fdId: l3f412ab25bbf4b1da313f7d)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 订单ID (fdId: h1461952a6121435e824befc)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

- 折扣金额 (fdId: ve17b31061f17410ca2b5f26)
  - 字段类型: DOUBLE
  - 元类型: METRIC
  - 计算类型: normal
  - 来源: 物理列

- 发放渠道 (fdId: e2c95551794324e398f408a4)
  - 字段类型: STRING
  - 元类型: DIM
  - 计算类型: normal
  - 来源: 物理列

---

## Malloy 数据源定义

以下是该数据集的 Malloy source 定义,展示了数据表的结构和计算字段:

```malloy
source: `dwd_券事件` is table('fc906172fbf4b443d92acc24') extend {
  // Base columns from table:
  //   - 券ID (STRING)
  //   - 券模板ID (STRING)
  //   - 来源活动ID (STRING)
  //   - 会员ID (STRING)
  //   - 发放日期 (DATE)
  //   - 失效日期 (DATE)
  //   - 核销日期 (DATE)
  //   - 门店ID (STRING)
  //   - 订单ID (STRING)
  //   - 折扣金额 (DOUBLE)
  //   - 发放渠道 (STRING)

}
```

**说明:**
- **基础列**: 直接来自数据表的原始字段,以注释形式列出
- **dimension**: 维度字段(用于分组、筛选、钻取),包含计算逻辑和分组定义
- **measure**: 度量字段(用于聚合计算,如求和、平均等)

---

## 血缘关系

### 下游资源 (3)
- **etl_dws_券效益分析** (DATA_PROCESS_ETL)
  - ID: v0a6e6562f9984c789f8a8cc
- **etl_ads_活动权益复盘 (17节点·C+G+F+C+G×2+S+J×3+C)** (DATA_PROCESS_ETL)
  - ID: g75c5f907f4bb4e87938fa35
- **repro_活动权益复盘_前端编辑bug** (DATA_PROCESS_ETL)
  - ID: p38ae465fd99b47bebd3c5eb
