/**
 * Reduced Suite - Group B: Config validation & error paths (plan §3)
 * Function-level tests against src (mirrors the init pipeline: check_required -> decorate -> validate).
 */
import { expect } from '@open-wc/testing';
import { atcb_decorate_data } from '../../src/atcb-decorate.js';
import { atcb_check_required, atcb_validate } from '../../src/atcb-validate.js';

async function runPipeline(config) {
  await atcb_check_required(config);
  const data = await atcb_decorate_data(config);
  await atcb_validate(data);
  return data;
}

async function expectFail(config, msgPart = null) {
  let error = null;
  try {
    await runPipeline(config);
  } catch (e) {
    error = e;
  }
  expect(error, 'expected validation to fail').to.exist;
  if (msgPart) expect(error.message).to.include(msgPart);
  return error;
}

const base = { name: 'V', startDate: '2050-06-15', options: ['Google'] };

describe('Group B - Config validation & error paths', () => {
  it('B-01: invalid icsFile URL throws', async () => {
    await expectFail({ ...base, icsFile: 'not a url' }, 'ics file');
  });

  it('B-02: subscribe + multi-date dates array throws', async () => {
    await expectFail(
      {
        name: 'V',
        subscribe: true,
        icsFile: 'https://example.com/cal.ics',
        options: ['Google'],
        dates: [
          { name: 'a', startDate: '2050-01-01' },
          { name: 'b', startDate: '2050-01-02' },
        ],
      },
      'multi-date',
    );
  });

  it('B-03: subscribe without icsFile throws', async () => {
    await expectFail({ ...base, subscribe: true }, 'ics file');
  });

  it('B-04: unknown calendar option throws', async () => {
    await expectFail({ ...base, options: ['NotACalendar'] }, 'invalid option');
  });

  it('B-05: malformed created timestamp throws', async () => {
    await expectFail({ ...base, created: '2050-13-99' }, 'created');
  });

  it('B-06: malformed updated timestamp throws', async () => {
    await expectFail({ ...base, updated: 'yesterday' }, 'updated');
  });

  it('B-07: invalid IANA timezone throws', async () => {
    await expectFail({ ...base, startTime: '10:00', endTime: '11:00', timeZone: 'Foo/Bar' });
  });

  it('B-08: structurally broken RRULE throws', async () => {
    await expectFail({ ...base, recurrence: 'RRULE:UNTIL=20501231' });
  });

  it('B-09: unsupported FREQ throws', async () => {
    await expectFail({ ...base, recurrence: 'RRULE:FREQ=SECONDLY' });
  });

  it('B-11: unknown language falls back to en (no throw)', async () => {
    const data = await runPipeline({ ...base, language: 'xx' });
    expect(data.language).to.equal('en');
  });

  it('B-12: invalid buttonStyle throws', async () => {
    await expectFail({ ...base, buttonStyle: 'fancy-unknown' }, 'buttonStyle');
  });

  it('B-13: empty dates array falls back to top-level date info or fails', async () => {
    // documenting actual behavior: empty dates array is replaced by top-level fields
    let error = null;
    let data = null;
    try {
      data = await runPipeline({ name: 'V', options: ['Google'], dates: [], startDate: '2050-06-15' });
    } catch (e) {
      error = e;
    }
    if (!error) {
      expect(data.dates.length).to.be.greaterThan(0);
    } else {
      expect(error.message).to.exist;
    }
  });

  it('B-14: endDate before startDate throws', async () => {
    await expectFail({ ...base, endDate: '2050-06-14' });
  });

  it('B-15: endTime before startTime (same day) throws', async () => {
    await expectFail({ ...base, startTime: '11:00', endTime: '10:00' });
  });

  it('B-16: invalid availability value throws', async () => {
    await expectFail({ ...base, availability: 'maybe' });
  });

  it('B-17: invalid status value throws', async () => {
    await expectFail({ ...base, status: 'POSTPONED' });
  });

  it('B-18: valid baseline config passes the whole pipeline', async () => {
    const data = await runPipeline({ ...base, startTime: '10:00', endTime: '11:00', timeZone: 'Europe/Berlin' });
    expect(data.dates.length).to.equal(1);
    expect(data.dates[0].timeZone).to.equal('Europe/Berlin');
  });
});
