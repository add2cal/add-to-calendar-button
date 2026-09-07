/**
 * Reduced Suite - Group SEC: Security hardening (case list: .ai/TEST-CASES.md)
 *
 * Pins the input-hardening layer: url scheme allowlisting, description [url]
 * linkification escaping, prototype-pollution-safe json boundaries, and
 * structurally valid rich-data output for hostile field content.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { secure_url, rewrite_html_elements, secure_content } from '../../src/core/text.ts';
import { mountAtcb } from '../helpers/mount.js';
import { translate_hook } from '../../src/i18n/index.ts';
import { clipboard_note_content } from '../../src/generators/ical.ts';
import { create_modal } from '../../src/ui/generate.ts';
import { mockProFetch, proRsvpConfig, PRO_RSVP_KEY, PRO_EVT_KEY } from '../fixtures/pro.js';
import { stubClipboardFailure, muteConsole } from '../helpers/capture.js';
import { atcb_generate_ty } from '../../dist/module/index.js';
import { btnId, modalHost, openList } from '../helpers/dom.js';

describe('Group SEC - security hardening', () => {
  it('SEC-01: secure_url allows the legitimate scheme set and relative urls', () => {
    for (const url of [
      'https://example.com/x',
      'http://example.com',
      'webcal://example.com/feed.ics',
      'webcals://example.com/feed.ics',
      'mailto:x@example.com',
      'intent://calendar.google.com/x#Intent;scheme=https;end',
      'data:text/calendar;charset=utf-8,BEGIN',
      '/relative/path.css',
      'styles/flat.css',
      '',
    ]) {
      expect(secure_url(url, false), url).to.equal(true);
    }
  });

  it('SEC-02: secure_url blocks script-capable and unexpected schemes', () => {
    for (const url of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', ' javascript:alert(1)', 'java\tscript:alert(1)', 'vbscript:x', 'data:text/html,<script>1</script>', 'file:///etc/passwd', 'blob:https://example.com/x']) {
      expect(secure_url(url, false), JSON.stringify(url)).to.equal(false);
    }
    // the path traversal check stays intact
    expect(secure_url('https://example.com/../../x', false), 'traversal').to.equal(false);
  });

  it('SEC-03: description [url] linkifies only safe schemes and escapes attribute breakouts', () => {
    const safe = rewrite_html_elements('[url]https://example.com/x|Details[/url]');
    expect(safe).to.include('<a href="https://example.com/x"');
    expect(safe).to.include('>Details</a>');
    const js = rewrite_html_elements('[url]javascript:alert(1)|Click[/url]');
    expect(js, 'no anchor for script urls').to.not.include('<a ');
    expect(js, 'label survives as plain text').to.include('Click');
    const breakout = rewrite_html_elements('[url]https://example.com/x" onmouseover="evil()|Nice[/url]');
    expect(breakout, 'quotes cannot terminate the attribute').to.not.include('" onmouseover="');
    expect(breakout).to.include('&quot;');
  });

  it('SEC-03b: empty pseudo paragraphs become line breaks in HTML and plain calendar text', () => {
    const content = 'Before[p][/p]After';
    expect(rewrite_html_elements(content)).to.equal('Before<br>After');
    expect(rewrite_html_elements(content, true)).to.equal('Before After');
    expect(rewrite_html_elements(content, true, true)).to.equal('Before\\nAfter');
  });

  it('SEC-04: parsed json input cannot pollute the object prototype', async () => {
    const hostile = secure_content(JSON.parse('{"name":"X","customLabels":{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}},"label.addtocalendar":"Fine"}}'));
    expect({}.polluted, 'no pollution via __proto__').to.equal(undefined);
    expect({}.polluted2, 'no pollution via constructor.prototype').to.equal(undefined);
    expect(hostile.customLabels['label.addtocalendar'], 'legitimate keys survive').to.equal('Fine');
    expect(Object.prototype.hasOwnProperty.call(hostile.customLabels, '__proto__'), 'unsafe key dropped').to.equal(false);
    // end-to-end through the attribute parser
    const { host } = await mountAtcb({
      name: 'SEC04',
      startDate: '2050-06-15',
      identifier: 'atcb-sec04',
      customLabels: '{"__proto__":{"polluted3":"yes"},"label.addtocalendar":"SEC04 Label"}',
    });
    expect({}.polluted3, 'no pollution via attribute json').to.equal(undefined);
    const btn = host.shadowRoot.getElementById('atcb-btn-atcb-sec04');
    expect(btn.getAttribute('aria-label'), 'legitimate label applied').to.include('SEC04 Label');
  });

  it('SEC-05: rich data stays valid json when fields contain quotes and backslashes', async () => {
    const { host } = await mountAtcb({
      name: 'Quote "Fest" \\ Gala',
      startDate: '2050-06-15',
      location: 'Hall "B" \\ West',
      description: 'With [url]https://example.com[/url] and "quotes"',
      identifier: 'atcb-sec05',
    });
    // the schema script is inserted at the beginning of <body> so crawlers read it early
    const schemaEl = document.getElementById('atcb-schema-' + btnId(host));
    try {
      expect(schemaEl, 'rich data rendered').to.exist;
      const parsed = JSON.parse(schemaEl.textContent);
      expect(parsed['@type']).to.equal('Event');
      expect(parsed.name).to.include('Quote "Fest"');
      expect(parsed.location).to.include('Hall "B"');
    } finally {
      schemaEl?.remove();
    }
  });

  it('SEC-06: RSVP labels cannot break out of aria-label attributes', async () => {
    const label = 'Choice " data-injected="yes';
    const keys = ['form.status.confirmed', 'form.status.undecided', 'form.status.declined', 'form.amount', 'form.email'];
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig({ rsvp: { initial_confirmation: false, maybe_option: true, maxpp: 2, fields: [] } }) });
    try {
      const { shadow } = await mountAtcb({ prokey: PRO_RSVP_KEY, inlineRsvp: true, customLabels: Object.fromEntries(keys.map((key) => [key, label])) });
      const inputs = shadow.querySelectorAll('input[aria-label]');
      expect(inputs.length).to.equal(5);
      for (const input of inputs) expect(input.getAttribute('aria-label')).to.equal(label);
      expect(shadow.querySelector('[data-injected]')).to.not.exist;
    } finally {
      mock.restore();
    }
  });

  it('SEC-07: custom modal labels keep safe formatting without raw HTML attributes', () => {
    for (const key of ['label.rsvp.expired', 'label.rsvp.bookedout', 'modal.webview.ical.text', 'modal.webview.ical.steps', 'modal.opensafari.ical.text', 'modal.opensafari.ical.steps', 'modal.clipboard.text', 'modal.clipboard.failed']) {
      const container = document.createElement('div');
      container.innerHTML = translate_hook(key, { customLabels: { [key]: '<br onclick="evil()">[b]Bold[/b]<br>Tom &amp; Sue [url]https://example.com|Details[/url]' } });
      expect(container.querySelector('[onclick]')).to.not.exist;
      expect(container.querySelector('b').textContent).to.equal('Bold');
      expect(container.querySelectorAll('br').length).to.equal(1);
      expect(container.querySelector('a').href).to.equal('https://example.com/');
      expect(container.textContent).to.include('Tom & Sue');
    }
  });

  it('SEC-08: manual clipboard fallback preserves hostile values without attribute injection', async () => {
    const clipboard = stubClipboardFailure();
    const quiet = muteConsole();
    try {
      const value = 'https://example.com/?x="<>&';
      const label = 'Copy " data-injected="yes';
      const container = document.createElement('div');
      container.innerHTML = await clipboard_note_content(value, { customLabels: { 'label.share.copy': label } });
      const input = container.querySelector('input');
      expect(input.value).to.equal(value);
      expect(input.getAttribute('aria-label')).to.equal(label);
      expect(container.querySelector('[data-injected]')).to.not.exist;
    } finally {
      clipboard.restore();
      quiet.restore();
    }
  });

  it('SEC-09: headline-free modal handles long malformed markup promptly', async () => {
    const { host, shadow } = await mountAtcb({ name: 'SEC09', startDate: '2050-06-15' });
    const identifier = btnId(host);
    const started = performance.now();
    try {
      await create_modal(shadow, { identifier, sizes: {}, hideBranding: true }, '', undefined, '<'.repeat(100000));
      expect(performance.now() - started).to.be.lessThan(2000);
      const dialog = document.getElementById(identifier + '-modal-host').shadowRoot.querySelector('[aria-modal="true"]');
      expect(dialog.getAttribute('aria-label')).to.equal('<'.repeat(100));
    } finally {
      host.remove();
    }
  });

  it('SEC-10: RSVP inline and modal forms contain hostile field data without injection', async () => {
    const hostile = 'Value " data-injected="yes';
    const markup = '<br data-injected="yes">[b]Safe[/b]<br>Tom &amp; Sue';
    const fields = [
      { type: 'text', name: hostile, label: markup, placeholder: hostile, default: hostile },
      { type: 'hidden', name: 'hidden', default: hostile },
      { type: 'checkbox', name: 'check', label: markup, default: true },
      { type: 'radio', name: hostile + '-radio', label: markup, placeholder: hostile, default: true },
      { type: 'label', label: markup },
      { type: 'text" data-injected="yes', name: 'type', default: hostile },
    ];
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig({ rsvp: { headline: markup, text: markup, fields } }) });
    try {
      for (const inlineRsvp of [true, false]) {
        const { host, shadow } = await mountAtcb({ prokey: PRO_RSVP_KEY, inlineRsvp });
        try {
          if (!inlineRsvp) {
            await openList(host);
            await aTimeout(200);
          }
          const root = inlineRsvp ? shadow : modalHost(host).shadowRoot;
          expect(root.querySelector('form')).to.exist;
          expect(root.querySelector('[data-injected]')).to.not.exist;
          const text = root.querySelector('input[type="text"]');
          expect(text.name).to.equal(hostile);
          expect(text.value).to.equal(hostile);
          expect(text.placeholder).to.equal(hostile);
          expect(root.querySelector('input[name="hidden"]').value).to.equal(hostile);
          expect(root.querySelector('input[type="checkbox"]').checked).to.equal(true);
          expect(root.querySelector('input[type="radio"]').value).to.equal(hostile);
          expect(root.querySelector('input[type="radio"]').checked).to.equal(true);
          expect(root.querySelector('.pro-intro b').textContent).to.equal('Safe');
          expect(root.querySelector('.pro-intro').textContent).to.include('Tom & Sue');
          // Empty required email keeps this entirely in client validation; quoted
          // radio names must still resolve without throwing a selector error.
          root.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          expect(root.querySelector('#submit-error').textContent).to.not.equal('');
        } finally {
          host.remove();
        }
      }
    } finally {
      mock.restore();
    }
  });

  it('SEC-11: public thank-you API escapes link attributes and retains safe intro formatting', async () => {
    const { host } = await mountAtcb({ name: 'SEC11', startDate: '2050-06-15', identifier: 'sec11' });
    const url = 'https://example.com/?x=" data-injected="yes&y=2';
    try {
      await atcb_generate_ty(host, { proKey: PRO_EVT_KEY, name: 'SEC11', startDate: '2050-06-15', identifier: btnId(host), ty: { type: 'link', url, button_label: '<br data-injected="yes">Continue', text: '<br data-injected="yes">[b]Safe[/b]<br>' } });
      const root = modalHost(host).shadowRoot;
      expect(root.querySelector('[data-injected]')).to.not.exist;
      expect(root.querySelector('.pro-pt a').getAttribute('href')).to.equal(url);
      expect(root.querySelector('.pro-intro b').textContent).to.equal('Safe');
      expect(root.querySelectorAll('.pro-intro br').length).to.equal(1);
    } finally {
      host.remove();
    }
  });

  it('SEC-12: public thank-you form preserves quoted values and safe labels', async () => {
    const { host } = await mountAtcb({ name: 'SEC12', startDate: '2050-06-15', identifier: 'sec12' });
    const value = 'Value " data-injected="yes';
    try {
      await atcb_generate_ty(host, {
        proKey: PRO_EVT_KEY,
        name: 'SEC12',
        startDate: '2050-06-15',
        identifier: btnId(host),
        ty: {
          type: 'form',
          url: 'https://example.com/submit',
          button_label: '<br data-injected="yes">Send',
          fields: [
            { type: 'text', name: value, label: '<br data-injected="yes">Name', default: value, placeholder: value },
            { type: 'hidden', name: 'hidden', default: value },
          ],
        },
      });
      const root = modalHost(host).shadowRoot;
      expect(root.querySelector('form')).to.exist;
      expect(root.querySelector('[data-injected]')).to.not.exist;
      const input = root.querySelector('input[type="text"]');
      expect(input.name).to.equal(value);
      expect(input.value).to.equal(value);
      expect(input.placeholder).to.equal(value);
      expect(root.querySelector('input[type="hidden"]').value).to.equal(value);
    } finally {
      host.remove();
    }
  });

  it('SEC-13: thank-you links reject non-HTTP schemes and traversal', async () => {
    for (const url of ['javascript:alert(1)', 'httpjavascript:alert(1)', 'https://example.com/../private']) {
      const { host } = await mountAtcb({ name: 'SEC13', startDate: '2050-06-15', identifier: 'sec13' });
      try {
        await atcb_generate_ty(host, { proKey: PRO_EVT_KEY, name: 'SEC13', startDate: '2050-06-15', identifier: btnId(host), ty: { type: 'link', url, text: 'Safe fallback' } });
        const root = modalHost(host).shadowRoot;
        expect(root.querySelector('#ty-content a')).to.not.exist;
        expect(root.querySelector('.pro-intro').textContent).to.equal('Safe fallback');
      } finally {
        host.remove();
      }
    }
  });
});
