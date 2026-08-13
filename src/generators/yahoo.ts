import { generate_time } from '../core/dates';
import { open_cal_url } from './ical';
import type { ATCBConfig, ATCBDateEntry } from '../types';

// FUNCTION TO GENERATE THE YAHOO URL
// See specs at: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/yahoo.md (unofficial)
function generate_yahoo(data: ATCBConfig, date: ATCBDateEntry, subEvent: 'all' | number | string = 'all'): void {
  const urlParts: string[] = [];
  urlParts.push('https://calendar.yahoo.com/?v=60');
  // generate and add date
  const formattedDate = generate_time(date, 'clean');
  if (formattedDate.allday) {
    if (formattedDate.start === formattedDate.end) {
      urlParts.push('dur=allday&st=' + encodeURIComponent(formattedDate.start)); // for all-day events, we may only set the start date
    } else {
      // however, if it spans multiple days, we need to set a time instead of all-day
      // therefore, we copy the data object, add startTime "00:00" and endTime "23:59" and generate the time again with timeZone being set to the user's timeZone
      // TODO: Remove this workaround, when Yahoo allows all-day events spanning multiple days
      const allDayDate = JSON.parse(JSON.stringify(date));
      allDayDate.startTime = '00:00';
      allDayDate.endTime = '23:59';
      allDayDate.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formattedAllDayDate = generate_time(allDayDate, 'clean');
      urlParts.push('st=' + encodeURIComponent(formattedAllDayDate.start) + '&et=' + encodeURIComponent(formattedAllDayDate.end));
    }
  } else {
    urlParts.push('st=' + encodeURIComponent(formattedDate.start) + '&et=' + encodeURIComponent(formattedDate.end));
  }
  // add details (if set)
  if (date.name && date.name !== '') {
    urlParts.push('title=' + encodeURIComponent(date.name));
  }
  if (date.location && date.location !== '') {
    urlParts.push('in_loc=' + encodeURIComponent(date.location));
  }
  if (date.descriptionHtmlFree && date.descriptionHtmlFree !== '') {
    // using descriptionHtmlFree instead of description, since Yahoo does not support html tags in a stable way
    urlParts.push('desc=' + encodeURIComponent(date.descriptionHtmlFree as string));
  }
  open_cal_url(data, 'yahoo', urlParts.join('&'), false, subEvent);
}

export { generate_yahoo };
