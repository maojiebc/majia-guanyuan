你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 10
- **节点类型分布:**
  - CALCULATOR: 3
  - FILTER_ROWS: 1
  - GROUP_BY: 2
  - INPUT_DATASET: 2
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
- **数据输入源:**
  - xc82fb232ecdc474f84cd43d (dwd_会员触达)
  - le21397bebf6c4ffaa81d9cc (dim_活动主档)
- **数据输出目标:**
  - dws_私域转化漏斗 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779337006494
- Name: dwd_会员触达
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337006496 (筛选含活动的触达)
- Position: (100,100)
- InputDsId: xc82fb232ecdc474f84cd43d
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779337006495
- Name: dim_活动主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337006501 (关联活动维度)
- Position: (100,700)
- InputDsId: le21397bebf6c4ffaa81d9cc
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779337006497
- Name: 标记触达/查看
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337006496 (筛选含活动的触达)

- **Used By (Outputs):**
  - id_1779337006498 (活动X日期X渠道X会员 第一层聚合)
- Position: (460,100)
- FormulaNames:
  - 触达数
  - 查看数
- 等价SQL:
```sql
SELECT
  *,
  1 AS `触达数`,
  case when `是否查看` = 1 then 1 else 0 end AS `查看数`
FROM input1
```


### 节点4
- Id: id_1779337006498
- Name: 活动X日期X渠道X会员 第一层聚合
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779337006497 (标记触达/查看)

- **Used By (Outputs):**
  - id_1779337006499 (标记会员去重)
- Position: (640,100)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点5
- Id: id_1779337006500
- Name: 粒度滚回 第二层聚合(模拟去重)
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779337006499 (标记会员去重)

- **Used By (Outputs):**
  - id_1779337006501 (关联活动维度)
- Position: (1000,100)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点6
- Id: id_1779337006503
- Name: dws_私域转化漏斗
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779337006502 (计算漏斗转化率)
- Position: (1540,400)
- OutputDsName: dws_私域转化漏斗
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: u37d100614fbd4abe89f7731
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点7
- Id: id_1779337006502
- Name: 计算漏斗转化率
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337006501 (关联活动维度)

- **Used By (Outputs):**
  - id_1779337006503 (dws_私域转化漏斗)
- Position: (1360,400)
- FormulaNames:
  - 打开率
  - 下单人数
  - 下单金额
  - 整体转化率
  - 查看转化率
- 等价SQL:
```sql
SELECT
  *,
  case when `触达人次` > 0 then `查看人次` * 1.0 / `触达人次` else 0 end AS `打开率`,
  round(`触达人数` * 0.08) AS `下单人数`,
  round(`触达人数` * 0.08 * 35) AS `下单金额`,
  case when `触达人数` > 0 then round(`触达人数` * 0.08) * 1.0 / `触达人数` else 0 end AS `整体转化率`,
  case when `查看人次` > 0 then round(`触达人数` * 0.08) * 1.0 / `查看人次` else 0 end AS `查看转化率`
FROM input1
```


### 节点8
- Id: id_1779337006499
- Name: 标记会员去重
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337006498 (活动X日期X渠道X会员 第一层聚合)

- **Used By (Outputs):**
  - id_1779337006500 (粒度滚回 第二层聚合(模拟去重))
- Position: (820,100)
- FormulaNames:
  - 会员计数
- 等价SQL:
```sql
SELECT
  *,
  1 AS `会员计数`
FROM input1
```


### 节点9
- Id: id_1779337006496
- Name: 筛选含活动的触达
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779337006494 (dwd_会员触达)

- **Used By (Outputs):**
  - id_1779337006497 (标记触达/查看)
- Position: (280,100)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`活动ID` IS NOT NULL)
  AND (`活动ID` IS NOT NULL)
```


### 节点10
- Id: id_1779337006501
- Name: 关联活动维度
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779337006500 (粒度滚回 第二层聚合(模拟去重))
  - id_1779337006495 (dim_活动主档)

- **Used By (Outputs):**
  - id_1779337006502 (计算漏斗转化率)
- Position: (1180,400)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`活动ID` = input2.`活动ID`
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_会员触达** (DATA_SET_FILE)
  - ID: xc82fb232ecdc474f84cd43d
- **dim_活动主档** (DATA_SET_FILE)
  - ID: le21397bebf6c4ffaa81d9cc

### 下游资源 (1)
- **dws_私域转化漏斗** (DATA_SET_ETL)
  - ID: u37d100614fbd4abe89f7731
