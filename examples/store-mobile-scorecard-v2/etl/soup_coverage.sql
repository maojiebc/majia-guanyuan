-- 用同源完成订单作分母，按订单去重；不把多个口味的计数直接相加。
WITH coverage AS (
 SELECT o.`门店名称`,o.`取餐方式`,COUNT(DISTINCT o.`订单号`) AS total_orders,
 COUNT(DISTINCT CASE WHEN o.`口味` IS NOT NULL AND TRIM(o.`口味`) NOT IN ('','未识别','未命名','未知','null') THEN o.`订单号` END) AS soup_orders
 FROM input1 o LEFT SEMI JOIN input2 a ON o.`门店名称`=a.`门店名称`
 WHERE to_date(o.`订单日期`) BETWEEN date_sub(current_date(),7) AND date_sub(current_date(),1)
 AND o.`订单状态`='订单完成' AND o.`取餐方式` IN ('堂食','外卖')
 AND o.`订单号` IS NOT NULL AND TRIM(o.`订单号`)<>''
 GROUP BY o.`门店名称`,o.`取餐方式`
)
SELECT `门店名称`,
 MAX(CASE WHEN `取餐方式`='堂食' THEN total_orders ELSE 0 END) AS `堂食汤底订单基数`,
 MAX(CASE WHEN `取餐方式`='堂食' THEN soup_orders ELSE 0 END) AS `堂食有效汤底订单`,
 MAX(CASE WHEN `取餐方式`='外卖' THEN total_orders ELSE 0 END) AS `外卖汤底订单基数`,
 MAX(CASE WHEN `取餐方式`='外卖' THEN soup_orders ELSE 0 END) AS `外卖有效汤底订单`
FROM coverage GROUP BY `门店名称`
