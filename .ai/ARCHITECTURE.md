# Architecture

How the add-to-calendar-button source is organized, how data flows through it, and which
behaviors are contracts versus internals. Written for anyone (human or AI agent) making
changes; kept evergreen - update it when the architecture changes, never reference
work-in-progress here.

## The big picture

The package is a self-contained web component plus an imperative API. Everything a button
needs beyond the core - button styles beyond the default, languages beyond English - is a
small on-demand asset resolved relative to wherever the script itself is served from, or
registered explicitly by the consumer. There is no server dependency in the OSS scope; the
PRO service (proprietary, license-gated at runtime) plugs into the same pipeline via a
`proKey` config fetch.

Three consumption paths, one code base:

1. **Script tag** (`dist/atcb.js` / `dist/atcb.min.js`): IIFE, everything bundled (lit,
   timezones-ical-library), exposes `window.atcb_action`, registers the element.
2. **npm module** (`dist/module/index.js` ESM, `dist/commonjs/index.js` CJS): registers the
   element on import and exports the `atcb_*` API plus public types. lit stays external in
   the ES build (dedupe/tree-shake in the consumer bundler) and is bundled into the CJS
   build through its `node` export condition (the browser build of lit touches
   `HTMLElement` at module scope and would crash a plain Node `require`).
3. **Server entry** (`dist/ssr/`): DOM-free shell renderer (see SSR below).

## Module map (src/)

| Area       | Modules                                                                                 | Role                                                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| element    | `element/index.ts`                                                                      | The `AddToCalendarButton` LitElement: attribute scan, init pipeline, PRO fetch, css loading, global listeners, cleanup                                       |
| action     | `action/index.ts`                                                                       | `atcb_action` - the same pipeline for custom triggers, without component markup                                                                              |
| compat     | `compat/attributes.ts`                                                                  | Official kebab-case attribute names + legacy alias resolution (official wins)                                                                                |
| core       | `globals`, `store`, `decorate*`, `validate`, `dates`, `sizes`, `text`, `util`, `events` | Env detection and constants, per-instance state, config normalization, validation, date/RRULE math, size parsing, sanitizers, misc helpers, analytics events |
| ui         | `templates`, `generate`, `control`, `positioning`, `pro`                                | lit-html templates for the button path; imperative DOM for list/modal/overlay; open/close/toggle; positioning; PRO/RSVP surfaces                             |
| generators | `index`, `google`, `outlook`, `msteams`, `yahoo`, `ical`, `rich-data`                   | Per-service link/ICS construction and dispatch; schema.org JSON-LD                                                                                           |
| i18n       | `i18n/index.ts`, `i18n/locales/*.json`                                                  | Locale registry and translation chain; one nested JSON per language                                                                                          |
| styles     | `styles/css-template.ts`, `styles/css/*.css`                                            | Style registry; split css sources (tokens + core + per-style deltas)                                                                                         |
| ssr        | `ssr/index.ts`                                                                          | DOM-free declarative-shadow-DOM shell renderer                                                                                                               |
| entries    | `index.ts`, `entry-browser.ts`                                                          | Package entry (module builds), classic-script entry (IIFE)                                                                                                   |

## Data flow: initialization

```
attributes / JSON / atcb_action argument
  -> compat/attributes (official name wins, legacy aliases resolve)
  -> atcb_secure_content (tag stripping + prototype-pollution key strip)
  -> atcb_check_required
  -> atcb_decorate_data (normalize: booleans, options, dates, recurrence,
     sizes, light mode, i18n locale fields; per-instance store entry)
  -> atcb_ensure_locale (await: labels render synchronously)
  -> atcb_validate
  -> render (lit template into the shadow root) + atcb_load_css (style registry)
  -> global listeners, schema.org injection, ready state
```

Key properties of the pipeline:

- **Decoration is the single normalization point.** After `atcb_decorate_data`, flags are
  real booleans, `dates[]` is populated (root date fields are consumed into it), options
  are lowercase keys, `identifier` carries the `atcb-btn-` prefix.
- **The element defers initialization** (`setTimeout(..., 0)` in `connectedCallback`); any
  code needing the finished button must `await el.whenInitialized()`.
- **Re-initialization on attribute change** destroys and rebuilds the button content
  in place (lit render root survives; foreign children are removed).

## Data flow: interaction

Trigger click/keyup -> `ui/control.atcb_toggle` -> either the dropdown/modal list
(`ui/generate`, imperative DOM in the same shadow root or a dedicated light-DOM modal host
`<div id="{identifier}-modal-host">` appended to `<body>`) or, for single options, straight
to `generators/index.atcb_generate_links` -> per-service generator builds the url or ICS ->
`atcb_open_cal_url` / file save -> success bookkeeping (checkmark, dataLayer event,
`atcb-last-event` attribute).

## State

`core/store.ts` holds one entry per button instance (keyed by identifier): config snapshot,
per-option success counters, the active-button pointer. Entries are deleted on
`disconnectedCallback`. The only module-scope mutable state elsewhere: the global-listener
init flag, the button counter, the `lightModeMutationObserver` map (bodyScheme observers,
disconnected on unmount), and the style/i18n registries (caches by design).

## Style pipeline

- **Sources**: `src/styles/css/` - `tokens.css` (custom properties shared by all styles),
  `core.css` (rules shared by all styles), one delta per style. Edit THESE.
- **Build**: `scripts/build.mjs` minifies them, inlines core+default into the bundles
  (string-injected into the `atcbCssTemplate` hook in `styles/css-template.ts`), emits
  `dist/styles/{name}.css` (fetchable delta) + `{name}.js`/`.cjs` (self-registering
  modules) + `.d.ts` stubs, and reconstructs the full per-style stylesheets in
  `assets/css/` for CDN hotlinks and `customCss` consumers (those files are GENERATED).
- **Runtime**: `atcb_ensure_style` resolves a style from the registry, else fetches
  `{base}/styles/{name}.css` where base = the script's own origin (derived via string
  operations - never `new URL(rel, import.meta.url)`, which bundlers rewrite statically),
  overridable via `style-source`. `atcb_register_style` and `load-all-styles` complete the
  surface. Unknown styles render unstyled but functional.
- **Maintenance tool**: `scripts/split-css.mjs` re-derives the split sources from full
  stylesheets, with order-safety demotion and a cascade parity check. Only needed when
  importing style changes made against full stylesheets.

## i18n pipeline

- **Sources**: `src/i18n/locales/{lang}.json`, nested for editability, flattened to dotted
  keys at registration. Keys that double as group names use the `.title` leaf convention
  (`label.rsvp.title`). Leaf-vs-prefix conflicts are forbidden (registration would lose
  data); sibling keys use `_` suffixes instead (`cancelled_cta`).
- **Build**: English is statically imported into every bundle; every language is emitted to
  `dist/locales/{lang}.json` (fetchable) + `{lang}.js`/`.cjs` (self-registering) + `.d.ts`.
- **Runtime**: `atcb_ensure_locale` is awaited during init; it resolves from the registry,
  else fetches `{base}/locales/{lang}.json` (same base rules as styles). Full locales
  (`en_GB`) split into `language` (base, translations + rtl), `translationLocale` (regional
  pack key, wins over base) and `formatLocale` (date formatting; attribute region first,
  else browser region). Translation chain: `customLabels` -> regional pack -> base pack ->
  English -> the identifier itself.
- **Adding a language**: locale JSON + `availableLanguages` in `i18n/index.ts` + the
  `ATCBLanguage` union in `types.ts` + the demo configuration page list.

## SSR and hydration

`ssr/index.ts` renders the host element with all config attributes (official kebab names)
plus a `<template shadowrootmode="open">` shell: general layout css, core css + the ONE
requested style delta, and a static button (real localized label, skeletons for date-style
parts and inline RSVP). All style deltas and all default labels are baked into the
server-only bundle at build time; the module never touches the DOM and never fetches.
Its import graph must stay lit-free - `core/sizes.ts` exists precisely so the shell can
share the size math without pulling ui modules (which import lit).

Client side: the element constructor ADOPTS an existing declarative shadow root (calling
`attachShadow` would clear it), keeps the shell painted while initializing, and removes the
shell nodes in the same synchronous block that completes the real render - no intermediate
paint, no layout shift. The shell wrapper carries `data-atcb-ssr` so client queries can
exclude it while both exist. Browsers without declarative shadow DOM leave the template as
an inert child; the element drops it and initializes client-only.

## Build outputs and their consumers

| Output                                               | Consumer                                                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `dist/atcb.js`, `dist/atcb.min.js`                   | CDN script tags (jsdelivr default: `dist/atcb.js`)                                                   |
| `dist/atcb-{no-pro,unstyle,no-pro-unstyle}(.min).js` | Deprecation shims at the old CDN file names (self-load `atcb(.min).js`)                              |
| `dist/module/`, `dist/commonjs/`                     | npm `.` export (ESM / CJS); the variant subdirectories hold deprecation shim modules                 |
| `dist/styles/`, `dist/locales/`                      | On-demand fetch targets AND the npm `./styles/*` / `./i18n/*` exports                                |
| `dist/ssr/`                                          | npm `./ssr` export (ESM + CJS + types, module-type marker)                                           |
| `dist/index.d.ts`, `dist/ssr/index.d.ts`             | Flat type bundles generated from source (dts-bundle-generator); resolve under every moduleResolution |
| `assets/css/`                                        | GENERATED full stylesheets for CDN hotlinks / `customCss`                                            |

Build hooks worth knowing: `scripts/build.mjs` string-replaces exact marker declarations in
the source (`atcbCssTemplate`, `atcbStyleRelPath`, `atcbLocaleRelPath` and the ssr data
hooks) - those constants must stay verbatim or the build throws.

## Contracts vs internals

**Contracts** (the behavior test suite pins these; changing them is a breaking change that
needs an explicit decision, test updates, and release notes):

- The attribute surface: every documented option, BOTH spellings (official kebab-case and
  legacy aliases), official-wins precedence, JSON-string values for objects/arrays.
- The `atcb_*` public API: `atcb_action`, `atcb_register_style`, `atcb_register_locale`,
  `atcb_generate_ty`, `atcb_generate_timestring`, `atcb_decorate_data_dates`,
  `i18nStrings`, `cssStyles` - and the public types exported from the package root.
- DOM observables: `atcb-btn-{identifier}` ids, `atcb-button-id` and `atcb-last-event`
  host attributes, the documented css classes and `::part` names, the light-DOM modal host
  (`{identifier}-modal-host`), the schema.org script (`atcb-schema-{identifier}`).
- Output: the per-service url shapes and ICS content, the dataLayer event shape.
- Package paths: the exports map entries, the CDN file names (including the shimmed
  deprecated ones), on-demand asset locations relative to the script.
- Translation keys (customLabels overrides target them by name).

**Internals** (free to change when tests stay green): module boundaries and file layout,
the store implementation, lit template composition, the registry cache shapes, the build
pipeline mechanics, comment/code style, everything not listed above.

When in doubt: if a test asserts it, it is a contract; if a consumer could observe it from
outside the package (DOM, network, exports), treat it as a contract until proven otherwise.
