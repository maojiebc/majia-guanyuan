你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 6
- **节点类型分布:**
  - INPUT_DATASET: 4
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - gb9ba62434aa54e3eadc082a (dwd_订单商品)
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
  - hef208f72e96a4a16a4ebf71 (dim_商品主档)
- **数据输出目标:**
  - dws_商品销售分析 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818723
- Name: dwd_订单商品
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818727 (SQL处理)
- Position: (200,100)
- InputDsId: gb9ba62434aa54e3eadc082a
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818727
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818723 (dwd_订单商品)
  - id_1779326818724 (dwd_订单)
  - id_1779326818725 (dim_商品主档)
  - id_1779326818726 (dim_门店主档)

- **Used By (Outputs):**
  - id_1779326818728 (dws_商品销售分析)
- Position: (500,100)
- SqlScript:
```sql
SELECT
  p.`一级类目`, p.`二级类目`, p.`商品ID`, p.`商品名称`,
  s.`省份`, s.`城市`, s.`城市层级`, s.`店型`,
  o.`销售渠道`, o.`是否到店`, o.`业务日期`,
  COUNT(DISTINCT o.`订单ID`) AS `订单数`,
  SUM(i.`数量`) AS `销量`,
  SUM(i.`行金额`) AS `销售额`,
  SUM(i.`数量` * p.`成本`) AS `总成本`,
  SUM(i.`行金额`) - SUM(i.`数量` * p.`成本`) AS `毛利`
FROM input1 i
JOIN input2 o ON i.`订单ID` = o.`订单ID`
JOIN input3 p ON i.`商品ID` = p.`商品ID`
JOIN input4 s ON o.`门店ID` = s.`门店ID`
WHERE o.`订单状态` = '已完成'
GROUP BY p.`一级类目`, p.`二级类目`, p.`商品ID`, p.`商品名称`,
         s.`省份`, s.`城市`, s.`城市层级`, s.`店型`,
         o.`销售渠道`, o.`是否到店`, o.`业务日期`
```
- 等价SQL:
```sql
SELECT
  p.`一级类目`, p.`二级类目`, p.`商品ID`, p.`商品名称`,
  s.`省份`, s.`城市`, s.`城市层级`, s.`店型`,
  o.`销售渠道`, o.`是否到店`, o.`业务日期`,
  COUNT(DISTINCT o.`订单ID`) AS `订单数`,
  SUM(i.`数量`) AS `销量`,
  SUM(i.`行金额`) AS `销售额`,
  SUM(i.`数量` * p.`成本`) AS `总成本`,
  SUM(i.`行金额`) - SUM(i.`数量` * p.`成本`) AS `毛利`
FROM input1 i
JOIN input2 o ON i.`订单ID` = o.`订单ID`
JOIN input3 p ON i.`商品ID` = p.`商品ID`
JOIN input4 s ON o.`门店ID` = s.`门店ID`
WHERE o.`订单状态` = '已完成'
GROUP BY p.`一级类目`, p.`二级类目`, p.`商品ID`, p.`商品名称`,
         s.`省份`, s.`城市`, s.`城市层级`, s.`店型`,
         o.`销售渠道`, o.`是否到店`, o.`业务日期`
```


### 节点3
- Id: id_1779326818724
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818727 (SQL处理)
- Position: (200,250)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779326818726
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818727 (SQL处理)
- Position: (200,550)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点5
- Id: id_1779326818725
- Name: dim_商品主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818727 (SQL处理)
- Position: (200,400)
- InputDsId: hef208f72e96a4a16a4ebf71
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点6
- Id: id_1779326818728
- Name: dws_商品销售分析
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818727 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_商品销售分析
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: u4551251219e445cab03355f
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (4)
- **dwd_订单商品** (DATA_SET_FILE)
  - ID: gb9ba62434aa54e3eadc082a
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7
- **dim_商品主档** (DATA_SET_FILE)
  - ID: hef208f72e96a4a16a4ebf71

### 下游资源 (1)
- **dws_商品销售分析** (DATA_SET_ETL)
  - ID: u4551251219e445cab03355f
