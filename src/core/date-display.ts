import { generate_time, map_special_time_zones } from './dates';
import { decorate_data_dates } from './decorate-dates';
import type { ATCBDateEntry, ATCBDateEntryInput } from '../types';

function generate_timestring(dates: ATCBDateEntryInput[], language = 'en', subEvent: 'all' | number = 'all', decorate = false, browserTimeOverride = false, enforceYear = false, hideTimeZone = false): string[] {
  if (decorate) {
    // if this function gets called directly, we might want to decorate raw data first
    dates = decorate_data_dates({ dates: dates }).dates!;
  }
  let timeZoneInfoStart: string, timeZoneInfoEnd: string;
  let timeZoneDisplayStart: string, timeZoneDisplayEnd: string;
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
    timeZoneDisplayStart = browserTimeOverride ? browserTimezone : (dates[0] as ATCBDateEntry).timeZoneDisplay || timeZoneInfoStart;
    timeZoneDisplayEnd = browserTimeOverride ? browserTimezone : (dates[dates.length - 1] as ATCBDateEntry).timeZoneDisplay || timeZoneInfoEnd;
  } else {
    // we are looking at 1 or many sub-events, but we consider only one specific
    formattedTimeStart = generate_time(dates[`${subEvent}`]! as ATCBDateEntry);
    formattedTimeEnd = formattedTimeStart;
    timeZoneInfoStart = browserTimeOverride ? browserTimezone : dates[`${subEvent}`]!.timeZone!;
    timeZoneInfoEnd = timeZoneInfoStart;
    timeZoneDisplayStart = browserTimeOverride ? browserTimezone : (dates[`${subEvent}`] as ATCBDateEntry).timeZoneDisplay || timeZoneInfoStart;
    timeZoneDisplayEnd = timeZoneDisplayStart;
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
      timeZoneInfoStringStart = '(' + timeZoneDisplayStart + ')';
    }
    if ((!formattedTimeEnd.allday && browserTimezone !== timeZoneInfoEnd) || timeZoneInfoStart !== timeZoneInfoEnd) {
      timeZoneInfoStringEnd = '(' + timeZoneDisplayEnd + ')';
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
  timeZoneInfo = map_special_time_zones(timeZoneInfo);
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

export { generate_timestring };
