import { tzlib_get_offset, tzlib_get_timezones } from 'timezones-ical-library';
import { atcbIsiOS, atcbIsAndroid, atcbIsMobile, atcbIsBrowser, atcbValidRecurrOptions, atcbInvalidSubscribeOptions, atcbIOSInvalidOptions, atcbAndroidInvalidOptions, atcbWcBooleanParams } from './atcb-globals';
import { atcb_translate_via_time_zone, atcb_format_datetime, atcb_rewrite_html_elements, atcb_generate_uuid, atcb_apply_transformation, atcb_getNextOccurrence, atcb_map_special_time_zones, atcb_parseRRule } from './atcb-util';
import { availableLanguages, rtlLanguages } from './atcb-i18n';
import { atcb_check_bookings } from './atcb-generate-pro';
import type { ATCBConfig, ATCBInputConfig, ATCBDateEntry } from './types';

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
async function atcb_decorate_data(data: ATCBConfig | ATCBInputConfig): Promise<ATCBConfig> {
  let cfg = data as ATCBConfig;
  cfg = atcb_decorate_data_boolean(cfg);
  cfg = atcb_decorate_data_defaults(cfg);
  cfg = atcb_decorate_data_options(cfg);
  cfg = atcb_decorate_data_style(cfg);
  cfg.sizes = atcb_decorate_sizes(cfg.size as string | undefined);
  cfg.lightMode = atcb_decorate_light_mode(cfg.lightMode);
  cfg = atcb_decorate_data_i18n(cfg);
  cfg = atcb_decorate_data_dates(cfg);
  cfg = await atcb_decorate_data_rsvp(cfg);
  return cfg;
}

// setting boolean parameters right, since they can be provided or not
function atcb_decorate_data_boolean(data: ATCBConfig): ATCBConfig {
  for (let i = 0; i < atcbWcBooleanParams.length; i++) {
    const attr = atcbWcBooleanParams[`${i}`]! as string;
    if (data[`${attr}`]) {
      // only do something if not already a boolean
      if (typeof data[`${attr}`] !== 'boolean') {
        const val = (data[`${attr}`] as unknown as { toString(): string }).toString().trim().toLowerCase() || '';
        data[`${attr}`] = val === '' || val === 'true' ? true : false;
      }
    } else {
      data[`${attr}`] = false;
    }
  }
  return data;
}

function atcb_set_date_defaults(dateEntry: ATCBDateEntry | ATCBConfig): void {
  // set time zone
  if (!dateEntry.timeZone || dateEntry.timeZone === '') {
    dateEntry.timeZone = 'GMT';
  }
  // set default status
  if (!dateEntry.status || dateEntry.status === '') {
    dateEntry.status = 'CONFIRMED';
  }
  // set default sequence
  if (!dateEntry.sequence || dateEntry.sequence === '') {
    dateEntry.sequence = 0;
  } else {
    dateEntry.sequence = parseInt(dateEntry.sequence as string);
    if (isNaN(dateEntry.sequence) || dateEntry.sequence < 0) {
      dateEntry.sequence = 0;
    }
  }
}

function atcb_decorate_data_defaults(data: ATCBConfig): ATCBConfig {
  if (data.dates) {
    for (let i = 0; i < data.dates.length; i++) {
      atcb_set_date_defaults(data.dates[`${i}`]!);
    }
  } else {
    atcb_set_date_defaults(data);
  }
  // set language if not set
  if (!data.language || data.language === '' || !availableLanguages.includes(data.language)) {
    data.language = 'en';
  }
  return data;
}

// format RRULE
function atcb_decorate_data_rrule(data: ATCBConfig): ATCBConfig {
  // remove spaces and force upper case
  data.recurrence = data.recurrence!.replace(/\s+/g, '').toUpperCase();
  // if RRULE is set, we parse date from it
  if (/^RRULE:/i.test(data.recurrence)) {
    data.recurrence_simplified = false;
    const rruleParts = atcb_parseRRule(data.recurrence, false);
    data.recurrence_until = rruleParts.UNTIL as string | undefined;
    data.recurrence_count = rruleParts.COUNT as number | undefined;
    data.recurrence_byDay = rruleParts.BYDAY as string | undefined;
    data.recurrence_byMonth = rruleParts.BYMONTH as string | undefined;
    data.recurrence_byMonthDay = rruleParts.BYMONTHDAY as string | undefined;
    data.recurrence_interval = rruleParts.INTERVAL as number | undefined;
    data.recurrence_frequency = rruleParts.FREQ as string | undefined;
  } else {
    // otherwise, we create an RRULE from the easy rules
    data.recurrence_simplified = true;
    // set interval if not given
    if (!data.recurrence_interval || data.recurrence_interval === '') {
      data.recurrence_interval = 1;
    }
    // set weekstart if not given
    if (!data.recurrence_weekstart || Number(data.recurrence_weekstart === '') | Number(data.recurrence_weekstart.length > 2)) {
      data.recurrence_weekstart = 'MO';
    }
    // save frequency before overriding the main recurrence data
    data.recurrence_frequency = data.recurrence;
    // generate the RRULE from easy rules
    data.recurrence = 'RRULE:FREQ=' + data.recurrence + ';WKST=' + data.recurrence_weekstart + ';INTERVAL=' + data.recurrence_interval;
    if (data.recurrence_until && data.recurrence_until !== '') {
      data.recurrence_until = data.recurrence_until.replace(/[-:]/g, '');
      // if only date, add time
      if (data.recurrence_until.length < 9) {
        data.recurrence_until += 'T235959Z';
      }
      data.recurrence = data.recurrence + ';UNTIL=' + data.recurrence_until;
    }
    if (data.recurrence_count && data.recurrence_count !== '') {
      data.recurrence = data.recurrence + ';COUNT=' + data.recurrence_count;
    }
    if (data.recurrence_byDay && data.recurrence_byDay !== '') {
      data.recurrence = data.recurrence + ';BYDAY=' + data.recurrence_byDay;
    }
    if (data.recurrence_byMonth && data.recurrence_byMonth !== '') {
      data.recurrence = data.recurrence + ';BYMONTH=' + data.recurrence_byMonth;
    }
    if (data.recurrence_byMonthDay && data.recurrence_byMonthDay !== '') {
      data.recurrence = data.recurrence + ';BYMONTHDAY=' + data.recurrence_byMonthDay;
    }
  }
  return data;
}

// Adjust recurring events for next data
function atcb_decorate_data_recurring_events(data: ATCBConfig): ATCBConfig {
  const startDate = data.dates![0]!.startDate;
  const startTime = data.dates![0]!.startTime;
  const endDate = data.dates![0]!.endDate || startDate;
  const endTime = data.dates![0]!.endTime || '';
  const tzid = data.dates![0]!.timeZone || 'UTC';
  const diff =
    (function () {
      if (endTime && endTime !== '' && startTime && startTime !== '') {
        const origStart = startTime && startTime !== '' ? new Date(`${startDate}T${startTime}:00${toIsoOffset(tzlib_get_offset(tzid, startDate!, startTime))}`) : new Date(`${startDate}T00:00:00${toIsoOffset(tzlib_get_offset(tzid, startDate!, '00:00'))}`);
        const origEnd = endTime && endTime !== '' ? new Date(`${endDate}T${endTime}:00${toIsoOffset(tzlib_get_offset(tzid, endDate!, endTime))}`) : new Date(`${endDate}T00:00:00${toIsoOffset(tzlib_get_offset(tzid, endDate!, '00:00'))}`);
        return origEnd.getTime() - origStart.getTime();
      }
      return;
    })() || 0;

  // Helper: normalize offsets into ISO form ±HH:MM (or 'Z')
  function toIsoOffset(off: string | undefined): string {
    if (!off || off === 'Z' || off === '+0000' || off === '-0000' || off === '+00:00' || off === '-00:00') return 'Z';
    const raw = String(off).replace(/^GMT/i, '');
    if (/^[+-]\d{2}:\d{2}$/.test(raw)) return raw;
    if (/^[+-]\d{4}$/.test(raw)) return `${raw.slice(0, 3)}:${raw.slice(3)}`;
    // Fallback: try to extract sign and digits
    const sign = raw.startsWith('-') ? '-' : '+';
    const digits = raw.replace(/\D/g, '').padStart(4, '0').slice(0, 4);
    return `${sign}${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  const offset = startTime && startTime !== '' ? tzlib_get_offset(tzid, startDate!, startTime) : '';
  const startDateTime = (function () {
    if (startTime && startTime !== '') {
      const isoOff = toIsoOffset(offset);
      return new Date(`${startDate}T${startTime}:00${isoOff}`);
    }
    const localMidnightOffset = toIsoOffset(tzlib_get_offset(tzid, startDate!, '00:00'));
    return new Date(`${startDate}T00:00:00${localMidnightOffset}`);
  })();

  const isAllDay = !(startTime && startTime !== '');
  const occurenceData = atcb_getNextOccurrence(data.recurrence!, startDateTime, diff, isAllDay, tzid);
  if (!occurenceData || !occurenceData.nextOccurrence) {
    return data;
  }

  // format Date in specific tz; guard invalid dates for Safari
  function formatInTz(dateObj: Date, timeZone: string, includeTime: boolean): { date: string; time: string } {
    if (!(dateObj instanceof Date) || !isFinite(dateObj.getTime())) {
      return { date: '', time: '' };
    }
    try {
      const opts = includeTime ? { timeZone, hour12: false, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } : { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
      const parts = new Intl.DateTimeFormat('en-CA', opts as Intl.DateTimeFormatOptions).formatToParts(dateObj);
      const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
      return { date: `${get('year')}-${get('month')}-${get('day')}`, time: includeTime ? `${get('hour')}:${get('minute')}` : '' };
    } catch {
      return { date: '', time: '' };
    }
  }

  const nextLocalDate = formatInTz(occurenceData.nextOccurrence, tzid, false).date;

  if (nextLocalDate) {
    data.startDate = nextLocalDate;
    if (startTime) data.startTime = startTime; // This project intentionally does not support BYHOUR (or other sub-daily expansion rules), so we keep the original wall-clock time.
  } else {
    // If formatting failed, keep original dates to avoid Safari crash
    return data;
  }

  const newStartInstant = startTime ? new Date(`${data.startDate}T${startTime}:00${toIsoOffset(tzlib_get_offset(tzid, data.startDate, startTime))}`) : new Date(`${data.startDate}T00:00:00${toIsoOffset(tzlib_get_offset(tzid, data.startDate, '00:00'))}`);

  const newEndDateTime = new Date(newStartInstant.getTime() + diff);
  const nextEndLocal = formatInTz(newEndDateTime, tzid, !!(endTime && endTime !== ''));
  if (nextEndLocal.date) {
    data.endDate = nextEndLocal.date;
    if (endTime && endTime !== '') data.endTime = nextEndLocal.time;
  }

  // set count (if given)
  if ((data.recurrence_count && data.recurrence_count !== '') || (data.recurrence_until && data.recurrence_until !== '')) {
    if (occurenceData.adjustedCount < 2) {
      data.recurrence = '';
      data.recurrence_frequency = '';
      data.recurrence_interval = '';
    } else {
      data.recurrence_count = occurenceData.adjustedCount;
      data.recurrence = data.recurrence!.replace(/;?COUNT=\d+/i, ';COUNT=' + data.recurrence_count);
      if (data.recurrence_until && data.recurrence_until !== '') {
        data.recurrence_until = '';
        data.recurrence = data.recurrence.replace(/;?UNTIL=\w+/i, ';COUNT=' + data.recurrence_count);
        if (data.dates && data.dates[0]!.recurrence) {
          data.dates[0]!.recurrence = (data.dates[0]!.recurrence as string).replace(/;?UNTIL=\w+/i, ';COUNT=' + data.recurrence_count);
        }
      }
    }
  }
  return data;
}

// cleanup options, standardizing names, and check for mobile special rules
function atcb_decorate_data_options(data: ATCBConfig): ATCBConfig {
  const { options, source } = atcb_determine_options_source(data);
  const processedOptions = atcb_process_options(options, data);
  let newOptions = processedOptions.newOptions;
  let iCalGiven = processedOptions.iCalGiven;
  const appleGiven = processedOptions.appleGiven;
  newOptions = atcb_handle_special_google_calendar_case(data, newOptions);
  ({ newOptions, iCalGiven } = atcb_ensure_fallback_options(newOptions, iCalGiven));
  const normalizedSourceOptions = options.map((option) => atcb_normalize_option_name(option));
  const mobileOptionsUsedWithIcs = source !== 'general' && (normalizedSourceOptions.includes('ical') || normalizedSourceOptions.includes('apple'));
  newOptions = atcb_adjust_platform_specific_options(newOptions, data, iCalGiven, appleGiven, mobileOptionsUsedWithIcs);
  // sort options alphabetically and update data
  newOptions.sort();
  data.options = newOptions;
  return data;
}

// determine which options array to use based on platform and availability
function atcb_determine_options_source(data: ATCBConfig): { options: string[]; source: string } {
  let source = 'general';
  let options = data.options || ['ical'];
  if (atcbIsiOS() || data.fakeIOS) {
    // the more specific optionsIOS wins over optionsMobile; the latter only serves as fallback
    if (data.optionsIOS && data.optionsIOS.length > 0) {
      source = 'ios';
      options = data.optionsIOS;
    } else if (data.optionsMobile && data.optionsMobile.length > 0) {
      source = 'mobile';
      options = data.optionsMobile;
    }
  } else if ((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && data.optionsMobile && data.optionsMobile.length > 0) {
    source = 'mobile';
    options = data.optionsMobile;
  }
  return { options, source };
}

// process options array and filter invalid options
function atcb_process_options(theOptions: string[], data: ATCBConfig): { newOptions: string[]; iCalGiven: boolean; appleGiven: boolean } {
  const newOptions: string[] = [];
  let iCalGiven = false;
  let appleGiven = false;
  for (let i = 0; i < theOptions.length; i++) {
    const optionName = atcb_normalize_option_name(theOptions[`${i}`]!);
    // track which ical-type options were provided
    if (optionName === 'apple') appleGiven = true;
    if (optionName === 'ical') iCalGiven = true;
    // skip invalid options based on various criteria
    if (atcb_should_skip_option(optionName, data)) {
      continue;
    }
    newOptions.push(optionName);
  }
  return { newOptions, iCalGiven, appleGiven };
}

// normalize option name (clean and standardize)
function atcb_normalize_option_name(option: string): string {
  const cleanOption = option.split('|');
  return cleanOption[0]!.toLowerCase().replace('microsoft', 'ms').replace(/\./, '');
}

// determine if an option should be skipped based on platform and context
function atcb_should_skip_option(optionName: string, data: ATCBConfig): boolean {
  return atcb_is_platform_invalid_option(optionName, data) || atcb_is_recurrence_invalid_option(optionName, data) || atcb_is_subscription_invalid_option(optionName, data) || atcb_is_microsoft_mobile_subscription_case(optionName, data);
}

// check if option is invalid for current platform
function atcb_is_platform_invalid_option(optionName: string, data: ATCBConfig): boolean {
  const isIOSWithInvalidOption = !!((atcbIsiOS() || data.fakeIOS) && atcbIOSInvalidOptions.includes(optionName) && (!data.optionsIOS || data.optionsIOS.length === 0) && (!data.optionsMobile || data.optionsMobile.length === 0));
  const isAndroidWithInvalidOption = !!((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && atcbAndroidInvalidOptions.includes(optionName) && (!data.optionsMobile || data.optionsMobile.length === 0));
  return isIOSWithInvalidOption || isAndroidWithInvalidOption;
}

// check if option is invalid for recurrence events
function atcb_is_recurrence_invalid_option(optionName: string, data: ATCBConfig): boolean {
  if (!data.recurrence || data.recurrence === '') return false;
  const isInvalidForRecurrence = !atcbValidRecurrOptions.includes(optionName);
  const isGoogleOnIOS = !!((atcbIsiOS() || data.fakeIOS) && optionName === 'google');
  return isInvalidForRecurrence || isGoogleOnIOS;
}

// check if option is invalid for subscription events
function atcb_is_subscription_invalid_option(optionName: string, data: ATCBConfig): boolean {
  return !!(data.subscribe && atcbInvalidSubscribeOptions.includes(optionName));
}

// tmp patch to reflect the fact that Microsoft is routing mobile traffic differently. We handle regular events on the link level, but subscription cases need to be stripped out
// TODO: remove this, when Microsoft has fixed this
function atcb_is_microsoft_mobile_subscription_case(optionName: string, data: ATCBConfig): boolean {
  return !!((atcbIsMobile() || data.fakeMobile) && data.subscribe && (optionName === 'ms365' || optionName === 'outlookcom'));
}

// if we are in a subscription case and the icsFile starts with https://calendar.google.com/calendar/ and does not end with .ics, we only set the google option as everything else would not work
function atcb_handle_special_google_calendar_case(data: ATCBConfig, newOptions: string[]): string[] {
  if (data.subscribe && data.icsFile && data.icsFile.startsWith('https://calendar.google.com/calendar/') && !data.icsFile.endsWith('.ics')) {
    return ['google'];
  }
  return newOptions;
}

// since the above can lead to excluding all options, we add the iCal option as default, if no other option is left
function atcb_ensure_fallback_options(newOptions: string[], iCalGiven: boolean): { newOptions: string[]; iCalGiven: boolean } {
  if (newOptions.length === 0) {
    newOptions.push('ical');
    iCalGiven = true;
  }
  return { newOptions, iCalGiven };
}

// adjust options based on platform-specific requirements
function atcb_adjust_platform_specific_options(options: string[], data: ATCBConfig, iCalGiven: boolean, appleGiven: boolean, mobileOptionsUsed: boolean = false): string[] {
  // generally, only adjust if not intentionally specified via mobile options
  if (!mobileOptionsUsed) {
    // for iOS, force Apple option if iCal was given but Apple wasn't
    if ((atcbIsiOS() || data.fakeIOS) && iCalGiven && !appleGiven) {
      options.push('apple');
      // drop iCal option, since it does not make sense on iOS (as the apple option covers it)
      options = options.filter((option) => option !== 'ical');
    }
    // for Android, force iCal option if Apple was given but iCal wasn't
    else if ((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && appleGiven && !iCalGiven) {
      options.push('ical');
      // drop Apple option, since it does not make sense on Android
      options = options.filter((option) => option !== 'apple');
    }
  }
  return options;
}

function atcb_decorate_data_style(data: ATCBConfig): ATCBConfig {
  // set inline if inlineRSVP
  if (data.inlineRSVP) {
    data.inline = true;
  }
  // set default listStyle
  if (!data.listStyle || data.listStyle === '') {
    data.listStyle = 'dropdown';
  }
  // force click trigger on modal style
  if (data.listStyle === 'modal') {
    data.trigger = 'click';
  }
  // set button style and force click on styles, where the dropdown is not attached to the button
  if (data.buttonStyle && data.buttonStyle !== '' && data.buttonStyle != 'default') {
    if (data.buttonStyle == 'simple' || data.buttonStyle == 'round' || data.buttonStyle == 'text' || data.buttonStyle == 'date' || data.buttonStyle == 'neumorphism') {
      data.trigger = 'click';
    }
  } else {
    data.buttonStyle = 'default';
  }
  // force overlay when the button label is ommited, but the list labels are not (which would make the list need to be way larger than the button) - at dropdown cases
  if ((data.buttonStyle == 'default' || data.buttonStyle == '3d' || data.buttonStyle == 'flat') && !data.hideTextLabelList && data.hideTextLabelButton && (data.listStyle == 'dropdown' || data.listStyle == 'dropdown-static' || data.listStyle == 'dropup-static')) {
    data.listStyle = 'overlay';
  }
  // force buttonsList false on date style button
  if (data.buttonsList && data.buttonStyle == 'date') {
    data.buttonsList = false;
  }
  // return result
  return data;
}

// prepare sizes
function atcb_decorate_sizes(size?: string): { [key: string]: number | string } {
  const sizes: { [key: string]: number | string } = [] as unknown as { [key: string]: number | string };
  sizes['l'] = sizes['m'] = sizes['s'] = 16;
  if (size && size !== '') {
    const sizeParts: (string | number)[] = size.split('|');
    for (let i = 0; i < sizeParts.length; i++) {
      sizeParts[`${i}`] = parseInt(sizeParts[`${i}`] as string);
    }
    if ((sizeParts[0] as number) >= 0 && (sizeParts[0] as number) < 11) {
      sizes['l'] = sizes['m'] = sizes['s'] = 10 + (sizeParts[0] as number);
    }
    if (sizeParts.length > 2) {
      if ((sizeParts[1] as number) >= 0 && (sizeParts[1] as number) < 11) {
        sizes['m'] = 10 + (sizeParts[1] as number);
      }
      if ((sizeParts[2] as number) >= 0 && (sizeParts[2] as number) < 11) {
        sizes['s'] = 10 + (sizeParts[2] as number);
      }
    } else if (sizeParts.length == 2) {
      if ((sizeParts[1] as number) >= 0 && (sizeParts[1] as number) < 11) {
        sizes['m'] = sizes['s'] = 10 + (sizeParts[1] as number);
      }
    }
  }
  return sizes;
}

// determine dark mode
function atcb_decorate_light_mode(lightMode: string = ''): string {
  if (lightMode == 'system' && atcbIsBrowser()) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  if (lightMode != 'bodyScheme' && lightMode != 'dark') {
    return 'light';
  }
  return lightMode;
}

function atcb_decorate_data_i18n(data: ATCBConfig): ATCBConfig {
  // reduce language identifier, if long version is used
  if (data.language!.length > 2) {
    data.language = data.language!.substring(0, 2);
  }
  // set right-to-left for relevant languages
  if (rtlLanguages.includes(data.language!)) {
    data.rtl = true;
  } else {
    data.rtl = false;
  }
  return data;
}

// optimize date and time information
function atcb_decorate_data_dates(data: ATCBConfig | ATCBInputConfig): ATCBConfig {
  // if there is no dates array, we create one with the name of the event (will be filled further afterwards)
  if (!data.dates || !Array.isArray(data.dates)) {
    data.dates = [{ name: data.name }];
  }
  let cfg = data as ATCBConfig;
  // recurring event adjustments need cleaned dates first; clean the first date once before recurrence shifting
  if (cfg.recurrence && cfg.recurrence !== '') {
    cfg = atcb_decorate_data_rrule(cfg);
    cfg = atcb_move_root_values_into_dates(cfg, 0);
    cfg = atcb_dates_cleanup(cfg, 0);
    cfg = atcb_decorate_data_recurring_events(cfg);
  }
  // we copy recurrence from root, but just for easier access and only for the first array element. Multi-date events cannot be recurrent
  if (cfg.recurrence && cfg.recurrence !== '') {
    cfg.dates![0]!.recurrence = cfg.recurrence;
  }
  // process each date entry and decorate it
  for (let i = 0; i < cfg.dates!.length; i++) {
    cfg = atcb_move_root_values_into_dates(cfg, i);
    cfg = atcb_dates_cleanup(cfg, i);
    cfg = atcb_generate_unique_uid(cfg, i);
    cfg = atcb_transform_strings(cfg, i);
    cfg = atcb_decorate_data_description(cfg, i);
    cfg = atcb_replace_custom_variables(cfg, i);
    cfg = atcb_set_online_event_flag(cfg, i);
  }
  // check for past events
  cfg = atcb_decorate_data_button_status_handling(cfg);
  // calculate current time
  const now = new Date();
  // set created date
  if (!cfg.created || cfg.created === '') {
    cfg.created = atcb_format_datetime(now, 'clean', true);
  }
  // set updated date
  if (!cfg.updated || cfg.updated === '') {
    cfg.updated = atcb_format_datetime(now, 'clean', true);
  }
  // last but not least, we sort any subEvent by start date ascending
  if (cfg.dates!.length > 1) {
    cfg.dates!.sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
  }
  return cfg;
}

// override the dates information with values on the root level
function atcb_move_root_values_into_dates(data: ATCBConfig, i: number): ATCBConfig {
  const dateEntry = data.dates![`${i}`]!;
  const properties = ['description', 'startDate', 'startTime', 'endDate', 'endTime', 'timeZone', 'useUserTZ', 'location', 'status', 'sequence', 'availability', 'organizer', 'attendee'];
  // do it for name only if data.dates is not >1 as in this case, name would be used for the event series title
  if (data.dates!.length === 1) {
    properties.unshift('name');
  }
  properties.forEach((prop) => {
    // only override if value is given on root level (mind sequence, where 0 is a valid value)
    if ((data[`${prop}`] && data[`${prop}`] !== '') || (prop === 'sequence' && data[`${prop}`] === 0)) {
      dateEntry[`${prop}`] = data[`${prop}`];
    }
  });
  // TODO: delete root values and only use the dates object from here on (except for "name")
  return data;
}

// cleanup different date-time formats
function atcb_dates_cleanup(data: ATCBConfig, i: number): ATCBConfig {
  const dateEntry = data.dates![`${i}`]!;
  const cleanedUpDates = atcb_date_cleanup(dateEntry);
  dateEntry.startDate = cleanedUpDates.startDate;
  dateEntry.endDate = cleanedUpDates.endDate;
  dateEntry.startTime = cleanedUpDates.startTime;
  dateEntry.endTime = cleanedUpDates.endTime;
  dateEntry.timeZone = cleanedUpDates.timeZone;
  // calculating more special meta information
  dateEntry.timestamp = atcb_date_specials_calculation('timestamp', dateEntry.startDate, dateEntry.startTime, dateEntry.timeZone);
  dateEntry.overdue = atcb_date_specials_calculation('overdue', dateEntry.endDate, dateEntry.endTime, dateEntry.timeZone) as boolean;
  return data;
}

// generate unique UID for date entry
function atcb_generate_unique_uid(data: ATCBConfig, i: number): ATCBConfig {
  const dateEntry = data.dates![`${i}`]!;
  if (!dateEntry.uid) {
    if (i === 0 && data.uid && data.uid !== '') {
      // first entry gets the base UID
      dateEntry.uid = data.uid;
    } else if (data.uid && data.uid !== '') {
      // subsequent entries get incremented UID
      dateEntry.uid = `${data.uid}-${i + 1}`;
    } else {
      // no global UID, generate new one
      dateEntry.uid = atcb_generate_uuid();
    }
  }
  return data;
}

// transform strings
function atcb_transform_strings(data: ATCBConfig, i: number): ATCBConfig {
  const dateEntry = data.dates![`${i}`]!;
  dateEntry.status = atcb_apply_transformation(dateEntry.status, 'upper') as string | undefined;
  dateEntry.availability = atcb_apply_transformation(dateEntry.availability, 'lower');
  return data;
}

// clean up the description and create copies for different formats
function atcb_decorate_data_description(data: ATCBConfig, i: number): ATCBConfig {
  const cleanDescription = (desc: string) => desc.replace(/(\\r\\n|\\n|\\r|<br(\s*\/?)>)/g, '');
  let description = data.dates![`${i}`]!.description;
  if (description) {
    // remove any "wrong" line breaks
    description = cleanDescription(description);
    // store a clean description copy without the URL magic for Yahoo, MS Teams, ...
    const descriptionHtmlFree = atcb_rewrite_html_elements(description, true);
    // ... and iCal
    const descriptionHtmlFreeICal = atcb_rewrite_html_elements(description, true, true);
    // ...and transform pseudo elements for the regular one
    description = atcb_rewrite_html_elements(description);
    data.dates![`${i}`] = { ...data.dates![`${i}`], description, descriptionHtmlFree, descriptionHtmlFreeICal };
  } else {
    data.dates![`${i}`]!.descriptionHtmlFree = data.dates![`${i}`]!.descriptionHtmlFreeICal = data.dates![`${i}`]!.description = '';
  }
  return data;
}

// set online event flag based on location URL
function atcb_set_online_event_flag(data: ATCBConfig, i: number): ATCBConfig {
  const dateEntry = data.dates![`${i}`]!;
  if (dateEntry.location && (dateEntry.location as string).startsWith('http')) {
    dateEntry.onlineEvent = true;
  } else {
    dateEntry.onlineEvent = false;
  }
  return data;
}

// replace custom variable placeholders in name and location
function atcb_replace_custom_variables(data: ATCBConfig, i: number): ATCBConfig {
  if (!data.customVar) return data;
  const dateEntry = data.dates![`${i}`]!;
  for (const key in data.customVar) {
    const value = data.customVar[`${key}`];
    dateEntry.name = atcb_replace_placeholder(dateEntry.name as string | undefined, key, value);
    dateEntry.location = atcb_replace_placeholder(dateEntry.location as string | undefined, key, value);
    dateEntry.description = atcb_replace_placeholder(dateEntry.description as string | undefined, key, value);
  }
  return data;
}

// replace placeholder in text with value
function atcb_replace_placeholder(text: string | undefined, key: string, value: unknown): string | undefined {
  const placeholder = '%%' + key.replace(/[^\w\-.]/g, '') + '%%';
  if (!text) return text;
  // eslint-disable-next-line security/detect-non-literal-regexp
  return text.replace(new RegExp(placeholder, 'gi'), value as string);
}

// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_cleanup(dateTimeData: ATCBDateEntry): ATCBDateEntry {
  // Utility function to validate date format
  function isValidDateFormat(dateStr: unknown): boolean {
    return /^\d\d\d\d-\d\d-\d\d(?:T\d\d:\d\d)?(?::\d\d)?(?:.\d\d\d)?Z?(?:\+(?:\d|\d\d|\d\d\d|\d\d\d\d))?$/i.test(dateStr as string);
  }
  // Utility function to validate 'today' format
  function isValidTodayFormat(dateStr: unknown): boolean {
    return /^today(?:\+(?:\d|\d\d|\d\d\d|\d\d\d\d))?$/i.test(dateStr as string);
  }
  // set endDate = startDate, if not provided
  if (!dateTimeData.endDate || dateTimeData.endDate === '') {
    dateTimeData.endDate = dateTimeData.startDate;
  }
  // parse date+time format (unofficial alternatives to the main implementation); also calculate any dynamic dates
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    const dateStr = dateTimeData[`${point}Date`] as string;
    // validate first (we set some text instead, so the later validation picks it up as an error)
    if (!isValidDateFormat(dateStr) && !isValidTodayFormat(dateStr)) {
      dateTimeData[`${point}Date`] = 'badly-formed';
    } else {
      // dynamic date replacement (if dateStr includes a + or is today format)
      if (/\+/.test(dateStr) || isValidTodayFormat(dateStr)) dateTimeData[`${point}Date`] = atcb_date_calculation(dateStr);
      // second, if valid, clean up
      if (dateTimeData[`${point}Date`]) {
        // identify a possible time information within the date string
        const tmpSplitStartDate = (dateTimeData[`${point}Date`] as string).split('T');
        if (tmpSplitStartDate[1]) {
          dateTimeData[`${point}Date`] = tmpSplitStartDate[0];
          dateTimeData[`${point}Time`] = tmpSplitStartDate[1];
        }
      }
      // remove any seconds and more from time information
      if (dateTimeData[`${point}Time`] && (dateTimeData[`${point}Time`] as string).length > 5) {
        dateTimeData[`${point}Time`] = (dateTimeData[`${point}Time`] as string).substring(0, 5);
      }
    }
  });
  // update time zone, if special case set to go for the user's browser
  if (dateTimeData.timeZone === 'currentBrowser' || dateTimeData.useUserTZ) {
    let browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'GMT';
    const validTimeZones = tzlib_get_timezones() as string[];
    if (!validTimeZones.includes(browserTimezone)) {
      browserTimezone = atcb_map_special_time_zones(browserTimezone); // manual mapping of special cases
    }
    // for the useUserTZ, we also recalculate the start and end date (and time) to the user's time zone based on the given time zone
    if (dateTimeData.useUserTZ && dateTimeData.startTime && dateTimeData.startTime !== '' && dateTimeData.endTime && dateTimeData.endTime !== '') {
      const newStartDateTime = atcb_translate_via_time_zone(dateTimeData.startDate!, dateTimeData.startTime, dateTimeData.timeZone!, browserTimezone);
      const newEndDateTime = atcb_translate_via_time_zone(dateTimeData.endDate!, dateTimeData.endTime, dateTimeData.timeZone!, browserTimezone);
      dateTimeData.startDate = newStartDateTime[0];
      dateTimeData.startTime = newStartDateTime[1];
      dateTimeData.endDate = newEndDateTime[0];
      dateTimeData.endTime = newEndDateTime[1];
    }
    // in both cases, the time zone is set to the user's time zone
    dateTimeData.timeZone = browserTimezone;
  }
  return dateTimeData;
}

function atcb_date_specials_calculation(type: string, dateString: string | undefined, timeString: string | undefined | null = null, timeZone: string | undefined): number | boolean {
  try {
    const tmpDate = (function () {
      if (timeString) {
        const offsetEnd = tzlib_get_offset(timeZone as string, dateString as string, timeString);
        return new Date(dateString + ' ' + timeString + ':00 GMT' + offsetEnd);
      }
      return new Date(dateString as string);
    })();
    if (type === 'timestamp') {
      // create timestamps (for sorting and rrule calculations)
      return tmpDate.getTime();
    }
    // determine whether a date is overdue or not
    if (!timeString) {
      tmpDate.setDate(tmpDate.getDate() + 1);
    }
    const currentUtcDate = new Date().toISOString();
    return tmpDate.getTime() < new Date(currentUtcDate).getTime();
  } catch {
    // we will catch the detailed problem on validation at the next step
    return false;
  }
}

function atcb_date_calculation(dateString: string): string | false {
  // replace "today" with the current date first
  const today = new Date();
  const todayString = today.getUTCFullYear() + '-' + (today.getUTCMonth() + 1) + '-' + today.getUTCDate();
  dateString = dateString.replace(/today/gi, todayString);
  // check for any dynamic additions and adjust
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0]!.split('-');
  const newDate = new Date(Date.UTC(dateParts[0] as unknown as number, (dateParts[1] as unknown as number) - 1, dateParts[2]!.substring(0, 2) as unknown as number));
  if (dateStringParts[1] && (dateStringParts[1] as unknown as number) > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  try {
    return newDate.toISOString().replace(/T(\d{2}:\d{2}:\d{2}\.\d{3})Z/g, '');
  } catch {
    // we will catch the detailed problem on validation at the next step
    return false;
  }
}

// Adjust for past events
function atcb_decorate_data_button_status_handling(data: ATCBConfig): ATCBConfig {
  // first, check for how we should handle the behavior on overdue events
  if (!data.pastDateHandling || (data.pastDateHandling !== 'disable' && data.pastDateHandling !== 'hide')) {
    data.pastDateHandling = 'none';
  }
  data.allOverdue = (function () {
    for (let i = 0; i < data.dates!.length; i++) {
      if (!data.dates![`${i}`]!.overdue) {
        // we return false if at least one event is not overdue
        return false;
      }
    }
    // in other cases, all dates would be overdue and therefore also the overall event
    return true;
  })();
  if (data.allOverdue) {
    if (data.pastDateHandling === 'disable') {
      data.disabled = true;
    } else if (data.pastDateHandling === 'hide') {
      data.hidden = true;
    }
  } else {
    // if there are >1 dates, we drop those that are overdue, if the handling is set to hide
    if (data.pastDateHandling === 'hide' && data.dates!.length > 1) {
      const filteredDates: ATCBDateEntry[] = [];
      for (let i = 0; i < data.dates!.length; i++) {
        if (!data.dates![`${i}`]!.overdue) {
          filteredDates.push(data.dates![`${i}`]!);
        }
      }
      data.dates = filteredDates;
    }
  }
  // second, check whether all dates are status "cancelled"
  data.allCancelled = (function () {
    for (let i = 0; i < data.dates!.length; i++) {
      if (!data.dates![`${i}`]!.status || (data.dates![`${i}`]!.status as string).toLowerCase() !== 'cancelled') {
        return false;
      }
    }
    return true;
  })();
  // third, block interaction if disabled or hidden
  if (data.disabled || data.hidden) {
    data.blockInteraction = true;
  }
  return data;
}

async function atcb_decorate_data_rsvp(data: ATCBConfig): Promise<ATCBConfig> {
  if (typeof atcb_check_bookings !== 'function' || !data.rsvp || !data.proKey || Object.keys(data.rsvp).length === 0) return data;
  // determine whether RSVP is expired
  data.rsvp.expired = (function () {
    if (data.rsvp && data.rsvp.expires && new Date(data.rsvp.expires as string) < new Date()) {
      return true;
    }
    return false;
  })();
  // determine whether RSVP is booked out and set # seats left
  if (data.rsvp.max) {
    const bookings = await atcb_check_bookings(data.proKey, data.dev);
    data.rsvp.seatsLeft = (data.rsvp.max as number) - bookings;
    if ((data.rsvp.seatsLeft as number) < 1) {
      data.rsvp.bookedOut = true;
    }
    if (data.rsvp.expired || data.rsvp.bookedOut) {
      data.blockInteraction = true;
    }
    if (data.blockInteraction) {
      data.disabled = true;
    }
  }
  return data;
}

export { atcb_decorate_data, atcb_decorate_data_dates };
