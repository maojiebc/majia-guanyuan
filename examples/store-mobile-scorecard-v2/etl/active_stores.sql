SELECT DISTINCT `门店名称` FROM (
 SELECT `门店名称` FROM input1
 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
 AND (coalesce(`income`,0) <> 0 OR coalesce(`订单数`,0) <> 0)
 UNION ALL
 SELECT `门店名称` FROM input2
 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
 AND (coalesce(`income_应收`,0) <> 0 OR coalesce(`订单数`,0) <> 0)
 UNION ALL
 SELECT `门店名称` FROM input3
 WHERE to_date(`订单日期`) BETWEEN date_sub(current_date(),70) AND date_sub(current_date(),1)
 AND (coalesce(`income_应收`,0) <> 0 OR (`订单号` IS NOT NULL AND trim(`订单号`) <> ''))
) a WHERE `门店名称` IS NOT NULL AND trim(`门店名称`) <> ''
