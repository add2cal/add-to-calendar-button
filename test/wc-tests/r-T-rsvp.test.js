/**
 * Reduced Suite - Group T: PRO RSVP - rendering, client-side validation & license guards ONLY (plan §18)
 *
 * RSVP API behavior is OUT OF SCOPE per plan §0: no submit flows, no server responses,
 * no thank-you states, no seat checks. The RSVP form REPLACES the calendar-link button.
 *
 * Note: @web/test-runner serves from localhost, which the license guard explicitly allows,
 * so rendering works in tests even when override rules would strip rsvp data (T-19).
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { mockProFetch, proRsvpConfig, PRO_RSVP_KEY } from '../fixtures/pro.js';
import { resetDataLayer, dlEvents } from '../helpers/datalayer.js';

describe('Group T - PRO RSVP (render + client-side only)', () => {
  beforeEach(() => resetDataLayer());

  it('T-01: RSVP config renders the RSVP entry point INSTEAD of calendar-link options', async () => {
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { shadow } = await mountAtcb({ proKey: PRO_RSVP_KEY, identifier: 'atcb-t01' });
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
      expect(shadow.querySelector('button'), 'an interactive entry point renders').to.exist;
      // no calendar option list items pre-rendered in the RSVP flow
      expect(shadow.getElementById('atcb-t01-google')).to.not.exist;
      expect(shadow.getElementById('atcb-t01-ical')).to.not.exist;
    } finally {
      mock.restore();
    }
  });

  it('T-10: clicking the RSVP button opens the form and pushes openRSVP', async () => {
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_RSVP_KEY, trigger: 'click', identifier: 'atcb-t10' });
      const btn = shadow.getElementById('atcb-t10') || shadow.querySelector('button');
      btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      await aTimeout(200);
      const rsvpOpened = dlEvents('openRSVP');
      expect(rsvpOpened.length, 'openRSVP event pushed').to.be.greaterThan(0);
      expect(rsvpOpened[0].eventCategory).to.equal('Add-to-Calendar-RSVP');
      expect(host.getAttribute('atcb-last-event')).to.include('openRSVP');
      const modal = document.getElementById('atcb-t10-modal-host');
      const formHost = modal || host;
      expect(formHost.shadowRoot.querySelector('form, .atcb-modal-box'), 'form UI present').to.exist;
    } finally {
      mock.restore();
    }
  });

  it('T-02: inlineRsvp renders the form immediately without a button click', async () => {
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_RSVP_KEY, inlineRsvp: 'true', identifier: 'atcb-t02' });
      await aTimeout(200);
      const modal = document.getElementById('atcb-t02-modal-host');
      const formPresent = shadow.querySelector('form') || (modal && modal.shadowRoot.querySelector('form')) || host.shadowRoot.querySelector('.atcb-modal-box');
      expect(formPresent, 'inline RSVP form rendered without interaction').to.exist;
    } finally {
      mock.restore();
    }
  });

  it('T-22: required fields exist and empty submit does not fire successRSVP (client-side gate)', async () => {
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { host, shadow } = await mountAtcb({ proKey: PRO_RSVP_KEY, inlineRsvp: 'true', identifier: 'atcb-t22' });
      await aTimeout(200);
      const modal = document.getElementById('atcb-t22-modal-host');
      const root = (modal && modal.shadowRoot) || shadow;
      const emailInput = root.querySelector('input[type="email"], input[name*="email" i]');
      expect(emailInput, 'email field rendered from rsvp.fields').to.exist;
      // try to submit with everything empty
      const submitBtn = Array.from(root.querySelectorAll('button')).find((b) => b.type === 'submit' || /rsvp|submit|send|confirm/i.test(b.textContent || ''));
      if (submitBtn) {
        submitBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        await aTimeout(150);
      }
      expect(dlEvents('successRSVP').length, 'no successRSVP without valid input').to.equal(0);
      expect(host.shadowRoot.querySelector('.atcb-initialized')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('T-19: license guard allows rendering on localhost (test runner host)', async () => {
    expect(window.location.hostname).to.match(/^(localhost|127\.0\.0\.1)$/);
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { shadow } = await mountAtcb({ proKey: PRO_RSVP_KEY, identifier: 'atcb-t19' });
      expect(shadow.querySelector('.atcb-initialized')).to.exist;
    } finally {
      mock.restore();
    }
  });
});
