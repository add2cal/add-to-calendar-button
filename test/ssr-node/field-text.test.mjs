import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Exercise the internal serializer without a browser or a new public API.
const bundled = await build({ entryPoints: ['src/core/text.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
const { rewrite_ical_text, secure_content, secure_url } = await import('data:text/javascript,' + encodeURIComponent(bundled.outputFiles[0].text));

test('FIELD-01: iCalendar TEXT escapes every real newline', () => {
  for (const newline of ['\r\n', '\r', '\n']) {
    assert.equal(rewrite_ical_text('Before' + newline + 'After'), 'Before\\nAfter');
  }
  assert.equal(rewrite_ical_text('Before\\nAfter'), 'Before\\\\nAfter');
  assert.equal(rewrite_ical_text('a;b,c\\d'), 'a\\;b\\,c\\\\d');
});

test('FIELD-02: iCalendar parameters use quoted RFC 6868 encoding', () => {
  assert.equal(rewrite_ical_text('A;ROLE=CHAIR:Other\r\nB"^', true), '"A;ROLE=CHAIR:Other^nB^\'^^"');
});

test('FIELD-03: script tags are rejected in nested field values', () => {
  for (const value of ['<script>dummy</script>', '<ScRiPt src="https://example.com/dummy.js">', '&lt;script&gt;dummy', '&#60;script&#62;dummy', '&#x3c;script&#x3e;dummy', '&amp;lt;script&amp;gt;dummy', '{"label.addtocalendar":"\\u003cscr\\u0069pt>dummy"}']) {
    assert.throws(() => secure_content({ dates: [{ description: value }] }), /script/i);
    assert.throws(() => secure_content(value, false), /script/i);
  }

  assert.deepEqual(secure_content({ name: 'JavaScript workshop', description: '[b]Safe[/b]<br>Text' }), { name: 'JavaScript workshop', description: '[b]Safe[/b]<br>Text' });
});

test('FIELD-04: URI fields cannot carry literal newlines', () => {
  for (const newline of ['\r\n', '\r', '\n']) {
    assert.equal(secure_url('https://example.com/' + newline + 'X-FIELD:Injected', false), false);
  }
  assert.equal(secure_url('https://example.com/?q=%0A', false), true);
});

test('FIELD-05: cleanup preserves literal descriptions and variables without changing other fields', () => {
  const description = '<hjhj> literal\\n &lt;hjhj&gt; &#60;hjhj&#62; &amp;';
  const data = { name: '<b>Title</b>', description, dates: [{ description }], customVar: { text: description } };
  assert.deepEqual(secure_content(data), { ...data, name: 'Title' });
  assert.equal(data.name, '<b>Title</b>');
  assert.equal(Object.hasOwn(secure_content(JSON.parse('{"description":"<hjhj>","__proto__":{"polluted":true}}')), '__proto__'), false);
});
