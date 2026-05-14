/**
 * GDHTML — HTML 应用看板共享 runtime
 *
 * 用法（在每个 html_<module>.js 顶部）：
 *   var __gdHtmlCommon = __asset_text("./html_common.js")__;
 *   var __gdHtmlCss    = __asset_text("./html_base.css")__;
 *   (new Function(__gdHtmlCommon))();   // 把 GDHTML 挂到全局
 *
 * 然后在 renderChart 里：
 *   var kpi = GDHTML.safeCols(data, 0);
 *   var html = renderExecutive(kpi, ...);
 *   GDHTML.mount("html-executive", "executive", html, __gdHtmlCss);
 *
 * 详见 references/part-c-html-dashboard.md §5。
 */
(function (root) {
  var GDHTML = {};

  // ---------- 数据取数 ----------
  // data 形态：data[viewIdx] = [{name, data: [v1, v2, ...]}, ...]
  GDHTML.safeCols = function (data, viewIdx) {
    if (!Array.isArray(data)) return [];
    var v = data[viewIdx || 0];
    return Array.isArray(v) ? v : [];
  };

  // 列式 → 行式
  GDHTML.rows = function (cols) {
    if (!cols || !cols.length) return [];
    var n = (cols[0].data || []).length;
    var out = [];
    for (var i = 0; i < n; i++) {
      var row = {};
      for (var j = 0; j < cols.length; j++) {
        row[cols[j].name] = (cols[j].data || [])[i];
      }
      out.push(row);
    }
    return out;
  };

  // 按 name 找列；兼容粒度后缀（"月份" → "月份" / "月份 (月)" / "年月"）
  var GRANULARITY_ALIASES = {
    "日期":   ["日期", "日期 (日)", "date"],
    "月份":   ["月份", "月份 (月)", "年月", "year_month"],
    "季度":   ["季度", "季度 (季)", "quarter"],
    "年份":   ["年份", "年份 (年)", "year"]
  };
  GDHTML.col = function (cols, name) {
    var candidates = GRANULARITY_ALIASES[name] || [name];
    for (var i = 0; i < cols.length; i++) {
      if (candidates.indexOf(cols[i].name) >= 0) return cols[i];
    }
    return null;
  };

  // ---------- 数字格式化 ----------
  GDHTML.money = function (v) {
    if (v == null || isNaN(v)) return "—";
    var n = Number(v);
    if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + " 亿";
    if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(2) + " 万";
    return n.toFixed(0);
  };

  GDHTML.yuan = function (v) {
    if (v == null || isNaN(v)) return "—";
    return "¥" + Number(v).toLocaleString("zh-CN", { maximumFractionDigits: 2 });
  };

  GDHTML.pct = function (v, digits) {
    if (v == null || isNaN(v)) return "—";
    return (Number(v) * 100).toFixed(digits == null ? 2 : digits) + "%";
  };

  GDHTML.int = function (v) {
    if (v == null || isNaN(v)) return "—";
    return Number(v).toLocaleString("zh-CN");
  };

  // ---------- HTML escape ----------
  GDHTML.esc = function (v) {
    if (v == null) return "";
    return String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  // ---------- SVG 组件 ----------
  // 水平进度条（单值 vs max）
  GDHTML.bar = function (value, max, opts) {
    opts = opts || {};
    var width = opts.width || 120;
    var height = opts.height || 8;
    var color = opts.color || "#3b82f6";
    var ratio = max ? Math.max(0, Math.min(1, value / max)) : 0;
    return (
      '<svg width="' + width + '" height="' + height + '">' +
        '<rect x="0" y="0" width="' + width + '" height="' + height +
        '" rx="' + (height / 2) + '" fill="#e5e7eb"/>' +
        '<rect x="0" y="0" width="' + (width * ratio) + '" height="' + height +
        '" rx="' + (height / 2) + '" fill="' + color + '"/>' +
      "</svg>"
    );
  };

  // 堆叠水平条：parts = [{value, color}, ...]
  GDHTML.stacked = function (parts, opts) {
    opts = opts || {};
    var width = opts.width || 240;
    var height = opts.height || 10;
    var total = parts.reduce(function (s, p) { return s + (p.value || 0); }, 0);
    if (!total) return GDHTML.bar(0, 1, opts);
    var x = 0;
    var rects = "";
    for (var i = 0; i < parts.length; i++) {
      var w = (parts[i].value / total) * width;
      rects +=
        '<rect x="' + x + '" y="0" width="' + w + '" height="' + height +
        '" fill="' + (parts[i].color || "#3b82f6") + '"/>';
      x += w;
    }
    return '<svg width="' + width + '" height="' + height + '">' + rects + "</svg>";
  };

  // 简易 SVG 折线
  GDHTML.lineSvg = function (points, opts) {
    opts = opts || {};
    var width = opts.width || 320;
    var height = opts.height || 80;
    var color = opts.color || "#3b82f6";
    if (!points || !points.length) return "";
    var vals = points.map(function (p) { return p.value || 0; });
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var range = max - min || 1;
    var step = points.length > 1 ? width / (points.length - 1) : 0;
    var d = points.map(function (p, i) {
      var x = i * step;
      var y = height - ((p.value - min) / range) * height;
      return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
    return (
      '<svg width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
        '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2"/>' +
      "</svg>"
    );
  };

  // 简易 SVG 散点（四象限矩阵用）
  GDHTML.scatterSvg = function (points, opts) {
    opts = opts || {};
    var width = opts.width || 320;
    var height = opts.height || 240;
    if (!points || !points.length) return "";
    var xs = points.map(function (p) { return p.x; });
    var ys = points.map(function (p) { return p.y; });
    var xMin = Math.min.apply(null, xs), xMax = Math.max.apply(null, xs);
    var yMin = Math.min.apply(null, ys), yMax = Math.max.apply(null, ys);
    var xRange = xMax - xMin || 1, yRange = yMax - yMin || 1;
    var xMid = (xMax + xMin) / 2, yMid = (yMax + yMin) / 2;
    var midX = ((xMid - xMin) / xRange) * width;
    var midY = height - ((yMid - yMin) / yRange) * height;
    var dots = points.map(function (p) {
      var x = ((p.x - xMin) / xRange) * width;
      var y = height - ((p.y - yMin) / yRange) * height;
      return (
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" r="' + (p.r || 4) + '" fill="' + (p.color || "#3b82f6") +
        '" opacity="0.7"><title>' + GDHTML.esc(p.label || "") + '</title></circle>'
      );
    }).join("");
    return (
      '<svg width="' + width + '" height="' + height + '">' +
        '<line x1="' + midX + '" y1="0" x2="' + midX + '" y2="' + height + '" stroke="#d1d5db" stroke-dasharray="3 3"/>' +
        '<line x1="0" y1="' + midY + '" x2="' + width + '" y2="' + midY + '" stroke="#d1d5db" stroke-dasharray="3 3"/>' +
        dots +
      "</svg>"
    );
  };

  // ---------- iframe 安全挂载 ----------
  // rootId: DOM 节点 id（custom chart 的容器节点）
  // name:   逻辑模块名，便于调试
  // html:   要塞进 root 的 innerHTML
  // css:    模块自定义样式（叠加在 html_base.css 之上）
  GDHTML.mount = function (rootId, name, html, css) {
    try {
      var root = document.getElementById(rootId);
      if (!root) {
        root = document.body;
      }
      var styleId = "gdhtml-style-" + name;
      if (css && !document.getElementById(styleId)) {
        var style = document.createElement("style");
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
      }
      root.innerHTML = html;
    } catch (e) {
      console.error("[GDHTML] mount failed:", name, e);
    }
  };

  root.GDHTML = GDHTML;
})(typeof window !== "undefined" ? window : this);
