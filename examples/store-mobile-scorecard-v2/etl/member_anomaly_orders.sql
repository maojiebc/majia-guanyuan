-- 仅在专供链路内处理订单级证据；会员身份和订单号不输出到页面。
WITH baseline AS (
 SELECT `门店名称`,
 MAX(CASE WHEN `是否会员` IN ('是','会员') THEN `营收贡献` END) AS member_revenue,
 MAX(CASE WHEN `是否会员` IN ('否','非会员') AND `订单数`>0 THEN `营收贡献`/`订单数` END) AS non_aov
 FROM input2 GROUP BY `门店名称`
), orders AS (
 SELECT o.`门店名称`,o.`订单号`,MAX(o.`顾客标识`) AS customer_id,
 MAX(to_date(o.`订单日期`)) AS order_day,ROUND(MAX(o.`income_应收`),2) AS amount,
 MAX(CASE WHEN CONCAT(COALESCE(o.`支付方式`,''),' ',COALESCE(o.`支付大类`,'')) LIKE '%现金%' THEN 1 ELSE 0 END) AS cash_record,
 CONCAT_WS('、',SORT_ARRAY(COLLECT_SET(COALESCE(NULLIF(TRIM(o.`支付方式`),''),NULLIF(TRIM(o.`支付大类`),''),'未标记')))) AS payment,
 CASE WHEN COUNT(DISTINCT o.`订单产品`)=1 THEN SUBSTRING(MAX(o.`订单产品`),1,24) ELSE '多项商品' END AS product,
 MAX(b.member_revenue) AS member_revenue,
 MAX(GREATEST(200.0,5.0*COALESCE(b.non_aov,0))) AS threshold
 FROM input1 o JOIN baseline b ON o.`门店名称`=b.`门店名称`
 WHERE to_date(o.`订单日期`) BETWEEN date_sub(current_date(),30) AND date_sub(current_date(),1)
 AND o.`渠道名称`='POS' AND o.`订单状态`='订单完成'
 AND o.`是否会员` IN ('是','会员') AND o.`标识分类` NOT IN ('未知')
 AND o.`顾客标识` IS NOT NULL AND TRIM(o.`顾客标识`)<>''
 AND o.`订单号` IS NOT NULL AND TRIM(o.`订单号`)<>''
 AND o.`订单产品`<>'示例排除商品' AND b.member_revenue>0
 AND o.`income_应收`>=GREATEST(200.0,5.0*COALESCE(b.non_aov,0))
 GROUP BY o.`门店名称`,o.`订单号`
 HAVING COUNT(DISTINCT o.`顾客标识`)=1
)
SELECT * FROM orders
