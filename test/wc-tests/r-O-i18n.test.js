/**
 * Reduced Suite - Group O: Localization & i18n (case list: .ai/TEST-CASES.md)
 * Uses atcb_translate_hook as the source of truth to avoid hardcoding translations.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { openList, pressEsc, optionEl } from '../helpers/dom.js';
import { atcb_translate_hook, rtlLanguages } from '../../src/atcb-i18n.js';
import { interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';

function expectedLabel(language) {
  return atcb_translate_hook('label.addtocalendar', { language });
}

describe('Group O - Localization & i18n', () => {
  it('O-01: language=de renders the German default label', async () => {
    const { shadow } = await mountAtcb(baseEvent({ language: 'de', identifier: 'atcb-o01' }));
    expect(shadow.querySelector('.atcb-text').textContent.trim()).to.equal(expectedLabel('de'));
    expect(expectedLabel('de')).to.not.equal(expectedLabel('en'));
  });

  it('O-02: language=fr renders the French default label', async () => {
    const { shadow } = await mountAtcb(baseEvent({ language: 'fr', identifier: 'atcb-o02' }));
    expect(shadow.querySelector('.atcb-text').textContent.trim()).to.equal(expectedLabel('fr'));
  });

  it('O-03: unknown language falls back to English silently', async () => {
    const { shadow } = await mountAtcb(baseEvent({ language: 'zz', identifier: 'atcb-o03' }));
    expect(shadow.querySelector('.atcb-text').textContent.trim()).to.equal(expectedLabel('en'));
  });

  it('O-04: RTL language applies the atcb-rtl class', async () => {
    expect(rtlLanguages).to.include('ar');
    const { host, shadow } = await mountAtcb(baseEvent({ language: 'ar', trigger: 'click', identifier: 'atcb-o04' }));
    expect(shadow.querySelector('.atcb-rtl')).to.exist;
    await openList(host);
    expect(shadow.querySelector('.atcb-list.atcb-rtl')).to.exist;
    await pressEsc();
  });

  it('O-05/O-06: customLabels override specific keys; others stay language defaults', async () => {
    const { host, shadow } = await mountAtcb(
      baseEvent({
        language: 'de',
        customLabels: '{"label.addtocalendar": "Termin sichern!"}',
        trigger: 'click',
        identifier: 'atcb-o05',
      }),
    );
    expect(shadow.querySelector('.atcb-text').textContent.trim()).to.equal('Termin sichern!');
    await openList(host);
    const googleItem = optionEl(host, 'google');
    expect(googleItem.textContent).to.include(atcb_translate_hook('google', { language: 'de' }));
  });

  it('O-08: ICS SUMMARY stays the configured name regardless of UI language', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ name: 'Language Agnostic Content', startDate: '2050-06-15', language: 'de', options: "'iCal'", trigger: 'click', identifier: 'atcb-o08' });
      await clickSingleton(host);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.events[0].value('SUMMARY')).to.include('Language Agnostic Content');
    } finally {
      fs.restore();
    }
  });
});
