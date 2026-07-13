# Test Strategy (add-to-calendar-button)

Behavior-driven test suite for the add-to-calendar-button web component, running on
`@open-wc/testing` + `@web/test-runner` in a real Chromium browser.

The suite tests by USE CASE, not by internal function: every test mounts the real
component, interacts with it like a user (click, hover, keyboard), and asserts the
observable outcome (rendered options, generated calendar URL, downloaded ICS content,
dataLayer pushes). Internal wiring is never asserted directly.

## Tiers

Three tiers share one helper/fixture layer. Only the smallest runs by default.

| Script | Tier | Content | When |
|--------|------|---------|------|
| `npm run test` | Smoke | 16 cases: {Desktop, Mobile} x {OSS, PRO} + RSVP render (`test/wc-tests-smoke/`), plus the two long-standing quick tests | DEFAULT - every CI run / PR |
| `npm run test:extended` | Reduced | + groups A-U, ~215 hand-written cases (`test/wc-tests/r-*.test.js`) | on demand / pre-merge |
| `npm run test:full` | Full Cartesian | + ~210 parameterized matrix cases (`test/wc-tests-full/f-*.test.js`) | on demand / releases |

Every script first runs `test/test-prep.js`, which builds `dist/` (the WC-level tests
import the built module) and executes the Node import smoke test.

### Smoke tier (S-01 .. S-16)

One question per matrix cell: is the button fundamentally working?

- OSS x Desktop: init + full option list + attribution; Google URL correctness; valid ICS
  download; all-day formats; recurring basics (RRULE + option deactivation); tracking chain.
- OSS x Mobile: Android apple-to-ical swap + `_self` download target; Android `intent://`
  Google wrapper; iOS ical-to-apple swap; modal UX + body scroll lock.
- PRO x Desktop: config fetch + server-driven render; `proOverride` precedence; proxy
  routing; silent failure on an invalid proKey.
- PRO x Mobile: PRO render under the mobile flavor with platform option rules; RSVP entry
  point replacing the calendar options.

### Reduced tier (groups A-U)

Hand-written cases per feature area: A lifecycle, B validation/error paths, C date/time/
timezone, D DST corners, E recurring, F multi-date series, G ICS output, H Google output,
I/J/K Outlook/Yahoo/Teams, L environment routing, M UI/interaction, N dataLayer tracking,
O localization, P subscribe mode, Q schema.org rich data, R PRO fetch/override, T RSVP
rendering, U edge cases + CSP 2x2. Test names always start with the case id (e.g. `C-01:`).

### Full Cartesian tier (templates F.T1 ..)

Parameterized loops expanding dimension products with an `isValid()` constraint function
(`test/fixtures/matrix.js`): output correctness across env x config x service, a DST x
timezone matrix cross-checked against an independent Intl-based oracle, RRULE shapes,
UI variants, localization, and multi-date combinations.

## File layout

```
test/
  helpers/            mount, capture (window.open/file-save/UA/console/clipboard), ics parser, dom, datalayer
  fixtures/           event configs (incl. 2050 DST corners), PRO mock payloads + fetch mock, matrix definitions
  wc-tests-smoke/     smoke tier (s-smoke.test.js)
  wc-tests/           reduced tier (r-*.test.js) + the two long-standing quick tests
  wc-tests-full/      full Cartesian tier (f-*.test.js)
web-test-runner.config.mjs
```

## Core helpers

- `mountAtcb(config)`: creates the element, serializes object/array configs to attributes,
  awaits `whenInitialized()`, returns `{ host, shadow }`.
- `interceptWindowOpen()`: captures calendar URLs (the lib opens links via `window.open`).
- `interceptFileSave()`: captures ICS downloads (the lib creates an ad-hoc anchor via
  `document.createElementNS` and dispatches a synthetic click; the interceptor swallows
  the click so nothing navigates).
- `parseIcs(...)`: decodes the `data:text/calendar` URI, unfolds RFC 5545 lines, exposes
  events/VTIMEZONEs/METHOD for assertions.
- `btnId(host)`: canonical element id. The lib PREFIXES custom identifiers with
  `atcb-btn-`; all DOM ids (trigger, options `{id}-{type}`, modal host `{id}-modal-host`,
  schema script `atcb-schema-{id}`) must be derived from the reflected `atcb-button-id`
  attribute, never from the raw `identifier` input.
- `initFailed(host)`: attribute-based check for failed initialization. Never touch the
  shadow root of a failed-init element (renderer crash in several Chrome builds).
- `setUA(profile)`: runtime `navigator.userAgent` override. Prefer the lib's own
  `fakeMobile`/`fakeIOS`/`fakeAndroid` config flags; the UA override is only needed for
  branches that read the UA directly (e.g. the download target `_self`/`_blank`).
- `muteConsole()` / `stubClipboard()`: keep intentional error-path tests silent and give
  headless environments a working Clipboard API.
- `mockProFetch(map)`: serves mocked `event.caldn.net/{proKey}/config.json` responses and
  passes ALL other URLs through to the real fetch (the test runner itself uses fetch).

## PRO testing

All PRO traffic is mocked; no live API calls. The two demo proKeys drive the flows:

- `a37c97ad-f650-4d94-81e7-65c999939e11` (regular event)
- `a3cdf9da-1d43-4dc8-a8a1-5e726666c635` (RSVP event)

Config variations are layered per test via `proOverride` plus local attributes. Mocked
server payloads mirror the real config.json shape, which is pre-structured with a `dates`
array. RSVP API behavior (submissions, server responses, thank-you states, seat counts)
is out of scope by design; only rendering, client-side validation gates, and license
guards are tested.

## Library behavior notes (assertion targets)

- Google links carry WALL-CLOCK times plus a `ctz` parameter (no UTC conversion, no `Z`).
  Numeric DST offsets are observable in the Teams URL (full ISO with offset) and in the
  Yahoo `st`/`et` parameters (UTC). Desktop Google base is `calendar/r/eventedit`; the
  mobile flavor uses `calendar/render?action=TEMPLATE`; Android wraps into `intent://`.
- ICS files are delivered as `data:text/calendar` URIs; hosted `icsFile` URLs are passed
  through directly. Cancelled events ship as `METHOD:CANCEL`; organizers switch the file
  to `METHOD:REQUEST`; the default is `METHOD:PUBLISH`.
- Recurrence keeps only apple/google/ical (google additionally removed on iOS). Raw
  `UNTIL` values are converted into an equivalent `COUNT` during decoration. A fully-past
  series advances its start to the last occurrence.
- `pastDateHandling=hide` filters past entries from multi-date sets and only removes the
  whole button when ALL entries are past; `hidden` and the all-past hide case skip button
  generation entirely (the host element keeps its normal display value).
- Multi-date sets produce ONE ICS file when all entries share the same (or no) organizer
  and none are cancelled; otherwise the per-date selection modal opens. Modal content
  renders into a light-DOM modal host (`{id}-modal-host`), not the component shadow.
  Sub-event buttons use a TRAILING debounce; wait ~700ms after clicking them.
- `listStyle=modal` coerces the trigger to click. When only one option remains, the lib
  renders a singleton button carrying the plain identifier (no per-option list items).
- RSVP configs render the RSVP entry point INSTEAD of calendar options.
- In PRO mode, `hideBranding`, `ty`, and `rsvp` are excluded from client-side overrides
  unless the page runs on caldn.net / add-to-calendar-pro.com. Without proxy and
  hideBranding, a powered-by note is appended to event descriptions.
- dataLayer pushes are shaped `{ eventCategory, eventAction, eventLabel, event }` and the
  latest event is mirrored as `atcb-last-event="<event>:<trigger>"` on the host element.
- `uid` must match `/^(?:\w|-){1,254}$/` (RFC 7986); invalid values fall back to a
  generated UUID. `MAILTO:` in ORGANIZER/ATTENDEE lines is uppercase.

## Runner constraints (load-bearing)

- `concurrency: 1` in `web-test-runner.config.mjs`: Chrome headless intensively throttles
  timers in backgrounded tabs, which stalls the component's deferred initialization for
  whichever test file's tab is not in the foreground. Serialized pages are deterministic
  on every machine. Override for experiments via `WTR_CONCURRENCY`.
- `nodeResolve.exportConditions: ['production', 'default']` loads lit (test tooling used
  by the fixture helper) in production mode, keeping logs free of the dev-mode banner.
- DST-corner fixtures keep start and end times on the same side of a transition; times
  inside a DST gap are nonexistent/ambiguous and offset conventions legitimately differ.
- Assert URL parameters via `new URL(...).searchParams`, never by comparing full URL
  strings. Assert ICS content on the unfolded text via the parser helper.

## Extending the suite

- New quick sanity check for every CI run: add to `test/wc-tests-smoke/s-smoke.test.js`
  (keep it to one assertion bundle per matrix cell).
- New feature-area case: add to the matching `test/wc-tests/r-<group>-*.test.js` file,
  reusing the helpers; name it with the group prefix and a short scenario.
- New dimension sweep: extend the dimension arrays and `isValid()` in
  `test/fixtures/matrix.js` and add or extend a `test/wc-tests-full/f-*.test.js` template.
