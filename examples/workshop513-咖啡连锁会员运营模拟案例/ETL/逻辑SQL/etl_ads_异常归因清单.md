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
  - p39cc9d0866ac442bb777c63 (ads_单店利润健康)
  - g52a667122e214eefb542bf6 (dws_体验口碑汇总)
  - sedfdd84abacc4cb496c15e7 (dim_门店主档)
  - idc628b87ed3a4f1d91e5e1c (param_豁免日历)
  - jc8be722fd6cb49fa87206f0 (param_会员生命周期阈值)
  - nd177a0ac0eda44ac98c75bc (ads_门店每日指挥台)
- **数据输出目标:**
  - ads_异常归因清单 (目录: 马甲的模拟数据集)
---
## ETL 节点详细信息


### 节点1
- Id: id_1002
- Name: ads_单店利润健康
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (四路异常合流归因)
- Position: (100,250)
- InputDsId: p39cc9d0866ac442bb777c63
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点2
- Id: id_1003
- Name: dws_体验口碑汇总
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (四路异常合流归因)
- Position: (100,400)
- InputDsId: g52a667122e214eefb542bf6
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点3
- Id: id_1004
- Name: dim_门店主档
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (四路异常合流归因)
- Position: (100,550)
- InputDsId: sedfdd84abacc4cb496c15e7
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点4
- Id: id_1005
- Name: param_豁免日历
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (四路异常合流归因)
- Position: (100,700)
- InputDsId: idc628b87ed3a4f1d91e5e1c
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点5
- Id: id_1006
- Name: param_会员生命周期阈值
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (四路异常合流归因)
- Position: (100,850)
- InputDsId: jc8be722fd6cb49fa87206f0
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


### 节点6
- Id: id_3001
- Name: ads_异常归因清单
- Type: OUTPUT_DATASET
- **Sources (Inputs):**
  - id_2001 (四路异常合流归因)
- Position: (800,400)
- OutputDsName: ads_异常归因清单
- ParentDirId: g29ad2e8b75a64729a23243a
- ParentDirName: 马甲的模拟数据集
- DataSourceDsId: tf166544dfa5b407593e22ec
- DataSourceCreated: true
- DirPath: 根目录 > 马甲的模拟数据集
- 等价SQL:
```sql
SELECT * FROM input1
```


### 节点7
- Id: id_2001
- Name: 四路异常合流归因
- Type: SQL_SCRIPT
- **Sources (Inputs):**
  - id_1001 (ads_门店每日指挥台)
  - id_1002 (ads_单店利润健康)
  - id_1003 (dws_体验口碑汇总)
  - id_1004 (dim_门店主档)
  - id_1005 (param_豁免日历)
  - id_1006 (param_会员生命周期阈值)

- **Used By (Outputs):**
  - id_3001 (ads_异常归因清单)
- Position: (500,400)
- SqlScript:
```sql
-- ads_异常归因清单：四路异常合流 → 归因到参数、到人、到动作
-- 设计原则（唯一异常出口）：多出口=同店多套结论=周会变对数会；合流后责任人唯一、
-- 优先级全局可排、豁免统一套用、AI 单表可问。
WITH dim_cur AS (
  -- SCD2 拉链表必须锁当前版本：不加此过滤，未来主档加历史版本后 join 会爆行
  SELECT `门店ID`, `店长姓名`, `区域经理`, `是否90天内新店`
  FROM input4
  WHERE `当前版本标记` = 1
),
op_anom AS (
  -- 路1：日粒度运营异常（指挥台 7 类标签，标签层已用 CASE 优先级保证互斥）
  SELECT
    `业务日期`,
    '日' AS `粒度`,
    `门店ID`, `门店名称`, `门店类型`, `城市`,
    '运营监控' AS `异常来源`,
    `今日异常` AS `异常类型`,
    CONCAT('订单数', CAST(`订单数` AS STRING),
           '；销售额', CAST(ROUND(`销售额`, 0) AS STRING),
           '；会员占比', CAST(ROUND(`会员订单占比` * 100, 1) AS STRING), '%',
           '；当日评分', CAST(ROUND(`当日评分`, 1) AS STRING)) AS `异常详情`,
    CASE WHEN `今日异常` IN ('口碑异常', '评分滑坡', '客流异常') THEN 'P1'
         ELSE 'P2' END AS `风险等级`,
    CASE `今日异常`
      WHEN '客流异常' THEN '核查当日营业状态与商圈客流，连续3日异常升级区域经理'
      WHEN '口碑异常' THEN '24小时内回复全部负评并电话回访差评客户'
      WHEN '评分滑坡' THEN '当日复盘出品与服务，次日跟踪评分回升'
      WHEN '折扣过高' THEN '核查促销规则与收银操作，防止折扣滥用'
      WHEN '会员占比异常' THEN '检查会员权益触达与收银会员引导动作'
      WHEN '客单价异常' THEN '核对菜单结构变化与异常订单'
      ELSE '持续观察' END AS `建议动作`
  FROM input1
  WHERE `今日异常` <> '正常'
),
profit_anom AS (
  -- 路2：月粒度利润健康异常。阈值不写死在 SQL：判定结果由上游对照 param_利润健康阈值
  -- 生成（9 店型差异化），规则进表不进代码——业务改参数即生效，不动 ETL
  SELECT
    CAST(CONCAT(`月份`, '-01') AS DATE) AS `业务日期`,
    '月' AS `粒度`,
    `门店ID`, `门店名称`, `门店类型`, `城市`,
    '利润健康' AS `异常来源`,
    CONCAT_WS('+',
      CASE WHEN `房租超标` = TRUE THEN '房租超标' END,
      CASE WHEN `人工超标` = TRUE THEN '人工超标' END,
      CASE WHEN `堂食衰减` = TRUE THEN '堂食衰减' END,
      CASE WHEN `本月亏损` = TRUE THEN '本月亏损' END) AS `异常类型`,
    CONCAT('净利', CAST(ROUND(`单店净利润`, 0) AS STRING),
           '；房租占比', CAST(ROUND(`房租占比` * 100, 1) AS STRING), '%/上限', CAST(ROUND(`房租占比上限` * 100, 0) AS STRING), '%',
           '；人工占比', CAST(ROUND(`人工占比` * 100, 1) AS STRING), '%/上限', CAST(ROUND(`人工占比上限` * 100, 0) AS STRING), '%',
           '；堂食占比', CAST(ROUND(`堂食占比` * 100, 1) AS STRING), '%/下限', CAST(ROUND(`堂食占比下限` * 100, 0) AS STRING), '%',
           '；连亏', CAST(`历史亏损月数` AS STRING), '月') AS `异常详情`,
    -- 持续亏损按连续月数而非累计：偶发亏损与结构性失血是两种病，连续性才指向结构问题
    CASE WHEN `利润健康等级` = '严重亏损' AND `历史亏损月数` >= `持续亏损预警月数` THEN 'P0'
         WHEN `预警条数` >= 2 THEN 'P1'
         ELSE 'P2' END AS `风险等级`,
    `建议动作`
  FROM input2
  WHERE `预警条数` > 0 OR `本月亏损` = TRUE
),
rep_anom AS (
  -- 路3：日粒度口碑异常。收紧到「高风险且有抓手」：没有未回复负评/待处理投诉的高风险日
  -- 只是分数难看没有可执行动作，进清单只会稀释信噪比
  SELECT
    `业务日期`,
    '日' AS `粒度`,
    `门店ID`, `门店名称`, `门店类型`, `城市`,
    '体验口碑' AS `异常来源`,
    CONCAT('体验', `体验风险等级`) AS `异常类型`,
    CONCAT('负评率', CAST(ROUND(`负评率` * 100, 1) AS STRING), '%',
           '；投诉', CAST(`投诉数` AS STRING),
           '；未回复负评', CAST(`未回复负评数` AS STRING),
           '；待处理投诉', CAST(`待处理投诉` AS STRING)) AS `异常详情`,
    'P1' AS `风险等级`,
    '48小时内闭环全部未回复负评与待处理投诉' AS `建议动作`
  FROM input3
  WHERE `体验风险等级` = '高风险' AND (`未回复负评数` >= 1 OR `待处理投诉` >= 1)
),
member_monthly AS (
  -- 会员占比按门店×月聚合后重算，不用日粒度占比列均值：日占比均值会被低单量日噪声拉偏
  SELECT
    `门店ID`,
    MAX(`门店名称`) AS `门店名称`,
    MAX(`门店类型`) AS `门店类型`,
    MAX(`城市`) AS `城市`,
    substr(CAST(`业务日期` AS STRING), 1, 7) AS `月份`,
    SUM(`会员订单数`) * 1.0 / SUM(`订单数`) AS `会员占比`,
    SUM(`订单数`) AS `月订单数`
  FROM input1
  GROUP BY `门店ID`, substr(CAST(`业务日期` AS STRING), 1, 7)
),
member_anom AS (
  -- 路4：月粒度会员健康滑坡（param 插槽式扩展的实例：新增一类异常 = 一张参数表 + 一路 CTE，
  -- 看板/日报/作战页零改动自动承接）。全网会员占比在涨不代表个店健康——滑坡看环比不看大盘
  SELECT
    CAST(CONCAT(cur.`月份`, '-01') AS DATE) AS `业务日期`,
    '月' AS `粒度`,
    cur.`门店ID`, cur.`门店名称`, cur.`门店类型`, cur.`城市`,
    '会员健康' AS `异常来源`,
    '会员占比滑坡' AS `异常类型`,
    CONCAT('会员占比 ', CAST(ROUND(prev.`会员占比` * 100, 1) AS STRING), '%→', CAST(ROUND(cur.`会员占比` * 100, 1) AS STRING),
           '%（降 ', CAST(ROUND((prev.`会员占比` - cur.`会员占比`) * 100, 1) AS STRING),
           'pp，超', cur.`门店类型`, '预警线 ', CAST(ROUND(e.`会员占比月降幅预警` * 100, 1) AS STRING), 'pp）') AS `异常详情`,
    'P1' AS `风险等级`,
    '核查会员触达与权益发放是否中断，恢复会员到店激励并跟踪次月占比回升' AS `建议动作`
  FROM member_monthly cur
  JOIN member_monthly prev
    ON cur.`门店ID` = prev.`门店ID`
   AND prev.`月份` = substr(CAST(add_months(CAST(CONCAT(cur.`月份`, '-01') AS DATE), -1) AS STRING), 1, 7)
  JOIN input6 e ON cur.`门店类型` = e.`门店类型`
  -- 月订单数门槛：小样本店的占比波动是统计噪声不是经营信号
  WHERE cur.`月订单数` >= 100 AND prev.`月订单数` >= 100
    AND prev.`会员占比` - cur.`会员占比` > e.`会员占比月降幅预警`
),
unioned AS (
  SELECT * FROM op_anom
  UNION ALL
  SELECT * FROM profit_anom
  UNION ALL
  SELECT * FROM rep_anom
  UNION ALL
  SELECT * FROM member_anom
)
SELECT
  u.`业务日期`, u.`粒度`,
  u.`门店ID`, u.`门店名称`, u.`门店类型`, u.`城市`,
  d.`店长姓名`, d.`区域经理`,
  u.`异常来源`, u.`异常类型`, u.`异常详情`, u.`风险等级`,
  -- 豁免是打标不是删除：豁免行保留在清单中可审计「本来命中了什么、为什么被豁免」
  CASE
    WHEN e.`豁免原因` IS NOT NULL THEN e.`豁免原因`
    WHEN d.`是否90天内新店` = 'TRUE' THEN '新店爬坡观察'
    ELSE NULL
  END AS `豁免标记`,
  CASE
    WHEN e.`豁免原因` IS NOT NULL THEN '豁免观察'
    WHEN d.`是否90天内新店` = 'TRUE' THEN '豁免观察'
    ELSE '需处理'
  END AS `处理状态`,
  u.`建议动作`
FROM unioned u
LEFT JOIN dim_cur d ON u.`门店ID` = d.`门店ID`
-- 豁免日历为窄表（店型×月份一行一档）：规避 CSV 导入对 "1,2,7,8" 的数字类型推断，
-- join 直接数字对数字，豁免规则走数据变更不走代码发布
LEFT JOIN input5 e ON u.`门店类型` = e.`门店类型` AND MONTH(u.`业务日期`) = CAST(e.`豁免月份` AS INT)

```
- 等价SQL:
```sql
-- ads_异常归因清单：四路异常合流 → 归因到参数、到人、到动作
-- 设计原则（唯一异常出口）：多出口=同店多套结论=周会变对数会；合流后责任人唯一、
-- 优先级全局可排、豁免统一套用、AI 单表可问。
WITH dim_cur AS (
  -- SCD2 拉链表必须锁当前版本：不加此过滤，未来主档加历史版本后 join 会爆行
  SELECT `门店ID`, `店长姓名`, `区域经理`, `是否90天内新店`
  FROM input4
  WHERE `当前版本标记` = 1
),
op_anom AS (
  -- 路1：日粒度运营异常（指挥台 7 类标签，标签层已用 CASE 优先级保证互斥）
  SELECT
    `业务日期`,
    '日' AS `粒度`,
    `门店ID`, `门店名称`, `门店类型`, `城市`,
    '运营监控' AS `异常来源`,
    `今日异常` AS `异常类型`,
    CONCAT('订单数', CAST(`订单数` AS STRING),
           '；销售额', CAST(ROUND(`销售额`, 0) AS STRING),
           '；会员占比', CAST(ROUND(`会员订单占比` * 100, 1) AS STRING), '%',
           '；当日评分', CAST(ROUND(`当日评分`, 1) AS STRING)) AS `异常详情`,
    CASE WHEN `今日异常` IN ('口碑异常', '评分滑坡', '客流异常') THEN 'P1'
         ELSE 'P2' END AS `风险等级`,
    CASE `今日异常`
      WHEN '客流异常' THEN '核查当日营业状态与商圈客流，连续3日异常升级区域经理'
      WHEN '口碑异常' THEN '24小时内回复全部负评并电话回访差评客户'
      WHEN '评分滑坡' THEN '当日复盘出品与服务，次日跟踪评分回升'
      WHEN '折扣过高' THEN '核查促销规则与收银操作，防止折扣滥用'
      WHEN '会员占比异常' THEN '检查会员权益触达与收银会员引导动作'
      WHEN '客单价异常' THEN '核对菜单结构变化与异常订单'
      ELSE '持续观察' END AS `建议动作`
  FROM input1
  WHERE `今日异常` <> '正常'
),
profit_anom AS (
  -- 路2：月粒度利润健康异常。阈值不写死在 SQL：判定结果由上游对照 param_利润健康阈值
  -- 生成（9 店型差异化），规则进表不进代码——业务改参数即生效，不动 ETL
  SELECT
    CAST(CONCAT(`月份`, '-01') AS DATE) AS `业务日期`,
    '月' AS `粒度`,
    `门店ID`, `门店名称`, `门店类型`, `城市`,
    '利润健康' AS `异常来源`,
    CONCAT_WS('+',
      CASE WHEN `房租超标` = TRUE THEN '房租超标' END,
      CASE WHEN `人工超标` = TRUE THEN '人工超标' END,
      CASE WHEN `堂食衰减` = TRUE THEN '堂食衰减' END,
      CASE WHEN `本月亏损` = TRUE THEN '本月亏损' END) AS `异常类型`,
    CONCAT('净利', CAST(ROUND(`单店净利润`, 0) AS STRING),
           '；房租占比', CAST(ROUND(`房租占比` * 100, 1) AS STRING), '%/上限', CAST(ROUND(`房租占比上限` * 100, 0) AS STRING), '%',
           '；人工占比', CAST(ROUND(`人工占比` * 100, 1) AS STRING), '%/上限', CAST(ROUND(`人工占比上限` * 100, 0) AS STRING), '%',
           '；堂食占比', CAST(ROUND(`堂食占比` * 100, 1) AS STRING), '%/下限', CAST(ROUND(`堂食占比下限` * 100, 0) AS STRING), '%',
           '；连亏', CAST(`历史亏损月数` AS STRING), '月') AS `异常详情`,
    -- 持续亏损按连续月数而非累计：偶发亏损与结构性失血是两种病，连续性才指向结构问题
    CASE WHEN `利润健康等级` = '严重亏损' AND `历史亏损月数` >= `持续亏损预警月数` THEN 'P0'
         WHEN `预警条数` >= 2 THEN 'P1'
         ELSE 'P2' END AS `风险等级`,
    `建议动作`
  FROM input2
  WHERE `预警条数` > 0 OR `本月亏损` = TRUE
),
rep_anom AS (
  -- 路3：日粒度口碑异常。收紧到「高风险且有抓手」：没有未回复负评/待处理投诉的高风险日
  -- 只是分数难看没有可执行动作，进清单只会稀释信噪比
  SELECT
    `业务日期`,
    '日' AS `粒度`,
    `门店ID`, `门店名称`, `门店类型`, `城市`,
    '体验口碑' AS `异常来源`,
    CONCAT('体验', `体验风险等级`) AS `异常类型`,
    CONCAT('负评率', CAST(ROUND(`负评率` * 100, 1) AS STRING), '%',
           '；投诉', CAST(`投诉数` AS STRING),
           '；未回复负评', CAST(`未回复负评数` AS STRING),
           '；待处理投诉', CAST(`待处理投诉` AS STRING)) AS `异常详情`,
    'P1' AS `风险等级`,
    '48小时内闭环全部未回复负评与待处理投诉' AS `建议动作`
  FROM input3
  WHERE `体验风险等级` = '高风险' AND (`未回复负评数` >= 1 OR `待处理投诉` >= 1)
),
member_monthly AS (
  -- 会员占比按门店×月聚合后重算，不用日粒度占比列均值：日占比均值会被低单量日噪声拉偏
  SELECT
    `门店ID`,
    MAX(`门店名称`) AS `门店名称`,
    MAX(`门店类型`) AS `门店类型`,
    MAX(`城市`) AS `城市`,
    substr(CAST(`业务日期` AS STRING), 1, 7) AS `月份`,
    SUM(`会员订单数`) * 1.0 / SUM(`订单数`) AS `会员占比`,
    SUM(`订单数`) AS `月订单数`
  FROM input1
  GROUP BY `门店ID`, substr(CAST(`业务日期` AS STRING), 1, 7)
),
member_anom AS (
  -- 路4：月粒度会员健康滑坡（param 插槽式扩展的实例：新增一类异常 = 一张参数表 + 一路 CTE，
  -- 看板/日报/作战页零改动自动承接）。全网会员占比在涨不代表个店健康——滑坡看环比不看大盘
  SELECT
    CAST(CONCAT(cur.`月份`, '-01') AS DATE) AS `业务日期`,
    '月' AS `粒度`,
    cur.`门店ID`, cur.`门店名称`, cur.`门店类型`, cur.`城市`,
    '会员健康' AS `异常来源`,
    '会员占比滑坡' AS `异常类型`,
    CONCAT('会员占比 ', CAST(ROUND(prev.`会员占比` * 100, 1) AS STRING), '%→', CAST(ROUND(cur.`会员占比` * 100, 1) AS STRING),
           '%（降 ', CAST(ROUND((prev.`会员占比` - cur.`会员占比`) * 100, 1) AS STRING),
           'pp，超', cur.`门店类型`, '预警线 ', CAST(ROUND(e.`会员占比月降幅预警` * 100, 1) AS STRING), 'pp）') AS `异常详情`,
    'P1' AS `风险等级`,
    '核查会员触达与权益发放是否中断，恢复会员到店激励并跟踪次月占比回升' AS `建议动作`
  FROM member_monthly cur
  JOIN member_monthly prev
    ON cur.`门店ID` = prev.`门店ID`
   AND prev.`月份` = substr(CAST(add_months(CAST(CONCAT(cur.`月份`, '-01') AS DATE), -1) AS STRING), 1, 7)
  JOIN input6 e ON cur.`门店类型` = e.`门店类型`
  -- 月订单数门槛：小样本店的占比波动是统计噪声不是经营信号
  WHERE cur.`月订单数` >= 100 AND prev.`月订单数` >= 100
    AND prev.`会员占比` - cur.`会员占比` > e.`会员占比月降幅预警`
),
unioned AS (
  SELECT * FROM op_anom
  UNION ALL
  SELECT * FROM profit_anom
  UNION ALL
  SELECT * FROM rep_anom
  UNION ALL
  SELECT * FROM member_anom
)
SELECT
  u.`业务日期`, u.`粒度`,
  u.`门店ID`, u.`门店名称`, u.`门店类型`, u.`城市`,
  d.`店长姓名`, d.`区域经理`,
  u.`异常来源`, u.`异常类型`, u.`异常详情`, u.`风险等级`,
  -- 豁免是打标不是删除：豁免行保留在清单中可审计「本来命中了什么、为什么被豁免」
  CASE
    WHEN e.`豁免原因` IS NOT NULL THEN e.`豁免原因`
    WHEN d.`是否90天内新店` = 'TRUE' THEN '新店爬坡观察'
    ELSE NULL
  END AS `豁免标记`,
  CASE
    WHEN e.`豁免原因` IS NOT NULL THEN '豁免观察'
    WHEN d.`是否90天内新店` = 'TRUE' THEN '豁免观察'
    ELSE '需处理'
  END AS `处理状态`,
  u.`建议动作`
FROM unioned u
LEFT JOIN dim_cur d ON u.`门店ID` = d.`门店ID`
-- 豁免日历为窄表（店型×月份一行一档）：规避 CSV 导入对 "1,2,7,8" 的数字类型推断，
-- join 直接数字对数字，豁免规则走数据变更不走代码发布
LEFT JOIN input5 e ON u.`门店类型` = e.`门店类型` AND MONTH(u.`业务日期`) = CAST(e.`豁免月份` AS INT)

```


### 节点8
- Id: id_1001
- Name: ads_门店每日指挥台
- Type: INPUT_DATASET
- **Used By (Outputs):**
  - id_2001 (四路异常合流归因)
- Position: (100,100)
- InputDsId: nd177a0ac0eda44ac98c75bc
- DisplayType: CSV
- 等价SQL:
```sql
SELECT * FROM input
```


---

## 血缘关系

### 上游资源 (6)
- **ads_单店利润健康** (DATA_SET_ETL)
  - ID: p39cc9d0866ac442bb777c63
- **dim_门店主档** (DATA_SET_FILE)
  - ID: sedfdd84abacc4cb496c15e7
- **ads_门店每日指挥台** (DATA_SET_ETL)
  - ID: nd177a0ac0eda44ac98c75bc
- **dws_体验口碑汇总** (DATA_SET_ETL)
  - ID: g52a667122e214eefb542bf6
- **param_会员生命周期阈值** (DATA_SET_FILE)
  - ID: jc8be722fd6cb49fa87206f0
- **param_豁免日历** (DATA_SET_FILE)
  - ID: idc628b87ed3a4f1d91e5e1c

### 下游资源 (1)
- **ads_异常归因清单** (DATA_SET_ETL)
  - ID: tf166544dfa5b407593e22ec
