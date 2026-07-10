/**
 * Reduced Suite - Group A: Lifecycle & registration (plan §2)
 */
import { expect, aTimeout, fixture } from '@open-wc/testing';
import { mountAtcb, mountAtcbNoWait, baseEvent } from '../helpers/mount.js';
import { resetDataLayer, dlEvents } from '../helpers/datalayer.js';
import { trigger, openList, listEl, modalHost, initFailed } from '../helpers/dom.js';
import { atcb_action } from '../../dist/module/index.js';

describe('Group A - Lifecycle & registration', () => {
  beforeEach(() => resetDataLayer());

  it('A-01: registers and initializes with minimal config', async () => {
    const { host, shadow } = await mountAtcb({ name: 'Minimal', startDate: '2050-02-14', options: "'Google'" });
    expect(customElements.get('add-to-calendar-button')).to.exist;
    expect(host.getAttribute('atcb-button-id')).to.exist.and.to.not.equal('');
    expect(shadow.querySelector('.atcb-initialized')).to.exist;
    expect(dlEvents('initialization').length).to.equal(1);
    expect(host.getAttribute('atcb-last-event')).to.include('initialization');
  });

  it('A-02: missing name (debug off) -> silent no-render', async () => {
    const errors = [];
    const orig = console.error;
    console.error = (...args) => errors.push(args.join(' '));
    try {
      const el = await mountAtcbNoWait({ startDate: '2050-02-14' });
      await aTimeout(300);
      // failed-init elements never receive the atcb-button-id attribute.
      // IMPORTANT: do NOT touch the shadow root of failed-init elements at all -
      // several Chrome builds crash the renderer on it (observed with headless-shell
      // v150 on querySelector; other builds crash on other accessors).
      expect(initFailed(el)).to.equal(true);
      expect(errors.join(' '), 'silent - no console.error without debug').to.equal('');
    } finally {
      console.error = orig;
    }
  });

  it('A-03: missing name + debug -> visible error block', async () => {
    const errors = [];
    const orig = console.error;
    console.error = (...args) => errors.push(args.join(' '));
    try {
      const el = await mountAtcbNoWait({ startDate: '2050-02-14', debug: 'true' });
      await aTimeout(300);
      // assert via the console contract only - no shadow access on failed-init elements
      // (renderer-crash class varies across Chrome builds, see A-02)
      expect(errors.join(' ')).to.include('failed');
      expect(initFailed(el)).to.equal(true);
    } finally {
      console.error = orig;
    }
  });

  it('A-04: hidden=true skips button generation entirely', async () => {
    // per src/atcb-init.js: `if (!data.hidden)` gates generation - no button lands in the shadow DOM
    const { host } = await mountAtcb(baseEvent({ hidden: 'true', identifier: 'atcb-a04' }));
    expect(host.shadowRoot.querySelector('button')).to.not.exist;
  });

  it('A-05: disabled=true renders but click no-ops', async () => {
    const { host } = await mountAtcb(baseEvent({ disabled: 'true', trigger: 'click', identifier: 'atcb-a05' }));
    const btn = trigger(host);
    expect(btn).to.exist;
    btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    await aTimeout(80);
    expect(listEl(host)).to.not.exist;
    expect(dlEvents('openList').length).to.equal(0);
  });

  it('A-06: blockInteraction=true blocks all interaction', async () => {
    const { host } = await mountAtcb(baseEvent({ blockInteraction: 'true', trigger: 'click', identifier: 'atcb-a06' }));
    const btn = trigger(host);
    btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
    await aTimeout(80);
    expect(listEl(host)).to.not.exist;
    expect(dlEvents('openList').length).to.equal(0);
  });

  it('A-07: two instances keep independent state', async () => {
    const { host: h1 } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-a07a' }));
    const { host: h2 } = await mountAtcb(baseEvent({ trigger: 'click', identifier: 'atcb-a07b' }));
    expect(h1.getAttribute('atcb-button-id')).to.not.equal(h2.getAttribute('atcb-button-id'));
    await openList(h1);
    expect(listEl(h1)).to.exist;
    expect(listEl(h2)).to.not.exist;
  });

  it('A-08: imperative atcb_action opens directly; atcb-last-event only set after first event', async () => {
    const btn = await fixture('<button id="atcb-a08-trigger">CTA</button>');
    expect(btn.getAttribute('atcb-last-event')).to.equal(null);
    await atcb_action(
      {
        name: 'Action Event',
        startDate: '2050-02-14',
        options: ['Google', 'iCal'],
        identifier: 'atcb-a08-trigger',
        listStyle: 'modal',
      },
      btn,
    );
    await aTimeout(120);
    // the modal host is created at document level
    expect(document.getElementById('atcb-a08-trigger-modal-host') || document.querySelector('[id$="-modal-host"]')).to.exist;
    expect(btn.getAttribute('atcb-last-event')).to.exist;
  });

  it('A-09: removing element cleans up open UI and schema', async () => {
    const { host } = await mountAtcb(baseEvent({ trigger: 'click', listStyle: 'modal', identifier: 'atcb-a09' }));
    await openList(host);
    host.remove();
    await aTimeout(80);
    expect(modalHost(host)).to.not.exist;
    expect(document.getElementById('atcb-schema-atcb-a09')).to.not.exist;
  });

  it('A-10: attribute change after init triggers re-render', async () => {
    const { host } = await mountAtcb(baseEvent({ label: 'Before', trigger: 'click', identifier: 'atcb-a10' }));
    const textBefore = host.shadowRoot.querySelector('.atcb-text')?.textContent;
    expect(textBefore).to.include('Before');
    host.setAttribute('label', 'After');
    await aTimeout(300);
    const textAfter = host.shadowRoot.querySelector('.atcb-text')?.textContent;
    expect(textAfter).to.include('After');
  });

  it('A-11: init is deferred (non-blocking) - not initialized synchronously after append', async () => {
    const el = await mountAtcbNoWait({ name: 'Async Contract', startDate: '2050-02-14', options: "'Google'" });
    // synchronously after append: the deferred setTimeout(initializeComponent, 0) has not run yet
    expect(el.getAttribute('atcb-button-id')).to.equal(null);
    await el.whenInitialized();
    expect(el.getAttribute('atcb-button-id')).to.exist;
    expect(el.shadowRoot.querySelector('.atcb-initialized')).to.exist;
  });
});
