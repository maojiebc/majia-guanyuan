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
  - h551155a12fc04d88a57d319 (dim_会员主档)
- **数据输出目标:**
  - dws_会员生命周期 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818717
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818719 (SQL处理)
- Position: (200,100)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818718
- Name: dim_会员主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818719 (SQL处理)
- Position: (200,250)
- InputDsId: h551155a12fc04d88a57d319
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818719
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818717 (dwd_订单)
  - id_1779326818718 (dim_会员主档)

- **Used By (Outputs):**
  - id_1779326818720 (dws_会员生命周期)
- Position: (500,100)
- SqlScript:
```sql
WITH order_stats AS (
  SELECT
    `会员ID`,
    MIN(`业务日期`) AS `首单日期`,
    MAX(`业务日期`) AS `末单日期`,
    COUNT(DISTINCT `订单ID`) AS `总订单数`,
    SUM(`实付金额`) AS `总消费金额`,
    COUNT(DISTINCT CASE WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 30) THEN `订单ID` END) AS `近30天订单`,
    COUNT(DISTINCT CASE WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 7) THEN `订单ID` END) AS `近7天订单`
  FROM input1
  WHERE `订单状态` = '已完成' AND (`会员ID` IS NOT NULL AND `会员ID` <> '')
  GROUP BY `会员ID`
)
SELECT
  m.`会员ID`, m.`会员等级`, m.`注册日期`, m.`注册渠道`, m.`注册门店ID`, m.`城市`,
  DATEDIFF(DATE '2026-05-20', CAST(m.`注册日期` AS DATE)) AS `注册天数`,
  os.`首单日期`, os.`末单日期`,
  COALESCE(os.`总订单数`, 0) AS `总订单数`,
  COALESCE(os.`总消费金额`, 0) AS `总消费金额`,
  COALESCE(os.`近30天订单`, 0) AS `近30天订单`,
  COALESCE(os.`近7天订单`, 0) AS `近7天订单`,
  DATEDIFF(DATE '2026-05-20', COALESCE(os.`末单日期`, CAST(m.`注册日期` AS DATE))) AS `距末单天数`,
  CASE
    WHEN os.`首单日期` IS NULL
         AND DATEDIFF(DATE '2026-05-20', CAST(m.`注册日期` AS DATE)) <= 7  THEN '新客-未首单'
    WHEN os.`首单日期` IS NULL                                              THEN '注册未消费'
    WHEN DATEDIFF(DATE '2026-05-20', os.`首单日期`) <= 30                   THEN '新客-已首单'
    WHEN DATEDIFF(DATE '2026-05-20', os.`末单日期`)  <= 30
         AND os.`总订单数` >= 3                                             THEN '活跃'
    WHEN DATEDIFF(DATE '2026-05-20', os.`末单日期`)  <= 30                  THEN '一般活跃'
    WHEN DATEDIFF(DATE '2026-05-20', os.`末单日期`)  <= 60                  THEN '沉睡'
    ELSE '流失'
  END AS `生命周期阶段`
FROM input2 m
LEFT JOIN order_stats os ON m.`会员ID` = os.`会员ID`
```
- 等价SQL:
```sql
WITH order_stats AS (
  SELECT
    `会员ID`,
    MIN(`业务日期`) AS `首单日期`,
    MAX(`业务日期`) AS `末单日期`,
    COUNT(DISTINCT `订单ID`) AS `总订单数`,
    SUM(`实付金额`) AS `总消费金额`,
    COUNT(DISTINCT CASE WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 30) THEN `订单ID` END) AS `近30天订单`,
    COUNT(DISTINCT CASE WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 7) THEN `订单ID` END) AS `近7天订单`
  FROM input1
  WHERE `订单状态` = '已完成' AND (`会员ID` IS NOT NULL AND `会员ID` <> '')
  GROUP BY `会员ID`
)
SELECT
  m.`会员ID`, m.`会员等级`, m.`注册日期`, m.`注册渠道`, m.`注册门店ID`, m.`城市`,
  DATEDIFF(DATE '2026-05-20', CAST(m.`注册日期` AS DATE)) AS `注册天数`,
  os.`首单日期`, os.`末单日期`,
  COALESCE(os.`总订单数`, 0) AS `总订单数`,
  COALESCE(os.`总消费金额`, 0) AS `总消费金额`,
  COALESCE(os.`近30天订单`, 0) AS `近30天订单`,
  COALESCE(os.`近7天订单`, 0) AS `近7天订单`,
  DATEDIFF(DATE '2026-05-20', COALESCE(os.`末单日期`, CAST(m.`注册日期` AS DATE))) AS `距末单天数`,
  CASE
    WHEN os.`首单日期` IS NULL
         AND DATEDIFF(DATE '2026-05-20', CAST(m.`注册日期` AS DATE)) <= 7  THEN '新客-未首单'
    WHEN os.`首单日期` IS NULL                                              THEN '注册未消费'
    WHEN DATEDIFF(DATE '2026-05-20', os.`首单日期`) <= 30                   THEN '新客-已首单'
    WHEN DATEDIFF(DATE '2026-05-20', os.`末单日期`)  <= 30
         AND os.`总订单数` >= 3                                             THEN '活跃'
    WHEN DATEDIFF(DATE '2026-05-20', os.`末单日期`)  <= 30                  THEN '一般活跃'
    WHEN DATEDIFF(DATE '2026-05-20', os.`末单日期`)  <= 60                  THEN '沉睡'
    ELSE '流失'
  END AS `生命周期阶段`
FROM input2 m
LEFT JOIN order_stats os ON m.`会员ID` = os.`会员ID`
```


### 节点4
- Id: id_1779326818720
- Name: dws_会员生命周期
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818719 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_会员生命周期
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: x808f7e31adc4423e9471801
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
- **dim_会员主档** (DATA_SET_FILE)
  - ID: h551155a12fc04d88a57d319

### 下游资源 (1)
- **dws_会员生命周期** (DATA_SET_ETL)
  - ID: x808f7e31adc4423e9471801
