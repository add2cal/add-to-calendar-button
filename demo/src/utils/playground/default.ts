import { DefaultButtonStyle, DefaultLightMode, DefaultListStyle, DefaultPastDateHandling, DefaultTrigger, Option, Size } from '../../models/addToCalendarButton';
import { DateAttrsKey, DateRecurrenceAttrsKey, HideIconOption, HideTextOption, LayoutAttrsKey, type Attrs, type DateAttrs, type DateRecurrenceAttrs, type LayoutAttrs } from '../../models/attrs';
import { DefaultLanguageCode, LanguageCode } from '../../models/language';
import { getBrowserTimezone } from './timezone';

const storageKey = 'ATTRS';

export const getDefaultDateRecurrenceAttrs = (): DateRecurrenceAttrs => ({
  [DateRecurrenceAttrsKey.IS_SIMPLE]: false,
  [DateRecurrenceAttrsKey.RRULE_VALUE]: '',
  [DateRecurrenceAttrsKey.FREQUENCY]: '',
  [DateRecurrenceAttrsKey.INTERVAL]: '',
  [DateRecurrenceAttrsKey.COUNT]: '',
  [DateRecurrenceAttrsKey.BY_DAY]: '',
  [DateRecurrenceAttrsKey.BY_MONTH]: [],
  [DateRecurrenceAttrsKey.BY_MONTH_DAY]: '',
});

export const getDefaultDateAttrs = (name: string, description: string, location: string): DateAttrs => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return {
    [DateAttrsKey.NAME]: name,
    [DateAttrsKey.DESCRIPTION]: description,
    [DateAttrsKey.START_DATE]: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    [DateAttrsKey.START_TIME]: '10:15',
    [DateAttrsKey.END_DATE]: '',
    [DateAttrsKey.END_TIME]: '17:45',
    [DateAttrsKey.TIMEZONE]: getBrowserTimezone(),
    [DateAttrsKey.LOCATION]: location,
    [DateAttrsKey.STATUS]: '',
    [DateAttrsKey.ORGANIZER]: { [DateAttrsKey.ORGANIZER_NAME]: '', [DateAttrsKey.ORGANIZER_EMAIL]: '' },
    [DateAttrsKey.ISC_FILE]: '',
    [DateAttrsKey.RECURRENCE_OBJECT]: getDefaultDateRecurrenceAttrs(),
    [DateAttrsKey.AVAILABILITY]: '',
    [DateAttrsKey.IS_SUBSCRIBED]: false,
    [DateAttrsKey.ICAL_FILE_NAME]: '',
  };
};

export const getDefaultLayoutAttrs = (locale = 'en'): LayoutAttrs => ({
  [LayoutAttrsKey.OPTIONS]: [Option.APPLE, Option.GOOGLE, Option.ICAL, Option.OUTLOOK, Option.YAHOO],
  [LayoutAttrsKey.LIST_STYLE]: DefaultListStyle,
  [LayoutAttrsKey.BUTTON_STYLE]: DefaultButtonStyle,
  [LayoutAttrsKey.TRIGGER]: DefaultTrigger,
  [LayoutAttrsKey.HIDE_ICON_OPTIONS]: { [HideIconOption.BUTTON]: false, [HideIconOption.LIST]: false, [HideIconOption.MODAL]: false },
  [LayoutAttrsKey.HIDE_TEXT_OPTIONS]: { [HideTextOption.BUTTON]: false, [HideTextOption.LIST]: false },
  [LayoutAttrsKey.IS_BUTTONS_LIST]: false,
  [LayoutAttrsKey.HIDE_BACKGROUND]: false,
  [LayoutAttrsKey.HIDE_CHECKMARK]: false,
  [LayoutAttrsKey.SIZE]: Size.default,
  [LayoutAttrsKey.LABEL]: '',
  [LayoutAttrsKey.LIGHT_MODE]: DefaultLightMode,
  [LayoutAttrsKey.LANGUAGE]: Object.values(LanguageCode).includes(locale as LanguageCode) ? (locale as LanguageCode) : DefaultLanguageCode,
  [LayoutAttrsKey.PAST_DATE_HANDLING]: DefaultPastDateHandling,
});

export const getDefaultAttrs = (name: string, description: string, location: string, locale = 'en'): Attrs => ({
  date: getDefaultDateAttrs(name, description, location),
  layout: getDefaultLayoutAttrs(locale),
});

export function getInitialAttrs(name: string, description: string, location: string, locale: string): Attrs {
  const defaults = getDefaultAttrs(name, description, location, locale);
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null') as Partial<Attrs> | null;
    if (!saved || typeof saved !== 'object') return defaults;
    const date: Partial<DateAttrs> = saved.date && typeof saved.date === 'object' ? saved.date : {};
    const layout: Partial<LayoutAttrs> = saved.layout && typeof saved.layout === 'object' ? saved.layout : {};
    const recurrence = date[DateAttrsKey.RECURRENCE_OBJECT];
    const organizer = date[DateAttrsKey.ORGANIZER];
    const icons = layout[LayoutAttrsKey.HIDE_ICON_OPTIONS];
    const text = layout[LayoutAttrsKey.HIDE_TEXT_OPTIONS];
    return {
      date: {
        ...defaults.date,
        ...Object.fromEntries(
          Object.keys(defaults.date)
            .filter((key) => key in date)
            .map((key) => [key, date[key as keyof typeof date]]),
        ),
        [DateAttrsKey.RECURRENCE_OBJECT]: { ...defaults.date[DateAttrsKey.RECURRENCE_OBJECT], ...(recurrence && typeof recurrence === 'object' ? recurrence : {}) },
        [DateAttrsKey.ORGANIZER]: { ...defaults.date[DateAttrsKey.ORGANIZER], ...(organizer && typeof organizer === 'object' ? organizer : {}) },
      },
      layout: {
        ...defaults.layout,
        ...Object.fromEntries(
          Object.keys(defaults.layout)
            .filter((key) => key in layout)
            .map((key) => [key, layout[key as keyof typeof layout]]),
        ),
        [LayoutAttrsKey.OPTIONS]: Array.isArray(layout[LayoutAttrsKey.OPTIONS]) ? layout[LayoutAttrsKey.OPTIONS].filter((item): item is Option => Object.values(Option).includes(item)) : defaults.layout[LayoutAttrsKey.OPTIONS],
        [LayoutAttrsKey.HIDE_ICON_OPTIONS]: { ...defaults.layout[LayoutAttrsKey.HIDE_ICON_OPTIONS], ...(icons && typeof icons === 'object' ? icons : {}) },
        [LayoutAttrsKey.HIDE_TEXT_OPTIONS]: { ...defaults.layout[LayoutAttrsKey.HIDE_TEXT_OPTIONS], ...(text && typeof text === 'object' ? text : {}) },
      },
    };
  } catch {
    return defaults;
  }
}

export const saveAttrs = (attrs: Attrs) => localStorage.setItem(storageKey, JSON.stringify(attrs));
