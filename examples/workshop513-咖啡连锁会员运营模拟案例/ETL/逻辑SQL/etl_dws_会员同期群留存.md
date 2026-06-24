你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 4
- **节点类型分布:**
  - INPUT_DATASET: 2
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - h551155a12fc04d88a57d319 (dim_会员主档)
  - j23ea7e60564e47458b71d82 (dwd_订单)
- **数据输出目标:**
  - dws_会员同期群留存 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818722
- Name: dim_会员主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818724 (SQL处理)
- Position: (200,100)
- InputDsId: h551155a12fc04d88a57d319
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818723
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818724 (SQL处理)
- Position: (200,250)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818724
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818722 (dim_会员主档)
  - id_1779326818723 (dwd_订单)

- **Used By (Outputs):**
  - id_1779326818725 (dws_会员同期群留存)
- Position: (500,100)
- SqlScript:
```sql
WITH first_orders AS (
  SELECT
    m.`会员ID`,
    DATE_TRUNC('MONTH', CAST(m.`注册日期` AS DATE)) AS `注册月份`,
    m.`注册日期`,
    MIN(o.`业务日期`) AS `首单日期`
  FROM input1 m
  LEFT JOIN input2 o ON m.`会员ID` = o.`会员ID` AND o.`订单状态` = '已完成'
  GROUP BY m.`会员ID`, DATE_TRUNC('MONTH', CAST(m.`注册日期` AS DATE)), m.`注册日期`
),
retention AS (
  SELECT
    f.`会员ID`, f.`注册月份`, o.`业务日期`,
    DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) AS `注册后天数`,
    CASE
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 7   THEN 'W1'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 14  THEN 'W2'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 28  THEN 'W4'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 56  THEN 'W8'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 84  THEN 'W12'
      ELSE 'W12+'
    END AS `留存桶`
  FROM first_orders f
  JOIN input2 o ON f.`会员ID` = o.`会员ID`
  WHERE o.`业务日期` >= CAST(f.`注册日期` AS DATE)
)
SELECT
  CAST(`注册月份` AS DATE) AS `注册月份`,
  `留存桶`, COUNT(DISTINCT `会员ID`) AS `留存人数`
FROM retention
GROUP BY `注册月份`, `留存桶`
```
- 等价SQL:
```sql
WITH first_orders AS (
  SELECT
    m.`会员ID`,
    DATE_TRUNC('MONTH', CAST(m.`注册日期` AS DATE)) AS `注册月份`,
    m.`注册日期`,
    MIN(o.`业务日期`) AS `首单日期`
  FROM input1 m
  LEFT JOIN input2 o ON m.`会员ID` = o.`会员ID` AND o.`订单状态` = '已完成'
  GROUP BY m.`会员ID`, DATE_TRUNC('MONTH', CAST(m.`注册日期` AS DATE)), m.`注册日期`
),
retention AS (
  SELECT
    f.`会员ID`, f.`注册月份`, o.`业务日期`,
    DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) AS `注册后天数`,
    CASE
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 7   THEN 'W1'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 14  THEN 'W2'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 28  THEN 'W4'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 56  THEN 'W8'
      WHEN DATEDIFF(o.`业务日期`, CAST(f.`注册日期` AS DATE)) <= 84  THEN 'W12'
      ELSE 'W12+'
    END AS `留存桶`
  FROM first_orders f
  JOIN input2 o ON f.`会员ID` = o.`会员ID`
  WHERE o.`业务日期` >= CAST(f.`注册日期` AS DATE)
)
SELECT
  CAST(`注册月份` AS DATE) AS `注册月份`,
  `留存桶`, COUNT(DISTINCT `会员ID`) AS `留存人数`
FROM retention
GROUP BY `注册月份`, `留存桶`
```


### 节点4
- Id: id_1779326818725
- Name: dws_会员同期群留存
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818724 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_会员同期群留存
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: t2a6721b5e2d04f58ad6b8f9
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dim_会员主档** (DATA_SET_FILE)
  - ID: h551155a12fc04d88a57d319
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82

### 下游资源 (1)
- **dws_会员同期群留存** (DATA_SET_ETL)
  - ID: t2a6721b5e2d04f58ad6b8f9
