import { getRelativeLocaleUrl, getAbsoluteLocaleUrl } from 'astro:i18n';
import { themeConfig } from '~/theme.config';
import { getCollection, getEntry } from 'astro:content';
import type { CollectionKey } from 'astro:content';

const defaultLocale = themeConfig.i18n.defaultLocale;

// Minimal structural shape of a content entry. Used to cast results from
// getEntry/getCollection so that an empty content config (collections = {})
// — which makes Astro infer `never` — does not break property access.
interface ContentEntryLike {
  id: string;
  data: { draft?: boolean; i18nSlug?: Record<string, string>; [key: string]: unknown };
}

// Safe wrappers around getEntry/getCollection that tolerate a missing or empty
// content config. When no collections are defined, the underlying calls either
// throw at runtime or resolve to `never`-typed values; we catch and return null
// / [] so callers can fall back gracefully.
async function safeGetEntry(collection: CollectionKey, entryId: string): Promise<ContentEntryLike | null> {
  try {
    const entry = (await getEntry(collection, entryId)) as ContentEntryLike | null | undefined;
    return entry ?? null;
  } catch {
    return null;
  }
}

async function safeGetCollection(collection: CollectionKey, filter?: (entry: ContentEntryLike) => boolean): Promise<ContentEntryLike[]> {
  try {
    const entries = (await getCollection(collection, filter as never)) as ContentEntryLike[];
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

// Safe accessor for dynamic keys to avoid object-injection sinks
function getProp(obj: unknown, key: string | number): unknown {
  if (obj == null || typeof obj !== 'object' || !Object.hasOwn(obj, key)) return undefined;
  // eslint-disable-next-line security/detect-object-injection -- key existence verified via Object.hasOwn
  return (obj as Record<string, unknown>)[key];
}

// Dynamically assign to the translations object
const translations = Object.fromEntries(themeConfig.i18n.locales.map((lang) => [lang, getProp(themeConfig.i18n.languageModules, lang)])) as Record<string, unknown>;

function getTranslation(source: unknown, keyParts: string[]): string | undefined {
  let value = source;
  for (const part of keyParts) value = getProp(value, part.toLowerCase().replace(/\s/g, '-'));
  return typeof value === 'string' ? value : undefined;
}

// function to be able to use t() in astro components
export function useTranslations(lang?: keyof typeof translations) {
  if (!lang || lang === '') lang = defaultLocale;
  return function t(key: string): string {
    const keyParts = key.split('.');
    return getTranslation(getProp(translations, lang), keyParts) ?? getTranslation(getProp(translations, defaultLocale), keyParts) ?? keyParts.at(-1) ?? key;
  };
}

// function to get the current path without the locale
export function getUrlWithoutLocale(url: URL, currentLang?: keyof typeof translations) {
  // File-format builds expose HTML filenames in Astro.url; navigation uses clean routes.
  const path =
    url.pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/';
  if (!currentLang || currentLang === defaultLocale || path === '/') return path;
  return path === `/${currentLang}` ? '/' : path.replace(`/${currentLang}/`, '/');
}

// build a clean, locale-aware absolute URL for the current page
// Pass a different `targetLang` to retarget the URL to another locale (e.g. for hreflang alternates).
export function getCleanLocaleUrl(url: URL, currentLang?: keyof typeof translations, targetLang?: keyof typeof translations) {
  const cleanPath = getUrlWithoutLocale(url, currentLang);
  return getLocaleUrl(cleanPath, targetLang ?? currentLang, true).replace(/(?:index)?\.html$/, '');
}

// get path with locale, minding the dynamic nature of content
export async function getLocaleUrlWithContent(entryId: string, collection: CollectionKey, targetLang: keyof typeof translations, absolute?: boolean, absoluteBasePath?: string) {
  if (!targetLang) targetLang = defaultLocale;
  // get entry first (guarded: returns null when no collection exists)
  const baseEntry = await safeGetEntry(collection, entryId);
  // if baseEntry includes i18nSlug, we use that, otherwise we use the entryId
  const i18nSlug = baseEntry && 'i18nSlug' in baseEntry.data ? baseEntry.data.i18nSlug : undefined;
  const targetId = (getProp(i18nSlug, targetLang) as string | undefined) ?? entryId;
  const contentEntries = [...new Set((await safeGetCollection(collection, ({ data }) => !data.draft)).map((entry) => (entry.id === targetLang + '/' + targetId.split('/').pop() ? targetId.split('/').pop() : null)).filter(Boolean))];
  // fallback
  return getLocaleUrl((absoluteBasePath ? absoluteBasePath + '/' : '') + (contentEntries[0] ? contentEntries[0].split('/').pop() : targetId.split('/').pop()), targetLang, absolute);
}

// get path with locale
export function getLocaleUrl(slug: string, targetLang?: keyof typeof translations, absolute?: boolean): string {
  if (!targetLang) targetLang = defaultLocale;
  const hashIndex = slug.indexOf('#');
  if (hashIndex >= 0) {
    const path = slug.slice(0, hashIndex) || '/';
    return `${getLocaleUrl(path, targetLang, absolute)}${slug.slice(hashIndex)}`;
  }
  if (slug === '/' && targetLang === defaultLocale) return absolute ? themeConfig.site + '/' : '/';
  const path = absolute ? getAbsoluteLocaleUrl(targetLang.toString(), slug) : getRelativeLocaleUrl(targetLang.toString(), slug);
  return path.replace(/\/$/, '');
}

// validating if the translated path exists
export async function checkTranslatedPath(currentLocale: keyof typeof translations, noi18n?: boolean, collection?: CollectionKey, entryId?: string) {
  const i18nSlug = await (async function () {
    if (!collection || !entryId) return null;
    const baseEntry = await safeGetEntry(collection, entryId);
    return baseEntry && 'i18nSlug' in baseEntry.data ? baseEntry.data.i18nSlug : null;
  })();
  const contentEntries = collection && entryId ? [...new Set((await safeGetCollection(collection, ({ data }) => !data.draft)).map((entry) => (entry.id.endsWith('/' + entryId.split('/').pop()) || getProp(i18nSlug, entry.id.split('/')[0]) ? entry.id.split('/')[0] : null)).filter(Boolean))] : [];
  // unfortunately, at the moment only works with content collections
  // TODO: when there is a stable way to identify whether the target page is 404, adjust the logic here
  return Object.fromEntries(
    Object.keys(translations).map((languageCode) => {
      if (languageCode === currentLocale) return [languageCode, true];
      if (noi18n) return [languageCode, false];
      if (collection && entryId) return [languageCode, contentEntries.includes(languageCode)];
      return [languageCode, true];
    }),
  ) as Record<string, boolean>;
}
