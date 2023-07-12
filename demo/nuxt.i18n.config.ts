export default defineI18nConfig(() => ({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    de: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        useGrouping: true,
        currencyDisplay: 'symbol',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
    de: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        useGrouping: true,
        currencyDisplay: 'symbol',
        notation: 'standard',
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
  },
}));
