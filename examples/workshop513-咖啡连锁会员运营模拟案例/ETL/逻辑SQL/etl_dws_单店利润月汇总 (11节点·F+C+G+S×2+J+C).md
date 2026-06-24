你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 11
- **节点类型分布:**
  - CALCULATOR: 2
  - FILTER_ROWS: 1
  - GROUP_BY: 1
  - INPUT_DATASET: 3
  - JOIN_DATA: 1
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 2
- **数据输入源:**
  - j23ea7e60564e47458b71d82 (dwd_订单)
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
  - ff7b4cae808ca4ecab894f53 (dwd_门店成本明细)
- **数据输出目标:**
  - dws_单店利润月汇总 (目录: 马甲的demo-0523)
---
## ETL 节点详细信息


### 节点1
- Id: id_1779345679920
- Name: 筛选已完成订单
- Type: FILTER_ROWS
- **Sources (Inputs):**
  - id_1779345679919 (dwd_订单)

- **Used By (Outputs):**
  - id_1779345679921 (派生月份+营收分流)
- Position: (431,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
WHERE (`订单状态` = '已完成')
```


### 节点2
- Id: id_1779345679921
- Name: 派生月份+营收分流
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779345679920 (筛选已完成订单)

- **Used By (Outputs):**
  - id_1779345679922 (门店月营收聚合)
- Position: (635,64)
- FormulaNames:
  - 月份
  - 堂食营收
  - 外卖营收
  - 订单计数
- 等价SQL:
```sql
SELECT
  *,
  substr(`业务日期`, 1, 7) AS `月份`,
  case when `是否到店` = 1 then `实付金额` else 0 end AS `堂食营收`,
  case when `是否到店` = 0 then `实付金额` else 0 end AS `外卖营收`,
  1 AS `订单计数`
FROM input1
```


### 节点3
- Id: id_1779345679919
- Name: dwd_订单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345679920 (筛选已完成订单)
- Position: (227,64)
- InputDsId: j23ea7e60564e47458b71d82
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1779345679928
- Name: PnL 四层 + 占比指标
- Type: CALCULATOR
- **Sources (Inputs):**
  - id_1779345679927 (关联门店维度)

- **Used By (Outputs):**
  - id_1779345679929 (dws_单店利润月汇总)
- Position: (1451,64)
- FormulaNames:
  - 毛利
  - 店面贡献利润
  - 单店净利润
  - 毛利率
  - 店面贡献利润率
  - 单店净利率
  - 堂食占比
  - 外卖占比
  - 人工占比
  - 房租占比
  - 客单价
- 等价SQL:
```sql
SELECT
  *,
  `月营收` - `变动成本合计` AS `毛利`,
  `月营收` - `变动成本合计` - `半固定成本合计` - `房租物业` AS `店面贡献利润`,
  `月营收` - `成本总计` AS `单店净利润`,
  case when `月营收` > 0 then (`月营收` - `变动成本合计`) / `月营收` else 0 end AS `毛利率`,
  case when `月营收` > 0 then (`月营收` - `变动成本合计` - `半固定成本合计` - `房租物业`) / `月营收` else 0 end AS `店面贡献利润率`,
  case when `月营收` > 0 then (`月营收` - `成本总计`) / `月营收` else 0 end AS `单店净利率`,
  case when `月营收` > 0 then `堂食营收` / `月营收` else 0 end AS `堂食占比`,
  case when `月营收` > 0 then `外卖营收` / `月营收` else 0 end AS `外卖占比`,
  case when `月营收` > 0 then `人工成本` / `月营收` else 0 end AS `人工占比`,
  case when `月营收` > 0 then `房租物业` / `月营收` else 0 end AS `房租占比`,
  case when `订单数` > 0 then `月营收` / `订单数` else 0 end AS `客单价`
FROM input1
```


### 节点5
- Id: id_1779345679922
- Name: 门店月营收聚合
- Type: GROUP_BY
- **Sources (Inputs):**
  - id_1779345679921 (派生月份+营收分流)

- **Used By (Outputs):**
  - id_1779345679925 (营收+成本 多键JOIN)
- Position: (839,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
```


### 节点6
- Id: id_1779345679926
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345679927 (关联门店维度)
- Position: (1043,232)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: EXCEL
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点7
- Id: id_1779345679923
- Name: dwd_门店成本明细
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_1779345679924 (成本透视(8 大科目))
- Position: (635,232)
- InputDsId: ff7b4cae808ca4ecab894f53
- DisplayType: CSV
- PreviewScope: ALL
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点8
- Id: id_1779345679929
- Name: dws_单店利润月汇总
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_1779345679928 (PnL 四层 + 占比指标)
- Position: (1655,64)
- OutputDsName: dws_单店利润月汇总
- ParentDirId: v2b6bde3d41444cfd9e6d7ef
- ParentDirName: 马甲的demo-0523
- DataSourceDsId: l6ee75fc812be413583215e4
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的demo-0523
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点9
- Id: id_1779345679927
- Name: 关联门店维度
- Type: JOIN_DATA
- **Sources (Inputs):**
  - id_1779345679925 (营收+成本 多键JOIN)
  - id_1779345679926 (dim_门店主档)

- **Used By (Outputs):**
  - id_1779345679928 (PnL 四层 + 占比指标)
- Position: (1247,64)
- 等价SQL:
```sql
SELECT
  *
FROM input1
LEFT_OUTER JOIN input2 ON input1.`门店ID` = input2.`门店ID`
```


### 节点10
- Id: id_1779345679924
- Name: 成本透视(8 大科目)
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345679923 (dwd_门店成本明细)

- **Used By (Outputs):**
  - id_1779345679925 (营收+成本 多键JOIN)
- Position: (839,232)
- SqlScript:
```sql
SELECT
  `门店ID`,
  `月份`,
  SUM(CASE WHEN `成本科目ID` = 'CST_RAW'  THEN `成本金额` ELSE 0 END) AS `原材料成本`,
  SUM(CASE WHEN `成本科目ID` = 'CST_PKG'  THEN `成本金额` ELSE 0 END) AS `包材成本`,
  SUM(CASE WHEN `成本科目ID` = 'CST_PLAT' THEN `成本金额` ELSE 0 END) AS `平台抽佣`,
  SUM(CASE WHEN `成本科目ID` = 'CST_LBR'  THEN `成本金额` ELSE 0 END) AS `人工成本`,
  SUM(CASE WHEN `成本科目ID` = 'CST_RENT' THEN `成本金额` ELSE 0 END) AS `房租物业`,
  SUM(CASE WHEN `成本科目ID` = 'CST_UTL'  THEN `成本金额` ELSE 0 END) AS `能耗水电`,
  SUM(CASE WHEN `成本科目ID` = 'CST_DEP'  THEN `成本金额` ELSE 0 END) AS `设备折旧`,
  SUM(CASE WHEN `成本科目ID` = 'CST_HQ'   THEN `成本金额` ELSE 0 END) AS `总部分摊`,
  SUM(CASE WHEN `成本大类` = '变动成本'   THEN `成本金额` ELSE 0 END) AS `变动成本合计`,
  SUM(CASE WHEN `成本大类` = '半固定成本' THEN `成本金额` ELSE 0 END) AS `半固定成本合计`,
  SUM(CASE WHEN `成本大类` = '固定成本'   THEN `成本金额` ELSE 0 END) AS `固定成本合计`,
  SUM(`成本金额`) AS `成本总计`
FROM input1
GROUP BY `门店ID`, `月份`
```
- 等价SQL:
```sql
SELECT
  `门店ID`,
  `月份`,
  SUM(CASE WHEN `成本科目ID` = 'CST_RAW'  THEN `成本金额` ELSE 0 END) AS `原材料成本`,
  SUM(CASE WHEN `成本科目ID` = 'CST_PKG'  THEN `成本金额` ELSE 0 END) AS `包材成本`,
  SUM(CASE WHEN `成本科目ID` = 'CST_PLAT' THEN `成本金额` ELSE 0 END) AS `平台抽佣`,
  SUM(CASE WHEN `成本科目ID` = 'CST_LBR'  THEN `成本金额` ELSE 0 END) AS `人工成本`,
  SUM(CASE WHEN `成本科目ID` = 'CST_RENT' THEN `成本金额` ELSE 0 END) AS `房租物业`,
  SUM(CASE WHEN `成本科目ID` = 'CST_UTL'  THEN `成本金额` ELSE 0 END) AS `能耗水电`,
  SUM(CASE WHEN `成本科目ID` = 'CST_DEP'  THEN `成本金额` ELSE 0 END) AS `设备折旧`,
  SUM(CASE WHEN `成本科目ID` = 'CST_HQ'   THEN `成本金额` ELSE 0 END) AS `总部分摊`,
  SUM(CASE WHEN `成本大类` = '变动成本'   THEN `成本金额` ELSE 0 END) AS `变动成本合计`,
  SUM(CASE WHEN `成本大类` = '半固定成本' THEN `成本金额` ELSE 0 END) AS `半固定成本合计`,
  SUM(CASE WHEN `成本大类` = '固定成本'   THEN `成本金额` ELSE 0 END) AS `固定成本合计`,
  SUM(`成本金额`) AS `成本总计`
FROM input1
GROUP BY `门店ID`, `月份`
```


### 节点11
- Id: id_1779345679925
- Name: 营收+成本 多键JOIN
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1779345679922 (门店月营收聚合)
  - id_1779345679924 (成本透视(8 大科目))

- **Used By (Outputs):**
  - id_1779345679927 (关联门店维度)
- Position: (1043,64)
- SqlScript:
```sql
SELECT
  r.`门店ID`, r.`月份`,
  r.`实付金额`     AS `月营收`,
  r.`堂食营收`,
  r.`外卖营收`,
  r.`订单计数`     AS `订单数`,
  COALESCE(c.`原材料成本`, 0) AS `原材料成本`,
  COALESCE(c.`包材成本`, 0)   AS `包材成本`,
  COALESCE(c.`平台抽佣`, 0)   AS `平台抽佣`,
  COALESCE(c.`人工成本`, 0)   AS `人工成本`,
  COALESCE(c.`房租物业`, 0)   AS `房租物业`,
  COALESCE(c.`能耗水电`, 0)   AS `能耗水电`,
  COALESCE(c.`设备折旧`, 0)   AS `设备折旧`,
  COALESCE(c.`总部分摊`, 0)   AS `总部分摊`,
  COALESCE(c.`变动成本合计`, 0) AS `变动成本合计`,
  COALESCE(c.`半固定成本合计`, 0) AS `半固定成本合计`,
  COALESCE(c.`固定成本合计`, 0)   AS `固定成本合计`,
  COALESCE(c.`成本总计`, 0)   AS `成本总计`
FROM input1 r
LEFT JOIN input2 c ON r.`门店ID` = c.`门店ID` AND r.`月份` = c.`月份`
```
- 等价SQL:
```sql
SELECT
  r.`门店ID`, r.`月份`,
  r.`实付金额`     AS `月营收`,
  r.`堂食营收`,
  r.`外卖营收`,
  r.`订单计数`     AS `订单数`,
  COALESCE(c.`原材料成本`, 0) AS `原材料成本`,
  COALESCE(c.`包材成本`, 0)   AS `包材成本`,
  COALESCE(c.`平台抽佣`, 0)   AS `平台抽佣`,
  COALESCE(c.`人工成本`, 0)   AS `人工成本`,
  COALESCE(c.`房租物业`, 0)   AS `房租物业`,
  COALESCE(c.`能耗水电`, 0)   AS `能耗水电`,
  COALESCE(c.`设备折旧`, 0)   AS `设备折旧`,
  COALESCE(c.`总部分摊`, 0)   AS `总部分摊`,
  COALESCE(c.`变动成本合计`, 0) AS `变动成本合计`,
  COALESCE(c.`半固定成本合计`, 0) AS `半固定成本合计`,
  COALESCE(c.`固定成本合计`, 0)   AS `固定成本合计`,
  COALESCE(c.`成本总计`, 0)   AS `成本总计`
FROM input1 r
LEFT JOIN input2 c ON r.`门店ID` = c.`门店ID` AND r.`月份` = c.`月份`
```


---

## 血缘关系

### 上游资源 (3)
- **dwd_门店成本明细** (DATA_SET_FILE)
  - ID: ff7b4cae808ca4ecab894f53
- **dwd_订单** (DATA_SET_FILE)
  - ID: j23ea7e60564e47458b71d82
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7

### 下游资源 (1)
- **dws_单店利润月汇总** (DATA_SET_ETL)
  - ID: l6ee75fc812be413583215e4
