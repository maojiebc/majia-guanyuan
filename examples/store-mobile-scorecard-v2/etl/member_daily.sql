SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `订单日期` AS `订单日期`,
  COUNT(DISTINCT `会员卡号`) AS `消费会员数`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 70) AND date_sub(current_date(), 1)
  AND `会员卡号` <> ''
  AND `会员卡号` IS NOT NULL
GROUP BY `门店名称`, `订单日期`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
