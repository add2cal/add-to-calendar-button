/**
 * CSS splitter: derives the split style sources from full per-style stylesheets.
 *
 * Reads the eight monolithic per-style stylesheets (assets/css/atcb*.css)
 * and splits them into:
 *   src/styles/css/tokens.css   - :host custom-property blocks shared by ALL styles
 *   src/styles/css/core.css     - rules shared by ALL styles (structure, list, modal, ...)
 *   src/styles/css/{style}.css  - per-style delta (everything a style adds or alters)
 *
 * Order safety: a delta is appended AFTER core at runtime. Any rule that is common to
 * all files but appears AFTER a same-selector style-specific rule in any file would
 * change cascade outcome when hoisted into core - such rules are DEMOTED into all
 * deltas (fixpoint iteration). A final parity check compares the cascaded
 * (selector, property) -> value map of original vs reconstructed css per style.
 *
 * Usage: node scripts/split-css.mjs [--from <dir>]  (default source dir: assets/css)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromIdx = process.argv.indexOf('--from');
const SRC_DIR = fromIdx > -1 ? path.resolve(root, process.argv[fromIdx + 1]) : path.join(root, 'assets/css');
const OUT_DIR = path.join(root, 'src/styles/css');
const STYLES = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];

const fileFor = (style) => path.join(SRC_DIR, `atcb${style === 'default' ? '' : '-' + style}.css`);

// ---------- parse and normalize ----------

function normalizeDecls(rule) {
  const decls = [];
  rule.walkDecls((d) => decls.push(`${d.prop.trim()}:${d.value.replace(/\s+/g, ' ').trim()}${d.important ? '!important' : ''}`));
  return decls;
}

function nodeKey(node) {
  if (node.type === 'rule') {
    return 'R|' + node.selector.replace(/\s+/g, ' ').trim() + '|' + normalizeDecls(node).join(';');
  }
  if (node.type === 'atrule') {
    const inner = (node.nodes || []).map((n) => nodeKey(n)).join('||');
    return `A|@${node.name} ${(node.params || '').replace(/\s+/g, ' ').trim()}|${inner}`;
  }
  return null; // comments etc.
}

function selectorOf(node) {
  if (node.type === 'rule') return node.selector.replace(/\s+/g, ' ').trim();
  if (node.type === 'atrule') return `@${node.name} ${(node.params || '').replace(/\s+/g, ' ').trim()}`;
  return '';
}

function parseFile(style) {
  const css = fs.readFileSync(fileFor(style), 'utf8');
  const parsed = postcss.parse(css);
  const nodes = [];
  parsed.each((node) => {
    const key = nodeKey(node);
    if (key) nodes.push({ key, selector: selectorOf(node), css: node.toString(), node });
  });
  return nodes;
}

const parsedByStyle = Object.fromEntries(STYLES.map((s) => [s, parseFile(s)]));

// ---------- core detection ----------

// occurrence-aware presence: key -> min occurrence count across files
const occurrence = new Map();
for (const style of STYLES) {
  const counts = new Map();
  for (const n of parsedByStyle[style]) counts.set(n.key, (counts.get(n.key) || 0) + 1);
  for (const [key, count] of counts) {
    if (!occurrence.has(key)) occurrence.set(key, []);
    occurrence.get(key).push(count);
  }
}
const coreKeys = new Set();
for (const [key, counts] of occurrence) {
  if (counts.length === STYLES.length) coreKeys.add(key); // present in all (>=1 each; extra occurrences stay in deltas)
}

// ---------- demotion fixpoint (order safety) ----------

let demoted = [];
let changed = true;
while (changed) {
  changed = false;
  for (const style of STYLES) {
    const seenDeltaSelectors = new Set();
    const usedCore = new Set(); // first occurrence of a core key counts as core
    for (const n of parsedByStyle[style]) {
      const isCore = coreKeys.has(n.key) && !usedCore.has(n.key);
      if (isCore) {
        usedCore.add(n.key);
        if (seenDeltaSelectors.has(n.selector)) {
          // a style-specific rule with the same selector precedes this core rule -> demote
          coreKeys.delete(n.key);
          demoted.push({ style, selector: n.selector });
          changed = true;
          break;
        }
      } else {
        seenDeltaSelectors.add(n.selector);
      }
    }
    if (changed) break;
  }
}

// ---------- declaration-level pass ----------
// Rules whose selector exists in ALL files (same context, same occurrence index) but with
// differing declarations: hoist the declarations identical across all files into a core
// partial rule; keep the per-style remainder as a delta partial rule (same selector,
// appended after core, so the delta wins colliding properties - which is its purpose).

function contextOf(node) {
  let ctx = '';
  let parent = node.parent;
  while (parent && parent.type === 'atrule') {
    ctx = `@${parent.name} ${(parent.params || '').replace(/\s+/g, ' ').trim()}||` + ctx;
    parent = parent.parent;
  }
  return ctx;
}

// collect selector-occurrences per file (top-level rules and rules one level inside atrules)
function selectorOccurrences(style) {
  const occ = new Map(); // ctx|selector -> array of rule nodes in order
  const collect = (rule) => {
    if (coreKeys.has(nodeKey(contextRoot(rule)))) return; // whole containing top-level node already core
    const id = contextOf(rule) + '|' + rule.selector.replace(/\s+/g, ' ').trim();
    if (!occ.has(id)) occ.set(id, []);
    occ.get(id).push(rule);
  };
  for (const n of parsedByStyle[style]) {
    if (coreKeys.has(n.key)) continue;
    if (n.node.type === 'rule') collect(n.node);
    else if (n.node.type === 'atrule' && n.node.nodes) {
      for (const child of n.node.nodes) if (child.type === 'rule') collect(child);
    }
  }
  return occ;
}

function contextRoot(node) {
  let cur = node;
  while (cur.parent && cur.parent.type !== 'root') cur = cur.parent;
  return cur;
}

const occByStyle = Object.fromEntries(STYLES.map((s) => [s, selectorOccurrences(s)]));
// candidate ids present in all files with same occurrence count
const declCoreParts = []; // { id, ctx, selector, decls: [prop:value...] } in default order
const declCoreIds = new Set();
{
  const defaultOcc = occByStyle['default'];
  for (const [id, defaultRules] of defaultOcc) {
    const everywhere = STYLES.every((s) => occByStyle[s].has(id) && occByStyle[s].get(id).length === defaultRules.length);
    if (!everywhere) continue;
    for (let i = 0; i < defaultRules.length; i++) {
      // intersect declarations by prop -> value across all styles
      const declMaps = STYLES.map((s) => {
        const m = new Map();
        for (const d of occByStyle[s].get(id)[i].nodes || []) {
          if (d.type === 'decl') m.set(d.prop.trim() + (d.important ? '!important' : ''), d.value.replace(/\s+/g, ' ').trim());
        }
        return m;
      });
      const common = [];
      for (const [prop, value] of declMaps[0]) {
        if (declMaps.every((m) => m.get(prop) === value)) common.push({ prop, value });
      }
      if (common.length > 0) {
        declCoreParts.push({ id, index: i, ctx: contextOf(defaultRules[i]), selector: defaultRules[i].selector.replace(/\s+/g, ' ').trim(), common });
        declCoreIds.add(id + '#' + i);
      }
    }
  }
}

function partialRuleCss(selector, decls, ctx) {
  const body = decls
    .map((d) => {
      const imp = d.prop.endsWith('!important');
      const prop = imp ? d.prop.slice(0, -'!important'.length) : d.prop;
      return `  ${prop}: ${d.value}${imp ? ' !important' : ''};`;
    })
    .join('\n');
  let css = `${selector} {\n${body}\n}`;
  if (ctx) {
    const layers = ctx.split('||').filter(Boolean).reverse();
    for (const layer of layers) css = `${layer} {\n${css.replace(/^/gm, '  ')}\n}`;
  }
  return css;
}

// strip hoisted declarations from the per-style rules (mutates the ASTs used for deltas)
for (const style of STYLES) {
  for (const part of declCoreParts) {
    const rules = occByStyle[style].get(part.id);
    if (!rules) continue;
    const rule = rules[part.index];
    const commonProps = new Set(part.common.map((c) => c.prop));
    for (const d of [...(rule.nodes || [])]) {
      if (d.type === 'decl' && commonProps.has(d.prop.trim() + (d.important ? '!important' : ''))) d.remove();
    }
  }
}

// ---------- assemble outputs ----------

// canonical core order: the default file's order
const canonicalCore = [];
{
  const used = new Set();
  for (const n of parsedByStyle['default']) {
    if (coreKeys.has(n.key) && !used.has(n.key)) {
      canonicalCore.push(n);
      used.add(n.key);
    }
  }
}

// tokens = leading core :host rules that only declare custom properties (plus width etc. kept in core)
const isTokenRule = (n) => n.node.type === 'rule' && /^:host(?:[(,\s]|$)/.test(n.selector) && n.node.nodes.every((d) => d.type !== 'decl' || d.prop.startsWith('--'));
const tokens = canonicalCore.filter(isTokenRule);
const tokenKeys = new Set(tokens.map((t) => t.key));
const coreRest = canonicalCore.filter((n) => !tokenKeys.has(n.key));

function pruneEmpty(node) {
  // returns css string with empty rules removed; null if nothing left
  if (node.type === 'rule') {
    return (node.nodes || []).some((d) => d.type === 'decl') ? node.toString() : null;
  }
  if (node.type === 'atrule' && node.nodes) {
    const kept = node.nodes.map((c) => (c.type === 'rule' ? ((c.nodes || []).some((d) => d.type === 'decl') ? c.toString() : null) : c.toString())).filter(Boolean);
    if (kept.length === 0) return null;
    return `@${node.name} ${node.params} {\n${kept.join('\n\n').replace(/^/gm, '  ')}\n}`;
  }
  return node.toString();
}

function deltaFor(style) {
  const used = new Set();
  const out = [];
  for (const n of parsedByStyle[style]) {
    if (coreKeys.has(n.key) && !used.has(n.key)) {
      used.add(n.key); // consumed by core
    } else {
      out.push(n);
    }
  }
  return out;
}

function deltaCss(style) {
  return deltaFor(style)
    .map((n) => pruneEmpty(n.node))
    .filter(Boolean);
}

const banner = (what) =>
  `/*\n * Add to Calendar Button - ${what}\n * Generated by scripts/split-css.mjs - edit these split sources, not the reconstructed assets/css files.\n * Runtime assembly: tokens + core + one style delta (deltas append after core).\n * License: Elastic License 2.0 (ELv2)\n */\n\n`;

fs.mkdirSync(OUT_DIR, { recursive: true });
const isTokenPart = (p) => p.ctx === '' && /^:host/.test(p.selector) && p.common.every((c) => c.prop.startsWith('--'));
const tokenParts = declCoreParts.filter(isTokenPart);
const nonTokenParts = declCoreParts.filter((p) => !isTokenPart(p));
const declCoreCss = nonTokenParts
  .map((p) =>
    partialRuleCss(
      p.selector,
      p.common.map((c) => ({ prop: c.prop, value: c.value })),
      p.ctx,
    ),
  )
  .join('\n\n');
const tokenPartCss = tokenParts
  .map((p) =>
    partialRuleCss(
      p.selector,
      p.common.map((c) => ({ prop: c.prop, value: c.value })),
      p.ctx,
    ),
  )
  .join('\n\n');
fs.writeFileSync(path.join(OUT_DIR, 'core.css'), banner('core rules shared by all styles') + coreRest.map((n) => n.css).join('\n\n') + (declCoreCss ? '\n\n/* ---- shared declarations hoisted from per-style rules ---- */\n\n' + declCoreCss : '') + '\n');
fs.writeFileSync(path.join(OUT_DIR, 'tokens.css'), banner('shared design tokens (custom properties identical across all styles)') + [...tokens.map((n) => n.css), tokenPartCss].filter(Boolean).join('\n\n') + '\n');
for (const style of STYLES) {
  fs.writeFileSync(path.join(OUT_DIR, `${style}.css`), banner(`style delta: ${style}`) + deltaCss(style).join('\n\n') + '\n');
}

// ---------- parity check ----------

function cascadeMap(nodes) {
  const map = new Map();
  const walk = (node, context) => {
    if (node.type === 'rule') {
      for (const d of node.nodes || []) {
        if (d.type === 'decl') {
          const key = `${context}|${node.selector.replace(/\s+/g, ' ').trim()}|${d.prop.trim()}${d.important ? '!important' : ''}`;
          map.set(key, d.value.replace(/\s+/g, ' ').trim());
        }
      }
    } else if (node.type === 'atrule' && node.nodes) {
      for (const child of node.nodes) walk(child, `${context}@${node.name} ${node.params}`);
    }
  };
  for (const n of nodes) walk(n.node, '');
  return map;
}

let parityIssues = 0;
const report = [];
const freshOriginal = Object.fromEntries(
  STYLES.map((s) => {
    const css = fs.readFileSync(fileFor(s), 'utf8');
    const nodes = [];
    postcss.parse(css).each((node) => {
      if (node.type !== 'comment') nodes.push({ node });
    });
    return [s, nodes];
  }),
);
for (const style of STYLES) {
  const original = cascadeMap(freshOriginal[style]);
  const reconstructedCss = [fs.readFileSync(path.join(OUT_DIR, 'tokens.css'), 'utf8'), fs.readFileSync(path.join(OUT_DIR, 'core.css'), 'utf8'), fs.readFileSync(path.join(OUT_DIR, style + '.css'), 'utf8')].join('\n');
  const reconNodes = [];
  postcss.parse(reconstructedCss).each((node) => {
    if (node.type !== 'comment') reconNodes.push({ node });
  });
  const reconstructed = cascadeMap(reconNodes);
  const diffs = [];
  for (const [key, value] of original) {
    if (reconstructed.get(key) !== value) diffs.push(`  MISSING/CHANGED: ${key} = ${value} (got: ${reconstructed.get(key)})`);
  }
  for (const key of reconstructed.keys()) {
    if (!original.has(key)) diffs.push(`  EXTRA: ${key}`);
  }
  parityIssues += diffs.length;
  report.push(`${style}: ${diffs.length === 0 ? 'PARITY OK' : 'DIFFS:\n' + diffs.join('\n')}`);
}

// ---------- variable audit ----------

const declaredVars = (css) => new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const sharedVars = new Set([...declaredVars(fs.readFileSync(path.join(OUT_DIR, 'tokens.css'), 'utf8')), ...declaredVars(fs.readFileSync(path.join(OUT_DIR, 'core.css'), 'utf8'))]);
const styleVars = {};
for (const style of STYLES) {
  const vars = declaredVars(fs.readFileSync(path.join(OUT_DIR, style + '.css'), 'utf8'));
  styleVars[style] = [...vars].filter((v) => !sharedVars.has(v));
}

// ---------- summary ----------

const sizes = STYLES.map((s) => `${s}: delta ${fs.statSync(path.join(OUT_DIR, s + '.css')).size} B (original ${fs.statSync(fileFor(s)).size} B)`);
const summary = [
  `core rules: ${coreRest.length} | token rules: ${tokens.length} | demoted (order safety): ${demoted.length}`,
  `tokens.css: ${fs.statSync(path.join(OUT_DIR, 'tokens.css')).size} B | core.css: ${fs.statSync(path.join(OUT_DIR, 'core.css')).size} B`,
  ...sizes,
  `parity: ${parityIssues === 0 ? 'ALL STYLES OK' : parityIssues + ' issues (see below)'}`,
  ...report.filter((r) => !r.endsWith('PARITY OK')),
  `shared vars (${sharedVars.size}): ${[...sharedVars].join(' ')}`,
  ...Object.entries(styleVars).map(([s, v]) => `style-declared vars [${s}] (${v.length}): ${v.join(' ') || '-'}`),
].join('\n');
fs.writeFileSync('/tmp/css-split-report.txt', summary);
console.log(summary.split('\n').slice(0, 16).join('\n'));
if (parityIssues > 0) process.exitCode = 1;
