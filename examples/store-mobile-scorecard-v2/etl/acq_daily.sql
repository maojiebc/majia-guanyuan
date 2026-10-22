-- 会员拉新逐日（70天）：门店 × 注册日期 × 注册渠道的新增会员
-- input1：会员注册明细（每个会员一行：会员卡号、注册日期、注册渠道、注册门店编号、首单日期、首单门店编号）
-- input2：门店档案输出（store_context），提供有效门店、字符串门店编号与页面筛选用的门店名称
-- 新增会员按会员卡号去重；会员只有一个注册日期，跨日相加仍是去重人数。
--
-- 归属门店：注册门店编号是有效门店就算注册门店；否则（例如支付入口入会只记了统一占位码、小程序用通用码注册）
-- 算入会后 7 天内（含当天）首单的门店；仍对不上的不进任何门店。“按首单门店归属”列单独给出第二类人数，前端单独展示。
-- 接入前先在完整输入上汇总核对：各注册渠道的实际取值、注册门店编号能对上有效门店的比例、占位码有哪些，
-- 以及两种门店都有效时是否基本是同一家，再决定是否采用首单兜底和 7 天窗口。渠道名是示例，按本组织取值映射。
WITH stores AS (
  SELECT trim(CAST(`门店编号` AS STRING)) AS code, max(`门店名称`) AS store
  FROM input2
  WHERE `门店编号` IS NOT NULL AND trim(CAST(`门店编号` AS STRING)) <> ''
  GROUP BY trim(CAST(`门店编号` AS STRING))
), reg AS (
  SELECT trim(CAST(m.`注册门店编号` AS STRING)) AS reg_code,
         trim(CAST(m.`首单门店编号` AS STRING)) AS first_code,
         CAST(m.`首单日期` AS DATE) AS first_date,
         CAST(m.`注册日期` AS DATE) AS reg_date,
         CASE WHEN m.`注册渠道` IN ('微信小程序', '支付宝碰一下', '支付设备入会') THEN m.`注册渠道`
              WHEN m.`注册渠道` = '饿了么会员通' THEN '饿了么会员通'
              ELSE '其他' END AS channel,
         m.`会员卡号` AS card
  FROM input1 m
  WHERE CAST(m.`注册日期` AS DATE) BETWEEN date_sub(current_date(), 70) AND date_sub(current_date(), 1)
    AND m.`会员卡号` IS NOT NULL AND trim(m.`会员卡号`) <> ''
), attributed AS (
  SELECT r.reg_date, r.channel, r.card,
         CASE WHEN sr.code IS NOT NULL THEN sr.code
              WHEN sf.code IS NOT NULL AND datediff(r.first_date, r.reg_date) BETWEEN 0 AND 7 THEN sf.code END AS code,
         CASE WHEN sr.code IS NOT NULL THEN 0 ELSE 1 END AS by_first
  FROM reg r
  LEFT JOIN stores sr ON r.reg_code = sr.code
  LEFT JOIN stores sf ON r.first_code = sf.code
)
SELECT s.store AS `门店名称`,
       s.code AS `门店编号`,
       a.reg_date AS `注册日期`,
       a.channel AS `注册渠道`,
       COUNT(DISTINCT a.card) AS `新增会员`,
       COUNT(DISTINCT CASE WHEN a.by_first = 1 THEN a.card END) AS `按首单门店归属`,
       date_sub(current_date(), 1) AS `统计截止日`,
       current_timestamp() AS `专供更新时间`
FROM attributed a
JOIN stores s ON a.code = s.code
GROUP BY s.store, s.code, a.reg_date, a.channel
