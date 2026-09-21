import { init } from '@plausible-analytics/tracker';

export default defineNuxtPlugin(() => {
  const { public: publicConfig } = useRuntimeConfig();

  if (publicConfig.dev) return;

  init({
    domain: 'add-to-calendar-button.com',
    endpoint: 'https://a.add-to-calendar-button.com/api/event',
  });
});
