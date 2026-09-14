-- 自动更新：只输出门店/日/券种聚合；订单号、券号不下发前端。
-- 券日志中的金额属于整单。叠券按券种展示关联整单金额，合计独立按订单去重。
WITH coupon_rows AS (
 SELECT c.`核销门店名称` AS store, c.`券号` AS voucher,
 COALESCE(NULLIF(TRIM(c.`券类型名称`),''),'未命名券') AS coupon,
 NULLIF(TRIM(c.`订单号`),'') AS order_id, TO_DATE(c.`核销日期`) AS day,
 c.`总金额` AS gross, c.`实付金额` AS paid, c.`抵扣金额` AS discount
 FROM input1 c LEFT SEMI JOIN input2 a ON c.`核销门店名称`=a.`门店名称`
 WHERE TO_DATE(c.`核销日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
 AND NOT contains(COALESCE(c.`券类型名称`,''),'测试')
 AND c.`券号` IS NOT NULL AND TRIM(c.`券号`)<>''
), coupons AS (
 SELECT *,CASE WHEN order_id IS NOT NULL THEN CONCAT('o:',order_id) ELSE CONCAT('v:',voucher) END AS order_key
 FROM coupon_rows
), order_keys AS (
 SELECT store,order_key,MAX(order_id) AS order_id,MAX(day) AS day,
 COUNT(DISTINCT voucher) AS vouchers,COUNT(DISTINCT coupon) AS types,
 MAX(gross) AS gross,MAX(paid) AS paid,MAX(discount) AS discount,
 CASE WHEN COUNT(gross)=COUNT(*) AND COUNT(paid)=COUNT(*) AND COUNT(discount)=COUNT(*)
 AND MAX(gross)-MIN(gross)<0.02 AND MAX(paid)-MIN(paid)<0.02 AND MAX(discount)-MIN(discount)<0.02
 THEN 1 ELSE 0 END AS log_consistent
 FROM coupons GROUP BY store,order_key
), pos AS (
 SELECT o.`门店名称` AS store,TRIM(o.`订单号`) AS order_id,
 MAX(CASE WHEN o.`订单状态`='订单完成' THEN 1 ELSE 0 END) AS completed,
 MAX(CASE WHEN COALESCE(o.`订单状态`,'')<>'订单完成' THEN 1 ELSE 0 END) AS non_completed,
 MAX(CASE WHEN CONCAT(COALESCE(o.`支付方式`,''),' ',COALESCE(o.`支付大类`,'')) RLIKE '券|福利|兑换|积分' THEN 1 ELSE 0 END) AS coupon_payment,
 MAX(o.`total_实付`) AS paid,MIN(o.`total_实付`) AS min_paid,
 COUNT(o.`total_实付`) AS paid_rows,COUNT(*) AS rows_n
 FROM input3 o JOIN order_keys k ON o.`门店名称`=k.store AND TRIM(o.`订单号`)=k.order_id
 WHERE TO_DATE(o.`订单日期`) BETWEEN date_sub(current_date(),71) AND date_sub(current_date(),1)
 GROUP BY o.`门店名称`,TRIM(o.`订单号`)
), checked AS (
 SELECT k.*,CASE
 WHEN k.order_id IS NULL OR p.order_id IS NULL THEN 'unmatched'
 WHEN p.completed<>1 OR p.non_completed=1 THEN 'closed'
 WHEN p.coupon_payment=1 THEN 'payment'
 WHEN k.log_consistent<>1 OR k.gross<=0 OR k.paid<0 OR k.discount<0
 OR ABS(k.gross-k.paid-k.discount)>0.05
 OR p.paid_rows<>p.rows_n OR p.paid-p.min_paid>=0.02 OR ABS(p.paid-k.paid)>0.05
 THEN 'invalid' ELSE 'valid' END AS amount_state
 FROM order_keys k LEFT JOIN pos p ON k.store=p.store AND k.order_id=p.order_id
), type_keys AS (
 SELECT store,order_key,coupon,COUNT(DISTINCT voucher) AS vouchers
 FROM coupons GROUP BY store,order_key,coupon
), measure_rows AS (
 SELECT k.*,t.coupon,t.vouchers AS type_vouchers,'type' AS row_kind
 FROM checked k JOIN type_keys t ON k.store=t.store AND k.order_key=t.order_key
 UNION ALL
 SELECT k.*,CAST(NULL AS STRING) AS coupon,k.vouchers AS type_vouchers,'total' AS row_kind FROM checked k
), daily AS (
 SELECT store,day,coupon,row_kind,SUM(type_vouchers) AS vouchers,
 SUM(CASE WHEN order_id IS NOT NULL THEN 1 ELSE 0 END) AS orders,
 SUM(CASE WHEN amount_state='valid' THEN 1 ELSE 0 END) AS valid,
 SUM(CASE WHEN amount_state='valid' THEN paid ELSE 0 END) AS paid,
 SUM(CASE WHEN amount_state='valid' THEN gross ELSE 0 END) AS gross,
 SUM(CASE WHEN amount_state='valid' THEN discount ELSE 0 END) AS discount,
 SUM(CASE WHEN amount_state='payment' THEN 1 ELSE 0 END) AS payment,
 SUM(CASE WHEN amount_state='unmatched' THEN type_vouchers ELSE 0 END) AS unmatched,
 SUM(CASE WHEN amount_state='invalid' THEN 1 ELSE 0 END) AS invalid,
 SUM(CASE WHEN amount_state='closed' THEN 1 ELSE 0 END) AS closed,
 SUM(CASE WHEN amount_state<>'valid' THEN type_vouchers ELSE 0 END) AS pending_vouchers,
 SUM(CASE WHEN types>1 THEN 1 ELSE 0 END) AS stacked
 FROM measure_rows GROUP BY store,day,coupon,row_kind
), daily_types AS (
 SELECT *,ROW_NUMBER() OVER(PARTITION BY store,day ORDER BY coupon) AS rn FROM daily WHERE row_kind='type'
)
SELECT d.store AS `门店名称`,d.coupon AS `券类型名称`,d.day AS `核销日期`,d.vouchers AS `核销券数`,
 date_sub(current_date(),1) AS `统计截止日`,current_timestamp() AS `专供更新时间`,
 TO_JSON(NAMED_STRUCT('version',1,'orders',d.orders,'valid',d.valid,'paid',ROUND(d.paid,2),
 'gross',ROUND(d.gross,2),'discount',ROUND(d.discount,2),'payment',d.payment,'unmatched',d.unmatched,
 'invalid',d.invalid,'closed',d.closed,'pending_vouchers',d.pending_vouchers,'stacked',d.stacked,
 'total',CASE WHEN d.rn=1 THEN NAMED_STRUCT('vouchers',t.vouchers,'orders',t.orders,'valid',t.valid,
 'paid',ROUND(t.paid,2),'gross',ROUND(t.gross,2),'discount',ROUND(t.discount,2),
 'payment',t.payment,'unmatched',t.unmatched,'invalid',t.invalid,'closed',t.closed,
 'pending_vouchers',t.pending_vouchers,'stacked',t.stacked) END)) AS `转化明细`
FROM daily_types d JOIN daily t ON d.store=t.store AND d.day=t.day AND t.row_kind='total'
