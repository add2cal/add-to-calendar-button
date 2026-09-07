/**
 * Reduced Suite - Group W: Style registry + on-demand style loading (case list: .ai/TEST-CASES.md)
 *
 * v3 inlines only core + the default style; other styles resolve through the registry:
 * pre-registered (npm style modules) or fetched relative to the script origin
 * ({base}/styles/{name}.css), overridable via style-source. load-all-styles prefetches
 * every delta for runtime switching. The f-T5b matrix exercises the fetch path for all
 * styles structurally; this group pins the registry mechanics.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { cssStyles, atcb_register_style } from '../../dist/module/index.js';
import { mountAtcb, baseEvent } from '../helpers/mount.js';

function shadowStyleText(host) {
  return Array.from(host.shadowRoot.querySelectorAll('style'))
    .map((s) => s.textContent || '')
    .join('\n');
}

async function waitFor(fn, timeout = 4000, step = 50) {
  const started = Date.now();
  for (;;) {
    const result = fn();
    if (result) return result;
    if (Date.now() - started > timeout) return null;
    await aTimeout(step);
  }
}

describe('Group W - style registry', () => {
  it('W-01: core + default are inline; default style renders without any style fetch', async () => {
    const fetchCalls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, init) => {
      fetchCalls.push(String(url));
      return originalFetch.call(window, url, init);
    };
    try {
      expect(cssStyles['core'], 'core inlined').to.be.a('string').and.not.equal('');
      expect(cssStyles['default'], 'default delta inlined').to.be.a('string').and.not.equal('');
      const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-w01' }));
      expect(shadowStyleText(host)).to.include(':host');
      expect(fetchCalls.filter((u) => u.includes('/styles/')).length, 'no style fetch for the default style').to.equal(0);
    } finally {
      window.fetch = originalFetch;
    }
  });

  it('W-02: non-default style is fetched from the script origin and applied', async () => {
    const { host } = await mountAtcb(baseEvent({ buttonStyle: '3d', identifier: 'atcb-w02' }));
    // the 3d delta declares --btn-active-shadow-up (3d-only custom property)
    const css = await waitFor(() => {
      const text = shadowStyleText(host);
      return text.includes('--btn-active-shadow-up') ? text : null;
    });
    expect(css, '3d delta fetched and injected').to.not.equal(null);
    expect(cssStyles['3d'], '3d delta cached in the registry').to.be.a('string');
  });

  it('W-03: a pre-registered style is used without fetching', async () => {
    const fetchCalls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, init) => {
      fetchCalls.push(String(url));
      return originalFetch.call(window, url, init);
    };
    try {
      atcb_register_style('round', ':host{--w03-registry-marker:1;}');
      const { host } = await mountAtcb(baseEvent({ buttonStyle: 'round', identifier: 'atcb-w03' }));
      const css = await waitFor(() => (shadowStyleText(host).includes('--w03-registry-marker') ? shadowStyleText(host) : null));
      expect(css, 'registered css used').to.not.equal(null);
      expect(fetchCalls.filter((u) => u.includes('/styles/round.css')).length, 'no fetch for registered style').to.equal(0);
    } finally {
      window.fetch = originalFetch;
      delete cssStyles['round'];
    }
  });

  it('W-04: style-source attribute overrides the fetch base', async () => {
    const { host } = await mountAtcb(baseEvent({ buttonStyle: 'flat', 'style-source': '/dist/styles/', identifier: 'atcb-w04' }));
    // the flat delta declares --list-close-text-hover (flat-only custom property)
    const css = await waitFor(() => (shadowStyleText(host).includes('--list-close-text-hover') ? shadowStyleText(host) : null));
    expect(css, 'flat delta loaded via style-source base').to.not.equal(null);
  });

  it('W-05: load-all-styles prefetches every delta into the registry', async () => {
    await mountAtcb(baseEvent({ 'load-all-styles': 'true', identifier: 'atcb-w05' }));
    const allLoaded = await waitFor(() => ['simple', '3d', 'flat', 'neumorphism', 'text', 'date'].every((s) => typeof cssStyles[`${s}`] === 'string'), 8000);
    expect(allLoaded, 'all style deltas registered after load-all-styles').to.equal(true);
  });
});
