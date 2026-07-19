/**
 * Reduced Suite - Group MEM: Memory-leak regression (case list: .ai/TEST-CASES.md)
 *
 * Pins the teardown contract: global listeners are page-level singletons registered
 * exactly once, every mutation observer is disconnected on disconnect, repeated
 * mount-unmount cycles leave no DOM debris (modal hosts, schema scripts, scroll
 * locks), and the heap stays steady across cycles (asserted when the runner exposes
 * window.gc via --js-flags=--expose-gc).
 */
import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { openList } from '../helpers/dom.js';

async function cycle(config) {
  const { host } = await mountAtcb(baseEvent(config));
  host.remove();
  await aTimeout(0);
}

describe('Group MEM - memory-leak regression', () => {
  it('MEM-01: global document/window listeners register exactly once across many buttons', async () => {
    const registered = [];
    const originalAdd = document.addEventListener.bind(document);
    document.addEventListener = (type, ...rest) => {
      registered.push(type);
      return originalAdd(type, ...rest);
    };
    try {
      for (let i = 0; i < 4; i++) {
        await cycle({ identifier: `atcb-mem01-${i}` });
      }
      expect(registered.filter((t) => t === 'keyup').length, 'one global keyup listener').to.be.at.most(1);
      expect(registered.filter((t) => t === 'keydown').length, 'one global keydown listener').to.be.at.most(1);
    } finally {
      document.addEventListener = originalAdd;
    }
  });

  it('MEM-02: every mutation observer created for bodyScheme is disconnected on unmount', async () => {
    const created = [];
    const disconnected = new Set();
    const OriginalObserver = window.MutationObserver;
    const originalDisconnect = OriginalObserver.prototype.disconnect;
    window.MutationObserver = class extends OriginalObserver {
      constructor(callback) {
        super(callback);
        created.push(this);
      }
    };
    OriginalObserver.prototype.disconnect = function (...args) {
      disconnected.add(this);
      return originalDisconnect.apply(this, args);
    };
    try {
      for (let i = 0; i < 3; i++) {
        await cycle({ identifier: `atcb-mem02-${i}`, lightMode: 'bodyScheme' });
      }
      expect(created.length, 'bodyScheme observers were created').to.be.greaterThan(0);
      const leaked = created.filter((observer) => !disconnected.has(observer));
      expect(leaked.length, 'every observer disconnected').to.equal(0);
    } finally {
      window.MutationObserver = OriginalObserver;
      OriginalObserver.prototype.disconnect = originalDisconnect;
    }
  });

  it('MEM-03: unmount while a modal is open removes the modal host and restores body scroll', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-mem03', listStyle: 'modal', trigger: 'click', options: "['Google','Apple']" }));
    await openList(host);
    await aTimeout(100);
    expect(document.getElementById('atcb-btn-atcb-mem03-modal-host'), 'modal host open').to.exist;
    host.remove();
    await aTimeout(50);
    expect(document.getElementById('atcb-btn-atcb-mem03-modal-host'), 'modal host removed with the button').to.not.exist;
    expect(document.body.classList.contains('atcb-modal-no-scroll'), 'scroll lock released').to.equal(false);
  });

  it('MEM-04: repeated mount-unmount cycles leave no DOM debris and hold the heap steady', async function () {
    this.timeout(30000);
    const cycleOnce = async (i) => {
      await cycle({ identifier: `atcb-mem04-${i}`, lightMode: 'bodyScheme', description: 'x [url]https://example.com[/url]', location: 'Hall' });
    };
    // warm up caches (styles, locale registry, lit templates)
    for (let i = 0; i < 5; i++) await cycleOnce('warm-' + i);
    const heapProbe = typeof window.gc === 'function' && performance.memory;
    let baseline = 0;
    if (heapProbe) {
      window.gc();
      await aTimeout(50);
      window.gc();
      baseline = performance.memory.usedJSHeapSize;
    }
    for (let i = 0; i < 30; i++) await cycleOnce(i);
    // DOM debris checks
    expect(document.querySelectorAll('add-to-calendar-button').length, 'no button hosts left').to.equal(0);
    expect(document.querySelectorAll('[id$="-modal-host"]').length, 'no modal hosts left').to.equal(0);
    expect(document.querySelectorAll('script[id^="atcb-schema-"]').length, 'no schema scripts left').to.equal(0);
    expect(document.body.classList.contains('atcb-modal-no-scroll'), 'no scroll lock left').to.equal(false);
    if (heapProbe) {
      window.gc();
      await aTimeout(100);
      window.gc();
      const growth = performance.memory.usedJSHeapSize - baseline;
      // bound sized for gc jitter across chrome variants: an actual leak (one retained
      // shadow tree per cycle) would grow far beyond this across 30 cycles
      expect(growth, `heap growth ${(growth / 1024 / 1024).toFixed(2)} MB after 30 cycles`).to.be.lessThan(3 * 1024 * 1024);
    }
  });
});
