/**
 * Reduced Suite - Group C: Date / time / timezone for single events (plan §4)
 * User-path tests: mount singleton button -> click -> capture generated URL / ICS.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, trigger, listEl } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { CFG, utcClean } from '../fixtures/events.js';
import { resetDataLayer } from '../helpers/datalayer.js';

async function googleUrlFor(config, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: "'Google'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    expect(wo.calls.length, 'window.open calls').to.equal(1);
    return new URL(wo.calls[0].url);
  } finally {
    wo.restore();
  }
}

async function teamsTimes(config, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: "'MicrosoftTeams'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    const url = new URL(wo.calls[0].url);
    return { start: url.searchParams.get('startTime'), end: url.searchParams.get('endTime') };
  } finally {
    wo.restore();
  }
}

async function icsFor(config, id) {
  const fs = interceptFileSave();
  try {
    const { host } = await mountAtcb({ ...config, options: "'iCal'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    expect(fs.saves.length, 'file save calls').to.equal(1);
    return parseIcs(decodeIcsHref(fs.saves[0].href));
  } finally {
    fs.restore();
  }
}

describe('Group C - Date / time / timezone (single event)', () => {
  beforeEach(() => resetDataLayer());

  it('C-01: NY summer timed event -> correct ICS TZID + Google UTC range', async () => {
    const ics = await icsFor(CFG.singleTimedNY, 'atcb-c01a');
    const ev = ics.events[0];
    expect(ev.prop('DTSTART')).to.include('TZID=America/New_York');
    expect(ev.prop('DTSTART')).to.include('20500615T100000');
    expect(ics.vtimezones.length).to.equal(1);
    expect(ics.tzids[0]).to.equal('America/New_York');

    const url = await googleUrlFor(CFG.singleTimedNY, 'atcb-c01b');
    expect(url.origin + url.pathname).to.equal('https://calendar.google.com/calendar/r/eventedit');
    // Google receives WALL-CLOCK times plus the ctz param (no UTC conversion, no Z suffix)
    expect(url.searchParams.get('dates')).to.equal('20500615T100000/20500615T110000');
    expect(url.searchParams.get('ctz')).to.equal('America/New_York');
    expect(url.searchParams.get('text')).to.equal('NY Timed');
    // the DST-aware numeric offset is observable in the Teams URL (ISO with offset)
    const teams = await teamsTimes(CFG.singleTimedNY, 'atcb-c01c');
    expect(teams.start).to.equal('2050-06-15T10:00:00-04:00'); // EDT
    expect(teams.end).to.equal('2050-06-15T11:00:00-04:00');
  });

  it('C-02: Tokyo timed (no DST) -> +09:00 math in Google URL, TZID in ICS', async () => {
    const url = await googleUrlFor(CFG.singleTimedTokyo, 'atcb-c02a');
    expect(url.searchParams.get('dates')).to.equal('20500615T100000/20500615T110000');
    expect(url.searchParams.get('ctz')).to.equal('Asia/Tokyo');
    const teams = await teamsTimes(CFG.singleTimedTokyo, 'atcb-c02c');
    expect(teams.start).to.equal('2050-06-15T10:00:00+09:00');
    const ics = await icsFor(CFG.singleTimedTokyo, 'atcb-c02b');
    expect(ics.events[0].prop('DTSTART')).to.include('TZID=Asia/Tokyo');
  });

  it('C-03: explicit UTC -> no shift between wall clock and UTC output', async () => {
    const url = await googleUrlFor(CFG.singleTimedUTC, 'atcb-c03');
    expect(url.searchParams.get('dates')).to.equal(`${utcClean('2050-06-15', '10:00', '+00:00')}/${utcClean('2050-06-15', '11:00', '+00:00')}`);
  });

  it('C-04: no timeZone -> defaults to GMT (wall-clock + ctz=GMT)', async () => {
    const url = await googleUrlFor(CFG.singleTimedNoTz, 'atcb-c04');
    expect(url.searchParams.get('dates')).to.equal('20500615T100000/20500615T110000');
    // the lib defaults the timeZone to GMT, which is transported as ctz
    expect(url.searchParams.get('ctz')).to.equal('GMT');
  });

  it('C-06: special tz alias (CET) -> mapped; Google gets no ctz param', async () => {
    const url = await googleUrlFor({ ...CFG.singleTimedNoTz, name: 'CET Event', timeZone: 'CET' }, 'atcb-c06');
    expect(url.searchParams.get('ctz')).to.equal(null);
  });

  it('C-07: single all-day -> date-only formats, DTEND +1 day', async () => {
    const ics = await icsFor(CFG.allDaySingle, 'atcb-c07a');
    const ev = ics.events[0];
    expect(ev.prop('DTSTART')).to.include('VALUE=DATE');
    expect(ev.prop('DTSTART')).to.include('20501225');
    expect(ev.prop('DTEND')).to.include('20501226');

    const url = await googleUrlFor(CFG.allDaySingle, 'atcb-c07b');
    expect(url.searchParams.get('dates')).to.equal('20501225/20501226');
    expect(url.searchParams.get('ctz'), 'no ctz for all-day').to.equal(null);
  });

  it('C-08: multi-day timed -> range spans days (wall-clock + ctz)', async () => {
    const url = await googleUrlFor(CFG.multiDayTimed, 'atcb-c08');
    expect(url.searchParams.get('dates')).to.equal('20500615T100000/20500617T160000');
    expect(url.searchParams.get('ctz')).to.equal('America/New_York');
  });

  it('C-09: multi-day all-day -> DTEND is end date +1', async () => {
    const ics = await icsFor(CFG.multiDayAllDay, 'atcb-c09a');
    expect(ics.events[0].prop('DTEND')).to.include('20501228');
    const url = await googleUrlFor(CFG.multiDayAllDay, 'atcb-c09b');
    expect(url.searchParams.get('dates')).to.equal('20501225/20501228');
  });

  it('C-10: dynamic date today+7 resolves to a concrete date', async () => {
    const url = await googleUrlFor({ name: 'Dynamic', startDate: 'today+7' }, 'atcb-c10');
    const expected = new Date(Date.now() + 7 * 86400000);
    const p = (n) => String(n).padStart(2, '0');
    const expectedStr = `${expected.getFullYear()}${p(expected.getMonth() + 1)}${p(expected.getDate())}`;
    expect(url.searchParams.get('dates')).to.include(expectedStr);
  });

  it('C-11: past date with default handling still renders normally', async () => {
    const { host } = await mountAtcb({ name: 'Past', startDate: '2020-01-01', options: "'Google'", trigger: 'click', identifier: 'atcb-c11' });
    expect(trigger(host)).to.exist;
  });

  it('C-12: pastDateHandling=hide skips button generation', async () => {
    const { host } = await mountAtcb({ name: 'Past Hide', startDate: '2020-01-01', options: "'Google'", pastDateHandling: 'hide', identifier: 'atcb-c12' });
    expect(host.shadowRoot.querySelector('button')).to.not.exist;
  });

  it('C-13: pastDateHandling=disable renders but disables', async () => {
    const { host } = await mountAtcb({ name: 'Past Disable', startDate: '2020-01-01', options: "'Google'", trigger: 'click', pastDateHandling: 'disable', identifier: 'atcb-c13' });
    const btn = trigger(host);
    expect(btn).to.exist;
    btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    await aTimeout(80);
    expect(listEl(host)).to.not.exist;
  });

  it('C-14: availability free/busy -> ICS TRANSP + Google crm params', async () => {
    const icsFree = await icsFor({ ...CFG.singleTimedNY, availability: 'free' }, 'atcb-c14a');
    expect(icsFree.events[0].prop('TRANSP')).to.include('TRANSPARENT');
    const icsBusy = await icsFor({ ...CFG.singleTimedNY, availability: 'busy' }, 'atcb-c14b');
    expect(icsBusy.events[0].prop('TRANSP')).to.include('OPAQUE');
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...CFG.singleTimedNY, availability: 'free', options: "'Google'", trigger: 'click', identifier: 'atcb-c14c' });
      await clickSingleton(host);
      expect(wo.calls[0].url).to.include('crm=AVAILABLE');
      expect(wo.calls[0].url).to.include('trp=false');
    } finally {
      wo.restore();
    }
  });

  it('C-15: status CANCELLED -> ICS STATUS:CANCELLED (iCal path still works)', async () => {
    const ics = await icsFor({ ...CFG.singleTimedNY, status: 'CANCELLED' }, 'atcb-c15');
    expect(ics.events[0].prop('STATUS')).to.include('CANCELLED');
    // cancelled events ship as proper iCal cancellations
    expect(ics.method).to.equal('CANCEL');
  });

  it('C-16: timeZone="currentBrowser" resolves to the browser timezone', async () => {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const ics = await icsFor({ name: 'BrowserTz', startDate: '2050-06-15', startTime: '10:00', endTime: '11:00', timeZone: 'currentBrowser' }, 'atcb-c16');
    expect(ics.events[0].prop('DTSTART')).to.include('TZID=' + browserTz);
  });

  it('C-17: POSIX-inverted Etc/GMT+5 means UTC-5 in output math', async () => {
    const url = await googleUrlFor({ name: 'Posix', startDate: '2050-06-15', startTime: '10:00', endTime: '11:00', timeZone: 'Etc/GMT+5' }, 'atcb-c17');
    // Etc/GMT+5 == UTC-05:00 (POSIX sign inversion) -> 10:00 wall = 15:00 UTC
    expect(url.searchParams.get('dates')).to.equal(`${utcClean('2050-06-15', '10:00', '-05:00')}/${utcClean('2050-06-15', '11:00', '-05:00')}`);
  });
});
