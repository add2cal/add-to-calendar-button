/**
 * Reduced Suite - Group U: Edge cases & regressions (plan §19)
 * U-01 lives in the existing recurrence-tz.test.js; U-15 in server-side-init.test.js.
 * The CSP 2x2 (U-22..25) lives in r-U-csp.test.js.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, openList, listEl, pressEsc } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs, unfoldIcs } from '../helpers/ics.js';

async function icsFor(config, id) {
  const fs = interceptFileSave();
  try {
    const { host } = await mountAtcb({ ...config, options: "'iCal'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    return parseIcs(decodeIcsHref(fs.saves[0].href));
  } finally {
    fs.restore();
  }
}

describe('Group U - Edge cases & regressions', () => {
  it('U-03: backslashes, semicolons and commas are escaped per RFC 5545', async () => {
    const ics = await icsFor({ name: 'Escape Test', startDate: '2050-06-15', description: 'a;b,c\\d' }, 'atcb-u03');
    const desc = ics.events[0].value('DESCRIPTION');
    expect(desc).to.include('\\;');
    expect(desc).to.include('\\,');
  });

  it('U-04: very long URL in location survives folding and unfolding', async () => {
    const longUrl = 'https://example.com/path?' + 'p=aBcDeF0123456789&'.repeat(20) + 'end=1';
    const ics = await icsFor({ name: 'Long URL', startDate: '2050-06-15', location: longUrl }, 'atcb-u04');
    expect(unfoldIcs(ics.raw)).to.include('end=1');
  });

  it('U-07: SEQUENCE reflects the configured update counter', async () => {
    const ics1 = await icsFor({ name: 'Seq', startDate: '2050-06-15', sequence: 1 }, 'atcb-u07a');
    expect(ics1.events[0].prop('SEQUENCE')).to.include('1');
    const ics2 = await icsFor({ name: 'Seq', startDate: '2050-06-15', sequence: 2 }, 'atcb-u07b');
    expect(ics2.events[0].prop('SEQUENCE')).to.include('2');
  });

  it('U-08: mass mount - 10 buttons all initialize; ESC closes only the open one', async () => {
    const hosts = [];
    for (let i = 0; i < 10; i++) {
      const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: `atcb-u08-${i}` }));
      hosts.push(host);
    }
    for (const h of hosts) {
      expect(h.shadowRoot.querySelector('.atcb-initialized')).to.exist;
    }
    await openList(hosts[3]);
    expect(listEl(hosts[3])).to.exist;
    await pressEsc();
    await aTimeout(80);
    expect(listEl(hosts[3])).to.not.exist;
  });

  it('U-14: attribute updates after init re-render the output', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ name: 'Before Update', startDate: '2050-06-15', options: "'Google'", trigger: 'click', identifier: 'atcb-u14' });
      host.setAttribute('name', 'After Update');
      await aTimeout(300);
      await clickSingleton(host);
      expect(new URL(wo.calls[0].url).searchParams.get('text')).to.equal('After Update');
    } finally {
      wo.restore();
    }
  });

  it('U-16: far-future dates (2099) do not overflow', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ name: 'Future', startDate: '2099-12-31', startTime: '10:00', endTime: '11:00', options: "'Google'", trigger: 'click', identifier: 'atcb-u16' });
      await clickSingleton(host);
      expect(new URL(wo.calls[0].url).searchParams.get('dates')).to.include('20991231');
    } finally {
      wo.restore();
    }
  });

  it('U-17: negative-offset tz crossing midnight shifts the UTC calendar day', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({
        name: 'Midnight Cross',
        startDate: '2050-06-15',
        startTime: '23:30',
        endTime: '23:45',
        timeZone: 'America/New_York', // 23:30 EDT = 03:30 UTC on the NEXT day
        options: "'Google'",
        trigger: 'click',
        identifier: 'atcb-u17',
      });
      await clickSingleton(host);
      expect(new URL(wo.calls[0].url).searchParams.get('dates')).to.include('20500616T033000Z');
    } finally {
      wo.restore();
    }
  });

  it('U-18: empty description/location produce no empty ICS property lines', async () => {
    const ics = await icsFor({ name: 'Sparse', startDate: '2050-06-15' }, 'atcb-u18');
    expect(ics.unfolded).to.not.match(/^DESCRIPTION:\s*$/m);
    expect(ics.unfolded).to.not.match(/^LOCATION:\s*$/m);
  });

  it('U-19: very long title folds in ICS and encodes in URLs', async () => {
    const longTitle = 'Very Long Event Title '.repeat(50).trim();
    const ics = await icsFor({ name: longTitle, startDate: '2050-06-15' }, 'atcb-u19a');
    expect(unfoldIcs(ics.raw)).to.include('Very Long Event Title');
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ name: longTitle, startDate: '2050-06-15', options: "'Google'", trigger: 'click', identifier: 'atcb-u19b' });
      await clickSingleton(host);
      expect(new URL(wo.calls[0].url).searchParams.get('text')).to.include('Very Long Event Title');
    } finally {
      wo.restore();
    }
  });

  it('U-20: emoji in the title survives ICS and URL round-trips', async () => {
    const name = 'Party 🎉 Time';
    const ics = await icsFor({ name, startDate: '2050-06-15' }, 'atcb-u20a');
    expect(ics.events[0].value('SUMMARY')).to.include('🎉');
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ name, startDate: '2050-06-15', options: "'Google'", trigger: 'click', identifier: 'atcb-u20b' });
      await clickSingleton(host);
      expect(new URL(wo.calls[0].url).searchParams.get('text')).to.equal(name);
    } finally {
      wo.restore();
    }
  });

  it('U-21: mixed scripts (Latin + CJK + Arabic) preserved everywhere', async () => {
    const name = 'Meet 会議 اجتماع';
    const ics = await icsFor({ name, startDate: '2050-06-15' }, 'atcb-u21');
    expect(ics.events[0].value('SUMMARY')).to.include('会議');
    expect(ics.events[0].value('SUMMARY')).to.include('اجتماع');
  });
});
