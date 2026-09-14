/* 门店手机成绩单 V2 · 脱敏离线示例；业务规则与页面交互均不调用大模型。 */
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
  var S = { period: '昨天', grain: 'day', point: null, soupWay: '堂食', open: {}, lastRead: null, demoStore: null, demoBranch: null };
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
  function detailTitle(kind) { return (S.period === '昨天' ? '昨日' : S.period) + (kind === 'coupon' ? '转化明细' : '明细'); }

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
  function table(headers, rs, opts) {
    opts = opts || {};
    return '<table' + (opts.cls ? ' class="' + esc(opts.cls) + '"' : '') + '><thead><tr>' + headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + rs.map(function (r) {
      var cls = '', cells = r;
      if (r && !Array.isArray(r) && r.cells) { cls = r.cls ? ' class="' + esc(r.cls) + '"' : ''; cells = r.cells; }
      return '<tr' + cls + '>' + cells.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table>';
  }

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
    return '<section class="score"><div class="scoretop"><span class="scorelabel">' + esc(p.title) + ' · 营业额</span><button class="link" data-action="daily">' + esc(detailTitle()) + ' ›</button></div>' +
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
    var W = 340, H = 170, l = 38, r = 8, t = 18, b = 46, max = Math.max.apply(null, weeks.map(function (w) { return w.avg || 0; })) * 1.15 || 1;
    var bw = (W - l - r) / weeks.length, y = function (v) { return H - b - v / max * (H - t - b); };
    var sv = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="近8周日均营业额">';
    [0, 0.5, 1].forEach(function (q) { var v = max / 1.15 * q; sv += '<line class="grid" x1="' + l + '" x2="' + (W - r) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="axis" x="' + (l - 5) + '" y="' + (y(v) + 3.5).toFixed(1) + '" text-anchor="end">' + tick(v, max) + '</text>'; });
    weeks.forEach(function (w, i) { var X = l + i * bw + bw * 0.18, wid = bw * 0.64, cx = (X + wid / 2).toFixed(1), last = i === weeks.length - 1; sv += '<rect x="' + X.toFixed(1) + '" y="' + y(w.avg).toFixed(1) + '" width="' + wid.toFixed(1) + '" height="' + (H - b - y(w.avg)).toFixed(1) + '" rx="2" class="bar' + (last ? ' cur' : '') + (w.expected < 7 ? ' partial' : '') + '"/><text class="axis week-date" x="' + cx + '" y="' + (H - b + 18) + '" text-anchor="middle"><tspan x="' + cx + '">' + Number(w.week.slice(5, 7)) + '月</tspan><tspan x="' + cx + '" dy="18">' + Number(w.week.slice(8, 10)) + '日</tspan></text><text class="val" x="' + cx + '" y="' + (y(w.avg) - 4).toFixed(1) + '" text-anchor="middle">' + tick(w.avg, max) + '</text>'; });
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
        '<div class="cmpbars"><div class="cmprow"><span>本店</span><div class="track me"><i style="width:' + (me.avg / top * 100).toFixed(1) + '%"></i></div><b>¥' + fmt(me.avg) + '</b></div><div class="cmprow"><span>中位</span><div class="track"><i style="width:' + (med / top * 100).toFixed(1) + '%"></i></div><b>¥' + fmt(med) + '</b></div></div></button>';
    }).join('') + '</div>' + (truncated ? '<p class="note">对比名单达到取数上限，名次可能不完整。</p>' : '');
    return section('peer', '跟其他门店比', '近 7 天日均营业额 · 只显示本店的名次和中位数', body);
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
  function isMember(r) { var v = String(r['是否会员'] || ''); return v === '会员' || v === '是'; }
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
      var memOrd = sum(rs.filter(isMember), '订单数');
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
      '<h3>近期堂食的顾客 <span class="badge">当前快照</span></h3><p class="sub">按最后一单在本店，不随上面的周期变</p>' + bars(status, { max: 6 }));
  }
  function pickMember(rs, names) {
    var set = Array.isArray(names) ? names : [names];
    return rs.filter(function (r) { return set.indexOf(String(r['是否会员'] || '')) !== -1; })[0] || {};
  }
  function memberFreq(r) { return num(r['消费频次']) != null ? num(r['消费频次']) : divide(r['订单数'], r['消费人数']); }
  function memberAnomalyData() {
    var raw = CTX && CTX['会员异常诊断'], d;
    if (typeof raw !== 'string' || raw.charAt(0) !== '{') return null;
    try { d = JSON.parse(raw); } catch (e) { return null; }
    if (d.version !== 1 || !(d.orders >= 3) || !(d.days >= 2) || !(d.amount >= 1000) || !(d.share >= .2)) return null;
    return d;
  }
  function memberAnomalyWarning() {
    var d = memberAnomalyData(); if (!d) return '';
    var evidence = '同一会员有 ' + fmt(d.orders) + ' 笔高额POS订单，分布在 ' + fmt(d.days) + ' 天';
    if (num(d.unit) != null && d.unit > 0) evidence += '，每笔均为 ¥' + fmt(d.unit);
    evidence += '，占会员金额 ' + pct(d.share, 0) + '。';
    var detail = (d.product && d.product !== '多项商品' ? '记录商品：' + d.product + '；' : '') + '支付记录：' + (d.payment || '未标记') + '。';
    return '<div class="data-warning" role="note" data-warning="member"><b>会员指标可能被异常订单拉高</b><p>' + esc(evidence) + '</p><p>' + esc(detail) + '建议核查原始小票与支付流水。</p><button class="link" data-action="member-anomaly">查看判断依据 ›</button></div>';
  }
  function memberAnomalySheet() {
    var d = memberAnomalyData(); if (!d) return;
    modal('会员订单异常 · 判断依据', '<p>' + esc(md(d.start) + ' – ' + md(d.end)) + '，同一会员的 ' + fmt(d.orders) + ' 笔高额POS完成订单，合计 ¥' + fmt(d.amount) + '，占本店会员金额 ' + pct(d.share, 1) + '。</p>' +
      '<p>本次单笔识别门槛为 ¥' + fmt(d.threshold) + '：至少200元，且达到本店非会员客单价的5倍；同一会员至少3笔、跨至少2天，合计至少1,000元且占会员金额至少20%，才显示警示。</p>' +
      '<p>' + (d.unit ? '这组订单每笔均为 ¥' + fmt(d.unit) + '。' : '这组高额订单集中在同一会员。') + '支付记录为“' + esc(d.payment || '未标记') + '”' + (d.cash_share > 0 ? '，含现金记账的订单金额占该组 ' + pct(d.cash_share, 0) : '') + '。</p>' +
      '<p>这些特征说明少量集中订单明显影响了会员指标，尚不能确认由谁操作或是否刷单。请核对原始小票、真实支付流水及团餐或集中挂账情况。</p><p>页面保留原始指标，未自动删除或扣除订单。此规则先用于核查提示，不作为处罚依据。</p>');
  }
  function soupWarning(way) {
    if (!CTX) return '';
    var total = num(CTX[way + '汤底订单基数']), valid = num(CTX[way + '有效汤底订单']);
    if (total == null || valid == null || total < 50 || valid < 0 || valid > total || total - valid < 50 || valid / total >= .5) return '';
    var check = way === '堂食' ? '请优先检查POS收银时是否按规范点选汤底，并核对商品映射。' : '请核查外卖商品与汤底的映射是否完整。';
    return '<div class="data-warning" role="note" data-warning="soup"><b>汤底记录明显不足</b><p>近7天 ' + fmt(total) + ' 笔' + esc(way) + '订单中，仅 ' + fmt(valid) + ' 笔能识别汤底（' + pct(valid / total, 1) + '）。' + check + '当前排行仅代表已识别订单。</p></div>';
  }
  function memberVs() {
    var rs = D[V.membase] || [];
    if (!rs.length) return '';
    var mem = pickMember(rs, ['会员', '是']), non = pickMember(rs, ['非会员', '否']);
    var fM = memberFreq(mem), fN = memberFreq(non);
    var revM = num(mem['营收贡献']), revN = num(non['营收贡献']);
    var nM = num(mem['消费人数']), nN = num(non['消费人数']);
    var oM = num(mem['订单数']), oN = num(non['订单数']);
    var aovM = divide(revM, oM), aovN = divide(revN, oN);
    var spendM = divide(revM, nM), spendN = divide(revN, nN);
    var tot = (revM || 0) + (revN || 0);
    var memberEnd = date(mem['统计截止日'] || non['统计截止日'] || (CTX && CTX['统计截止日']) || ANCHOR);
    var win = memberEnd ? md(addDays(memberEnd, -29)) + ' – ' + md(memberEnd) : '近 30 天';
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
      memberAnomalyWarning() + vs + '<p class="sub">组内营业额</p>' + bars(revBars, { max: 2 }) + (memberAnomalyData() ? '<p class="note">以上指标包含待核查订单，暂不宜直接用于判断会员价值。</p>' : note));
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
    return section('private', '私域', '企微好友、社群 · 存量和本期新增分开看', kpis + health + note);
  }
  function coupons() {
    var p = P(), cp = D[V.coupons] || [];
    var types = group(cp.filter(function (r) { return inRange(date(r['核销日期']), p.cur); }), '券类型名称').map(function (g) { return { name: g.name, value: sum(g.rows, '核销券数'), display: fmt(sum(g.rows, '核销券数')) + ' 张' }; }).sort(function (a, b) { return b.value - a.value; });
    var tTotal = sum(types, 'value'); types.forEach(function (t) { t.share = divide(t.value, tTotal); });
    return section('coupons', '哪些券用得最多', esc(p.short) + ' · 按核销张数', bars(types, { max: 8, rank: true, emptyText: '这段时间没有券核销' }), '<button class="link" data-action="coupon-detail">' + esc(detailTitle('coupon')) + ' ›</button>');
  }

  /* ---------- 商品 ---------- */
  function products() {
    var pr = group(D[V.products] || [], '产品').map(function (g) { return { name: g.name, value: sum(g.rows, '订单数') }; }).sort(function (a, b) { return b.value - a.value; });
    var pTotal = sum(pr, 'value'); pr.forEach(function (x) { x.share = divide(x.value, pTotal); x.display = fmt(x.value) + ' 单'; });
    var soup = group((D[V.soup] || []).filter(function (r) { return r['取餐方式'] === S.soupWay; }), '口味').map(function (g) { return { name: g.name || '未命名', value: sum(g.rows, '订单数') }; }).sort(function (a, b) { return b.value - a.value; });
    var sTotal = sum(soup, 'value'); soup.forEach(function (x) { x.share = divide(x.value, sTotal); x.display = fmt(x.value) + ' 单'; });
    return section('products', '卖得最好的', '近 7 天堂食点单次数', '<h3>堂食点得最多的菜</h3>' + bars(pr, { max: S.open.products ? 15 : 5, rank: true }) + (pr.length > 5 ? '<button class="toggle" data-toggle="products">' + (S.open.products ? '收起 ▴' : '看前 15 名 ▾') + '</button>' : '') + '<div class="rowhead"><h3>汤底口味</h3>' + seg('soupWay', ['堂食', '外卖'], S.soupWay) + '</div>' + soupWarning(S.soupWay) + bars(soup, { max: 5, rank: true }) + '<p class="note">一单可点多个菜，菜的订单数加起来会大于总订单数。已排除餐巾纸、打包盒等耗材。</p>');
  }

  /* ---------- 口径说明 ---------- */
  function methods() {
    return '<p><b>数据到哪天</b>：以财务表最新有数据的日期为"昨天"。财务数据一般在次日早上 6 点左右同步完成；如果显示的日期不是昨天，说明还没同步。</p>' +
      '<p><b>营业额、订单数、客单价</b>：来自 DWS 财务订单表，含堂食和外卖各渠道。客单价 = 营业额 ÷ 订单数。日均按有营业的天数算，不把停业日当 0。</p>' +
      '<p><b>对比</b>：昨天对比"上周同一天"和"前一天"；近 7 天对比前 7 天；近 30 天对比前 30 天；本月对比上月 1 日到同一天（上月天数不够时改比日均）。涨跌 0.5% 以内显示为持平。</p>' +
      '<p><b>跟其他门店比</b>：按分公司、地理城市、门店类型看近 7 天日均营业额的名次和中位数。不展示对比组有多少家门店，也不展示其他门店名称。</p>' +
      '<p><b>顾客与会员</b>：消费会员按所选周期内会员卡号去重，不是每日人数的日均或加总。会员订单占比和新老客来自同一张新老客表，统计已完成且可识别顾客的POS订单，不含外卖；人次是每日累加。"近期堂食的顾客"是最后一单在本店的当前快照。不取 RFM。</p>' +
      '<p><b>会员 vs 非会员</b>：固定看近 30 天，不跟顶部周期走。来自顾客标识聚合表：消费频次 = 该组去重订单 ÷ 该组去重人数；客单价 = 该组营业额 ÷ 该组去重订单；人均贡献 = 该组营业额 ÷ 该组去重人数。组内营业额是可识别顾客里该组的金额，不是增量。已排除未知标识和会员饮品赠品。</p>' +
      '<p><b>私域</b>：在联好友、在群人数、流失率、退群率是当前存量。新加好友、入群、券核销按事件日期跟周期走，合计是人次。好友和群不能相除算转化。</p>' +
      '<p><b>券</b>：按核销张数看所选周期里用得最多的券类型，跟顶部周期走。</p>' +
      '<p><b>饭点</b>：按下单整点分桶。早餐 6–10 点，午餐 10–14 点，下午茶 14–17 点，晚餐 17–21 点，宵夜 21 点到次日 6 点。条按近 7 天订单数从高到低排，最忙的在最上面。</p>' +
      '<p><b>商品</b>：堂食产品按订单号去重，近 7 天；已排除饮品赠品、餐巾纸、打包耗材。汤底排除"未识别"。</p>' +
      '<p><b>异常提示</b>：会员警示只对跨天重复、金额明显偏高且对会员总金额影响较大的集中订单显示，具体依据可在警示内查看。汤底按同源完成订单去重核对：近7天至少50单，至少50单无法识别，且识别率低于50%才提示；外卖提示核对商品映射。正常数据不提示。</p>';
  }

  /* ---------- 弹层 ---------- */
  var beforeModal = null;
  function modal(title, body, opts) {
    beforeModal = document.activeElement;
    var ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = '<section class="sheet' + (opts && opts.cls ? ' ' + esc(opts.cls) : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="sheethead"><h2>' + esc(title) + '</h2><button data-close="1" class="iconbtn" aria-label="关闭">✕</button></div><div class="sheetbody">' + body + '</div><button class="close" data-close="1">知道了</button></section>';
    ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-close]')) { ov.remove(); if (beforeModal) beforeModal.focus(); } });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') { ov.remove(); if (beforeModal) beforeModal.focus(); } });
    document.body.appendChild(ov); ov.querySelector('button').focus();
    return ov;
  }
  function dailyMeasure(e, way) {
    if (!e) return null;
    return way === '总额' ? e : (e.way[way] || { rev: 0, orders: 0 });
  }
  function dailyData(cur, way) {
    var total = dailyMeasure(cur, way), rs = cur.daily.slice().reverse().map(function (e) {
      var val = dailyMeasure(e, way), same = dailyMeasure(FIN.get(addDays(e.date, -7)), way), day = pd(e.date).getDay();
      var change = same && same.rev !== 0 ? val.rev / same.rev - 1 : null;
      return { cls: (day === 0 || day === 6) ? 'wkend' : '', cells: [md(e.date) + '\n' + wd(e.date), fmt(val.rev), fmt(val.orders), fmt(divide(val.rev, val.orders), 1), change == null ? '—' : (change >= 0 ? '+' : '−') + pct(Math.abs(change), 0)] };
    });
    return { rev: total.rev, orders: total.orders, rows: rs, hasWay: way === '总额' ? cur.days > 0 : !!cur.way[way] };
  }
  function dailySheet() {
    var p = P(), cur = agg(p.cur), ways = ['总额', '堂食', '外卖'];
    var tabs = '<div class="seg daily-tabs" role="tablist" aria-label="' + esc(detailTitle()) + '取餐方式">' + ways.map(function (w, i) { return '<button role="tab" id="daily-tab-' + i + '" data-daily-way="' + w + '" aria-controls="daily-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? '0' : '-1') + '" class="' + (i === 0 ? 'active' : '') + '">' + w + '</button>'; }).join('') + '</div>';
    var ov = modal(detailTitle(), '<p class="daily-period">' + esc(p.title) + '</p>' + tabs + '<div class="daily-summary" aria-live="polite"></div><p class="daily-hint"></p><div class="daily-scroll" id="daily-panel" role="tabpanel" aria-labelledby="daily-tab-0" tabindex="0"></div>', { cls: 'daily-sheet' });
    function show(way) {
      var data = dailyData(cur, way), panel = ov.querySelector('.daily-scroll');
      ov.querySelectorAll('[data-daily-way]').forEach(function (btn) { var active = btn.getAttribute('data-daily-way') === way; btn.classList.toggle('active', active); btn.setAttribute('aria-selected', String(active)); btn.tabIndex = active ? 0 : -1; });
      ov.querySelector('.daily-summary').innerHTML = '<div><span>' + esc(way === '总额' ? '合计营业额' : way + '营业额') + '</span><b>¥' + fmt(data.rev) + '</b></div><div class="daily-summary-meta">' + fmt(data.orders) + ' 单<br>客单 ¥' + fmt(divide(data.rev, data.orders), 1) + '</div>';
      ov.querySelector('.daily-hint').textContent = (data.hasWay ? '' : '本期未记录' + way + '数据；') + '金额单位：元 · 比上周同一天';
      panel.setAttribute('aria-labelledby', 'daily-tab-' + ways.indexOf(way));
      panel.innerHTML = data.rows.length ? table(['日期', '营业额', '订单', '客单', '比上周'], data.rows, { cls: 'daily' }) : empty();
      panel.scrollTop = 0;
    }
    ov.addEventListener('click', function (e) { var btn = e.target.closest('[data-daily-way]'); if (btn) show(btn.getAttribute('data-daily-way')); });
    ov.addEventListener('keydown', function (e) {
      var btn = e.target.closest('[data-daily-way]'); if (!btn || ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(e.key) < 0) return;
      e.preventDefault(); var i = ways.indexOf(btn.getAttribute('data-daily-way'));
      i = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
      show(ways[i]); ov.querySelector('#daily-tab-' + i).focus();
    });
    show('总额');
  }

  /* 券日志金额为整单金额：券种内去重，顶部合计使用 ETL 独立去重总计。 */
  function couponConversionData(rs) {
    var keys = ['vouchers','orders','valid','paid','gross','discount','payment','unmatched','invalid','closed','pending_vouchers','stacked'];
    function blank() { var o = {}; keys.forEach(function (k) { o[k] = 0; }); return o; }
    function add(to, from) { keys.forEach(function (k) { to[k] += num(from[k]) || 0; }); }
    var total = blank(), types = new Map(), ready = true, totalDays = new Set(), days = new Set();
    rs.forEach(function (r) {
      var v; try { v = JSON.parse(r['转化明细']); } catch (_) { ready = false; return; }
      if (!v || v.version !== 1) { ready = false; return; }
      var name = r['券类型名称'] || '未命名券', d = date(r['核销日期']); days.add(d);
      if (!types.has(name)) { var entry = blank(); entry.name = name; types.set(name, entry); }
      add(types.get(name), v); types.get(name).vouchers += num(r['核销券数']) || 0;
      if (v.total) { add(total, v.total); totalDays.add(d); }
    });
    return { ready: ready && totalDays.size === days.size, total: total, types: Array.from(types.values()).sort(function (a, b) { return b.paid - a.paid || b.vouchers - a.vouchers || a.name.localeCompare(b.name, 'zh-CN'); }) };
  }
  function couponDiscount(x) { return x.valid > 0 && x.gross > 0 ? fmt(x.paid / x.gross * 10, 1) + '折' : '—'; }
  function couponPending(x) {
    var notes = [];
    if (x.payment) notes.push('券作支付，金额待核实');
    if (x.unmatched) notes.push('部分核销未匹配订单');
    if (x.invalid) notes.push('金额记录待核实');
    if (x.closed) notes.push('非完成订单未计金额');
    return notes.join('；');
  }
  function couponSheet() {
    var p = P(), rs = (D[V.coupons] || []).filter(function (r) { return inRange(date(r['核销日期']), p.cur); });
    var data = couponConversionData(rs), modes = ['营收贡献', '优惠折扣'], t = data.total;
    if (!rs.length || !data.ready) { modal(detailTitle('coupon'), '<p>' + esc(p.title) + '</p>' + empty(rs.length ? '转化数据正在更新，请稍后刷新' : '这段时间没有券核销')); return; }
    var tabs = '<div class="seg daily-tabs coupon-tabs" role="tablist" aria-label="' + esc(detailTitle('coupon')) + '维度">' + modes.map(function (m, i) { return '<button role="tab" id="coupon-tab-' + i + '" data-coupon-mode="' + i + '" aria-controls="coupon-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? '0' : '-1') + '" class="' + (i === 0 ? 'active' : '') + '">' + m + '</button>'; }).join('') + '</div>';
    var ov = modal(detailTitle('coupon'), '<p class="daily-period">' + esc(p.title) + ' · ' + esc(STORE) + '</p>' + tabs + '<div class="daily-summary" aria-live="polite"></div><p class="coupon-value-line"></p>' +
      (t.pending_vouchers ? '<div class="coupon-caution">' + fmt(t.pending_vouchers) + ' 张券对应的金额未计入，原因见券名下方。</div>' : '') +
      '<p class="daily-hint">' + (t.stacked ? '合计已去重 · 叠券行不可相加 · 元' : '按实付金额排序 · 金额单位：元') + '</p><div class="daily-scroll coupon-scroll" id="coupon-panel" role="tabpanel" aria-labelledby="coupon-tab-0" tabindex="0"></div>', { cls: 'daily-sheet coupon-sheet' });
    function amount(x, k, precision) { return x.valid ? fmt(x[k], precision || 0) : (x.pending_vouchers ? '—' : '0'); }
    var methods = '<div class="coupon-methods"><p>用券订单实付是关联订单贡献，不等于优惠券带来的新增营收。</p>' +
      (t.stacked ? '<p>合计已按订单去重；同单叠加不同券时，各券种展示关联整单金额，券种行不能直接相加。</p>' : '') +
      '<details><summary>查看金额与折扣口径</summary><p>核销张数按券号去重，订单按门店和订单号去重。金额仅计已完成、核销日志与订单实付相符的记录；原价、实付和优惠取自核销关联的订单日志。</p><p>实付折扣＝实付合计÷原价合计×10；客单＝实付合计÷已计金额的订单数；每优惠1元对应用券实付＝实付合计÷优惠合计。均先汇总金额再计算。</p><p>优惠为整单记录的优惠，可能含叠加活动；暂不能拆成每张券单独承担的成本。它不是利润，也不是加盟商扣除补贴后的净成本。</p>' +
      (t.pending_vouchers ? '<p>' + esc(couponPending(t)) + '。券被记为支付方式时，账面实付可能含券抵付；金额先留空，不按零成本展示。退款或其他非完成状态不计入金额。</p>' : '') +
      '<p>按核销日期跟随顶部周期，每日由 ETL 自动更新。</p></details></div>';
    function show(index) {
      var cost = index === 1, panel = ov.querySelector('.coupon-scroll');
      ov.querySelectorAll('[data-coupon-mode]').forEach(function (btn) { var active = Number(btn.getAttribute('data-coupon-mode')) === index; btn.classList.toggle('active', active); btn.setAttribute('aria-selected', String(active)); btn.tabIndex = active ? 0 : -1; });
      ov.querySelector('.daily-summary').innerHTML = '<div><span>' + (cost ? '用券订单优惠' : '用券订单实付') + '</span><b>' + (t.valid ? '¥' + fmt(cost ? t.discount : t.paid) : '—') + '</b></div><div class="daily-summary-meta">' + (cost ? '实付折扣<br><strong>' + couponDiscount(t) + '</strong>' : fmt(t.vouchers) + ' 张核销<br>' + fmt(t.orders) + ' 笔关联订单') + '</div>';
      ov.querySelector('.coupon-value-line').textContent = cost ? (t.valid && t.discount > 0 ? '每优惠 1 元，对应用券实付 ' + fmt(t.paid / t.discount, 1) + ' 元' : '暂无可计算的优惠金额') : (t.valid ? fmt(t.valid) + ' 笔订单已计金额 · 客单 ¥' + fmt(t.paid / t.valid, 1) : '金额待核实，暂不计算客单和折扣');
      var body = data.types.map(function (x) { var note = couponPending(x); return '<tr><td><span class="coupon-name">' + esc(x.name) + '</span><small>' + fmt(x.vouchers) + ' 张 · ' + fmt(x.orders) + ' 单' + (x.stacked ? ' · 含叠券' : '') + '</small>' + (note ? '<small class="coupon-row-note">' + esc(note) + '</small>' : '') + '</td><td>' + amount(x, cost ? 'discount' : 'paid') + '</td><td>' + (cost ? couponDiscount(x) : (x.valid ? fmt(x.paid / x.valid, 1) : '—')) + '</td></tr>'; }).join('');
      panel.setAttribute('aria-labelledby', 'coupon-tab-' + index);
      panel.innerHTML = '<table class="coupon-table"><thead><tr><th scope="col">券种 / 核销</th><th scope="col">' + (cost ? '优惠金额' : '订单实付') + '</th><th scope="col">' + (cost ? '实付折扣' : '客单价') + '</th></tr></thead><tbody>' + body + '</tbody></table>' + methods;
      panel.scrollTop = 0;
    }
    ov.addEventListener('click', function (e) { var btn = e.target.closest('[data-coupon-mode]'); if (btn) show(Number(btn.getAttribute('data-coupon-mode'))); });
    ov.addEventListener('keydown', function (e) { var btn = e.target.closest('[data-coupon-mode]'); if (!btn || ['ArrowLeft','ArrowRight','Home','End'].indexOf(e.key) < 0) return; e.preventDefault(); var i = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1 - Number(btn.getAttribute('data-coupon-mode')); show(i); ov.querySelector('#coupon-tab-' + i).focus(); });
    show(0);
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
      table(['', '本店', '中位', '前 25%'], [['日均营业额', '¥' + fmt(me.avg), '¥' + fmt(quantile(avgs, 0.5)), '¥' + fmt(quantile(avgs, 0.75))], ['日均订单', fmt(me.orders / me.days, 0), fmt(ordMed, 0), '—'], ['客单价', '¥' + fmt(acMe, 1), '¥' + fmt(acMed, 1), '—']]) +
      '<p class="note">"前 25%"是同组里排在前四分之一位置的日均营业额。不显示其他门店名称，也不显示这组有多少家店。</p>');
  }
  /* ---------- 固定近30天会员门店对比：ETL已计算 ---------- */
  function memberPeerGap(value) {
    if (num(value) == null) return '暂无法比较';
    if (Math.abs(value) < 0.0005) return '与中位数持平';
    return (value > 0 ? '高于中位数 ' : '低于中位数 ') + fmt(Math.abs(value) * 100, 1) + ' 个百分点';
  }
  function memberPeerChange(r) {
    var change = num(r['会员对比变化']);
    if (r['会员对比状态'] !== '可参评' || r['会员对比前期状态'] !== '可参评' || change == null) return '<span class="kpisub">暂不比较前后期变化</span>';
    var flat = Math.abs(change) < 0.0005;
    return '<span class="delta ' + (flat ? 'flat' : change > 0 ? 'up' : 'down') + '">' +
      (flat ? '持平' : (change > 0 ? '提升 ' : '下降 ') + fmt(Math.abs(change) * 100, 1) + ' 个百分点') + '<small>比前30天</small></span>';
  }
  function memberPeerGroups(r) {
    return [
      { key: '分公司', label: r['分公司'] || '本分公司' },
      { key: '城市', label: r['地理城市'] || '同城市' },
      { key: '店型', label: r['门店类型'] ? r['门店类型'] + '（全国）' : '' }
    ].filter(function (g) { return g.label; });
  }
  function memberPeer() {
    var r = CTX || {}, value = num(r['会员对比占比']), end = date(r['会员对比截止日']), start = date(r['会员对比开始日']);
    if (!end) return section('member-peer', '跟其他门店比', '近30天会员订单占比', empty('会员对比数据暂未返回'));
    if (!(num(r['会员对比订单数']) > 0) || value < 0 || value > 1) value = null;
    var subtitle = '近30天会员订单占比 · ' + md(start) + '–' + md(end);
    var summary = '<div class="member-peer-summary"><div><span>本店会员订单占比</span><b>' + pct(value, 1) + '</b></div>' +
      memberPeerChange(r) + '</div>';
    if (r['会员对比状态'] !== '可参评') {
      return section('member-peer', '跟其他门店比', subtitle, summary +
        '<p class="member-peer-status">暂不参与排名：' + esc(r['会员对比状态'] || '数据待核对') + '</p>' +
        '<button class="toggle" data-action="member-peer-methods">查看参评口径 ›</button>');
    }
    var body = memberPeerGroups(r).map(function (g) {
      var rank = num(r['会员对比' + g.key + '名次']), med = num(r['会员对比' + g.key + '中位']);
      if (rank == null || rank < 1 || med == null) return '<div class="peer member-peer-unavailable"><span class="peername">' + esc(g.label) + '</span><p class="note">可比样本不足，暂不排名</p></div>';
      var top = Math.max(value, med, 0.000001);
      return '<button class="peer member-peer-card" data-action="member-peer" data-value="' + g.key + '">' +
        '<div class="peerhead"><span class="peername">' + esc(g.label) + '<small>近30天会员订单占比</small></span>' +
        '<span class="peerrank"><b>第 ' + fmt(rank) + '</b><small>' + esc(r['会员对比' + g.key + '分位'] || '') + '</small></span></div>' +
        '<div class="cmpbars"><div class="cmprow"><span>本店</span><div class="track me"><i style="width:' + (value / top * 100).toFixed(1) + '%"></i></div><b>' + pct(value, 1) + '</b></div>' +
        '<div class="cmprow"><span>中位</span><div class="track"><i style="width:' + (med / top * 100).toFixed(1) + '%"></i></div><b>' + pct(med, 1) + '</b></div></div>' +
        '<p class="member-peer-gap">' + memberPeerGap(value - med) + '<span aria-hidden="true"> ›</span></p></button>';
    }).join('');
    return section('member-peer', '跟其他门店比', subtitle, summary + '<div class="peers">' + body + '</div>' +
      '<button class="toggle" data-action="member-peer-methods">固定近30天 · 查看参评口径 ›</button>');
  }
  function memberPeerMethods() {
    var r = CTX || {}, start = date(r['会员对比开始日']), end = date(r['会员对比截止日']);
    return '<p><b>比较什么</b>：会员订单数 ÷ 可识别顾客的POS订单数。沿用上方“顾客与会员”的新老客表口径，只含已完成订单，不含外卖。它反映会员交易渗透，不等于复购率。</p>' +
      '<p><b>比较哪段时间</b>：固定近30天' + (start && end ? '（' + md(start) + '–' + md(end) + '）' : '') + '，不随顶部周期切换。所有门店用同一个最新数据截止日；变化值与紧邻的前30天比较。</p>' +
      '<p><b>试看版参评条件</b>：运营中的门店，近30天至少300笔可识别顾客订单，至少21个有订单日期；财务POS有订单的日期不能整天缺少顾客数据。可识别顾客订单须覆盖财务POS订单的80%以上，明显超出财务订单的情况暂不参评。</p>' +
      '<p><b>本店数据</b>：可识别顾客订单 ' + fmt(r['会员对比订单数']) + ' 单，其中会员订单 ' + fmt(r['会员对比会员订单数']) + ' 单；有订单日期 ' + fmt(r['会员对比有效天数']) + ' 天，顾客识别覆盖率 ' + pct(r['会员对比识别覆盖率'], 1) + '。</p>' +
      '<p><b>本店参评状态</b>：' + esc(r['会员对比状态'] || '数据待核对') + '。前30天：' + esc(r['会员对比前期状态'] || '暂无数据') + '；前后两期均具备条件时才显示提升或下降。</p>' +
      '<p><b>名次与中位数</b>：仅在符合条件的同分公司、同地理城市或全国同店型门店中比较。占比相同并列；本店计入中位数。可比样本太少时不排名，不展示其他门店名称和对比组家数。阈值是本次试看规则，后续可按业务反馈调整。</p>';
  }
  function memberPeerSheet(key) {
    var r = CTX || {}, g = memberPeerGroups(r).filter(function (x) { return x.key === key; })[0];
    if (!g) return;
    var value = num(r['会员对比占比']), med = num(r['会员对比' + key + '中位']);
    modal('会员占比 · ' + g.label, '<p>本店排第 <b>' + fmt(r['会员对比' + key + '名次']) + '</b>，' + memberPeerGap(value - med) + '。</p>' +
      table(['指标', '本店', '中位数'], [['会员订单占比', pct(value, 1), pct(med, 1)]]) + memberPeerMethods());
  }

  /* ---------- 渲染 ---------- */
  function header() {
    var today = (window.SCORECARD_FIXTURE && window.SCORECARD_FIXTURE.today) || dstr(new Date()), yesterday = addDays(today, -1), fresh = ANCHOR === yesterday;
    var sub = fresh ? '数据到昨天 ' + md(ANCHOR) + ' ' + wd(ANCHOR) : '数据到 ' + md(ANCHOR) + ' ' + wd(ANCHOR) + '，昨天的还没同步';
    return '<header class="top"><div><h1>' + esc(STORE || '所选门店') + '</h1><p class="' + (fresh ? 'fresh' : 'stale') + '">' + esc(sub) + '</p></div><button class="iconbtn" data-action="methods" aria-label="口径说明">i</button></header>' + seg('period', ['昨天', '近7天', '近30天', '本月'], S.period);
  }
  function render() {
    var scroll = A.scrollTop;
    if (!ANCHOR) { A.innerHTML = '<main class="shell"><header class="top"><div><h1>' + esc(STORE || '所选门店') + '</h1><p class="stale">近 70 天没有财务数据</p></div></header>' + empty((STORE || '所选门店') + '近 70 天没有营业数据。可换一家门店，或等财务表同步后再看。') + '</main>'; return; }
    var truncated = D.some(function (r, i) { return r.length >= viewLimit(i); });
    A.innerHTML = '<main class="shell">' + header() + (truncated ? '<div class="warn">部分数据达到取数上限，个别数字可能不完整。</div>' : '') +
      scorecard() + trend() + peer() + channels() + customers() + memberPeer() + memberVs() + privateDomain() + coupons() + hours() + products() +
      '<footer class="foot"><span>财务数据同步于 ' + esc(SYNC ? SYNC.slice(0, 16) : '—') + ' · 读取 ' + esc(S.lastRead || '—') + '</span><button class="link" data-action="methods">口径说明</button></footer><p class="data-disclaimer">页面数据仅供业务分析使用，精准信息请以财务口径为准，如发现异常数据可联系企业微信【运营支持】排查</p></main>';
    A.scrollTop = scroll;
  }
  A.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.set) { S[b.dataset.set] = b.dataset.value; if (b.dataset.set === 'grain') S.point = null; render(); return; }
    if (b.dataset.toggle) { S.open[b.dataset.toggle] = !S.open[b.dataset.toggle]; render(); return; }
    var a = b.dataset.action;
    if (a === 'methods') modal('这些数字怎么来的', methods());
    if (a === 'daily') dailySheet();
    if (a === 'coupon-detail') couponSheet();
    if (a === 'way') waySheet(b.dataset.value);
    if (a === 'peer') peerSheet(b.dataset.value);
    if (a === 'member-peer') memberPeerSheet(b.dataset.value);
    if (a === 'member-anomaly') memberAnomalySheet();
    if (a === 'member-peer-methods') modal('会员对比参评口径', memberPeerMethods());
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
    var item = window.SCORECARD_FIXTURE.stores[name]; if (!item) return;
    S.demoStore = name; S.demoBranch = item.branch; S.soupWay = '堂食';
    receive(item.views);
  }
  if (window.SCORECARD_FIXTURE) {
    var f = window.SCORECARD_FIXTURE, branch = document.getElementById('demo-branch'), store = document.getElementById('demo-store');
    branch.innerHTML = Array.from(new Set(Object.values(f.stores).map(function (x) { return x.branch; }))).map(function (x) { return '<option>' + esc(x) + '</option>'; }).join('');
    function selectBranch() {
      var names = Object.keys(f.stores).filter(function (n) { return f.stores[n].branch === branch.value; }).sort(function (a,b) { return f.stores[b].revenue7 - f.stores[a].revenue7 || a.localeCompare(b,'zh-CN'); });
      store.innerHTML = names.map(function (n) { return '<option>' + esc(n) + '</option>'; }).join('');
      applyDemoStore(names[0]);
    }
    branch.addEventListener('change',selectBranch);
    store.addEventListener('change',function () { applyDemoStore(store.value); });
    selectBranch();
  } else if (typeof GDPlugin === 'function') {
    new GDPlugin().init(receive);
  } else { A.innerHTML = empty('请打开生成后的离线 HTML 示例'); }
})();
