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
import { icons, wcParams, wcProParams } from '../core/globals';
import { rtlLanguages } from '../i18n/index';
import { decorate_sizes } from '../core/sizes';
import { officialAttributeName, legacyAttributeName } from '../compat/attributes';
import { secure_url, strip_unsafe_keys } from '../core/text';

// filled at build time with the minified tokens+core css plus EVERY per-style delta
// (the ssr bundle is server-only, so carrying all styles is size-uncritical)
const atcbSsrCssTemplate: { [key: string]: string } = {};

// the default button label per language, statically extracted from the locale packs
// at build time (a static import is not a fetch - the no-fetch constraint holds)
const atcbSsrLabels: { [key: string]: string } = {};

// the RSVP button labels per language, injected alongside the default labels
const atcbSsrRsvpLabels: { [key: string]: { title: string; expired: string; bookedout: string } } = {};

const KNOWN_STYLES = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date'];

/**
 * Normalizes config keys to the internal camelCase form. Accepts the official
 * kebab-case attribute spellings ('start-date', 'button-style', ...) and legacy
 * lowercased names ('startdate', ...) in addition to camelCase - mirroring what
 * the element accepts on the tag. camelCase input wins when both are present,
 * since the kebab form would overwrite it otherwise.
 */
function normalizeConfig(config: AddToCalendarButtonType & { [key: string]: unknown }): AddToCalendarButtonType & { [key: string]: unknown } {
  const normalized: { [key: string]: unknown } = {};
  const priorities: { [key: string]: number } = {};
  const aliases = new Map<string, { key: string; priority: number }>();
  // proKey is a control field handled separately from the regular WC param list.
  for (const param of [...wcParams, 'proKey']) {
    // Object/API camelCase wins over the official attribute spelling, which in turn
    // wins over the legacy lowercased spelling, independent of input key order.
    aliases.set(legacyAttributeName(param), { key: param, priority: 1 });
    aliases.set(officialAttributeName(param), { key: param, priority: 2 });
    aliases.set(param, { key: param, priority: 3 });
  }
  for (const [key, value] of Object.entries(config)) {
    const alias = aliases.get(key);
    if (alias) {
      if ((priorities[`${alias.key}`] || 0) <= alias.priority) {
        normalized[`${alias.key}`] = value;
        priorities[`${alias.key}`] = alias.priority;
      }
      continue;
    }
    // Keep accepting punctuation-separated keys outside the declared component
    // surface, as the previous SSR normalizer did.
    const normalizedKey = key.replace(/[-_]([a-z0-9])/g, (_, chr: string) => chr.toUpperCase());
    if (!(normalizedKey in normalized)) normalized[`${normalizedKey}`] = value;
  }
  return normalized as AddToCalendarButtonType & { [key: string]: unknown };
}

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
 * Boolean flag coercion mirroring the element: true, 'true', '1', and the bare
 * attribute presence ('' - e.g. frameworks serialize bare boolean attrs as empty
 * strings) all count as true.
 */
function truthyFlag(value: unknown): boolean {
  return value === true || value === 'true' || value === '1' || value === '';
}

/**
 * Parses the options config into normalized option keys plus their optional label
 * overrides (the 'Option|Label' syntax). Mirrors the client-side normalization
 * (lowercase, 'microsoft' -> 'ms', dots stripped); unknown/empty entries drop out.
 */
function parseOptions(value: unknown): { key: string; labelOverride: string }[] {
  let entries: unknown[];
  if (Array.isArray(value)) {
    entries = value;
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return [];
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
      entries = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // legacy comma-separated form: entries may carry single quotes
      // ("'apple','google'") - strip them like the attribute parser does
      entries = trimmed.split(',').map((entry) => entry.trim().replace(/^'+|'+$/g, ''));
    }
  } else {
    return [];
  }
  const options: { key: string; labelOverride: string }[] = [];
  for (const entry of entries) {
    if (typeof entry !== 'string') continue;
    const [rawName, ...labelParts] = entry.split('|');
    const key = (rawName || '').toLowerCase().replace(/\s+/g, '').replace('microsoft', 'ms').replace(/\./, '');
    if (key === '' || !icons[`${key}`]) continue;
    options.push({ key, labelOverride: labelParts.join('|').trim() });
  }
  return options;
}

/**
 * Renders the complete element HTML: host tag with all config attributes plus the
 * declarative shadow DOM template carrying the shell. Drop the returned string into
 * server-rendered HTML; the client bundle takes over from there.
 */
function generate_ssr_html(rawConfig: AddToCalendarButtonType & { [key: string]: unknown }): string {
  // accept camelCase, kebab-case, and legacy spellings alike (the tag does, too)
  const config = normalizeConfig(rawConfig);
  // --- the few config bits the shell honors ---
  const buttonStyle = typeof config.buttonStyle === 'string' && KNOWN_STYLES.includes(config.buttonStyle) ? config.buttonStyle : 'default';
  const language = typeof config.language === 'string' && config.language ? config.language : 'en';
  const baseLanguage = language.split(/[-_]/)[0]!.toLowerCase();
  const rtl = rtlLanguages.includes(baseLanguage);
  const sizes = decorate_sizes(typeof config.size === 'string' ? config.size : undefined);
  const lightMode = config.lightMode === 'dark' ? 'dark' : config.lightMode === 'bodyScheme' ? 'bodyScheme' : 'light';
  const label = typeof config.label === 'string' && config.label !== '' ? config.label : atcbSsrLabels[`${baseLanguage}`] || atcbSsrLabels['en'] || 'Add to Calendar';
  const rsvpLabels = atcbSsrRsvpLabels[`${baseLanguage}`] || atcbSsrRsvpLabels['en'] || { title: 'RSVP', expired: 'Expired', bookedout: 'Booked out' };
  const inline = truthyFlag(config.inline);
  const hasRsvp = Boolean(config.rsvp) && typeof config.rsvp === 'object';
  const inlineRsvp = hasRsvp && truthyFlag(config.inlineRsvp);
  const hidden = truthyFlag(config.hidden);
  const identifier = typeof config.identifier === 'string' && /^[\w-]+$/.test(config.identifier) ? config.identifier : '';
  const buttonsList = truthyFlag(config.buttonsList);
  const hideIconButton = truthyFlag(config.hideIconButton);
  const hideIconList = truthyFlag(config.hideIconList);
  const hideTextLabelButton = truthyFlag(config.hideTextLabelButton);
  // custom styles: an external css file (scheme-checked like the client) and/or the
  // css variable overrides (html-stripped like the client does via secure_content)
  const customCss = typeof config.customCss === 'string' && config.customCss !== '' && secure_url(config.customCss, false) ? config.customCss : '';
  const styleLight = typeof config.styleLight === 'string' ? config.styleLight.replace(/(\\r\\n|\\n|\\r)/g, '').replace(/(<(?!br)([^>]+)>)/gi, '') : '';
  const styleDark = typeof config.styleDark === 'string' ? config.styleDark.replace(/(\\r\\n|\\n|\\r)/g, '').replace(/(<(?!br)([^>]+)>)/gi, '') : '';
  // buttonsList splits the button into one singleton per option (never for the date
  // style - the client rule). The client sorts options alphabetically in
  // decorate-options; mirror that here so the shell paints in the same order and
  // hydration doesn't visually reorder the buttons.
  const parsedOptions = parseOptions(config.options);
  const listOptions = buttonsList && buttonStyle !== 'date' ? parsedOptions : [];
  listOptions.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const oneOption = parsedOptions.length === 1;

  // --- host attributes: every config key, serialized under its official name ---
  const attributes: string[] = [];
  for (const [key, value] of Object.entries(config)) {
    const serialized = serializeAttributeValue(value);
    if (serialized === null) continue;
    attributes.push(`${officialAttributeName(key)}="${escapeAttribute(serialized)}"`);
  }

  // --- styles: mirror what the client injects (general layout css + registry css) ---
  const initWidth = inlineRsvp ? '100%' : 'fit-content';
  const generalCss = `.atcb-initialized { display: block; position: relative; width: ${initWidth}; }.atcb-initialized.atcb-inline { display: inline-block; }.atcb-initialized.atcb-buttons-list { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--buttonslist-gap); }.atcb-hidden { display: none; }.atcb-ssr-skeleton { display: inline-block; background: currentColor; opacity: 0.15; border-radius: 0.3em; min-width: 2ch; }.atcb-ssr-skeleton-block { display: block; width: 100%; border-radius: 6px; }`;
  // with buttonStyle 'custom', the registry stays out and only the external file applies
  const styleCss = buttonStyle === 'custom' ? '' : (atcbSsrCssTemplate['core'] || '') + (atcbSsrCssTemplate[`${buttonStyle}`] || '');
  const overrideCss = (styleLight !== '' ? `:host{${styleLight}}` : '') + (styleDark !== '' ? `:host(.atcb-dark){${styleDark}}` : '');
  const customCssLink = customCss !== '' ? `<link rel="stylesheet" type="text/css" href="${escapeAttribute(customCss)}">` : '';

  // --- shell content ---
  const sizeStyle = `--base-font-size-l:${sizes['l']}px;--base-font-size-m:${sizes['m']}px;--base-font-size-s:${sizes['s']}px;`;
  const buttonId = identifier !== '' ? ` id="atcb-btn-${escapeAttribute(identifier)}"` : '';
  const content = (function () {
    if (inlineRsvp) {
      return `<div class="atcb-ssr-skeleton atcb-ssr-skeleton-block" style="height: 220px;"></div>`;
    }
    if (hasRsvp) {
      const rsvp = config.rsvp as { expired?: unknown; bookedOut?: unknown };
      const rsvpLabel = truthyFlag(rsvp.expired) ? rsvpLabels.expired : truthyFlag(rsvp.bookedOut) ? rsvpLabels.bookedout : rsvpLabels.title;
      const icon = hideIconButton ? '' : `<div class="atcb-icon atcb-icon-rsvp" part="atcb-list-icon">${icons['rsvp']}</div>`;
      const text = hideTextLabelButton ? '' : `<span class="atcb-text" part="atcb-list-text">${escapeText(rsvpLabel)}</span>`;
      return `<div class="atcb-button-wrapper${rtl ? ' atcb-rtl' : ''}" part="atcb-button-wrapper" style="${sizeStyle}"><button type="button" class="atcb-button atcb-click atcb-single${hideTextLabelButton ? ' atcb-no-text' : ''}" part="atcb-button"${buttonId} aria-expanded="false" aria-label="${escapeAttribute(rsvpLabel)}">${icon}${text}</button></div>`;
    }
    // buttonsList: one singleton button per option. Labels render as skeletons
    // (their text depends on decoration - translations, customLabels) - only an
    // explicit 'Option|Label' override paints real text
    if (listOptions.length > 0) {
      return listOptions
        .map((option) => {
          const singletonId = identifier !== '' ? ` id="atcb-btn-${escapeAttribute(identifier)}-${escapeAttribute(option.key)}"` : '';
          const icon = hideIconList ? '' : `<div class="atcb-icon atcb-icon-${escapeAttribute(option.key)}" part="atcb-button-icon">${icons[`${option.key}`]}</div>`;
          const text = hideTextLabelButton ? '' : option.labelOverride !== '' ? `<span class="atcb-text" part="atcb-list-text">${escapeText(option.labelOverride)}</span>` : `<span class="atcb-text" part="atcb-list-text">${skeletonSpan('8ch')}</span>`;
          return `<div class="atcb-button-wrapper${rtl ? ' atcb-rtl' : ''}" part="atcb-button-wrapper" style="${sizeStyle}"><button type="button" class="atcb-button atcb-single${hideTextLabelButton ? ' atcb-no-text' : ''}" part="atcb-button"${singletonId} aria-expanded="false" aria-label="${escapeAttribute(option.labelOverride !== '' ? option.labelOverride : option.key)}">${icon}${text}</button></div>`;
        })
        .join('');
    }
    const inner = (function () {
      if (buttonStyle === 'date') {
        const headline = typeof config.label === 'string' && config.label !== '' ? escapeText(config.label) : typeof config.name === 'string' && config.name !== '' ? escapeText(config.name) : skeletonSpan('12ch');
        return `<div class="atcb-date-btn-left"><div class="atcb-date-btn-day">${skeletonSpan('2ch')}</div><div class="atcb-date-btn-month">${skeletonSpan('3ch')}</div></div><div class="atcb-date-btn-right"><div class="atcb-date-btn-details"><div class="atcb-date-btn-headline">${headline}</div><div class="atcb-date-btn-content">${skeletonSpan('16ch')}</div></div></div><div class="atcb-date-btn-plus"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill:none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg></div>`;
      }
      const icon = hideIconButton ? '' : `<div class="atcb-icon atcb-icon-trigger" part="atcb-button-icon">${icons['trigger']}</div>`;
      const chevron = !oneOption && !hideTextLabelButton ? `<div class="atcb-chevron" part="atcb-button-chevron">${icons['chevron']}</div>` : '';
      const anchor = oneOption ? '' : '<div class="atcb-dropdown-anchor"></div>';
      const text = hideTextLabelButton ? '' : `<span class="atcb-text" part="atcb-button-text">${escapeText(label)}</span>`;
      return `${icon}${text}${chevron}${anchor}`;
    })();
    return `<div class="atcb-button-wrapper${rtl ? ' atcb-rtl' : ''}" part="atcb-button-wrapper" style="${sizeStyle}"><button type="button" class="atcb-button${oneOption ? ' atcb-single' : ''}${hideTextLabelButton ? ' atcb-no-text' : ''}" part="atcb-button"${buttonId} aria-expanded="false" aria-label="${escapeAttribute(typeof label === 'string' ? label : 'Add to Calendar')}">${inner}</button></div>`;
  })();

  const rootClasses = `atcb-initialized${hidden ? ' atcb-hidden' : ''}${inline ? ' atcb-inline' : ''}${listOptions.length > 0 && !inline ? ' atcb-buttons-list' : ''}`;
  // data-atcb-ssr distinguishes the shell wrapper from the client-rendered one while
  // both exist during hydration (client queries exclude it)
  const shell = `<style>${generalCss}</style>${customCssLink}<style>${styleCss}${overrideCss}</style><div class="${rootClasses}" data-atcb-ssr lang="${escapeAttribute(baseLanguage)}">${hidden ? '' : content}</div>`;

  return `<add-to-calendar-button class="add-to-calendar atcb-${lightMode}" ${attributes.join(' ')}><template shadowrootmode="open">${shell}</template></add-to-calendar-button>`;
}

/**
 * Fetches a PRO configuration when a prokey is present, then renders its SSR shell.
 * The synchronous renderer remains available for configurations that need no I/O.
 */
async function generate_ssr_html_async(rawConfig: AddToCalendarButtonType & { [key: string]: unknown }): Promise<string> {
  const config = normalizeConfig(rawConfig);
  const proKey = typeof config.proKey === 'string' ? config.proKey : '';
  if (proKey === '') return generate_ssr_html(rawConfig);

  try {
    const endpoint = `https://${truthyFlag(config.dev) ? 'event-dev.caldn.net' : 'event.caldn.net'}/${encodeURIComponent(proKey)}/config.json`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Not possible to read prokey config from server...');
    const responseData = strip_unsafe_keys(await response.json());
    if (!responseData || typeof responseData !== 'object' || Array.isArray(responseData)) throw new Error('Not possible to read prokey config from server...');

    const merged = responseData as { [key: string]: unknown };
    const overrideKeys = truthyFlag(config.proOverride) ? wcParams : wcProParams;
    for (const key of overrideKeys) {
      // PRO-only fields cannot be replaced from an arbitrary rendering server.
      if (truthyFlag(config.proOverride) && ['hideBranding', 'ty', 'rsvp'].includes(key)) continue;
      if (Object.prototype.hasOwnProperty.call(config, key)) merged[`${key}`] = config[`${key}`];
    }
    if (config.rsvp && typeof config.rsvp === 'object' && Object.prototype.hasOwnProperty.call(config.rsvp, 'none')) delete merged.rsvp;
    merged.proKey = proKey;
    merged.identifier = proKey;
    return generate_ssr_html(merged as AddToCalendarButtonType & { [key: string]: unknown });
  } catch {
    throw new Error('prokey invalid or server not responding!');
  }
}

export { generate_ssr_html as atcb_generate_ssr_html, generate_ssr_html_async as atcb_generate_ssr_html_async };
