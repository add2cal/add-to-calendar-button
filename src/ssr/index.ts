/**
 * Server-side rendering entry (`add-to-calendar-button/ssr`).
 *
 * Renders a declarative shadow DOM SHELL for the button: a style- and size-correct
 * placeholder that paints before any client JavaScript runs. The client bundle then
 * upgrades the element and swaps the shell for the fully decorated button without
 * layout shift.
 *
 * Deliberate constraints (the shell is a placeholder, not a server-rendered button):
 * - no config decoration, no validation, no timezone math, no network fetches
 * - only the visual essentials are honored: buttonStyle, size, lightMode, rtl (from
 *   the language), and the real label when it is derivable without decoration
 *   (label attribute, else the localized default from the bundled packs)
 * - `buttonStyle="date"` renders skeleton spans for everything that needs date math
 * - inline RSVP (`rsvp` + `inline-rsvp`) renders a simple skeleton block
 * - everything else (options, list behavior, hide flags, ...) is left to hydration
 *
 * Browsers without declarative shadow DOM support treat the template as inert and
 * the element initializes client-only, exactly like the script-tag path.
 */
import type { AddToCalendarButtonType } from '../types';
import { atcbIcon } from '../core/globals';
import { rtlLanguages } from '../i18n/index';
import { atcb_decorate_sizes } from '../core/sizes';
import { officialAttributeName } from '../compat/attributes';

// filled at build time with the minified tokens+core css plus EVERY per-style delta
// (the ssr bundle is server-only, so carrying all styles is size-uncritical)
const atcbSsrCssTemplate: { [key: string]: string } = {};

// the default button label per language, statically extracted from the locale packs
// at build time (a static import is not a fetch - the no-fetch constraint holds)
const atcbSsrLabels: { [key: string]: string } = {};

const KNOWN_STYLES = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function serializeAttributeValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

function skeletonSpan(width: string): string {
  return `<span class="atcb-ssr-skeleton" style="width:${width}">&nbsp;</span>`;
}

/**
 * Renders the complete element HTML: host tag with all config attributes plus the
 * declarative shadow DOM template carrying the shell. Drop the returned string into
 * server-rendered HTML; the client bundle takes over from there.
 */
function atcb_generate_ssr_html(config: AddToCalendarButtonType & { [key: string]: unknown }): string {
  // --- the few config bits the shell honors ---
  const buttonStyle = typeof config.buttonStyle === 'string' && KNOWN_STYLES.includes(config.buttonStyle) ? config.buttonStyle : 'default';
  const language = typeof config.language === 'string' && config.language ? config.language : 'en';
  const baseLanguage = language.split(/[-_]/)[0]!.toLowerCase();
  const rtl = rtlLanguages.includes(baseLanguage);
  const sizes = atcb_decorate_sizes(typeof config.size === 'string' ? config.size : undefined);
  const lightMode = config.lightMode === 'dark' ? 'dark' : config.lightMode === 'bodyScheme' ? 'bodyScheme' : 'light';
  const label = typeof config.label === 'string' && config.label !== '' ? config.label : atcbSsrLabels[`${baseLanguage}`] || atcbSsrLabels['en'] || 'Add to Calendar';
  const inline = config.inline === true || config.inline === 'true';
  const inlineRsvp = Boolean(config.rsvp) && Boolean(config.inlineRsvp);
  const hidden = config.hidden === true || config.hidden === 'true';
  const identifier = typeof config.identifier === 'string' && /^[\w-]+$/.test(config.identifier) ? config.identifier : '';

  // --- host attributes: every config key, serialized under its official name ---
  const attributes: string[] = [];
  for (const [key, value] of Object.entries(config)) {
    const serialized = serializeAttributeValue(value);
    if (serialized === null) continue;
    attributes.push(`${officialAttributeName(key)}="${escapeAttribute(serialized)}"`);
  }

  // --- styles: mirror what the client injects (general layout css + registry css) ---
  const initWidth = inlineRsvp ? '100%' : 'fit-content';
  const generalCss = `.atcb-initialized { display: block; position: relative; width: ${initWidth}; }.atcb-initialized.atcb-inline { display: inline-block; }.atcb-hidden { display: none; }.atcb-ssr-skeleton { display: inline-block; background: currentColor; opacity: 0.15; border-radius: 0.3em; min-width: 2ch; }.atcb-ssr-skeleton-block { display: block; width: 100%; border-radius: 6px; }`;
  const styleCss = (atcbSsrCssTemplate['core'] || '') + (atcbSsrCssTemplate[`${buttonStyle}`] || '');

  // --- shell content ---
  const sizeStyle = `--base-font-size-l:${sizes['l']}px;--base-font-size-m:${sizes['m']}px;--base-font-size-s:${sizes['s']}px;`;
  const buttonId = identifier !== '' ? ` id="atcb-btn-${escapeAttribute(identifier)}"` : '';
  const content = (function () {
    if (inlineRsvp) {
      return `<div class="atcb-ssr-skeleton atcb-ssr-skeleton-block" style="height: 220px;"></div>`;
    }
    const inner = (function () {
      if (buttonStyle === 'date') {
        const headline = typeof config.label === 'string' && config.label !== '' ? escapeText(config.label) : typeof config.name === 'string' && config.name !== '' ? escapeText(config.name) : skeletonSpan('12ch');
        return `<div class="atcb-date-btn-left"><div class="atcb-date-btn-day">${skeletonSpan('2ch')}</div><div class="atcb-date-btn-month">${skeletonSpan('3ch')}</div></div><div class="atcb-date-btn-right"><div class="atcb-date-btn-details"><div class="atcb-date-btn-headline">${headline}</div><div class="atcb-date-btn-content">${skeletonSpan('16ch')}</div></div></div><div class="atcb-date-btn-plus">+</div>`;
      }
      return `<div class="atcb-icon atcb-icon-trigger" part="atcb-button-icon">${atcbIcon['trigger']}</div><span class="atcb-text" part="atcb-button-text">${escapeText(label)}</span><div class="atcb-dropdown-anchor"></div>`;
    })();
    return `<div class="atcb-button-wrapper${rtl ? ' atcb-rtl' : ''}" part="atcb-button-wrapper" style="${sizeStyle}"><button type="button" class="atcb-button" part="atcb-button"${buttonId} aria-expanded="false" aria-label="${escapeAttribute(typeof label === 'string' ? label : 'Add to Calendar')}">${inner}</button></div>`;
  })();

  const rootClasses = `atcb-initialized${hidden ? ' atcb-hidden' : ''}${inline ? ' atcb-inline' : ''}`;
  // data-atcb-ssr distinguishes the shell wrapper from the client-rendered one while
  // both exist during hydration (client queries exclude it)
  const shell = `<style>${generalCss}</style><style>${styleCss}</style><div class="${rootClasses}" data-atcb-ssr lang="${escapeAttribute(baseLanguage)}">${hidden ? '' : content}</div>`;

  return `<add-to-calendar-button class="add-to-calendar atcb-${lightMode}" ${attributes.join(' ')}><template shadowrootmode="open">${shell}</template></add-to-calendar-button>`;
}

export { atcb_generate_ssr_html };
