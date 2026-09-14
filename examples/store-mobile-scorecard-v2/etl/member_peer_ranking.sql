WITH members AS (
 SELECT `门店名称` store,'分公司' scope,`分公司` grp,`会员对比占比` ratio FROM input1 WHERE `会员对比状态`='可参评'
 UNION ALL
 SELECT `门店名称`,'城市',`地理城市`,`会员对比占比` FROM input1 WHERE `会员对比状态`='可参评'
 UNION ALL
 SELECT `门店名称`,'店型',`门店类型`,`会员对比占比` FROM input1 WHERE `会员对比状态`='可参评'
), ranked AS (
 SELECT store,scope,grp,ratio,RANK() OVER (PARTITION BY scope,grp ORDER BY ratio DESC) rank,
 COUNT(*) OVER (PARTITION BY scope,grp) n
 FROM members WHERE grp IS NOT NULL AND trim(grp)<>''
), medians AS (
 SELECT scope,grp,percentile(ratio,0.5) median FROM members
 WHERE grp IS NOT NULL AND trim(grp)<>'' GROUP BY scope,grp
), results AS (
 SELECT r.store,r.scope,r.rank,m.median,
 CASE WHEN CAST(r.rank AS DOUBLE)/r.n<=0.1 THEN '前10%'
 WHEN CAST(r.rank AS DOUBLE)/r.n<=0.25 THEN '前25%'
 WHEN CAST(r.rank AS DOUBLE)/r.n<=0.5 THEN '前50%'
 WHEN CAST(r.rank AS DOUBLE)/r.n<=0.75 THEN '后50%' ELSE '后25%' END tier
 FROM ranked r JOIN medians m ON r.scope=m.scope AND r.grp=m.grp WHERE r.n>=3
), pivoted AS (
 SELECT store,
 max(CASE WHEN scope='分公司' THEN rank END) AS `会员对比分公司名次`,
 max(CASE WHEN scope='分公司' THEN median END) AS `会员对比分公司中位`,
 max(CASE WHEN scope='分公司' THEN tier END) AS `会员对比分公司分位`,
 max(CASE WHEN scope='城市' THEN rank END) AS `会员对比城市名次`,
 max(CASE WHEN scope='城市' THEN median END) AS `会员对比城市中位`,
 max(CASE WHEN scope='城市' THEN tier END) AS `会员对比城市分位`,
 max(CASE WHEN scope='店型' THEN rank END) AS `会员对比店型名次`,
 max(CASE WHEN scope='店型' THEN median END) AS `会员对比店型中位`,
 max(CASE WHEN scope='店型' THEN tier END) AS `会员对比店型分位`
 FROM results GROUP BY store
)
SELECT m.*,p.`会员对比分公司名次`,p.`会员对比分公司中位`,p.`会员对比分公司分位`,
 p.`会员对比城市名次`,p.`会员对比城市中位`,p.`会员对比城市分位`,
 p.`会员对比店型名次`,p.`会员对比店型中位`,p.`会员对比店型分位`
FROM input1 m LEFT JOIN pivoted p ON m.`门店名称`=p.store
