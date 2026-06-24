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
  - ads_高层经营驾驶舱 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779327122009
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779327122011 (SQL处理)
- Position: (200,100)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779327122010
- Name: dwd_会员触达
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779327122011 (SQL处理)
- Position: (200,250)
- InputDsId: xc82fb232ecdc474f84cd43d
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779327122011
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779327122009 (dwd_订单)
  - id_1779327122010 (dwd_会员触达)

- **Used By (Outputs):**
  - id_1779327122012 (ads_高层经营驾驶舱)
- Position: (500,100)
- SqlScript:
```sql
WITH order_daily AS (
  SELECT
    `业务日期`,
    SUM(`实付金额`) AS `总销售`,
    SUM(CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `实付金额` ELSE 0 END) AS `会员销售`,
    SUM(CASE WHEN `是否到店` = 1 THEN `实付金额` ELSE 0 END) AS `到店销售`,
    COUNT(DISTINCT `订单ID`) AS `总订单数`,
    COUNT(DISTINCT `会员ID`) AS `活跃会员数`,
    COUNT(DISTINCT CASE WHEN `是否会员首单` = 1 THEN `会员ID` END) AS `新增会员数`
  FROM input1
  WHERE `订单状态` = '已完成'
  GROUP BY `业务日期`
),
private_attribution AS (
  SELECT
    t.`触达日期` AS `业务日期`,
    SUM(o.`实付金额`) AS `私域贡献销售`
  FROM input2 t
  JOIN input1 o ON t.`会员ID` = o.`会员ID`
    AND DATEDIFF(o.`业务日期`, t.`触达日期`) BETWEEN 0 AND 7
    AND o.`订单状态` = '已完成'
  GROUP BY t.`触达日期`
)
SELECT
  d.`业务日期`,
  d.`总销售`, d.`会员销售`, d.`到店销售`, d.`总订单数`, d.`活跃会员数`, d.`新增会员数`,
  COALESCE(p.`私域贡献销售`, 0) AS `私域贡献销售`,
  CASE WHEN d.`总销售` > 0 THEN d.`会员销售` / d.`总销售` ELSE 0 END AS `会员销售占比`,
  CASE WHEN d.`总销售` > 0 THEN d.`到店销售` / d.`总销售` ELSE 0 END AS `到店订单占比`,
  CASE WHEN d.`总销售` > 0 THEN COALESCE(p.`私域贡献销售`, 0) / d.`总销售` ELSE 0 END AS `私域贡献收入占比`
FROM order_daily d
LEFT JOIN private_attribution p ON d.`业务日期` = p.`业务日期`
```
- 等价SQL:
```sql
WITH order_daily AS (
  SELECT
    `业务日期`,
    SUM(`实付金额`) AS `总销售`,
    SUM(CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `实付金额` ELSE 0 END) AS `会员销售`,
    SUM(CASE WHEN `是否到店` = 1 THEN `实付金额` ELSE 0 END) AS `到店销售`,
    COUNT(DISTINCT `订单ID`) AS `总订单数`,
    COUNT(DISTINCT `会员ID`) AS `活跃会员数`,
    COUNT(DISTINCT CASE WHEN `是否会员首单` = 1 THEN `会员ID` END) AS `新增会员数`
  FROM input1
  WHERE `订单状态` = '已完成'
  GROUP BY `业务日期`
),
private_attribution AS (
  SELECT
    t.`触达日期` AS `业务日期`,
    SUM(o.`实付金额`) AS `私域贡献销售`
  FROM input2 t
  JOIN input1 o ON t.`会员ID` = o.`会员ID`
    AND DATEDIFF(o.`业务日期`, t.`触达日期`) BETWEEN 0 AND 7
    AND o.`订单状态` = '已完成'
  GROUP BY t.`触达日期`
)
SELECT
  d.`业务日期`,
  d.`总销售`, d.`会员销售`, d.`到店销售`, d.`总订单数`, d.`活跃会员数`, d.`新增会员数`,
  COALESCE(p.`私域贡献销售`, 0) AS `私域贡献销售`,
  CASE WHEN d.`总销售` > 0 THEN d.`会员销售` / d.`总销售` ELSE 0 END AS `会员销售占比`,
  CASE WHEN d.`总销售` > 0 THEN d.`到店销售` / d.`总销售` ELSE 0 END AS `到店订单占比`,
  CASE WHEN d.`总销售` > 0 THEN COALESCE(p.`私域贡献销售`, 0) / d.`总销售` ELSE 0 END AS `私域贡献收入占比`
FROM order_daily d
LEFT JOIN private_attribution p ON d.`业务日期` = p.`业务日期`
```


### 节点4
- Id: id_1779327122012
- Name: ads_高层经营驾驶舱
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779327122011 (SQL处理)
- Position: (800,100)
- OutputDsName: ads_高层经营驾驶舱
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: r9024c50adcdb45c397cde0a
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_会员触达** (DATA_SET_FILE)
  - ID: xc82fb232ecdc474f84cd43d
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82

### 下游资源 (1)
- **ads_高层经营驾驶舱** (DATA_SET_ETL)
  - ID: r9024c50adcdb45c397cde0a
