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
  - g7d7bf84e1e96448f9c0dfe3 (dwd_门店目标)
  - j23ea7e60564e47458b71d82 (dwd_订单)
- **数据输出目标:**
  - dws_目标达成 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818729
- Name: dwd_门店目标
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818731 (SQL处理)
- Position: (200,100)
- InputDsId: g7d7bf84e1e96448f9c0dfe3
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818730
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818731 (SQL处理)
- Position: (200,250)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818731
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818729 (dwd_门店目标)
  - id_1779326818730 (dwd_订单)

- **Used By (Outputs):**
  - id_1779326818732 (dws_目标达成)
- Position: (500,100)
- SqlScript:
```sql
WITH order_agg AS (
  SELECT
    `门店ID`,
    SUBSTR(CAST(`业务日期` AS STRING), 1, 7) AS `年月`,
    SUM(`实付金额`) AS `实际销售额`,
    COUNT(DISTINCT CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `订单ID` END) AS `实际会员订单数`
  FROM input2
  WHERE `订单状态` = '已完成'
  GROUP BY `门店ID`, SUBSTR(CAST(`业务日期` AS STRING), 1, 7)
)
SELECT
  t.`门店ID`, t.`年月`, t.`目标指标`, t.`目标值`,
  CASE
    WHEN t.`目标指标` = '销售额' THEN COALESCE(o.`实际销售额`, 0)
    WHEN t.`目标指标` = '会员订单数' THEN COALESCE(o.`实际会员订单数`, 0)
    ELSE 0
  END AS `实际值`,
  CASE
    WHEN t.`目标值` > 0 THEN
      CASE
        WHEN t.`目标指标` = '销售额' THEN COALESCE(o.`实际销售额`, 0) / t.`目标值`
        WHEN t.`目标指标` = '会员订单数' THEN COALESCE(o.`实际会员订单数`, 0) / t.`目标值`
        ELSE 0
      END
    ELSE 0
  END AS `达成率`,
  CASE
    WHEN t.`目标指标` = '销售额' THEN t.`目标值` - COALESCE(o.`实际销售额`, 0)
    WHEN t.`目标指标` = '会员订单数' THEN t.`目标值` - COALESCE(o.`实际会员订单数`, 0)
    ELSE 0
  END AS `目标缺口`
FROM input1 t
LEFT JOIN order_agg o ON t.`门店ID` = o.`门店ID` AND t.`年月` = o.`年月`
```
- 等价SQL:
```sql
WITH order_agg AS (
  SELECT
    `门店ID`,
    SUBSTR(CAST(`业务日期` AS STRING), 1, 7) AS `年月`,
    SUM(`实付金额`) AS `实际销售额`,
    COUNT(DISTINCT CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `订单ID` END) AS `实际会员订单数`
  FROM input2
  WHERE `订单状态` = '已完成'
  GROUP BY `门店ID`, SUBSTR(CAST(`业务日期` AS STRING), 1, 7)
)
SELECT
  t.`门店ID`, t.`年月`, t.`目标指标`, t.`目标值`,
  CASE
    WHEN t.`目标指标` = '销售额' THEN COALESCE(o.`实际销售额`, 0)
    WHEN t.`目标指标` = '会员订单数' THEN COALESCE(o.`实际会员订单数`, 0)
    ELSE 0
  END AS `实际值`,
  CASE
    WHEN t.`目标值` > 0 THEN
      CASE
        WHEN t.`目标指标` = '销售额' THEN COALESCE(o.`实际销售额`, 0) / t.`目标值`
        WHEN t.`目标指标` = '会员订单数' THEN COALESCE(o.`实际会员订单数`, 0) / t.`目标值`
        ELSE 0
      END
    ELSE 0
  END AS `达成率`,
  CASE
    WHEN t.`目标指标` = '销售额' THEN t.`目标值` - COALESCE(o.`实际销售额`, 0)
    WHEN t.`目标指标` = '会员订单数' THEN t.`目标值` - COALESCE(o.`实际会员订单数`, 0)
    ELSE 0
  END AS `目标缺口`
FROM input1 t
LEFT JOIN order_agg o ON t.`门店ID` = o.`门店ID` AND t.`年月` = o.`年月`
```


### 节点4
- Id: id_1779326818732
- Name: dws_目标达成
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818731 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_目标达成
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: me754bd92ca384667a33a6d1
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_门店目标** (DATA_SET_FILE)
  - ID: g7d7bf84e1e96448f9c0dfe3
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82

### 下游资源 (1)
- **dws_目标达成** (DATA_SET_ETL)
  - ID: me754bd92ca384667a33a6d1
