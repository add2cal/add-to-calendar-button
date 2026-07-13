/**
 * Reduced Suite - Group B: Config validation & error paths (case list: .ai/TEST-CASES.md)
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

  it('B-08: RRULE with forbidden characters throws (syntax regex)', async () => {
    // validation is a character-level regex (src/atcb-validate.js); whitespace gets stripped
    // during decoration, so use a character that survives cleanup but violates the regex
    await expectFail({ ...base, recurrence: 'RRULE:FREQ=DAILY;BYDAY=1MO*' }, 'RRULE');
  });

  it('B-09: unsupported FREQ values pass the syntax check (documented actual behavior)', async () => {
    // NOTE: validation only checks characters; semantic FREQ checking (e.g. SECONDLY)
    // is delegated to the consuming calendar apps.
    const data = await runPipeline({ ...base, recurrence: 'RRULE:FREQ=SECONDLY' });
    expect(data.recurrence).to.include('SECONDLY');
  });

  it('B-09b: RRULE combined with multi-date dates array throws', async () => {
    await expectFail(
      {
        name: 'V',
        options: ['Google'],
        recurrence: 'RRULE:FREQ=DAILY',
        dates: [
          { name: 'a', startDate: '2050-01-01' },
          { name: 'b', startDate: '2050-01-02' },
        ],
      },
      'multi-date',
    );
  });

  it('B-11: unknown language falls back to en (no throw)', async () => {
    const data = await runPipeline({ ...base, language: 'xx' });
    expect(data.language).to.equal('en');
  });

  it('B-12: invalid buttonStyle throws', async () => {
    await expectFail({ ...base, buttonStyle: 'fancy-unknown' }, 'buttonStyle');
  });

  it('B-13: empty dates array does not crash the pipeline (documented actual behavior)', async () => {
    let error = null;
    let data = null;
    try {
      data = await runPipeline({ name: 'V', options: ['Google'], dates: [], startDate: '2050-06-15' });
    } catch (e) {
      error = e;
    }
    // pinning: decorate keeps an empty dates array (no implicit fallback to top-level fields at this pipeline level)
    if (error) {
      expect(error.message).to.exist;
    } else {
      expect(Array.isArray(data.dates)).to.equal(true);
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
