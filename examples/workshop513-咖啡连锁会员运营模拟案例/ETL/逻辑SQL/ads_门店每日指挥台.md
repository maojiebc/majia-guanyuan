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
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
  - af8234caa4e90486793eaab8 (dwd_评价)
  - j23ea7e60564e47458b71d82 (dwd_订单)
- **数据输出目标:**
  - ads_门店每日指挥台 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818730
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818732 (SQL处理)
- Position: (200,250)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818731
- Name: dwd_评价
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818732 (SQL处理)
- Position: (200,400)
- InputDsId: af8234caa4e90486793eaab8
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818733
- Name: ads_门店每日指挥台
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818732 (SQL处理)
- Position: (800,100)
- OutputDsName: ads_门店每日指挥台
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: nd177a0ac0eda44ac98c75bc
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点4
- Id: id_1779326818732
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818729 (dwd_订单)
  - id_1779326818730 (dim_门店主档)
  - id_1779326818731 (dwd_评价)

- **Used By (Outputs):**
  - id_1779326818733 (ads_门店每日指挥台)
- Position: (500,100)
- SqlScript:
```sql
WITH order_daily AS (
  SELECT
    `门店ID`, `业务日期`,
    COUNT(DISTINCT `订单ID`) AS `订单数`,
    SUM(`实付金额`) AS `销售额`,
    AVG(`实付金额`) AS `平均客单价`,
    COUNT(DISTINCT CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `订单ID` END) AS `会员订单数`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 1 THEN `订单ID` END) AS `到店订单数`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 0 THEN `订单ID` END) AS `外卖订单数`,
    SUM(`折扣金额`) AS `折扣总额`,
    SUM(`原价金额`) AS `原价总额`
  FROM input1
  WHERE `订单状态` = '已完成'
  GROUP BY `门店ID`, `业务日期`
),
review_daily AS (
  SELECT
    `门店ID`, `评价日期` AS `业务日期`,
    AVG(`评分`) AS `当日评分`,
    COUNT(*) AS `当日评价数`,
    SUM(CASE WHEN `评分` <= 2 AND `回复状态` = '未回复' THEN 1 ELSE 0 END) AS `未回复负评数`
  FROM input3
  GROUP BY `门店ID`, `评价日期`
),
joined AS (
  SELECT
    s.`门店ID`, s.`门店名称`, s.`省份`, s.`城市`, s.`城市层级`, s.`店型`, s.`门店类型`,
    s.`商圈`, s.`是否90天内新店`, s.`新店标签`,
    o.`业务日期`, o.`订单数`, o.`销售额`, o.`平均客单价`,
    o.`会员订单数`, o.`到店订单数`, o.`外卖订单数`,
    CASE WHEN o.`订单数` > 0 THEN o.`会员订单数` * 1.0 / o.`订单数` ELSE 0 END AS `会员订单占比`,
    CASE WHEN o.`订单数` > 0 THEN o.`到店订单数` * 1.0 / o.`订单数` ELSE 0 END AS `到店占比`,
    CASE WHEN o.`原价总额` > 0 THEN o.`折扣总额` / o.`原价总额` ELSE 0 END AS `折扣率`,
    COALESCE(r.`当日评分`, 5) AS `当日评分`,
    COALESCE(r.`当日评价数`, 0) AS `当日评价数`,
    COALESCE(r.`未回复负评数`, 0) AS `未回复负评数`,
    o.`折扣总额`, o.`原价总额`
  FROM order_daily o
  JOIN input2 s ON o.`门店ID` = s.`门店ID` AND s.`当前版本标记` = 1
  LEFT JOIN review_daily r ON o.`门店ID` = r.`门店ID` AND o.`业务日期` = r.`业务日期`
),
with_baseline AS (
  SELECT *,
    AVG(`平均客单价`) OVER (PARTITION BY `门店ID` ORDER BY `业务日期` ROWS BETWEEN 14 PRECEDING AND 1 PRECEDING) AS `客单价基线`
  FROM joined
)
SELECT
  `门店ID`, `门店名称`, `省份`, `城市`, `城市层级`, `店型`, `门店类型`,
  `商圈`, `是否90天内新店`, `新店标签`,
  `业务日期`, `订单数`, `销售额`, `平均客单价`,
  `会员订单数`, `到店订单数`, `外卖订单数`,
  `会员订单占比`, `到店占比`, `折扣率`,
  `当日评分`, `未回复负评数`,
  CASE
    WHEN `订单数` < 5 THEN '客流异常'
    WHEN `未回复负评数` >= 1 THEN '口碑异常'
    WHEN `当日评价数` >= 2 AND `当日评分` <= 3.0 THEN '评分滑坡'
    WHEN `原价总额` > 0 AND `折扣总额` / `原价总额` > 0.30 THEN '折扣过高'
    WHEN `订单数` >= 10 AND `会员订单数` * 1.0 / `订单数` < 0.10 THEN '会员占比异常'
    WHEN `订单数` >= 10 AND `客单价基线` IS NOT NULL AND `平均客单价` < 0.4 * `客单价基线` THEN '客单价异常'
    ELSE '正常'
  END AS `今日异常`
FROM with_baseline

```
- 等价SQL:
```sql
WITH order_daily AS (
  SELECT
    `门店ID`, `业务日期`,
    COUNT(DISTINCT `订单ID`) AS `订单数`,
    SUM(`实付金额`) AS `销售额`,
    AVG(`实付金额`) AS `平均客单价`,
    COUNT(DISTINCT CASE WHEN (`会员ID` IS NOT NULL AND `会员ID` <> '') THEN `订单ID` END) AS `会员订单数`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 1 THEN `订单ID` END) AS `到店订单数`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 0 THEN `订单ID` END) AS `外卖订单数`,
    SUM(`折扣金额`) AS `折扣总额`,
    SUM(`原价金额`) AS `原价总额`
  FROM input1
  WHERE `订单状态` = '已完成'
  GROUP BY `门店ID`, `业务日期`
),
review_daily AS (
  SELECT
    `门店ID`, `评价日期` AS `业务日期`,
    AVG(`评分`) AS `当日评分`,
    COUNT(*) AS `当日评价数`,
    SUM(CASE WHEN `评分` <= 2 AND `回复状态` = '未回复' THEN 1 ELSE 0 END) AS `未回复负评数`
  FROM input3
  GROUP BY `门店ID`, `评价日期`
),
joined AS (
  SELECT
    s.`门店ID`, s.`门店名称`, s.`省份`, s.`城市`, s.`城市层级`, s.`店型`, s.`门店类型`,
    s.`商圈`, s.`是否90天内新店`, s.`新店标签`,
    o.`业务日期`, o.`订单数`, o.`销售额`, o.`平均客单价`,
    o.`会员订单数`, o.`到店订单数`, o.`外卖订单数`,
    CASE WHEN o.`订单数` > 0 THEN o.`会员订单数` * 1.0 / o.`订单数` ELSE 0 END AS `会员订单占比`,
    CASE WHEN o.`订单数` > 0 THEN o.`到店订单数` * 1.0 / o.`订单数` ELSE 0 END AS `到店占比`,
    CASE WHEN o.`原价总额` > 0 THEN o.`折扣总额` / o.`原价总额` ELSE 0 END AS `折扣率`,
    COALESCE(r.`当日评分`, 5) AS `当日评分`,
    COALESCE(r.`当日评价数`, 0) AS `当日评价数`,
    COALESCE(r.`未回复负评数`, 0) AS `未回复负评数`,
    o.`折扣总额`, o.`原价总额`
  FROM order_daily o
  JOIN input2 s ON o.`门店ID` = s.`门店ID` AND s.`当前版本标记` = 1
  LEFT JOIN review_daily r ON o.`门店ID` = r.`门店ID` AND o.`业务日期` = r.`业务日期`
),
with_baseline AS (
  SELECT *,
    AVG(`平均客单价`) OVER (PARTITION BY `门店ID` ORDER BY `业务日期` ROWS BETWEEN 14 PRECEDING AND 1 PRECEDING) AS `客单价基线`
  FROM joined
)
SELECT
  `门店ID`, `门店名称`, `省份`, `城市`, `城市层级`, `店型`, `门店类型`,
  `商圈`, `是否90天内新店`, `新店标签`,
  `业务日期`, `订单数`, `销售额`, `平均客单价`,
  `会员订单数`, `到店订单数`, `外卖订单数`,
  `会员订单占比`, `到店占比`, `折扣率`,
  `当日评分`, `未回复负评数`,
  CASE
    WHEN `订单数` < 5 THEN '客流异常'
    WHEN `未回复负评数` >= 1 THEN '口碑异常'
    WHEN `当日评价数` >= 2 AND `当日评分` <= 3.0 THEN '评分滑坡'
    WHEN `原价总额` > 0 AND `折扣总额` / `原价总额` > 0.30 THEN '折扣过高'
    WHEN `订单数` >= 10 AND `会员订单数` * 1.0 / `订单数` < 0.10 THEN '会员占比异常'
    WHEN `订单数` >= 10 AND `客单价基线` IS NOT NULL AND `平均客单价` < 0.4 * `客单价基线` THEN '客单价异常'
    ELSE '正常'
  END AS `今日异常`
FROM with_baseline

```


### 节点5
- Id: id_1779326818729
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818732 (SQL处理)
- Position: (200,100)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


---

## 血缘关系

### 上游资源 (3)
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7
- **dwd_评价** (DATA_SET_FILE)
  - ID: af8234caa4e90486793eaab8

### 下游资源 (1)
- **ads_门店每日指挥台** (DATA_SET_ETL)
  - ID: nd177a0ac0eda44ac98c75bc
