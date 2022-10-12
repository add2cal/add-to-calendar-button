/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.17.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_ical_block } from '../node_modules/timezones-ical-library/npm_dist/mjs/index.js';
import {
  atcbVersion,
  isiOS,
  isAndroid,
  isChrome,
  isMobile,
  isWebView,
  isProblematicWebView,
  atcbDefaultTarget,
  atcbStates,
} from './atcb-globals.js';
import { atcb_toggle } from './atcb-control.js';
import {
  atcb_saved_hook,
  atcb_save_file,
  atcb_generate_time,
  atcb_format_datetime,
  atcb_secure_url,
  atcb_copy_to_clipboard,
} from './atcb-util.js';
import { atcb_create_modal } from './atcb-generate.js';
import { atcb_translate_hook } from './atcb-i18n.js';

// MIDDLEWARE FUNCTION TO GENERATE THE CALENDAR LINKS
function atcb_generate_links(type, data, subEvent = 'all', keyboardTrigger = false, multiDateModal = false) {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  // TMP WORKAROUND: redirect to iCal solution on mobile devices for msteams, ms365, and outlookcom, since the Microsoft web apps are buggy on mobile devices (see https://github.com/add2cal/add-to-calendar-button/discussions/113)
  if (isMobile() && (type == 'msteams' || type == 'ms365' || type == 'outlookcom')) {
    type = 'ical';
  }
  // for single-date events or if a specific subEvent is given, we can simply call the respective endpoints
  if (subEvent != 'all') {
    // for cancelled dates, we show a modal - except for iCal, where we can send Cancel-ics-files
    if (data.dates[`${subEvent}`].status == 'CANCELLED' && type != 'apple' && type != 'ical') {
      atcb_create_modal(
        data,
        'warning',
        atcb_translate_hook('Cancelled Date', data),
        atcb_translate_hook('Delete from Calendar', data),
        [],
        [],
        keyboardTrigger
      );
    } else {
      switch (type) {
        case 'apple':
        case 'ical':
          atcb_generate_ical(data, subEvent, keyboardTrigger);
          break;
        case 'google':
          atcb_generate_google(data.dates[`${subEvent}`]);
          break;
        case 'msteams':
          atcb_generate_msteams(data.dates[`${subEvent}`]);
          break;
        case 'ms365':
          atcb_generate_microsoft(data.dates[`${subEvent}`]);
          break;
        case 'outlookcom':
          atcb_generate_microsoft(data.dates[`${subEvent}`], 'outlook');
          break;
        case 'yahoo':
          atcb_generate_yahoo(data.dates[`${subEvent}`]);
          break;
      }
    }
    // we mark the clicked date - in the multi-date case, this would be one out of many
    const subEventButton = document.getElementById(data.identifier + '-' + type + '-' + (subEvent + 1));
    if (subEventButton) {
      subEventButton.classList.add('atcb-saved');
    }
    atcbStates[`${data.identifier}`][`${type}`][`${subEvent}`]++;
    const filteredStates = atcbStates[`${data.identifier}`][`${type}`].filter(function (value) {
      return value < 1;
    });
    if (filteredStates.length == 0) {
      document.getElementById(data.identifier).classList.add('atcb-saved');
      atcb_set_fully_successful(multiDateModal);
    }
    return;
  }
  // if not a single date case, we continue for multi-date
  atcb_generate_multidate_links(type, data, keyboardTrigger, multiDateModal);
}

function atcb_generate_multidate_links(type, data, keyboardTrigger, multiDateModal) {
  // in the multi-date event case, when all sub-events have no organizer AND are not cancelled, we can also go the short way (for iCal)
  if (
    (type == 'ical' || type == 'apple') &&
    data.dates.every(function (theSubEvent) {
      if (
        theSubEvent.status == 'CANCELLED' ||
        (theSubEvent.organizer != null && theSubEvent.organizer != '')
      ) {
        return false;
      }
      return true;
    })
  ) {
    atcb_generate_ical(data, 'all', keyboardTrigger);
    // we mark the whole event as clicked
    for (let i = 0; i < atcbStates[`${data.identifier}`][`${type}`].length; i++) {
      atcbStates[`${data.identifier}`][`${type}`][`${i}`]++;
    }
    document.getElementById(data.identifier).classList.add('atcb-saved');
    atcb_set_fully_successful(multiDateModal);
    return;
  }
  // for multi-date events in all other cases, we show an intermediate layer
  if (!multiDateModal) {
    const individualButtons = [type];
    for (let i = 0; i < data.dates.length; i++) {
      individualButtons.push(i + 1);
    }
    atcb_create_modal(
      data,
      type,
      atcb_translate_hook('MultiDate headline', data),
      atcb_translate_hook('MultiDate info', data),
      [],
      individualButtons,
      keyboardTrigger
    );
  }
}

function atcb_set_fully_successful(multiDateModal) {
  atcb_saved_hook();
  if (multiDateModal && document.querySelectorAll('.atcb-modal[data-modal-nr]').length < 2) {
    atcb_toggle('close');
  }
}

// FUNCTION TO GENERATE THE GOOGLE URL
// See specs at: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md (unofficial)
function atcb_generate_google(data) {
  const urlParts = [];
  urlParts.push('https://calendar.google.com/calendar/render?action=TEMPLATE');
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean', 'google');
  urlParts.push(
    'dates=' + encodeURIComponent(formattedDate.start) + '%2F' + encodeURIComponent(formattedDate.end)
  );
  // setting time zone if given and not GMT +/- something, since this is not supported by Google Calendar
  if (data.timeZone != null && data.timeZone != '' && !/GMT[+|-]\d{1,2}/i.test(data.timeZone)) {
    urlParts.push('ctz=' + data.timeZone);
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('text=' + encodeURIComponent(data.name));
  }
  const tmpDataDescription = [];
  if (data.description != null && data.description != '') {
    tmpDataDescription.push(data.description);
  }
  if (data.location != null && data.location != '') {
    urlParts.push('location=' + encodeURIComponent(data.location));
    // TODO: Find a better solution for the next temporary workaround.
    if (isiOS()) {
      // workaround to cover a bug, where, when using Google Calendar on an iPhone, the location is not recognized. So, for the moment, we simply add it to the description.
      if (tmpDataDescription.length > 0) {
        tmpDataDescription.push('<br><br>');
      }
      tmpDataDescription.push('&#128205;: ' + data.location);
    }
  }
  if (tmpDataDescription.length > 0) {
    urlParts.push('details=' + encodeURIComponent(tmpDataDescription.join()));
  }
  if (data.recurrence != null && data.recurrence != '') {
    urlParts.push('recur=' + encodeURIComponent(data.recurrence));
  }
  if (data.availability != null && data.availability != '') {
    const availabilityPart = (function () {
      if (data.availability == 'free') {
        return 'crm=AVAILABLE&trp=false';
      }
      return 'crm=BUSY&trp=true';
    })();
    urlParts.push(availabilityPart);
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}

// FUNCTION TO GENERATE THE YAHOO URL
// See specs at: TODO: add some documentation here, if it exists
function atcb_generate_yahoo(data) {
  const urlParts = [];
  urlParts.push('https://calendar.yahoo.com/?v=60');
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean');
  urlParts.push(
    'st=' + encodeURIComponent(formattedDate.start) + '&et=' + encodeURIComponent(formattedDate.end)
  );
  if (formattedDate.allday) {
    urlParts.push('dur=allday');
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('title=' + encodeURIComponent(data.name));
  }
  if (data.location != null && data.location != '') {
    urlParts.push('in_loc=' + encodeURIComponent(data.location));
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Yahoo does not support html tags in a stable way
    urlParts.push('desc=' + encodeURIComponent(data.descriptionHtmlFree));
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}

// FUNCTION TO GENERATE THE MICROSOFT 365 OR OUTLOOK WEB URL
// See specs at: TODO: add some documentation here, if it exists
function atcb_generate_microsoft(data, type = '365') {
  const urlParts = [];
  const basePath = '/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
  const baseUrl = (function () {
    if (type == 'outlook') {
      return 'https://outlook.live.com' + basePath;
    } else {
      return 'https://outlook.office.com' + basePath;
    }
  })();
  urlParts.push(baseUrl);
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  urlParts.push('startdt=' + encodeURIComponent(formattedDate.start));
  urlParts.push('enddt=' + encodeURIComponent(formattedDate.end));
  if (formattedDate.allday) {
    urlParts.push('allday=true');
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('subject=' + encodeURIComponent(data.name));
  }
  if (data.location != null && data.location != '') {
    urlParts.push('location=' + encodeURIComponent(data.location));
  }
  if (data.description != null && data.description != '') {
    urlParts.push('body=' + encodeURIComponent(data.description.replace(/\n/g, '<br>')));
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}

// FUNCTION TO GENERATE THE MICROSOFT TEAMS URL
// See specs at: https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links#deep-linking-to-the-scheduling-dialog
// Mind that this is still in development mode by Microsoft! Location, html tags and linebreaks in the description are not supported yet.
function atcb_generate_msteams(data) {
  const urlParts = [];
  const baseUrl = 'https://teams.microsoft.com/l/meeting/new?';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  urlParts.push('startTime=' + encodeURIComponent(formattedDate.start));
  urlParts.push('endTime=' + encodeURIComponent(formattedDate.end));
  // add details (if set)
  if (data.name != null && data.name != '') {
    urlParts.push('subject=' + encodeURIComponent(data.name));
  }
  let locationString = '';
  if (data.location != null && data.location != '') {
    locationString = encodeURIComponent(data.location);
    urlParts.push('location=' + locationString);
    locationString += ' // '; // preparing the workaround putting the location into the description, since the native field is not supported yet
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Teams does not support html tags
    urlParts.push('content=' + locationString + encodeURIComponent(data.descriptionHtmlFree));
  }
  // We also push the UID. It has no real effect, but at least becomes part of the url that way
  urlParts.push('uid=' + encodeURIComponent(data.uid));
  atcb_open_cal_url(urlParts.join('&'));
}

// FUNCTION TO OPEN THE URL
function atcb_open_cal_url(url) {
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE iCAL FILE (also for the Apple option)
// See specs at: https://www.rfc-editor.org/rfc/rfc5545.html
function atcb_generate_ical(data, subEvent = 'all', keyboardTrigger = false) {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent);
  }
  // define the right filename
  const filename = atcb_determine_ical_filename(data, subEvent);
  // check for a given explicit file (not if iOS and WebView - will be catched further down)
  if (!isiOS() || !isWebView()) {
    if (
      subEvent != 'all' &&
      data.dates[`${subEvent}`].icsFile != null &&
      data.dates[`${subEvent}`].icsFile != ''
    ) {
      atcb_save_file(data.dates[`${subEvent}`].icsFile, filename);
      return;
    }
    if (data.icsFile != null && data.icsFile != '') {
      atcb_save_file(data.icsFile, filename);
      return;
    }
  }
  // otherwise, generate one on the fly
  const now = new Date();
  const ics_lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
  ics_lines.push('PRODID:-// https://add-to-calendar-pro.com // button v' + atcbVersion + ' //EN');
  ics_lines.push('CALSCALE:GREGORIAN');
  // we set CANCEL, whenever the status says so
  // mind that in the multi-date case (where we create 1 ics file), it will always be PUBLISH
  if (subEvent == 'all') {
    ics_lines.push('METHOD:PUBLISH');
  } else {
    if (data.dates[`${subEvent}`].status != null && data.dates[`${subEvent}`].status == 'CANCELLED') {
      ics_lines.push('METHOD:CANCEL');
    } else {
      // for all other cases, we use REQUEST for organized/hosted events, ...
      if (data.dates[`${subEvent}`].organizer != null && data.dates[`${subEvent}`].organizer != '') {
        ics_lines.push('METHOD:REQUEST');
      } else {
        // and PUBLISH for events without a host
        ics_lines.push('METHOD:PUBLISH');
      }
    }
  }
  const usedTimeZones = [];
  const loopStart = (function () {
    if (subEvent != 'all') {
      return subEvent;
    }
    return 0;
  })();
  const loopEnd = (function () {
    if (subEvent != 'all') {
      return subEvent;
    }
    return data.dates.length - 1;
  })();
  for (let i = loopStart; i <= loopEnd; i++) {
    const formattedDate = atcb_generate_time(data.dates[`${i}`], 'clean', 'ical');
    // get the timezone addon string for dates and include time zone information, if set and if not allday (not necessary in that case)
    const timeAddon = (function () {
      if (formattedDate.allday) {
        return ';VALUE=DATE';
      }
      if (data.dates[`${i}`].timeZone != null && data.dates[`${i}`].timeZone != '') {
        const timeZoneBlock = tzlib_get_ical_block(data.dates[`${i}`].timeZone);
        if (!usedTimeZones.includes(data.dates[`${i}`].timeZone)) {
          ics_lines.push(timeZoneBlock[0]);
        }
        usedTimeZones.push(data.dates[`${i}`].timeZone);
        return ';' + timeZoneBlock[1];
      }
    })();
    ics_lines.push('BEGIN:VEVENT');
    ics_lines.push('UID:' + data.dates[`${i}`].uid);
    ics_lines.push('DTSTAMP:' + atcb_format_datetime(now, 'clean', true));
    ics_lines.push('DTSTART' + timeAddon + ':' + formattedDate.start);
    ics_lines.push('DTEND' + timeAddon + ':' + formattedDate.end);
    ics_lines.push('SUMMARY:' + data.dates[`${i}`].name.replace(/.{65}/g, '$&' + '\r\n ')); // making sure it does not exceed 75 characters per line
    if (data.dates[`${i}`].descriptionHtmlFree != null && data.dates[`${i}`].descriptionHtmlFree != '') {
      ics_lines.push(
        'DESCRIPTION:' +
          data.dates[`${i}`].descriptionHtmlFree.replace(/\n/g, '\\n').replace(/.{60}/g, '$&' + '\r\n ') // adjusting for intended line breaks + making sure it does not exceed 75 characters per line
      );
    }
    if (data.dates[`${i}`].description != null && data.dates[`${i}`].description != '') {
      ics_lines.push(
        'X-ALT-DESC;FMTTYPE=text/html:\r\n <!DOCTYPE HTML PUBLIC ""-//W3C//DTD HTML 3.2//EN"">\r\n <HTML><BODY>\r\n ' +
          data.dates[`${i}`].description.replace(/\n/g, '<br>').replace(/.{60}/g, '$&' + '\r\n ') +
          '\r\n </BODY></HTML>'
      );
    }
    if (data.dates[`${i}`].location != null && data.dates[`${i}`].location != '') {
      ics_lines.push('LOCATION:' + data.dates[`${i}`].location);
    }
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      ics_lines.push('ORGANIZER;CN=' + organizerParts[0] + ':MAILTO:' + organizerParts[1]);
    }
    if (data.recurrence != null && data.recurrence != '') {
      ics_lines.push(data.recurrence);
    }
    if (data.dates[`${i}`].availability != null && data.dates[`${i}`].availability != '') {
      const transpVal = (function () {
        if (data.dates[`${i}`].availability == 'free') {
          return 'TRANSPARENT';
        }
        return 'OPAQUE';
      })();
      ics_lines.push('TRANSP:' + transpVal);
    }
    ics_lines.push('SEQUENCE:' + data.dates[`${i}`].sequence);
    ics_lines.push('STATUS:' + data.dates[`${i}`].status);
    ics_lines.push('CREATED:' + data.created);
    ics_lines.push('LAST-MODIFIED:' + data.updated);
    ics_lines.push('END:VEVENT');
  }
  ics_lines.push('END:VCALENDAR');
  const dataUrl = (function (i) {
    // if we got to this point with an explicitely given iCal file, we are on an iOS device within an in-app browser (WebView). In this case, we use this as dataUrl
    if (data.dates[`${i}`].icsFile != null && data.dates[`${i}`].icsFile != '') {
      return data.dates[`${i}`].icsFile;
    }
    if (data.icsFile != null && data.icsFile != '') {
      return data.icsFile;
    }
    // otherwise, we generate it from the array
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics_lines.join('\r\n'));
  })();
  // in in-app browser cases (WebView), we offer a copy option, since the on-the-fly client side generation is usually not supported
  // for Android, we are more specific and only go for specific apps at the moment
  // for Chrome on iOS we basically do the same
  if ((isiOS() && isChrome()) || (isWebView() && (isiOS() || (isAndroid() && isProblematicWebView())))) {
    atcb_ical_copy_note(dataUrl, data, keyboardTrigger);
    return;
  }
  atcb_save_file(dataUrl, filename);
}

function atcb_determine_ical_filename(data, subEvent) {
  const filenameSuffix = (function () {
    if (subEvent != 'all' && subEvent != 0) {
      return '-' + parseInt(subEvent) + 1;
    }
    return '';
  })();
  if (data.iCalFileName != null && data.iCalFileName != '') {
    return data.iCalFileName + filenameSuffix;
  }
  if (data.icsFile != null && data.icsFile != '') {
    const filenamePart = data.icsFile.split('/').pop().split('.')[0];
    if (filenamePart != '') {
      return filenamePart + filenameSuffix;
    }
  }
  return 'event-to-save-in-my-calendar' + filenameSuffix;
}

function atcb_ical_copy_note(dataUrl, data, keyboardTrigger) {
  // putting the download url to the clipboard
  atcb_copy_to_clipboard(dataUrl);
  // creating the modal
  if (isiOS() && isChrome()) {
    atcb_create_modal(
      data,
      'warning',
      atcb_translate_hook('Crios iCal headline', data),
      atcb_translate_hook('Crios iCal info', data) +
        '<br>' +
        atcb_translate_hook('WebView iCal solution 1', data) +
        '<br>' +
        atcb_translate_hook('Crios iCal solution 2', data),
      [],
      [],
      keyboardTrigger
    );
    return;
  }
  atcb_create_modal(
    data,
    'warning',
    atcb_translate_hook('WebView iCal headline', data),
    atcb_translate_hook('WebView iCal info', data) +
      '<br>' +
      atcb_translate_hook('WebView iCal solution 1', data) +
      '<br>' +
      atcb_translate_hook('WebView iCal solution 2', data),
    [],
    [],
    keyboardTrigger
  );
}

export { atcb_generate_links };
