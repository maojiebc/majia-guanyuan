/**
 * HTML 月度渠道趋势
 *
 * data contract:
 *   data[0] = 月度渠道趋势
 *     字段：月份（或 "月份 (月)"）/ 渠道 / 销售额
 *
 * 渲染：上方一条总销售折线；下方一行堆叠条，每个月按渠道占比堆叠。
 */
var __gdHtmlCommon = __asset_text("./html_common.js")__;
var __gdHtmlCss    = __asset_text("./html_base.css")__;
(new Function(__gdHtmlCommon))();

var CHANNEL_COLORS = {
  "线上":   "#3b82f6",
  "线下":   "#10b981",
  "外卖":   "#f59e0b",
  "团购":   "#8b5cf6",
  "其他":   "#9ca3af"
};

function renderChart(data, clickFunc, config, helpers) {
  var cols = GDHTML.safeCols(data, 0);
  if (!cols.length) {
    GDHTML.mount("html-trend", "trend",
      '<div class="gd-card"><h2>月度渠道趋势</h2><div class="gd-empty">数据缺失</div></div>',
      __gdHtmlCss);
    return;
  }

  var monthCol   = GDHTML.col(cols, "月份");  // §9 自动兼容 "月份 (月)" / "年月"
  var channelCol = GDHTML.col(cols, "渠道") || cols.find(function (c) { return c.name === "渠道"; });
  var salesCol   = cols.find(function (c) { return c.name === "销售额"; });

  if (!monthCol || !salesCol) {
    GDHTML.mount("html-trend", "trend",
      '<div class="gd-card"><h2>月度渠道趋势</h2><div class="gd-empty">字段映射失败，请检查 dataView 返回</div></div>',
      __gdHtmlCss);
    return;
  }

  var rows = GDHTML.rows(cols);

  // 按月聚合
  var byMonth = {};
  rows.forEach(function (r) {
    var m = r[monthCol.name];
    if (!byMonth[m]) byMonth[m] = { month: m, total: 0, channels: {} };
    var ch = channelCol ? r[channelCol.name] : "全部";
    var v = Number(r[salesCol.name]) || 0;
    byMonth[m].total += v;
    byMonth[m].channels[ch] = (byMonth[m].channels[ch] || 0) + v;
  });

  var months = Object.keys(byMonth).sort();
  var points = months.map(function (m) {
    return { label: m, value: byMonth[m].total };
  });

  // 渠道色板（按出现顺序回退）
  var allChannels = {};
  months.forEach(function (m) {
    Object.keys(byMonth[m].channels).forEach(function (ch) { allChannels[ch] = true; });
  });
  var channels = Object.keys(allChannels);

  var html = [
    '<div class="gd-card">',
      '<h2>月度渠道趋势</h2>',

      '<h3>月度销售总额</h3>',
      '<div>' + GDHTML.lineSvg(points, { width: 480, height: 90, color: "#3b82f6" }) + '</div>',

      '<h3 style="margin-top:16px">渠道结构</h3>',
      '<table class="gd-table">',
        '<thead><tr><th>月份</th><th>结构</th><th class="num">合计</th></tr></thead>',
        '<tbody>',
          months.slice(-12).map(function (m) {
            var parts = channels.map(function (ch) {
              return {
                value: byMonth[m].channels[ch] || 0,
                color: CHANNEL_COLORS[ch] || CHANNEL_COLORS["其他"]
              };
            });
            return (
              '<tr>' +
                '<td>' + GDHTML.esc(m) + '</td>' +
                '<td>' + GDHTML.stacked(parts, { width: 280, height: 10 }) + '</td>' +
                '<td class="num">' + GDHTML.money(byMonth[m].total) + '</td>' +
              '</tr>'
            );
          }).join(""),
        '</tbody>',
      '</table>',

      legend(channels),
    '</div>'
  ].join("");

  GDHTML.mount("html-trend", "trend", html, __gdHtmlCss);
}

function legend(channels) {
  return (
    '<div style="margin-top:8px;font-size:12px;color:#6b7280;display:flex;gap:12px;flex-wrap:wrap">' +
      channels.map(function (ch) {
        var color = CHANNEL_COLORS[ch] || CHANNEL_COLORS["其他"];
        return (
          '<span><span style="display:inline-block;width:10px;height:10px;background:' +
          color + ';border-radius:2px;margin-right:4px;vertical-align:middle"></span>' +
          GDHTML.esc(ch) + '</span>'
        );
      }).join("") +
    '</div>'
  );
}

new GDPlugin().init(renderChart);
