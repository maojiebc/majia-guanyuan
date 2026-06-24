你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 10
- **节点类型分布:**
  - CALCULATOR: 2
  - FILTER_ROWS: 2
  - GROUP_BY: 1
  - INPUT_DATASET: 2
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - h551155a12fc04d88a57d319 (dim_会员主档)
- **数据输出目标:**
  - dws_会员RFM分层 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779336902430
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779336902432 (筛选已完成订单)
- Position: (227,64)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779336902431
- Name: dim_会员主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779336902438 (关联会员维度)
- Position: (1451,232)
- InputDsId: h551155a12fc04d88a57d319
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779336902436
- Name: 计算R/F/M评分
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779336902435 (会员级聚合)

- **Used By (Outputs):**
  - id_1779336902437 (RFM标签)
- Position: (1247,64)
- SqlScript:
```sql
SELECT
  `会员ID`,
  `业务日期` AS `最近消费日期`,
  `订单计数` AS `消费次数`,
  `实付金额` AS `消费金额`,
  DATEDIFF(DATE '2026-05-20', `业务日期`) AS `距今天数`,
  CASE
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 7  THEN 5
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 14 THEN 4
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 30 THEN 3
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 60 THEN 2
    ELSE 1 END AS `R分`,
  CASE WHEN `订单计数` >= 50 THEN 5 WHEN `订单计数` >= 25 THEN 4
       WHEN `订单计数` >= 12 THEN 3 WHEN `订单计数` >= 4 THEN 2 ELSE 1 END AS `F分`,
  CASE WHEN `实付金额` >= 3000 THEN 5 WHEN `实付金额` >= 1200 THEN 4
       WHEN `实付金额` >= 400 THEN 3  WHEN `实付金额` >= 100 THEN 2 ELSE 1 END AS `M分`
FROM input1
```
- 等价SQL:
```sql
SELECT
  `会员ID`,
  `业务日期` AS `最近消费日期`,
  `订单计数` AS `消费次数`,
  `实付金额` AS `消费金额`,
  DATEDIFF(DATE '2026-05-20', `业务日期`) AS `距今天数`,
  CASE
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 7  THEN 5
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 14 THEN 4
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 30 THEN 3
    WHEN DATEDIFF(DATE '2026-05-20', `业务日期`) <= 60 THEN 2
    ELSE 1 END AS `R分`,
  CASE WHEN `订单计数` >= 50 THEN 5 WHEN `订单计数` >= 25 THEN 4
       WHEN `订单计数` >= 12 THEN 3 WHEN `订单计数` >= 4 THEN 2 ELSE 1 END AS `F分`,
  CASE WHEN `实付金额` >= 3000 THEN 5 WHEN `实付金额` >= 1200 THEN 4
       WHEN `实付金额` >= 400 THEN 3  WHEN `实付金额` >= 100 THEN 2 ELSE 1 END AS `M分`
FROM input1
```


### 节点4
- Id: id_1779336902438
- Name: 关联会员维度
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779336902437 (RFM标签)
  - id_1779336902431 (dim_会员主档)

- **Used By (Outputs):**
  - id_1779336902439 (dws_会员RFM分层)
- Position: (1655,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`会员ID` = input2.`会员ID`
```


### 节点5
- Id: id_1779336902432
- Name: 筛选已完成订单
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779336902430 (dwd_订单)

- **Used By (Outputs):**
  - id_1779336902433 (标记会员订单+订单计数)
- Position: (431,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`订单状态` = '已完成')
```


### 节点6
- Id: id_1779336902437
- Name: RFM标签
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779336902436 (计算R/F/M评分)

- **Used By (Outputs):**
  - id_1779336902438 (关联会员维度)
- Position: (1451,64)
- FormulaNames:
  - RFM总分
  - RFM标签
- 等价SQL:
```sql
SELECT
  *,
  `R分` + `F分` + `M分` AS `RFM总分`,
  case when `R分` >= 4 and `F分` >= 4 and `M分` >= 4 then '重要价值客户' when `R分` >= 4 and `F分` <= 2 and `M分` >= 4 then '重要发展客户' when `R分` <= 2 and `F分` >= 4 and `M分` >= 4 then '重要保持客户' when `R分` <= 2 and `F分` <= 2 and `M分` >= 4 then '重要挽留客户' when `R分` >= 4 and `F分` >= 4 and `M分` <= 3 then '一般价值客户' when `R分` >= 4 and `F分` <= 2 and `M分` <= 3 then '一般发展客户' when `R分` <= 2 and `F分` >= 4 and `M分` <= 3 then '一般保持客户' when `R分` <= 2 and `F分` <= 2 and `M分` <= 3 then '一般挽留客户' else '中间客群' end AS `RFM标签`
FROM input1
```


### 节点7
- Id: id_1779336902433
- Name: 标记会员订单+订单计数
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779336902432 (筛选已完成订单)

- **Used By (Outputs):**
  - id_1779336902434 (筛选会员订单)
- Position: (635,64)
- FormulaNames:
  - 会员标志
  - 订单计数
- 等价SQL:
```sql
SELECT
  *,
  case when `会员ID` is not null and `会员ID` <> '' then 1 else 0 end AS `会员标志`,
  1 AS `订单计数`
FROM input1
```


### 节点8
- Id: id_1779336902439
- Name: dws_会员RFM分层
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779336902438 (关联会员维度)
- Position: (1859,64)
- OutputDsName: dws_会员RFM分层
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: i2e9c28c8e656429ca007f68
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点9
- Id: id_1779336902434
- Name: 筛选会员订单
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779336902433 (标记会员订单+订单计数)

- **Used By (Outputs):**
  - id_1779336902435 (会员级聚合)
- Position: (839,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`会员标志` = '1')
```


### 节点10
- Id: id_1779336902435
- Name: 会员级聚合
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779336902434 (筛选会员订单)

- **Used By (Outputs):**
  - id_1779336902436 (计算R/F/M评分)
- Position: (1043,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_会员主档** (DATA_SET_FILE)
  - ID: h551155a12fc04d88a57d319

### 下游资源 (1)
- **dws_会员RFM分层** (DATA_SET_ETL)
  - ID: i2e9c28c8e656429ca007f68
