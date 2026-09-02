/**
 * Reduced Suite - Group Z: SSR shell hydration (case list: .ai/TEST-CASES.md)
 *
 * The server renders a declarative shadow DOM shell (dist/ssr); the client bundle
 * upgrades the element, keeps the shell painted while it initializes, and swaps in
 * the fully decorated button without layout shift. Browsers without declarative
 * shadow DOM (simulated via innerHTML, which never parses DSD templates) fall back
 * to the plain client-only path.
 */
import { expect } from '@open-wc/testing';
import '../../dist/module/index.js';
import { atcb_generate_ssr_html } from '../../dist/ssr/index.js';
import { proEvtConfig } from '../fixtures/pro.js';
import { muteConsole } from '../helpers/capture.js';

function mountContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

describe('Group Z - SSR shell hydration', () => {
  it('Z-01: the shell paints before init and is swapped for the real button without layout shift', async () => {
    const container = mountContainer();
    try {
      const shellHtml = atcb_generate_ssr_html({ name: 'Z01 Event', startDate: '2050-06-15', identifier: 'atcb-z01', options: ['google', 'apple'] });
      container.setHTMLUnsafe(shellHtml);
      const host = container.querySelector('add-to-calendar-button');
      // pre-hydration: the declarative root exists and the shell button is visible
      expect(host.shadowRoot, 'declarative shadow root adopted').to.not.equal(null);
      const shellBtn = host.shadowRoot.querySelector('[data-atcb-ssr] .atcb-button');
      expect(shellBtn, 'shell button present before init').to.not.equal(null);
      const shellRect = shellBtn.getBoundingClientRect();
      expect(shellRect.height, 'shell actually painted').to.be.greaterThan(10);
      // hydration: the real render replaces the shell
      await host.whenInitialized();
      expect(host.shadowRoot.querySelector('[data-atcb-ssr]'), 'shell removed after init').to.equal(null);
      const realBtn = host.shadowRoot.getElementById('atcb-btn-atcb-z01');
      expect(realBtn, 'real button rendered').to.not.equal(null);
      const realRect = realBtn.getBoundingClientRect();
      expect(Math.abs(realRect.height - shellRect.height), 'height preserved (no layout shift)').to.be.lessThan(3);
      expect(Math.abs(realRect.width - shellRect.width), 'width preserved (no layout shift)').to.be.lessThan(6);
      expect(host.shadowRoot.querySelectorAll('.atcb-initialized').length, 'exactly one wrapper remains').to.equal(1);
    } finally {
      container.remove();
    }
  });

  it('Z-02: hydrated DOM matches a client-only render of the same config', async () => {
    const container = mountContainer();
    try {
      container.setHTMLUnsafe(atcb_generate_ssr_html({ name: 'Z02 Event', startDate: '2050-06-15', identifier: 'atcb-z02a', options: ['google', 'apple'] }));
      const ssrHost = container.querySelector('add-to-calendar-button');
      await ssrHost.whenInitialized();
      const clientHost = document.createElement('add-to-calendar-button');
      clientHost.setAttribute('name', 'Z02 Event');
      clientHost.setAttribute('startDate', '2050-06-15');
      clientHost.setAttribute('identifier', 'atcb-z02b');
      clientHost.setAttribute('options', "['google','apple']");
      container.appendChild(clientHost);
      await clientHost.whenInitialized();
      const normalize = (root, id) => root.shadowRoot.querySelector('.atcb-initialized').outerHTML.replaceAll(id, 'ID').replace(/\s+/g, ' ');
      expect(normalize(ssrHost, 'atcb-z02a'), 'post-init DOM identical to client-only render').to.equal(normalize(clientHost, 'atcb-z02b'));
    } finally {
      container.remove();
    }
  });

  it('Z-03: without declarative shadow DOM the element initializes client-only and drops the inert template', async () => {
    const container = mountContainer();
    try {
      // innerHTML never parses declarative shadow roots - this simulates a browser
      // without DSD support: the template stays an inert light-DOM child
      container.innerHTML = atcb_generate_ssr_html({ name: 'Z03 Event', startDate: '2050-06-15', identifier: 'atcb-z03' });
      const host = container.querySelector('add-to-calendar-button');
      await host.whenInitialized();
      expect(host.querySelector('template'), 'inert template removed from the light DOM').to.equal(null);
      expect(host.shadowRoot.getElementById('atcb-btn-atcb-z03'), 'button rendered via the client-only path').to.not.equal(null);
      expect(host.shadowRoot.querySelector('[data-atcb-ssr]'), 'no shell remnants').to.equal(null);
    } finally {
      container.remove();
    }
  });

  it('Z-04: group overview skeleton stays painted until the fetched list is ready', async () => {
    const container = mountContainer();
    const groupKey = '11111111-2222-3333-4444-555555555555';
    const year = new Date().getFullYear();
    const originalFetch = window.fetch;
    let markRangeRequested;
    const rangeRequested = new Promise((resolve) => {
      markRangeRequested = resolve;
    });
    let resolveRange;
    const rangeResponse = new Promise((resolve) => {
      resolveRange = () =>
        resolve(
          new Response(JSON.stringify([{ prokey: 'overview-event', label: 'Overview event', dates: [{ name: 'Overview event', startDate: `${year}-09-10` }] }]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
    });
    window.fetch = async (url) => {
      const value = String(url);
      if (value === `https://event.caldn.net/${groupKey}/config.json`) {
        return new Response(JSON.stringify(proEvtConfig({ public_event_overview: true })), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (value.startsWith('https://api.add-to-calendar-pro.com/v1/event/all?')) {
        markRangeRequested();
        return rangeResponse;
      }
      return originalFetch(url);
    };
    try {
      container.setHTMLUnsafe(atcb_generate_ssr_html({ prokey: groupKey, groupOverview: true }));
      const host = container.querySelector('add-to-calendar-button');
      const skeleton = host.shadowRoot.querySelector('[data-atcb-ssr] .atcb-ssr-group-overview-skeleton');
      expect(skeleton, 'overview skeleton is present before initialization').to.exist;
      expect(skeleton.getBoundingClientRect().height, 'overview skeleton is painted').to.be.greaterThan(100);
      const selectSkeleton = skeleton.querySelector('.atcb-ssr-group-overview-select').getBoundingClientRect();
      const entrySkeletons = [...skeleton.querySelectorAll('.atcb-ssr-group-overview-entry')];
      expect(entrySkeletons.length, 'two event placeholders').to.equal(2);
      expect(selectSkeleton.width, 'select placeholder is narrower than an event').to.be.lessThan(entrySkeletons[0].getBoundingClientRect().width);
      expect(selectSkeleton.height, 'select placeholder is shorter than an event').to.be.lessThan(entrySkeletons[0].getBoundingClientRect().height);
      await rangeRequested;
      expect(host.shadowRoot.querySelector('[data-atcb-ssr] .atcb-ssr-group-overview-skeleton'), 'SSR skeleton remains during the pending request').to.equal(skeleton);
      resolveRange();
      await host.whenInitialized();
      expect(host.shadowRoot.querySelector('[data-atcb-ssr]'), 'SSR shell removed after the list is ready').to.equal(null);
      expect(host.shadowRoot.querySelector('[part="atcb-group-overview"]'), 'real group overview mounted').to.exist;
      expect(host.shadowRoot.querySelector('[part="atcb-button"]'), 'calendar button never replaces the skeleton').to.equal(null);
    } finally {
      resolveRange?.();
      window.fetch = originalFetch;
      container.remove();
    }
  });

  it('Z-05: failed PRO initialization removes the group loading skeleton', async () => {
    const container = mountContainer();
    const groupKey = 'ffffffff-0000-0000-0000-000000000000';
    const originalFetch = window.fetch;
    const mute = muteConsole();
    window.fetch = async (url) => {
      if (String(url) === `https://event.caldn.net/${groupKey}/config.json`) return new Response('Not found', { status: 404 });
      return originalFetch(url);
    };
    try {
      container.setHTMLUnsafe(atcb_generate_ssr_html({ prokey: groupKey, groupOverview: true }));
      const host = container.querySelector('add-to-calendar-button');
      const skeleton = host.shadowRoot.querySelector('[data-atcb-ssr] .atcb-ssr-group-overview-skeleton');
      expect(skeleton, 'loading skeleton starts painted').to.exist;
      await host.whenInitialized();
      // Do not query a failed-init shadow root; some Chrome builds crash on it.
      expect(skeleton.isConnected, 'stale loading skeleton was detached').to.equal(false);
    } finally {
      mute.restore();
      window.fetch = originalFetch;
      container.remove();
    }
  });
});
