#!/usr/bin/env node
/**
 * patch_selector_linkage.js
 *
 * 把 HTML 应用看板的 custom chart dataView 联到原生 selector 上。
 * 用途：补齐 guanvis-skill `.linkToAll()` 没法覆盖到的"selector → custom chart 内部 dataView"链路。
 *
 * 用法：
 *   node patch_selector_linkage.js \
 *     --descriptor /path/to/unzipped-pkg/descriptor.json \
 *     --selector 城市:<fdId-城市> \
 *     --selector 门店类型:<fdId-门店类型> \
 *     --targets <html_dv_id_1>,<html_dv_id_2>,...
 *
 *   每个 --selector 参数：<selector 显示名>:<它在 HTML dataView 数据集里对应的 fdId>
 *   --targets 是要联进 selector.asFilter.targetCdIds 的 HTML dataView 卡片 ID 列表
 *
 * 实现细节见 majia-guanyuan references/part-c-html-dashboard.md §7。
 */
const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { selectors: [], targets: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--descriptor")    args.descriptor = argv[++i];
    else if (a === "--selector") {
      const [name, fdId] = (argv[++i] || "").split(":");
      if (!name || !fdId) die("--selector 必须形如 name:fdId");
      args.selectors.push({ name, fdId });
    }
    else if (a === "--targets")  args.targets = (argv[++i] || "").split(",").filter(Boolean);
    else if (a === "--dsId")     args.dsId = argv[++i];
    else if (a === "-h" || a === "--help") help();
  }
  if (!args.descriptor || !args.selectors.length || !args.targets.length) help();
  return args;
}

function die(msg) { console.error("[patch] " + msg); process.exit(1); }

function help() {
  console.error(`patch_selector_linkage.js — 把 HTML dataView 联到原生 selector

用法：
  node patch_selector_linkage.js \\
    --descriptor <path-to-descriptor.json> \\
    --selector <name>:<fdId> [--selector ...] \\
    --targets <cdId1>,<cdId2>,...
    [--dsId <dataset-id>]   # 可选；不传时自动从已有 targetFields 推断

详见 references/part-c-html-dashboard.md §7`);
  process.exit(2);
}

function readSettings(card) {
  if (!card.settings) return {};
  return typeof card.settings === "string" ? JSON.parse(card.settings) : card.settings;
}

function writeSettings(card, settings) {
  card.settings = JSON.stringify(settings);
}

function findSelector(descriptor, name) {
  // descriptor.json 的具体结构因 guanvis-skill 版本而略有差异；
  // 兼容三种常见路径：descriptor.resources / descriptor.cards / descriptor.page.cards
  const candidates = []
    .concat(descriptor.resources || [])
    .concat(descriptor.cards || [])
    .concat((descriptor.page && descriptor.page.cards) || [])
    .concat((descriptor.meta && descriptor.meta.cards) || []);
  return candidates.find(function (c) {
    const meta = c.meta || c;
    const cardName = (meta.card && meta.card.name) || meta.name || c.name;
    const cardType = (meta.card && meta.card.type) || meta.type || c.type;
    return cardName === name && /selector|SELECTOR|filter/i.test(cardType || "");
  });
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function patchSelector(resource, selector, targets, fallbackDsId) {
  const meta = resource.meta || resource;
  const card = meta.card || meta;
  const settings = readSettings(card);

  settings.asFilter = settings.asFilter || {};
  settings.asFilter.targetCdIds = uniq(
    (settings.asFilter.targetCdIds || []).concat(targets)
  );

  // 推断 dsId：优先用 CLI 传入；否则从已有 columnMappings 抓
  const inferredDsId = fallbackDsId || (
    settings.asFilter.columnMappings &&
    settings.asFilter.columnMappings[0] &&
    settings.asFilter.columnMappings[0].targetFields &&
    settings.asFilter.columnMappings[0].targetFields[0] &&
    settings.asFilter.columnMappings[0].targetFields[0].dsId
  );
  if (!inferredDsId) {
    die(`selector "${selector.name}": 推断不出 dsId，请加 --dsId <dataset-id>`);
  }

  // 追加字段映射
  settings.asFilter.columnMappings = settings.asFilter.columnMappings || [{}];
  const mapping = settings.asFilter.columnMappings[0];
  mapping.targetFields = mapping.targetFields || [];
  const existingKey = new Set(
    mapping.targetFields.map(function (t) { return t.cdId + "|" + t.fdId; })
  );
  targets.forEach(function (cdId) {
    const key = cdId + "|" + selector.fdId;
    if (existingKey.has(key)) return;
    mapping.targetFields.push({ cdId, dsId: inferredDsId, fdId: selector.fdId, name: selector.name });
  });

  writeSettings(card, settings);

  return {
    name: selector.name,
    targetCdIdsCount: settings.asFilter.targetCdIds.length,
    targetFieldsCount: mapping.targetFields.length
  };
}

function main() {
  const args = parseArgs(process.argv);
  const descPath = path.resolve(args.descriptor);
  if (!fs.existsSync(descPath)) die("descriptor not found: " + descPath);

  const raw = fs.readFileSync(descPath, "utf8");
  const descriptor = JSON.parse(raw);

  const report = [];
  for (const selector of args.selectors) {
    const resource = findSelector(descriptor, selector.name);
    if (!resource) {
      console.warn(`[patch] selector "${selector.name}" 未找到，跳过`);
      continue;
    }
    report.push(patchSelector(resource, selector, args.targets, args.dsId));
  }

  // 备份后写回
  fs.writeFileSync(descPath + ".bak", raw, "utf8");
  fs.writeFileSync(descPath, JSON.stringify(descriptor, null, 2), "utf8");

  console.log("[patch] done. backup: " + descPath + ".bak");
  console.log(JSON.stringify(report, null, 2));
}

main();
