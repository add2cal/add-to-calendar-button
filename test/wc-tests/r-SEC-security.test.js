/**
 * Reduced Suite - Group SEC: Security hardening (case list: .ai/TEST-CASES.md)
 *
 * Pins the input-hardening layer: url scheme allowlisting, description [url]
 * linkification escaping, prototype-pollution-safe json boundaries, and
 * structurally valid rich-data output for hostile field content.
 */
import { expect } from '@open-wc/testing';
import { secure_url, rewrite_html_elements, secure_content } from '../../src/core/text.ts';
import { mountAtcb } from '../helpers/mount.js';
import { btnId } from '../helpers/dom.js';

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
});
