import { expect } from '@open-wc/testing';
import { decorate_data } from '../../src/core/decorate.ts';
import { getNextOccurrence, getOccurrencesInRange } from '../../src/core/dates.ts';

describe('recurrence timezone evaluation', () => {
  it('does not shift startDate for weekly BYDAY near midnight in Europe/Berlin', async function () {
    const decorated = await decorate_data({
      name: 'test',
      options: ['google'],
      startDate: '2066-01-12', // once this data is in the past, the test would fail as it auto-adjusts to the next occurrence
      startTime: '00:20',
      endTime: '00:50',
      timeZone: 'Europe/Berlin',
      recurrence: 'WEEKLY',
      recurrence_byDay: 'TU',
    });
    expect(decorated.dates[0].startDate).to.equal('2066-01-12');
    expect(decorated.dates[0].startTime).to.equal('00:20');
  });

  it('keeps bounded recurrence dates consistent between next and range wrappers', () => {
    const countRule = 'RRULE:FREQ=WEEKLY;COUNT=500';
    const counted = getNextOccurrence(countRule, new Date('1980-01-07T10:00:00Z'), 0, false, 'UTC');
    const countedDates = getOccurrencesInRange(countRule, '1980-01-07', '10:00', 'UTC', '1989-01-01', '1990-01-01');
    expect(countedDates.at(-1)).to.equal(counted.nextOccurrence.toISOString().slice(0, 10));
    expect(counted.adjustedCount).to.equal(1);
    expect(getOccurrencesInRange(countRule, '1980-01-07', '10:00', 'UTC', '1990-01-01', '1990-02-01')).to.deep.equal([]);

    // tzlib extrapolates current DST rules, so use a completed post-2007 US transition.
    const untilRule = 'RRULE:FREQ=DAILY;UNTIL=20211115T050000Z';
    const until = getNextOccurrence(untilRule, new Date('2021-11-06T04:00:00Z'), 0, false, 'America/New_York');
    expect(until.nextOccurrence.toISOString()).to.equal('2021-11-15T05:00:00.000Z');
    expect(getOccurrencesInRange(untilRule, '2021-11-06', '00:00', 'America/New_York', '2021-11-06', '2021-11-08')).to.deep.equal(['2021-11-06', '2021-11-07', '2021-11-08']);
    expect(getOccurrencesInRange(untilRule, '2021-11-06', '00:00', 'America/New_York', '2021-11-14', '2021-11-16')).to.deep.equal(['2021-11-14', '2021-11-15']);
    expect(getOccurrencesInRange('RRULE:FREQ=DAILY;UNTIL=20010102', '2001-01-01', '', 'America/New_York', '2001-01-01', '2001-01-03')).to.deep.equal(['2001-01-01', '2001-01-02']);
    const allDay = getNextOccurrence('RRULE:FREQ=DAILY;UNTIL=20010102', new Date('2001-01-01T12:00:00Z'), 0, true, 'UTC');
    expect(allDay.nextOccurrence.toISOString()).to.equal('2001-01-02T12:00:00.000Z');
  });
});
