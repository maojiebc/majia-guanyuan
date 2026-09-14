SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
WITH aggregated AS (
SELECT
  `门店名称` AS `门店名称`,
  COUNT(DISTINCT `会员卡号`) AS `消费会员_近30天`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 30) AND date_sub(current_date(), 1)
  AND `会员卡号` <> ''
  AND `会员卡号` IS NOT NULL
GROUP BY `门店名称`
), stores AS (SELECT DISTINCT `门店名称` FROM input2)
SELECT
  s.`门店名称`,
  coalesce(a.`消费会员_近30天`, 0) AS `消费会员_近30天`
FROM stores s LEFT JOIN aggregated a ON s.`门店名称` <=> a.`门店名称`
) v
) v
LEFT SEMI JOIN input3 a ON v.`门店名称` = a.`门店名称`
