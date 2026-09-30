import { expect } from '@open-wc/testing';
import { atcb_generate_ssr_html } from '../../dist/ssr/index.js';

function shadowStyleText(host) {
  return Array.from(host.shadowRoot.querySelectorAll('style'))
    .map((style) => style.textContent || '')
    .join('\n');
}

describe('Group Z - static asset import order', () => {
  it('Z-08: SSR host hydrates with registered round style and German locale when assets are imported first', async () => {
    const container = document.createElement('div');
    const fetchCalls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, init) => {
      fetchCalls.push(String(url));
      return originalFetch.call(window, url, init);
    };
    try {
      container.setHTMLUnsafe(atcb_generate_ssr_html({ name: 'Z08 Event', startDate: '2050-06-15', buttonStyle: 'round', language: 'de', identifier: 'atcb-z08' }));
      document.body.appendChild(container);
      const host = container.querySelector('add-to-calendar-button');
      await import('../fixtures/import-order/assets-first.js');
      await host.whenInitialized();
      expect(host.shadowRoot.querySelector('[data-atcb-ssr]'), 'SSR shell swapped only after hydrated render').to.equal(null);
      expect(shadowStyleText(host), 'registered round delta is injected').to.include('--btn-border-radius:500px');
      expect(host.shadowRoot.getElementById('atcb-btn-atcb-z08').getAttribute('aria-label'), 'registered German locale is rendered').to.include('Im Kalender speichern');
      expect(
        fetchCalls.some((url) => url.includes('/styles/round.css')),
        'no fallback style request',
      ).to.equal(false);
      expect(
        fetchCalls.some((url) => url.includes('/locales/de.json')),
        'no fallback locale request',
      ).to.equal(false);
    } finally {
      window.fetch = originalFetch;
      container.remove();
    }
  });
});
