/**
 * Reduced Suite - Group N: dataLayer / tracking (plan §13)
 * Push shape: { eventCategory, eventAction, eventLabel, event } +
 * 'atcb-last-event' attribute mirror = `${event}:${trigger}` on the host element.
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { openList, clickOption, clickSingleton, pressEsc } from '../helpers/dom.js';
import { resetDataLayer, removeDataLayer, dlEvents } from '../helpers/datalayer.js';

describe('Group N - dataLayer / tracking', () => {
  beforeEach(() => resetDataLayer());

  it('N-01: initialization is pushed once with category/action and mirrors to atcb-last-event', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-n01' }));
    const init = dlEvents('initialization');
    expect(init.length).to.equal(1);
    expect(init[0].eventCategory).to.equal('Add-to-Calendar-Button');
    expect(init[0].eventAction).to.equal('Initialized');
    expect(init[0].eventLabel).to.equal('atcb-n01');
    expect(host.getAttribute('atcb-last-event')).to.equal('initialization:atcb-n01');
  });

  it('N-02/N-03: openList and closeList push with correct actions', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-n02' }));
    await openList(host);
    expect(dlEvents('openList').length).to.equal(1);
    expect(dlEvents('openList')[0].eventAction).to.equal('Opened');
    await pressEsc();
    await aTimeout(60);
    const close = dlEvents('closeList');
    expect(close.length).to.be.greaterThan(0);
    expect(close[0].eventAction).to.equal('Closed');
    expect(host.getAttribute('atcb-last-event')).to.include('closeList');
  });

  it('N-04: option click in a multi-option list pushes openCalendarLink with the option id', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-n04' }));
      await openList(host);
      await clickOption(host, 'google');
      const evts = dlEvents('openCalendarLink');
      expect(evts.length).to.equal(1);
      expect(evts[0].eventLabel).to.equal('atcb-n04-google');
      expect(host.getAttribute('atcb-last-event')).to.equal('openCalendarLink:atcb-n04-google');
    } finally {
      wo.restore();
    }
  });

  it('N-05: singleton click pushes openSingletonLink (NOT openCalendarLink)', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...baseEvent({ identifier: 'atcb-n05' }), options: "'Google'", trigger: 'click' });
      await clickSingleton(host);
      expect(dlEvents('openSingletonLink').length).to.equal(1);
      expect(dlEvents('openCalendarLink').length).to.equal(0);
    } finally {
      wo.restore();
    }
  });

  it('N-06: sub-event click in the multi-date modal pushes openSubEventLink', async () => {
    const wo = interceptWindowOpen();
    try {
      const dates = [
        { name: 'One', startDate: '2050-07-01', startTime: '10:00', endTime: '11:00' },
        { name: 'Two', startDate: '2050-07-08', startTime: '10:00', endTime: '11:00' },
      ];
      const { host } = await mountAtcb({ name: 'SubSeries', dates: JSON.stringify(dates), options: "['Google','iCal']", trigger: 'click', identifier: 'atcb-n06' });
      await openList(host);
      await clickOption(host, 'google');
      const modal = document.getElementById('atcb-n06-modal-host');
      const btn = modal.shadowRoot.getElementById('atcb-n06-google-1');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      await aTimeout(80);
      expect(dlEvents('openSubEventLink').length).to.equal(1);
    } finally {
      wo.restore();
    }
  });

  it('N-09: success is pushed once all options have been used', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...baseEvent({ identifier: 'atcb-n09' }), options: "'Google'", trigger: 'click' });
      await clickSingleton(host);
      await aTimeout(100);
      const success = dlEvents('success');
      expect(success.length).to.equal(1);
      expect(success[0].eventAction).to.equal('Saved');
    } finally {
      wo.restore();
    }
  });

  it('N-10: missing window.dataLayer is created on demand - no crash, attribute still mirrors', async () => {
    removeDataLayer();
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-n10' }));
    expect(host.getAttribute('atcb-last-event')).to.equal('initialization:atcb-n10');
    expect(Array.isArray(window.dataLayer)).to.equal(true);
  });

  it('N-11: categories are Add-to-Calendar-Button for non-RSVP flows', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-n11' }));
      await openList(host);
      await clickOption(host, 'google');
      for (const e of dlEvents()) {
        expect(e.eventCategory).to.equal('Add-to-Calendar-Button');
      }
    } finally {
      wo.restore();
    }
  });
});
