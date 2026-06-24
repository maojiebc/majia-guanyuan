你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 4
- **节点类型分布:**
  - INPUT_DATASET: 2
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - h551155a12fc04d88a57d319 (dim_会员主档)
- **数据输出目标:**
  - dws_渠道迁移分析 (目录: 0523-马甲-demo)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779326818728
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818730 (SQL处理)
- Position: (200,100)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1779326818729
- Name: dim_会员主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779326818730 (SQL处理)
- Position: (200,250)
- InputDsId: h551155a12fc04d88a57d319
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1779326818730
- Name: SQL处理
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779326818728 (dwd_订单)
  - id_1779326818729 (dim_会员主档)

- **Used By (Outputs):**
  - id_1779326818731 (dws_渠道迁移分析)
- Position: (500,100)
- SqlScript:
```sql
WITH member_channel AS (
  SELECT
    `会员ID`,
    CASE
      WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 30) THEN '近30天'
      ELSE '前60天'
    END AS `周期`,
    SUM(CASE WHEN `是否到店` = 1 THEN `实付金额` ELSE 0 END) AS `堂食金额`,
    SUM(CASE WHEN `是否到店` = 0 THEN `实付金额` ELSE 0 END) AS `外卖金额`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 1 THEN `订单ID` END) AS `堂食单数`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 0 THEN `订单ID` END) AS `外卖单数`
  FROM input1
  WHERE (`会员ID` IS NOT NULL AND `会员ID` <> '') AND `订单状态` = '已完成'
  GROUP BY `会员ID`,
    CASE WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 30) THEN '近30天' ELSE '前60天' END
),
member_pattern AS (
  SELECT
    `会员ID`,
    SUM(CASE WHEN `周期` = '近30天' THEN `堂食单数` ELSE 0 END) AS `近30天堂食`,
    SUM(CASE WHEN `周期` = '近30天' THEN `外卖单数` ELSE 0 END) AS `近30天外卖`,
    SUM(CASE WHEN `周期` = '前60天' THEN `堂食单数` ELSE 0 END) AS `前60天堂食`,
    SUM(CASE WHEN `周期` = '前60天' THEN `外卖单数` ELSE 0 END) AS `前60天外卖`
  FROM member_channel
  GROUP BY `会员ID`
)
SELECT
  p.`会员ID`, m.`会员等级`, m.`城市`,
  p.`近30天堂食`, p.`近30天外卖`, p.`前60天堂食`, p.`前60天外卖`,
  CASE
    WHEN p.`前60天堂食` >= 2 AND p.`近30天堂食` = 0 AND p.`近30天外卖` > 0 THEN '堂食→外卖迁移'
    WHEN p.`前60天外卖` >= 2 AND p.`近30天外卖` = 0 AND p.`近30天堂食` > 0 THEN '外卖→堂食回流'
    WHEN p.`前60天堂食` >= 1 AND p.`近30天堂食` >= 1 AND p.`近30天外卖` = 0 THEN '纯堂食'
    WHEN p.`前60天外卖` >= 1 AND p.`近30天外卖` >= 1 AND p.`近30天堂食` = 0 THEN '纯外卖'
    WHEN p.`近30天堂食` > 0 AND p.`近30天外卖` > 0 THEN '混合渠道'
    ELSE '其他'
  END AS `迁移类型`
FROM member_pattern p
LEFT JOIN input2 m ON p.`会员ID` = m.`会员ID`
```
- 等价SQL:
```sql
WITH member_channel AS (
  SELECT
    `会员ID`,
    CASE
      WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 30) THEN '近30天'
      ELSE '前60天'
    END AS `周期`,
    SUM(CASE WHEN `是否到店` = 1 THEN `实付金额` ELSE 0 END) AS `堂食金额`,
    SUM(CASE WHEN `是否到店` = 0 THEN `实付金额` ELSE 0 END) AS `外卖金额`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 1 THEN `订单ID` END) AS `堂食单数`,
    COUNT(DISTINCT CASE WHEN `是否到店` = 0 THEN `订单ID` END) AS `外卖单数`
  FROM input1
  WHERE (`会员ID` IS NOT NULL AND `会员ID` <> '') AND `订单状态` = '已完成'
  GROUP BY `会员ID`,
    CASE WHEN `业务日期` >= DATE_SUB(DATE '2026-05-20', 30) THEN '近30天' ELSE '前60天' END
),
member_pattern AS (
  SELECT
    `会员ID`,
    SUM(CASE WHEN `周期` = '近30天' THEN `堂食单数` ELSE 0 END) AS `近30天堂食`,
    SUM(CASE WHEN `周期` = '近30天' THEN `外卖单数` ELSE 0 END) AS `近30天外卖`,
    SUM(CASE WHEN `周期` = '前60天' THEN `堂食单数` ELSE 0 END) AS `前60天堂食`,
    SUM(CASE WHEN `周期` = '前60天' THEN `外卖单数` ELSE 0 END) AS `前60天外卖`
  FROM member_channel
  GROUP BY `会员ID`
)
SELECT
  p.`会员ID`, m.`会员等级`, m.`城市`,
  p.`近30天堂食`, p.`近30天外卖`, p.`前60天堂食`, p.`前60天外卖`,
  CASE
    WHEN p.`前60天堂食` >= 2 AND p.`近30天堂食` = 0 AND p.`近30天外卖` > 0 THEN '堂食→外卖迁移'
    WHEN p.`前60天外卖` >= 2 AND p.`近30天外卖` = 0 AND p.`近30天堂食` > 0 THEN '外卖→堂食回流'
    WHEN p.`前60天堂食` >= 1 AND p.`近30天堂食` >= 1 AND p.`近30天外卖` = 0 THEN '纯堂食'
    WHEN p.`前60天外卖` >= 1 AND p.`近30天外卖` >= 1 AND p.`近30天堂食` = 0 THEN '纯外卖'
    WHEN p.`近30天堂食` > 0 AND p.`近30天外卖` > 0 THEN '混合渠道'
    ELSE '其他'
  END AS `迁移类型`
FROM member_pattern p
LEFT JOIN input2 m ON p.`会员ID` = m.`会员ID`
```


### 节点4
- Id: id_1779326818731
- Name: dws_渠道迁移分析
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779326818730 (SQL处理)
- Position: (800,100)
- OutputDsName: dws_渠道迁移分析
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 0523-马甲-demo
- DataSourceDsId: s44dad3e0887d41dcb5dfc52
- DataSourceCreated: true
- DirPath: 根目录 > 0523-马甲-demo
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (2)
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_会员主档** (DATA_SET_FILE)
  - ID: h551155a12fc04d88a57d319

### 下游资源 (1)
- **dws_渠道迁移分析** (DATA_SET_ETL)
  - ID: s44dad3e0887d41dcb5dfc52
