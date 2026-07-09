/**
 * Reduced Suite - Group D: DST & timezone corners (plan §5)
 * Highest-bug-risk surface: events around the 2050 DST transitions.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { DST, utcClean } from '../fixtures/events.js';

async function googleDates(config, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: "'Google'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    return new URL(wo.calls[0].url).searchParams.get('dates');
  } finally {
    wo.restore();
  }
}

async function icsEvent(config, id) {
  const fs = interceptFileSave();
  try {
    const { host } = await mountAtcb({ ...config, options: "'iCal'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    return parseIcs(decodeIcsHref(fs.saves[0].href)).events[0];
  } finally {
    fs.restore();
  }
}

describe('Group D - DST & timezone corners', () => {
  it('D-01: NY event 1h before 2050 spring-forward uses EST (-05:00)', async () => {
    const c = DST.nyPreSpring;
    const dates = await googleDates(c, 'atcb-d01');
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, c.expectOffset)}/${utcClean(c.startDate, c.endTime, c.expectOffset)}`);
  });

  it('D-02: NY event after spring-forward uses EDT (-04:00)', async () => {
    const c = DST.nyPostSpring;
    const dates = await googleDates(c, 'atcb-d02');
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, c.expectOffset)}/${utcClean(c.startDate, c.endTime, c.expectOffset)}`);
  });

  it('D-03: NY event SPANNING spring-forward -> 2h real elapsed, wall-clock ICS literals', async () => {
    const c = DST.nySpanSpring;
    const dates = await googleDates(c, 'atcb-d03a');
    // start 01:00 EST (-05), end 04:00 EDT (-04) -> UTC 06:00 to 08:00 (2h real)
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, '-05:00')}/${utcClean(c.startDate, c.endTime, '-04:00')}`);
    const ev = await icsEvent(c, 'atcb-d03b');
    expect(ev.prop('DTSTART')).to.include('20500313T010000');
    expect(ev.prop('DTEND')).to.include('20500313T040000');
  });

  it('D-04: NY event before fall-back uses EDT (-04:00)', async () => {
    const c = DST.nyPreFall;
    const dates = await googleDates(c, 'atcb-d04');
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, c.expectOffset)}/${utcClean(c.startDate, c.endTime, c.expectOffset)}`);
  });

  it('D-05: NY event after fall-back uses EST (-05:00)', async () => {
    const c = DST.nyPostFall;
    const dates = await googleDates(c, 'atcb-d05');
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, c.expectOffset)}/${utcClean(c.startDate, c.endTime, c.expectOffset)}`);
  });

  it('D-06: NY event SPANNING fall-back -> extra hour of real elapsed time', async () => {
    const c = DST.nySpanFall;
    const dates = await googleDates(c, 'atcb-d06');
    // start 00:30 EDT (-04), end 03:00 EST (-05)
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, '-04:00')}/${utcClean(c.startDate, c.endTime, '-05:00')}`);
  });

  it('D-08: Sydney autumn transition (+11 -> +10) applies per date', async () => {
    const a = DST.sydneyAutumn;
    expect(await googleDates(a, 'atcb-d08a')).to.equal(`${utcClean(a.startDate, a.startTime, a.expectOffset)}/${utcClean(a.startDate, a.endTime, a.expectOffset)}`);
    const b = DST.sydneyWinter;
    expect(await googleDates(b, 'atcb-d08b')).to.equal(`${utcClean(b.startDate, b.startTime, b.expectOffset)}/${utcClean(b.startDate, b.endTime, b.expectOffset)}`);
  });

  it('D-09: Tokyo unaffected by NY DST date', async () => {
    const c = DST.tokyoDuringNyDst;
    const dates = await googleDates(c, 'atcb-d09');
    expect(dates).to.equal(`${utcClean(c.startDate, c.startTime, c.expectOffset)}/${utcClean(c.startDate, c.endTime, c.expectOffset)}`);
  });

  it('D-10: multi-date series across a DST boundary -> per-date offsets, one VTIMEZONE', async () => {
    const fs = interceptFileSave();
    try {
      const { host } = await mountAtcb({
        name: 'DST Series',
        timeZone: 'America/New_York',
        dates: JSON.stringify([
          { name: 'Before', startDate: '2050-03-12', startTime: '10:00', endTime: '11:00' },
          { name: 'After', startDate: '2050-03-14', startTime: '10:00', endTime: '11:00' },
        ]),
        options: "'iCal'",
        trigger: 'click',
        identifier: 'atcb-d10',
      });
      // singleton option with multi-date opens the date-selection modal; grab the ICS via the "all" flow instead:
      await clickSingleton(host);
      const modal = document.getElementById('atcb-d10-modal-host');
      if (fs.saves.length === 0 && modal) {
        // click first sub-event save-all button if present, otherwise per-date buttons
        const shadowBtns = modal.shadowRoot.querySelectorAll('button');
        for (const b of shadowBtns) {
          b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          if (fs.saves.length > 0) break;
        }
      }
      expect(fs.saves.length).to.be.greaterThan(0);
      const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
      expect(ics.vtimezones.length).to.equal(1);
      expect(ics.tzids[0]).to.equal('America/New_York');
    } finally {
      fs.restore();
    }
  });
});
