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

- S-11: proKey fetches the server config and renders it (incl. powered-by note in ICS)
- S-12: proOverride lets local attributes win over the server config
- S-13: proxy=true routes clicks through the PRO proxy URL
- S-14: invalid proKey (404) fails silently - no render, no crash

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

- G-01: VCALENDAR structure with version + prodid
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
- G-12: hosted icsFile is downloaded directly (no inline ICS built)
- G-16: long description folds to RFC 5545 line lengths and unfolds losslessly
- G-17: custom iCalFileName is used for the download
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

- I-01: MS365 desktop compose URL with startdt/enddt/subject/location/body
- I-02: Outlook.com uses outlook.live.com with same params
- I-01b: MS365 mobile flavor uses the deeplink base
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

### Group R - PRO proKey fetch & override (`r-R-pro.test.js`)

- R-01: proKey fetches config.json and renders the server-driven button
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

