SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `最后一单门店名称` AS `门店名称`,
  `顾客状态` AS `顾客状态`,
  `是否会员` AS `是否会员`,
  COUNT(DISTINCT `顾客标识`) AS `顾客数`
FROM input1
GROUP BY `最后一单门店名称`, `顾客状态`, `是否会员`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
