#!/usr/bin/env node
/**
 * 生成脱敏离线单文件 HTML。
 * 视图按生产运行时常见顺序打乱，逼 detectV 按列名识别，不要按下标写死。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const ANCHOR = '2026-03-20';
const TODAY = '2026-03-21';
const STORE_A = '示例镇中店';
const STORE_B = '示例城南店';

function pad(n) { return String(n).padStart(2, '0'); }
function dstr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function pd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); }
function addDays(s, n) { const d = pd(s); d.setDate(d.getDate() + n); return dstr(d); }
function daysBack(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(ANCHOR, -i));
  return out;
}

function mulberry32(a) {
  return function rand() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toCols(rows, names) {
  return names.map((name) => ({ name, data: rows.map((r) => r[name] ?? null) }));
}

function detectV(data) {
  const next = { fin: -1, hours: -1, newold: -1, member: -1, member7: -1, member30: -1, memberMonth: -1, membase: -1, products: -1, soup: -1, status: -1, friends: -1, groups: -1, frienddaily: -1, groupdaily: -1, coupons: -1, dormant: -1, context: -1, rfm: -1, peer: -1 };
  const has = (names, n) => names.includes(n);
  data.forEach((view, i) => {
    const n = view.map((c) => c.name);
    if (has(n, '同步时间') && has(n, '渠道名称')) next.fin = i;
    else if (has(n, '下单时段')) next.hours = i;
    else if (has(n, '顾客属性')) next.newold = i;
    else if (has(n, '消费会员_近7天')) next.member7 = i;
    else if (has(n, '消费会员_近30天')) next.member30 = i;
    else if (has(n, '消费会员_本月')) next.memberMonth = i;
    else if (has(n, '消费会员数')) next.member = i;
    else if (has(n, '消费频次') && has(n, '营收贡献')) next.membase = i;
    else if (has(n, '产品')) next.products = i;
    else if (has(n, '口味')) next.soup = i;
    else if (has(n, '顾客状态')) next.status = i;
    else if (has(n, '在联好友')) next.friends = i;
    else if (has(n, '在群人数')) next.groups = i;
    else if (has(n, '添加日期')) next.frienddaily = i;
    else if (has(n, '入群日期')) next.groupdaily = i;
    else if (has(n, '核销券数')) next.coupons = i;
    else if (has(n, '复购状态')) next.dormant = i;
    else if (has(n, '开业日期')) next.context = i;
    else if (has(n, '顾客类型')) next.rfm = i;
    else if (has(n, '营业天数')) next.peer = i;
  });
  return next;
}

function packViews(named) {
  // 与 2026-09-14 生产 children 常见顺序一致，用来演示「写入顺序 ≠ 运行时顺序」
  return [
    named.fin, named.newold, named.soup, named.products,
    named.hours, named.status, named.friends, named.groups,
    named.frienddaily, named.groupdaily, named.coupons,
    named.membase, named.member, named.member7, named.member30, named.memberMonth,
    named.dormant, named.context, named.rfm, named.peer,
  ];
}

function weekdayBoost(date) {
  const w = pd(date).getDay();
  if (w === 6) return 1.28;
  if (w === 0) return 1.18;
  if (w === 5) return 1.12;
  return 1;
}

const PEERS = [
  { name: STORE_A, branch: '示例南区', city: '示例市', type: '乡镇店', avg: 7420, ac: 28.6 },
  { name: STORE_B, branch: '示例南区', city: '示例市', type: '社区店', avg: 12680, ac: 31.2 },
  { name: '示例河东店', branch: '示例南区', city: '示例市', type: '社区店', avg: 9800, ac: 29.4 },
  { name: '示例林荫店', branch: '示例南区', city: '示例市', type: '乡镇店', avg: 6100, ac: 26.8 },
  { name: '示例车站店', branch: '示例南区', city: '示例市', type: '商场店', avg: 15400, ac: 33.1 },
  { name: '示例桥西店', branch: '示例南区', city: '示例湾', type: '乡镇店', avg: 5200, ac: 25.4 },
  { name: '示例湖畔店', branch: '示例南区', city: '示例湾', type: '社区店', avg: 11100, ac: 30.0 },
  { name: '示例花园店', branch: '示例南区', city: '示例港', type: '社区店', avg: 8900, ac: 28.1 },
  { name: '示例城北店', branch: '示例北区', city: '示例市', type: '社区店', avg: 13200, ac: 32.4 },
  { name: '示例望江店', branch: '示例北区', city: '示例市', type: '乡镇店', avg: 4800, ac: 24.9 },
  { name: '示例大学店', branch: '示例北区', city: '示例市', type: '商场店', avg: 17100, ac: 34.0 },
  { name: '示例新城店', branch: '示例北区', city: '示例湾', type: '社区店', avg: 10400, ac: 29.7 },
  { name: '示例港口店', branch: '示例北区', city: '示例港', type: '商场店', avg: 14800, ac: 31.8 },
  { name: '示例东门店', branch: '示例东区', city: '示例市', type: '社区店', avg: 9200, ac: 27.6 },
  { name: '示例西市店', branch: '示例东区', city: '示例市', type: '乡镇店', avg: 5600, ac: 25.8 },
  { name: '示例南站店', branch: '示例东区', city: '示例湾', type: '商场店', avg: 16300, ac: 33.5 },
  { name: '示例旧街店', branch: '示例东区', city: '示例港', type: '乡镇店', avg: 4300, ac: 24.2 },
  { name: '示例中环店', branch: '示例东区', city: '示例港', type: '社区店', avg: 11800, ac: 30.6 },
  { name: '示例石桥店', branch: '示例南区', city: '示例市', type: '乡镇店', avg: 6900, ac: 27.1 },
  { name: '示例春风店', branch: '示例南区', city: '示例市', type: '社区店', avg: 10700, ac: 29.0 },
  { name: '示例夜市店', branch: '示例南区', city: '示例湾', type: '商场店', avg: 13900, ac: 32.0 },
  { name: '示例巷口店', branch: '示例北区', city: '示例湾', type: '乡镇店', avg: 5100, ac: 25.1 },
  { name: '示例江心店', branch: '示例北区', city: '示例港', type: '社区店', avg: 9900, ac: 28.8 },
  { name: '示例长廊店', branch: '示例东区', city: '示例湾', type: '社区店', avg: 8600, ac: 27.9 },
  { name: '示例码头店', branch: '示例东区', city: '示例港', type: '商场店', avg: 15700, ac: 33.8 },
  { name: '示例坡顶店', branch: '示例北区', city: '示例市', type: '乡镇店', avg: 4700, ac: 24.6 },
  { name: '示例巷南店', branch: '示例南区', city: '示例港', type: '乡镇店', avg: 5800, ac: 26.0 },
  { name: '示例里巷店', branch: '示例东区', city: '示例市', type: '社区店', avg: 10100, ac: 29.2 },
  { name: '示例湾东店', branch: '示例北区', city: '示例湾', type: '商场店', avg: 14200, ac: 31.5 },
  { name: '示例岗下店', branch: '示例南区', city: '示例市', type: '乡镇店', avg: 6400, ac: 26.4 },
  { name: '示例巷北店', branch: '示例东区', city: '示例湾', type: '乡镇店', avg: 4500, ac: 24.8 },
  { name: '示例城西店', branch: '示例北区', city: '示例港', type: '社区店', avg: 11300, ac: 30.2 },
  { name: '示例外滩店', branch: '示例东区', city: '示例市', type: '商场店', avg: 16800, ac: 34.4 },
  { name: '示例田埂店', branch: '示例南区', city: '示例湾', type: '乡镇店', avg: 3900, ac: 23.8 },
  { name: '示例里院店', branch: '示例北区', city: '示例市', type: '社区店', avg: 9500, ac: 28.4 },
  { name: '示例坡西店', branch: '示例东区', city: '示例港', type: '乡镇店', avg: 5400, ac: 25.6 },
];

function peerView() {
  return toCols(PEERS.map((p) => {
    const days = 7;
    const orders = Math.round((p.avg * days) / p.ac);
    return {
      门店名称: p.name,
      分公司: p.branch,
      地理城市: p.city,
      门店类型: p.type,
      营业天数: days,
      营业额: Math.round(p.avg * days),
      订单数: orders,
    };
  }), ['门店名称', '分公司', '地理城市', '门店类型', '营业天数', '营业额', '订单数']);
}

const PRODUCTS = ['肥牛', '豆皮', '土豆', '宽粉', '生菜', '鱼豆腐', '蟹味棒', '金针菇', '海带', '午餐肉', '玉米', '藕片'];
const SOUPS = ['红汤', '骨汤', '番茄', '菌汤', '清汤'];
const HOURS = ['早餐', '午餐', '下午茶', '晚餐', '宵夜'];
const COUPONS = ['新人券', '满减券', '会员日券', '外卖券'];
const STATUS = [
  ['活跃（21 天内）', 0.42],
  ['低活（21–45 天）', 0.28],
  ['沉默（46–90 天）', 0.18],
  ['流失（90 天以上）', 0.12],
];
const RFM = [
  ['重要价值', 0.12],
  ['重要保持', 0.18],
  ['重要发展', 0.16],
  ['一般价值', 0.34],
  ['流失预警', 0.20],
];

function buildStore(name, spec) {
  const rand = mulberry32(spec.seed);
  const finDays = daysBack(70);
  const hourDays = daysBack(16);
  const sync = '2026-03-21 06:12:04';

  const fin = [];
  finDays.forEach((date, idx) => {
    const boost = weekdayBoost(date);
    const isAnchor = date === ANCHOR;
    const dayRev = Math.round((isAnchor ? spec.yesterday : spec.base * boost) * (0.94 + rand() * 0.12));
    const dineShare = spec.dineShare;
    const dine = Math.round(dayRev * dineShare);
    const delivery = dayRev - dine;
    const a = Math.round(delivery * 0.58);
    const b = delivery - a;
    const ac = spec.ac * (0.96 + rand() * 0.08);
    fin.push({ 订单日期: date, 门店名称: name, 取餐方式: '堂食', 渠道名称: '店内收银', 营业额: dine, 订单数: Math.max(1, Math.round(dine / ac)), 同步时间: sync });
    fin.push({ 订单日期: date, 门店名称: name, 取餐方式: '外卖', 渠道名称: '平台甲', 营业额: a, 订单数: Math.max(1, Math.round(a / (ac * 1.05))), 同步时间: sync });
    fin.push({ 订单日期: date, 门店名称: name, 取餐方式: '外卖', 渠道名称: '平台乙', 营业额: b, 订单数: Math.max(1, Math.round(b / (ac * 1.08))), 同步时间: sync });
    void idx;
  });

  const hours = [];
  const hourShare = { 早餐: 0.08, 午餐: 0.34, 下午茶: 0.12, 晚餐: 0.38, 宵夜: 0.08 };
  hourDays.forEach((date) => {
    const dayOrders = Math.round(spec.base / spec.ac * weekdayBoost(date));
    HOURS.forEach((slot) => {
      hours.push({
        订单日期: date,
        下单时段: slot,
        取餐方式: slot === '宵夜' ? '外卖' : '堂食',
        订单数: Math.max(4, Math.round(dayOrders * hourShare[slot] * (0.9 + rand() * 0.2))),
        营业额: Math.round(spec.base * hourShare[slot] * weekdayBoost(date)),
      });
    });
  });

  const newold = [];
  finDays.forEach((date) => {
    const people = Math.round((spec.base / spec.ac) * weekdayBoost(date) * 0.92);
    const nw = Math.round(people * spec.newShare);
    const old = people - nw;
    const newMem = Math.max(1, Math.round(nw * 0.22));
    const oldMem = Math.max(1, Math.round(old * 0.46));
    const rows = [
      { 顾客属性: '新客', 是否会员: '会员', 顾客人次: newMem },
      { 顾客属性: '新客', 是否会员: '非会员', 顾客人次: nw - newMem },
      { 顾客属性: '老客', 是否会员: '会员', 顾客人次: oldMem },
      { 顾客属性: '老客', 是否会员: '非会员', 顾客人次: old - oldMem },
    ];
    rows.forEach((r) => {
      const ac = spec.ac * (r.顾客属性 === '新客' ? 0.9 : 1.05);
      newold.push({
        订单日期: date,
        顾客属性: r.顾客属性,
        是否会员: r.是否会员,
        顾客人次: r.顾客人次,
        订单数: r.顾客人次,
        营业额: Math.round(r.顾客人次 * ac),
      });
    });
  });

  const member = finDays.map((date) => ({
    订单日期: date,
    消费会员数: Math.round(spec.member * weekdayBoost(date) * (0.92 + rand() * 0.12)),
  }));
  function periodDistinct(from, to, overlap) {
    const days = member.filter((r) => r.订单日期 >= from && r.订单日期 <= to);
    const total = days.reduce((a, r) => a + r.消费会员数, 0);
    const peak = Math.max(...days.map((r) => r.消费会员数), 1);
    return Math.max(peak, Math.round(peak + (total - peak) * overlap));
  }
  const monthStart = ANCHOR.slice(0, 8) + '01';
  const member7 = [{ 消费会员_近7天: periodDistinct(addDays(ANCHOR, -6), ANCHOR, 0.42) }];
  const member30 = [{ 消费会员_近30天: periodDistinct(addDays(ANCHOR, -29), ANCHOR, 0.28) }];
  const memberMonth = [{ 消费会员_本月: periodDistinct(monthStart, ANCHOR, 0.32) }];

  const products = PRODUCTS.map((p, i) => ({
    产品: p,
    订单数: Math.round(spec.productTop * Math.pow(0.82, i) * (0.9 + rand() * 0.15)),
  }));

  const soup = [];
  SOUPS.forEach((flavor, i) => {
    soup.push({ 口味: flavor, 取餐方式: '堂食', 订单数: Math.round(spec.soupTop * Math.pow(0.78, i) * (0.9 + rand() * 0.12)) });
    soup.push({ 口味: flavor, 取餐方式: '外卖', 订单数: Math.round(spec.soupTop * 0.55 * Math.pow(0.8, i) * (0.9 + rand() * 0.12)) });
  });

  const status = STATUS.map(([label, share]) => ({ 顾客状态: label, 是否会员: '是', 顾客数: Math.round(spec.customers * share) }));
  const rfm = RFM.map(([label, share]) => ({ 顾客类型: label, 顾客数: Math.round(spec.customers * 0.7 * share) }));
  const friends = [{ 在联好友: spec.friends, 流失率: spec.churn }];
  const groups = [{ 在群人数: spec.groups, 退群率: spec.leave }];
  const frienddaily = finDays.map((date) => ({ 添加日期: date, 添加好友: Math.max(0, Math.round(spec.addFriend * weekdayBoost(date) * (0.6 + rand()))) }));
  const groupdaily = finDays.map((date) => ({ 入群日期: date, 入群人数: Math.max(0, Math.round(spec.addGroup * weekdayBoost(date) * (0.5 + rand()))) }));
  const coupons = [];
  finDays.forEach((date) => {
    COUPONS.forEach((type, i) => {
      coupons.push({ 核销日期: date, 券类型名称: type, 核销券数: Math.max(0, Math.round(spec.coupon * (0.4 - i * 0.07) * weekdayBoost(date) * (0.7 + rand() * 0.5))) });
    });
  });
  const dormant = [
    { 复购状态: '近 90 天已复购', 顾客数: Math.round(spec.customers * 0.36) },
    { 复购状态: '近 90 天未复购', 顾客数: Math.round(spec.customers * 0.64) },
  ];
  const context = [{ 开业日期: spec.opened, 门店名称: name, 分公司: spec.branch, 地理城市: spec.city, 门店类型: spec.type }];
  const ident = Math.max(2, Math.round(spec.customers * spec.identShare));
  const memPeople = Math.max(1, Math.round(ident * spec.memPeopleShare));
  const nonPeople = Math.max(1, ident - memPeople);
  const memOrders = Math.round(memPeople * spec.memFreq);
  const nonOrders = Math.round(nonPeople * spec.nonFreq);
  const membase = [
    { 是否会员: '会员', 消费人数: memPeople, 订单数: memOrders, 营收贡献: Math.round(memPeople * spec.memSpend), 消费频次: Number((memOrders / memPeople).toFixed(4)) },
    { 是否会员: '非会员', 消费人数: nonPeople, 订单数: nonOrders, 营收贡献: Math.round(nonPeople * spec.nonSpend), 消费频次: Number((nonOrders / nonPeople).toFixed(4)) },
  ];

  const named = {
    fin: toCols(fin, ['订单日期', '门店名称', '取餐方式', '渠道名称', '营业额', '订单数', '同步时间']),
    hours: toCols(hours, ['订单日期', '下单时段', '取餐方式', '订单数', '营业额']),
    newold: toCols(newold, ['订单日期', '顾客属性', '是否会员', '顾客人次', '订单数', '营业额']),
    member: toCols(member, ['订单日期', '消费会员数']),
    member7: toCols(member7, ['消费会员_近7天']),
    member30: toCols(member30, ['消费会员_近30天']),
    memberMonth: toCols(memberMonth, ['消费会员_本月']),
    membase: toCols(membase, ['是否会员', '消费人数', '订单数', '营收贡献', '消费频次']),
    products: toCols(products, ['产品', '订单数']),
    soup: toCols(soup, ['口味', '取餐方式', '订单数']),
    status: toCols(status, ['顾客状态', '是否会员', '顾客数']),
    friends: toCols(friends, ['在联好友', '流失率']),
    groups: toCols(groups, ['在群人数', '退群率']),
    frienddaily: toCols(frienddaily, ['添加日期', '添加好友']),
    groupdaily: toCols(groupdaily, ['入群日期', '入群人数']),
    coupons: toCols(coupons, ['核销日期', '券类型名称', '核销券数']),
    dormant: toCols(dormant, ['复购状态', '顾客数']),
    context: toCols(context, ['开业日期', '门店名称', '分公司', '地理城市', '门店类型']),
    rfm: toCols(rfm, ['顾客类型', '顾客数']),
    peer: peerView(),
  };
  return packViews(named);
}

function sumFinDay(views, date) {
  const v = detectV(views);
  const cols = views[v.fin];
  const rows = cols[0].data.map((_, i) => Object.fromEntries(cols.map((c) => [c.name, c.data[i]])));
  return rows.filter((r) => r['订单日期'] === date).reduce((a, r) => a + r['营业额'], 0);
}

function avg7(views) {
  const v = detectV(views);
  const cols = views[v.fin];
  const rows = cols[0].data.map((_, i) => Object.fromEntries(cols.map((c) => [c.name, c.data[i]])));
  const from = addDays(ANCHOR, -6);
  const byDay = new Map();
  rows.forEach((r) => {
    if (r['订单日期'] < from || r['订单日期'] > ANCHOR) return;
    byDay.set(r['订单日期'], (byDay.get(r['订单日期']) || 0) + r['营业额']);
  });
  const vals = [...byDay.values()];
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

const specA = {
  seed: 21, base: 7200, yesterday: 8840, dineShare: 0.62, ac: 28.6, newShare: 0.23,
  member: 46, productTop: 186, soupTop: 210, customers: 1860, friends: 1280, groups: 420,
  churn: 0.18, leave: 0.09, addFriend: 6, addGroup: 3, coupon: 18,
  identShare: 0.58, memPeopleShare: 0.27, memFreq: 1.8, nonFreq: 1.3, memSpend: 59, nonSpend: 50,
  opened: '2023-05-16', branch: '示例南区', city: '示例市', type: '乡镇店',
};
const specB = {
  seed: 77, base: 11800, yesterday: 15120, dineShare: 0.54, ac: 31.2, newShare: 0.19,
  member: 78, productTop: 240, soupTop: 260, customers: 2740, friends: 1960, groups: 680,
  churn: 0.14, leave: 0.07, addFriend: 9, addGroup: 5, coupon: 27,
  identShare: 0.61, memPeopleShare: 0.33, memFreq: 1.86, nonFreq: 1.28, memSpend: 58, nonSpend: 49,
  opened: '2022-11-08', branch: '示例南区', city: '示例市', type: '社区店',
};

const viewsA = buildStore(STORE_A, specA);
const viewsB = buildStore(STORE_B, specB);
const mapA = detectV(viewsA);
const mapB = detectV(viewsB);
const missing = Object.entries(mapA).filter(([, i]) => i < 0);
if (missing.length) throw new Error(`detectV 漏视图: ${missing.map(([k]) => k).join(',')}`);
if (JSON.stringify(mapA) !== JSON.stringify(mapB)) throw new Error('两店视图顺序不一致');
const yA = sumFinDay(viewsA, ANCHOR);
const a7 = avg7(viewsA);
const yB = sumFinDay(viewsB, ANCHOR);
if (Math.abs(yA - a7) < 200) throw new Error(`昨天合计与近7天日均太接近: ${yA} vs ${a7}`);
if (yA === yB) throw new Error('两店昨天合计相同，换店看不出变化');
function memFreq(views, who) {
  const v = detectV(views);
  const cols = views[v.membase];
  const rows = cols[0].data.map((_, i) => Object.fromEntries(cols.map((c) => [c.name, c.data[i]])));
  return rows.find((r) => r['是否会员'] === who)['消费频次'];
}
if (memFreq(viewsA, '会员') <= memFreq(viewsA, '非会员')) throw new Error('镇中店会员频次应高于非会员');
if (memFreq(viewsA, '会员') === memFreq(viewsB, '会员')) throw new Error('两店会员频次相同，换店看不出对照变化');

const south = PEERS.filter((p) => p.branch === '示例南区').length;
const city = PEERS.filter((p) => p.city === '示例市').length;
const town = PEERS.filter((p) => p.type === '乡镇店').length;
const community = PEERS.filter((p) => p.type === '社区店').length;
if (south < 3 || city < 3 || town < 3 || community < 3) throw new Error('对比组不足 3 家');

const fixture = {
  today: TODAY,
  storeNames: [STORE_A, STORE_B],
  stores: {
    [STORE_A]: { views: viewsA },
    [STORE_B]: { views: viewsB },
  },
};

const css = fs.readFileSync(path.join(root, 'scorecard.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'scorecard.js'), 'utf8');
const html = `<!DOCTYPE html>
<html lang="zh-CN" class="demo">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>门店手机成绩单 · 脱敏离线案例</title>
<meta name="description" content="majia-guanyuan 移动端成绩单样本。虚构门店与虚构数字，双击即可离线点完所有交互。">
<style>
${css}
</style>
</head>
<body>
<div class="demo-banner">脱敏演示 · 虚构门店与虚构数字 · 数据锚点 2026-03-20 · 双击即可离线点 · 不含真实品牌 / 门店 / 金额</div>
<div class="demo-wrap"><div id="app"></div></div>
<script>
window.SCORECARD_FIXTURE = ${JSON.stringify(fixture)};
</script>
<script>
${js}
</script>
</body>
</html>
`;

const out = path.join(root, 'store-mobile-scorecard.html');
fs.writeFileSync(out, html);
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(JSON.stringify({
  out,
  kb,
  detectV: mapA,
  yesterdayA: yA,
  avg7A: Math.round(a7),
  yesterdayB: yB,
  peerGroups: { south, city, town, community },
}, null, 2));
