SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `产品` AS `产品`,
  COUNT(DISTINCT `订单号`) AS `订单数`
FROM input1
WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(), 7) AND date_sub(current_date(), 1)
  AND `订单类型` IN ('堂食')
  AND `产品` NOT IN ('示例排除商品', '***餐巾纸1包（外带）', '~~餐巾纸~~(1包)', '✔✔餐巾纸✔✔', '餐巾纸', '￥￥餐巾纸', '##单点打包盒##', '28以下打包盒', '29到56打包盆', '学生打包盒', '~面类需要单独打包点这里~~~~~~~~~', '小打包盒', '小料打包盒', '小料需要单独打包请备注，我们会为您服务~', '打包', '打包盒', '打包盒2', '打包盒必选', '打包盒（几份就选几个打包盒，不选默认装一起）', '打包费', '麻辣烫')
GROUP BY `门店名称`, `产品`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
