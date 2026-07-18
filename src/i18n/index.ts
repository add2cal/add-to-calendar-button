import { atcb_rewrite_html_elements } from '../core/text';
import enStrings from './locales/en.json';
import type { ATCBConfig, I18nStrings } from '../types';

const rtlLanguages: string[] = ['ar', 'fa', 'he'];

// every language the package ships translations for (dist/locales/{lang}.json)
const availableLanguages: string[] = ['en', 'de', 'es', 'pt', 'fr', 'nl', 'tr', 'zh', 'ar', 'hi', 'pl', 'id', 'no', 'fi', 'sv', 'cs', 'ja', 'it', 'ko', 'vi', 'ro', 'fa', 'et', 'uk', 'hu', 'he'];

// calendar names (except for iCal file, same in every language, but included to be adjustable)
const calendarNames: { [key: string]: string } = {
  apple: 'Apple',
  google: 'Google',
  ms365: 'Microsoft 365',
  msteams: 'Microsoft Teams',
  outlookcom: 'Outlook.com',
  yahoo: 'Yahoo',
};

/**
 * The translation registry. English ships inside every bundle; other languages load
 * on demand: fetched from {scriptOrigin}/locales/{lang}.json for script-tag usage or
 * registered via atcb_register_locale (the npm locale modules at dist/locales/{lang}.js
 * do exactly that). Regional packs (like en_GB) are looked up first when registered,
 * falling back to their base language, then to English.
 */
const i18nStrings: I18nStrings = {
  en: { ...calendarNames, ...atcb_flatten_translations(enStrings as NestedTranslations) },
};

// build hook: relative path from THIS bundle's location to the locale assets
const atcbLocaleRelPath: string = 'locales/';

// capture the script origin at module load (document.currentScript is null later)
const atcbLocaleScriptBase: string = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      // derive the directory via string operations on purpose: the `new URL(rel, import.meta.url)`
      // pattern gets statically rewritten by bundlers (asset inlining), which must not happen here
      const src = String(import.meta.url);
      if (src.indexOf('data:') !== 0 && src.lastIndexOf('/') > -1) {
        return src.substring(0, src.lastIndexOf('/') + 1);
      }
    }
  } catch {
    // import.meta unavailable in this bundle format - fall through
  }
  try {
    if (typeof document !== 'undefined' && document.currentScript && (document.currentScript as HTMLScriptElement).src) {
      const src = (document.currentScript as HTMLScriptElement).src;
      return src.substring(0, src.lastIndexOf('/') + 1);
    }
  } catch {
    // no DOM or opaque script origin - fall through
  }
  return '';
})();

const atcbPendingLocaleLoads: Map<string, Promise<boolean>> = new Map();

/**
 * Translation packs are authored as nested objects for easy editing
 * ("label": { "addtocalendar": ... }); the runtime registry works with flat
 * dotted identifiers ("label.addtocalendar"), so packs get flattened on
 * registration. Flat packs pass through unchanged, and a key that is itself
 * dotted inside a level (used where a key doubles as a group name, like
 * "email" next to "email.subject") joins naturally.
 */
type NestedTranslations = { [key: string]: string | NestedTranslations };

function atcb_flatten_translations(strings: NestedTranslations, prefix: string = ''): { [key: string]: string } {
  const flat: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(strings)) {
    if (typeof value === 'string') {
      flat[prefix + key] = value;
    } else {
      Object.assign(flat, atcb_flatten_translations(value, prefix + key + '.'));
    }
  }
  return flat;
}

/**
 * Registers a translation pack under a language code (base like "de" or regional
 * like "en_GB"). Accepts nested or flat packs. Public API used by the generated
 * locale modules and custom setups.
 */
function atcb_register_locale(language: string, strings: NestedTranslations | { [key: string]: string }): void {
  i18nStrings[`${language}`] = { ...calendarNames, ...atcb_flatten_translations(strings as NestedTranslations) };
}

function atcb_locale_base_url(data: ATCBConfig): string {
  if (data.styleSource && data.styleSource !== '') {
    // the style-source attribute points at the assets root of a self-hosted setup;
    // locales live next to styles, so derive the sibling directory from it
    const src = String(data.styleSource);
    const normalized = src.endsWith('/') ? src : src + '/';
    return normalized.replace(/styles\/$/, 'locales/');
  }
  if (atcbLocaleScriptBase === '') {
    return '';
  }
  return atcbLocaleScriptBase + atcbLocaleRelPath;
}

/**
 * Makes sure the translation pack for the configured language is available before
 * rendering (labels are needed synchronously at template time). Unknown languages
 * and failed loads gracefully keep the English fallback behavior.
 */
async function atcb_ensure_locale(data: ATCBConfig): Promise<void> {
  const language = (data.language as string) || 'en';
  if (i18nStrings[`${language}`] || !availableLanguages.includes(language)) {
    return;
  }
  if (!atcbPendingLocaleLoads.has(language)) {
    atcbPendingLocaleLoads.set(
      language,
      (async () => {
        const base = atcb_locale_base_url(data);
        if (base === '') {
          if (data.debug) console.warn('Add to Calendar Button: language "' + language + '" is not registered and no locale source could be resolved - import the locale module or set the style-source attribute');
          return false;
        }
        try {
          const response = await fetch(base + language + '.json');
          if (!response.ok) throw new Error('status ' + response.status);
          const strings = (await response.json()) as NestedTranslations;
          atcb_register_locale(language, strings);
          return true;
        } catch (e) {
          if (data.debug) console.error('Add to Calendar Button: loading language "' + language + '" from "' + base + '" failed', e);
          return false;
        } finally {
          atcbPendingLocaleLoads.delete(language);
        }
      })(),
    );
  }
  await atcbPendingLocaleLoads.get(language);
}

function atcb_translate(identifier: string, language?: string): string {
  // set default language
  if (!language) {
    language = 'en';
  }
  const pack = i18nStrings[`${language}`];
  // return string, if available
  if (pack && pack[`${identifier}`]) {
    return pack[`${identifier}`]!;
  }
  // regional locales (like en_GB) fall back to their base language
  if (language.length > 2) {
    return atcb_translate(identifier, language.substring(0, 2));
  }
  // try English as fallback, if not already used before
  if (language !== 'en') {
    return atcb_translate(identifier, 'en');
  }
  // if nothing found, return the original identifier
  return identifier;
}

// hook, which can be used to override all potential "hard" strings by setting the key as option key and the intended string as value
function atcb_translate_hook(identifier: string, data: ATCBConfig): string {
  if (data.customLabels && data.customLabels[`${identifier}`] && data.customLabels[`${identifier}`] !== '') {
    return atcb_rewrite_html_elements(data.customLabels[`${identifier}`]!);
  } else {
    return atcb_translate(identifier, (data.translationLocale as string) || data.language);
  }
}

export { atcb_translate_hook, atcb_translate, atcb_register_locale, atcb_ensure_locale, availableLanguages, rtlLanguages, i18nStrings };
