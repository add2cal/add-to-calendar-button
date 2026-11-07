import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { parseIcs } from '../helpers/ics.js';

const bundled = await build({
  stdin: { contents: "export { decorate_data } from './src/core/decorate.ts'; export { validate } from './src/core/validate.ts'; export { generate_ical } from './src/generators/ical.ts';", resolveDir: process.cwd() },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { decorate_data, validate, generate_ical } = await import('data:text/javascript,' + encodeURIComponent(bundled.outputFiles[0].text));
const config = (extra) => decorate_data({ name: 'Security regression', startDate: '2050-06-15', options: ['ical'], ...extra });

test('ICAL-SEC-01: event text cannot inject a second VEVENT or property', async () => {
  const payload = 'Before\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nSUMMARY:Injected';
  const data = await config({ name: payload, location: payload, description: payload, icsCategories: [payload], icsReminder: 5 });
  await validate(data);
  const parsed = parseIcs(generate_ical(null, data, 'ical', 'all', false, true).content);
  assert.equal(parsed.events.length, 1);
  assert.equal(parsed.lines.filter((line) => line === 'SUMMARY:Injected').length, 0);
  assert.equal(parsed.lines.filter((line) => line === 'BEGIN:VALARM').length, 1);
});

test('ICAL-SEC-02: validation rejects newline-bearing URLs and attachment URLs', async () => {
  for (const extra of [{ icsUrl: 'https://example.com/\r\nX-FIELD:Injected' }, { icsAttach: ['https://example.com/\nX-FIELD:Injected'] }]) {
    await assert.rejects(async () => validate(await config(extra)), /icsUrl|icsAttach/);
  }
});

test('ICAL-SEC-03: custom variables cannot assemble script tags after cleanup', async () => {
  const data = await config({ name: '<scr%%suffix%%', customVar: { suffix: 'ipt>dummy' } });
  await assert.rejects(() => validate(data), /script/i);
});

test('ICAL-SEC-04: organizer, attendee and Apple location parameters are quoted', async () => {
  const name = 'A;ROLE=CHAIR:Other"^';
  const data = await config({ organizer: name + '|host@example.com', attendee: 'a;ROLE=CHAIR@example.com', location: name, icsGeo: '52.52,13.405' });
  await validate(data);
  const parsed = parseIcs(generate_ical(null, data, 'ical', 'all', false, true).content);
  assert.ok(parsed.lines.some((line) => line.startsWith('ORGANIZER;CN="A;ROLE=CHAIR:Other^\'^^":MAILTO:')));
  assert.ok(parsed.lines.some((line) => line.includes('CN="a;ROLE=CHAIR@example.com";X-NUM-GUESTS=0:')));
  assert.ok(parsed.lines.some((line) => line.includes('X-TITLE="A;ROLE=CHAIR:Other^\'^^":geo:')));
});

test('ICAL-SEC-05: calendar email fields reject trailing and embedded newlines', async () => {
  for (const newline of ['\r\n', '\r', '\n']) {
    await assert.rejects(async () => validate(await config({ organizer: 'Host|host@example.com' + newline })), /organizer/);
    await assert.rejects(async () => validate(await config({ organizer: 'Host|host@example.com', attendee: 'guest@example.com' + newline })), /attendee/);
  }
});
