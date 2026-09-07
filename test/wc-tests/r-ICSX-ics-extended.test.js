/**
 * Reduced Suite - Group ICSX: Extended ics options (case list: .ai/TEST-CASES.md)
 *
 * The ics* options (icsReminder, icsUrl, icsCategories, icsClass, icsPriority, icsGeo,
 * icsAttach + root-level icsExdate) shape ONLY the generated ics file (Apple/iCal).
 * Every other calendar type ignores them by design: urls stay identical, options stay
 * untouched. All except icsExdate work per date entry in the multi-date case, following
 * the root-overrides-entries contract of the other date fields.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave, muteConsole } from '../helpers/capture.js';
import { clickSingleton, renderedOptions, openList } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { decorate_data } from '../../src/core/decorate.ts';
import { check_required, validate } from '../../src/core/validate.ts';

const EXTRAS = {
  icsReminder: '30',
  icsUrl: 'https://example.com/event',
  icsCategories: 'Work,Conference',
  icsClass: 'private',
  icsPriority: '1',
  icsGeo: '52.52, 13.405',
  icsAttach: 'https://example.com/agenda.pdf,https://example.com/ticket.pdf',
};

async function icsFor(config, id) {
  const fs = interceptFileSave();
  try {
    const { host } = await mountAtcb({ ...config, options: "'ical'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    return parseIcs(decodeIcsHref(fs.saves[0].href));
  } finally {
    fs.restore();
  }
}

async function expectValidationFail(config, msgPart) {
  let error = null;
  try {
    await check_required(config);
    const data = await decorate_data(config);
    await validate(data);
  } catch (e) {
    error = e;
  }
  expect(error, 'expected validation to fail').to.exist;
  expect(error.message).to.include(msgPart);
}

describe('Group ICSX - extended ics options', () => {
  it('ICSX-01: the per-event properties emit correctly formatted ics lines', async () => {
    const ics = await icsFor(baseEvent({ ...EXTRAS, location: 'Test Hall 7' }), 'atcb-icsx01');
    const ev = ics.events[0];
    expect(ev.value('URL'), 'URL').to.equal('https://example.com/event');
    expect(ev.value('CATEGORIES'), 'CATEGORIES').to.equal('Work,Conference');
    expect(ev.value('CLASS'), 'CLASS uppercased').to.equal('PRIVATE');
    expect(ev.value('PRIORITY'), 'PRIORITY').to.equal('1');
    expect(ev.value('GEO'), 'GEO with semicolon separator').to.equal('52.52;13.405');
    const attachments = ev.lines.filter((line) => line.startsWith('ATTACH:'));
    expect(attachments, 'both attachments').to.deep.equal(['ATTACH:https://example.com/agenda.pdf', 'ATTACH:https://example.com/ticket.pdf']);
  });

  it('ICSX-02: icsReminder renders a display alarm (minutes number or raw ISO duration)', async () => {
    const minutes = await icsFor(baseEvent({ name: 'Alarm Check', icsReminder: '30' }), 'atcb-icsx02a');
    const ev = minutes.events[0];
    expect(ev.prop('TRIGGER'), 'minutes converted to a negative duration').to.equal('TRIGGER:-PT30M');
    expect(ev.lines, 'alarm block markers').to.include('BEGIN:VALARM').and.to.include('END:VALARM');
    expect(ev.lines, 'display action').to.include('ACTION:DISPLAY');
    const alarmLines = ev.lines.slice(ev.lines.indexOf('BEGIN:VALARM'), ev.lines.indexOf('END:VALARM'));
    expect(
      alarmLines.find((line) => line.startsWith('DESCRIPTION:')),
      'alarm description falls back to the event name',
    ).to.include('Alarm Check');
    const duration = await icsFor(baseEvent({ icsReminder: '-PT1H' }), 'atcb-icsx02b');
    expect(duration.events[0].prop('TRIGGER'), 'ISO duration passes through').to.equal('TRIGGER:-PT1H');
  });

  it('ICSX-03: icsGeo emits the Apple structured location only when a location exists, with a matching title', async () => {
    const withLocation = await icsFor(baseEvent({ icsGeo: '52.52,13.405', location: 'Test Hall 7' }), 'atcb-icsx03a');
    const appleLine = withLocation.events[0].prop('X-APPLE-STRUCTURED-LOCATION');
    expect(appleLine, 'structured location present').to.exist;
    expect(appleLine, 'title matches LOCATION (required for the Apple map preview)').to.include('X-TITLE=Test Hall 7:geo:52.52,13.405');
    const withoutLocation = await icsFor(baseEvent({ icsGeo: '52.52,13.405', location: '' }), 'atcb-icsx03b');
    expect(withoutLocation.events[0].value('GEO'), 'GEO still present').to.equal('52.52;13.405');
    expect(withoutLocation.events[0].prop('X-APPLE-STRUCTURED-LOCATION'), 'no structured location without a location').to.equal(null);
  });

  it('ICSX-04: multi-date - per-entry values land in their own events; root values override (dates contract)', async () => {
    const ics = await icsFor(
      {
        name: 'Series',
        icsClass: 'PUBLIC',
        dates: JSON.stringify([
          { name: 'Day 1', startDate: '2050-06-15', icsUrl: 'https://example.com/day-1', icsClass: 'PRIVATE' },
          { name: 'Day 2', startDate: '2050-06-16', icsUrl: 'https://example.com/day-2', icsPriority: 3 },
        ]),
      },
      'atcb-icsx04',
    );
    expect(ics.events.length).to.equal(2);
    expect(ics.events[0].value('URL'), 'entry 1 url').to.equal('https://example.com/day-1');
    expect(ics.events[1].value('URL'), 'entry 2 url').to.equal('https://example.com/day-2');
    expect(ics.events[1].value('PRIORITY'), 'entry-only value').to.equal('3');
    expect(ics.events[0].value('CLASS'), 'root value overrides the entry value (root-wins contract)').to.equal('PUBLIC');
    expect(ics.events[1].value('CLASS'), 'root value fills entries without their own').to.equal('PUBLIC');
  });

  it('ICSX-05: icsExdate mirrors the DTSTART form (TZID for timed, VALUE=DATE for allday)', async () => {
    const timed = await icsFor(baseEvent({ recurrence: 'weekly', recurrence_count: '10', icsExdate: '2050-06-22,2050-07-06' }), 'atcb-icsx05a');
    const timedLine = timed.events[0].prop('EXDATE');
    expect(timedLine, 'timed exdate carries the tzid').to.include('EXDATE;TZID=');
    expect(timedLine, 'wall-clock times match DTSTART').to.include(':20500622T100000,20500706T100000');
    const allday = await icsFor({ name: 'All Day Series', startDate: '2050-06-15', recurrence: 'weekly', recurrence_count: '5', icsExdate: '2050-06-22' }, 'atcb-icsx05b');
    expect(allday.events[0].prop('EXDATE'), 'allday exdate uses date values').to.equal('EXDATE;VALUE=DATE:20500622');
  });

  it('ICSX-06: invalid values fail validation loudly', async () => {
    const mute = muteConsole();
    try {
      const base = { name: 'V', startDate: '2050-06-15', options: ['ical'] };
      await expectValidationFail({ ...base, icsClass: 'SECRET' }, 'icsClass');
      await expectValidationFail({ ...base, icsPriority: '10' }, 'icsPriority');
      await expectValidationFail({ ...base, icsGeo: 'somewhere' }, 'icsGeo');
      await expectValidationFail({ ...base, icsGeo: '95,200' }, 'out of range');
      await expectValidationFail({ ...base, icsReminder: 'soon' }, 'icsReminder');
      await expectValidationFail({ ...base, icsUrl: 'javascript:alert(1)' }, 'icsUrl');
      await expectValidationFail({ ...base, icsAttach: 'https://ok.example.com/a.pdf,ftp://files.example.com/b.pdf' }, 'icsAttach');
      await expectValidationFail({ ...base, icsExdate: '2050-06-22' }, 'requires a recurrence');
      await expectValidationFail({ ...base, recurrence: 'weekly', recurrence_count: '5', icsExdate: '22.06.2050' }, 'YYYY-MM-DD');
    } finally {
      mute.restore();
    }
  });

  it('ICSX-07: guardrail - other calendar types ignore the options completely', async () => {
    const wo = interceptWindowOpen();
    try {
      const plain = await mountAtcb(baseEvent({ options: "'google'", trigger: 'click', identifier: 'atcb-icsx07a' }));
      await clickSingleton(plain.host);
      const plainUrl = wo.calls[0].url;
      const extras = await mountAtcb(baseEvent({ ...EXTRAS, icsExdate: undefined, options: "'google'", trigger: 'click', identifier: 'atcb-icsx07b' }));
      await clickSingleton(extras.host);
      const extrasUrl = wo.calls[1].url;
      expect(extrasUrl, 'google url byte-identical with ics extras set').to.equal(plainUrl);
    } finally {
      wo.restore();
    }
    // the option list stays untouched as well
    const { host } = await mountAtcb(baseEvent({ ...EXTRAS, options: "['google','apple','yahoo','ms365']", trigger: 'click', identifier: 'atcb-icsx07c' }));
    await openList(host);
    expect(renderedOptions(host)).to.deep.equal(['apple', 'google', 'ms365', 'yahoo']);
    await aTimeout(50);
  });

  it('ICSX-08: without the options, none of the new properties appear (output stability)', async () => {
    const ics = await icsFor(baseEvent({}), 'atcb-icsx08');
    const ev = ics.events[0];
    for (const name of ['URL', 'CATEGORIES', 'CLASS', 'PRIORITY', 'GEO', 'X-APPLE-STRUCTURED-LOCATION', 'ATTACH', 'EXDATE']) {
      expect(ev.prop(name), name + ' absent').to.equal(null);
    }
    expect(ev.lines, 'no alarm block').to.not.include('BEGIN:VALARM');
  });
});
