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

function minifyCss() {
  const cleaner = new CleanCSS({});
  for (const file of fs.readdirSync(r('assets/css'))) {
    if (!file.endsWith('.css') || file.endsWith('.min.css')) continue;
    const source = fs.readFileSync(r('assets/css', file), 'utf8');
    const result = cleaner.minify(source);
    if (result.errors.length > 0) {
      throw new Error(`clean-css failed for ${file}: ${result.errors.join(', ')}`);
    }
    fs.writeFileSync(r('assets/css', file.replace(/\.css$/, '.min.css')), result.styles);
  }
}

// ---------- shared: inline style templates ----------

// matches the annotated TS declaration in src/atcb-globals.ts
const CSS_TEMPLATE_HOOK = /const atcbCssTemplate: \{ \[key: string\]: string \} = \{\};/;

function buildCssTemplate() {
  let output = 'const atcbCssTemplate: { [key: string]: string } = {';
  for (const style of AVAILABLE_STYLES) {
    const suffix = style !== 'default' ? `-${style}` : '';
    // mirror the former Grunt escaping: strip multi-dots and backslashes, escape double quotes
    const css = fs
      .readFileSync(r('assets/css', `atcb${suffix.replace(/[^a-z0-9-]/gi, '')}.min.css`), 'utf8')
      .replace(/\.{2,}/g, '')
      .replace(/\\/g, '')
      .replace(/"/g, '\\"');
    output += '\r\n"' + style + '": "' + css + '",';
  }
  output += '\r\n};\r\n';
  return output;
}

function injectCssTemplate(code, id) {
  if (!id.replaceAll('\\', '/').endsWith('src/styles/css-template.ts')) return null;
  if (!CSS_TEMPLATE_HOOK.test(code)) {
    throw new Error('styles/css-template.ts: css template hook not found - build assumption broken');
  }
  return code.replace(CSS_TEMPLATE_HOOK, buildCssTemplate());
}

// ---------- step 2: vite library builds (es + cjs) ----------

async function buildLib({ unstyle }) {
  const sub = unstyle ? '/unstyle' : '';
  await viteBuild({
    configFile: false,
    logLevel: 'warn',
    plugins: unstyle
      ? []
      : [
          {
            name: 'atcb-inline-css',
            enforce: 'pre', // must run before vite transpiles the TS source
            transform(code, id) {
              const result = injectCssTemplate(code, id);
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
        formats: ['es', 'cjs'],
        fileName: (format) => (format === 'es' ? `module${sub}/index.js` : `commonjs${sub}/index.js`),
      },
      rollupOptions: {
        external: ['timezones-ical-library'],
      },
    },
  });
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
                const result = injectCssTemplate(code, args.path);
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
}

function sanityCheck() {
  const styled = fs.readFileSync(r('dist/atcb.js'), 'utf8');
  const unstyled = fs.readFileSync(r('dist/atcb-unstyle.js'), 'utf8');
  const moduleBuild = fs.readFileSync(r('dist/module/index.js'), 'utf8');
  const cjsBuild = fs.readFileSync(r('dist/commonjs/index.js'), 'utf8');
  const problems = [];
  // match the inlined style template key in any printer format (quoted, unquoted, minified)
  const styleKey = /["']?neumorphism["']?:\s*["']/;
  if (!styleKey.test(styled)) problems.push('dist/atcb.js: styles not inlined');
  if (styleKey.test(unstyled)) problems.push('dist/atcb-unstyle.js: styles unexpectedly inlined');
  if (!styleKey.test(moduleBuild)) problems.push('dist/module/index.js: styles not inlined');
  if (!styled.includes('@preserve')) problems.push('dist/atcb.js: @preserve license blocks missing');
  if (!moduleBuild.includes('@preserve')) problems.push('dist/module/index.js: @preserve license blocks missing');
  if (!moduleBuild.includes("from 'timezones-ical-library'") && !moduleBuild.includes('from "timezones-ical-library"')) {
    problems.push('dist/module/index.js: timezones-ical-library should stay external');
  }
  if (!cjsBuild.includes('timezones-ical-library')) problems.push('dist/commonjs/index.js: timezones-ical-library require missing');
  if (styled.includes("from 'timezones-ical-library'")) problems.push('dist/atcb.js: timezones-ical-library should be bundled');
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
minifyCss();
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
