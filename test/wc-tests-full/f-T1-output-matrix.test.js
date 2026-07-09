/**
 * Full Cartesian Suite - F.T1: Output correctness across {Env x Config x Service} (plan §20)
 * Every valid cell mounts the component with the env's fake flags, clicks the service,
 * and asserts the produced URL / ICS is structurally correct.
 */
import { expect } from '@open-wc/testing';
import { mountAtcb } from '../helpers/mount.js';
import { interceptWindowOpen, interceptFileSave } from '../helpers/capture.js';
import { clickSingleton } from '../helpers/dom.js';
import { decodeIcsHref, parseIcs } from '../helpers/ics.js';
import { CFG } from '../fixtures/events.js';
import { ENVS, SERVICES, SERVICE_ATTR, isValid, URL_BASE } from '../fixtures/matrix.js';

const CONFIGS = [
  { id: 'C01-timedNY', cfg: CFG.singleTimedNY },
  { id: 'C07-allday', cfg: CFG.allDaySingle },
  { id: 'C08-multidayTimed', cfg: CFG.multiDayTimed },
  { id: 'C13-recurDaily', cfg: CFG.recurDaily },
  { id: 'C24-online', cfg: CFG.onlineEvent },
];

const cells = [];
for (const env of ENVS) {
  for (const { id, cfg } of CONFIGS) {
    for (const service of SERVICES) {
      if (isValid(env, cfg, service)) cells.push({ env, cfgId: id, cfg, service });
    }
  }
}

describe(`F.T1 - output matrix (${cells.length} valid cells)`, () => {
  for (const { env, cfgId, cfg, service } of cells) {
    const testId = `FT1-${env.id}-${cfgId}-${service}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    it(`F.T1 | ${env.id} | ${cfgId} | ${service}`, async () => {
      const wo = interceptWindowOpen();
      const fs = interceptFileSave();
      try {
        const { host } = await mountAtcb({
          ...cfg,
          ...env.flags,
          options: `'${SERVICE_ATTR[service]}'`,
          trigger: 'click',
          identifier: testId,
        });
        await clickSingleton(host);
        if (service === 'apple' || service === 'ical') {
          expect(fs.saves.length, 'ics file saved').to.equal(1);
          const ics = parseIcs(decodeIcsHref(fs.saves[0].href));
          expect(ics.raw).to.include('BEGIN:VCALENDAR');
          expect(ics.events.length).to.be.greaterThan(0);
          expect(ics.events[0].value('SUMMARY')).to.include(cfg.name);
          if (cfg.recurrence) {
            expect(ics.events[0].prop('RRULE')).to.exist;
          }
          if (!cfg.startTime) {
            expect(ics.events[0].prop('DTSTART')).to.include('VALUE=DATE');
          }
        } else {
          expect(wo.calls.length, 'calendar url opened').to.equal(1);
          const url = wo.calls[0].url;
          const bases = URL_BASE[service];
          expect(
            bases.some((b) => url.startsWith(b)),
            `unexpected base for ${service}: ${url.slice(0, 90)}`,
          ).to.equal(true);
          if (!url.startsWith('intent://')) {
            const parsed = new URL(url);
            const nameParam = { google: 'text', ms365: 'subject', outlookcom: 'subject', msteams: 'subject', yahoo: 'title' }[service];
            expect(parsed.searchParams.get(nameParam), `name transported in ${nameParam}`).to.include(cfg.name);
          }
          if (cfg.recurrence && service === 'google' && !url.startsWith('intent://')) {
            expect(new URL(url).searchParams.get('recur')).to.include('RRULE:');
          }
        }
      } finally {
        wo.restore();
        fs.restore();
      }
    });
  }
});
