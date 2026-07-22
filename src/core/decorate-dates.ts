import { tzlib_get_offset, tzlib_get_timezones } from 'timezones-ical-library';
import { atcb_translate_via_time_zone, atcb_format_datetime, atcb_map_special_time_zones } from './dates';
import { atcb_rewrite_html_elements } from './text';
import { atcb_generate_uuid, atcb_apply_transformation } from './util';
import { atcb_decorate_data_rrule, atcb_decorate_data_recurring_events } from './decorate-recurrence';
import type { ATCBConfig, ATCBInputConfig, ATCBDateEntry } from '../types';

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
  // the root date values have been moved into the dates entries at this point (except
  // "name", which doubles as the series title) - drop the root copies so the dates array
  // is the single source of truth from here on
  const movedRootProperties = ['description', 'startDate', 'startTime', 'endDate', 'endTime', 'timeZone', 'useUserTZ', 'location', 'status', 'sequence', 'availability', 'organizer', 'attendee', 'icsCreated', 'icsUpdated'];
  movedRootProperties.forEach((prop) => {
    delete cfg[`${prop}`];
  });
  // check for past events
  cfg = atcb_decorate_data_button_status_handling(cfg);
  // calculate current time
  const now = new Date();
  // set icsCreated/icsUpdated defaults per date entry (root values already moved into
  // the entries at this point; entries without any value get the generation timestamp)
  for (const dateEntry of cfg.dates!) {
    if (!dateEntry.icsCreated || dateEntry.icsCreated === '') {
      dateEntry.icsCreated = atcb_format_datetime(now, 'clean', true);
    }
    if (!dateEntry.icsUpdated || dateEntry.icsUpdated === '') {
      dateEntry.icsUpdated = atcb_format_datetime(now, 'clean', true);
    }
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
  const properties = ['description', 'startDate', 'startTime', 'endDate', 'endTime', 'timeZone', 'useUserTZ', 'location', 'status', 'sequence', 'availability', 'organizer', 'attendee', 'icsReminder', 'icsUrl', 'icsCategories', 'icsClass', 'icsPriority', 'icsGeo', 'icsAttach', 'icsCreated', 'icsUpdated'];
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
  // (the root copies get deleted after all date entries were processed - see atcb_decorate_data_dates)
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
  // status and icsClass are normalized to the official lowercase form (input is case-insensitive)
  // (the ics generator uppercases them again for the RFC-canonical file output)
  dateEntry.status = atcb_apply_transformation(dateEntry.status, 'lower') as string | undefined;
  dateEntry.availability = atcb_apply_transformation(dateEntry.availability, 'lower');
  dateEntry.icsClass = atcb_apply_transformation(dateEntry.icsClass, 'lower') as string | undefined;
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
      if (!data.dates![`${i}`]!.status || data.dates![`${i}`]!.status !== 'cancelled') {
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

export {
  atcb_decorate_data_dates,
  atcb_move_root_values_into_dates,
  atcb_dates_cleanup,
  atcb_generate_unique_uid,
  atcb_transform_strings,
  atcb_decorate_data_description,
  atcb_set_online_event_flag,
  atcb_replace_custom_variables,
  atcb_replace_placeholder,
  atcb_date_cleanup,
  atcb_date_specials_calculation,
  atcb_date_calculation,
  atcb_decorate_data_button_status_handling,
};
