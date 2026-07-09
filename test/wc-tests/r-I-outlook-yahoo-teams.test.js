/**
 * Reduced Suite - Group I/J/K: Outlook (MS365 + Outlook.com), Yahoo, MS Teams (plan §10)
 * Recurring deactivates Yahoo + ALL Microsoft options - covered in r-E; cross-checked here.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb, baseEvent } from '../helpers/mount.js';
import { interceptWindowOpen } from '../helpers/capture.js';
import { clickSingleton, openList, renderedOptions } from '../helpers/dom.js';
import { CFG, utcClean } from '../fixtures/events.js';

async function urlFor(config, optionAttr, id) {
  const wo = interceptWindowOpen();
  try {
    const { host } = await mountAtcb({ ...config, options: optionAttr, trigger: 'click', identifier: id });
    await clickSingleton(host);
    expect(wo.calls.length).to.equal(1);
    return wo.calls[0].url;
  } finally {
    wo.restore();
  }
}

describe('Group I - Outlook (MS365 + Outlook.com)', () => {
  it('I-01: MS365 desktop compose URL with startdt/enddt/subject/location/body', async () => {
    const raw = await urlFor(CFG.singleTimedNY, "'Microsoft365'", 'atcb-i01');
    expect(raw.startsWith('https://outlook.office.com/calendar/0/action/compose?rru=addevent')).to.equal(true);
    const url = new URL(raw);
    expect(url.searchParams.get('subject')).to.equal('NY Timed');
    expect(url.searchParams.get('location')).to.equal('NYC');
    expect(url.searchParams.get('body')).to.include('desc');
    expect(url.searchParams.get('startdt')).to.include('2050-06-15');
    expect(url.searchParams.get('enddt')).to.include('2050-06-15');
  });

  it('I-02: Outlook.com uses outlook.live.com with same params', async () => {
    const raw = await urlFor(CFG.singleTimedNY, "'Outlook.com'", 'atcb-i02');
    expect(raw.startsWith('https://outlook.live.com/calendar/0/action/compose?rru=addevent')).to.equal(true);
    const url = new URL(raw);
    expect(url.searchParams.get('subject')).to.equal('NY Timed');
  });

  it('I-01b: MS365 mobile flavor uses the deeplink base', async () => {
    const raw = await urlFor({ ...CFG.singleTimedNY, fakeMobile: 'true' }, "'Microsoft365'", 'atcb-i01b');
    expect(raw).to.include('/calendar/0/deeplink/compose?path=');
  });

  it('I-03: all-day event sets allday=true for both Outlook variants', async () => {
    const u1 = new URL(await urlFor(CFG.allDaySingle, "'Microsoft365'", 'atcb-i03a'));
    expect(u1.searchParams.get('allday')).to.equal('true');
    const u2 = new URL(await urlFor(CFG.allDaySingle, "'Outlook.com'", 'atcb-i03b'));
    expect(u2.searchParams.get('allday')).to.equal('true');
  });

  it('I-04: recurring removes both Outlook options from the list', async () => {
    const { host } = await mountAtcb(baseEvent({ recurrence: 'daily', recurrence_count: 5, trigger: 'click', identifier: 'atcb-i04' }));
    await openList(host);
    const opts = renderedOptions(host);
    expect(opts).to.not.include('ms365');
    expect(opts).to.not.include('outlookcom');
  });

  it('I-05: online event -> URL in location and kept in body', async () => {
    const url = new URL(await urlFor(CFG.onlineEvent, "'Microsoft365'", 'atcb-i05'));
    expect(url.searchParams.get('location')).to.equal('https://meet.example.com/room-1');
  });
});

describe('Group J - Yahoo', () => {
  it('J-01: timed event -> v=60 URL with st/et/title/in_loc/desc', async () => {
    const raw = await urlFor(CFG.singleTimedNY, "'Yahoo'", 'atcb-j01');
    expect(raw.startsWith('https://calendar.yahoo.com/?v=60')).to.equal(true);
    const url = new URL(raw);
    expect(url.searchParams.get('title')).to.equal('NY Timed');
    expect(url.searchParams.get('in_loc')).to.equal('NYC');
    expect(url.searchParams.get('st')).to.equal(utcClean('2050-06-15', '10:00', '-04:00'));
    expect(url.searchParams.get('et')).to.equal(utcClean('2050-06-15', '11:00', '-04:00'));
  });

  it('J-02: single all-day -> dur=allday with start only', async () => {
    const url = new URL(await urlFor(CFG.allDaySingle, "'Yahoo'", 'atcb-j02'));
    expect(url.searchParams.get('dur')).to.equal('allday');
    expect(url.searchParams.get('st')).to.include('20501225');
    expect(url.searchParams.get('et'), 'single all-day sets no et').to.equal(null);
  });

  it('J-02b: multi-day all-day falls back to timed range (Yahoo workaround)', async () => {
    const url = new URL(await urlFor(CFG.multiDayAllDay, "'Yahoo'", 'atcb-j02b'));
    expect(url.searchParams.get('dur')).to.equal(null);
    expect(url.searchParams.get('st')).to.exist;
    expect(url.searchParams.get('et')).to.exist;
  });

  it('J-03: recurring removes the Yahoo option from the list', async () => {
    const { host } = await mountAtcb(baseEvent({ recurrence: 'daily', recurrence_count: 5, trigger: 'click', identifier: 'atcb-j03' }));
    await openList(host);
    expect(renderedOptions(host)).to.not.include('yahoo');
  });
});

describe('Group K - MS Teams', () => {
  it('K-01: timed event -> teams meeting/new URL with subject and times', async () => {
    const raw = await urlFor(CFG.singleTimedNY, "'MicrosoftTeams'", 'atcb-k01');
    expect(raw.startsWith('https://teams.microsoft.com/l/meeting/new?')).to.equal(true);
    const url = new URL(raw);
    expect(url.searchParams.get('subject')).to.equal('NY Timed');
    expect(url.searchParams.get('startTime')).to.include('2050-06-15');
  });

  it('K-02: all-day event still produces a valid teams URL', async () => {
    const raw = await urlFor(CFG.allDaySingle, "'MicrosoftTeams'", 'atcb-k02');
    expect(raw.startsWith('https://teams.microsoft.com/l/meeting/new?')).to.equal(true);
    expect(raw).to.include('startTime=');
  });

  it('K-03: subscribe mode removes Teams from the list', async () => {
    const { host } = await mountAtcb({
      name: 'Sub',
      subscribe: 'true',
      icsFile: 'https://example.com/cal.ics',
      options: "['Google','MicrosoftTeams','Apple']",
      trigger: 'click',
      identifier: 'atcb-k03',
    });
    await openList(host);
    expect(renderedOptions(host)).to.not.include('msteams');
  });

  it('K-06: recurring removes Teams from the list (Microsoft family rule)', async () => {
    const { host } = await mountAtcb(baseEvent({ recurrence: 'daily', recurrence_count: 5, trigger: 'click', identifier: 'atcb-k06' }));
    await openList(host);
    expect(renderedOptions(host)).to.not.include('msteams');
  });
});
