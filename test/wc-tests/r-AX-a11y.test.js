/**
 * Reduced Suite - Group AX: Automated accessibility checks (case list: .ai/TEST-CASES.md)
 *
 * axe-core against the WCAG 2.1 A/AA rule tags for the main interaction surfaces:
 * trigger button, open dropdown list, date-style button, and the modal dialog.
 * axe pierces open shadow roots natively.
 *
 * The color-contrast rule is excluded on purpose: colors are theme- and
 * user-configurable (customCss, lightMode, style variables), and headless font
 * rendering makes the automated check unstable. Contrast is a design-review item.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { openList, modalHost } from '../helpers/dom.js';
import { aTimeout } from '@open-wc/testing';
import { mockProFetch, proEvtConfig, proRsvpConfig, PRO_EVT_KEY, PRO_RSVP_KEY } from '../fixtures/pro.js';

async function loadAxe() {
  if (window.axe) return window.axe;
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/node_modules/axe-core/axe.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('failed to load axe-core'));
    document.head.appendChild(script);
  });
  return window.axe;
}

async function expectNoViolations(context, label) {
  const axe = await loadAxe();
  const result = await axe.run(context, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag21a', 'wcag21aa'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  const summary = result.violations.map((v) => `${v.id}: ${v.help} [${v.nodes.map((n) => n.target.join(' ')).join('; ')}]`).join('\n');
  expect(result.violations.length, `${label} violations:\n${summary}`).to.equal(0);
}

describe('Group AX - automated a11y checks', () => {
  it('AX-01: default trigger button has no WCAG A/AA violations', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-ax01', options: "['google','apple','ical']" }));
    await expectNoViolations(host, 'trigger button');
  });

  it('AX-02: open dropdown list has no WCAG A/AA violations', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-ax02', options: "['google','apple','ical']", trigger: 'click' }));
    await openList(host);
    await expectNoViolations(host, 'open list');
  });

  it('AX-03: date-style button has no WCAG A/AA violations', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-ax03', buttonStyle: 'date', location: 'Test Hall 7' }));
    await expectNoViolations(host, 'date button');
  });

  it('AX-04: modal list dialog has no WCAG A/AA violations and carries dialog semantics', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-ax04', options: "['google','apple','ical']", listStyle: 'modal', trigger: 'click' }));
    await openList(host);
    await aTimeout(100);
    const modal = modalHost(host);
    expect(modal, 'modal host exists').to.exist;
    const dialog = modal.shadowRoot.getElementById('atcb-bgoverlay');
    expect(dialog.tagName, 'native dialog element').to.equal('DIALOG');
    await expectNoViolations(modal, 'modal dialog');
  });

  it('AX-05: inline RSVP form has no WCAG A/AA violations', async () => {
    const mock = mockProFetch({ [PRO_RSVP_KEY]: proRsvpConfig() });
    try {
      const { host } = await mountAtcb({ prokey: PRO_RSVP_KEY, inlineRsvp: 'true', identifier: 'atcb-ax05' });
      await aTimeout(250);
      await expectNoViolations(host, 'inline RSVP form');
    } finally {
      mock.restore();
    }
  });

  it('AX-06: CTA form modal has no WCAG A/AA violations', async () => {
    const mock = mockProFetch({
      [PRO_EVT_KEY]: proEvtConfig({
        ty: {
          type: 'form',
          text: 'Tell us where to send your reminder.',
          url: 'https://example.com/submit',
          button_label: 'Send',
          fields: [
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'terms', label: 'I agree', type: 'checkbox', required: true },
          ],
        },
      }),
    });
    try {
      const { host } = await mountAtcb({
        prokey: PRO_EVT_KEY,
        trigger: 'click',
        identifier: 'atcb-ax06',
      });
      const btn = host.shadowRoot.getElementById(host.getAttribute('atcb-button-id'));
      btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }));
      btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }));
      await aTimeout(60);
      const option = host.shadowRoot.getElementById(host.getAttribute('atcb-button-id') + '-ical');
      option.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
      await aTimeout(1200);
      const modal = modalHost(host);
      expect(modal, 'CTA modal host exists').to.exist;
      await expectNoViolations(modal, 'CTA form modal');
    } finally {
      mock.restore();
    }
  });
});
