/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.12.6
 *  Creator: Jens Kuerschner (https://jekuer.com)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_offset } from 'timezones-ical-library';
import { atcbIsiOS, atcbIsAndroid, atcbIsMobile, atcbIsBrowser, atcbValidRecurrOptions, atcbInvalidSubscribeOptions, atcbIOSInvalidOptions, atcbAndroidInvalidOptions, atcbWcBooleanParams } from './atcb-globals.js';
import { atcb_translate_via_time_zone, atcb_format_datetime, atcb_rewrite_html_elements, atcb_generate_uuid, atcb_apply_transformation, atcb_getNextOccurrence, atcb_parseRRule } from './atcb-util.js';
import { availableLanguages, rtlLanguages } from './atcb-i18n';
import { atcb_check_bookings } from './atcb-generate-pro.js';

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
async function atcb_decorate_data(data) {
  data = atcb_decorate_data_boolean(data);
  data = atcb_decorate_data_defaults(data);
  data = atcb_decorate_data_recurrence(data);
  data = atcb_decorate_data_options(data);
  data = atcb_decorate_data_style(data);
  data.sizes = atcb_decorate_sizes(data.size);
  data.lightMode = atcb_decorate_light_mode(data.lightMode);
  data = atcb_decorate_data_i18n(data);
  data = atcb_decorate_data_dates(data);
  data = atcb_decorate_data_button_status_handling(data);
  data = await atcb_decorate_data_rsvp(data);
  return data;
}

// setting boolean parameters right, since they can be provided or not
function atcb_decorate_data_boolean(data) {
  for (let i = 0; i < atcbWcBooleanParams.length; i++) {
    const attr = atcbWcBooleanParams[`${i}`];
    if (data[`${attr}`]) {
      // only do something if not already a boolean
      if (typeof data[`${attr}`] !== 'boolean') {
        const val = data[`${attr}`].toString().trim().toLowerCase() || '';
        data[`${attr}`] = val === '' || val === 'true' ? true : false;
      }
    } else {
      data[`${attr}`] = false;
    }
  }
  return data;
}

function atcb_set_date_defaults(dateEntry) {
  // set time zone
  if (!dateEntry.timeZone || dateEntry.timeZone === '') {
    dateEntry.timeZone = 'GMT';
  }
  // set default status
  if (!dateEntry.status || dateEntry.status === '') {
    dateEntry.status = 'CONFIRMED';
  }
  // set default sequence
  if (!dateEntry.sequence || dateEntry.sequence === '') {
    dateEntry.sequence = 0;
  } else {
    dateEntry.sequence = parseInt(dateEntry.sequence);
    if (isNaN(dateEntry.sequence) || dateEntry.sequence < 0) {
      dateEntry.sequence = 0;
    }
  }
}

function atcb_decorate_data_defaults(data) {
  if (data.dates) {
    for (let i = 0; i < data.dates.length; i++) {
      atcb_set_date_defaults(data.dates[`${i}`]);
    }
  } else {
    atcb_set_date_defaults(data);
  }
  // set language if not set
  if (!data.language || data.language === '' || !availableLanguages.includes(data.language)) {
    data.language = 'en';
  }
  return data;
}

// format recurrence
function atcb_decorate_data_recurrence(data) {
  if (data.recurrence && data.recurrence !== '') {
    data = atcb_decorate_data_rrule(data);
    data = atcb_decorate_data_recurring_events(data);
  }
  return data;
}

// format RRULE
function atcb_decorate_data_rrule(data) {
  // remove spaces and force upper case
  data.recurrence = data.recurrence.replace(/\s+/g, '').toUpperCase();
  // if RRULE is set, we parse date from it
  if (/^RRULE:/i.test(data.recurrence)) {
    data.recurrence_simplyfied = false;
    const rruleParts = atcb_parseRRule(data.recurrence, false);
    data.recurrence_until = rruleParts.UNTIL;
    data.recurrence_count = rruleParts.COUNT;
    data.recurrence_byDay = rruleParts.BYDAY;
    data.recurrence_byMonth = rruleParts.BYMONTH;
    data.recurrence_byMonthDay = rruleParts.BYMONTHDAY;
    data.recurrence_interval = rruleParts.INTERVAL;
    data.recurrence_frequency = rruleParts.FREQ;
  } else {
    // otherwise, we create an RRULE from the easy rules
    data.recurrence_simplyfied = true;
    // set interval if not given
    if (!data.recurrence_interval || data.recurrence_interval === '') {
      data.recurrence_interval = 1;
    }
    // set weekstart if not given
    if (!data.recurrence_weekstart || (data.recurrence_weekstart === '') | (data.recurrence_weekstart.length > 2)) {
      data.recurrence_weekstart = 'MO';
    }
    // save frequency before overriding the main recurrence data
    data.recurrence_frequency = data.recurrence;
    // generate the RRULE from easy rules
    data.recurrence = 'RRULE:FREQ=' + data.recurrence + ';WKST=' + data.recurrence_weekstart + ';INTERVAL=' + data.recurrence_interval;
    if (data.recurrence_until && data.recurrence_until !== '') {
      data.recurrence_until = data.recurrence_until.replace(/[-:]/g, '');
      // if only date, add time
      if (data.recurrence_until.length < 9) {
        data.recurrence_until += 'T235959Z';
      }
      data.recurrence = data.recurrence + ';UNTIL=' + data.recurrence_until;
    }
    if (data.recurrence_count && data.recurrence_count !== '') {
      data.recurrence = data.recurrence + ';COUNT=' + data.recurrence_count;
    }
    if (data.recurrence_byDay && data.recurrence_byDay !== '') {
      data.recurrence = data.recurrence + ';BYDAY=' + data.recurrence_byDay;
    }
    if (data.recurrence_byMonth && data.recurrence_byMonth !== '') {
      data.recurrence = data.recurrence + ';BYMONTH=' + data.recurrence_byMonth;
    }
    if (data.recurrence_byMonthDay && data.recurrence_byMonthDay !== '') {
      data.recurrence = data.recurrence + ';BYMONTHDAY=' + data.recurrence_byMonthDay;
    }
  }
  return data;
}

// Adjust recurring events for next data
function atcb_decorate_data_recurring_events(data) {
  const startDate = data.dates?.[0].startDate || data.startDate;
  const startTime = data.dates?.[0].startTime || data.startTime;
  const startDateTime = (function () {
    if (startTime && startTime !== '') {
      const offset = tzlib_get_offset(data.dates?.[0].timeZone || data.timeZone, startDate, startTime);
      return new Date(startDate + ' ' + startTime + ':00 GMT' + offset);
    }
    return new Date(startDate + 'T00:00:00Z');
  })();
  // allday should be true when there is NO explicit startTime
  const isAllDay = !(startTime && startTime !== '');
  const occurenceData = atcb_getNextOccurrence(data.recurrence, startDateTime, isAllDay);
  if (!occurenceData || !occurenceData.nextOccurrence) {
    // if no next occurrence could be determined, we just return the original data (e.g. if there is no end to the recurrence)
    return data;
  }
  const nextOccurrence =
    String(occurenceData.nextOccurrence.getFullYear()) +
    '-' +
    String(occurenceData.nextOccurrence.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(occurenceData.nextOccurrence.getDate()).padStart(2, '0') +
    (startTime && startTime !== '' ? 'T' + String(occurenceData.nextOccurrence.getHours()).padStart(2, '0') + ':' + String(occurenceData.nextOccurrence.getMinutes()).padStart(2, '0') : '');
  // determine start date from next occurrence Date object
  data.startDate = nextOccurrence.slice(0, 10);
  if (startTime && startTime !== '') {
    data.startTime = nextOccurrence.slice(11, 16);
  }
  // determine new end date based on duration between start and end of original event
  const endDate = data.dates?.[0].endDate || data.endDate || startDate;
  const endTime = data.dates?.[0].endTime || data.endTime || '';
  const diff = new Date(endDate + (endTime && endTime !== '' ? 'T' + endTime : '')) - new Date(startDate + (startTime && startTime !== '' ? 'T' + startTime : ''));
  const newEndDateTime = new Date(occurenceData.nextOccurrence.getTime() + diff);
  const newEndDateTimeString =
    String(newEndDateTime.getFullYear()) +
    '-' +
    String(newEndDateTime.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(newEndDateTime.getDate()).padStart(2, '0') +
    (endTime && endTime !== '' ? 'T' + String(newEndDateTime.getHours()).padStart(2, '0') + ':' + String(newEndDateTime.getMinutes()).padStart(2, '0') : '');
  data.endDate = newEndDateTimeString.slice(0, 10);
  if (endTime && endTime !== '') {
    data.endTime = newEndDateTimeString.slice(11, 16);
  }
  // set count (if given)
  if ((data.recurrence_count && data.recurrence_count !== '') || (data.recurrence_until && data.recurrence_until !== '')) {
    if (occurenceData.adjustedCount < 2) {
      // drop whole reccurence
      data.recurrence = '';
      data.recurrence_frequency = '';
      data.recurrence_interval = '';
    } else {
      data.recurrence_count = occurenceData.adjustedCount;
      // adjust RRULE accordingly
      data.recurrence = data.recurrence.replace(/;?COUNT=\d+/i, ';COUNT=' + data.recurrence_count);
      // drop until (as it is not supported by some calendars)
      if (data.recurrence_until && data.recurrence_until !== '') {
        data.recurrence_until = '';
        data.recurrence = data.recurrence.replace(/;?UNTIL=\w+/i, ';COUNT=' + data.recurrence_count);

        if (data.dates && data.dates[0].recurrence) {
          data.dates[0].recurrence = data.dates[0].recurrence.replace(/;?UNTIL=\w+/i, ';COUNT=' + data.recurrence_count);
        }
      }
    }
  }
  return data;
}

// cleanup options, standardizing names, and check for mobile special rules
function atcb_decorate_data_options(data) {
  const { options, source } = atcb_determine_options_source(data);
  let { newOptions, iCalGiven, appleGiven } = atcb_process_options(options, data);
  newOptions = atcb_handle_special_google_calendar_case(data, newOptions);
  ({ newOptions, iCalGiven } = atcb_ensure_fallback_options(newOptions, iCalGiven));
  const mobileOptionsUsedWithIcs = source !== 'general' && (options.includes('ical') || options.includes('apple'));
  newOptions = atcb_adjust_platform_specific_options(newOptions, data, iCalGiven, appleGiven, mobileOptionsUsedWithIcs);
  // sort options alphabetically and update data
  newOptions.sort();
  data.options = newOptions;
  return data;
}

// determine which options array to use based on platform and availability
function atcb_determine_options_source(data) {
  let source = 'general';
  let options = data.options || ['ical'];
  if (atcbIsiOS() || data.fakeIOS) {
    if (data.optionsIOS && data.optionsIOS.length > 0) {
      source = 'ios';
      options = data.optionsIOS;
    }
    if (data.optionsMobile && data.optionsMobile.length > 0) {
      source = 'mobile';
      options = data.optionsMobile;
    }
  } else if ((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && data.optionsMobile && data.optionsMobile.length > 0) {
    source = 'mobile';
    options = data.optionsMobile;
  }
  return { options, source };
}

// process options array and filter invalid options
function atcb_process_options(theOptions, data) {
  let newOptions = [];
  let iCalGiven = false;
  let appleGiven = false;
  for (let i = 0; i < theOptions.length; i++) {
    const optionName = atcb_normalize_option_name(theOptions[`${i}`]);
    // track which ical-type options were provided
    if (optionName === 'apple') appleGiven = true;
    if (optionName === 'ical') iCalGiven = true;
    // skip invalid options based on various criteria
    if (atcb_should_skip_option(optionName, data)) {
      continue;
    }
    newOptions.push(optionName);
  }
  return { newOptions, iCalGiven, appleGiven };
}

// normalize option name (clean and standardize)
function atcb_normalize_option_name(option) {
  const cleanOption = option.split('|');
  return cleanOption[0].toLowerCase().replace('microsoft', 'ms').replace(/\./, '');
}

// determine if an option should be skipped based on platform and context
function atcb_should_skip_option(optionName, data) {
  return atcb_is_platform_invalid_option(optionName, data) || atcb_is_recurrence_invalid_option(optionName, data) || atcb_is_subscription_invalid_option(optionName, data) || atcb_is_microsoft_mobile_subscription_case(optionName, data);
}

// check if option is invalid for current platform
function atcb_is_platform_invalid_option(optionName, data) {
  const isIOSWithInvalidOption = (atcbIsiOS() || data.fakeIOS) && atcbIOSInvalidOptions.includes(optionName) && (!data.optionsIOS || data.optionsIOS.length === 0) && (!data.optionsMobile || data.optionsMobile.length === 0);
  const isAndroidWithInvalidOption = (atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && atcbAndroidInvalidOptions.includes(optionName) && (!data.optionsMobile || data.optionsMobile.length === 0);
  return isIOSWithInvalidOption || isAndroidWithInvalidOption;
}

// check if option is invalid for recurrence events
function atcb_is_recurrence_invalid_option(optionName, data) {
  if (!data.recurrence || data.recurrence === '') return false;
  const isInvalidForRecurrence = !atcbValidRecurrOptions.includes(optionName);
  const isGoogleOnIOS = (atcbIsiOS() || data.fakeIOS) && optionName === 'google';
  return isInvalidForRecurrence || isGoogleOnIOS;
}

// check if option is invalid for subscription events
function atcb_is_subscription_invalid_option(optionName, data) {
  return data.subscribe && atcbInvalidSubscribeOptions.includes(optionName);
}

// tmp patch to reflect the fact that Microsoft is routing mobile traffic differently. We handle regular events on the link level, but subscription cases need to be stripped out
// TODO: remove this, when Microsoft has fixed this
function atcb_is_microsoft_mobile_subscription_case(optionName, data) {
  return (atcbIsMobile() || data.fakeMobile) && data.subscribe && (optionName === 'ms365' || optionName === 'outlookcom');
}

// if we are in a subscription case and the icsFile starts with https://calendar.google.com/calendar/ and does not end with .ics, we only set the google option as everything else would not work
function atcb_handle_special_google_calendar_case(data, newOptions) {
  if (data.subscribe && data.icsFile && data.icsFile.startsWith('https://calendar.google.com/calendar/') && !data.icsFile.endsWith('.ics')) {
    return ['google'];
  }
  return newOptions;
}

// since the above can lead to excluding all options, we add the iCal option as default, if no other option is left
function atcb_ensure_fallback_options(newOptions, iCalGiven) {
  if (newOptions.length === 0) {
    newOptions.push('ical');
    iCalGiven = true;
  }
  return { newOptions, iCalGiven };
}

// adjust options based on platform-specific requirements
function atcb_adjust_platform_specific_options(options, data, iCalGiven, appleGiven, mobileOptionsUsed = false) {
  // generally, only adjust if not intentionally specified via mobile options
  if (!mobileOptionsUsed) {
    // for iOS, force Apple option if iCal was given but Apple wasn't
    if ((atcbIsiOS() || data.fakeIOS) && iCalGiven && !appleGiven) {
      options.push('apple');
      // drop iCal option, since it does not make sense on iOS (as the apple option covers it)
      options = options.filter((option) => option !== 'ical');
    }
    // for Android, force iCal option if Apple was given but iCal wasn't
    else if ((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && appleGiven && !iCalGiven) {
      options.push('ical');
      // drop Apple option, since it does not make sense on Android
      options = options.filter((option) => option !== 'apple');
    }
  }
  return options;
}

function atcb_decorate_data_style(data) {
  // set inline if inlineRSVP
  if (data.inlineRSVP) {
    data.inline = true;
  }
  // set default listStyle
  if (!data.listStyle || data.listStyle === '') {
    data.listStyle = 'dropdown';
  }
  // force click trigger on modal style
  if (data.listStyle === 'modal') {
    data.trigger = 'click';
  }
  // set button style and force click on styles, where the dropdown is not attached to the button
  if (data.buttonStyle && data.buttonStyle !== '' && data.buttonStyle != 'default') {
    if (data.buttonStyle == 'simple' || data.buttonStyle == 'round' || data.buttonStyle == 'text' || data.buttonStyle == 'date' || data.buttonStyle == 'neumorphism') {
      data.trigger = 'click';
    }
  } else {
    data.buttonStyle = 'default';
  }
  // force overlay when the button label is ommited, but the list labels are not (which would make the list need to be way larger than the button) - at dropdown cases
  if ((data.buttonStyle == 'default' || data.buttonStyle == '3d' || data.buttonStyle == 'flat') && !data.hideTextLabelList && data.hideTextLabelButton && (data.listStyle == 'dropdown' || data.listStyle == 'dropdown-static' || data.listStyle == 'dropup-static')) {
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
  if (size && size !== '') {
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
  if (lightMode == 'system' && atcbIsBrowser()) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  if (lightMode != 'bodyScheme' && lightMode != 'dark') {
    return 'light';
  }
  return lightMode;
}

function atcb_decorate_data_i18n(data) {
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
  // if there is no dates array, we create one with the name of the event (will be filled further afterwards)
  if (!data.dates || !Array.isArray(data.dates)) {
    data.dates = [{ name: data.name }];
  }
  // we copy recurrence from root, but just for easier access and only for the first array element. Multi-date events cannot be recurrent
  if (data.recurrence && data.recurrence !== '') {
    data.dates[0].recurrence = data.recurrence;
  }
  // process each date entry and decorate it
  for (let i = 0; i < data.dates.length; i++) {
    data = atcb_move_root_values_into_dates(data, i);
    data = atcb_dates_cleanup(data, i);
    data = atcb_generate_unique_uid(data, i);
    data = atcb_transform_strings(data, i);
    data = atcb_decorate_data_description(data, i);
    data = atcb_replace_custom_variables(data, i);
    data = atcb_set_online_event_flag(data, i);
  }
  // calculate current time
  const now = new Date();
  // set created date
  if (!data.created || data.created === '') {
    data.created = atcb_format_datetime(now, 'clean', true);
  }
  // set updated date
  if (!data.updated || data.updated === '') {
    data.updated = atcb_format_datetime(now, 'clean', true);
  }
  // last but not least, we sort any subEvent by start date ascending
  if (data.dates.length > 1) {
    data.dates.sort((a, b) => a.timestamp - b.timestamp);
  }
  return data;
}

// override the dates information with values on the root level
function atcb_move_root_values_into_dates(data, i) {
  const dateEntry = data.dates[`${i}`];
  const properties = ['description', 'startDate', 'startTime', 'endDate', 'endTime', 'timeZone', 'useUserTZ', 'location', 'status', 'sequence', 'availability', 'organizer', 'attendee'];
  // do it for name only if data.dates is not >1 as in this case, name would be used for the event series title
  if (data.dates.length === 1) {
    properties.unshift('name');
  }
  properties.forEach((prop) => {
    // only override if value is given on root level (mind sequence, where 0 is a valid value)
    if ((data[`${prop}`] && data[`${prop}`] !== '') || (prop === 'sequence' && data[`${prop}`] === 0)) {
      dateEntry[`${prop}`] = data[`${prop}`];
    }
  });
  // TODO: delete root values and only use the dates object from here on
  return data;
}

// cleanup different date-time formats
function atcb_dates_cleanup(data, i) {
  const dateEntry = data.dates[`${i}`];
  const cleanedUpDates = atcb_date_cleanup(dateEntry);
  dateEntry.startDate = cleanedUpDates.startDate;
  dateEntry.endDate = cleanedUpDates.endDate;
  dateEntry.startTime = cleanedUpDates.startTime;
  dateEntry.endTime = cleanedUpDates.endTime;
  dateEntry.timeZone = cleanedUpDates.timeZone;
  // calculating more special meta information
  dateEntry.timestamp = atcb_date_specials_calculation('timestamp', dateEntry.startDate, dateEntry.startTime, dateEntry.timeZone);
  dateEntry.overdue = atcb_date_specials_calculation('overdue', dateEntry.endDate, dateEntry.endTime, dateEntry.timeZone);
  return data;
}

// generate unique UID for date entry
function atcb_generate_unique_uid(data, i) {
  const dateEntry = data.dates[`${i}`];
  if (!dateEntry.uid) {
    if (i === 0 && data.uid && data.uid !== '') {
      // first entry gets the base UID
      dateEntry.uid = data.uid;
    } else if (data.uid && data.uid !== '') {
      // subsequent entries get incremented UID
      dateEntry.uid = `${data.uid}-${i + 1}`;
    } else {
      // no global UID, generate new one
      dateEntry.uid = atcb_generate_uuid();
    }
  }
  return data;
}

// transform strings
function atcb_transform_strings(data, i) {
  const dateEntry = data.dates[`${i}`];
  dateEntry.status = atcb_apply_transformation(dateEntry.status, 'upper');
  dateEntry.availability = atcb_apply_transformation(dateEntry.availability, 'lower');
  return data;
}

// clean up the description and create copies for different formats
function atcb_decorate_data_description(data, i) {
  const cleanDescription = (desc) => desc.replace(/(\\r\\n|\\n|\\r|<br(\s*\/?)>)/g, '');
  let description = data.dates[`${i}`].description;
  if (description) {
    // remove any "wrong" line breaks
    description = cleanDescription(description);
    // store a clean description copy without the URL magic for Yahoo, MS Teams, ...
    const descriptionHtmlFree = atcb_rewrite_html_elements(description, true);
    // ... and iCal
    const descriptionHtmlFreeICal = atcb_rewrite_html_elements(description, true, true);
    // ...and transform pseudo elements for the regular one
    description = atcb_rewrite_html_elements(description);
    data.dates[`${i}`] = { ...data.dates[`${i}`], description, descriptionHtmlFree, descriptionHtmlFreeICal };
  } else {
    data.dates[`${i}`].descriptionHtmlFree = data.dates[`${i}`].descriptionHtmlFreeICal = data.dates[`${i}`].description = '';
  }
  return data;
}

// set online event flag based on location URL
function atcb_set_online_event_flag(data, i) {
  const dateEntry = data.dates[`${i}`];
  if (dateEntry.location && dateEntry.location.startsWith('http')) {
    dateEntry.onlineEvent = true;
  } else {
    dateEntry.onlineEvent = false;
  }
  return data;
}

// replace custom variable placeholders in name and location
function atcb_replace_custom_variables(data, i) {
  if (!data.customVar) return data;
  const dateEntry = data.dates[`${i}`];
  for (const key in data.customVar) {
    const value = data.customVar[`${key}`];
    dateEntry.name = atcb_replace_placeholder(dateEntry.name, key, value);
    dateEntry.location = atcb_replace_placeholder(dateEntry.location, key, value);
  }
  return data;
}

// replace placeholder in text with value
function atcb_replace_placeholder(text, key, value) {
  const placeholder = '%%' + key.replace(/[^\w\-.]/g, '') + '%%';
  if (!text) return text;
  // eslint-disable-next-line security/detect-non-literal-regexp
  return text.replace(new RegExp(placeholder, 'gi'), value);
}

// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_cleanup(dateTimeData) {
  // Utility function to validate date format
  function isValidDateFormat(dateStr) {
    return /^\d\d\d\d-\d\d-\d\d(?:T\d\d:\d\d)?(?::\d\d)?(?:.\d\d\d)?Z?(?:\+(?:\d|\d\d|\d\d\d|\d\d\d\d))?$/i.test(dateStr);
  }
  // Utility function to validate 'today' format
  function isValidTodayFormat(dateStr) {
    return /^today(?:\+(?:\d|\d\d|\d\d\d|\d\d\d\d))?$/i.test(dateStr);
  }
  // set endDate = startDate, if not provided
  if (!dateTimeData.endDate || dateTimeData.endDate === '') {
    dateTimeData.endDate = dateTimeData.startDate;
  }
  // parse date+time format (unofficial alternatives to the main implementation); also calculate any dynamic dates
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    const dateStr = dateTimeData[point + 'Date'];
    // validate first (we set some text instead, so the later validation picks it up as an error)
    if (!isValidDateFormat(dateStr) && !isValidTodayFormat(dateStr)) {
      dateTimeData[point + 'Date'] = 'badly-formed';
    } else {
      // dynamic date replacement (if dateStr includes a + or is today format)
      if (/\+/.test(dateStr) || isValidTodayFormat(dateStr)) dateTimeData[point + 'Date'] = atcb_date_calculation(dateStr);
      // second, if valid, clean up
      if (dateTimeData[point + 'Date']) {
        // identify a possible time information within the date string
        const tmpSplitStartDate = dateTimeData[point + 'Date'].split('T');
        if (tmpSplitStartDate[1]) {
          dateTimeData[point + 'Date'] = tmpSplitStartDate[0];
          dateTimeData[point + 'Time'] = tmpSplitStartDate[1];
        }
      }
      // remove any seconds and more from time information
      if (dateTimeData[point + 'Time'] && dateTimeData[point + 'Time'].length > 5) {
        dateTimeData[point + 'Time'] = dateTimeData[point + 'Time'].substring(0, 5);
      }
    }
  });
  // update time zone, if special case set to go for the user's browser
  if (dateTimeData.timeZone === 'currentBrowser' || dateTimeData.useUserTZ) {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'GMT';
    // for the useUserTZ, we also recalculate the start and end date (and time) to the user's time zone based on the given time zone
    if (dateTimeData.useUserTZ && dateTimeData.startTime && dateTimeData.startTime !== '' && dateTimeData.endTime && dateTimeData.endTime !== '') {
      const newStartDateTime = atcb_translate_via_time_zone(dateTimeData.startDate, dateTimeData.startTime, dateTimeData.timeZone, browserTimezone);
      const newEndDateTime = atcb_translate_via_time_zone(dateTimeData.endDate, dateTimeData.endTime, dateTimeData.timeZone, browserTimezone);
      dateTimeData.startDate = newStartDateTime[0];
      dateTimeData.startTime = newStartDateTime[1];
      dateTimeData.endDate = newEndDateTime[0];
      dateTimeData.endTime = newEndDateTime[1];
    }
    // in both cases, the time zone is set to the user's time zone
    dateTimeData.timeZone = browserTimezone;
  }
  return dateTimeData;
}

function atcb_date_specials_calculation(type, dateString, timeString = null, timeZone) {
  try {
    const tmpDate = (function () {
      if (timeString) {
        const offsetEnd = tzlib_get_offset(timeZone, dateString, timeString);
        return new Date(dateString + ' ' + timeString + ':00 GMT' + offsetEnd);
      }
      return new Date(dateString);
    })();
    if (type === 'timestamp') {
      // create timestamps (for sorting and rrule calculations)
      return tmpDate.getTime();
    }
    // determine whether a date is overdue or not
    if (!timeString) {
      tmpDate.setDate(tmpDate.getDate() + 1);
    }
    const currentUtcDate = new Date().toISOString();
    return tmpDate.getTime() < new Date(currentUtcDate).getTime();
  } catch {
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
  const newDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2].substring(0, 2)));
  if (dateStringParts[1] && dateStringParts[1] > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  try {
    return newDate.toISOString().replace(/T(\d{2}:\d{2}:\d{2}\.\d{3})Z/g, '');
  } catch {
    // we will catch the detailed problem on validation at the next step
    return false;
  }
}

// Adjust for past events
function atcb_decorate_data_button_status_handling(data) {
  // first, check for how we should handle the behavior on overdue events
  if (!data.pastDateHandling || (data.pastDateHandling !== 'disable' && data.pastDateHandling !== 'hide')) {
    data.pastDateHandling = 'none';
  }
  data.allOverdue = (function () {
    for (let i = 0; i < data.dates.length; i++) {
      if (!data.dates[`${i}`].overdue) {
        // we return false if at least one event is not overdue
        return false;
      }
    }
    // in other cases, all dates would be overdue and therefore also the overall event
    return true;
  })();
  if (data.allOverdue) {
    if (data.pastDateHandling === 'disable') {
      data.disabled = true;
    } else if (data.pastDateHandling === 'hide') {
      data.hidden = true;
    }
  } else {
    // if there are >1 dates, we drop those that are overdue, if the handling is set to hide
    if (data.pastDateHandling === 'hide' && data.dates.length > 1) {
      const filteredDates = [];
      for (let i = 0; i < data.dates.length; i++) {
        if (!data.dates[`${i}`].overdue) {
          filteredDates.push(data.dates[`${i}`]);
        }
      }
      data.dates = filteredDates;
    }
  }
  // second, check whether all dates are status "cancelled"
  data.allCancelled = (function () {
    for (let i = 0; i < data.dates.length; i++) {
      if (!data.dates[`${i}`].status || data.dates[`${i}`].status.toLowerCase() !== 'cancelled') {
        return false;
      }
    }
    return true;
  })();
  // third, block interaction if disabled or hidden
  if (data.disabled || data.hidden) {
    data.blockInteraction = true;
  }
  return data;
}

async function atcb_decorate_data_rsvp(data) {
  if (typeof atcb_check_bookings !== 'function' || !data.rsvp || !data.proKey || Object.keys(data.rsvp).length === 0) return data;
  // determine whether RSVP is expired
  data.rsvp.expired = (function () {
    if (data.rsvp && data.rsvp.expires && new Date(data.rsvp.expires) < new Date()) {
      return true;
    }
    return false;
  })();
  // determine whether RSVP is booked out and set # seats left
  if (data.rsvp.max) {
    const bookings = await atcb_check_bookings(data.proKey, data.dev);
    data.rsvp.seatsLeft = data.rsvp.max - bookings;
    if (data.rsvp.seatsLeft < 1) {
      data.rsvp.bookedOut = true;
    }
    if (data.rsvp.expired || data.rsvp.bookedOut) {
      data.blockInteraction = true;
    }
    if (data.blockInteraction) {
      data.disabled = true;
    }
  }
  return data;
}

export { atcb_decorate_data, atcb_decorate_data_dates, atcb_decorate_data_recurrence };
