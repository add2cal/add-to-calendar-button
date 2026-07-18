/**
 * Reduced Suite - Group X: Locale loading + full-locale handling (case list: .ai/TEST-CASES.md)
 *
 * v3 bundles English only; other languages load on demand from
 * {scriptOrigin}/locales/{lang}.json or register via atcb_register_locale.
 * The language attribute accepts full locales (en_US / en-GB): translations
 * resolve regional pack first, then base, then English; date FORMATTING uses
 * the full locale (attribute region wins, else the browser region).
 */
import { expect } from '@open-wc/testing';
import { i18nStrings, atcb_register_locale, atcb_generate_timestring } from '../../dist/module/index.js';
import { atcb_translate_hook } from '../helpers/i18n.js';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { btnId } from '../helpers/dom.js';

function triggerAria(host) {
  const btn = host.shadowRoot.getElementById(btnId(host));
  return btn ? btn.getAttribute('aria-label') || '' : '';
}

describe('Group X - locale loading', () => {
  it('X-01: non-english language fetches its pack once; label matches the oracle; cache prevents refetch', async () => {
    const fetchCalls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, init) => {
      fetchCalls.push(String(url));
      return originalFetch.call(window, url, init);
    };
    try {
      const { host } = await mountAtcb(baseEvent({ language: 'de', identifier: 'atcb-x01a' }));
      const expected = atcb_translate_hook('label.addtocalendar', { language: 'de' });
      expect(triggerAria(host), 'german label rendered').to.include(expected);
      expect(i18nStrings['de'], 'de pack cached in the dist registry').to.be.an('object');
      const firstCount = fetchCalls.filter((u) => u.includes('/locales/de.json')).length;
      expect(firstCount, 'de pack fetched exactly once').to.equal(1);
      await mountAtcb(baseEvent({ language: 'de', identifier: 'atcb-x01b' }));
      expect(fetchCalls.filter((u) => u.includes('/locales/de.json')).length, 'no refetch on second mount').to.equal(firstCount);
    } finally {
      window.fetch = originalFetch;
    }
  });

  it('X-02: a pre-registered locale is used without fetching', async () => {
    const fetchCalls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, init) => {
      fetchCalls.push(String(url));
      return originalFetch.call(window, url, init);
    };
    try {
      atcb_register_locale('fr', { 'label.addtocalendar': 'X02 marker label' });
      const { host } = await mountAtcb(baseEvent({ language: 'fr', identifier: 'atcb-x02' }));
      expect(triggerAria(host)).to.include('X02 marker label');
      expect(fetchCalls.filter((u) => u.includes('/locales/fr.json')).length, 'no fetch for registered locale').to.equal(0);
    } finally {
      window.fetch = originalFetch;
      delete i18nStrings['fr'];
    }
  });

  it('X-03: regional pack wins for its exact locale; missing regional falls back to base english', async () => {
    atcb_register_locale('en_GB', { 'label.addtocalendar': 'Add to calendar (GB)' });
    try {
      const { host } = await mountAtcb(baseEvent({ language: 'en_GB', identifier: 'atcb-x03a' }));
      expect(triggerAria(host), 'registered regional pack used').to.include('Add to calendar (GB)');
      const { host: host2 } = await mountAtcb(baseEvent({ language: 'en_US', identifier: 'atcb-x03b' }));
      const expectedEn = atcb_translate_hook('label.addtocalendar', { language: 'en' });
      expect(triggerAria(host2), 'en_US without a pack falls back to en').to.include(expectedEn);
    } finally {
      delete i18nStrings['en_GB'];
    }
  });

  it('X-04: date formatting respects the full locale (en-US vs en-GB ordering differs)', async () => {
    const dates = [{ name: 'Fmt', startDate: '2050-06-15', startTime: '10:00', endTime: '11:00', timeZone: 'America/New_York' }];
    const us = atcb_generate_timestring(dates, 'en-US', 'all', true).join(' ');
    const gb = atcb_generate_timestring(dates, 'en-GB', 'all', true).join(' ');
    expect(us, 'locale-dependent formatting differs').to.not.equal(gb);
  });

  it('X-05: unknown language falls back to english without any locale fetch', async () => {
    const fetchCalls = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, init) => {
      fetchCalls.push(String(url));
      return originalFetch.call(window, url, init);
    };
    try {
      const { host } = await mountAtcb(baseEvent({ language: 'xx', identifier: 'atcb-x05' }));
      const expectedEn = atcb_translate_hook('label.addtocalendar', { language: 'en' });
      expect(triggerAria(host)).to.include(expectedEn);
      expect(fetchCalls.filter((u) => u.includes('/locales/')).length, 'no fetch attempt for unknown language').to.equal(0);
    } finally {
      window.fetch = originalFetch;
    }
  });
});
