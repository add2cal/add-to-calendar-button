import { tzlib_get_offset } from 'timezones-ical-library';
import { getNextOccurrence, parseRRule } from './dates';
import type { ATCBConfig } from '../types';

// format RRULE
function decorate_data_rrule(data: ATCBConfig): ATCBConfig {
  // remove spaces and force upper case
  data.recurrence = data.recurrence!.replace(/\s+/g, '').toUpperCase();
  // if RRULE is set, we parse date from it
  if (/^RRULE:/i.test(data.recurrence)) {
    data.recurrence_simplified = false;
    const rruleParts = parseRRule(data.recurrence, false);
    data.recurrence_until = rruleParts.UNTIL as string | undefined;
    data.recurrence_count = rruleParts.COUNT as number | undefined;
    data.recurrence_byDay = rruleParts.BYDAY as string | undefined;
    data.recurrence_byMonth = rruleParts.BYMONTH as string | undefined;
    data.recurrence_byMonthDay = rruleParts.BYMONTHDAY as string | undefined;
    data.recurrence_interval = rruleParts.INTERVAL as number | undefined;
    data.recurrence_frequency = rruleParts.FREQ as string | undefined;
  } else {
    // otherwise, we create an RRULE from the easy rules
    data.recurrence_simplified = true;
    // set interval if not given
    if (!data.recurrence_interval || data.recurrence_interval === '') {
      data.recurrence_interval = 1;
    }
    // set weekstart if not given
    if (!data.recurrence_weekstart || Number(data.recurrence_weekstart === '') | Number(data.recurrence_weekstart.length > 2)) {
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
function decorate_data_recurring_events(data: ATCBConfig): ATCBConfig {
  const startDate = data.dates![0]!.startDate;
  const startTime = data.dates![0]!.startTime;
  const endDate = data.dates![0]!.endDate || startDate;
  const endTime = data.dates![0]!.endTime || '';
  const tzid = data.dates![0]!.timeZone || 'UTC';
  const diff =
    (function () {
      if (endTime && endTime !== '' && startTime && startTime !== '') {
        const origStart = startTime && startTime !== '' ? new Date(`${startDate}T${startTime}:00${toIsoOffset(tzlib_get_offset(tzid, startDate!, startTime))}`) : new Date(`${startDate}T00:00:00${toIsoOffset(tzlib_get_offset(tzid, startDate!, '00:00'))}`);
        const origEnd = endTime && endTime !== '' ? new Date(`${endDate}T${endTime}:00${toIsoOffset(tzlib_get_offset(tzid, endDate!, endTime))}`) : new Date(`${endDate}T00:00:00${toIsoOffset(tzlib_get_offset(tzid, endDate!, '00:00'))}`);
        return origEnd.getTime() - origStart.getTime();
      }
      return;
    })() || 0;

  // Helper: normalize offsets into ISO form ±HH:MM (or 'Z')
  function toIsoOffset(off: string | undefined): string {
    if (!off || off === 'Z' || off === '+0000' || off === '-0000' || off === '+00:00' || off === '-00:00') return 'Z';
    const raw = String(off).replace(/^GMT/i, '');
    if (/^[+-]\d{2}:\d{2}$/.test(raw)) return raw;
    if (/^[+-]\d{4}$/.test(raw)) return `${raw.slice(0, 3)}:${raw.slice(3)}`;
    // Fallback: try to extract sign and digits
    const sign = raw.startsWith('-') ? '-' : '+';
    const digits = raw.replace(/\D/g, '').padStart(4, '0').slice(0, 4);
    return `${sign}${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  const offset = startTime && startTime !== '' ? tzlib_get_offset(tzid, startDate!, startTime) : '';
  const startDateTime = (function () {
    if (startTime && startTime !== '') {
      const isoOff = toIsoOffset(offset);
      return new Date(`${startDate}T${startTime}:00${isoOff}`);
    }
    const localMidnightOffset = toIsoOffset(tzlib_get_offset(tzid, startDate!, '00:00'));
    return new Date(`${startDate}T00:00:00${localMidnightOffset}`);
  })();

  const isAllDay = !(startTime && startTime !== '');
  const occurenceData = getNextOccurrence(data.recurrence!, startDateTime, diff, isAllDay, tzid);
  if (!occurenceData || !occurenceData.nextOccurrence) {
    return data;
  }

  // format Date in specific tz; guard invalid dates for Safari
  function formatInTz(dateObj: Date, timeZone: string, includeTime: boolean): { date: string; time: string } {
    if (!(dateObj instanceof Date) || !isFinite(dateObj.getTime())) {
      return { date: '', time: '' };
    }
    try {
      const opts = includeTime ? { timeZone, hour12: false, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } : { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
      const parts = new Intl.DateTimeFormat('en-CA', opts as Intl.DateTimeFormatOptions).formatToParts(dateObj);
      const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
      return { date: `${get('year')}-${get('month')}-${get('day')}`, time: includeTime ? `${get('hour')}:${get('minute')}` : '' };
    } catch {
      return { date: '', time: '' };
    }
  }

  const nextLocalDate = formatInTz(occurenceData.nextOccurrence, tzid, false).date;

  if (nextLocalDate) {
    data.startDate = nextLocalDate;
    if (startTime) data.startTime = startTime; // This project intentionally does not support BYHOUR (or other sub-daily expansion rules), so we keep the original wall-clock time.
  } else {
    // If formatting failed, keep original dates to avoid Safari crash
    return data;
  }

  const newStartInstant = startTime ? new Date(`${data.startDate}T${startTime}:00${toIsoOffset(tzlib_get_offset(tzid, data.startDate, startTime))}`) : new Date(`${data.startDate}T00:00:00${toIsoOffset(tzlib_get_offset(tzid, data.startDate, '00:00'))}`);

  const newEndDateTime = new Date(newStartInstant.getTime() + diff);
  const nextEndLocal = formatInTz(newEndDateTime, tzid, !!(endTime && endTime !== ''));
  if (nextEndLocal.date) {
    data.endDate = nextEndLocal.date;
    if (endTime && endTime !== '') data.endTime = nextEndLocal.time;
  }

  // set count (if given)
  if ((data.recurrence_count && data.recurrence_count !== '') || (data.recurrence_until && data.recurrence_until !== '')) {
    if (occurenceData.adjustedCount < 2) {
      data.recurrence = '';
      data.recurrence_frequency = '';
      data.recurrence_interval = '';
    } else {
      data.recurrence_count = occurenceData.adjustedCount;
      data.recurrence = data.recurrence!.replace(/;?COUNT=\d+/i, ';COUNT=' + data.recurrence_count);
      if (data.recurrence_until && data.recurrence_until !== '') {
        data.recurrence_until = '';
        data.recurrence = data.recurrence.replace(/;?UNTIL=\w+/i, ';COUNT=' + data.recurrence_count);
        if (data.dates && data.dates[0]!.recurrence) {
          data.dates[0]!.recurrence = (data.dates[0]!.recurrence as string).replace(/;?UNTIL=\w+/i, ';COUNT=' + data.recurrence_count);
        }
      }
    }
  }
  return data;
}

export { decorate_data_rrule, decorate_data_recurring_events };
