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
  - l6ee75fc812be413583215e4 (dws_单店利润月汇总)
  - l9312c8ef7ec14877889f06b (param_利润健康阈值)
- **数据输出目标:**
  - ads_单店利润健康 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779346047774
- Name: dws_单店利润月汇总
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779346047776 (关联店型阈值表)
- Position: (100,100)
- InputDsId: l6ee75fc812be413583215e4
- DisplayType: DATAFLOW
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779346047778
- Name: 连续亏损窗口分析
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779346047777 (利润健康标签+建议动作)

- **Used By (Outputs):**
  - id_1779346047779 (ads_单店利润健康)
- Position: (900,250)
- SqlScript:
```sql
WITH ranked AS (
  SELECT
    `门店ID`, `月份`, `店面贡献利润`, `本月亏损`,
    ROW_NUMBER() OVER (PARTITION BY `门店ID` ORDER BY `月份` DESC) AS `近期序`
  FROM input1
),
loss_count AS (
  SELECT
    `门店ID`,
    SUM(CASE WHEN `店面贡献利润` < 0 THEN 1 ELSE 0 END) AS `历史亏损月数`,
    MAX(CASE WHEN `店面贡献利润` < 0 AND `近期序` <= 3 THEN 1 ELSE 0 END) AS `近3月有亏损`
  FROM ranked
  GROUP BY `门店ID`
)
SELECT
  r.*,
  l.`历史亏损月数`,
  l.`近3月有亏损`,
  CASE WHEN l.`近3月有亏损` = 1 AND l.`历史亏损月数` >= 3 THEN '持续亏损' ELSE '非持续亏损' END AS `持续亏损标签`
FROM input1 r
LEFT JOIN loss_count l ON r.`门店ID` = l.`门店ID`
```
- 等价SQL:
```sql
WITH ranked AS (
  SELECT
    `门店ID`, `月份`, `店面贡献利润`, `本月亏损`,
    ROW_NUMBER() OVER (PARTITION BY `门店ID` ORDER BY `月份` DESC) AS `近期序`
  FROM input1
),
loss_count AS (
  SELECT
    `门店ID`,
    SUM(CASE WHEN `店面贡献利润` < 0 THEN 1 ELSE 0 END) AS `历史亏损月数`,
    MAX(CASE WHEN `店面贡献利润` < 0 AND `近期序` <= 3 THEN 1 ELSE 0 END) AS `近3月有亏损`
  FROM ranked
  GROUP BY `门店ID`
)
SELECT
  r.*,
  l.`历史亏损月数`,
  l.`近3月有亏损`,
  CASE WHEN l.`近3月有亏损` = 1 AND l.`历史亏损月数` >= 3 THEN '持续亏损' ELSE '非持续亏损' END AS `持续亏损标签`
FROM input1 r
LEFT JOIN loss_count l ON r.`门店ID` = l.`门店ID`
```


### 节点3
- Id: id_1779346047775
- Name: param_利润健康阈值
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779346047776 (关联店型阈值表)
- Position: (100,400)
- InputDsId: l9312c8ef7ec14877889f06b
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779346047777
- Name: 利润健康标签+建议动作
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779346047776 (关联店型阈值表)

- **Used By (Outputs):**
  - id_1779346047778 (连续亏损窗口分析)
- Position: (600,250)
- FormulaNames:
  - 房租超标
  - 人工超标
  - 堂食衰减
  - 本月亏损
  - 利润健康等级
  - 预警条数
  - 建议动作
- 等价SQL:
```sql
SELECT
  *,
  case when `房租占比` > `房租占比上限` then 'TRUE' else 'FALSE' end AS `房租超标`,
  case when `人工占比` > `人工占比上限` then 'TRUE' else 'FALSE' end AS `人工超标`,
  case when `堂食占比` < `堂食占比下限` and `门店类型` <> '外卖卫星店' then 'TRUE' else 'FALSE' end AS `堂食衰减`,
  case when `店面贡献利润` < 0 then 'TRUE' else 'FALSE' end AS `本月亏损`,
  case when `店面贡献利润` < 0 then '严重亏损' when `店面贡献利润率` < 0.05 then '微利' when `店面贡献利润率` < 0.12 then '关注' when `店面贡献利润率` < 0.20 then '健康' else '标杆' end AS `利润健康等级`,
  (case when `房租占比` > `房租占比上限` then 1 else 0 end) + (case when `人工占比` > `人工占比上限` then 1 else 0 end) + (case when `堂食占比` < `堂食占比下限` and `门店类型` <> '外卖卫星店' then 1 else 0 end) + (case when `店面贡献利润` < 0 then 1 else 0 end) AS `预警条数`,
  case when `店面贡献利润` < 0 then '启动关店评估' when `房租占比` > `房租占比上限` then '考虑闭店或营收提升' when `人工占比` > `人工占比上限` then '检查排班 / 客流不匹配' when `堂食占比` < `堂食占比下限` and `门店类型` <> '外卖卫星店' then '进入堂食提振专题' when `店面贡献利润率` >= 0.20 then '标杆门店, 复制打法' else '正常运营' end AS `建议动作`
FROM input1
```


### 节点5
- Id: id_1779346047776
- Name: 关联店型阈值表
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779346047774 (dws_单店利润月汇总)
  - id_1779346047775 (param_利润健康阈值)

- **Used By (Outputs):**
  - id_1779346047777 (利润健康标签+建议动作)
- Position: (300,250)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`门店类型` = input2.`门店类型`
```


### 节点6
- Id: id_1779346047779
- Name: ads_单店利润健康
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779346047778 (连续亏损窗口分析)
- Position: (1100,250)
- OutputDsName: ads_单店利润健康
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: p39cc9d0866ac442bb777c63
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **param_利润健康阈值** (DATA_SET_FILE)
  - ID: l9312c8ef7ec14877889f06b
- **dws_单店利润月汇总** (DATA_SET_ETL)
  - ID: l6ee75fc812be413583215e4

### 下游资源 (1)
- **ads_单店利润健康** (DATA_SET_ETL)
  - ID: p39cc9d0866ac442bb777c63
