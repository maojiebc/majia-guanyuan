你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 17
- **节点类型分布:**
  - CALCULATOR: 4
  - FILTER_ROWS: 1
  - GROUP_BY: 3
  - INPUT_DATASET: 4
  - JOIN_DATA: 3
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - fc906172fbf4b443d92acc24 (dwd_券事件)
  - xc82fb232ecdc474f84cd43d (dwd_会员触达)
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - le21397bebf6c4ffaa81d9cc (dim_活动主档)
- **数据输出目标:**
  - ads_活动权益复盘 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779337272719
- Name: dwd_券事件
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337272723 (标记券核销)
- Position: (100,100)
- InputDsId: fc906172fbf4b443d92acc24
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779337272720
- Name: dwd_会员触达
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337272725 (筛选含活动触达)
  - id_1779337272730 (触达+订单7天窗口)
- Position: (100,300)
- InputDsId: xc82fb232ecdc474f84cd43d
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779337272721
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337272730 (触达+订单7天窗口)
- Position: (100,500)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779337272722
- Name: dim_活动主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779337272731 (关联券事件)
- Position: (100,750)
- InputDsId: le21397bebf6c4ffaa81d9cc
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点5
- Id: id_1779337272732
- Name: 关联触达聚合
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779337272731 (关联券事件)
  - id_1779337272729 (触达 第二层粒度滚回)

- **Used By (Outputs):**
  - id_1779337272733 (关联转化聚合)
- Position: (1100,400)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`活动ID` = input2.`活动ID`
```


### 节点6
- Id: id_1779337272733
- Name: 关联转化聚合
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779337272732 (关联触达聚合)
  - id_1779337272730 (触达+订单7天窗口)

- **Used By (Outputs):**
  - id_1779337272734 (计算率+ROI)
- Position: (1300,500)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`活动ID` = input2.`活动ID`
```


### 节点7
- Id: id_1779337272734
- Name: 计算率+ROI
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337272733 (关联转化聚合)

- **Used By (Outputs):**
  - id_1779337272735 (ads_活动权益复盘)
- Position: (1500,500)
- FormulaNames:
  - 券核销率
  - 总体转化率
  - 券ROI
- 等价SQL:
```sql
SELECT
  *,
  case when `券发放数` > 0 then `券核销数` * 1.0 / `券发放数` else 0 end AS `券核销率`,
  case when `触达人数` > 0 then `转化人数` * 1.0 / `触达人数` else 0 end AS `总体转化率`,
  case when `总折扣`   > 0 then `拉动销售` / `总折扣` else 0 end AS `券ROI`
FROM input1
```


### 节点8
- Id: id_1779337272735
- Name: ads_活动权益复盘
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779337272734 (计算率+ROI)
- Position: (1700,500)
- OutputDsName: ads_活动权益复盘
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: q2154240ed0334aec8883ae8
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点9
- Id: id_1779337272723
- Name: 标记券核销
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337272719 (dwd_券事件)

- **Used By (Outputs):**
  - id_1779337272724 (券事件聚合)
- Position: (300,100)
- FormulaNames:
  - 券计数
  - 是否核销
  - 核销折扣
- 等价SQL:
```sql
SELECT
  *,
  1 AS `券计数`,
  case when `核销日期` is not null then 1 else 0 end AS `是否核销`,
  case when `核销日期` is not null then `折扣金额` else 0 end AS `核销折扣`
FROM input1
```


### 节点10
- Id: id_1779337272724
- Name: 券事件聚合
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779337272723 (标记券核销)

- **Used By (Outputs):**
  - id_1779337272731 (关联券事件)
- Position: (500,100)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点11
- Id: id_1779337272725
- Name: 筛选含活动触达
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779337272720 (dwd_会员触达)

- **Used By (Outputs):**
  - id_1779337272726 (标记查看)
- Position: (300,300)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`活动ID` IS NOT NULL)
  AND (`活动ID` IS NOT NULL)
```


### 节点12
- Id: id_1779337272726
- Name: 标记查看
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337272725 (筛选含活动触达)

- **Used By (Outputs):**
  - id_1779337272727 (触达 第一层(活动ID×会员ID))
- Position: (500,300)
- FormulaNames:
  - 查看标志
- 等价SQL:
```sql
SELECT
  *,
  case when `是否查看` = 1 then 1 else 0 end AS `查看标志`
FROM input1
```


### 节点13
- Id: id_1779337272727
- Name: 触达 第一层(活动ID×会员ID)
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779337272726 (标记查看)

- **Used By (Outputs):**
  - id_1779337272728 (标记会员去重)
- Position: (700,300)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点14
- Id: id_1779337272728
- Name: 标记会员去重
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779337272727 (触达 第一层(活动ID×会员ID))

- **Used By (Outputs):**
  - id_1779337272729 (触达 第二层粒度滚回)
- Position: (880,300)
- FormulaNames:
  - 会员计数
- 等价SQL:
```sql
SELECT
  *,
  1 AS `会员计数`
FROM input1
```


### 节点15
- Id: id_1779337272729
- Name: 触达 第二层粒度滚回
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779337272728 (标记会员去重)

- **Used By (Outputs):**
  - id_1779337272732 (关联触达聚合)
- Position: (1060,300)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点16
- Id: id_1779337272730
- Name: 触达+订单7天窗口
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779337272720 (dwd_会员触达)
  - id_1779337272721 (dwd_订单)

- **Used By (Outputs):**
  - id_1779337272733 (关联转化聚合)
- Position: (500,500)
- SqlScript:
```sql
SELECT
  t.`活动ID`,
  COUNT(DISTINCT t.`会员ID`) AS `转化人数`,
  SUM(o.`实付金额`) AS `拉动销售`
FROM input1 t
JOIN input2 o ON t.`会员ID` = o.`会员ID`
  AND DATEDIFF(o.`业务日期`, t.`触达日期`) BETWEEN 0 AND 7
  AND o.`订单状态` = '已完成'
WHERE t.`活动ID` IS NOT NULL AND t.`活动ID` <> ''
GROUP BY t.`活动ID`
```
- 等价SQL:
```sql
SELECT
  t.`活动ID`,
  COUNT(DISTINCT t.`会员ID`) AS `转化人数`,
  SUM(o.`实付金额`) AS `拉动销售`
FROM input1 t
JOIN input2 o ON t.`会员ID` = o.`会员ID`
  AND DATEDIFF(o.`业务日期`, t.`触达日期`) BETWEEN 0 AND 7
  AND o.`订单状态` = '已完成'
WHERE t.`活动ID` IS NOT NULL AND t.`活动ID` <> ''
GROUP BY t.`活动ID`
```


### 节点17
- Id: id_1779337272731
- Name: 关联券事件
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779337272722 (dim_活动主档)
  - id_1779337272724 (券事件聚合)

- **Used By (Outputs):**
  - id_1779337272732 (关联触达聚合)
- Position: (900,300)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`活动ID` = input2.`来源活动ID`
```


---

## 血缘关系

### 上游资源 (4)
- **dwd_券事件** (DATA_SET_FILE)
  - ID: fc906172fbf4b443d92acc24
- **dwd_会员触达** (DATA_SET_FILE)
  - ID: xc82fb232ecdc474f84cd43d
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_活动主档** (DATA_SET_FILE)
  - ID: le21397bebf6c4ffaa81d9cc

### 下游资源 (1)
- **ads_活动权益复盘** (DATA_SET_ETL)
  - ID: q2154240ed0334aec8883ae8
