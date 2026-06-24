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
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - xc82fb232ecdc474f84cd43d (dwd_会员触达)
- **数据输出目标:**
  - ads_会员私域驾驶舱 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818731
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818733 (SQL处理)
- Position: (200,100)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818732
- Name: dwd_会员触达
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818733 (SQL处理)
- Position: (200,250)
- InputDsId: xc82fb232ecdc474f84cd43d
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818733
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818731 (dwd_订单)
  - id_1779326818732 (dwd_会员触达)

- **Used By (Outputs):**
  - id_1779326818734 (ads_会员私域驾驶舱)
- Position: (500,100)
- SqlScript:
```sql
WITH order_monthly AS (
  SELECT
    DATE_TRUNC('MONTH', CAST(`业务日期` AS DATE)) AS `年月`,
    COUNT(DISTINCT `会员ID`) AS `当月活跃会员`,
    COUNT(DISTINCT CASE WHEN `是否会员首单` = 1 THEN `会员ID` END) AS `新增首单会员`,
    SUM(`实付金额`) AS `总销售`,
    SUM(CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `实付金额` ELSE 0 END) AS `会员销售`,
    SUM(CASE WHEN `是否到店` = 1 THEN `实付金额` ELSE 0 END) AS `到店销售`,
    COUNT(DISTINCT `订单ID`) AS `总订单数`
  FROM input1
  WHERE `订单状态` = '已完成'
  GROUP BY DATE_TRUNC('MONTH', CAST(`业务日期` AS DATE))
),
touch_monthly AS (
  SELECT
    DATE_TRUNC('MONTH', CAST(`触达日期` AS DATE)) AS `年月`,
    COUNT(DISTINCT `触达ID`) AS `触达次数`,
    COUNT(DISTINCT `会员ID`) AS `触达会员数`
  FROM input2
  GROUP BY DATE_TRUNC('MONTH', CAST(`触达日期` AS DATE))
)
SELECT
  o.`年月`,
  o.`当月活跃会员`, o.`新增首单会员`,
  o.`总销售`, o.`会员销售`, o.`到店销售`, o.`总订单数`,
  COALESCE(t.`触达次数`, 0) AS `触达次数`,
  COALESCE(t.`触达会员数`, 0) AS `触达会员数`,
  CASE WHEN o.`总销售` > 0 THEN o.`会员销售` / o.`总销售` ELSE 0 END AS `会员销售占比`,
  CASE WHEN o.`总销售` > 0 THEN o.`到店销售` / o.`总销售` ELSE 0 END AS `到店销售占比`
FROM order_monthly o
LEFT JOIN touch_monthly t ON o.`年月` = t.`年月`
```
- 等价SQL:
```sql
WITH order_monthly AS (
  SELECT
    DATE_TRUNC('MONTH', CAST(`业务日期` AS DATE)) AS `年月`,
    COUNT(DISTINCT `会员ID`) AS `当月活跃会员`,
    COUNT(DISTINCT CASE WHEN `是否会员首单` = 1 THEN `会员ID` END) AS `新增首单会员`,
    SUM(`实付金额`) AS `总销售`,
    SUM(CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `实付金额` ELSE 0 END) AS `会员销售`,
    SUM(CASE WHEN `是否到店` = 1 THEN `实付金额` ELSE 0 END) AS `到店销售`,
    COUNT(DISTINCT `订单ID`) AS `总订单数`
  FROM input1
  WHERE `订单状态` = '已完成'
  GROUP BY DATE_TRUNC('MONTH', CAST(`业务日期` AS DATE))
),
touch_monthly AS (
  SELECT
    DATE_TRUNC('MONTH', CAST(`触达日期` AS DATE)) AS `年月`,
    COUNT(DISTINCT `触达ID`) AS `触达次数`,
    COUNT(DISTINCT `会员ID`) AS `触达会员数`
  FROM input2
  GROUP BY DATE_TRUNC('MONTH', CAST(`触达日期` AS DATE))
)
SELECT
  o.`年月`,
  o.`当月活跃会员`, o.`新增首单会员`,
  o.`总销售`, o.`会员销售`, o.`到店销售`, o.`总订单数`,
  COALESCE(t.`触达次数`, 0) AS `触达次数`,
  COALESCE(t.`触达会员数`, 0) AS `触达会员数`,
  CASE WHEN o.`总销售` > 0 THEN o.`会员销售` / o.`总销售` ELSE 0 END AS `会员销售占比`,
  CASE WHEN o.`总销售` > 0 THEN o.`到店销售` / o.`总销售` ELSE 0 END AS `到店销售占比`
FROM order_monthly o
LEFT JOIN touch_monthly t ON o.`年月` = t.`年月`
```


### 节点4
- Id: id_1779326818734
- Name: ads_会员私域驾驶舱
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818733 (SQL处理)
- Position: (800,100)
- OutputDsName: ads_会员私域驾驶舱
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: p2bcc84756ad94855896dd97
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dwd_会员触达** (DATA_SET_FILE)
  - ID: xc82fb232ecdc474f84cd43d

### 下游资源 (1)
- **ads_会员私域驾驶舱** (DATA_SET_ETL)
  - ID: p2bcc84756ad94855896dd97
