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
});
