import { tzlib_get_offset } from 'timezones-ical-library';
import { isMobile } from './globals';
import { decorate_data_dates } from './decorate';
import type { ATCBConfig, ATCBDateEntry, ATCBDateEntryInput } from '../types';

// SHARED FUNCTION TO GENERATE A TIME STRING
function generate_time(data: ATCBConfig | ATCBDateEntry, style = 'delimiters', targetCal = 'general', addTimeZoneOffset = false): { start: string; end: string; duration: string; allday: false } | { start: string; end: string; allday: true } {
  if (data.startTime && data.startTime !== '' && data.endTime && data.endTime !== '') {
    // for the input, we assume GMT/UTC per default
    const newStartDate = new Date(data.startDate + 'T' + data.startTime + ':00.000+00:00');
    // we re-adjust the endDate for the case where the time string generation gets rather called directly
    if (!data.endDate) data.endDate = data.startDate;
    const newEndDate = new Date(data.endDate + 'T' + data.endTime + ':00.000+00:00');
    const durationMS = (newEndDate as unknown as number) - (newStartDate as unknown as number);
    const durationHours = Math.floor(durationMS / 1000 / 60 / 60);
    const durationMinutes = Math.floor(((durationMS - durationHours * 60 * 60 * 1000) / 1000 / 60) % 60);
    const durationString = (function () {
      if (durationHours < 10) {
        return '0' + durationHours + ':' + ('0' + durationMinutes).slice(-2);
      }
      return durationHours + ':' + ('0' + durationMinutes).slice(-2);
    })();
    // (see https://tz.add-to-calendar-technology.com/api/zones.json for available TZ names)
    if ((targetCal == 'ical' || targetCal == 'google') && !/GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|MET|MST|PST8PDT|WET|PST|PDT|MDT|CST|CDT|EDT|EEST|CEST|HST|HDT|AKST|AKDT|AST|ADT|AEST|AEDT|NZST|NZDT|IST|IDT|WEST|ACST|ACDT|BST/i.test(data.timeZone!)) {
      // in the iCal or Google case, we simply return and cut off the Z. Google does not support GMT +/- time zones (and we also adjust ical as it can be used for Google calendar).
      // everything else will be done by injecting the VTIMEZONE block at the iCal function
      return {
        start: format_datetime(newStartDate, 'clean', true, true),
        end: format_datetime(newEndDate, 'clean', true, true),
        duration: durationString,
        allday: false,
      };
    }
    // we get the correct offset via the timeZones iCal Library
    const offsetStart = tzlib_get_offset(data.timeZone!, data.startDate!, data.startTime!);
    const offsetEnd = tzlib_get_offset(data.timeZone!, data.endDate!, data.endTime!);
    // if we need to add the offset to the datetime string, do so respectively
    if (addTimeZoneOffset) {
      const formattedOffsetStart = offsetStart.slice(0, 3) + ':' + offsetStart.slice(3);
      const formattedOffsetEnd = offsetEnd.slice(0, 3) + ':' + offsetEnd.slice(3);
      return {
        start: newStartDate.toISOString().replace('.000Z', formattedOffsetStart),
        end: newEndDate.toISOString().replace('.000Z', formattedOffsetEnd),
        duration: durationString,
        allday: false,
      };
    }
    // in other cases, we substract the offset from the dates
    // (substraction to reflect the fact that the user assumed his timezone and to convert to UTC; since calendars assume UTC and add offsets again)
    const calcOffsetStart = parseInt(offsetStart[0]! + 1) * -1 * ((parseInt(offsetStart.substring(1, 3)) * 60 + parseInt(offsetStart.substring(3, 5))) * 60 * 1000);
    const calcOffsetEnd = parseInt(offsetEnd[0]! + 1) * -1 * ((parseInt(offsetEnd.substring(1, 3)) * 60 + parseInt(offsetEnd.substring(3, 5))) * 60 * 1000);
    newStartDate.setTime(newStartDate.getTime() + calcOffsetStart);
    newEndDate.setTime(newEndDate.getTime() + calcOffsetEnd);
    // return formatted data
    return {
      start: format_datetime(newStartDate, style),
      end: format_datetime(newEndDate, style),
      duration: durationString,
      allday: false,
    };
  } else {
    // would be an allday event then
    const startDate = data.startDate!.split('-');
    const endDate = data.endDate ? data.endDate.split('-') : startDate;
    // we set 12 o clock as time to prevent Daylight saving time to interfere with any calculation here
    const newStartDate = new Date(Date.UTC(startDate[0] as unknown as number, (startDate[1] as unknown as number) - 1, startDate[2] as unknown as number, 12, 0, 0));
    const newEndDate = new Date(Date.UTC(endDate[0] as unknown as number, (endDate[1] as unknown as number) - 1, endDate[2] as unknown as number, 12, 0, 0));
    // increment the end day by 1 for Google Calendar, iCal, and Microsoft (but only if mobile, since desktop does not need this)
    // TODO: remove Microsoft from this list as soon as they fixed their bugs
    if (targetCal === 'google' || (targetCal === 'microsoft' && !isMobile()) || targetCal === 'msteams' || targetCal === 'ical') {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }
    // return formatted data
    // for ms teams, we need to remove the Z as well and add the time zone offset +00:00 instead
    // but only on desktop - on mobile devices, we add time information in the user's time zone
    // TODO: optimize this as soon as Microsoft fixed their bugs
    if (targetCal === 'msteams') {
      if (isMobile()) {
        // get the time zone offset of the user's browser for the start date
        const offset = newStartDate.getTimezoneOffset();
        // get the ISO string of the offset
        const formattedOffset = (function () {
          if (offset < 0) {
            return '+' + ('0' + Math.abs(offset / 60)).slice(-2) + ':' + ('0' + Math.abs(offset % 60)).slice(-2);
          } else {
            return '-' + ('0' + Math.abs(offset / 60)).slice(-2) + ':' + ('0' + Math.abs(offset % 60)).slice(-2);
          }
        })();
        // return formatted data
        return {
          start: format_datetime(newStartDate, style, false, true) + 'T00:00:00' + formattedOffset,
          end: format_datetime(newEndDate, style, false, true) + 'T00:00:00' + formattedOffset,
          allday: true,
        };
      }
      return {
        start: format_datetime(newStartDate, style, false, true) + '+00:00',
        end: format_datetime(newEndDate, style, false, true) + '+00:00',
        allday: true,
      };
    }
    // for all others, it is easier
    return {
      start: format_datetime(newStartDate, style, false),
      end: format_datetime(newEndDate, style, false),
      allday: true,
    };
  }
}

function format_datetime(datetime: Date, style = 'delimiters', includeTime = true, removeZ = false): string {
  const regex = (function () {
    // defines what gets cut off
    if (includeTime) {
      if (style == 'clean') {
        return /(-|:|(\.\d{3}))/g;
      }
      return /(\.\d{3})/g;
    }
    if (style == 'clean') {
      return /(-|T(\d{2}:\d{2}:\d{2}\.\d{3})Z)/g;
    }
    return /T(\d{2}:\d{2}:\d{2}\.\d{3})Z/g;
  })();
  const output = removeZ ? datetime.toISOString().replace(regex, '').replace('Z', '') : datetime.toISOString().replace(regex, '');
  return output;
}

function offsetToMilliseconds(offset: string): number {
  const sign = offset[0] === '+' ? 1 : -1;
  const hours = parseInt(offset.substring(1, 3), 10);
  const minutes = parseInt(offset.substring(3, 5), 10);
  const totalMinutes = (hours * 60 + minutes) * sign;
  const milliseconds = totalMinutes * 60000;
  return milliseconds;
}

function translate_via_time_zone(date: string, time: string, baseTimeZone: string, targetTimeZone: string): string[] {
  if (baseTimeZone === 'currentBrowser') {
    baseTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  const dateTime = new Date(`${date}T${time}:00Z`);
  const offset = tzlib_get_offset(baseTimeZone, date, time); // would return something like +0200
  const dateTimeUTC = new Date(dateTime.getTime() - offsetToMilliseconds(offset));
  // Format the date and time in the target time zone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: targetTimeZone,
    hourCycle: 'h23',
  });
  const dateInTargetTimeZone = formatter.format(dateTimeUTC);
  return dateInTargetTimeZone.split(', '); // returns [date, time]
}

function generate_timestring(dates: ATCBDateEntryInput[], language = 'en', subEvent: 'all' | number = 'all', decorate = false, browserTimeOverride = false, enforceYear = false, hideTimeZone = false): string[] {
  if (decorate) {
    // if this function gets called directly, we might want to decorate raw data first
    dates = decorate_data_dates({ dates: dates }).dates!;
  }
  let timeZoneInfoStart: string, timeZoneInfoEnd: string;
  let formattedTimeStart: { start: string; end: string; duration: string; allday: false } | { start: string; end: string; allday: true };
  let formattedTimeEnd: { start: string; end: string; duration: string; allday: false } | { start: string; end: string; allday: true };
  const timeBlocks: string[] = [];
  let timeZoneInfoStringStart = '';
  let timeZoneInfoStringEnd = '';
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (subEvent === 'all') {
    // we are looking at multiple sub-events, which should be considered all together
    formattedTimeStart = generate_time(dates[0]! as ATCBDateEntry);
    formattedTimeEnd = generate_time(dates[dates.length - 1]! as ATCBDateEntry);
    timeZoneInfoStart = browserTimeOverride ? browserTimezone : dates[0]!.timeZone!;
    timeZoneInfoEnd = browserTimeOverride ? browserTimezone : dates[dates.length - 1]!.timeZone!;
  } else {
    // we are looking at 1 or many sub-events, but we consider only one specific
    formattedTimeStart = generate_time(dates[`${subEvent}`]! as ATCBDateEntry);
    formattedTimeEnd = formattedTimeStart;
    timeZoneInfoStart = browserTimeOverride ? browserTimezone : dates[`${subEvent}`]!.timeZone!;
    timeZoneInfoEnd = timeZoneInfoStart;
  }
  const startDateInfo = new Date(formattedTimeStart.start);
  const endDateInfo = new Date(formattedTimeEnd.end);
  // set GMT for allday events to prevent any time zone mismatches
  if (formattedTimeStart.allday) {
    timeZoneInfoStart = 'GMT';
  }
  if (formattedTimeEnd.allday) {
    timeZoneInfoEnd = 'GMT';
  }
  // in the case of an online event (or magic location), convert the time zone
  const magicLocationPhrases = ['global', 'world-wide', 'worldwide', 'online'];
  const convertable = (function () {
    let i = 0;
    let j = dates.length - 1;
    if (subEvent != 'all') {
      i = j = subEvent;
    }
    for (i; i <= j; i++) {
      const magicLocation = (function () {
        if (dates[`${i}`]!.location && dates[`${i}`]!.location !== '') {
          if (magicLocationPhrases.includes(dates[`${i}`]!.location!.toLowerCase().trim())) {
            return true;
          }
        }
        return false;
      })();
      if (!magicLocation && !(dates[`${i}`] as ATCBDateEntry).onlineEvent) {
        return false;
      }
    }
    return true;
  })();
  if (convertable) {
    timeZoneInfoStart = timeZoneInfoEnd = browserTimezone;
  } else {
    // determine time zone strings
    if (!formattedTimeStart.allday && browserTimezone !== timeZoneInfoStart && timeZoneInfoStart !== timeZoneInfoEnd) {
      timeZoneInfoStringStart = '(' + timeZoneInfoStart + ')';
    }
    if ((!formattedTimeEnd.allday && browserTimezone !== timeZoneInfoEnd) || timeZoneInfoStart !== timeZoneInfoEnd) {
      timeZoneInfoStringEnd = '(' + timeZoneInfoEnd + ')';
    }
  }
  // drop the year, if it is the current one (and not enforced)
  const now = new Date();
  const dropYearStart = (function () {
    if (!enforceYear && startDateInfo.getFullYear() === now.getFullYear()) {
      return true;
    }
    return false;
  })();
  const dropYearEnd = (function () {
    if (!enforceYear && endDateInfo.getFullYear() === now.getFullYear()) {
      return true;
    }
    return false;
  })();
  // get the options to format the date
  const formatOptionsStart = get_format_options(timeZoneInfoStart, dropYearStart, language);
  const formatOptionsEnd = get_format_options(timeZoneInfoEnd, dropYearEnd, language);
  // start = end
  if (startDateInfo.toLocaleDateString(language, formatOptionsEnd.DateLong) === endDateInfo.toLocaleDateString(language, formatOptionsEnd.DateLong)) {
    // allday vs. timed
    if (formattedTimeStart.allday) {
      if (!dropYearStart) {
        timeBlocks.push(startDateInfo.toLocaleDateString(language, formatOptionsStart.DateLong));
      }
    } else {
      let timeString;
      if (dropYearStart) {
        timeString = startDateInfo.toLocaleString(language, formatOptionsStart.Time);
      } else {
        timeString = startDateInfo.toLocaleString(language, formatOptionsStart.DateTimeLong);
      }
      if (language === 'en') {
        timeString = timeString.replace(/:00/, '');
      }
      timeBlocks.push(timeString);
      if (timeZoneInfoStringStart !== '' && !hideTimeZone) {
        timeBlocks.push(timeZoneInfoStringStart);
      }
      timeBlocks.push('-');
      timeString = endDateInfo.toLocaleTimeString(language, formatOptionsEnd.Time);
      if (language === 'en') {
        timeString = timeString.replace(/:00/, '');
      }
      timeBlocks.push(timeString);
      if (timeZoneInfoStringEnd !== '' && !hideTimeZone) {
        timeBlocks.push(timeZoneInfoStringEnd);
      }
    }
  } else {
    // start != end
    // allday vs. timed (start)
    if (formattedTimeStart.allday) {
      timeBlocks.push(startDateInfo.toLocaleDateString(language, formatOptionsStart.DateLong));
    } else {
      let timeString;
      if (dropYearStart) {
        timeString = startDateInfo.toLocaleString(language, formatOptionsStart.Time);
      } else {
        timeString = startDateInfo.toLocaleString(language, formatOptionsStart.DateTimeLong);
      }
      if (language === 'en') {
        timeString = timeString.replace(/:00/, '');
      }
      timeBlocks.push(timeString);
    }
    if (timeZoneInfoStringStart !== '' && !hideTimeZone) {
      timeBlocks.push(timeZoneInfoStringStart);
    }
    timeBlocks.push('-');
    // allday vs. timed (end)
    if (formattedTimeEnd.allday) {
      timeBlocks.push(endDateInfo.toLocaleDateString(language, formatOptionsEnd.DateLong));
    } else {
      let timeString = endDateInfo.toLocaleString(language, formatOptionsEnd.DateTimeLong);
      if (language === 'en') {
        timeString = timeString.replace(/:00/, '');
      }
      timeBlocks.push(timeString);
    }
    if (timeZoneInfoStringEnd !== '' && !hideTimeZone) {
      timeBlocks.push(timeZoneInfoStringEnd);
    }
  }
  return timeBlocks;
}

function get_format_options(timeZoneInfo: string, dropYear = false, language = 'en'): { DateLong: Intl.DateTimeFormatOptions; DateTimeLong: Intl.DateTimeFormatOptions; Time: Intl.DateTimeFormatOptions } {
  timeZoneInfo = map_time_zone_for_intl(timeZoneInfo);
  const hoursFormat = (function () {
    if (language === 'en') {
      return 'h12'; // 12am -> 1am -> .. -> 12pm -> 1pm -> ...
    }
    return 'h23'; // 00:00 -> 01:00 -> 12:00 -> 13:00 -> ...
  })();
  if (dropYear) {
    return {
      DateLong: {
        timeZone: timeZoneInfo,
        month: 'short',
        day: 'numeric',
      },
      DateTimeLong: {
        timeZone: timeZoneInfo,
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hourCycle: hoursFormat,
      },
      Time: {
        timeZone: timeZoneInfo,
        hour: 'numeric',
        minute: '2-digit',
        hourCycle: hoursFormat,
      },
    };
  }
  return {
    DateLong: {
      timeZone: timeZoneInfo,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    DateTimeLong: {
      timeZone: timeZoneInfo,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: hoursFormat,
    },
    Time: {
      timeZone: timeZoneInfo,
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: hoursFormat,
    },
  };
}

// HELPER: Parse BYDAY/BYWEEKDAY tokens into plain weekdays and ordinal structures
function parseByWeekdayTokens(rawByDay: string | undefined): { plainWeekdays: number[]; ordinals: { n: number; day: number }[] } {
  const tokens = rawByDay ? rawByDay.toString().split(',') : [];
  const mapWeekdayCode = (wd: string): number | undefined => {
    switch (wd) {
      case 'SU':
        return 0;
      case 'MO':
        return 1;
      case 'TU':
        return 2;
      case 'WE':
        return 3;
      case 'TH':
        return 4;
      case 'FR':
        return 5;
      case 'SA':
        return 6;
      default:
        return undefined;
    }
  };
  const plainWeekdays: number[] = [];
  const ordinals: { n: number; day: number }[] = [];
  for (const tok of tokens) {
    const t = tok.trim().toUpperCase();
    if (t.length < 2) continue;
    const wd = t.slice(-2);
    const day = mapWeekdayCode(wd);
    if (day === undefined) continue;
    const prefix = t.slice(0, t.length - 2);
    if (prefix) {
      // parse optional signed ordinal without regex
      let sign = 1;
      let digits = prefix;
      if (digits[0] === '+') {
        digits = digits.slice(1);
      } else if (digits[0] === '-') {
        sign = -1;
        digits = digits.slice(1);
      }
      if (!digits || digits.length > 2) continue;
      const validDigits = typeof digits === 'string' && /^\d+$/.test(digits);
      if (!validDigits) continue;
      const abs = parseInt(digits, 10);
      if (abs < 1 || abs > 53) continue; // guard rails per RFC (month up to 5, year up to 53)
      ordinals.push({ n: sign * abs, day });
    } else {
      plainWeekdays.push(day);
    }
  }
  return { plainWeekdays, ordinals };
}

// Dynamically-keyed RRULE parts accumulator: starts as raw string key/value pairs from the
// RRULE string, then individual keys get progressively reparsed in place into richer types
// (numbers, Dates, arrays, ordinal structures) - kept as one loose index-signature type per
// key rather than a strict interface, to reflect the same dynamic reassignment the JS did.
type ATCBRRuleParts = {
  [key: string]: string | number | boolean | Date | number[] | { n: number; day: number }[] | null | undefined;
};

// SHARED FUNCTION TO PARSE RRULES
function parseRRule(rruleStr: string, deep = true): ATCBRRuleParts {
  const parts: ATCBRRuleParts = rruleStr
    .replace('RRULE:', '')
    .split(';')
    .reduce((acc: ATCBRRuleParts, part: string) => {
      const [key, value] = part.split('=');
      acc[`${key}`] = value;
      return acc;
    }, {});
  if (!parts.FREQ) throw new Error('RRULE must have FREQ');
  // Parse components
  parts.FREQ = (parts.FREQ as string).toUpperCase();
  // Ensure INTERVAL defaults to 1 if not explicitly provided
  parts.INTERVAL = parts.INTERVAL ? parseInt(parts.INTERVAL.toString(), 10) : 1;
  parts.COUNT = parts.COUNT ? parseInt(parts.COUNT.toString(), 10) : null;
  if (parts.UNTIL) {
    const untilStr = parts.UNTIL.toString();
    parts.UNTIL = deep ? new Date(Date.UTC(parseInt(untilStr.slice(0, 4), 10), parseInt(untilStr.slice(4, 6), 10) - 1, parseInt(untilStr.slice(6, 8), 10), parseInt(untilStr.slice(9, 11) || '0', 10), parseInt(untilStr.slice(11, 13) || '0', 10))) : untilStr;
  }
  // Parse BYDAY/ByWeekDay, keeping both plain weekdays and ordinal forms
  if (parts.BYWEEKDAY || parts.BYDAY) {
    const rawByDay = (parts.BYWEEKDAY || parts.BYDAY)?.toString();
    if (deep) {
      const { plainWeekdays, ordinals } = parseByWeekdayTokens(rawByDay);
      parts.BYWEEKDAY = plainWeekdays.length ? plainWeekdays : null;
      parts.BYDAY_ORDINALS = ordinals.length ? ordinals : null;
    } else {
      parts.BYWEEKDAY = parts.BYWEEKDAY || parts.BYDAY;
    }
  }
  parts.BYMONTH =
    deep && parts.BYMONTH
      ? parts.BYMONTH.toString()
          .split(',')
          .map((n) => parseInt(n, 10))
      : parts.BYMONTH;
  parts.BYYEARDAY =
    deep && parts.BYYEARDAY
      ? parts.BYYEARDAY.toString()
          .split(',')
          .map((n) => parseInt(n, 10))
      : parts.BYYEARDAY;
  parts.BYMONTHDAY =
    deep && parts.BYMONTHDAY
      ? parts.BYMONTHDAY.toString()
          .split(',')
          .map((n) => parseInt(n, 10))
      : parts.BYMONTHDAY;
  parts.BYWEEKNO =
    deep && parts.BYWEEKNO
      ? parts.BYWEEKNO.toString()
          .split(',')
          .map((n) => parseInt(n, 10))
      : parts.BYWEEKNO;

  // We do not support BYHOUR (or other sub-daily expansion rules) in this project.
  // If provided, ignore it to keep wall-clock recurrences stable and predictable.
  if (parts.BYHOUR) {
    delete parts.BYHOUR;
  }
  return parts;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toIsoOffset(off: string): string {
  if (!off || off === 'Z' || off === '+0000' || off === '-0000' || off === '+00:00' || off === '-00:00') return 'Z';
  const raw = String(off).replace(/^GMT/i, '');
  if (/^[+-]\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^[+-]\d{4}$/.test(raw)) return `${raw.slice(0, 3)}:${raw.slice(3)}`;
  const sign = raw.startsWith('-') ? '-' : '+';
  const digits = raw.replace(/\D/g, '').padStart(4, '0').slice(0, 4);
  return `${sign}${digits.slice(0, 2)}:${digits.slice(2)}`;
}

const tzPartsFormatterCache = new Map<string, Intl.DateTimeFormat>();
function getTzPartsFormatter(timeZone: string): Intl.DateTimeFormat {
  const key = map_time_zone_for_intl(timeZone || 'UTC');
  const cached = tzPartsFormatterCache.get(key);
  if (cached) return cached;
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: key,
    hour12: false,
    hourCycle: 'h23',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  tzPartsFormatterCache.set(key, fmt);
  return fmt;
}

// Base calendar parts as read off a Date in a given time zone (or UTC).
type ATCBDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

// ATCBDateParts plus derived fields used by the RRULE BY*-rule matchers.
type ATCBEnrichedDateParts = ATCBDateParts & {
  month0: number;
  dayOfYear: number;
  weekNumber: number;
};

function getTzParts(dateObj: Date, timeZone: string): ATCBDateParts | null {
  if (!(dateObj instanceof Date) || !isFinite(dateObj.getTime())) return null;
  try {
    const parts = getTzPartsFormatter(timeZone).formatToParts(dateObj);
    const get = (t: string): string => parts.find((p) => p.type === t)?.value || '';
    const weekdayShort = get('weekday');
    let weekday: number | null = null;
    switch (weekdayShort) {
      case 'Sun':
        weekday = 0;
        break;
      case 'Mon':
        weekday = 1;
        break;
      case 'Tue':
        weekday = 2;
        break;
      case 'Wed':
        weekday = 3;
        break;
      case 'Thu':
        weekday = 4;
        break;
      case 'Fri':
        weekday = 5;
        break;
      case 'Sat':
        weekday = 6;
        break;
    }
    const year = parseInt(get('year'), 10);
    const month = parseInt(get('month'), 10);
    const day = parseInt(get('day'), 10);
    const hour = parseInt(get('hour'), 10);
    const minute = parseInt(get('minute'), 10);
    const second = parseInt(get('second'), 10);
    if (![year, month, day, hour, minute, second].every((n) => Number.isFinite(n))) return null;
    // If we couldn't map the weekday token, derive weekday from the calendar date.
    // This is deterministic and avoids hard failures if Intl returns a different abbreviation.
    if (weekday === null) {
      weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    }
    return { year, month, day, hour, minute, second, weekday };
  } catch {
    return null;
  }
}

function getUtcParts(dateObj: Date): ATCBDateParts {
  return {
    year: dateObj.getUTCFullYear(),
    month: dateObj.getUTCMonth() + 1,
    day: dateObj.getUTCDate(),
    hour: dateObj.getUTCHours(),
    minute: dateObj.getUTCMinutes(),
    second: dateObj.getUTCSeconds(),
    weekday: dateObj.getUTCDay(),
  };
}

function getDayOfYearFromYmd(year: number, month0: number, day: number): number {
  const start = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, month0, day);
  return Math.floor((current - start) / 86400000) + 1;
}

function getWeekNumberFromYmd(year: number, month0: number, day: number): number {
  const d = new Date(Date.UTC(year, month0, day));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function enrichParts(parts: ATCBDateParts): ATCBEnrichedDateParts {
  const month0 = parts.month - 1;
  return {
    ...parts,
    month0,
    dayOfYear: getDayOfYearFromYmd(parts.year, month0, parts.day),
    weekNumber: getWeekNumberFromYmd(parts.year, month0, parts.day),
  };
}

function getPartsForTimeZone(dateObj: Date, timeZone: string): ATCBEnrichedDateParts {
  const tzParts = timeZone ? getTzParts(dateObj, timeZone) : null;
  return enrichParts(tzParts || getUtcParts(dateObj));
}

// Add/subtract days while preserving wall-clock time (hh:mm) in the provided time zone.
// Optional dateParts lets callers reuse already-computed TZ parts to avoid extra Intl work.
// Note: we still need to ask tzlib for the offset per date because it can change across DST.
function addLocalDays(dateObj: Date, days: number, timeZone: string, hhmm: string, dateParts: ATCBEnrichedDateParts | null = null): Date {
  const p = dateParts || getPartsForTimeZone(dateObj, timeZone);
  const month0 = Number.isFinite(p.month0) ? p.month0 : Number.isFinite(p.month) ? p.month - 1 : 0;
  const baseUtc = Date.UTC(p.year, month0, p.day) + days * 86400000;
  const d = new Date(baseUtc);
  const dateStr = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
  const safeTimeZone = timeZone || 'UTC';
  try {
    const off = tzlib_get_offset(safeTimeZone, dateStr, hhmm);
    return new Date(`${dateStr}T${hhmm}:00${toIsoOffset(off)}`);
  } catch {
    return new Date(dateObj.getTime() + days * 86400000);
  }
}

// Check if date matches the FREQ and INTERVAL from start
function matchesFreq(date: Date, rrule: ATCBRRuleParts, startDate: Date, timeZone: string, dateParts: ATCBEnrichedDateParts | null, startParts: ATCBEnrichedDateParts | null): boolean {
  const interval = parseInt((rrule.INTERVAL as number).toString(), 10) || 1;
  const dp = dateParts || getPartsForTimeZone(date, timeZone);
  const sp = startParts || getPartsForTimeZone(startDate, timeZone);
  switch (rrule.FREQ) {
    case 'YEARLY':
      return (dp.year - sp.year) % interval === 0;
    case 'MONTHLY': {
      const months = (dp.year - sp.year) * 12 + (dp.month0 - sp.month0);
      return months % interval === 0;
    }
    case 'WEEKLY': {
      const daysW = Math.floor((Date.UTC(dp.year, dp.month0, dp.day) - Date.UTC(sp.year, sp.month0, sp.day)) / 86400000);
      const weeks = Math.floor(daysW / 7);
      return weeks % interval === 0;
    }
    case 'DAILY': {
      const days = Math.floor((Date.UTC(dp.year, dp.month0, dp.day) - Date.UTC(sp.year, sp.month0, sp.day)) / 86400000);
      return days % interval === 0;
    }
    default:
      return true;
  }
}

// Check if date matches all BY* rules, with implicit filters
function matchesRRule(date: Date, rrule: ATCBRRuleParts, startDate: Date, timeZone: string, dateParts: ATCBEnrichedDateParts | null, startParts: ATCBEnrichedDateParts | null): boolean {
  // Explicit BY rules
  if (!matchesBYRules(date, rrule, timeZone, dateParts)) return false;
  // Implicit filters
  if (!matchesImplicitRules(date, rrule, startDate, timeZone, dateParts, startParts)) return false;
  return true;
}

function matchesBYRules(date: Date, rrule: ATCBRRuleParts, timeZone: string, dateParts: ATCBEnrichedDateParts | null): boolean {
  const dp = dateParts || getPartsForTimeZone(date, timeZone);
  if (rrule.BYMONTH && !(rrule.BYMONTH as number[]).includes(dp.month)) return false;
  if (rrule.BYYEARDAY && !(rrule.BYYEARDAY as number[]).includes(dp.dayOfYear)) return false;
  if (rrule.BYMONTHDAY && !(rrule.BYMONTHDAY as number[]).includes(dp.day)) return false;
  if (rrule.BYWEEKNO && !(rrule.BYWEEKNO as number[]).includes(dp.weekNumber)) return false;
  // Weekday filter (checking both, plain days as well as more complex structures -> splitted apart to ordinals)
  // Evaluate plain weekday condition
  const hasPlainWeekday = !!(rrule.BYWEEKDAY && (rrule.BYWEEKDAY as number[]).length);
  const plainWeekdayOk: boolean | null = hasPlainWeekday ? (rrule.BYWEEKDAY as number[]).includes(dp.weekday) : null;
  // Ordinal BYDAY handling (e.g., 1MO, -1FR)
  let ordinalOk: boolean | null = null;
  if (rrule.BYDAY_ORDINALS && Array.isArray(rrule.BYDAY_ORDINALS) && rrule.BYDAY_ORDINALS.length > 0) {
    const dow = dp.weekday; // day of week in DTSTART tz
    const year = dp.year;
    const month0 = dp.month0;
    const dayOfYear = dp.dayOfYear;
    const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
    const daysInYear = getDayOfYearFromYmd(year, 11, 31);

    const isNthWeekdayOfMonth = (n: number, weekday: number): boolean => {
      if (n === 0) return false;
      if (n > 0) {
        // Validates whether a given date matches the Nth weekday
        const firstOfMonth = new Date(Date.UTC(year, month0, 1));
        const firstDow = firstOfMonth.getUTCDay();
        const offset = (weekday - firstDow + 7) % 7;
        const targetDay = 1 + offset + (n - 1) * 7;
        return targetDay >= 1 && targetDay <= daysInMonth && dp.day === targetDay;
      } else {
        // if negative, we count backwards (like last FR in a month)
        const lastOfMonth = new Date(Date.UTC(year, month0 + 1, 0));
        const lastDow = lastOfMonth.getUTCDay();
        const backOffset = (lastDow - weekday + 7) % 7;
        const targetDay = lastOfMonth.getUTCDate() - backOffset + (n + 1) * 7; // n negative
        return targetDay >= 1 && targetDay <= daysInMonth && dp.day === targetDay;
      }
    };

    const isNthWeekdayOfYear = (n: number, weekday: number): boolean => {
      if (n === 0) return false;
      if (n > 0) {
        const jan1 = new Date(Date.UTC(year, 0, 1));
        const jan1Dow = jan1.getUTCDay();
        const offset = (weekday - jan1Dow + 7) % 7;
        const targetDoy = 1 + offset + (n - 1) * 7;
        return targetDoy >= 1 && targetDoy <= daysInYear && dayOfYear === targetDoy;
      } else {
        const dec31 = new Date(Date.UTC(year, 11, 31));
        const dec31Dow = dec31.getUTCDay();
        const backOffset = (dec31Dow - weekday + 7) % 7;
        const targetDoy = daysInYear - backOffset + (n + 1) * 7; // n negative
        return targetDoy >= 1 && targetDoy <= daysInYear && dayOfYear === targetDoy;
      }
    };

    // Match if any ordinal item matches context (MONTHLY: within month, YEARLY: within month if BYMONTH given, else within year)
    const anyOrdinalMatch = (rrule.BYDAY_ORDINALS as { n: number; day: number }[]).some(({ n, day }) => {
      if (day !== dow) return false;
      if (rrule.FREQ === 'MONTHLY') return isNthWeekdayOfMonth(n, day);
      if (rrule.FREQ === 'YEARLY') {
        if (rrule.BYMONTH && (rrule.BYMONTH as number[]).length > 0) return isNthWeekdayOfMonth(n, day);
        if (!rrule.BYWEEKNO) return isNthWeekdayOfYear(n, day);
        // Ordinal BYDAY with YEARLY+BYWEEKNO is invalid per RFC; treat as non-match
        return false;
      }
      // For other frequencies, numeric BYDAY is not applicable; treat as non-match
      return false;
    });
    ordinalOk = anyOrdinalMatch;
  }
  // Combine weekday conditions: if both present, apply union (either may match). If only one type is present, it must match.
  if (plainWeekdayOk === false && ordinalOk === false) return false;
  if (plainWeekdayOk === false && ordinalOk === null) return false;
  if (ordinalOk === false && plainWeekdayOk === null) return false;
  return true;
}

function matchesImplicitRules(date: Date, rrule: ATCBRRuleParts, startDate: Date, timeZone: string, dateParts: ATCBEnrichedDateParts | null, startParts: ATCBEnrichedDateParts | null): boolean {
  const dp = dateParts || getPartsForTimeZone(date, timeZone);
  const sp = startParts || getPartsForTimeZone(startDate, timeZone);
  // Without BYHOUR support, hour always comes from DTSTART.
  if (dp.hour !== sp.hour) return false;
  const hasByWeekdayAny = !!(rrule.BYWEEKDAY && (rrule.BYWEEKDAY as number[]).length) || !!(rrule.BYDAY_ORDINALS && (rrule.BYDAY_ORDINALS as { n: number; day: number }[]).length);
  if (rrule.FREQ === 'WEEKLY' && !hasByWeekdayAny && dp.weekday !== sp.weekday) return false;
  if (rrule.FREQ === 'MONTHLY' && !rrule.BYMONTHDAY && !hasByWeekdayAny && dp.day !== sp.day) return false;
  if (rrule.FREQ === 'YEARLY' && !rrule.BYMONTH && dp.month0 !== sp.month0) return false;
  if (rrule.FREQ === 'YEARLY' && !rrule.BYMONTHDAY && !hasByWeekdayAny && !rrule.BYYEARDAY && !rrule.BYWEEKNO && dp.day !== sp.day) return false;
  return true;
}

// Get next occurrence and last if no next
function getNextOccurrence(rruleStr: string, startDateTime: Date, diff: number, allday: boolean, tzid = 'UTC'): { nextOccurrence: Date; adjustedCount: number } {
  const rrule = parseRRule(rruleStr);
  const startParts = getPartsForTimeZone(startDateTime, tzid);
  const baseHhmm = `${pad2(startParts.hour)}:${pad2(startParts.minute)}`;
  // Normalize UNTIL for all-day rules: treat as inclusive end-of-day
  if (allday && rrule.UNTIL instanceof Date) {
    const untilEod = new Date(rrule.UNTIL);
    // set to 23:59:59.999 UTC to include the day entirely
    untilEod.setUTCHours(23, 59, 59, 999);
    rrule.UNTIL = untilEod;
  }
  // Get now (user's current time minus diff to measure against the end time)
  const now = new Date();
  const upperEnd = new Date(now.getTime() - diff);
  // Iterate from start date, collecting valid occurrences
  let currentDate = startDateTime;
  const occurrences: Date[] = [];
  let count = 0;
  let maxIterations = 10000;
  // ---------- fast-forward for old start dates ----------
  // Stepping day by day through decades is slow and silently capped by maxIterations.
  // Jump arithmetically to a period boundary aligned with the start, at least two
  // intervals before the relevant window, then let the day-stepper take over. The
  // match predicates are absolute (calendar math from the start date), so a jump can
  // never change WHICH dates match - only the occurrence COUNTING is stateful. When
  // COUNT or UNTIL is in play, the number of occurrences consumed by the skipped span
  // must be exact: that is only derivable arithmetically for plain rules with one
  // occurrence per interval period (no BY* filters, no month-day anchors that skip
  // shorter months, no Feb 29 anchor), so everything else keeps the full iteration.
  let skippedOccurrences = 0;
  {
    const ffInterval = parseInt((rrule.INTERVAL as number | string | undefined)?.toString() || '1', 10) || 1;
    const freq = rrule.FREQ as string | undefined;
    const bounded = Boolean(rrule.COUNT) || Boolean(rrule.UNTIL);
    const hasByRules = Boolean(rrule.BYDAY || rrule.BYMONTH || rrule.BYMONTHDAY || rrule.BYYEARDAY || rrule.BYWEEKNO || rrule.BYSETPOS);
    const plainCountable = !hasByRules && (freq === 'DAILY' || freq === 'WEEKLY' || (freq === 'MONTHLY' && startParts.day <= 28) || (freq === 'YEARLY' && !(startParts.month0 === 1 && startParts.day === 29)));
    if ((freq === 'DAILY' || freq === 'WEEKLY' || freq === 'MONTHLY' || freq === 'YEARLY') && (!bounded || plainCountable)) {
      // never jump past UNTIL: an exhausted series must still land on its final occurrence
      const target = rrule.UNTIL instanceof Date && rrule.UNTIL < upperEnd ? rrule.UNTIL : upperEnd;
      const targetParts = getPartsForTimeZone(target, tzid);
      const startUtcDay = Date.UTC(startParts.year, startParts.month0, startParts.day);
      const targetUtcDay = Date.UTC(targetParts.year, targetParts.month0, targetParts.day);
      const periodsToSkip = (function () {
        if (freq === 'DAILY' || freq === 'WEEKLY') {
          const periodDays = (freq === 'WEEKLY' ? 7 : 1) * ffInterval;
          return Math.floor((targetUtcDay - startUtcDay) / 86400000 / periodDays) - 2;
        }
        if (freq === 'MONTHLY') {
          const months = (targetParts.year - startParts.year) * 12 + (targetParts.month0 - startParts.month0);
          return Math.floor(months / ffInterval) - 2;
        }
        return Math.floor((targetParts.year - startParts.year) / ffInterval) - 2;
      })();
      // keep at least the two final occurrences iterable, so the exhausted-series
      // logic still walks onto the real last occurrence
      const cappedPeriods = rrule.COUNT ? Math.min(periodsToSkip, Math.max(0, (rrule.COUNT as number) - 2)) : periodsToSkip;
      if (cappedPeriods > 0) {
        const jumped = (function () {
          if (freq === 'DAILY' || freq === 'WEEKLY') {
            return addLocalDays(startDateTime, cappedPeriods * (freq === 'WEEKLY' ? 7 : 1) * ffInterval, tzid, baseHhmm);
          }
          const monthsTotal = startParts.month0 + (freq === 'MONTHLY' ? cappedPeriods * ffInterval : 0);
          const targetYear = startParts.year + (freq === 'YEARLY' ? cappedPeriods * ffInterval : 0) + Math.floor(monthsTotal / 12);
          const targetMonth0 = ((monthsTotal % 12) + 12) % 12;
          const dateStr = `${targetYear}-${pad2(targetMonth0 + 1)}-${pad2(startParts.day)}`;
          try {
            return new Date(`${dateStr}T${baseHhmm}:00${toIsoOffset(tzlib_get_offset(tzid, dateStr, baseHhmm))}`);
          } catch {
            return null;
          }
        })();
        if (jumped && isFinite(jumped.getTime()) && jumped > startDateTime) {
          currentDate = jumped;
          // occurrences consumed by the skipped span (only tracked where exact)
          skippedOccurrences = bounded ? cappedPeriods : 0;
          count = skippedOccurrences;
        }
      }
    }
  }
  // Collect all valid occurrences up to COUNT or UNTIL, or until first future match is found
  while (true) {
    // Stop before pushing when we've passed UNTIL
    if (rrule.UNTIL && currentDate > (rrule.UNTIL as Date)) break;
    const currentParts = getPartsForTimeZone(currentDate, tzid);
    const isMatch = matchesFreq(currentDate, rrule, startDateTime, tzid, currentParts, startParts) && matchesRRule(currentDate, rrule, startDateTime, tzid, currentParts, startParts);
    if (isMatch) {
      occurrences.push(currentDate);
      count++;
      // If there's a COUNT limit, stop when reached
      if (rrule.COUNT && count >= (rrule.COUNT as number)) break;
      // If no end (COUNT/UNTIL), stop as soon as we've captured the first occurrence not before upperEnd
      if (!rrule.COUNT && !rrule.UNTIL && (allday ? currentDate >= upperEnd : currentDate > upperEnd)) break;
    }
    if (--maxIterations <= 0) {
      // Reached safety cap while generating occurrences
      break;
    }
    currentDate = addLocalDays(currentDate, 1, tzid, baseHhmm, currentParts);
  }
  // Find next occurrence (first not before upperEnd)
  let nextDate: Date | null = null;
  let countDate = 0;
  for (const d of occurrences) {
    if (allday ? d >= upperEnd : d > upperEnd) {
      nextDate = d;
      break;
    }
    countDate++;
  }
  // If no next, use last occurrence
  if (!nextDate) {
    if (occurrences.length > 1) {
      nextDate = occurrences[occurrences.length - 1]!;
      countDate = countDate - 1;
    } else if (occurrences.length === 1) {
      nextDate = occurrences[0]!;
    } else {
      nextDate = startDateTime;
      countDate = 1;
    }
  }
  return {
    nextOccurrence: nextDate,
    adjustedCount: rrule.COUNT ? (rrule.COUNT as number) - (countDate + skippedOccurrences) : count - (countDate + skippedOccurrences),
  };
}

// SHARED FUNCTION TO MAP SPECIFIC TIME ZONES
function map_special_time_zones(timeZone: string): string {
  if (!timeZone) return 'GMT';
  const mapping: { [key: string]: string } = {
    PT: 'PST8PDT',
    MT: 'MST7MDT',
    CT: 'CST6CDT',
    ET: 'EST5EDT',
    PST: 'PST8PDT',
    PDT: 'PST8PDT',
    MST: 'MST7MDT',
    MDT: 'MST7MDT',
    CST: 'CST6CDT',
    CDT: 'CST6CDT',
    EST: 'EST5EDT',
    EDT: 'EST5EDT',
    HDT: 'US/Hawaii',
    HST: 'US/Hawaii',
    AKST: 'US/Alaska',
    AKDT: 'US/Alaska',
    IST: 'Asia/Jerusalem',
    IDT: 'Asia/Jerusalem',
    AEST: 'Australia/Brisbane',
    AEDT: 'Australia/ACT',
    ACST: 'Australia/North',
    ACDT: 'Australia/South',
    NZST: 'NZ',
    NZDT: 'NZ',
    BST: 'Europe/London',
    AST: 'America/Puerto_Rico',
    ADT: 'Canada/Atlantic',
    WEST: 'Europe/Lisbon',
  };
  return mapping[`${timeZone.toUpperCase()}`] || 'GMT';
}

// timezones-ical-library supports the common US aliases, while Intl does not.
function map_time_zone_for_intl(timeZone: string): string {
  if (/^(PT|MT|CT|ET)$/i.test(timeZone)) {
    return map_special_time_zones(timeZone);
  }
  return timeZone;
}

export { generate_time, format_datetime, translate_via_time_zone, generate_timestring, parseRRule, getNextOccurrence, map_special_time_zones, map_time_zone_for_intl };
