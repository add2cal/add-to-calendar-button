import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

// Expose private ingestion functions only in this inert Node test bundle.
const source = await readFile('src/element/index.ts', 'utf8');
const bundled = await build({
  stdin: { contents: source + '\nexport { read_attributes, process_inline_data };', resolveDir: process.cwd() + '/src/element', loader: 'ts' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { read_attributes, process_inline_data } = await import('data:text/javascript,' + encodeURIComponent(bundled.outputFiles[0].text));
const providers = await build({
  stdin: { contents: "export { decorate_data } from './src/core/decorate.ts'; export { validate } from './src/core/validate.ts'; export { generate_google } from './src/generators/google.ts'; export { resultChannel } from './src/core/globals.ts';", resolveDir: process.cwd() },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { decorate_data, validate, generate_google, resultChannel } = await import('data:text/javascript,' + encodeURIComponent(providers.outputFiles[0].text));
const host = (attrs = {}, textContent = '') => ({ hasAttribute: (key) => Object.hasOwn(attrs, key), getAttribute: (key) => attrs[key] ?? null, textContent, innerHTML: textContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') });
const literal = '<hjhj> literal\\n &lt;hjhj&gt; &#60;hjhj&#62; &amp;';

test('DESC-IN-05: attribute script rejection is not hidden by the inline JSON fallback', async () => {
  for (const description of ['\\n<fhsdjf><script>', '\\n&lt;script&gt;']) {
    await assert.rejects(() => process_inline_data(host({ name: 'Description regression', 'start-date': '2050-06-15', description })), /script tags are not allowed/i);
  }
  await assert.rejects(() => process_inline_data(host({ name: 'Description regression' })), /required setting missing/i);
});

test('DESC-IN-06: inline JSON still works with presentation attributes and empty input stays diagnostic', async () => {
  const input = { name: 'Description regression', startDate: '2050-06-15', description: '&rarr; literal\\n' };
  assert.deepEqual(await process_inline_data(host({ debug: '' }, JSON.stringify(input))), input);
  await assert.rejects(() => process_inline_data(host()), /No data provided/);
});

test('DESC-IN-01: description and structured attributes preserve literal text and JSON escapes', () => {
  const input = read_attributes(host({ description: literal, dates: JSON.stringify([{ description: literal + '\r\nEND:VEVENT' }]), 'custom-var': JSON.stringify({ value: literal }), name: '<b>Title</b>' }));
  assert.equal(input.description, literal);
  assert.equal(input.dates[0].description, literal + '\r\nEND:VEVENT');
  assert.equal(input.customVar.value, literal);
  assert.equal(input.name, 'Title');
});

test('DESC-IN-02: inline JSON is parsed before field cleanup without deleting literal escapes', async () => {
  const input = { name: 'Description regression', startDate: '2050-06-15', description: literal, dates: [{ startDate: '2050-06-15', description: literal }], customVar: { value: literal } };
  assert.deepEqual(await process_inline_data(host({}, JSON.stringify(input, null, 2))), input);
});

test('DESC-IN-03: SSR attributes round-trip literal descriptions through client ingestion', async () => {
  const { atcb_generate_ssr_html } = await import('../../dist/ssr/index.js');
  const html = atcb_generate_ssr_html({ name: 'Description regression', description: literal, dates: [{ startDate: '2050-06-15', description: literal }] });
  assert.ok(!html.includes('<hjhj>'));
  // Simulate only HTML attribute entity decoding, not a DOM or executable markup.
  const decode = (text) => text.replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[entity]);
  const attrs = Object.fromEntries([...html.slice(0, html.indexOf('>')).matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]));
  const input = read_attributes(host(attrs));
  assert.equal(input.description, literal);
  assert.equal(input.dates[0].description, literal);
});

test('DESC-IN-04: playground description attribute reaches Google details as literal HTML text', async () => {
  for (const description of ['\\n<fhsdjf>', '\\n&lt;fhsdjf&gt;']) {
    const data = await decorate_data(read_attributes(host({ name: 'Description regression', 'start-date': '2050-06-15', options: 'Google', description })));
    await validate(data);
    resultChannel.open();
    try {
      generate_google(data, data.dates[0]);
      const details = new URL(resultChannel.close()).searchParams.get('details');
      assert.equal(details, '\\n&lt;fhsdjf&gt;');
      assert.equal(
        details.replace(/&(amp|lt|gt);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>' })[entity]),
        '\\n<fhsdjf>',
      );
    } finally {
      resultChannel.close();
    }
  }
});
