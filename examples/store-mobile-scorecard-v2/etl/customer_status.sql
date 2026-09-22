-- Store code is the sole identity key. Names are display labels only.
WITH store_map AS (
 SELECT trim(CAST(`门店编号` AS STRING)) AS store_id, MAX(`门店名称`) AS store_name
 FROM input2
 WHERE `门店编号` IS NOT NULL AND trim(CAST(`门店编号` AS STRING))<>''
 GROUP BY trim(CAST(`门店编号` AS STRING))
 HAVING COUNT(DISTINCT `门店名称`)=1
), current_stores AS (
 SELECT * FROM store_map
), customer_base AS (
 SELECT s.store_id,s.store_name,c.`顾客标识`,c.`是否会员`,c.`顾客状态`,c.`最后一单距今天数`
 FROM input1 c JOIN current_stores s ON trim(CAST(c.`最后一单门店编号` AS STRING))=s.store_id
 WHERE s.store_id<>'DEMO_NEW_STORE' OR c.`最后一单距今天数`<=datediff(date_sub(current_date(),1),DATE '2026-03-19')
), finance_daily AS (
 SELECT trim(CAST(f.`门店编号` AS STRING)) AS store_id,to_date(f.`订单日期`) AS day,
        SUM(coalesce(f.`income`,0)) AS revenue,SUM(coalesce(f.`订单数`,0)) AS orders
 FROM input3 f JOIN current_stores s ON trim(CAST(f.`门店编号` AS STRING))=s.store_id
 WHERE to_date(f.`订单日期`)<=date_sub(current_date(),1)
   AND (s.store_id<>'DEMO_NEW_STORE' OR to_date(f.`订单日期`)>=DATE '2026-03-19')
 GROUP BY trim(CAST(f.`门店编号` AS STRING)),to_date(f.`订单日期`)
), first_finance AS (
 SELECT store_id,MIN(day) AS first_day FROM finance_daily
 WHERE revenue>2 OR orders>2 GROUP BY store_id
), first_customer AS (
 SELECT store_id,date_sub(date_sub(current_date(),1),CAST(MAX(`最后一单距今天数`) AS INT)) AS first_day
 FROM customer_base WHERE `最后一单距今天数`>=0 GROUP BY store_id
), observed AS (
 SELECT s.store_id,s.store_name,least(f.first_day,c.first_day) AS first_day
 FROM current_stores s LEFT JOIN first_finance f ON s.store_id=f.store_id
 LEFT JOIN first_customer c ON s.store_id=c.store_id
)
SELECT o.store_name AS `门店名称`,
       coalesce(c.`顾客状态`,'暂无可核验顾客') AS `顾客状态`,
       c.`是否会员` AS `是否会员`,COUNT(DISTINCT c.`顾客标识`) AS `顾客数`,
       date_sub(current_date(),1) AS `统计截止日`,current_timestamp() AS `专供更新时间`,
       o.store_id AS `门店编号`,o.first_day AS `顾客观察开始日`
FROM observed o LEFT JOIN customer_base c ON o.store_id=c.store_id
GROUP BY o.store_id,o.store_name,o.first_day,c.`顾客状态`,c.`是否会员`
