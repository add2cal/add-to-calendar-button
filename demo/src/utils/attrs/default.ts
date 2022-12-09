import {
  type DateAttrs,
  type DateRecurrenceAttrs,
  type LayoutAttrs,
  type Attrs,
  DateAttrsKey,
  DateRecurrenceAttrsKey,
  LayoutAttrsKey,
} from '@/models/attrs';
import {
  Status,
  Availability,
  Option,
  ButtonStyle,
  Trigger,
  LightMode,
  Size,
  DefaultButtonStyle,
  DefaultTrigger,
  DefaultLightMode,
} from '@/models/addToCalendarButton';
import { DefaultLanguage, Language } from '@/models/language';
import { getBrowserTimezone } from '@/utils/timezone';

export const getDefaultDateRecurrenceAttrs = (): DateRecurrenceAttrs => ({
  [DateRecurrenceAttrsKey.IS_SIMPLE]: true,
  [DateRecurrenceAttrsKey.RECURRENCE]: '',
  [DateRecurrenceAttrsKey.RECURRENCE_INTERVAL]: 0,
  [DateRecurrenceAttrsKey.RECURRENCE_COUNT]: 0,
  [DateRecurrenceAttrsKey.RECURRENCE_BY_DAY]: '',
  [DateRecurrenceAttrsKey.RECURRENCE_BY_MONTH]: [],
  [DateRecurrenceAttrsKey.RECURRENCE_BY_MONTH_DAY]: '',
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
  [DateAttrsKey.OPTIONS]: [
    Option.APPLE,
    Option.GOOGLE,
    Option.ICAL,
    Option.OUTLOOK,
    Option.YAHOO,
  ],
  [DateAttrsKey.ICAL_FILE_NAME]: '',
});

export const getDefaultLayoutAttrs = (): LayoutAttrs => ({
  [LayoutAttrsKey.LIST_STYLE]: null,
  [LayoutAttrsKey.BUTTON_STYLE]: DefaultButtonStyle,
  [LayoutAttrsKey.TRIGGER]: DefaultTrigger,
  [LayoutAttrsKey.HIDE_ICON_BUTTON]: false,
  [LayoutAttrsKey.HIDE_ICON_LIST]: false,
  [LayoutAttrsKey.HIDE_ICON_MODAL]: false,
  [LayoutAttrsKey.HIDE_TEXT_LABEL_BUTTON]: false,
  [LayoutAttrsKey.HIDE_TEXT_LABEL_LIST]: false,
  [LayoutAttrsKey.IS_BUTTONS_LIST]: false,
  [LayoutAttrsKey.HIDE_BACKGROUND]: false,
  [LayoutAttrsKey.HIDE_CHECKMARK]: false,
  [LayoutAttrsKey.SIZE]: Size.default,
  [LayoutAttrsKey.LABEL]: '',
  [LayoutAttrsKey.LIGHT_MODE]: DefaultLightMode,
  [LayoutAttrsKey.LANGUAGE]: DefaultLanguage,
});

export const getDefaultAttrs = (): Attrs => ({
  date: getDefaultDateAttrs(),
  layout: getDefaultLayoutAttrs(),
});
