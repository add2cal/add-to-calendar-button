/**
 * Reduced Suite - Group Y: Packaging (case list: .ai/TEST-CASES.md)
 *
 * Classic <script> tag consumption of the browser bundle: loading dist/atcb.js
 * must define the custom element and expose window.atcb_action as the only global.
 */
import { expect } from '@open-wc/testing';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(script);
  });
}

describe('Group Y - packaging: script tag', () => {
  it('Y-01: dist/atcb.js defines the element and exposes window.atcb_action', async () => {
    expect(customElements.get('add-to-calendar-button'), 'element not defined before the script loads').to.equal(undefined);
    await loadScript('/dist/atcb.js');
    await customElements.whenDefined('add-to-calendar-button');
    expect(typeof window.atcb_action, 'window.atcb_action global').to.equal('function');
    // the bundle must render a button end-to-end (proves css + i18n are inlined)
    const host = document.createElement('add-to-calendar-button');
    host.setAttribute('name', 'Y01 Event');
    host.setAttribute('startDate', '2050-06-15');
    host.setAttribute('identifier', 'atcb-y01');
    document.body.appendChild(host);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const btn = host.shadowRoot && host.shadowRoot.getElementById('atcb-btn-atcb-y01');
    expect(btn, 'button rendered from the script-tag bundle').to.not.equal(null);
    host.remove();
  });
});
