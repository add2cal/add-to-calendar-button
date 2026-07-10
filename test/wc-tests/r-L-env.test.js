/**
 * Reduced Suite - Group L: Environment-driven routing (plan §11)
 * Uses the lib's fake flags (fakeIOS/fakeAndroid/fakeMobile) plus runtime UA overrides
 * (env detection functions read navigator.userAgent at call time).
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave, setUA, UA } from '../helpers/capture.js';
import { clickSingleton, openList, renderedOptions, clickOption, modalHost } from '../helpers/dom.js';

describe('Group L - Environment-driven routing', () => {
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
        optionsMobile: "['Google','iCal']",
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

  it('L-11: on iOS, optionsMobile OVERRIDES optionsIOS (documented actual behavior)', async () => {
    // PLAN/DOCS MISMATCH pinned intentionally: the docs describe optionsIOS as the more
    // specific override, but src/atcb-decorate.js#atcb_determine_options_source checks
    // optionsIOS first and then unconditionally lets optionsMobile win when both are set.
    // If this is fixed in the lib one day, flip this expectation.
    const { host } = await mountAtcb(
      baseEvent({
        fakeIOS: 'true',
        optionsMobile: "['Google','Yahoo']",
        optionsIOS: "['Apple']",
        trigger: 'click',
        identifier: 'atcb-l11',
      }),
    );
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.have.members(['google', 'yahoo']);
    expect(opts).to.not.include('apple');
  });

  it('L-11b: optionsIOS applies when it is the only override set', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb(
        baseEvent({
          fakeIOS: 'true',
          optionsIOS: "['Apple']",
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

  it('L-18: optionsIOS with "iCal" (doc casing) gets SWAPPED to apple (case-sensitive guard quirk)', async () => {
    // The swap-guard checks options.includes('ical')/('apple') on the RAW (un-normalized)
    // values, so the documented casing "iCal" does not match and the ical->apple swap runs.
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
    expect(opts).to.have.members(['apple', 'google']);
  });

  it('L-18b: optionsIOS with lowercase "ical" is kept verbatim (explicit override wins)', async () => {
    // lowercase matches the raw includes() check -> swap suppressed, explicit ical survives on iOS
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
    try {
      const { host } = await mountAtcb({
        name: 'iOS Chrome Sub',
        subscribe: 'true',
        icsFile: 'https://example.com/cal.ics',
        options: "'Apple'",
        trigger: 'click',
        identifier: 'atcb-l02',
      });
      await clickSingleton(host);
      await aTimeout(120);
      expect(wo.calls.length, 'no direct open on iOS non-Safari').to.equal(0);
      const modal = modalHost(host);
      expect(modal, 'copy-note modal').to.exist;
    } finally {
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
        options: "'Apple'",
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
      const { host } = await mountAtcb({ name: 'Mobile Save', startDate: '2050-06-15', options: "'iCal'", trigger: 'click', identifier: 'atcb-l15' });
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
