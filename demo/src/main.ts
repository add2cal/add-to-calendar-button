import { createApp } from 'vue';
import App from '@/App.vue';
import { setupRouter } from '@/router';

import { setupI18n, SUPPORT_LOCALES } from '@/i18n';
import en from '@/locales/en.json';

import '@/assets/main.css';

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
  messages: { en },
});
const router = setupRouter(i18n);

const app = createApp(App);
app.use(i18n);
app.use(router);
app.mount('#app');
