# Migrating from v2 to v3

Version 3 keeps the same `<add-to-calendar-button>` element, the same imperative `atcb_action`
API, and runtime aliases for existing v2 attributes and calendar names. Most integrations can
upgrade by changing only the installed package or script version.

Use this guide to check the few changes that may require action in your project.

## Migration checklist

1. Upgrade `add-to-calendar-button` to version 3 and keep using the main package entry.
2. If you use TypeScript, rename the typed `proKey` config property to `prokey`.
3. Rename `created` and `updated` to `icsCreated` and `icsUpdated` in JavaScript configuration,
   or to `ics-created` and `ics-updated` in HTML attributes.
4. If you provide `customLabels`, update the renamed translation keys listed below.
5. If you use a legacy `no-pro`, `unstyle`, or `no-pro-unstyle` entry, switch to the main entry.
   Compatibility shims still work, but the dedicated builds no longer exist.
6. Check that any supplied URLs use an allowed, non-scriptable scheme.
7. Test on your supported browsers. The full v3 experience targets Baseline 2023.

If none of these cases applies, your v2 integration should continue to work unchanged.

## Upgrade the package or browser script

The primary entry points have not changed:

| Integration    | v2                                  | v3        |
| -------------- | ----------------------------------- | --------- |
| ESM            | `import 'add-to-calendar-button'`   | unchanged |
| CommonJS       | `require('add-to-calendar-button')` | unchanged |
| Browser script | `<script src=".../atcb.js">`        | unchanged |
| Imperative API | `atcb_action(config, button)`       | unchanged |

The minified `atcb.min.js` browser bundle is now also included in the npm package.

The old package entries `add-to-calendar-button/no-pro`,
`add-to-calendar-button/unstyle`, and `add-to-calendar-button/no-pro-unstyle` remain available as
deprecation shims. Likewise, the old CDN filenames load the main package through a small shim.
Update these integrations to the main entry when convenient:

```js
import 'add-to-calendar-button';
```

## Update TypeScript PRO configurations

The typed PRO key is now `prokey`, matching the official HTML attribute:

```ts
// v2
atcb_action({ proKey: '...' });

// v3
atcb_action({ prokey: '...' });
```

This is a compile-time breaking change for typed `atcb_action` configurations and
`AddToCalendarButtonType` usage. The old `proKey` property remains a runtime alias for plain
JavaScript objects. Existing HTML such as `<add-to-calendar-button proKey="...">` also continues
to work because HTML attribute names are case-insensitive.

Type declarations are now generated into a flat `dist/index.d.ts` and support bundler, Node 16,
and classic module resolution. Existing public type names remain available.

## Rename the ICS timestamp options

The general-looking v2 timestamp options now use explicit ICS names because they affect only
Apple/iCal output:

| v2        | v3 HTML attribute | v3 JavaScript property |
| --------- | ----------------- | ---------------------- |
| `created` | `ics-created`     | `icsCreated`           |
| `updated` | `ics-updated`     | `icsUpdated`           |

Unlike most renamed attributes in v3, the old `created` and `updated` names are no longer read.

## Update custom label keys

Only integrations overriding these exact `customLabels` keys need changes:

| v2 key                      | v3 key                      |
| --------------------------- | --------------------------- |
| `date.status.cancelled.cta` | `date.status.cancelled_cta` |
| `label.share.email.subject` | `label.share.email_subject` |
| `label.rsvp`                | `label.rsvp.title`          |
| `form.status`               | `form.status.title`         |
| `form.success`              | `form.success.title`        |

There is also a new `modal.clipboard.failed` key for the manual-copy fallback shown when automatic
clipboard access fails.

## Prefer the new official attribute and value names

Official HTML attribute names are now kebab-case, for example `start-date`, `button-style`,
`recurrence-interval`, and `recurrence-by-day`. Existing v2 camelCase, lowercase, and underscore
spellings remain supported as aliases. When both an official name and a legacy alias are present,
the official name wins.

Calendar option values are now lowercase:

- `apple`
- `google`
- `ical`
- `ms365`
- `msteams`
- `outlookcom`
- `yahoo`

The v2 values such as `Apple`, `Google`, `iCal`, `Microsoft365`, `MicrosoftTeams`, and
`Outlook.com` continue to work in any casing. TypeScript exposes the new values through
`ATCBOptionName` and the old values through `ATCBOptionNameLegacy`.

Event status values are likewise lowercase: `tentative`, `confirmed`, and `cancelled`. Uppercase
v2 values still work, and generated ICS files continue to use the uppercase values required by
the specification.

## Check supplied URLs

Version 3 rejects script-capable URL schemes such as `javascript:`. URLs supplied through event
configuration, including ICS files, custom CSS, images, and proxy targets, must use an allowed
scheme. Supported schemes include `http`, `https`, `webcal`, `webcals`, `mailto`, `intent`, and
`data:text/calendar` where applicable.

Descriptions using `[url]...[/url]` link syntax only create links for HTTP(S), Webcal(S), and
mailto URLs. Unsupported values are rendered as text.

## Account for the browser support floor

Version 3 provides the full experience on Baseline 2023 browsers, including Safari 16.4 and
current evergreen browsers. Bundles target ES2017. Declarative Shadow DOM is a progressive
enhancement, so browsers without it fall back to client-side rendering.

The dropdown now follows the WAI-ARIA menu pattern (`menu` and `menuitem` roles), and modals use
native `<dialog>` elements. If your application tests or CSS target the old `list`/`link` roles or
the old modal structure, update those selectors.

## Optional: use on-demand styles and locales

The default style and English remain bundled. Other styles and languages load automatically as
small assets when requested. No migration is required for normal browser-script usage.

Bundled applications can register assets without a runtime fetch:

```js
import 'add-to-calendar-button';
import 'add-to-calendar-button/styles/3d';
import 'add-to-calendar-button/i18n/de';
```

You can also use `style-source` to override the base URL for lazy assets, `load-all-styles` to
prefetch all styles for runtime switching, `atcb_register_style(name, css)` to register a style,
or `atcb_register_locale(lang, strings)` to register a locale.

Full locales are supported. For example, `language="en_GB"` or `language="en-GB"` uses regional
translations when present and preserves the region for date formatting. Ukrainian (`uk`) is now
part of the public language type.

## Optional: use server-side rendering

Version 3 includes an SSR-only entry that creates a Declarative Shadow DOM shell:

```js
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';

const html = atcb_generate_ssr_html({
  name: 'Launch Party',
  startDate: '2050-06-15',
  buttonStyle: '3d',
  language: 'de',
});
```

The shell reflects the button style, size, color mode, text direction, and label. The regular
browser package adopts and hydrates it without replacing the already-painted shadow root.

## New ICS-only options

Version 3 adds options that affect generated Apple/iCal files only. Other calendar services ignore
them:

- `ics-reminder` / `icsReminder`
- `ics-url` / `icsUrl`
- `ics-categories` / `icsCategories`
- `ics-class` / `icsClass`
- `ics-priority` / `icsPriority`
- `ics-geo` / `icsGeo`
- `ics-attach` / `icsAttach`
- `ics-exdate` / `icsExdate`

The first form is the HTML attribute; the second is the JavaScript configuration property.
`ics-exdate` is root-only. The other options can be applied to individual entries in a multi-date
event, with root values taking precedence.

## Behavior improvements that need no migration

- Recurring events with old start dates are fast-forwarded efficiently while preserving `COUNT`
  and `UNTIL` behavior.
- Clipboard failures show a manual-copy field instead of reporting a false success.
- Input parsing strips prototype-pollution keys and safely escapes rich-data output.
- The Google Calendar icon uses the current logo.
