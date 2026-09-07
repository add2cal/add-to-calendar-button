# Add to Calendar Button: Agent Guide

Repository-wide instructions for coding agents. Keep this file concise and evergreen;
put architecture, test inventories, and release procedures in their dedicated documents.

## Project

`<add-to-calendar-button>` is a strict-TypeScript Lit web component with an imperative
API. It generates links and ICS files for major calendar services. Optional proprietary
PRO behavior is enabled by `proKey` and protected by runtime license guards. The project
uses the Elastic License 2.0.

Edit source files only. `dist/` and `assets/css/` are generated.

## Read before changing

- Structural, public API, SSR, packaging, or data-flow work: `.ai/ARCHITECTURE.md`.
- Tests: `.ai/TEST-STRATEGY.md` and `.ai/TEST-CASES.md` before adding or moving cases.
- Releases or versioning: `.ai/RELEASE.md`.

Treat documented external behavior as a contract: attributes and aliases, exported APIs
and types, package paths, generated calendar data, translation keys, DOM observables,
analytics events, and asset URLs. Contract changes require an explicit decision, tests,
and release notes.

## Non-negotiable constraints

- Preserve the Elastic License banner and every `@preserve` block in `src/ui/pro.ts` and
  `src/generators/rich-data.ts`. Do not weaken the PRO license-host check.
- Keep `recurrence_simplified` synchronized between validation and recurrence decoration.
- Keep config ingestion hardened: strip unsafe keys from every JSON/object input and apply
  the URL scheme allowlists in `src/core/text.ts`.
- Keep PRO config overrides on closed allowlists. Do not turn them into open object merges.
- Propagate `cspnonce` to injected scripts and styles; retain its validation.
- Preserve complete per-instance teardown: observers, store entries, modal hosts, schema
  scripts, listeners, and body-scroll locks must not survive disconnection.
- Do not change module-load environment detection casually. Tests should use `fakeMobile`,
  `fakeIOS`, or `fakeAndroid` instead of mutating the environment after import.
- Retain the 5 ms delay in `atcb_open`; it guards dropdown positioning order.
- Do not rename or reformat build hook declarations targeted exactly by
  `scripts/build.mjs` (`atcbCssTemplate`, `atcbStyleRelPath`, `atcbLocaleRelPath`, and SSR
  data hooks).
- Derive script and asset bases with the existing string operations. Do not use
  `new URL(relativePath, import.meta.url)`, which bundlers may rewrite.
- Keep `src/ssr/` and `src/utils/` DOM-free. The SSR graph must also remain Lit-free; Node
  builds must resolve Lit through its `node` condition.
- When upgrading a server-rendered element, adopt its existing shadow root. Attaching a new
  one clears declarative shadow DOM. Keep `[data-atcb-ssr]` shell swapping atomic.

## Change rules

- Config fields must be represented in public/internal types, the main and typed parameter
  lists in `src/core/globals.ts`, validation, decoration, and attribute compatibility as
  applicable. Boolean attributes accept `true`, `'true'`, `'1'`, and bare presence.
- Official attributes are kebab-case except documented exceptions. Preserve legacy aliases
  and official-name precedence. Object and array attributes accept JSON strings.
- Calendar services require dispatch, option registration, labels in every locale, and an
  icon. Verify recurrence and platform-specific option filtering.
- Locale keys must exist in every locale file. Nested keys that are also groups use a
  `.title` leaf; avoid leaf/prefix conflicts.
- Edit styles in `src/styles/css/`, never generated stylesheets. Keep nonce propagation and
  script-relative loading intact.
- Preserve calendar edge cases unless the task explicitly changes them: cancelled events,
  multi-date ICS grouping, recurring-service exclusions, special `currentBrowser` and
  `Etc/GMT` timezone handling, and UI-only conversion for date-style global events.
- Component initialization is asynchronous. After mounting, use
  `await el.whenInitialized()` before assertions or interaction.

## Verification

Use the narrowest relevant checks, then broaden for cross-cutting changes:

- `npm run test` — default smoke suite.
- `npm run test:extended` — reduced compatibility suite.
- `npm run test:full` — full matrix; release runs require both supported Chrome binaries.
- `npm run test:ssr` — SSR and DOM-free utility entries.
- `npm run test:package` — package exports, module formats, types, and consumer builds.
- `npm run build` — generated artifacts and build sanity checks.

Web Test Runner concurrency must remain `1`. Always compare the reported test count with
the expected tier count: a test module import failure can otherwise appear as a passing
file with zero tests. Update the expected total when adding cases.

## Code style

Use 2-space indentation, single quotes, and semicolons. Exported library functions use the
`atcb_*` prefix; constants use `atcb*` camelCase. Follow the existing ESLint and Prettier
configuration, and avoid unrelated generated-file or formatting churn.
