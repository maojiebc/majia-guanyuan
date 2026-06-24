你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 7
- **节点类型分布:**
  - CALCULATOR: 1
  - INPUT_DATASET: 3
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - l6ee75fc812be413583215e4 (dws_单店利润月汇总)
  - w55d0570b98a143579807416 (dwd_加盟合同明细)
  - e620121168c3447c3abe4948 (dim_加盟商主档)
- **数据输出目标:**
  - dws_加盟商经营汇总 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779345839801
- Name: dws_单店利润月汇总
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345839804 (加盟商月度聚合 (JOIN 合同+利润))
- Position: (100,100)
- InputDsId: l6ee75fc812be413583215e4
- DisplayType: DATAFLOW
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779345839805
- Name: 关联加盟商维度
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779345839804 (加盟商月度聚合 (JOIN 合同+利润))
  - id_1779345839803 (dim_加盟商主档)

- **Used By (Outputs):**
  - id_1779345839806 (加盟商健康+风险打标)
- Position: (700,400)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`加盟商ID` = input2.`加盟商ID`
```


### 节点3
- Id: id_1779345839802
- Name: dwd_加盟合同明细
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345839804 (加盟商月度聚合 (JOIN 合同+利润))
- Position: (100,400)
- InputDsId: w55d0570b98a143579807416
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779345839806
- Name: 加盟商健康+风险打标
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779345839805 (关联加盟商维度)

- **Used By (Outputs):**
  - id_1779345839807 (dws_加盟商经营汇总)
- Position: (1000,400)
- FormulaNames:
  - 门均营收
  - 门均贡献利润
  - 亏损率
  - 经营健康等级
  - 续约风险
- 等价SQL:
```sql
SELECT
  *,
  case when `经营门店数` > 0 then `月总营收` / `经营门店数` else 0 end AS `门均营收`,
  case when `经营门店数` > 0 then `月总店面贡献利润` / `经营门店数` else 0 end AS `门均贡献利润`,
  case when `经营门店数` > 0 then `亏损门店数` * 1.0 / `经营门店数` else 0 end AS `亏损率`,
  case when `平均贡献利润率` >= 0.20 and `亏损门店数` = 0 then '标杆' when `平均贡献利润率` >= 0.12 then '健康' when `平均贡献利润率` >= 0.05 then '关注' when `平均贡献利润率` >= 0 then '预警' else '严重' end AS `经营健康等级`,
  case when `合作状态` = '纠纷处理' then '高' when `合作状态` = '续约预警' or `平均贡献利润率` < 0.05 then '高' when `合作状态` = '关注名单' or `平均贡献利润率` < 0.10 then '中' else '低' end AS `续约风险`
FROM input1
```


### 节点5
- Id: id_1779345839803
- Name: dim_加盟商主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345839805 (关联加盟商维度)
- Position: (100,700)
- InputDsId: e620121168c3447c3abe4948
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点6
- Id: id_1779345839804
- Name: 加盟商月度聚合 (JOIN 合同+利润)
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345839801 (dws_单店利润月汇总)
  - id_1779345839802 (dwd_加盟合同明细)

- **Used By (Outputs):**
  - id_1779345839805 (关联加盟商维度)
- Position: (400,250)
- SqlScript:
```sql
SELECT
  c.`加盟商ID`,
  p.`月份`,
  COUNT(DISTINCT p.`门店ID`) AS `经营门店数`,
  SUM(p.`月营收`)         AS `月总营收`,
  SUM(p.`堂食营收`)       AS `月总堂食营收`,
  SUM(p.`外卖营收`)       AS `月总外卖营收`,
  SUM(p.`订单数`)         AS `月总订单数`,
  SUM(p.`毛利`)           AS `月总毛利`,
  SUM(p.`店面贡献利润`)   AS `月总店面贡献利润`,
  SUM(p.`单店净利润`)     AS `月总单店净利润`,
  AVG(p.`店面贡献利润率`) AS `平均贡献利润率`,
  AVG(p.`堂食占比`)       AS `平均堂食占比`,
  SUM(CASE WHEN p.`店面贡献利润` < 0 THEN 1 ELSE 0 END) AS `亏损门店数`,
  SUM(CASE WHEN p.`店面贡献利润` > 0 THEN 1 ELSE 0 END) AS `盈利门店数`
FROM input1 p
JOIN input2 c ON p.`门店ID` = c.`门店ID`
GROUP BY c.`加盟商ID`, p.`月份`
```
- 等价SQL:
```sql
SELECT
  c.`加盟商ID`,
  p.`月份`,
  COUNT(DISTINCT p.`门店ID`) AS `经营门店数`,
  SUM(p.`月营收`)         AS `月总营收`,
  SUM(p.`堂食营收`)       AS `月总堂食营收`,
  SUM(p.`外卖营收`)       AS `月总外卖营收`,
  SUM(p.`订单数`)         AS `月总订单数`,
  SUM(p.`毛利`)           AS `月总毛利`,
  SUM(p.`店面贡献利润`)   AS `月总店面贡献利润`,
  SUM(p.`单店净利润`)     AS `月总单店净利润`,
  AVG(p.`店面贡献利润率`) AS `平均贡献利润率`,
  AVG(p.`堂食占比`)       AS `平均堂食占比`,
  SUM(CASE WHEN p.`店面贡献利润` < 0 THEN 1 ELSE 0 END) AS `亏损门店数`,
  SUM(CASE WHEN p.`店面贡献利润` > 0 THEN 1 ELSE 0 END) AS `盈利门店数`
FROM input1 p
JOIN input2 c ON p.`门店ID` = c.`门店ID`
GROUP BY c.`加盟商ID`, p.`月份`
```


### 节点7
- Id: id_1779345839807
- Name: dws_加盟商经营汇总
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779345839806 (加盟商健康+风险打标)
- Position: (1200,400)
- OutputDsName: dws_加盟商经营汇总
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: e2189adc50d654868b2724d3
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (3)
- **dim_加盟商主档** (DATA_SET_FILE)
  - ID: e620121168c3447c3abe4948
- **dwd_加盟合同明细** (DATA_SET_FILE)
  - ID: w55d0570b98a143579807416
- **dws_单店利润月汇总** (DATA_SET_ETL)
  - ID: l6ee75fc812be413583215e4

### 下游资源 (1)
- **dws_加盟商经营汇总** (DATA_SET_ETL)
  - ID: e2189adc50d654868b2724d3
