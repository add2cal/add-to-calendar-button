# Add-to-Calendar-Button — Vitest Test Suite Plan

> Structured test case list covering all observable behaviors of add-to-calendar-button, in two tiers: a Reduced suite for dev/PR runs and a Full Cartesian suite for production releases.

_Test plan for the add-to-calendar-button test suite. Built collaboratively (maintainer + AI) in a planning session; implemented under test/wc-tests (Reduced Suite) and test/wc-tests-full (Full Cartesian Suite). See the Decisions log at the bottom for scope rulings._

## 0. How to read this plan

**Two tiers, one source of truth.**

- **Reduced Suite (R)** — explicit, hand-written cases for dev runs / PR checks. Fast, high signal. ~150 cases.
- **Full Cartesian Suite (F)** — parameterized templates that expand via nested loops around `it()` (or `mocha-each`) into the production-release matrix. ~700–2,000 cases depending on which dimensions we fully cross.

Every R-case has an ID like `C-04` (Group C, case 4). Every F-template has an ID like `F.T1`. Where an R-case is also a representative cell of an F-template, both IDs are listed.

**Granularity rule (per your spec):** one case = one user scenario. Inside a case we bundle independent assertions that share setup (e.g. `openList` dataLayer push + the resulting Google URL correctness — both have to pass, no reason to split).

**License tiers used throughout:**
- `OSS` — no proKey
- `PRO-EVT` — proKey `a37c97ad-f650-4d94-81e7-65c999939e11` (regular event, demo)
- `PRO-RSVP` — proKey `a3cdf9da-1d43-4dc8-a8a1-5e726666c635` (RSVP event, demo)

**PRO testing approach:** all PRO config fetches are **fully mocked** — no live API calls. Tests set the demo prokeys directly + `proOverride=true` and provide override config attributes inline; the mocked `event.caldn.net/{key}/config.json` returns minimal valid JSON for `proOverride=true` cases, or a populated fixture for server-driven RENDER behavior (R-05/R-06; group T form-rendering only). Override field is `proOverride` (boolean), not `overwrite`/`overwriteSettings`.

> ⚠️ **RSVP API behavior is OUT OF SCOPE.** Form submissions, server responses, seat-check counts, post-submit thank-you UI states, DOI flows, magic-link management, customVar POST-body propagation, prefilled-from-API state — these are server-side concerns and are NOT unit-tested. Group T tests the RSVP form's rendering, client-side validation, and license guards exclusively.

**Test framework:** `@open-wc/testing` (Chai-based assertions, `fixture()` helper) running on `@web/test-runner` — same stack as the existing `test/wc-tests/wc-load.test.js` and `test/wc-tests/recurrence-tz.test.js`. New cases slot directly into `test/wc-tests/`; the existing `npm run test` script picks them up. Real-browser environment (default Chromium via Puppeteer; extended to Playwright Chromium + Firefox + WebKit for the nightly cross-browser tier). UA / device / OS dimensions are mocked via the lib's built-in `fakeMobile` / `fakeIOS` / `fakeAndroid` flags (preferred — clean, no module-cache invalidation needed) plus `Object.defineProperty(navigator, 'userAgent', …)` for cases where those flags don't reach (e.g. WebView detection). `matchMedia`, `window.dataLayer`, `fetch` (config.json only) — stubbed via `sinon` per case.

> ℹ️ **Stack note:** This plan was originally drafted assuming Vitest. The framework choice was changed to open-wc / `@web/test-runner` to align with the existing test setup — test cases are framework-agnostic and unchanged. Only sections 21 (infrastructure) and references to `test.each` / `vi.*` were rewritten.

## 1. Matrix dimensions & valid values

### D1 — Device class
`desktop`, `mobile`

> Mobile = iOS or Android. iPad is counted as iOS/mobile, not as a separate tablet category. The lib does not differentiate tablets from phones.

### D2 — Browser
`chrome`, `safari`, `firefox`, `webview-regular`, `webview-limited`

> `webview-limited` (aka problematic webview, e.g. Instagram in-app browser) triggers `atcbIsProblematicWebView`. `webview-regular` is the broader webview detection.

### D3 — OS
`windows`, `macos`, `ios`, `android`

**Constraint matrix (valid OS × Browser cells):**
- Windows: chrome, firefox
- macOS: chrome, safari, firefox
- iOS: safari, chrome, firefox, webview-regular, webview-limited
- Android: chrome, firefox, webview-regular, webview-limited

(Total: 14 valid OS×Browser cells)

### D4 — License tier
`OSS`, `PRO-EVT`, `PRO-RSVP`

### D5 — Config shape (canonical set, 24 shapes)
| ID | Shape |
|----|-------|
| C01 | Single timed, IANA tz with active DST (America/New_York) |
| C02 | Single timed, IANA tz no DST (Asia/Tokyo) |
| C03 | Single timed, UTC explicit |
| C04 | Single timed, no timeZone (floating / GMT default) |
| C05 | Single timed, `useUserTZ=true` (mocked browser tz) |
| C06 | Single timed, special-tz alias (CET) — gets mapped |
| C07 | Single all-day, single date |
| C08 | Multi-day timed (start≠end) |
| C09 | Multi-day all-day |
| C10 | Multi-date series (`dates=[3 entries]`) — chronological |
| C11 | Multi-date series — out-of-order, auto-sorted |
| C12 | Multi-date series — mixed timezones across entries |
| C13 | Recurring DAILY simplified |
| C14 | Recurring WEEKLY simplified, `recurrence_byDay=MO,WE,FR` |
| C15 | Recurring MONTHLY simplified, `BYMONTHDAY=15` |
| C16 | Recurring MONTHLY simplified, `BYDAY=2MO` |
| C17 | Recurring YEARLY simplified, `BYMONTH+BYMONTHDAY` |
| C18 | Recurring full RRULE: `RRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=10` |
| C19 | Recurring with UNTIL |
| C20 | Recurring with INTERVAL=2 |
| C21 | Recurring all-day |
| C22 | Recurring across DST boundary |
| C23 | Subscribe mode + hosted icsFile URL |
| C24 | Online event (location is URL → triggers schema.org online flag) |

### D6 — Output target × mode
**Services (6):**
- `apple-ics` (covers both "Apple" and "iCal" dropdown options that share data: URI generation)
- `google`
- `outlook` (outlook.com)
- `ms365`
- `teams`
- `yahoo`

**Mode (2):** `regular`, `subscribe`

**Constraints by mode:**

| Service | Regular | Subscribe |
|---------|---------|-----------|
| apple-ics | data: URI ICS download | `webcal://URL` |
| google | calendar render URL | Google Calendar subscribe URL pattern |
| outlook | compose URL | behavior to verify (likely excluded — confirm during impl) |
| ms365 | compose URL | behavior to verify (likely excluded — confirm during impl) |
| teams | meeting/new URL | EXCLUDED (per `atcbInvalidSubscribeOptions`) |
| yahoo | calendar v=60 URL | manual-instructions modal (no direct URL) |

Subscribe mode requires `subscribe=true` + `icsFile=URL` in config.

### D7 — UI / interaction surface
`list-open-click`, `list-open-hover`, `list-close-esc`, `list-close-outside`, `list-close-button`, `focus-first-item`, `enter-on-item`, `singleton-direct-open`, `buttonsList-each-renders`, `modal-overlay`, `modal-bodyscroll-lock`, `forceOverlay-clone`, `dropdown-static`, `dropup-static`, `inline-no-overlay`, `saved-checkmark`, `hide-* booleans`, `past-date-hide`, `past-date-disable`, `date-style-global-tz-shift`

### D8 — Localization
`en`, `de`, `fr`, `es`, `pt`, `ja`, `zh`, `ar` (RTL), `he` (RTL), `fa` (RTL), unknown→fallback

### D9 — DataLayer / tracking
`initialization`, `openList`, `closeList`, `openCalendarLink`, `openSingletonLink`, `openSubEventLink`, `openRSVP`, `successRSVP`, `success` (file-saved), `atcb-last-event` host attribute mirror

### D10 — Error surfacing
`silent-no-render` (debug=false), `console.error+visible-error-block` (debug=true), `validation-throw-prerender`, `csp-nonce-throw`

## 2. Reduced Suite — Group A: Lifecycle & registration

_All run on default desktop env unless noted._

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| A-01 | Web component registers and initializes with minimal config (`name`+`startDate`) | `customElements.get('add-to-calendar-button')` defined; `whenInitialized()` resolves; `atcb-button-id` attr set; `.atcb-initialized` exists in shadow DOM; `initialization` event pushed to `dataLayer` exactly once |
| A-02 | `name` missing (debug=false) → silent no-render | No shadow content, no thrown error to console, button absent from DOM |
| A-03 | `name` missing + `debug=true` → visible error | `console.error` called; error text appears in shadow DOM via `atcb_render_debug_msg` |
| A-04 | `hidden=true` → element renders nothing | shadow root empty / display:none |
| A-05 | `disabled=true` → renders, click no-ops | Button visible with `disabled` attr; click does NOT push `openList`; list does not open |
| A-06 | `blockInteraction=true` → renders, all clicks blocked | pointer-events styling applied; click no-ops; hover does nothing |
| A-07 | Two `<add-to-calendar-button>` on same page → independent state | Distinct `atcb-button-id`s; opening one does not open the other; closing one leaves the other open |
| A-08 | Imperative `atcb_action(config)` opens list directly — `atcb-last-event` timing differs from web component path | No persistent button DOM; modal/overlay appears in document. **Critical:** before any event fires, `parentEl.getAttribute('atcb-last-event')` is `null` (the `atcb_action` path does NOT pre-populate it on init like the web component does — the comment in `atcb-event.js` explicitly warns "custom triggers won't have any information as long as they have not been fired"). After triggering open and close, the attribute is set on parentEl. |
| A-09 | Removing element from DOM cleans up overlay | `disconnectedCallback` removes any open overlay/modal shadow DOM; no orphan elements left in document. Note: global ESC listener is attached once via `atcbInitialGlobalInit` and is NOT removed (verify during impl) |
| A-10 | Re-setting an attribute after init triggers re-render | New ICS reflects new value; previously open list closes |
| A-11 | **Async init contract**: `connectedCallback` defers full init via `setTimeout(initializeComponent, 0)` | Use fake timers. Synchronously after `document.body.appendChild(el)`: shadow DOM root exists but `.atcb-initialized` class is ABSENT, `_initialized` Promise unresolved, `atcb-button-id` not yet set. Advance timers by ≥1ms: all of the above become present/resolved. Pins the non-blocking init contract — protects against tests that incorrectly assert synchronous render or against future refactors that move init back into `connectedCallback`'s synchronous path. |

## 3. Reduced Suite — Group B: Config validation & error paths

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| B-01 | Invalid `icsFile` URL (relative path with bad chars) | `atcb_validate_icsFile` throws; button does not render |
| B-02 | `subscribe=true` + `dates=[2 entries]` | `atcb_check_required` throws; specific message about subscribe+multi-date |
| B-03 | `subscribe=true` + missing `icsFile` | `atcb_validate_subscribe` throws |
| B-04 | `options=[]` → no recognized service | `atcb_validate_options` throws |
| B-05 | Bad `created` ISO string | `atcb_validate_created` throws |
| B-06 | Bad `updated` ISO string | `atcb_validate_updated` throws |
| B-07 | Invalid IANA tz (`Foo/Bar`) | `atcb_validate_timezone` throws |
| B-08 | Bad RRULE (FREQ missing) | `atcb_validate_rrule` throws |
| B-09 | RRULE with unsupported FREQ (`SECONDLY`) | throws |
| B-10 | CSP `cspnonce` containing `<` | `atcb-generate-rich-data` throws BEFORE any DOM mutation |
| B-11 | `language=xx-unknown` | Falls back to `en` (no throw); button label is English |
| B-12 | `buttonStyle=invalid` | `atcb_validate_buttonStyle` throws OR coerces to default — verify actual behavior |
| B-13 | Empty `dates=[]` array (multi-date with no entries) | throws |
| B-14 | `endDate` before `startDate` | throws |
| B-15 | `startTime` set but `endTime` missing (or vice versa) — partial time | Behavior per spec: throws OR auto-derives — verify |
| B-16 | `availability` value not in {busy, free} | throws or coerces |
| B-17 | `status` value not in {CONFIRMED, CANCELLED} | throws or coerces |

## 4. Reduced Suite — Group C: Date / time / timezone (single event)

_For each row, the same setup is rendered and the listed outputs are checked. One case = one config × bundled output assertions._

| ID | Setup | Bundled assertions |
|----|-------|---------------------|
| C-01 | C01 (NY timed, 2025-06-15 10:00–11:00, America/New_York) | ICS `DTSTART;TZID=America/New_York:20250615T100000`; ICS contains `VTIMEZONE` block once; Google `dates=20250615T140000Z/20250615T150000Z`; Google `ctz=America/New_York`; MS365 `startdt=2025-06-15T10:00:00-04:00`; Outlook same; Yahoo `st=20250615T140000Z&et=20250615T150000Z&dur=0100`; Teams `startTime=2025-06-15T10:00:00-04:00` |
| C-02 | C02 (Tokyo timed, no DST) | ICS uses `TZID=Asia/Tokyo`; Google UTC offset `+09:00` reflected in `dates=`; MS365 offset `+09:00` |
| C-03 | C03 (UTC explicit) | ICS `DTSTART:20250615T100000Z` (suffix Z, no TZID); Google `dates=...Z` |
| C-04 | C04 (no timeZone) | ICS DTSTART has no Z and no TZID; defaults to GMT semantics; Google omits `ctz` |
| C-05 | C05 (`useUserTZ=true`, navigator tz mocked to America/Los_Angeles) | ICS uses TZID=America/Los_Angeles; offset reflects DST state at event date |
| C-06 | C06 (`timeZone=CET`) | `atcb_map_special_time_zones` maps to GMT; ICS DTSTART has no TZID |
| C-07 | C07 (single all-day 2025-12-25) | ICS `DTSTART;VALUE=DATE:20251225`, `DTEND;VALUE=DATE:20251226` (+1); Google `dates=20251225/20251226`; Outlook `allday=true`; Yahoo `allday=1` |
| C-08 | C08 (multi-day timed, 2025-06-15 to 2025-06-17) | ICS DTSTART/DTEND on different days; Google range correct; Outlook end on day 17 |
| C-09 | C09 (multi-day all-day, 25th–27th) | ICS DTEND;VALUE=DATE:20251228 (+1 from end); Google `dates=20251225/20251228` |
| C-10 | Dynamic dates `startDate=today+7` | Resolves at decoration to today+7 in all outputs; ICS has concrete date, not the placeholder |
| C-11 | Dynamic dates `startDate=today-3` (past, default handling) | Renders normally as past event; no hide/disable applied |
| C-12 | `pastDateHandling=hide` + past `startDate` | Button does not render |
| C-13 | `pastDateHandling=disable` + past `startDate` | Button renders but disabled; no list opens |
| C-14 | `availability=free` | ICS `TRANSP:TRANSPARENT` (default `availability=busy` or omitted → `TRANSP:OPAQUE`); invalid value (e.g. `'FREE'` wrong-case before normalization) → graceful fallback to `OPAQUE` |
| C-15 | `status=CANCELLED` | ICS `STATUS:CANCELLED` (Google URL has no status param — only ICS reflects cancellation; click-time fork tested separately in H-08) |
| C-16 | `timeZone="currentBrowser"` (special string value, navigator tz mocked to America/Los_Angeles) | Lib resolves `currentBrowser` to the browser's `Intl.DateTimeFormat().resolvedOptions().timeZone`; ICS uses that resolved IANA tz; outputs reflect the mocked LA tz with correct DST offset for event date. Verify whether `timeZone="currentBrowser"` and `useUserTZ=true` are equivalent paths or distinct branches in src during impl. |
| C-17 | **POSIX-inverted Etc/GMT zones**: `timeZone="Etc/GMT+5"` (per POSIX, this means UTC−5 — the sign is inverted) | Google URL `dates=` UTC range correctly reflects UTC−5 (event at wall 10:00 → UTC 15:00, NOT UTC 05:00); ICS DTSTART uses literal wall-clock with TZID=Etc/GMT+5; verify the special-tz regex in `atcb_map_special_time_zones` correctly handles Etc/GMT+ inversion (silent regression risk: a misclassification produces a wrong-time event in Google Calendar with no error thrown). |

## 5. Reduced Suite — Group D: DST & timezone corners

_Highest-bug-risk surface. Each tested against ICS, Google, and one Outlook variant minimum._

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| D-01 | NY event 1h BEFORE 2025 spring-forward (Mar 9 01:30 EST) | ICS offset `-05:00`; Google UTC = wallclock+5h |
| D-02 | NY event 1h AFTER spring-forward (Mar 9 03:30 EDT) | ICS offset `-04:00`; Google UTC = wallclock+4h |
| D-03 | NY event SPANS spring-forward (start Mar 9 01:00, end Mar 9 04:00) | ICS DTSTART/DTEND use literal wall-clock with TZID (start 01:00, end 04:00); Google `dates=` UTC range = 2h real elapsed (the 02:00–03:00 hour is skipped); calendar-app rendering shows 3h wall-clock |
| D-04 | NY event 1h BEFORE 2025 fall-back (Nov 2 00:30 EDT) | ICS `-04:00`; Google UTC = wallclock+4h |
| D-05 | NY event 1h AFTER fall-back (Nov 2 02:30 EST) | ICS `-05:00`; Google UTC = wallclock+5h |
| D-06 | NY event SPANS fall-back (start Nov 2 01:00 EDT, end 03:00 EST) | ICS DTSTART/DTEND use literal wall-clock with TZID; Google `dates=` UTC range = 3h real elapsed (extra hour from fall-back); calendar-app rendering shows 2h wall-clock |
| D-07 | Recurring weekly event whose Nth occurrence falls on DST transition day | `atcb_getNextOccurrence` returns correct future occurrence; offset of NEXT occurrence reflects post-DST state |
| D-08 | Sydney (Southern Hemisphere) event in April (autumn DST end) | Offset `+11→+10` transition applied correctly |
| D-09 | Tokyo event during NY's DST transition (Tokyo doesn't observe DST) | Tokyo offset stays `+09:00`; only NY-tagged events shift |
| D-10 | Multi-date series with dates on either side of DST | Each VEVENT gets correct offset for its date; one VTIMEZONE block covers both |

## 6. Reduced Suite — Group E: Recurring events

> 📌 **Recurring deactivates calendar options that don't support recurrence at the URL level.** Per source behavior: when `recurrence` is set, the lib REMOVES from the dropdown — **Yahoo**, **MS365**, **Outlook.com**, **MS Teams** on all envs (all Microsoft options + Yahoo); **Google** on iOS only. Apple/iCal and Google (non-iOS) remain active. Cases below assume desktop env unless noted; iOS-specific Google exclusion is covered by E-13d.

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| E-01 | C13 simplified DAILY | ICS contains `RRULE:FREQ=DAILY`; Google URL has `recur=RRULE:FREQ=DAILY` (desktop env); Apple/iCal options PRESENT in dropdown; Yahoo, MS365, Outlook.com, MS Teams options ABSENT |
| E-02 | C14 simplified WEEKLY MO,WE,FR | ICS `RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR`; Google `recur=` matches |
| E-03 | C15 monthly BYMONTHDAY=15 | ICS contains `BYMONTHDAY=15`; Google `recur=` matches |
| E-04 | C16 monthly BYDAY=2MO (2nd Monday) | ICS contains `BYDAY=2MO`; Google equivalent |
| E-05 | C17 yearly BYMONTH=6;BYMONTHDAY=15 | ICS contains both; Google equivalent |
| E-06 | C18 raw `RRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=10` | Pass-through to ICS verbatim; `recurrence_simplyfied=false` internally; Google `recur=` matches |
| E-07 | C19 with UNTIL=20251231T235959Z | UNTIL preserved in ICS and Google `recur=` |
| E-08 | C20 with INTERVAL=2 | INTERVAL preserved in ICS and Google |
| E-09 | WKST=SU set | Preserved in ICS |
| E-10 | C21 recurring all-day daily | ICS DTSTART has no time; RRULE attached; Google uses date-only `dates=` + `recur=` |
| E-11 | Recurring with startDate in past + COUNT not exhausted (more occurrences in future) | `atcb_getNextOccurrence` advances startDate to next future occurrence in all outputs; pastDateHandling does NOT trigger |
| E-12 | Recurring with COUNT exhausted (all occurrences in past), default pastDateHandling | Button renders normally; ICS reflects the configured series with original past startDate (no advancement possible); event behaves like a regular past event |
| E-12a | Recurring with COUNT exhausted + `pastDateHandling=hide` | Button does NOT render |
| E-12b | Recurring with COUNT exhausted + `pastDateHandling=disable` | Button renders but disabled |
| E-13 | Yahoo + recurring config | Yahoo option ABSENT from dropdown |
| E-13b | MS365 + recurring config | MS365 option ABSENT from dropdown |
| E-13c | Outlook.com + recurring config | Outlook.com option ABSENT from dropdown |
| E-13d | Google + recurring config + iOS env (`fakeIOS=true` + non-Safari UA) | Google option ABSENT |
| E-13e | Google + recurring config + desktop env | Google option PRESENT with `recur=RRULE:...` in URL |
| E-13f | Apple/iCal + recurring config + any env | Always PRESENT with RRULE in ICS |
| E-13g | MS Teams + recurring config | MS Teams option ABSENT from dropdown (Microsoft option, deactivated for recurring) |
| E-14 | C22 recurring weekly Mondays through DST transition | ICS DTSTART;TZID has the start-date offset (pre-DST); RRULE itself is timezone-agnostic; calendar-app expands occurrences using TZID to apply DST per-occurrence at render time |
| E-15 | **Internal-key spelling regression pin**: simplified RRULE input (e.g. `recurrence="WEEKLY"`, no `RRULE:` prefix) | After decoration, `data.recurrence_simplyfied === true` (with the load-bearing MISSPELLING — "simplyfied" not "simplified"); ICS contains valid `RRULE:FREQ=WEEKLY`. Assert that `data.recurrence_simplified` (correct spelling) is `undefined`. **Why:** both the validator (`atcb_validate_rrule_simplyfied`) and the decorator (`atcb_decorate_data_rrule`) use this exact misspelled key. A future "fix" in only one place would silently bypass simplified-RRULE validation and could let malformed RRULEs through. |

## 7. Reduced Suite — Group F: Multi-date / event series

> 📌 **Multi-date ICS file grouping**: when all entries share the same (or no) organizer AND no entries are cancelled, the lib produces a SINGLE ICS file (data: URI) containing N VEVENT blocks. When organizers differ across entries OR any entry is cancelled, behavior to confirm during impl (likely split into multiple files or per-event handling).

> 📌 **`pastDateHandling` in multi-date**: applies globally (top-level), but its effect within a multi-date series is granular — past entries are filtered from the sub-modal, and the whole button only disappears when ALL entries are in the past.

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| F-01 | C10 dates=[3 entries chronological], same organizer (or none), no cancellations | Single ICS file (one data: URI) containing 3 VEVENT blocks; click on button opens date-picker modal listing 3 buttons |
| F-02 | C11 dates=[3 entries out-of-order] | Auto-sorted; UI shows chronological order; ICS reflects sorted order |
| F-03 | C12 mixed timezones across entries | Each VEVENT gets its own TZID; one VTIMEZONE block per unique tz |
| F-04 | Click sub-event date button → opens calendar link for that occurrence | dataLayer `openSubEventLink` pushed with the occurrence index/identifier |
| F-05 | Multi-date Google flow | Per-date Google URLs; each pushes `openSubEventLink` |
| F-06 | Multi-date with shared `uid` propagation across entries when sequence set | All VEVENTs share UID family; SEQUENCE incremented |
| F-07 | Multi-date + `subscribe=true` | Throws (validation) |
| F-08 | Multi-date with SOME entries past + global `pastDateHandling=hide` | Button DOES render; only past entries filtered out from the sub-modal date list; future entries shown and clickable |
| F-09 | Multi-date with `name` per entry override | Each VEVENT SUMMARY = entry's name |
| F-10 | Multi-date with ALL entries in past + global `pastDateHandling=hide` | Button does NOT render at all (whole button disappears, not just sub-modal entries) |
| F-11 | Multi-date with mixed past/future entries + `pastDateHandling=disable` | Button renders; past entries shown but visually disabled in sub-modal; future entries clickable |
| F-12 | Multi-date with same/no organizer + no cancellations + N entries | Single ICS file (data: URI) contains all N VEVENTs; one download serves all entries |
| F-13 | Multi-date where organizers differ across entries OR any entry has `status=CANCELLED` | Lib's ICS-grouping behavior to verify — single file vs split per entry; mark assertion to source-confirm during impl |

## 8. Reduced Suite — Group G: ICS / Apple output

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| G-01 | Default render, ICS structure | VCALENDAR wrapper; `VERSION:2.0`; `CALSCALE:GREGORIAN`; `PRODID` contains `add-to-calendar-pro.com//button` and version |
| G-02 | No organizer | `METHOD:PUBLISH` |
| G-03 | With organizer `Name|email` | `METHOD:REQUEST`; `ORGANIZER;CN=Name:mailto:email` line |
| G-04 | With attendee `Name|email` | `ATTENDEE;CN=Name:mailto:email` line |
| G-05 | UID auto-generated | UUID format; same UID across rerenders for same identifier |
| G-06 | UID supplied | Preserved verbatim |
| G-07 | SUMMARY with commas, semicolons, newlines | `atcb_rewrite_ical_text` escapes them; round-trip parse-friendly |
| G-08 | DESCRIPTION HTML (`<p>`, `<a>`, etc.) | HTML stripped to plain text; line folding at 75 chars |
| G-09 | LOCATION as URL | `atcb_secure_url` applied; URL preserved with proper escaping |
| G-10 | LOCATION as text | Preserved as-is with iCal escaping |
| G-11 | STATUS, TRANSP, SEQUENCE, CREATED, LAST-MODIFIED preserved when supplied | All five lines present in VEVENT |
| G-12 | Hosted `icsFile` URL provided + non-WebView | `atcb_save_file` called with the URL directly; no in-memory ICS construction |
| G-13 | Hosted `icsFile` URL + iOS WebView (Instagram) | Clipboard-copy modal shown with "Open in Safari" instructions; URL placed on clipboard |
| G-14 | Apple subscribe mode | URL has `webcal://` scheme; ICS URL converted |
| G-15 | Multi-date + multi-tz: VTIMEZONE deduped | Only one VTIMEZONE block per unique tz, regardless of how many VEVENTs use it |
| G-16 | Long description (>500 chars) | Line folding produces lines ≤ 75 octets; rejoin on parse yields original |
| G-17 | iCalFileName custom | Downloaded file named accordingly |
| G-18 | `proxy=true` (PRO) | ICS link points to PRO proxy URL instead of data: URI |
| G-19 | **Multi-date organizer fork** — `organizer` set ONLY on `dates[1]` (not on `dates[0]`) | Bulk-export ICS (single file, all dates) uses `METHOD:PUBLISH` (driven by `dates[0]` having no organizer); per-date sub-event ICS for date 2 uses `METHOD:REQUEST` and includes `ORGANIZER;CN=...:mailto:...` line; per-date sub-event ICS for date 1 uses `METHOD:PUBLISH` (no organizer line). Pins the per-date organizer fork — silent regression risk for meeting-invite UX in Outlook/Apple Mail (METHOD:REQUEST turns ICS into an invite vs. METHOD:PUBLISH which is a passive import). |

## 9. Reduced Suite — Group H: Google output

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| H-01 | Default timed event | Base URL `https://calendar.google.com/calendar/render?action=TEMPLATE`; `text=` URL-encoded; `dates=` UTC range with `Z`; `details=`, `location=`, `ctz=` present |
| H-02 | All-day | `dates=YYYYMMDD/YYYYMMDD` (no time component); no `ctz` needed |
| H-03 | Recurring (desktop / Android only — option absent on iOS, see E-13d) | `recur=RRULE:...` query param present |
| H-04 | Subscribe mode for Google | Uses Google subscribe URL pattern |
| H-05 | Special tz alias (CET) | `ctz` omitted (mapped to GMT) |
| H-06 | Long description with HTML | URL-encoded; stays under any practical URL length limit |
| H-07 | Online event (location=URL) | URL placed in `location=` and possibly `details=` per spec |
| H-08 | **Cancelled-event click fork** — `status="CANCELLED"` + click on a non-iCal option (Google, Outlook, Yahoo, Teams) | Warning modal opens with the cancelled-date i18n string; NO calendar URL navigated to / opened (`window.open` / link `click` not triggered for the calendar URL); `.atcb-saved` class NOT applied to the clicked list item. **Bundled second assertion**: same `status="CANCELLED"` config + click on Apple/iCal option → ICS download triggered with `STATUS:CANCELLED` line in VEVENT; NO modal opens; `.atcb-saved` IS applied. Confirms the cancelled-date FORK between non-iCal services (modal warning) and iCal (proper STATUS:CANCELLED ICS). |

## 10. Reduced Suite — Group I: Outlook (MS365 + Outlook.com) + Yahoo + Teams

> 📌 **Recurring deactivates Yahoo and ALL Microsoft options (MS365, Outlook.com, MS Teams) entirely** — see E-13/13b/13c/13g. Cases below cover non-recurring scenarios for those services.

_Outlook_

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| I-01 | MS365 timed | Base `https://outlook.office.com/calendar/0/deeplink/compose?...rru=addevent`; `subject=`; `startdt`/`enddt` ISO 8601 with offset; `body=`; `location=` |
| I-02 | Outlook.com timed | Base `https://outlook.live.com/calendar/0/deeplink/compose?...`; same params |
| I-03 | All-day → `allday=true` | Both Outlook variants |
| I-04 | Recurring → both Outlook options ABSENT from dropdown | Cross-ref E-13b (MS365) and E-13c (Outlook.com); option not rendered, no URL to test |
| I-05 | Online event | URL in location; body retains URL |

_Yahoo_

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| J-01 | Default timed | `v=60`, `title=`, `st=`, `et=`, `desc=`, `in_loc=`, `dur=HHMM` |
| J-02 | All-day | `allday=1` |
| J-03 | Recurring → Yahoo option ABSENT from dropdown | Cross-ref E-13; option not rendered |
| J-04 | Yahoo subscribe → manual modal | Modal renders with copy-paste instructions; URL on clipboard |

_Teams_

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| K-01 | Default timed | Base `https://teams.microsoft.com/l/meeting/new?...`; `subject`, `startTime`, `endTime`, `content`, `location` |
| K-02 | All-day | Verify lib's Teams-allday URL shape during impl (Teams may not support allday natively — lib behavior) |
| K-03 | Subscribe → Teams excluded | Teams not in dropdown when subscribe=true (`atcbInvalidSubscribeOptions`) |
| K-04 | Teams shown on iOS Safari (non-recurring) | Not in iOS-restricted list |
| K-05 | Teams shown on Android Chrome (non-recurring) | Not in Android-restricted list |
| K-06 | Recurring → MS Teams option ABSENT from dropdown | Cross-ref E-13g; Microsoft option deactivated for recurring |

## 11. Reduced Suite — Group L: Environment-driven routing

_The mobile/desktop/WebView matrix where the lib actually branches behavior. Each row uses the spec'd UA mock or the lib's `fake*` flags._

| ID | Env | Scenario | Bundled assertions |
|----|-----|----------|---------------------|
| L-01 | iOS Safari | Default options shown | Apple option present; ical present; ICS click → direct download |
| L-02 | iOS Chrome (Safari-only WebKit) | ICS click | Clipboard-copy modal with "Open in Safari" instructions; URL on clipboard; modal closeable |
| L-03 | iOS Chrome + `bypassWebViewCheck=true` | ICS click | Direct download |
| L-04 | Android Chrome | Default options | Apple option ABSENT; ical present |
| L-05 | Android WebView | ICS click | Clipboard-copy modal |
| L-06 | Android WebView + bypass | ICS click | Direct download |
| L-07 | Instagram in-app browser (`atcbIsProblematicWebView`) | ICS click | Full clipboard workaround modal; problematic-webview branch |
| L-08 | Desktop Windows Chrome | All options shown | apple, ical, google, ms365, outlookcom, yahoo, teams all in list |
| L-09 | Desktop macOS Safari | All options | All present |
| L-10 | Mobile + `optionsMobile=['Google','Apple']` | Options filtered | Only those two visible |
| L-11 | iOS + `optionsIOS=['Apple']` overrides `optionsMobile` | Only Apple visible | iOS-specific config takes precedence |
| L-12 | `fakeMobile=true` on desktop UA | Mobile branch triggered | Apple option behavior etc. matches mobile |
| L-13a | `fakeIOS=true` alone (UA stays desktop Safari-like) | iOS option restrictions apply (e.g. `ical` blocked); but Safari detection may also trigger Safari-direct-download path |
| L-13b | `fakeIOS=true` + Chrome UA mock | iOS branch triggered AND Safari detection returns false; iOS clipboard-copy modal logic activates on ICS click |
| L-14 | `fakeAndroid=true` on desktop | Android branch | Apple option absent |
| L-15 | iOS file download target | Verify lib's actual target — codebase notes `_system` for WebView, `_blank` otherwise; iOS-specific target attribute to source-confirm during impl |
| L-16 | iOS + recurring config | Google option ABSENT (cross-ref E-13d); Yahoo/MS365/Outlook.com/MS Teams also ABSENT (cross-ref E-13/b/c/g); Apple/iCal options PRESENT with RRULE in ICS |
| L-17 | Desktop + recurring config | Google option PRESENT with `recur=`; Yahoo/MS365/Outlook.com/MS Teams ABSENT |
| L-18 | **Platform-invalid filter vs explicit override priority** — iOS env + `optionsIOS=['ical', 'google']` (explicitly includes `ical`, which is in `atcbIOSInvalidOptions`) | Pin lib's actual behavior: either (a) `ical` filtered out anyway (invalid-list filter wins) or (b) `optionsIOS` override takes precedence (explicit user override wins). Source-confirm during impl. **Bundled mirror case**: Android env + `optionsMobile=['apple']` (apple in `atcbAndroidInvalidOptions`) — same priority question. Tests the conflict between `atcbIOSInvalidOptions`/`atcbAndroidInvalidOptions` filter lists and the user-specified per-platform override arrays. |

## 12. Reduced Suite — Group M: UI / interaction

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| M-01 | Button renders with text + icon | label visible; icon SVG present |
| M-02 | `hideTextLabelButton=true` | label absent; icon-only |
| M-03 | `hideIconButton=true` | icon absent; label-only |
| M-04 | Click on `trigger=click` button | List opens; `openList` dataLayer event |
| M-05 | Hover on `trigger=hover` button | mouseenter opens; mouseleave (after delay) closes |
| M-06 | ESC key with list open | List closes; `closeList` event |
| M-07 | Outside click with list open | List closes; `closeList` event |
| M-08 | Focus moves to first list item on open | `document.activeElement` (in shadow DOM) is first `.atcb-list-item` |
| M-09 | Enter key on focused list item | Triggers calendar link open; `openCalendarLink` event |
| M-10 | `listStyle=modal` | Overlay element appears in document; body has `atcb-modal-no-scroll` class |
| M-11 | Modal close | Overlay removed; body class removed; scroll restored |
| M-12 | Single-option config (`options=['Google']`) | No dropdown; click opens Google directly; `openSingletonLink` event (NOT `openCalendarLink`) |
| M-13 | `buttonsList=true` | Each service has its own button; no shared dropdown; clicking each pushes `openSingletonLink` for that service |
| M-14 | Saved checkmark after calendar link opened | `.atcb-saved` class on the clicked item; `success` event pushed |
| M-15 | `hideCheckmark=true` | No checkmark class added after click |
| M-16 | `hideBackground=true` | No `.atcb-bg` overlay element |
| M-17 | `forceOverlay=true` | Original button gets `atcb-shadow-hide`; cloned overlay shadow DOM appears |
| M-18 | `listStyle=dropdown-static` | List positioned below button without absolute positioning logic |
| M-19 | `listStyle=dropup-static` | List positioned above button |
| M-20 | `listStyle=overlay` | Full-page overlay variant |
| M-21 | `inline=true` | No overlay; renders inline in flow |
| M-22 | `lightMode=light` | shadow root has light theme class |
| M-23 | `lightMode=dark` | dark theme class |
| M-24 | `lightMode=system` + `prefers-color-scheme: dark` (matchMedia mocked) | Dark theme class applied |
| M-25 | `lightMode=bodyScheme` + body has `data-color-scheme="dark"` | Dark theme |
| M-26 | `customCss=URL` | `<link rel=stylesheet>` injected with that URL |
| M-27 | `styleLight` / `styleDark` CSS variable overrides | Inline style on shadow root applies the vars |
| M-28 | `buttonStyle=round` | Corresponding class on button |
| M-29 | `size=l\|m\|s` | Size attribute parsed; appropriate class applied |
| M-30 | `hideBranding=true` in **OSS** mode (no proKey) | "Add to Calendar PRO" branding link is HIDDEN — flag works in OSS |
| M-31 | `hideBranding=true` in **PRO** mode (proKey set, with or without `proOverride=true`) | Branding link may STILL be shown — verify lib behavior during impl. PRO branding may be required regardless of the flag (license enforcement — opposite of intuition). Cross-ref R-16. |
| M-32 | `buttonStyle="date"` + `location="Global"` (the magic-string trigger) | UI date/time/tz panel shows time converted to USER'S BROWSER tz (`Intl.DateTimeFormat().resolvedOptions().timeZone`); calendar links (ICS, Google URL, Outlook URL, etc.) preserve the ORIGINAL configured time/tz unchanged. Bundled: assert the visible button/badge text shows local-converted time AND the resulting Google URL contains the original UTC range. |

## 13. Reduced Suite — Group N: dataLayer / tracking

_All tests verify both `window.dataLayer` push AND `atcb-last-event` host attribute._

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| N-01 | Init | `dataLayer.push({event: 'initialization', ...})`; `atcb-last-event="initialization:atcb-btn-1"` |
| N-02 | Open list | `openList` pushed; host attr updated |
| N-03 | Close list | `closeList` pushed |
| N-04 | Click calendar link in dropdown (multi-option config) | `openCalendarLink` pushed with service label |
| N-05 | Click in singleton config | `openSingletonLink` pushed (NOT openCalendarLink) |
| N-06 | Click sub-event date in multi-date modal | `openSubEventLink` pushed with index |
| N-07 | RSVP button open (PRO) | `openRSVP` pushed |
| N-08 | RSVP submit success (PRO) | `successRSVP` pushed |
| N-09 | ICS file successfully saved | `success` pushed |
| N-10 | `window.dataLayer` undefined | Push silently no-ops; no thrown error; `atcb-last-event` still updates |
| N-11 | Category check | All events have `category: 'Add-to-Calendar-Button'` (or `Add-to-Calendar-RSVP` for RSVP events) |
| N-12 | Identifier propagation | All events include the button's `identifier` for filtering in analytics |

## 14. Reduced Suite — Group O: Localization & i18n

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| O-01 | `language=de` | Button label "Zum Kalender hinzufügen"; modal headings German; date format German |
| O-02 | `language=fr` | French strings, French date format |
| O-03 | Unknown language code | Falls back to `en` silently |
| O-04 | RTL `language=ar` | shadow root has `lang="ar"`; RTL-specific class applied |
| O-05 | `customLabels={ "addToCalendar": "Save the date" }` | Override applies; ALL other labels still pull from `language` |
| O-06 | `customLabels` partial keys | Provided keys override; missing keys fall through to language defaults |
| O-07 | Localized day/month names in date-button labels (multi-date modal) | Match expected language |
| O-08 | iCal SUMMARY uses `name` regardless of UI language | ICS not localized — UI is, content is not |

## 15. Reduced Suite — Group P: Subscribe mode

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| P-01 | `subscribe=true` + `icsFile=URL` + Apple option | Apple link uses `webcal://URL` |
| P-02 | Subscribe + Google option | Google subscribe URL pattern; not the regular render URL |
| P-03 | Subscribe + Yahoo option | Yahoo manual-instructions modal opens (no direct subscribe URL) |
| P-04 | Subscribe + Teams in `options` | Teams option filtered out from rendered list |
| P-05 | Subscribe with `dates=[2 entries]` | Validation throws |
| P-06 | Subscribe + recurring config | Recurring fields ignored or throw — verify |

## 16. Reduced Suite — Group Q: Schema.org rich data

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| Q-01 | Default | `<script type="application/ld+json">` with `"@type": "Event"`; required fields populated |
| Q-02 | `hideRichData=true` | No script tag injected |
| Q-03 | Recurring → `EventSeries` | `"@type": "EventSeries"` with `subEvent` array |
| Q-04 | Online event (location is URL) | `"eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode"`; `"location": { "@type": "VirtualLocation", "url": ... }` |
| Q-05 | Organizer set | `"organizer": { "@type": "Person", "name": ... }` |
| Q-06 | Images array | `"image": [...]` with all URLs |
| Q-07 | `cspnonce` provided | `<script nonce="...">` |
| Q-08 | Multi-date → `EventSeries` shape pin | Injected JSON-LD has `"@type": "EventSeries"` at root; contains `"subEvents"` array with one `"@type": "Event"` per date entry; each subEvent has its own `"@id"` in the format `{EventName}-{N}` (e.g., `MyEvent-1`, `MyEvent-2`); single-date events do NOT produce an `EventSeries` wrapper — bare `Event` object only. **Note** (per src comment): multi-date EventSeries is acknowledged as not 100% schema.org-compliant and not supported by Google's structured data tool, but the output shape is pinned as a regression guard. |
| Q-09 | Cancelled status | `"eventStatus": "https://schema.org/EventCancelled"` |

## 17. Reduced Suite — Group R: PRO — proKey fetch & override

_All cases use mocked fetch. proKey `a37c97ad-...` (PRO-EVT) unless noted. **Group R covers PRO with calendar-link rendering** — the regular add-to-calendar flow with PRO config + override + post-save CTA. Group T covers the PRO-RSVP flow (form rendering only)._

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| R-01 | `proKey` set, fetch succeeds with fixture config | Fetch URL: `https://event.caldn.net/{key}/config.json`; rendered button uses fetched config; init proceeds |
| R-02 | PRO fetch returns 404 | Button does not render; `debug=true` shows error |
| R-03 | PRO fetch network error | Same as 404 path |
| R-04 | PRO with `dev=true` | Fetch hits `event-dev.caldn.net` instead |
| R-05 | PRO without `proOverride` + local `language="de"` attr | Override APPLIES (language is in `atcbWcProParams`) |
| R-06 | PRO without `proOverride` + local `name="Local Title"` attr | Override IGNORED (name is not in proParams subset) — server name wins |
| R-07 | PRO with `proOverride=true` + local `name="Override Title"` | Local wins; ICS SUMMARY = "Override Title" |
| R-08 | PRO with override `customLabels={...}` | Labels applied on top of server's language |
| R-09 | PRO with override `inline=true` | Inline render even if server says modal |
| R-10 | PRO with override `customCss=URL` | Custom CSS injected |
| R-11 | PRO with override of `options=['Google']` | Singleton mode active; click opens Google directly |
| R-12 | PRO with override of `dates=[3 entries]` | Multi-date modal renders with 3 dates |
| R-13 | PRO with override of `recurrence` | Recurring ICS produced; recurring deactivation rules apply (Yahoo/MS/iOS-Google absent) |
| R-14 | PRO with override of `timeZone` | Override applies; DST math redone |
| R-15 | PRO with `proxy=true` | All ICS output routes through PRO proxy URL |
| R-16 | PRO `hideBranding=true` (with or without `proOverride=true`) | Branding link MAY STILL be shown — verify lib behavior during impl. Per maintainer note: hideBranding is intended for OSS only; in PRO mode the small "Add to Calendar PRO" branding may be enforced regardless of the flag. Bundled: render with PRO-EVT prokey + `hideBranding=true` (and a separate run with `proOverride=true` + `hideBranding=true`); assert actual rendered state (likely branding still visible). Cross-ref M-30/M-31. |
| R-17 | Invalid proKey format (not UUID) | Validation throws / fetch never made — verify lib's client-side UUID-format check during impl |
| R-18 | PRO fixture includes `cta` block + user clicks calendar link in dropdown | Post-save CTA button appears after the calendar link is opened; CTA matches fixture's `cta` config (text/link/share/form per type). NOT triggered for RSVP flow (group T). |

## 18. Reduced Suite — Group T: PRO — RSVP & CTA

> 📌 **RSVP replaces the calendar-link button entirely.** When the PRO fixture has RSVP config, the lib renders the **RSVP form** (different element, different code path) instead of the dropdown of calendar-link options. There are no `openList`/`openCalendarLink` events in this flow — only RSVP-form events. Calendar-link generation is covered by Group R; post-save CTA is also covered there (R-18). This group focuses on the RSVP form rendering and client-side validation.

> ⚠️ **API behavior is OUT OF SCOPE.** Per §0: form submissions, server responses, post-submit thank-you UI, seat-check counts, DOI, magic-link, customVar POST propagation, prefilled-from-API user state — none of these are tested here. Only client-side rendering, validation gates, and license guards.

_proKey `a3cdf9da-...` (PRO-RSVP). Mocked fetch returns the RSVP-enabled fixture for the `config.json` endpoint only — no `api.add-to-calendar-pro.com` mocking._

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| T-01 | RSVP prokey + default config | RSVP form/button renders **in place of** the regular add-to-calendar button; no `.atcb-list-item` calendar options exist in shadow DOM |
| T-02 | Override `inlineRsvp=true` | Form rendered inline immediately, instead of behind a click-to-open RSVP button |
| T-09 | Email field client-side validation (`atcb_validEmail`) | Invalid email format shows per-field error before submit; valid email passes the validation gate (no API call asserted either way) |
| T-10 | RSVP button click opens form modal | `openRSVP` dataLayer event; `atcb-last-event` updated; form modal opens. No API call asserted. |
| T-18 | RSVP config + non-allowed host without proKey | Form NOT rendered; license guard active |
| T-19 | RSVP config on `localhost` without proKey | Form rendered (license allowed for dev) |
| T-22 | Required field empty (any field type from fixture) | Submit gate blocked; per-field error rendered. No POST attempted. |

## 19. Reduced Suite — Group U: Edge cases & regressions

| ID | Scenario | Bundled assertions |
|----|----------|---------------------|
| U-01 | **Regression**: Recurring weekly Berlin tz at midnight boundary | startDate/startTime NOT shifted (per existing `recurrence-tz.test.js`) |
| U-02 | iCal text rewriter: BOM, CRLF in description | All normalized; lines fold correctly |
| U-03 | Description with backslashes, semicolons, commas | Properly escaped per RFC 5545 |
| U-04 | Very long URL in location | URL preserved; no truncation; line folding correct |
| U-05 | UID stable across rerenders for same `identifier` | Two renders, same UID |
| U-06 | UID changes when `identifier` changes | Different UID family |
| U-07 | SEQUENCE increments correctly across updates | Two renders with bumped sequence — second has higher SEQUENCE |
| U-08 | Mass mount: 50 buttons on one page | All initialize; one global ESC listener attached (not 50) |
| U-09 | Mount inside iframe | Works (or documented limitation) |
| U-10 | CSP nonce propagation | Same nonce on rich-data script and any injected style/script |
| U-11 | Click while list is mid-animation | No double-open; debounce-leading guards |
| U-12 | Repeated rapid clicks on hover-trigger button | Only one open event per logical user gesture |
| U-13 | Element moved in DOM (`appendChild` to new parent) | Re-initializes cleanly |
| U-14 | Element receives new attributes after init | `attributeChangedCallback` triggers re-render |
| U-15 | Server-side / Node import (no `window`) | Module imports without throwing (per existing `server-side-init.test.js`) |
| U-16 | Date in year 2099 | Outputs handle without overflow |
| U-17 | Tz with negative offset crossing date boundary | UTC date in Google URL is on different calendar day from wall date |
| U-18 | Empty description / location / null fields | Output omits the line cleanly (no empty `DESCRIPTION:` line) |
| U-19 | Very long event title (>1000 chars) | iCal line folds; URL escapes |
| U-20 | Title with emoji | UTF-8 preserved through ICS, Google URL, all outputs |
| U-21 | Title with mixed scripts (Latin + CJK + Arabic) | Preserved everywhere |

> 📌 **CSP environment behavior — 2×2 (U-22 through U-25):** testing both the lib's nonce-application logic AND the browser's CSP enforcement. **Implementation:** each cell mounts the component inside an iframe with `srcdoc` that includes (or omits) a strict `Content-Security-Policy` meta tag, OR uses separate `@web/test-runner` HTML test pages with per-page CSP headers. Tests verify that (a) the lib correctly applies the nonce to all injected tags when `cspnonce` is set, and (b) the browser correctly blocks unsigned tags when no nonce is provided in a CSP-required environment.

| U-22 | CSP env required (`script-src 'self' 'nonce-{N}'; style-src 'self' 'nonce-{N}'`) + `cspnonce="{N}"` set on element | Rich-data `<script type="application/ld+json">` tag has `nonce="{N}"`; any injected `<style>` / `<link>` has matching nonce; component renders fully (button visible with styles, icon, label); no `securitypolicyviolation` events fire on the iframe |
| U-23 | CSP env required + `cspnonce` NOT set | Lib injects tags without nonce attribute; browser BLOCKS rich-data script and any inline styles per CSP; `securitypolicyviolation` events fire; component renders partially or unstyled — verify graceful degradation (button DOM element exists but missing styles / JSON-LD); not a thrown error from the lib (browser-side enforcement) |
| U-24 | NO CSP env + `cspnonce="{N}"` set | Component renders fully; nonce attribute present on injected tags but unenforced; no errors |
| U-25 | NO CSP env + `cspnonce` NOT set (default OSS scenario) | Component renders fully; no nonce attributes on injected tags; no errors (everyday-case sanity check) |

> 📌 **Async / timer guards (U-26, U-27)**: regression pins for documented async behavior in src. Both require fake timers; both protect against future refactors that change timing behavior unintentionally.

| U-26 | **5ms position-race guard** — `atcb_open` runs `atcb_position_list` after a 5ms `setTimeout` to avoid a layout-order race | Use fake timers. Trigger `atcb_open` (click). Synchronously immediately after: `listWrapper.style.display === 'none'` (per the documented "tiny timeout to prevent edge cases" pattern in `atcb-control.js`); no position class applied yet. Advance fake timers ≥ 5ms: `display === 'block'`, position class set (e.g. `.atcb-dropdown-anchor` or computed top/left). Pins the timer-ordering contract. |
| U-27 | **`lightMode='bodyScheme'` MutationObserver cleanup** — observer attached on body+html class changes | Mount button A with `lightMode='bodyScheme'`; toggle a class on `<body>`; assert button A picks up the change (theme class flips on shadow root). Disconnect button A from DOM. Toggle the class again; assert NO JS errors thrown (no observer firing on disposed shadow DOM). Mount button B with same identifier; toggle class; assert button B receives the signal exactly once (no double-fire from a leaked observer). Pins the observer cleanup contract — protects against memory leaks across multiple mount/unmount cycles. |

## 20. Full Cartesian Suite — parameterized templates

_These are the production-release-suite test definitions. Each template uses parametrized loops (or `mocha-each`) with the dimension product. Constraints prune impossible combos._

### F.T1 — Output correctness (regular mode) across {Env × Config × Service}
**Dimensions:**
- Env cluster (5): `desktop-win-chrome`, `desktop-mac-safari`, `desktop-mac-chrome`, `mobile-ios-safari`, `mobile-android-chrome`
- Config shape (12): C01, C02, C03, C04, C07, C08, C09, C10, C13, C14, C18, C24
- Service (6): apple-ics, google, outlook, ms365, teams, yahoo

**Per cell, assert:** URL/ICS structure correct (group-specific from G/H/I/J/K).

**Constraints:** apple-ics skipped on `mobile-android-chrome`; recurring configs (C13, C14, C18 = 3 of 12) skip yahoo, outlook, ms365, teams (option absent — covered by F.T3b instead); recurring + iOS env skips google (covered by E-13d).

**Expansion:** ~5 × 12 × 6 − 75 pruned ≈ **285 cases**

### F.T1c — Output correctness (subscribe mode) across {Env × Service}
**Dimensions:**
- Env cluster (5): same as F.T1
- Config (1): C23 (subscribe=true + hosted icsFile URL)
- Service (4): apple-ics, google, outlook, ms365 (yahoo opens manual modal — separate UI test; teams excluded by `atcbInvalidSubscribeOptions`)

**Per cell, assert:** correct subscribe-mode URL pattern (apple-ics → `webcal://`; google → subscribe URL; outlook/ms365 → behavior to confirm during impl, may be excluded).

**Expansion:** 5 × 1 × 4 = **20 cases** (further pruned if outlook/ms365 prove excluded → 10 cases)

### F.T2 — DST × Timezone × Output
**Dimensions:**
- Timezone (7): NY, LA, Berlin, London, Sydney, Tokyo, UTC
- DST position (6): pre-spring, post-spring, span-spring, pre-fall, post-fall, span-fall
- Output (3): apple-ics, google, ms365

**Per cell:** offset/UTC math correct.

**Expansion:** 7 × 6 × 3 = **126 cases** (Tokyo & UTC pass-through identically — kept for regression)

### F.T3 — RRULE shape × Active Output (content correctness)
**Dimensions:**
- RRULE shape (13): C13–C22 + COUNT-exhausted-past + 2 raw-RRULE variants (EXDATE dropped — not yet supported by lib)
- Output (2 active for recurring): apple-ics, google-desktop

**Per cell:** RRULE serialization correct in output.

**Expansion:** 13 × 2 = **26 cases**

### F.T3b — RRULE × Option Availability (deactivation correctness)
**Dimensions:**
- RRULE shape (13): same as F.T3
- Env (2): desktop, ios
- Option absences verified (5): yahoo, ms365, outlook, teams, google-on-ios

**Per cell:** option ABSENT from dropdown when recurrence is set.

**Expansion:** 13 × ((4 absences on desktop = yahoo, ms365, outlook, teams) + (5 absences on ios = +google)) = 13 × 9 = **117 cases**

### F.T4 — Env-driven routing
**Dimensions:**
- OS × Browser (14 valid combos per §1):
  - Windows: chrome, firefox (2)
  - macOS: chrome, safari, firefox (3)
  - iOS: safari, chrome, firefox, webview-regular, webview-limited (5)
  - Android: chrome, firefox, webview-regular, webview-limited (4)
- Subscribe: false, true (2)
- Bypass flag: false, true (2 — only meaningful for webview-* browsers)

**Per cell:** correct routing (direct download vs clipboard modal vs webcal vs Yahoo manual modal).

**Pruning:** Bypass flag is N/A for non-webview browsers (chrome, safari, firefox standalone) — those collapse to bypass:false only. Webview browsers keep both bypass states.

- Non-webview OS×Browser combos: 10 → 10 × 2 (subscribe) × 1 (bypass N/A) = 20
- Webview combos: 4 → 4 × 2 × 2 = 16

**Expansion:** 20 + 16 = **36 cases**

### F.T5a — UI variants (listStyle × trigger × theme)
**Dimensions:**
- listStyle (5): dropdown, dropdown-static, dropup-static, overlay, modal
- trigger (2): click, hover
- theme (3): light, dark, system

**Per cell:** correct DOM structure / classes / open behavior.

**Expansion:** 5 × 2 × 3 = **30 cases**

### F.T5b — buttonStyle (sampled, per Decision #1)
**Dimensions:**
- buttonStyle (10): `default`, `simple`, `3d`, `flat`, `round`, `neumorphism`, `text`, `date`, `custom`, `none`

**Per cell:** corresponding class applied to button element. One case each, default config otherwise.

**Note:** `buttonStyle="date"` has additional UI behavior tested in M-32 (location="Global" tz-shift) — not exercised here, this is just the class-application check.

**Expansion:** **10 cases**

### F.T6 — Localization × Output (sampled, per Decision #7)
**Dimensions:**
- Language (8): top-5 majors (en, de, fr, es, pt — confirm during impl) + 3 RTL (ar, he, fa)
- Output (2): apple-ics (content not corrupted), button-label (UI string correct)

**Per cell:** UI label correct in target language; ICS content not corrupted by encoding.

**Expansion:** 8 × 2 = **16 cases**

### F.T7 — PRO override matrix
**Dimensions:**
- proKey: PRO-EVT, PRO-RSVP
- Override field (11): name, language, customLabels, inline, customCss, hideBranding, options, listStyle, dates, recurrence, timeZone
- proOverride flag: true, false

**Per cell:** correct precedence (server vs local) per `proOverride` flag and per field membership in `atcbWcProParams`.

**Note:** `hideBranding` cell is special — per maintainer note, the flag may not work in PRO mode regardless of `proOverride`. Bundled assertion captures actual lib behavior (cross-ref R-16, M-31).

**Expansion:** 2 × 11 × 2 = **44 cases**

### F.T8 — RSVP form field types × client-side validation states
**Dimensions:**
- Field type (6): text, email, textarea, checkbox, select, hidden
- Client-side validation state (3): empty-required, invalid-format, valid-passes-gate

**Constraints:** `hidden × empty-required` is impossible — pruned. API-driven states are out of scope per §0.

**Expansion:** 6 × 3 − 1 = **17 cases**

### F.T9 — Multi-date × Tz × Sequence × UID
**Dimensions:**
- Number of dates: 1, 2, 5, 10
- Tz mix: all-same, all-different, mixed-DST
- Sequence supplied: yes/no
- UID supplied: yes/no

**Per cell:** ICS structure correct, VTIMEZONE deduped, UID family stable.

**Expansion:** 4 × 3 × 2 × 2 = **48 cases**

---

**Total Full Cartesian (sum of F.Tx):** ~775 cases (down from ~949 after matrix simplification + F.T4 / F.T1 pruning). With cross-browser tier (×3 browsers), production-tier total ≈ **2,325 case-runs**.

## 21. Test infrastructure & fixtures (open-wc / @web/test-runner)

**Test stack (matches existing repo — extend, don't replace):**
- `@open-wc/testing` v3+ — `fixture`, `expect` (Chai-flavored), `aTimeout`, `oneEvent`, `elementUpdated`
- `@web/test-runner` (already a devDep) — runs Mocha in a real browser
- Default browser: Puppeteer Chromium (existing). Add `@web/test-runner-playwright` for cross-browser Firefox + WebKit on the production tier
- `sinon` — spies/stubs/fakes for fetch, `window.dataLayer`, `Intl.DateTimeFormat`, `navigator.userAgent`
- `mocha-each` (optional) — parametrization sugar for the F-suite; plain `for` loops around `it()` also work

**File layout:**
- `test/wc-tests/r-<group>-<topic>.test.js` — Reduced Suite, one file per group (e.g. `r-A-lifecycle.test.js`, `r-C-datetime.test.js`, `r-T-rsvp.test.js`)
- `test/wc-tests/f-<template>.test.js` — Full Cartesian, one file per template (e.g. `f-T1-output-matrix.test.js`, `f-T2-dst.test.js`)
- `test/fixtures/` — shared fixtures (PRO mock responses, UA strings, DST event configs, RRULE cases, matrix definitions)
- `test/helpers/` — shared helpers (`mountAtcb`, `setUA`, `mockProFetch`, `parseIcs`, …)
- `test/wc-tests/wc-load.test.js` — existing smoke test, kept as-is
- `test/wc-tests/recurrence-tz.test.js` — existing regression test, kept as-is (its case is also captured as R-case **U-01** for documentation)
- `test/server-side-init.test.js` — existing CJS-import test, kept as-is

**`@web/test-runner` config (extend existing):**
The existing `package.json` test script is:
```
node test/test-prep.js && npx web-test-runner test/wc-tests/*.test.js --node-resolve
```

Two extensions:
1. Add a `web-test-runner.config.mjs` (or extend if one exists) defining named **groups**:
   - `dev` → glob `test/wc-tests/{wc-load,recurrence-tz,r-*}.test.js`
   - `prod` → glob `test/wc-tests/{wc-load,recurrence-tz,r-*,f-*}.test.js`
   - `cross-browser` → same as `prod` + Playwright launchers for Firefox + WebKit
2. Add npm scripts:
   - `npm run test` → existing behavior, expanded to `dev` group (Reduced Suite). Runs on every PR.
   - `npm run test:prod` → `prod` group (Reduced + Full Cartesian). Runs on release branch / pre-tag.
   - `npm run test:cross` → `cross-browser` group (3 browsers × all cases). Runs nightly.

**Per-test helpers (`test/helpers/`):**
- `mountAtcb(config)` — uses `@open-wc/testing`'s `fixture()` to mount `<add-to-calendar-button>`, awaits `el.whenInitialized()`, returns `{ host, shadow }`. Handles attribute serialization for object/array configs (JSON-stringifies `options`, `dates`, `rsvp`, `ty`, `customLabels`, `customVar`).
- `setUA(profile)` — overrides `navigator.userAgent` via `Object.defineProperty(...)`. **Important:** the lib's env-detection (`atcbIsiOS`, `atcbIsAndroid`, etc.) is evaluated at module load. For cases where the `fake*` config flags don't reach (e.g. WebView detection branches), prefer dynamic `import()` of the module per test with a fresh module cache, OR confine the test to a separate browser session. Most env tests should use `fakeMobile` / `fakeIOS` / `fakeAndroid` flags first.
- `setTz(ianaName)` — sinon-stubs `Intl.DateTimeFormat.prototype.resolvedOptions` for `useUserTZ` cases.
- `mockProFetch(payload, { status?, networkError? })` — `sinon.stub(window, 'fetch')` matched on `event.caldn.net/{key}/config.json` URL; passthrough or rejection for other URLs. With `proOverride=true`, payload can be minimal valid JSON; without proOverride, payload is loaded from `fixtures/pro-evt-config.json` or `fixtures/pro-rsvp-config.json`.
- `mockBookings(seatsBooked)` — same shape for `api.add-to-calendar-pro.com` seat-check endpoint.
- `pushedDataLayerEvents()` — reads `window.dataLayer` (initialized as a `[]` and observed by sinon spy on `.push`); returns the array filtered to `category: 'Add-to-Calendar-*'`.
- `parseIcs(host, calendarOption='apple')` — locates the `<a href="data:text/calendar...">` for the option, decodes the data URI, returns the raw VCALENDAR text plus a small structured representation (`{ events: [{ dtstart, dtend, rrule, summary, … }], vtimezones: [...] }`).
- `getCalendarUrl(host, option)` — locates the option's `<a href>` for non-ICS targets, returns the URL (parsed as `URL` for searchParam assertions).
- `assertOptionAbsent(host, option)` — asserts a calendar option is NOT present in the rendered dropdown (used heavily for E-13/13b/13c/13d cases).
- `clickOption(host, option)` — clicks the named option in the dropdown (or singleton button), awaits any state update.
- `resetDataLayer()` — beforeEach hook to clear `window.dataLayer` and re-spy.

**Fixture data (`test/fixtures/`):**
- `pro-evt-config.json` — mock response for `a37c97ad-…` (PRO-EVT) — single timed event in America/New_York with all options enabled.
- `pro-rsvp-config.json` — mock response for `a3cdf9da-…` (PRO-RSVP) — RSVP-enabled fixture with `rsvp.fields`, `rsvp.max`, `ty.type=text`, `cta` block.
- `ua-profiles.js` — UA strings keyed by env-cluster ID (`desktop-win-chrome`, `mobile-ios-safari`, `mobile-ios-chrome`, `mobile-android-chrome`, `webview-instagram`, …).
- `dst-events.js` — event configs at the 2025 NY / Berlin / Sydney DST boundaries (pre-spring, post-spring, span-spring, pre-fall, post-fall, span-fall).
- `rrule-cases.js` — array of `{ id, input, expected: { ical, googleRecur } }` (no Outlook/Yahoo since those options are absent for recurring).
- `matrix.js` — exported dimension arrays (ENVS, CONFIGS, OUTPUTS, RRULE_SHAPES, BUTTON_STYLES, LANGUAGES, …) and the `isValid(env, cfg, out)` constraint function (encodes the recurring-deactivation rules from E-13).

**Parametrization pattern (F-suite):**

With `mocha-each`:
```js
import each from 'mocha-each';
import { ENVS, CONFIGS, OUTPUTS, isValid } from '../fixtures/matrix.js';

const cells = ENVS.flatMap(env =>
  CONFIGS.flatMap(cfg =>
    OUTPUTS.filter(out => isValid(env, cfg, out))
           .map(out => [env, cfg, out])
  )
);

each(cells).describe('F.T1 | %s | %s | %s', (env, cfg, out) => {
  it('produces the expected output for the given env+config+target', async () => {
    setUA(env.ua);
    const { host } = await mountAtcb({ ...cfg.config, options: [out.option] });
    /* bundled assertions per (env, cfg, out) */
  });
});
```

Plain Mocha equivalent (no extra dep):
```js
for (const [env, cfg, out] of cells) {
  it(`F.T1 | ${env.id} | ${cfg.id} | ${out.id}`, async () => { … });
}
```

**Assertion strategy:**
- **ICS body:** deterministic; functional cases (group G) use `expect(ics).to.contain('DTSTART;TZID=America/New_York:20250615T100000')`. For full-document regressions (group U), use `chai-jest-snapshot` (added as devDep) or a hand-rolled snapshot helper that writes to `test/__snapshots__/`.
- **URL params:** parse with `new URL(href)`, assert each `url.searchParams.get('dates')` etc. Never compare full URL strings — param order varies.
- **Shadow DOM:** `expect(host.shadowRoot.querySelector('.atcb-list-item.atcb-saved')).to.exist`. For text content, use `@open-wc/testing`'s built-in `dom-helpers`.
- **Option presence/absence:** `host.shadowRoot.querySelectorAll('.atcb-list-item[data-modal-nr]')` enumerates rendered options; `assertOptionAbsent(host, 'yahoo')` checks no list item has the yahoo identifier.
- **Async state:** `await elementUpdated(host)` after attribute changes, `await aTimeout(50)` for debounced interactions.

**CI pipeline split (your two-tier idea):**
- **PR / dev runs:** `npm run test` — Reduced Suite + existing tests. Target ~150 + 3 cases, < 30s wall time, single browser (Chromium).
- **Pre-release:** `npm run test:prod` — adds Full Cartesian. ~945 cases, expect 3–8 min single-browser.
- **Nightly cross-browser:** `npm run test:cross` — Playwright Chromium + Firefox + WebKit. Same cases × 3 browsers. ~2,835 case-runs.

**Coverage:**
`@web/test-runner` supports v8 coverage natively. Add `--coverage` to `test:prod`. Configure thresholds in `web-test-runner.config.mjs`:
- `./src` line coverage > 90%
- Branch coverage > 85%
- Per-file thresholds for hot files (`atcb-links.js`, `atcb-decorate.js`, `atcb-util.js`) > 95%

## 22. Decisions log (resolved)

All 9 questions resolved + five follow-up review passes applied. Recording for reference during implementation.

### Initial 9 decisions

| # | Question | Decision | Plan impact |
|---|----------|----------|-------------|
| 1 | buttonStyle variants — exhaustive vs sample? | **Sample.** | F.T5 split: F.T5a (30 cases) + F.T5b (10 buttonStyle samples). |
| 2 | PRO `domain` validation — include in F.T7? | **Skip.** | No `domain` field in F.T7. R-17 (was domain mismatch) dropped. |
| 3 | Yahoo recurring | **All non-supporting options deactivated.** Yahoo + ALL Microsoft options (MS365, Outlook.com, MS Teams) removed for recurring; Google removed on iOS only. | E-13/13b/c/d/e/f/g; I-04, J-03, K-06; L-16/17; F.T3b. |
| 4 | EXDATE support? | **Not yet supported.** | Dropped. |
| 5 | Past recurring with COUNT exhausted? | **Renders normally** unless `pastDateHandling=hide`/`disable`. | E-12 split into E-12 / E-12a / E-12b. |
| 6 | Live API smoke tests? | **No live tests.** All fetch fully mocked. | `test:live` removed. |
| 7 | F.T6 localization dimension count? | **Top 5 + 3 RTL = 8 codes.** | F.T6 = 16 cases. |
| 8 | F.T5 buttonStyle list? | **10 variants.** | F.T5b list locked. |
| 9 | Cross-browser tier? | **Yes.** Playwright Chromium + Firefox + WebKit, nightly. | `test:cross` setup. |

### Round-1 review refinements (case-list cleanup)

| Topic | Refinement | Plan impact |
|-------|-----------|-------------|
| MS Teams + recurring | All Microsoft options deactivated for recurring. | E-13g; K-06; L-16/17; F.T3b 91 → 117. |
| Multi-date `pastDateHandling` (F-08) | Applies globally; only hides past entries from sub-modal; whole button only hides when ALL entries past. | F-08 sharpened; F-10/F-11 added. |
| Multi-date ICS file grouping | Same/no organizer + no cancellations → 1 ICS file with N VEVENTs. | F-12, F-13 added. |
| RSVP architecture | RSVP **replaces** calendar-link button entirely. | §18 top-note; T-01 tightened. |
| Group T cleanup r1 | Drop server-side cases. | Group T 23 → 16. |
| CTA flow ownership | CTA is post-save in OSS/PRO-EVT, NOT RSVP. | T-17 → R-18. |
| Wording tightening | C-15, D-03/06, E-14. | Reworded. |
| L-13 split | `fakeIOS=true` alone vs + Chrome UA. | L-13a/b. |
| L-15 / A-09 / U-17 | Reframed as "verify" or dropped. | Cleanups. |
| F.T8 hidden×empty-required | Impossible. | -1 case. |
| R-17 (domain) | Contradicts Q2. | Dropped; renumbered. |

### Round-2 review refinements (RSVP API out of scope)

| Topic | Refinement | Plan impact |
|-------|-----------|-------------|
| **RSVP API behavior** | OUT OF SCOPE. | §0 ⚠️; §18 top-note; T-03/04/13/14/15/16/20/21/23 dropped (Group T = 7). |
| F.T8 client-side only | Drop `prefilled` state; rename `valid-submit` → `valid-passes-gate`. | F.T8: 23 → 17. |

### Round-3 review refinements (matrix simplification + verification points)

| Topic | Refinement | Plan impact |
|-------|-----------|-------------|
| Devices | Only desktop vs mobile. iPad = iOS/mobile. | D1 simplified. |
| Browsers | chrome, safari, firefox, webview-regular, webview-limited. | D2 = 5. |
| OS | windows, macos, ios, android. | D3 = 4. OS×Browser = 14. |
| Output reorganized | 6 services × 2 modes. | D6 restructured. F.T1 = 285. F.T1c = 20. F.T4 = 36. |
| `timeZone="currentBrowser"` | Special-string tz lookup. | C-16 added. |
| `buttonStyle="date"` + `location="Global"` | UI tz-shift, calendar links unchanged. | M-32 added. |
| `hideBranding` in PRO | May NOT work in PRO mode. | M-30/M-31, R-16, F.T7 cell flagged. |

### Round-4 review refinements (CSP environment 2×2)

| Topic | Refinement | Plan impact |
|-------|-----------|-------------|
| **CSP nonce × CSP-required env** | 2×2 test added. | U-22, U-23, U-24, U-25 in Group U. |

### Round-5 review refinements (in-source comment audit)

Source comments scanned across all 12 `/src` files. Top-priority specialty behaviors flagged by code comments and added/sharpened:

| Topic | Refinement | Plan impact |
|-------|-----------|-------------|
| **Async non-blocking init** (`atcb-init.js`) | `connectedCallback` defers init via `setTimeout(initializeComponent, 0)`. | A-11 added (fake-timer test pinning the contract). |
| **`atcb_action` `atcb-last-event` timing** (`atcb-event.js`) | Custom-trigger path doesn't pre-populate the attribute on init (per comment). | A-08 sharpened with the null-vs-set distinction. |
| **`availability` TRANSP fallback** (`atcb-links.js`) | Invalid value graceful fallback to `OPAQUE`. | C-14 sharpened. |
| **POSIX-inverted Etc/GMT zones** (`atcb-util.js`) | Comment: "Google does not support GMT +/- time zones". `Etc/GMT+5` per POSIX = UTC−5 (sign inverted). Silent wrong-time risk. | C-17 added. |
| **`recurrence_simplyfied` (sic) misspelling** (`atcb-validate.js`, `atcb-decorate.js`) | Load-bearing misspelling used as internal API key in BOTH validator and decorator. | E-15 added (regression pin). |
| **Multi-date organizer METHOD fork** (`atcb-links.js`) | Per-date organizer drives `METHOD:REQUEST` vs `METHOD:PUBLISH` independently. | G-19 added. |
| **Cancelled-event click fork** (`atcb-links.js`) | Comment: "for cancelled dates, we show a modal — except for iCal". | H-08 added (modal for non-iCal, STATUS:CANCELLED for iCal). |
| **Platform-invalid options vs override priority** (`atcb-globals.js`, `atcb-decorate.js`) | `atcbIOSInvalidOptions` filter vs explicit `optionsIOS` override — priority undocumented. | L-18 added. |
| **EventSeries shape pin** (`atcb-generate-rich-data.js`) | Comment: "multi-date events not 100% compliant with schema.org... not supported by Google". Output shape needs regression pin. | Q-08 sharpened (subEvent `@id` format). |
| **5ms position-race guard** (`atcb-control.js`) | Comment: "tiny timeout to prevent any edge case situations where the order gets mixed up". | U-26 added. |
| **`lightMode='bodyScheme'` MutationObserver cleanup** (`atcb-init.js`) | Observer on `<html>` and `<body>` — leak risk on remount. | U-27 added. |

**Items considered but not added** (already covered or out of scope):
- `dropdown-static`/`dropup-static` viewport-flip skip (already covered by M-18/M-19; minor sharpening only)
- Chrome-on-iOS behaves like Safari-on-iOS (already covered by L-13b)
- `ty` modal type silent downgrade + `ty` form `header` JSON parse swallow (RSVP API out of scope per Round-2)

### Updated totals

- **Reduced Suite:** ~256 cases (Round 5 added 9 new cases: A-11, C-17, E-15, G-19, H-08, L-18, U-26, U-27 + sharpened A-08/C-14/Q-08)
- **Full Cartesian:** ~775 cases (unchanged)
- **Cross-browser tier:** ~2,325 case-runs

**Plan is locked.** Ready to scaffold helpers/fixtures and start writing test code, beginning with Group A (Lifecycle & Registration).

## 23. Implementation notes — source-verified corrections (v2.15)

During implementation, the actual v2.15 source was cross-checked. The following plan assumptions were corrected (tests pin the ACTUAL behavior):

| Plan item | Plan assumption | Actual v2.15 behavior |
|-----------|-----------------|------------------------|
| E-15 | `recurrence_simplyfied` misspelling is load-bearing | **Spelling is FIXED** in this codebase: `recurrence_simplified` is used consistently in decorate + validate. E-15 pins the corrected key. |
| H-01 | Google base URL `calendar/render?action=TEMPLATE` | Desktop uses `https://calendar.google.com/calendar/r/eventedit?`; `render?action=TEMPLATE` is the MOBILE base. Android non-WebView additionally wraps into `intent://...;package=com.google.android.calendar;S.browser_fallback_url=...`. |
| I-01/I-02 | Outlook deeplink base for all envs | Desktop uses `/calendar/0/action/compose?rru=addevent`; the deeplink path is mobile-only. |
| J-01 | Yahoo `dur=HHMM` param | No duration param for timed events (st/et only). Single all-day uses `dur=allday` + `st` only; multi-day all-day converts to a timed range in the browser tz (Yahoo workaround). |
| N-* | dataLayer keys `category`/`action` | Actual push shape: `{ eventCategory, eventAction, eventLabel, event }`. |
| L-18 | Priority of optionsIOS vs platform-invalid filter unknown | **Explicit override WINS**: the iOS/Android invalid-option filters only apply when NO `optionsIOS`/`optionsMobile` is set. |
| L-15 | File-download target to verify | Confirmed: `_self` on mobile, `_blank` otherwise (`atcb_save_file`). |
| M-30/M-31/R-16 | hideBranding behavior to verify | OSS + hideBranding: in-list `#atcb-reference` attribution is hidden, but a hidden license-note div `#atcb-reference.atcb-attribution` is appended to `document.body`. PRO: `hideBranding`/`ty`/`rsvp` are EXCLUDED from the client-side override merge unless the page runs on caldn.net / add-to-calendar-pro.com. Additionally, PRO without proxy+hideBranding appends a "Powered by add-to-calendar-pro.com" note to event descriptions. |
| C-16 | `timeZone="currentBrowser"` vs `useUserTZ` unclear | Same branch in decorate (`timeZone === 'currentBrowser' || useUserTZ`). |
| P-06/K-02 | Subscribe+recurring / Teams all-day to verify | Teams all-day produces a URL with unencoded offset workaround; mobile+subscribe drops ms365/outlookcom (new case P-04b). MS365/Outlook.com SUBSCRIBE exists via `/calendar/0/addfromweb/?url=...&name=...` (plan's F.T1c "may be excluded" resolved: they exist on desktop). |
| C-15/H-08 | Google URL cancellation note | Confirmed: cancelled + non-iCal shows a warning modal and opens NO URL; iCal delivers `STATUS:CANCELLED` ICS. |
| A-08 | atcb-last-event timing | Confirmed: custom (atcb_action) triggers carry no attribute until the first event fires. |
| U-05/U-06 | UID stable across rerenders | NOT pinned yet - auto-UID generation needs run-phase verification; test deferred. |
| Group T | RSVP form DOM details | RSVP license guard regex `^(localhost|.*\.add-to-calendar-pro\.com)$` allows the test runner host (localhost). API behavior remains out of scope. |

**Suite layout as implemented:**
- `test/wc-tests/r-*.test.js` — Reduced Suite (runs with `npm run test`, alongside the two pre-existing tests)
- `test/wc-tests-full/f-*.test.js` — Full Cartesian Suite (runs with `npm run test:prod`)
- `test/helpers/` — mount, capture (window.open + file-save interception, UA override), ics parser, dom, datalayer helpers
- `test/fixtures/` — event configs (incl. 2050 DST corners), PRO mock payloads + fetch mock, matrix definitions with `isValid()` constraint logic and an Intl-based tz oracle
