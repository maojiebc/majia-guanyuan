WITH peers AS (
 SELECT `门店类型`,`会员分组`,COUNT(*) AS stores,percentile(`堂食复购率`,0.5) AS median_rate,percentile(`堂食复购率`,0.75) AS top_quartile
 FROM input1 WHERE `堂食复购参评状态`='可对比' GROUP BY `门店类型`,`会员分组`
), joined AS (
 SELECT s.*,p.stores,p.median_rate,p.top_quartile FROM input1 s
 LEFT JOIN peers p ON s.`门店类型`=p.`门店类型` AND s.`会员分组`=p.`会员分组`
)
SELECT `门店编号`,MAX(`堂食复购开始日`) AS `堂食复购开始日`,MAX(`堂食复购截止日`) AS `堂食复购截止日`,MAX(`堂食复购观察天数`) AS `堂食复购观察天数`,
 MAX(CASE WHEN `会员分组`=1 THEN `堂食顾客数` END) AS `会员堂食顾客数`,
 MAX(CASE WHEN `会员分组`=1 THEN `堂食复购顾客数` END) AS `会员堂食复购顾客数`,
 MAX(CASE WHEN `会员分组`=1 THEN `堂食复购率` END) AS `会员堂食复购率`,
 MAX(CASE WHEN `会员分组`=1 THEN `堂食复购参评状态` END) AS `会员堂食复购参评状态`,
 MAX(CASE WHEN `会员分组`=1 THEN stores END) AS `同店型会员复购门店数`,
 MAX(CASE WHEN `会员分组`=1 AND stores>=10 THEN median_rate END) AS `同店型会员复购中位`,
 MAX(CASE WHEN `会员分组`=0 THEN `堂食顾客数` END) AS `非会员堂食顾客数`,
 MAX(CASE WHEN `会员分组`=0 THEN `堂食复购顾客数` END) AS `非会员堂食复购顾客数`,
 MAX(CASE WHEN `会员分组`=0 THEN `堂食复购率` END) AS `非会员堂食复购率`,
 MAX(CASE WHEN `会员分组`=0 THEN `堂食复购参评状态` END) AS `非会员堂食复购参评状态`,
 MAX(CASE WHEN `会员分组`=0 THEN stores END) AS `同店型非会员复购门店数`,
 MAX(CASE WHEN `会员分组`=0 AND stores>=10 THEN median_rate END) AS `同店型非会员复购中位`,
 MAX(CASE WHEN `会员分组`=1 AND stores>=10 THEN top_quartile END) AS `同店型会员复购前25门槛`,
 MAX(CASE WHEN `会员分组`=0 AND stores>=10 THEN top_quartile END) AS `同店型非会员复购前25门槛`
FROM joined GROUP BY `门店编号`
