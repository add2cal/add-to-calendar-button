/**
 * Reduced Suite - Group E: Recurring events (plan §6)
 * Recurrence deactivates options not in atcbValidRecurrOptions (['apple','google','ical']);
 * Google is additionally removed on iOS.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, renderedOptions, openList } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { CFG } from '../fixtures/events.js';
import { atcb_decorate_data } from '../../src/atcb-decorate.js';

async function icsRrule(config, id) {
  const fs = interceptFileSave();
  try {
    const { host } = await mountAtcb({ ...config, options: "'iCal'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
    return ics.events[0].value('RRULE');
  } finally {
    fs.restore();
  }
}

async function googleRecur(config, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: "'Google'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    return new URL(wo.calls[0].url).searchParams.get('recur');
  } finally {
    wo.restore();
  }
}

describe('Group E - Recurring events', () => {
  it('E-01: simplified DAILY -> RRULE in ICS and Google; non-supporting options deactivated', async () => {
    const rrule = await icsRrule(CFG.recurDaily, 'atcb-e01a');
    expect(rrule).to.include('FREQ=DAILY');
    expect(rrule).to.include('COUNT=10');
    const recur = await googleRecur(CFG.recurDaily, 'atcb-e01b');
    expect(recur).to.include('RRULE:');
    expect(recur).to.include('FREQ=DAILY');
    // option deactivation on a full options list (desktop env)
    const { host } = await mountAtcb(baseEvent({ ...CFG.recurDaily, trigger: 'click', identifier: 'atcb-e01c' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.include('apple');
    expect(opts).to.include('google');
    expect(opts).to.include('ical');
    expect(opts).to.not.include('yahoo');
    expect(opts).to.not.include('ms365');
    expect(opts).to.not.include('outlookcom');
    expect(opts).to.not.include('msteams');
  });

  it('E-02: simplified WEEKLY with BYDAY', async () => {
    const rrule = await icsRrule(CFG.recurWeekly, 'atcb-e02');
    expect(rrule).to.include('FREQ=WEEKLY');
    expect(rrule).to.include('BYDAY=MO,WE,FR');
  });

  it('E-03: simplified MONTHLY with BYMONTHDAY', async () => {
    const rrule = await icsRrule({ ...CFG.recurDaily, name: 'Monthly', recurrence: 'monthly', recurrence_byMonthDay: '15', startDate: '2050-06-15' }, 'atcb-e03');
    expect(rrule).to.include('FREQ=MONTHLY');
    expect(rrule).to.include('BYMONTHDAY=15');
  });

  it('E-04: simplified MONTHLY with BYDAY=2MO', async () => {
    const rrule = await icsRrule({ ...CFG.recurDaily, name: 'SecondMonday', recurrence: 'monthly', recurrence_byDay: '2MO', startDate: '2050-06-13' }, 'atcb-e04');
    expect(rrule).to.include('BYDAY=2MO');
  });

  it('E-05: simplified YEARLY with BYMONTH + BYMONTHDAY', async () => {
    const rrule = await icsRrule({ ...CFG.recurDaily, name: 'Yearly', recurrence: 'yearly', recurrence_byMonth: '6', recurrence_byMonthDay: '15' }, 'atcb-e05');
    expect(rrule).to.include('FREQ=YEARLY');
    expect(rrule).to.include('BYMONTH=6');
    expect(rrule).to.include('BYMONTHDAY=15');
  });

  it('E-06: raw RRULE passes through verbatim', async () => {
    const rrule = await icsRrule(CFG.recurRaw, 'atcb-e06a');
    expect('RRULE:' + rrule).to.equal(CFG.recurRaw.recurrence);
    const recur = await googleRecur(CFG.recurRaw, 'atcb-e06b');
    expect(recur).to.equal(CFG.recurRaw.recurrence);
  });

  it('E-07: UNTIL is converted into an equivalent COUNT (documented actual behavior)', async () => {
    // PLAN NOTE: the plan expected UNTIL to be preserved verbatim. Actual behavior
    // (src/atcb-decorate.js): UNTIL is translated into a COUNT of remaining occurrences
    // so past-occurrence advancement stays consistent.
    const rrule = await icsRrule({ ...CFG.recurDaily, name: 'Until', recurrence: 'RRULE:FREQ=DAILY;UNTIL=20501231T235959Z' }, 'atcb-e07');
    expect(rrule).to.include('FREQ=DAILY');
    expect(rrule).to.match(/COUNT=\d+/);
    expect(rrule).to.not.include('UNTIL');
  });

  it('E-08: INTERVAL preserved', async () => {
    const rrule = await icsRrule({ ...CFG.recurDaily, name: 'Interval', recurrence: 'daily', recurrence_interval: 2, recurrence_count: 5 }, 'atcb-e08');
    expect(rrule).to.include('INTERVAL=2');
  });

  it('E-09: WKST preserved', async () => {
    const rrule = await icsRrule({ ...CFG.recurWeekly, name: 'Wkst', recurrence_weekstart: 'SU' }, 'atcb-e09');
    expect(rrule).to.include('WKST=SU');
  });

  it('E-10: recurring all-day -> date-only DTSTART with RRULE', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ name: 'RecAllday', startDate: '2050-06-15', recurrence: 'daily', recurrence_count: 3, options: "'iCal'", trigger: 'click', identifier: 'atcb-e10' });
      await clickSingleton(host);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].prop('DTSTART')).to.include('VALUE=DATE');
      expect(ics.events[0].value('RRULE')).to.include('FREQ=DAILY');
    } finally {
      fs.restore();
    }
  });

  it('E-11: past start with future occurrences left -> startDate advances (decorate level)', async () => {
    const decorated = await atcb_decorate_data({
      name: 'PastRecurring',
      startDate: '2020-01-06', // a Monday, long past
      startTime: '10:00',
      endTime: '11:00',
      timeZone: 'America/New_York',
      recurrence: 'weekly',
      recurrence_byDay: 'MO',
      recurrence_count: 99999,
      options: ['Google'],
    });
    expect(new Date(decorated.dates[0].startDate).getTime()).to.be.greaterThan(Date.now() - 8 * 86400000);
  });

  it('E-12: COUNT exhausted (all in past) -> startDate advances to the LAST occurrence, still renders', async () => {
    const decorated = await atcb_decorate_data({
      name: 'ExhaustedRecurring',
      startDate: '2020-01-06',
      startTime: '10:00',
      endTime: '11:00',
      recurrence: 'daily',
      recurrence_count: 5,
      options: ['Google'],
    });
    // PLAN NOTE: the plan assumed the ORIGINAL start date is kept; actual behavior:
    // atcb_getNextOccurrence advances to the final occurrence of the exhausted series (2020-01-10).
    expect(decorated.dates[0].startDate).to.equal('2020-01-10');
    const { host } = await mountAtcb({ name: 'ExhaustedRecurring', startDate: '2020-01-06', startTime: '10:00', endTime: '11:00', recurrence: 'daily', recurrence_count: 5, options: "'Google'", identifier: 'atcb-e12' });
    expect(host.shadowRoot.querySelector('.atcb-initialized')).to.exist;
  });

  it('E-12a: COUNT exhausted + pastDateHandling=hide -> button not generated', async () => {
    const { host } = await mountAtcb({ name: 'ExhaustedHide', startDate: '2020-01-06', startTime: '10:00', endTime: '11:00', recurrence: 'daily', recurrence_count: 5, options: "'Google'", pastDateHandling: 'hide', identifier: 'atcb-e12a' });
    expect(host.shadowRoot.querySelector('button')).to.not.exist;
  });

  it('E-13d: iOS + recurring -> only apple remains and renders as a SINGLETON button', async () => {
    // full options + recurrence + iOS: recurrence drops yahoo/ms/teams, iOS drops ical and google
    // -> exactly one option (apple) left; the lib renders it as a single direct button
    // (the trigger takes over the identifier, so no per-option list items exist)
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(baseEvent({ ...CFG.recurDaily, fakeIOS: 'true', trigger: 'click', identifier: 'atcb-e13d' }));
      const btn = host.shadowRoot.getElementById(host.getAttribute('atcb-button-id'));
      expect(btn.classList.contains('atcb-single'), 'renders as singleton').to.equal(true);
      const opts = renderedOptions(host);
      expect(opts).to.not.include('google');
      expect(opts).to.not.include('yahoo');
      expect(opts).to.not.include('ms365');
      expect(opts).to.not.include('outlookcom');
      expect(opts).to.not.include('msteams');
      await clickSingleton(host);
      expect(fs.saves.length, 'singleton click saves the apple/ics file').to.equal(1);
    } finally {
      fs.restore();
    }
  });

  it('E-15: simplified recurrence flag uses the CORRECTED spelling in this codebase', async () => {
    const decorated = await atcb_decorate_data({ ...CFG.recurDaily, options: ['Google'] });
    // NOTE - PLAN MISMATCH: the plan expected the legacy misspelled key `recurrence_simplyfied`.
    // This codebase has fixed the spelling; pinning the corrected contract here.
    expect(decorated.recurrence_simplified).to.equal(true);
    expect(decorated.recurrence_simplyfied).to.equal(undefined);
    const raw = await atcb_decorate_data({ ...CFG.recurRaw, options: ['Google'] });
    expect(raw.recurrence_simplified).to.equal(false);
  });
});
