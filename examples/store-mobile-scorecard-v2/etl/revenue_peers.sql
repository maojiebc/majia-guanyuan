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
SELECT v.`门店名称`, v.`分公司`, v.`地理城市`, s.`门店类型`,
       v.`营业额`, v.`订单数`, v.`营业天数`, v.`统计截止日`, v.`专供更新时间`
FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `分公司` AS `分公司`,
  `地理城市` AS `地理城市`,
  SUM(`income`) AS `营业额`,
  SUM(`订单数`) AS `订单数`,
  (count(distinct (CONCAT(`门店编号`,'_',`订单日期`)))) AS `营业天数`
FROM finance_clean
WHERE `加盟状态` IN ('运营客户')
  AND to_date(`订单日期`) BETWEEN date_sub(current_date(), 7) AND date_sub(current_date(), 1)
GROUP BY `门店名称`, `分公司`, `地理城市`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`

LEFT JOIN (
  SELECT `门店名称`,
         CASE WHEN COUNT(DISTINCT CASE WHEN TRIM(`门店类型`) <> '' AND LOWER(TRIM(`门店类型`)) NOT IN ('null', 'undefined') THEN TRIM(`门店类型`) END) = 1
              THEN MAX(CASE WHEN TRIM(`门店类型`) <> '' AND LOWER(TRIM(`门店类型`)) NOT IN ('null', 'undefined') THEN TRIM(`门店类型`) END)
              ELSE CAST(NULL AS STRING) END AS `门店类型`
  FROM input3
  GROUP BY `门店名称`
) s ON v.`门店名称` = s.`门店名称`
