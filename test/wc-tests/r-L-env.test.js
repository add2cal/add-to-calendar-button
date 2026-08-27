/**
 * Reduced Suite - Group L: Environment-driven routing (case list: .ai/TEST-CASES.md)
 * Uses the lib's fake flags (fakeIOS/fakeAndroid/fakeMobile) plus runtime UA overrides
 * (env detection functions read navigator.userAgent at call time).
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave, setUA, UA, muteConsole, stubClipboard } from '../helpers/capture.js';
import { clickSingleton, openList, renderedOptions, clickOption, modalHost } from '../helpers/dom.js';
import { atcb_action } from '../../dist/module/index.js';

describe('Group L - Environment-driven routing', () => {
  it('L-01a: atcb_action uses an Apple-device interstitial for a dynamic singleton ICS', async () => {
    const trigger = document.createElement('button');
    trigger.id = 'atcb-l01a';
    document.body.append(trigger);
    await atcb_action({ ...baseEvent({ options: ['apple'], fakeIOS: true }), identifier: 'atcb-l01a' }, trigger);
    await aTimeout(40);
    const modal = document.getElementById('atcb-l01a-modal-host');
    expect(modal).to.exist;
    expect(modal.shadowRoot.querySelector('.atcb-modal-headline')).to.not.exist;
    expect(modal.shadowRoot.querySelector('.atcb-modal-content:not(.atcb-modal-content-subevents)')).to.exist;
    const dateLink = modal.shadowRoot.querySelector('a.atcb-subevent-btn');
    expect(dateLink).to.exist;
    expect(dateLink.getAttribute('href')).to.match(/^data:text\/calendar/);
    document.getElementById('atcb-customTrigger-atcb-l01a-host')?.remove();
    modal.remove();
    trigger.remove();
  });

  it('L-01b: atcb_action skips the interstitial for a static singleton ICS', async () => {
    const fs = interceptFileSave();
    const trigger = document.createElement('button');
    trigger.id = 'atcb-l01b';
    document.body.append(trigger);
    try {
      await atcb_action({ ...baseEvent({ options: ['apple'], fakeIOS: true }), icsFile: 'https://example.com/static.ics', identifier: 'atcb-l01b' }, trigger);
      expect(document.getElementById('atcb-l01b-modal-host')).to.not.exist;
      expect(fs.saves[0].href).to.equal('https://example.com/static.ics');
    } finally {
      fs.restore();
      document.getElementById('atcb-customTrigger-atcb-l01b-host')?.remove();
      trigger.remove();
    }
  });

  it('L-01c: atcb_action sink resolves dynamic ICS without rendering', async () => {
    const before = document.querySelectorAll('[id$="-modal-host"]').length;
    const result = await atcb_action({ ...baseEvent({ options: ['ical'] }), sink: true });
    expect(result).to.include('BEGIN:VCALENDAR');
    expect(document.querySelectorAll('[id$="-modal-host"]').length).to.equal(before);
  });
  it('L-04: Android -> apple option removed, ical stays', async () => {
    const { host } = await mountAtcb(baseEvent({ fakeAndroid: 'true', trigger: 'click', identifier: 'atcb-l04' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('apple');
    expect(opts).to.include('ical');
  });

  it('L-13a: iOS -> ical option removed, apple stays', async () => {
    const { host } = await mountAtcb(baseEvent({ fakeIOS: 'true', trigger: 'click', identifier: 'atcb-l13a' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('ical');
    expect(opts).to.include('apple');
  });

  it('L-10: optionsMobile filters the list on mobile', async () => {
    const { host } = await mountAtcb(
      baseEvent({
        fakeAndroid: 'true',
        optionsMobile: "['google','ical']",
        trigger: 'click',
        identifier: 'atcb-l10',
      }),
    );
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.include('google');
    expect(opts).to.include('ical');
    expect(opts).to.not.include('yahoo');
    expect(opts).to.not.include('ms365');
  });

  it('L-11: on iOS, optionsIOS takes precedence over optionsMobile', async () => {
    // the more specific optionsIOS wins; optionsMobile only serves as fallback (fixed in this branch)
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(
        baseEvent({
          fakeIOS: 'true',
          optionsMobile: "['google','yahoo']",
          optionsIOS: "['apple']",
          trigger: 'click',
          identifier: 'atcb-l11',
        }),
      );
      // single remaining option renders as singleton apple button
      const btn = host.shadowRoot.getElementById(host.getAttribute('atcb-button-id'));
      expect(btn.classList.contains('atcb-single')).to.equal(true);
      const opts = renderedOptions(host);
      expect(opts).to.not.include('google');
      expect(opts).to.not.include('yahoo');
      await clickSingleton(host);
      expect(fs.saves.length, 'apple singleton saves an ics').to.equal(1);
    } finally {
      fs.restore();
    }
  });

  it('L-11b: optionsIOS applies when it is the only override set', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(
        baseEvent({
          fakeIOS: 'true',
          optionsIOS: "['apple']",
          trigger: 'click',
          identifier: 'atcb-l11b',
        }),
      );
      // single remaining option renders as singleton
      const btn = host.shadowRoot.getElementById(host.getAttribute('atcb-button-id'));
      expect(btn.classList.contains('atcb-single')).to.equal(true);
      await clickSingleton(host);
      expect(fs.saves.length, 'apple singleton saves an ics').to.equal(1);
    } finally {
      fs.restore();
    }
  });

  it('L-18: explicit optionsIOS with legacy "iCal" casing is kept verbatim - no swap', async () => {
    // option-name matching is case-normalized, so the explicit override survives on iOS
    // regardless of input casing (legacy v2 spellings act as aliases)
    const { host } = await mountAtcb(
      baseEvent({
        fakeIOS: 'true',
        optionsIOS: "['iCal','Google']",
        trigger: 'click',
        identifier: 'atcb-l18',
      }),
    );
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.include('ical');
    expect(opts).to.include('google');
    expect(opts).to.not.include('apple');
  });

  it('L-18b: optionsIOS with the official lowercase "ical" behaves identically', async () => {
    const { host } = await mountAtcb(
      baseEvent({
        fakeIOS: 'true',
        optionsIOS: "['ical','google']",
        trigger: 'click',
        identifier: 'atcb-l18b',
      }),
    );
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.include('ical');
    expect(opts).to.include('google');
    expect(opts).to.not.include('apple');
  });

  it('L-16: iOS + recurring -> only the apple/ical family remains', async () => {
    const { host } = await mountAtcb(baseEvent({ fakeIOS: 'true', recurrence: 'daily', recurrence_count: 3, trigger: 'click', identifier: 'atcb-l16' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('google');
    expect(opts).to.not.include('yahoo');
    expect(opts).to.not.include('ms365');
    expect(opts).to.not.include('outlookcom');
    expect(opts).to.not.include('msteams');
  });

  it('L-17: desktop + recurring -> google stays active with recur param', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb(baseEvent({ recurrence: 'daily', recurrence_count: 3, trigger: 'click', identifier: 'atcb-l17' }));
      await openList(host);
      const opts = renderedOptions(host);
      expect(opts).to.include('google');
      await clickOption(host, 'google');
      expect(wo.calls[0].url).to.include('recur=');
    } finally {
      wo.restore();
    }
  });

  it('L-02: iOS non-Safari browser (Chrome on iOS) -> subscribe ical shows copy-note modal instead of opening', async () => {
    const restoreUA = setUA(UA.iosChrome);
    const wo = interceptWindowOpen();
    const clip = stubClipboard(); // headless envs lack the Clipboard API
    const mute = muteConsole();
    try {
      const { host } = await mountAtcb({
        name: 'iOS Chrome Sub',
        subscribe: 'true',
        icsFile: 'https://example.com/cal.ics',
        options: "'apple'",
        trigger: 'click',
        identifier: 'atcb-l02',
      });
      await clickSingleton(host);
      await aTimeout(120);
      expect(wo.calls.length, 'no direct open on iOS non-Safari').to.equal(0);
      const modal = modalHost(host);
      expect(modal, 'copy-note modal').to.exist;
      expect(clip.texts.join(' '), 'ics url copied to clipboard').to.include('example.com/cal.ics');
    } finally {
      mute.restore();
      clip.restore();
      wo.restore();
      restoreUA();
    }
  });

  it('L-01: iOS Safari -> subscribe ical opens webcal:// directly', async () => {
    const restoreUA = setUA(UA.iosSafari);
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({
        name: 'iOS Safari Sub',
        subscribe: 'true',
        icsFile: 'https://example.com/cal.ics',
        options: "'apple'",
        trigger: 'click',
        identifier: 'atcb-l01',
      });
      await clickSingleton(host);
      expect(wo.calls.length).to.equal(1);
      expect(wo.calls[0].url).to.equal('webcal://example.com/cal.ics');
    } finally {
      wo.restore();
      restoreUA();
    }
  });

  it('L-15: mobile file save targets _self (desktop _blank covered in G-20)', async () => {
    const restoreUA = setUA(UA.androidChrome);
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ name: 'Mobile Save', startDate: '2050-06-15', options: "'ical'", trigger: 'click', identifier: 'atcb-l15' });
      await clickSingleton(host);
      expect(fs.saves.length).to.equal(1);
      expect(fs.saves[0].target).to.equal('_self');
    } finally {
      fs.restore();
      restoreUA();
    }
  });

  it('L-08: desktop default -> all seven options render', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-l08' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.have.members(['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo']);
  });
});
