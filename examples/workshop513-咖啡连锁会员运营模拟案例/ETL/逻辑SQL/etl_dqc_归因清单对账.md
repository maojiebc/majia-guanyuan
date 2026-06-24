你是一个ETL专家, 正在查看如下ETL的定义(注意: 这里的所有节点都会运行在 Apache Spark 3.4上, 所有的SQL语法都是Spark的语法, 当用户让优化性能时, 不要给出建索引等通用的建议, 因为Spark不能建立索引, 并且这个ETL只能使用Spark SQL(不能使用DataFrame API), 主要给出可以"通过优化ETL节点的写法来优化性能"这种优化建议):

## 基本信息
- UniformResourceType: DATA_PROCESS_ETL
---
## ETL 流程摘要

- **总节点数:** 8
- **节点类型分布:**
  - INPUT_DATASET: 6
  - OUTPUT_DATASET: 1
  - SQL_SCRIPT: 1
- **数据输入源:**
  - tf166544dfa5b407593e22ec (ads_异常归因清单)
  - nd177a0ac0eda44ac98c75bc (ads_门店每日指挥台)
  - p39cc9d0866ac442bb777c63 (ads_单店利润健康)
  - g52a667122e214eefb542bf6 (dws_体验口碑汇总)
  - l9312c8ef7ec14877889f06b (param_利润健康阈值)
  - jc8be722fd6cb49fa87206f0 (param_会员生命周期阈值)
- **数据输出目标:**
  - dqc_归因清单对账 (目录: 马甲的模拟数据集)
---
## ETL 节点详细信息


### 节点1
- Id: id_2001
- Name: 合流对账自检
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1001 (ads_异常归因清单)
  - id_1002 (ads_门店每日指挥台)
  - id_1003 (ads_单店利润健康)
  - id_1004 (dws_体验口碑汇总)
  - id_1005 (param_利润健康阈值)
  - id_1006 (param_会员生命周期阈值)

- **Used By (Outputs):**
  - id_3001 (dqc_归因清单对账)
- Position: (500,450)
- SqlScript:
```sql
-- dqc_归因清单对账：多源合流之后第一件事是建对账，否则规模会把小误差放大成事故
-- 三类自检：①完整性（各路源头行数 = 清单分来源行数，无丢无重）②参数覆盖（判定不静默落空）③关键列非空（分派链路不断）
WITH op_src AS (
  SELECT COUNT(*) AS c FROM input2 WHERE `今日异常` <> '正常'
),
op_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '运营监控'
),
profit_src AS (
  SELECT COUNT(*) AS c FROM input3 WHERE `预警条数` > 0 OR `本月亏损` = TRUE
),
profit_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '利润健康'
),
rep_src AS (
  SELECT COUNT(*) AS c FROM input4 WHERE `体验风险等级` = '高风险' AND (`未回复负评数` >= 1 OR `待处理投诉` >= 1)
),
rep_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '体验口碑'
),
member_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '会员健康'
),
owner_bad AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `店长姓名` IS NULL OR `区域经理` IS NULL
),
level_bad AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `风险等级` IS NULL OR `风险等级` NOT IN ('P0','P1','P2')
),
dup_bad AS (
  -- 重复 = 同店同日同来源同类型出现多行；合流 UNION ALL 不去重，唯一性必须由源头粒度保证并在此验收
  SELECT COUNT(*) AS c FROM (
    SELECT `门店ID` FROM input1
    GROUP BY `门店ID`, `业务日期`, `异常来源`, `异常类型`
    HAVING COUNT(*) > 1
  ) t
),
param1_cov AS (
  SELECT COUNT(DISTINCT `门店类型`) AS c FROM input5
),
param2_cov AS (
  SELECT COUNT(DISTINCT `门店类型`) AS c FROM input6
)
SELECT '01' AS `序号`, '完整性' AS `检查类别`, '运营路行数对账（清单=指挥台异常行）' AS `检查项`,
       CAST(op_src.c AS STRING) AS `期望值`, CAST(op_list.c AS STRING) AS `实际值`,
       CASE WHEN op_src.c = op_list.c THEN '通过' ELSE '异常' END AS `状态`
FROM op_src, op_list
UNION ALL
SELECT '02', '完整性', '利润路行数对账（清单=预警或亏损行）',
       CAST(profit_src.c AS STRING), CAST(profit_list.c AS STRING),
       CASE WHEN profit_src.c = profit_list.c THEN '通过' ELSE '异常' END
FROM profit_src, profit_list
UNION ALL
SELECT '03', '完整性', '口碑路行数对账（清单=高风险有抓手行）',
       CAST(rep_src.c AS STRING), CAST(rep_list.c AS STRING),
       CASE WHEN rep_src.c = rep_list.c THEN '通过' ELSE '异常' END
FROM rep_src, rep_list
UNION ALL
SELECT '04', '完整性', '会员路行数合理性（>0 且 <500，环比类异常量级护栏）',
       '(0, 500)', CAST(member_list.c AS STRING),
       CASE WHEN member_list.c > 0 AND member_list.c < 500 THEN '通过' ELSE '异常' END
FROM member_list
UNION ALL
SELECT '05', '完整性', '唯一性（店×日×来源×类型 无重复）',
       '0', CAST(dup_bad.c AS STRING),
       CASE WHEN dup_bad.c = 0 THEN '通过' ELSE '异常' END
FROM dup_bad
UNION ALL
SELECT '06', '关键列', '责任人非空（店长/区域经理，分派链路不断）',
       '0', CAST(owner_bad.c AS STRING),
       CASE WHEN owner_bad.c = 0 THEN '通过' ELSE '异常' END
FROM owner_bad
UNION ALL
SELECT '07', '关键列', '风险等级合法（P0/P1/P2 全覆盖无脏值）',
       '0', CAST(level_bad.c AS STRING),
       CASE WHEN level_bad.c = 0 THEN '通过' ELSE '异常' END
FROM level_bad
UNION ALL
SELECT '08', '参数覆盖', '利润健康阈值 9 店型齐全（判定不静默落空）',
       '9', CAST(param1_cov.c AS STRING),
       CASE WHEN param1_cov.c = 9 THEN '通过' ELSE '异常' END
FROM param1_cov
UNION ALL
SELECT '09', '参数覆盖', '会员生命周期阈值 9 店型齐全',
       '9', CAST(param2_cov.c AS STRING),
       CASE WHEN param2_cov.c = 9 THEN '通过' ELSE '异常' END
FROM param2_cov

```
- 等价SQL:
```sql
-- dqc_归因清单对账：多源合流之后第一件事是建对账，否则规模会把小误差放大成事故
-- 三类自检：①完整性（各路源头行数 = 清单分来源行数，无丢无重）②参数覆盖（判定不静默落空）③关键列非空（分派链路不断）
WITH op_src AS (
  SELECT COUNT(*) AS c FROM input2 WHERE `今日异常` <> '正常'
),
op_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '运营监控'
),
profit_src AS (
  SELECT COUNT(*) AS c FROM input3 WHERE `预警条数` > 0 OR `本月亏损` = TRUE
),
profit_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '利润健康'
),
rep_src AS (
  SELECT COUNT(*) AS c FROM input4 WHERE `体验风险等级` = '高风险' AND (`未回复负评数` >= 1 OR `待处理投诉` >= 1)
),
rep_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '体验口碑'
),
member_list AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `异常来源` = '会员健康'
),
owner_bad AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `店长姓名` IS NULL OR `区域经理` IS NULL
),
level_bad AS (
  SELECT COUNT(*) AS c FROM input1 WHERE `风险等级` IS NULL OR `风险等级` NOT IN ('P0','P1','P2')
),
dup_bad AS (
  -- 重复 = 同店同日同来源同类型出现多行；合流 UNION ALL 不去重，唯一性必须由源头粒度保证并在此验收
  SELECT COUNT(*) AS c FROM (
    SELECT `门店ID` FROM input1
    GROUP BY `门店ID`, `业务日期`, `异常来源`, `异常类型`
    HAVING COUNT(*) > 1
  ) t
),
param1_cov AS (
  SELECT COUNT(DISTINCT `门店类型`) AS c FROM input5
),
param2_cov AS (
  SELECT COUNT(DISTINCT `门店类型`) AS c FROM input6
)
SELECT '01' AS `序号`, '完整性' AS `检查类别`, '运营路行数对账（清单=指挥台异常行）' AS `检查项`,
       CAST(op_src.c AS STRING) AS `期望值`, CAST(op_list.c AS STRING) AS `实际值`,
       CASE WHEN op_src.c = op_list.c THEN '通过' ELSE '异常' END AS `状态`
FROM op_src, op_list
UNION ALL
SELECT '02', '完整性', '利润路行数对账（清单=预警或亏损行）',
       CAST(profit_src.c AS STRING), CAST(profit_list.c AS STRING),
       CASE WHEN profit_src.c = profit_list.c THEN '通过' ELSE '异常' END
FROM profit_src, profit_list
UNION ALL
SELECT '03', '完整性', '口碑路行数对账（清单=高风险有抓手行）',
       CAST(rep_src.c AS STRING), CAST(rep_list.c AS STRING),
       CASE WHEN rep_src.c = rep_list.c THEN '通过' ELSE '异常' END
FROM rep_src, rep_list
UNION ALL
SELECT '04', '完整性', '会员路行数合理性（>0 且 <500，环比类异常量级护栏）',
       '(0, 500)', CAST(member_list.c AS STRING),
       CASE WHEN member_list.c > 0 AND member_list.c < 500 THEN '通过' ELSE '异常' END
FROM member_list
UNION ALL
SELECT '05', '完整性', '唯一性（店×日×来源×类型 无重复）',
       '0', CAST(dup_bad.c AS STRING),
       CASE WHEN dup_bad.c = 0 THEN '通过' ELSE '异常' END
FROM dup_bad
UNION ALL
SELECT '06', '关键列', '责任人非空（店长/区域经理，分派链路不断）',
       '0', CAST(owner_bad.c AS STRING),
       CASE WHEN owner_bad.c = 0 THEN '通过' ELSE '异常' END
FROM owner_bad
UNION ALL
SELECT '07', '关键列', '风险等级合法（P0/P1/P2 全覆盖无脏值）',
       '0', CAST(level_bad.c AS STRING),
       CASE WHEN level_bad.c = 0 THEN '通过' ELSE '异常' END
FROM level_bad
UNION ALL
SELECT '08', '参数覆盖', '利润健康阈值 9 店型齐全（判定不静默落空）',
       '9', CAST(param1_cov.c AS STRING),
       CASE WHEN param1_cov.c = 9 THEN '通过' ELSE '异常' END
FROM param1_cov
UNION ALL
SELECT '09', '参数覆盖', '会员生命周期阈值 9 店型齐全',
       '9', CAST(param2_cov.c AS STRING),
       CASE WHEN param2_cov.c = 9 THEN '通过' ELSE '异常' END
FROM param2_cov

```


### 节点2
- Id: id_1001
- Name: ads_异常归因清单
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (合流对账自检)
- Position: (100,100)
- InputDsId: tf166544dfa5b407593e22ec
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1002
- Name: ads_门店每日指挥台
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (合流对账自检)
- Position: (100,250)
- InputDsId: nd177a0ac0eda44ac98c75bc
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1003
- Name: ads_单店利润健康
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (合流对账自检)
- Position: (100,400)
- InputDsId: p39cc9d0866ac442bb777c63
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点5
- Id: id_1004
- Name: dws_体验口碑汇总
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (合流对账自检)
- Position: (100,550)
- InputDsId: g52a667122e214eefb542bf6
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点6
- Id: id_1005
- Name: param_利润健康阈值
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (合流对账自检)
- Position: (100,700)
- InputDsId: l9312c8ef7ec14877889f06b
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点7
- Id: id_1006
- Name: param_会员生命周期阈值
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (合流对账自检)
- Position: (100,850)
- InputDsId: jc8be722fd6cb49fa87206f0
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点8
- Id: id_3001
- Name: dqc_归因清单对账
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_2001 (合流对账自检)
- Position: (800,450)
- OutputDsName: dqc_归因清单对账
- ParentDirId: g29ad2e8b75a64729a23243a
- ParentDirName: 马甲的模拟数据集
- DataSourceDsId: q3393c3949cbb4592a529d6c
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的模拟数据集
- 等价SQL:
```sql
SELECT * FROM input1
```


---

## 血缘关系

### 上游资源 (6)
- **ads_单店利润健康** (DATA_SET_ETL)
  - ID: p39cc9d0866ac442bb777c63
- **param_会员生命周期阈值** (DATA_SET_FILE)
  - ID: jc8be722fd6cb49fa87206f0
- **ads_门店每日指挥台** (DATA_SET_ETL)
  - ID: nd177a0ac0eda44ac98c75bc
- **ads_异常归因清单** (DATA_SET_ETL)
  - ID: tf166544dfa5b407593e22ec
- **dws_体验口碑汇总** (DATA_SET_ETL)
  - ID: g52a667122e214eefb542bf6
- **param_利润健康阈值** (DATA_SET_FILE)
  - ID: l9312c8ef7ec14877889f06b

### 下游资源 (1)
- **dqc_归因清单对账** (DATA_SET_ETL)
  - ID: q3393c3949cbb4592a529d6c
