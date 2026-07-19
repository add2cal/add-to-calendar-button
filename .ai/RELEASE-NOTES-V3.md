# Add to Calendar Button v3.0.0

Draft release notes, written to be shippable as-is for the GitHub release and the announcement
post. The pre-release (`3.0.0-next.x`, npm tag `next`) can reuse this text with a short
"help us test" intro.

---

## The same button. A fraction of the weight. Ready for everything.

v3 is a full rewrite of the internals with one hard rule: **a working v2 integration keeps
working.** Same tag, same attributes, same `atcb_action`. If you never read past this line,
you can update anyway.

### Why update

**It is a lot lighter.** Only the default style and English ship in the bundle - every other
button style (~12 KB) and language (~3 KB) loads on demand, automatically next to your script
or as explicit imports in your bundler:

```js
import 'add-to-calendar-button'; // core, default style, English
import 'add-to-calendar-button/styles/3d'; // exactly the styles you use
import 'add-to-calendar-button/i18n/de'; // exactly the languages you serve
```

The ESM bundle dropped 44 percent raw / 19 percent gzip against v2.15. The npm package
halved. A typical vite app importing the button plus one extra style and one extra language
builds to 233 KB of minified JavaScript, total.

**It renders on the server.** The new `add-to-calendar-button/ssr` entry produces a style- and
size-correct shell via declarative shadow DOM that paints before any JavaScript runs - and the
client bundle hydrates it without layout shift:

```js
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';
const html = atcb_generate_ssr_html({ name: 'Launch Party', startDate: '2050-06-15', buttonStyle: '3d' });
```

**It speaks fluent regional.** `language="en_GB"` now resolves regional translations where
available and formats dates in the regional convention. Ukrainian joined the officially typed
languages, and the RSVP strings are part of the core packs.

**It is more accessible.** The dropdown follows the WAI-ARIA menu pattern, modals are real
dialogs with a working focus trap, `focus()` on the element finally reaches the button, and
date-style buttons expose complete labels to screen readers. An axe-core gate keeps it that way.

**It is hardened.** URL scheme allowlisting everywhere urls are consumed, escaped description
links, prototype-pollution-safe input parsing, and schema.org output that stays valid JSON for
any content.

**It fixes long-standing edges.** Recurring events with old start dates resolve instantly and
correctly (v2's iteration silently capped out roughly 27 years in). When clipboard copying
fails, you now get an honest manual-copy field instead of a false success message.

### Modernized foundation

Lit-based web component, strict TypeScript, per-instance state management, and TypeScript
declarations generated straight from the source - one flat file that resolves under bundler,
node16 and classic moduleResolution alike. Official attribute names are kebab-case now
(`start-date`, `button-style`, ...); every v2 spelling keeps working as an alias.

### Deprecations and breaking changes

- The dedicated `no-pro` / `unstyle` / `no-pro-unstyle` builds are gone. The npm subpaths and
  CDN file names keep working as tiny shims that load the main package (styles are lazy anyway,
  and PRO code is license-gated at runtime) - please switch to the main entry.
- `customLabels` users overriding exactly these keys need to rename them:
  `date.status.cancelled.cta` -> `date.status.cancelled_cta`,
  `label.share.email.subject` -> `label.share.email_subject`,
  `label.rsvp` -> `label.rsvp.title`, `form.status` -> `form.status.title`,
  `form.success` -> `form.success.title`.
- Script-capable url schemes (like `javascript:`) are rejected wherever urls are consumed.
- Browser floor: full experience at Baseline 2023; bundles target ES2017; declarative shadow
  DOM is a progressive enhancement on capable browsers.

### Try the pre-release

```bash
npm install add-to-calendar-button@next
```

Report anything odd at https://github.com/add2cal/add-to-calendar-button/issues - the behavior
test suite (480+ cases across two browsers) guards the compatibility promise, and your reports
make it stronger.
