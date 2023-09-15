/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.4.2
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_ical_block } from 'timezones-ical-library';
import { atcbVersion, atcbIsMobile, atcbIsiOS, atcbIsAndroid, atcbIsSafari, atcbIsWebView, atcbIsProblematicWebView, atcbDefaultTarget, atcbStates } from './atcb-globals.js';
import { atcb_toggle } from './atcb-control.js';
import { atcb_saved_hook, atcb_save_file, atcb_generate_time, atcb_format_datetime, atcb_secure_url, atcb_copy_to_clipboard, atcb_rewrite_ical_text } from './atcb-util.js';
import { atcb_create_modal } from './atcb-generate.js';
import { atcb_translate_hook } from './atcb-i18n.js';

// MIDDLEWARE FUNCTION TO GENERATE THE CALENDAR LINKS
function atcb_generate_links(host, type, data, subEvent = 'all', keyboardTrigger = false, multiDateModal = false, skipDoubleLink = false) {
  // we differentiate between the type the user triggered and the type of link it shall activate
  let linkType = type;
  // the apple type would trigger the same as ical, for example
  if (type == 'apple') {
    linkType = 'ical';
  }
  // adjust for subEvent and case
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  // if this is a calendar subscription case, we can take the short route here
  if (data.subscribe) {
    atcb_generate_subscribe_links(host, linkType, data, keyboardTrigger);
    return;
  }
  // for single-date events or if a specific subEvent is given, we can simply call the respective endpoints
  if (subEvent != 'all') {
    // for cancelled dates, we show a modal - except for iCal, where we can send Cancel-ics-files
    if (data.dates[`${subEvent}`].status == 'CANCELLED' && linkType != 'ical') {
      atcb_create_modal(host, data, 'warning', atcb_translate_hook('date.status.cancelled', data), atcb_translate_hook('date.status.cancelled.cta', data), [], [], keyboardTrigger);
    } else {
      // in some cases, we want to inform the user about specifics for the link type, before actually following the link
      if (!skipDoubleLink) {
        if (atcbIsiOS() && linkType === 'google') {
          atcb_create_modal(
            host,
            data,
            'warning',
            '',
            atcb_translate_hook('modal.crios.google.text', data),
            [
              {
                label: atcb_translate_hook('continue', data),
                primary: true,
                type: '2timeslink',
              },
              { label: atcb_translate_hook('cancel', data) },
            ],
            [],
            keyboardTrigger,
            { type: type, id: subEvent + 1 },
          );
          return;
        }
      }
      // apart from that, we generate the link
      switch (linkType) {
        case 'ical': // also for apple (see above)
          atcb_generate_ical(host, data, subEvent, keyboardTrigger);
          break;
        case 'google':
          atcb_generate_google(data, data.dates[`${subEvent}`]);
          break;
        case 'msteams':
          atcb_generate_msteams(data, data.dates[`${subEvent}`]);
          break;
        case 'ms365':
          atcb_generate_microsoft(data, data.dates[`${subEvent}`]);
          break;
        case 'outlookcom':
          atcb_generate_microsoft(data, data.dates[`${subEvent}`], 'outlook');
          break;
        case 'yahoo':
          atcb_generate_yahoo(data, data.dates[`${subEvent}`]);
          break;
      }
    }
    // we mark the clicked date - in the multi-date case, this would be one out of many
    const modalHost = document.getElementById(data.identifier + '-modal-host');
    if (modalHost) {
      const subEventButton = modalHost.shadowRoot.getElementById(data.identifier + '-' + type + '-' + (subEvent + 1));
      if (subEventButton) {
        subEventButton.classList.add('atcb-saved');
      }
    }
    atcbStates[`${data.identifier}`][`${type}`][`${subEvent}`]++;
    const filteredStates = atcbStates[`${data.identifier}`][`${type}`].filter(function (value) {
      return value < 1;
    });
    if (filteredStates.length == 0) {
      atcb_set_fully_successful(host, data, multiDateModal);
    }
    return;
  }
  // if not a single date case, we continue for multi-date
  atcb_generate_multidate_links(host, type, linkType, data, keyboardTrigger, multiDateModal);
}

function atcb_generate_multidate_links(host, type, linkType, data, keyboardTrigger, multiDateModal) {
  // in the multi-date event case, when all subEvent have no organizer AND are not cancelled, we can also go the short way (for iCal)
  if (
    linkType == 'ical' &&
    data.dates.every(function (theSubEvent) {
      if (theSubEvent.status == 'CANCELLED' || (theSubEvent.organizer != null && theSubEvent.organizer != '')) {
        return false;
      }
      return true;
    })
  ) {
    atcb_generate_ical(host, data, 'all', keyboardTrigger);
    // we mark the whole event as clicked
    for (let i = 0; i < atcbStates[`${data.identifier}`][`${type}`].length; i++) {
      atcbStates[`${data.identifier}`][`${type}`][`${i}`]++;
    }
    atcb_set_fully_successful(host, data, multiDateModal);
    return;
  }
  // for multi-date events in all other cases, we show an intermediate layer
  if (!multiDateModal) {
    const individualButtons = [type];
    for (let i = 0; i < data.dates.length; i++) {
      individualButtons.push(i + 1);
    }
    atcb_create_modal(host, data, type, atcb_translate_hook('modal.multidate.h', data), atcb_translate_hook('modal.multidate.text', data), [], individualButtons, keyboardTrigger);
  }
}

function atcb_generate_subscribe_links(host, linkType, data, keyboardTrigger) {
  const adjustedFileUrl = data.icsFile.replace('https://', 'webcal://');
  switch (linkType) {
    case 'ical': // also for apple (see above)
      if (atcbIsAndroid() || data.fakeAndroid) {
        atcb_subscribe_ical(data, data.icsFile);
        break;
      }
      atcb_subscribe_ical(data, adjustedFileUrl);
      break;
    case 'google':
      atcb_subscribe_google(data, adjustedFileUrl);
      break;
    case 'ms365':
      atcb_subscribe_microsoft(data, adjustedFileUrl, data.name);
      break;
    case 'outlookcom':
      atcb_subscribe_microsoft(data, adjustedFileUrl, data.name, 'outlook');
      break;
    case 'yahoo':
      if (data.proxy) {
        atcb_open_cal_url(data, 'yahoo', '', true);
        return;
      }
      atcb_copy_to_clipboard(data.icsFile);
      atcb_create_modal(
        host,
        data,
        'yahoo',
        atcb_translate_hook('modal.subscribe.yahoo.h', data),
        atcb_translate_hook('modal.clipboard.text', data) + '<br>' + atcb_translate_hook('modal.subscribe.yahoo.text', data),
        [
          {
            label: atcb_translate_hook('modal.subscribe.yahoo.button', data),
            primary: true,
            type: 'yahoo2nd',
            href: 'https://www.yahoo.com/calendar',
          },
          { label: atcb_translate_hook('cancel', data) },
        ],
        [],
        keyboardTrigger,
      );
      return;
    case 'yahoo2nd':
      atcb_copy_to_clipboard(data.icsFile);
      atcb_create_modal(
        host,
        data,
        'yahoo',
        atcb_translate_hook('modal.subscribe.yahoo.h', data),
        atcb_translate_hook('modal.clipboard.text', data) + '<br>' + atcb_translate_hook('modal.subscribe.yahoo.text', data),
        [
          {
            label: atcb_translate_hook('modal.subscribe.yahoo.button', data),
            type: 'none',
            href: 'https://www.yahoo.com/calendar',
          },
          { label: atcb_translate_hook('cancel', data) },
        ],
        [],
        keyboardTrigger,
      );
      return;
  }
  // mark as successful (except for the Yahoo case, with returned)
  atcb_set_fully_successful(host, data);
}

function atcb_set_fully_successful(host, data, multiDateModal = false) {
  const trigger = host.getElementById(data.identifier);
  if (trigger) {
    trigger.classList.add('atcb-saved');
  }
  atcb_saved_hook(host, data);
  if (multiDateModal && host.querySelectorAll('.atcb-modal[data-modal-nr]').length < 2) {
    atcb_toggle(host, 'close');
  }
}

// GENERATING SUBSCRIPTION URLS AND FILES

// ICAL
function atcb_subscribe_ical(data, fileUrl) {
  atcb_open_cal_url(data, 'ical', fileUrl, true);
}

// GOOGLE
function atcb_subscribe_google(data, fileUrl) {
  const baseUrl = 'https://calendar.google.com/calendar/r?cid=';
  const newFileUrl = (function () {
    const fileUrlRegex = /^(https?:\/\/|webcal:\/\/|\/\/)calendar\.google\.com\//;
    if (fileUrlRegex.test(fileUrl)) {
      return fileUrl.replace(/^(.)*\?cid=/, '');
    }
    return encodeURIComponent(fileUrl);
  })();
  atcb_open_cal_url(data, 'google', baseUrl + newFileUrl, true);
}

// MICROSOFT
function atcb_subscribe_microsoft(data, fileUrl, calName, type = '365') {
  const urlParts = [];
  const baseUrl = (function () {
    if (type == 'outlook') {
      return 'https://outlook.live.com/calendar/0/addfromweb/?';
    } else {
      return 'https://outlook.office.com/calendar/0/addfromweb/?';
    }
  })();
  urlParts.push('url=' + encodeURIComponent(fileUrl));
  urlParts.push('name=' + encodeURIComponent(calName));
  atcb_open_cal_url(data, type, baseUrl + urlParts.join('&'), true);
}

// GENERATING DEFAULT URLS AND FILES

// FUNCTION TO GENERATE THE GOOGLE URL
// See specs at: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md (unofficial)
function atcb_generate_google(data, date) {
  const urlParts = [];
  urlParts.push('https://calendar.google.com/calendar/render?action=TEMPLATE');
  // generate and add date
  const formattedDate = atcb_generate_time(date, 'clean', 'google');
  urlParts.push('dates=' + encodeURIComponent(formattedDate.start) + '%2F' + encodeURIComponent(formattedDate.end));
  // setting time zone if given and not GMT +/- something, since this is not supported by Google Calendar
  // also do not set for all-day events, since this can lead to Google Calendar trying to adjust times
  if (date.timeZone != null && date.timeZone != '' && !/(GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|EST5EDT|MET|MST|MST7MDT|PST8PDT|WET)/i.test(date.timeZone) && !formattedDate.allday) {
    urlParts.push('ctz=' + date.timeZone);
  }
  // add details (if set)
  if (date.name != null && date.name != '') {
    urlParts.push('text=' + encodeURIComponent(date.name));
  }
  const tmpDataDescription = [];
  if (date.description != null && date.description != '') {
    tmpDataDescription.push(date.description);
  }
  if (date.location != null && date.location != '') {
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
  if (date.recurrence != null && date.recurrence != '') {
    urlParts.push('recur=' + encodeURIComponent(date.recurrence));
  }
  if (date.availability != null && date.availability != '') {
    const availabilityPart = (function () {
      if (date.availability == 'free') {
        return 'crm=AVAILABLE&trp=false';
      }
      return 'crm=BUSY&trp=true';
    })();
    urlParts.push(availabilityPart);
  }
  atcb_open_cal_url(data, 'google', urlParts.join('&'));
}

// FUNCTION TO GENERATE THE YAHOO URL
// See specs at: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/yahoo.md (unofficial)
function atcb_generate_yahoo(data, date) {
  const urlParts = [];
  urlParts.push('https://calendar.yahoo.com/?v=60');
  // generate and add date
  const formattedDate = atcb_generate_time(date, 'clean');
  urlParts.push('st=' + encodeURIComponent(formattedDate.start) + '&et=' + encodeURIComponent(formattedDate.end));
  if (formattedDate.allday) {
    urlParts.push('dur=allday');
  }
  // add details (if set)
  if (date.name != null && date.name != '') {
    urlParts.push('title=' + encodeURIComponent(date.name));
  }
  if (date.location != null && date.location != '') {
    urlParts.push('in_loc=' + encodeURIComponent(date.location));
  }
  if (date.descriptionHtmlFree != null && date.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Yahoo does not support html tags in a stable way
    urlParts.push('desc=' + encodeURIComponent(date.descriptionHtmlFree));
  }
  atcb_open_cal_url(data, 'yahoo', urlParts.join('&'));
}

// FUNCTION TO GENERATE THE MICROSOFT 365 OR OUTLOOK WEB URL
// See specs at: TODO: add some documentation here, if it exists
function atcb_generate_microsoft(data, date, type = '365') {
  const urlParts = [];
  const basePath = (function () {
    // tmp workaround to reflect the fact that Microsoft is routing mobile traffic differently
    // TODO: remove this, when Microsoft has fixed this
    if (atcbIsMobile() || data.fakeMobile) {
      return '/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
    }
    return '/calendar/action/compose?rru=addevent';
  })();
  const baseUrl = (function () {
    if (type == 'outlook') {
      return 'https://outlook.live.com' + basePath;
    } else {
      return 'https://outlook.office.com' + basePath;
    }
  })();
  urlParts.push(baseUrl);
  // generate and add date
  const formattedDate = atcb_generate_time(date, 'delimiters', 'microsoft');
  urlParts.push('startdt=' + formattedDate.start);
  urlParts.push('enddt=' + formattedDate.end);
  if (formattedDate.allday) {
    urlParts.push('allday=true');
  }
  // add details (if set)
  if (date.name != null && date.name != '') {
    urlParts.push('subject=' + encodeURIComponent(date.name));
  }
  if (date.location != null && date.location != '') {
    urlParts.push('location=' + encodeURIComponent(date.location));
  }
  if (date.description != null && date.description != '') {
    urlParts.push('body=' + encodeURIComponent(date.description));
  }
  atcb_open_cal_url(data, type, urlParts.join('&'));
}

// FUNCTION TO GENERATE THE MICROSOFT TEAMS URL
// See specs at: https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-link-workflow?tabs=teamsjs-v2#deep-link-to-open-a-meeting-scheduling-dialog
// Mind that this is still in development mode by Microsoft! Location, html tags and linebreaks in the description are not supported yet.
function atcb_generate_msteams(data, date) {
  const urlParts = [];
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
  if (date.name != null && date.name != '') {
    urlParts.push('subject=' + encodeURIComponent(date.name));
  }
  let locationString = '';
  if (date.location != null && date.location != '') {
    locationString = encodeURIComponent(date.location);
    urlParts.push('location=' + locationString);
    locationString += ' // '; // preparing the workaround putting the location into the description, since the native field is not supported yet
  }
  if (date.descriptionHtmlFree != null && date.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Teams does not support html tags
    urlParts.push('content=' + locationString + encodeURIComponent(date.descriptionHtmlFree));
  }
  atcb_open_cal_url(data, 'msteams', baseUrl + urlParts.join('&'));
}

// FUNCTION TO OPEN THE URL
function atcb_open_cal_url(data, type, url, subscribe = false, target = '') {
  if (target == '') {
    target = atcbDefaultTarget;
  }
  if (atcb_secure_url(url)) {
    if (data.proxy && data.proKey && data.proKey != '') {
      const urlType = subscribe ? 's' : 'o';
      const query = url ? '?url=' + encodeURIComponent(url) : '';
      url = 'https://caldn.net/' + data.proKey + '/' + urlType + '/' + type + query;
      if (!atcb_secure_url(url)) {
        return;
      }
    }
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const newTab = window.open(url, target);
    if (newTab) {
      newTab.focus();
    }
  }
}

// FUNCTION TO GENERATE THE iCAL FILE (also for apple - see above)
// See specs at: https://www.rfc-editor.org/rfc/rfc5545.html
function atcb_generate_ical(host, data, subEvent = 'all', keyboardTrigger = false) {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent);
  }
  // define the right filename
  const filename = atcb_determine_ical_filename(data, subEvent);
  // check for a given explicit file...
  const givenIcsFile = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].icsFile != null && data.dates[`${subEvent}`].icsFile != '') {
      return data.dates[`${subEvent}`].icsFile;
    }
    if (data.icsFile != null && data.icsFile != '') {
      return data.icsFile;
    }
    return '';
  })();
  // if we are in proxy mode, we can directly redirect
  if (givenIcsFile && givenIcsFile !== '' && data.proxy) {
    atcb_open_cal_url(data, 'ical', givenIcsFile);
    return;
  }
  // else, we directly load it (not if iOS and WebView - will be catched further down - except it is explicitely bridged)
  if (givenIcsFile != '' && (!atcbIsiOS() || !atcbIsWebView() || data.bypassWebViewCheck == true)) {
    // replace the protocol at givenIcsFile (https or http) with webcal for non-Safari on iOS browsers. Opens the subscription dialog, but best we get atm
    if (atcbIsiOS() && !atcbIsSafari()) {
      atcb_save_file(givenIcsFile.replace(/^https?:\/\//, 'webcal://'), filename);
      return;
    }
    atcb_save_file(givenIcsFile, filename);
    return;
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
    ics_lines.push('SUMMARY:' + atcb_rewrite_ical_text(data.dates[`${i}`].name, true));
    if (data.dates[`${i}`].descriptionHtmlFreeICal != null && data.dates[`${i}`].descriptionHtmlFreeICal != '') {
      ics_lines.push('DESCRIPTION:' + atcb_rewrite_ical_text(data.dates[`${i}`].descriptionHtmlFreeICal, true));
    }
    if (data.dates[`${i}`].description != null && data.dates[`${i}`].description != '') {
      ics_lines.push('X-ALT-DESC;FMTTYPE=text/html:\r\n <!DOCTYPE HTML PUBLIC ""-//W3C//DTD HTML 3.2//EN"">\r\n <HTML><BODY>\r\n ' + atcb_rewrite_ical_text(data.dates[`${i}`].description, true) + '\r\n </BODY></HTML>');
    }
    if (data.dates[`${i}`].location != null && data.dates[`${i}`].location != '') {
      ics_lines.push('LOCATION:' + atcb_rewrite_ical_text(data.dates[`${i}`].location, true));
    }
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      ics_lines.push('ORGANIZER;CN="' + atcb_rewrite_ical_text(organizerParts[0], false, true) + '":MAILTO:' + organizerParts[1]);
    }
    if (data.dates[`${i}`].attendee != null && data.dates[`${i}`].attendee != '') {
      const attendeeParts = data.dates[`${i}`].attendee.split('|');
      ics_lines.push('ATTENDEE;ROLE=REQ-PARTICIPANT;CN="' + atcb_rewrite_ical_text(attendeeParts[0], false, true) + '":MAILTO:' + attendeeParts[1]);
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
  const dataUrl = (function () {
    // if we got to this point with an explicitely given iCal file, we are on an iOS device (but at some wrong environment). In this case, we use this as dataUrl to then show a modal
    if (givenIcsFile != '') {
      return givenIcsFile;
    }
    // otherwise, we generate it from the array
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics_lines.join('\r\n'));
  })();
  // in in-app browser cases (WebView), we offer a copy option, since the on-the-fly client side generation is usually not supported
  // for Android, we are more specific than with iOS and only go for specific apps at the moment
  // for Chrome on iOS we basically do the same
  if ((atcbIsiOS() && !atcbIsSafari()) || (atcbIsWebView() && (atcbIsiOS() || (atcbIsAndroid() && atcbIsProblematicWebView())))) {
    atcb_ical_copy_note(host, dataUrl, data, keyboardTrigger);
    return;
  }
  // save the file dialog in all other cases
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

function atcb_ical_copy_note(host, dataUrl, data, keyboardTrigger) {
  // putting the download url to the clipboard
  atcb_copy_to_clipboard(dataUrl);
  // creating the modal
  if (atcbIsiOS() && !atcbIsSafari()) {
    atcb_create_modal(
      host,
      data,
      'warning',
      atcb_translate_hook('modal.opensafari.ical.h', data),
      atcb_translate_hook('modal.opensafari.ical.text', data) + '<br>' + atcb_translate_hook('modal.clipboard.text', data) + '<br>' + atcb_translate_hook('modal.opensafari.ical.steps', data),
      [],
      [],
      keyboardTrigger,
    );
    return;
  }
  atcb_create_modal(host, data, 'warning', atcb_translate_hook('modal.webview.ical.h', data), atcb_translate_hook('modal.webview.ical.text', data) + '<br>' + atcb_translate_hook('modal.clipboard.text', data) + '<br>' + atcb_translate_hook('modal.webview.ical.steps', data), [], [], keyboardTrigger);
}

export { atcb_generate_links, atcb_set_fully_successful };
