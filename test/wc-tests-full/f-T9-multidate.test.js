/**
 * Full Cartesian Suite - F.T9: Multi-date x tz-mix x sequence x uid (case list: .ai/TEST-CASES.md)
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';

const COUNTS = [1, 2, 3];
const TZ_MIXES = [
  { id: 'same', tzFor: () => 'America/New_York', unique: 1 },
  { id: 'mixed', tzFor: (i) => ['America/New_York', 'Europe/Berlin', 'Asia/Tokyo'][i % 3], unique: (count) => Math.min(count, 3) },
];
const SEQUENCES = [null, 2];
const UIDS = [null, 'fixed-uid'];

function buildDates(count, mix) {
  const dates = [];
  for (let i = 0; i < count; i++) {
    dates.push({
      name: `Part ${i + 1}`,
      startDate: `2050-07-${String(i + 1).padStart(2, '0')}`,
      startTime: '10:00',
      endTime: '11:00',
      timeZone: mix.tzFor(i),
    });
  }
  return dates;
}

let n = 0;

describe('F.T9 - multi-date matrix', () => {
  for (const count of COUNTS) {
    for (const mix of TZ_MIXES) {
      for (const sequence of SEQUENCES) {
        for (const uid of UIDS) {
          it(`F.T9 | dates=${count} | tz=${mix.id} | seq=${sequence ?? '-'} | uid=${uid ?? '-'}`, async () => {
            const fs = interceptFileSave();
            try {
              const id = `ft9-${n++}`;
              const dates = buildDates(count, mix);
              const config = {
                name: 'F9 Series',
                dates: JSON.stringify(dates),
                options: "'iCal'",
                trigger: 'click',
                identifier: id,
              };
              if (sequence) config.sequence = sequence;
              if (uid && count === 1) config.uid = uid; // uid applies per event; only deterministic for single event
              const { host } = await mountAtcb(config);
              await clickSingleton(host);
              expect(fs.saves.length).to.equal(1);
              const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
              expect(ics.events.length, 'one VEVENT per date').to.equal(count);
              const expectedTz = typeof mix.unique === 'function' ? mix.unique(count) : mix.unique;
              expect(ics.vtimezones.length, 'VTIMEZONE deduped per unique tz').to.equal(expectedTz);
              if (sequence) {
                for (const ev of ics.events) {
                  expect(ev.prop('SEQUENCE')).to.include(String(sequence));
                }
              }
              if (uid && count === 1) {
                expect(ics.events[0].value('UID')).to.equal(uid);
              }
            } finally {
              fs.restore();
            }
          });
        }
      }
    }
  }
});
