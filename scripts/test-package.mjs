/**
 * Package consumption tests: prove the built npm package works for every consumer
 * path BEFORE it ships - Node CJS require, Node ESM import, per-entry types under
 * both bundler and node16 module resolution, and a real bundler build (vite)
 * importing the package with one extra style and one extra locale.
 *
 * The package is built with --min, packed via `npm pack`, and installed into a
 * throwaway consumer project (network access for the two runtime dependencies).
 *
 * Usage: node scripts/test-package.mjs [--keep] (keeps the consumer dir for inspection)
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const keep = process.argv.includes('--keep');
const consumerDir = path.join(os.tmpdir(), 'atcb-consumer-test');
const run = (cmd, cwd = root, opts = {}) => execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8', ...opts });

const steps = [];
const step = (name, fn) => steps.push({ name, fn });
let tarball = '';

// ---------- setup ----------

step('build package artifacts (--min)', () => {
  run('node scripts/build.mjs --min');
});

step('npm pack + install into a throwaway consumer', () => {
  fs.rmSync(consumerDir, { recursive: true, force: true });
  fs.mkdirSync(consumerDir, { recursive: true });
  const packOutput = run(`npm pack --pack-destination ${JSON.stringify(consumerDir)}`)
    .trim()
    .split('\n');
  tarball = path.join(consumerDir, packOutput[packOutput.length - 1]);
  fs.writeFileSync(path.join(consumerDir, 'package.json'), JSON.stringify({ name: 'atcb-consumer', private: true, type: 'module' }, null, 2));
  run(`npm install --no-audit --no-fund --loglevel=error ${JSON.stringify(tarball)}`, consumerDir);
});

// ---------- node runtime consumption ----------

step('Node CJS require (root, style, locale, deprecated variant)', () => {
  fs.writeFileSync(
    path.join(consumerDir, 'probe.cjs'),
    [
      "const assert = require('node:assert');",
      "const m = require('add-to-calendar-button');",
      "assert.strictEqual(typeof m.atcb_action, 'function', 'atcb_action exported');",
      "assert.strictEqual(typeof m.atcb_register_style, 'function', 'atcb_register_style exported');",
      "const style = require('add-to-calendar-button/styles/3d');",
      "assert.ok(style.css.includes('--btn-active-shadow-up'), '3d css delta content');",
      "assert.ok(m.cssStyles['3d'] === style.css, 'style module registers itself');",
      "const de = require('add-to-calendar-button/i18n/de');",
      "assert.ok(JSON.stringify(de.strings).includes('Im Kalender speichern'), 'de strings content');",
      "assert.ok(m.i18nStrings['de'], 'locale module registers itself');",
      "const shim = require('add-to-calendar-button/no-pro');",
      "assert.strictEqual(shim.atcb_action, m.atcb_action, 'deprecated variant re-exports the main module');",
      "const ssr = require('add-to-calendar-button/ssr');",
      "assert.ok(ssr.atcb_generate_ssr_html({ name: 'X' }).includes('shadowrootmode'), 'ssr shell renders via require');",
      "console.log('cjs consumption ok');",
    ].join('\n'),
  );
  const out = run('node probe.cjs', consumerDir);
  if (!out.includes('cjs consumption ok')) throw new Error('cjs probe failed: ' + out);
});

step('Node ESM import (root, style, locale, deprecated variant)', () => {
  fs.writeFileSync(
    path.join(consumerDir, 'probe.mjs'),
    [
      "import assert from 'node:assert';",
      "import * as m from 'add-to-calendar-button';",
      "import { css } from 'add-to-calendar-button/styles/3d';",
      "import { strings } from 'add-to-calendar-button/i18n/de';",
      "import * as shim from 'add-to-calendar-button/unstyle';",
      "import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';",
      "assert.strictEqual(typeof m.atcb_action, 'function', 'atcb_action exported');",
      "assert.ok(css.includes('--btn-active-shadow-up'), '3d css delta content');",
      "assert.ok(JSON.stringify(strings).includes('Im Kalender speichern'), 'de strings content');",
      "assert.ok(m.i18nStrings['de'], 'locale module registers itself');",
      "assert.strictEqual(shim.atcb_action, m.atcb_action, 'deprecated variant re-exports the main module');",
      "assert.ok(atcb_generate_ssr_html({ name: 'X' }).includes('shadowrootmode'), 'ssr shell renders via import');",
      "console.log('esm consumption ok');",
    ].join('\n'),
  );
  const out = run('node probe.mjs', consumerDir);
  if (!out.includes('esm consumption ok')) throw new Error('esm probe failed: ' + out);
});

// ---------- types consumption ----------

const typesProbe = [
  "import type { ATCBActionEventConfig, AddToCalendarButtonType, EventDate } from 'add-to-calendar-button';",
  "import { atcb_action } from 'add-to-calendar-button';",
  "export const config: ATCBActionEventConfig = { name: 'Probe', startDate: '2050-06-15', options: ['Google'], language: 'de' };",
  'export const call: (c: ATCBActionEventConfig) => Promise<string> = atcb_action;',
  "export const date: EventDate = { name: 'Sub' };",
  "export const el: HTMLElement & AddToCalendarButtonType = document.createElement('add-to-calendar-button');",
].join('\n');

step('types resolve under moduleResolution bundler and node16', () => {
  fs.writeFileSync(path.join(consumerDir, 'probe-types.ts'), typesProbe);
  const base = { strict: true, noEmit: true, skipLibCheck: true, lib: ['ES2020', 'DOM', 'DOM.Iterable'] };
  fs.writeFileSync(path.join(consumerDir, 'tsconfig-bundler.json'), JSON.stringify({ compilerOptions: { ...base, target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler' }, files: ['probe-types.ts'] }, null, 2));
  fs.writeFileSync(path.join(consumerDir, 'tsconfig-node16.json'), JSON.stringify({ compilerOptions: { ...base, target: 'ES2020', module: 'Node16', moduleResolution: 'Node16' }, files: ['probe-types.ts'] }, null, 2));
  const tsc = path.join(root, 'node_modules', '.bin', 'tsc');
  run(`${JSON.stringify(tsc)} -p tsconfig-bundler.json`, consumerDir);
  run(`${JSON.stringify(tsc)} -p tsconfig-node16.json`, consumerDir);
});

// ---------- bundler consumption ----------

step('vite build with one extra style and one extra locale (size-bounded)', async () => {
  const appDir = path.join(consumerDir, 'vite-app');
  fs.mkdirSync(appDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, 'index.html'), '<!doctype html><html><head><script type="module" src="/main.js"></script></head><body><add-to-calendar-button name="Probe" startDate="2050-06-15"></add-to-calendar-button></body></html>');
  fs.writeFileSync(path.join(appDir, 'main.js'), ["import 'add-to-calendar-button';", "import 'add-to-calendar-button/styles/3d';", "import 'add-to-calendar-button/i18n/de';"].join('\n'));
  const { build } = await import('vite');
  await build({ root: appDir, logLevel: 'error', build: { outDir: 'out' } });
  const assetsDir = path.join(appDir, 'out', 'assets');
  const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
  let total = 0;
  let bundle = '';
  for (const f of jsFiles) {
    const content = fs.readFileSync(path.join(assetsDir, f), 'utf8');
    total += content.length;
    bundle += content;
  }
  const kb = Math.round(total / 1024);
  if (!bundle.includes('Im Kalender speichern')) throw new Error('vite bundle: imported de locale missing');
  if (!bundle.includes('--btn-active-shadow-up')) throw new Error('vite bundle: imported 3d style delta missing');
  if (!bundle.includes('addtocalendar')) throw new Error('vite bundle: core translation keys missing');
  if (bundle.includes('Ajouter au Calendrier')) throw new Error('vite bundle: locale subsetting broken (fr strings leaked in)');
  if (kb < 80) throw new Error(`vite bundle unexpectedly small (${kb} KB) - is the package content missing?`);
  if (kb > 400) throw new Error(`vite bundle unexpectedly large (${kb} KB) - lazy loading of styles/locales may be broken`);
  console.log(`  vite bundle: ${jsFiles.length} js asset(s), ${kb} KB minified`);
});

// ---------- run ----------

const started = Date.now();
let failed = false;
for (const { name, fn } of steps) {
  const stepStart = Date.now();
  try {
    await fn();
    console.log(`ok   ${name} (${((Date.now() - stepStart) / 1000).toFixed(1)}s)`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${name}`);
    console.error(String(error.stdout || '') + String(error.stderr || '') + String(error.message || error));
    break;
  }
}
if (!keep) fs.rmSync(consumerDir, { recursive: true, force: true });
console.log(`package consumption tests ${failed ? 'FAILED' : 'passed'} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
if (failed) process.exit(1);
