/* 门店手机成绩单 · 脱敏离线样本
 * 与生产可见层同构：GDPlugin 列式视图、按列名识别、周期在页面内算。
 * 另有一张近 30 天会员对照表（消费频次 + 营收贡献）；没有这张表就不画频次。
 * 离线时读 window.SCORECARD_FIXTURE（虚构门店 / 虚构数字）；有 GDPlugin 时仍走官方注入。
 */
(function () {
  'use strict';
  var A = document.getElementById('app');
  var V = { fin: -1, hours: -1, newold: -1, member: -1, member7: -1, member30: -1, memberMonth: -1, membase: -1, products: -1, soup: -1, status: -1, friends: -1, groups: -1, frienddaily: -1, groupdaily: -1, coupons: -1, dormant: -1, context: -1, rfm: -1, peer: -1 };
  function colNames(view) {
    if (!Array.isArray(view) || !view.length) return [];
    if (view[0] && view[0].name != null && Array.isArray(view[0].data)) return view.map(function (c) { return c.name; });
    return Object.keys(view[0]);
  }
  function detectV(data) {
    var next = { fin: -1, hours: -1, newold: -1, member: -1, member7: -1, member30: -1, memberMonth: -1, membase: -1, products: -1, soup: -1, status: -1, friends: -1, groups: -1, frienddaily: -1, groupdaily: -1, coupons: -1, dormant: -1, context: -1, rfm: -1, peer: -1 };
    function has(names, n) { return names.indexOf(n) !== -1; }
    for (var i = 0; i < data.length; i++) {
      var n = colNames(data[i]);
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
    }
    return next;
  }
  function viewLimit(i) { return i === V.peer ? 20000 : 10000; }
  var S = { period: '昨天', grain: 'day', point: null, soupWay: '堂食', open: {}, lastRead: null, demoStore: null };
  var D = [], FIN = new Map(), SYNC = null, ANCHOR = null, PERIODS = null, STORE = null, CTX = null;

  /* ---------- 基础工具 ---------- */
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var num = function (v) { if (v === null || v === undefined || v === '') return null; var n = Number(v); return Number.isFinite(n) ? n : null; };
  var fmt = function (v, d) { d = d || 0; return num(v) == null ? '—' : Number(v).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d }); };
  var pct = function (v, d) { if (d === undefined) d = 1; return num(v) == null ? '—' : fmt(v * 100, d) + '%'; };
  var money = function (v) { if (num(v) == null) return ['—', '']; var a = Math.abs(v); return a >= 100000 ? [fmt(v / 10000, 1), '万元'] : [fmt(v, 0), '元']; };
  var divide = function (a, b) { return num(a) != null && num(b) != null && b !== 0 ? a / b : null; };
  var sum = function (rs, k) { return rs.reduce(function (a, r) { return a + (num(r[k]) || 0); }, 0); };
  var date = function (v) { return String(v || '').slice(0, 10); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var dstr = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var pd = function (s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2], 12); };
  var addDays = function (s, n) { var d = pd(s); d.setDate(d.getDate() + n); return dstr(d); };
  var WD = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var wd = function (s) { return WD[pd(s).getDay()]; };
  var md = function (s) { return Number(s.slice(5, 7)) + '月' + Number(s.slice(8, 10)) + '日'; };
  var inRange = function (s, r) { return s >= r[0] && s <= r[1]; };
  var median = function (arr) { if (!arr.length) return null; var a = arr.slice().sort(function (x, y) { return x - y; }); var m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  var quantile = function (arr, q) { if (!arr.length) return null; var a = arr.slice().sort(function (x, y) { return x - y; }); var pos = (a.length - 1) * q, b = Math.floor(pos), r = pos - b; return a[b + 1] !== undefined ? a[b] + r * (a[b + 1] - a[b]) : a[b]; };
  function rows(cols) { if (!Array.isArray(cols) || !cols.length) return []; var len = Math.max.apply(null, [0].concat(cols.map(function (c) { return (c.data || []).length; }))); var out = []; for (var i = 0; i < len; i++) { var o = {}; cols.forEach(function (c) { o[c.name] = (c.data || [])[i]; }); out.push(o); } return out; }
  function group(rs, k) { var m = new Map(); rs.forEach(function (r) { var v = typeof k === 'function' ? k(r) : r[k]; if (!m.has(v)) m.set(v, []); m.get(v).push(r); }); return Array.from(m, function (e) { return { name: e[0], rows: e[1] }; }); }

  /* ---------- 财务索引与周期 ---------- */
  function addTo(map, key, rev, ord) { var e = map[key] || (map[key] = { rev: 0, orders: 0 }); e.rev += rev; e.orders += ord; }
  function buildFinance() {
    FIN = new Map(); SYNC = null;
    (D[V.fin] || []).forEach(function (r) {
      var d = date(r['订单日期']); if (!d) return;
      var rev = num(r['营业额']) || 0, ord = num(r['订单数']) || 0, way = r['取餐方式'] || '其他', ch = r['渠道名称'] || '其他';
      var e = FIN.get(d); if (!e) { e = { date: d, rev: 0, orders: 0, way: {}, ch: {} }; FIN.set(d, e); }
      e.rev += rev; e.orders += ord; addTo(e.way, way, rev, ord); addTo(e.ch, ch, rev, ord);
      var t = r['同步时间']; if (t && (!SYNC || String(t) > SYNC)) SYNC = String(t);
    });
    var keys = Array.from(FIN.keys()).sort();
    ANCHOR = keys.length ? keys[keys.length - 1] : null;
    PERIODS = ANCHOR ? periods(ANCHOR) : null;
    CTX = (D[V.context] || [])[0] || null;
    STORE = CTX && CTX['门店名称'] ? CTX['门店名称'] : null;
    if (!STORE) {
      var finRows = D[V.fin] || [];
      for (var i = 0; i < finRows.length; i++) {
        if (finRows[i]['门店名称']) { STORE = finRows[i]['门店名称']; break; }
      }
    }
  }
  function periods(Anchor) {
    var pa = pd(Anchor), first = Anchor.slice(0, 8) + '01';
    var pm = new Date(pa.getFullYear(), pa.getMonth() - 1, 1, 12), pmLast = new Date(pa.getFullYear(), pa.getMonth(), 0, 12).getDate();
    var pmSame = dstr(new Date(pm.getFullYear(), pm.getMonth(), Math.min(pa.getDate(), pmLast), 12));
    var monthClipped = pa.getDate() > pmLast; // 上月天数不足时，本月对比改按日均
    return {
      '昨天': { cur: [Anchor, Anchor], cmp: [addDays(Anchor, -7), addDays(Anchor, -7)], cmpLabel: '上' + wd(Anchor), cmp2: [addDays(Anchor, -1), addDays(Anchor, -1)], cmp2Label: '前一天', title: md(Anchor) + ' ' + wd(Anchor), short: '这一天' },
      '近7天': { cur: [addDays(Anchor, -6), Anchor], cmp: [addDays(Anchor, -13), addDays(Anchor, -7)], cmpLabel: '前7天', title: md(addDays(Anchor, -6)) + ' – ' + md(Anchor), short: '近7天' },
      '近30天': { cur: [addDays(Anchor, -29), Anchor], cmp: [addDays(Anchor, -59), addDays(Anchor, -30)], cmpLabel: '前30天', title: md(addDays(Anchor, -29)) + ' – ' + md(Anchor), short: '近30天' },
      '本月': { cur: [first, Anchor], cmp: [dstr(pm), pmSame], cmpLabel: monthClipped ? '上月同期日均' : '上月同期', avgCompare: monthClipped, title: Number(Anchor.slice(5, 7)) + '月1日 – ' + md(Anchor), short: '本月到' + md(Anchor) }
    };
  }
  function agg(range) {
    var out = { rev: 0, orders: 0, days: 0, way: {}, ch: {}, daily: [] };
    FIN.forEach(function (e, d) {
      if (!inRange(d, range)) return;
      out.rev += e.rev; out.orders += e.orders; out.days += 1; out.daily.push(e);
      Object.keys(e.way).forEach(function (w) { addTo(out.way, w, e.way[w].rev, e.way[w].orders); });
      Object.keys(e.ch).forEach(function (c) { addTo(out.ch, c, e.ch[c].rev, e.ch[c].orders); });
    });
    out.daily.sort(function (a, b) { return a.date.localeCompare(b.date); });
    return out;
  }
  function P() { return PERIODS[S.period]; }

  /* ---------- 小组件 ---------- */
  function delta(cur, prev, label, opts) {
    opts = opts || {};
    if (num(cur) == null || num(prev) == null || (!opts.pp && prev === 0)) return '<span class="delta na' + (opts.small ? ' small' : '') + '">' + esc(label) + '无数据</span>';
    var r = opts.pp ? cur - prev : cur / prev - 1, eps = opts.pp ? 0.005 : 0.005;
    var cls = Math.abs(r) < eps ? 'flat' : r > 0 ? 'up' : 'down', arrow = cls === 'up' ? '▲' : cls === 'down' ? '▼' : '●';
    var text = opts.pp ? fmt(Math.abs(r) * 100, 1) + ' 个点' : pct(Math.abs(r));
    return '<span class="delta ' + cls + (opts.small ? ' small' : '') + '">' + arrow + ' ' + text + (label ? '<small>' + esc(label) + '</small>' : '') + '</span>';
  }
  function tick(v, max) { if (max >= 10000) return v === 0 ? '0' : fmt(v / 10000, 1) + '万'; if (max >= 1000) return v === 0 ? '0' : fmt(v / 1000, 1) + 'k'; return fmt(v); }
  function seg(key, items, selected) { return '<div class="seg" role="tablist">' + items.map(function (x) { var v = Array.isArray(x) ? x[0] : x, l = Array.isArray(x) ? x[1] : x; return '<button role="tab" data-set="' + key + '" data-value="' + esc(v) + '" class="' + (selected === v ? 'active' : '') + '" aria-selected="' + (selected === v) + '">' + esc(l) + '</button>'; }).join('') + '</div>'; }
  function section(id, title, sub, body, right) { return '<section class="sec" id="sec-' + id + '"><div class="sechead"><div><h2>' + title + '</h2>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + '</div>' + (right || '') + '</div>' + body + '</section>'; }
  function empty(text) { return '<div class="empty">' + esc(text || '这段时间没有数据') + '</div>'; }
  function bars(items, opts) {
    opts = opts || {}; if (!items.length) return empty(opts.emptyText);
    var top = Math.max.apply(null, items.map(function (x) { return x.value || 0; }).concat([0]));
    return '<div class="bars">' + items.slice(0, opts.max || 6).map(function (r, i) {
      var w = top ? Math.max(2, r.value / top * 100) : 0;
      return '<div class="barrow"><div class="barline"><span class="barlabel">' + (opts.rank ? '<span class="rk">' + (i + 1) + '</span>' : '') + esc(r.name) + '</span><span class="barval">' + esc(r.display != null ? r.display : fmt(r.value)) + (r.share != null ? '<small>' + pct(r.share, 0) + '</small>' : '') + (r.delta || '') + '</span></div><div class="track"><i style="width:' + w + '%"></i></div></div>';
    }).join('') + '</div>';
  }
  function table(headers, rs) { return '<table><thead><tr>' + headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + rs.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>'; }

  /* ---------- 首屏：成绩单 ---------- */
  function cmpValue(p, a) { return p.avgCompare ? divide(a.rev, a.days) : a.rev; }
  function scorecard() {
    var p = P(), cur = agg(p.cur), cmp = agg(p.cmp), cmp2 = p.cmp2 ? agg(p.cmp2) : null;
    if (!cur.days) return '<section class="score">' + empty(p.title + ' 没有营业数据') + '</section>';
    var m = money(cur.rev), ac = divide(cur.rev, cur.orders);
    var ways = ['堂食', '外卖'].concat(Object.keys(cur.way).filter(function (w) { return w !== '堂食' && w !== '外卖'; }));
    var split = ways.filter(function (w) { return cur.way[w]; }).map(function (w) { return { w: w, rev: cur.way[w].rev, orders: cur.way[w].orders, share: divide(cur.way[w].rev, cur.rev), prev: cmp.way[w] ? cmp.way[w].rev : null }; });
    var splitBar = '<div class="splitbar">' + split.map(function (s) { return '<i class="' + (s.w === '外卖' ? 'alt' : s.w === '堂食' ? '' : 'other') + '" style="width:' + (s.share * 100).toFixed(1) + '%"></i>'; }).join('') + '</div>';
    var splitRows = '<div class="splitrows">' + split.map(function (s) { return '<button class="splitrow" data-action="way" data-value="' + esc(s.w) + '"><span class="sw ' + (s.w === '外卖' ? 'alt' : s.w === '堂食' ? '' : 'other') + '"></span><span class="swname">' + esc(s.w) + '<small>' + pct(s.share, 0) + ' · ' + fmt(s.orders) + ' 单</small></span><span class="swval">¥' + fmt(s.rev) + delta(s.rev, s.prev, '', { small: true }) + '</span></button>'; }).join('') + '</div>';
    var meta = S.period === '昨天' ? fmt(cur.orders) + ' 单 · 客单 ¥' + fmt(ac, 1) : fmt(cur.orders) + ' 单 · 客单 ¥' + fmt(ac, 1) + ' · 日均 ¥' + fmt(divide(cur.rev, cur.days)) + '<small>（' + cur.days + ' 个营业日）</small>';
    return '<section class="score"><div class="scoretop"><span class="scorelabel">' + esc(p.title) + ' · 营业额</span><button class="link" data-action="daily">每日明细 ›</button></div>' +
      '<div class="scoreval"><span class="cur">¥</span>' + m[0] + (m[1] === '万元' ? '<span class="unit">万</span>' : '') + '</div>' +
      '<div class="deltas">' + delta(cmpValue(p, cur), cmpValue(p, cmp), p.cmpLabel) + (cmp2 ? delta(cur.rev, cmp2.rev, p.cmp2Label) : '') + '</div>' +
      '<p class="scoremeta">' + meta + '</p>' + splitBar + splitRows + '</section>';
  }

  /* ---------- 走势 ---------- */
  var currentPoints = [];
  function weekKey(d) { var dt = pd(d); dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7)); return dstr(dt); }
  function trendDaily() { var out = []; for (var i = 29; i >= 0; i--) { var d = addDays(ANCHOR, -i), e = FIN.get(d); out.push({ date: d, rev: e ? e.rev : null, orders: e ? e.orders : null }); } return out; }
  function trendWeekly() {
    var wk = group(Array.from(FIN.values()).filter(function (e) { return e.date <= ANCHOR; }), function (e) { return weekKey(e.date); }).map(function (g) {
      var end = addDays(g.name, 6) < ANCHOR ? addDays(g.name, 6) : ANCHOR, expected = Math.round((pd(end) - pd(g.name)) / 86400000) + 1;
      return { week: g.name, days: g.rows.length, expected: expected, rev: sum(g.rows, 'rev'), orders: sum(g.rows, 'orders'), avg: divide(sum(g.rows, 'rev'), g.rows.length) };
    }).sort(function (a, b) { return a.week.localeCompare(b.week); });
    return wk.slice(-8);
  }
  function lineChart(points) {
    currentPoints = points;
    var vals = points.map(function (p) { return num(p.rev); }), valid = vals.filter(function (x) { return x != null; });
    if (!valid.length) return empty('近 30 天没有营业数据');
    var W = 340, H = 150, l = 38, r = 8, t = 10, b = 24, max = Math.max.apply(null, valid) * 1.12 || 1;
    var x = function (i) { return l + (points.length === 1 ? (W - l - r) / 2 : i / (points.length - 1) * (W - l - r)); }, y = function (v) { return H - b - v / max * (H - t - b); };
    var sel = S.point == null ? points.length - 1 : Math.min(S.point, points.length - 1);
    while (sel > 0 && vals[sel] == null) sel--;
    var path = vals.map(function (v, i) { return v == null ? '' : (i === 0 || vals[i - 1] == null ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    var avg = vals.map(function (_, i) { var win = vals.slice(Math.max(0, i - 6), i + 1).filter(function (v) { return v != null; }); return i >= 6 && win.length >= 4 ? win.reduce(function (a, b) { return a + b; }, 0) / win.length : null; });
    var avgPath = avg.map(function (v, i) { return v == null ? '' : (i === 0 || avg[i - 1] == null ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    var sv = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="近30天营业额走势">';
    [0, 0.5, 1].forEach(function (q) { var v = max / 1.12 * q; sv += '<line class="grid" x1="' + l + '" x2="' + (W - r) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="axis" x="' + (l - 5) + '" y="' + (y(v) + 3.5).toFixed(1) + '" text-anchor="end">' + tick(v, max) + '</text>'; });
    if (avgPath) sv += '<path d="' + avgPath + '" class="avgline"/>';
    sv += '<path d="' + path + '" class="mainline"/>';
    points.forEach(function (p, i) { if (vals[i] != null && pd(p.date).getDay() === 6) sv += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(vals[i]).toFixed(1) + '" r="2.2" class="satdot"/>'; });
    [0, Math.floor((points.length - 1) / 2), points.length - 1].forEach(function (i) { sv += '<text class="axis" x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + md(points[i].date) + '</text>'; });
    if (vals[sel] != null) sv += '<line x1="' + x(sel).toFixed(1) + '" x2="' + x(sel).toFixed(1) + '" y1="' + t + '" y2="' + (H - b) + '" class="cursor"/><circle cx="' + x(sel).toFixed(1) + '" cy="' + y(vals[sel]).toFixed(1) + '" r="5" class="seldot"/>';
    sv += '</svg>';
    var p = points[sel], same = FIN.get(addDays(p.date, -7));
    return '<div class="chart">' + sv + '</div><input class="range" id="trend-range" type="range" min="0" max="' + (points.length - 1) + '" step="1" value="' + sel + '" aria-label="逐日查看">' +
      '<div class="point"><span>' + md(p.date) + ' ' + wd(p.date) + '</span><b>¥' + fmt(p.rev) + '<small> · ' + fmt(p.orders) + ' 单</small></b><span class="pointcmp">' + (same ? delta(p.rev, same.rev, '上' + wd(p.date), { small: true }) : '<span class="delta na small">上周同日无数据</span>') + '</span></div>' +
      '<div class="legend"><span><i class="sw main"></i>每日营业额</span><span><i class="sw avg"></i>7 日均线</span><span><i class="sw sat"></i>周六</span></div>';
  }
  function barChart(weeks) {
    if (!weeks.length) return empty();
    var W = 340, H = 150, l = 38, r = 8, t = 18, b = 26, max = Math.max.apply(null, weeks.map(function (w) { return w.avg || 0; })) * 1.15 || 1;
    var bw = (W - l - r) / weeks.length, y = function (v) { return H - b - v / max * (H - t - b); };
    var sv = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="近8周日均营业额">';
    [0, 0.5, 1].forEach(function (q) { var v = max / 1.15 * q; sv += '<line class="grid" x1="' + l + '" x2="' + (W - r) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="axis" x="' + (l - 5) + '" y="' + (y(v) + 3.5).toFixed(1) + '" text-anchor="end">' + tick(v, max) + '</text>'; });
    weeks.forEach(function (w, i) { var X = l + i * bw + bw * 0.18, wid = bw * 0.64, last = i === weeks.length - 1; sv += '<rect x="' + X.toFixed(1) + '" y="' + y(w.avg).toFixed(1) + '" width="' + wid.toFixed(1) + '" height="' + (H - b - y(w.avg)).toFixed(1) + '" rx="2" class="bar' + (last ? ' cur' : '') + (w.expected < 7 ? ' partial' : '') + '"/><text class="axis" x="' + (X + wid / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + w.week.slice(5).replace('-', '/') + '</text><text class="val" x="' + (X + wid / 2).toFixed(1) + '" y="' + (y(w.avg) - 4).toFixed(1) + '" text-anchor="middle">' + tick(w.avg, max) + '</text>'; });
    sv += '</svg>';
    var last = weeks[weeks.length - 1], prev = weeks[weeks.length - 2];
    var weekNote = last.expected < 7 ? ' · 才 ' + last.expected + ' 天，不是完整周' : last.days < 7 ? ' · 7 天里营业 ' + last.days + ' 天' : ' · 完整 7 天';
    return '<div class="chart">' + sv + '</div><div class="point"><span>' + md(last.week) + ' 起这周<small>' + weekNote + '</small></span><b>日均 ¥' + fmt(last.avg) + '</b><span class="pointcmp">' + (prev ? delta(last.avg, prev.avg, '比上周日均', { small: true }) : '') + '</span></div><div class="legend"><span>每周按有营业的天数算日均，周一起算</span></div>';
  }
  function trend() {
    var best = trendDaily().filter(function (p) { return p.rev != null; }).sort(function (a, b) { return b.rev - a.rev; })[0];
    var body = S.grain === 'day' ? lineChart(trendDaily()) : barChart(trendWeekly());
    var sub = best ? '近 30 天最好的一天：' + md(best.date) + ' ' + wd(best.date) + ' ¥' + fmt(best.rev) : '';
    return section('trend', '生意走势', sub, body, seg('grain', [['day', '近30天'], ['week', '近8周']], S.grain));
  }

  /* ---------- 跟其他门店比 ---------- */
  function peerData() {
    var rs = (D[V.peer] || []).map(function (r) { var days = num(r['营业天数']) || 0, rev = num(r['营业额']) || 0; return { name: r['门店名称'], branch: r['分公司'], city: r['地理城市'], type: r['门店类型'], rev: rev, orders: num(r['订单数']) || 0, days: days, avg: days ? rev / days : null }; }).filter(function (x) { return x.avg != null && x.days > 0; });
    var me = STORE ? rs.filter(function (x) { return x.name === STORE; })[0] : null;
    return { rs: rs, me: me };
  }
  function peer() {
    var pdta = peerData(), rs = pdta.rs, me = pdta.me;
    if (!rs.length) return section('peer', '跟其他门店比', '', empty('对比数据暂未返回'));
    if (!me) return section('peer', '跟其他门店比', '近 7 天日均营业额，只看名次和中位数', empty((STORE || '这家店') + '暂时无法对比'));
    var groups = [{ key: 'branch', label: me.branch || '本分公司' }, { key: 'city', label: me.city || '同城' }];
    if (me.type) groups.push({ key: 'type', label: me.type + '（全国）' });
    var truncated = rs.length >= viewLimit(V.peer);
    var body = '<div class="peers">' + groups.map(function (g) {
      var members = rs.filter(function (x) { return x[g.key] === me[g.key]; }), n = members.length;
      if (n < 3) return '';
      var rank = 1 + members.filter(function (x) { return x.avg > me.avg; }).length, med = median(members.map(function (x) { return x.avg; })), top = Math.max(me.avg, med), pctl = rank / n;
      var tier = pctl <= 0.1 ? '前 10%' : pctl <= 0.25 ? '前 25%' : pctl <= 0.5 ? '前 50%' : pctl <= 0.75 ? '后 50%' : '后 25%';
      return '<button class="peer" data-action="peer" data-value="' + g.key + '"><div class="peerhead"><span class="peername">' + esc(g.label) + '<small>近 7 天日均营业额</small></span><span class="peerrank"><b>第 ' + fmt(rank) + '</b><small>' + tier + '</small></span></div>' +
        '<div class="cmpbars"><div class="cmprow"><span>你</span><div class="track me"><i style="width:' + (me.avg / top * 100).toFixed(1) + '%"></i></div><b>¥' + fmt(me.avg) + '</b></div><div class="cmprow"><span>中位</span><div class="track"><i style="width:' + (med / top * 100).toFixed(1) + '%"></i></div><b>¥' + fmt(med) + '</b></div></div></button>';
    }).join('') + '</div>' + (truncated ? '<p class="note">对比名单达到取数上限，名次可能不完整。</p>' : '');
    return section('peer', '跟其他门店比', '近 7 天日均营业额 · 只显示你的名次和中位数', body);
  }

  /* ---------- 生意从哪来：渠道 / 时段 ---------- */
  function channels() {
    var p = P(), cur = agg(p.cur), cmp = agg(p.cmp);
    var items = Object.keys(cur.ch).map(function (c) { return { name: c, value: cur.ch[c].rev, display: '¥' + fmt(cur.ch[c].rev), share: divide(cur.ch[c].rev, cur.rev), delta: delta(cur.ch[c].rev, cmp.ch[c] ? cmp.ch[c].rev : null, '', { small: true }) }; }).sort(function (a, b) { return b.value - a.value; });
    return section('channel', '钱从哪个渠道来', esc(p.short) + ' · 和' + esc(p.cmpLabel) + '比', bars(items, { max: 6, rank: true }));
  }
  function hours() {
    var hrs = D[V.hours] || [], r7 = [addDays(ANCHOR, -6), ANCHOR], r7p = [addDays(ANCHOR, -13), addDays(ANCHOR, -7)];
    var SLOT = { '早餐': '6–10点', '午餐': '10–14点', '下午茶': '14–17点', '晚餐': '17–21点', '宵夜': '21点–次日6点' };
    var order = ['早餐', '午餐', '下午茶', '晚餐', '宵夜', '其他'];
    var items = order.map(function (slot) {
      var c = sum(hrs.filter(function (r) { return r['下单时段'] === slot && inRange(date(r['订单日期']), r7); }), '订单数');
      var pv = sum(hrs.filter(function (r) { return r['下单时段'] === slot && inRange(date(r['订单日期']), r7p); }), '订单数');
      return { name: SLOT[slot] ? slot + '（' + SLOT[slot] + '）' : slot, value: c, display: fmt(c) + ' 单', delta: pv >= 10 ? delta(c, pv, '', { small: true }) : '' };
    }).filter(function (x) { return x.value >= 10; }).sort(function (a, b) { return b.value - a.value; });
    var total = sum(items, 'value'); items.forEach(function (x) { x.share = divide(x.value, total); });
    return section('hours', '哪个饭点最忙', '近 7 天订单数（订单明细口径）· 按单量从高到低 · 和前 7 天比', bars(items, { max: 6, rank: true }));
  }

  /* ---------- 顾客 ---------- */
  function periodMembers() {
    if (S.period === '昨天') {
      return sum((D[V.member] || []).filter(function (r) { return date(r['订单日期']) === ANCHOR; }), '消费会员数');
    }
    var spec = S.period === '近7天' ? [V.member7, '消费会员_近7天'] : S.period === '近30天' ? [V.member30, '消费会员_近30天'] : [V.memberMonth, '消费会员_本月'];
    return spec[0] < 0 ? null : num(((D[spec[0]] || [])[0] || {})[spec[1]]);
  }
  function customers() {
    var p = P(), no = D[V.newold] || [];
    var inP = function (rg) { return no.filter(function (r) { return inRange(date(r['订单日期']), rg); }); };
    var pick = function (rg) {
      var rs = inP(rg), t = sum(rs, '顾客人次'), nw = sum(rs.filter(function (r) { return r['顾客属性'] === '新客'; }), '顾客人次');
      var memOrd = sum(rs.filter(function (r) { return r['是否会员'] === '会员'; }), '订单数');
      return { total: t, nw: nw, old: t - nw, share: divide(nw, t), memShare: divide(memOrd, sum(rs, '订单数')) };
    };
    var cur = pick(p.cur), cmp = pick(p.cmp);
    var memVal = periodMembers(), memLabel = p.short + ' · 卡号去重';
    var status = group((D[V.status] || []), '顾客状态').map(function (g) { return { name: g.name || '未知', value: sum(g.rows, '顾客数') }; }).sort(function (a, b) { return b.value - a.value; });
    var stTotal = sum(status, 'value'); status.forEach(function (s) { s.share = divide(s.value, stTotal); s.display = fmt(s.value) + ' 人'; });
    var mix = [
      { name: '新客', value: cur.nw, display: fmt(cur.nw) + ' 人次', share: cur.share },
      { name: '老客', value: cur.old, display: fmt(cur.old) + ' 人次', share: divide(cur.old, cur.total) }
    ];
    var kpis = '<div class="kpis"><div class="kpi"><span>消费会员<small>' + esc(memLabel) + '</small></span><b>' + fmt(memVal) + '<small>人</small></b></div>' +
      '<div class="kpi"><span>会员订单占比<small>' + esc(p.short) + ' · 新老客表</small></span><b>' + pct(cur.memShare, 0) + '</b>' + delta(cur.memShare, cmp.memShare, p.cmpLabel, { small: true, pp: true }) + '</div>' +
      '<div class="kpi"><span>新客占比<small>' + esc(p.short) + '</small></span><b>' + pct(cur.share, 0) + '</b>' + delta(cur.share, cmp.share, p.cmpLabel, { small: true, pp: true }) + '</div>' +
      '<div class="kpi"><span>到店人次<small>' + esc(p.short) + ' · 每日累加</small></span><b>' + fmt(cur.total) + '</b>' + delta(cur.total, cmp.total, p.cmpLabel, { small: true }) + '</div></div>';
    return section('customers', '顾客与会员', '消费会员是所选周期内卡号去重；到店人次是每日累加',
      kpis + '<h3>新老客</h3><p class="sub">按下单当天的身份；人次是每日人数累加</p>' + bars(mix, { max: 2 }) +
      '<h3>现在还在的顾客 <span class="badge">当前快照</span></h3><p class="sub">按最后一单在本店，不随上面的周期变</p>' + bars(status, { max: 6 }));
  }
  function pickMember(rs, name) { return rs.filter(function (r) { return r['是否会员'] === name; })[0] || {}; }
  function memberFreq(r) { return num(r['消费频次']) != null ? num(r['消费频次']) : divide(r['订单数'], r['消费人数']); }
  function memberVs() {
    var rs = D[V.membase] || [];
    if (!rs.length) return '';
    var mem = pickMember(rs, '会员'), non = pickMember(rs, '非会员');
    var fM = memberFreq(mem), fN = memberFreq(non);
    var revM = num(mem['营收贡献']), revN = num(non['营收贡献']);
    var nM = num(mem['消费人数']), nN = num(non['消费人数']);
    var oM = num(mem['订单数']), oN = num(non['订单数']);
    var aovM = divide(revM, oM), aovN = divide(revN, oN);
    var spendM = divide(revM, nM), spendN = divide(revN, nN);
    var tot = (revM || 0) + (revN || 0);
    var win = PERIODS ? md(addDays(ANCHOR, -29)) + ' – ' + md(ANCHOR) : '近 30 天';
    var revBars = [
      { name: '会员', value: revM || 0, display: '¥' + fmt(revM), share: divide(revM, tot) },
      { name: '非会员', value: revN || 0, display: '¥' + fmt(revN), share: divide(revN, tot) }
    ];
    function vsCard(title, freq, people, spend, aov) {
      return '<div class="vscol"><span>' + title + '</span><b>' + fmt(freq, 1) + '<small>次</small></b><em>人均到店 · ' + fmt(people) + ' 人</em>' +
        '<div class="vsrow"><div><strong class="subn">¥' + fmt(spend, 0) + '</strong><em>人均贡献</em></div>' +
        '<div class="side"><strong>¥' + fmt(aov, 0) + '</strong><em>客单价</em></div></div></div>';
    }
    var vs = '<div class="vs">' + vsCard('会员', fM, nM, spendM, aovM) + vsCard('非会员', fN, nN, spendN, aovN) + '</div>';
    var liftF = (num(fM) != null && num(fN) != null) ? fM - fN : null;
    var liftS = (num(spendM) != null && num(spendN) != null) ? spendM - spendN : null;
    var note = '<p class="note">会员人均' + (liftF == null ? '' : (liftF >= 0 ? '多 ' : '少 ') + fmt(Math.abs(liftF), 1) + ' 次') +
      (liftS == null ? '' : '、' + (liftS >= 0 ? '多 ¥' : '少 ¥') + fmt(Math.abs(liftS), 0)) +
      '。金额是该组营业额，不是比非会员多赚的增量。人数少时，合计不一定更高。</p>';
    return section('membervs', '会员和非会员 <span class="badge">近 30 天</span>',
      esc(win) + ' · 可识别顾客 · 频次 = 去重订单 ÷ 去重人数 · 不跟上面的周期走',
      vs + '<p class="sub">组内营业额</p>' + bars(revBars, { max: 2 }) + note);
  }

  /* ---------- 私域 ---------- */
  function privateDomain() {
    var p = P(), fri = (D[V.friends] || [])[0] || {}, grp = (D[V.groups] || [])[0] || {};
    var fd = D[V.frienddaily] || [], gd = D[V.groupdaily] || [], cp = D[V.coupons] || [];
    var rg = p.cur;
    var fAdd = sum(fd.filter(function (r) { return inRange(date(r['添加日期']), rg); }), '添加好友'), gAdd = sum(gd.filter(function (r) { return inRange(date(r['入群日期']), rg); }), '入群人数'), cpN = sum(cp.filter(function (r) { return inRange(date(r['核销日期']), rg); }), '核销券数');
    var fAddP = sum(fd.filter(function (r) { return inRange(date(r['添加日期']), p.cmp); }), '添加好友'), cpP = sum(cp.filter(function (r) { return inRange(date(r['核销日期']), p.cmp); }), '核销券数');
    var kpis = '<div class="kpis"><div class="kpi"><span>在联好友<small>当前存量 · 不随周期变</small></span><b>' + fmt(fri['在联好友']) + '<small>人</small></b></div>' +
      '<div class="kpi"><span>在群人数<small>当前存量 · 不随周期变</small></span><b>' + fmt(grp['在群人数']) + '<small>人</small></b></div>' +
      '<div class="kpi"><span>新加好友<small>' + esc(p.short) + ' · 人次</small></span><b>' + fmt(fAdd) + '</b>' + delta(fAdd, fAddP, p.cmpLabel, { small: true }) + '</div>' +
      '<div class="kpi"><span>券核销<small>' + esc(p.short) + '</small></span><b>' + fmt(cpN) + '<small>张</small></b>' + delta(cpN, cpP, p.cmpLabel, { small: true }) + '</div></div>';
    var health = '<div class="health"><div><span>好友流失率</span><b>' + pct(fri['流失率'], 0) + '</b></div><div><span>退群率</span><b>' + pct(grp['退群率'], 0) + '</b></div></div>';
    var note = '<p class="note">本期入群 ' + fmt(gAdd) + ' 人次（每日累加）。好友和群是两套名单，不能相除当转化。</p>';
    return section('private', '私域', '存量和本期新增分开看', kpis + health + note);
  }
  function coupons() {
    var p = P(), cp = D[V.coupons] || [];
    var types = group(cp.filter(function (r) { return inRange(date(r['核销日期']), p.cur); }), '券类型名称').map(function (g) { return { name: g.name, value: sum(g.rows, '核销券数'), display: fmt(sum(g.rows, '核销券数')) + ' 张' }; }).sort(function (a, b) { return b.value - a.value; });
    var tTotal = sum(types, 'value'); types.forEach(function (t) { t.share = divide(t.value, tTotal); });
    return section('coupons', '哪些券用得最多', esc(p.short) + ' · 按核销张数', bars(types, { max: 8, rank: true, emptyText: '这段时间没有券核销' }));
  }

  /* ---------- 商品 ---------- */
  function products() {
    var pr = group(D[V.products] || [], '产品').map(function (g) { return { name: g.name, value: sum(g.rows, '订单数') }; }).sort(function (a, b) { return b.value - a.value; });
    var pTotal = sum(pr, 'value'); pr.forEach(function (x) { x.share = divide(x.value, pTotal); x.display = fmt(x.value) + ' 单'; });
    var soup = group((D[V.soup] || []).filter(function (r) { return r['取餐方式'] === S.soupWay; }), '口味').map(function (g) { return { name: g.name || '未命名', value: sum(g.rows, '订单数') }; }).sort(function (a, b) { return b.value - a.value; });
    var sTotal = sum(soup, 'value'); soup.forEach(function (x) { x.share = divide(x.value, sTotal); x.display = fmt(x.value) + ' 单'; });
    return section('products', '卖得最好的', '近 7 天堂食点单次数', '<h3>堂食点得最多的菜</h3>' + bars(pr, { max: S.open.products ? 15 : 5, rank: true }) + (pr.length > 5 ? '<button class="toggle" data-toggle="products">' + (S.open.products ? '收起 ▴' : '看前 15 名 ▾') + '</button>' : '') + '<div class="rowhead"><h3>汤底口味</h3>' + seg('soupWay', ['堂食', '外卖'], S.soupWay) + '</div>' + bars(soup, { max: 5, rank: true }) + '<p class="note">一单可点多个菜，菜的订单数加起来会大于总订单数。已排除餐巾纸、打包盒等耗材。</p>');
  }

  /* ---------- 口径说明 ---------- */
  function methods() {
    return '<p><b>数据到哪天</b>：以财务表最新有数据的日期为"昨天"。财务数据一般在次日早上 6 点左右同步完成；如果显示的日期不是昨天，说明还没同步。</p>' +
      '<p><b>营业额、订单数、客单价</b>：来自 DWS 财务订单表，含堂食和外卖各渠道。客单价 = 营业额 ÷ 订单数。日均按有营业的天数算，不把停业日当 0。</p>' +
      '<p><b>对比</b>：昨天对比"上周同一天"和"前一天"；近 7 天对比前 7 天；近 30 天对比前 30 天；本月对比上月 1 日到同一天（上月天数不够时改比日均）。涨跌 0.5% 以内显示为持平。</p>' +
      '<p><b>跟其他门店比</b>：按分公司、地理城市、门店类型看近 7 天日均营业额的名次和中位数。不展示对比组有多少家门店，也不展示其他门店名称。</p>' +
      '<p><b>顾客与会员</b>：消费会员按所选周期内会员卡号去重，不是每日人数的日均或加总。会员订单占比和新老客来自同一张新老客表，人次是每日累加。"现在还在的顾客"是最后一单在本店的当前快照。</p>' +
      '<p><b>会员 vs 非会员</b>：固定看近 30 天，不跟顶部周期走。来自单独的顾客标识聚合表：消费频次 = 该组去重订单 ÷ 该组去重人数；客单价 = 该组营业额 ÷ 该组去重订单；人均贡献 = 该组营业额 ÷ 该组去重人数。组内营业额是可识别顾客里该组的金额，不是增量。没有这张表就不画。</p>' +
      '<p><b>私域</b>：在联好友、在群人数、流失率、退群率是当前存量。新加好友、入群、券核销按事件日期跟周期走，合计是人次。好友和群不能相除算转化。</p>' +
      '<p><b>券</b>：按核销张数看所选周期里用得最多的券类型，跟顶部周期走。</p>' +
      '<p><b>饭点</b>：按下单整点分桶。早餐 6–10 点，午餐 10–14 点，下午茶 14–17 点，晚餐 17–21 点，宵夜 21 点到次日 6 点。条按近 7 天订单数从高到低排，最忙的在最上面。</p>' +
      '<p><b>商品</b>：堂食产品按订单号去重，近 7 天；已排除饮品赠品、餐巾纸、打包耗材。汤底排除"未识别"。</p>';
  }

  /* ---------- 弹层 ---------- */
  var beforeModal = null;
  function modal(title, body) {
    beforeModal = document.activeElement;
    var ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = '<section class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="sheethead"><h2>' + esc(title) + '</h2><button data-close="1" class="iconbtn" aria-label="关闭">✕</button></div><div class="sheetbody">' + body + '</div><button class="close" data-close="1">知道了</button></section>';
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-close]')) { ov.remove(); if (beforeModal) beforeModal.focus(); } });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') { ov.remove(); if (beforeModal) beforeModal.focus(); } });
    document.body.appendChild(ov); ov.querySelector('button').focus();
  }
  function dailySheet() {
    var p = P(), cur = agg(p.cur), rs = cur.daily.slice().reverse().map(function (e) { var same = FIN.get(addDays(e.date, -7)); return [md(e.date) + ' ' + wd(e.date), fmt(e.rev), fmt(e.orders), fmt(divide(e.rev, e.orders), 1), same ? (e.rev / same.rev - 1 >= 0 ? '+' : '−') + pct(Math.abs(e.rev / same.rev - 1), 0) : '—']; });
    modal(p.title + ' 每日明细', table(['日期', '营业额/元', '订单', '客单', '比上周'], rs));
  }
  function waySheet(w) {
    var p = P(), cur = agg(p.cur), cmp = agg(p.cmp);
    var chs = Object.keys(cur.ch).map(function (c) { return c; });
    var rs = (D[V.fin] || []).filter(function (r) { return r['取餐方式'] === w && inRange(date(r['订单日期']), p.cur); });
    var byCh = group(rs, '渠道名称').map(function (g) { return { name: g.name || '其他', rev: sum(g.rows, '营业额'), orders: sum(g.rows, '订单数') }; }).sort(function (a, b) { return b.rev - a.rev; });
    var prevRs = (D[V.fin] || []).filter(function (r) { return r['取餐方式'] === w && inRange(date(r['订单日期']), p.cmp); });
    var prevBy = {}; group(prevRs, '渠道名称').forEach(function (g) { prevBy[g.name || '其他'] = sum(g.rows, '营业额'); });
    modal(w + ' · ' + p.title, '<p>' + esc(w) + '营业额 ¥' + fmt(cur.way[w] ? cur.way[w].rev : 0) + '，' + fmt(cur.way[w] ? cur.way[w].orders : 0) + ' 单，客单 ¥' + fmt(divide(cur.way[w] && cur.way[w].rev, cur.way[w] && cur.way[w].orders), 1) + '。' + esc(p.cmpLabel) + ' ¥' + fmt(cmp.way[w] ? cmp.way[w].rev : 0) + '。</p>' + table(['渠道', '营业额/元', '订单', '比' + p.cmpLabel], byCh.map(function (c) { var pv = prevBy[c.name]; return [c.name, fmt(c.rev), fmt(c.orders), pv ? (c.rev / pv - 1 >= 0 ? '+' : '−') + pct(Math.abs(c.rev / pv - 1), 0) : '—']; })));
  }
  function peerSheet(key) {
    var pdta = peerData(), me = pdta.me; if (!me) return;
    var labels = { branch: me.branch, city: me.city, type: me.type + '（全国）' };
    var members = pdta.rs.filter(function (x) { return x[key] === me[key]; }), avgs = members.map(function (x) { return x.avg; });
    var rank = 1 + members.filter(function (x) { return x.avg > me.avg; }).length;
    var acMe = divide(me.rev, me.orders), acMed = median(members.map(function (x) { return divide(x.rev, x.orders); }).filter(function (x) { return x != null; }));
    var ordMed = median(members.map(function (x) { return x.orders / x.days; }));
    modal('跟' + labels[key] + '比', '<p>近 7 天（' + md(addDays(ANCHOR, -6)) + ' – ' + md(ANCHOR) + '）日均营业额排第 ' + fmt(rank) + '。</p>' +
      table(['', '你', '中位', '前 25%'], [['日均营业额', '¥' + fmt(me.avg), '¥' + fmt(quantile(avgs, 0.5)), '¥' + fmt(quantile(avgs, 0.75))], ['日均订单', fmt(me.orders / me.days, 0), fmt(ordMed, 0), '—'], ['客单价', '¥' + fmt(acMe, 1), '¥' + fmt(acMed, 1), '—']]) +
      '<p class="note">"前 25%"是同组里排在前四分之一位置的日均营业额。不显示其他门店名称，也不显示这组有多少家店。</p>');
  }
  /* ---------- 渲染 ---------- */
  function header() {
    var today = (window.SCORECARD_FIXTURE && window.SCORECARD_FIXTURE.today) || dstr(new Date());
    var yesterday = addDays(today, -1), fresh = ANCHOR === yesterday;
    var sub = fresh ? '数据到昨天 ' + md(ANCHOR) + ' ' + wd(ANCHOR) : '数据到 ' + md(ANCHOR) + ' ' + wd(ANCHOR) + '，昨天的还没同步';
    var storeBar = '';
    if (window.SCORECARD_FIXTURE) {
      storeBar = '<div class="seg storeseg" role="tablist">' + window.SCORECARD_FIXTURE.storeNames.map(function (n) {
        return '<button type="button" role="tab" data-set="demoStore" data-value="' + esc(n) + '" class="' + (S.demoStore === n ? 'active' : '') + '">' + esc(n) + '</button>';
      }).join('') + '</div>';
    }
    return '<header class="top"><div><h1>' + esc(STORE || '所选门店') + '</h1><p class="' + (fresh ? 'fresh' : 'stale') + '">' + esc(sub) + '</p></div><button class="iconbtn" data-action="methods" aria-label="口径说明">i</button></header>' + storeBar + seg('period', ['昨天', '近7天', '近30天', '本月'], S.period);
  }
  function render() {
    var scroll = A.scrollTop;
    if (!ANCHOR) { A.innerHTML = '<main class="shell"><header class="top"><div><h1>' + esc(STORE || '所选门店') + '</h1><p class="stale">近 70 天没有财务数据</p></div></header>' + empty((STORE || '所选门店') + '近 70 天没有营业数据。可换一家门店，或等财务表同步后再看。') + '</main>'; return; }
    var truncated = D.some(function (r, i) { return r.length >= viewLimit(i); });
    A.innerHTML = '<main class="shell">' + header() + (truncated ? '<div class="warn">部分数据达到取数上限，个别数字可能不完整。</div>' : '') +
      scorecard() + trend() + peer() + channels() + customers() + memberVs() + privateDomain() + coupons() + hours() + products() +
      '<footer class="foot"><span>财务数据同步于 ' + esc(SYNC ? SYNC.slice(0, 16) : '—') + ' · 读取 ' + esc(S.lastRead || '—') + '</span><button class="link" data-action="methods">口径说明</button></footer></main>';
    A.scrollTop = scroll;
  }
  A.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.set) {
      S[b.dataset.set] = b.dataset.value;
      if (b.dataset.set === 'demoStore' && window.SCORECARD_FIXTURE) { applyDemoStore(S.demoStore); return; }
      if (b.dataset.set === 'grain') S.point = null;
      render();
      return;
    }
    if (b.dataset.toggle) { S.open[b.dataset.toggle] = !S.open[b.dataset.toggle]; render(); return; }
    var a = b.dataset.action;
    if (a === 'methods') modal('这些数字怎么来的', methods());
    if (a === 'daily') dailySheet();
    if (a === 'way') waySheet(b.dataset.value);
    if (a === 'peer') peerSheet(b.dataset.value);
  });
  A.addEventListener('input', function (e) {
    if (e.target.id === 'trend-range') {
      S.point = Number(e.target.value);
      var holder = e.target.closest('.sec'), tmp = document.createElement('div'); tmp.innerHTML = lineChart(currentPoints);
      holder.querySelector('.chart').replaceWith(tmp.querySelector('.chart')); holder.querySelector('.point').replaceWith(tmp.querySelector('.point'));
    }
  });
  function receive(data) {
    if (!Array.isArray(data)) { A.innerHTML = empty('数据尚未就绪，请刷新页面后重试'); return; }
    V = detectV(data);
    D = data.map(rows); S.lastRead = new Date().toLocaleString('zh-CN', { hour12: false }); S.point = null;
    try { buildFinance(); render(); } catch (err) { A.innerHTML = empty('渲染暂未完成，请刷新页面重试'); console.error('owner dashboard render failed', err); }
  }
  window.__OWNER = { receive: receive, getData: function () { return D; }, views: function () { return V; }, state: S, agg: agg, periods: function () { return PERIODS; } };
  function applyDemoStore(name) {
    var pack = window.SCORECARD_FIXTURE && window.SCORECARD_FIXTURE.stores[name];
    if (!pack) { A.innerHTML = empty('演示数据缺失'); return; }
    S.demoStore = name;
    receive(pack.views);
  }
  if (window.SCORECARD_FIXTURE) {
    applyDemoStore(window.SCORECARD_FIXTURE.storeNames[0]);
  } else if (typeof GDPlugin === 'function') {
    new GDPlugin().init(receive);
  } else {
    A.innerHTML = empty('没有数据源：离线打开请用生成后的 HTML，或在观远页里由 GDPlugin 注入');
  }
})();
