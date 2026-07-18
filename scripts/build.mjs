/**
 * Build orchestrator (replaces the former Grunt pipeline).
 *
 * Steps:
 *  1. Clean dist/ and regenerate assets/css/*.min.css (clean-css, as grunt-contrib-cssmin did).
 *  2. Vite library builds (ES -> dist/module, CJS -> dist/commonjs), styled and unstyle,
 *     with timezones-ical-library kept external and the style templates inlined into
 *     the atcbCssTemplate object (exactly like the former Grunt string replacement).
 *  3. esbuild IIFE builds for classic <script> usage (dist/atcb.js, dist/atcb-unstyle.js),
 *     bundling timezones-ical-library. With --min additionally dist/atcb.min.js and
 *     dist/atcb-unstyle.min.js (replaces `grunt uglifyMain`).
 *  4. Finalize: no-pro variants as copies of the pro builds (they get replaced by proper
 *     deprecation shims in refactor phase 7), module-type package.json markers, sanity checks.
 *
 * Usage: node scripts/build.mjs [--min]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as viteBuild } from 'vite';
import esbuild from 'esbuild';
import CleanCSS from 'clean-css';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const withMin = process.argv.includes('--min');
const TARGET = 'es2017';
const AVAILABLE_STYLES = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];

const r = (...p) => path.join(root, ...p);

// ---------- step 1: clean + css ----------

function cleanOldBuildFiles() {
  fs.rmSync(r('dist'), { recursive: true, force: true });
  for (const file of fs.readdirSync(r('assets/css'))) {
    if (file.endsWith('.min.css') || file.endsWith('.min.css.map')) {
      fs.rmSync(r('assets/css', file));
    }
  }
}

// phase 5: css sources live in src/styles/css (tokens + core + per-style deltas).
// This step minifies them, reconstructs the v2-compatible full per-style files for
// CDN hotlinks and customCss consumers, and prepares the delta assets for dist/styles.
let cssArtifacts = null;

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
  const version = JSON.parse(fs.readFileSync(r('package.json'), 'utf8')).version;
  const tokensRaw = fs.readFileSync(path.join(srcDir, 'tokens.css'), 'utf8');
  const coreRaw = fs.readFileSync(path.join(srcDir, 'core.css'), 'utf8');
  const tokensMin = minify('tokens.css');
  const coreMin = minify('core.css');
  const deltasMin = {};
  for (const style of AVAILABLE_STYLES) {
    deltasMin[style] = minify(`${style}.css`);
    // reconstructed full stylesheet (v2-compatible artifact, generated - do not edit)
    const suffix = style === 'default' ? '' : `-${style}`;
    const banner = `/*\n * ++++++++++++++++++++++\n * Add to Calendar Button\n * ++++++++++++++++++++++\n *\n * Style: ${style}\n * GENERATED FILE - built from src/styles/css (tokens + core + ${style} delta). Do not edit.\n *\n * Version: ${version}\n * Creator: Jens Kuerschner (https://jekuer.com)\n * Project: https://github.com/add2cal/add-to-calendar-button\n * License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)\n * Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!\n *\n */\n\n`;
    const deltaRaw = fs.readFileSync(path.join(srcDir, `${style}.css`), 'utf8');
    fs.writeFileSync(r('assets/css', `atcb${suffix}.css`), banner + tokensRaw + '\n' + coreRaw + '\n' + deltaRaw);
    fs.writeFileSync(r('assets/css', `atcb${suffix}.min.css`), tokensMin + coreMin + deltasMin[style]);
  }
  cssArtifacts = { coreFull: tokensMin + coreMin, deltas: deltasMin };
}

// ---------- shared: inline style templates ----------

// matches the annotated TS declaration in src/atcb-globals.ts
const CSS_TEMPLATE_HOOK = /const atcbCssTemplate: \{ \[key: string\]: string \} = \{\};/;

function buildCssTemplate() {
  // mirror the former Grunt escaping: strip multi-dots and backslashes, escape double quotes
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

async function buildLib({ unstyle }) {
  const sub = unstyle ? '/unstyle' : '';
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
      plugins: unstyle
        ? []
        : [
            {
              name: 'atcb-inline-css',
              enforce: 'pre', // must run before vite transpiles the TS source
              transform(code, id) {
                const result = injectCssTemplate(code, id, '../styles/');
                return result === null ? null : { code: result, map: null };
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
          fileName: () => (format === 'es' ? `module${sub}/index.js` : `commonjs${sub}/index.js`),
        },
        rollupOptions: {
          external: externals[format],
        },
      },
    });
  }
}

// ---------- step 3: esbuild browser builds (iife) ----------

async function buildBrowser({ unstyle, minify }) {
  const base = unstyle ? 'atcb-unstyle' : 'atcb';
  const outfile = r('dist', `${base}${minify ? '.min' : ''}.js`);
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
    plugins: unstyle
      ? []
      : [
          {
            name: 'atcb-inline-css',
            setup(build) {
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

// ---------- step 4: finalize ----------

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(r(to)), { recursive: true });
  fs.copyFileSync(r(from), r(to));
}

function finalize() {
  // no-pro variants are copies of the pro builds for now (proper shims come in phase 7);
  // the pro code paths are license-guarded at runtime, so the superset is functionally safe
  copyFile('dist/atcb.js', 'dist/atcb-no-pro.js');
  copyFile('dist/atcb-unstyle.js', 'dist/atcb-no-pro-unstyle.js');
  copyFile('dist/module/index.js', 'dist/module/no-pro/index.js');
  copyFile('dist/module/unstyle/index.js', 'dist/module/no-pro-unstyle/index.js');
  copyFile('dist/commonjs/index.js', 'dist/commonjs/no-pro/index.js');
  copyFile('dist/commonjs/unstyle/index.js', 'dist/commonjs/no-pro-unstyle/index.js');
  fs.writeFileSync(r('dist/module/package.json'), '{ "type": "module" }');
  fs.writeFileSync(r('dist/commonjs/package.json'), '{ "type": "commonjs" }');
  // style deltas as fetchable assets + self-registering ES modules
  fs.mkdirSync(r('dist/styles'), { recursive: true });
  for (const style of AVAILABLE_STYLES) {
    fs.writeFileSync(r('dist/styles', `${style}.css`), cssArtifacts.deltas[`${style}`]);
    const moduleCode = `import { atcb_register_style } from '../module/index.js';\n\nconst css = ${JSON.stringify(cssArtifacts.deltas[`${style}`])};\natcb_register_style('${style}', css);\n\nexport { css };\n`;
    fs.writeFileSync(r('dist/styles', `${style}.js`), moduleCode);
  }
}

function sanityCheck() {
  const styled = fs.readFileSync(r('dist/atcb.js'), 'utf8');
  const unstyled = fs.readFileSync(r('dist/atcb-unstyle.js'), 'utf8');
  const moduleBuild = fs.readFileSync(r('dist/module/index.js'), 'utf8');
  const cjsBuild = fs.readFileSync(r('dist/commonjs/index.js'), 'utf8');
  const problems = [];
  // match the inlined style template keys in any printer format (quoted, unquoted, minified)
  const coreKey = /["']?core["']?:\s*["']/;
  const defaultKey = /["']?default["']?:\s*["']/;
  const deltaKey = /["']?neumorphism["']?:\s*["']/;
  if (!coreKey.test(styled) || !defaultKey.test(styled)) problems.push('dist/atcb.js: core/default styles not inlined');
  if (deltaKey.test(styled)) problems.push('dist/atcb.js: non-default style deltas must NOT be inlined');
  if (coreKey.test(unstyled)) problems.push('dist/atcb-unstyle.js: styles unexpectedly inlined');
  if (!coreKey.test(moduleBuild) || !defaultKey.test(moduleBuild)) problems.push('dist/module/index.js: core/default styles not inlined');
  for (const style of AVAILABLE_STYLES) {
    if (!fs.existsSync(r('dist/styles', `${style}.css`)) || !fs.existsSync(r('dist/styles', `${style}.js`))) {
      problems.push(`dist/styles/${style}.css/.js missing`);
    }
  }
  if (!moduleBuild.includes('atcbStyleRelPath = "../styles/"') && !moduleBuild.includes("atcbStyleRelPath = '../styles/'")) problems.push('dist/module/index.js: style relpath not adjusted');
  if (!styled.includes('@preserve')) problems.push('dist/atcb.js: @preserve license blocks missing');
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
await buildLib({ unstyle: false });
await buildLib({ unstyle: true });
await buildBrowser({ unstyle: false, minify: false });
await buildBrowser({ unstyle: true, minify: false });
if (withMin) {
  await buildBrowser({ unstyle: false, minify: true });
  await buildBrowser({ unstyle: true, minify: true });
}
finalize();
sanityCheck();
console.log(`build done in ${((Date.now() - started) / 1000).toFixed(1)}s${withMin ? ' (incl. minified browser bundles)' : ''}`);
