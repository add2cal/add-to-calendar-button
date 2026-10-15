import { inject, provide, type InjectionKey } from 'vue';

import de from '../../i18n/de.json';
import en from '../../i18n/en.json';
import es from '../../i18n/es.json';
import fr from '../../i18n/fr.json';

export type PlaygroundLocale = 'en' | 'de' | 'fr' | 'es';

const translations: Record<PlaygroundLocale, unknown> = {
  en: en.playground,
  de: de.playground,
  fr: fr.playground,
  es: es.playground,
};

function resolve(source: unknown, path: string): string | undefined {
  let value = source;

  for (const part of path.split('.')) {
    if (typeof value !== 'object' || value === null || !Object.hasOwn(value, part)) return;
    value = Object.getOwnPropertyDescriptor(value, part)?.value;
  }

  return typeof value === 'string' ? value : undefined;
}

const key: InjectionKey<(key: string) => string> = Symbol('playground-i18n');

export function providePlaygroundI18n(locale: PlaygroundLocale) {
  const source = locale === 'de' ? translations.de : locale === 'fr' ? translations.fr : locale === 'es' ? translations.es : translations.en;
  const translate = (path: string) => resolve(source, path) ?? resolve(en.playground, path) ?? path;
  provide(key, translate);
  return translate;
}

export const usePlaygroundI18n = () => inject(key, (path: string) => resolve(en.playground, path) ?? path);
