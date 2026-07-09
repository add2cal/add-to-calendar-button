/**
 * Full Cartesian Suite - F.T6: Localization x output (plan §20)
 * Top-5 major languages + the 3 RTL languages; label correctness via atcb_translate_hook
 * as oracle, ICS content integrity per language.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { atcb_translate_hook, rtlLanguages } from '../../src/atcb-i18n.js';
import { LANGUAGES } from '../fixtures/matrix.js';

let n = 0;

describe('F.T6 - localization matrix', () => {
  for (const language of LANGUAGES) {
    it(`F.T6 | ${language} | button label`, async () => {
      const { shadow } = await mountAtcb({ name: 'L10n', startDate: '2050-06-15', options: "'Google'", language, identifier: `ft6-l-${n++}` });
      const label = shadow.querySelector('.atcb-text').textContent.trim();
      expect(label).to.equal(atcb_translate_hook('label.addtocalendar', { language }));
      if (rtlLanguages.includes(language)) {
        expect(shadow.querySelector('.atcb-rtl'), `rtl class for ${language}`).to.exist;
      }
    });

    it(`F.T6 | ${language} | ics content integrity`, async () => {
      const fs = interceptFileSave();
      try {
        const { host } = await mountAtcb({ name: `Content ${language} äöü 語`, startDate: '2050-06-15', options: "'iCal'", language, trigger: 'click', identifier: `ft6-i-${n++}` });
        await clickSingleton(host);
        const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
        expect(ics.events[0].value('SUMMARY')).to.include(`Content ${language}`);
        expect(ics.events[0].value('SUMMARY')).to.include('語');
      } finally {
        fs.restore();
      }
    });
  }
});
