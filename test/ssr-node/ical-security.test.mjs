import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { parseIcs } from '../helpers/ics.js';

const bundled = await build({
  stdin: { contents: "export { decorate_data } from './src/core/decorate.ts'; export { validate } from './src/core/validate.ts'; export { generate_ical, static_ics_file } from './src/generators/ical.ts'; export { resultChannel } from './src/core/globals.ts';", resolveDir: process.cwd() },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { decorate_data, validate, generate_ical, static_ics_file, resultChannel } = await import('data:text/javascript,' + encodeURIComponent(bundled.outputFiles[0].text));
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

// Inert strings, never navigated or evaluated. Bypass earlier validation to
// exercise the shared runtime boundary used by both download output paths.
const unsafeFiles = [
  'javascript:dummy',
  'JaVaScRiPt:dummy',
  'java\tscript:dummy',
  '\u0000javascript:dummy',
  'data:text/html,dummy',
  'data:text/calendar,dummy',
  'blob:https://example.com/dummy',
  'vbscript:dummy',
  'http://example.com/event.ics',
  '//example.com/event.ics',
  '/event.ics',
  'https://example.com/\r\nevent.ics',
];

test('ICAL-SEC-06: static file selection rejects unsafe root URIs before either output path', async () => {
  for (const icsFile of unsafeFiles) {
    const data = await config({ icsFile });
    assert.throws(() => static_ics_file(null, data, 'all'), /ics file path not valid/);
    assert.throws(() => generate_ical(null, data, 'ical', 'all', false, true), /ics file path not valid/);
    resultChannel.open();
    try {
      assert.throws(() => generate_ical(null, data, 'ical'), /ics file path not valid/);
      assert.equal(resultChannel.close(), '');
    } finally {
      resultChannel.close();
    }
  }
});

test('ICAL-SEC-07: unsafe per-date files cannot bypass a safe root file', async () => {
  for (const icsFile of unsafeFiles) {
    const data = await config({ icsFile: 'https://example.com/root.ics', dates: [{ startDate: '2050-06-15', icsFile }] });
    assert.throws(() => static_ics_file(null, data, 0), /ics file path not valid/);
    assert.throws(() => generate_ical(null, data, 'apple', 0, false, true), /ics file path not valid/);
  }
});

test('ICAL-SEC-08: HTTPS files preserve query text, selection precedence and result output', async () => {
  const root = 'https://example.com/root.ics?a=1&b=two%20words';
  const selected = 'HTTPS://example.com/date.ics?x=1&y=2';
  const data = await config({ icsFile: root, dates: [{ startDate: '2050-06-15', icsFile: selected }] });
  assert.equal(static_ics_file(null, data, 'all'), root);
  assert.equal(static_ics_file(null, data, 0), selected);
  assert.equal(generate_ical(null, data, 'ical', 0, false, true).href, selected);
  resultChannel.open();
  try {
    generate_ical(null, data, 'ical');
    assert.equal(resultChannel.close(), root);
  } finally {
    resultChannel.close();
  }
  delete data.dates[0].icsFile;
  assert.equal(static_ics_file(null, data, 0), root);
});

test('ICAL-SEC-09: host overrides still bypass static files for dynamic generation', async () => {
  for (const [key, value] of [
    ['attendee', 'guest@example.com'],
    ['customVar', { text: 'value' }],
  ]) {
    const data = await config({ icsFile: 'https://example.com/event.ics' });
    data[key] = value;
    const host = { host: { getAttribute: (name) => (name === key ? 'override' : null) } };
    assert.equal(static_ics_file(host, data, 'all'), '');
    assert.equal(generate_ical(host, data, 'ical', 'all', false, true).kind, 'dynamic');
  }
});

test('ICAL-SEC-10: dynamic iOS content and proxy URLs retain their distinct output contracts', async () => {
  const literal = '<hjhj> literal\\n &lt;hjhj&gt;';
  const data = await config({ description: literal, fakeIOS: true });
  await validate(data);
  const dynamic = generate_ical(null, data, 'apple', 'all', false, true);
  assert.equal(dynamic.kind, 'dynamic');
  assert.equal(dynamic.href, 'data:text/calendar;charset=utf-8,' + encodeURIComponent(dynamic.content));
  assert.equal(parseIcs(dynamic.content).events.length, 1);
  assert.ok(dynamic.content.includes('literal\\\\n'));
  const proxy = await config({ proxy: true, proKey: 'example-key', icsFile: 'https://example.com/event.ics' });
  const action = generate_ical(null, proxy, 'ical', 'all', false, true);
  assert.equal(action.kind, 'proxy');
  assert.equal(action.href, 'https://caldn.net/example-key/o/ical');
});

test('ICAL-SEC-11: configured HTTPS URLs percent encode literal delimiters without escaping query syntax', async () => {
  const file = 'https://example.com/a<file>".ics?literal=<tag>&encoded=%3Ctag%3E';
  const expected = 'https://example.com/a%3Cfile%3E%22.ics?literal=%3Ctag%3E&encoded=%3Ctag%3E';
  for (const extra of [{ icsFile: file }, { dates: [{ startDate: '2050-06-15', icsFile: file }] }]) {
    const data = await config(extra);
    assert.equal(static_ics_file(null, data, 0), expected);
    assert.equal(generate_ical(null, data, 'ical', 0, false, true).href, expected);
    // The browser's URL parser agrees; no &amp; or doubled percent escapes.
    assert.equal(new URL(expected).href, new URL(file).href);
    assert.equal(new URL(expected).searchParams.get('literal'), '<tag>');
    assert.equal(new URL(expected).searchParams.get('encoded'), '<tag>');
  }
});
