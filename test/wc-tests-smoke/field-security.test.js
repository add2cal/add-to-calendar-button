import { expect } from '@open-wc/testing';
import { rewrite_ical_text, secure_content } from '../../src/core/text.ts';
import { decorate_data } from '../../src/core/decorate.ts';
import { validate } from '../../src/core/validate.ts';
import { generate_ical } from '../../src/generators/ical.ts';
import { parseIcs } from '../helpers/ics.js';

async function config(extra = {}) {
  return decorate_data({ name: 'Security regression', startDate: '2050-06-15', options: ['ical'], ...extra });
}

describe('Field security regressions', () => {
  it('FS-01: real CRLF, CR, and LF stay inside iCalendar TEXT values', () => {
    for (const newline of ['\r\n', '\r', '\n']) {
      expect(rewrite_ical_text('Before' + newline + 'After')).to.equal('Before\\nAfter');
    }
    expect(rewrite_ical_text('a;b,c\\d')).to.equal('a\\;b\\,c\\\\d');
    expect(rewrite_ical_text('Before\\nAfter')).to.equal('Before\\nAfter');
  });

  it('FS-02: hostile event fields cannot create extra properties or events', async () => {
    const payload = 'Before\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nSUMMARY:Injected';
    const data = await config({ name: payload, location: payload, description: payload, icsCategories: [payload], icsReminder: 5 });
    await validate(data);
    const result = generate_ical(null, data, 'ical', 'all', false, true);
    const parsed = parseIcs(result.content);
    expect(parsed.events.length).to.equal(1);
    expect(parsed.lines.filter((line) => line === 'SUMMARY:Injected').length).to.equal(0);
    expect(parsed.lines.filter((line) => line === 'BEGIN:VALARM').length).to.equal(1);
  });

  it('FS-03: parameter values cannot terminate the property or add parameters', () => {
    expect(rewrite_ical_text('A;ROLE=CHAIR:Other\r\nB"^', true)).to.equal('"A;ROLE=CHAIR:Other^nB^\'^^"');
  });

  it('FS-04: URI fields reject real line breaks before ICS generation', async () => {
    for (const extra of [{ icsUrl: 'https://example.com/\r\nX-FIELD:Injected' }, { icsAttach: ['https://example.com/\nX-FIELD:Injected'] }]) {
      let rejected = false;
      try {
        await validate(await config(extra));
      } catch {
        rejected = true;
      }
      expect(rejected).to.equal(true);
    }
  });

  it('FS-05: script tags are rejected recursively before tag stripping', () => {
    for (const value of ['<script>dummy</script>', '<ScRiPt src="https://example.com/dummy.js">', '&lt;script&gt;dummy&lt;/script&gt;', '&#60;script&#62;dummy', '&#x3c;script&#x3e;dummy']) {
      expect(() => secure_content({ name: 'Safe', dates: [{ description: value }] })).to.throw(/script/i);
      expect(() => secure_content(value, false)).to.throw(/script/i);
    }
    expect(secure_content({ name: 'JavaScript workshop', description: '[b]Safe[/b]<br>Text' })).to.deep.equal({ name: 'JavaScript workshop', description: '[b]Safe[/b]<br>Text' });
  });

  it('FS-06: validation catches script tags assembled by custom variables', async () => {
    const data = await config({ name: '<scr%%suffix%%', customVar: { suffix: 'ipt>dummy' } });
    let rejected = false;
    try {
      await validate(data);
    } catch (error) {
      rejected = /script/i.test(error.message);
    }
    expect(rejected).to.equal(true);
  });
});
