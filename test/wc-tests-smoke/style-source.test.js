import { expect } from '@open-wc/testing';
import { atcb_action, cssStyles } from '../../dist/module/index.js';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { version } from '../../package.json';

describe('jsDelivr source public APIs', () => {
  for (const customTrigger of [false, true]) {
    it(`loads styles and languages through ${customTrigger ? 'atcb_action' : 'the element'}`, async () => {
      const originalFetch = window.fetch;
      const calls = [];
      const style = customTrigger ? 'round' : 'flat';
      const language = customTrigger ? 'fr' : 'de';
      delete cssStyles[`${style}`];
      window.fetch = async (url) => {
        calls.push(String(url));
        return new Response(String(url).endsWith('.json') ? '{"label":{"addtocalendar":"Test label"}}' : ':host{--source-test:1;}');
      };
      let host;
      try {
        if (customTrigger) {
          await atcb_action({ name: 'Source test', startDate: '2050-06-15', options: ['Google', 'Apple'], buttonStyle: style, language, styleSource: 'jsdelivr', identifier: 'source-action' });
          host = document.querySelector('[id^="atcb-customTrigger-"]');
        } else {
          ({ host } = await mountAtcb(baseEvent({ buttonStyle: style, language, 'style-source': 'jsdelivr', identifier: 'source-element' })));
        }
        const base = `https://cdn.jsdelivr.net/npm/add-to-calendar-button@${version}/dist/`;
        expect(calls).to.include(base + `styles/${style}.css`);
        expect(calls).to.include(base + `locales/${language}.json`);
        expect(host.shadowRoot.textContent).to.include('--source-test');
      } finally {
        window.fetch = originalFetch;
        host?.remove();
        delete cssStyles[`${style}`];
      }
    });
  }
});
