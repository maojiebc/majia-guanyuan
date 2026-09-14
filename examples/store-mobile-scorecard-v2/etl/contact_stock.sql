SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
WITH aggregated AS (
SELECT
  `门店名称` AS `门店名称`,
  (COUNT(DISTINCT if(`状态`='正常',`外部联系人id`,null))) AS `在联好友`,
  (COUNT(DISTINCT if(`状态`='流失',`外部联系人id`,null))/COUNT(DISTINCT(`外部联系人id`))) AS `流失率`
FROM input1
GROUP BY `门店名称`
), stores AS (SELECT DISTINCT `门店名称` FROM input2)
SELECT
  s.`门店名称`,
  coalesce(a.`在联好友`, 0) AS `在联好友`,
  a.`流失率` AS `流失率`
FROM stores s LEFT JOIN aggregated a ON s.`门店名称` <=> a.`门店名称`
) v
) v
LEFT SEMI JOIN input3 a ON v.`门店名称` = a.`门店名称`
