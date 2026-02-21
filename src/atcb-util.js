/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.13.6
 *  Creator: Jens Kuerschner (https://jekuer.com)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_offset } from 'timezones-ical-library';
import { atcbIsMobile, atcbIsiOS, atcbDefaultTarget } from './atcb-globals.js';
import { atcb_log_event } from './atcb-event.js';
import { atcbStates } from './atcb-globals.js';
import { atcb_generate_ty } from './atcb-generate-pro.js';
import { atcb_decorate_data_dates } from './atcb-decorate.js';

// SHARED FUNCTION HOOK FOR WHEN EVENT GOT SAVED
function atcb_saved_hook(host, data) {
  // log event
  atcb_log_event('success', data.identifier, data.identifier);
  // trigger ty modal, if given
  if (data.ty && typeof atcb_generate_ty === 'function') {
    setTimeout(() => {
      atcb_generate_ty(host, data);
    }, 1000);
  }
}

// SHARED FUNCTION TO SAVE A FILE
function atcb_save_file(file, filename) {
  try {
    const save = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save.rel = 'noopener';
    save.href = file;
    // not using default target here, since this needs to happen _self on iOS (abstracted to mobile in general) and _blank at Firefox (abstracted to other setups) due to potential cross-origin restrictions
    if (atcbIsMobile()) {
      save.target = '_self';
    } else {
      save.target = '_blank';
    }
    save.download = filename + '.ics';
    const evt = new MouseEvent('click', {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: false,
    });
    save.dispatchEvent(evt);
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  } catch (e) {
    console.error(e);
  }
}

// SHARED FUNCTION TO GENERATE A TIME STRING
function atcb_generate_time(data, style = 'delimiters', targetCal = 'general', addTimeZoneOffset = false) {
  if (data.startTime && data.startTime !== '' && data.endTime && data.endTime !== '') {
    // for the input, we assume GMT/UTC per default
    const newStartDate = new Date(data.startDate + 'T' + data.startTime + ':00.000+00:00');
    // we re-adjust the endDate for the case where the time string generation gets rather called directly
    if (!data.endDate) data.endDate = data.startDate;
    const newEndDate = new Date(data.endDate + 'T' + data.endTime + ':00.000+00:00');
    const durationMS = newEndDate - newStartDate;
    const durationHours = Math.floor(durationMS / 1000 / 60 / 60);
    const durationMinutes = Math.floor(((durationMS - durationHours * 60 * 60 * 1000) / 1000 / 60) % 60);
    const durationString = (function () {
      if (durationHours < 10) {
        return '0' + durationHours + ':' + ('0' + durationMinutes).slice(-2);
      }
      return durationHours + ':' + ('0' + durationMinutes).slice(-2);
    })();
    // (see https://tz.add-to-calendar-technology.com/api/zones.json for available TZ names)
    if ((targetCal == 'ical' || targetCal == 'google') && !/GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|MET|MST|PST8PDT|WET|PST|PDT|MDT|CST|CDT|EDT|EEST|CEST|HST|HDT|AKST|AKDT|AST|ADT|AEST|AEDT|NZST|NZDT|IST|IDT|WEST|ACST|ACDT|BST/i.test(data.timeZone)) {
      // in the iCal or Google case, we simply return and cut off the Z. Google does not support GMT +/- time zones (and we also adjust ical as it can be used for Google calendar).
      // everything else will be done by injecting the VTIMEZONE block at the iCal function
      return {
        start: atcb_format_datetime(newStartDate, 'clean', true, true),
        end: atcb_format_datetime(newEndDate, 'clean', true, true),
        duration: durationString,
        allday: false,
      };
    }
    // we get the correct offset via the timeZones iCal Library
    const offsetStart = tzlib_get_offset(data.timeZone, data.startDate, data.startTime);
    const offsetEnd = tzlib_get_offset(data.timeZone, data.endDate, data.endTime);
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
    const calcOffsetStart = parseInt(offsetStart[0] + 1) * -1 * ((parseInt(offsetStart.substring(1, 3)) * 60 + parseInt(offsetStart.substring(3, 5))) * 60 * 1000);
    const calcOffsetEnd = parseInt(offsetEnd[0] + 1) * -1 * ((parseInt(offsetEnd.substring(1, 3)) * 60 + parseInt(offsetEnd.substring(3, 5))) * 60 * 1000);
    newStartDate.setTime(newStartDate.getTime() + calcOffsetStart);
    newEndDate.setTime(newEndDate.getTime() + calcOffsetEnd);
    // return formatted data
    return {
      start: atcb_format_datetime(newStartDate, style),
      end: atcb_format_datetime(newEndDate, style),
      duration: durationString,
      allday: false,
    };
  } else {
    // would be an allday event then
    const startDate = data.startDate.split('-');
    const endDate = data.endDate ? data.endDate.split('-') : startDate;
    // we set 12 o clock as time to prevent Daylight saving time to interfere with any calculation here
    const newStartDate = new Date(Date.UTC(startDate[0], startDate[1] - 1, startDate[2], 12, 0, 0));
    const newEndDate = new Date(Date.UTC(endDate[0], endDate[1] - 1, endDate[2], 12, 0, 0));
    // increment the end day by 1 for Google Calendar, iCal, and Microsoft (but only if mobile, since desktop does not need this)
    // TODO: remove Microsoft from this list as soon as they fixed their bugs
    if (targetCal === 'google' || (targetCal === 'microsoft' && !atcbIsMobile()) || targetCal === 'msteams' || targetCal === 'ical') {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }
    // return formatted data
    // for ms teams, we need to remove the Z as well and add the time zone offset +00:00 instead
    // but only on desktop - on mobile devices, we add time information in the user's time zone
    // TODO: optimize this as soon as Microsoft fixed their bugs
    if (targetCal === 'msteams') {
      if (atcbIsMobile()) {
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
          start: atcb_format_datetime(newStartDate, style, false, true) + 'T00:00:00' + formattedOffset,
          end: atcb_format_datetime(newEndDate, style, false, true) + 'T00:00:00' + formattedOffset,
          allday: true,
        };
      }
      return {
        start: atcb_format_datetime(newStartDate, style, false, true) + '+00:00',
        end: atcb_format_datetime(newEndDate, style, false, true) + '+00:00',
        allday: true,
      };
    }
    // for all others, it is easier
    return {
      start: atcb_format_datetime(newStartDate, style, false),
      end: atcb_format_datetime(newEndDate, style, false),
      allday: true,
    };
  }
}

function atcb_format_datetime(datetime, style = 'delimiters', includeTime = true, removeZ = false) {
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

function offsetToMilliseconds(offset) {
  const sign = offset[0] === '+' ? 1 : -1;
  const hours = parseInt(offset.substring(1, 3), 10);
  const minutes = parseInt(offset.substring(3, 5), 10);
  const totalMinutes = (hours * 60 + minutes) * sign;
  const milliseconds = totalMinutes * 60000;
  return milliseconds;
}

function atcb_translate_via_time_zone(date, time, baseTimeZone, targetTimeZone) {
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
  return ([date, time] = dateInTargetTimeZone.split(', '));
}

function atcb_generate_timestring(dates, language = 'en', subEvent = 'all', decorate = false, browserTimeOverride = false, enforceYear = false, hideTimeZone = false) {
  if (decorate) {
    // if this function gets called directly, we might want to decorate raw data first
    dates = atcb_decorate_data_dates({ dates: dates }).dates;
  }
  let startDateInfo, endDateInfo, timeZoneInfoStart, timeZoneInfoEnd;
  let formattedTimeStart = {};
  let formattedTimeEnd = {};
  let timeBlocks = [];
  let timeZoneInfoStringStart = '';
  let timeZoneInfoStringEnd = '';
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (subEvent === 'all') {
    // we are looking at multiple sub-events, which should be considered all together
    formattedTimeStart = atcb_generate_time(dates[0]);
    formattedTimeEnd = atcb_generate_time(dates[dates.length - 1]);
    timeZoneInfoStart = browserTimeOverride ? browserTimezone : dates[0].timeZone;
    timeZoneInfoEnd = browserTimeOverride ? browserTimezone : dates[dates.length - 1].timeZone;
  } else {
    // we are looking at 1 or many sub-events, but we consider only one specific
    formattedTimeStart = atcb_generate_time(dates[`${subEvent}`]);
    formattedTimeEnd = formattedTimeStart;
    timeZoneInfoStart = browserTimeOverride ? browserTimezone : dates[`${subEvent}`].timeZone;
    timeZoneInfoEnd = timeZoneInfoStart;
  }
  startDateInfo = new Date(formattedTimeStart.start);
  endDateInfo = new Date(formattedTimeEnd.end);
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
        if (dates[`${i}`].location && dates[`${i}`].location !== '') {
          if (magicLocationPhrases.includes(dates[`${i}`].location.toLowerCase().trim())) {
            return true;
          }
        }
        return false;
      })();
      if (!magicLocation && !dates[`${i}`].onlineEvent) {
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
      let timeString = '';
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
      let timeString = '';
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

function get_format_options(timeZoneInfo, dropYear = false, language = 'en') {
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

// SHARED FUNCTION TO SECURE DATA
function atcb_secure_content(data, isJSON = true) {
  // strip HTML tags (especially since stupid Safari adds stuff) - except for <br>
  const toClean = isJSON ? JSON.stringify(data) : data.toString();
  const cleanedUp = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    return JSON.parse(cleanedUp);
  } else {
    return cleanedUp;
  }
}

// SHARED FUNCTION TO SECURE URLS
function atcb_secure_url(url, throwError = true) {
  if (url && url.match(/((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi)) {
    if (throwError) {
      console.error('Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!');
    }
    return false;
  } else {
    return true;
  }
}

// SHARED FUNCTION TO VALIDATE EMAIL ADDRESSES
function atcb_validEmail(email) {
  // rough format check first
  if (!/^.{0,70}@.{1,30}\.[a-z]{2,9}$/i.test(email)) {
    return false;
  }
  return true;
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function atcb_rewrite_html_elements(content, clear = false, iCalBreaks = false) {
  if (clear) {
    // for line breaks, we add a space instead (or \\n for iCal)
    if (iCalBreaks) {
      content = content.replace(/(\[br\s?\/?\]|\{br\s?\/?\}|(\[\/p\](?=.))|(\{\/p\}(?=.)))/gi, '\\n');
    } else {
      content = content.replace(/(\[br\s?\/?\]|\{br\s?\/?\}|(\[\/p\](?=.))|(\{\/p\}(?=.)))/gi, ' ');
    }
    // remove any pseudo elements
    content = content.replace(/\[url\](.+?)\[\/url\]/gi, (match, p1) => {
      return p1.split('|')[0];
    });
    content = content.replace(/\{url\}(.+?)\{\/url\}/gi, (match, p1) => {
      return p1.split('|')[0];
    });
    content = content.replace(/\[\/?(hr|[pbui]|strong|em|li|ul|ol|h\d)\]/gi, '');
    content = content.replace(/\{\/?(hr|[pbui]|strong|em|li|ul|ol|h\d)\}/gi, '');
    // also remove any special characters
    content = content.replace(/&[#a-z0-9]{1,9};/gi, '');
  } else {
    // and build html for the rest
    // supporting: br, hr, p, strong, u, i, em, li, ul, ol, h (like h1, h2, h3, ...), url (= a)
    content = content.replace(/\[url\]((?:(?!\[\/url\]).)*)\[\/url\]/gi, function (match, p1) {
      return atcb_parse_url_code(p1);
    });
    content = content.replace(/\{url\}((?:(?!\[\/url\]).)*)\{\/url\}/gi, function (match, p1) {
      return atcb_parse_url_code(p1);
    });
    content = content.replace(/\[(\/)?(br|hr|[pbui]|strong|em|li|ul|ol|h\d)(\s?\/?)\]/gi, '<$1$2$3>');
    content = content.replace(/\{(\/)?(br|hr|[pbui]|strong|em|li|ul|ol|h\d)(\s?\/?)\}/gi, '<$1$2$3>');
  }
  return content;
}

function atcb_parse_url_code(input) {
  const urlText = input.split('|');
  const text = (function () {
    if (urlText.length > 1 && urlText[1] != '') {
      return urlText[1];
    } else {
      return urlText[0];
    }
  })();
  return '<a href="' + urlText[0] + '" target="' + atcbDefaultTarget + '" rel="noopener">' + text + '</a>';
}

// SHARED FUNCTIONS TO FORMAT iCAL TEXT
function atcb_rewrite_ical_text(content, inQuotes = false) {
  if (inQuotes) {
    content = content.replace(/"/g, '');
  } else {
    content = content.replace(/\\/g, '\\\\').replace(/(,|;)/g, '\\$1').replace(/\\\\n/g, '\\n');
  }
  return content;
}

function atcb_format_ical_lines(content) {
  const contentArr = content.split('\r\n');
  const result = [];
  for (let line of contentArr) {
    if (!line || line.length <= 65) {
      result.push(line);
      continue;
    }
    let currentLine = '';
    let position = 0;
    const foldedLines = [];
    while (position < line.length) {
      const char = line.charAt(position);
      // Check for emoji or surrogate pairs (multibyte characters)
      const isHighSurrogate = char.charCodeAt(0) >= 0xd800 && char.charCodeAt(0) <= 0xdbff;
      const isEscapedChar = position > 0 && line.charAt(position - 1) === '\\';
      // If adding this character would exceed 65 characters and it's safe to break here. We aim for 65 to have space left for special cases
      if ((currentLine + char).length > 65 && !isHighSurrogate && !isEscapedChar) {
        foldedLines.push(currentLine);
        currentLine = '';
      }
      currentLine += char;
      position++;
      // If this was a high surrogate, make sure we include its pair in the same line
      if (isHighSurrogate && position < line.length) {
        currentLine += line.charAt(position);
        position++;
      }
    }
    if (currentLine.length > 0) {
      foldedLines.push(currentLine);
    }
    result.push(foldedLines[0]);
    for (let i = 1; i < foldedLines.length; i++) {
      result.push(' ' + foldedLines[`${i}`]);
    }
  }

  return result.join('\r\n');
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE DROPDOWN LIST
function atcb_position_list(host, trigger, list, blockUpwards = false, blockDownwards = false) {
  // check for position anchor
  let anchorSet = false;
  const originalTrigger = trigger;
  if (trigger.querySelector('.atcb-dropdown-anchor') !== null) {
    trigger = trigger.querySelector('.atcb-dropdown-anchor');
    anchorSet = true;
  }
  // changing the lists css position and display type temporarily to get the ideal width of the content
  list.style.position = 'relative';
  list.style.display = 'inline-block';
  // calculate position
  let triggerDim = trigger.getBoundingClientRect();
  const btnDim = originalTrigger.getBoundingClientRect();
  const btnParentDim = originalTrigger.parentNode.getBoundingClientRect();
  const viewportHeight = document.documentElement.clientHeight;
  if (anchorSet === true && !list.classList.contains('atcb-dropoverlay')) {
    let listDim = list.getBoundingClientRect();
    list.style.width = listDim.width + 'px';
    // in the regular case, we also check for the ideal direction
    // not in the !blockUpwards case and not if there is not enough space above
    if (list.classList.contains('atcb-dropup') || (!blockUpwards && triggerDim.top + listDim.height > viewportHeight - 20 && 2 * btnDim.top + btnDim.height - triggerDim.top - listDim.height > 20) || blockDownwards) {
      originalTrigger.classList.add('atcb-dropup');
      list.classList.add('atcb-dropup');
      list.style.bottom = btnParentDim.bottom - btnDim.bottom + (triggerDim.top - btnDim.top) + 'px';
    } else {
      list.style.top = btnDim.top - btnParentDim.top + (triggerDim.top - btnDim.top) + 'px';
      if (originalTrigger.classList.contains('atcb-dropup')) {
        originalTrigger.classList.remove('atcb-dropup');
      }
    }
    // read trigger dimensions again, since after adjusting the top value of the list, something might have changed (e.g. re-adjustment due to missing scrollbars at this point in time)
    triggerDim = trigger.getBoundingClientRect();
    if (!list.classList.contains('atcb-style-simple') && !list.classList.contains('atcb-style-round') && !list.classList.contains('atcb-style-text') && !list.classList.contains('atcb-style-neumorphism')) {
      list.style.minWidth = triggerDim.width + 'px';
      if (list.classList.contains('atcb-dropdown')) {
        list.style.maxWidth = triggerDim.width + 'px';
      }
    }
    // read list dimensions again, since we altered the width in the step before
    listDim = list.getBoundingClientRect();
    list.style.left = Math.round(triggerDim.left - btnParentDim.left - (listDim.width - triggerDim.width) / 2) + 'px';
  } else {
    // when there is no anchor set (only the case with custom implementations) or the listStyle is set respectively (overlay), we render the modal centered above the trigger
    list.style.minWidth = btnDim.width + 20 + 'px';
    // read list dimensions again, since we altered it in the steps before
    const listDim = list.getBoundingClientRect();
    list.style.width = listDim.width + 'px';
    const sideMargin = Math.round((btnDim.width - listDim.width) / 2);
    list.style.margin = -Math.round((listDim.height + btnDim.height) / 2) + 'px ' + sideMargin + 'px 0 ' + sideMargin + 'px';
  }
  // changing the list's position back to absolute and display to block
  list.style.position = 'absolute';
  list.style.display = 'block';
  // adjust branding message, if set
  const atcbL = host.querySelector('#atcb-reference');
  if (atcbL) {
    if (originalTrigger.classList.contains('atcb-dropup')) {
      originalTrigger.parentNode.after(atcbL);
      atcbL.classList.add('atcb-dropup');
    }
  }
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE SHADOW OVERLAY BUTTON
function atcb_position_shadow_button(originalShadowHost, modalShadowHost) {
  const wrapperDim = originalShadowHost.querySelector('.atcb-initialized ').getBoundingClientRect();
  const newWrapper = modalShadowHost.querySelector('.atcb-initialized');
  let widthVal = wrapperDim.width;
  if (wrapperDim.width < 250) {
    widthVal = 250;
  }
  newWrapper.style.width = widthVal + 'px';
  newWrapper.style.height = wrapperDim.height + 'px';
  newWrapper.style.top = wrapperDim.top + 'px';
  newWrapper.style.left = wrapperDim.left + 'px';
}

function atcb_position_shadow_button_listener() {
  const active = atcbStates['active'];
  if (active !== null && active !== '') {
    const originalEl = document.querySelector('add-to-calendar-button[atcb-button-id=' + active + ']').shadowRoot;
    const shadowEl = document.querySelector('div[atcb-button-id=' + active + ']').shadowRoot;
    atcb_position_shadow_button(originalEl, shadowEl);
  }
}

// SHARED FUNCTION TO CALCULATE WHETHER WE BLOCK SCROLLING OR NOT
function atcb_manage_body_scroll(host, modalObj = null) {
  const modal = (function () {
    // if a specific modal is defined, we take it. Otherwise we go for the latest one
    if (modalObj != null) {
      return modalObj;
    } else {
      const allModals = host.querySelectorAll('.atcb-modal');
      if (allModals.length === 0) {
        return null;
      }
      return allModals[allModals.length - 1];
      // since ES2022 this could also simply be return host.querySelectorAll('.atcb-modal').at(-1); - let's change this in the future
    }
  })();
  if (modal == null) {
    return;
  }
  document.body.classList.add('atcb-modal-no-scroll');
  document.documentElement.classList.add('atcb-modal-no-scroll');
}

// SHARED FUNCTION TO DEFINE WIDTH AND HEIGHT FOR "FULLSCREEN" FULLSIZE ELEMENTS
function atcb_set_fullsize(el) {
  el.style.width = window.innerWidth + 'px';
  el.style.height = window.innerHeight + 100 + 'px';
}

// SHARED FUNCTION TO UPDATE GLOBAL SIZES
function atcb_set_sizes(el, sizes) {
  el.style.setProperty('--base-font-size-l', sizes['l'] + 'px');
  el.style.setProperty('--base-font-size-m', sizes['m'] + 'px');
  el.style.setProperty('--base-font-size-s', sizes['s'] + 'px');
}

// SHARED FUNCTION TO GENERATE UUIDs
function atcb_generate_uuid() {
  //const id = crypto.randomUUID(); // lacking support of Safari < 15.4 and Firefox < 95, which is too important for now
  const id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
  return id;
}

// SHARED FUNCTION TO TRANSFORM A STRING
function atcb_apply_transformation(value, transform) {
  if (!transform || !value) return value;
  switch (transform) {
    case 'upper':
      return value.toString().toUpperCase();
    case 'lower':
      return value.toString().toLowerCase();
    default:
      return value;
  }
}

// HELPER: Parse BYDAY/BYWEEKDAY tokens into plain weekdays and ordinal structures
function atcb_parseByWeekdayTokens(rawByDay) {
  const tokens = rawByDay ? rawByDay.toString().split(',') : [];
  const mapWeekdayCode = (wd) => {
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
  const plainWeekdays = [];
  const ordinals = [];
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

// SHARED FUNCTION TO PARSE RRULES
function atcb_parseRRule(rruleStr, deep = true) {
  const parts = rruleStr
    .replace('RRULE:', '')
    .split(';')
    .reduce((acc, part) => {
      const [key, value] = part.split('=');
      acc[`${key}`] = value;
      return acc;
    }, {});
  if (!parts.FREQ) throw new Error('RRULE must have FREQ');
  // Parse components
  parts.FREQ = parts.FREQ.toUpperCase();
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
      const { plainWeekdays, ordinals } = atcb_parseByWeekdayTokens(rawByDay);
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

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toIsoOffset(off) {
  if (!off || off === 'Z' || off === '+0000' || off === '-0000' || off === '+00:00' || off === '-00:00') return 'Z';
  const raw = String(off).replace(/^GMT/i, '');
  if (/^[+-]\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^[+-]\d{4}$/.test(raw)) return `${raw.slice(0, 3)}:${raw.slice(3)}`;
  const sign = raw.startsWith('-') ? '-' : '+';
  const digits = raw.replace(/\D/g, '').padStart(4, '0').slice(0, 4);
  return `${sign}${digits.slice(0, 2)}:${digits.slice(2)}`;
}

const tzPartsFormatterCache = new Map();
function getTzPartsFormatter(timeZone) {
  const key = timeZone || 'UTC';
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

function getTzParts(dateObj, timeZone) {
  if (!(dateObj instanceof Date) || !isFinite(dateObj.getTime())) return null;
  try {
    const parts = getTzPartsFormatter(timeZone).formatToParts(dateObj);
    const get = (t) => parts.find((p) => p.type === t)?.value || '';
    const weekdayShort = get('weekday');
    let weekday = null;
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

function getUtcParts(dateObj) {
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

function getDayOfYearFromYmd(year, month0, day) {
  const start = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, month0, day);
  return Math.floor((current - start) / 86400000) + 1;
}

function getWeekNumberFromYmd(year, month0, day) {
  const d = new Date(Date.UTC(year, month0, day));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function enrichParts(parts) {
  const month0 = parts.month - 1;
  return {
    ...parts,
    month0,
    dayOfYear: getDayOfYearFromYmd(parts.year, month0, parts.day),
    weekNumber: getWeekNumberFromYmd(parts.year, month0, parts.day),
  };
}

function getPartsForTimeZone(dateObj, timeZone) {
  const tzParts = timeZone ? getTzParts(dateObj, timeZone) : null;
  return enrichParts(tzParts || getUtcParts(dateObj));
}

// Add/subtract days while preserving wall-clock time (hh:mm) in the provided time zone.
// Optional dateParts lets callers reuse already-computed TZ parts to avoid extra Intl work.
// Note: we still need to ask tzlib for the offset per date because it can change across DST.
function addLocalDays(dateObj, days, timeZone, hhmm, dateParts = null) {
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
function matchesFreq(date, rrule, startDate, timeZone, dateParts, startParts) {
  const interval = parseInt(rrule.INTERVAL.toString(), 10) || 1;
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
function matchesRRule(date, rrule, startDate, timeZone, dateParts, startParts) {
  // Explicit BY rules
  if (!matchesBYRules(date, rrule, timeZone, dateParts)) return false;
  // Implicit filters
  if (!matchesImplicitRules(date, rrule, startDate, timeZone, dateParts, startParts)) return false;
  return true;
}

function matchesBYRules(date, rrule, timeZone, dateParts) {
  const dp = dateParts || getPartsForTimeZone(date, timeZone);
  if (rrule.BYMONTH && !rrule.BYMONTH.includes(dp.month)) return false;
  if (rrule.BYYEARDAY && !rrule.BYYEARDAY.includes(dp.dayOfYear)) return false;
  if (rrule.BYMONTHDAY && !rrule.BYMONTHDAY.includes(dp.day)) return false;
  if (rrule.BYWEEKNO && !rrule.BYWEEKNO.includes(dp.weekNumber)) return false;
  // Weekday filter (checking both, plain days as well as more complex structures -> splitted apart to ordinals)
  // Evaluate plain weekday condition
  const hasPlainWeekday = !!(rrule.BYWEEKDAY && rrule.BYWEEKDAY.length);
  const plainWeekdayOk = hasPlainWeekday ? rrule.BYWEEKDAY.includes(dp.weekday) : null;
  // Ordinal BYDAY handling (e.g., 1MO, -1FR)
  let ordinalOk = null;
  if (rrule.BYDAY_ORDINALS && Array.isArray(rrule.BYDAY_ORDINALS) && rrule.BYDAY_ORDINALS.length > 0) {
    const dow = dp.weekday; // day of week in DTSTART tz
    const year = dp.year;
    const month0 = dp.month0;
    const dayOfYear = dp.dayOfYear;
    const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
    const daysInYear = getDayOfYearFromYmd(year, 11, 31);

    const isNthWeekdayOfMonth = (n, weekday) => {
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

    const isNthWeekdayOfYear = (n, weekday) => {
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
    const anyOrdinalMatch = rrule.BYDAY_ORDINALS.some(({ n, day }) => {
      if (day !== dow) return false;
      if (rrule.FREQ === 'MONTHLY') return isNthWeekdayOfMonth(n, day);
      if (rrule.FREQ === 'YEARLY') {
        if (rrule.BYMONTH && rrule.BYMONTH.length > 0) return isNthWeekdayOfMonth(n, day);
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

function matchesImplicitRules(date, rrule, startDate, timeZone, dateParts, startParts) {
  const dp = dateParts || getPartsForTimeZone(date, timeZone);
  const sp = startParts || getPartsForTimeZone(startDate, timeZone);
  // Without BYHOUR support, hour always comes from DTSTART.
  if (dp.hour !== sp.hour) return false;
  const hasByWeekdayAny = !!(rrule.BYWEEKDAY && rrule.BYWEEKDAY.length) || !!(rrule.BYDAY_ORDINALS && rrule.BYDAY_ORDINALS.length);
  if (rrule.FREQ === 'WEEKLY' && !hasByWeekdayAny && dp.weekday !== sp.weekday) return false;
  if (rrule.FREQ === 'MONTHLY' && !rrule.BYMONTHDAY && !hasByWeekdayAny && dp.day !== sp.day) return false;
  if (rrule.FREQ === 'YEARLY' && !rrule.BYMONTH && dp.month0 !== sp.month0) return false;
  if (rrule.FREQ === 'YEARLY' && !rrule.BYMONTHDAY && !hasByWeekdayAny && !rrule.BYYEARDAY && !rrule.BYWEEKNO && dp.day !== sp.day) return false;
  return true;
}

// Get next occurrence and last if no next
function atcb_getNextOccurrence(rruleStr, startDateTime, diff, allday, tzid = 'UTC') {
  const rrule = atcb_parseRRule(rruleStr);
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
  const occurrences = [];
  let count = 0;
  let maxIterations = 10000;
  // Collect all valid occurrences up to COUNT or UNTIL, or until first future match is found
  while (true) {
    // Stop before pushing when we've passed UNTIL
    if (rrule.UNTIL && currentDate > rrule.UNTIL) break;
    const currentParts = getPartsForTimeZone(currentDate, tzid);
    const isMatch = matchesFreq(currentDate, rrule, startDateTime, tzid, currentParts, startParts) && matchesRRule(currentDate, rrule, startDateTime, tzid, currentParts, startParts);
    if (isMatch) {
      occurrences.push(currentDate);
      count++;
      // If there's a COUNT limit, stop when reached
      if (rrule.COUNT && count >= rrule.COUNT) break;
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
  let nextDate = null;
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
      nextDate = occurrences[occurrences.length - 1];
      countDate = countDate - 1;
    } else if (occurrences.length === 1) {
      nextDate = occurrences[0];
    } else {
      nextDate = startDateTime;
      countDate = 1;
    }
  }
  return {
    nextOccurrence: nextDate,
    adjustedCount: rrule.COUNT ? rrule.COUNT - countDate : count - countDate,
  };
}

// SHARED FUNCTION TO MAP SPECIFIC TIME ZONES
function atcb_map_special_time_zones(timeZone) {
  if (!timeZone) return 'GMT';
  const mapping = {
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

// SHARED FUNCTION TO COPY TO CLIPBOARD
async function atcb_copy_to_clipboard(dataString) {
  const v = (dataString ?? '').toString().trim();
  if (!v) throw new Error('No value to copy!');
  // Helper: legacy copy using a hidden textarea
  const legacyCopy = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (!document.queryCommandSupported || !document.queryCommandSupported('copy')) return false;
    const ta = document.createElement('textarea');
    const prevFocus = document.activeElement;
    ta.value = v;
    ta.setAttribute('readonly', '');
    ta.style.contain = 'strict';
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    ta.style.outline = 'none';
    ta.style.pointerEvents = 'none';
    ta.style.fontSize = '12pt'; // Prevent zooming on iOS
    document.body.appendChild(ta);
    try {
      ta.focus();
      ta.select();
      if (atcbIsiOS()) {
        ta.selectionStart = 0;
        ta.selectionEnd = v.length;
      }
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      return ok;
    } catch {
      document.body.removeChild(ta);
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      return false;
    }
  };
  const secure = (() => {
    try {
      // check for isSecureContext first
      if (typeof window !== 'undefined' && 'isSecureContext' in window && window.isSecureContext) return true;
      // check for protocol as fallback
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:') return true;
      // if localhost, also return true
      if (typeof window !== 'undefined' && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) return true;
      return false;
    } catch {
      return false;
    }
  })();
  // Try modern Clipboard API first when in a secure context
  if (secure && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      if (typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(v);
        return 'Copied!';
      }
    } catch {
      // fall through to alternative methods
    }
    try {
      if (typeof window !== 'undefined' && typeof window.ClipboardItem !== 'undefined' && typeof navigator.clipboard.write === 'function') {
        const type = 'text/plain';
        const blob = new Blob([v], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        await navigator.clipboard.write(data);
        return 'Copied!';
      }
    } catch {
      // fall through to legacy
    }
  }
  if (legacyCopy()) return 'Copied!';
  throw new Error('Clipboard copy not supported in this environment');
}

// SHARED DEBOUNCE FUNCTIONS
// going for last call debounce
function atcb_debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
// dropping subsequent calls debounce
function atcb_debounce_leading(func, timeout = 300) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export {
  atcb_saved_hook,
  atcb_save_file,
  atcb_generate_time,
  atcb_format_datetime,
  atcb_translate_via_time_zone,
  atcb_generate_timestring,
  atcb_secure_content,
  atcb_secure_url,
  atcb_validEmail,
  atcb_rewrite_html_elements,
  atcb_rewrite_ical_text,
  atcb_format_ical_lines,
  atcb_position_list,
  atcb_position_shadow_button,
  atcb_position_shadow_button_listener,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_set_sizes,
  atcb_generate_uuid,
  atcb_apply_transformation,
  atcb_parseRRule,
  atcb_getNextOccurrence,
  atcb_map_special_time_zones,
  atcb_copy_to_clipboard,
  atcb_debounce,
  atcb_debounce_leading,
};
