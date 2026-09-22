-- Only mobile dashboard finance is filtered. Source accounting records remain unchanged.
-- Confirmed opening takes precedence; other stores only lose leading, all-channel
-- micro-test days (1-2 orders, 0-2 yuan total) before their first non-test day.
WITH opening_daily AS (
 SELECT f.`门店编号`, to_date(f.`订单日期`) AS day,
        SUM(coalesce(f.`income`,0)) AS revenue,
        SUM(coalesce(f.`订单数`,0)) AS orders,
        MIN(coalesce(f.`income`,0)) AS min_revenue,
        MIN(coalesce(f.`订单数`,0)) AS min_orders
 FROM input2 f
 WHERE to_date(f.`订单日期`) <= date_sub(current_date(),1)
 GROUP BY f.`门店编号`,to_date(f.`订单日期`)
), opening_classified AS (
 SELECT *, CASE WHEN orders BETWEEN 1 AND 2 AND revenue BETWEEN 0 AND 2
                      AND min_revenue>=0 AND min_orders>=0 THEN 1 ELSE 0 END AS micro_test
 FROM opening_daily
), opening_first_business AS (
 SELECT `门店编号`,MIN(CASE WHEN micro_test=0 AND (orders<>0 OR revenue<>0) THEN day END) AS first_day
 FROM opening_classified GROUP BY `门店编号`
), opening_excluded AS (
 SELECT d.`门店编号`,d.day
 FROM opening_classified d JOIN opening_first_business b ON d.`门店编号`=b.`门店编号`
 WHERE d.micro_test=1 AND (b.first_day IS NULL OR d.day<b.first_day)
), finance_clean AS (
SELECT f.* FROM input2 f
LEFT ANTI JOIN opening_excluded e ON f.`门店编号`=e.`门店编号` AND to_date(f.`订单日期`)=e.day
WHERE NOT (f.`门店编号`='DEMO_NEW_STORE' AND to_date(f.`订单日期`)<DATE '2026-03-19')
), params AS (
 SELECT 300 AS min_orders, 21 AS min_days, 0.80 AS min_coverage
), anchor AS (
 SELECT least(n.d,f.d) AS end_day FROM
 (SELECT max(to_date(`订单日期`)) d FROM input1 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)) n
 CROSS JOIN
 (SELECT max(to_date(`订单日期`)) d FROM finance_clean WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)) f
), nd AS (
 SELECT n.`门店编号`,to_date(n.`订单日期`) day,
 SUM(coalesce(n.`订单数`,0)) orders,
 SUM(CASE WHEN n.`是否会员` IN ('会员','是') THEN coalesce(n.`订单数`,0) ELSE 0 END) members,
 SUM(CASE WHEN n.`是否会员` IS NULL OR n.`是否会员` NOT IN ('会员','是','非会员','否') OR coalesce(n.`订单数`,0)<0 THEN 1 ELSE 0 END) bad
 FROM input1 n CROSS JOIN anchor a
 WHERE to_date(n.`订单日期`) BETWEEN date_sub(a.end_day,59) AND a.end_day
 GROUP BY n.`门店编号`,to_date(n.`订单日期`)
), fd AS (
 SELECT f.`门店编号`,to_date(f.`订单日期`) day,SUM(coalesce(f.`订单数`,0)) orders
 FROM finance_clean f CROSS JOIN anchor a
 WHERE to_date(f.`订单日期`) BETWEEN date_sub(a.end_day,59) AND a.end_day AND f.`渠道名称`='POS'
 GROUP BY f.`门店编号`,to_date(f.`订单日期`)
), daily AS (
 SELECT coalesce(n.`门店编号`,f.`门店编号`) store,coalesce(n.day,f.day) day,
 coalesce(n.orders,0) orders,coalesce(n.members,0) members,coalesce(n.bad,0) bad,
 coalesce(f.orders,0) pos_orders,CASE WHEN f.orders>0 AND coalesce(n.orders,0)=0 THEN 1 ELSE 0 END missing
 FROM nd n FULL OUTER JOIN fd f ON n.`门店编号`=f.`门店编号` AND n.day=f.day
), periods AS (
 SELECT d.store,CASE WHEN d.day>=date_sub(a.end_day,29) THEN 'current' ELSE 'previous' END period,
 SUM(d.orders) orders,SUM(d.members) members,SUM(d.pos_orders) pos_orders,
 SUM(CASE WHEN d.orders>0 THEN 1 ELSE 0 END) days,SUM(d.missing) missing,SUM(d.bad) bad
 FROM daily d CROSS JOIN anchor a GROUP BY d.store,CASE WHEN d.day>=date_sub(a.end_day,29) THEN 'current' ELSE 'previous' END
), quality AS (
 SELECT p.*,CASE WHEN p.orders>0 THEN CAST(p.members AS DOUBLE)/p.orders END ratio,
 CASE WHEN p.pos_orders>0 THEN CAST(p.orders AS DOUBLE)/p.pos_orders END coverage,
 CASE WHEN p.orders<=0 THEN '暂无会员对比订单'
 WHEN p.bad>0 OR p.members<0 OR p.members>p.orders THEN '会员标记异常'
 WHEN p.orders<c.min_orders THEN '订单不足300单'
 WHEN p.days<c.min_days THEN '有订单日期不足21天'
 WHEN p.missing>0 THEN '顾客数据存在缺失日期'
 WHEN p.pos_orders<=0 THEN '缺少POS订单校验'
 WHEN CAST(p.orders AS DOUBLE)/p.pos_orders<c.min_coverage THEN '顾客识别覆盖不足80%'
 WHEN CAST(p.orders AS DOUBLE)/p.pos_orders>1.05 THEN '订单口径待核对'
 ELSE '可参评' END status
 FROM periods p CROSS JOIN params c
), stores AS (
 SELECT trim(cast(s.`门店编号` AS STRING)) AS `门店编号`,max(s.`门店名称`) AS `门店名称`,max(s.`分公司`) branch,max(s.`地理城市`) city,max(s.`门店类型`) store_type,max(s.`加盟状态`) operation
 FROM input3 s
 GROUP BY trim(cast(s.`门店编号` AS STRING)) HAVING COUNT(DISTINCT s.`门店名称`) = 1
)
SELECT s.`门店编号`,s.`门店名称`,s.branch AS `分公司`,s.city AS `地理城市`,s.store_type AS `门店类型`,
 date_sub(a.end_day,29) AS `会员对比开始日`,a.end_day AS `会员对比截止日`,
 c.ratio AS `会员对比占比`,coalesce(c.orders,0) AS `会员对比订单数`,coalesce(c.members,0) AS `会员对比会员订单数`,
 coalesce(c.days,0) AS `会员对比有效天数`,coalesce(c.missing,0) AS `会员对比缺失天数`,c.coverage AS `会员对比识别覆盖率`,
 CASE WHEN s.operation IS NULL OR s.operation<>'运营客户' THEN '非运营门店' ELSE coalesce(c.status,'暂无会员对比订单') END AS `会员对比状态`,
 p.ratio AS `会员对比前期占比`,coalesce(p.status,'暂无前30天订单') AS `会员对比前期状态`,
 CASE WHEN c.status='可参评' AND p.status='可参评' THEN c.ratio-p.ratio END AS `会员对比变化`
FROM stores s CROSS JOIN anchor a
LEFT JOIN quality c ON s.`门店编号`=c.store AND c.period='current'
LEFT JOIN quality p ON s.`门店编号`=p.store AND p.period='previous'
