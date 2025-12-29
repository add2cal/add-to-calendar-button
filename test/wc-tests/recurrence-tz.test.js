import { expect } from '@open-wc/testing';
import { atcb_decorate_data } from '../../src/atcb-decorate.js';

describe('recurrence timezone evaluation', () => {
  it('does not shift startDate for weekly BYDAY near midnight in Europe/Berlin', async function () {
    const decorated = await atcb_decorate_data({
      name: 'test',
      options: ['Google'],
      startDate: '2026-01-13',
      startTime: '00:20',
      endTime: '00:50',
      timeZone: 'Europe/Berlin',
      recurrence: 'WEEKLY',
      recurrence_byDay: 'TU',
    });
    expect(decorated.dates[0].startDate).to.equal('2026-01-13');
    expect(decorated.dates[0].startTime).to.equal('00:20');
  });
});
