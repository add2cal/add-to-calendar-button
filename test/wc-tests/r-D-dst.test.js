/**
 * Reduced Suite - Group D: DST & timezone corners (plan §5)
 * Highest-bug-risk surface: events around the 2050 DST transitions.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton, modalHost } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { DST } from '../fixtures/events.js';

/**
 * Google receives wall-clock + ctz (no offsets visible), so the numeric DST-offset
 * math (timezones-ical-library) is verified via the TEAMS url, which carries
 * full ISO strings WITH offsets.
 */
async function teamsTimes(config, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: "'MicrosoftTeams'", trigger: 'click', identifier: id });
    await clickSingleton(host);
    const url = new URL(wo.calls[0].url);
    return { start: url.searchParams.get('startTime'), end: url.searchParams.get('endTime') };
  } finally {
    wo.restore();
  }
}

function iso(c, time, offset) {
  return `${c.startDate}T${time}:00${offset}`;
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
    const t = await teamsTimes(c, 'atcb-d01');
    expect(t.start).to.equal(iso(c, c.startTime, c.expectOffset));
    expect(t.end).to.equal(iso(c, c.endTime, c.expectOffset));
  });

  it('D-02: NY event after spring-forward uses EDT (-04:00)', async () => {
    const c = DST.nyPostSpring;
    const t = await teamsTimes(c, 'atcb-d02');
    expect(t.start).to.equal(iso(c, c.startTime, c.expectOffset));
    expect(t.end).to.equal(iso(c, c.endTime, c.expectOffset));
  });

  it('D-03: NY event SPANNING spring-forward -> start EST, end EDT, wall-clock ICS literals', async () => {
    const c = DST.nySpanSpring;
    const t = await teamsTimes(c, 'atcb-d03a');
    expect(t.start).to.equal(iso(c, c.startTime, '-05:00'));
    expect(t.end).to.equal(iso(c, c.endTime, '-04:00'));
    const ev = await icsEvent(c, 'atcb-d03b');
    expect(ev.prop('DTSTART')).to.include('20500313T010000');
    expect(ev.prop('DTEND')).to.include('20500313T040000');
  });

  it('D-04: NY event before fall-back uses EDT (-04:00)', async () => {
    const c = DST.nyPreFall;
    const t = await teamsTimes(c, 'atcb-d04');
    expect(t.start).to.equal(iso(c, c.startTime, c.expectOffset));
  });

  it('D-05: NY event after fall-back uses EST (-05:00)', async () => {
    const c = DST.nyPostFall;
    const t = await teamsTimes(c, 'atcb-d05');
    expect(t.start).to.equal(iso(c, c.startTime, c.expectOffset));
  });

  it('D-06: NY event SPANNING fall-back -> start EDT, end EST', async () => {
    const c = DST.nySpanFall;
    const t = await teamsTimes(c, 'atcb-d06');
    expect(t.start).to.equal(iso(c, c.startTime, '-04:00'));
    expect(t.end).to.equal(iso(c, c.endTime, '-05:00'));
  });

  it('D-08: Sydney autumn transition (+11 -> +10) applies per date', async () => {
    const a = DST.sydneyAutumn;
    const ta = await teamsTimes(a, 'atcb-d08a');
    expect(ta.start).to.equal(iso(a, a.startTime, a.expectOffset));
    const b = DST.sydneyWinter;
    const tb = await teamsTimes(b, 'atcb-d08b');
    expect(tb.start).to.equal(iso(b, b.startTime, b.expectOffset));
  });

  it('D-09: Tokyo unaffected by NY DST date', async () => {
    const c = DST.tokyoDuringNyDst;
    const t = await teamsTimes(c, 'atcb-d09');
    expect(t.start).to.equal(iso(c, c.startTime, c.expectOffset));
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
      const modal = modalHost(host);
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
