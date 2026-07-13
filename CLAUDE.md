# CLAUDE.md — add-to-calendar-button

Repo context for AI coding assistants. Keep slim — loaded into every agent session.

## What this is

Open-source web component (`<add-to-calendar-button>`) that renders an "Add to Calendar" button generating Google / Apple / Outlook / Yahoo / Teams links and ICS files. Sister product **add-to-calendar-pro** (proprietary) adds RSVP, hosted ICS, and analytics via a `proKey`.

- Web: https://add-to-calendar-button.com
- PRO docs: https://docs.add-to-calendar-pro.com
- License: Elastic License 2.0

## Source structure (`/src` only — ignore `/dist`, `/assets/css`)

| File | Role |
|------|------|
| `atcb-init.js` | `AddToCalendarButton` custom element, `atcb_action` imperative API, PRO data fetch, global ESC listener |
| `atcb-decorate.js` | Config normalization pipeline (largest file) |
| `atcb-validate.js` | Two-phase validation (`atcb_check_required` + `atcb_validate`) |
| `atcb-globals.js` | Module-load env detection, constants, `atcbWcParams` web-component attribute list |
| `atcb-links.js` | Calendar URL/ICS construction per service |
| `atcb-control.js` | Open/close/toggle, dropdown positioning, body-scroll lock |
| `atcb-generate.js` | DOM construction (button, list, modal) |
| `atcb-generate-pro.js` | PRO/RSVP/CTA UI — license-guarded with `@preserve` blocks |
| `atcb-generate-rich-data.js` | Schema.org JSON-LD injection |
| `atcb-util.js` | Time formatters, RRULE parser, escapers, debounce, position |
| `atcb-i18n.js` | Translation strings keyed by ISO 639-1 code |
| `atcb-event.js` | dataLayer pushes + `atcb-last-event` host attribute |

## Tech stack

Vanilla JS in `./src` — no TypeScript, no framework. Web Component / Shadow DOM. External dep: `timezones-ical-library` for VTIMEZONE blocks and DST-aware offsets. Build: Grunt. Test: `@open-wc/testing` on `@web/test-runner`.

## Critical gotchas (read before changing anything)

1. **`recurrence_simplified` is the internal simplified-RRULE flag** (historically misspelled as `recurrence_simplyfied`; the spelling is FIXED in this codebase). It is read in BOTH `atcb-validate.js` and `atcb-decorate.js` — any rename must update both call sites simultaneously or simplified-RRULE validation is silently bypassed. Test `E-15` in `test/wc-tests/r-E-recurring.test.js` pins the key.

2. **`@preserve` blocks are license guards.** Found in `atcb-generate-pro.js` (RSVP, CTA, branding). Removing them violates the Elastic License 2.0. The license check is `(proKey || hostname matches localhost / *.add-to-calendar-pro.com)`.

3. **Env detection runs at module load.** `atcbIsiOS()`, `atcbIsAndroid()`, `atcbIsSafari()`, `atcbIsMobile()`, `atcbIsWebView()`, `atcbIsProblematicWebView()` are evaluated once when `atcb-globals.js` is imported. To force a different env at runtime, use the config flags `fakeMobile` / `fakeIOS` / `fakeAndroid`.

4. **`connectedCallback` defers init via `setTimeout(initializeComponent, 0)`.** The component is NOT initialized synchronously after `appendChild()`. Always `await el.whenInitialized()`.

5. **Recurring-event option deactivation.** When `recurrence` is set, the lib REMOVES from the dropdown:
   - Yahoo, MS365, Outlook.com, MS Teams — all envs
   - Google — iOS only
   
   Apple/iCal stays. Enforced in `atcb-decorate.js` option filtering.

6. **`hideBranding=true` is OSS-only.** With a valid `proKey`, the small "Add to Calendar PRO" branding is enforced regardless of the flag — even with `proOverride=true`. Intentional.

7. **`buttonStyle="date"` + `location="Global"`** is a magic-string combo. The UI date/time/tz is converted to the user's browser tz; calendar links keep the original configured time. UI-only transformation.

8. **`timeZone="currentBrowser"`** is a special string value (not a real IANA name). Triggers browser-tz lookup.

9. **`Etc/GMT` zones are POSIX-inverted.** `Etc/GMT+5` means UTC−5, not UTC+5. The `atcb_map_special_time_zones` regex respects this.

10. **5ms `setTimeout` in `atcb_open`** is intentional — avoids a layout-order race in dropdown positioning. Don't remove or shorten without testing positioning regressions.

11. **`lightMode='bodyScheme'`** attaches a `MutationObserver` to `<html>` and `<body>` class attributes. Ensure observer cleanup on `disconnectedCallback` to prevent leaks across mount/unmount cycles.

12. **PRO config fetch endpoint** is `https://event.caldn.net/{proKey}/config.json` (with `dev=true` flag → `event-dev.caldn.net`). RSVP endpoints hit `https://api.add-to-calendar-pro.com`. In the PRO merge, `hideBranding`/`ty`/`rsvp` are excluded from client-side overrides unless the page runs on caldn.net / add-to-calendar-pro.com.

12b. **dataLayer push shape** is `{ eventCategory, eventAction, eventLabel, event }` (categories `Add-to-Calendar-Button` / `Add-to-Calendar-RSVP`), mirrored as `atcb-last-event="<event>:<trigger>"` on the host element.

13. **Cancelled-event click forks** at the calendar service: non-iCal services (Google/Outlook/Yahoo/Teams) show a warning modal; iCal/Apple downloads an ICS with `STATUS:CANCELLED`.

14. **Multi-date ICS grouping rule:** if all entries share the same (or no) organizer AND no entries are cancelled, output is a single ICS file with N VEVENTs. Otherwise behavior diverges (verify per change).

15. **No TypeScript, no ESM-only deps.** Repo targets broad browser support including older WebViews. Don't introduce build-step features that break IE-era WebViews without explicit approval.

## Where things live

- **Add a calendar service:** new function in `atcb-links.js` → option key in `atcbOptions` (`atcb-globals.js`) → label keys in all languages (`atcb-i18n.js`) → icon SVG.
- **Add a config field:** add to `atcbWcParams` (and typed sub-list `atcbWcBooleanParams` / `atcbWcObjectParams` / etc.) in `atcb-globals.js` → validator in `atcb-validate.js` → handle in `atcb-decorate.js` → document on website.
- **Tz / DST bug:** check `atcb-util.js` `atcb_generate_time` and the special-tz regex in `atcb_map_special_time_zones`.
- **Recurring-event bug:** `atcb-decorate.js` `atcb_decorate_data_rrule` and `atcb_decorate_data_recurring_events`.
- **UI bug:** `atcb-control.js` (open/close/position) or `atcb-generate.js` (DOM structure).
- **Schema.org / SEO:** `atcb-generate-rich-data.js`.
- **i18n / new language:** `atcb-i18n.js` `i18nStrings` map; add to `availableLanguages` export.

## Testing

- `npm run test` - DEFAULT/CI tier: pre-existing quick tests + the Smoke Suite (`test/wc-tests-smoke/`, {Desktop, Mobile} x {OSS, PRO} + RSVP render, seconds of test runtime). Runs a full build first via `test/test-prep.js`.
- `npm run test:extended` - adds the full Reduced Suite (groups A-U in `test/wc-tests/r-*.test.js`, ~215 cases). On demand / pre-merge.
- `npm run test:full` - additionally runs the Full Cartesian Suite in `test/wc-tests-full/` (`f-*.test.js`). On demand / releases.
- `.ai/TEST-STRATEGY.md` - the test strategy: tiers, helpers, conventions, library behavior notes, and load-bearing runner constraints. Read it before writing or changing tests.
- Helpers in `test/helpers/` (mount, window.open/file-save interception, ICS parser); fixtures in `test/fixtures/`.

Existing baseline tests (don't break):
- `test/server-side-init.test.js` — CJS smoke
- `test/wc-tests/wc-load.test.js` — WC init smoke
- `test/wc-tests/recurrence-tz.test.js` — Berlin midnight regression

## Build & deploy

- `npm run build` — Grunt build (assembles `dist/`)
- Releases tagged + published to npm. CDN: `cdn.jsdelivr.net/npm/add-to-calendar-button`.

## What NOT to change

- `recurrence_simplified` key name (must stay in sync between decorate + validate; pinned by test E-15)
- `@preserve` blocks in `atcb-generate-pro.js` and `atcb-generate-rich-data.js`
- Elastic License 2.0 banner
- License-check regex (`proKey || localhost || *.add-to-calendar-pro.com`)
- 5ms `setTimeout` race guard in `atcb_open`
- Module-load-time env detection (without proper migration plan)
- `cspnonce` forbidden-character validation (security guard)

## Style

- 2-space indent, single quotes, trailing semicolons
- Function names: `atcb_*` prefix for all lib functions (snake_case)
- Constants: `atcb*` camelCase (no underscore separator), e.g. `atcbOptions`, `atcbIOSInvalidOptions`
- Boolean configs accept `true`, `'true'`, `'1'`, bare attribute presence — coerced in `atcb-decorate.js`
- HTML web-component attributes are case-insensitive; the lib reads them lowercase
- Object/array attributes accepted as JSON strings (e.g. `options='["Google","Apple"]'`)

## Common pitfalls when adding code

- **Forgetting to update one of the typed sub-lists** in `atcb-globals.js` (`atcbWcBooleanParams`, `atcbWcObjectParams`, `atcbWcArrayParams`, `atcbWcNumberParams`) — the new attribute won't parse correctly.
- **Adding a label string in only one language** — `atcb-i18n.js` keys must exist in every language; missing keys silently fall back to English.
- **Inline scripts/styles without nonce propagation** — break CSP-strict environments. See `atcb-generate-rich-data.js` for the nonce-handling pattern.
- **Synchronous DOM assertions after mounting** — element is not initialized yet (see gotcha #4).
- **Modifying `atcb-globals.js` invalid-options arrays** without updating the override-priority logic in `atcb-decorate.js` — `optionsIOS` / `optionsMobile` interaction with `atcbIOSInvalidOptions` / `atcbAndroidInvalidOptions` is subtle.
