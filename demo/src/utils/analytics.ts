import { init, track } from '@plausible-analytics/tracker';

export type AnalyticsEventName = 'demo_used' | 'pro_link_clicked' | 'github_link_clicked' | 'ask_ai_clicked';

let initialized = false;

export const initializeAnalytics = () => {
  if (initialized) return;

  init({
    domain: 'add-to-calendar-button.com',
    endpoint: 'https://a.add-to-calendar-button.com/api/event',
  });
  initialized = true;
};

export const trackAnalyticsEvent = (eventName: AnalyticsEventName, props?: Record<string, string>) => {
  initializeAnalytics();
  track(eventName, props ? { props } : {});
};
