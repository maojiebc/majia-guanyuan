你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 6
- **节点类型分布:**
  - CALCULATOR: 1
  - INPUT_DATASET: 2
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - ff7b4cae808ca4ecab894f53 (dwd_门店成本明细)
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
- **数据输出目标:**
  - dws_成本结构汇总 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779345758790
- Name: dwd_门店成本明细
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345758792 (关联门店类型)
- Position: (100,100)
- InputDsId: ff7b4cae808ca4ecab894f53
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779345758794
- Name: 算占比+离散度
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779345758793 (按店型+月份+科目 分位数聚合)

- **Used By (Outputs):**
  - id_1779345758795 (dws_成本结构汇总)
- Position: (900,200)
- FormulaNames:
  - 科目营收占比
  - 离散度
  - P90vsP50差异
- 等价SQL:
```sql
SELECT
  *,
  case when `营收总额` > 0 then `成本总额` / `营收总额` else 0 end AS `科目营收占比`,
  `最高占比` - `最低占比` AS `离散度`,
  `P90占比` - `中位数占比` AS `P90vsP50差异`
FROM input1
```


### 节点3
- Id: id_1779345758791
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345758792 (关联门店类型)
- Position: (100,400)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779345758793
- Name: 按店型+月份+科目 分位数聚合
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345758792 (关联门店类型)

- **Used By (Outputs):**
  - id_1779345758794 (算占比+离散度)
- Position: (600,200)
- SqlScript:
```sql
SELECT
  `门店类型`,
  `月份`,
  `成本科目ID`,
  `成本科目名称`,
  `成本大类`,
  COUNT(*) AS `门店数`,
  SUM(`成本金额`) AS `成本总额`,
  SUM(`营收基数`) AS `营收总额`,
  AVG(`成本占比`) AS `平均占比`,
  PERCENTILE_APPROX(`成本占比`, 0.5) AS `中位数占比`,
  PERCENTILE_APPROX(`成本占比`, 0.9) AS `P90占比`,
  MIN(`成本占比`) AS `最低占比`,
  MAX(`成本占比`) AS `最高占比`
FROM input1
WHERE `营收基数` > 0
GROUP BY `门店类型`, `月份`, `成本科目ID`, `成本科目名称`, `成本大类`
```
- 等价SQL:
```sql
SELECT
  `门店类型`,
  `月份`,
  `成本科目ID`,
  `成本科目名称`,
  `成本大类`,
  COUNT(*) AS `门店数`,
  SUM(`成本金额`) AS `成本总额`,
  SUM(`营收基数`) AS `营收总额`,
  AVG(`成本占比`) AS `平均占比`,
  PERCENTILE_APPROX(`成本占比`, 0.5) AS `中位数占比`,
  PERCENTILE_APPROX(`成本占比`, 0.9) AS `P90占比`,
  MIN(`成本占比`) AS `最低占比`,
  MAX(`成本占比`) AS `最高占比`
FROM input1
WHERE `营收基数` > 0
GROUP BY `门店类型`, `月份`, `成本科目ID`, `成本科目名称`, `成本大类`
```


### 节点5
- Id: id_1779345758792
- Name: 关联门店类型
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779345758790 (dwd_门店成本明细)
  - id_1779345758791 (dim_门店主档)

- **Used By (Outputs):**
  - id_1779345758793 (按店型+月份+科目 分位数聚合)
- Position: (300,200)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`门店ID` = input2.`门店ID`
```


### 节点6
- Id: id_1779345758795
- Name: dws_成本结构汇总
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779345758794 (算占比+离散度)
- Position: (1100,200)
- OutputDsName: dws_成本结构汇总
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: c77fc2f1d0a4d4459bd02859
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_门店成本明细** (DATA_SET_FILE)
  - ID: ff7b4cae808ca4ecab894f53
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7

### 下游资源 (1)
- **dws_成本结构汇总** (DATA_SET_ETL)
  - ID: c77fc2f1d0a4d4459bd02859
