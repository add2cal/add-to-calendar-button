import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { parseIcs } from '../helpers/ics.js';

const bundled = await build({
  stdin: {
    contents:
      "export { decorate_data } from './src/core/decorate.ts'; export { validate } from './src/core/validate.ts'; export { generate_ical } from './src/generators/ical.ts'; export { secure_content } from './src/core/text.ts'; export { resultChannel } from './src/core/globals.ts'; export { generate_google } from './src/generators/google.ts'; export { generate_microsoft } from './src/generators/outlook.ts'; export { generate_yahoo } from './src/generators/yahoo.ts'; export { generate_msteams } from './src/generators/msteams.ts';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { decorate_data, validate, generate_ical, secure_content, resultChannel, generate_google, generate_microsoft, generate_yahoo, generate_msteams } = await import('data:text/javascript,' + encodeURIComponent(bundled.outputFiles[0].text));
const config = (extra) => decorate_data(secure_content({ name: 'Description regression', options: ['ical'], ...extra }));
const decodeText = (value) => value.replace(/\\([\\n,;])/gi, (_, char) => (/n/i.test(char) ? '\n' : char));

test('DESC-06: character references decode once as text across rich, plain and ICS outputs', async () => {
  const input = '&rarr; &#8594; &#x2192; &amp; &unknown; &amp;rarr; &lt;x&gt; &#91;b&#93;text&#91;/b&#93; \\n';
  const plain = '→ → → & &unknown; &rarr; <x> [b]text[/b] \\n';
  const html = '→ → → &amp; &amp;unknown; &amp;rarr; &lt;x&gt; [b]text[/b] \\n';
  const data = await config({ startDate: '2050-06-15', description: input });
  await validate(data);
  assert.equal(data.dates[0].description, html);
  assert.equal(data.dates[0].descriptionHtmlFree, plain);
  assert.equal(data.dates[0].descriptionHtmlFreeICal, plain);
  for (const [generate, key, expected] of [
    [generate_google, 'details', html],
    [generate_microsoft, 'body', html],
    [generate_yahoo, 'desc', plain],
    [generate_msteams, 'content', plain],
  ]) {
    resultChannel.open();
    try {
      generate(data, data.dates[0]);
      assert.equal(new URL(resultChannel.close()).searchParams.get(key), expected);
    } finally {
      resultChannel.close();
    }
  }
  const event = parseIcs(generate_ical(null, data, 'ical', 'all', false, true).content).events[0];
  assert.equal(decodeText(event.value('DESCRIPTION')), plain);
  assert.ok(decodeText(event.value('X-ALT-DESC')).includes(html));
  // Decoded controls still pass through the existing RFC 5545 serializer.
  const controls = await config({ dates: [{ startDate: '2050-06-15', description: '&rarr;&#13;&#10;END:VEVENT&#10;BEGIN:VEVENT&#10;SUMMARY:literal' }] });
  await validate(controls);
  const parsed = parseIcs(generate_ical(null, controls, 'ical', 'all', false, true).content);
  assert.equal(parsed.events.length, 1);
  assert.equal(decodeText(parsed.events[0].value('DESCRIPTION')), '→\nEND:VEVENT\nBEGIN:VEVENT\nSUMMARY:literal');
});

test('DESC-07: decoded text never becomes formatting, a link attribute or a line break', async () => {
  const data = await config({ startDate: '2050-06-15', description: '&lt;br&gt; &#123;b&#125;text&#123;/b&#125; [url]javascript&colon;dummy|&rarr; &lt;x&gt;[/url] [url]https://example.com/?a=1&amp;b=2|&amp;rarr;[/url]' });
  await validate(data);
  assert.equal(data.dates[0].description, '&lt;br&gt; {b}text{/b} <a href="javascript&amp;colon;dummy" target="_blank" rel="noopener">→ &lt;x&gt;</a> <a href="https://example.com/?a=1&amp;amp;b=2" target="_blank" rel="noopener">&amp;rarr;</a>');
  assert.ok(data.dates[0].descriptionHtmlFreeICal.startsWith('<br> {b}text{/b} '));
  for (const description of ['&lt;script&gt;dummy', '&#60;script&#62;dummy', '&lt;scr&#105;pt&gt;dummy']) {
    await assert.rejects(async () => config({ startDate: '2050-06-15', description }), /script/i);
  }
});

test('DESC-01: nested descriptions preserve literal text in plain, HTML and ICS output', async () => {
  const literal = '<hjhj> literal\\n &lt;hjhj&gt; &#60;hjhj&#62; &amp;';
  const plain = '<hjhj> literal\\n <hjhj> <hjhj> &';
  const data = await config({ dates: [{ startDate: '2050-06-15', description: literal + '[br][b]bold[/b]\r\nEND:VEVENT' }] });
  await validate(data);
  const entry = data.dates[0];
  assert.equal(entry.descriptionHtmlFreeICal, plain + '\nbold\r\nEND:VEVENT');
  assert.equal(entry.descriptionHtmlFree, plain + ' bold\r\nEND:VEVENT');
  assert.equal(entry.description, '&lt;hjhj&gt; literal\\n &lt;hjhj&gt; &lt;hjhj&gt; &amp;<br><b>bold</b><br>END:VEVENT');
  const parsed = parseIcs(generate_ical(null, data, 'ical', 'all', false, true).content);
  assert.equal(parsed.events.length, 1);
  assert.equal(decodeText(parsed.events[0].value('DESCRIPTION')), plain + '\nbold\nEND:VEVENT');
  assert.ok(decodeText(parsed.events[0].value('X-ALT-DESC')).includes(entry.description));
});

test('DESC-02: description variables are substituted before all output copies are encoded', async () => {
  const data = await config({ startDate: '2050-06-15', description: '%%text%%', customVar: { text: '<hjhj> literal\\n [b]bold[/b]' } });
  await validate(data);
  assert.equal(data.dates[0].description, '&lt;hjhj&gt; literal\\n <b>bold</b>');
  assert.equal(data.dates[0].descriptionHtmlFreeICal, '<hjhj> literal\\n bold');
});

test('DESC-03: description links encode literal labels and attributes exactly once', async () => {
  const data = await config({ startDate: '2050-06-15', description: '[url]https://example.com/?a=1&b=2|<hjhj> &lt;x&gt;[/url] {p}{/p}{strong}bold{/strong}' });
  await validate(data);
  assert.ok(data.dates[0].description.includes('href="https://example.com/?a=1&amp;b=2"'));
  assert.ok(data.dates[0].description.includes('&lt;hjhj&gt; &lt;x&gt;</a> <br><strong>bold</strong>'));
  assert.equal(data.dates[0].descriptionHtmlFreeICal, 'https://example.com/?a=1&b=2 \nbold');
});

test('DESC-04: every provider transports descriptions in its own text or HTML format', async () => {
  const literal = '<hjhj> literal\\n &lt;hjhj&gt;';
  const data = await config({ startDate: '2050-06-15', description: literal });
  await validate(data);
  for (const [generate, key, expected] of [
    [generate_google, 'details', data.dates[0].description],
    [generate_microsoft, 'body', data.dates[0].description],
    [generate_yahoo, 'desc', '<hjhj> literal\\n <hjhj>'],
    [generate_msteams, 'content', '<hjhj> literal\\n <hjhj>'],
  ]) {
    resultChannel.open();
    try {
      generate(data, data.dates[0]);
      const url = resultChannel.close();
      assert.equal(new URL(url).searchParams.get(key), expected);
    } finally {
      resultChannel.close();
    }
  }
});

test('DESC-05: custom variable replacement keeps dollar syntax literal and script rejection intact', async () => {
  const data = await config({ startDate: '2050-06-15', description: '%%text%%', customVar: { text: "$& $` $' <hjhj>" } });
  await validate(data);
  assert.equal(data.dates[0].descriptionHtmlFreeICal, "$& $` $' <hjhj>");
  const scripted = await decorate_data({ name: 'Description regression', startDate: '2050-06-15', options: ['ical'], description: '<scr%%suffix%%', customVar: { suffix: 'ipt>dummy' } });
  await assert.rejects(() => validate(scripted), /script/i);
});
