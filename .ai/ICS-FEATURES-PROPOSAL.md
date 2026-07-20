# Proposal: extended RFC 5545 support for generated ics files

> **Status: APPROVED and implemented** with one amendment: all included options except
> `icsExdate` are additionally available PER DATE ENTRY in the multi-date case (root
> values override entry values, following the established dates contract). `icsExdate`
> stays root-only, since recurrence implies a single date entry. Open questions resolved:
> single reminder value, fixed 100m geo radius, PRO keys flow via the param allowlist.

Maintainer decision document. Analyzes RFC 5545 (plus the RFC 7986 extension set) against
the current ics generator and proposes which additional properties to support.

**Guardrails (set by the maintainer, applied throughout):**

1. The new options affect ONLY the generated ics file (the `apple` and `ical` calendar
   options). Every other calendar type silently omits them: no errors, no option removal,
   generated urls stay byte-identical.
2. Second-level features: not promoted, documented exclusively under the advanced examples
   section, clearly marked "only supported with Apple/iCal".
3. Existing output stays stable: configs without the new options produce the exact same
   ics as today.

## Current coverage (no action)

Already emitted: VERSION, PRODID, CALSCALE, METHOD (derived from status/attendee),
VTIMEZONE, UID, DTSTAMP, DTSTART/DTEND, SUMMARY, DESCRIPTION + X-ALT-DESC (html), LOCATION,
ORGANIZER, ATTENDEE, RRULE, TRANSP (from `availability`), SEQUENCE, STATUS, CREATED,
LAST-MODIFIED. That covers the full "core event" property set of the spec.

## Proposed to INCLUDE (8 options)

All new attributes carry an **`ics` prefix** (`icsReminder`, kebab official `ics-reminder`,
...). The prefix makes the scoping self-documenting in every code sample - you can see at
the attribute name that it only feeds the ics file - and follows the existing `icsFile` /
`iCalFileName` naming precedent. All are root-level options applying to every VEVENT of the
file (per-date-entry overrides are a possible fast-follow, see open questions).

| # | Attribute | RFC property | Value shape | Why include (score rationale) |
| --- | --- | --- | --- | --- |
| 1 | `icsReminder` | VALARM component (ACTION:DISPLAY + TRIGGER) | Minutes before start as a number (`"15"`), or a raw ISO 8601 duration (`"-PT1H"`) for power users | The single most requested ics capability. Honored by Apple Calendar, Outlook and most clients on import (research-verified). One display alarm, description = event name |
| 2 | `icsUrl` | URL | Absolute http(s) url | Cheap, universally parsed, gives events a canonical link without abusing the description. Passes the scheme allowlist |
| 3 | `icsCategories` | CATEGORIES | Comma-separated list (`"Work,Conference"`) | Cheap, spec-clean tagging; Apple shows categories, other clients preserve them |
| 4 | `icsClass` | CLASS | Enum: `PUBLIC` / `PRIVATE` / `CONFIDENTIAL` | Trivial validation, meaningful in corporate Outlook/Apple setups |
| 5 | `icsPriority` | PRIORITY | Integer 0-9 (0 = undefined, 1 = highest) | Trivial, honored by Outlook and Apple task-ish workflows |
| 6 | `icsGeo` | GEO + X-APPLE-STRUCTURED-LOCATION | `"lat,lon"` (validated ranges) | Real value on Apple: with coordinates AND the existing `location`, Apple Calendar renders the map preview. Emission detail (research-verified): the map only appears when the structured location's X-TITLE matches LOCATION - so we derive X-TITLE from the configured location and only emit the Apple property when `location` is set (GEO alone otherwise). Radius fixed at 100 |
| 7 | `icsExdate` | EXDATE | Comma-separated dates/datetimes in the config date format | Completes the recurrence story (RRULE exists, exclusions do not). Emitted with the same TZID/format logic as DTSTART. LIMITATION to document: the date-style button's "next occurrence" display does not honor exclusions in v1 (the ics itself is correct everywhere) |
| 8 | `icsAttach` | ATTACH | Comma-separated absolute urls | Agenda PDFs, tickets. URI form only; each url passes the scheme allowlist. Inline BINARY/base64 explicitly NOT supported (file bloat, security review surface) |

**Implementation surface per option:** param lists in `core/globals.ts` (+ typed sub-lists),
`ATCBInputConfig`/`ATCBConfig` + public types, validation in `core/validate.ts` (enum/range/
format/url checks with debug-mode errors), normalization in `core/decorate.ts` (trim, split
lists, coerce numbers), emission as one compact block in `generators/ical.ts` (VALARM right
before END:VEVENT). Values flow through `atcb_rewrite_ical_text` escaping; urls through
`atcb_secure_url`. Estimated total: ~150 lines of source + tests + docs.

**Guardrail mechanics:** the other generators (google, outlook, msteams, yahoo) never read
these config keys - ignoring them is structural, not filtered. A dedicated test pins it:
identical service urls and identical option lists with and without every `ics*` option set.
The options are also inert (documented) when `icsFile` points at a hosted file or
`subscribe` is active, since no ics is generated client-side in those flows.

## Proposed to EXCLUDE (with reasons)

| Property | Reason |
| --- | --- |
| COLOR, IMAGE, CONFERENCE (RFC 7986) | Research-verified: Apple and Google ignore all three on ics import. CONFERENCE's use case (meeting link) is already served by `location` with an url / `onlineEvent` handling |
| NAME, SOURCE, REFRESH-INTERVAL, X-WR-* (calendar level) | Only meaningful for SUBSCRIBED feeds; our subscribe flow uses an externally hosted ics (`icsFile`), never a generated one - nothing to attach them to |
| DURATION | Redundant: DTEND is always computed; two competing end representations invite client bugs |
| RDATE | Additive extra occurrences are already expressible with the multi-date `dates` array; low client support for RDATE+RRULE combinations |
| RECURRENCE-ID | Only meaningful in update workflows for single occurrences of a series - requires a scheduling relationship the button does not have |
| RELATED-TO | Needs a UID graph across events; niche without an event-series product |
| COMMENT, CONTACT, RESOURCES | Barely rendered by any client; DESCRIPTION covers the practical use |
| REQUEST-STATUS, FREEBUSY, PERCENT-COMPLETE, DUE | Wrong component/workflow (scheduling replies, VFREEBUSY, VTODO) |
| VALARM beyond one DISPLAY alarm (AUDIO/EMAIL actions, REPEAT/DURATION snoozing, absolute triggers) | Complexity and client inconsistency outrun the value; the single relative display alarm covers the request behind the feature. Multiple reminders = fast-follow if demanded |
| ATTACH with inline BINARY | File size explosion and a new security review surface for no practical gain over urls |

## Documentation approach

- ONE new section under the demo's advanced examples (en + de), titled around "Power up the
  ics file", opening with the marker: "These options only affect the generated ics file -
  they apply to the Apple and iCal options; all other calendar types simply ignore them."
- A compact attribute table inside that section.
- One live example combining `icsReminder`, `icsUrl`, `icsCategories`, `icsGeo`.
- Release notes / CHANGELOG: one bullet.

> Amendment (maintainer request, post-implementation): the options ALSO get a dedicated
> "ICS file options (Apple/iCal only)" subsection in the demo's configuration reference
> (its own table + side-nav entry + search index entries), clearly marked as Apple/iCal-only
> and cross-linked to the advanced example. The original "not in the config reference"
> guardrail is superseded; they remain second-level (own section, explicit scoping marker),
> just discoverable from the config page too.

## Test approach

New reduced-suite group (ics-extended): one ICS parse assertion per property via the
existing ICS test helpers (correct property line, escaping, TZID handling for EXDATE,
VALARM block shape, structured-location/LOCATION match), validation rejection cases
(bad enum, out-of-range priority, malformed geo, blocked url schemes), the guardrail case
(service urls + option list unchanged), and the byte-stability case (ics without new
options unchanged). Plus TEST-CASES.md entries.

## Open questions for the maintainer

1. Per-date-entry support (different reminder/url per sub-event) - v1 proposes root-level
   only; fast-follow on demand?
2. `icsReminder` as a single value - or should v1 already accept a comma list for multiple
   alarms?
3. `icsGeo` radius - fixed 100m or expose `icsGeoRadius`? (proposal: fixed, no extra knob)
4. Should the PRO config schema get the same keys immediately (param allowlist addition is
   automatic once they are in `atcbWcParams`) - any PRO backend coordination needed?
