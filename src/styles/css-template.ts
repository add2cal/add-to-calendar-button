/**
 * Style registry (v3 phase 5).
 *
 * The build inlines the shared core (tokens + core rules) and the DEFAULT style delta
 * into the template map below - unless building the unstyle variants. All other style
 * deltas load on demand:
 *  - script tag / CDN: fetched relative to the script's own origin ({base}/styles/{name}.css),
 *    overridable via the style-source attribute
 *  - npm: import the style module (dist/styles/{name}.js), which registers itself via
 *    atcb_register_style
 * The load-all-styles attribute prefetches every delta for runtime style switching.
 */
import type { ATCBConfig } from '../types';

// build hook: the minified css of core + default gets inlined here (see scripts/build.mjs)
const atcbCssTemplate: { [key: string]: string } = {};

// build hook: relative path from THIS bundle's location to the style assets
const atcbStyleRelPath: string = 'styles/';

const atcbKnownStyles = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];

// capture the script origin at module load (document.currentScript is null later)
const atcbScriptBase: string = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return new URL('.', import.meta.url).href;
    }
  } catch {
    // import.meta unavailable in this bundle format - fall through
  }
  try {
    if (typeof document !== 'undefined' && document.currentScript && (document.currentScript as HTMLScriptElement).src) {
      return new URL('.', (document.currentScript as HTMLScriptElement).src).href;
    }
  } catch {
    // no DOM or opaque script origin - fall through
  }
  return '';
})();

const atcbPendingStyleLoads: Map<string, Promise<string | null>> = new Map();

/**
 * Registers a style delta (css text) under a style name. Public API used by the
 * generated style modules (dist/styles/{name}.js) and available for custom setups.
 */
function atcb_register_style(name: string, css: string): void {
  atcbCssTemplate[`${name}`] = css;
}

function atcb_style_base(data: ATCBConfig): string {
  if (data.styleSource && data.styleSource !== '') {
    const src = String(data.styleSource);
    return src.endsWith('/') ? src : src + '/';
  }
  if (atcbScriptBase === '') {
    return '';
  }
  return atcbScriptBase + atcbStyleRelPath;
}

async function atcb_fetch_style(name: string, data: ATCBConfig): Promise<string | null> {
  const base = atcb_style_base(data);
  if (base === '') {
    if (data.debug) console.warn('Add to Calendar Button: style "' + name + '" is not registered and no style source could be resolved - import the style module or set the style-source attribute');
    return null;
  }
  try {
    const response = await fetch(base + name + '.css');
    if (!response.ok) throw new Error('status ' + response.status);
    const css = await response.text();
    atcb_register_style(name, css);
    return css;
  } catch (e) {
    if (data.debug) console.error('Add to Calendar Button: loading style "' + name + '" from "' + base + '" failed', e);
    return null;
  }
}

/**
 * Resolves the full css (core + style delta) for the configured buttonStyle.
 * Returns null when nothing should be injected (style none, unstyle builds,
 * unknown styles, failed loads) - matching the v2 no-stylesheet behavior.
 */
async function atcb_ensure_style(data: ATCBConfig): Promise<string | null> {
  const name = (data.buttonStyle as string) || 'default';
  if (name === 'none') {
    return null;
  }
  const core = atcbCssTemplate['core'];
  if (!core) {
    // unstyle build: never inject, never fetch
    return null;
  }
  if (atcbCssTemplate[`${name}`]) {
    return core + atcbCssTemplate[`${name}`];
  }
  if (name === 'custom') {
    // the custom style is served via customCss and never lives in the registry
    return null;
  }
  // deduplicate concurrent loads per style name
  if (!atcbPendingStyleLoads.has(name)) {
    atcbPendingStyleLoads.set(
      name,
      atcb_fetch_style(name, data).finally(() => {
        atcbPendingStyleLoads.delete(name);
      }),
    );
  }
  const css = await atcbPendingStyleLoads.get(name)!;
  return css === null ? null : core + css;
}

/**
 * Prefetches all known style deltas (load-all-styles attribute) so styles can be
 * switched at runtime without further requests. Fire-and-forget.
 */
function atcb_prefetch_all_styles(data: ATCBConfig): void {
  if (!atcbCssTemplate['core']) {
    return;
  }
  for (const name of atcbKnownStyles) {
    if (!atcbCssTemplate[`${name}`]) {
      void atcb_ensure_style({ ...data, buttonStyle: name });
    }
  }
}

export { atcbCssTemplate, atcb_register_style, atcb_ensure_style, atcb_prefetch_all_styles };
