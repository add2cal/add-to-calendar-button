/**
 * Reduced Suite - Group F: Multi-date / event series (plan §7)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, openList, clickOption, modalHost, subEventBtn, initFailed } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { CFG } from '../fixtures/events.js';
import { resetDataLayer, dlEvents } from '../helpers/datalayer.js';

function multiDateConfig(extra = {}, datesOverride = null) {
  return {
    name: 'Series',
    timeZone: 'America/New_York',
    dates: JSON.stringify(datesOverride || CFG.multiDate.dates),
    ...extra,
  };
}

async function clickSubEvent(host, type, n) {
  expect(modalHost(host), 'multi-date selection modal host').to.exist;
  const btn = subEventBtn(host, type, n);
  expect(btn, `sub-event button ${type}-${n}`).to.exist;
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  // sub-event buttons use a TRAILING debounce - give it time to fire
  await aTimeout(700);
  return btn;
}

describe('Group F - Multi-date / event series', () => {
  beforeEach(() => resetDataLayer());

  it('F-01/F-12: multi-date iCal -> ONE ics file containing all VEVENTs (same/no organizer, none cancelled)', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(multiDateConfig({ options: "'iCal'", trigger: 'click', identifier: 'atcb-f01' }));
      await clickSingleton(host);
      expect(fs.saves.length, 'direct single file download, no per-date modal').to.equal(1);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events.length).to.equal(3);
      expect(ics.vtimezones.length).to.equal(1);
    } finally {
      fs.restore();
    }
  });

  it('F-02: out-of-order dates are auto-sorted chronologically', async () => {
    const fs = interceptFileSave();
    try {
      const shuffled = [CFG.multiDate.dates[2], CFG.multiDate.dates[0], CFG.multiDate.dates[1]];
      const { host } = await mountAtcb(multiDateConfig({ options: "'iCal'", trigger: 'click', identifier: 'atcb-f02' }, shuffled));
      await clickSingleton(host);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      const starts = ics.events.map((e) => e.prop('DTSTART'));
      expect(starts[0]).to.include('20500701');
      expect(starts[1]).to.include('20500708');
      expect(starts[2]).to.include('20500715');
    } finally {
      fs.restore();
    }
  });

  it('F-03: mixed timezones -> per-VEVENT TZID and deduped VTIMEZONE blocks', async () => {
    const fs = interceptFileSave();
    try {
      const dates = [
        { name: 'NY', startDate: '2050-07-01', startTime: '10:00', endTime: '11:00', timeZone: 'America/New_York' },
        { name: 'Berlin', startDate: '2050-07-02', startTime: '10:00', endTime: '11:00', timeZone: 'Europe/Berlin' },
        { name: 'NY2', startDate: '2050-07-03', startTime: '10:00', endTime: '11:00', timeZone: 'America/New_York' },
      ];
      const { host } = await mountAtcb({ name: 'TZ Series', dates: JSON.stringify(dates), options: "'iCal'", trigger: 'click', identifier: 'atcb-f03' });
      await clickSingleton(host);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].prop('DTSTART')).to.include('TZID=America/New_York');
      expect(ics.events[1].prop('DTSTART')).to.include('TZID=Europe/Berlin');
      expect(ics.vtimezones.length, 'one VTIMEZONE per unique tz').to.equal(2);
    } finally {
      fs.restore();
    }
  });

  it('F-04/F-05: Google on multi-date opens selection modal; sub-event click emits openSubEventLink + correct URL', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb(multiDateConfig({ options: "['Google','iCal']", trigger: 'click', identifier: 'atcb-f04' }));
      await openList(host);
      await clickOption(host, 'google');
      const btn = await clickSubEvent(host, 'google', 2);
      expect(wo.calls.length).to.equal(1);
      const url = new URL(wo.calls[0].url);
      expect(url.searchParams.get('dates')).to.include('20500708');
      expect(dlEvents('openSubEventLink').length).to.be.greaterThan(0);
      expect(btn.classList.contains('atcb-saved')).to.equal(true);
    } finally {
      wo.restore();
    }
  });

  it('F-07: multi-date + subscribe throws (silent no-render at WC level)', async () => {
    const { host } = await mountAtcb({
      ...multiDateConfig({ options: "'Google'", identifier: 'atcb-f07' }),
      subscribe: 'true',
      icsFile: 'https://example.com/cal.ics',
    });
    await aTimeout(200);
    // failed-init shadow roots crash headless-shell on querySelector - use the attribute contract
    expect(initFailed(host)).to.equal(true);
  });

  it('F-08: mixed past/future + pastDateHandling=hide -> past entries FILTERED, button stays', async () => {
    // per src/atcb-decorate.js: with >1 dates and hide, overdue entries are dropped from data.dates;
    // the whole button only disappears when ALL entries are overdue (F-10)
    const wo = interceptWindowOpen();
    try {
      const dates = [
        { name: 'Past', startDate: '2020-01-01', startTime: '10:00', endTime: '11:00' },
        { name: 'Future', startDate: '2050-01-01', startTime: '10:00', endTime: '11:00' },
      ];
      const { host } = await mountAtcb({ name: 'MixedSeries', dates: JSON.stringify(dates), options: "['Google','iCal']", trigger: 'click', pastDateHandling: 'hide', identifier: 'atcb-f08' });
      expect(host.shadowRoot.querySelector('button'), 'button renders when only SOME dates are past').to.exist;
      await openList(host);
      await clickOption(host, 'google');
      // only ONE (future) date remains -> direct link, no sub-event selection modal
      expect(wo.calls.length).to.equal(1);
      expect(new URL(wo.calls[0].url).searchParams.get('dates')).to.include('20500101');
    } finally {
      wo.restore();
    }
  });

  it('F-11: mixed past/future + pastDateHandling=disable -> renders normally (disable only fires when ALL are past)', async () => {
    const dates = [
      { name: 'Past', startDate: '2020-01-01', startTime: '10:00', endTime: '11:00' },
      { name: 'Future', startDate: '2050-01-01', startTime: '10:00', endTime: '11:00' },
    ];
    const { host } = await mountAtcb({ name: 'MixedDisable', dates: JSON.stringify(dates), options: "['Google','iCal']", trigger: 'click', pastDateHandling: 'disable', identifier: 'atcb-f11' });
    await openList(host);
    expect(host.shadowRoot.querySelector('.atcb-list'), 'list opens - not disabled').to.exist;
  });

  it('F-10: ALL entries past + pastDateHandling=hide -> whole button not generated', async () => {
    const dates = [
      { name: 'Past1', startDate: '2020-01-01' },
      { name: 'Past2', startDate: '2020-02-01' },
    ];
    const { host } = await mountAtcb({ name: 'AllPast', dates: JSON.stringify(dates), options: "'Google'", pastDateHandling: 'hide', identifier: 'atcb-f10' });
    expect(host.shadowRoot.querySelector('button')).to.not.exist;
  });

  it('F-09: per-entry name override -> per-VEVENT SUMMARY', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(multiDateConfig({ options: "'iCal'", trigger: 'click', identifier: 'atcb-f09' }));
      await clickSingleton(host);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('SUMMARY')).to.include('Day 1');
      expect(ics.events[1].value('SUMMARY')).to.include('Day 2');
      expect(ics.events[2].value('SUMMARY')).to.include('Day 3');
    } finally {
      fs.restore();
    }
  });

  it('F-13/G-19: DIFFERING organizers -> no single combined file; per-date selection with per-date METHOD', async () => {
    // Confirms the grouping rule: one ICS file only when all entries share the same (or no)
    // organizer. With mixed organizers the lib opens the per-date selection instead.
    const fs = interceptFileSave();
    try {
      const dates = [
        { name: 'NoOrg', startDate: '2050-07-01', startTime: '10:00', endTime: '11:00' },
        { name: 'WithOrg', startDate: '2050-07-08', startTime: '10:00', endTime: '11:00', organizer: 'Orga|orga@example.com' },
      ];
      const { host } = await mountAtcb({ name: 'OrgSeries', dates: JSON.stringify(dates), options: "'iCal'", trigger: 'click', identifier: 'atcb-f13' });
      await clickSingleton(host);
      expect(fs.saves.length, 'no direct combined download').to.equal(0);
      expect(modalHost(host), 'per-date selection modal opens').to.exist;
      // date 2 (with organizer) -> REQUEST invite with ORGANIZER line
      const btn2 = subEventBtn(host, 'ical', 2);
      expect(btn2).to.exist;
      btn2.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      await aTimeout(700);
      expect(fs.saves.length).to.equal(1);
      const ics2 = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics2.events.length).to.equal(1);
      expect(ics2.events[0].prop('ORGANIZER')).to.exist;
      expect(ics2.events[0].prop('ORGANIZER').toLowerCase()).to.include('mailto:orga@example.com');
      expect(ics2.method).to.equal('REQUEST');
    } finally {
      fs.restore();
    }
  });
});
