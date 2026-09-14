WITH repeated AS (
 SELECT `门店名称`,customer_id,'同额高额订单重复' AS kind,amount AS unit_amount,
 COUNT(*) AS orders_n,COUNT(DISTINCT order_day) AS days_n,SUM(amount) AS amount,
 MAX(member_revenue) AS member_revenue,MAX(threshold) AS threshold,
 SUM(CASE WHEN cash_record=1 THEN amount ELSE 0 END)/SUM(amount) AS cash_share,
 CONCAT_WS('、',SORT_ARRAY(COLLECT_SET(payment))) AS payment,
 CASE WHEN COUNT(DISTINCT product)=1 THEN MAX(product) ELSE '多项商品' END AS product
 FROM input1 GROUP BY `门店名称`,customer_id,amount
 HAVING COUNT(*)>=3 AND COUNT(DISTINCT order_day)>=2 AND SUM(amount)>=1000 AND SUM(amount)/MAX(member_revenue)>=0.2
), concentrated AS (
 SELECT `门店名称`,customer_id,'高额订单集中于同一会员' AS kind,CAST(NULL AS DOUBLE) AS unit_amount,
 COUNT(*) AS orders_n,COUNT(DISTINCT order_day) AS days_n,SUM(amount) AS amount,
 MAX(member_revenue) AS member_revenue,MAX(threshold) AS threshold,
 SUM(CASE WHEN cash_record=1 THEN amount ELSE 0 END)/SUM(amount) AS cash_share,
 CONCAT_WS('、',SORT_ARRAY(COLLECT_SET(payment))) AS payment,
 CASE WHEN COUNT(DISTINCT product)=1 THEN MAX(product) ELSE '多项商品' END AS product
 FROM input1 GROUP BY `门店名称`,customer_id
 HAVING COUNT(*)>=3 AND COUNT(DISTINCT order_day)>=2 AND SUM(amount)>=1000 AND SUM(amount)/MAX(member_revenue)>=0.2
), candidates AS (
 SELECT * FROM repeated UNION ALL SELECT * FROM concentrated
), ranked AS (
 SELECT *,ROW_NUMBER() OVER(PARTITION BY `门店名称` ORDER BY amount DESC,CASE WHEN unit_amount IS NOT NULL THEN 0 ELSE 1 END,orders_n DESC,customer_id) AS rn
 FROM candidates
)
SELECT `门店名称`,TO_JSON(NAMED_STRUCT(
 'version',1,'kind',kind,'orders',orders_n,'days',days_n,'amount',amount,
 'share',amount/member_revenue,'unit',unit_amount,'threshold',threshold,
 'cash_share',cash_share,'payment',payment,'product',product,
 'start',date_sub(current_date(),30),'end',date_sub(current_date(),1)
)) AS `会员异常诊断`
FROM ranked WHERE rn=1
