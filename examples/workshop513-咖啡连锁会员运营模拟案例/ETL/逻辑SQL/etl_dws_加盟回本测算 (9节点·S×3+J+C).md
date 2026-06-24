你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 9
- **节点类型分布:**
  - CALCULATOR: 1
  - INPUT_DATASET: 3
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 3
- **数据输入源:**
  - dd5f37d14b97f4ee38c4b0dc (dwd_门店投资明细)
  - l6ee75fc812be413583215e4 (dws_单店利润月汇总)
  - w55d0570b98a143579807416 (dwd_加盟合同明细)
- **数据输出目标:**
  - dws_加盟回本测算 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779345941090
- Name: dwd_门店投资明细
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345941093 (门店总投资聚合)
- Position: (100,100)
- InputDsId: dd5f37d14b97f4ee38c4b0dc
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779345941091
- Name: dws_单店利润月汇总
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345941094 (门店累计利润+月均)
- Position: (100,400)
- InputDsId: l6ee75fc812be413583215e4
- DisplayType: DATAFLOW
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779345941095
- Name: JOIN算回本指标(SQL多键替代)
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345941093 (门店总投资聚合)
  - id_1779345941094 (门店累计利润+月均)

- **Used By (Outputs):**
  - id_1779345941096 (关联合同信息)
- Position: (700,250)
- SqlScript:
```sql
SELECT
  i.`门店ID`,
  i.`加盟商ID`,
  i.`总投资额`,
  i.`可回收投资`,
  i.`不可回收投资`,
  i.`投资起始日`,
  p.`经营月数`,
  p.`累计营收`,
  p.`累计店面贡献利润`,
  p.`月均店面贡献利润`,
  p.`平均贡献利润率`,
  CASE WHEN i.`总投资额` > 0 THEN p.`累计店面贡献利润` / i.`总投资额` ELSE 0 END AS `累计回本率`,
  CASE WHEN p.`月均店面贡献利润` > 0 THEN i.`总投资额` / p.`月均店面贡献利润` ELSE 999 END AS `预计完整回本月数`,
  CAST(MONTHS_BETWEEN(DATE '2026-05-20', i.`投资起始日`) AS INT) AS `已开业月数`,
  CASE WHEN p.`月均店面贡献利润` > 0 THEN DATE_ADD(DATE '2026-05-20', CAST(i.`总投资额` / p.`月均店面贡献利润` * 30 AS INT))
       ELSE NULL END AS `预计完整回本日期`
FROM input1 i
LEFT JOIN input2 p ON i.`门店ID` = p.`门店ID`
```
- 等价SQL:
```sql
SELECT
  i.`门店ID`,
  i.`加盟商ID`,
  i.`总投资额`,
  i.`可回收投资`,
  i.`不可回收投资`,
  i.`投资起始日`,
  p.`经营月数`,
  p.`累计营收`,
  p.`累计店面贡献利润`,
  p.`月均店面贡献利润`,
  p.`平均贡献利润率`,
  CASE WHEN i.`总投资额` > 0 THEN p.`累计店面贡献利润` / i.`总投资额` ELSE 0 END AS `累计回本率`,
  CASE WHEN p.`月均店面贡献利润` > 0 THEN i.`总投资额` / p.`月均店面贡献利润` ELSE 999 END AS `预计完整回本月数`,
  CAST(MONTHS_BETWEEN(DATE '2026-05-20', i.`投资起始日`) AS INT) AS `已开业月数`,
  CASE WHEN p.`月均店面贡献利润` > 0 THEN DATE_ADD(DATE '2026-05-20', CAST(i.`总投资额` / p.`月均店面贡献利润` * 30 AS INT))
       ELSE NULL END AS `预计完整回本日期`
FROM input1 i
LEFT JOIN input2 p ON i.`门店ID` = p.`门店ID`
```


### 节点4
- Id: id_1779345941096
- Name: 关联合同信息
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779345941095 (JOIN算回本指标(SQL多键替代))
  - id_1779345941092 (dwd_加盟合同明细)

- **Used By (Outputs):**
  - id_1779345941097 (回本健康打标)
- Position: (1000,400)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`门店ID` = input2.`门店ID`
```


### 节点5
- Id: id_1779345941097
- Name: 回本健康打标
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779345941096 (关联合同信息)

- **Used By (Outputs):**
  - id_1779345941098 (dws_加盟回本测算)
- Position: (1300,400)
- FormulaNames:
  - 招商承诺回本月数
  - 回本偏离度
  - 回本风险等级
  - 标杆门店标志
- 等价SQL:
```sql
SELECT
  *,
  case `门店类型` when '商场店' then 24 when '社区店' then 18 when '写字楼店' then 22 when '交通店' then 30 when '学校店' then 20 when '夜市店' then 18 when '外卖卫星店' then 12 when '旗舰店' then 36 when '快取店' then 15 else 24 end AS `招商承诺回本月数`,
  case `门店类型` when '商场店' then `预计完整回本月数` - 24 when '社区店' then `预计完整回本月数` - 18 when '写字楼店' then `预计完整回本月数` - 22 when '交通店' then `预计完整回本月数` - 30 when '学校店' then `预计完整回本月数` - 20 when '夜市店' then `预计完整回本月数` - 18 when '外卖卫星店' then `预计完整回本月数` - 12 when '旗舰店' then `预计完整回本月数` - 36 when '快取店' then `预计完整回本月数` - 15 else `预计完整回本月数` - 24 end AS `回本偏离度`,
  case when `月均店面贡献利润` <= 0 then '严重' when `预计完整回本月数` >= 60 then '严重' when `预计完整回本月数` >= 36 then '预警' when `预计完整回本月数` >= 24 then '关注' else '健康' end AS `回本风险等级`,
  case when `平均贡献利润率` >= 0.25 and `预计完整回本月数` <= 18 then 'TRUE' else 'FALSE' end AS `标杆门店标志`
FROM input1
```


### 节点6
- Id: id_1779345941092
- Name: dwd_加盟合同明细
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345941096 (关联合同信息)
- Position: (100,700)
- InputDsId: w55d0570b98a143579807416
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点7
- Id: id_1779345941093
- Name: 门店总投资聚合
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345941090 (dwd_门店投资明细)

- **Used By (Outputs):**
  - id_1779345941095 (JOIN算回本指标(SQL多键替代))
- Position: (400,100)
- SqlScript:
```sql
SELECT
  `门店ID`,
  `加盟商ID`,
  SUM(`投资金额`) AS `总投资额`,
  SUM(CASE WHEN `回收性质` = '可回收' THEN `投资金额` ELSE 0 END) AS `可回收投资`,
  SUM(CASE WHEN `回收性质` = '不可回收' THEN `投资金额` ELSE 0 END) AS `不可回收投资`,
  MIN(`投资日期`) AS `投资起始日`
FROM input1
GROUP BY `门店ID`, `加盟商ID`
```
- 等价SQL:
```sql
SELECT
  `门店ID`,
  `加盟商ID`,
  SUM(`投资金额`) AS `总投资额`,
  SUM(CASE WHEN `回收性质` = '可回收' THEN `投资金额` ELSE 0 END) AS `可回收投资`,
  SUM(CASE WHEN `回收性质` = '不可回收' THEN `投资金额` ELSE 0 END) AS `不可回收投资`,
  MIN(`投资日期`) AS `投资起始日`
FROM input1
GROUP BY `门店ID`, `加盟商ID`
```


### 节点8
- Id: id_1779345941094
- Name: 门店累计利润+月均
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345941091 (dws_单店利润月汇总)

- **Used By (Outputs):**
  - id_1779345941095 (JOIN算回本指标(SQL多键替代))
- Position: (400,400)
- SqlScript:
```sql
SELECT
  `门店ID`,
  COUNT(DISTINCT `月份`) AS `经营月数`,
  SUM(`月营收`) AS `累计营收`,
  SUM(`店面贡献利润`) AS `累计店面贡献利润`,
  SUM(`单店净利润`) AS `累计单店净利润`,
  AVG(`月营收`) AS `月均营收`,
  AVG(`店面贡献利润`) AS `月均店面贡献利润`,
  AVG(`店面贡献利润率`) AS `平均贡献利润率`
FROM input1
GROUP BY `门店ID`
```
- 等价SQL:
```sql
SELECT
  `门店ID`,
  COUNT(DISTINCT `月份`) AS `经营月数`,
  SUM(`月营收`) AS `累计营收`,
  SUM(`店面贡献利润`) AS `累计店面贡献利润`,
  SUM(`单店净利润`) AS `累计单店净利润`,
  AVG(`月营收`) AS `月均营收`,
  AVG(`店面贡献利润`) AS `月均店面贡献利润`,
  AVG(`店面贡献利润率`) AS `平均贡献利润率`
FROM input1
GROUP BY `门店ID`
```


### 节点9
- Id: id_1779345941098
- Name: dws_加盟回本测算
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779345941097 (回本健康打标)
- Position: (1500,400)
- OutputDsName: dws_加盟回本测算
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: vf66c6e915ad048c49cbcf25
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (3)
- **dwd_门店投资明细** (DATA_SET_FILE)
  - ID: dd5f37d14b97f4ee38c4b0dc
- **dwd_加盟合同明细** (DATA_SET_FILE)
  - ID: w55d0570b98a143579807416
- **dws_单店利润月汇总** (DATA_SET_ETL)
  - ID: l6ee75fc812be413583215e4

### 下游资源 (1)
- **dws_加盟回本测算** (DATA_SET_ETL)
  - ID: vf66c6e915ad048c49cbcf25
