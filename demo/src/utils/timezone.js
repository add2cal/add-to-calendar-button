import { tzlib_get_timezones } from 'timezones-ical-library';

export const getAvailableTimezones = () => tzlib_get_timezones();
