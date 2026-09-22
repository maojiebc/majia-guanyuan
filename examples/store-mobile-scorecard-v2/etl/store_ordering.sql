-- Only mobile dashboard finance is filtered. Source accounting records remain unchanged.
-- Confirmed opening takes precedence; other stores only lose leading, all-channel
-- micro-test days (1-2 orders, 0-2 yuan total) before their first non-test day.
WITH opening_daily AS (
 SELECT f.`门店名称`, to_date(f.`订单日期`) AS day,
        SUM(coalesce(f.`income`,0)) AS revenue,
        SUM(coalesce(f.`订单数`,0)) AS orders,
        MIN(coalesce(f.`income`,0)) AS min_revenue,
        MIN(coalesce(f.`订单数`,0)) AS min_orders
 FROM input2 f
 WHERE to_date(f.`订单日期`) <= date_sub(current_date(),1)
 GROUP BY f.`门店名称`,to_date(f.`订单日期`)
), opening_classified AS (
 SELECT *, CASE WHEN orders BETWEEN 1 AND 2 AND revenue BETWEEN 0 AND 2
                      AND min_revenue>=0 AND min_orders>=0 THEN 1 ELSE 0 END AS micro_test
 FROM opening_daily
), opening_first_business AS (
 SELECT `门店名称`,MIN(CASE WHEN micro_test=0 AND (orders<>0 OR revenue<>0) THEN day END) AS first_day
 FROM opening_classified GROUP BY `门店名称`
), opening_excluded AS (
 SELECT d.`门店名称`,d.day
 FROM opening_classified d JOIN opening_first_business b ON d.`门店名称`=b.`门店名称`
 WHERE d.micro_test=1 AND (b.first_day IS NULL OR d.day<b.first_day)
), finance_clean AS (
SELECT f.* FROM input2 f
LEFT ANTI JOIN opening_excluded e ON f.`门店名称`=e.`门店名称` AND to_date(f.`订单日期`)=e.day
WHERE NOT (f.`门店名称`='示例重新开业店' AND to_date(f.`订单日期`)<DATE '2026-03-19')
), anchor AS (
 SELECT max(to_date(`订单日期`)) AS end_day FROM finance_clean
 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
), totals AS (
 SELECT n.`门店名称`, sum(CASE WHEN n.`是否会员` IN ('会员','是') THEN coalesce(n.`订单数`,0) ELSE 0 END) AS member_orders,
 sum(coalesce(n.`订单数`,0)) AS total_orders
 FROM input1 n CROSS JOIN anchor a
 WHERE to_date(n.`订单日期`) BETWEEN date_sub(a.end_day,29) AND a.end_day
 GROUP BY n.`门店名称`
) , revenue7 AS (
 SELECT f.`门店名称`, sum(coalesce(f.`income`,0)) AS revenue
 FROM finance_clean f CROSS JOIN anchor a
 WHERE to_date(f.`订单日期`) BETWEEN date_sub(a.end_day,6) AND a.end_day
 GROUP BY f.`门店名称`
)
SELECT coalesce(t.`门店名称`,f.`门店名称`) AS `门店名称`,
 CASE WHEN t.total_orders > 0 THEN CAST(t.member_orders AS DOUBLE)/t.total_orders ELSE CAST(NULL AS DOUBLE) END AS `近30天会员订单占比`,
 t.member_orders AS `近30天会员订单数`,t.total_orders AS `近30天订单数`,
 date_sub(a.end_day,6) AS `排名开始日`,a.end_day AS `排名截止日`,
 coalesce(f.revenue,0) AS `近7天总营业额`
FROM totals t FULL OUTER JOIN revenue7 f ON t.`门店名称`=f.`门店名称` CROSS JOIN anchor a
