/**
 * Reduced Suite - Group P: Subscribe mode (case list: .ai/TEST-CASES.md)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { clickSingleton, openList, renderedOptions, modalHost, initFailed } from '../helpers/dom.js';

const SUB = {
  name: 'Subscribe Cal',
  subscribe: 'true',
  icsFile: 'https://example.com/team-calendar.ics',
  trigger: 'click',
};

describe('Group P - Subscribe mode', () => {
  it('P-01: Apple subscribe converts to webcal:// on desktop', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...SUB, options: "'apple'", identifier: 'atcb-p01' });
      await clickSingleton(host);
      expect(wo.calls.length).to.equal(1);
      expect(wo.calls[0].url).to.equal('webcal://example.com/team-calendar.ics');
    } finally {
      wo.restore();
    }
  });

  it('P-02: Google subscribe uses the cid= subscription URL (not the render URL)', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...SUB, options: "'google'", identifier: 'atcb-p02' });
      await clickSingleton(host);
      const url = wo.calls[0].url;
      expect(url.startsWith('https://calendar.google.com/calendar/u/0/r?cid=')).to.equal(true);
      expect(url).to.include(encodeURIComponent('webcal://example.com/team-calendar.ics'));
      expect(url).to.not.include('eventedit');
    } finally {
      wo.restore();
    }
  });

  it('P-02b: MS365 subscribe uses addfromweb with url + name', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...SUB, options: "'ms365'", identifier: 'atcb-p02b' });
      await clickSingleton(host);
      const url = new URL(wo.calls[0].url);
      expect(url.origin + url.pathname).to.equal('https://outlook.office.com/calendar/0/addfromweb/');
      expect(url.searchParams.get('url')).to.equal('webcal://example.com/team-calendar.ics');
      expect(url.searchParams.get('name')).to.equal('Subscribe Cal');
    } finally {
      wo.restore();
    }
  });

  it('P-03: Yahoo is filtered out in subscribe mode', async () => {
    const { host } = await mountAtcb({ ...SUB, options: "['yahoo','google','apple']", identifier: 'atcb-p03' });
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('yahoo');
    expect(opts).to.have.members(['apple', 'google']);
  });

  it('P-03b: Yahoo-only subscribe falls back to iCal without opening a workaround modal', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...SUB, options: "['yahoo']", identifier: 'atcb-p03b' });
      await clickSingleton(host);
      expect(wo.calls).to.deep.equal([{ url: 'webcal://example.com/team-calendar.ics', target: '_blank' }]);
      expect(modalHost(host), 'no Yahoo workaround modal').to.not.exist;
    } finally {
      wo.restore();
    }
  });

  it('P-04: Teams is filtered out in subscribe mode', async () => {
    const { host } = await mountAtcb({ ...SUB, options: "['google','msteams','apple','ms365']", identifier: 'atcb-p04' });
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('msteams');
    expect(opts).to.include('ms365');
  });

  it('P-04b: mobile subscribe additionally drops ms365 + outlookcom', async () => {
    const { host } = await mountAtcb({ ...SUB, fakeMobile: 'true', options: "['google','ms365','outlookcom','ical']", identifier: 'atcb-p04b' });
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('ms365');
    expect(opts).to.not.include('outlookcom');
    expect(opts).to.include('google');
  });

  it('P-05: subscribe + multi-date does not render (validation error)', async () => {
    const { host } = await mountAtcb({
      ...SUB,
      options: "'google'",
      dates: JSON.stringify([
        { name: 'a', startDate: '2050-01-01' },
        { name: 'b', startDate: '2050-01-02' },
      ]),
      identifier: 'atcb-p05',
    });
    await aTimeout(200);
    // failed-init shadow roots crash headless-shell on querySelector - use the attribute contract
    expect(initFailed(host)).to.equal(true);
  });
});
