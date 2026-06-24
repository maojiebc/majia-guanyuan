你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 6
- **节点类型分布:**
  - INPUT_DATASET: 4
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
  - u494a5b2caaf446b5b1ed8bf (dwd_会员经营任务)
  - h551155a12fc04d88a57d319 (dim_会员主档)
  - m6fdb5eaefa5742ef9e0ac58 (dim_员工导购)
- **数据输出目标:**
  - ads_会员经营任务池 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818732
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818734 (SQL处理)
- Position: (200,400)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818735
- Name: ads_会员经营任务池
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818734 (SQL处理)
- Position: (800,100)
- OutputDsName: ads_会员经营任务池
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: nda316bda403346669b3fa1d
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点3
- Id: id_1779326818730
- Name: dwd_会员经营任务
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818734 (SQL处理)
- Position: (200,100)
- InputDsId: u494a5b2caaf446b5b1ed8bf
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779326818734
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818730 (dwd_会员经营任务)
  - id_1779326818731 (dim_员工导购)
  - id_1779326818732 (dim_门店主档)
  - id_1779326818733 (dim_会员主档)

- **Used By (Outputs):**
  - id_1779326818735 (ads_会员经营任务池)
- Position: (500,100)
- SqlScript:
```sql
SELECT
  t.`任务ID`, t.`任务优先级`, t.`任务类型`, t.`任务来源`,
  t.`会员ID`, m.`会员等级`, m.`城市` AS `会员城市`,
  t.`归属门店ID`, s.`门店名称`, s.`城市` AS `门店城市`, s.`店型`, s.`门店类型`,
  t.`员工导购ID`, e.`姓名` AS `员工姓名`, e.`岗位`, e.`角色标签`,
  t.`人群标签`, t.`推荐动作`, t.`推荐权益`, t.`推荐原因`,
  t.`预计价值`, t.`任务生成时间`, t.`任务截止时间`, t.`任务失效时间`,
  t.`触达状态`, t.`触达时间`, t.`触达方式`,
  t.`触达后下单`, t.`触达后下单金额`, t.`任务结果`,
  CASE
    WHEN t.`任务结果` LIKE '已完成%' THEN '已完结'
    WHEN t.`任务失效时间` < CURRENT_TIMESTAMP() THEN '已过期'
    ELSE '进行中'
  END AS `执行状态`,
  CASE
    WHEN t.`触达后下单` = 1 THEN '有转化'
    WHEN t.`触达状态` = '已触达' THEN '已触达未转化'
    ELSE '未触达'
  END AS `转化阶段`
FROM input1 t
LEFT JOIN input2 e ON t.`员工导购ID` = e.`员工ID`
LEFT JOIN input3 s ON t.`归属门店ID` = s.`门店ID`
LEFT JOIN input4 m ON t.`会员ID` = m.`会员ID`
```
- 等价SQL:
```sql
SELECT
  t.`任务ID`, t.`任务优先级`, t.`任务类型`, t.`任务来源`,
  t.`会员ID`, m.`会员等级`, m.`城市` AS `会员城市`,
  t.`归属门店ID`, s.`门店名称`, s.`城市` AS `门店城市`, s.`店型`, s.`门店类型`,
  t.`员工导购ID`, e.`姓名` AS `员工姓名`, e.`岗位`, e.`角色标签`,
  t.`人群标签`, t.`推荐动作`, t.`推荐权益`, t.`推荐原因`,
  t.`预计价值`, t.`任务生成时间`, t.`任务截止时间`, t.`任务失效时间`,
  t.`触达状态`, t.`触达时间`, t.`触达方式`,
  t.`触达后下单`, t.`触达后下单金额`, t.`任务结果`,
  CASE
    WHEN t.`任务结果` LIKE '已完成%' THEN '已完结'
    WHEN t.`任务失效时间` < CURRENT_TIMESTAMP() THEN '已过期'
    ELSE '进行中'
  END AS `执行状态`,
  CASE
    WHEN t.`触达后下单` = 1 THEN '有转化'
    WHEN t.`触达状态` = '已触达' THEN '已触达未转化'
    ELSE '未触达'
  END AS `转化阶段`
FROM input1 t
LEFT JOIN input2 e ON t.`员工导购ID` = e.`员工ID`
LEFT JOIN input3 s ON t.`归属门店ID` = s.`门店ID`
LEFT JOIN input4 m ON t.`会员ID` = m.`会员ID`
```


### 节点5
- Id: id_1779326818733
- Name: dim_会员主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818734 (SQL处理)
- Position: (200,550)
- InputDsId: h551155a12fc04d88a57d319
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点6
- Id: id_1779326818731
- Name: dim_员工导购
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818734 (SQL处理)
- Position: (200,250)
- InputDsId: m6fdb5eaefa5742ef9e0ac58
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


---

## 血缘关系

### 上游资源 (4)
- **dwd_会员经营任务** (DATA_SET_FILE)
  - ID: u494a5b2caaf446b5b1ed8bf
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7
- **dim_员工导购** (DATA_SET_FILE)
  - ID: m6fdb5eaefa5742ef9e0ac58
- **dim_会员主档** (DATA_SET_FILE)
  - ID: h551155a12fc04d88a57d319

### 下游资源 (1)
- **ads_会员经营任务池** (DATA_SET_ETL)
  - ID: nda316bda403346669b3fa1d
