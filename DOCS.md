![Add to Calendar Button](https://github.com/add2cal/add-to-calendar-button/blob/main/assets/img/readme-header.png?raw=true)

<br />

# Documentation

More details about available options and how to configure specific features.

<br /><br />

---

<br />

- The `label` is optional, but enables you to customize the button text. Default: "Add to Calendar".
- Dates need to be formatted as YYYY-MM-DD ([ISO-8601](https://en.wikipedia.org/wiki/ISO_8601)).
- You can also use the word `today` as date. It will then dynamically use the current day at click.
- Add `+5` at the end of the date to dynamically add 5 days (or any other number). `2022-01-30+12` would generate the 11th of February 2022. This can be interesting, when combined with `today`.
- Times are optional. If not set, the button generates all-day events. If set, they need to be formatted as HH:MM
- You can and should add a `timeZone` (TZ name). Find a list of them at [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
- Use "currentBrowser" as value for `timeZone` to dynamically use the time of the user's browser. Use this with caution, since it would mean that the date and time will differ per user, which should not be the usual case! (Requires all times to be set.)
- Define multi-date events by using the `dates` option, which holds an array of objects, which needs to hold the date, and time information of the sub-event. It can optionally also hold their own name, description, location, timeZone, organizer, sequence, status, UID, and availability. Mind that in this case, the name at the top level becomes the name of the event series and is still required.
- Use the `recurrence` option to define recurring events. But mind that this will deactivate the Yahoo, Microsoft365, Teams, and Outlook options, since they do not support it at the moment (users could still use iCal in this case).
  - You can use any **valid** [RRULE](https://www.rfc-editor.org/rfc/rfc5545) to define the respective rule ([click here](https://icalendar.org/rrule-tool.html) for a generator).
  - Or you define one of the following more simple rules: daily, weekly, monthly, yearly. If you go that way, you can enrich your rule with one of the following specifics:
    - `recurrence_interval` to specify the interval between iterations. "1" would be the default, while "3" would mean "every third".
    - `recurrence_until` to specify an end date. This should be the last day of the event, formatted as YYYY-MM-DD. Mind that this does not work in many applications! Rather use the count option.
    - `recurrence_count` to specify an upper limit of repetitions. If endDate and count are given, whatever comes first overrides the other. If none are given, it would repeat indefinitely.
    - `recurrence_byDay` to specify the weekdays (MO, TU, WE, TH, FR, SA, SU), where the even occurs (if, for example, it is bound to Tuesday instead of the 24th). Requires a weekly frequency. Can be enriched with a number to specify something like the 3rd Monday (3MO). Can be multiple, comma separated.
    - `recurrence_byMonthDay` to specify a numbered day (1, 2, ... 31) instead of a weekday. Requires a monthly frequency. Can be multiple, comma separated.
    - `recurrence_byMonth` to specify the months (1, 2, 3, ... 12), where the event should happen. Requires a yearly frequency. Can be multiple, comma separated.
  - Mind that the startDate needs to be valid within the given recurrence ruleset!
- Per default, the event will be marked as busy/free/available based on the user's calendar settings. For Apple, iCal, and Google, you can force this by using the setting `availability` with options "busy" or "free".
- If you want to rename a label, use the following schema at the options: optionName + Pipe + yourLabel. "Google|Google Kalender" would generate a Google Calendar option, but label it as "Google Kalender".
- There is almost no static text block. For the tiny little rest, you can define a translation by using the `language` option. Supported options and therefore languages: English (en, default), German (de), Dutch (nl), French (fr), Spanish (es), Portugese (pt), Turkish (tr), Chinese (zh), Hindi (hi), Polish (pl), Indonesian (id), Norwegian (no), Finnish (fi), Swedish (sv), Czech (cs), Japanese (ja), Italian (it), Korean (ko), Vietnamnese (vi), Arabic (ar, incl RTL).
- In case you want to customize them, you can alternatively set the option `customLabels` and provide a JSON object where the key would be the text block's identifier (lower case without spaces). See the bottom of the js file for possible text blocks. You can use HTML pseudo tags, which get transformed automatically (but not for styled labels). Suported ones: [url] (see next point), [br], [hr], [p], [strong], [u], [i], [em], [li], [ul], [ol], [h*] (like h1, h2, h3, ...).
- Formatting a URL in the description like `[url]https://....[/url]` makes it clickable. `[url]https://....|URL Text[/url]` defines a linked textblock saying "URL Text" (not supported by Apple, iCal, and Yahoo; not supporting special characters).
- You can set the `trigger` to `click`. This makes the button open on click at desktop. Otherwise, the default would be to open on hover. On touch devices, this makes no difference.
- If you want to define a specific name for any generated ics file (iCal), you can specify it via the `iCalFileName` option. The default would be "event-to-save-in-my-calendar".
- ics files are generated on the fly. However, if you want to go more stable, you can also explicitly define a self-hosted file, setting its absolute path with the `icsFile` option. Mind that the custom file name would not work in that case.
- You can use the option `"inline":true` in order to make the button appear with inline-block instead of block style.
- Change the relative size of the rendering by using the option `size` with a value between 0 and 10 (default: 6, which equals 16px font-size). You can also define up to 3 values like "8|6|4", where the first one will apply to large, the second to medium, and the third to small screens. If you provide two, it will be for large and medium+small screens.
- Use `"background":false` if you want to be the background overlay to be fully transparent.
- The default style for the options list, using the regular button, would be a dropdown. You can set the option `listStyle` to "modal" in order to force the modal version (this would also force the click trigger) or `overlay` to show the list right above the button. The default would also show the dropdown upwards, if this better fits the current viewport. You can block this behavior with the option `dropdown-static`.
- If you require line breaks within the description, use `\n` or `<br>`.
- If you set at least a name, startDate, and location, the script automatically generates schema.org rich data. Use a URL for the location and it will be labeled as online event. Set the option `"richData":"false"` to disable this feature.
- You can also define images to be set for the event's rich data. This needs to be an array. Define at least 1 image via an absolute url with at least 720px width. Recommended would be 3 images with a width of 1920px each. One with an aspect ration 1x1, one with 4x3, and one with 16x9. If not set, a default fallback image will be used.
- Each generated button and option has a speaking id to be used for any tracking methods. Scheme: "atcb-btn-_IDENTIFIER_" or "atcb-btn-_IDENTIFIER_-google" (for the Google option) respectively. The _IDENTIFIER_ will be an automatic number, but can be overridden by providing the option `"identifier":"xyz"` (no special characters allowed; needs to be unique). Using atcb_action and a custom trigger with an id, that one is used instead. Using atcb_action without a trigger, the identifier will always be "atcb-btn-custom".
- Each button comes with a dark and light mode. Set the option `lightMode` to "dark" or "light" explicitly, or use "system" to automatically adapt to the user's default setting. You can also use "bodyScheme" to look for the class "atcb-dark" at the body tag and connect the button dynamically to the style of your website.
- Optionally define an organizer for the event with the `organizer` option. Use the schema "NAME|EMAIL" (e.g. "John Doe|john.doe@gmail.com") and mind that this information will be public. Only supported by iCal at the moment.
- Theoretically, you can also use the options `uid`, `sequence`, `created`, `updated`, and `status` (TENTATIVE, CONFIRMED, CANCELLED) to override the default values and especially to manage event updates. Warning: You should only play with those settings, if you know what you are doing! This is also only supported by the iCal format (and even there not recognized by all calendars). To update an existing event, you would need to have a growing sequence number and also the organizer field (name and email) set.
- As an alternative to providing a specific predefined event, you can also host a calendar and offer it for subscription (requires a hosted service). Offering the subscription via the button, you need to provide an explicit `icsFile` and set `"subscribe":true`. "Name" and "startDate" are still required for organizational purposes, but every other event parameter can be skipped in the subscription case. For Microsoft services, the "Name" will be used as name for the calendar! Mind that this will disable the MS Teams option.
- The default layout is more or less basic. You can use different style by loading different css files: atcb-3d.min.css, atcb-flat.min.css, and atcb-text.min.css are available.

<br />
