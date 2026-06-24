你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 5
- **节点类型分布:**
  - INPUT_DATASET: 3
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - fc906172fbf4b443d92acc24 (dwd_券事件)
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - m5e3bf1eed73f434280fa950 (dim_券模板)
- **数据输出目标:**
  - dws_券效益分析 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779327121995
- Name: dwd_券事件
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779327121998 (SQL处理)
- Position: (200,100)
- InputDsId: fc906172fbf4b443d92acc24
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779327121996
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779327121998 (SQL处理)
- Position: (200,250)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779327121997
- Name: dim_券模板
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779327121998 (SQL处理)
- Position: (200,400)
- InputDsId: m5e3bf1eed73f434280fa950
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779327121998
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779327121995 (dwd_券事件)
  - id_1779327121996 (dwd_订单)
  - id_1779327121997 (dim_券模板)

- **Used By (Outputs):**
  - id_1779327121999 (dws_券效益分析)
- Position: (500,100)
- SqlScript:
```sql
WITH issue_agg AS (
  SELECT
    `券模板ID`, `发放日期` AS `业务日期`,
    COUNT(*) AS `发放数`,
    SUM(CASE WHEN `核销日期` IS NOT NULL THEN 1 ELSE 0 END) AS `核销数`,
    SUM(COALESCE(`折扣金额`, 0)) AS `总折扣金额`
  FROM input1
  GROUP BY `券模板ID`, `发放日期`
),
order_lift AS (
  SELECT
    DATE(c.`核销日期`) AS `业务日期`, c.`券模板ID`,
    SUM(o.`实付金额`) AS `拉动销售额`,
    COUNT(DISTINCT o.`订单ID`) AS `拉动订单数`
  FROM input1 c
  JOIN input2 o ON c.`订单ID` = o.`订单ID`
  WHERE c.`核销日期` IS NOT NULL
  GROUP BY DATE(c.`核销日期`), c.`券模板ID`
)
SELECT
  i.`券模板ID`, t.`券名称`, t.`券类型`, t.`优惠形式`,
  i.`业务日期`, i.`发放数`, i.`核销数`,
  CASE WHEN i.`发放数` > 0 THEN i.`核销数` * 1.0 / i.`发放数` ELSE 0 END AS `核销率`,
  i.`总折扣金额`,
  COALESCE(l.`拉动销售额`, 0) AS `拉动销售额`,
  COALESCE(l.`拉动订单数`, 0) AS `拉动订单数`,
  CASE WHEN i.`总折扣金额` > 0 THEN COALESCE(l.`拉动销售额`, 0) / i.`总折扣金额` ELSE NULL END AS `ROI`
FROM issue_agg i
LEFT JOIN order_lift l ON i.`券模板ID` = l.`券模板ID` AND i.`业务日期` = l.`业务日期`
LEFT JOIN input3 t ON i.`券模板ID` = t.`券模板ID`
```
- 等价SQL:
```sql
WITH issue_agg AS (
  SELECT
    `券模板ID`, `发放日期` AS `业务日期`,
    COUNT(*) AS `发放数`,
    SUM(CASE WHEN `核销日期` IS NOT NULL THEN 1 ELSE 0 END) AS `核销数`,
    SUM(COALESCE(`折扣金额`, 0)) AS `总折扣金额`
  FROM input1
  GROUP BY `券模板ID`, `发放日期`
),
order_lift AS (
  SELECT
    DATE(c.`核销日期`) AS `业务日期`, c.`券模板ID`,
    SUM(o.`实付金额`) AS `拉动销售额`,
    COUNT(DISTINCT o.`订单ID`) AS `拉动订单数`
  FROM input1 c
  JOIN input2 o ON c.`订单ID` = o.`订单ID`
  WHERE c.`核销日期` IS NOT NULL
  GROUP BY DATE(c.`核销日期`), c.`券模板ID`
)
SELECT
  i.`券模板ID`, t.`券名称`, t.`券类型`, t.`优惠形式`,
  i.`业务日期`, i.`发放数`, i.`核销数`,
  CASE WHEN i.`发放数` > 0 THEN i.`核销数` * 1.0 / i.`发放数` ELSE 0 END AS `核销率`,
  i.`总折扣金额`,
  COALESCE(l.`拉动销售额`, 0) AS `拉动销售额`,
  COALESCE(l.`拉动订单数`, 0) AS `拉动订单数`,
  CASE WHEN i.`总折扣金额` > 0 THEN COALESCE(l.`拉动销售额`, 0) / i.`总折扣金额` ELSE NULL END AS `ROI`
FROM issue_agg i
LEFT JOIN order_lift l ON i.`券模板ID` = l.`券模板ID` AND i.`业务日期` = l.`业务日期`
LEFT JOIN input3 t ON i.`券模板ID` = t.`券模板ID`
```


### 节点5
- Id: id_1779327121999
- Name: dws_券效益分析
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779327121998 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_券效益分析
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: h6c06660548ba4d8daaf2bd3
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (3)
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_券模板** (DATA_SET_FILE)
  - ID: m5e3bf1eed73f434280fa950
- **dwd_券事件** (DATA_SET_FILE)
  - ID: fc906172fbf4b443d92acc24

### 下游资源 (1)
- **dws_券效益分析** (DATA_SET_ETL)
  - ID: h6c06660548ba4d8daaf2bd3
