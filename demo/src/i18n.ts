import { nextTick, isRef } from 'vue';
import { createI18n } from 'vue-i18n';

import type { I18n, I18nOptions, Locale, VueI18n, Composer, I18nMode } from 'vue-i18n';

export const SUPPORT_LOCALES = ['en', 'de'];

function isComposer(instance: VueI18n | Composer, mode: I18nMode): instance is Composer {
  return mode === 'composition' && isRef(instance.locale);
}

export function getLocale(i18n: I18n): string {
  if (isComposer(i18n.global, i18n.mode)) {
    return i18n.global.locale.value;
  } else {
    return i18n.global.locale;
  }
}

export function setLocale(i18n: I18n, locale: Locale): void {
  if (isComposer(i18n.global, i18n.mode)) {
    i18n.global.locale.value = locale;
  } else {
    i18n.global.locale = locale;
  }
  localStorage.setItem('user-language', locale);
}

export function setupI18n(options: I18nOptions = { locale: 'en' }): I18n {
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale!);
  return i18n;
}

export function setI18nLanguage(i18n: I18n, locale: Locale): void {
  setLocale(i18n, locale);
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResource = (r: any) => r.default || r;

export async function loadLocaleResources(i18n: I18n, locale: Locale) {
  // load locale messages
  const messages = await import(/* @vite-ignore */ `@/i18n/locales/${locale}.json`).then(getResource);
  // load locale date formats
  const datetimeFormats = await import(`@/i18n/datetimeFormats/${locale}.json`).then(getResource);
  // load locale number formats
  const numberFormats = await import(`@/i18n/numberFormats/${locale}.json`).then(getResource);

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages);
  // set locale and datetime format
  i18n.global.setDateTimeFormat(locale, datetimeFormats);
  // set locale and number format
  i18n.global.setNumberFormat(locale, numberFormats);

  return nextTick();
}
