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
  assert.strictEqual(typeof esm.atcb_generate_ssr_html_async, 'function');
  assert.strictEqual(typeof cjs.atcb_generate_ssr_html_async, 'function');
});

const { atcb_generate_ssr_html } = await import('../../dist/ssr/index.js');
const { atcb_generate_ssr_html_async } = await import('../../dist/ssr/index.js');

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
  const html = atcb_generate_ssr_html({ name: 'X', prokey: 'abc', rsvp: { demo: true }, inlineRsvp: true });
  assert.ok(html.includes('atcb-ssr-skeleton-block'), 'skeleton block');
  assert.ok(html.includes('width: 100%'), 'full-width wrapper for the inline form');
  assert.ok(html.includes('prokey="abc"'), 'official prokey attribute');
});

test('S-07b: non-inline RSVP renders the localized RSVP button', () => {
  const html = atcb_generate_ssr_html({ name: 'X', rsvp: { demo: true }, language: 'de', identifier: 'rsvp-shell' });
  assert.ok(html.includes('class="atcb-icon atcb-icon-rsvp"'), 'RSVP icon');
  assert.ok(html.includes('>RSVP</span>'), 'localized RSVP label');
  assert.ok(!html.includes('class="atcb-icon atcb-icon-trigger"'), 'no rendered calendar trigger icon');
});

test('S-07c: async renderer fetches PRO data and renders its RSVP button', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.strictEqual(url, 'https://event.caldn.net/pro-rsvp/config.json');
    return new Response(JSON.stringify({ name: 'Fetched event', rsvp: { demo: true }, language: 'en' }), { status: 200 });
  });
  const html = await atcb_generate_ssr_html_async({ prokey: 'pro-rsvp' });
  assert.ok(html.includes('class="atcb-icon atcb-icon-rsvp"'), 'fetched RSVP config determines shell');
  assert.ok(html.includes('prokey="pro-rsvp"'), 'PRO key remains on the host');
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

test('S-11: kebab-case config keys are normalized like the tag attributes', () => {
  const html = atcb_generate_ssr_html({ name: 'Launch', 'start-date': '2050-06-15', 'button-style': 'round', 'light-mode': 'dark', 'ical-file-name': 'invite', 'use-user-tz': true });
  assert.ok(html.includes('button-style="round"'), 'kebab input re-serialized as official attribute');
  assert.ok(html.includes('ical-file-name="invite"'), 'special kebab name normalized');
  assert.ok(html.includes('use-user-tz="true"'), 'special kebab name normalized 2');
  assert.ok(html.includes('atcb-dark'), 'light-mode honored for the host class');
  // the style delta is embedded in the shell styles; a wrong (default) style would
  // miss the round delta marker class rule
  assert.ok(!html.includes('NaNpx'), 'sizes still decorated');
});

test('S-12: buttonsList renders one singleton button per option with per-option icons and skeleton labels', () => {
  const html = atcb_generate_ssr_html({ name: 'X', options: ['apple', 'google', 'ical'], buttonsList: true, identifier: 'bl1' });
  assert.ok(html.includes('atcb-buttons-list'), 'flex list class on the root');
  assert.ok(html.includes('class="atcb-icon atcb-icon-apple"'), 'per-option icon (apple)');
  assert.ok(html.includes('class="atcb-icon atcb-icon-google"'), 'per-option icon (google)');
  assert.ok(html.includes('part="atcb-list-text"'), 'label slot per singleton');
  assert.ok(html.includes('atcb-ssr-skeleton'), 'labels render as skeletons (decoration needs the client)');
  assert.ok(html.includes('id="atcb-btn-bl1-google"'), 'singleton id rule (identifier-option)');
  assert.ok(!html.includes('<div class="atcb-dropdown-anchor">'), 'no dropdown anchor on singletons');
  assert.strictEqual((html.match(/atcb-button atcb-single/g) || []).length, 3, 'exactly 3 singleton buttons');
});

test('S-13: buttonsList honors option label overrides, kebab input, and the date-style exclusion', () => {
  const override = atcb_generate_ssr_html({ name: 'X', options: "['apple|Mein Kalender','google']", 'buttons-list': true });
  assert.ok(override.includes('>Mein Kalender</span>'), 'label override via pipe syntax paints real text');
  const date = atcb_generate_ssr_html({ name: 'X', options: ['apple', 'google'], buttonsList: true, buttonStyle: 'date' });
  assert.ok(!date.includes('class="atcb-initialized atcb-buttons-list"'), 'date style never splits (client rule)');
  assert.ok(!date.includes('atcb-button atcb-single'), 'date style renders no singletons');
});

test('S-14: hide-icon-button and hide-icon-list drop the respective icons', () => {
  // (assert on markup, not on the embedded css, which also mentions the classes)
  const noBtnIcon = atcb_generate_ssr_html({ name: 'X', 'hide-icon-button': true });
  assert.ok(!noBtnIcon.includes('class="atcb-icon atcb-icon-trigger"'), 'no trigger icon with hide-icon-button');
  const noListIcon = atcb_generate_ssr_html({ name: 'X', options: ['apple', 'google'], buttonsList: true, hideIconList: true });
  assert.ok(!noListIcon.includes('class="atcb-icon atcb-icon-apple"') && !noListIcon.includes('class="atcb-icon atcb-icon-google"'), 'no option icons with hide-icon-list');
  assert.ok(noListIcon.includes('part="atcb-list-text"'), 'label slots still rendered');
});

test('S-15: bare boolean attributes (empty string, like frameworks serialize them) count as true', () => {
  const html = atcb_generate_ssr_html({ name: 'X', options: ['apple', 'google'], 'buttons-list': '', 'hide-icon-list': '' });
  assert.ok(html.includes('atcb-buttons-list'), 'empty-string buttons-list activates the split');
  assert.ok(!html.includes('class="atcb-icon atcb-icon-apple"'), 'empty-string hide-icon-list drops the icons');
  const noIcon = atcb_generate_ssr_html({ name: 'X', 'hide-icon-button': '' });
  assert.ok(!noIcon.includes('class="atcb-icon atcb-icon-trigger"'), 'empty-string hide-icon-button drops the trigger icon');
});

test('S-16: quoted comma-separated options strings parse like the client attribute parser', () => {
  const html = atcb_generate_ssr_html({ name: 'X', options: "'apple','google','ical'", buttonsList: true });
  assert.strictEqual((html.match(/atcb-button atcb-single/g) || []).length, 3, 'quoted csv yields 3 singletons');
  const mixed = atcb_generate_ssr_html({ name: 'X', options: "'Apple', 'Outlook.com'", buttonsList: true });
  assert.ok(mixed.includes('atcb-icon-apple') && mixed.includes('atcb-icon-outlookcom'), 'legacy spellings normalize');
});

test('S-17: custom-css, style-light and style-dark reach the shell', () => {
  const html = atcb_generate_ssr_html({
    name: 'X',
    'button-style': 'custom',
    'custom-css': 'https://example.com/atcb.css',
    'style-light': '--btn-background: #2f4377; --btn-text: #fff;',
    'style-dark': '--btn-background: #000;',
  });
  assert.ok(html.includes('<link rel="stylesheet" type="text/css" href="https://example.com/atcb.css">'), 'external css link in the shell');
  assert.ok(html.includes(':host{--btn-background: #2f4377; --btn-text: #fff;}'), 'styleLight override block');
  assert.ok(html.includes(':host(.atcb-dark){--btn-background: #000;}'), 'styleDark override block');
  // (the custom style falls back to the default shell css: a style-less shell would
  // flash unstyled before the external file arrives - the client shows a placeholder)
  const evil = atcb_generate_ssr_html({ name: 'X', 'custom-css': 'javascript:alert(1)' });
  assert.ok(!evil.includes('<link'), 'scheme allowlist blocks hostile css urls');
  const stripped = atcb_generate_ssr_html({ name: 'X', styleLight: '--x: 1; }</style><script>alert(1)</script>' });
  assert.ok(!stripped.includes('<script'), 'style override content is html-stripped');
});

test('S-18: non-splitted button with hideTextLabelButton drops the text span and adds the atcb-no-text class', () => {
  const html = atcb_generate_ssr_html({ name: 'X', options: ['apple', 'google'], hideTextLabelButton: true, identifier: 's18' });
  // the button carries the atcb-no-text class (mirrors the client template)
  assert.ok(html.includes('atcb-button atcb-no-text"'), 'atcb-no-text class on the button');
  // no text span is rendered (the client omits it when hideTextLabelButton is set)
  assert.ok(!html.includes('part="atcb-button-text"'), 'no text span with hideTextLabelButton');
  // the chevron div is also dropped (client rule: chevron needs the text label).
  // match the rendered div, not the css class definition (which always exists).
  assert.ok(!html.includes('class="atcb-chevron"'), 'no chevron div with hideTextLabelButton');
  // the trigger icon stays
  assert.ok(html.includes('class="atcb-icon atcb-icon-trigger"'), 'trigger icon still rendered');
});

test('S-19: buttonsList sorts options alphabetically to match the client decorate-options sort', () => {
  // provide options in a non-alphabetical order; the client sorts them in
  // decorate-options, so the shell must paint in the same order to avoid a
  // visual reorder on hydration
  const html = atcb_generate_ssr_html({ name: 'X', options: ['yahoo', 'apple', 'google'], buttonsList: true, identifier: 's19' });
  // the singleton ids follow the painted order; assert on those (the css also
  // contains icon class definitions that would confuse a naive indexOf)
  const idApple = html.indexOf('atcb-btn-s19-apple');
  const idGoogle = html.indexOf('atcb-btn-s19-google');
  const idYahoo = html.indexOf('atcb-btn-s19-yahoo');
  assert.ok(idApple > -1 && idGoogle > -1 && idYahoo > -1, 'all three singleton ids present');
  assert.ok(idApple < idGoogle && idGoogle < idYahoo, 'singleton ids in alphabetical order (apple, google, yahoo)');
});
