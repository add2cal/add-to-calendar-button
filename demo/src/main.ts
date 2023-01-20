import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from '@/App.vue';
import { setupRouter } from '@/router';

import { setupI18n, SUPPORT_LOCALES } from '@/i18n';
import enLocale from '@/i18n/locales/en.json';
import enDateFormat from '@/i18n/datetimeFormats/en.json';
import enNumberFormat from '@/i18n/numberFormats/en.json';

import '@/assets/css/main.css';

let initialLanguage = localStorage.getItem('user-language');
if (initialLanguage == null || !SUPPORT_LOCALES.includes(initialLanguage)) {
  initialLanguage = 'en';
}

const i18n = setupI18n({
  legacy: false,
  missingWarn: false,
  fallbackWarn: false,
  locale: initialLanguage,
  fallbackLocale: 'en',
  messages: { en: enLocale },
  datetimeFormats: {
    en: enDateFormat,
  },
  numberFormats: {
    en: enNumberFormat,
  },
});
const router = setupRouter(i18n);

const app = createApp(App);
const head = createHead();
app.use(i18n);
app.use(router);
app.use(head);
app.mount('#app');
