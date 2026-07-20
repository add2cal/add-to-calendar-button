# CLAUDE.md — add-to-calendar-button

Repo context for AI coding assistants. Keep slim — loaded into every agent session.

## What this is

Open-source web component (`<add-to-calendar-button>`) that renders an "Add to Calendar" button generating Google / Apple / Outlook / Yahoo / Teams links and ICS files. Sister product **add-to-calendar-pro** (proprietary) adds RSVP, hosted ICS, and analytics via a `proKey`.

- Web: https://add-to-calendar-button.com
- PRO docs: https://docs.add-to-calendar-pro.com
- License: Elastic License 2.0

Deep dives live in `.ai/`: **ARCHITECTURE.md** (module map, data flow, pipelines, contracts vs internals), **RELEASE.md** (artifacts, version tooling, gates), **TEST-STRATEGY.md** + **TEST-CASES.md** (test tiers, conventions, case lists). Read ARCHITECTURE.md before structural changes.

## Source structure (`/src` only — `/dist` and `/assets/css` are generated)

| Path                                     | Role                                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `element/index.ts`                       | `AddToCalendarButton` LitElement: attribute scan, init pipeline, PRO fetch, css loading, global listeners, cleanup |
| `action/index.ts`                        | `atcb_action` imperative API                                                                                       |
| `compat/attributes.ts`                   | Official kebab-case attribute names + legacy alias resolution (official wins)                                      |
| `ssr/index.ts`                           | DOM-free declarative-shadow-DOM shell renderer (`add-to-calendar-button/ssr`)                                      |
| `ui/templates.ts`                        | lit-html templates for the button path (incl. date-style content)                                                  |
| `ui/generate.ts`                         | Imperative DOM construction (list, modal, overlay)                                                                 |
| `ui/control.ts`                          | Open/close/toggle, body-scroll lock                                                                                |
| `ui/positioning.ts`                      | Dropdown/button positioning                                                                                        |
| `ui/pro.ts`                              | PRO/RSVP/CTA UI — license-guarded with `@preserve` blocks                                                          |
| `core/store.ts`                          | Per-instance state store (active button, per-option counters, config)                                              |
| `core/decorate.ts`                       | Config normalization orchestrator (+ `decorate-dates` / `decorate-recurrence` / `decorate-options`)                |
| `core/validate.ts`                       | Two-phase validation (`atcb_check_required` + `atcb_validate`)                                                     |
| `core/globals.ts`                        | Module-load env detection, constants, WC attribute param lists, icons                                              |
| `core/dates.ts`                          | Time formatting, timestring, RRULE parsing, occurrence math (incl. fast-forward), special tz map                   |
| `core/sizes.ts`                          | Size attribute parsing — dependency-free on purpose (shared with the ssr entry)                                    |
| `core/text.ts`                           | Sanitizers: secure content/url (scheme allowlists), unsafe-key strip, html/ical rewrite                            |
| `core/util.ts`                           | Misc: debounce, uuid, clipboard, file saving                                                                       |
| `core/events.ts`                         | dataLayer pushes + `atcb-last-event` host attribute                                                                |
| `generators/`                            | One module per calendar service + dispatch (`index.ts`) + schema.org (`rich-data.ts`)                              |
| `i18n/index.ts` + `i18n/locales/`        | Locale registry (en inline, on-demand packs, full-locale handling) + nested JSON sources                           |
| `styles/css-template.ts` + `styles/css/` | Style registry (core+default inline, on-demand deltas) + split css sources                                         |
| `types.ts`                               | Internal types (input vs decorated config) + the PUBLIC surface types and global element declarations              |
| `index.ts` / `entry-browser.ts`          | Package / classic-script entries                                                                                   |

## Tech stack

Strict TypeScript in `./src` (target ES2017 bundles; full experience at Baseline 2023, declarative shadow DOM is progressive enhancement). LitElement web component: shell + button rendered via lit-html templates, dropdown/modal/overlay layers imperative by design. Shadow DOM. Deps: `lit` (external in the ES build, bundled in CJS + browser bundles) and `timezones-ical-library`. Build: Vite + esbuild via `scripts/build.mjs`. Tests: `@open-wc/testing` on `@web/test-runner`.

## Critical gotchas (read before changing anything)

1. **`recurrence_simplified` is the internal simplified-RRULE flag** (historically misspelled as `recurrence_simplyfied`; the spelling is FIXED in this codebase). It is read in BOTH `core/validate.ts` and `core/decorate-recurrence.ts` — any rename must update both call sites simultaneously or simplified-RRULE validation is silently bypassed. Test `E-15` pins the key.

2. **`@preserve` blocks are license guards.** Found in `ui/pro.ts` (RSVP, CTA, branding). Removing them violates the Elastic License 2.0. The license check is `(proKey || hostname matches localhost / *.add-to-calendar-pro.com)`.

3. **Env detection runs at module load.** `atcbIsiOS()`, `atcbIsAndroid()`, `atcbIsSafari()`, `atcbIsMobile()`, `atcbIsWebView()`, `atcbIsProblematicWebView()` are evaluated once when `core/globals.ts` is imported. To force a different env at runtime, use the config flags `fakeMobile` / `fakeIOS` / `fakeAndroid`.

4. **`connectedCallback` defers init via `setTimeout(initializeComponent, 0)`.** The component is NOT initialized synchronously after `appendChild()`. Always `await el.whenInitialized()`.

5. **Recurring-event option deactivation.** When `recurrence` is set, the lib REMOVES from the dropdown: Yahoo, MS365, Outlook.com, MS Teams (all envs); Google (iOS only). Apple/iCal stays. Enforced in `core/decorate-options.ts`.

6. **`hideBranding=true` is OSS-only.** With a valid `proKey`, the small "Add to Calendar PRO" branding is enforced regardless of the flag — even with `proOverride=true`. Intentional.

7. **`buttonStyle="date"` + `location="Global"`** is a magic-string combo. The UI date/time/tz is converted to the user's browser tz; calendar links keep the original configured time. UI-only transformation.

8. **`timeZone="currentBrowser"`** is a special string value (not a real IANA name). Triggers browser-tz lookup.

9. **`Etc/GMT` zones are POSIX-inverted.** `Etc/GMT+5` means UTC−5, not UTC+5. The `atcb_map_special_time_zones` regex respects this.

10. **5ms `setTimeout` in `atcb_open`** is intentional — avoids a layout-order race in dropdown positioning. Don't remove or shorten without testing positioning regressions.

11. **Teardown is a pinned contract.** bodyScheme MutationObservers, store entries, modal hosts, scroll locks and schema scripts are all cleaned up on `disconnectedCallback` — group MEM asserts it (instrumented observers + heap bound). Anything you register per instance must be cleaned up there too.

12. **PRO config fetch endpoint** is `https://event.caldn.net/{proKey}/config.json` (with `dev=true` flag → `event-dev.caldn.net`). RSVP endpoints hit `https://api.add-to-calendar-pro.com`. In the PRO merge, `hideBranding`/`ty`/`rsvp` are excluded from client-side overrides unless the page runs on caldn.net / add-to-calendar-pro.com. The merge iterates a CLOSED param allowlist — keep it that way (prototype-pollution safety, pinned by group SEC).

12b. **dataLayer push shape** is `{ eventCategory, eventAction, eventLabel, event }` (categories `Add-to-Calendar-Button` / `Add-to-Calendar-RSVP`), mirrored as `atcb-last-event="<event>:<trigger>"` on the host element.

13. **Cancelled-event click forks** at the calendar service: non-iCal services (Google/Outlook/Yahoo/Teams) show a warning modal; iCal/Apple downloads an ICS with `STATUS:CANCELLED`.

14. **Multi-date ICS grouping rule:** if all entries share the same (or no) organizer AND no entries are cancelled, output is a single ICS file with N VEVENTs. Otherwise behavior diverges (verify per change).

15. **The build string-replaces exact hook declarations.** `scripts/build.mjs` targets verbatim marker constants in the source: `atcbCssTemplate`, `atcbStyleRelPath`, `atcbLocaleRelPath` (css-template.ts, i18n/index.ts) and the ssr data hooks (`atcbSsrCssTemplate`, `atcbSsrLabels`). Reformatting or renaming those declarations breaks the build loudly — the sanity checks throw.

16. **Never derive asset urls via `new URL(rel, import.meta.url)`.** Bundlers rewrite that pattern statically (vite once inlined a module's own SOURCE as an asset url). Script bases are derived via plain string operations on `import.meta.url` / `document.currentScript` — keep it that way.

17. **lit must resolve through its `node` condition for anything Node runs.** The browser build of lit extends `HTMLElement` at module scope and crashes a plain `require`/server import. The CJS and SSR build passes set `resolve.conditions` accordingly; the ssr entry's import graph must additionally stay lit-free entirely (that is why `core/sizes.ts` exists).

18. **The element constructor ADOPTS an existing shadow root.** With server-rendered declarative shadow DOM, `this.shadowRoot` already exists at upgrade — calling `attachShadow` would CLEAR it. The constructor branches, keeps the shell nodes painted, and `removeSsrShell()` swaps them out after the real render. Shell wrapper = `[data-atcb-ssr]`; client queries exclude it.

19. **Config-param JSON attributes are hardened.** Everything JSON-parsed (attributes, inline config, action input, PRO response) passes `atcb_strip_unsafe_keys`; urls pass scheme allowlists in `core/text.ts`. New input paths must go through the same funnels (group SEC pins this).

## Where things live

- **Add a calendar service:** new module in `generators/` + dispatch in `generators/index.ts` → option key in `atcbOptions` (`core/globals.ts`) → label keys in all `i18n/locales/*.json` → icon SVG in `core/globals.ts`.
- **Add a config field:** `atcbWcParams` + typed sub-lists in `core/globals.ts` AND `ATCBInputConfig` + the public types in `types.ts` → validator in `core/validate.ts` → handle in `core/decorate*.ts` → demo configuration page.
- **Add a language:** `i18n/locales/{lang}.json` + `availableLanguages` in `i18n/index.ts` + `ATCBLanguage` union in `types.ts` + demo configuration page list. Locale JSONs are NESTED; keys that double as group names use the `.title` leaf; never create leaf-vs-prefix conflicts.
- **Tz / DST bug:** `core/dates.ts` (`atcb_generate_time`, `atcb_map_special_time_zones`).
- **Recurring-event bug:** `core/decorate-recurrence.ts` + the occurrence math (incl. arithmetic fast-forward) in `core/dates.ts`.
- **UI bug:** `ui/control.ts` / `ui/positioning.ts` (open/close/position) or `ui/generate.ts` / `ui/templates.ts` (DOM).
- **Packaging / exports:** package.json exports map + `scripts/build.mjs` (shims, per-entry types, cjs twins) + `scripts/test-package.mjs`.
- **SSR shell:** `src/ssr/index.ts` (server) + the adoption/swap logic in `element/index.ts` (client).

## Testing

- `npm run test` — smoke tier (CI default). Builds first via `test/test-prep.js`.
- `npm run test:extended` — + reduced suite (groups in `test/wc-tests/r-*.test.js`).
- `npm run test:full` — + full cartesian suite (`test/wc-tests-full/f-*.test.js`). Release bar: BOTH browsers (chrome-headless-shell and full Chrome via `CHROME_PATH`).
- `npm run test:package` — pack + install + consumption probes (Node CJS/ESM, types under bundler+node16, vite build with size bounds).
- `npm run test:ssr` — DOM-free shell rendering (node:test against dist/ssr).
- `.ai/TEST-STRATEGY.md` — tiers, helpers, conventions, load-bearing runner constraints (concurrency 1!). `.ai/TEST-CASES.md` — the case list. Read both before writing tests.
- **Always compare the reported test COUNT against the expected one for the tier.** The runner counts a test file whose module import fails as a PASSING file with 0 tests — a rename/import typo can silently unregister a whole group. When you add cases, record the new expected totals.

## Styles

`assets/css/*` is GENERATED (reconstructed full stylesheets for CDN hotlinks + customCss compat) — edit the sources in `src/styles/css/` (tokens + core + per-style deltas) instead, then build. Bundles inline only core + the default style; other styles fetch from `{scriptOrigin}/styles/{name}.css` (override via `style-source`), register via `atcb_register_style`, or prefetch via `load-all-styles`. `scripts/split-css.mjs` re-derives split sources from full stylesheets when needed (parity-checked).

## Build & release

- `npm run build` — full dist via `scripts/build.mjs` (`--min` adds minified browser bundles; sanity checks throw on malformed artifacts).
- `node scripts/set-version.mjs [patch|minor|major|prerelease|x.y.z|x.y.z-tag.n]` — prerelease-capable version bump across package.json, banners, constants, demo footer.
- Releases: see `.ai/RELEASE.md` (gates, npm `next` pre-release flow, what ships where). CDN: `cdn.jsdelivr.net/npm/add-to-calendar-button`.

## What NOT to change

- `recurrence_simplified` key name (must stay in sync between decorate + validate; pinned by test E-15)
- `@preserve` blocks in `ui/pro.ts` and `generators/rich-data.ts`
- Elastic License 2.0 banner
- License-check regex (`proKey || localhost || *.add-to-calendar-pro.com`)
- 5ms `setTimeout` race guard in `atcb_open`
- Module-load-time env detection (without proper migration plan)
- `cspnonce` forbidden-character validation (security guard)
- The build hook constants (gotcha 15) and the string-op script-base derivation (gotcha 16)
- The documented DOM observables and attribute aliases (contracts — see `.ai/ARCHITECTURE.md`)

## Style

- 2-space indent, single quotes, trailing semicolons; ESLint + Prettier enforced
- Function names: `atcb_*` prefix for exported lib functions (snake_case); constants `atcb*` camelCase (e.g. `atcbOptions`)
- Boolean configs accept `true`, `'true'`, `'1'`, bare attribute presence — coerced in `core/decorate.ts`
- Official attribute names are kebab-case (`start-date`; exceptions: `prokey`, `ical-file-name`, `use-user-tz`); legacy spellings keep working via `compat/attributes.ts`, official wins when both are set
- Object/array attributes accepted as JSON strings (e.g. `options='["Google","Apple"]'`)

## Common pitfalls when adding code

- **Forgetting one of the typed sub-lists** in `core/globals.ts` (`atcbWcBooleanParams`, `atcbWcObjectParams`, `atcbWcObjectArrayParams`, `atcbWcArrayParams`, `atcbWcNumberParams`) — the new attribute won't parse correctly.
- **Adding a label string in only one language** — the key should exist in every `i18n/locales/*.json`; missing keys fall back to English silently.
- **Inline scripts/styles without nonce propagation** — break CSP-strict environments. See `generators/rich-data.ts` for the nonce-handling pattern.
- **Synchronous DOM assertions after mounting** — element is not initialized yet (see gotcha #4).
- **Modifying the invalid-options arrays** in `core/globals.ts` without updating the override-priority logic in `core/decorate-options.ts` — `optionsIOS` / `optionsMobile` interaction with `atcbIOSInvalidOptions` / `atcbAndroidInvalidOptions` is subtle.
- **Editing generated files** (`assets/css/`, anything in `dist/`) — changes evaporate on the next build.
