# ⚡ Changelog (without patches)

## Version 3

- v3.0 : "lighter, faster, everywhere" full rewrite of the internals - same button, same attributes
  - smaller: styles beyond the default and languages beyond English are now separate tiny assets, loaded on demand by browser-script/CDN integrations and explicitly imported by npm users. Smaller bundle size despite having added ons of new features.
  - new: server-side rendering via the `add-to-calendar-button/ssr` entry - style- and size-correct shells through declarative shadow DOM, hydrated without layout shift
  - new: DOM-free `add-to-calendar-button/utils` entry exporting `atcb_generate_timestring` and `atcb_decorate_data_dates` for Cloudflare Workers, Node, and other runtimes without browser globals
  - new: per-style and per-locale npm modules (`add-to-calendar-button/styles/3d`, `add-to-calendar-button/i18n/de`) for fetch-free bundling
  - new: official kebab-case attribute names (`start-date`, `button-style`, ...) - every v2 spelling keeps working as an alias
  - new: `style-source` and `load-all-styles` options for asset loading control and runtime style switching
  - new: event list rendering option for PRO users
  - new: full-locale support - `language="en_GB"` picks regional translations where available and formats dates in the regional convention
  - new: 19 languages added: Albanian, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Croatian, Danish, Georgian, Greek, Lithuanian, Latvian, Macedonian, Maltese, Russian, Serbian, Slovak, Slovenian, and Ukrainian; RSVP strings now part of the core language packs
  - new: extended ics options for the Apple/iCal cases (`icsReminder`, `icsUrl`, `icsCategories`, `icsClass`, `icsPriority`, `icsGeo` incl. Apple map preview, `icsAttach`, `icsExdate`) - second-level options that only shape the generated ics file; all other calendar types simply ignore them
  - modernized internals: Lit-based web component, strict TypeScript, per-instance state, generated flat type declarations that work with every moduleResolution
  - accessibility: WAI-ARIA menu pattern for the dropdown, real dialog semantics with a focus trap for modals, working focus delegation, complete date-button labels for screen readers
  - security: url scheme allowlisting, escaped description links, prototype-pollution-safe input parsing, valid schema.org JSON for any content
  - recurring events with old start dates now resolve instantly and correctly (the old day-by-day iteration silently capped out about 27 years in)
  - honest clipboard fallback: when automatic copying fails, a manual-copy field appears instead of a false success message
  - ⚠️ Breaking: the ics timestamp options were renamed to their ics-only scope: `created` is now `ics-created` (`icsCreated`) and `updated` is now `ics-updated` (`icsUpdated`) - the old names are no longer read
  - ⚠️ Breaking: npm package users must explicitly import every non-default style and non-English locale they use (for example, `add-to-calendar-button/styles/3d` and `add-to-calendar-button/i18n/de`); browser-script/CDN integrations continue to load them on demand
  - ⚠️ Breaking: dedicated `no-pro` / `unstyle` / `no-pro-unstyle` builds are gone - the old entry points and CDN file names keep working as tiny shims that load the main package
  - ⚠️ Breaking: for `customLabels` users overriding exactly these keys: `date.status.cancelled.cta` is now `date.status.cancelled_cta`, `label.share.email.subject` is now `label.share.email_subject`, and `label.rsvp` / `form.status` / `form.success` moved to `label.rsvp.title` / `form.status.title` / `form.success.title`
  - ⚠️ Breaking: script-capable url schemes (like `javascript:`) are rejected wherever urls are consumed
  - ⚠️ Breaking: browser floor is now Baseline 2023 for the full experience (bundles target ES2017; declarative shadow DOM is a progressive enhancement)
  - all HTML attributes now have kebab-case official names, including the `ics-*` options (`ics-reminder`, `ics-url`, ...) and the former underscore options (`recurrence-interval`, `recurrence-by-day`, ...); migrating to the official spelling is strongly recommended because the camelCase/underscore aliases may be removed in a future major version; camelCase remains preferred for JavaScript configuration objects such as `atcb_action` input
  - official lowercase config values: calendar types (`apple`, `google`, `ical`, `ms365`, `msteams`, `outlookcom`, `yahoo`) and status (`tentative`, `confirmed`, `cancelled`) - all v2 spellings keep working as aliases (typed via `ATCBOptionNameLegacy` / `ATCBEventStatusLegacy`)
  - fix: navigating from the options list (as modal) to a follow-up modal (e.g. the multi-date picker) no longer blinks the background - the shared overlay is kept alive and the new modal fades in while the previous view is dropped in place
  - fix: the modal box and the modal option list are correctly sized again (max width on larger screens, no drop-shadow on fullscreen mobile) - regressions from the v3 style split
  - fix: the second step of the Yahoo subscription flow no longer re-copies the link (and could no longer wrongly report a copy failure); its secondary button now reads "Close"
  - see the [migration guide](./MIGRATION.md) for details - existing v2 integrations keep working

## Version 2

- v2.15 : Better responsive versions on very small screens for modals and date buttons
- v2.14 : Dropping atcb_decorate_data_recurrence export; various bug fixes
- v2.13 : Hebrew language
- v2.12 : ⚠️ Breaking: Date buttons now show the next possible date in multi-date and recurrence cases. Recurrence UNTIL support. Mitigating edge cases where ics files with unsupported time zones loaded into Google calendar. Always block background scroll on modals open
- v2.11 : ⚠️ Breaking: When setting the dates objects and respective attributes on the root level, root values always override the dates object (except for name in the multi-date case)
- v2.10 : Hungarian language, no more X cursor, no different button icons for oneOption cases, create 1 ics file if organizer is the same, subtle style updates, allow to override automatic option-cleanup on mobile via mobile Options
- v2.9 : New style "simple", better ical generation
- v2.8 : Ukranian language
- v2.7 : Showing open seats on RSVP, better subscription handling
- v2.6 : useUserTZ, css ::part, formatting of urls in description
- v2.5 : PRO option and more
  - ✨ [introducing PRO offering](https://add-to-calendar-pro.com/)
  - ⚠️ Breaking: default branding activated in order to support this free open source project (if you do not want to support this project, use the hideBranding option to disable it)
  - ⚠️ Breaking: if you want to customize calendar option labels, you need need to do this via the customLabels option
  - ⚠️ Breaking: some inline style got moved to the css. If you use your own custom css, double-check
  - new optionsMobile und optionsIOS options to specify device-specific calendar types
  - more css var options and subtle style fixes
  - bundle-size optimization option
  - attendee optimization
  - a lot of fixes
- v2.4 : forceOverlay, fixes
- v2.3 : pastDateHandling, disable option, static-dropup listStyle option, date style optimized, buttonsList optimized, better iOS support, new languages
- v2.2 : "attendee" option, lazy external css loading, fixes
- v2.1 : Romanian language support and a bunch of fixes
- v2.0 : "all" new version 2
  - now a universally usable web component, working basically plug and play at almost all frontend stacks
  - more customization (hide/show all parts individually) and easy styling (no longer necessary to include the css file manually)
  - updates automatically when you change any attributes
  - a lot of bug fixes and performance improvement
  - prepared for better tracking
  - full code refactoring
  - new demo page with live playground
  - using attributes instead of the innerContent JSON structure. Latter one is still supported, but not with to the full degree of the new version
  - new license: ELv2
  - potential breaks:
    - backwards compatibility for old schema.org support (< v1.10) and parameter names prior v1.4 are no longer supported
    - some rather rarely used parameters have changed (name and direction):
      - background -> hideBackground
      - checkmark -> hideCheckmark
      - richData -> hideRichData

## Version 1

- v1.18 : multi-date functionality, subscription support, busy/free option, style updates, code refactoring, timezone database update
- v1.17 : new license (Apache-2.0 with “Commons Clause”)
- v1.16 : custom sequence, UID, and status support; bundle size optimization
- v1.15 : more stable time zone management via the [TimeZones iCal Library](https://tz.add-to-calendar-technology.com/), more languages, easier recurrence, better schema.org support, organizer and image information
- v1.14 : dynamical dropdown/up, adjustable size
- v1.13 : dark mode
- v1.12 : style updates, sanitization, webView edge case support, text block overwrite option, change of repo ownership
- v1.11 : 1-option support, static ics support, instagram browser support, multi-lang, hide background option, recurring events, and more
- v1.10 : auto-generating schema.org and dropping support for its input
- v1.9 : big code style update + linter setup
- v1.8 : new button style
- v1.7 : new code structure and options + tons of optimizations
- v1.6 : supporting Microsoft Teams
- v1.5 : update to date format and better accesibility
- v1.4 : schema.org support (also changed some keys in the JSON!)
- v1.3 : new license (MIT with “Commons Clause”)
- v1.2 : inline and line break support
- v1.1 : npm functionality
- v1.0 : initial release
