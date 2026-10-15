---
question: 'Does the Add to Calendar Button consider time zones?'
category: 'configuration'
---

Yes. Use an IANA time-zone name such as `Europe/Berlin`; the component uses its maintained [iCalendar time-zone library](https://github.com/add2cal/timezones-ical-library) to produce reliable calendar data worldwide.
