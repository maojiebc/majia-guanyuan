-- Restore original period-distinct card count from order details.
WITH stores AS (
 SELECT trim(cast(`门店编号` AS STRING)) AS `门店编号`, MAX(`门店名称`) AS `门店名称`
 FROM input2 WHERE trim(cast(`门店编号` AS STRING)) <> ''
 GROUP BY trim(cast(`门店编号` AS STRING))
), facts AS (
 SELECT f.*,trim(cast(f.`门店编号` AS STRING)) AS store_code
 FROM input1 f
 WHERE to_date(f.`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
 AND (trim(cast(f.`门店编号` AS STRING)) <> 'DEMO_NEW_STORE' OR to_date(f.`订单日期`) >= DATE '2026-03-19')
)
SELECT s.`门店名称`,COUNT(DISTINCT CASE WHEN to_date(f.`订单日期`) BETWEEN trunc(current_date(),'MM') AND date_sub(current_date(),1)
 AND f.`会员卡号` IS NOT NULL AND f.`会员卡号` <> '' THEN f.`会员卡号` END) AS `消费会员_本月`,
 date_sub(current_date(),1) AS `统计截止日`,current_timestamp() AS `专供更新时间`,s.`门店编号`
FROM stores s LEFT JOIN facts f ON s.`门店编号`=f.store_code
GROUP BY s.`门店编号`,s.`门店名称`
