/**
 * SSR shell render tests (case list: .ai/TEST-CASES.md, group S).
 *
 * Runs in plain Node WITHOUT any DOM emulation on purpose: the ssr entry must be
 * fully DOM-free. String assertions only. Run via `npm run test:ssr`
 * (which builds first - the tests consume dist/ssr like a real server would).
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('S-01: environment is DOM-free (no document, no window)', () => {
  assert.strictEqual(typeof document, 'undefined');
  assert.strictEqual(typeof window, 'undefined');
});

test('S-02: ESM and CJS entries expose the same generator', async () => {
  const esm = await import('../../dist/ssr/index.js');
  const cjs = require('../../dist/ssr/index.cjs');
  assert.strictEqual(typeof esm.atcb_generate_ssr_html, 'function');
  assert.strictEqual(typeof cjs.atcb_generate_ssr_html, 'function');
});

const { atcb_generate_ssr_html } = await import('../../dist/ssr/index.js');

test('S-03: default shell carries host attributes (official kebab names), DSD template, styles and the real label', () => {
  const html = atcb_generate_ssr_html({ name: 'Launch', startDate: '2050-06-15', language: 'de', identifier: 'ssr-s03', iCalFileName: 'invite', useUserTZ: true });
  assert.ok(html.startsWith('<add-to-calendar-button class="add-to-calendar atcb-light"'), 'host tag with light mode class');
  assert.ok(html.includes('<template shadowrootmode="open">'), 'declarative shadow DOM template');
  assert.ok(html.includes('start-date="2050-06-15"'), 'official kebab attribute name');
  assert.ok(html.includes('ical-file-name="invite"'), 'special official name for iCalFileName');
  assert.ok(html.includes('use-user-tz="true"'), 'special official name for useUserTZ');
  assert.ok(html.includes('Im Kalender speichern'), 'localized default label from the bundled packs');
  assert.ok(html.includes('lang="de"'), 'language on the wrapper');
  assert.ok(html.includes('id="atcb-btn-ssr-s03"'), 'button id from the identifier');
  assert.ok(html.includes(':host'), 'core css inlined');
  assert.ok(html.includes('data-atcb-ssr'), 'shell wrapper marked for hydration swap');
  assert.ok(html.includes('aria-expanded="false"'), 'trigger aria state');
});

test('S-04: buttonStyle selects exactly its delta; unknown styles fall back to default', () => {
  const threeD = atcb_generate_ssr_html({ name: 'X', buttonStyle: '3d' });
  assert.ok(threeD.includes('--btn-active-shadow-up'), '3d delta css present');
  const fallback = atcb_generate_ssr_html({ name: 'X', buttonStyle: 'not-a-style' });
  assert.ok(!fallback.includes('--btn-active-shadow-up'), 'no 3d delta for unknown style');
  assert.ok(fallback.includes('button-style="not-a-style"'), 'original attribute still emitted for the client');
});

test('S-05: size attribute maps to the font-size custom properties (same math as the client)', () => {
  const html = atcb_generate_ssr_html({ name: 'X', size: '8|6|4' });
  assert.ok(html.includes('--base-font-size-l:18px'), 'large size');
  assert.ok(html.includes('--base-font-size-m:16px'), 'medium size');
  assert.ok(html.includes('--base-font-size-s:14px'), 'small size');
  const defaults = atcb_generate_ssr_html({ name: 'X' });
  assert.ok(defaults.includes('--base-font-size-l:16px'), 'default size 16px');
});

test('S-06: date style renders skeleton spans instead of computed date parts', () => {
  const html = atcb_generate_ssr_html({ name: 'Launch Party', startDate: '2050-06-15', buttonStyle: 'date' });
  assert.ok(html.includes('atcb-date-btn-day'), 'date button structure');
  assert.ok(html.includes('atcb-ssr-skeleton'), 'skeleton spans for date parts');
  assert.ok(html.includes('Launch Party'), 'real headline from the name (derivable without decoration)');
  assert.ok(!html.includes('>15<'), 'no computed day number (no date math on the server)');
});

test('S-07: inline RSVP renders a full-width skeleton block', () => {
  const html = atcb_generate_ssr_html({ name: 'X', proKey: 'abc', rsvp: { demo: true }, inlineRsvp: true });
  assert.ok(html.includes('atcb-ssr-skeleton-block'), 'skeleton block');
  assert.ok(html.includes('width: 100%'), 'full-width wrapper for the inline form');
  assert.ok(html.includes('prokey="abc"'), 'official prokey attribute');
});

test('S-08: rtl languages mark the wrapper; hidden config keeps the shell hidden', () => {
  const rtl = atcb_generate_ssr_html({ name: 'X', language: 'he' });
  assert.ok(rtl.includes('atcb-rtl'), 'rtl class for hebrew');
  const hidden = atcb_generate_ssr_html({ name: 'X', hidden: true });
  assert.ok(hidden.includes('class="atcb-initialized atcb-hidden"'), 'hidden class on the wrapper');
  assert.ok(!hidden.includes('<button'), 'no button content when hidden');
});

test('S-09: attribute values and label text are escaped', () => {
  const html = atcb_generate_ssr_html({ name: 'a"b<c>', label: 'x<y & z' });
  assert.ok(html.includes('name="a&quot;b&lt;c&gt;"'), 'attribute escaping');
  assert.ok(html.includes('x&lt;y &amp; z'), 'text escaping');
  assert.ok(!html.includes('<y & z'), 'no raw injection');
});

test('S-10: unknown languages fall back to the english label', () => {
  const html = atcb_generate_ssr_html({ name: 'X', language: 'xx' });
  assert.ok(html.includes('Add to Calendar'), 'english fallback label');
});
