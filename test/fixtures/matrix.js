/**
 * Full Cartesian Suite - dimension definitions + constraint logic (case list: .ai/TEST-CASES.md).
 * The isValid() function encodes the option-availability rules from src/atcb-decorate.js:
 *  - recurrence keeps only apple/google/ical; google additionally removed on iOS
 *  - ical removed on iOS, apple removed on Android (unless optionsIOS/optionsMobile override)
 *  - subscribe removes msteams everywhere and ms365/outlookcom on mobile
 */

export const ENVS = [
  { id: 'desktop', flags: {}, ios: false, android: false, mobile: false },
  { id: 'ios', flags: { fakeIOS: 'true' }, ios: true, android: false, mobile: true },
  { id: 'android', flags: { fakeAndroid: 'true' }, ios: false, android: true, mobile: true },
];

export const SERVICES = ['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo'];

// maps internal service ids to config attribute spellings
export const SERVICE_ATTR = {
  apple: 'Apple',
  google: 'Google',
  ical: 'iCal',
  ms365: 'Microsoft365',
  outlookcom: 'Outlook.com',
  msteams: 'MicrosoftTeams',
  yahoo: 'Yahoo',
};

export function isValid(env, cfg, service) {
  const recurring = !!cfg.recurrence;
  const subscribe = !!cfg.subscribe;
  if (recurring) {
    if (!['apple', 'google', 'ical'].includes(service)) return false;
    if (env.ios && service === 'google') return false;
  }
  if (subscribe) {
    if (service === 'msteams') return false;
    if (env.mobile && (service === 'ms365' || service === 'outlookcom')) return false;
  }
  if (env.ios && service === 'ical') return false;
  if (env.android && service === 'apple') return false;
  return true;
}

export const URL_BASE = {
  google: ['https://calendar.google.com/calendar/r/eventedit?', 'https://calendar.google.com/calendar/render?action=TEMPLATE', 'intent://calendar.google.com/'],
  ms365: ['https://outlook.office.com/calendar/0/action/compose', 'https://outlook.office.com/calendar/0/deeplink/compose'],
  outlookcom: ['https://outlook.live.com/calendar/0/action/compose', 'https://outlook.live.com/calendar/0/deeplink/compose'],
  msteams: ['https://teams.microsoft.com/l/meeting/new?'],
  yahoo: ['https://calendar.yahoo.com/?v=60'],
};

export const BUTTON_STYLES = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date', 'none'];

export const LANGUAGES = ['en', 'de', 'fr', 'es', 'pt', 'ar', 'he', 'fa'];

/**
 * Independent timezone oracle: converts a wall-clock time in an IANA tz to a UTC
 * 'YYYYMMDDTHHMMSSZ' string using Intl (not the lib's tz library).
 */
export function wallToUtcClean(dateStr, timeStr, timeZone) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  // two-pass offset resolution to converge across DST boundaries
  let guess = wallAsUtc;
  for (let i = 0; i < 3; i++) {
    const offset = tzOffsetAt(guess, timeZone);
    const next = wallAsUtc - offset;
    if (next === guess) break;
    guess = next;
  }
  const dt = new Date(guess);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}${p(dt.getUTCMonth() + 1)}${p(dt.getUTCDate())}T${p(dt.getUTCHours())}${p(dt.getUTCMinutes())}${p(dt.getUTCSeconds())}Z`;
}

/**
 * Offset string oracle: returns the UTC offset ('+HH:MM'/'-HH:MM') that the given
 * wall-clock time in the given IANA tz has - via Intl, independent of the lib's tz library.
 */
export function wallOffsetString(dateStr, timeStr, timeZone) {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  let guess = wallAsUtc;
  for (let i = 0; i < 3; i++) {
    const offset = tzOffsetAt(guess, timeZone);
    const next = wallAsUtc - offset;
    if (next === guess) break;
    guess = next;
  }
  const offsetMin = Math.round(tzOffsetAt(guess, timeZone) / 60000);
  const sign = offsetMin < 0 ? '-' : '+';
  const abs = Math.abs(offsetMin);
  const p = (n) => String(n).padStart(2, '0');
  return `${sign}${p(Math.floor(abs / 60))}:${p(abs % 60)}`;
}

function tzOffsetAt(utcMillis, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = {};
  for (const { type, value } of dtf.formatToParts(new Date(utcMillis))) {
    parts[type] = value;
  }
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return asUtc - utcMillis;
}
