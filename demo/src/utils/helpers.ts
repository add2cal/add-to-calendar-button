export function stringToColor(str?: string) {
  if (!str) return '#333333';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

// format just the time part (HH:mm)
export const formatTime = (d: Date) => d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');

// format a date range, showing time unless the event is all-day
export const formatRange = (start: Date, end?: Date, allDay?: boolean, locale?: string, listYear?: string) => {
  const startFormat = new Intl.DateTimeFormat(locale ?? 'en', { year: listYear && start.getFullYear() === Number(listYear) ? undefined : 'numeric', month: 'long', day: 'numeric' });
  const startLabel = startFormat.format(start);
  const t = allDay ? '' : ', ' + formatTime(start);

  if (!end || start.getTime() === end.getTime()) return startLabel + t;

  const endFormat = new Intl.DateTimeFormat(locale ?? 'en', { year: listYear && end.getFullYear() === Number(listYear) ? undefined : 'numeric', month: 'long', day: 'numeric' });
  const endLabel = endFormat.format(end);

  // same calendar day → "August 13, 2026, 15:00 - 18:00"
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate()) {
    return allDay ? startLabel : startLabel + t + ' - ' + formatTime(end);
  }

  // different days → "August 13, 2026, 15:00 - August 16, 2026, 18:00"
  return allDay ? startLabel + ' - ' + endLabel : startLabel + t + ' - ' + endLabel + ', ' + formatTime(end);
};
