你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 8
- **节点类型分布:**
  - CALCULATOR: 1
  - FILTER_ROWS: 1
  - INPUT_DATASET: 3
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - xc82fb232ecdc474f84cd43d (dwd_会员触达)
  - u494a5b2caaf446b5b1ed8bf (dwd_会员经营任务)
  - m6fdb5eaefa5742ef9e0ac58 (dim_员工导购)
- **数据输出目标:**
  - dws_员工导购效能 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779337308218
- Name: dwd_会员触达
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337308222 (触达+任务双聚合)
- Position: (227,232)
- InputDsId: xc82fb232ecdc474f84cd43d
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779337308219
- Name: dwd_会员经营任务
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337308222 (触达+任务双聚合)
- Position: (227,400)
- InputDsId: u494a5b2caaf446b5b1ed8bf
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779337308220
- Name: dim_员工导购
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337308221 (筛选在职员工)
- Position: (227,64)
- InputDsId: m6fdb5eaefa5742ef9e0ac58
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779337308221
- Name: 筛选在职员工
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779337308220 (dim_员工导购)

- **Used By (Outputs):**
  - id_1779337308223 (关联员工维度)
- Position: (431,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`状态` = '在职')
```


### 节点5
- Id: id_1779337308222
- Name: 触达+任务双聚合
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779337308218 (dwd_会员触达)
  - id_1779337308219 (dwd_会员经营任务)

- **Used By (Outputs):**
  - id_1779337308223 (关联员工维度)
- Position: (431,232)
- SqlScript:
```sql
SELECT
  COALESCE(t.`员工ID`, k.`员工导购ID`) AS `员工ID`,
  COALESCE(t.`周起始`, k.`周起始`) AS `周起始`,
  COALESCE(t.`触达数`, 0) AS `触达数`,
  COALESCE(t.`触达会员数`, 0) AS `触达会员数`,
  COALESCE(t.`查看数`, 0) AS `查看数`,
  COALESCE(k.`任务数`, 0) AS `任务数`,
  COALESCE(k.`已触达任务`, 0) AS `已触达任务`,
  COALESCE(k.`转化任务数`, 0) AS `转化任务数`,
  COALESCE(k.`转化金额`, 0) AS `转化金额`
FROM (
  SELECT `员工ID`,
    date_sub(`触达日期`, dayofweek(`触达日期`) - 1) AS `周起始`,
    COUNT(DISTINCT `触达ID`) AS `触达数`,
    COUNT(DISTINCT `会员ID`) AS `触达会员数`,
    SUM(`是否查看`) AS `查看数`
  FROM input1
  GROUP BY `员工ID`, date_sub(`触达日期`, dayofweek(`触达日期`) - 1)
) t
FULL OUTER JOIN (
  SELECT `员工导购ID`,
    date_sub(DATE(`任务生成时间`), dayofweek(DATE(`任务生成时间`)) - 1) AS `周起始`,
    COUNT(DISTINCT `任务ID`) AS `任务数`,
    SUM(CASE WHEN `触达状态` = '已触达' THEN 1 ELSE 0 END) AS `已触达任务`,
    SUM(`触达后下单`) AS `转化任务数`,
    SUM(`触达后下单金额`) AS `转化金额`
  FROM input2
  GROUP BY `员工导购ID`, date_sub(DATE(`任务生成时间`), dayofweek(DATE(`任务生成时间`)) - 1)
) k
ON t.`员工ID` = k.`员工导购ID` AND t.`周起始` = k.`周起始`
```
- 等价SQL:
```sql
SELECT
  COALESCE(t.`员工ID`, k.`员工导购ID`) AS `员工ID`,
  COALESCE(t.`周起始`, k.`周起始`) AS `周起始`,
  COALESCE(t.`触达数`, 0) AS `触达数`,
  COALESCE(t.`触达会员数`, 0) AS `触达会员数`,
  COALESCE(t.`查看数`, 0) AS `查看数`,
  COALESCE(k.`任务数`, 0) AS `任务数`,
  COALESCE(k.`已触达任务`, 0) AS `已触达任务`,
  COALESCE(k.`转化任务数`, 0) AS `转化任务数`,
  COALESCE(k.`转化金额`, 0) AS `转化金额`
FROM (
  SELECT `员工ID`,
    date_sub(`触达日期`, dayofweek(`触达日期`) - 1) AS `周起始`,
    COUNT(DISTINCT `触达ID`) AS `触达数`,
    COUNT(DISTINCT `会员ID`) AS `触达会员数`,
    SUM(`是否查看`) AS `查看数`
  FROM input1
  GROUP BY `员工ID`, date_sub(`触达日期`, dayofweek(`触达日期`) - 1)
) t
FULL OUTER JOIN (
  SELECT `员工导购ID`,
    date_sub(DATE(`任务生成时间`), dayofweek(DATE(`任务生成时间`)) - 1) AS `周起始`,
    COUNT(DISTINCT `任务ID`) AS `任务数`,
    SUM(CASE WHEN `触达状态` = '已触达' THEN 1 ELSE 0 END) AS `已触达任务`,
    SUM(`触达后下单`) AS `转化任务数`,
    SUM(`触达后下单金额`) AS `转化金额`
  FROM input2
  GROUP BY `员工导购ID`, date_sub(DATE(`任务生成时间`), dayofweek(DATE(`任务生成时间`)) - 1)
) k
ON t.`员工ID` = k.`员工导购ID` AND t.`周起始` = k.`周起始`
```


### 节点6
- Id: id_1779337308223
- Name: 关联员工维度
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779337308221 (筛选在职员工)
  - id_1779337308222 (触达+任务双聚合)

- **Used By (Outputs):**
  - id_1779337308224 (计算完成率+转化率)
- Position: (635,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`员工ID` = input2.`员工ID`
```


### 节点7
- Id: id_1779337308224
- Name: 计算完成率+转化率
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337308223 (关联员工维度)

- **Used By (Outputs):**
  - id_1779337308225 (dws_员工导购效能)
- Position: (839,64)
- FormulaNames:
  - 任务完成率
  - 触达后转化率
- 等价SQL:
```sql
SELECT
  *,
  case when `任务数` > 0 then `已触达任务` * 1.0 / `任务数` else 0 end AS `任务完成率`,
  case when `已触达任务` > 0 then `转化任务数` * 1.0 / `已触达任务` else 0 end AS `触达后转化率`
FROM input1
```


### 节点8
- Id: id_1779337308225
- Name: dws_员工导购效能
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779337308224 (计算完成率+转化率)
- Position: (1043,64)
- OutputDsName: dws_员工导购效能
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: v3db361c104114ea8b5997ae
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (3)
- **dim_员工导购** (DATA_SET_FILE)
  - ID: m6fdb5eaefa5742ef9e0ac58
- **dwd_会员触达** (DATA_SET_FILE)
  - ID: xc82fb232ecdc474f84cd43d
- **dwd_会员经营任务** (DATA_SET_FILE)
  - ID: u494a5b2caaf446b5b1ed8bf

### 下游资源 (1)
- **dws_员工导购效能** (DATA_SET_ETL)
  - ID: v3db361c104114ea8b5997ae
