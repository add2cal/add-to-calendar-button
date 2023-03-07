/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.2.3
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_offset } from 'timezones-ical-library';
import { isiOS, isBrowser, atcbValidRecurrOptions, atcbInvalidSubscribeOptions, atcbiOSInvalidOptions, atcbWcBooleanParams } from './atcb-globals.js';
import { atcb_format_datetime, atcb_rewrite_html_elements, atcb_generate_uuid } from './atcb-util.js';
import { availableLanguages, rtlLanguages } from './atcb-i18n';

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
function atcb_decorate_data(data) {
  data = atcb_decorate_data_boolean(data);
  data = atcb_decorate_data_rrule(data);
  data = atcb_decorate_data_options(data);
  data = atcb_decorate_data_style(data);
  data.sizes = atcb_decorate_sizes(data.size);
  data.lightMode = atcb_decorate_light_mode(data.lightMode);
  data = atcb_decorate_data_i18n(data);
  data = atcb_decorate_data_dates(data);
  data = atcb_decorate_data_meta(data);
  data = atcb_decorate_data_extend(data);
  data = atcb_decorate_data_button_status_handling(data);
  return data;
}

// setting boolean parameters right, since they can be provided or not
function atcb_decorate_data_boolean(data) {
  for (let i = 0; i < atcbWcBooleanParams.length; i++) {
    const attr = atcbWcBooleanParams[`${i}`];
    if (data[`${attr}`] != null && (data[`${attr}`] === 'true' || data[`${attr}`] === true)) {
      data[`${attr}`] = true;
    } else {
      data[`${attr}`] = false;
    }
  }
  return data;
}

// format RRULE
function atcb_decorate_data_rrule(data) {
  if (data.recurrence != null && data.recurrence != '') {
    // remove spaces and force upper case
    data.recurrence = data.recurrence.replace(/\s+/g, '').toUpperCase();
    // pre-validate
    if (!/^(RRULE:[\w=;,:+-/\\]+|daily|weekly|monthly|yearly)$/im.test(data.recurrence)) {
      data.recurrence = '!wrong rrule format!';
    } else {
      // check if RRULE already
      if (/^RRULE:/i.test(data.recurrence)) {
        data.recurrence_simplyfied = false;
        // draw easy rules from RRULE if possible
        const rruleParts = data.recurrence.substring(6).split(';');
        const rruleObj = new Object();
        rruleParts.forEach(function (rule) {
          rruleObj[rule.split('=')[0]] = rule.split('=')[1];
        });
        data.recurrence_until = rruleObj.UNTIL ? rruleObj.UNTIL : '';
        data.recurrence_count = rruleObj.COUNT ? rruleObj.COUNT : '';
        data.recurrence_byDay = rruleObj.BYDAY ? rruleObj.BYDAY : '';
        data.recurrence_byMonth = rruleObj.BYMONTH ? rruleObj.BYMONTH : '';
        data.recurrence_byMonthDay = rruleObj.BYMONTHDAY ? rruleObj.BYMONTHDAY : '';
        data.recurrence_interval = rruleObj.INTERVAL ? rruleObj.INTERVAL : 1;
        data.recurrence_frequency = rruleObj.FREQ ? rruleObj.FREQ : '';
      } else {
        data.recurrence_simplyfied = true;
        // set interval if not given
        if (data.recurrence_interval == null || data.recurrence_interval == '') {
          data.recurrence_interval = 1;
        }
        // set weekstart if not given
        if (data.recurrence_weekstart == null || (data.recurrence_weekstart == '') | (data.recurrence_weekstart.length > 2)) {
          data.recurrence_weekstart = 'MO';
        }
        // save frequency before overriding the main recurrence data
        data.recurrence_frequency = data.recurrence;
        // generate the RRULE from easy rules
        data.recurrence = 'RRULE:FREQ=' + data.recurrence + ';WKST=' + data.recurrence_weekstart + ';INTERVAL=' + data.recurrence_interval;
        // TODO: If "until" is given, translate it into a "count" and remove the "until" (here and in the above block). This would be way more stable!
        if (data.recurrence_until != null && data.recurrence_until != '') {
          if (data.endTime != null && data.endTime != '') {
            data.recurrence = data.recurrence + ';UNTIL=' + data.recurrence_until.replace(/-/g, '').slice(0, 8) + 'T' + data.endTime.replace(':', '') + '00';
          } else {
            data.recurrence = data.recurrence + ';UNTIL=' + data.recurrence_until.replace(/-/g, '').slice(0, 8);
          }
        }
        if (data.recurrence_count != null && data.recurrence_count != '') {
          data.recurrence = data.recurrence + ';COUNT=' + data.recurrence_count;
        }
        if (data.recurrence_byDay != null && data.recurrence_byDay != '') {
          data.recurrence = data.recurrence + ';BYDAY=' + data.recurrence_byDay;
        }
        if (data.recurrence_byMonth != null && data.recurrence_byMonth != '') {
          data.recurrence = data.recurrence + ';BYMONTH=' + data.recurrence_byMonth;
        }
        if (data.recurrence_byMonthDay != null && data.recurrence_byMonthDay != '') {
          data.recurrence = data.recurrence + ';BYMONTHDAY=' + data.recurrence_byMonthDay;
        }
      }
    }
  }
  return data;
}

// cleanup options, standardizing names and splitting off custom labels
function atcb_decorate_data_options(data) {
  // iterrate over the options and generate the new clean arrays (for options and labels)
  const newOptions = [];
  data.optionLabels = [];
  let iCalGiven = false;
  let appleGiven = false;
  for (let i = 0; i < data.options.length; i++) {
    // preparing the input options and labels
    const cleanOption = data.options[`${i}`].split('|');
    const optionName = cleanOption[0].toLowerCase().replace('microsoft', 'ms').replace(/\./, '');
    const optionLabel = (function () {
      if (cleanOption[1] != null) {
        return cleanOption[1];
      }
      return '';
    })();
    if (optionName === 'apple') {
      appleGiven = true;
    }
    if (optionName === 'ical') {
      iCalGiven = true;
    }
    // next, fill the new arrays (where the labels array already sits inside the main data object)
    // do not consider options, which should not appear on iOS (e.g. iCal, since we have the Apple option instead)
    // in the recurrence case, we leave out all options, which do not support it in general, as well as Apple and iCal for rrules with "until"
    // and in the subscribe case, we also skip options, which are not made for subscribing (MS Teams)
    if (
      (isiOS() && atcbiOSInvalidOptions.includes(optionName)) ||
      (data.recurrence != null && data.recurrence != '' && (!atcbValidRecurrOptions.includes(optionName) || (data.recurrence_until != null && data.recurrence_until != '' && (optionName == 'apple' || optionName == 'ical')))) ||
      (data.subscribe && atcbInvalidSubscribeOptions.includes(optionName))
    ) {
      continue;
    }
    newOptions.push(optionName);
    data.optionLabels.push(optionLabel);
  }
  // for iOS, we force the Apple option (if it is not there, but iCal was)
  if (isiOS() && iCalGiven && !appleGiven) {
    newOptions.push('apple');
  }
  // last but not least, override the options at the main data object
  data.options = newOptions;
  return data;
}

function atcb_decorate_data_style(data) {
  // set default listStyle
  if (data.listStyle == null || data.listStyle == '') {
    data.listStyle = 'dropdown';
  }
  // force click trigger on modal style
  if (data.listStyle === 'modal') {
    data.trigger = 'click';
  }
  // set button style and force click on styles, where the dropdown is not attached to the button
  if (data.buttonStyle != null && data.buttonStyle != '' && data.buttonStyle != 'default') {
    if (data.buttonStyle == 'round' || data.buttonStyle == 'text' || data.buttonStyle == 'date' || data.buttonStyle == 'neumorphism') {
      data.trigger = 'click';
    }
    // for the date style, we even block the dropdown completely and fall back to overlay
    if (data.buttonStyle == 'date' && data.listStyle == 'dropdown') {
      data.listStyle = 'overlay';
    }
  } else {
    data.buttonStyle = 'default';
  }
  // force overlay when the button label is ommited, but the list labels are not (which would make the list need to be larger than the button) - at dropdown cases
  if ((data.buttonStyle == 'default' || data.buttonStyle == '3d' || data.buttonStyle == 'flat') && data.listStyle == 'dropdown' && !data.hideTextLabelList && data.hideTextLabelButton) {
    data.listStyle = 'overlay';
  }
  // force buttonsList false on date style button
  if (data.buttonsList && data.buttonStyle == 'date') {
    data.buttonsList = false;
  }
  // return result
  return data;
}

// prepare sizes
function atcb_decorate_sizes(size) {
  const sizes = [];
  sizes['l'] = sizes['m'] = sizes['s'] = 16;
  if (size != null && size != '') {
    const sizeParts = size.split('|');
    for (let i = 0; i < sizeParts.length; i++) {
      sizeParts[`${i}`] = parseInt(sizeParts[`${i}`]);
    }
    if (sizeParts[0] >= 0 && sizeParts[0] < 11) {
      sizes['l'] = sizes['m'] = sizes['s'] = 10 + sizeParts[0];
    }
    if (sizeParts.length > 2) {
      if (sizeParts[1] >= 0 && sizeParts[1] < 11) {
        sizes['m'] = 10 + sizeParts[1];
      }
      if (sizeParts[2] >= 0 && sizeParts[2] < 11) {
        sizes['s'] = 10 + sizeParts[2];
      }
    } else if (sizeParts.length == 2) {
      if (sizeParts[1] >= 0 && sizeParts[1] < 11) {
        sizes['m'] = sizes['s'] = 10 + sizeParts[1];
      }
    }
  }
  return sizes;
}

// determine dark mode
function atcb_decorate_light_mode(lightMode = '') {
  if (lightMode == 'system' && isBrowser()) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  if (lightMode != 'bodyScheme' && lightMode != 'dark') {
    return 'light';
  }
  return lightMode;
}

function atcb_decorate_data_i18n(data) {
  // set language if not set
  if (data.language == null || data.language == '' || !availableLanguages.includes(data.language)) {
    data.language = 'en';
  }
  // reduce language identifier, if long version is used
  if (data.language.length > 2) {
    data.language = data.language.substring(0, 2);
  }
  // set right-to-left for relevant languages
  if (rtlLanguages.includes(data.language)) {
    data.rtl = true;
  } else {
    data.rtl = false;
  }
  return data;
}

// optimize date and time information
function atcb_decorate_data_dates(data) {
  if (data.dates != null && data.dates.length > 0) {
    for (let i = 0; i < data.dates.length; i++) {
      // get global time zone, if not set within the date block, but globally
      if (data.dates[`${i}`].timeZone == null && data.timeZone != null) {
        data.dates[`${i}`].timeZone = data.timeZone;
      }
      // cleanup different date-time formats
      const cleanedUpDates = atcb_date_cleanup(data.dates[`${i}`]);
      data.dates[`${i}`].startTime = cleanedUpDates.startTime;
      data.dates[`${i}`].endTime = cleanedUpDates.endTime;
      data.dates[`${i}`].timeZone = cleanedUpDates.timeZone;
      // calculate the real date values in case that there are some special rules included (e.g. adding days dynamically)
      data.dates[`${i}`].startDate = atcb_date_calculation(cleanedUpDates.startDate);
      data.dates[`${i}`].endDate = atcb_date_calculation(cleanedUpDates.endDate);
      // calculating more special meta information
      data.dates[`${i}`].timestamp = atcb_date_specials_calculation('timestamp', data.dates[`${i}`].startDate, data.dates[`${i}`].startTime, data.dates[`${i}`].timeZone);
      data.dates[`${i}`].overdue = atcb_date_specials_calculation('overdue', data.dates[`${i}`].endDate, data.dates[`${i}`].endTime, data.dates[`${i}`].timeZone);
    }
  } else {
    // in the single case, we do the same, but without the looping
    const cleanedUpDates = atcb_date_cleanup(data);
    // in addition, we directly move this information into the dates array block for better consistency at the next steps
    data.dates = [];
    data.dates[0] = new Object();
    data.startTime = data.dates[0].startTime = cleanedUpDates.startTime;
    data.endTime = data.dates[0].endTime = cleanedUpDates.endTime;
    data.timeZone = data.dates[0].timeZone = cleanedUpDates.timeZone;
    data.startDate = data.dates[0].startDate = atcb_date_calculation(cleanedUpDates.startDate);
    data.endDate = data.dates[0].endDate = atcb_date_calculation(cleanedUpDates.endDate);
    data.dates[0].overdue = atcb_date_specials_calculation('overdue', data.endDate, data.endTime, data.timeZone);
  }
  // calculate current time
  const now = new Date();
  // set created date
  if (data.created == null || data.created == '') {
    data.created = atcb_format_datetime(now, 'clean', true);
  }
  // set updated date
  if (data.updated == null || data.updated == '') {
    data.updated = atcb_format_datetime(now, 'clean', true);
  }
  return data;
}

function atcb_decorate_data_meta(data) {
  // set default status on top level
  if (data.status == null || data.status == '') {
    data.status = 'CONFIRMED';
  }
  // set default sequence on top level
  if (data.sequence == null || data.sequence == '') {
    data.sequence = 0;
  }
  return data;
}

function atcb_decorate_data_description(data, i) {
  if (data.dates[`${i}`].description != null && data.dates[`${i}`].description != '') {
    // store a clean description copy without the URL magic for iCal
    data.dates[`${i}`].descriptionHtmlFree = atcb_rewrite_html_elements(data.dates[`${i}`].description, true);
    // ...and transform pseudo elements for the regular one
    data.dates[`${i}`].description = atcb_rewrite_html_elements(data.dates[`${i}`].description);
  } else {
    // if not given per sub-date, we copy from the global one or set '', if not provided at all
    if (data.dates[`${i}`].description == null && data.description != null && data.description != '') {
      data.dates[`${i}`].descriptionHtmlFree = atcb_rewrite_html_elements(data.description, true);
      data.dates[`${i}`].description = atcb_rewrite_html_elements(data.description);
    } else {
      data.dates[`${i}`].descriptionHtmlFree = data.dates[`${i}`].description = '';
    }
  }
  return data;
}

function atcb_decorate_data_extend(data) {
  // in that step, we also copy global values to date objects, if not set nested
  for (let i = 0; i < data.dates.length; i++) {
    data = atcb_decorate_data_description(data, i);
    // for name, we also check for empty, because it is required
    if (data.dates[`${i}`].name == null || data.dates[`${i}`].name == '') {
      data.dates[`${i}`].name = data.name;
    }
    if (data.dates[`${i}`].status == null) {
      data.dates[`${i}`].status = data.status.toUpperCase();
    } else {
      data.dates[`${i}`].status = data.dates[`${i}`].status.toUpperCase();
    }
    if (data.dates[`${i}`].sequence == null) {
      data.dates[`${i}`].sequence = data.sequence;
    }
    if (data.dates[`${i}`].location == null && data.location != null) {
      data.dates[`${i}`].location = data.location;
    }
    if (data.dates[`${i}`].organizer == null && data.organizer != null) {
      data.dates[`${i}`].organizer = data.organizer;
    }
    if (data.dates[`${i}`].attendee == null && data.attendee != null) {
      data.dates[`${i}`].attendee = data.attendee;
    }
    if (data.dates[`${i}`].availability == null && data.availability != null) {
      data.dates[`${i}`].availability = data.availability.toLowerCase();
    } else if (data.dates[`${i}`].availability != null) {
      data.dates[`${i}`].availability = data.dates[`${i}`].availability.toLowerCase();
    }
    // for the uid, we do not copy from the top level, but rather generate it per event (except for the first one)
    if (data.dates[`${i}`].uid == null) {
      if (i == 0 && data.uid != null && data.uid != '') {
        data.dates[0].uid = data.uid;
      } else {
        data.dates[`${i}`].uid = atcb_generate_uuid();
      }
    }
  }
  // we also copy recurrence, but just for easier access and only for the first array element. Multi-date events cannot be recurrent
  if (data.recurrence != null && data.recurrence != '') {
    data.dates[0].recurrence = data.recurrence;
  }
  // last but not least, we sort any sub-events by start data ascending
  if (data.dates.length > 1) {
    data.dates.sort((a, b) => a.timestamp - b.timestamp);
  }
  return data;
}

// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_cleanup(dateTimeData) {
  // set endDate = startDate, if not provided
  if (dateTimeData.endDate == null || dateTimeData.endDate == '') {
    dateTimeData.endDate = dateTimeData.startDate;
  }
  // parse date+time format (unofficial alternatives to the main implementation)
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    if (dateTimeData[point + 'Date'] != null) {
      // remove any milliseconds information
      dateTimeData[point + 'Date'] = dateTimeData[point + 'Date'].replace(/\.\d{3}/, '').replace('Z', '');
      // identify a possible time information within the date string
      const tmpSplitStartDate = dateTimeData[point + 'Date'].split('T');
      if (tmpSplitStartDate[1] != null) {
        dateTimeData[point + 'Date'] = tmpSplitStartDate[0];
        dateTimeData[point + 'Time'] = tmpSplitStartDate[1];
      }
    }
    // remove any seconds from time information
    if (dateTimeData[point + 'Time'] != null && dateTimeData[point + 'Time'].length === 8) {
      const timeStr = dateTimeData[point + 'Time'];
      dateTimeData[point + 'Time'] = timeStr.substring(0, timeStr.length - 3);
    }
    // update time zone, if special case set to go for the user's browser
    if (dateTimeData.timeZone == 'currentBrowser') {
      dateTimeData.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  });
  return dateTimeData;
}

function atcb_date_specials_calculation(type, dateString, timeString = null, timeZone = null) {
  const tmpDate = (function () {
    if (timeString) {
      return new Date(dateString + ' ' + timeString);
    }
    return new Date(dateString);
  })();
  if (type === 'timestamp') {
    // create timestamps (not considering timezones, since this is only for sorting)
    return tmpDate.getTime();
  }
  // determine whether a date is overdue or not
  try {
    let isoString = tmpDate.toISOString();
    if (timeString && timeZone) {
      // if time and time zone information are given, we adjust for time zone
      const offsetEnd = tzlib_get_offset(timeZone, dateString, timeString);
      const formattedOffsetEnd = offsetEnd.slice(0, 3) + ':' + offsetEnd.slice(3);
      isoString.replace('.000Z', formattedOffsetEnd);
    }
    const utcEndDate = new Date(isoString);
    const currentUtcDate = new Date(Date.now()).toUTCString();
    return utcEndDate.getTime() < new Date(currentUtcDate).getTime();
  } catch (e) {
    // we will catch the detailed problem on validation at the next step
    return false;
  }
}

function atcb_date_calculation(dateString) {
  // replace "today" with the current date first
  const today = new Date();
  const todayString = today.getUTCFullYear() + '-' + (today.getUTCMonth() + 1) + '-' + today.getUTCDate();
  dateString = dateString.replace(/today/gi, todayString);
  // check for any dynamic additions and adjust
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0].split('-');
  let newDate = (function () {
    // backwards compatibility for version <1.5.0
    if (dateParts[0].length < 4) {
      return new Date(Date.UTC(dateParts[2], dateParts[0] - 1, dateParts[1]));
    }
    return new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
  })();
  if (dateStringParts[1] != null && dateStringParts[1] > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  try {
    return newDate.toISOString().replace(/T(\d{2}:\d{2}:\d{2}\.\d{3})Z/g, '');
  } catch (e) {
    // we will catch the detailed problem on validation at the next step
    return false;
  }
}

function atcb_decorate_data_button_status_handling(data) {
  // first, check for how we should handle the behavior on overdue events
  if (data.pastDateHandling == null || (data.pastDateHandling != 'disable' && data.pastDateHandling != 'hide')) {
    data.pastDateHandling = 'none';
  }
  const overdue = (function () {
    for (let i = 0; i < data.dates.length; i++) {
      if (!data.dates[`${i}`].endDate) {
        // if at least one sub date has no endDate, the event cannot be in the past
        // TODO: optimize for recurrence, where there is no endDate, but a count limit. We should calculate a recurrence endDate first and then do not need to change anything here.
        return false;
      }
      if (!data.dates[`${i}`].overdue) {
        // we also return false if at least one event is not overdue
        return false;
      }
    }
    // in other cases, all dates would be overdue and therefore also the overall event
    return true;
  })();
  if (overdue) {
    if (data.pastDateHandling == 'disable') {
      data.disabled = true;
    } else if (data.pastDateHandling == 'hide') {
      data.hidden = true;
    }
  }
  // second, block interaction if disabled or hidden
  if (data.disabled || data.hidden) {
    data.blockInteraction = true;
  }
  return data;
}

export { atcb_decorate_data };
