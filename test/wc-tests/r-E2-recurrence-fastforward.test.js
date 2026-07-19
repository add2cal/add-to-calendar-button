/**
 * Reduced Suite - Group E2: Recurrence fast-forward (case list: .ai/TEST-CASES.md)
 *
 * Old start dates jump arithmetically close to now instead of stepping through
 * decades day by day. The match predicates are absolute (calendar math from the
 * start date), which yields a strong self-consistency property used here:
 * shifting the start by k whole periods (same phase) must not change the next
 * occurrence, and for bounded rules the remaining count must shift by exactly k.
 * The fast-forward path and the plain iteration path are compared through that
 * property - the shifted twin is recent enough to never trigger a jump.
 */
import { expect } from '@open-wc/testing';
import { atcb_getNextOccurrence } from '../../src/core/dates.ts';

// build a UTC Date for a local wall-clock time in a tz-agnostic way (tests run in UTC)
function utcDate(dateStr, timeStr = '10:00') {
  return new Date(`${dateStr}T${timeStr}:00Z`);
}

function shiftDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

describe('Group E2 - recurrence fast-forward', () => {
  it('E2-01: performance - daily recurrence starting 1980 resolves in under 50 ms', () => {
    const start = utcDate('1980-01-15');
    const began = performance.now();
    const result = atcb_getNextOccurrence('RRULE:FREQ=DAILY;INTERVAL=1', start, 3600000, false, 'UTC');
    const elapsed = performance.now() - began;
    expect(elapsed, `took ${elapsed.toFixed(1)}ms`).to.be.lessThan(50);
    // and the result is actually current (the old iteration capped out in ~2007)
    expect(result.nextOccurrence.getTime(), 'next occurrence within the last two days or future').to.be.greaterThan(Date.now() - 2 * 86400000);
  });

  it('E2-02: phase-shift property - unbounded rules yield the same next occurrence from an old and a recent start', () => {
    const cases = [
      { rrule: 'RRULE:FREQ=DAILY;INTERVAL=1', oldStart: utcDate('1985-03-03'), periodDays: 1 },
      { rrule: 'RRULE:FREQ=DAILY;INTERVAL=7', oldStart: utcDate('1990-11-11'), periodDays: 7 },
      { rrule: 'RRULE:FREQ=WEEKLY;INTERVAL=1', oldStart: utcDate('1979-06-06'), periodDays: 7 },
      { rrule: 'RRULE:FREQ=WEEKLY;INTERVAL=3', oldStart: utcDate('1995-01-02'), periodDays: 21 },
    ];
    for (const { rrule, oldStart, periodDays } of cases) {
      // shift the old start forward by whole periods until ~200 days ago (no jump there)
      const periodsToRecent = Math.floor((Date.now() - 200 * 86400000 - oldStart.getTime()) / 86400000 / periodDays);
      const recentStart = shiftDays(oldStart, periodsToRecent * periodDays);
      const fromOld = atcb_getNextOccurrence(rrule, oldStart, 3600000, false, 'UTC');
      const fromRecent = atcb_getNextOccurrence(rrule, recentStart, 3600000, false, 'UTC');
      expect(fromOld.nextOccurrence.toISOString(), rrule).to.equal(fromRecent.nextOccurrence.toISOString());
    }
  });

  it('E2-03: phase-shift property holds for monthly and yearly rules', () => {
    const now = new Date();
    // monthly, day 10 (jump-eligible: <= 28)
    const monthlyOld = atcb_getNextOccurrence('RRULE:FREQ=MONTHLY;INTERVAL=1', utcDate('1988-04-10'), 3600000, false, 'UTC');
    const monthlyRecent = atcb_getNextOccurrence('RRULE:FREQ=MONTHLY;INTERVAL=1', utcDate(`${now.getUTCFullYear() - 1}-04-10`), 3600000, false, 'UTC');
    expect(monthlyOld.nextOccurrence.toISOString(), 'monthly').to.equal(monthlyRecent.nextOccurrence.toISOString());
    // yearly
    const yearlyOld = atcb_getNextOccurrence('RRULE:FREQ=YEARLY;INTERVAL=1', utcDate('1970-08-20'), 3600000, false, 'UTC');
    const yearlyRecent = atcb_getNextOccurrence('RRULE:FREQ=YEARLY;INTERVAL=1', utcDate(`${now.getUTCFullYear() - 2}-08-20`), 3600000, false, 'UTC');
    expect(yearlyOld.nextOccurrence.toISOString(), 'yearly').to.equal(yearlyRecent.nextOccurrence.toISOString());
  });

  it('E2-04: COUNT consumption - remaining count from an old start equals the k-shifted recent twin', () => {
    // daily interval 2, started 1000 periods ago with COUNT high enough to still run
    const periodDays = 2;
    const periods = 1000;
    const oldStart = shiftDays(new Date(Date.now() - (Date.now() % 86400000)), -periods * periodDays);
    const recentPeriods = 20;
    const recentStart = shiftDays(oldStart, (periods - recentPeriods) * periodDays);
    const fromOld = atcb_getNextOccurrence(`RRULE:FREQ=DAILY;INTERVAL=${periodDays};COUNT=${periods + 50}`, oldStart, 0, false, 'UTC');
    const fromRecent = atcb_getNextOccurrence(`RRULE:FREQ=DAILY;INTERVAL=${periodDays};COUNT=${recentPeriods + 50}`, recentStart, 0, false, 'UTC');
    expect(fromOld.nextOccurrence.toISOString(), 'same next occurrence').to.equal(fromRecent.nextOccurrence.toISOString());
    expect(fromOld.adjustedCount, 'remaining count identical after consuming the same phase').to.equal(fromRecent.adjustedCount);
  });

  it('E2-05: exhausted COUNT series lands on the final occurrence (fast-forwarded)', () => {
    // weekly from 1980 with COUNT=500: final occurrence = start + 499 weeks (year ~1989)
    const start = utcDate('1980-01-07');
    const result = atcb_getNextOccurrence('RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=500', start, 0, false, 'UTC');
    const expected = shiftDays(start, 499 * 7);
    expect(result.nextOccurrence.toISOString(), 'lands on the 500th occurrence').to.equal(expected.toISOString());
    expect(result.adjustedCount, 'series fully consumed').to.be.lessThan(2);
  });

  it('E2-06: exhausted UNTIL series lands on the final occurrence before UNTIL (fast-forwarded)', () => {
    const start = utcDate('1980-01-07');
    // until mid-1992: final weekly occurrence is the last monday-aligned date <= UNTIL
    const result = atcb_getNextOccurrence('RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=19920610T235959Z', start, 0, false, 'UTC');
    expect(result.nextOccurrence.getUTCFullYear(), 'lands in the UNTIL year').to.equal(1992);
    expect(result.nextOccurrence.getTime(), 'not past UNTIL').to.be.lessThan(utcDate('1992-06-11', '00:00').getTime());
    // start was a monday - the final occurrence keeps the weekday
    expect(result.nextOccurrence.getUTCDay(), 'weekday preserved').to.equal(start.getUTCDay());
    expect(result.adjustedCount, 'series fully consumed').to.be.lessThan(2);
  });

  it('E2-07: bounded rules with BY* filters keep the exact iteration (no jump, correct within the historic window)', () => {
    // weekly MO,WE with COUNT: matches per period vary - must NOT be fast-forwarded.
    // span kept small enough for the exact iteration to be authoritative
    const start = utcDate('2024-01-01'); // a monday
    const result = atcb_getNextOccurrence('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE;COUNT=20', start, 0, false, 'UTC');
    // 20 occurrences = 10 weeks: final = wednesday of week 10 (2024-03-06)
    expect(result.nextOccurrence.toISOString().substring(0, 10), 'final BYDAY occurrence exact').to.equal('2024-03-06');
  });

  it('E2-08: unbounded rules with BY* filters do fast-forward and stay correct', () => {
    // monthly on the 31st (non-uniform matching - only counting is restricted, not the jump)
    const result = atcb_getNextOccurrence('RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=31', utcDate('1983-01-31'), 0, false, 'UTC');
    expect(result.nextOccurrence.getUTCDate(), 'lands on a 31st').to.equal(31);
    expect(result.nextOccurrence.getTime(), 'current, not capped in the past').to.be.greaterThan(Date.now() - 35 * 86400000);
  });
});
