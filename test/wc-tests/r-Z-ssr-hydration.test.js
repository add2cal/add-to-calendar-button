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
});
