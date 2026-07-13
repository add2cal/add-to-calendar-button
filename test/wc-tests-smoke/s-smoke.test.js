/**
 * SMOKE SUITE - Tier 0 (CI default, `npm run test`)
 *
 * Deliberately minimal matrix: {Desktop, Mobile} x {OSS, PRO(proKey)} + one RSVP render check.
 * Answers one question per cell: "is the button fundamentally working?" - init, option set,
 * link/ICS generation, tracking. Everything deeper lives in the on-demand tiers:
 *   npm run test:extended -> Reduced Suite (groups A-U, test/wc-tests/r-*)
 *   npm run test:full     -> + Full Cartesian matrix (test/wc-tests-full/f-*)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave, muteConsole, setUA, UA } from '../helpers/capture.js';
import { trigger, openList, listEl, renderedOptions, clickOption, clickSingleton, pressEsc, optionEl, initFailed } from '../helpers/dom.js';
import { resetDataLayer, dlEvents } from '../helpers/datalayer.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { mockProFetch, proEvtConfig, proRsvpConfig, PRO_EVT_KEY, PRO_RSVP_KEY } from '../fixtures/pro.js';

const EVT = {
  name: 'Smoke Event',
  startDate: '2050-06-15',
  startTime: '10:00',
  endTime: '11:00',
  timeZone: 'America/New_York',
  location: 'Smoke City',
  description: 'smoke',
};

describe('SMOKE | OSS x Desktop', () => {
  beforeEach(() => resetDataLayer());

  it('S-01: initializes, opens the list, renders all seven options + attribution', async () => {
    const { host, shadow } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 's01' }));
    expect(shadow.querySelector('.atcb-initialized')).to.exist;
    await openList(host);
    expect(listEl(host)).to.exist;
    expect(renderedOptions(host)).to.have.members(['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo']);
    expect(shadow.querySelector('#atcb-reference'), 'attribution in list').to.exist;
    await pressEsc();
  });

  it('S-02: Google link carries the event correctly (wall-clock + ctz)', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...EVT, options: "'Google'", trigger: 'click', identifier: 's02' });
      await clickSingleton(host);
      const url = new URL(wo.calls[0].url);
      expect(url.origin + url.pathname).to.equal('https://calendar.google.com/calendar/r/eventedit');
      expect(url.searchParams.get('text')).to.equal('Smoke Event');
      expect(url.searchParams.get('dates')).to.equal('20500615T100000/20500615T110000');
      expect(url.searchParams.get('ctz')).to.equal('America/New_York');
    } finally {
      wo.restore();
    }
  });

  it('S-03: ICS download is a valid VCALENDAR with the event data', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ ...EVT, options: "'iCal'", trigger: 'click', identifier: 's03' });
      await clickSingleton(host);
      expect(fs.saves.length).to.equal(1);
      expect(fs.saves[0].target, 'desktop downloads target _blank').to.equal('_blank');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.raw).to.include('BEGIN:VCALENDAR');
      expect(ics.method).to.equal('PUBLISH');
      expect(ics.events[0].value('SUMMARY')).to.include('Smoke Event');
      expect(ics.events[0].prop('DTSTART')).to.include('TZID=America/New_York');
      expect(ics.tzids[0]).to.equal('America/New_York');
    } finally {
      fs.restore();
    }
  });

  it('S-04: all-day event uses date-only formats in Google + ICS', async () => {
    const wo = interceptWindowOpen();
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ name: 'Smoke Allday', startDate: '2050-12-25', options: "'Google'", trigger: 'click', identifier: 's04a' });
      await clickSingleton(host);
      expect(new URL(wo.calls[0].url).searchParams.get('dates')).to.equal('20501225/20501226');
      const { host: host2 } = await mountAtcb({ name: 'Smoke Allday', startDate: '2050-12-25', options: "'iCal'", trigger: 'click', identifier: 's04b' });
      const btn2 = host2.shadowRoot.getElementById(host2.getAttribute('atcb-button-id'));
      btn2.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      await aTimeout(80);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].prop('DTSTART')).to.include('VALUE=DATE');
    } finally {
      wo.restore();
      fs.restore();
    }
  });

  it('S-05: recurring event -> RRULE in ICS; non-supporting options deactivated', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(baseEvent({ ...EVT, recurrence: 'weekly', recurrence_byDay: 'MO', recurrence_count: 10, startDate: '2050-06-13', trigger: 'click', identifier: 's05' }));
      await openList(host);
      const opts = renderedOptions(host);
      expect(opts).to.include('google');
      expect(opts).to.not.include('yahoo');
      expect(opts).to.not.include('ms365');
      expect(opts).to.not.include('outlookcom');
      expect(opts).to.not.include('msteams');
      await clickOption(host, 'ical');
      const rrule = parseIcs(decodeIcsHref(fs.saves[0].href)).events[0].value('RRULE');
      expect(rrule).to.include('FREQ=WEEKLY');
      expect(rrule).to.include('BYDAY=MO');
    } finally {
      fs.restore();
    }
  });

  it('S-06: tracking chain fires (initialization -> openList -> openCalendarLink -> success) + attribute mirror', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...EVT, options: "['Google']", trigger: 'click', identifier: 's06' });
      expect(dlEvents('initialization').length).to.equal(1);
      await clickSingleton(host);
      await aTimeout(100);
      expect(dlEvents('openSingletonLink').length).to.equal(1);
      expect(dlEvents('success').length).to.equal(1);
      expect(dlEvents()[0].eventCategory).to.equal('Add-to-Calendar-Button');
      expect(host.getAttribute('atcb-last-event')).to.include('success');
    } finally {
      wo.restore();
    }
  });
});

describe('SMOKE | OSS x Mobile', () => {
  beforeEach(() => resetDataLayer());

  it('S-07: Android flavor swaps apple out, keeps ical, downloads with _self target', async () => {
    const fs = interceptFileSave();
    // the download-target branch reads navigator.userAgent directly (fake flags do not reach it)
    const restoreUA = setUA(UA.androidChrome);
    try {
      const { host } = await mountAtcb(baseEvent({ ...EVT, fakeAndroid: 'true', trigger: 'click', identifier: 's07' }));
      await openList(host);
      const opts = renderedOptions(host);
      expect(opts).to.not.include('apple');
      expect(opts).to.include('ical');
      await clickOption(host, 'ical');
      expect(fs.saves.length).to.equal(1);
      expect(fs.saves[0].target, 'mobile downloads target _self').to.equal('_self');
    } finally {
      fs.restore();
      restoreUA();
    }
  });

  it('S-08: Android Google link uses the intent:// wrapper with browser fallback', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...EVT, fakeAndroid: 'true', options: "'Google'", trigger: 'click', identifier: 's08' });
      await clickSingleton(host);
      const url = wo.calls[0].url;
      expect(url.startsWith('intent://')).to.equal(true);
      expect(url).to.include('package=com.google.android.calendar');
      expect(url).to.include('S.browser_fallback_url=');
    } finally {
      wo.restore();
    }
  });

  it('S-09: iOS flavor swaps ical out, keeps apple', async () => {
    const { host } = await mountAtcb(baseEvent({ ...EVT, fakeIOS: 'true', trigger: 'click', identifier: 's09' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('ical');
    expect(opts).to.include('apple');
  });

  it('S-10: mobile modal listStyle opens on click and locks body scroll', async () => {
    const { host } = await mountAtcb(baseEvent({ ...EVT, fakeMobile: 'true', listStyle: 'modal', trigger: 'click', identifier: 's10' }));
    await openList(host);
    expect(document.body.classList.contains('atcb-modal-no-scroll')).to.equal(true);
    await pressEsc();
    await aTimeout(100);
    expect(document.body.classList.contains('atcb-modal-no-scroll')).to.equal(false);
  });
});

describe('SMOKE | PRO x Desktop', () => {
  beforeEach(() => resetDataLayer());

  it('S-11: proKey fetches the server config and renders it (incl. powered-by note in ICS)', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_EVT_KEY, trigger: 'click', identifier: 's11' });
      expect(mock.calls.some((c) => c.url === `https://event.caldn.net/${PRO_EVT_KEY}/config.json`)).to.equal(true);
      expect(shadow.querySelector('.atcb-text').textContent).to.include('Save the PRO date');
      await openList(host);
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('SUMMARY')).to.include('PRO Demo Event');
      expect(ics.unfolded).to.include('add-to-calendar-pro.com');
    } finally {
      fs.restore();
      mock.restore();
    }
  });

  it('S-12: proOverride lets local attributes win over the server config', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, proOverride: 'true', name: 'Smoke Override', trigger: 'click', identifier: 's12' });
      await openList(host);
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('SUMMARY')).to.include('Smoke Override');
    } finally {
      fs.restore();
      mock.restore();
    }
  });

  it('S-13: proxy=true routes clicks through the PRO proxy URL', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig({ proxy: true }) });
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, trigger: 'click', identifier: 's13' });
      await openList(host);
      await clickOption(host, 'google');
      expect(wo.calls[0].url).to.equal(`https://caldn.net/${PRO_EVT_KEY}/o/google`);
    } finally {
      wo.restore();
      mock.restore();
    }
  });

  it('S-14: invalid proKey (404) fails silently - no render, no crash', async () => {
    const mock = mockProFetch({});
    const mute = muteConsole();
    try {
      const { host } = await mountAtcb({ proKey: 'ffffffff-0000-0000-0000-000000000000', identifier: 's14' });
      await aTimeout(200);
      expect(initFailed(host)).to.equal(true);
    } finally {
      mute.restore();
      mock.restore();
    }
  });
});

describe('SMOKE | PRO x Mobile', () => {
  beforeEach(() => resetDataLayer());

  it('S-15: PRO config renders under the mobile flavor with platform option rules applied', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_EVT_KEY, fakeMobile: 'true', trigger: 'click', identifier: 's15' });
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
      await openList(host);
      const opts = renderedOptions(host);
      expect(opts, 'apple swapped out under the android/mobile flavor').to.not.include('apple');
      expect(opts).to.include('google');
      expect(trigger(host) || shadow.querySelector('button')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('S-16: PRO RSVP config renders the RSVP entry point instead of calendar options', async () => {
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_RSVP_KEY, fakeMobile: 'true', identifier: 's16' });
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
      expect(shadow.querySelector('button'), 'RSVP entry point renders').to.exist;
      expect(optionEl(host, 'google')).to.not.exist;
      expect(optionEl(host, 'ical')).to.not.exist;
    } finally {
      mock.restore();
    }
  });
});
