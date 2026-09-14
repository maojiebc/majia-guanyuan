SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `入群日期` AS `入群日期`,
  COUNT(DISTINCT `外部联系人id`) AS `入群人数`
FROM input1
WHERE to_date(`入群日期`) BETWEEN date_sub(current_date(), 70) AND date_sub(current_date(), 1)
GROUP BY `门店名称`, `入群日期`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
