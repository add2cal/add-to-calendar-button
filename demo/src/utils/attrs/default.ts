import { type DateAttrs, type DateRecurrenceAttrs, type LayoutAttrs, type Attrs, DateAttrsKey, DateRecurrenceAttrsKey, LayoutAttrsKey, HideIconOption, HideTextOption } from '@/models/attrs';
import { Option, Size, DefaultButtonStyle, DefaultTrigger, DefaultLightMode } from '@/models/addToCalendarButton';
import { DefaultLanguageCode } from '@/models/language';
import { getBrowserTimezone } from '@/utils/timezone';
import { get, LSKey } from '@/utils/localStorage';

export const getDefaultDateRecurrenceAttrs = (): DateRecurrenceAttrs => ({
  [DateRecurrenceAttrsKey.IS_SIMPLE]: true,
  [DateRecurrenceAttrsKey.RRULE_VALUE]: '',
  [DateRecurrenceAttrsKey.INTERVAL]: 0,
  [DateRecurrenceAttrsKey.COUNT]: 0,
  [DateRecurrenceAttrsKey.BY_DAY]: '',
  [DateRecurrenceAttrsKey.BY_MONTH]: [],
  [DateRecurrenceAttrsKey.BY_MONTH_DAY]: '',
});

export const getDefaultDateAttrs = (): DateAttrs => ({
  [DateAttrsKey.NAME]: 'name',
  [DateAttrsKey.DESCRIPTION]: '',
  [DateAttrsKey.START_DATE]: '2023-02-14',
  [DateAttrsKey.START_TIME]: '10:10',
  [DateAttrsKey.END_DATE]: '',
  [DateAttrsKey.END_TIME]: '10:40',
  [DateAttrsKey.TIMEZONE]: getBrowserTimezone(),
  [DateAttrsKey.LOCATION]: '',
  [DateAttrsKey.STATUS]: '',
  [DateAttrsKey.ORGANIZER]: {
    [DateAttrsKey.ORGANIZER_NAME]: '',
    [DateAttrsKey.ORGANIZER_EMAIL]: '',
  },
  [DateAttrsKey.ISC_FILE]: '',
  [DateAttrsKey.RECURRENCE_OBJECT]: getDefaultDateRecurrenceAttrs(),
  [DateAttrsKey.AVAILABILITY]: '',
  [DateAttrsKey.IS_SUBSCRIBED]: false,
  [DateAttrsKey.OPTIONS]: [Option.APPLE, Option.GOOGLE, Option.ICAL, Option.OUTLOOK, Option.YAHOO],
  [DateAttrsKey.ICAL_FILE_NAME]: '',
});

export const getDefaultLayoutAttrs = (): LayoutAttrs => ({
  [LayoutAttrsKey.LIST_STYLE]: null,
  [LayoutAttrsKey.BUTTON_STYLE]: DefaultButtonStyle,
  [LayoutAttrsKey.TRIGGER]: DefaultTrigger,
  [LayoutAttrsKey.HIDE_ICON_OPTIONS]: { [HideIconOption.BUTTON]: false, [HideIconOption.LIST]: false, [HideIconOption.MODAL]: false }, // for playground ui
  [LayoutAttrsKey.HIDE_TEXT_OPTIONS]: { [HideTextOption.BUTTON]: false, [HideTextOption.LIST]: false }, // for playground ui
  [LayoutAttrsKey.IS_BUTTONS_LIST]: false,
  [LayoutAttrsKey.HIDE_BACKGROUND]: false,
  [LayoutAttrsKey.HIDE_CHECKMARK]: false,
  [LayoutAttrsKey.SIZE]: Size.default,
  [LayoutAttrsKey.LABEL]: '',
  [LayoutAttrsKey.LIGHT_MODE]: DefaultLightMode,
  [LayoutAttrsKey.LANGUAGE]: DefaultLanguageCode,
});

export const getDefaultAttrs = (): Attrs => ({
  date: getDefaultDateAttrs(),
  layout: getDefaultLayoutAttrs(),
});

export const getInitialAttrs = (): Attrs => {
  const defaultData = getDefaultAttrs();
  const cachedData: Attrs = get(LSKey.ATTRS) && JSON.parse(get(LSKey.ATTRS));

  const mergeDeep = (objA: any, objB: any) => {
    if (objB) {
      Object.keys(objB).forEach((key) => {
        if (!objA.hasOwnProperty(key) || typeof objB[key] !== 'object') {
          objA[key] = objB[key];
        } else {
          mergeDeep(objA[key], objB[key]);
        }
      });
    }

    return objA;
  };

  return !!cachedData && typeof cachedData === 'object' ? mergeDeep(defaultData, cachedData) : defaultData;
};
