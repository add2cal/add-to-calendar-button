/**
 * Event config fixtures - canonical config shapes (plan §1 D5) + DST corner configs (plan group D).
 * All dates far in the future (2050) so "past event" auto-handling never kicks in unintentionally.
 *
 * DST boundaries used (assuming current IANA rules continue):
 *  - America/New_York 2050: spring-forward Mar 13, fall-back Nov 6
 *  - Europe/Berlin   2050: spring-forward Mar 27, fall-back Oct 30
 *  - Australia/Sydney 2050: DST ends Apr 3 (autumn), starts Oct 2 (spring)
 */

export const CFG = {
  // C01 - single timed, IANA tz with DST
  singleTimedNY: {
    name: 'NY Timed',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'America/New_York',
    location: 'NYC',
    description: 'desc',
  },
  // C02 - single timed, tz without DST
  singleTimedTokyo: {
    name: 'Tokyo Timed',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'Asia/Tokyo',
  },
  // C03 - UTC explicit
  singleTimedUTC: {
    name: 'UTC Timed',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'Etc/UTC',
  },
  // C04 - no timeZone
  singleTimedNoTz: {
    name: 'Floating Timed',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
  },
  // C07 - single all-day
  allDaySingle: {
    name: 'All Day',
    startDate: '2050-12-25',
  },
  // C08 - multi-day timed
  multiDayTimed: {
    name: 'Multi Day Timed',
    startDate: '2050-06-15',
    startTime: '10:00',
    endDate: '2050-06-17',
    endTime: '16:00',
    timeZone: 'America/New_York',
  },
  // C09 - multi-day all-day
  multiDayAllDay: {
    name: 'Multi Day All Day',
    startDate: '2050-12-25',
    endDate: '2050-12-27',
  },
  // C10 - multi-date series (chronological)
  multiDate: {
    name: 'Series',
    timeZone: 'America/New_York',
    dates: [
      { name: 'Day 1', startDate: '2050-07-01', startTime: '10:00', endTime: '11:00' },
      { name: 'Day 2', startDate: '2050-07-08', startTime: '10:00', endTime: '11:00' },
      { name: 'Day 3', startDate: '2050-07-15', startTime: '10:00', endTime: '11:00' },
    ],
  },
  // C13 - recurring daily simplified
  recurDaily: {
    name: 'Recurring Daily',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'America/New_York',
    recurrence: 'daily',
    recurrence_count: 10,
  },
  // C14 - recurring weekly byDay
  recurWeekly: {
    name: 'Recurring Weekly',
    startDate: '2050-06-13', // a Monday
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'America/New_York',
    recurrence: 'weekly',
    recurrence_byDay: 'MO,WE,FR',
    recurrence_count: 12,
  },
  // C18 - raw RRULE
  recurRaw: {
    name: 'Recurring Raw',
    startDate: '2050-06-14', // a Tuesday
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'America/New_York',
    recurrence: 'RRULE:FREQ=WEEKLY;COUNT=10;BYDAY=TU',
  },
  // C24 - online event
  onlineEvent: {
    name: 'Online Event',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'America/New_York',
    location: 'https://meet.example.com/room-1',
  },
};

// Group D - DST corners (America/New_York 2050: spring-forward Sun Mar 13, fall-back Sun Nov 6)
export const DST = {
  nyPreSpring: { name: 'D-01', startDate: '2050-03-13', startTime: '01:30', endTime: '01:45', timeZone: 'America/New_York', expectOffset: '-05:00' },
  nyPostSpring: { name: 'D-02', startDate: '2050-03-13', startTime: '03:30', endTime: '04:00', timeZone: 'America/New_York', expectOffset: '-04:00' },
  nySpanSpring: { name: 'D-03', startDate: '2050-03-13', startTime: '01:00', endTime: '04:00', timeZone: 'America/New_York' },
  nyPreFall: { name: 'D-04', startDate: '2050-11-06', startTime: '00:30', endTime: '00:45', timeZone: 'America/New_York', expectOffset: '-04:00' },
  nyPostFall: { name: 'D-05', startDate: '2050-11-06', startTime: '02:30', endTime: '03:00', timeZone: 'America/New_York', expectOffset: '-05:00' },
  nySpanFall: { name: 'D-06', startDate: '2050-11-06', startTime: '00:30', endTime: '03:00', timeZone: 'America/New_York' },
  sydneyAutumn: { name: 'D-08a', startDate: '2050-04-02', startTime: '10:00', endTime: '11:00', timeZone: 'Australia/Sydney', expectOffset: '+11:00' },
  sydneyWinter: { name: 'D-08b', startDate: '2050-04-04', startTime: '10:00', endTime: '11:00', timeZone: 'Australia/Sydney', expectOffset: '+10:00' },
  tokyoDuringNyDst: { name: 'D-09', startDate: '2050-03-13', startTime: '10:00', endTime: '11:00', timeZone: 'Asia/Tokyo', expectOffset: '+09:00' },
};

/**
 * Computes the expected UTC "clean" Google/Yahoo time string (YYYYMMDDTHHMMSSZ)
 * for a given wall-clock date/time and a fixed UTC offset like '-05:00'.
 */
export function utcClean(dateStr, timeStr, offset) {
  const sign = offset.startsWith('-') ? -1 : 1;
  const [oh, om] = offset.slice(1).split(':').map(Number);
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  const utc = new Date(Date.UTC(y, mo - 1, d, h, mi) - sign * (oh * 60 + om) * 60000);
  const p = (n) => String(n).padStart(2, '0');
  return `${utc.getUTCFullYear()}${p(utc.getUTCMonth() + 1)}${p(utc.getUTCDate())}T${p(utc.getUTCHours())}${p(utc.getUTCMinutes())}00Z`;
}
