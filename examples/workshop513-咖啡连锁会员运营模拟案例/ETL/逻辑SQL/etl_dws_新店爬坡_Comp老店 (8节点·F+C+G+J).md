你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 8
- **节点类型分布:**
  - CALCULATOR: 2
  - FILTER_ROWS: 1
  - GROUP_BY: 1
  - INPUT_DATASET: 2
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
- **数据输入源:**
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
- **数据输出目标:**
  - dws_新店爬坡_Comp老店 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779337109457
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337109459 (筛选已完成订单)
- Position: (227,64)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779337109458
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337109462 (关联门店维度)
- Position: (839,232)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779337109459
- Name: 筛选已完成订单
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779337109457 (dwd_订单)

- **Used By (Outputs):**
  - id_1779337109460 (标记订单/会员订单)
- Position: (431,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`订单状态` = '已完成')
```


### 节点4
- Id: id_1779337109460
- Name: 标记订单/会员订单
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337109459 (筛选已完成订单)

- **Used By (Outputs):**
  - id_1779337109461 (门店日聚合)
- Position: (635,64)
- FormulaNames:
  - 订单计数
  - 会员订单计数
- 等价SQL:
```sql
SELECT
  *,
  1 AS `订单计数`,
  case when `会员ID` is not null and `会员ID` <> '' then 1 else 0 end AS `会员订单计数`
FROM input1
```


### 节点5
- Id: id_1779337109461
- Name: 门店日聚合
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779337109460 (标记订单/会员订单)

- **Used By (Outputs):**
  - id_1779337109462 (关联门店维度)
- Position: (839,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点6
- Id: id_1779337109462
- Name: 关联门店维度
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779337109461 (门店日聚合)
  - id_1779337109458 (dim_门店主档)

- **Used By (Outputs):**
  - id_1779337109463 (计算爬坡阶段+成长类型)
- Position: (1043,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`门店ID` = input2.`门店ID`
```


### 节点7
- Id: id_1779337109463
- Name: 计算爬坡阶段+成长类型
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337109462 (关联门店维度)

- **Used By (Outputs):**
  - id_1779337109464 (dws_新店爬坡_Comp老店)
- Position: (1247,64)
- FormulaNames:
  - 开业天数
  - 爬坡阶段
  - 门店成长类型
  - 平均客单价
  - 会员订单占比
- 等价SQL:
```sql
SELECT
  *,
  datediff(`业务日期`, `开业日期`) AS `开业天数`,
  case when `是否90天内新店` = 'TRUE' then   case when datediff(`业务日期`,`开业日期`) <= 7 then 'W1'        when datediff(`业务日期`,`开业日期`) <= 14 then 'W2'        when datediff(`业务日期`,`开业日期`) <= 30 then 'M1'        when datediff(`业务日期`,`开业日期`) <= 60 then 'M2'        else 'M3+' end else 'Comp老店' end AS `爬坡阶段`,
  case when `是否90天内新店` = 'TRUE' then '新店'      when datediff(`业务日期`,`开业日期`) > 365 then 'Comp老店'      else '次新店' end AS `门店成长类型`,
  `销售额` * 1.0 / `订单数` AS `平均客单价`,
  case when `订单数` > 0 then `会员订单数` * 1.0 / `订单数` else 0 end AS `会员订单占比`
FROM input1
```


### 节点8
- Id: id_1779337109464
- Name: dws_新店爬坡_Comp老店
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779337109463 (计算爬坡阶段+成长类型)
- Position: (1451,64)
- OutputDsName: dws_新店爬坡_Comp老店
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: o88b336d58b5047de98993b1
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82

### 下游资源 (1)
- **dws_新店爬坡_Comp老店** (DATA_SET_ETL)
  - ID: o88b336d58b5047de98993b1
