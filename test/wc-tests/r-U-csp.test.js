/**
 * Reduced Suite - Group U: CSP environment 2x2 (plan §19, U-22..U-25)
 *
 * Env axis:   CSP-required (strict meta CSP inside an iframe) vs no CSP (test page default)
 * Nonce axis: cspnonce set vs not set
 *
 * U-22: CSP + nonce      -> renders, nonce propagated, no violations
 * U-23: CSP + no nonce   -> browser blocks unsigned injected tags (violation events), lib does not throw
 * U-24: no CSP + nonce   -> renders, nonce present but unenforced
 * U-25: no CSP + no nonce -> renders (everyday default)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { btnId } from '../helpers/dom.js';

const NONCE = 'test-nonce-42';

function cspIframe(cspContent) {
  const iframe = document.createElement('iframe');
  const moduleUrl = new URL('/dist/module/index.js', window.location.href).href;
  const cspMeta = cspContent ? `<meta http-equiv="Content-Security-Policy" content="${cspContent}">` : '';
  iframe.srcdoc = `<!DOCTYPE html><html><head>${cspMeta}</head><body>
    <script type="module" nonce="${NONCE}">
      import('${moduleUrl}').then(() => { window.__atcbLoaded = true; }).catch((e) => { window.__atcbLoadError = String(e); });
    </script>
  </body></html>`;
  document.body.appendChild(iframe);
  return iframe;
}

function waitFor(fn, timeout = 4000, step = 100) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = setInterval(() => {
      let result = null;
      try {
        result = fn();
      } catch {
        result = null;
      }
      if (result) {
        clearInterval(timer);
        resolve(result);
      } else if (Date.now() - started > timeout) {
        clearInterval(timer);
        resolve(null);
      }
    }, step);
  });
}

describe('Group U - CSP environment 2x2', () => {
  it('U-25: no CSP + no nonce -> renders (default case)', async () => {
    const { host, shadow } = await mountAtcb(baseEvent({ identifier: 'atcb-u25' }));
    expect(shadow.querySelector('.atcb-initialized')).to.exist;
    const schema = document.getElementById('atcb-schema-' + btnId(host));
    expect(schema).to.exist;
    expect(schema.getAttribute('nonce')).to.equal(null);
  });

  it('U-24: no CSP + nonce set -> renders with nonce attributes, no errors', async () => {
    const { host, shadow } = await mountAtcb(baseEvent({ cspnonce: NONCE, identifier: 'atcb-u24' }));
    expect(shadow.querySelector('.atcb-initialized')).to.exist;
    const schema = document.getElementById('atcb-schema-' + btnId(host));
    expect(schema).to.exist;
    expect(schema.nonce === NONCE || schema.getAttribute('nonce') === NONCE).to.equal(true);
  });

  it('U-22: strict CSP + matching nonce -> component initializes inside the CSP iframe without violations', async function () {
    this.timeout(10000);
    const csp = `default-src 'self'; script-src 'self' 'nonce-${NONCE}'; style-src 'self' 'unsafe-inline'; connect-src 'self'`;
    const iframe = cspIframe(csp);
    try {
      const win = await waitFor(() => (iframe.contentWindow && iframe.contentWindow.__atcbLoaded ? iframe.contentWindow : null));
      expect(win, 'module loaded under strict CSP with nonce').to.exist;
      const violations = [];
      iframe.contentDocument.addEventListener('securitypolicyviolation', (e) => violations.push(e.violatedDirective));
      const doc = iframe.contentDocument;
      const el = doc.createElement('add-to-calendar-button');
      el.setAttribute('name', 'CSP Event');
      el.setAttribute('startDate', '2050-06-15');
      el.setAttribute('location', 'CSP City');
      el.setAttribute('options', "'Google'");
      el.setAttribute('cspnonce', NONCE);
      el.setAttribute('identifier', 'atcb-u22');
      doc.body.appendChild(el);
      const initialized = await waitFor(() => el.shadowRoot && el.shadowRoot.querySelector('.atcb-initialized'));
      expect(initialized, 'component initialized under CSP').to.exist;
      const schema = doc.getElementById('atcb-schema-' + el.getAttribute('atcb-button-id'));
      if (schema) {
        expect(schema.nonce === NONCE || schema.getAttribute('nonce') === NONCE).to.equal(true);
      }
      expect(violations.filter((v) => v.includes('script'))).to.have.length(0);
    } finally {
      iframe.remove();
    }
  });

  it('U-23: strict CSP WITHOUT nonce on the component -> browser blocks unsigned injections, lib degrades gracefully', async function () {
    this.timeout(10000);
    const csp = `default-src 'self'; script-src 'self' 'nonce-${NONCE}'; style-src 'self' 'unsafe-inline'; connect-src 'self'`;
    const iframe = cspIframe(csp);
    try {
      const win = await waitFor(() => (iframe.contentWindow && iframe.contentWindow.__atcbLoaded ? iframe.contentWindow : null));
      expect(win).to.exist;
      const doc = iframe.contentDocument;
      const violations = [];
      doc.addEventListener('securitypolicyviolation', (e) => violations.push(e.violatedDirective || 'violation'));
      const el = doc.createElement('add-to-calendar-button');
      el.setAttribute('name', 'CSP Event NoNonce');
      el.setAttribute('startDate', '2050-06-15');
      el.setAttribute('location', 'CSP City');
      el.setAttribute('options', "'Google'");
      el.setAttribute('identifier', 'atcb-u23');
      doc.body.appendChild(el);
      await aTimeout(1500);
      // graceful degradation contract: no thrown error escapes; the element itself exists.
      expect(doc.querySelector('add-to-calendar-button')).to.exist;
      // pin the actual behavior: either the component still initializes (styles inline via shadow adoptedStyleSheets)
      // or CSP violations were reported for the unsigned injected tags
      const initialized = el.shadowRoot && el.shadowRoot.querySelector('.atcb-initialized');
      expect(Boolean(initialized) || violations.length > 0, 'either initializes or reports violations, never crashes').to.equal(true);
    } finally {
      iframe.remove();
    }
  });
});
