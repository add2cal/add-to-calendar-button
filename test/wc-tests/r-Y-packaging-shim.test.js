/**
 * Reduced Suite - Group Y: Packaging (case list: .ai/TEST-CASES.md)
 *
 * Deprecated CDN file names (atcb-no-pro.js, atcb-unstyle.js, atcb-no-pro-unstyle.js)
 * ship as tiny shims: they log a one-time deprecation info and load the main bundle
 * from the same location, so existing embeds keep working.
 *
 * This runs in its own test file: the shim must be observed defining the element
 * via the bundle it injects, which requires a page where nothing loaded it before.
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

describe('Group Y - packaging: deprecated CDN shims', () => {
  it('Y-02: a deprecated CDN file logs a deprecation info and loads the main bundle next to it', async () => {
    expect(customElements.get('add-to-calendar-button'), 'element not defined before the shim loads').to.equal(undefined);
    const infos = [];
    const originalInfo = console.info;
    console.info = (...args) => {
      infos.push(args.join(' '));
      originalInfo.apply(console, args);
    };
    try {
      await loadScript('/dist/atcb-no-pro.js');
      await customElements.whenDefined('add-to-calendar-button');
      expect(infos.join('\n'), 'deprecation notice logged').to.include('deprecated');
      expect(typeof window.atcb_action, 'main bundle loaded by the shim').to.equal('function');
    } finally {
      console.info = originalInfo;
    }
  });
});
