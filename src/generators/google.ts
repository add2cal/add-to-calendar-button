import { atcbIsMobile, atcbIsiOS, atcbIsAndroid, atcbIsWebView } from '../core/globals';
import { atcb_generate_time } from '../core/dates';
import { atcb_open_cal_url } from './ical';
import type { ATCBConfig, ATCBDateEntry } from '../types';

// GOOGLE SUBSCRIPTION
function atcb_subscribe_google(data: ATCBConfig, fileUrl: string): void {
  const baseUrl = 'https://calendar.google.com/calendar/u/0/r?cid=';
  const baseUrlApp = 'calendar.google.com/calendar?cid=';
  let isGoogleCalId = false;
  const newFileUrl = (function () {
    if (/^(?:webcal:\/\/|\/\/)calendar\.google\.com\/.*\?cid=/.test(fileUrl)) {
      isGoogleCalId = true;
      return fileUrl.replace(/^(.)*\?cid=/, '');
    }
    return encodeURIComponent(fileUrl);
  })();
  if ((atcbIsAndroid() || data.fakeAndroid) && isGoogleCalId) {
    if (!atcbIsWebView()) {
      const httpsUrl = baseUrl + newFileUrl;
      const fallback = encodeURIComponent(httpsUrl);
      const intentUrl = 'intent://' + baseUrlApp + newFileUrl + '#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=' + fallback + ';end';
      atcb_open_cal_url(data, 'google', intentUrl, true);
    } else {
      // In WebViews, avoid intent scheme and open the regular https URL
      atcb_open_cal_url(data, 'google', baseUrl + newFileUrl, true);
    }
    return;
  }
  atcb_open_cal_url(data, 'google', baseUrl + newFileUrl, true);
}

// FUNCTION TO GENERATE THE GOOGLE URL
// See specs at: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md (unofficial)
function atcb_generate_google(data: ATCBConfig, date: ATCBDateEntry, subEvent: 'all' | number | string = 'all'): void {
  const urlParts: string[] = [];
  if (atcbIsMobile() || data.fakeMobile) {
    urlParts.push('https://calendar.google.com/calendar/render?action=TEMPLATE&');
  } else {
    urlParts.push('https://calendar.google.com/calendar/r/eventedit?');
  }
  // generate and add date
  const formattedDate = atcb_generate_time(date, 'clean', 'google');
  urlParts.push('dates=' + encodeURIComponent(formattedDate.start) + '%2F' + encodeURIComponent(formattedDate.end));
  // setting time zone if given and not GMT +/- something, since this is not supported by Google Calendar
  // also do not set for all-day events, since this can lead to Google Calendar trying to adjust times
  if (date.timeZone && date.timeZone !== '' && !/GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|MET|MST|PST8PDT|WET|PST|PDT|MDT|CST|CDT|EDT|EEST|CEST|HST|HDT|AKST|AKDT|AST|ADT|AEST|AEDT|NZST|NZDT|IST|IDT|WEST|ACST|ACDT|BST/i.test(date.timeZone) && !formattedDate.allday) {
    urlParts.push('ctz=' + date.timeZone);
  }
  // add details (if set)
  if (date.name && date.name !== '') {
    urlParts.push('text=' + encodeURIComponent(date.name));
  }
  const tmpDataDescription: string[] = [];
  if (date.description && date.description !== '') {
    tmpDataDescription.push(date.description);
  }
  if (date.location && date.location !== '') {
    urlParts.push('location=' + encodeURIComponent(date.location));
    // TODO: Find a better solution for the next temporary workaround.
    if (atcbIsiOS() || data.fakeIOS) {
      // workaround to cover a bug, where, when using Google Calendar on an iPhone, the location is not recognized. So, for the moment, we simply add it to the description.
      if (tmpDataDescription.length > 0) {
        tmpDataDescription.push('<br><br>');
      }
      tmpDataDescription.push('&#128205;: ' + date.location);
    }
  }
  if (tmpDataDescription.length > 0) {
    urlParts.push('details=' + encodeURIComponent(tmpDataDescription.join('')));
  }
  if (date.recurrence && date.recurrence !== '') {
    urlParts.push('recur=' + encodeURIComponent(date.recurrence as string));
  }
  if (date.availability && date.availability !== '') {
    const availabilityPart = (function () {
      if (date.availability == 'free') {
        return 'crm=AVAILABLE&trp=false';
      }
      return 'crm=BUSY&trp=true';
    })();
    urlParts.push(availabilityPart);
  }
  let fullUrl = urlParts.join('&');
  if (atcbIsAndroid() || data.fakeAndroid) {
    // Avoid using intents inside WebViews; add a browser fallback for robustness
    if (!atcbIsWebView()) {
      const fallback = encodeURIComponent(fullUrl);
      fullUrl = 'intent://' + fullUrl.slice(8) + '#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url=' + fallback + ';end';
    }
  }
  atcb_open_cal_url(data, 'google', fullUrl, false, subEvent);
}

export { atcb_subscribe_google, atcb_generate_google };
