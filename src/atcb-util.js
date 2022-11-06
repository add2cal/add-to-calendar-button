/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.18.5
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_offset } from '../node_modules/timezones-ical-library/npm_dist/mjs/index.js';
import { isMobile, isiOS, atcbDefaultTarget } from './atcb-globals.js';

// SHARED FUNCTION HOOK FOR WHEN EVENT GOT SAVED
function atcb_saved_hook() {
  console.log('Event saved. Looking forward to it!');
}

// SHARED FUNCTION TO SAVE A FILE
function atcb_save_file(file, filename) {
  try {
    const save = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save.rel = 'noopener';
    save.href = file;
    // not using default target here, since this needs to happen _self on iOS (abstracted to mobile in general) and _blank at Firefox (abstracted to other setups) due to potential cross-origin restrictions
    if (isMobile()) {
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
    // for the input, we assume UTC per default
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
    // if no time zone is given and we need to add the offset to the datetime string, do so directly and return
    if ((data.timeZone == null || (data.timeZone != null && data.timeZone == '')) && addTimeZoneOffset) {
      return {
        start: newStartDate.toISOString().replace('.000Z', '+00:00'),
        end: newEndDate.toISOString().replace('.000Z', '+00:00'),
        duration: durationString,
        allday: false,
      };
    }
    // if a time zone is given, we adjust the diverse cases
    // (see https://tz.add-to-calendar-technology.com/api/zones.json for available TZ names)
    if (data.timeZone != null && data.timeZone != '') {
      if (
        targetCal == 'ical' ||
        (targetCal == 'google' &&
          !/(GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|EST5EDT|MET|MST|MST7MDT|PST8PDT|WET)/i.test(
            data.timeZone
          ))
      ) {
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
      const calcOffsetStart =
        parseInt(offsetStart[0] + 1) *
        -1 *
        ((parseInt(offsetStart.substr(1, 2)) * 60 + parseInt(offsetStart.substr(3, 2))) * 60 * 1000);
      const calcOffsetEnd =
        parseInt(offsetEnd[0] + 1) *
        -1 *
        ((parseInt(offsetEnd.substr(1, 2)) * 60 + parseInt(offsetEnd.substr(3, 2))) * 60 * 1000);
      newStartDate.setTime(newStartDate.getTime() + calcOffsetStart);
      newEndDate.setTime(newEndDate.getTime() + calcOffsetEnd);
    }
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
    // increment the end day by 1 for Google Calendar, iCal and Outlook
    if (targetCal == 'google' || targetCal == 'microsoft' || targetCal == 'ical') {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }
    // return formatted data
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
  const output = removeZ
    ? datetime.toISOString().replace(regex, '').replace('Z', '')
    : datetime.toISOString().replace(regex, '');
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
  if (
    url.match(
      /((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi
    )
  ) {
    if (throwError) {
      console.error(
        'Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!'
      );
    }
    return false;
  } else {
    return true;
  }
}

// SHARED FUNCTION TO VALIDATE EMAIL ADDRESSES
function atcb_validEmail(email, mx = false) {
  // rough format check first
  if (!/^.{0,70}@.{1,30}\.[\w.]{2,9}$/.test(email)) {
    return false;
  }
  // testing for mx records second, if activated
  // TODO: call external service to validate email address
  if (mx) {
    console.log('Testing for MX records not yet available');
  }
  return true;
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function atcb_rewrite_html_elements(content, clear = false) {
  // standardize any line breaks
  content = content.replace(/<br\s*\/?>/gi, '\n');
  // remove any pseudo elements, if necessary
  if (clear) {
    content = content.replace(/\[(|\/)(url|br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]|((\|.*)\[\/url\])/gi, '');
    // and build html for the rest
    // supporting: br, hr, p, strong, u, i, em, li, ul, ol, h (like h1, h2, h3, ...), url (= a)
  } else {
    content = content.replace(/\[(\/|)(br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]/gi, '<$1$2>');
    content = content.replace(/\[url\]([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\[\/url\]/gi, function (match, p1) {
      const urlText = p1.split('|');
      const text = (function () {
        if (urlText.length > 1 && urlText[1] != '') {
          return urlText[1];
        } else {
          return urlText[0];
        }
      })();
      return (
        '<a href="' + urlText[0] + '" target="' + atcbDefaultTarget + '" rel="noopener">' + text + '</a>'
      );
    });
  }
  return content;
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE DROPDOWN LIST
function atcb_position_list(trigger, list, blockUpwards = false, resize = false) {
  // check for position anchor
  let anchorSet = false;
  const originalTrigger = trigger;
  if (trigger.querySelector('.atcb-dropdown-anchor') !== null) {
    trigger = trigger.querySelector('.atcb-dropdown-anchor');
    anchorSet = true;
  }
  // calculate position
  let triggerDim = trigger.getBoundingClientRect();
  let listDim = list.getBoundingClientRect();
  const btnDim = originalTrigger.getBoundingClientRect();
  const viewportHeight = document.documentElement.clientHeight;
  if (anchorSet === true && !list.classList.contains('atcb-dropoverlay')) {
    // in the regular case, we also check for the ideal direction
    // not in the !blockUpwards case and not if there is not enough space above
    if (
      (list.classList.contains('atcb-dropup') && resize) ||
      (!blockUpwards &&
        !resize &&
        triggerDim.top + listDim.height > viewportHeight - 20 &&
        2 * btnDim.top + btnDim.height - triggerDim.top - listDim.height > 20)
    ) {
      originalTrigger.classList.add('atcb-dropup');
      list.classList.add('atcb-dropup');
      list.style.bottom =
        2 * viewportHeight -
        (viewportHeight + (btnDim.top + (btnDim.top + btnDim.height - triggerDim.top))) -
        window.scrollY +
        'px';
    } else {
      list.style.top = window.scrollY + triggerDim.top + 'px';
      if (originalTrigger.classList.contains('atcb-dropup')) {
        originalTrigger.classList.remove('atcb-dropup');
      }
    }
    // read trigger dimensions again, since after adjusting the top value of the list, something might have changed (e.g. re-adjustment due to missing scrollbars at this point in time)
    triggerDim = trigger.getBoundingClientRect();
    if (list.classList.contains('atcb-style-bubble') || list.classList.contains('atcb-style-text')) {
      list.style.minWidth = triggerDim.width + 'px';
    } else {
      list.style.width = triggerDim.width + 'px';
    }
    // read list dimensions again, since we altered the width in the step before
    listDim = list.getBoundingClientRect();
    list.style.left = triggerDim.left - (listDim.width - triggerDim.width) / 2 + 'px';
  } else {
    // when there is no anchor set (only the case with custom implementations) or the listStyle is set respectively (overlay), we render the modal centered above the trigger
    // make sure the trigger is not moved over it via CSS in this case!
    list.style.minWidth = btnDim.width + 20 + 'px';
    // read list dimensions again, since we altered the width in the step before
    listDim = list.getBoundingClientRect();
    list.style.top = window.scrollY + btnDim.top + btnDim.height / 2 - listDim.height / 2 + 'px';
    list.style.left = btnDim.left - (listDim.width - btnDim.width) / 2 + 'px';
  }
  const atcbL = document.getElementById('add-to-calendar-button-reference');
  if (atcbL) {
    if (originalTrigger.classList.contains('atcb-dropup')) {
      atcbL.style.top = window.scrollY + btnDim.top + btnDim.height + 'px';
      atcbL.style.left = btnDim.left + (btnDim.width - 150) / 2 + 'px';
    } else {
      listDim = list.getBoundingClientRect();
      if (originalTrigger.classList.contains('atcb-dropoverlay') || !anchorSet) {
        atcbL.style.top = window.scrollY + listDim.top + listDim.height + 'px';
      } else {
        atcbL.style.top = window.scrollY + triggerDim.top + listDim.height + 'px';
      }
      atcbL.style.left = listDim.left + (listDim.width - 150) / 2 + 'px';
    }
  }
}

// SHARED FUNCTION TO CALCULATE WHETHER WE BLOCK SCROLLING OR NOT (WHEN MODAL OR LIST IS LARGER THAN THE SCREEN HEIGHT)
function atcb_manage_body_scroll(host, modalObj = null) {
  const modal = (function () {
    // if a specific modal is defined, we take it. Otherwise we go for the latest one
    if (modalObj != null) {
      return modalObj;
    } else {
      const allModals = host.querySelectorAll('.atcb-modal');
      if (allModals.length == 0) {
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
  if (modalDim.height + 100 > window.innerHeight) {
    document.body.classList.add('atcb-modal-no-scroll');
  } else {
    document.body.classList.remove('atcb-modal-no-scroll');
  }
}

// SHARED FUNCTION TO DEFINE WIDTH AND HEIGHT FOR "FULLSCREEN" FULLSIZE ELEMENTS
function atcb_set_fullsize(el) {
  el.style.width = window.innerWidth + 'px';
  el.style.height = window.innerHeight + 100 + 'px';
}

// SHARED FUNCTION TO UPDATE GLOBAL SIZES
function atcb_set_sizes(el, size) {
  el.style.setProperty('--base-font-size-l', size.l + 'px');
  el.style.setProperty('--base-font-size-m', size.m + 'px');
  el.style.setProperty('--base-font-size-s', size.s + 'px');
}

// SHARED FUNCTION TO GENERATE UUIDs
function atcb_generate_uuid() {
  //return crypto.randomUUID(); // lacking support of Safari < 15.4 and Firefox < 95, which is to important for now
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// SHARED FUNCTION TO COPY TO CLIPBOARD
function atcb_copy_to_clipboard(dataString) {
  const tmpInput = document.createElement('input');
  document.body.append(tmpInput);
  const editable = tmpInput.contentEditable;
  const readOnly = tmpInput.readOnly;
  tmpInput.value = dataString;
  tmpInput.contentEditable = true;
  tmpInput.readOnly = false;
  if (isiOS()) {
    var range = document.createRange();
    range.selectNodeContents(tmpInput);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    tmpInput.setSelectionRange(0, 999999);
  } else {
    // the next 2 lines are basically doing the same in different ways (just to be sure)
    navigator.clipboard.writeText(dataString);
    tmpInput.select();
  }
  tmpInput.contentEditable = editable;
  tmpInput.readOnly = readOnly;
  document.execCommand('copy');
  tmpInput.remove();
}

// SHARED DEBOUNCE AND THROTTLE FUNCTIONS
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
// throttle
function atcb_throttle(func, delay = 10) {
  let result;
  let timeout = null;
  let previous = 0;
  let later = (...args) => {
    previous = Date.now();
    timeout = null;
    result = func.apply(this, args);
  };
  return (...args) => {
    let now = Date.now();
    let remaining = delay - (now - previous);
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
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
  atcb_position_list,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_set_sizes,
  atcb_generate_uuid,
  atcb_copy_to_clipboard,
  atcb_debounce,
  atcb_debounce_leading,
  atcb_throttle,
};
