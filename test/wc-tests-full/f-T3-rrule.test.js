/**
 * Full Cartesian Suite - F.T3: RRULE shape x active output + F.T3b: option availability (case list: .ai/TEST-CASES.md)
 */
import { expect } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, openList, renderedOptions } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';

const RRULE_SHAPES = [
  { id: 'daily', cfg: { recurrence: 'daily', recurrence_count: 10 }, expect: ['FREQ=DAILY', 'COUNT=10'] },
  { id: 'weekly-byday', cfg: { recurrence: 'weekly', recurrence_byDay: 'MO,WE,FR', recurrence_count: 12 }, expect: ['FREQ=WEEKLY', 'BYDAY=MO,WE,FR'] },
  { id: 'monthly-bymonthday', cfg: { recurrence: 'monthly', recurrence_byMonthDay: '15', recurrence_count: 6 }, expect: ['FREQ=MONTHLY', 'BYMONTHDAY=15'] },
  { id: 'monthly-2mo', cfg: { recurrence: 'monthly', recurrence_byDay: '2MO', recurrence_count: 6 }, expect: ['FREQ=MONTHLY', 'BYDAY=2MO'] },
  { id: 'yearly', cfg: { recurrence: 'yearly', recurrence_byMonth: '6', recurrence_byMonthDay: '15', recurrence_count: 3 }, expect: ['FREQ=YEARLY', 'BYMONTH=6', 'BYMONTHDAY=15'] },
  { id: 'raw-count', cfg: { recurrence: 'RRULE:FREQ=WEEKLY;COUNT=10;BYDAY=TU' }, expect: ['FREQ=WEEKLY', 'COUNT=10', 'BYDAY=TU'] },
  // NOTE: UNTIL gets converted into an equivalent COUNT during decoration (see E-07 pin)
  { id: 'raw-until', cfg: { recurrence: 'RRULE:FREQ=DAILY;UNTIL=20501231T235959Z' }, expect: ['FREQ=DAILY', 'COUNT='] },
  { id: 'interval', cfg: { recurrence: 'weekly', recurrence_interval: 2, recurrence_count: 8 }, expect: ['FREQ=WEEKLY', 'INTERVAL=2'] },
  { id: 'wkst', cfg: { recurrence: 'weekly', recurrence_byDay: 'MO', recurrence_weekstart: 'SU', recurrence_count: 8 }, expect: ['WKST=SU'] },
];

const BASE = { name: 'RRule Matrix', startDate: '2050-06-13', startTime: '10:00', endTime: '11:00', timeZone: 'America/New_York' };
let n = 0;

describe('F.T3 - RRULE serialization (ICS + Google)', () => {
  for (const shape of RRULE_SHAPES) {
    it(`F.T3 | ${shape.id} | ical`, async () => {
      const fs = interceptFileSave();
      try {
        const { host } = await mountAtcb({ ...BASE, ...shape.cfg, options: "'iCal'", trigger: 'click', identifier: `ft3-i-${n++}` });
        await clickSingleton(host);
        const rrule = parseIcs(decodeIcsHref(fs.saves[0].href)).events[0].value('RRULE');
        for (const part of shape.expect) {
          expect(rrule).to.include(part);
        }
      } finally {
        fs.restore();
      }
    });

    it(`F.T3 | ${shape.id} | google`, async () => {
      const wo = interceptWindowOpen();
      try {
        const { host } = await mountAtcb({ ...BASE, ...shape.cfg, options: "'Google'", trigger: 'click', identifier: `ft3-g-${n++}` });
        await clickSingleton(host);
        const recur = new URL(wo.calls[0].url).searchParams.get('recur');
        expect(recur).to.include('RRULE:');
        for (const part of shape.expect) {
          expect(recur).to.include(part);
        }
      } finally {
        wo.restore();
      }
    });
  }
});

describe('F.T3b - recurrence deactivates non-supporting options', () => {
  const ABSENT_DESKTOP = ['yahoo', 'ms365', 'outlookcom', 'msteams'];
  for (const shape of RRULE_SHAPES) {
    it(`F.T3b | ${shape.id} | desktop absences`, async () => {
      const { host } = await mountAtcb(baseEvent({ ...BASE, ...shape.cfg, trigger: 'click', identifier: `ft3b-d-${n++}` }));
      await openList(host);
      const opts = renderedOptions(host);
      for (const absent of ABSENT_DESKTOP) {
        expect(opts, `${absent} must be absent`).to.not.include(absent);
      }
      expect(opts).to.include('google');
    });

    it(`F.T3b | ${shape.id} | ios absences (incl google)`, async () => {
      const { host } = await mountAtcb(baseEvent({ ...BASE, ...shape.cfg, fakeIOS: 'true', trigger: 'click', identifier: `ft3b-i-${n++}` }));
      await openList(host);
      const opts = renderedOptions(host);
      for (const absent of [...ABSENT_DESKTOP, 'google']) {
        expect(opts, `${absent} must be absent on iOS`).to.not.include(absent);
      }
    });
  }
});
