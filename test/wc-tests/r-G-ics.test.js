/**
 * Reduced Suite - Group G: ICS / Apple output (case list: .ai/TEST-CASES.md)
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs, unfoldIcs } from '../helpers/ics.js';
import { CFG } from '../fixtures/events.js';

async function icsFor(config, id) {
  const fs = interceptFileSave();
  try {
    const { host } = await mountAtcb({ ...config, options: "'iCal'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    expect(fs.saves.length).to.equal(1);
    return { ics: parseIcs(decodeIcsHref(fs.saves[0].href)), save: fs.saves[0] };
  } finally {
    fs.restore();
  }
}

describe('Group G - ICS / Apple output', () => {
  it('G-01: VCALENDAR structure with version + prodid', async () => {
    const { ics } = await icsFor(CFG.singleTimedNY, 'atcb-g01');
    expect(ics.raw).to.include('BEGIN:VCALENDAR');
    expect(ics.raw).to.include('END:VCALENDAR');
    expect(ics.prop('VERSION')).to.include('2.0');
    expect(ics.prodid).to.include('add-to-calendar');
    expect(ics.prop('CALSCALE')).to.include('GREGORIAN');
  });

  it('G-02: no organizer -> METHOD:PUBLISH, no ORGANIZER line', async () => {
    const { ics } = await icsFor(CFG.singleTimedNY, 'atcb-g02');
    expect(ics.method).to.equal('PUBLISH');
    expect(ics.events[0].prop('ORGANIZER')).to.not.exist;
  });

  it('G-03: organizer set -> METHOD:REQUEST + ORGANIZER CN/mailto', async () => {
    const { ics } = await icsFor({ ...CFG.singleTimedNY, organizer: 'Jane Doe|jane@example.com' }, 'atcb-g03');
    expect(ics.method).to.equal('REQUEST');
    const org = ics.events[0].prop('ORGANIZER');
    expect(org).to.include('CN=Jane Doe');
    expect(org.toLowerCase()).to.include('mailto:jane@example.com');
  });

  it('G-04: attendee line rendered with organizer present', async () => {
    const { ics } = await icsFor({ ...CFG.singleTimedNY, organizer: 'Jane Doe|jane@example.com', attendee: 'John Guest|john@example.com' }, 'atcb-g04');
    const att = ics.events[0].prop('ATTENDEE');
    expect(att).to.exist;
    expect(att.toLowerCase()).to.include('mailto:john@example.com');
  });

  it('G-05: auto UID is a stable UUID per render', async () => {
    const { ics } = await icsFor(CFG.singleTimedNY, 'atcb-g05');
    const uid = ics.events[0].value('UID');
    expect(uid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('G-06: supplied UID preserved verbatim (word chars + dashes only per RFC 7986)', async () => {
    const { ics } = await icsFor({ ...CFG.singleTimedNY, uid: 'my-custom-uid-123' }, 'atcb-g06');
    expect(ics.events[0].value('UID')).to.equal('my-custom-uid-123');
  });

  it('G-06b: UID with forbidden characters falls back to a generated UUID', async () => {
    // the lib validates uid against /^(?:\w|-){1,254}$/ and regenerates on mismatch
    const { ics } = await icsFor({ ...CFG.singleTimedNY, uid: 'invalid@uid.com' }, 'atcb-g06b');
    const uid = ics.events[0].value('UID');
    expect(uid).to.not.equal('invalid@uid.com');
    expect(uid).to.match(/^[0-9a-f-]{36}$/i);
  });

  it('G-07: SUMMARY special characters are escaped per RFC 5545', async () => {
    const { ics } = await icsFor({ ...CFG.singleTimedNY, name: 'A, B; C' }, 'atcb-g07');
    const summary = ics.events[0].value('SUMMARY');
    expect(summary).to.include('A\\, B\\; C');
  });

  it('G-08: HTML in description is stripped for the plain DESCRIPTION', async () => {
    const { ics } = await icsFor({ ...CFG.singleTimedNY, description: 'Hello [strong]World[/strong] [br] line2 [url]https://example.com[/url]' }, 'atcb-g08');
    const desc = ics.events[0].value('DESCRIPTION');
    expect(desc).to.exist;
    expect(desc).to.not.include('[strong]');
    expect(desc).to.not.include('<strong>');
  });

  it('G-09/G-10: location preserved (URL and plain text)', async () => {
    const { ics: icsUrl } = await icsFor({ ...CFG.singleTimedNY, location: 'https://meet.example.com/x' }, 'atcb-g09');
    expect(icsUrl.events[0].value('LOCATION')).to.include('https://meet.example.com/x');
    const { ics: icsTxt } = await icsFor({ ...CFG.singleTimedNY, location: 'Main Hall, Building 5' }, 'atcb-g10');
    expect(icsTxt.events[0].value('LOCATION')).to.include('Main Hall');
  });

  it('G-11: STATUS, SEQUENCE, CREATED, LAST-MODIFIED preserved when supplied', async () => {
    const { ics } = await icsFor(
      {
        ...CFG.singleTimedNY,
        status: 'TENTATIVE',
        sequence: 3,
        created: '20240101T101010Z',
        updated: '20240202T101010Z',
      },
      'atcb-g11',
    );
    const ev = ics.events[0];
    expect(ev.prop('STATUS')).to.include('TENTATIVE');
    expect(ev.prop('SEQUENCE')).to.include('3');
    expect(ev.prop('CREATED')).to.include('20240101T101010Z');
    expect(ev.prop('LAST-MODIFIED')).to.include('20240202T101010Z');
  });

  it('G-12: hosted icsFile is downloaded directly (no inline ICS built)', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ ...CFG.singleTimedNY, icsFile: 'https://example.com/hosted.ics', options: "'iCal'", trigger: 'click', identifier: 'atcb-g12' });
      await clickSingleton(host);
      expect(fs.saves.length).to.equal(1);
      expect(fs.saves[0].href).to.equal('https://example.com/hosted.ics');
    } finally {
      fs.restore();
    }
  });

  it('G-16: long description folds to RFC 5545 line lengths and unfolds losslessly', async () => {
    const longDesc = 'Lorem ipsum dolor sit amet '.repeat(30).trim();
    const { ics } = await icsFor({ ...CFG.singleTimedNY, description: longDesc }, 'atcb-g16');
    const foldedLines = ics.raw.split(/\r\n|\n/);
    for (const line of foldedLines) {
      expect(line.length, `folded line too long: ${line.slice(0, 60)}...`).to.be.at.most(75);
    }
    expect(unfoldIcs(ics.raw).replace(/\\,/g, ',')).to.include('Lorem ipsum dolor sit amet');
  });

  it('G-17: custom iCalFileName is used for the download', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ ...CFG.singleTimedNY, iCalFileName: 'my-event-file', options: "'iCal'", trigger: 'click', identifier: 'atcb-g17' });
      await clickSingleton(host);
      expect(fs.saves[0].download).to.equal('my-event-file.ics');
    } finally {
      fs.restore();
    }
  });

  it('G-20: desktop file save targets _blank (mobile would use _self)', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({ ...CFG.singleTimedNY, options: "'iCal'", trigger: 'click', identifier: 'atcb-g20' });
      await clickSingleton(host);
      expect(fs.saves[0].target).to.equal('_blank');
    } finally {
      fs.restore();
    }
  });
});
