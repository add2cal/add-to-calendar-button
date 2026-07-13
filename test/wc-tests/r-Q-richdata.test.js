/**
 * Reduced Suite - Group Q: Schema.org rich data (case list: .ai/TEST-CASES.md)
 * Rich data is injected into the light DOM as <script type="application/ld+json" id="atcb-schema-{identifier}">.
 * It requires name + location + startDate and is skipped in subscribe mode.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { btnId } from '../helpers/dom.js';

function schemaFor(host) {
  // schema script id carries the (prefixed) canonical identifier
  const el = document.getElementById('atcb-schema-' + btnId(host));
  if (!el) return null;
  return { el, json: JSON.parse(el.textContent) };
}

describe('Group Q - Schema.org rich data', () => {
  it('Q-01: default event -> Event JSON-LD with core fields', async () => {
    const { host } = await mountAtcb(baseEvent({ identifier: 'atcb-q01' }));
    const schema = schemaFor(host);
    expect(schema, 'schema script injected').to.exist;
    expect(schema.el.getAttribute('type')).to.equal('application/ld+json');
    expect(schema.json['@type']).to.equal('Event');
    expect(schema.json.name).to.equal('Test Event');
    expect(schema.json.startDate).to.include('2050-06-15');
  });

  it('Q-02: hideRichData suppresses the schema script', async () => {
    const { host } = await mountAtcb(baseEvent({ hideRichData: 'true', identifier: 'atcb-q02' }));
    expect(document.getElementById('atcb-schema-' + btnId(host))).to.not.exist;
  });

  it('Q-04: online event -> OnlineEventAttendanceMode + VirtualLocation', async () => {
    const { host } = await mountAtcb(baseEvent({ location: 'https://meet.example.com/room-1', identifier: 'atcb-q04' }));
    const schema = schemaFor(host);
    expect(schema).to.exist;
    const flat = JSON.stringify(schema.json);
    expect(flat).to.include('OnlineEventAttendanceMode');
    expect(flat).to.include('VirtualLocation');
    expect(flat).to.include('https://meet.example.com/room-1');
  });

  it('Q-05: organizer lands in the schema', async () => {
    const { host } = await mountAtcb(baseEvent({ organizer: 'Jane Doe|jane@example.com', identifier: 'atcb-q05' }));
    const schema = schemaFor(host);
    const flat = JSON.stringify(schema.json);
    expect(flat).to.include('Jane Doe');
  });

  it('Q-06: images array is transported', async () => {
    const { host } = await mountAtcb(baseEvent({ images: '["https://example.com/img1.png","https://example.com/img2.png"]', identifier: 'atcb-q06' }));
    const schema = schemaFor(host);
    const img = schema.json.image;
    expect(img).to.be.an('array');
    expect(img).to.include('https://example.com/img1.png');
  });

  it('Q-07: cspnonce is applied to the schema script tag', async () => {
    const { host } = await mountAtcb(baseEvent({ cspnonce: 'test-nonce-123', identifier: 'atcb-q07' }));
    const schema = schemaFor(host);
    expect(schema.el.nonce === 'test-nonce-123' || schema.el.getAttribute('nonce') === 'test-nonce-123').to.equal(true);
  });

  it('Q-08: multi-date -> EventSeries with per-date subEvents', async () => {
    const { host } = await mountAtcb({
      name: 'Series Schema',
      location: 'Venue 5',
      dates: JSON.stringify([
        { name: 'Part 1', startDate: '2050-07-01', location: 'Venue 5' },
        { name: 'Part 2', startDate: '2050-07-08', location: 'Venue 5' },
      ]),
      options: "'Google'",
      identifier: 'atcb-q08',
    });
    const schema = schemaFor(host);
    expect(schema).to.exist;
    const flat = JSON.stringify(schema.json);
    expect(flat).to.include('EventSeries');
    expect(flat).to.include('Part 1');
    expect(flat).to.include('Part 2');
  });

  it('Q-10: subscribe mode never injects rich data', async () => {
    const { host } = await mountAtcb({
      name: 'Sub NoSchema',
      subscribe: 'true',
      icsFile: 'https://example.com/cal.ics',
      location: 'Anywhere',
      startDate: '2050-06-15',
      options: "'Google'",
      identifier: 'atcb-q10',
    });
    expect(document.getElementById('atcb-schema-' + btnId(host))).to.not.exist;
  });
});
