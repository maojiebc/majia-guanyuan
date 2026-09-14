SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `口味` AS `口味`,
  `取餐方式` AS `取餐方式`,
  COUNT(DISTINCT `订单号`) AS `订单数`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 7) AND date_sub(current_date(), 1)
  AND `口味` NOT IN ('未识别')
GROUP BY `门店名称`, `口味`, `取餐方式`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
