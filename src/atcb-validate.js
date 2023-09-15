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

import { tzlib_get_timezones } from 'timezones-ical-library';
import { atcbOptions } from './atcb-globals.js';
import { atcb_secure_url, atcb_validEmail, atcb_generate_uuid } from './atcb-util.js';

// CHECK FOR REQUIRED FIELDS
function atcb_check_required(data) {
  if (data.validationError) {
    data.validationError = null;
  }
  // in this first step, we only check for the bare minimum, so we can abort early on really broken setups. We will do further validation later.
  // check for at least 1 option
  if (data.options == null || data.options.length < 1) {
    data.validationError = 'Add to Calendar Button generation failed: no valid options set';
    return false;
  }
  // check for min required data (without "options")
  // name is always required on top level (in the multi-date setup this would be the name of the event series)
  if (data.name == null || data.name == '') {
    data.validationError = 'Add to Calendar Button generation failed: required name information missing';
    return false;
  }
  // regarding event specifics, we start by checking for multi-date setups
  if (data.dates != null && data.dates.length > 0) {
    const requiredMultiField = ['name', 'startDate'];
    const requiredMultiFieldFlex = ['name'];
    return requiredMultiField.every(function (field) {
      for (let i = 0; i < data.dates.length; i++) {
        // if a field is missing, for flexible fields, we also need to check, whether they might be present globally (fallback for them)
        if (
          (!requiredMultiFieldFlex.includes(`${field}`) && (data.dates[`${i}`][`${field}`] == null || data.dates[`${i}`][`${field}`] == '')) ||
          (requiredMultiFieldFlex.includes(`${field}`) && (data.dates[`${i}`][`${field}`] == null || data.dates[`${i}`][`${field}`] == '') && (data[`${field}`] == null || data[`${field}`] == ''))
        ) {
          data.validationError = 'Add to Calendar Button generation failed: required setting missing [dates array object #' + (i + 1) + '/' + data.dates.length + '] => [' + field + ']';
          return false;
        }
      }
      return true;
    });
  } else {
    const requiredSingleField = ['startDate'];
    return requiredSingleField.every(function (field) {
      if (data[`${field}`] == null || data[`${field}`] == '') {
        data.validationError = 'Add to Calendar Button generation failed: required setting missing [' + field + ']';
        return false;
      }
      return true;
    });
  }
}

// VALIDATE THE INPUT DATA
function atcb_validate(data) {
  if (data.validationError) {
    data.validationError = null;
  }
  const msgPrefix = 'Add to Calendar Button generation (' + data.identifier + ')';
  if (!atcb_validate_icsFile(data, msgPrefix)) return false;
  if (!atcb_validate_buttonStyle(data, msgPrefix)) return false;
  if (!atcb_validate_subscribe(data, msgPrefix)) return false;
  if (!atcb_validate_created(data, msgPrefix)) return false;
  if (!atcb_validate_updated(data, msgPrefix)) return false;
  if (!atcb_validate_options(data, msgPrefix)) return false;
  if (!atcb_validate_date_blocks(data, msgPrefix)) return false;
  if (!atcb_validate_rrule(data, msgPrefix)) return false;
  if (data.recurrence_simplyfied) {
    if (!atcb_validate_rrule_simplyfied(data, msgPrefix)) return false;
  }
  // on passing the validation, return true
  return true;
}

// validate explicit ics file
function atcb_validate_icsFile(data, msgPrefix, i = '', msgSuffix = '') {
  const icsFileStr = (function () {
    if (i != '' && data.dates[`${i}`].icsFile != null) {
      return data.dates[`${i}`].icsFile;
    }
    if (i == '' && data.icsFile != null) {
      return data.icsFile;
    }
    return '';
  })();
  if (icsFileStr != '') {
    if (!atcb_secure_url(icsFileStr, false) || (!data.icsFile.startsWith('https://') && !data.icsFile.startsWith('http://'))) {
      data.validationError = msgPrefix + ' failed: explicit ics file path not valid' + msgSuffix;
      return false;
    }
  }
  return true;
}

// validate the subscription functionality (requires an explicit ics file)
function atcb_validate_buttonStyle(data, msgPrefix) {
  const availableStyles = ['default', '3d', 'flat', 'round', 'neumorphism', 'text', 'date', 'custom', 'none'];
  if (!availableStyles.includes(data.buttonStyle)) {
    data.validationError = msgPrefix + ' failed: provided buttonStyle invalid';
    return false;
  }
  if (data.customCss != null && data.customCss != '' && (!atcb_secure_url(data.customCss, false) || !/\.css$/m.test(data.customCss))) {
    data.validationError = msgPrefix + ' failed: customCss provided, but no valid url';
    return false;
  }
  if ((data.customCss == null || data.customCss == '') && data.buttonStyle == 'custom') {
    data.validationError = msgPrefix + ' failed: buttonStyle "custom" selected, but no customCss file provided';
    return false;
  }
  return true;
}

// validate the subscription functionality (requires an explicit ics file)
function atcb_validate_subscribe(data, msgPrefix) {
  if (data.subscribe == true && (data.icsFile == null || data.icsFile == '')) {
    data.validationError = msgPrefix + ' failed: a subscription calendar requires a valid explicit ics file as well';
    return false;
  }
  return true;
}

// validate created input
function atcb_validate_created(data, msgPrefix) {
  if (!/^\d{8}T\d{6}Z$/.test(data.created)) {
    data.validationError = msgPrefix + ' failed: created date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ';
    return false;
  }
  return true;
}

// validate updated input
function atcb_validate_updated(data, msgPrefix) {
  if (!/^\d{8}T\d{6}Z$/.test(data.updated)) {
    data.validationError = msgPrefix + ' failed: updated date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ';
    return false;
  }
  return true;
}

// validate options
function atcb_validate_options(data, msgPrefix) {
  // we check for valid options again, since they might have been changed during decoration
  if (data.options == null || data.options.length < 1) {
    data.validationError = msgPrefix + ' failed: no valid options available';
    return false;
  }
  // we also double-check whether options are valid
  if (
    !data.options.every(function (option) {
      if (!atcbOptions.includes(option)) {
        data.validationError = msgPrefix + ' failed: invalid option [' + option + ']';
        return false;
      }
      return true;
    })
  ) {
    return false;
  }
  return true;
}

// next goes for all date blocks
function atcb_validate_date_blocks(data, msgPrefix) {
  for (let i = 0; i < data.dates.length; i++) {
    const msgSuffix = (function () {
      if (data.dates.length == 1) {
        return '';
      } else {
        return ' [dates array object #' + (i + 1) + '/' + data.dates.length + '] ';
      }
    })();
    if (!atcb_validate_icsFile(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_status(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_availability(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_organizer(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_attendee(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_uid(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_sequence(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_timezone(data, msgPrefix, i, msgSuffix)) return false;
    if (!atcb_validate_datetime(data, msgPrefix, i, msgSuffix)) return false;
  }
  return true;
}

// validate status
function atcb_validate_status(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].status != 'TENTATIVE' && data.dates[`${i}`].status != 'CONFIRMED' && data.dates[`${i}`].status != 'CANCELLED') {
    data.validationError = msgPrefix + ' failed: event status needs to be TENTATIVE, CONFIRMED, or CANCELLED' + msgSuffix;
    return false;
  }
  return true;
}

// validate availability
function atcb_validate_availability(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].availability != null && data.dates[`${i}`].availability != '' && data.dates[`${i}`].availability != 'free' && data.dates[`${i}`].availability != 'busy') {
    data.validationError = msgPrefix + ' failed: event availability needs to be "free" or "busy"' + msgSuffix;
    return false;
  }
  return true;
}

// validate organizer
function atcb_validate_organizer(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
    const organizerParts = data.dates[`${i}`].organizer.split('|');
    if (organizerParts.length != 2 || organizerParts[0].length > 50 || organizerParts[1].length > 80 || !atcb_validEmail(organizerParts[1])) {
      data.validationError = msgPrefix + ' failed: organizer needs to match the schema "NAME|EMAIL" with a valid email address' + msgSuffix;
      return false;
    }
  }
  return true;
}

// validate attendee
function atcb_validate_attendee(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].attendee != null && data.dates[`${i}`].attendee != '') {
    // when setting the attendee, an organizer needs to be set as well
    if (data.dates[`${i}`].organizer == null || data.dates[`${i}`].organizer == '') {
      data.validationError = msgPrefix + ' failed: if an attendee is set, you also need to set the organizer' + msgSuffix;
      return false;
    }
    // additionally, we check the same format as with the organizer (only 1 attendee possible)
    const attendeeParts = data.dates[`${i}`].attendee.split('|');
    if (attendeeParts.length != 2 || attendeeParts[0].length > 50 || attendeeParts[1].length > 80 || !atcb_validEmail(attendeeParts[1])) {
      data.validationError = msgPrefix + ' failed: attendee needs to match the schema "NAME|EMAIL" with a valid email address' + msgSuffix;
      return false;
    }
  }
  return true;
}

// validate UID
function atcb_validate_uid(data, msgPrefix, i, msgSuffix) {
  // must have less then 255 characters and only allowes for alpha characters, numbers, and dashes; see https://icalendar.org/New-Properties-for-iCalendar-RFC-7986/5-3-uid-property.html
  if (!/^(\w|-){1,254}$/.test(data.dates[`${i}`].uid)) {
    if (data.debug) {
      console.warn(msgPrefix + ': UID not valid. May only contain alpha, digits, and dashes; and be less than 255 characters. Falling back to an automated value!' + msgSuffix);
    }
    data.dates[`${i}`].uid = atcb_generate_uuid();
  }
  // validate UID for the recommended form, which is not forced, but show throw a warning
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.dates[`${i}`].uid) && data.debug) {
    console.warn(msgPrefix + ': UID is highly recommended to be a hex-encoded random Universally Unique Identifier (UUID)!' + msgSuffix);
  }
  return true;
}

// validate sequence number if given and set it 0 if not
function atcb_validate_sequence(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].sequence != null && (data.dates[`${i}`].sequence < 0 || data.dates[`${i}`].sequence % 1 != 0)) {
    if (data.debug) {
      console.log(msgPrefix + ': sequence needs to be a full number >= 0. Used the default 0 instead' + msgSuffix);
    }
    data.dates[`${i}`].sequence = 0;
  }
  return true;
}

// validate time zone
function atcb_validate_timezone(data, msgPrefix, i, msgSuffix) {
  const validTimeZones = tzlib_get_timezones();
  if (!validTimeZones.includes(data.dates[`${i}`].timeZone)) {
    data.validationError = msgPrefix + ' failed: invalid time zone given' + msgSuffix;
    return false;
  }
  return true;
}

// validate date and time
function atcb_validate_datetime(data, msgPrefix, i, msgSuffix) {
  const dates = ['startDate', 'endDate'];
  const newDate = dates;
  // testing for right format first
  //mind that during decoration, we already cleaned up dates, so 2022-44-55 would be also valid, since it gets adjusted automatically. However, we have some pre-validation there too
  if (
    !dates.every(function (date) {
      if (data.dates[`${i}`][`${date}`].length !== 10) {
        data.validationError = msgPrefix + ' failed: date misspelled [-> YYYY-MM-DD]' + msgSuffix;
        return false;
      }
      const dateParts = data.dates[`${i}`][`${date}`].split('-');
      if (dateParts.length < 3 || dateParts.length > 3) {
        data.validationError = msgPrefix + ' failed: date misspelled [' + date + ': ' + data.dates[`${i}`][`${date}`] + ']' + msgSuffix;
        return false;
      }
      // setting date for further time validation
      newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return true;
    })
  ) {
    return false;
  }
  const times = ['startTime', 'endTime'];
  if (
    !times.every(function (time) {
      if (data.dates[`${i}`][`${time}`] != null) {
        if (data.dates[`${i}`][`${time}`].length !== 5) {
          data.validationError = msgPrefix + ' failed: time misspelled [-> HH:MM]' + msgSuffix;
          return false;
        }
        const timeParts = data.dates[`${i}`][`${time}`].split(':');
        // validate the time parts
        if (timeParts.length < 2 || timeParts.length > 2) {
          data.validationError = msgPrefix + ' failed: time misspelled [' + time + ': ' + data.dates[`${i}`][`${time}`] + ']' + msgSuffix;
          return false;
        }
        if (timeParts[0] > 23) {
          data.validationError = msgPrefix + ' failed: time misspelled - hours number too high [' + time + ': ' + timeParts[0] + ']' + msgSuffix;
          return false;
        }
        if (timeParts[1] > 59) {
          data.validationError = msgPrefix + ' failed: time misspelled - minutes number too high [' + time + ': ' + timeParts[1] + ']' + msgSuffix;
          return false;
        }
        // update the date with the time for further validation steps
        if (time == 'startTime') {
          newDate.startDate = new Date(newDate.startDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000);
        }
        if (time == 'endTime') {
          newDate.endDate = new Date(newDate.endDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000);
        }
      }
      return true;
    })
  ) {
    return false;
  }
  if ((data.dates[`${i}`].startTime != null && data.dates[`${i}`].endTime == null) || (data.dates[`${i}`].startTime == null && data.dates[`${i}`].endTime != null)) {
    data.validationError = msgPrefix + ' failed: if you set a starting or end time, the respective other one also needs to be defined' + msgSuffix;
    return false;
  }
  // validate whether end is not before start
  if (newDate.endDate < newDate.startDate) {
    data.validationError = msgPrefix + ' failed: end date before start date' + msgSuffix;
    return false;
  }
  return true;
}

// validate RRULE
function atcb_validate_rrule(data, msgPrefix) {
  // check for multi-date (which is not allowed)
  if (data.recurrence != null && data.recurrence != '' && data.dates.length > 1) {
    data.validationError = msgPrefix + ' failed: RRULE and multi-date set at the same time';
    return false;
  }
  // validate any given RRULE
  if (data.recurrence != null && data.recurrence != '' && !/^RRULE:[\w=;,:+-/\\]+$/i.test(data.recurrence)) {
    data.validationError = msgPrefix + ' failed: RRULE data misspelled';
    return false;
  }
  return true;
}
// also validate the simplyfied recurrence settings (if provided), since any error there would be also hidden in the RRULE
function atcb_validate_rrule_simplyfied(data, msgPrefix) {
  if (data.recurrence_interval != null && (data.recurrence_interval < 1 || data.recurrence_interval % 1 != 0)) {
    data.validationError = msgPrefix + ' failed: recurrence data (interval) misspelled';
    return false;
  }
  if (data.recurrence_until != null && data.recurrence_until != '' && !/^(\d|-|:)+$/i.test(data.recurrence_until)) {
    data.validationError = msgPrefix + ' failed: recurrence data (until) misspelled';
    return false;
  }
  if (data.recurrence_count != null && (data.recurrence_count < 1 || data.recurrence_count % 1 != 0)) {
    data.validationError = msgPrefix + ' failed: recurrence data (interval) misspelled';
    return false;
  }
  if (data.recurrence_byMonth != null && data.recurrence_byMonth != '' && !/^(\d|,)+$/.test(data.recurrence_byMonth)) {
    data.validationError = msgPrefix + ' failed: recurrence data (byMonth) misspelled';
    return false;
  }
  if (data.recurrence_byMonthDay != null && data.recurrence_byMonthDay != '' && !/^(\d|,)+$/.test(data.recurrence_byMonthDay)) {
    data.validationError = msgPrefix + ' failed: recurrence data (byMonthDay) misspelled';
    return false;
  }
  if (data.recurrence_byDay != null && data.recurrence_byDay != '' && !/^(\d|-|MO|TU|WE|TH|FR|SA|SU|,)+$/im.test(data.recurrence_byDay)) {
    data.validationError = msgPrefix + ' failed: recurrence data (byDay) misspelled';
    return false;
  }
  if (data.recurrence_weekstart != null && data.recurrence_weekstart != '' && !/^(MO|TU|WE|TH|FR|SA|SU)$/im.test(data.recurrence_weekstart)) {
    data.validationError = msgPrefix + ' failed: recurrence data (weekstart) misspelled';
    return false;
  }
  return true;
}

export { atcb_check_required, atcb_validate };
