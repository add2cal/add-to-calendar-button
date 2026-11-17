import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundled = await build({
  stdin: {
    contents: "export { decorate_data } from './src/core/decorate.ts'; export { validate } from './src/core/validate.ts'; export { generate_ical, determine_ical_filename } from './src/generators/ical.ts';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { decorate_data, validate, generate_ical, determine_ical_filename } = await import('data:text/javascript,' + encodeURIComponent(bundled.outputFiles[0].text));

async function calendar(extra = {}) {
  const data = await decorate_data({ name: 'Weekly sync', startDate: '2030-05-20', startTime: '10:15', endTime: '11:00', timeZone: 'Etc/GMT+5', options: ['ical'], recurrence: 'RRULE:FREQ=WEEKLY;COUNT=3', icsExdate: '2030-05-27', ...extra });
  await validate(data);
  return generate_ical(null, data, 'ical', 'all', false, true).content.replace(/\r\n /g, '').split('\r\n');
}

// Test EXDATE independently of the property parameter bug.
test('UTC-routed exclusions use the same converted instant as recurrence starts', async () => {
  const lines = await calendar();
  assert.equal(lines.find((line) => line.startsWith('EXDATE')).split(':')[1], '20300527T151500Z');
});

test('UTC DATE-TIME properties omit TZID and unnecessary VTIMEZONE blocks', async () => {
  const lines = await calendar();
  assert.ok(lines.includes('DTSTART:20300520T151500Z'));
  assert.ok(lines.includes('DTEND:20300520T160000Z'));
  assert.ok(lines.includes('EXDATE:20300527T151500Z'));
  assert.ok(!lines.includes('BEGIN:VTIMEZONE'));
});

test('sub-event filenames increment numeric and string indices before concatenation', () => {
  for (const config of [{}, { iCalFileName: 'meeting' }, { icsFile: 'https://example.com/meeting.ics' }]) {
    const base = config.iCalFileName || (config.icsFile ? 'meeting' : 'event');
    for (const index of [1, '1', 2, '2', 10, '10']) {
      assert.equal(determine_ical_filename(config, index), `${base}-${Number(index) + 1}`);
    }
    for (const index of ['all', 0, '0']) assert.equal(determine_ical_filename(config, index), base);
  }
});

for (const [timeZone, startTime, endTime, expectedStart, expectedEnd, expectedExdates] of [
  ['Etc/GMT+5', '23:15', '23:45', '20300521T041500Z', '20300521T044500Z', '20300528T041500Z,20300604T041500Z'],
  ['Etc/GMT-14', '00:15', '01:00', '20300519T101500Z', '20300519T110000Z', '20300526T101500Z,20300602T101500Z'],
  ['UTC', '10:15', '11:00', '20300520T101500Z', '20300520T110000Z', '20300527T101500Z,20300603T101500Z'],
  ['Zulu', '10:15', '11:00', '20300520T101500Z', '20300520T110000Z', '20300527T101500Z,20300603T101500Z'],
]) {
  test(`UTC routing preserves offset and date rollover for ${timeZone}`, async () => {
    const lines = await calendar({ timeZone, startTime, endTime, icsExdate: ['2030-05-27', '2030-06-03'] });
    assert.ok(lines.includes('DTSTART:' + expectedStart));
    assert.ok(lines.includes('DTEND:' + expectedEnd));
    assert.ok(lines.includes('EXDATE:' + expectedExdates));
    assert.ok(!lines.includes('BEGIN:VTIMEZONE'));
  });
}

test('named zones retain local times and matching TZID for exclusions', async () => {
  const lines = await calendar({ timeZone: 'America/New_York' });
  assert.ok(lines.includes('DTSTART;TZID=America/New_York:20300520T101500'));
  assert.ok(lines.includes('DTEND;TZID=America/New_York:20300520T110000'));
  assert.ok(lines.includes('EXDATE;TZID=America/New_York:20300527T101500'));
  assert.ok(lines.includes('BEGIN:VTIMEZONE'));
});

test('all-day exclusions remain DATE values without offset conversion', async () => {
  const lines = await calendar({ startTime: '', endTime: '' });
  assert.ok(lines.includes('DTSTART;VALUE=DATE:20300520'));
  assert.ok(lines.includes('DTEND;VALUE=DATE:20300521'));
  assert.ok(lines.includes('EXDATE;VALUE=DATE:20300527'));
  assert.ok(!lines.includes('BEGIN:VTIMEZONE'));
});

test('floating times retain no TZID or UTC suffix', () => {
  const content = generate_ical(null, { dates: [{ name: 'Floating', startDate: '2030-05-20', endDate: '2030-05-20', startTime: '10:15', endTime: '11:00', timeZone: '' }], recurrence: 'RRULE:FREQ=WEEKLY;COUNT=3', icsExdate: '2030-05-27' }, 'ical', 'all', false, true).content;
  assert.ok(content.includes('DTSTART:20300520T101500\r\n'));
  assert.ok(content.includes('EXDATE:20300527T101500\r\n'));
});
