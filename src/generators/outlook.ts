import { isMobile } from '../core/globals';
import { generate_time } from '../core/dates';
import { open_cal_url } from './ical';
import type { ATCBConfig, ATCBDateEntry } from '../types';

// MICROSOFT SUBSCRIPTION (MS365 AND OUTLOOK.COM)
function subscribe_microsoft(data: ATCBConfig, fileUrl: string, calName: string, type = 'ms365'): void {
  const urlParts: string[] = [];
  const baseUrl = (function () {
    if (type == 'outlookcom') {
      return 'https://outlook.live.com/calendar/0/addfromweb/?';
    } else {
      return 'https://outlook.office.com/calendar/0/addfromweb/?';
    }
  })();
  urlParts.push('url=' + encodeURIComponent(fileUrl));
  urlParts.push('name=' + encodeURIComponent(calName));
  open_cal_url(data, type, baseUrl + urlParts.join('&'), true);
}

// FUNCTION TO GENERATE THE MICROSOFT 365 OR OUTLOOK WEB URL
// See specs at: TODO: add some documentation here, if it exists
function generate_microsoft(data: ATCBConfig, date: ATCBDateEntry, subEvent: 'all' | number | string = 'all', type = 'ms365'): void {
  const urlParts: string[] = [];
  const basePath = (function () {
    // tmp workaround to reflect the fact that Microsoft is routing mobile traffic differently
    // TODO: remove this, when Microsoft has fixed this
    if (isMobile() || data.fakeMobile) {
      return '/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
    }
    return '/calendar/0/action/compose?rru=addevent';
  })();
  const baseUrl = (function () {
    if (type == 'outlookcom') {
      return 'https://outlook.live.com' + basePath;
    } else {
      return 'https://outlook.office.com' + basePath;
    }
  })();
  urlParts.push(baseUrl);
  // generate and add date
  const formattedDate = generate_time(date, 'delimiters', 'microsoft');
  urlParts.push('startdt=' + formattedDate.start);
  urlParts.push('enddt=' + formattedDate.end);
  if (formattedDate.allday) {
    urlParts.push('allday=true');
  }
  // add details (if set)
  if (date.name && date.name !== '') {
    urlParts.push('subject=' + encodeURIComponent(date.name));
  }
  if (date.location && date.location !== '') {
    urlParts.push('location=' + encodeURIComponent(date.location));
  }
  if (date.description && date.description !== '') {
    urlParts.push('body=' + encodeURIComponent(date.description));
  }
  open_cal_url(data, type, urlParts.join('&'), false, subEvent);
}

export { subscribe_microsoft, generate_microsoft };
