/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.4.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_offset } from 'timezones-ical-library';
import { atcbIsMobile, atcbIsiOS, atcbDefaultTarget } from './atcb-globals.js';
import { atcb_log_event } from './atcb-event';
import { atcbStates } from './atcb-globals.js';

// SHARED FUNCTION HOOK FOR WHEN EVENT GOT SAVED
function atcb_saved_hook(host, data) {
  // log event
  atcb_log_event('success', data.identifier, data.identifier);
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
  if (data.startTime != null && data.startTime != '' && data.endTime != null && data.endTime != '') {
    // for the input, we assume GMT/UTC per default
    const newStartDate = new Date(data.startDate + 'T' + data.startTime + ':00.000+00:00');
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
    if (targetCal == 'ical' || (targetCal == 'google' && !/(GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|EST5EDT|MET|MST|MST7MDT|PST8PDT|WET)/i.test(data.timeZone))) {
      // in the iCal case, we simply return and cut off the Z. Same applies to Google, except for GMT +/- time zones, which are not supported there.
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
    const endDate = data.endDate.split('-');
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

// SHARED FUNCTION TO SECURE DATA
function atcb_secure_content(data, isJSON = true) {
  // strip HTML tags (especially since stupid Safari adds stuff) - except for <br>
  const toClean = isJSON ? JSON.stringify(data) : data;
  const cleanedUp = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    return JSON.parse(cleanedUp);
  } else {
    return cleanedUp;
  }
}

// SHARED FUNCTION TO SECURE URLS
function atcb_secure_url(url, throwError = true) {
  if (url.match(/((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi)) {
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
  if (!/^.{0,70}@.{1,30}\.[a-zA-Z]{2,9}$/.test(email)) {
    return false;
  }
  return true;
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function atcb_rewrite_html_elements(content, clear = false, iCalBreaks = false) {
  if (clear) {
    // remove any pseudo elements
    content = content.replace(/\[(|\/)(url|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]|((\|.*)\[\/url\])/gi, '');
    content = content.replace(/\{(|\/)(url|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\}|((\|.*)\{\/url\})/gi, '');
    // for line breaks, we add a space instead (or \\n for iCal)
    if (iCalBreaks) {
      content = content.replace(/(\[br\]|\{br\})/gi, '\\n');
    } else {
      content = content.replace(/(\[br\]|\{br\})/gi, ' ');
    }
    // also remove any special characters
    content = content.replace(/&[#a-zA-Z0-9]{1,9};/gi, '');
    // and build html for the rest
    // supporting: br, hr, p, strong, u, i, em, li, ul, ol, h (like h1, h2, h3, ...), url (= a)
  } else {
    content = content.replace(/\[(\/|)(br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]/gi, '<$1$2>');
    content = content.replace(/\{(\/|)(br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\}/gi, '<$1$2>');
    content = content.replace(/\[url\]([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\[\/url\]/gi, function (match, p1) {
      return atcb_parse_url_code(p1);
    });
    content = content.replace(/\{url\}([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\{\/url\}/gi, function (match, p1) {
      return atcb_parse_url_code(p1);
    });
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

// SHARED FUNCTION TO FORMAT iCAL TEXT
function atcb_rewrite_ical_text(content, truncate = true, inQuotes = false) {
  if (inQuotes) {
    content = content.replace(/"/g, '');
  } else {
    content = content.replace(/\\/g, '\\\\').replace(/(,|;)/g, '\\$1').replace(/\\\\n/g, '\\n');
  }
  if (truncate) {
    // adjusting for intended line breaks + making sure it does not exceed 75 characters per line
    content = content.replace(/.{60}/g, '$&' + '\r\n ');
  }
  return content;
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
    list.style.minWidth = triggerDim.width + 'px';
    if ((list.classList.contains('atcb-dropdown') && !list.classList.contains('atcb-style-round')) || list.classList.contains('atcb-style-text') || list.classList.contains('atcb-style-neumorphism')) {
      list.style.maxWidth = triggerDim.width + 'px';
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
    const sideMargin = Math.round((btnDim.width - listDim.width) / 4);
    list.style.margin = -Math.round((listDim.height + btnDim.height) / 2) + 'px ' + sideMargin + 'px 0 ' + sideMargin + 'px';
  }
  // changing the list's position back to absolute and display to block
  list.style.position = 'absolute';
  list.style.display = 'block';
  // adjust branding message, if set
  const atcbL = host.querySelector('#add-to-calendar-button-reference');
  if (atcbL) {
    if (originalTrigger.classList.contains('atcb-dropup')) {
      originalTrigger.parentNode.parentNode.after(atcbL);
      atcbL.style.padding = '5px 15px';
      atcbL.style.position = 'absolute';
      atcbL.style.left = btnDim.left + 'px';
    }
  }
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE SHADOW OVERLAY BUTTON
function atcb_position_shadow_button(originalEl, shadowEl) {
  const wrapperDim = originalEl.querySelector('.atcb-initialized').getBoundingClientRect();
  const newWrapper = shadowEl.querySelector('.atcb-initialized');
  newWrapper.style.width = wrapperDim.width + 'px';
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

// // SHARED FUNCTION TO CALCULATE WHETHER WE BLOCK SCROLLING OR NOT (WHEN MODAL OR LIST IS LARGER THAN THE SCREEN HEIGHT)
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
  const modalDim = modal.getBoundingClientRect();
  if (modalDim.height + 150 > window.innerHeight) {
    document.body.classList.add('atcb-modal-no-scroll');
    document.documentElement.classList.add('atcb-modal-no-scroll');
  } else {
    document.body.classList.remove('atcb-modal-no-scroll');
    document.documentElement.classList.remove('atcb-modal-no-scroll');
  }
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
  //return crypto.randomUUID(); // lacking support of Safari < 15.4 and Firefox < 95, which is too important for now
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}

// SHARED FUNCTION TO COPY TO CLIPBOARD
function atcb_copy_to_clipboard(dataString) {
  const tmpInput = document.createElement('input');
  document.body.append(tmpInput);
  const editable = tmpInput.contentEditable;
  const readOnly = tmpInput.readOnly;
  tmpInput.contentEditable = true;
  tmpInput.readOnly = false;
  tmpInput.value = dataString;
  if (atcbIsiOS()) {
    var range = document.createRange();
    range.selectNodeContents(tmpInput);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    tmpInput.setSelectionRange(0, 999999);
  } else {
    tmpInput.select();
  }
  tmpInput.contentEditable = editable;
  tmpInput.readOnly = readOnly;
  document.execCommand('copy');
  tmpInput.remove();
  // navigator.clipboard.writeText(dataString); would require a lot more hacks on many systems, but could be something for the future (see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)
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
  atcb_secure_content,
  atcb_secure_url,
  atcb_validEmail,
  atcb_rewrite_html_elements,
  atcb_rewrite_ical_text,
  atcb_position_list,
  atcb_position_shadow_button,
  atcb_position_shadow_button_listener,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_set_sizes,
  atcb_generate_uuid,
  atcb_copy_to_clipboard,
  atcb_debounce,
  atcb_debounce_leading,
};
