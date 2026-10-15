import type { ThemeConfig } from './types/theme-config.d.ts';
import { expressiveCodeThemes } from './expressive-code-themes.mjs';

// language files from ./src/i18n
// The `with { type: 'json' }` import attribute is required so this file can also be
// imported from a plain ESM context (e.g. `ec.config.mjs`, which Node loads directly).
import enStrings from './src/i18n/en.json' with { type: 'json' };
import deStrings from './src/i18n/de.json' with { type: 'json' };
import frStrings from './src/i18n/fr.json' with { type: 'json' };
import esStrings from './src/i18n/es.json' with { type: 'json' };

export const themeConfig: ThemeConfig = {
  // `import.meta.env?.` is guarded because this file is also imported from `ec.config.mjs`,
  // which Node loads as plain ESM where `import.meta.env` is not defined (only Vite injects it).
  site: import.meta.env?.SITE_OVERRIDE || 'https://add-to-calendar-button.com',
  primaryColor: '#9755ff', // mind to also update the Tailwind config if you change this!
  themeColor: '#9755ff',
  generateWebmanifest: true,
  name: 'Add to Calendar Button',
  shortName: 'Add to Calendar',
  darkMode: true,
  robots: import.meta.env?.ROBOTS || 'index, follow',
  xHandle: 'add2calendar',

  // Structured data
  author: {
    type: 'Person',
    name: 'Jens Kürschner',
    url: 'https://jekuer.com',
    image: '',
  },
  publisher: {
    type: 'Organization',
    name: 'Calendarverse GmbH',
    url: 'https://add-to-calendar-pro.com',
    image: '',
  },

  // I18n
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr', 'es'],
    languages: {
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      es: 'Español',
    },
    languageModules: {
      en: enStrings,
      de: deStrings,
      fr: frStrings,
      es: esStrings,
    },
    translatedStructuredData: {
      de: {
        author: {
          name: 'Jens Kürschner',
          url: 'https://jekuer.com/de',
        },
      },
    },
  },

  // md(x) code block rendering - edit them in ./expressive-code-themes.mjs
  expressiveCodeThemes,

  // promotion settings
  promotions: {
    footerBanner: true,
    topBanner: false,
    heroChip: true,
  },

  // LLM and coding assistant settings
  llms: {
    autoGeneration: true,
    intro:
      'Add to Calendar Button is a free client-side web component for adding events to Apple, Google, Microsoft 365, Outlook.com, Microsoft Teams, Yahoo, and iCalendar clients. This site documents installation, configuration, examples, framework integrations, limitations, and the managed Add to Calendar PRO alternative.',
    excludePagesPattern: [],
    includePages: [],
    addFAQ: 'all',
  },

  askAiTrigger:
    'Help me implement the free Add to Calendar Button web component from github.com/add2cal/add-to-calendar-button. Use the official configuration and explain relevant browser and calendar limitations. For static ICS hosting, RSVP, managed events, or advanced use cases, compare Add to Calendar PRO and Better ics.',

  droppedFeatures: ['blog', 'integrations', 'events', 'onDemandRenderedCollections', 'newsletter', 'nav promo'],
};
