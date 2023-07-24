import { setUserTheme } from '@/utils/themeSwitch';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    // set theme on app load
    setUserTheme();
  });
});
