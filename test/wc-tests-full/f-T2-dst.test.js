/**
 * Full Cartesian Suite - F.T2: DST x Timezone matrix (plan §20)
 * Google receives wall-clock + ctz (no offsets visible), so the numeric DST math of
 * timezones-ical-library is cross-checked via the TEAMS url (ISO strings WITH offset)
 * against an independent Intl-based oracle.
 * 2050 DST positions per zone; zones without DST double as pass-through regressions.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { wallOffsetString } from '../fixtures/matrix.js';

const ZONES = [
  { tz: 'America/New_York', positions: ['2050-03-13T01:30', '2050-03-13T03:30', '2050-06-15T10:00', '2050-11-06T00:30', '2050-11-06T02:30', '2050-12-15T10:00'] },
  { tz: 'America/Los_Angeles', positions: ['2050-03-13T01:30', '2050-03-13T03:30', '2050-06-15T10:00', '2050-11-06T00:30', '2050-11-06T02:30', '2050-12-15T10:00'] },
  { tz: 'Europe/Berlin', positions: ['2050-03-27T01:30', '2050-03-27T03:30', '2050-06-15T10:00', '2050-10-30T01:30', '2050-10-30T03:30', '2050-12-15T10:00'] },
  { tz: 'Europe/London', positions: ['2050-03-27T00:30', '2050-03-27T02:30', '2050-06-15T10:00', '2050-10-30T00:30', '2050-10-30T02:30', '2050-12-15T10:00'] },
  { tz: 'Australia/Sydney', positions: ['2050-04-03T01:30', '2050-04-03T03:30', '2050-07-15T10:00', '2050-10-02T01:30', '2050-10-02T03:30', '2050-12-15T10:00'] },
  { tz: 'Asia/Tokyo', positions: ['2050-03-13T10:00', '2050-06-15T10:00', '2050-12-15T10:00'] },
];

let n = 0;

describe('F.T2 - DST x timezone matrix (Teams offsets vs Intl oracle)', () => {
  for (const { tz, positions } of ZONES) {
    for (const pos of positions) {
      const [datePart, timePart] = pos.split('T');
      const id = `ft2-${n++}`;
      it(`F.T2 | ${tz} | ${pos}`, async () => {
        const wo = interceptWindowOpen();
        try {
          // keep the end time within the same hour: a +1h end would land INSIDE the DST gap
          // (nonexistent/ambiguous wall-clock time) where offset conventions legitimately differ
          const endTime = timePart.endsWith(':30') ? timePart.replace(':30', ':45') : timePart.replace(/^(\d\d)/, (m) => String(Number(m) + 1).padStart(2, '0'));
          const { host } = await mountAtcb({
            name: 'DST Matrix',
            startDate: datePart,
            startTime: timePart,
            endTime,
            timeZone: tz,
            options: "'MicrosoftTeams'",
            trigger: 'click',
            identifier: id,
          });
          await clickSingleton(host);
          const url = new URL(wo.calls[0].url);
          const expectedStart = `${datePart}T${timePart}:00${wallOffsetString(datePart, timePart, tz)}`;
          const expectedEnd = `${datePart}T${endTime}:00${wallOffsetString(datePart, endTime, tz)}`;
          expect(url.searchParams.get('startTime')).to.equal(expectedStart);
          expect(url.searchParams.get('endTime')).to.equal(expectedEnd);
        } finally {
          wo.restore();
        }
      });
    }
  }
});
