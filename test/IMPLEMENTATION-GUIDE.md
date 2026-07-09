# Test Suite Implementation Guide (add-to-calendar-button)

Originally written as the kick-off brief for implementing the suite; kept as the reference for anyone (human or AI) extending it. The initial implementation now lives in `test/wc-tests/r-*.test.js` (Reduced Suite) and `test/wc-tests-full/f-*.test.js` (Full Cartesian Suite).

---

## What this covers

A comprehensive behavior-driven test suite for **add-to-calendar-button**. The full case list is `test/PLAN.md` — every test name references its plan ID.

The full plan lives in `test/PLAN.md` (save it from the original chat doc before starting). It contains ~256 hand-written **Reduced Suite** cases (R-tier, for PR runs) and ~775 parameterized **Full Cartesian Suite** cases (F-tier, for production-release runs), all with stable IDs (e.g. `A-01`, `E-13d`, `F.T3b`) you must reference in your `it()` names.

## Stack & tooling — non-negotiable

| What | Why |
|------|-----|
| `@open-wc/testing` v3+ | matches existing repo stack; `fixture()`, Chai-flavored `expect`, `aTimeout`, `oneEvent`, `elementUpdated` |
| `@web/test-runner` (already devDep) | runs Mocha in real Chromium via Puppeteer |
| `sinon` | spies/stubs for `fetch`, `window.dataLayer`, `Intl.DateTimeFormat`, `navigator.userAgent` |
| `mocha-each` (optional) | clean parametrization in F-suite; plain `for` loops also work |
| `chai-jest-snapshot` (optional) | full-document ICS snapshot regressions in Group U |
| `@web/test-runner-playwright` | nightly cross-browser tier (Chromium + Firefox + WebKit) |

**Do NOT introduce Vitest**, Jest, or jsdom. The plan was originally drafted for Vitest but switched to open-wc to align with the existing test setup.

## Existing test files — keep, build alongside

```
test/server-side-init.test.js          # CJS import smoke; covers U-15
test/wc-tests/wc-load.test.js          # WC init smoke; covers part of A-01
test/wc-tests/recurrence-tz.test.js    # Berlin midnight regression; covers U-01
```

The existing `npm run test` script picks up new `test/wc-tests/*.test.js` files automatically.

## Phase 1 — Setup verification

```bash
npm run test                # confirm existing tests pass
npm install --save-dev sinon mocha-each chai-jest-snapshot @web/test-runner-playwright
```

Add npm scripts to `package.json`:

```json
{
  "scripts": {
    "test": "node test/test-prep.js && npx web-test-runner test/wc-tests/{wc-load,recurrence-tz,r-*}.test.js --node-resolve",
    "test:prod": "node test/test-prep.js && npx web-test-runner test/wc-tests/{wc-load,recurrence-tz,r-*,f-*}.test.js --node-resolve",
    "test:cross": "node test/test-prep.js && npx web-test-runner test/wc-tests/{wc-load,recurrence-tz,r-*,f-*}.test.js --node-resolve --playwright --browsers chromium firefox webkit"
  }
}
```

Create directories: `test/helpers/`, `test/fixtures/`, `test/__snapshots__/`. Save the plan as `test/PLAN.md`.

## Phase 2 — Helpers & fixtures (build before any test cases)

These are dependencies for everything. Get them right first.

```
test/helpers/
├── mount.js          # mountAtcb(config) → { host, shadow }
├── env.js            # setUA(profile), setTz(ianaName)
├── pro.js            # mockProFetch(payload, opts), mockBookings(seats)
├── ics.js            # parseIcs(host, option='apple') → { raw, vcalendar }
├── url.js            # getCalendarUrl(host, option) → URL object
├── options.js        # assertOptionAbsent(host, option)
├── interaction.js    # clickOption(host, option), openList(host)
├── datalayer.js      # resetDataLayer(), pushedDataLayerEvents()
├── csp-iframe.js     # mountInCspIframe(config, cspMeta) → for U-22..25
└── timers.js         # withFakeTimers(fn) → for A-11, U-26, U-27

test/fixtures/
├── pro-evt-config.json    # mock for proKey a37c97ad-f650-4d94-81e7-65c999939e11 (regular event)
├── pro-rsvp-config.json   # mock for proKey a3cdf9da-1d43-4dc8-a8a1-5e726666c635 (RSVP)
├── ua-profiles.js         # 14 OS×Browser UA strings keyed by env-cluster id
├── dst-events.js          # 2025 NY/Berlin/Sydney pre/post/span DST configs
├── rrule-cases.js         # [{id, input, expected: {ical, googleRecur}}]
└── matrix.js              # ENVS, CONFIGS, OUTPUTS, RRULE_SHAPES, BUTTON_STYLES, LANGUAGES + isValid(env, cfg, out)
```

Reference helper signatures (write these out fully):

```js
// helpers/mount.js
import { fixture, html } from '@open-wc/testing';

export async function mountAtcb(config) {
  // Serialize object/array configs to JSON-string attributes
  // (options, dates, rsvp, ty, customLabels, customVar, images)
  const attrs = Object.entries(config).map(([k, v]) => {
    const value = typeof v === 'object' ? JSON.stringify(v) : v;
    return `${k}="${String(value).replace(/"/g, '&quot;')}"`;
  }).join(' ');
  
  const el = await fixture(html`<add-to-calendar-button ${attrs}></add-to-calendar-button>`);
  await el.whenInitialized();
  return { host: el, shadow: el.shadowRoot };
}

// helpers/datalayer.js
import sinon from 'sinon';

let pushSpy;
export function resetDataLayer() {
  window.dataLayer = [];
  pushSpy = sinon.spy(window.dataLayer, 'push');
}
export function pushedDataLayerEvents() {
  return pushSpy.args.map(([evt]) => evt).filter(e => e?.category?.startsWith('Add-to-Calendar-'));
}

// helpers/pro.js
export function mockProFetch(payload, { status = 200, networkError = false } = {}) {
  return sinon.stub(window, 'fetch').callsFake(async (url) => {
    if (typeof url === 'string' && url.includes('event.caldn.net') && url.endsWith('config.json')) {
      if (networkError) throw new Error('network');
      return new Response(JSON.stringify(payload), { status });
    }
    // pass through everything else (or fail loudly)
    throw new Error(`Unexpected fetch in test: ${url}`);
  });
}

// helpers/ics.js
export function parseIcs(host, calendarOption = 'apple') {
  const link = host.shadowRoot.querySelector(`[data-modal-nr="${calendarOption}"] a, .atcb-list-item-${calendarOption} a`);
  const href = link?.getAttribute('href');
  if (!href?.startsWith('data:text/calendar')) throw new Error('Not an ICS data URI');
  const raw = decodeURIComponent(href.split(',')[1]);
  return { raw, vcalendar: parseVCalendar(raw) };
}

function parseVCalendar(raw) {
  // Minimal parser: extract VEVENTs, VTIMEZONEs, top-level method/prodid
  // Don't pull in a full ICS library — this is enough for assertions
  const events = [...raw.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g)].map(m => parseEvent(m[1]));
  const vtimezones = [...raw.matchAll(/BEGIN:VTIMEZONE([\s\S]*?)END:VTIMEZONE/g)].map(m => m[0]);
  const method = raw.match(/^METHOD:(\w+)/m)?.[1];
  return { events, vtimezones, method };
}
```

## Phase 3 — Group A first

Group A (Lifecycle, 11 cases) is the smallest. Implement it first. If your helpers handle Group A, they'll handle everything else. Pay special attention to **A-11** — it pins the `setTimeout(0)` async init contract using fake timers.

```js
// test/wc-tests/r-A-lifecycle.test.js
import { fixture, html, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { mountAtcb } from '../helpers/mount.js';
import { resetDataLayer, pushedDataLayerEvents } from '../helpers/datalayer.js';

describe('Group A — Lifecycle & registration', () => {
  beforeEach(() => resetDataLayer());
  afterEach(() => sinon.restore());

  it('A-01: minimal config init resolves whenInitialized()', async () => {
    const { host, shadow } = await mountAtcb({ name: 'Test Event', startDate: '2025-06-15' });
    expect(customElements.get('add-to-calendar-button')).to.exist;
    expect(host.getAttribute('atcb-button-id')).to.match(/^atcb-btn-/);
    expect(shadow.querySelector('.atcb-initialized')).to.exist;
    const events = pushedDataLayerEvents();
    expect(events.filter(e => e.event === 'initialization')).to.have.length(1);
  });

  // ... A-02 through A-11
});
```

## Phase 4 — Groups B → U (Reduced Suite, in order)

One file per group. Aim for 2–3 groups per PR. The plan's group letters L through U skip K (no Group K) — match the plan exactly.

```
test/wc-tests/r-A-lifecycle.test.js
test/wc-tests/r-B-validation.test.js
test/wc-tests/r-C-datetime.test.js
test/wc-tests/r-D-dst.test.js
test/wc-tests/r-E-recurring.test.js
test/wc-tests/r-F-multidate.test.js
test/wc-tests/r-G-ics.test.js
test/wc-tests/r-H-google.test.js
test/wc-tests/r-I-outlook-yahoo-teams.test.js   # contains I, J, K cases per plan §10
test/wc-tests/r-L-env.test.js
test/wc-tests/r-M-ui.test.js
test/wc-tests/r-N-datalayer.test.js
test/wc-tests/r-O-i18n.test.js
test/wc-tests/r-P-subscribe.test.js
test/wc-tests/r-Q-richdata.test.js
test/wc-tests/r-R-pro.test.js
test/wc-tests/r-T-rsvp.test.js
test/wc-tests/r-U-edge.test.js
```

## Phase 5 — Full Cartesian (F-templates)

After the Reduced Suite is fully green, implement F-templates. One file per template. Use `mocha-each` or plain loops with clear `${env.id} | ${cfg.id} | ${out.id}` names so failures are easy to triage.

```js
import each from 'mocha-each';
import { ENVS, CONFIGS, OUTPUTS, isValid } from '../fixtures/matrix.js';

const cells = ENVS.flatMap(env =>
  CONFIGS.flatMap(cfg =>
    OUTPUTS.filter(out => isValid(env, cfg, out)).map(out => [env, cfg, out])
  )
);

each(cells).describe('F.T1 | %s | %s | %s', (env, cfg, out) => {
  it('produces correct output', async () => {
    setUA(env.ua);
    const { host } = await mountAtcb({ ...cfg.config, options: [out.option] });
    // assertions per the relevant Reduced Suite group
  });
});
```

## Critical gotchas — DO NOT GLOSS OVER

1. **`recurrence_simplified`** — the internal simplified-RRULE flag, read in BOTH `atcb-validate.js` and `atcb-decorate.js` (the historic `simplyfied` misspelling is FIXED in this codebase). Test E-15 pins the corrected key.

2. **`@preserve` blocks in `atcb-generate-pro.js`** — license guards. RSVP/CTA components abort if `proKey` is absent and host isn't `localhost` or `*.add-to-calendar-pro.com`. T-18/T-19 verify this.

3. **Module-load env detection** — `atcbIsiOS()`, `atcbIsAndroid()`, etc. evaluate when `atcb-globals.js` is imported. Mid-test UA changes via `Object.defineProperty` won't re-trigger detection. Use `fakeMobile`/`fakeIOS`/`fakeAndroid` config flags as the primary mechanism. Reserve `setUA()` for cases where the lib branches on UA directly (WebView detection).

4. **`setTimeout(0)` non-blocking init** — synchronously after `appendChild()`, the element is NOT yet `.atcb-initialized`. Always `await el.whenInitialized()`. A-11 pins this with fake timers.

5. **Real-browser environment** — `@web/test-runner` is real Chromium, not jsdom. CSP, focus, layout, animations all work. Some Vitest mock patterns (`vi.stubGlobal`, etc.) don't apply.

6. **Shadow DOM access** — `host.shadowRoot.querySelector(...)`. Use `@open-wc/testing`'s `dom-helpers` for text-content matching.

7. **dataLayer init** — set `window.dataLayer = []` and spy on `.push` per test. Reset in `beforeEach`. The lib's push is silent if `dataLayer` is undefined (covered by N-10).

8. **PRO fetch mocking** — sinon stub matched on `event.caldn.net/{key}/config.json` URL substring. With `proOverride=true`, fixture can be minimal valid JSON. Without `proOverride`, use the populated fixture.

9. **NO RSVP API tests** — per plan §0 ⚠️ block and §18 top-note: Group T is rendering, validation gates, and license guards ONLY. No POST mocking, no submit flow, no thank-you UI tied to API responses.

10. **Recurring deactivation rule** — when `recurrence` is set, the lib REMOVES Yahoo, MS365, Outlook.com, MS Teams from the dropdown (all envs); Google removed on iOS only. Apple/iCal stays. Hardcode this in `fixtures/matrix.js` `isValid()`.

11. **CSP nonce 2×2 (U-22..25)** — implement via iframe with `srcdoc` containing the `<meta http-equiv="Content-Security-Policy">` tag. The meta tag must be at the top of the iframe HTML to take effect. Listen for `securitypolicyviolation` events to assert blocking.

12. **5ms position-race in `atcb_open` (U-26)** — fake timers required. Synchronously after open: `display === 'none'`. Advance ≥ 5ms: `display === 'block'`.

13. **`buttonStyle="date"` + `location="Global"`** — magic-string combo. UI shows browser-tz-converted time; calendar links keep original tz. M-32 pins both halves in one bundled assertion.

14. **`hideBranding` in PRO mode** — likely doesn't actually hide branding even with `proOverride=true`. M-31 and R-16 are flagged "verify during impl" — pin whatever the lib actually does.

## Conventions

**Test names always start with the case ID:**
```js
it('C-01: NY timed event produces correct ICS, Google, Outlook, Yahoo, Teams URLs', async () => { ... })
it('E-13d: Google option absent on iOS when recurrence is set', async () => { ... })
it('F.T1 | desktop-mac-safari | C01 | apple-ics: correct output', async () => { ... })
```

**Bundled assertions are encouraged.** Per plan §0: one case = one user scenario. Multiple `expect()` per `it()` is good when they share setup. The plan explicitly bundles e.g. dataLayer push + URL correctness in single cases.

**Reference plan IDs in code comments** for "verify during impl" items:
```js
// R-17: invalid proKey format → verify whether validation throws or fetch is just never made
// (see plan §17 — flagged "verify lib's client-side UUID-format check during impl")
```

**Snapshot tests (Group U):** use `chai-jest-snapshot` for full-ICS regression cases (U-02..04, U-19..21). Functional cases use `expect(ics).to.contain(...)`.

## Coverage targets

Configure in `web-test-runner.config.mjs`:
- `./src` line coverage > 90%
- Branch coverage > 85%
- Hot files (`atcb-links.js`, `atcb-decorate.js`, `atcb-util.js`) > 95%

## When you discover something the plan got wrong

If actual lib behavior contradicts the plan:
1. Pin what the lib does TODAY (not what it should do)
2. Add a comment in the test linking back to the plan ID with a `// PLAN MISMATCH: ...` note
3. Tests pin current contract; lib changes are out of scope

## Reference docs

- Test plan: `test/PLAN.md`
- Repo docs: https://add-to-calendar-button.com (configuration, examples, advanced-use)
- PRO docs: https://docs.add-to-calendar-pro.com
- License: Elastic License 2.0 (see `LICENSE` file)

---

That's the brief. Start with Phase 1, then Phase 2 (helpers + fixtures), then Phase 3 (Group A). Show me Group A green before moving on.
