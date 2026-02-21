import { expect } from '@open-wc/testing';
import { atcb_decorate_data } from '../../src/atcb-decorate.js';

describe('recurrence timezone evaluation', () => {
  it('does not shift startDate for weekly BYDAY near midnight in Europe/Berlin', async function () {
    const decorated = await atcb_decorate_data({
      name: 'test',
      options: ['Google'],
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
});
