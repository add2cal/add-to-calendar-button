import { atcbIsMobile } from '../core/globals';
import { atcb_generate_time } from '../core/dates';
import { atcb_open_cal_url } from './ical';
import type { ATCBConfig, ATCBDateEntry } from '../types';

// FUNCTION TO GENERATE THE MICROSOFT TEAMS URL
// See specs at: https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-link-workflow?tabs=teamsjs-v2#deep-link-to-open-a-meeting-scheduling-dialog
// Mind that this is still in development mode by Microsoft! Location, html tags and linebreaks in the description are not supported yet.
function atcb_generate_msteams(data: ATCBConfig, date: ATCBDateEntry, subEvent: 'all' | number | string = 'all'): void {
  const urlParts: string[] = [];
  const baseUrl = 'https://teams.microsoft.com/l/meeting/new?';
  // generate and add date
  const formattedDate = atcb_generate_time(date, 'delimiters', 'msteams', true);
  // we need to encode the date, but not for all-day events on desktop to not encode the plus for the offset (somehow strange, but this all consists somehow of workarounds with the Microsoft Teams url scheme)...
  // TODO: optimize this, when Microsoft has fixed it
  if (!formattedDate.allday || atcbIsMobile() || data.fakeMobile) {
    urlParts.push('startTime=' + encodeURIComponent(formattedDate.start));
    urlParts.push('endTime=' + encodeURIComponent(formattedDate.end));
  } else {
    urlParts.push('startTime=' + formattedDate.start);
    urlParts.push('endTime=' + formattedDate.end);
  }
  // add details (if set)
  if (date.name && date.name !== '') {
    urlParts.push('subject=' + encodeURIComponent(date.name));
  }
  let locationString = '';
  if (date.location && date.location !== '') {
    locationString = date.location;
    locationString += ' // '; // preparing the workaround putting the location into the description, since the native field is not supported yet
    urlParts.push('location=' + encodeURIComponent(locationString));
  }
  if (date.descriptionHtmlFree && date.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Teams does not support html tags
    urlParts.push('content=' + encodeURIComponent(locationString + date.descriptionHtmlFree));
  }
  atcb_open_cal_url(data, 'msteams', baseUrl + urlParts.join('&'), false, subEvent);
}

export { atcb_generate_msteams };
