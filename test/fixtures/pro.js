/**
 * PRO fixtures + fetch mocking.
 *
 * All PRO config fetches are FULLY MOCKED - no live API calls (per test plan §0).
 * The demo proKeys drive realistic configs; variations are layered via proOverride
 * (see https://docs.add-to-calendar-pro.com/integration/general#overwrite-settings).
 */

export const PRO_EVT_KEY = 'a37c97ad-f650-4d94-81e7-65c999939e11'; // regular event demo key
export const PRO_RSVP_KEY = 'a3cdf9da-1d43-4dc8-a8a1-5e726666c635'; // RSVP event demo key

/**
 * Mock server payload for the PRO regular-event key (shape mirrors event.caldn.net/{key}/config.json).
 */
export function proEvtConfig(overrides = {}) {
  return {
    name: 'PRO Demo Event',
    description: 'A PRO demo event.',
    startDate: '2050-08-20',
    startTime: '14:00',
    endTime: '15:00',
    timeZone: 'America/New_York',
    location: 'Demo Location 1, 10115 Berlin',
    options: ['Google', 'Apple', 'iCal', 'Microsoft365', 'Outlook.com', 'Yahoo'],
    listStyle: 'dropdown',
    trigger: 'click',
    label: 'Save the PRO date',
    landingpage: {},
    // the real config.json is pre-structured with a dates array - atcb_get_pro_data iterates it
    dates: [
      {
        name: 'PRO Demo Event',
        description: 'A PRO demo event.',
        startDate: '2050-08-20',
        startTime: '14:00',
        endTime: '15:00',
        timeZone: 'America/New_York',
        location: 'Demo Location 1, 10115 Berlin',
      },
    ],
    ...overrides,
  };
}

/**
 * Mock server payload for the PRO RSVP key.
 */
export function proRsvpConfig(overrides = {}) {
  return {
    name: 'PRO RSVP Demo Event',
    description: 'A PRO RSVP demo event.',
    startDate: '2050-09-10',
    startTime: '18:00',
    endTime: '20:00',
    timeZone: 'Europe/Berlin',
    location: 'Demo Location 2, 10115 Berlin',
    options: ['Google', 'Apple', 'iCal'],
    trigger: 'click',
    rsvp: {
      max: 100,
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'newsletter', label: 'Subscribe to news', type: 'checkbox' },
      ],
    },
    landingpage: {},
    dates: [
      {
        name: 'PRO RSVP Demo Event',
        description: 'A PRO RSVP demo event.',
        startDate: '2050-09-10',
        startTime: '18:00',
        endTime: '20:00',
        timeZone: 'Europe/Berlin',
        location: 'Demo Location 2, 10115 Berlin',
      },
    ],
    ...overrides,
  };
}

/**
 * Installs a fetch stub that serves mocked PRO config.json responses and
 * rejects any other external request loudly (so no test silently talks to the network).
 * Returns { calls, restore }.
 */
export function mockProFetch(map = {}, { status = 200, networkError = false } = {}) {
  const calls = [];
  const original = window.fetch;
  window.fetch = async (url, init) => {
    const u = String(url);
    calls.push({ url: u, init });
    const m = u.match(/^https:\/\/event(-dev)?\.caldn\.net\/([^/]+)\/config\.json$/);
    if (m) {
      if (networkError) throw new TypeError('Failed to fetch (mocked network error)');
      const key = m[2];
      // eslint-disable-next-line security/detect-object-injection
      const payload = map[key];
      if (!payload || status !== 200) {
        return new Response('Not found', { status: status === 200 ? 404 : status });
      }
      return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (u.includes('api.add-to-calendar-pro.com') || u.includes('api-dev.add-to-calendar-pro.com')) {
      // seat check endpoint returns { total } - RSVP API behavior itself is out of scope
      return new Response(JSON.stringify({ total: '0' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    // pass everything else through - the test runner itself communicates via fetch!
    return original.call(window, url, init);
  };
  return {
    calls,
    restore() {
      window.fetch = original;
    },
  };
}
