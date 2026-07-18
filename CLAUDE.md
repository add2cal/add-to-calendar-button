# CLAUDE.md — add-to-calendar-button

Repo context for AI coding assistants. Keep slim — loaded into every agent session.

## What this is

Open-source web component (`<add-to-calendar-button>`) that renders an "Add to Calendar" button generating Google / Apple / Outlook / Yahoo / Teams links and ICS files. Sister product **add-to-calendar-pro** (proprietary) adds RSVP, hosted ICS, and analytics via a `proKey`.

- Web: https://add-to-calendar-button.com
- PRO docs: https://docs.add-to-calendar-pro.com
- License: Elastic License 2.0

## Active project: v3 refactor (branch `refactor/v3`)

A full rewrite to Lit + strict TypeScript + Vite is in progress, executed phase by phase against the behavior test suite. Plan, locked decisions, phase gates, and execution rules live in **`.ai/REFACTOR-PLAN.md`** — read it before touching anything on `refactor/v3` or its `v3/phase-*` branches. Where that plan explicitly supersedes statements in this file (browser floor, build system, TypeScript — notably gotcha 15), the plan wins on those branches.

## Source structure (`/src` only — ignore `/dist`, `/assets/css`)

| Path                            | Role                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `element/index.ts`              | `AddToCalendarButton` LitElement, attribute scan, PRO data fetch, global ESC listener               |
| `ui/templates.ts`               | lit-html templates for the button path (incl. date-style content)                                   |
| `compat/attributes.ts`          | Official kebab-case attribute names + legacy alias resolution (official wins)                       |
| `action/index.ts`               | `atcb_action` imperative API                                                                        |
| `core/store.ts`                 | Per-instance state store (active button, per-option counters, config)                               |
| `core/decorate.ts`              | Config normalization orchestrator (+ `decorate-dates` / `decorate-recurrence` / `decorate-options`) |
| `core/validate.ts`              | Two-phase validation (`atcb_check_required` + `atcb_validate`)                                      |
| `core/globals.ts`               | Module-load env detection, constants, WC attribute param lists                                      |
| `core/dates.ts`                 | Time formatting, timestring, RRULE parsing, occurrence math, special tz map                         |
| `core/text.ts`                  | Sanitizers and content rewriters (secure content/url, html/ical rewrite)                            |
| `core/util.ts`                  | Misc: debounce, uuid, clipboard, file saving                                                        |
| `core/events.ts`                | dataLayer pushes + `atcb-last-event` host attribute                                                 |
| `ui/generate.ts`                | DOM construction (button, list, modal)                                                              |
| `ui/control.ts`                 | Open/close/toggle, body-scroll lock                                                                 |
| `ui/positioning.ts`             | Dropdown/button positioning                                                                         |
| `ui/pro.ts`                     | PRO/RSVP/CTA UI — license-guarded with `@preserve` blocks                                           |
| `generators/index.ts`           | Per-option link dispatch + shared success handling                                                  |
| `generators/google.ts` etc.     | One module per calendar service (google, yahoo, outlook, msteams, ical)                             |
| `generators/rich-data.ts`       | Schema.org JSON-LD injection                                                                        |
| `i18n/index.ts`                 | Translation strings keyed by ISO 639-1 code                                                         |
| `styles/css-template.ts`        | Style registry: core+default inline, on-demand deltas, `atcb_register_style`                        |
| `styles/css/`                   | CSS sources: tokens + core + per-style deltas (split via `scripts/split-css.mjs`)                   |
| `types.ts`                      | Shared internal types (input vs decorated config)                                                   |
| `index.ts` / `entry-browser.ts` | Package / classic-script entries                                                                    |

## Tech stack

Strict TypeScript in `./src`. LitElement web component (shell + button rendered via lit-html templates in `ui/templates.ts`; dropdown/modal/overlay layers imperative by design). Shadow DOM. Deps: `lit` (external in the ES build, bundled in CJS + browser bundles) and `timezones-ical-library` for VTIMEZONE blocks and DST-aware offsets. Build: Vite + esbuild via `scripts/build.mjs`. Test: `@open-wc/testing` on `@web/test-runner` (transpiles src TS on the fly).

## Critical gotchas (read before changing anything)

1. **`recurrence_simplified` is the internal simplified-RRULE flag** (historically misspelled as `recurrence_simplyfied`; the spelling is FIXED in this codebase). It is read in BOTH `core/validate.ts` and `core/decorate-recurrence.ts` — any rename must update both call sites simultaneously or simplified-RRULE validation is silently bypassed. Test `E-15` pins the key.

2. **`@preserve` blocks are license guards.** Found in `ui/pro.ts` (RSVP, CTA, branding). Removing them violates the Elastic License 2.0. The license check is `(proKey || hostname matches localhost / *.add-to-calendar-pro.com)`.

3. **Env detection runs at module load.** `atcbIsiOS()`, `atcbIsAndroid()`, `atcbIsSafari()`, `atcbIsMobile()`, `atcbIsWebView()`, `atcbIsProblematicWebView()` are evaluated once when `core/globals.ts` is imported. To force a different env at runtime, use the config flags `fakeMobile` / `fakeIOS` / `fakeAndroid`.

4. **`connectedCallback` defers init via `setTimeout(initializeComponent, 0)`.** The component is NOT initialized synchronously after `appendChild()`. Always `await el.whenInitialized()`.

5. **Recurring-event option deactivation.** When `recurrence` is set, the lib REMOVES from the dropdown:
   - Yahoo, MS365, Outlook.com, MS Teams — all envs
   - Google — iOS only

   Apple/iCal stays. Enforced in `core/decorate-options.ts`.

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

- **Add a calendar service:** new module in `generators/` + dispatch in `generators/index.ts` → option key in `atcbOptions` (`core/globals.ts`) → label keys in all languages (`i18n/index.ts`) → icon SVG.
- **Add a config field:** add to `atcbWcParams` (and its typed sub-lists) in `core/globals.ts` AND `ATCBInputConfig` in `types.ts` → validator in `core/validate.ts` → handle in `core/decorate*.ts` → document on website.
- **Tz / DST bug:** check `core/dates.ts` `atcb_generate_time` and the special-tz regex in `atcb_map_special_time_zones`.
- **Recurring-event bug:** `core/decorate-recurrence.ts`.
- **UI bug:** `ui/control.ts` / `ui/positioning.ts` (open/close/position) or `ui/generate.ts` (DOM structure).
- **Schema.org / SEO:** `generators/rich-data.ts`.
- **i18n / new language:** `i18n/index.ts` `i18nStrings` map; add to `availableLanguages` export.

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

## Styles

`assets/css/*` is GENERATED (reconstructed full stylesheets for CDN hotlinks + customCss compat) — edit the sources in `src/styles/css/` instead. Bundles inline only core + the default style; other styles fetch from `{scriptOrigin}/styles/{name}.css` (override via `style-source`), register via `atcb_register_style`, or prefetch via `load-all-styles`.

## Build & deploy

- `npm run build` — Grunt build (assembles `dist/`)
- Releases tagged + published to npm. CDN: `cdn.jsdelivr.net/npm/add-to-calendar-button`.

## What NOT to change

- `recurrence_simplified` key name (must stay in sync between decorate + validate; pinned by test E-15)
- `@preserve` blocks in `ui/pro.ts` and `generators/rich-data.ts`
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
- Official attribute names are kebab-case (`start-date`; exception: `prokey`); legacy lowercased-camelCase spellings keep working via `compat/attributes.ts`, official wins when both are set
- Object/array attributes accepted as JSON strings (e.g. `options='["Google","Apple"]'`)

## Common pitfalls when adding code

- **Forgetting to update one of the typed sub-lists** in `atcb-globals.js` (`atcbWcBooleanParams`, `atcbWcObjectParams`, `atcbWcArrayParams`, `atcbWcNumberParams`) — the new attribute won't parse correctly.
- **Adding a label string in only one language** — `atcb-i18n.js` keys must exist in every language; missing keys silently fall back to English.
- **Inline scripts/styles without nonce propagation** — break CSP-strict environments. See `atcb-generate-rich-data.js` for the nonce-handling pattern.
- **Synchronous DOM assertions after mounting** — element is not initialized yet (see gotcha #4).
- **Modifying `atcb-globals.js` invalid-options arrays** without updating the override-priority logic in `atcb-decorate.js` — `optionsIOS` / `optionsMobile` interaction with `atcbIOSInvalidOptions` / `atcbAndroidInvalidOptions` is subtle.
