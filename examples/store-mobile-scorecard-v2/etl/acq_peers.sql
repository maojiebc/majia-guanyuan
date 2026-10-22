-- 会员拉新对照（近30天）：每店一行，每百笔堂食入会及同分公司、同地理城市、同店型名次
-- input1：acq_daily；input2：finance_daily（只取堂食订单作分母）；input3：store_context（分公司、地理城市、门店类型）
-- 每百单入会 = 近30天新增会员（不含平台会员）÷ 近30天堂食订单 × 100。
-- 参评：近30天堂食订单 ≥ 300 笔且有堂食订单的日子 ≥ 21 天（与会员占比排名同一试看门槛，按业务调整）。
-- 名次按原始比值降序，相同并列；本店计入中位数；同组不足 3 家不排名。前端只展示本店名次、分位和中位数。
WITH stores AS (
  SELECT trim(CAST(`门店编号` AS STRING)) AS code, max(`门店名称`) AS store,
         max(`分公司`) AS branch, max(`地理城市`) AS city, max(`门店类型`) AS type
  FROM input3
  WHERE `门店编号` IS NOT NULL AND trim(CAST(`门店编号` AS STRING)) <> ''
  GROUP BY trim(CAST(`门店编号` AS STRING))
), dine AS (
  SELECT `门店名称` AS store,
         sum(CASE WHEN `订单日期` BETWEEN date_sub(current_date(), 30) AND date_sub(current_date(), 1) THEN `订单数` ELSE 0 END) AS cur_orders,
         count(DISTINCT CASE WHEN `订单日期` BETWEEN date_sub(current_date(), 30) AND date_sub(current_date(), 1) AND `订单数` > 0 THEN `订单日期` END) AS cur_days,
         sum(CASE WHEN `订单日期` BETWEEN date_sub(current_date(), 60) AND date_sub(current_date(), 31) THEN `订单数` ELSE 0 END) AS prev_orders,
         count(DISTINCT CASE WHEN `订单日期` BETWEEN date_sub(current_date(), 60) AND date_sub(current_date(), 31) AND `订单数` > 0 THEN `订单日期` END) AS prev_days
  FROM input2
  WHERE `取餐方式` = '堂食'
  GROUP BY `门店名称`
), reg AS (
  SELECT `门店编号` AS code,
         sum(CASE WHEN `注册日期` BETWEEN date_sub(current_date(), 30) AND date_sub(current_date(), 1) THEN `新增会员` ELSE 0 END) AS cur_new,
         sum(CASE WHEN `注册日期` BETWEEN date_sub(current_date(), 60) AND date_sub(current_date(), 31) THEN `新增会员` ELSE 0 END) AS prev_new
  FROM input1
  WHERE `注册渠道` <> '饿了么会员通'
  GROUP BY `门店编号`
), scored AS (
  SELECT s.code, s.store, s.branch, s.city, s.type,
         coalesce(d.cur_orders, 0) AS cur_orders, coalesce(g.cur_new, 0) AS cur_new,
         CASE WHEN coalesce(d.cur_orders, 0) = 0 THEN '近30天没有堂食订单'
              WHEN d.cur_orders < 300 THEN '近30天堂食订单不足300笔'
              WHEN d.cur_days < 21 THEN '有堂食订单的日子不足21天'
              ELSE '可参评' END AS state,
         CASE WHEN coalesce(d.prev_orders, 0) >= 300 AND d.prev_days >= 21 THEN '可参评' ELSE '前30天堂食订单不足' END AS prev_state,
         CASE WHEN coalesce(d.cur_orders, 0) > 0 THEN coalesce(g.cur_new, 0) * 100.0 / d.cur_orders END AS rate,
         CASE WHEN coalesce(d.prev_orders, 0) > 0 THEN coalesce(g.prev_new, 0) * 100.0 / d.prev_orders END AS prev_rate
  FROM stores s
  LEFT JOIN dine d ON s.store = d.store
  LEFT JOIN reg g ON s.code = g.code
), members AS (
  SELECT code, '分公司' AS scope, branch AS grp, rate FROM scored WHERE state = '可参评'
  UNION ALL
  SELECT code, '城市', city, rate FROM scored WHERE state = '可参评'
  UNION ALL
  SELECT code, '店型', type, rate FROM scored WHERE state = '可参评'
), ranked AS (
  SELECT code, scope, grp, rate,
         RANK() OVER (PARTITION BY scope, grp ORDER BY rate DESC) AS rk,
         COUNT(*) OVER (PARTITION BY scope, grp) AS n
  FROM members
  WHERE grp IS NOT NULL AND trim(grp) <> ''
), medians AS (
  SELECT scope, grp, percentile(rate, 0.5) AS median
  FROM members
  WHERE grp IS NOT NULL AND trim(grp) <> ''
  GROUP BY scope, grp
), results AS (
  SELECT r.code, r.scope, r.rk, m.median,
         CASE WHEN CAST(r.rk AS DOUBLE) / r.n <= 0.1 THEN '前10%'
              WHEN CAST(r.rk AS DOUBLE) / r.n <= 0.25 THEN '前25%'
              WHEN CAST(r.rk AS DOUBLE) / r.n <= 0.5 THEN '前50%'
              WHEN CAST(r.rk AS DOUBLE) / r.n <= 0.75 THEN '后50%'
              ELSE '后25%' END AS tier
  FROM ranked r
  JOIN medians m ON r.scope = m.scope AND r.grp = m.grp
  WHERE r.n >= 3
), pivoted AS (
  SELECT code,
         max(CASE WHEN scope = '分公司' THEN rk END) AS `拉新分公司名次`,
         max(CASE WHEN scope = '分公司' THEN median END) AS `拉新分公司中位`,
         max(CASE WHEN scope = '分公司' THEN tier END) AS `拉新分公司分位`,
         max(CASE WHEN scope = '城市' THEN rk END) AS `拉新城市名次`,
         max(CASE WHEN scope = '城市' THEN median END) AS `拉新城市中位`,
         max(CASE WHEN scope = '城市' THEN tier END) AS `拉新城市分位`,
         max(CASE WHEN scope = '店型' THEN rk END) AS `拉新店型名次`,
         max(CASE WHEN scope = '店型' THEN median END) AS `拉新店型中位`,
         max(CASE WHEN scope = '店型' THEN tier END) AS `拉新店型分位`
  FROM results
  GROUP BY code
)
SELECT s.store AS `门店名称`,
       s.code AS `门店编号`,
       date_sub(current_date(), 30) AS `拉新对比开始日`,
       date_sub(current_date(), 1) AS `拉新对比截止日`,
       s.state AS `拉新参评状态`,
       s.cur_new AS `拉新近30天新增`,
       s.cur_orders AS `拉新近30天堂食订单`,
       s.rate AS `每百单入会`,
       s.prev_state AS `拉新前期状态`,
       s.prev_rate AS `拉新前期每百单入会`,
       p.`拉新分公司名次`, p.`拉新分公司中位`, p.`拉新分公司分位`,
       p.`拉新城市名次`, p.`拉新城市中位`, p.`拉新城市分位`,
       p.`拉新店型名次`, p.`拉新店型中位`, p.`拉新店型分位`,
       date_sub(current_date(), 1) AS `统计截止日`,
       current_timestamp() AS `专供更新时间`
FROM scored s
LEFT JOIN pivoted p ON s.code = p.code
