/**
 * Build orchestrator.
 *
 * Steps:
 *  1. Clean dist/ and regenerate assets/css/*.min.css (clean-css).
 *  2. Vite library builds (ES -> dist/module, CJS -> dist/commonjs) with timezones-ical-library
 *     kept external and the style templates inlined into the atcbCssTemplate object.
 *  3. esbuild IIFE build for classic <script> usage (dist/atcb.js), bundling
 *     timezones-ical-library. With --min additionally dist/atcb.min.js.
 *  4. Types: flat public declaration bundle at dist/index.d.ts (generated from source).
 *  5. Finalize: locale and style assets with ESM/CJS module twins and type stubs,
 *     deprecation shims for the retired no-pro/unstyle/no-pro-unstyle variants at the
 *     old npm subpaths and CDN file names, module-type package.json markers, sanity checks.
 *
 * Usage: node scripts/build.mjs [--min]
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import esbuild from 'esbuild';
import CleanCSS from 'clean-css';
import postcss from 'postcss';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const withMin = process.argv.includes('--min');
const TARGET = 'es2017';
const AVAILABLE_STYLES = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];

const r = (...p) => path.join(root, ...p);

const pkg = JSON.parse(fs.readFileSync(r('package.json'), 'utf8'));

function licenseBanner(subject) {
  return `/*!\n * @preserve\n * Add to Calendar Button\n * ${subject}\n * Version: ${pkg.version}\n * Creator: Jens Kuerschner (https://jekuer.com)\n * Project: https://github.com/add2cal/add-to-calendar-button\n * License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)\n * Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!\n */\n`;
}

// ---------- step 1: clean + css ----------

function cleanOldBuildFiles() {
  fs.rmSync(r('dist'), { recursive: true, force: true });
  // assets/css is generated (gitignored) - ensure it exists on fresh clones
  fs.mkdirSync(r('assets/css'), { recursive: true });
  for (const file of fs.readdirSync(r('assets/css'))) {
    if (file.endsWith('.min.css') || file.endsWith('.min.css.map')) {
      fs.rmSync(r('assets/css', file));
    }
  }
}

// css sources live in src/styles/css (tokens + core + per-style deltas).
// This step minifies them, reconstructs the full per-style stylesheets for
// CDN hotlinks and customCss consumers, and prepares the delta assets for dist/styles.
let cssArtifacts = null;

/**
 * Combines the exact host-level rules contributed by tokens, core, and a style
 * delta. Keeping the light rule before the dark rule is significant: declarations
 * shared by both modes must resolve to the dark value on a dark host.
 */
function mergeCssParts(...parts) {
  const root = postcss.parse(parts.join('\n'));
  root.walkComments((comment) => comment.remove());
  const hostRules = new Map([
    [':host', postcss.rule({ selector: ':host' })],
    [':host(.atcb-dark)', postcss.rule({ selector: ':host(.atcb-dark)' })],
  ]);

  root.each((node) => {
    if (node.type !== 'rule') return;
    const target = hostRules.get(node.selector.trim());
    if (!target) return;
    node.each((child) => target.append(child.clone()));
    node.remove();
  });

  for (const rule of [...hostRules.values()].reverse()) {
    if (!rule.nodes?.length) continue;
    const customProperties = rule.nodes.filter((node) => node.type === 'decl' && node.prop.startsWith('--')).sort((a, b) => a.prop.localeCompare(b.prop));
    const otherNodes = rule.nodes.filter((node) => node.type !== 'decl' || !node.prop.startsWith('--'));
    rule.removeAll();
    rule.append([...otherNodes, ...customProperties]);
    root.prepend(rule);
  }
  return root.toString();
}

function buildCssArtifacts() {
  const srcDir = r('src/styles/css');
  if (!fs.existsSync(path.join(srcDir, 'core.css'))) {
    throw new Error('src/styles/css sources missing - run `node scripts/split-css.mjs` first');
  }
  const cleaner = new CleanCSS({});
  const minify = (file) => {
    const result = cleaner.minify(fs.readFileSync(path.join(srcDir, file), 'utf8'));
    if (result.errors.length > 0) throw new Error(`clean-css failed for ${file}: ${result.errors.join(', ')}`);
    return result.styles;
  };
  const tokensRaw = fs.readFileSync(path.join(srcDir, 'tokens.css'), 'utf8');
  const coreRaw = fs.readFileSync(path.join(srcDir, 'core.css'), 'utf8');
  const groupOverviewRaw = fs.readFileSync(path.join(srcDir, 'group-overview.css'), 'utf8');
  const deltasMin = {};
  for (const style of AVAILABLE_STYLES) {
    const deltaRaw = fs.readFileSync(path.join(srcDir, `${style}.css`), 'utf8');
    const mergedRaw = mergeCssParts(tokensRaw, coreRaw + groupOverviewRaw, deltaRaw);
    const mergedMinResult = cleaner.minify(mergedRaw);
    if (mergedMinResult.errors.length > 0) throw new Error(`clean-css failed for merged ${style} css: ${mergedMinResult.errors.join(', ')}`);
    const mergedMin = mergedMinResult.styles;
    deltasMin[style] = minify(`${style}.css`);
    // reconstructed full stylesheet (v2-compatible artifact, generated - do not edit)
    const suffix = style === 'default' ? '' : `-${style}`;
    const banner = `/*\n * ++++++++++++++++++++++\n * Add to Calendar Button\n * ++++++++++++++++++++++\n *\n * Style: ${style}\n * GENERATED FILE - built from src/styles/css (tokens + core + ${style} delta). Do not edit.\n *\n * Version: ${pkg.version}\n * Creator: Jens Kuerschner (https://jekuer.com)\n * Project: https://github.com/add2cal/add-to-calendar-button\n * License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)\n * Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!\n *\n */\n\n`;
    fs.writeFileSync(r('assets/css', `atcb${suffix}.css`), banner + mergedRaw);
    fs.writeFileSync(r('assets/css', `atcb${suffix}.min.css`), mergedMin);
  }
  cssArtifacts = { coreFull: minify('tokens.css') + minify('core.css') + minify('group-overview.css'), deltas: deltasMin };
}

// ---------- shared: inline style templates ----------

// matches the annotated TS declaration in src/styles/css-template.ts
const CSS_TEMPLATE_HOOK = /const atcbCssTemplate: \{ \[key: string\]: string \} = \{\};/;

function buildCssTemplate() {
  // escaping keeps the inlined css safe inside a double-quoted string; multi-dot and
  // backslash sequences never appear in legitimate css here and are stripped defensively
  const esc = (css) =>
    css
      .replace(/\.{2,}/g, '')
      .replace(/\\/g, '')
      .replace(/"/g, '\\"');
  let output = 'const atcbCssTemplate: { [key: string]: string } = {';
  output += '\r\n"core": "' + esc(cssArtifacts.coreFull) + '",';
  output += '\r\n"default": "' + esc(cssArtifacts.deltas['default']) + '",';
  output += '\r\n};\r\n';
  return output;
}

const STYLE_RELPATH_HOOK = "const atcbStyleRelPath: string = 'styles/';";
const LOCALE_RELPATH_HOOK = "const atcbLocaleRelPath: string = 'locales/';";
const VERSION_HOOK = "const atcbVersion: string = '';";

function injectVersion(code, id) {
  if (!id.replaceAll('\\', '/').endsWith('src/core/globals.ts')) return null;
  if (!code.includes(VERSION_HOOK)) {
    throw new Error('core/globals.ts: version hook not found - build assumption broken');
  }
  return code.replace(VERSION_HOOK, `const atcbVersion: string = '${pkg.version}';`);
}

function injectLocaleRelPath(code, id, relPath) {
  if (!id.replaceAll('\\', '/').endsWith('src/i18n/index.ts')) return null;
  if (!code.includes(LOCALE_RELPATH_HOOK)) {
    throw new Error('i18n/index.ts: locale relpath hook not found - build assumption broken');
  }
  if (!relPath || relPath === 'locales/') return code;
  return code.replace(LOCALE_RELPATH_HOOK, "const atcbLocaleRelPath: string = '" + relPath + "';");
}

function injectCssTemplate(code, id, relPath) {
  if (!id.replaceAll('\\', '/').endsWith('src/styles/css-template.ts')) return null;
  if (!CSS_TEMPLATE_HOOK.test(code)) {
    throw new Error('styles/css-template.ts: css template hook not found - build assumption broken');
  }
  let result = code.replace(CSS_TEMPLATE_HOOK, buildCssTemplate());
  if (relPath && relPath !== 'styles/') {
    if (!result.includes(STYLE_RELPATH_HOOK)) {
      throw new Error('styles/css-template.ts: style relpath hook not found - build assumption broken');
    }
    result = result.replace(STYLE_RELPATH_HOOK, `const atcbStyleRelPath: string = '${relPath}';`);
  }
  return result;
}

// ---------- step 2: vite library builds (es + cjs) ----------

async function buildLib() {
  // the ES build keeps lit external (npm consumers get deduping + tree-shaking);
  // the CJS build bundles lit because lit ships ESM-only and cannot be require()d
  const externals = {
    es: ['timezones-ical-library', /^lit(\/|$)/, /^lit-html(\/|$)/, /^lit-element(\/|$)/, /^@lit\//],
    cjs: ['timezones-ical-library'],
  };
  for (const format of ['es', 'cjs']) {
    await viteBuild({
      configFile: false,
      logLevel: 'warn',
      // the CJS build is consumed by Node (SSR require): resolve lit through its 'node'
      // export condition so the bundled code uses the SSR dom shim instead of touching
      // HTMLElement at module scope
      resolve: format === 'cjs' ? { conditions: ['node', 'production', 'module', 'import', 'default'] } : undefined,
      // cjs has no import.meta: replacing it with an empty object is exactly what the
      // script-base guards are built for (they fall through to document.currentScript /
      // registered bases) - the define acknowledges that and silences the build warning
      define: format === 'cjs' ? { 'import.meta': '{}' } : undefined,
      plugins: [
        {
          name: 'atcb-inline-css',
          enforce: 'pre', // must run before vite transpiles the TS source
          transform(code, id) {
            const versionResult = injectVersion(code, id);
            if (versionResult !== null) return { code: versionResult, map: null };
            const cssResult = injectCssTemplate(code, id, '../styles/');
            if (cssResult !== null) return { code: cssResult, map: null };
            const localeResult = injectLocaleRelPath(code, id, '../locales/');
            return localeResult === null ? null : { code: localeResult, map: null };
          },
        },
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: false,
        target: TARGET,
        lib: {
          entry: r('src/index.ts'),
          formats: [format],
          fileName: () => (format === 'es' ? 'module/index.js' : 'commonjs/index.js'),
        },
        rollupOptions: {
          external: externals[format],
        },
      },
    });
  }
}

// ---------- step 2b: ssr entry (es + cjs) ----------

const SSR_CSS_HOOK = 'const atcbSsrCssTemplate: { [key: string]: string } = {};';
const SSR_LABELS_HOOK = 'const atcbSsrLabels: { [key: string]: string } = {};';
const SSR_RSVP_LABELS_HOOK = 'const atcbSsrRsvpLabels: { [key: string]: { title: string; expired: string; bookedout: string } } = {};';

function injectSsrData(code, id) {
  if (!id.replaceAll('\\', '/').endsWith('src/ssr/index.ts')) return null;
  if (!code.includes(SSR_CSS_HOOK) || !code.includes(SSR_LABELS_HOOK) || !code.includes(SSR_RSVP_LABELS_HOOK)) {
    throw new Error('ssr/index.ts: css/labels hooks not found - build assumption broken');
  }
  // the ssr bundle is server-only: carrying every style delta and every default
  // label is size-uncritical and keeps the shell fetch-free
  const cssMap = { core: cssArtifacts.coreFull };
  for (const style of AVAILABLE_STYLES) {
    cssMap[`${style}`] = cssArtifacts.deltas[`${style}`];
  }
  const labels = {};
  const rsvpLabels = {};
  for (const file of fs.readdirSync(r('src/i18n/locales'))) {
    if (!file.endsWith('.json')) continue;
    const pack = JSON.parse(fs.readFileSync(r('src/i18n/locales', file), 'utf8'));
    if (pack.label && typeof pack.label.addtocalendar === 'string') {
      labels[file.replace(/\.json$/, '')] = pack.label.addtocalendar;
    }
    if (pack.label?.rsvp && typeof pack.label.rsvp.title === 'string' && typeof pack.label.rsvp.expired === 'string' && typeof pack.label.rsvp.bookedout === 'string') {
      rsvpLabels[file.replace(/\.json$/, '')] = pack.label.rsvp;
    }
  }
  return code
    .replace(SSR_CSS_HOOK, `const atcbSsrCssTemplate: { [key: string]: string } = ${JSON.stringify(cssMap)};`)
    .replace(SSR_LABELS_HOOK, `const atcbSsrLabels: { [key: string]: string } = ${JSON.stringify(labels)};`)
    .replace(SSR_RSVP_LABELS_HOOK, `const atcbSsrRsvpLabels: { [key: string]: { title: string; expired: string; bookedout: string } } = ${JSON.stringify(rsvpLabels)};`);
}

async function buildSsr() {
  for (const format of ['es', 'cjs']) {
    await viteBuild({
      configFile: false,
      logLevel: 'warn',
      resolve: format === 'cjs' ? { conditions: ['node', 'production', 'module', 'import', 'default'] } : undefined,
      // see buildLib: acknowledge the import.meta -> {} substitution for the cjs format
      define: format === 'cjs' ? { 'import.meta': '{}' } : undefined,
      plugins: [
        {
          name: 'atcb-ssr-data',
          enforce: 'pre',
          transform(code, id) {
            const result = injectSsrData(code, id);
            return result === null ? null : { code: result, map: null };
          },
        },
      ],
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: false,
        target: 'es2020',
        lib: {
          entry: r('src/ssr/index.ts'),
          formats: [format],
          fileName: () => (format === 'es' ? 'ssr/index.js' : 'ssr/index.cjs'),
        },
        rollupOptions: {
          external: ['timezones-ical-library'],
        },
      },
    });
  }
  fs.writeFileSync(r('dist/ssr/package.json'), '{ "type": "module" }');
}

// ---------- step 2c: DOM-free utilities entry (es + cjs) ----------

async function buildUtils() {
  for (const format of ['es', 'cjs']) {
    await viteBuild({
      configFile: false,
      logLevel: 'warn',
      resolve: {
        alias: [{ find: './globals', replacement: r('src/utils/dom-free-globals.ts') }],
      },
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        minify: false,
        target: 'es2020',
        lib: {
          entry: r('src/utils/index.ts'),
          formats: [format],
          fileName: () => (format === 'es' ? 'utils/index.js' : 'utils/index.cjs'),
        },
        rollupOptions: {
          external: ['timezones-ical-library'],
        },
      },
    });
  }
  fs.writeFileSync(r('dist/utils/package.json'), '{ "type": "module" }');
}

// ---------- step 3: esbuild browser build (iife) ----------

async function buildBrowser({ minify }) {
  const outfile = r('dist', `atcb${minify ? '.min' : ''}.js`);
  await esbuild.build({
    entryPoints: [r('src/entry-browser.ts')],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: TARGET,
    minify,
    legalComments: 'inline',
    charset: 'utf8',
    outfile,
    plugins: [
      {
        name: 'atcb-inline-css',
        setup(build) {
          build.onLoad({ filter: /core[/\\]globals\.ts$/ }, (args) => {
            const code = fs.readFileSync(args.path, 'utf8');
            const result = injectVersion(code, args.path);
            return result === null ? undefined : { contents: result, loader: 'ts' };
          });
          build.onLoad({ filter: /css-template\.ts$/ }, (args) => {
            const code = fs.readFileSync(args.path, 'utf8');
            const result = injectCssTemplate(code, args.path, 'styles/');
            return result === null ? undefined : { contents: result, loader: 'ts' };
          });
        },
      },
    ],
  });
}

// ---------- step 4: public types ----------

function buildTypes() {
  // flat single-file declaration bundles: no deep d.ts import graph to resolve, which
  // keeps the types working for every consumer moduleResolution (bundler, node16, classic)
  execSync('npx dts-bundle-generator -o dist/index.d.ts --inline-declare-global --no-check --no-banner src/index.ts', { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
  execSync('npx dts-bundle-generator -o dist/ssr/index.d.ts --inline-declare-global --no-check --no-banner src/ssr/index.ts', { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
  // Unlike the browser package, the DOM-free utility entry must not carry the
  // global Window/HTMLElement/JSX augmentations declared in src/types.ts.
  execSync('npx dts-bundle-generator -o dist/utils/index.d.ts --no-check --no-banner src/utils/index.ts', { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
  for (const file of ['dist/index.d.ts', 'dist/ssr/index.d.ts', 'dist/utils/index.d.ts']) {
    fs.writeFileSync(r(file), licenseBanner('Public type declarations (generated from src - do not edit)') + '\n' + fs.readFileSync(r(file), 'utf8'));
  }
}

// ---------- step 5: finalize ----------

const DEPRECATED_VARIANTS = ['no-pro', 'unstyle', 'no-pro-unstyle'];

function variantDeprecationMessage(specifier) {
  return `[add-to-calendar-button] "${specifier}" is deprecated: styles load on demand and PRO code is license-gated at runtime, so the dedicated variant builds are gone. This entry simply loads the default package - please switch to it directly.`;
}

function writeVariantShims() {
  for (const variant of DEPRECATED_VARIANTS) {
    const specifier = `add-to-calendar-button/${variant}`;
    const msg = variantDeprecationMessage(specifier);
    fs.mkdirSync(r('dist/module', variant), { recursive: true });
    fs.mkdirSync(r('dist/commonjs', variant), { recursive: true });
    fs.writeFileSync(r('dist/module', variant, 'index.js'), `${licenseBanner(`Deprecation shim for ${specifier}`)}console.info(${JSON.stringify(msg)});\nexport * from '../index.js';\n`);
    fs.writeFileSync(r('dist/commonjs', variant, 'index.js'), `${licenseBanner(`Deprecation shim for ${specifier}`)}'use strict';\nconsole.info(${JSON.stringify(msg)});\nmodule.exports = require('../index.js');\n`);
  }
  // CDN shims at the old file names: tiny loaders that pull in the main bundle from
  // the same location (document.currentScript keeps this CDN- and path-agnostic)
  const cdnShim = (file, target) => {
    const msg = `[add-to-calendar-button] ${file} is deprecated and now only loads ${target} next to it. Please embed ${target} directly.`;
    return (
      licenseBanner(`Deprecation shim for ${file}`) +
      `(function () {\n` +
      `  if (window.atcbShimLoaded) return;\n` +
      `  window.atcbShimLoaded = true;\n` +
      `  console.info(${JSON.stringify(msg)});\n` +
      `  var current = document.currentScript;\n` +
      `  var base = current && current.src ? current.src.substring(0, current.src.lastIndexOf('/') + 1) : '';\n` +
      `  var script = document.createElement('script');\n` +
      `  script.src = base + ${JSON.stringify(target)};\n` +
      `  if (current && current.nonce) script.nonce = current.nonce;\n` +
      `  (document.head || document.documentElement).appendChild(script);\n` +
      `})();\n`
    );
  };
  for (const variant of ['no-pro', 'unstyle', 'no-pro-unstyle']) {
    fs.writeFileSync(r('dist', `atcb-${variant}.js`), cdnShim(`atcb-${variant}.js`, 'atcb.js'));
    if (withMin) {
      fs.writeFileSync(r('dist', `atcb-${variant}.min.js`), cdnShim(`atcb-${variant}.min.js`, 'atcb.min.js'));
    }
  }
}

function finalize() {
  fs.writeFileSync(r('dist/module/package.json'), '{ "type": "module" }');
  fs.writeFileSync(r('dist/commonjs/package.json'), '{ "type": "commonjs" }');
  // locale packs as fetchable assets + self-registering ESM/CJS module twins with type stubs
  fs.mkdirSync(r('dist/locales'), { recursive: true });
  for (const file of fs.readdirSync(r('src/i18n/locales'))) {
    if (!file.endsWith('.json')) continue;
    const lang = file.replace(/\.json$/, '');
    const json = JSON.stringify(JSON.parse(fs.readFileSync(r('src/i18n/locales', file), 'utf8')));
    fs.writeFileSync(r('dist/locales', file), json);
    fs.writeFileSync(r('dist/locales', `${lang}.js`), `import { atcb_register_locale } from '../module/index.js';\n\nconst strings = ${json};\natcb_register_locale('${lang}', strings);\n\nexport { strings };\n`);
    fs.writeFileSync(r('dist/locales', `${lang}.cjs`), `'use strict';\nconst { atcb_register_locale } = require('../commonjs/index.js');\n\nconst strings = ${json};\natcb_register_locale('${lang}', strings);\n\nmodule.exports = { strings };\n`);
    fs.writeFileSync(r('dist/locales', `${lang}.d.ts`), `declare const strings: {\n\t[key: string]: string | { [key: string]: unknown };\n};\nexport { strings };\n`);
  }
  // style deltas as fetchable assets + self-registering ESM/CJS module twins with type stubs
  fs.mkdirSync(r('dist/styles'), { recursive: true });
  for (const style of AVAILABLE_STYLES) {
    const css = JSON.stringify(cssArtifacts.deltas[`${style}`]);
    fs.writeFileSync(r('dist/styles', `${style}.css`), cssArtifacts.deltas[`${style}`]);
    fs.writeFileSync(r('dist/styles', `${style}.js`), `import { atcb_register_style } from '../module/index.js';\n\nconst css = ${css};\natcb_register_style('${style}', css);\n\nexport { css };\n`);
    fs.writeFileSync(r('dist/styles', `${style}.cjs`), `'use strict';\nconst { atcb_register_style } = require('../commonjs/index.js');\n\nconst css = ${css};\natcb_register_style('${style}', css);\n\nmodule.exports = { css };\n`);
    fs.writeFileSync(r('dist/styles', `${style}.d.ts`), `declare const css: string;\nexport { css };\n`);
  }
  writeVariantShims();
}

function sanityCheck() {
  const styled = fs.readFileSync(r('dist/atcb.js'), 'utf8');
  const moduleBuild = fs.readFileSync(r('dist/module/index.js'), 'utf8');
  const cjsBuild = fs.readFileSync(r('dist/commonjs/index.js'), 'utf8');
  const problems = [];
  // match the inlined style template keys in any printer format (quoted, unquoted, minified)
  const coreKey = /["']?core["']?:\s*["']/;
  const defaultKey = /["']?default["']?:\s*["']/;
  const deltaKey = /["']?neumorphism["']?:\s*["']/;
  if (!coreKey.test(styled) || !defaultKey.test(styled)) problems.push('dist/atcb.js: core/default styles not inlined');
  if (deltaKey.test(styled)) problems.push('dist/atcb.js: non-default style deltas must NOT be inlined');
  if (!coreKey.test(moduleBuild) || !defaultKey.test(moduleBuild)) problems.push('dist/module/index.js: core/default styles not inlined');
  for (const style of AVAILABLE_STYLES) {
    for (const ext of ['css', 'js', 'cjs', 'd.ts']) {
      if (!fs.existsSync(r('dist/styles', `${style}.${ext}`))) problems.push(`dist/styles/${style}.${ext} missing`);
    }
    const suffix = style === 'default' ? '' : `-${style}`;
    const fullCssRoot = postcss.parse(fs.readFileSync(r('assets/css', `atcb${suffix}.css`), 'utf8'));
    const fullCssComments = [];
    fullCssRoot.walkComments((comment) => fullCssComments.push(comment));
    if (fullCssComments.length !== 1 || !fullCssComments[0].text.includes('GENERATED FILE')) {
      problems.push(`assets/css/atcb${suffix}.css: only the generated header comment may remain`);
    }
    const fullCssSelectors = fullCssRoot.nodes.filter((node) => node.type === 'rule').map((node) => node.selector.trim());
    if (fullCssSelectors[0] !== ':host' || fullCssSelectors[1] !== ':host(.atcb-dark)') {
      problems.push(`assets/css/atcb${suffix}.css: merged host rules must be first (light, then dark)`);
    }
    if (fullCssSelectors.filter((selector) => selector === ':host').length !== 1 || fullCssSelectors.filter((selector) => selector === ':host(.atcb-dark)').length !== 1) {
      problems.push(`assets/css/atcb${suffix}.css: duplicate merged host rules`);
    }
    for (const selector of [':host', ':host(.atcb-dark)']) {
      const rule = fullCssRoot.nodes.find((node) => node.type === 'rule' && node.selector.trim() === selector);
      const properties = rule?.nodes.filter((node) => node.type === 'decl' && node.prop.startsWith('--')).map((node) => node.prop) ?? [];
      if (properties.some((property, index) => index > 0 && properties[index - 1].localeCompare(property) > 0)) {
        problems.push(`assets/css/atcb${suffix}.css: ${selector} custom properties must be alphabetized`);
      }
    }
  }
  if (!moduleBuild.includes('atcbStyleRelPath = "../styles/"') && !moduleBuild.includes("atcbStyleRelPath = '../styles/'")) problems.push('dist/module/index.js: style relpath not adjusted');
  if (!moduleBuild.includes('atcbLocaleRelPath = "../locales/"') && !moduleBuild.includes("atcbLocaleRelPath = '../locales/'")) problems.push('dist/module/index.js: locale relpath not adjusted');
  if (!styled.includes('addtocalendar')) problems.push('dist/atcb.js: english translations missing');
  if (styled.includes('Im Kalender speichern') || moduleBuild.includes('Im Kalender speichern')) problems.push('bundles must not inline non-english locales');
  for (const ext of ['json', 'js', 'cjs', 'd.ts']) {
    if (!fs.existsSync(r('dist/locales', `de.${ext}`))) problems.push(`dist/locales/de.${ext} missing`);
  }
  if (!styled.includes('@preserve')) problems.push('dist/atcb.js: @preserve license blocks missing');
  if (!styled.includes(`atcbVersion = "${pkg.version}"`) && !styled.includes(`atcbVersion = '${pkg.version}'`)) problems.push(`dist/atcb.js: package version ${pkg.version} not injected`);
  if (!fs.readFileSync(r('assets/css', 'atcb.css'), 'utf8').includes(`Version: ${pkg.version}`)) problems.push(`assets/css/atcb.css: package version ${pkg.version} not injected`);
  if (!moduleBuild.includes('@preserve')) problems.push('dist/module/index.js: @preserve license blocks missing');
  if (!moduleBuild.includes("from 'timezones-ical-library'") && !moduleBuild.includes('from "timezones-ical-library"')) {
    problems.push('dist/module/index.js: timezones-ical-library should stay external');
  }
  if (!moduleBuild.includes("from 'lit") && !moduleBuild.includes('from "lit')) {
    problems.push('dist/module/index.js: lit should stay external');
  }
  if (!cjsBuild.includes('timezones-ical-library')) problems.push('dist/commonjs/index.js: timezones-ical-library require missing');
  if (/require\(["']lit["']\)/.test(cjsBuild)) problems.push('dist/commonjs/index.js: lit must be bundled (no CJS entry upstream)');
  if (!cjsBuild.includes('LitElement') && !cjsBuild.includes('ReactiveElement')) problems.push('dist/commonjs/index.js: bundled lit code missing');
  if (styled.includes("from 'timezones-ical-library'")) problems.push('dist/atcb.js: timezones-ical-library should be bundled');
  if (!styled.includes('LitElement') && !styled.includes('ReactiveElement')) problems.push('dist/atcb.js: bundled lit code missing');
  // public types bundle
  const types = fs.existsSync(r('dist/index.d.ts')) ? fs.readFileSync(r('dist/index.d.ts'), 'utf8') : '';
  if (!types.includes('ATCBActionEventConfig') || !types.includes('AddToCalendarButtonType')) problems.push('dist/index.d.ts: public types missing');
  if (!types.includes('declare global')) problems.push('dist/index.d.ts: global element declarations missing');
  if (!types.includes('atcb_action')) problems.push('dist/index.d.ts: atcb_action declaration missing');
  // ssr entry: all style deltas and all default labels baked in, both module formats
  for (const file of ['index.js', 'index.cjs', 'index.d.ts', 'package.json']) {
    if (!fs.existsSync(r('dist/ssr', file))) problems.push(`dist/ssr/${file} missing`);
  }
  if (fs.existsSync(r('dist/ssr/index.js'))) {
    const ssrBuild = fs.readFileSync(r('dist/ssr/index.js'), 'utf8');
    for (const style of AVAILABLE_STYLES) {
      // eslint-disable-next-line security/detect-non-literal-regexp -- style names come from the literal AVAILABLE_STYLES list above
      if (!new RegExp(`["']?${style.replace(/[^a-z0-9]/g, '\\$&')}["']?:\\s*["']`).test(ssrBuild)) problems.push(`dist/ssr/index.js: ${style} css delta not baked in`);
    }
    if (!ssrBuild.includes('Im Kalender speichern')) problems.push('dist/ssr/index.js: localized default labels not baked in');
    if (!ssrBuild.includes('atcb_generate_ssr_html')) problems.push('dist/ssr/index.js: atcb_generate_ssr_html export missing');
  }
  // utils entry: standalone, DOM-free, and limited to the two public functions
  for (const file of ['index.js', 'index.cjs', 'index.d.ts', 'package.json']) {
    if (!fs.existsSync(r('dist/utils', file))) problems.push(`dist/utils/${file} missing`);
  }
  if (fs.existsSync(r('dist/utils/index.js'))) {
    const utilsBuild = fs.readFileSync(r('dist/utils/index.js'), 'utf8');
    for (const marker of ['LitElement', 'HTMLElement', 'document', 'window', 'navigator', 'atcbCssTemplate', 'customElements']) {
      if (utilsBuild.includes(marker)) problems.push(`dist/utils/index.js: DOM/component marker ${marker} present`);
    }
    if (!utilsBuild.includes('atcb_generate_timestring') || !utilsBuild.includes('atcb_decorate_data_dates')) problems.push('dist/utils/index.js: utility exports missing');
  }
  if (fs.existsSync(r('dist/utils/index.d.ts'))) {
    const utilsTypes = fs.readFileSync(r('dist/utils/index.d.ts'), 'utf8');
    for (const marker of ['declare global', 'HTMLElement', 'Window', 'Document', 'IntrinsicElements']) {
      if (utilsTypes.includes(marker)) problems.push(`dist/utils/index.d.ts: DOM global marker ${marker} present`);
    }
  }
  // deprecation shims: present, tiny, and re-exporting/loading the main artifact
  for (const variant of DEPRECATED_VARIANTS) {
    for (const [file, marker] of [
      [r('dist/module', variant, 'index.js'), "export * from '../index.js'"],
      [r('dist/commonjs', variant, 'index.js'), "require('../index.js')"],
      [r('dist', `atcb-${variant}.js`), 'script.src = base + "atcb.js"'],
    ]) {
      if (!fs.existsSync(file)) {
        problems.push(`${path.relative(root, file)}: deprecation shim missing`);
        continue;
      }
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes(marker)) problems.push(`${path.relative(root, file)}: shim does not delegate to the main artifact`);
      if (!content.includes('deprecated')) problems.push(`${path.relative(root, file)}: deprecation notice missing`);
      if (content.length > 2048) problems.push(`${path.relative(root, file)}: shim unexpectedly large (${content.length} bytes)`);
    }
  }
  if (withMin && !fs.readFileSync(r('dist/atcb.min.js'), 'utf8').includes('@preserve')) {
    problems.push('dist/atcb.min.js: @preserve license blocks missing after minification');
  }
  if (problems.length > 0) {
    throw new Error('build sanity check failed:\n- ' + problems.join('\n- '));
  }
}

// ---------- run ----------

const started = Date.now();
cleanOldBuildFiles();
buildCssArtifacts();
await buildLib();
await buildSsr();
await buildUtils();
await buildBrowser({ minify: false });
if (withMin) {
  await buildBrowser({ minify: true });
}
buildTypes();
finalize();
sanityCheck();
console.log(`build done in ${((Date.now() - started) / 1000).toFixed(1)}s${withMin ? ' (incl. minified browser bundle)' : ''}`);
