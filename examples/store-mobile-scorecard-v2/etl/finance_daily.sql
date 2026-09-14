SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `订单日期` AS `订单日期`,
  `取餐方式` AS `取餐方式`,
  `渠道名称` AS `渠道名称`,
  SUM(`income`) AS `营业额`,
  SUM(`订单数`) AS `订单数`,
  MAX(`同步时间`) AS `同步时间`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 70) AND date_sub(current_date(), 1)
GROUP BY `门店名称`, `订单日期`, `取餐方式`, `渠道名称`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
