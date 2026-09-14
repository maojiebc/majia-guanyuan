SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `订单日期` AS `订单日期`,
  (CASE
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('6点','7点','8点','9点') THEN '早餐'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('10点','11点','12点','13点') THEN '午餐'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('14点','15点','16点') THEN '下午茶'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('17点','18点','19点','20点') THEN '晚餐'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('21点','22点','23点','24点','0点','1点','2点','3点','4点','5点') THEN '宵夜'
  ELSE '其他'
END) AS `下单时段`,
  `取餐方式` AS `取餐方式`,
  COUNT(DISTINCT `订单号`) AS `订单数`,
  SUM(`income_应收`) AS `营业额`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 16) AND date_sub(current_date(), 1)
GROUP BY `门店名称`, `订单日期`, (CASE
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('6点','7点','8点','9点') THEN '早餐'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('10点','11点','12点','13点') THEN '午餐'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('14点','15点','16点') THEN '下午茶'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('17点','18点','19点','20点') THEN '晚餐'
  WHEN (CONCAT(HOUR(`下单时间`), '点')) IN ('21点','22点','23点','24点','0点','1点','2点','3点','4点','5点') THEN '宵夜'
  ELSE '其他'
END), `取餐方式`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
