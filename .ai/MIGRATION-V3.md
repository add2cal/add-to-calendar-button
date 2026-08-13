# Migrating from v2 to v3

Draft for the website team and release preparation. Everything here describes CONSUMER-facing
changes. The compatibility promise of v3: a working v2 integration keeps working - every legacy
attribute spelling, entry point and documented behavior either works unchanged or is served by a
compatibility shim. The changes below are additions and internal modernizations, plus a small set
of deliberate breaking changes listed at the end.

## TL;DR

- Same tag, same attributes (plus new official kebab-case names), same `atcb_action`.
- Much smaller: the ESM bundle dropped 44 percent raw / 19 percent gzip; styles beyond the default
  and languages beyond English now load on demand as tiny assets.
- New: SSR entry with declarative shadow DOM shells, per-style and per-locale npm modules,
  generated TypeScript types, WCAG fixes, hardened input handling.
- Deprecated (with working shims): the `no-pro`, `unstyle` and `no-pro-unstyle` variants.

## Installation and entry points

| v2                                                                      | v3                                                                                                       |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `import 'add-to-calendar-button'`                                       | unchanged                                                                                                |
| `require('add-to-calendar-button')`                                     | unchanged (lit is bundled into the CJS build)                                                            |
| `<script src=".../atcb.js">`                                            | unchanged (`atcb.min.js` is now part of the npm package too)                                             |
| `add-to-calendar-button/no-pro`, `/unstyle`, `/no-pro-unstyle`          | deprecation shims: they load the main package and log a one-time console info - switch to the main entry |
| CDN files `atcb-no-pro.js`, `atcb-unstyle.js`, `atcb-no-pro-unstyle.js` | tiny shims that load `atcb.js` from the same location                                                    |
| -                                                                       | NEW `add-to-calendar-button/styles/{name}` registers a button style (ESM + CJS)                          |
| -                                                                       | NEW `add-to-calendar-button/i18n/{lang}` registers a locale (ESM + CJS)                                  |
| -                                                                       | NEW `add-to-calendar-button/ssr` renders a server-side shell (see below)                                 |

Types are now GENERATED from the source into a single flat `dist/index.d.ts` and resolve under
every moduleResolution (bundler, node16, classic). The public type names are unchanged
(`ATCBActionEventConfig`, `AddToCalendarButtonType`, `EventDate`, `CustomLabelsObjectType`);
the language union gained `he` and `uk`. The typed PRO key property changed from `proKey` to
the official lowercase `prokey` spelling:

```ts
// v2
atcb_action({ proKey: '...' });

// v3
atcb_action({ prokey: '...' });
```

This is a compile-time breaking change. Legacy `proKey` continues to work at runtime for plain
JavaScript objects, and `<add-to-calendar-button proKey="...">` continues to work because HTML
normalizes attribute names to lowercase.

## Attributes

Official attribute names are now kebab-case (`start-date`, `button-style`, `ical-file-name`,
`prokey`, `use-user-tz`, ...). Every v2 spelling (camelCase/lowercase) keeps working as an alias;
when both are present, the official name wins.

Attributes that used underscores (`recurrence_interval`, `recurrence_byDay`, ...) now have
kebab-case official names too (`recurrence-interval`, `recurrence-by-day`, ...); the underscore
spellings keep working as aliases.

New attributes:

- `style-source`: base url override for on-demand style/locale assets
- `load-all-styles`: prefetch every style delta (for runtime style switching)

## Values: calendar types and status

The official calendar type keys are now lowercase: `apple`, `google`, `ical`, `ms365`,
`msteams`, `outlookcom`, `yahoo`. Every v2 spelling (`Apple`, `Google`, `iCal`,
`Microsoft365`, `MicrosoftTeams`, `Outlook.com`, `Yahoo` - any casing) keeps working as
an alias and normalizes to the same keys. The exported `ATCBOptionName` type now carries
the lowercase keys; the v2 spellings live in the new `ATCBOptionNameLegacy` type and both
are accepted everywhere options are typed.

The `status` values are also lowercase now: `tentative`, `confirmed`, `cancelled`
(default: `confirmed`). Casing makes no functional difference - the uppercase v2 values
keep working, and the generated ics file always carries the spec's uppercase form
(`STATUS:CONFIRMED`). The exported `ATCBEventStatus` type is lowercase; the uppercase
spelling lives in `ATCBEventStatusLegacy`.

## Styles

Only the core plus the default style are inlined into the bundles. Every other `buttonStyle` loads
on demand (roughly 8-14 KB raw each):

- script tag: fetched automatically from `{scriptOrigin}/styles/{name}.css` (override via `style-source`)
- npm: `import 'add-to-calendar-button/styles/3d'` registers the style without any fetch
- runtime API: `atcb_register_style(name, css)`

The full per-style stylesheets under `assets/css/` (for `customCss` hotlinks) are still shipped
and are now GENERATED from the split sources.

## Languages

English is bundled; the other 25 languages load on demand (roughly 3 KB each):

- script tag: fetched automatically from `{scriptOrigin}/locales/{lang}.json`
- npm: `import 'add-to-calendar-button/i18n/de'` registers the pack without any fetch
- runtime API: `atcb_register_locale(lang, strings)`

Full locales are supported: `language="en_GB"` (or `en-GB`) resolves translations through the
regional pack, then the base language, then English - and date FORMATTING uses the full locale
(attribute region first, else the browser region). The RSVP strings ship in the core packs again.
NEW key `modal.clipboard.failed` (honest text when automatic copying fails). Ukrainian (`uk`) is
now part of the public language union.

## SSR

New in v3: render a style- and size-correct shell on the server, hydrated without layout shift.

```js
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';
const html = atcb_generate_ssr_html({ name: 'Launch Party', startDate: '2050-06-15', buttonStyle: '3d', language: 'de' });
// -> <add-to-calendar-button ...><template shadowrootmode="open">...</template></add-to-calendar-button>
```

The shell honors buttonStyle, size, lightMode, rtl, and the label (localized default or `label`);
`buttonStyle="date"` and inline RSVP render skeletons. Everything else happens at hydration.
Browsers without declarative shadow DOM fall back to the plain client-only path automatically.

## Accessibility

- The dropdown now follows the WAI-ARIA menu pattern (`role="menu"` / `menuitem`); the trigger
  carries `aria-haspopup`.
- Modals are native `<dialog>` elements with `aria-modal`, an accessible name from the headline,
  and a working Tab focus trap; focus returns to the trigger on close.
- `delegatesFocus` works now (a long-standing misspelling kept it silently inactive): calling
  `focus()` on the element focuses the button.
- Date-style buttons expose a complete, year-inclusive aria label and announce recurrence.

## Security hardening

- `[url]` pseudo-elements in descriptions only linkify http(s), webcal(s) and mailto urls, and
  quote characters can no longer break out of the generated anchor. Anything else renders as text.
- User-provided urls (icsFile, customCss, images, proxy targets) pass a scheme allowlist
  (http, https, webcal, webcals, mailto, intent, `data:text/calendar`); script-capable schemes
  are blocked.
- All JSON inputs (attributes, inline config, PRO responses) are stripped of prototype-pollution
  vectors.
- schema.org rich data is serialized with proper JSON escaping (quotes in names/locations no
  longer break the JSON-LD).

## Extended ics options (Apple/iCal only)

Eight new second-level options shape the GENERATED ics file and nothing else - every other
calendar type ignores them silently: `ics-reminder` (display alarm), `ics-url`, `ics-categories`,
`ics-class`, `ics-priority`, `ics-geo` (+ Apple map preview when `location` is set), `ics-attach`
(url attachments), `ics-exdate` (recurrence exclusions, root-only). Like every attribute, the
camelCase spelling (`icsReminder`, ...) still works and is what the `atcb_action` config object uses. All others work per date
entry in the multi-date case, following the root-overrides-entries contract. Documented in the
advanced examples section and in a dedicated "ICS file options (Apple/iCal only)" subsection of
the configuration reference, both clearly marked as Apple/iCal-only.

## Behavior improvements

- Recurring events with old start dates now resolve instantly AND correctly: v2 stepped day by day
  and silently capped out roughly 27 years in; v3 jumps arithmetically and preserves COUNT/UNTIL
  semantics exactly.
- When copying a link to the clipboard fails, the modal no longer claims success: it shows an
  honest text plus a readonly input (select-on-focus) for manual copying.
- The Google Calendar icon is the current logo.

## Deliberate breaking changes

1. The TypeScript config property `proKey` is now `prokey`, matching the official HTML
   attribute. Update typed `atcb_action` objects and `AddToCalendarButtonType` usage. The old
   casing remains a runtime compatibility alias but is intentionally rejected by the v3 types.
2. Translation key renames (relevant ONLY for `customLabels` overrides of exactly these keys):
   - `date.status.cancelled.cta` -> `date.status.cancelled_cta`
   - `label.share.email.subject` -> `label.share.email_subject`
   - `label.rsvp` -> `label.rsvp.title`, `form.status` -> `form.status.title`, `form.success` -> `form.success.title`
3. The dedicated `no-pro` / `unstyle` / `no-pro-unstyle` BUILDS are gone (shims keep the entry
   points alive). Styles load lazily anyway; PRO code stays license-gated at runtime.
4. Script-capable url schemes (for example `javascript:`) are rejected wherever urls are consumed.
5. The dropdown's ARIA roles changed from `list`/`link` to the valid `menu`/`menuitem` pattern.
6. Browser floor: full experience at Baseline 2023 (Safari 16.4+, evergreen); bundles target
   ES2017; declarative shadow DOM is a progressive enhancement.

## Size report (v2.15.0 published artifacts vs v3, built with --min)

| artifact                             | v2 raw      | v2 gzip     | v3 raw   | v3 gzip | raw  | gzip |
| ------------------------------------ | ----------- | ----------- | -------- | ------- | ---- | ---- |
| atcb.js (CDN)                        | 542.1 KB    | 94.9 KB     | 366.6 KB | 85.1 KB | -32% | -10% |
| atcb.min.js (CDN)                    | not shipped | not shipped | 229.8 KB | 69.5 KB | -    | -    |
| module/index.js (ESM, lit external)  | 501.1 KB    | 85.2 KB     | 280.1 KB | 69.1 KB | -44% | -19% |
| commonjs/index.js (CJS, lit bundled) | 493.1 KB    | 90.0 KB     | 331.1 KB | 82.3 KB | -33% | -9%  |
| ssr/index.js (server-only)           | -           | -           | 143.3 KB | 22.6 KB | new  | new  |

On-demand assets: 7 style deltas totaling 82.1 KB raw (avg 11.7 KB), 25 locale packs totaling
71.5 KB raw (avg 2.9 KB). npm tarball: 1.1 MB -> 630 KB packed, 5.4 MB -> 2.9 MB unpacked.
Real-world bundler result: a vite app importing the package plus one extra style and one extra
locale builds to 233 KB minified JavaScript total.

Note for the release: v2.15 pointed jsdelivr at the UNMINIFIED `dist/atcb.js`; v3 now ships
`atcb.min.js` inside the package (229.8 KB / 69.5 KB gzip). Switching the `jsdelivr` field to the
minified file would cut CDN transfer by another 18 percent - maintainer decision.

## Documentation pages to update (handoff list)

1. Configuration reference: official kebab-case names (with the alias guarantee), `style-source`,
   `load-all-styles`, languages `he`/`uk`.
2. Installation/npm page: exports map, per-style and per-locale imports, deprecation shims,
   generated types.
3. CDN page: unchanged file names, min file now in the package, lazy style/locale assets living
   next to the script, `style-source` for exotic hosting setups.
4. NEW page: server-side rendering with `add-to-calendar-button/ssr`.
5. Styles page: on-demand loading model, runtime switching via `load-all-styles`,
   `atcb_register_style`.
6. Languages page: on-demand packs, full-locale support (`en_GB`), `atcb_register_locale`,
   key renames for customLabels users, the new `modal.clipboard.failed` key.
7. `atcb_action` page: API unchanged; mention scheme allowlisting for provided urls.
8. Accessibility section: menu pattern, dialog semantics, delegatesFocus.
9. Recurrence page: note the fast-forward fix for old start dates.
10. CHANGELOG/release notes: see phase 11 drafts.
