// The utility entry only calls generate_time with its general target, where mobile
// behavior is irrelevant. Keep the shared dates module free of browser detection.
const isMobile = (): boolean => false;
const atcbTimeZonesToUtc = /^(?:GMT[+-]\d{1,2}|UTC|Zulu|Etc\/.*)$/i;
const defaultTarget = '_blank';

export { isMobile, atcbTimeZonesToUtc, defaultTarget };
