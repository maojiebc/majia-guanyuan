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
  - af8234caa4e90486793eaab8 (dwd_评价)
  - l1b7c38276d9d483b9e1f712 (dwd_投诉)
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
- **数据输出目标:**
  - dws_体验口碑汇总 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818726
- Name: dwd_评价
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818729 (SQL处理)
- Position: (200,100)
- InputDsId: af8234caa4e90486793eaab8
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818727
- Name: dwd_投诉
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818729 (SQL处理)
- Position: (200,250)
- InputDsId: l1b7c38276d9d483b9e1f712
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818728
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818729 (SQL处理)
- Position: (200,400)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779326818729
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818726 (dwd_评价)
  - id_1779326818727 (dwd_投诉)
  - id_1779326818728 (dim_门店主档)

- **Used By (Outputs):**
  - id_1779326818730 (dws_体验口碑汇总)
- Position: (500,100)
- SqlScript:
```sql
WITH review_agg AS (
  SELECT
    `门店ID`, `评价日期` AS `业务日期`,
    COUNT(DISTINCT `评价ID`) AS `评价数`,
    AVG(`评分`) AS `平均评分`,
    SUM(CASE WHEN `评分` <= 2 THEN 1 ELSE 0 END) AS `负评数`,
    SUM(CASE WHEN `评分` = 5 THEN 1 ELSE 0 END) AS `好评数`,
    SUM(CASE WHEN `评分` <= 2 AND `回复状态` = '未回复' THEN 1 ELSE 0 END) AS `未回复负评数`
  FROM input1
  GROUP BY `门店ID`, `评价日期`
),
complain_agg AS (
  SELECT
    `门店ID`, DATE(`投诉时间`) AS `业务日期`,
    COUNT(DISTINCT `投诉ID`) AS `投诉数`,
    SUM(CASE WHEN `状态` = '待处理' THEN 1 ELSE 0 END) AS `待处理投诉`,
    AVG(`处理时长_小时`) AS `平均处理时长`
  FROM input2
  GROUP BY `门店ID`, DATE(`投诉时间`)
)
SELECT
  s.`门店ID`, s.`门店名称`, s.`省份`, s.`城市`, s.`城市层级`, s.`店型`, s.`门店类型`,
  COALESCE(r.`业务日期`, c.`业务日期`) AS `业务日期`,
  COALESCE(r.`评价数`, 0) AS `评价数`,
  COALESCE(r.`平均评分`, 0) AS `平均评分`,
  COALESCE(r.`负评数`, 0) AS `负评数`,
  COALESCE(r.`好评数`, 0) AS `好评数`,
  COALESCE(r.`未回复负评数`, 0) AS `未回复负评数`,
  CASE WHEN COALESCE(r.`评价数`,0) > 0 THEN r.`负评数` * 1.0 / r.`评价数` ELSE 0 END AS `负评率`,
  COALESCE(c.`投诉数`, 0) AS `投诉数`,
  COALESCE(c.`待处理投诉`, 0) AS `待处理投诉`,
  COALESCE(c.`平均处理时长`, 0) AS `平均处理时长`,
  CASE
    WHEN COALESCE(r.`平均评分`, 5) < 4.0 THEN '高风险'
    WHEN COALESCE(r.`平均评分`, 5) < 4.5 THEN '中风险'
    ELSE '正常'
  END AS `体验风险等级`
FROM input3 s
LEFT JOIN review_agg r ON s.`门店ID` = r.`门店ID`
LEFT JOIN complain_agg c ON s.`门店ID` = c.`门店ID` AND r.`业务日期` = c.`业务日期`
```
- 等价SQL:
```sql
WITH review_agg AS (
  SELECT
    `门店ID`, `评价日期` AS `业务日期`,
    COUNT(DISTINCT `评价ID`) AS `评价数`,
    AVG(`评分`) AS `平均评分`,
    SUM(CASE WHEN `评分` <= 2 THEN 1 ELSE 0 END) AS `负评数`,
    SUM(CASE WHEN `评分` = 5 THEN 1 ELSE 0 END) AS `好评数`,
    SUM(CASE WHEN `评分` <= 2 AND `回复状态` = '未回复' THEN 1 ELSE 0 END) AS `未回复负评数`
  FROM input1
  GROUP BY `门店ID`, `评价日期`
),
complain_agg AS (
  SELECT
    `门店ID`, DATE(`投诉时间`) AS `业务日期`,
    COUNT(DISTINCT `投诉ID`) AS `投诉数`,
    SUM(CASE WHEN `状态` = '待处理' THEN 1 ELSE 0 END) AS `待处理投诉`,
    AVG(`处理时长_小时`) AS `平均处理时长`
  FROM input2
  GROUP BY `门店ID`, DATE(`投诉时间`)
)
SELECT
  s.`门店ID`, s.`门店名称`, s.`省份`, s.`城市`, s.`城市层级`, s.`店型`, s.`门店类型`,
  COALESCE(r.`业务日期`, c.`业务日期`) AS `业务日期`,
  COALESCE(r.`评价数`, 0) AS `评价数`,
  COALESCE(r.`平均评分`, 0) AS `平均评分`,
  COALESCE(r.`负评数`, 0) AS `负评数`,
  COALESCE(r.`好评数`, 0) AS `好评数`,
  COALESCE(r.`未回复负评数`, 0) AS `未回复负评数`,
  CASE WHEN COALESCE(r.`评价数`,0) > 0 THEN r.`负评数` * 1.0 / r.`评价数` ELSE 0 END AS `负评率`,
  COALESCE(c.`投诉数`, 0) AS `投诉数`,
  COALESCE(c.`待处理投诉`, 0) AS `待处理投诉`,
  COALESCE(c.`平均处理时长`, 0) AS `平均处理时长`,
  CASE
    WHEN COALESCE(r.`平均评分`, 5) < 4.0 THEN '高风险'
    WHEN COALESCE(r.`平均评分`, 5) < 4.5 THEN '中风险'
    ELSE '正常'
  END AS `体验风险等级`
FROM input3 s
LEFT JOIN review_agg r ON s.`门店ID` = r.`门店ID`
LEFT JOIN complain_agg c ON s.`门店ID` = c.`门店ID` AND r.`业务日期` = c.`业务日期`
```


### 节点5
- Id: id_1779326818730
- Name: dws_体验口碑汇总
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818729 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_体验口碑汇总
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: g52a667122e214eefb542bf6
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (3)
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7
- **dwd_评价** (DATA_SET_FILE)
  - ID: af8234caa4e90486793eaab8
- **dwd_投诉** (DATA_SET_FILE)
  - ID: l1b7c38276d9d483b9e1f712

### 下游资源 (1)
- **dws_体验口碑汇总** (DATA_SET_ETL)
  - ID: g52a667122e214eefb542bf6
