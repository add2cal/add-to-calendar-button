import { tzlib_get_timezones } from 'timezones-ical-library';

export const getAvailableTimezones = () => tzlib_get_timezones();

export const getBrowserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || null;
