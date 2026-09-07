import { generate_time } from '../core/dates';
import { secure_url } from '../core/text';
import type { ATCBConfig } from '../types';

// generate schema.org rich data
// see https://developers.google.com/search/docs/advanced/structured-data/event for more details on how this affects Google search results
// multi-date events are not 100% compliant with schema.org, since this is still a little broken and not supported by Google
function generate_rich_data(data: ATCBConfig, parent: Element): void {
  const schemaEl = document.createElement('script');
  schemaEl.id = 'atcb-schema-' + data.identifier;
  if (parent.hasAttribute('cspnonce')) {
    const cspnonceRegex = /[`'"()[\]{}<>\s]/;
    if (cspnonceRegex.test(parent.getAttribute('cspnonce')!)) {
      throw new Error('cspnonce input contains forbidden characters.');
    }
    schemaEl.setAttribute('nonce', parent.getAttribute('cspnonce')!);
  }
  schemaEl.type = 'application/ld+json';
  const id = data.name!.replace(/\s/g, '');
  const schemaContentMulti: string[] = [];
  if (data.dates!.length > 1) {
    const parts: string[] = [];
    parts.push('"@context":"https://schema.org"');
    parts.push('"@type":"EventSeries"');
    parts.push('"@id":' + JSON.stringify(id));
    parts.push('"name":' + JSON.stringify(data.name) + ',');
    schemaContentMulti.push('{\r\n' + parts.join(',\r\n') + '\r\n');
  }
  const schemaContentFull: string[] = [];
  for (let i = 0; i < data.dates!.length; i++) {
    const schemaContent: string[] = [];
    schemaContent.push('"@context":"https://schema.org"');
    schemaContent.push('"@type":"Event"');
    if (data.dates!.length > 1) {
      schemaContent.push('"@id":' + JSON.stringify(id + '-' + (i + 1)));
    }
    if (data.dates![`${i}`]!.status === 'cancelled') {
      schemaContent.push('"eventStatus":"https://schema.org/EventCancelled"');
    } else {
      schemaContent.push('"eventStatus":"https://schema.org/EventScheduled"');
    }
    schemaContent.push('"name":' + JSON.stringify(data.dates![`${i}`]!.name));
    if (data.dates![`${i}`]!.descriptionHtmlFree) {
      schemaContent.push('"description":' + JSON.stringify(data.dates![`${i}`]!.descriptionHtmlFree));
    }
    const formattedDate = generate_time(data.dates![`${i}`]!, 'delimiters', 'general', true);
    schemaContent.push('"startDate":"' + formattedDate.start + '"');
    if ('duration' in formattedDate && formattedDate.duration) {
      schemaContent.push('"duration":"' + formattedDate.duration + '"');
    }
    schemaContent.push(
      data.dates![`${i}`]!.onlineEvent ? '"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode",\r\n"location": {\r\n"@type":"VirtualLocation",\r\n"url":' + JSON.stringify(data.dates![`${i}`]!.location) + '\r\n}' : '"location":' + JSON.stringify(data.dates![`${i}`]!.location),
    );
    if (data.recurrence && data.recurrence !== '') {
      schemaContent.push(...generate_rich_data_recurrence(data, formattedDate));
    } else {
      schemaContent.push('"endDate":"' + formattedDate.end + '"');
    }
    if (data.dates![`${i}`]!.organizer && data.dates![`${i}`]!.organizer !== '') {
      const organizerParts = (data.dates![`${i}`]!.organizer as string).split('|');
      schemaContent.push('"organizer":{\r\n"@type":"Person",\r\n"name":' + JSON.stringify(organizerParts[0]) + ',\r\n"email":' + JSON.stringify(organizerParts[1]) + '\r\n}');
    }
    const imageData: string[] = [];
    if (data.images) {
      if (Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          if (secure_url(data.images[`${i}`]!, data.debug) && data.images[`${i}`]!.startsWith('http')) {
            imageData.push(JSON.stringify(data.images[`${i}`]));
          }
        }
      }
    }
    if (imageData.length > 0) {
      schemaContent.push('"image":[\r\n' + imageData.join(',\r\n') + ']');
    }
    schemaContentFull.push('{\r\n' + schemaContent.join(',\r\n') + '\r\n}');
  }
  if (data.dates!.length > 1) {
    schemaEl.textContent = schemaContentMulti.join(',\r\n') + '"subEvents":[\r\n' + schemaContentFull.join(',\r\n') + '\r\n]\r\n}';
  } else {
    schemaEl.textContent = schemaContentFull[0]!;
  }
  // insert schemaEl at the beginning of <body> to make sure it gets read early
  document.body.insertBefore(schemaEl, document.body.firstChild);
}

function generate_rich_data_recurrence(data: ATCBConfig, formattedDate: ReturnType<typeof generate_time>): string[] {
  const schemaRecurrenceContent: string[] = [];
  schemaRecurrenceContent.push('"eventSchedule": { "@type": "Schedule"');
  schemaRecurrenceContent.push('"scheduleTimezone":"' + data.dates![0]!.timeZone + '"');
  if (data.recurrence_interval && data.recurrence_interval !== '' && data.recurrence_frequency && data.recurrence_frequency !== '') {
    const repeatFrequency = 'P' + data.recurrence_interval + data.recurrence_frequency.substring(0, 1);
    schemaRecurrenceContent.push('"repeatFrequency":"' + repeatFrequency + '"');
  }
  if (data.recurrence_byDay && data.recurrence_byDay !== '') {
    const byDayString = (function () {
      if (/\d/.test(data.recurrence_byDay!)) {
        return '"' + data.recurrence_byDay + '"';
      } else {
        const byDays = data.recurrence_byDay!.split(',');
        const helperMap: { [key: string]: string } = {
          MO: 'https://schema.org/Monday',
          TU: 'https://schema.org/Tuesday',
          WE: 'https://schema.org/Wednesday',
          TH: 'https://schema.org/Thursday',
          FR: 'https://schema.org/Friday',
          SA: 'https://schema.org/Saturday',
          SU: 'https://schema.org/Sunday',
        };
        const output: string[] = [];
        for (let i = 0; i < byDays.length; i++) {
          output.push('"' + helperMap[byDays[`${i}`]!] + '"');
        }
        return '[' + output.join(',') + ']';
      }
    })();
    schemaRecurrenceContent.push('"byDay":' + byDayString);
  }
  if (data.recurrence_byMonth && data.recurrence_byMonth !== '') {
    const byMonthString = data.recurrence_byMonth.includes(',') ? '[' + data.recurrence_byMonth + ']' : data.recurrence_byMonth;
    schemaRecurrenceContent.push('"byMonth":"' + byMonthString + '"');
  }
  if (data.recurrence_byMonthDay && data.recurrence_byMonthDay !== '') {
    const byMonthDayString = data.recurrence_byMonthDay.includes(',') ? '[' + data.recurrence_byMonthDay + ']' : data.recurrence_byMonthDay;
    schemaRecurrenceContent.push('"byMonthDay":"' + byMonthDayString + '"');
  }
  if (data.recurrence_count && data.recurrence_count !== '') {
    schemaRecurrenceContent.push('"repeatCount":"' + data.recurrence_count + '"');
  }
  if (data.recurrence_until && data.recurrence_until !== '') {
    schemaRecurrenceContent.push('"endDate":"' + data.recurrence_until + '"');
  }
  if (data.dates![0]!.startTime && data.dates![0]!.startTime !== '' && data.dates![0]!.endTime && data.dates![0]!.endTime !== '') {
    schemaRecurrenceContent.push('"startTime":"' + data.dates![0]!.startTime + ':00"');
    schemaRecurrenceContent.push('"endTime":"' + data.dates![0]!.endTime + ':00"');
    schemaRecurrenceContent.push('"duration":"' + ('duration' in formattedDate ? formattedDate.duration : undefined) + '"');
  }
  schemaRecurrenceContent.push('"startDate":"' + data.dates![0]!.startDate + '" }');
  return schemaRecurrenceContent;
}

export { generate_rich_data };
