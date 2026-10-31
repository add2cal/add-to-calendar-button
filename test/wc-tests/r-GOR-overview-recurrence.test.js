import { expect } from '@open-wc/testing';
import { getOccurrencesInRange } from '../../src/core/dates.ts';
import { flatten_events, render_group_overview } from '../../src/ui/group-overview.ts';

const now = new Date('2026-10-31T12:00:00Z');
const expand = (rule, start, from, to, time = '09:00', zone = 'UTC') => getOccurrencesInRange(rule, start, time, zone, from, to);

describe('Group GOR - overview recurrence', () => {
  it('renders occurrence links but sends the original date and identity to add actions in every layout', async () => {
    const today = new Date();
    const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    const original = window.fetch;
    const payload = [{ prokey: 'original-series', recurrence: 'RRULE:FREQ=DAILY;COUNT=2', dates: [{ startDate }] }];
    window.fetch = async () => new Response(JSON.stringify(payload), { status: 200 });
    try {
      for (const type of ['list', 'cards', 'compact']) {
        for (const subscribe of [false, true]) {
          const actions = [];
          const { root } = await render_group_overview({ prokey: 'group-key', subscribe, buttonStyle: 'none', groupOverviewConfig: { type, 'add-via-list': true } }, new AbortController().signal, (event) => actions.push(event));
          const links = [...root.querySelectorAll('[part="atcb-group-overview-link"]')];
          expect(links).to.have.length(2);
          expect(links.map((link) => link.href)).to.deep.equal(Array(2).fill(`https://caldn.net/${subscribe ? 'group-key' : 'original-series'}`));
          root.querySelectorAll('[part="atcb-group-overview-add"]')[1].click();
          expect(actions[0]).to.include({ startDate, prokey: subscribe ? 'group-key' : 'original-series' });
        }
      }
    } finally {
      window.fetch = original;
    }
  });

  it('does not duplicate cross-year recurring occurrences and retains all-day duration', () => {
    const rows = flatten_events([{ prokey: 'cross-year', recurrence: 'RRULE:FREQ=YEARLY;COUNT=3', dates: [{ startDate: '2026-12-31', endDate: '2027-01-02' }] }], now);
    expect(rows.map((row) => [row.startDate, row.endDate])).to.deep.equal([
      ['2026-12-31', '2027-01-02'],
      ['2027-12-31', '2028-01-02'],
    ]);
  });

  it('includes both range edges and counts occurrences before the range', () => {
    expect(expand('RRULE:FREQ=DAILY;COUNT=4', '2026-09-30', '2026-10-01', '2026-10-03')).to.deep.equal(['2026-10-01', '2026-10-02', '2026-10-03']);
    expect(expand('RRULE:FREQ=DAILY;COUNT=1', '2026-09-30', '2026-10-01', '2026-10-03')).to.deep.equal([]);
  });

  it('respects interval, weekdays, ordinal monthly and leap-year rules', () => {
    expect(expand('RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE', '2026-09-28', '2026-10-01', '2026-10-31')).to.deep.equal(['2026-10-12', '2026-10-14', '2026-10-26', '2026-10-28']);
    expect(expand('RRULE:FREQ=MONTHLY;BYDAY=-1FR', '2026-09-25', '2026-10-01', '2026-12-31')).to.deep.equal(['2026-10-30', '2026-11-27', '2026-12-25']);
    expect(expand('RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=29', '2024-02-29', '2026-10-01', '2028-04-30')).to.deep.equal(['2028-02-29']);
  });

  it('preserves local dates across DST and UTC date boundaries, with inclusive UNTIL', () => {
    expect(expand('RRULE:FREQ=DAILY;UNTIL=20261102T050000Z', '2026-10-31', '2026-10-31', '2026-11-03', '00:00', 'America/New_York')).to.deep.equal(['2026-10-31', '2026-11-01', '2026-11-02']);
    expect(expand('RRULE:FREQ=DAILY;COUNT=3', '2026-10-01', '2026-10-01', '2026-10-03', '00:30', 'Pacific/Auckland')).to.deep.equal(['2026-10-01', '2026-10-02', '2026-10-03']);
  });

  it('expands the entire month window, sorts rows and preserves identity without mutation', () => {
    const input = [
      { prokey: 'series', recurrence: 'RRULE:FREQ=MONTHLY', dates: [{ startDate: '2026-09-01', endDate: '2026-09-03', startTime: '09:00', endTime: '10:00', timeZone: 'Europe/Berlin' }] },
      { prokey: 'single', dates: [{ startDate: '2026-10-01', startTime: '08:00' }] },
      { prokey: 'old-single', dates: [{ startDate: '2025-01-01' }] },
    ];
    const before = JSON.stringify(input);
    const rows = flatten_events(input, now);
    const recurring = rows.filter((row) => row.prokey === 'series');
    expect(recurring).to.have.length(19);
    expect(recurring[0]).to.include({ startDate: '2026-10-01', endDate: '2026-10-03', startTime: '09:00', endTime: '10:00', timeZone: 'Europe/Berlin' });
    expect(recurring.at(-1).startDate).to.equal('2028-04-01');
    expect(rows.findIndex((row) => row.prokey === 'single')).to.be.lessThan(rows.findIndex((row) => row.prokey === 'series'));
    expect(rows.some((row) => row.prokey === 'old-single')).to.equal(true);
    expect(JSON.stringify(input)).to.equal(before);
  });

  it('handles simplified recurrence, expired series and dates after the upper bound', () => {
    const rows = flatten_events(
      [
        { prokey: 'simple', recurrence_simple_type: 'weekly', dates: [{ startDate: '2028-04-30' }] },
        { prokey: 'expired', recurrence: 'RRULE:FREQ=DAILY;COUNT=2', dates: [{ startDate: '2026-09-01' }] },
        { prokey: 'future', recurrence: 'RRULE:FREQ=DAILY', dates: [{ startDate: '2028-05-01' }] },
      ],
      now,
    );
    expect(rows.map((row) => [row.prokey, row.startDate])).to.deep.equal([['simple', '2028-04-30']]);
  });
});
