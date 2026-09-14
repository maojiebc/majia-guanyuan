SELECT v.* FROM (
SELECT v.*, date_sub(current_date(), 1) AS `统计截止日`, current_timestamp() AS `专供更新时间`
FROM (
SELECT
  `门店名称` AS `门店名称`,
  `分公司` AS `分公司`,
  `地理城市` AS `地理城市`,
  `门店类型` AS `门店类型`,
  SUM(`income`) AS `营业额`,
  SUM(`订单数`) AS `订单数`,
  (count(distinct (CONCAT(`门店编号`,'_',`订单日期`)))) AS `营业天数`
FROM input1
WHERE `加盟状态` IN ('运营客户')
  AND to_date(`订单日期`) BETWEEN date_sub(current_date(), 7) AND date_sub(current_date(), 1)
GROUP BY `门店名称`, `分公司`, `地理城市`, `门店类型`
) v
) v
LEFT SEMI JOIN input2 a ON v.`门店名称` = a.`门店名称`
