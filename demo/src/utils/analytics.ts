export type AnalyticsEventName = 'demo_used' | 'pro_link_clicked' | 'github_link_clicked' | 'ask_ai_clicked';

let initialized = false;
let trackerPromise: Promise<typeof import('@plausible-analytics/tracker') | undefined> | undefined;

const getTracker = async () => {
  const tracker = await (trackerPromise ??= import('@plausible-analytics/tracker').catch(() => {
    trackerPromise = undefined;
    return undefined;
  }));
  if (!tracker) return;

  if (!initialized) {
    tracker.init({
      domain: 'add-to-calendar-button.com',
      endpoint: 'https://a.add-to-calendar-button.com/api/event',
    });
    initialized = true;
  }

  return tracker;
};

export const initializeAnalytics = async () => {
  await getTracker();
};

export const trackAnalyticsEvent = async (eventName: AnalyticsEventName, props?: Record<string, string>) => {
  const tracker = await getTracker();
  tracker?.track(eventName, props ? { props } : {});
};
