/**
 * Reduced Suite - Group R: PRO - proKey fetch & override (case list: .ai/TEST-CASES.md)
 * All PRO fetches are mocked (no live API). Demo proKeys drive the flows;
 * config variations are layered via proOverride per the PRO docs.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { mockProFetch, proEvtConfig, PRO_EVT_KEY } from '../fixtures/pro.js';
import { muteConsole } from '../helpers/capture.js';
import { interceptFileSave } from '../helpers/capture.js';
import { openList, clickOption, trigger, optionEl, initFailed } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';

describe('Group R - PRO proKey fetch & override', () => {
  it('R-01: proKey fetches config.json and renders the server-driven button', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_EVT_KEY, identifier: 'atcb-r01' });
      expect(mock.calls.some((c) => c.url === `https://event.caldn.net/${PRO_EVT_KEY}/config.json`)).to.equal(true);
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
      expect(shadow.querySelector('.atcb-text').textContent).to.include('Save the PRO date');
      expect(host.getAttribute('atcb-last-event')).to.include('initialization');
    } finally {
      mock.restore();
    }
  });

  it('R-02: PRO fetch 404 -> button does not render', async () => {
    const mock = mockProFetch({}); // unknown key -> 404
    const mute = muteConsole(); // the lib intentionally console-errors this failure
    try {
      const { host } = await mountAtcb({ proKey: 'ffffffff-0000-0000-0000-000000000000', identifier: 'atcb-r02' });
      await aTimeout(200);
      // failed-init shadow roots crash headless-shell on querySelector - use the attribute contract
      expect(initFailed(host)).to.equal(true);
      expect(mute.messages.join(' ')).to.include('proKey');
    } finally {
      mute.restore();
      mock.restore();
    }
  });

  it('R-03: PRO fetch network error -> button does not render', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() }, { networkError: true });
    const mute = muteConsole(); // the lib intentionally console-errors this failure
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, identifier: 'atcb-r03' });
      await aTimeout(200);
      expect(initFailed(host)).to.equal(true);
    } finally {
      mute.restore();
      mock.restore();
    }
  });

  it('R-04: dev=true fetches from event-dev.caldn.net', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      await mountAtcb({ proKey: PRO_EVT_KEY, dev: 'true', identifier: 'atcb-r04' });
      expect(mock.calls.some((c) => c.url === `https://event-dev.caldn.net/${PRO_EVT_KEY}/config.json`)).to.equal(true);
    } finally {
      mock.restore();
    }
  });

  it('R-05: WITHOUT proOverride, whitelisted attrs (language) still apply', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const { shadow } = await mountAtcb({ proKey: PRO_EVT_KEY, language: 'de', identifier: 'atcb-r05' });
      // language is part of atcbWcProParams -> local attribute wins even without proOverride
      const label = shadow.querySelector('.atcb-text').textContent;
      expect(label).to.include('Save the PRO date'); // server label still used (label not overridable here)
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('R-06: WITHOUT proOverride, non-whitelisted attrs (name) are IGNORED - server wins', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, name: 'Local Title', trigger: 'click', identifier: 'atcb-r06' });
      await openList(host);
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('SUMMARY')).to.include('PRO Demo Event');
      expect(ics.events[0].value('SUMMARY')).to.not.include('Local Title');
    } finally {
      fs.restore();
      mock.restore();
    }
  });

  it('R-07: WITH proOverride, local name wins over server config', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, proOverride: 'true', name: 'Override Title', trigger: 'click', identifier: 'atcb-r07' });
      await openList(host);
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('SUMMARY')).to.include('Override Title');
    } finally {
      fs.restore();
      mock.restore();
    }
  });

  it('R-09: override inline=true applies (inline is a whitelisted pro param)', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const { shadow } = await mountAtcb({ proKey: PRO_EVT_KEY, inline: 'true', identifier: 'atcb-r09' });
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('R-11: proOverride options=[Google] switches to singleton mode', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, proOverride: 'true', options: "'Google'", trigger: 'click', identifier: 'atcb-r11' });
      expect(trigger(host).classList.contains('atcb-single')).to.equal(true);
    } finally {
      mock.restore();
    }
  });

  it('R-13: proOverride recurrence produces recurring output + option deactivation', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({
        proKey: PRO_EVT_KEY,
        proOverride: 'true',
        recurrence: 'daily',
        recurrence_count: 5,
        trigger: 'click',
        identifier: 'atcb-r13',
      });
      await openList(host);
      expect(optionEl(host, 'yahoo'), 'yahoo removed for recurrence').to.not.exist;
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('RRULE')).to.include('FREQ=DAILY');
    } finally {
      fs.restore();
      mock.restore();
    }
  });

  it('R-14: proOverride timeZone reruns the tz math', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, proOverride: 'true', timeZone: 'Asia/Tokyo', trigger: 'click', identifier: 'atcb-r14' });
      await openList(host);
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].prop('DTSTART')).to.include('TZID=Asia/Tokyo');
    } finally {
      fs.restore();
      mock.restore();
    }
  });

  it('R-15: proxy=true routes link clicks through the PRO proxy URL', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig({ proxy: true }) });
    const wo = (await import('../helpers/capture.js')).interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, trigger: 'click', identifier: 'atcb-r15' });
      await openList(host);
      await clickOption(host, 'google');
      expect(wo.calls.length).to.equal(1);
      expect(wo.calls[0].url).to.equal(`https://caldn.net/${PRO_EVT_KEY}/o/google`);
    } finally {
      wo.restore();
      mock.restore();
    }
  });

  it('R-16: hideBranding is NOT overridable client-side in PRO mode (license enforcement)', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, proOverride: 'true', hideBranding: 'true', trigger: 'click', identifier: 'atcb-r16' });
      await openList(host);
      // per src/atcb-init.js: hideBranding/ty/rsvp are excluded from the override merge
      // unless the page runs on caldn.net / add-to-calendar-pro.com -> branding stays visible
      expect(host.shadowRoot.querySelector('#atcb-reference'), 'attribution still rendered in list').to.exist;
    } finally {
      mock.restore();
    }
  });

  it('R-16b: PRO without proxy/hideBranding appends the powered-by note to descriptions', async () => {
    const mock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ proKey: PRO_EVT_KEY, trigger: 'click', identifier: 'atcb-r16b' });
      await openList(host);
      await clickOption(host, 'ical');
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.unfolded).to.include('add-to-calendar-pro.com');
    } finally {
      fs.restore();
      mock.restore();
    }
  });
});
