-- Restore order-side member-card distinct counting, without new channel/registration restrictions.
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
SELECT s.`门店名称`,f.`订单日期`,COUNT(DISTINCT f.`会员卡号`) AS `消费会员数`,
 date_sub(current_date(),1) AS `统计截止日`,current_timestamp() AS `专供更新时间`,s.`门店编号`
FROM facts f JOIN stores s ON f.store_code=s.`门店编号`
WHERE f.`会员卡号` IS NOT NULL AND f.`会员卡号` <> ''
GROUP BY s.`门店编号`,s.`门店名称`,f.`订单日期`
