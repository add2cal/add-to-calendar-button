# ⚡ Changelog (without patches)

## Version 2

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
