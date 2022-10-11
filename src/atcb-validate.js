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

import { tzlib_get_timezones } from '../node_modules/timezones-ical-library/npm_dist/mjs/index.js';
import { atcbOptions } from './atcb-globals.js';
import { atcb_secure_url, atcb_validEmail } from './atcb-util.js';

// CHECK FOR REQUIRED FIELDS
function atcb_check_required(data) {
  // in this first step, we only check for the bare minimum, so we can abort early on really broken setups. We will do further validation later.
  // check for at least 1 option
  if (data.options == null || data.options.length < 1) {
    console.error('Add to Calendar Button generation failed: no valid options set');
    return false;
  }
  // check for min required data (without "options")
  // name is always required on top level (in the multi-date setup this would be the name of the event series)
  if (data.name == null || data.name == '') {
    console.error('Add to Calendar Button generation failed: required name information missing');
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
          (!requiredMultiFieldFlex.includes(`${field}`) &&
            (data.dates[`${i}`][`${field}`] == null || data.dates[`${i}`][`${field}`] == '')) ||
          (requiredMultiFieldFlex.includes(`${field}`) &&
            (data.dates[`${i}`][`${field}`] == null || data.dates[`${i}`][`${field}`] == '') &&
            (data[`${field}`] == null || data[`${field}`] == ''))
        ) {
          console.error(
            'Add to Calendar Button generation failed: required setting missing [dates array object #' +
              (i + 1) +
              '/' +
              data.dates.length +
              '] => [' +
              field +
              ']'
          );
          return false;
        }
      }
      return true;
    });
  } else {
    const requiredSingleField = ['startDate'];
    return requiredSingleField.every(function (field) {
      if (data[`${field}`] == null || data[`${field}`] == '') {
        console.error('Add to Calendar Button generation failed: required setting missing [' + field + ']');
        return false;
      }
      return true;
    });
  }
}

// VALIDATE THE INPUT DATA
function atcb_validate(data) {
  // validate prefix
  if (data.identifier != null && data.identifier != '') {
    if (!/^[\w-]+$/.test(data.identifier)) {
      data.identifier = '';
      console.warn('Add to Calendar Button generation: identifier invalid - using auto numbers instead');
    }
  }
  const msgPrefix = 'Add to Calendar Button generation (' + data.identifier + ')';
  // validate explicit ics file
  if (data.icsFile != null && data.icsFile != '') {
    if (
      !atcb_secure_url(data.icsFile, false) ||
      !/\.ics$/.test(data.icsFile) ||
      !data.icsFile.startsWith('https://')
    ) {
      console.error(msgPrefix + ' failed: explicit ics file path not valid');
      return false;
    }
  }
  // validate created and updated input
  if (!/^\d{8}T\d{6}Z$/.test(data.created)) {
    console.error(
      msgPrefix +
        ': created date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ'
    );
    return false;
  }
  if (!/^\d{8}T\d{6}Z$/.test(data.updated)) {
    console.error(
      msgPrefix +
        ': updated date format not valid. Needs to be a full ISO-8601 UTC date and time string, formatted YYYYMMDDTHHMMSSZ'
    );
    return false;
  }
  // validate options
  if (
    !data.options.every(function (option) {
      if (!atcbOptions.includes(option)) {
        console.error(msgPrefix + ' failed: invalid option [' + option + ']');
        return false;
      }
      return true;
    })
  ) {
    return false;
  }
  // next goes for all date blocks
  for (let i = 0; i < data.dates.length; i++) {
    const datesBlock = (function () {
      if (data.dates.length == 1) {
        return '';
      } else {
        return ' [dates array object #' + (i + 1) + '/' + data.dates.length + '] ';
      }
    })();
    // validate status
    if (
      data.dates[`${i}`].status != 'TENTATIVE' &&
      data.dates[`${i}`].status != 'CONFIRMED' &&
      data.dates[`${i}`].status != 'CANCELLED'
    ) {
      console.error(msgPrefix + ': event status needs to be TENTATIVE, CONFIRMED, or CANCELLED' + datesBlock);
      return false;
    }
    // validate organizer
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      if (
        organizerParts.length != 2 ||
        organizerParts[0].length > 50 ||
        organizerParts[1].length > 80 ||
        !atcb_validEmail(organizerParts[1])
      ) {
        console.error(
          msgPrefix +
            ' failed: organizer needs to match the schema "NAME|EMAIL" with a valid email address' +
            datesBlock
        );
        return false;
      }
    }
    // validate UID (must have less then 255 characters and only allowes for ; see )
    if (!/^(\w|-){1,254}$/.test(data.dates[`${i}`].uid)) {
      console.error(
        msgPrefix +
          ': UID not valid. May only contain alpha, digits, and dashes; and be less than 255 characters' +
          datesBlock
      );
      return false;
    }
    // validate UID for the recommended form, which is not forced, but show throw a warning
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        data.dates[`${i}`].uid
      )
    ) {
      console.warn(
        msgPrefix +
          ': UID is strictly recommended to be a hex-encoded random Universally Unique Identifier (UUID)!' +
          datesBlock
      );
    }
    // validate sequence number if given and set it 0 if not
    if (!/^\d+$/.test(data.dates[`${i}`].sequence)) {
      console.log(msgPrefix + ': sequence needs to be a number. Used the default 0 instead' + datesBlock);
      data.dates[`${i}`].sequence = 0;
    }
    // validate time zone
    if (data.dates[`${i}`].timeZone != null && data.dates[`${i}`].timeZone != '') {
      const validTimeZones = tzlib_get_timezones();
      if (!validTimeZones.includes(data.dates[`${i}`].timeZone)) {
        console.error(msgPrefix + ' failed: invalid time zone given' + datesBlock);
        return false;
      }
    }
    // validate date
    const dates = ['startDate', 'endDate'];
    const newDate = dates;
    if (
      !dates.every(function (date) {
        if (data.dates[`${i}`][`${date}`].length !== 10) {
          console.error(msgPrefix + ' failed: date misspelled [-> YYYY-MM-DD]' + datesBlock);
          return false;
        }
        const dateParts = data.dates[`${i}`][`${date}`].split('-');
        if (dateParts.length < 3 || dateParts.length > 3) {
          console.error(
            msgPrefix +
              ' failed: date misspelled [' +
              date +
              ': ' +
              data.dates[`${i}`][`${date}`] +
              ']' +
              datesBlock
          );
          return false;
        }
        newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        return true;
      })
    ) {
      return false;
    }
    // validate time
    const times = ['startTime', 'endTime'];
    if (
      !times.every(function (time) {
        if (data.dates[`${i}`][`${time}`] != null) {
          if (data.dates[`${i}`][`${time}`].length !== 5) {
            console.error(msgPrefix + ' failed: time misspelled [-> HH:MM]' + datesBlock);
            return false;
          }
          const timeParts = data.dates[`${i}`][`${time}`].split(':');
          // validate the time parts
          if (timeParts.length < 2 || timeParts.length > 2) {
            console.error(
              msgPrefix +
                ' failed: time misspelled [' +
                time +
                ': ' +
                data.dates[`${i}`][`${time}`] +
                ']' +
                datesBlock
            );
            return false;
          }
          if (timeParts[0] > 23) {
            console.error(
              msgPrefix +
                ' failed: time misspelled - hours number too high [' +
                time +
                ': ' +
                timeParts[0] +
                ']' +
                datesBlock
            );
            return false;
          }
          if (timeParts[1] > 59) {
            console.error(
              msgPrefix +
                ' failed: time misspelled - minutes number too high [' +
                time +
                ': ' +
                timeParts[1] +
                ']' +
                datesBlock
            );
            return false;
          }
          // update the date with the time for further validation steps
          if (time == 'startTime') {
            newDate.startDate = new Date(
              newDate.startDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
            );
          }
          if (time == 'endTime') {
            newDate.endDate = new Date(
              newDate.endDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
            );
          }
        }
        return true;
      })
    ) {
      return false;
    }
    if (
      (data.dates[`${i}`].startTime != null && data.dates[`${i}`].endTime == null) ||
      (data.dates[`${i}`].startTime == null && data.dates[`${i}`].endTime != null)
    ) {
      console.error(
        msgPrefix + ' failed: if you set a starting time, you also need to define an end time' + datesBlock
      );
      return false;
    }
    // validate whether end is not before start
    if (newDate.endDate < newDate.startDate) {
      console.error(msgPrefix + ' failed: end date before start date' + datesBlock);
      return false;
    }
  }
  // validate RRULE with multi-date (which is not allowed)
  if (data.recurrence != null && data.recurrence != '' && data.dates.length > 1) {
    console.error(msgPrefix + ' failed: RRULE and multi-date set at the same time');
    return false;
  }
  // validate any given RRULE
  if (data.recurrence != null && data.recurrence != '' && !/^RRULE:[\w=;,:+-/\\]+$/i.test(data.recurrence)) {
    console.error(msgPrefix + ' failed: RRULE data misspelled');
    return false;
  }
  // also validate the more easy recurrence settings, since any error there would be also hidden in the RRULE
  if (
    data.recurrence_interval != null &&
    data.recurrence_interval != '' &&
    !/^\d+$/.test(data.recurrence_interval)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (interval) misspelled');
    return false;
  }
  if (
    data.recurrence_until != null &&
    data.recurrence_until != '' &&
    !/^(\d|-|:)+$/i.test(data.recurrence_until)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (until) misspelled');
    return false;
  }
  if (data.recurrence_count != null && data.recurrence_count != '' && !/^\d+$/.test(data.recurrence_count)) {
    console.error(msgPrefix + ' failed: recurrence data (interval) misspelled');
    return false;
  }
  if (
    data.recurrence_byMonth != null &&
    data.recurrence_byMonth != '' &&
    !/^(\d|,)+$/.test(data.recurrence_byMonth)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (byMonth) misspelled');
    return false;
  }
  if (
    data.recurrence_byMonthDay != null &&
    data.recurrence_byMonthDay != '' &&
    !/^(\d|,)+$/.test(data.recurrence_byMonthDay)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (byMonthDay) misspelled');
    return false;
  }
  if (
    data.recurrence_byDay != null &&
    data.recurrence_byDay != '' &&
    !/^(\d|-|MO|TU|WE|TH|FR|SA|SU|,)+$/im.test(data.recurrence_byDay)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (byDay) misspelled');
    return false;
  }
  if (
    data.recurrence_weekstart != null &&
    data.recurrence_weekstart != '' &&
    !/^(MO|TU|WE|TH|FR|SA|SU)$/im.test(data.recurrence_weekstart)
  ) {
    console.error(msgPrefix + ' failed: recurrence data (weekstart) misspelled');
    return false;
  }
  // on passing the validation, return true
  return true;
}

export { atcb_check_required, atcb_validate };
