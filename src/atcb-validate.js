/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.12.3
 *  Creator: Jens Kuerschner (https://jekuer.com)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { tzlib_get_timezones } from 'timezones-ical-library';
import { atcbOptions } from './atcb-globals.js';
import { atcb_secure_url, atcb_validEmail, atcb_generate_uuid } from './atcb-util.js';

// CHECK FOR REQUIRED FIELDS
async function atcb_check_required(data) {
  // in this first step, we only check for the bare minimum, so we can abort early on really broken setups. We will do further validation later.
  // check for min required data (without "options")
  // name is always required on root level (in the multi-date setup this would be the name of the event series)
  if ((!data.name || data.name === '') && (!data.dates || data.dates.length === 0)) {
    throw new Error('Add to Calendar Button generation failed: required name information missing');
  }
  // regarding event specifics, we start by checking for multi-date setups
  if (data.dates && data.dates.length > 0) {
    // return early if there are more than 1 dates and the subscribe option being set
    if (data.subscribe === true && data.dates.length > 1) {
      throw new Error('Add to Calendar Button generation failed: a subscription calendar cannot be a multi-date setup');
    }
    const requiredMultiField = ['name', 'startDate'];
    const requiredMultiFieldFlex = ['name'];
    return requiredMultiField.every(function (field) {
      for (let i = 0; i < data.dates.length; i++) {
        // if a field is missing, for flexible fields, we also need to check, whether they might be present globally (fallback for them)
        if (
          (!requiredMultiFieldFlex.includes(`${field}`) && (!data.dates[`${i}`][`${field}`] || data.dates[`${i}`][`${field}`] === '')) ||
          (requiredMultiFieldFlex.includes(`${field}`) && (!data.dates[`${i}`][`${field}`] || data.dates[`${i}`][`${field}`] === '') && (!data[`${field}`] || data[`${field}`] === ''))
        ) {
          if (!data.subscribe || field !== 'startDate') {
            // we do not check for startDate in the subscribe mode, since it is not required there
            throw new Error('Add to Calendar Button generation failed: required setting missing [dates array object #' + (i + 1) + '/' + data.dates.length + '] => [' + field + ']');
          } else {
            // we even set it to "today" if it is missing in the subscribe mode
            data.dates[`${i}`].startDate = 'today';
          }
        }
      }
      return true;
    });
  } else {
    const requiredSingleField = ['startDate'];
    return requiredSingleField.every(function (field) {
      if (!data[`${field}`] || data[`${field}`] === '') {
        if (!data.subscribe || field !== 'startDate') {
          // we do not check for startDate in the subscribe mode, since it is not required there
          throw new Error('Add to Calendar Button generation failed: required setting missing [' + field + ']');
        } else {
          // we even set it to "today" if it is missing in the subscribe mode
          data.startDate = 'today';
        }
      }
      return true;
    });
  }
}

// VALIDATE THE INPUT DATA
async function atcb_validate(data) {
  const msgPrefix = 'Add to Calendar Button generation (' + data.identifier + ')';
  try {
    await atcb_validate_icsFile(data, msgPrefix);
    await atcb_validate_buttonStyle(data, msgPrefix);
    await atcb_validate_subscribe(data, msgPrefix);
    await atcb_validate_created(data, msgPrefix);
    await atcb_validate_updated(data, msgPrefix);
    await atcb_validate_options(data, msgPrefix);
    await atcb_validate_date_blocks(data, msgPrefix);
    await atcb_validate_rrule(data, msgPrefix);
    if (data.recurrence_simplyfied) {
      await atcb_validate_rrule_simplyfied(data, msgPrefix);
    }
    // on passing the validation, return true
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
}

// validate explicit ics file
async function atcb_validate_icsFile(data, msgPrefix, i = '', msgSuffix = '') {
  const icsFileStr = (function () {
    if (i !== '' && data.dates[`${i}`].icsFile) {
      return data.dates[`${i}`].icsFile;
    }
    if (i === '' && data.icsFile) {
      return data.icsFile;
    }
    return '';
  })();
  if (icsFileStr !== '') {
    if (!atcb_secure_url(icsFileStr, false) || (!data.icsFile.startsWith('https://') && !data.icsFile.startsWith('http://'))) {
      throw new Error(msgPrefix + ' failed: explicit ics file path not valid' + msgSuffix);
    }
  }
  return true;
}

// validate button style
async function atcb_validate_buttonStyle(data, msgPrefix) {
  const availableStyles = ['default', 'simple', '3d', 'flat', 'round', 'neumorphism', 'text', 'date', 'custom', 'none'];
  if (!availableStyles.includes(data.buttonStyle)) {
    throw new Error(msgPrefix + ' failed: provided buttonStyle invalid');
  }
  if (data.customCss && data.customCss !== '' && (!atcb_secure_url(data.customCss, false) || !/\.css(?:$|\?)/.test(data.customCss))) {
    throw new Error(msgPrefix + ' failed: customCss provided, but no valid url');
  }
  if ((!data.customCss || data.customCss === '') && data.buttonStyle === 'custom') {
    throw new Error(msgPrefix + ' failed: buttonStyle "custom" selected, but no customCss file provided');
  }
  if (data.rsvp && (data.buttonStyle === 'date' || data.buttonStyle === 'none')) {
    throw new Error(msgPrefix + ' failed: buttonStyle ' + data.buttonStyle + ' is not compatible with the RSVP functionality');
  }
  return true;
}

// validate the subscription functionality (requires an explicit ics file)
async function atcb_validate_subscribe(data, msgPrefix) {
  if (data.subscribe === true && (!data.icsFile || data.icsFile === '')) {
    throw new Error(msgPrefix + ' failed: a subscription calendar requires a valid explicit ics file as well');
  }
  return true;
}

// validate created input
async function atcb_validate_created(data, msgPrefix) {
  if (!/^\d{8}T\d{6}Z$/.test(data.created)) {
    throw new Error(msgPrefix + ' failed: created date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ');
  }
  return true;
}

// validate updated input
async function atcb_validate_updated(data, msgPrefix) {
  if (!/^\d{8}T\d{6}Z$/.test(data.updated)) {
    throw new Error(msgPrefix + ' failed: updated date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ');
  }
  return true;
}

// validate options
async function atcb_validate_options(data, msgPrefix) {
  // we double-check whether options are valid
  const isValid = data.options.every((option) => {
    if (!atcbOptions.includes(option)) {
      throw new Error(`${msgPrefix} failed: invalid option [${option}]`);
    }
    return true;
  });
  return isValid;
}

// next goes for all date blocks
async function atcb_validate_date_blocks(data, msgPrefix) {
  try {
    for (let i = 0; i < data.dates.length; i++) {
      const msgSuffix = (function () {
        if (data.dates.length === 1) {
          return '';
        } else {
          return ' [dates array object #' + (i + 1) + '/' + data.dates.length + '] ';
        }
      })();
      await atcb_validate_icsFile(data, msgPrefix, i, msgSuffix);
      await atcb_validate_status(data, msgPrefix, i, msgSuffix);
      await atcb_validate_availability(data, msgPrefix, i, msgSuffix);
      await atcb_validate_organizer(data, msgPrefix, i, msgSuffix);
      await atcb_validate_attendee(data, msgPrefix, i, msgSuffix);
      await atcb_validate_uid(data, msgPrefix, i, msgSuffix);
      await atcb_validate_sequence(data, msgPrefix, i, msgSuffix);
      await atcb_validate_timezone(data, msgPrefix, i, msgSuffix);
      await atcb_validate_datetime(data, msgPrefix, i, msgSuffix);
    }
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
}

// validate status
async function atcb_validate_status(data, msgPrefix, i, msgSuffix) {
  const allowedStatuses = ['tentative', 'confirmed', 'cancelled'];
  if (!allowedStatuses.includes(data.dates[`${i}`].status.toLowerCase())) {
    throw new Error(msgPrefix + ' failed: event status needs to be TENTATIVE, CONFIRMED, or CANCELLED' + msgSuffix);
  }
  return true;
}

// validate availability
async function atcb_validate_availability(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].availability && data.dates[`${i}`].availability !== '' && data.dates[`${i}`].availability !== 'free' && data.dates[`${i}`].availability !== 'busy') {
    throw new Error(msgPrefix + ' failed: event availability needs to be "free" or "busy"' + msgSuffix);
  }
  return true;
}

// validate organizer
async function atcb_validate_organizer(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].organizer && data.dates[`${i}`].organizer !== '') {
    const organizerParts = data.dates[`${i}`].organizer.split('|');
    if (organizerParts.length !== 2 || organizerParts[0].length > 50 || organizerParts[1].length > 100 || !atcb_validEmail(organizerParts[1])) {
      throw new Error(msgPrefix + ' failed: organizer needs to match the schema "NAME|EMAIL" with a valid email address, where the name is <50 and email <100 characters' + msgSuffix);
    }
  }
  return true;
}

// validate attendee
async function atcb_validate_attendee(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].attendee && data.dates[`${i}`].attendee !== '') {
    // when setting the attendee, an organizer needs to be set as well
    if (!data.dates[`${i}`].organizer || data.dates[`${i}`].organizer === '') {
      throw new Error(msgPrefix + ' failed: if an attendee is set, you also need to set the organizer' + msgSuffix);
    }
    // additionally, we check the same format as with the organizer or simple email (only 1 attendee possible)
    const attendeeParts = data.dates[`${i}`].attendee.split('|');
    if (attendeeParts.length === 1 && atcb_validEmail(attendeeParts[0])) {
      return true;
    }
    if (attendeeParts.length !== 2 || attendeeParts[0].length > 50 || attendeeParts[1].length > 100 || !atcb_validEmail(attendeeParts[1])) {
      throw new Error(msgPrefix + ' failed: attendee needs to be a valid email address or match the schema "NAME|EMAIL" with EMAIL being a valid email address' + msgSuffix);
    }
  }
  return true;
}

// validate UID
async function atcb_validate_uid(data, msgPrefix, i, msgSuffix) {
  // must have less then 255 characters and only allowes for alpha characters, numbers, and dashes; see https://icalendar.org/New-Properties-for-iCalendar-RFC-7986/5-3-uid-property.html
  if (!/^(?:\w|-){1,254}$/.test(data.dates[`${i}`].uid)) {
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
async function atcb_validate_sequence(data, msgPrefix, i, msgSuffix) {
  if (data.dates[`${i}`].sequence && (data.dates[`${i}`].sequence < 0 || data.dates[`${i}`].sequence % 1 !== 0)) {
    if (data.debug) {
      console.log(msgPrefix + ': sequence needs to be a full number >= 0. Used the default 0 instead' + msgSuffix);
    }
    data.dates[`${i}`].sequence = 0;
  }
  return true;
}

// validate time zone
async function atcb_validate_timezone(data, msgPrefix, i, msgSuffix) {
  const validTimeZones = tzlib_get_timezones();
  if (!validTimeZones.includes(data.dates[`${i}`].timeZone)) {
    throw new Error(msgPrefix + ' failed: invalid time zone given' + msgSuffix);
  }
  return true;
}

// validate date and time
async function atcb_validate_datetime(data, msgPrefix, i, msgSuffix) {
  const selectedDate = data.dates[`${i}`];
  const dates = ['startDate', 'endDate'];
  // Initialize newDate as an object to store the parsed dates
  const newDate = {};
  // Testing for the right format first
  // Mind that during decoration, we already cleaned up dates, so 2022-44-55 would be also valid, since it gets adjusted automatically. However, we have some pre-validation there too
  dates.forEach((date) => {
    const dateString = selectedDate[`${date}`];
    if (dateString.length !== 10) {
      throw new Error(`${msgPrefix} failed: date misspelled [-> YYYY-MM-DD]${msgSuffix}`);
    }
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) {
      throw new Error(`${msgPrefix} failed: date misspelled [${date}: ${dateString}]${msgSuffix}`);
    }
    // Setting date for further time validation
    newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  });
  const times = ['startTime', 'endTime'];
  times.forEach((time) => {
    const timeString = selectedDate[`${time}`];
    if (timeString) {
      if (timeString.length !== 5) {
        throw new Error(`${msgPrefix} failed: time misspelled [-> HH:MM]${msgSuffix}`);
      }
      const timeParts = timeString.split(':');
      // Validate the time parts
      if (timeParts.length !== 2 || timeParts[0] > 23 || timeParts[1] > 59) {
        throw new Error(`${msgPrefix} failed: time misspelled [${time}: ${timeString}]${msgSuffix}`);
      }
      // Update the date with the time for further validation steps
      const dateKey = time === 'startTime' ? 'startDate' : 'endDate';
      newDate[`${dateKey}`] = new Date(newDate[`${dateKey}`].getTime() + parseInt(timeParts[0], 10) * 3600000 + parseInt(timeParts[1], 10) * 60000);
    }
  });
  // Validate start and end time presence
  if ((selectedDate.startTime && !selectedDate.endTime) || (!selectedDate.startTime && selectedDate.endTime)) {
    throw new Error(`${msgPrefix} failed: if you set a starting or end time, the respective other one also needs to be defined${msgSuffix}`);
  }
  // Validate whether end is not before start
  if (newDate.endDate < newDate.startDate) {
    throw new Error(`${msgPrefix} failed: end date before start date${msgSuffix}`);
  }
  return true;
}

// validate RRULE
async function atcb_validate_rrule(data, msgPrefix) {
  // check for multi-date (which is not allowed)
  if (data.recurrence && data.recurrence !== '' && data.dates.length > 1) {
    throw new Error(msgPrefix + ' failed: RRULE and multi-date set at the same time');
  }
  // validate any given RRULE
  if (data.recurrence && data.recurrence !== '' && !/^RRULE:[\w=;,:+\-/\\]+$/i.test(data.recurrence)) {
    throw new Error(msgPrefix + ' failed: RRULE data misspelled');
  }
  return true;
}
// also validate the simplyfied recurrence settings (if provided), since any error there would be also hidden in the RRULE
async function atcb_validate_rrule_simplyfied(data, msgPrefix) {
  if (data.recurrence_interval && (data.recurrence_interval < 1 || data.recurrence_interval % 1 !== 0)) {
    throw new Error(msgPrefix + ' failed: recurrence data (interval) misspelled');
  }
  if (data.recurrence_until && data.recurrence_until !== '' && !/^[\d\-:]+$/.test(data.recurrence_until)) {
    throw new Error(msgPrefix + ' failed: recurrence data (until) misspelled');
  }
  if (data.recurrence_count && (data.recurrence_count < 1 || data.recurrence_count % 1 !== 0)) {
    throw new Error(msgPrefix + ' failed: recurrence data (count) misspelled');
  }
  if (data.recurrence_byMonth && data.recurrence_byMonth !== '' && !/^[\d,]+$/.test(data.recurrence_byMonth)) {
    throw new Error(msgPrefix + ' failed: recurrence data (byMonth) misspelled');
  }
  if (data.recurrence_byMonthDay && data.recurrence_byMonthDay !== '' && !/^[\d,]+$/.test(data.recurrence_byMonthDay)) {
    throw new Error(msgPrefix + ' failed: recurrence data (byMonthDay) misspelled');
  }
  if (data.recurrence_byDay && data.recurrence_byDay !== '' && !/^(?:[\d,-]|MO|TU|WE|TH|FR|SA|SU)+$/im.test(data.recurrence_byDay)) {
    throw new Error(msgPrefix + ' failed: recurrence data (byDay) misspelled');
  }
  if (data.recurrence_weekstart && data.recurrence_weekstart !== '' && !/^(?:MO|TU|WE|TH|FR|SA|SU)$/im.test(data.recurrence_weekstart)) {
    throw new Error(msgPrefix + ' failed: recurrence data (weekstart) misspelled');
  }
  return true;
}

export { atcb_check_required, atcb_validate };
