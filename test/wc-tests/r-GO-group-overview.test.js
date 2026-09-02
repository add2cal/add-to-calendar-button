import { expect, aTimeout } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { proEvtConfig, proRsvpConfig } from '../fixtures/pro.js';

const GROUP_KEY = '11111111-2222-3333-4444-555555555555';

function date(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function mockOverview(payload, config = {}) {
  const original = window.fetch;
  const calls = [];
  window.fetch = async (url) => {
    const value = String(url);
    calls.push(value);
    if (value === `https://event.caldn.net/${GROUP_KEY}/config.json` || value === `https://event-dev.caldn.net/${GROUP_KEY}/config.json`) {
      return new Response(JSON.stringify(proEvtConfig({ public_event_overview: true, ...config })), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (/^https:\/\/api(?:-dev)?\.add-to-calendar-pro\.com\/v1\/event\/all\?/.test(value)) {
      return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return original(url);
  };
  return { calls, restore: () => (window.fetch = original) };
}

describe('Group GO - PRO group overview', () => {
  it('GO-01: fetches the public group range, hides the sole current-year select, and renders only populated month choices', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([
      { prokey: 'event-1', label: 'First event', dates: [{ startDate: date(year, 2, 4), location: 'Berlin' }] },
      { prokey: 'event-2', label: 'Second event', dates: [{ startDate: date(year, 7, 8) }] },
    ]);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, dev: true });
      const request = new URL(mock.calls.find((url) => url.includes('/v1/event/all?')));
      expect(request.hostname).to.equal('api-dev.add-to-calendar-pro.com');
      expect(request.pathname).to.equal('/v1/event/all');
      expect(request.searchParams.get('group')).to.equal(GROUP_KEY);
      expect(request.searchParams.get('dates')).to.equal('true');
      expect(request.searchParams.get('from')).to.equal(`${year - 1}-01-01T00:00:00Z`);
      expect([...shadow.querySelectorAll('[part="atcb-group-overview-month-select"] option')].map((option) => option.value)).to.deep.equal(['2', '7']);
      expect(shadow.querySelector('[part="atcb-group-overview-link"]').href).to.equal('https://dev.caldn.net/event-1');
      expect(shadow.querySelector('[part="atcb-group-overview-datetime-icon"] svg')).to.exist;
      expect(shadow.querySelector('[part="atcb-group-overview-location-icon"] svg')).to.exist;
      expect(getComputedStyle(shadow.querySelector('[part="atcb-group-overview-meta"]')).flexDirection).to.equal('column');
      expect(shadow.querySelector('[part="atcb-group-overview-year-select"]')).to.not.exist;
      expect(shadow.querySelector('[part="atcb-button"]')).to.not.exist;
    } finally {
      mock.restore();
    }
  });

  it('GO-09: a public non-subscription group always renders the list', async () => {
    const mock = mockOverview([]);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': false });
      expect(shadow.querySelector('[part="atcb-group-overview"]')).to.exist;
      expect(shadow.querySelector('[part="atcb-button"]')).to.not.exist;
    } finally {
      mock.restore();
    }
  });

  it('GO-10: a public subscription group defaults to its button and can opt into the list', async () => {
    const subscribeConfig = { subscribe: true, icsFile: 'https://example.com/calendar.ics' };
    let mock = mockOverview([], subscribeConfig);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY });
      expect(shadow.querySelector('[part="atcb-button"]')).to.exist;
      expect(shadow.querySelector('[part="atcb-group-overview"]')).to.not.exist;
    } finally {
      mock.restore();
    }
    mock = mockOverview([], subscribeConfig);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true });
      expect(shadow.querySelector('[part="atcb-group-overview"]')).to.exist;
      expect(shadow.querySelector('[part="atcb-button"]')).to.not.exist;
    } finally {
      mock.restore();
    }
  });

  it('GO-11: group-overview has no effect without public_event_overview', async () => {
    for (const publicEventOverview of [false, undefined]) {
      const mock = mockOverview([], { public_event_overview: publicEventOverview });
      try {
        const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true });
        expect(shadow.querySelector('[part="atcb-button"]')).to.exist;
        expect(shadow.querySelector('[part="atcb-group-overview"]')).to.not.exist;
      } finally {
        mock.restore();
      }
    }
  });

  it('GO-12: subscription overview links and calendar actions always use the group key', async () => {
    const year = new Date().getFullYear();
    const eventKey = 'individual-event-key';
    const payload = [{ prokey: eventKey, label: 'Subscription event', dates: [{ name: 'Subscription event', startDate: date(year, 4, 10) }] }];
    const subscribeConfig = { subscribe: true, icsFile: 'https://example.com/calendar.ics' };
    for (const overviewConfig of [{ 'add-via-list': true }, { 'no-details': true }]) {
      const mock = mockOverview(payload, subscribeConfig);
      try {
        const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, 'group-overview-config': overviewConfig });
        const entry = shadow.querySelector('[part="atcb-group-overview-link"]');
        expect(entry.href).to.equal(`https://caldn.net/${GROUP_KEY}`);
        const trigger = shadow.querySelector('[part="atcb-group-overview-add"]') || entry;
        trigger.click();
        await aTimeout(100);
        expect(mock.calls.filter((url) => url.endsWith(`/${GROUP_KEY}/config.json`)).length).to.be.greaterThan(1);
        expect(mock.calls.some((url) => url.endsWith(`/${eventKey}/config.json`))).to.equal(false);
      } finally {
        document.querySelectorAll('[id$="-modal-host"]').forEach((host) => host.remove());
        mock.restore();
      }
    }
  });

  it('GO-13: no-add renders a plain list without links, actions, or add badges', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([{ prokey: 'inactive-event', label: 'Plain event', dates: [{ name: 'Plain event', startDate: date(year, 4, 10) }] }]);
    try {
      for (const type of ['cards', 'compact']) {
        const { shadow } = await mountAtcb({
          prokey: GROUP_KEY,
          'group-overview': true,
          'group-overview-config': { type, 'add-via-list': true, 'no-details': true, 'no-add': true },
        });
        const entry = shadow.querySelector('[part="atcb-group-overview-link"]');
        expect(entry.tagName).to.equal(type === 'compact' ? 'SPAN' : 'DIV');
        expect(entry.hasAttribute('href')).to.equal(false);
        expect(shadow.querySelector('[part="atcb-group-overview-add"]')).to.not.exist;
        const configFetches = mock.calls.filter((url) => url.endsWith(`/${GROUP_KEY}/config.json`)).length;
        entry.click();
        await aTimeout(0);
        expect(mock.calls.filter((url) => url.endsWith(`/${GROUP_KEY}/config.json`)).length).to.equal(configFetches);
      }
    } finally {
      mock.restore();
    }
  });

  it('GO-02: defaults to the current year, keeps its empty state, and duplicates cross-year events into January', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([{ prokey: 'event-cross', label: 'New year event', dates: [{ startDate: date(year - 1, 12, 31), endDate: date(year, 1, 2) }] }]);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true });
      const yearSelect = shadow.querySelector('[part="atcb-group-overview-year-select"]');
      expect(yearSelect.value).to.equal(String(year));
      expect(getComputedStyle(yearSelect).fontWeight).to.equal('700');
      expect(getComputedStyle(yearSelect).cursor).to.equal('pointer');
      yearSelect.focus();
      yearSelect.dispatchEvent(new PointerEvent('pointerdown'));
      yearSelect.dispatchEvent(new Event('change'));
      expect(shadow.activeElement).to.not.equal(yearSelect);
      expect(shadow.querySelector('[part="atcb-group-overview-month-select"] option').value).to.equal('1');
      expect(shadow.querySelector('[part="atcb-group-overview-title"]').textContent).to.equal('New year event');
    } finally {
      mock.restore();
    }
  });

  it('GO-03: years-only renders month headings and compact custom-domain links', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([{ prokey: 'event-compact', label: 'Compact event', dates: [{ startDate: date(year, 3, 12), description: 'line one\nline two' }] }]);
    try {
      const { shadow } = await mountAtcb({
        prokey: GROUP_KEY,
        'group-overview': true,
        'group-overview-config': { 'years-only': true, type: 'compact', 'custom-domain': 'events.acme.com', 'add-via-list': true },
      });
      expect(shadow.querySelector('[part="atcb-group-overview-month-select"]')).to.not.exist;
      expect(shadow.querySelector('[part="atcb-group-overview-month-heading"]')).to.exist;
      expect(shadow.querySelector('[part="atcb-group-overview-link"]').href).to.equal('https://events.acme.com/event-compact');
      expect(shadow.querySelector('[part="atcb-group-overview-add"]').textContent).to.equal('+');
      expect(shadow.querySelector('.atcb-group-overview-compact-row').firstElementChild.getAttribute('part')).to.equal('atcb-group-overview-add');
      expect(shadow.querySelector('.atcb-group-overview-compact-with-add')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('GO-04: no-details opens RSVP events via atcb_action without an add badge', async () => {
    const year = new Date().getFullYear();
    const eventKey = 'event-action';
    const original = window.fetch;
    const calls = [];
    window.fetch = async (url) => {
      const value = String(url);
      calls.push(value);
      if (value.includes('/v1/event/all?')) return new Response(JSON.stringify([{ prokey: eventKey, label: `Action event, ${date(year, 5, 10)}, RSVP`, dates: [{ name: 'Action event', startDate: date(year, 5, 10) }] }]), { status: 200 });
      if (value === `https://event-dev.caldn.net/${GROUP_KEY}/config.json`) {
        return new Response(JSON.stringify(proEvtConfig({ public_event_overview: true })), { status: 200 });
      }
      if (value === `https://event-dev.caldn.net/${eventKey}/config.json`) {
        return new Response(JSON.stringify(proRsvpConfig({ name: 'Action event', inlineRsvp: true, dates: [{ name: 'Action event', startDate: date(year, 5, 10) }] })), { status: 200 });
      }
      if (value.includes('api-dev.add-to-calendar-pro.com')) return new Response(JSON.stringify({ total: '0' }), { status: 200 });
      throw new Error(`Unexpected fetch: ${value}`);
    };
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, dev: true, 'style-light': '--modal-background: rgb(1, 2, 3);', 'group-overview-config': { 'add-via-list': true, 'no-details': true } });
      expect(shadow.querySelector('[part="atcb-group-overview-add"]')).to.not.exist;
      shadow.querySelector('[part="atcb-group-overview-link"]').click();
      await aTimeout(200);
      expect(calls).to.include(`https://event-dev.caldn.net/${eventKey}/config.json`);
      const modalHost = document.querySelector('[id$="-modal-host"]');
      expect(modalHost).to.exist;
      expect(modalHost.shadowRoot.querySelector('form')).to.exist;
      expect(shadow.querySelector('form')).to.not.exist;
      expect(getComputedStyle(modalHost.shadowRoot.querySelector('.atcb-modal-box')).backgroundColor).to.equal('rgb(1, 2, 3)');
    } finally {
      window.fetch = original;
    }
  });

  it('GO-05: linked RSVP events suppress their independent add badge', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([{ prokey: 'event-rsvp', label: `RSVP event, ${date(year, 6, 10)}, RSVP`, dates: [{ name: 'RSVP event', startDate: date(year, 6, 10) }] }]);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, 'group-overview-config': { 'add-via-list': true } });
      expect(shadow.querySelector('[part="atcb-group-overview-add"]')).to.not.exist;
      expect(shadow.querySelector('[part="atcb-group-overview-link"]').href).to.equal('https://caldn.net/event-rsvp');
    } finally {
      mock.restore();
    }
  });

  it('GO-06: compact no-details entries do not render an add badge', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([{ prokey: 'event-compact-action', label: 'Compact action', dates: [{ name: 'Compact action', startDate: date(year, 8, 10) }] }]);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, 'group-overview-config': { type: 'compact', 'add-via-list': true, 'no-details': true } });
      expect(shadow.querySelector('[part="atcb-group-overview-add"]')).to.not.exist;
      expect(shadow.querySelector('[part="atcb-group-overview-link"]')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('GO-07: compact RSVP entries use an aligned dot beside regular add badges', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([
      { prokey: 'event-regular', label: 'Regular event', dates: [{ name: 'Regular event', startDate: date(year, 9, 10) }] },
      { prokey: 'event-rsvp-compact', label: `RSVP event, ${date(year, 9, 11)}, RSVP`, dates: [{ name: 'RSVP event', startDate: date(year, 9, 11) }] },
    ]);
    try {
      const { shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, 'group-overview-config': { type: 'compact', 'add-via-list': true } });
      const regularItem = shadow.querySelector('[href="https://caldn.net/event-regular"]').closest('li');
      const rsvpItem = shadow.querySelector('[href="https://caldn.net/event-rsvp-compact"]').closest('li');
      expect(regularItem.querySelector('[part="atcb-group-overview-add"]')).to.exist;
      expect(rsvpItem.querySelector('[part="atcb-group-overview-add"]')).to.not.exist;
      expect(rsvpItem.querySelector('[part="atcb-group-overview-marker"]')).to.exist;
    } finally {
      mock.restore();
    }
  });

  it('GO-08: cards respond to their container with one, two, or three equal columns', async () => {
    const year = new Date().getFullYear();
    const mock = mockOverview([
      { prokey: 'card-1', label: 'Card 1', dates: [{ name: 'Card 1', startDate: date(year, 10, 10) }] },
      { prokey: 'card-2', label: 'Card 2', dates: [{ name: 'Card 2', startDate: date(year, 10, 11) }] },
      { prokey: 'card-3', label: 'Card 3', dates: [{ name: 'Card 3', startDate: date(year, 10, 12) }] },
    ]);
    try {
      const { host, shadow } = await mountAtcb({ prokey: GROUP_KEY, 'group-overview': true, 'group-overview-config': { type: 'cards', 'add-via-list': true } });
      const wrapper = host.parentElement;
      const cards = [...shadow.querySelectorAll('[part="atcb-group-overview-event"]')];
      const firstContent = cards[0].querySelector('.atcb-group-overview-content');
      expect(firstContent.firstElementChild.getAttribute('part')).to.equal('atcb-group-overview-datetime');
      expect(parseFloat(getComputedStyle(firstContent.firstElementChild).fontSize)).to.be.greaterThan(parseFloat(getComputedStyle(firstContent.querySelector('[part="atcb-group-overview-title"]')).fontSize));
      wrapper.style.width = '500px';
      await aTimeout(0);
      expect(cards[0].getBoundingClientRect().top).to.not.equal(cards[1].getBoundingClientRect().top);
      const listRect = shadow.querySelector('[part="atcb-group-overview-list"]').getBoundingClientRect();
      const addRect = cards[0].querySelector('[part="atcb-group-overview-add"]').getBoundingClientRect();
      expect(listRect.right - addRect.right).to.be.greaterThan(5);
      wrapper.style.width = '850px';
      await aTimeout(0);
      expect(cards[0].getBoundingClientRect().top).to.equal(cards[1].getBoundingClientRect().top);
      expect(cards[1].getBoundingClientRect().left - cards[0].querySelector('[part="atcb-group-overview-add"]').getBoundingClientRect().right).to.be.greaterThan(5);
      expect(cards[2].getBoundingClientRect().top).to.not.equal(cards[1].getBoundingClientRect().top);
      expect(Math.abs(cards[0].getBoundingClientRect().width - cards[2].getBoundingClientRect().width)).to.be.lessThan(1);
      wrapper.style.width = '1100px';
      await aTimeout(0);
      expect(cards[0].getBoundingClientRect().top).to.equal(cards[2].getBoundingClientRect().top);
      expect(parseFloat(getComputedStyle(shadow.querySelector('[part="atcb-group-overview-list"]')).paddingRight)).to.be.greaterThan(0);
      wrapper.style.width = '1400px';
      await aTimeout(0);
      expect(host.getBoundingClientRect().width).to.be.at.most(1200);
    } finally {
      mock.restore();
    }
  });
});
