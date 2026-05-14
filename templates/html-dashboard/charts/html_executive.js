/**
 * HTML 经营驾驶舱
 *
 * data contract:
 *   data[0] = KPI 数据         (字段：销售额、订单数、客单价、同比、环比)
 *   data[1] = 城市 Top 5       (字段：城市、销售额)
 *   data[2] = 低效门店         (字段：门店名、销售额、店龄)
 *   data[3] = 样板门店         (字段：门店名、销售额、店龄)
 */
var __gdHtmlCommon = __asset_text("./html_common.js")__;
var __gdHtmlCss    = __asset_text("./html_base.css")__;
(new Function(__gdHtmlCommon))();

function renderChart(data, clickFunc, config, helpers) {
  var kpiCols    = GDHTML.safeCols(data, 0);
  var cityCols   = GDHTML.safeCols(data, 1);
  var weakCols   = GDHTML.safeCols(data, 2);
  var modelCols  = GDHTML.safeCols(data, 3);

  var kpiRow = GDHTML.rows(kpiCols)[0] || {};
  var cities = GDHTML.rows(cityCols);
  var weak   = GDHTML.rows(weakCols);
  var model  = GDHTML.rows(modelCols);

  var maxCitySales = Math.max.apply(
    null,
    cities.map(function (c) { return c["销售额"] || 0; }).concat([1])
  );

  var html = [
    '<div class="gd-card">',
      '<h2>经营驾驶舱</h2>',

      // KPI 行
      '<div class="gd-kpi-row">',
        kpi("销售额", GDHTML.yuan(kpiRow["销售额"]), kpiRow["销售额同比"]),
        kpi("订单数", GDHTML.int(kpiRow["订单数"]), kpiRow["订单同比"]),
        kpi("客单价", GDHTML.yuan(kpiRow["客单价"]), kpiRow["客单价同比"]),
      '</div>',

      // 城市 Top 5
      '<h3>城市销售 Top 5</h3>',
      cities.length === 0
        ? '<div class="gd-empty">城市数据缺失</div>'
        : '<ul class="gd-list">' + cities.slice(0, 5).map(function (c) {
            return (
              '<li>' +
                '<span class="gd-list-label">' + GDHTML.esc(c["城市"]) + '</span>' +
                '<span class="gd-list-value">' + GDHTML.yuan(c["销售额"]) + '</span>' +
                '<span class="gd-list-bar">' + GDHTML.bar(c["销售额"], maxCitySales) + '</span>' +
              '</li>'
            );
          }).join("") + '</ul>',

      // 两列：低效 / 样板
      '<div class="gd-grid-2" style="margin-top:16px">',
        storeBlock("低效门店", weak, "warn"),
        storeBlock("样板门店", model, "good"),
      '</div>',
    '</div>'
  ].join("");

  GDHTML.mount("html-executive", "executive", html, __gdHtmlCss);
}

function kpi(label, value, delta) {
  var deltaClass = "";
  var deltaText = "";
  if (delta != null && !isNaN(delta)) {
    deltaClass = Number(delta) >= 0 ? "up" : "down";
    deltaText = (Number(delta) >= 0 ? "↑ " : "↓ ") + GDHTML.pct(Math.abs(delta));
  }
  return (
    '<div class="gd-kpi">' +
      '<div class="gd-kpi-label">' + GDHTML.esc(label) + '</div>' +
      '<div class="gd-kpi-value">' + value + '</div>' +
      (deltaText ? '<div class="gd-kpi-delta ' + deltaClass + '">' + deltaText + '</div>' : '') +
    '</div>'
  );
}

function storeBlock(title, stores, tone) {
  if (!stores || stores.length === 0) {
    return '<div><h3>' + title + '</h3><div class="gd-empty">暂无数据</div></div>';
  }
  return (
    '<div>' +
      '<h3>' + title + ' <span class="gd-tag ' + tone + '">' + stores.length + '</span></h3>' +
      '<table class="gd-table">' +
        '<thead><tr><th>门店</th><th class="num">销售额</th><th class="num">店龄(月)</th></tr></thead>' +
        '<tbody>' + stores.slice(0, 5).map(function (s) {
          return (
            '<tr>' +
              '<td>' + GDHTML.esc(s["门店名"]) + '</td>' +
              '<td class="num">' + GDHTML.yuan(s["销售额"]) + '</td>' +
              '<td class="num">' + (s["店龄"] || "—") + '</td>' +
            '</tr>'
          );
        }).join("") + '</tbody>' +
      '</table>' +
    '</div>'
  );
}

new GDPlugin().init(renderChart);
