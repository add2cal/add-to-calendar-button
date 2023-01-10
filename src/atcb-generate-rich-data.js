/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.0.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcb_generate_time, atcb_secure_url } from './atcb-util.js';

// generate schema.org rich data
// see https://developers.google.com/search/docs/advanced/structured-data/event for more details on how this affects Google search results
// multi-date events are not 100% compliant with schema.org, since this is still a little broken and not supported by Google
function atcb_generate_rich_data(data, parent) {
  const schemaEl = document.createElement('script');
  schemaEl.type = 'application/ld+json';
  const schemaContentMulti = [];
  if (data.dates.length > 1) {
    const parts = [];
    parts.push('"@context":"https://schema.org"');
    parts.push('"@type":"EventSeries"');
    parts.push('"@id":"' + data.name.replace(/\s/g, '') + '"');
    parts.push('"name":"' + data.name + '",');
    schemaContentMulti.push('{\r\n' + parts.join(',\r\n') + '\r\n');
  }
  const schemaContentFull = [];
  for (let i = 0; i < data.dates.length; i++) {
    const schemaContent = [];
    schemaContent.push('"@context":"https://schema.org"');
    schemaContent.push('"@type":"Event"');
    if (data.dates.length > 1) {
      schemaContent.push('"@id":"' + data.name.replace(/\s/g, '') + '-' + (i + 1) + '"');
    }
    if (data.dates[`${i}`].status == 'CANCELLED') {
      schemaContent.push('"eventStatus":"https://schema.org/EventCancelled"');
    }
    schemaContent.push('"name":"' + data.dates[`${i}`].name + '"');
    if (data.dates[`${i}`].descriptionHtmlFree) {
      schemaContent.push('"description":"' + data.dates[`${i}`].descriptionHtmlFree + '"');
    }
    const formattedDate = atcb_generate_time(data.dates[`${i}`], 'delimiters', 'general', true);
    schemaContent.push('"startDate":"' + formattedDate.start + '"');
    if (formattedDate.duration != null) {
      schemaContent.push('"duration":"' + formattedDate.duration + '"');
    }
    schemaContent.push(data.dates[`${i}`].location.startsWith('http') ? '"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode",\r\n"location": {\r\n"@type":"VirtualLocation",\r\n"url":"' + data.dates[`${i}`].location + '"\r\n}' : '"location":"' + data.dates[`${i}`].location + '"');
    if (data.recurrence != null && data.recurrence != '') {
      schemaContent.push(...atcb_generate_rich_data_recurrence(data, formattedDate));
    } else {
      schemaContent.push('"endDate":"' + formattedDate.end + '"');
    }
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      schemaContent.push('"organizer":{\r\n"@type":"Person",\r\n"name":"' + organizerParts[0] + '",\r\n"email":"' + organizerParts[1] + '"\r\n}');
    }
    const imageData = [];
    if (data.images != null) {
      if (Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          if (atcb_secure_url(data.images[`${i}`], data.debug) && data.images[`${i}`].startsWith('http')) {
            imageData.push('"' + data.images[`${i}`] + '"');
          }
        }
      }
    } else {
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/1x1.png"');
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/4x3.png"');
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/16x9.png"');
    }
    if (imageData.length > 0) {
      schemaContent.push('"image":[\r\n' + imageData.join(',\r\n') + ']');
    }
    schemaContentFull.push('{\r\n' + schemaContent.join(',\r\n') + '\r\n}');
  }
  if (data.dates.length > 1) {
    schemaEl.textContent = schemaContentMulti.join(',\r\n') + '"subEvents":[\r\n' + schemaContentFull.join(',\r\n') + '\r\n]\r\n}';
  } else {
    schemaEl.textContent = schemaContentFull[0];
  }
  parent.parentNode.insertBefore(schemaEl, parent);
}

function atcb_generate_rich_data_recurrence(data, formattedDate) {
  const schemaRecurrenceContent = [];
  schemaRecurrenceContent.push('"eventSchedule": { "@type": "Schedule"');
  if (data.dates[0].timeZone != null && data.dates[0].timeZone != '') {
    schemaRecurrenceContent.push('"scheduleTimezone":"' + data.dates[0].timeZone + '"');
  }
  const repeatFrequency = 'P' + data.recurrence_interval + data.recurrence_frequency.substr(0, 1);
  schemaRecurrenceContent.push('"repeatFrequency":"' + repeatFrequency + '"');
  if (data.recurrence_byDay != null && data.recurrence_byDay != '') {
    const byDayString = (function () {
      if (/\d/.test(data.recurrence_byDay)) {
        return '"' + data.recurrence_byDay + '"';
      } else {
        const byDays = data.recurrence_byDay.split(',');
        const helperMap = {
          MO: 'https://schema.org/Monday',
          TU: 'https://schema.org/Tuesday',
          WE: 'https://schema.org/Wednesday',
          TH: 'https://schema.org/Thursday',
          FR: 'https://schema.org/Friday',
          SA: 'https://schema.org/Saturday',
          SU: 'https://schema.org/Sunday',
        };
        const output = [];
        for (let i = 0; i < byDays.length; i++) {
          output.push('"' + helperMap[byDays[`${i}`]] + '"');
        }
        return '[' + output.join(',') + ']';
      }
    })();
    schemaRecurrenceContent.push('"byDay":' + byDayString);
  }
  if (data.recurrence_byMonth != null && data.recurrence_byMonth != '') {
    const byMonthString = data.recurrence_byMonth.includes(',') ? '[' + data.recurrence_byMonth + ']' : data.recurrence_byMonth;
    schemaRecurrenceContent.push('"byMonth":"' + byMonthString + '"');
  }
  if (data.recurrence_byMonthDay != null && data.recurrence_byMonthDay != '') {
    const byMonthDayString = data.recurrence_byMonthDay.includes(',') ? '[' + data.recurrence_byMonthDay + ']' : data.recurrence_byMonthDay;
    schemaRecurrenceContent.push('"byMonthDay":"' + byMonthDayString + '"');
  }
  if (data.recurrence_count != null && data.recurrence_count != '') {
    schemaRecurrenceContent.push('"repeatCount":"' + data.recurrence_count + '"');
  }
  if (data.recurrence_until != null && data.recurrence_until != '') {
    schemaRecurrenceContent.push('"endDate":"' + data.recurrence_until + '"');
  }
  if (data.startTime != null && data.startTime != '' && data.endTime != null && data.endTime != '') {
    schemaRecurrenceContent.push('"startTime":"' + data.startTime + ':00"');
    schemaRecurrenceContent.push('"endTime":"' + data.endTime + ':00"');
    schemaRecurrenceContent.push('"duration":"' + formattedDate.duration + '"');
  }
  schemaRecurrenceContent.push('"startDate":"' + data.startDate + '" }');
  return schemaRecurrenceContent;
}

export { atcb_generate_rich_data };
