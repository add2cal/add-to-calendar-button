# v3 Refactor Plan

Full modernization of the add-to-calendar-button web component. This document is the single source of truth for the refactor: goals, locked decisions, constraints, phases, and gates. It is written so that any agent or developer can execute a phase without additional context. Read `CLAUDE.md` and `.ai/TEST-STRATEGY.md` first.

Scope is the web component only. The `demo/` folder is out of scope on a technical level (separate project), but may be used to validate changes - and its CONTENT (it is the official documentation) gets updated in phase 11 to match the new functionality.

## Mission

Rewrite the component on Lit + strict TypeScript + Vite while keeping observable behavior stable, then layer in v3 features (SSR shell, style and i18n code-splitting, state store, a11y, security and leak hardening). The 440+ case behavior test suite is the compatibility contract: it must be green at the end of every phase.

## Supported use cases (must all keep working)

1. Script tag: load the bundle via `<script>` from a CDN or self-hosted, use `<add-to-calendar-button>` in HTML.
2. npm package: `import 'add-to-calendar-button'` (ESM) or `require` (CJS), including framework wrappers.
3. `atcb_action(config, trigger)` imperative API, in both loading modes.
4. `atcb_action` with an internal integration hook that returns a result instead of executing it. Specification is provided out of band by the maintainer; it is intentionally not documented here. Keep its footprint minimal and its naming inconspicuous.

## Locked decisions

| Topic        | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version      | v3.0.0. Long-lived integration branch `refactor/v3`; phase branches PR into it; maintainer merges                                                                                                                                                                                                                                                                                                                                                                                   |
| Framework    | Lit (LitElement host, lit-html templates, reactive properties)                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Language     | TypeScript, strict, typed at all levels (not just the public surface)                                                                                                                                                                                                                                                                                                                                                                                                               |
| Build        | Vite library mode (ESM + CJS + classic-script bundle). Grunt is removed                                                                                                                                                                                                                                                                                                                                                                                                             |
| Lint         | ESLint + Prettier only. stylelint is removed                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| SSR          | Declarative shadow DOM shell rendered server-side: correct style and size, real label where statically available; skeleton text for `buttonStyle="date"` labels; simple skeleton for inline RSVP. No config decoration, no timezone math, no network fetches on the server. Client hydration adopts the shell without re-layout. Script-tag usage stays 100 percent client-side                                                                                                     |
| Styles       | Deconstruct 9 near-identical CSS files into tokens + core + per-style deltas. Default style inlined into bundles. Other styles load at runtime relative to the script's own origin (import.meta.url, falling back to document.currentScript for the classic bundle). Optional attribute to override the base URL. `load-all-styles` attribute opts into eager loading of everything for runtime style switching. npm users import style modules explicitly for bundler tree-shaking |
| i18n         | Translations move from a JS object to per-language JSON. `en` is bundled by default. npm: opt-in per-locale imports (typed). Script tag: lazy-load locale JSON from the script origin. `language` accepts full locales (`en_US`); translations resolve regional first (`en_GB`) then base (`en`); date FORMATTING always uses the full locale, taken from the attribute if regional, else the browser region                                                                        |
| Dates        | No date-fns. Keep slim custom date utils plus `timezones-ical-library` for VTIMEZONE and DST-aware offsets. Locale-aware display formatting via `Intl`                                                                                                                                                                                                                                                                                                                              |
| Attributes   | Official attribute names become kebab-case (`button-style`, `start-date`, ...). Exception: `proKey` becomes `prokey`. Legacy spellings keep working via an alias map but are no longer documented                                                                                                                                                                                                                                                                                   |
| Entry points | The `no-pro`, `unstyle`, `no-pro-unstyle` variants are dropped as separate builds. Old npm subpaths and CDN file names keep resolving via thin deprecation shims that re-export the main module                                                                                                                                                                                                                                                                                     |
| Naming       | Public API keeps `atcb_` names (`atcb_action`, `atcb_decorate`, element name, documented CSS classes and parts). Internal code drops the prefix; modules provide the namespacing                                                                                                                                                                                                                                                                                                    |
| State        | A per-instance state store keyed by button id replaces threading one data object through every function. Entries are removed on `disconnectedCallback`                                                                                                                                                                                                                                                                                                                              |

## Browser and runtime floor

| Tier       | Definition                                                  | Experience                                                                                                                                    |
| ---------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Full       | Baseline 2023: Chrome/Edge 111+, Safari 16.4+, Firefox 111+ | Everything: adopted stylesheets, declarative shadow DOM hydration, module loading                                                             |
| Functional | ES2020 module browsers down to roughly Safari 14            | Lit falls back from adopted stylesheets to style tags automatically; no DSD means normal client render (progressive enhancement, no breakage) |
| Classic    | Non-module pages                                            | Dedicated IIFE bundle; base URL resolution via document.currentScript                                                                         |
| Node       | 18+                                                         | CJS require, ESM import, SSR entry                                                                                                            |

This supersedes the old guidance in `CLAUDE.md` about IE-era WebView support (approved by the maintainer). Transpile target is set in Phase 1 after confirming the Lit 3 support matrix; do not target lower than the Functional tier.

## Hard constraints

1. The test suite defines observable behavior: `atcb-btn-` id prefixing, `atcb-button-id` and `atcb-last-event` host attributes, URL and ICS output shapes, dataLayer event shape, light-DOM modal host (`{id}-modal-host`), option filtering rules. Any deliberate contract change needs explicit maintainer approval and must update tests and `.ai/` docs in the same PR.
2. Every option documented at add-to-calendar-button.com/configuration works unchanged unless this plan explicitly changes it. Styling via `::part` as documented must not break. PRO usage per docs.add-to-calendar-pro.com must not break.
3. Exported functions used by external tools stay exported: `atcb_action`, `atcb_decorate` (and current secondary exports found in `src/index` during Phase 2 inventory).
4. Generated public types must remain assignable-compatible with the current hand-written `index.d.ts`; tightening beyond that is a later, separate step.
5. Everything in the `CLAUDE.md` sections "What NOT to change" and "Critical gotchas" still applies, except where this plan explicitly supersedes it (browser floor, build system, TypeScript).
6. License guards: `@preserve` blocks and the license-check logic move over verbatim. The Elastic License 2.0 banner stays in built output.

## Baseline metrics (v2.15.0, 2026-07-18)

| Artifact                                                       | Size                                                  |
| -------------------------------------------------------------- | ----------------------------------------------------- |
| dist/atcb.js (CDN default: all styles + all languages inlined) | 555 KB raw                                            |
| dist/atcb-no-pro.js                                            | 523 KB raw                                            |
| dist/atcb-unstyle.js                                           | 346 KB raw                                            |
| dist/atcb-no-pro-unstyle.js                                    | 314 KB raw                                            |
| dist/module/index.js                                           | 513 KB raw, 87 KB gzip                                |
| dist/commonjs/index.js                                         | 505 KB raw, 91 KB gzip                                |
| CSS assets (9 minified files)                                  | 209 KB total, 22 to 28 KB each                        |
| npm tarball                                                    | 1.09 MB (5.4 MB unpacked, 77 files)                   |
| src                                                            | 12 files, ~7300 lines JS; i18n object alone 945 lines |

Size goals (measure at Phase 5 and 6 gates, record in this file):

- Script-tag initial payload (default style, en only) at or below 50 percent of today's gzip size; stretch goal 40 percent.
- Each additional style at or below 40 percent of a full v2 style file (delta over core).
- npm consumers bundling one style and one language should see similar proportional savings via tree-shaking.

## Target architecture

```
src/
  index.ts            main entry: element registration + public exports
  element/            LitElement host, attribute alias map, DSD adoption
  action/             atcb_action and its internal hook
  core/               store, decorate (split into focused modules), validate, events
  generators/         one module per calendar service + ics + rich-data
  ui/                 lit-html templates, list, modal, positioning
  styles/             tokens.css, core.css, per-style delta css, registry
  i18n/               locales/*.json, runtime resolution, Intl formatting
  ssr/                server shell renderer
  compat/             legacy attribute names, deprecated entry shims
```

Guidelines: files under roughly 300 lines, one concern per module, no circular imports (enforce with a lint rule or dependency-cruiser in Phase 3).

## Phases

Execution rules for every phase:

- Work on a branch named `v3/phase-N-short-name`, PR into `refactor/v3`. The maintainer merges.
- Gate commands (all must pass before PR): `npm run build`, `npx eslint .`, `npx prettier --check .`, `npm run test`, plus the phase-specific suite listed below. `npm run test:full` before merging phases 4, 5, 6 and 10.
- Never leave the suite red across a phase boundary. If a phase must change pinned behavior, change the test in the same PR with an explanatory note.
- Update the Progress section of this file in every phase PR.
- Repo doc convention: no em-dashes in `.ai/` docs, use regular dashes.

### Phase 0 - Groundwork (this PR)

Cut `refactor/v3`, add this plan, record baseline metrics above. Reference the plan from `CLAUDE.md`.

### Phase 1 - Tooling swap, zero behavior change

1. Vite library build producing: ESM (`dist/module/index.js`), CJS (`dist/commonjs/index.js`), classic-script IIFE (`dist/atcb.js`) at the exact paths tests and CDN users load today. Keep emitting the variant files as copies for now (they die properly in Phase 7).
2. TypeScript config (strict, allowJs: true) so migration can be incremental; build runs the existing JS through Vite unchanged.
3. Remove Grunt and stylelint; ESLint + Prettier configs updated; `test/test-prep.js` keeps working (adjust the build invocation it makes).
4. Gate: `npm run test:extended` green on both browsers against the Vite-built dist. Bundle sizes within 5 percent of baseline.

### Phase 2 - TypeScript migration

1. Convert bottom-up: globals, util, i18n, decorate, then validate, generate, links, control, init, event. Full internal types: raw config vs decorated config as distinct interfaces, per-service generator signatures, store types.
2. No `any` unless annotated with a reason comment. `tsc --noEmit` joins the gate commands.
3. Add a type-compatibility test asserting the generated public types accept everything the current hand-written `index.d.ts` accepts.
4. Gate: `npm run test:extended` green, tsc clean.

### Phase 3 - Architecture

1. Instance store: module-scoped Map keyed by button id; accessors typed; entries created at init, removed on disconnect. Replace data-object threading everywhere.
2. Apply the target folder structure; split `atcb-util.js` (1290 lines) and `atcb-decorate.js` (781 lines) into focused modules; resolve the root-values-vs-dates-object TODO at former `atcb-decorate.js` line 502 by normalizing into the dates array during decoration.
3. Gate: `npm run test:extended` green.

### Phase 4 - Lit migration

1. LitElement host with reactive properties; attribute converters implementing the kebab-case official names plus the legacy alias map (`prokey` exception included). Precedence: official name wins when both present.
2. Port DOM construction from string building to lit-html templates. Preserve: shadow tree structure, class names, part names, id scheme, light-DOM modal host, imperative positioning logic, the 5 ms open-race guard, sub-event button debounce.
3. Keep `whenInitialized()` and the deferred-init contract; keep env detection semantics (fake flags still respected).
4. Gate: `npm run test:full` green on both browsers. This is the riskiest phase; do not combine it with any other change.

### Phase 5 - Styles

1. Deconstruct the 9 CSS files: extract shared tokens (custom properties) and core rules; express each style as a delta file. Audit which CSS custom properties are core vs style-specific and document the result in this file.
2. Build emits per-style minified CSS assets plus constructable-stylesheet JS modules; the default style is inlined into all bundles.
3. Runtime style registry: `buttonStyle` resolves from registry, else fetches `{base}/styles/{name}.css` where base derives from import.meta.url or document.currentScript; `style-source` attribute overrides the base; `load-all-styles` eagerly loads everything; document preload guidance for the head.
4. `customCss` keeps working; `::part` surface unchanged.
5. Gate: `npm run test:full` green (includes the button-style matrix); record size results in this file; visual spot check via the demo.

### Phase 6 - i18n

1. Extract the 945-line i18n object into per-language JSON under `src/i18n/locales/`; a build step generates typed modules; only `en` ships in the main bundles.
2. npm: `import de from 'add-to-calendar-button/i18n/de'` plus a register call (exact API named in implementation, keep it one line per locale). Script tag: locale JSON lazy-loads from the script origin on first use; document preload guidance.
3. Full-locale handling: `language` accepts `en_US` style values; translation lookup regional-then-base; date formatting via Intl with the full locale (attribute region wins, else browser region). Legacy two-letter values keep working.
4. Gate: `npm run test:full` green (includes i18n matrix) plus new locale-fallback and formatting tests.

### Phase 7 - Packaging and compat

1. package.json exports map: `.`, `./styles/*`, `./i18n/*`, `./ssr`, dual ESM + CJS with per-entry types generated from source.
2. Deprecation shims for `no-pro`, `unstyle`, `no-pro-unstyle` npm subpaths AND the old CDN file names (tiny re-export files logging a one-time console.info).
3. Keep `atcb.js`, `atcb.min.js` CDN names working; confirm the jsdelivr default file setting.
4. Gate: `npm run test:extended` green plus new package-consumption tests: Node CJS require, Node ESM import, browser script-tag load, and a bundler smoke (vite build importing the package with one style and one extra locale, asserting output size bounds).

### Phase 8 - SSR shell

1. `add-to-calendar-button/ssr` entry rendering a declarative shadow DOM shell: style- and size-correct button, real label text when derivable without decoration, skeleton text spans for `buttonStyle="date"`, skeleton block for inline RSVP. No decoration, no fetches, no timezone math.
2. Client: on upgrade, adopt an existing server-rendered shadow root and replace the shell with the fully decorated render without layout shift; if no shell present (script-tag path), behave exactly as today.
3. Gate: new SSR test group (Node render + jsdom-free string assertions + a hydration test in the browser runner); `npm run test:extended` green proving the client-only path untouched.

### Phase 9 - v3 features

1. The `atcb_action` internal integration hook per the out-of-band spec: returns the computed result for single-option calls, errors when option resolution is ambiguous, works without a DOM. Must not appear in types, docs, or examples.
2. Recurrence fast-forward: for old `startDate` with recurrence, jump arithmetically close to now (compute elapsed periods for the FREQ and INTERVAL, land 2 intervals before now, then iterate) instead of stepping through decades. Preserve pinned semantics: COUNT consumption stays correct (derive consumed count arithmetically), UNTIL-to-COUNT conversion unchanged, fully exhausted series still lands on the final occurrence (test E-12). Add a performance regression test (for example daily recurrence starting 1980 decorating in under 50 ms).
3. Copy-link modal fallback (former TODO in `atcb-links.js`): when clipboard write succeeds, keep the current confirmation text; when it fails, show text that does NOT claim success plus a readonly input containing the link, select-on-focus, so the user copies manually. New i18n keys for both texts in all languages.
4. WCAG pass: audit roles, aria labels and states, focus order, focus trap and restore for modal, keyboard interaction against WAI-ARIA menu and dialog patterns; resolve the date-info a11y TODO at former `atcb-generate.js` line 750; add automated axe checks as a new test group.
5. Gate: `npm run test:extended` plus all new feature tests green.

### Phase 10 - Hardening

1. Security review: no unsanitized HTML through lit templates (no unsafeHTML unless proven safe), URL scheme allowlisting for user-provided links, description `[url]` syntax sanitization, prototype-pollution-safe config merging (especially the PRO override merge), `npm audit` clean, run a static scan (CodeQL or semgrep) and address findings. Document results in this file.
2. Memory-leak review: every listener, observer (including the `bodyScheme` MutationObserver), timer, debounce, light-DOM modal host and store entry is cleaned up on disconnect; repeated mount-unmount cycles hold heap steady in a browser test; fix and pin findings.
3. Before-and-after size report; v2 to v3 migration guide (`.ai/MIGRATION-V3.md` draft for the website team); list of documentation pages needing updates as a handoff artifact.
4. Gate: `npm run test:full` green on both browsers, all new suites green, size goals met or consciously waived. Release preparation follows in phase 11; the actual release is maintainer-side (see the handover section).

### Phase 11 - Documentation and release preparation

1. Release notes: a complete, consumer-facing draft covering everything v3 changes (new attribute names with the legacy-alias guarantee, style/i18n loading, SSR shell, dropped variant builds with their shims, size wins, migration pointers).
2. CHANGELOG.md: add the v3.0.0 block following the file's existing format.
3. `demo/` CONTENT update: the demo is the official documentation at add-to-calendar-button.com - update its content (configuration reference, examples, advanced-use pages) to match the new functionality. STRICTLY content only: no technical changes to the demo app itself (framework, build, tooling stay untouched; a possible migration from Nuxt to Astro with the Stardrive boilerplate will be decided separately AFTER the content upgrade and is out of scope here).
4. Extend `scripts/set-version.mjs` to accept prerelease versions (the release flow below uses `3.0.0-next.1` style versions, which the current x.y.z-only validation rejects).
5. Gate: full suite still green; docs changes reviewed by the maintainer.

### Phase 12 - Cleanup and AI docs (the very last step before handover)

1. Comment sweep across ALL code added or touched during this refactor (src/, scripts/, test helpers and groups): remove every reference to the refactoring, its phases, and this plan. Once merged back into the main repository, nobody cares about the refactoring steps. Comments must be independent of the refactor, generally valid, and provide additional value on their own - they explain WHY code is the way it is, they are not documentation and not history. Examples of what to remove or rewrite: "(v3 phase 5)", "formerly atcb_generate_button", "preserved until the phase 9 WCAG pass" (resolved by then anyway), "the phase 4 render rewrite", "extracted from the element module in phase 3". References to living documents (like .ai/TEST-CASES.md in test file headers) stay - they point at current truth, not history.
2. AI docs proposal: draft additional `.ai/` content that guides any future AI agent working on this repository, and propose it to the maintainer. Candidates: an ARCHITECTURE doc (module map, data flow through decorate/validate/render, the store, the style and i18n pipelines, build outputs and their consumers), a RELEASE doc (build artifacts, version tooling incl. prerelease flow, what ships where - npm, CDN, generated assets), and guidance on which existing behaviors are contracts vs internals. Keep each doc evergreen: no phase numbers, no refactor history.
3. As part of that proposal: recommend what happens to `.ai/REFACTOR-PLAN.md` itself on the merge to main - it is refactor history and should NOT travel to the main repository as-is; its evergreen content (architecture, constraints, conventions) moves into the new docs first.
4. CLAUDE.md optimization based on the learnings of the whole refactor: accurate gotchas for the new architecture (attribute layer, registry, store, Lit lifecycle), removal of superseded v2 notes and of the "Active project" section, updated file map, and the practical lessons that repeatedly mattered during execution (e.g. comparing expected vs actual TEST COUNTS after structural changes - a failed module import shows as a passing file with 0 tests; assets/css being generated; the css template build hooks).
5. Gate: full suite green after the comment sweep (comments only - zero behavior change), maintainer approves the AI docs proposal and the new CLAUDE.md.

## Handover and release flow (maintainer-side)

Everything after phase 12 happens WITHOUT the executing agent, but the plan and all deliverables must anticipate it:

1. The maintainer reviews the finished refactor on this fork; iteration rounds on review findings are expected - keep phase branches and gates operational until sign-off.
2. On approval, the maintainer merges the result into the MAIN package and publishes it as version `3.0.0-next.1` - a PRE-RELEASE (npm next dist-tag). It is not the official release.
3. The pre-release gets tested extensively in the wild; findings may flow back as fix iterations (suite gates stay the safety net).
4. Only after that bake period is v3 migrated into the official release.

Practical consequences for executing agents: never assume `refactor/v3` is the end of the line (deliverables must survive a fork-to-main transfer); keep the version-bump tooling prerelease-capable; treat the release-notes and CHANGELOG drafts from phase 11 as the maintainer's publishing material, written to be shippable as-is.

## Risks and mitigations

| Risk                                                                      | Mitigation                                                                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Lit templating vs imperative DOM (positioning, light-DOM modal, debounce) | Phase 4 is isolated; imperative escape hatches are acceptable where templates do not fit; full suite gate on both browsers                 |
| Attribute alias precedence surprises                                      | Alias map is a pure function with its own unit tests; official name wins; suite runs legacy spellings via existing tests                   |
| Recurrence fast-forward semantic drift                                    | Arithmetic jump validated against the iterative result property-style for random configs in tests; pinned tests E-07, E-12 must stay green |
| PRO merge prototype pollution                                             | Dedicated merge util with key blocklist (`__proto__`, `constructor`, `prototype`) plus tests                                               |
| Style dedup changes visual output                                         | Per-style visual check via demo at Phase 5; CSS diff review; the style matrix tests assert structural rendering                            |
| Build swap silently changes bundle behavior                               | Phase 1 gate compares suite results AND bundle size within 5 percent before anything else changes                                          |
| SSR shell drifts from client render                                       | Hydration test asserts no re-layout and identical post-init DOM vs client-only render                                                      |

## Out of scope / deferred

- `demo/` TECHNICAL modernization (separate project; a possible Nuxt-to-Astro migration with the Stardrive boilerplate is decided after the phase 11 content upgrade). Demo CONTENT is in scope via phase 11.
- Full SSR of the decorated button (evaluate as a fast-follow after v3.0).
- Website documentation content updates (handoff list produced in Phase 10).
- Upstreaming strategy to add2cal/add-to-calendar-button (decided after v3 stabilizes on this fork).
- Type tightening beyond assignability-compatibility (later minor release).

## Progress

- [x] Phase 0 - Groundwork
- [x] Phase 1 - Tooling swap (Vite 8 + esbuild via scripts/build.mjs; Grunt, Babel and stylelint removed; strict tsconfig with allowJs; extended suite 231/231 green on both browsers; bundle sizes: browser +1.3 percent raw, module and cjs smaller than baseline gzipped)
  - Deviations, all consistent with the approved floor: CJS build targets es2017 instead of Babel ES5/IE11; unstyle and no-pro variants export the full superset surface; i18nStrings gained a real module export in src/atcb-i18n.js (the concat build previously leaked it from file scope)
- [x] Phase 2 - TypeScript migration (all 12 core modules plus both entries converted to strict TS with shared src/types.ts; zero `any`; type-compat gate in test/types/ asserts public index.d.ts types stay assignable; extended suite 231/231 green on both browsers; test runner now transpiles src TS via @web/dev-server-esbuild so function-level tests import .ts directly; typescript pinned to 6.x: the 7.x native compiler is outside typescript-eslint's peer range >=4.8.4 <6.1.0; revisit once typescript-eslint supports 7)
  - Pre-existing bugs found during conversion (do NOT fix before their phase): attachShadow uses misspelled `delegateFocus` (3 sites, silently inactive - fix in phase 9 WCAG pass); dead `event.key === 'Alt' && event.key === 'Control'` conditions (4 sites - phase 9 keyboard audit); atcb_validate_icsFile checks the root icsFile even for per-date entries (fix with test in phase 3); dead `.length` check on getElementById result in atcb_close (phase 3 cleanup); static observedAttributes reads `this.proKey` which is always undefined there (resolved naturally by the phase 4 Lit migration); bitwise `|` on booleans in the recurrence weekstart check (phase 3 cleanup); trailing-space selector '.atcb-initialized ' in atcb-util positioning (verify intent in phase 3)
- [x] Phase 3 - Architecture (folder structure core/ui/generators/i18n/element/action/styles applied; util split into core/dates + core/text + core/util + ui/positioning; decorate split into orchestrator + dates + recurrence + options modules; links split into per-service generators with acyclic dispatch; atcb_action extracted to action/; per-instance store in core/store.ts replaces the atcbStates array-as-map global, entries deleted on disconnect; decorate root-values TODO resolved: root date fields are deleted after being moved into the dates entries, with the four remaining root readers migrated to dates[0]; full suite 441/441 green, extended green on both browsers)
  - Deferred deliberately: internal atcb_ function-name prefix removal (cosmetic churn, happens opportunistically from phase 4); full parameter de-threading of the render call chains (lands with the phase 4 Lit rewrite - the store already holds the authoritative config per instance)
- [x] Phase 4 - Lit migration (host element is a LitElement adopting the constructor-attached shadow root; whenInitialized/deferred-init/attribute-scan contracts preserved verbatim; button rendering ported to lit-html templates in ui/templates.ts, consumed reactively by the element and via standalone render by the PRO rsvp flow and the modal date buttons; transient layers - dropdown list, modal, overlay - stay imperative by design; official kebab-case attributes with legacy aliases and official-wins precedence via compat/attributes.ts, prokey exception included; new test group V pins the official names; full suite 446/446 green on both browsers)
  - Notes: no PUBLIC per-param Lit reactive properties on purpose (config params like hidden/disabled would collide with native element semantics; internal reactive state drives the render; property-based config support is a follow-up candidate for phase 7); the delegateFocus misspelling is intentionally preserved until the phase 9 WCAG pass; lit is external in the ES build (npm dedupe), bundled in the CJS build via lit's node condition (lit ships ESM-only) and in the browser bundles (+~10 KB gzip, reclaimed in phases 5/6); the dead pro-branch in observedAttributes was dropped (observed set is a superset now)
- [x] Phase 5 - Styles (nine monoliths split via scripts/split-css.mjs into src/styles/css tokens + core + per-style deltas with declaration-level extraction, order-safety demotion and a cascaded property parity check - ALL styles parity-verified; runtime registry in styles/css-template.ts: core+default inline, other deltas fetched from {scriptOrigin}/styles/{name}.css or registered via atcb_register_style / dist/styles/{name}.js modules; style-source overrides the base, load-all-styles prefetches everything; assets/css files are now GENERATED reconstructed full stylesheets for CDN/customCss compat; new test group W pins the registry; full suite 451/451 on both browsers)
  - Size results: atcb.js 597 to 419 KB raw (-30 percent; gzip 107.6 to 100.4 KB - modest because the 8 near-identical styles compressed well), module 506 to 327 KB raw (83.1 gz), cjs 558 to 380 KB raw (96.6 gz). tokens+core 14.9 KB min / 3.5 KB gz inline; each additional style ~8-14 KB min / 1.9-3.0 KB gz, loaded lazily. Delta-vs-original target of 40 percent met for date (36) and flat (41); consciously waived for the other five (45-50 percent) - the remaining delta weight is per-style :host custom-property VALUES that genuinely differ per design and cannot be deduplicated. 30 custom properties are shared across all styles (tokens.css); the rest are style-declared (audit in scripts/split-css.mjs output).
  - Phase 6 note: the i18n split is expected to deliver the bigger gzip win (en-only default drops ~20 languages from every bundle).
- [x] Phase 6 - i18n (945-line translation object extracted to src/i18n/locales/{lang}.json - 26 languages, calendar names deduplicated and merged at registration; i18n/index.ts is now the locale registry: English statically imported into every bundle, other packs fetched from {scriptOrigin}/locales/{lang}.json (style-source-aware base) or registered via atcb_register_locale / the self-registering dist/locales/{lang}.js modules; loading is AWAITED in the init pipeline since labels are needed at render time; full-locale handling: language accepts en_US/en-GB, translations resolve regional pack then base then English, date formatting uses data.formatLocale (attribute region wins, else browser region) via Intl; new test group X; full suite 456/456 on both browsers)
  - Size results (the predicted big gzip win): atcb.js 419 to 361 KB raw / 100.4 to 83.3 KB gzip; module 327 to 281 KB raw / 83.1 to 70.5 KB gzip. Combined phases 5+6 vs the v2.15 baseline: raw -35 percent, gzip -14 percent, with lit included and every additional style/language a small lazy asset.
  - Locale packs are authored as NESTED json (label: { addtocalendar: ... }) and flattened at registration; the runtime registry and the customLabels contract keep flat dotted identifiers. BREAKING (maintainer-approved, for the phase 11 release notes): two translation keys were renamed to keep the nesting pure - date.status.cancelled.cta is now date.status.cancelled_cta, and label.share.email.subject is now label.share.email_subject. Keys that double as a GROUP name move their leaf into the group as .title: label.rsvp is now label.rsvp.title, form.status is now form.status.title, form.success is now form.success.title (coordinated with the PRO backend, which will send the new key names; affects customLabels overrides of exactly these keys).
  - Two traps worth remembering: bundlers statically rewrite `new URL(rel, import.meta.url)` (vite inlined the module SOURCE as a data-url asset) - the script base is now derived via plain string operations; and the test runner's esbuild json transform corrupts runtime fetch() of .json files - a raw-json middleware in web-test-runner.config.mjs serves dist/locales/*.json untouched.
  - The RSVP strings (label.rsvp.*, form.status.*, form.amount/max/email/seatsleft, form.error.email/bookedoutmany, form.success.sent/email/doi/demo/already) are shipped in the core locale packs again - they were stripped in v2 to save bytes and injected by PRO via customLabels; with per-language lazy loading the byte argument is gone. All 26 packs carry the full 50-key set. For the phase 11 release notes: PRO-side injection of these strings becomes OPTIONAL (still supported - customLabels keeps winning over pack values). Maintainer provided 25 languages; the uk pack plus form.seatsleft for he and hu were machine-translated (uk matches that pack's formal register) and should get a native-speaker review before the official release.
- [x] Phase 7 - Packaging and compat (exports map with `.`, `./styles/*`, `./i18n/*` plus the three deprecated variant subpaths, dual ESM/CJS everywhere: style and locale modules gained .cjs twins and .d.ts stubs; public types are now GENERATED from source as a flat single-file bundle at dist/index.d.ts via dts-bundle-generator - no deep d.ts import graph, so bundler AND node16 moduleResolution both work; the hand-written v2 index.d.ts moved to test/types/v2-public-types.d.ts as the FROZEN compat oracle with V2-prefixed names, and the type gate now asserts v2 -> current public -> internal assignability in two layers; public types live in src/types.ts incl. the global HTMLElementTagNameMap/JSX declarations and new v3 surface: styleSource, loadAllStyles, languages he + uk; no-pro/unstyle/no-pro-unstyle became real deprecation shims - tiny re-export modules at the npm subpaths and self-loading script stubs at the old CDN file names, all logging a one-time console.info; the dedicated unstyle build passes are GONE from build.mjs; jsdelivr default stays dist/atcb.js as published for v2.15; new gate `npm run test:package` proves Node CJS require, Node ESM import, both TS resolutions and a vite consumer build with one style + one locale (233 KB minified, locale subsetting asserted); new browser group Y covers script-tag load and CDN shim behavior; extended 249/249)
- [x] Phase 8 - SSR shell (new `add-to-calendar-button/ssr` entry: atcb_generate_ssr_html renders the host element with all config attributes under their official kebab names plus a declarative shadow DOM template - style- and size-correct shell with the real localized label, skeleton spans for date-style parts, skeleton block for inline RSVP; fully DOM-free, no decoration/fetches/timezone math; ALL style deltas and ALL default labels are baked into the server-only bundle at build time via injection hooks; size parsing extracted to dependency-free core/sizes.ts so the ssr import graph stays lit-free (decorate reaches ui/pro which pulls lit - the ES ssr bundle would crash Node on HTMLElement otherwise); client hydration: constructor adopts an existing declarative root instead of re-attaching (attachShadow would clear it), keeps the shell painted while initializing, and removes the shell nodes in the same synchronous block that completes the real render - no in-between paint, no layout shift; shell wrapper marked data-atcb-ssr and excluded from client rootObj queries while both exist; non-DSD browsers (inert template) fall back to the client-only path and the template child is dropped; new gates: node test group S (10 cases, jsdom-free) via npm run test:ssr and browser group Z (3 cases incl. layout-shift bound and normalized DOM equality vs client-only render); ssr consumption probes added to test:package; extended 252/252)
  - dist/ssr ships index.js (ESM) + index.cjs + generated flat index.d.ts + module-type marker; exports map gained "./ssr"; the shell honors exactly: buttonStyle, size, lightMode (dark/bodyScheme attr value, else light), rtl via language, label/name, inline, hidden, identifier (button id) - everything else is hydration's job
- [x] Phase 9 - v3 features
  - atcb_action internal integration hook implemented per the out-of-band spec (single resolved option returns the computed value, errors when ambiguous, DOM-free capable; internal result channel in core/globals with interception at the url-open, ics-content and file paths plus ui suppression; verified against the out-of-band checklist - intentionally no test or documentation in this repository)
  - Recurrence fast-forward in atcb_getNextOccurrence: arithmetic jump to a start-aligned period boundary at least two intervals before the window (bounded by UNTIL, COUNT kept >= 2 tail occurrences so the exhausted-series logic still lands on the real final occurrence); the skipped-span occurrence consumption is derived arithmetically ONLY for plain rules (no BY* filters, no month-day > 28, no Feb 29 anchor) - everything else keeps the exact iteration; the day-stepper predicates are absolute so jumps can never change WHICH dates match; fixes both the multi-decade slowness AND a correctness bug (the 10000-iteration cap silently stopped old series around 27 years in); new group E2 with a phase-shift equivalence property, COUNT-consumption equality, exhausted COUNT/UNTIL landings and a sub-50ms perf bound for a 1980 daily rule; E-12 untouched and green
  - Copy-link clipboard fallback (resolved the v2 TODO at all four sites - yahoo subscribe x2, ical copy note x2): shared atcb_clipboard_note_content returns the success confirmation OR an honest failure text plus a readonly manual-copy input (select-on-focus via atcb_wire_clipboard_input); NEW i18n key modal.clipboard.failed in all 26 packs (machine-translated, register-matched; needs native review together with the RSVP additions); input styled via core.css; P-03b pins the fallback
  - WCAG pass: delegatesFocus misspelling fixed at all 3 attachShadow sites (host.focus now truly delegates); dead Alt/Control keyup conditions removed (5 sites - Enter/Space are the activation keys); date-button aria label rebuilt (always year-inclusive time info, announces recurrence, no dangling separators - resolves the v2 a11y TODO); dropdown switched to the WAI-ARIA menu pattern (role menu + menuitem entries incl. close item - the previous list role with link children was invalid ARIA and axe-flagged; arrow/tab cycling already matched the menu pattern); trigger got aria-haspopup; background overlay is no longer a focusable nameless button (presentation role, out of tab order - Escape and the close item cover keyboard); modal dialog: native dialog kept, aria-modal + aria-labelledby the headline (aria-label fallback from content), wrapper out of tab order, and a Tab focus trap cycling the top modal's focusables (the previous trap only covered option lists); new axe-core group AX (WCAG 2.1 A/AA tags, color-contrast excluded as theme-dependent - documented in the test header)
  - Gate: extended 265/265 (E2 +8, P-03b +1, AX +4), hook checklist 9/9 out of band
- [ ] Phase 10 - Hardening and release preparation
- [ ] Phase 11 - Documentation and release preparation (release notes, CHANGELOG block, demo content update, prerelease-capable version tooling)
- [ ] Phase 12 - Cleanup and AI docs (refactor-reference comment sweep, evergreen .ai docs proposal, CLAUDE.md optimization)
