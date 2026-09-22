-- New metric only. Existing member frequency, counts, revenue and new/old customer calculations are untouched.
WITH stores AS (
 SELECT trim(cast(`门店编号` AS STRING)) AS store_id,MAX(`门店类型`) AS store_type,MAX(`加盟状态`) AS operation
 FROM input2 WHERE trim(cast(`门店编号` AS STRING))<>'' GROUP BY trim(cast(`门店编号` AS STRING))
), observation AS (
 SELECT trim(cast(`门店编号` AS STRING)) AS store_id,MIN(to_date(`顾客观察开始日`)) AS first_day
 FROM input3 GROUP BY trim(cast(`门店编号` AS STRING))
), customers AS (
 SELECT trim(cast(`门店编号` AS STRING)) AS store_id,trim(`顾客标识`) AS customer_id,
 MAX(CASE WHEN `是否会员` IN ('会员','是') THEN 1 ELSE 0 END) AS is_member,
 COUNT(DISTINCT to_date(`订单日期`)) AS visit_days
 FROM input1
 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),30) AND date_sub(current_date(),1)
 AND `渠道名称`='POS' AND trim(`顾客标识`)<>'' AND `标识分类`<>'未知'
 AND trim(cast(`门店编号` AS STRING))<>'' AND trim(`订单号`)<>''
 AND `income_应收`>0 AND coalesce(`订单产品`,'')<>'示例排除商品'
 AND (trim(cast(`门店编号` AS STRING))<>'DEMO_NEW_STORE' OR to_date(`订单日期`)>=DATE '2026-03-19')
 GROUP BY trim(cast(`门店编号` AS STRING)),trim(`顾客标识`)
), totals AS (
 SELECT store_id,is_member,COUNT(*) AS people,SUM(CASE WHEN visit_days>=2 THEN 1 ELSE 0 END) AS repeat_people
 FROM customers GROUP BY store_id,is_member
), groups AS (SELECT 1 AS is_member UNION ALL SELECT 0 AS is_member), stats AS (
 SELECT s.store_id,s.store_type,s.operation,g.is_member,coalesce(t.people,0) AS people,coalesce(t.repeat_people,0) AS repeat_people,
 datediff(date_sub(current_date(),1),o.first_day)+1 AS observed_days
 FROM stores s CROSS JOIN groups g LEFT JOIN totals t ON s.store_id=t.store_id AND g.is_member=t.is_member
 LEFT JOIN observation o ON s.store_id=o.store_id
)
SELECT store_id AS `门店编号`,store_type AS `门店类型`,is_member AS `会员分组`,people AS `堂食顾客数`,repeat_people AS `堂食复购顾客数`,
 observed_days AS `堂食复购观察天数`,date_sub(current_date(),30) AS `堂食复购开始日`,date_sub(current_date(),1) AS `堂食复购截止日`,
 CASE WHEN observed_days>=30 AND people>0 THEN CAST(repeat_people AS DOUBLE)/people END AS `堂食复购率`,
 CASE WHEN observed_days IS NULL OR observed_days<30 THEN '观察期不足'
 WHEN people=0 THEN '暂无顾客' WHEN people<50 THEN '样本不足'
 WHEN operation IS NULL OR operation<>'运营客户' THEN '非运营门店'
 WHEN store_type IS NULL OR trim(store_type)='' THEN '店型缺失' ELSE '可对比' END AS `堂食复购参评状态`
FROM stats
