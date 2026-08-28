# Test Cases (add-to-calendar-button)

Complete list of all test cases across the three tiers. See `.ai/TEST-STRATEGY.md` for
the strategy, helpers, and conventions behind them.

This file mirrors the `it()` titles in the test files. When adding or changing tests,
update this list in the same commit. Quick consistency check:
`grep -rhoE "it\\(.(S|[A-U]+)-[0-9a-z]+:" test/wc-tests-smoke test/wc-tests | wc -l`

## Tier 0 - Smoke Suite (`npm run test`)

File: `test/wc-tests-smoke/s-smoke.test.js`

### SMOKE | OSS x Desktop

- S-01: initializes, opens the list, renders all seven options + attribution
- S-02: Google link carries the event correctly (wall-clock + ctz)
- S-03: ICS download is a valid VCALENDAR with the event data
- S-04: all-day event uses date-only formats in Google + ICS
- S-05: recurring event -> RRULE in ICS; non-supporting options deactivated
- S-06: tracking chain fires (initialization -> openList -> openCalendarLink -> success) + attribute mirror

### SMOKE | OSS x Mobile

- S-07: Android flavor swaps apple out, keeps ical, downloads with _self target
- S-08: Android Google link uses the intent:// wrapper with browser fallback
- S-09: iOS flavor swaps ical out, keeps apple
- S-10: mobile modal listStyle opens on click and locks body scroll

### SMOKE | PRO x Desktop

- S-11: prokey fetches the server config and renders it (incl. powered-by note in ICS)
- S-12: proOverride lets local attributes win over the server config
- S-13: proxy=true routes clicks through the PRO proxy URL
- S-14: invalid prokey (404) fails silently - no render, no crash

### SMOKE | PRO x Mobile

- S-15: PRO config renders under the mobile flavor with platform option rules applied
- S-16: PRO RSVP config renders the RSVP entry point instead of calendar options

Also part of the default run (long-standing quick tests):

- `test/wc-tests/wc-load.test.js`: has a generated button id and shadowDom element
- `test/wc-tests/recurrence-tz.test.js`: does not shift startDate for weekly BYDAY near midnight in Europe/Berlin
- `test/server-side-init.test.js`: CommonJS bundle imports in Node without executing browser-only code

## Tier 1 - Reduced Suite (`npm run test:extended`)

### Group A - Lifecycle & registration (`r-A-lifecycle.test.js`)

- A-01: registers and initializes with minimal config
- A-02: missing name (debug off) -> silent no-render
- A-03: missing name + debug -> visible error block
- A-04: hidden=true skips button generation entirely
- A-05: disabled=true renders but click no-ops
- A-06: blockInteraction=true blocks all interaction
- A-07: two instances keep independent state
- A-08: imperative atcb_action opens directly; atcb-last-event only set after first event
- A-09: removing element cleans up open UI and schema
- A-10: attribute change after init triggers re-render
- A-11: init is deferred (non-blocking) - not initialized synchronously after append

### Group B - Config validation & error paths (`r-B-validation.test.js`)

- B-01: invalid icsFile URL throws
- B-02: subscribe + multi-date dates array throws
- B-03: subscribe without icsFile throws
- B-04: unknown calendar option throws
- B-05: malformed created timestamp throws
- B-06: malformed updated timestamp throws
- B-07: invalid IANA timezone throws
- B-08: RRULE with forbidden characters throws (syntax regex)
- B-09: unsupported FREQ values pass the syntax check (documented actual behavior)
- B-09b: RRULE combined with multi-date dates array throws
- B-11: unknown language falls back to en (no throw)
- B-12: invalid buttonStyle throws
- B-13: empty dates array does not crash the pipeline (documented actual behavior)
- B-14: endDate before startDate throws
- B-15: endTime before startTime (same day) throws
- B-16: invalid availability value throws
- B-17: invalid status value throws
- B-18: valid baseline config passes the whole pipeline
- B-19: legacy v2 option spellings (Apple, Microsoft365, Outlook.com, ...) normalize to the official lowercase keys; official keys resolve identically
- B-20: status input is case-insensitive and decorates to lowercase; default status is confirmed

### Group C - Date / time / timezone (single event) (`r-C-datetime.test.js`)

- C-01: NY summer timed event -> correct ICS TZID + Google UTC range
- C-02: Tokyo timed (no DST) -> +09:00 math in Google URL, TZID in ICS
- C-03: explicit UTC -> no shift between wall clock and UTC output
- C-04: no timeZone -> defaults to GMT (wall-clock + ctz=GMT)
- C-06: special tz alias (CET) -> mapped; Google gets no ctz param
- C-07: single all-day -> date-only formats, DTEND +1 day
- C-08: multi-day timed -> range spans days (wall-clock + ctz)
- C-09: multi-day all-day -> DTEND is end date +1
- C-10: dynamic date today+7 resolves to a concrete date
- C-11: past date with default handling still renders normally
- C-12: pastDateHandling=hide skips button generation
- C-13: pastDateHandling=disable renders but disables
- C-14: availability free/busy -> ICS TRANSP + Google crm params
- C-15: status CANCELLED -> ICS STATUS:CANCELLED (iCal path still works)
- C-16: timeZone="currentBrowser" resolves to the browser timezone
- C-17: POSIX-inverted Etc/GMT+5 means UTC-5 in output math

### Group D - DST & timezone corners (`r-D-dst.test.js`)

- D-01: NY event 1h before 2050 spring-forward uses EST (-05:00)
- D-02: NY event after spring-forward uses EDT (-04:00)
- D-03: NY event SPANNING spring-forward -> start EST, end EDT, wall-clock ICS literals
- D-04: NY event before fall-back uses EDT (-04:00)
- D-05: NY event after fall-back uses EST (-05:00)
- D-06: NY event SPANNING fall-back -> start EDT, end EST
- D-08: Sydney autumn transition (+11 -> +10) applies per date
- D-09: Tokyo unaffected by NY DST date
- D-10: multi-date series across a DST boundary -> per-date offsets, one VTIMEZONE

### Group E - Recurring events (`r-E-recurring.test.js`)

- E-01: simplified DAILY -> RRULE in ICS and Google; non-supporting options deactivated
- E-02: simplified WEEKLY with BYDAY
- E-03: simplified MONTHLY with BYMONTHDAY
- E-04: simplified MONTHLY with BYDAY=2MO
- E-05: simplified YEARLY with BYMONTH + BYMONTHDAY
- E-06: raw RRULE passes through verbatim
- E-07: UNTIL is converted into an equivalent COUNT (documented actual behavior)
- E-08: INTERVAL preserved
- E-09: WKST preserved
- E-10: recurring all-day -> date-only DTSTART with RRULE
- E-11: past start with future occurrences left -> startDate advances (decorate level)
- E-12: COUNT exhausted (all in past) -> startDate advances to the LAST occurrence, still renders
- E-12a: COUNT exhausted + pastDateHandling=hide -> button not generated
- E-13d: iOS + recurring -> only apple remains and renders as a SINGLETON button
- E-15: simplified recurrence flag uses the CORRECTED spelling in this codebase

### Group F - Multi-date / event series (`r-F-multidate.test.js`)

- F-01/F-12: multi-date iCal -> ONE ics file containing all VEVENTs (same/no organizer, none cancelled)
- F-02: out-of-order dates are auto-sorted chronologically
- F-03: mixed timezones -> per-VEVENT TZID and deduped VTIMEZONE blocks
- F-04/F-05: Google on multi-date opens selection modal; sub-event click emits openSubEventLink + correct URL
- F-07: multi-date + subscribe throws (silent no-render at WC level)
- F-08: mixed past/future + pastDateHandling=hide -> past entries FILTERED, button stays
- F-11: mixed past/future + pastDateHandling=disable -> renders normally (disable only fires when ALL are past)
- F-10: ALL entries past + pastDateHandling=hide -> whole button not generated
- F-09: per-entry name override -> per-VEVENT SUMMARY
- F-13/G-19: DIFFERING organizers -> no single combined file; per-date selection with per-date METHOD

### Group G - ICS / Apple output (`r-G-ics.test.js`)

- G-01: VCALENDAR structure with the calendarverse.net prodid using the stable semver (without a `-next*` suffix)
- G-02: no organizer -> METHOD:PUBLISH, no ORGANIZER line
- G-03: organizer set -> METHOD:REQUEST + ORGANIZER CN/mailto
- G-04: attendee line rendered with organizer present
- G-05: auto UID is a stable UUID per render
- G-06: supplied UID preserved verbatim (word chars + dashes only per RFC 7986)
- G-06b: UID with forbidden characters falls back to a generated UUID
- G-07: SUMMARY special characters are escaped per RFC 5545
- G-08: HTML in description is stripped for the plain DESCRIPTION
- G-09/G-10: location preserved (URL and plain text)
- G-11: STATUS, SEQUENCE, CREATED, LAST-MODIFIED preserved when supplied
- G-11b: icsCreated/icsUpdated work per date entry in the multi-date case
- G-12: hosted icsFile is downloaded directly (no inline ICS built)
- G-16: long description folds to RFC 5545 line lengths and unfolds losslessly
- G-17: custom iCalFileName is used for the download
- G-21: dynamically generated singleton ICS renders first, then becomes a native download anchor
- G-22: static ICS files retain the established button-driven download path
- G-23: dynamic iOS ICS uses a precomputed blob URL and revokes it on teardown
- G-20: desktop file save targets _blank (mobile would use _self)

### Group H - Google output (`r-H-google.test.js`)

- H-01: desktop base URL is calendar/r/eventedit with encoded params
- H-02: all-day uses date-only range
- H-03: recurring adds recur=RRULE param
- H-06: long HTML description is transported url-encoded
- H-07: online event URL lands in location param
- H-08: CANCELLED click fork -> warning modal for Google, Cancel-ICS for iCal
- H-09: Android flavor wraps the URL into an intent:// with browser fallback
- H-10: mobile flavor uses the render?action=TEMPLATE base

### Group I - Outlook (MS365 + Outlook.com) (`r-I-outlook-yahoo-teams.test.js`)

- I-01: MS365 deeplink URL with path/startdt/enddt/subject/location/body
- I-02: Outlook.com uses outlook.live.com with same params
- I-01b: MS365 mobile flavor uses the same deeplink base
- I-03: all-day event sets allday=true for both Outlook variants
- I-04: recurring removes both Outlook options from the list
- I-05: online event -> URL in location and kept in body
- J-01: timed event -> v=60 URL with st/et/title/in_loc/desc
- J-02: single all-day -> dur=allday with start only
- J-02b: multi-day all-day falls back to timed range (Yahoo workaround)
- J-03: recurring removes the Yahoo option from the list
- K-01: timed event -> teams meeting/new URL with subject and times
- K-02: all-day event still produces a valid teams URL
- K-03: subscribe mode removes Teams from the list
- K-06: recurring removes Teams from the list (Microsoft family rule)

### Group L - Environment-driven routing (`r-L-env.test.js`)

- L-01a: atcb_action uses a compact Apple-device interstitial with a Blob link for dynamically generated singleton ICS
- L-01b: atcb_action skips the interstitial and retains direct saving for a static singleton ICS
- L-01c: atcb_action sink resolves dynamic ICS without rendering or navigation
- L-01d: atcb_action on macOS saves a dynamic singleton ICS directly
- L-04: Android -> apple option removed, ical stays
- L-13a: iOS -> ical option removed, apple stays
- L-10: optionsMobile filters the list on mobile
- L-11: on iOS, optionsIOS takes precedence over optionsMobile
- L-11b: optionsIOS applies when it is the only override set
- L-18: explicit optionsIOS with "iCal" (doc casing) is kept verbatim - no swap
- L-18b: optionsIOS with lowercase "ical" behaves identically (case-insensitive)
- L-16: iOS + recurring -> only the apple/ical family remains
- L-17: desktop + recurring -> google stays active with recur param
- L-02: iOS non-Safari browser (Chrome on iOS) -> subscribe ical shows copy-note modal instead of opening
- L-01: iOS Safari -> subscribe ical opens webcal:// directly
- L-15: mobile file save targets _self (desktop _blank covered in G-20)
- L-08: desktop default -> all seven options render

### Group M - UI / interaction (`r-M-ui.test.js`)

- M-01: button renders with icon and label text
- M-02: hideTextLabelButton -> no text, icon only
- M-03: hideIconButton -> no icon on the trigger
- M-04: click trigger opens list + openList event
- M-05: hover trigger opens on mouseenter
- M-06: ESC closes the open list + closeList event
- M-08/M-09: focus lands in list on open; Enter on item triggers link
- M-10/M-11: modal listStyle locks body scroll and unlocks on close
- M-12: singleton config opens directly with openSingletonLink (no dropdown)
- M-13: buttonsList renders one button per option
- M-13b: round buttonsList keeps dynamic Apple/iCal anchors on the singleton button box model
- M-14: saved checkmark + success event after all options were used
- M-15: hideCheckmark suppresses the saved checkmark
- M-16: hideBackground -> no background overlay for modal
- M-18/M-19: static list styles render without dynamic repositioning
- M-20: overlay listStyle renders the dropoverlay variant
- M-22/M-23: explicit light/dark mode set the scheme class on the HOST element
- M-27: styleLight custom CSS variables land on the host style
- M-28: buttonStyle=round applies its stylesheet variant
- M-30: OSS + hideBranding -> in-list branding hidden but page-level license reference is added
- M-30b: OSS default (no hideBranding) -> attribution rendered inside the open list
- M-32: buttonStyle=date renders the date-card variant
- M-32b: cancelled child and all-cancelled parent date buttons hide the plus badge; mixed parent and active child keep it

### Group N - dataLayer / tracking (`r-N-datalayer.test.js`)

- N-01: initialization is pushed once with category/action and mirrors to atcb-last-event
- N-02/N-03: openList and closeList push with correct actions
- N-04: option click in a multi-option list pushes openCalendarLink with the option id
- N-05: singleton click pushes openSingletonLink (NOT openCalendarLink)
- N-06: sub-event click in the multi-date modal pushes openSubEventLink
- N-09: success is pushed once all options have been used
- N-10: missing window.dataLayer is created on demand - no crash, attribute still mirrors
- N-11: categories are Add-to-Calendar-Button for non-RSVP flows

### Group O - Localization & i18n (`r-O-i18n.test.js`)

- O-01: language=de renders the German default label
- O-02: language=fr renders the French default label
- O-03: unknown language falls back to English silently
- O-04: RTL language applies the atcb-rtl class
- O-05/O-06: customLabels override specific keys; others stay language defaults
- O-08: ICS SUMMARY stays the configured name regardless of UI language

### Group P - Subscribe mode (`r-P-subscribe.test.js`)

- P-01: Apple subscribe converts to webcal:// (desktop)
- P-02: Google subscribe uses the cid= subscription URL (not the render URL)
- P-02b: MS365 subscribe uses addfromweb with url + name
- P-03: Yahoo subscribe opens the manual-instructions modal instead of a URL
- P-04: Teams is filtered out in subscribe mode
- P-04b: mobile subscribe additionally drops ms365 + outlookcom
- P-05: subscribe + multi-date does not render (validation error)

### Group Q - Schema.org rich data (`r-Q-richdata.test.js`)

- Q-01: default event -> Event JSON-LD with core fields
- Q-02: hideRichData suppresses the schema script
- Q-04: online event -> OnlineEventAttendanceMode + VirtualLocation
- Q-05: organizer lands in the schema
- Q-06: images array is transported
- Q-07: cspnonce is applied to the schema script tag
- Q-08: multi-date -> EventSeries with per-date subEvents
- Q-10: subscribe mode never injects rich data

### Group R - PRO prokey fetch & override (`r-R-pro.test.js`)

- R-01: prokey fetches config.json and renders the server-driven button
- R-02: PRO fetch 404 -> button does not render
- R-03: PRO fetch network error -> button does not render
- R-04: dev=true fetches from event-dev.caldn.net
- R-05: WITHOUT proOverride, whitelisted attrs (language) still apply
- R-06: WITHOUT proOverride, non-whitelisted attrs (name) are IGNORED - server wins
- R-07: WITH proOverride, local name wins over server config
- R-09: override inline=true applies (inline is a whitelisted pro param)
- R-11: proOverride options=[Google] switches to singleton mode
- R-13: proOverride recurrence produces recurring output + option deactivation
- R-14: proOverride timeZone reruns the tz math
- R-15: proxy=true routes link clicks through the PRO proxy URL
- R-16: hideBranding is NOT overridable client-side in PRO mode (license enforcement)
- R-16b: PRO without proxy/hideBranding appends the powered-by note to descriptions

### Group T - PRO RSVP (render + client-side only) (`r-T-rsvp.test.js`)

- T-01: RSVP config renders the RSVP entry point INSTEAD of calendar-link options
- T-10: clicking the RSVP button opens the form and pushes openRSVP
- T-02: inlineRsvp renders the form immediately without a button click
- T-22: required fields exist and empty submit does not fire successRSVP (client-side gate)
- T-19: license guard allows rendering on localhost (test runner host)

### Group U - CSP environment 2x2 (`r-U-csp.test.js`)

- U-25: no CSP + no nonce -> renders (default case)
- U-24: no CSP + nonce set -> renders with nonce attributes, no errors
- U-22: strict CSP + matching nonce -> component initializes inside the CSP iframe without violations
- U-23: strict CSP WITHOUT nonce on the component -> browser blocks unsigned injections, lib degrades gracefully

### Group U - Edge cases & regressions (`r-U-edge.test.js`)

- U-03: backslashes, semicolons and commas are escaped per RFC 5545
- U-04: very long URL in location survives folding and unfolding
- U-07: SEQUENCE reflects the configured update counter
- U-08: mass mount - 10 buttons all initialize; ESC closes only the open one
- U-14: attribute updates after init re-render the output
- U-16: far-future dates (2099) do not overflow
- U-17: negative-offset tz crossing midnight shifts the UTC calendar day (Yahoo UTC output)
- U-18: empty description/location produce no empty ICS property lines
- U-19: very long title folds in ICS and encodes in URLs
- U-20: emoji in the title survives ICS and URL round-trips
- U-21: mixed scripts (Latin + CJK + Arabic) preserved everywhere

## Tier 2 - Full Cartesian Suite (`npm run test:full`)

Parameterized templates; each expands into many cases at runtime. Case names follow
the pattern `<template> | <dimension values>`.

### f-T1-output-matrix.test.js - output correctness across env x config x service

- Pattern: `F.T1 | <env> | <config> | <service>`
- Envs (3): desktop, ios, android
- Configs (5): C01-timedNY, C07-allday, C08-multidayTimed, C13-recurDaily, C24-online
- Services (7): apple, google, ical, ms365, outlookcom, msteams, yahoo
- Valid cells after constraints: **82 cases**

### f-T2-dst.test.js - DST x timezone matrix (Teams offsets vs Intl oracle)

- Pattern: `F.T2 | <timezone> | <local start datetime>`
- Zones and positions: America/New_York (6), America/Los_Angeles (6), Europe/Berlin (6), Europe/London (6), Australia/Sydney (6), Asia/Tokyo (3)
- Total: **33 cases**

### f-T3-rrule.test.js - RRULE serialization + option deactivation

- Pattern: `F.T3 | <shape> | ical|google` and `F.T3b | <shape> | desktop|ios absences`
- Shapes (9): daily, weekly-byday, monthly-bymonthday, monthly-2mo, yearly, raw-count, raw-until, interval, wkst
- Total: **18 serialization + 18 availability cases**

### f-T5-ui-variants.test.js - listStyle x trigger + buttonStyle samples

- Pattern: `F.T5a | <listStyle> | <trigger>` (5 x 2 = 10 cases, incl. the modal+hover coercion pin)
- Pattern: `F.T5b | buttonStyle=<style>` (9 cases): default, simple, 3d, flat, round, neumorphism, text, date, none

### f-T6-i18n.test.js - localization matrix

- Pattern: `F.T6 | <language> | button label` and `F.T6 | <language> | ics content integrity`
- Languages (8): en, de, fr, es, pt, ar, he, fa
- Total: **16 cases**

### f-T9-multidate.test.js - multi-date x timezone-mix x sequence x uid

- Pattern: `F.T9 | dates=<n> | tz=<mix> | seq=<n|-> | uid=<value|->`
- Dimensions: dates {1, 2, 3} x tz {same, mixed} x sequence {unset, 2} x uid {unset, fixed}
- Total: **24 cases**

## Group V - Official kebab-case attributes (test/wc-tests/r-V-attributes.test.js)

- V-01: full config via official kebab names renders and produces a correct Google link
- V-02: official name wins over legacy spelling when both are present
- V-03: prokey (official spelling exception) triggers the PRO flow
- V-04: special-case mappings work (ical-file-name, use-user-tz accepted)
- V-05: runtime change of an official attribute re-initializes the button
- V-06: legacy option value spellings via attribute (incl. spaced 'Microsoft 365' forms) resolve to the official keys
- V-07: uppercase status attribute value keeps working; ics file carries the RFC uppercase form (STATUS/METHOD contract)
- V-08: recurrence via official kebab attributes (recurrence-interval / recurrence-count / recurrence-by-day) drives the RRULE
- V-08b: legacy underscore recurrence attributes (recurrence_interval, recurrence_byDay) still resolve (backwards compat)
- V-09: ics options via official kebab attributes (ics-reminder / ics-url / ics-categories) shape the ics file

## Group W - Style registry (test/wc-tests/r-W-styles.test.js)

- W-01: core + default are inline; default style renders without any style fetch
- W-02: non-default style is fetched from the script origin and applied
- W-03: a pre-registered style is used without fetching
- W-04: style-source attribute overrides the fetch base
- W-05: load-all-styles prefetches every delta into the registry

## Group X - Locale loading (test/wc-tests/r-X-i18n-loading.test.js)

- X-01: non-english language fetches its pack once; label matches the oracle; cache prevents refetch
- X-02: a pre-registered locale is used without fetching
- X-03: regional pack wins for its exact locale; missing regional falls back to base english
- X-04: date formatting respects the full locale (en-US vs en-GB ordering differs)
- X-05: unknown language falls back to english without any locale fetch
- X-06: customLabels wins over every locale resolution layer, incl. identifiers unknown to the core

## Group Y - Packaging (test/wc-tests/r-Y-packaging-script.test.js, r-Y-packaging-shim.test.js)

Two separate test files by design: the shim case needs a page where nothing defined the element before.

- Y-01: dist/atcb.js via classic script tag defines the element, exposes window.atcb_action and renders end-to-end
- Y-02: a deprecated CDN file name (atcb-no-pro.js) logs a one-time deprecation info and loads the main bundle next to it

## Package consumption (scripts/test-package.mjs, `npm run test:package`)

Node-side gate outside the browser runner: builds with --min, packs the tarball, installs it into a
throwaway consumer and asserts every consumption path - Node CJS require, Node ESM import (root,
./styles/_, ./i18n/_, deprecated variant subpaths), types under moduleResolution bundler AND node16,
and a vite build importing one extra style plus one extra locale with content and size-bound checks
(locale subsetting proven by asserting absence of a not-imported locale).

## Group S - SSR shell render (test/ssr-node/render.test.mjs, `npm run test:ssr`)

Plain Node WITHOUT DOM emulation (the ssr entry must be DOM-free); string assertions against dist/ssr.

- S-01: environment is DOM-free (no document, no window)
- S-02: ESM and CJS entries expose the same generator
- S-03: default shell carries host attributes (official kebab names), DSD template, styles and the real label
- S-04: buttonStyle selects exactly its delta; unknown styles fall back to default
- S-05: size attribute maps to the font-size custom properties (same math as the client)
- S-06: date style renders skeleton spans instead of computed date parts
- S-07: inline RSVP renders a shimmering form-shaped skeleton
- S-07b: non-inline RSVP renders the localized RSVP button
- S-07c: async renderer fetches the regular-event PRO fixture and renders its button
- S-07d: async renderer fetches the RSVP PRO fixture and renders its RSVP button
- S-08: rtl languages mark the wrapper; hidden config keeps the shell hidden
- S-09: attribute values and label text are escaped
- S-10: unknown languages fall back to the english label
- S-11: kebab-case config keys are normalized like the tag attributes
- S-11b: legacy lowercased attributes normalize across the SSR config surface
- S-11c: SSR spelling precedence is camelCase API key, then official attribute, then legacy alias
- S-12: buttonsList renders one singleton button per option with per-option icons and skeleton labels
- S-13: buttonsList honors option label overrides, kebab input, and the date-style exclusion
- S-14: hide-icon-button and hide-icon-list drop the respective icons
- S-15: bare boolean attributes (empty string, like frameworks serialize them) count as true
- S-16: quoted comma-separated options strings parse like the client attribute parser
- S-17: custom-css, style-light and style-dark reach the shell
- S-18: non-splitted button with hideTextLabelButton drops the text span and adds the atcb-no-text class
- S-19: buttonsList sorts options alphabetically to match the client decorate-options sort

## Group Z - SSR shell hydration (test/wc-tests/r-Z-ssr-hydration.test.js)

- Z-01: the shell paints before init and is swapped for the real button without layout shift
- Z-02: hydrated DOM matches a client-only render of the same config (normalized outerHTML equality)
- Z-03: without declarative shadow DOM (innerHTML path) the element initializes client-only and drops the inert template

## Group E2 - Recurrence fast-forward (test/wc-tests/r-E2-recurrence-fastforward.test.js)

Key property: the match predicates are absolute (calendar math from the start date), so shifting the
start by k whole periods must not change the next occurrence, and remaining COUNTs shift by exactly k.

- E2-01: performance - daily recurrence starting 1980 resolves in under 50 ms (and is CURRENT, not capped)
- E2-02: phase-shift property - unbounded daily/weekly rules yield the same next occurrence from an old and a recent start
- E2-03: phase-shift property holds for monthly and yearly rules
- E2-04: COUNT consumption - remaining count from an old start equals the k-shifted recent twin
- E2-05: exhausted COUNT series lands on the final occurrence (fast-forwarded)
- E2-06: exhausted UNTIL series lands on the final occurrence before UNTIL (fast-forwarded)
- E2-07: bounded rules with BY* filters keep the exact iteration (no jump)
- E2-08: unbounded rules with BY* filters do fast-forward and stay correct

## Group AX - Automated a11y checks (test/wc-tests/r-AX-a11y.test.js)

axe-core, WCAG 2.1 A/AA tags; color-contrast excluded (theme- and user-configurable, unstable headless).

- AX-01: default trigger button has no violations
- AX-02: open dropdown list has no violations (menu pattern: role menu + menuitem entries)
- AX-03: date-style button has no violations
- AX-04: modal dialog has no violations and uses a native dialog with aria-modal + accessible name

## Clipboard fallback (in test/wc-tests/r-P-subscribe.test.js)

- P-03b: Yahoo subscribe with a failing clipboard shows the honest failure text (new modal.clipboard.failed
  key in all 26 packs) plus a readonly manual-copy input with select-on-focus

## Group SEC - Security hardening (test/wc-tests/r-SEC-security.test.js)

- SEC-01: atcb_secure_url allows the legitimate scheme set and relative urls
- SEC-02: atcb_secure_url blocks script-capable and unexpected schemes (case/whitespace evasion included) and keeps the traversal check
- SEC-03: description [url] linkifies only safe schemes and escapes attribute breakouts
- SEC-04: parsed json input cannot pollute the object prototype (unit + end-to-end through the attribute parser)
- SEC-05: rich data stays valid json when fields contain quotes and backslashes

## Group MEM - Memory-leak regression (test/wc-tests/r-MEM-leaks.test.js)

Runner launches Chrome with --js-flags=--expose-gc so the heap assertion can force collection.

- MEM-01: global document/window listeners register exactly once across many buttons
- MEM-02: every mutation observer created for bodyScheme is disconnected on unmount (instrumented MutationObserver)
- MEM-03: unmount while a modal is open removes the modal host and restores body scroll
- MEM-04: 30 mount-unmount cycles leave no DOM debris and hold the heap steady (< 2 MB growth under forced GC)

## Group ICSX - Extended ics options (test/wc-tests/r-ICSX-ics-extended.test.js)

The ics* options shape ONLY the generated ics file (Apple/iCal); all except icsExdate work per date
entry (root overrides entries, like the other date fields). icsExdate is root-only (pairs with
recurrence, which implies a single date entry).

- ICSX-01: the per-event properties emit correctly formatted ics lines (URL, CATEGORIES, CLASS uppercased, PRIORITY, GEO, ATTACH list)
- ICSX-02: icsReminder renders a display alarm (minutes number converted to -PTnM, ISO duration passthrough, description = event name)
- ICSX-03: icsGeo emits the Apple structured location only when a location exists, with a matching title (map-preview requirement)
- ICSX-04: multi-date - per-entry values land in their own events; root values override (dates contract)
- ICSX-05: icsExdate mirrors the DTSTART form (TZID + wall-clock time for timed, VALUE=DATE for allday)
- ICSX-06: invalid values fail validation loudly (class enum, priority range, geo format + range, reminder format, url schemes, exdate prerequisites + format)
- ICSX-07: guardrail - other calendar types ignore the options completely (google url byte-identical, option list untouched)
- ICSX-08: without the options, none of the new properties appear (output stability)

- M-33: modal option list stays content-sized (regression: .atcb-modal min-width:auto must beat .atcb-list min-width:100% after the split-css assembly)
- M-34: list-modal to follow-up modal reuses the same bg overlay node (no destroy/recreate); outgoing options list is dropped after the new modal builds
