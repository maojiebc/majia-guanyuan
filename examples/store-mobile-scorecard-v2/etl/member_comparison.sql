SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `是否会员` AS `是否会员`,
  COUNT(DISTINCT `顾客标识`) AS `消费人数`,
  COUNT(DISTINCT `订单号`) AS `订单数`,
  SUM(`income_应收`) AS `营收贡献`,
  (COUNT(DISTINCT IF(`顾客标识` IS NOT NULL AND TRIM(`顾客标识`) <> '', `订单号`, NULL))
/ COUNT(DISTINCT IF(`顾客标识` IS NOT NULL AND TRIM(`顾客标识`) <> '', `顾客标识`, NULL))) AS `消费频次`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 30) AND date_sub(current_date(), 1)
  AND `标识分类` NOT IN ('未知')
  AND `顾客标识` <> ''
  AND `顾客标识` IS NOT NULL
  AND `订单产品` <> '示例排除商品'
GROUP BY `门店名称`, `是否会员`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
