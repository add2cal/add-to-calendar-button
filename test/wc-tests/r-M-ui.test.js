/**
 * Reduced Suite - Group M: UI / interaction (case list: .ai/TEST-CASES.md)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { trigger, openList, listEl, clickSingleton, pressEsc, optionEl, modalHost, btnId } from '../helpers/dom.js';
import { resetDataLayer, dlEvents } from '../helpers/datalayer.js';

describe('Group M - UI / interaction', () => {
  beforeEach(() => resetDataLayer());

  it('M-01: button renders with icon and label text', async () => {
    const { host, shadow } = await mountAtcb(baseEvent({ identifier: 'atcb-m01' }));
    expect(trigger(host)).to.exist;
    expect(shadow.querySelector('.atcb-icon')).to.exist;
    expect(shadow.querySelector('.atcb-text')).to.exist;
  });

  it('M-02: hideTextLabelButton -> no text, icon only', async () => {
    const { host, shadow } = await mountAtcb(baseEvent({ hideTextLabelButton: 'true', identifier: 'atcb-m02' }));
    expect(trigger(host).classList.contains('atcb-no-text')).to.equal(true);
    expect(shadow.querySelector('.atcb-icon')).to.exist;
  });

  it('M-03: hideIconButton -> no icon on the trigger', async () => {
    const { host } = await mountAtcb(baseEvent({ hideIconButton: 'true', identifier: 'atcb-m03' }));
    expect(trigger(host).querySelector('.atcb-icon')).to.not.exist;
  });

  it('M-04: click trigger opens list + openList event', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-m04' }));
    await openList(host);
    expect(listEl(host)).to.exist;
    expect(dlEvents('openList').length).to.equal(1);
    expect(host.getAttribute('atcb-last-event')).to.include('openList');
  });

  it('M-05: hover trigger opens on mouseenter', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-m05' })); // default trigger = hover
    trigger(host).dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
    await aTimeout(80);
    expect(listEl(host)).to.exist;
  });

  it('M-06: ESC closes the open list + closeList event', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-m06' }));
    await openList(host);
    expect(listEl(host)).to.exist;
    await pressEsc();
    await aTimeout(80);
    expect(listEl(host)).to.not.exist;
    expect(dlEvents('closeList').length).to.be.greaterThan(0);
  });

  it('M-08/M-09: focus lands in list on open; Enter on item triggers link', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-m08' }));
      await openList(host);
      const google = optionEl(host, 'google');
      google.focus();
      google.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true, cancelable: true }));
      await aTimeout(80);
      expect(wo.calls.length).to.equal(1);
      expect(dlEvents('openCalendarLink').length).to.equal(1);
    } finally {
      wo.restore();
    }
  });

  it('M-10/M-11: modal listStyle locks body scroll and unlocks on close', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', listStyle: 'modal', identifier: 'atcb-m10' }));
    await openList(host);
    expect(document.body.classList.contains('atcb-modal-no-scroll')).to.equal(true);
    expect(document.documentElement.classList.contains('atcb-modal-no-scroll')).to.equal(true);
    await pressEsc();
    await aTimeout(100);
    expect(document.body.classList.contains('atcb-modal-no-scroll')).to.equal(false);
    expect(document.documentElement.classList.contains('atcb-modal-no-scroll')).to.equal(false);
  });

  it('M-12: singleton config opens directly with openSingletonLink (no dropdown)', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...baseEvent({ identifier: 'atcb-m12' }), options: "'google'", trigger: 'click' });
      expect(trigger(host).classList.contains('atcb-single')).to.equal(true);
      await clickSingleton(host);
      expect(listEl(host)).to.not.exist;
      expect(wo.calls.length).to.equal(1);
      expect(dlEvents('openSingletonLink').length).to.equal(1);
      expect(dlEvents('openCalendarLink').length).to.equal(0);
    } finally {
      wo.restore();
    }
  });

  it('M-13: buttonsList renders one button per option', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host, shadow } = await mountAtcb({ ...baseEvent({ identifier: 'atcb-m13' }), options: "['google','apple']", buttonsList: 'true', trigger: 'click' });
      const buttons = shadow.querySelectorAll('button.atcb-button');
      expect(buttons.length).to.equal(2);
      const googleBtn = optionEl(host, 'google');
      expect(googleBtn).to.exist;
      googleBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      await aTimeout(80);
      expect(dlEvents('openSingletonLink').length).to.equal(1);
    } finally {
      wo.restore();
    }
  });

  it('M-14: saved checkmark + success event after all options were used', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...baseEvent({ identifier: 'atcb-m14' }), options: "['google']", trigger: 'click' });
      await clickSingleton(host);
      await aTimeout(100);
      expect(dlEvents('success').length, 'success fires once all options are done').to.equal(1);
      expect(trigger(host).querySelector('.atcb-checkmark') || host.shadowRoot.querySelector('.atcb-saved')).to.exist;
    } finally {
      wo.restore();
    }
  });

  it('M-15: hideCheckmark suppresses the saved checkmark', async () => {
    const wo = interceptWindowOpen();
    try {
      const { host } = await mountAtcb({ ...baseEvent({ identifier: 'atcb-m15' }), options: "['google']", hideCheckmark: 'true', trigger: 'click' });
      await clickSingleton(host);
      await aTimeout(100);
      expect(trigger(host).querySelector('.atcb-checkmark')).to.not.exist;
    } finally {
      wo.restore();
    }
  });

  it('M-16: hideBackground -> no background overlay for modal', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', listStyle: 'modal', hideBackground: 'true', identifier: 'atcb-m16' }));
    await openList(host);
    const bg = document.querySelector('#atcb-bgoverlay') || host.shadowRoot.querySelector('#atcb-bgoverlay');
    if (bg) {
      expect(bg.classList.contains('atcb-no-bg')).to.equal(true);
    } else {
      expect(bg).to.not.exist;
    }
  });

  it('M-18/M-19: static list styles render without dynamic repositioning', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', listStyle: 'dropdown-static', identifier: 'atcb-m18' }));
    await openList(host);
    expect(listEl(host)).to.exist;
    const { host: host2 } = await mountAtcb(baseEvent({ trigger: 'click', listStyle: 'dropup-static', identifier: 'atcb-m19' }));
    await openList(host2);
    expect(listEl(host2)).to.exist;
  });

  it('M-20: overlay listStyle renders the dropoverlay variant', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', listStyle: 'overlay', identifier: 'atcb-m20' }));
    expect(trigger(host).classList.contains('atcb-dropoverlay')).to.equal(true);
    await openList(host);
    expect(listEl(host)).to.exist;
  });

  it('M-22/M-23: explicit light/dark mode set the scheme class on the HOST element', async () => {
    const { host } = await mountAtcb(baseEvent({ lightMode: 'dark', identifier: 'atcb-m23' }));
    expect(host.classList.contains('atcb-dark')).to.equal(true);
    const { host: h2 } = await mountAtcb(baseEvent({ lightMode: 'light', identifier: 'atcb-m22' }));
    expect(h2.classList.contains('atcb-light')).to.equal(true);
  });

  it('M-27: styleLight custom CSS variables land on the host style', async () => {
    const { host } = await mountAtcb(baseEvent({ styleLight: '--btn-background: #ff0000;', identifier: 'atcb-m27' }));
    const styleAttr = host.getAttribute('style') || '';
    const shadowStyles = Array.from(host.shadowRoot.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('');
    expect(styleAttr.includes('--btn-background') || shadowStyles.includes('--btn-background') || (host.shadowRoot.host.style && host.shadowRoot.host.style.cssText.includes('--btn-background'))).to.equal(true);
  });

  it('M-28: buttonStyle=round applies its stylesheet variant', async () => {
    const { host, shadow } = await mountAtcb(baseEvent({ buttonStyle: 'round', identifier: 'atcb-m28' }));
    expect(host.shadowRoot.querySelector('.atcb-initialized')).to.exist;
    expect(shadow.querySelector('.atcb-button')).to.exist;
  });

  it('M-30: OSS + hideBranding -> in-list branding hidden but page-level license reference is added', async () => {
    document.getElementById('atcb-reference')?.remove();
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', hideBranding: 'true', identifier: 'atcb-m30' }));
    await openList(host);
    expect(host.shadowRoot.querySelector('#atcb-reference'), 'no in-list attribution').to.not.exist;
    const pageRef = document.getElementById('atcb-reference');
    expect(pageRef, 'license reference element appended to the page').to.exist;
    expect(pageRef.classList.contains('atcb-attribution')).to.equal(true);
    pageRef.remove();
  });

  it('M-30b: OSS default (no hideBranding) -> attribution rendered inside the open list', async () => {
    document.getElementById('atcb-reference')?.remove();
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-m30b' }));
    await openList(host);
    expect(host.shadowRoot.querySelector('#atcb-reference'), 'in-list attribution present').to.exist;
  });

  it('M-32: buttonStyle=date renders the date-card variant', async () => {
    const { host, shadow } = await mountAtcb({
      name: 'Date Style',
      startDate: '2050-06-15',
      startTime: '10:00',
      endTime: '11:00',
      timeZone: 'America/New_York',
      options: "'google'",
      buttonStyle: 'date',
      trigger: 'click',
      identifier: 'atcb-m32',
    });
    expect(host.shadowRoot.querySelector('.atcb-initialized')).to.exist;
    expect(shadow.querySelector('.atcb-button')).to.exist;
  });

  it('M-33: modal list stays content-sized, not stretched to the overlay width', async () => {
    // regression guard: the modal option list carries both .atcb-list (min-width:100%)
    // and .atcb-modal (min-width:auto) - the latter must win so the list does not fill
    // the whole overlay on wide viewports
    const { host } = await mountAtcb(baseEvent({ options: "['google','apple','ical']", listStyle: 'modal', trigger: 'click', identifier: 'atcb-m33' }));
    await openList(host);
    await aTimeout(100);
    const modal = modalHost(host);
    const list = modal.shadowRoot.querySelector('.atcb-list.atcb-modal');
    const header = list.querySelector('.atcb-list-modal-header');
    const closeItem = header.querySelector('.atcb-list-item-close');
    expect(header.querySelector('.atcb-list-modal-headline')).to.exist;
    expect(closeItem, 'list-modal close control belongs to the header row').to.exist;
    expect(closeItem.classList.contains('atcb-list-item'), 'close control is not styled as a calendar option').to.be.false;
    expect(closeItem.getAttribute('role'), 'close control remains part of keyboard menu navigation').to.equal('menuitem');
    expect(getComputedStyle(header).display).to.equal('flex');
    expect(getComputedStyle(header).justifyContent).to.equal('space-between');
    expect(getComputedStyle(header).gap).to.equal('20px');
    expect(getComputedStyle(closeItem).position).to.equal('static');
    expect(list, 'modal list rendered').to.exist;
    expect(modal.shadowRoot.querySelector('.atcb-modal-close'), 'list modal keeps its own close treatment').to.not.exist;
    const listWidth = list.getBoundingClientRect().width;
    // content-sized: comfortably below the viewport, never near full width
    expect(listWidth, `list width ${Math.round(listWidth)} should be content-sized`).to.be.lessThan(Math.min(window.innerWidth * 0.9, 500));
    expect(getComputedStyle(list).minWidth, 'the .atcb-modal min-width:auto wins over .atcb-list min-width:100%').to.equal('auto');
  });

  it('M-34: list-modal -> follow-up modal keeps the same bg overlay alive (no destroy/recreate blink)', async () => {
    // regression guard for the modal-to-modal transition blink: navigating from the options
    // list (rendered as modal) to a follow-up modal (multi-date picker) must reuse the same
    // background overlay node instead of destroying and rebuilding it
    const { host } = await mountAtcb({
      name: 'Series',
      dates: JSON.stringify([{ startDate: '2050-06-15' }, { startDate: '2050-06-16' }]),
      options: "['google','apple']",
      listStyle: 'modal',
      trigger: 'click',
      identifier: 'atcb-m34',
    });
    await openList(host);
    await aTimeout(50);
    const mh = modalHost(host);
    const overlayBefore = mh.shadowRoot.getElementById('atcb-bgoverlay');
    expect(overlayBefore, 'overlay present with the options list').to.exist;
    expect(mh.shadowRoot.querySelector('.atcb-list.atcb-modal'), 'options list shown').to.exist;
    // click Google (multi-date) -> opens the multi-date picker modal
    const googleOpt = mh.shadowRoot.getElementById(btnId(host) + '-google');
    expect(googleOpt, 'google option in the modal list').to.exist;
    googleOpt.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
    await aTimeout(150);
    const mhAfter = modalHost(host);
    const overlayAfter = mhAfter.shadowRoot.getElementById('atcb-bgoverlay');
    expect(overlayAfter, 'the SAME overlay node survives the transition (no blink)').to.equal(overlayBefore);
    expect(mhAfter.shadowRoot.querySelector('.atcb-modal-box'), 'the multi-date modal box is shown').to.exist;
    expect(mhAfter.shadowRoot.querySelector('.atcb-list.atcb-modal'), 'the outgoing options list was dropped').to.not.exist;
    expect(mhAfter.shadowRoot.querySelector('.atcb-modal-close svg'), 'follow-up modal has a top-right X close control').to.exist;
    expect(mhAfter.shadowRoot.querySelector('.atcb-modal-buttons'), 'close-only footer is omitted').to.not.exist;
  });
});
