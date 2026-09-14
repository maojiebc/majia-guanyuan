WITH anchor AS (
 SELECT max(to_date(`订单日期`)) AS end_day FROM input2
 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
), totals AS (
 SELECT n.`门店名称`, sum(CASE WHEN n.`是否会员` IN ('会员','是') THEN coalesce(n.`订单数`,0) ELSE 0 END) AS member_orders,
 sum(coalesce(n.`订单数`,0)) AS total_orders
 FROM input1 n CROSS JOIN anchor a
 WHERE to_date(n.`订单日期`) BETWEEN date_sub(a.end_day,29) AND a.end_day
 GROUP BY n.`门店名称`
) , revenue7 AS (
 SELECT f.`门店名称`, sum(coalesce(f.`income`,0)) AS revenue
 FROM input2 f CROSS JOIN anchor a
 WHERE to_date(f.`订单日期`) BETWEEN date_sub(a.end_day,6) AND a.end_day
 GROUP BY f.`门店名称`
)
SELECT coalesce(t.`门店名称`,f.`门店名称`) AS `门店名称`,
 CASE WHEN t.total_orders > 0 THEN CAST(t.member_orders AS DOUBLE)/t.total_orders ELSE CAST(NULL AS DOUBLE) END AS `近30天会员订单占比`,
 t.member_orders AS `近30天会员订单数`,t.total_orders AS `近30天订单数`,
 date_sub(a.end_day,6) AS `排名开始日`,a.end_day AS `排名截止日`,
 coalesce(f.revenue,0) AS `近7天总营业额`
FROM totals t FULL OUTER JOIN revenue7 f ON t.`门店名称`=f.`门店名称` CROSS JOIN anchor a
