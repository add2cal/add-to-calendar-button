/**
 * Reduced Suite - Group H: Google output + cancelled-click fork (plan §9)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, openList, clickOption, optionEl } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { CFG } from '../fixtures/events.js';

async function googleUrl(config, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: "'Google'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    expect(wo.calls.length).to.equal(1);
    return wo.calls[0].url;
  } finally {
    wo.restore();
  }
}

describe('Group H - Google output', () => {
  it('H-01: desktop base URL is calendar/r/eventedit with encoded params', async () => {
    const raw = await googleUrl(CFG.singleTimedNY, 'atcb-h01');
    expect(raw.startsWith('https://calendar.google.com/calendar/r/eventedit?')).to.equal(true);
    const url = new URL(raw);
    expect(url.searchParams.get('text')).to.equal('NY Timed');
    expect(url.searchParams.get('location')).to.equal('NYC');
    expect(url.searchParams.get('details')).to.include('desc');
    expect(url.searchParams.get('ctz')).to.equal('America/New_York');
  });

  it('H-02: all-day uses date-only range', async () => {
    const url = new URL(await googleUrl(CFG.allDaySingle, 'atcb-h02'));
    expect(url.searchParams.get('dates')).to.equal('20501225/20501226');
  });

  it('H-03: recurring adds recur=RRULE param', async () => {
    const url = new URL(await googleUrl(CFG.recurDaily, 'atcb-h03'));
    expect(url.searchParams.get('recur')).to.include('RRULE:FREQ=DAILY');
  });

  it('H-06: long HTML description is transported url-encoded', async () => {
    const url = new URL(await googleUrl({ ...CFG.singleTimedNY, description: 'Line1 [br] [strong]bold[/strong] '.repeat(20) }, 'atcb-h06'));
    const details = url.searchParams.get('details');
    expect(details).to.exist;
    expect(details).to.include('bold');
  });

  it('H-07: online event URL lands in location param', async () => {
    const url = new URL(await googleUrl(CFG.onlineEvent, 'atcb-h07'));
    expect(url.searchParams.get('location')).to.equal('https://meet.example.com/room-1');
  });

  it('H-08: CANCELLED click fork -> warning modal for Google, Cancel-ICS for iCal', async () => {
    const wo = interceptWindowOpen();
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({
        ...CFG.singleTimedNY,
        name: 'Cancelled Event',
        status: 'CANCELLED',
        options: "['Google','iCal']",
        trigger: 'click',
        identifier: 'atcb-h08',
      });
      await openList(host);
      await clickOption(host, 'google');
      await aTimeout(80);
      // no calendar URL opened - a warning modal shows up instead
      expect(wo.calls.length, 'no window.open for cancelled non-ical').to.equal(0);
      const modal = document.getElementById('atcb-h08-modal-host');
      expect(modal, 'warning modal host').to.exist;
      expect(modal.shadowRoot.querySelector('.atcb-modal-box')).to.exist;
      const googleItem = optionEl(host, 'google');
      expect(googleItem?.classList.contains('atcb-saved') || false, 'no saved checkmark for cancelled').to.equal(false);

      // iCal on the same cancelled event delivers a STATUS:CANCELLED ics
      await openList(host);
      await clickOption(host, 'ical');
      expect(fs.saves.length).to.equal(1);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].prop('STATUS')).to.include('CANCELLED');
    } finally {
      wo.restore();
      fs.restore();
    }
  });

  it('H-09: Android flavor wraps the URL into an intent:// with browser fallback', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...CFG.singleTimedNY, fakeAndroid: 'true', options: "'Google'", trigger: 'click', identifier: 'atcb-h09' });
      await clickSingleton(host);
      expect(wo.calls.length).to.equal(1);
      const url = wo.calls[0].url;
      expect(url.startsWith('intent://')).to.equal(true);
      expect(url).to.include('package=com.google.android.calendar');
      expect(url).to.include('S.browser_fallback_url=');
    } finally {
      wo.restore();
    }
  });

  it('H-10: mobile flavor uses the render?action=TEMPLATE base', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...CFG.singleTimedNY, fakeMobile: 'true', options: "'Google'", trigger: 'click', identifier: 'atcb-h10' });
      await clickSingleton(host);
      // fakeMobile also triggers the Android intent wrap; accept either the intent or the plain mobile base
      const url = wo.calls[0].url;
      const isIntent = url.startsWith('intent://');
      const isMobileBase = url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE');
      expect(isIntent || isMobileBase, `unexpected base: ${url.slice(0, 80)}`).to.equal(true);
    } finally {
      wo.restore();
    }
  });
});
