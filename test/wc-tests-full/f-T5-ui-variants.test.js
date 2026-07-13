/**
 * Full Cartesian Suite - F.T5a: listStyle x trigger + F.T5b: buttonStyle samples (case list: .ai/TEST-CASES.md)
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { trigger, listEl, modalHost } from '../helpers/dom.js';
import { BUTTON_STYLES } from '../fixtures/matrix.js';

const LIST_STYLES = ['dropdown', 'dropdown-static', 'dropup-static', 'overlay', 'modal'];
const TRIGGERS = ['click', 'hover'];
let n = 0;

async function open(host, mode) {
  const btn = trigger(host);
  if (mode === 'click') {
    btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
  } else {
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }));
  }
  await aTimeout(80);
}

describe('F.T5a - listStyle x trigger matrix', () => {
  for (const listStyle of LIST_STYLES) {
    for (const trig of TRIGGERS) {
      it(`F.T5a | ${listStyle} | ${trig}`, async () => {
        const { host } = await mountAtcb(baseEvent({ listStyle, trigger: trig, identifier: `ft5a-${n++}` }));
        expect(host.shadowRoot.querySelector('.atcb-initialized')).to.exist;
        if (listStyle === 'modal' && trig === 'hover') {
          // modal listStyle coerces the trigger to click - hover must NOT open it
          await open(host, 'hover');
          expect(listEl(host) || modalHost(host), 'hover does not open a modal').to.not.exist;
          await open(host, 'click');
          expect(modalHost(host) || host.shadowRoot.querySelector('.atcb-modal'), 'click opens the modal').to.exist;
          return;
        }
        await open(host, trig);
        const opened = listEl(host) || host.shadowRoot.querySelector('.atcb-modal') || modalHost(host);
        expect(opened, `list opens for ${listStyle}/${trig}`).to.exist;
      });
    }
  }
});

describe('F.T5b - buttonStyle samples', () => {
  for (const style of BUTTON_STYLES) {
    it(`F.T5b | buttonStyle=${style}`, async () => {
      const { host, shadow } = await mountAtcb(baseEvent({ buttonStyle: style, identifier: `ft5b-${n++}` }));
      expect(host.shadowRoot.querySelector('.atcb-initialized')).to.exist;
      if (style !== 'none') {
        expect(shadow.querySelector('.atcb-button')).to.exist;
      }
    });
  }
});
