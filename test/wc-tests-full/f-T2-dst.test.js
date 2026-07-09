/**
 * Full Cartesian Suite - F.T2: DST x Timezone x Output (plan §20)
 * Cross-checks the lib's timezones-ical-library math against an independent Intl-based oracle.
 * 2050 DST positions per zone; zones without DST double as pass-through regressions.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { wallToUtcClean } from '../fixtures/matrix.js';

const ZONES = [
  { tz: 'America/New_York', positions: ['2050-03-13T01:30', '2050-03-13T03:30', '2050-06-15T10:00', '2050-11-06T00:30', '2050-11-06T02:30', '2050-12-15T10:00'] },
  { tz: 'America/Los_Angeles', positions: ['2050-03-13T01:30', '2050-03-13T03:30', '2050-06-15T10:00', '2050-11-06T00:30', '2050-11-06T02:30', '2050-12-15T10:00'] },
  { tz: 'Europe/Berlin', positions: ['2050-03-27T01:30', '2050-03-27T03:30', '2050-06-15T10:00', '2050-10-30T01:30', '2050-10-30T03:30', '2050-12-15T10:00'] },
  { tz: 'Europe/London', positions: ['2050-03-27T00:30', '2050-03-27T02:30', '2050-06-15T10:00', '2050-10-30T00:30', '2050-10-30T02:30', '2050-12-15T10:00'] },
  { tz: 'Australia/Sydney', positions: ['2050-04-03T01:30', '2050-04-03T03:30', '2050-07-15T10:00', '2050-10-02T01:30', '2050-10-02T03:30', '2050-12-15T10:00'] },
  { tz: 'Asia/Tokyo', positions: ['2050-03-13T10:00', '2050-06-15T10:00', '2050-12-15T10:00'] },
  { tz: 'Etc/UTC', positions: ['2050-03-13T10:00', '2050-06-15T10:00', '2050-12-15T10:00'] },
];

let n = 0;

describe('F.T2 - DST x timezone matrix (Google output vs Intl oracle)', () => {
  for (const { tz, positions } of ZONES) {
    for (const pos of positions) {
      const [datePart, timePart] = pos.split('T');
      const id = `ft2-${n++}`;
      it(`F.T2 | ${tz} | ${pos}`, async () => {
        const wo = interceptWindowOpen();
        try {
          const endTime = timePart.replace(/^(\d\d)/, (m) => String(Number(m) + 1).padStart(2, '0'));
          const { host } = await mountAtcb({
            name: 'DST Matrix',
            startDate: datePart,
            startTime: timePart,
            endTime,
            timeZone: tz,
            options: "'Google'",
            trigger: 'click',
            identifier: id,
          });
          await clickSingleton(host);
          const dates = new URL(wo.calls[0].url).searchParams.get('dates');
          const expected = `${wallToUtcClean(datePart, timePart, tz)}/${wallToUtcClean(datePart, endTime, tz)}`;
          expect(dates).to.equal(expected);
        } finally {
          wo.restore();
        }
      });
    }
  }
});
