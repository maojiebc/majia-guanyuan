SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `是否会员` AS `是否会员`,
  `复购状态` AS `复购状态`,
  SUM(`顾客数`) AS `顾客数`,
  SUM(`顾客第一单数`) AS `首单顾客数`
FROM input1
GROUP BY `门店名称`, `是否会员`, `复购状态`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
