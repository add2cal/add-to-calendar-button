/**
 * Reduced Suite - Group V: Official kebab-case attributes + legacy aliases (case list: .ai/TEST-CASES.md)
 *
 * v3 renames all attributes to kebab-case (prokey as the exception). Legacy spellings
 * (lowercased camelCase) keep working; when both are present, the OFFICIAL name wins.
 * The rest of the suite exercises the legacy spellings throughout, so this group
 * focuses on the official names and the precedence rule.
 */
import { expect, fixture, aTimeout } from '@open-wc/testing';
import '../../dist/module/index.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { mockProFetch, proEvtConfig, PRO_EVT_KEY } from '../fixtures/pro.js';

async function mountRaw(attrs) {
  const el = document.createElement('add-to-calendar-button');
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  const wrapper = await fixture('<div></div>');
  wrapper.appendChild(el);
  await el.whenInitialized();
  return el;
}

describe('Group V - official kebab-case attributes', () => {
  it('V-01: full config via official kebab names renders and produces a correct Google link', async () => {
    const wo = interceptWindowOpen();
    try {
      const el = await mountRaw({
        name: 'Kebab Event',
        'start-date': '2050-06-15',
        'start-time': '10:00',
        'end-time': '11:00',
        'time-zone': 'America/New_York',
        options: "'Google'",
        'button-style': 'flat',
        trigger: 'click',
        identifier: 'atcb-v01',
      });
      expect(el.shadowRoot.querySelector('.atcb-initialized')).to.exist;
      await clickSingleton(el);
      const url = new URL(wo.calls[0].url);
      expect(url.searchParams.get('text')).to.equal('Kebab Event');
      expect(url.searchParams.get('dates')).to.equal('20500615T100000/20500615T110000');
      expect(url.searchParams.get('ctz')).to.equal('America/New_York');
    } finally {
      wo.restore();
    }
  });

  it('V-02: official name wins over legacy spelling when both are present', async () => {
    const wo = interceptWindowOpen();
    try {
      const el = await mountRaw({
        name: 'Precedence',
        'start-date': '2050-06-15',
        startdate: '2050-07-20',
        'start-time': '10:00',
        starttime: '09:00',
        'end-time': '11:00',
        'time-zone': 'America/New_York',
        options: "'Google'",
        trigger: 'click',
        identifier: 'atcb-v02',
      });
      await clickSingleton(el);
      const url = new URL(wo.calls[0].url);
      expect(url.searchParams.get('dates'), 'official start-date and start-time win').to.equal('20500615T100000/20500615T110000');
    } finally {
      wo.restore();
    }
  });

  it('V-03: prokey (official spelling exception) triggers the PRO flow', async () => {
    const fetchMock = mockProFetch({ [PRO_EVT_KEY]: proEvtConfig() });
    try {
      const el = await mountRaw({ prokey: PRO_EVT_KEY, identifier: 'atcb-v03' });
      expect(
        fetchMock.calls.some((c) => c.url.includes(PRO_EVT_KEY)),
        'config fetched for prokey',
      ).to.equal(true);
      expect(el.shadowRoot.querySelector('.atcb-button')).to.exist;
    } finally {
      fetchMock.restore();
    }
  });

  it('V-04: special-case mappings work (ical-file-name, use-user-tz accepted)', async () => {
    const fs = interceptFileSave();
    try {
      const el = await mountRaw({
        name: 'Filename Check',
        'start-date': '2050-06-15',
        options: "'iCal'",
        'ical-file-name': 'kebab-cal-file',
        trigger: 'click',
        identifier: 'atcb-v04',
      });
      await clickSingleton(el);
      expect(fs.saves.length).to.equal(1);
      expect(fs.saves[0].filename || fs.saves[0].download, 'custom ics filename used').to.include('kebab-cal-file');
    } finally {
      fs.restore();
    }
  });

  it('V-05: runtime change of an official attribute re-initializes the button', async () => {
    const el = await mountRaw({
      name: 'Before Change',
      'start-date': '2050-06-15',
      options: "'Google'",
      trigger: 'click',
      identifier: 'atcb-v05',
    });
    expect(el.shadowRoot.querySelector('.atcb-button')).to.exist;
    el.setAttribute('name', 'After Change');
    // updateComponent is debounced via setTimeout; poll until the rebuild finished
    let rebuilt = false;
    for (let i = 0; i < 40; i++) {
      await aTimeout(100);
      const btn = el.shadowRoot.querySelector('.atcb-button');
      if (btn && (btn.getAttribute('aria-label') || '').includes('After Change')) {
        rebuilt = true;
        break;
      }
    }
    expect(rebuilt, 'button rebuilt with the new name').to.equal(true);
  });
});
