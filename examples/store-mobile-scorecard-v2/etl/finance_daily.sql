-- Only mobile dashboard finance is filtered. Source accounting records remain unchanged.
-- Confirmed opening takes precedence; other stores only lose leading, all-channel
-- micro-test days (1-2 orders, 0-2 yuan total) before their first non-test day.
WITH opening_daily AS (
 SELECT f.`门店名称`, to_date(f.`订单日期`) AS day,
        SUM(coalesce(f.`income`,0)) AS revenue,
        SUM(coalesce(f.`订单数`,0)) AS orders,
        MIN(coalesce(f.`income`,0)) AS min_revenue,
        MIN(coalesce(f.`订单数`,0)) AS min_orders
 FROM input1 f
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
SELECT f.* FROM input1 f
LEFT ANTI JOIN opening_excluded e ON f.`门店名称`=e.`门店名称` AND to_date(f.`订单日期`)=e.day
WHERE NOT (f.`门店名称`='示例重新开业店' AND to_date(f.`订单日期`)<DATE '2026-03-19')
)
SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `订单日期` AS `订单日期`,
  `取餐方式` AS `取餐方式`,
  `渠道名称` AS `渠道名称`,
  SUM(`income`) AS `营业额`,
  SUM(`订单数`) AS `订单数`,
  MAX(`同步时间`) AS `同步时间`
FROM finance_clean
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 70) AND date_sub(current_date(), 1)
GROUP BY `门店名称`, `订单日期`, `取餐方式`, `渠道名称`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
