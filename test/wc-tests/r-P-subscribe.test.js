/**
 * Reduced Suite - Group P: Subscribe mode (plan §15)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { clickSingleton, openList, renderedOptions, clickOption } from '../helpers/dom.js';

const SUB = {
  name: 'Subscribe Cal',
  subscribe: 'true',
  icsFile: 'https://example.com/team-calendar.ics',
  trigger: 'click',
};

describe('Group P - Subscribe mode', () => {
  it('P-01: Apple subscribe converts to webcal:// (desktop)', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...SUB, options: "'Apple'", identifier: 'atcb-p01' });
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
      const { host } = await mountAtcb({ ...SUB, options: "'Google'", identifier: 'atcb-p02' });
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
      const { host } = await mountAtcb({ ...SUB, options: "'Microsoft365'", identifier: 'atcb-p02b' });
      await clickSingleton(host);
      const url = new URL(wo.calls[0].url);
      expect(url.origin + url.pathname).to.equal('https://outlook.office.com/calendar/0/addfromweb/');
      expect(url.searchParams.get('url')).to.equal('webcal://example.com/team-calendar.ics');
      expect(url.searchParams.get('name')).to.equal('Subscribe Cal');
    } finally {
      wo.restore();
    }
  });

  it('P-03: Yahoo subscribe opens the manual-instructions modal instead of a URL', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...SUB, options: "['Yahoo','Google']", identifier: 'atcb-p03' });
      await openList(host);
      await clickOption(host, 'yahoo');
      await aTimeout(150);
      expect(wo.calls.length, 'no direct yahoo url').to.equal(0);
      const modal = document.getElementById('atcb-p03-modal-host');
      expect(modal, 'manual instructions modal').to.exist;
      expect(modal.shadowRoot.querySelector('.atcb-modal-box')).to.exist;
    } finally {
      wo.restore();
    }
  });

  it('P-04: Teams is filtered out in subscribe mode', async () => {
    const { host } = await mountAtcb({ ...SUB, options: "['Google','MicrosoftTeams','Apple','Microsoft365']", identifier: 'atcb-p04' });
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('msteams');
    expect(opts).to.include('ms365');
  });

  it('P-04b: mobile subscribe additionally drops ms365 + outlookcom', async () => {
    const { host } = await mountAtcb({ ...SUB, fakeMobile: 'true', options: "['Google','Microsoft365','Outlook.com','iCal']", identifier: 'atcb-p04b' });
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('ms365');
    expect(opts).to.not.include('outlookcom');
    expect(opts).to.include('google');
  });

  it('P-05: subscribe + multi-date does not render (validation error)', async () => {
    const { host } = await mountAtcb({
      ...SUB,
      options: "'Google'",
      dates: JSON.stringify([
        { name: 'a', startDate: '2050-01-01' },
        { name: 'b', startDate: '2050-01-02' },
      ]),
      identifier: 'atcb-p05',
    });
    await aTimeout(100);
    expect(host.shadowRoot.querySelector('.atcb-initialized')).to.not.exist;
  });
});
