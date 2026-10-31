import { expect } from '@open-wc/testing';
import { resolve_style_source } from '../../src/core/style-source.ts';
import { ensure_style, atcbCssTemplate } from '../../src/styles/css-template.ts';
import { ensure_locale, i18nStrings } from '../../src/i18n/index.ts';

// Intercept only the network boundary; exercise the real style and locale loaders.
describe('Explicit jsDelivr asset sources', () => {
  it('pins the jsdelivr shortcut to the running package version', () => {
    expect(resolve_style_source('jsdelivr', '3.5.1')).to.equal('https://cdn.jsdelivr.net/npm/add-to-calendar-button@3.5.1/dist/styles/');
    expect(resolve_style_source('jsdelivr', '3.6.0-next.1')).to.equal('https://cdn.jsdelivr.net/npm/add-to-calendar-button@3.6.0-next.1/dist/styles/');
  });

  for (const version of ['', '@3', '@3.5.1', '@next']) {
    for (const path of ['', '/', '/dist', '/dist/', '/dist/styles', '/dist/styles/', '/dist/atcb.js', '/dist/atcb.min.js']) {
      it(`normalizes ${version || 'unversioned'}${path} without losing the requested version`, () => {
        const root = `https://cdn.jsdelivr.net/npm/add-to-calendar-button${version}`;
        expect(resolve_style_source(root + path, '3.5.1')).to.equal(root + '/dist/styles/');
        expect(resolve_style_source(root + path + '?cache=1#assets', '3.5.1')).to.equal(root + '/dist/styles/');
      });
    }
  }

  for (const source of [
    '/assets/styles',
    'https://example.com/styles/',
    'https://cdn.jsdelivr.net/npm/another-package',
    'https://cdn.jsdelivr.net/npm/add-to-calendar-button-other',
    'https://cdn.jsdelivr.net.evil.test/npm/add-to-calendar-button@3',
    'https://cdn.jsdelivr.net/npm/add-to-calendar-button@3/custom/styles',
  ]) {
    it(`preserves custom source ${source}`, () => {
      expect(resolve_style_source(source, '3.5.1')).to.equal(source.endsWith('/') ? source : source + '/');
    });
  }
  it('heals a package-root source for both styles and languages', async () => {
    const calls = [];
    const originalFetch = window.fetch;
    const core = atcbCssTemplate.core;
    const flat = atcbCssTemplate.flat;
    const de = i18nStrings.de;
    atcbCssTemplate.core = ':host{}';
    delete atcbCssTemplate.flat;
    delete i18nStrings.de;
    window.fetch = async (url) => {
      calls.push(String(url));
      return new Response(String(url).endsWith('.json') ? '{"label":{"addtocalendar":"Kalender"}}' : ':host{color:red}');
    };
    try {
      const data = { styleSource: 'https://cdn.jsdelivr.net/npm/add-to-calendar-button@3', buttonStyle: 'flat', language: 'de' };
      await ensure_style(data);
      await ensure_locale(data);
      expect(calls).to.deep.equal(['https://cdn.jsdelivr.net/npm/add-to-calendar-button@3/dist/styles/flat.css', 'https://cdn.jsdelivr.net/npm/add-to-calendar-button@3/dist/locales/de.json']);
    } finally {
      window.fetch = originalFetch;
      if (core === undefined) delete atcbCssTemplate.core;
      else atcbCssTemplate.core = core;
      if (flat === undefined) delete atcbCssTemplate.flat;
      else atcbCssTemplate.flat = flat;
      if (de === undefined) delete i18nStrings.de;
      else i18nStrings.de = de;
    }
  });
});
