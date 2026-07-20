import type { Option, ListStyle, ButtonStyle, Trigger, LightMode, PastDateHandling } from '@/models/addToCalendarButton';
import type { LanguageCode } from '@/models//language';

export enum DateAttrsKey {
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  START_DATE = 'START_DATE',
  START_TIME = 'START_TIME',
  END_DATE = 'END_DATE',
  END_TIME = 'END_TIME',
  TIMEZONE = 'TIMEZONE',
  LOCATION = 'LOCATION',
  STATUS = 'STATUS',
  ORGANIZER = 'ORGANIZER',
  ORGANIZER_NAME = 'ORGANIZER_NAME',
  ORGANIZER_EMAIL = 'ORGANIZER_EMAIL',
  ISC_FILE = 'ISC_FILE',
  RECURRENCE_OBJECT = 'RECURRENCE_OBJECT',
  AVAILABILITY = 'AVAILABILITY',
  IS_SUBSCRIBED = 'IS_SUBSCRIBED',
  ICAL_FILE_NAME = 'ICAL_FILE_NAME',
}

export enum DateRecurrenceAttrsKey {
  IS_SIMPLE = 'IS_SIMPLE',
  RRULE_VALUE = 'RRULE_VALUE',
  FREQUENCY = 'FREQUENCY',
  INTERVAL = 'INTERVAL',
  COUNT = 'COUNT',
  BY_DAY = 'BY_DAY',
  BY_MONTH = 'BY_MONTH',
  BY_MONTH_DAY = 'BY_MONTH_DAY',
}

export enum LayoutAttrsKey {
  OPTIONS = 'OPTIONS',
  LIST_STYLE = 'LIST_STYLE',
  BUTTON_STYLE = 'BUTTON_STYLE',
  TRIGGER = 'TRIGGER',
  HIDE_ICON_OPTIONS = 'HIDE_ICON_OPTIONS', // for playground ui
  HIDE_TEXT_OPTIONS = 'HIDE_TEXT_OPTIONS', // for playground ui
  IS_BUTTONS_LIST = 'IS_BUTTONS_LIST',
  HIDE_BACKGROUND = 'HIDE_BACKGROUND',
  HIDE_CHECKMARK = 'HIDE_CHECKMARK',
  SIZE = 'SIZE',
  LABEL = 'LABEL',
  LIGHT_MODE = 'LIGHT_MODE',
  LANGUAGE = 'LANGUAGE',
  PAST_DATE_HANDLING = 'PAST_DATE_HANDLING',
}

export enum HideIconOption {
  BUTTON = 'HIDE_ICON_BUTTON',
  LIST = 'HIDE_ICON_LIST',
  MODAL = 'HIDE_ICON_MODAL',
}

export enum HideTextOption {
  BUTTON = 'HIDE_TEXT_LABEL_BUTTON',
  LIST = 'HIDE_TEXT_LABEL_LIST',
}

// merged enum
export const AttrsKey = {
  ...DateAttrsKey,
  ...DateRecurrenceAttrsKey,
  ...LayoutAttrsKey,
  HIDE_ICON_BUTTON: 'HIDE_ICON_BUTTON', // for mapping
  HIDE_ICON_LIST: 'HIDE_ICON_LIST', // for mapping
  HIDE_ICON_MODAL: 'HIDE_ICON_MODAL', // for mapping
  HIDE_TEXT_LABEL_BUTTON: 'HIDE_TEXT_LABEL_BUTTON', // for mapping
  HIDE_TEXT_LABEL_LIST: 'HIDE_TEXT_LABEL_LIST', // for mapping
};

export interface DateAttrs {
  [DateAttrsKey.NAME]: string;
  [DateAttrsKey.DESCRIPTION]: string;
  [DateAttrsKey.START_DATE]: string;
  [DateAttrsKey.START_TIME]: string;
  [DateAttrsKey.END_DATE]: string;
  [DateAttrsKey.END_TIME]: string;
  [DateAttrsKey.TIMEZONE]: string | null;
  [DateAttrsKey.LOCATION]: string;
  [DateAttrsKey.STATUS]: string;
  [DateAttrsKey.ORGANIZER]: {
    [DateAttrsKey.ORGANIZER_NAME]: string;
    [DateAttrsKey.ORGANIZER_EMAIL]: string;
  };
  [DateAttrsKey.ISC_FILE]: string;
  [DateAttrsKey.RECURRENCE_OBJECT]: DateRecurrenceAttrs;
  [DateAttrsKey.AVAILABILITY]: string;
  [DateAttrsKey.IS_SUBSCRIBED]: boolean;
  [DateAttrsKey.ICAL_FILE_NAME]: string;
}

export interface DateRecurrenceAttrs {
  [DateRecurrenceAttrsKey.IS_SIMPLE]: boolean;
  [DateRecurrenceAttrsKey.RRULE_VALUE]: string;
  [DateRecurrenceAttrsKey.FREQUENCY]: string;
  [DateRecurrenceAttrsKey.INTERVAL]: number | string;
  [DateRecurrenceAttrsKey.COUNT]: number | string;
  [DateRecurrenceAttrsKey.BY_DAY]: string;
  [DateRecurrenceAttrsKey.BY_MONTH]: number[];
  [DateRecurrenceAttrsKey.BY_MONTH_DAY]: string;
}

export interface LayoutAttrs {
  [LayoutAttrsKey.OPTIONS]: Option[];
  [LayoutAttrsKey.LIST_STYLE]: ListStyle | null;
  [LayoutAttrsKey.BUTTON_STYLE]: ButtonStyle;
  [LayoutAttrsKey.TRIGGER]: Trigger;
  [LayoutAttrsKey.HIDE_ICON_OPTIONS]: { [key in HideIconOption]: boolean };
  [LayoutAttrsKey.HIDE_TEXT_OPTIONS]: { [key in HideTextOption]: boolean };
  [LayoutAttrsKey.IS_BUTTONS_LIST]: boolean;
  [LayoutAttrsKey.HIDE_BACKGROUND]: boolean;
  [LayoutAttrsKey.HIDE_CHECKMARK]: boolean;
  [LayoutAttrsKey.SIZE]: number;
  [LayoutAttrsKey.LABEL]: string;
  [LayoutAttrsKey.LIGHT_MODE]: LightMode;
  [LayoutAttrsKey.LANGUAGE]: LanguageCode;
  [LayoutAttrsKey.PAST_DATE_HANDLING]: PastDateHandling;
}

export interface Attrs {
  date: DateAttrs;
  layout: LayoutAttrs;
}

// official v3 attribute names are kebab-case (legacy camelCase still works as an alias,
// but the demo should model the recommended spelling for both the live element and the
// generated code snippet)
export const ComponentAttrKeyMap: { [key in string]: string } = {
  [AttrsKey.NAME]: 'name',
  [AttrsKey.DESCRIPTION]: 'description',
  [AttrsKey.START_DATE]: 'start-date',
  [AttrsKey.START_TIME]: 'start-time',
  [AttrsKey.END_DATE]: 'end-date',
  [AttrsKey.END_TIME]: 'end-time',
  [AttrsKey.TIMEZONE]: 'time-zone',
  [AttrsKey.LOCATION]: 'location',
  [AttrsKey.STATUS]: 'status',
  [AttrsKey.ORGANIZER]: 'organizer',
  [AttrsKey.ISC_FILE]: 'ics-file',
  [AttrsKey.RRULE_VALUE]: 'recurrence',
  [AttrsKey.FREQUENCY]: 'recurrence',
  [AttrsKey.INTERVAL]: 'recurrence-interval',
  [AttrsKey.COUNT]: 'recurrence-count',
  [AttrsKey.BY_DAY]: 'recurrence-by-day',
  [AttrsKey.BY_MONTH]: 'recurrence-by-month',
  [AttrsKey.BY_MONTH_DAY]: 'recurrence-by-month-day',
  [AttrsKey.AVAILABILITY]: 'availability',
  [AttrsKey.IS_SUBSCRIBED]: 'subscribe',
  [AttrsKey.OPTIONS]: 'options',
  [AttrsKey.ICAL_FILE_NAME]: 'ical-file-name',
  [AttrsKey.LIST_STYLE]: 'list-style',
  [AttrsKey.BUTTON_STYLE]: 'button-style',
  [AttrsKey.TRIGGER]: 'trigger',
  [AttrsKey.HIDE_ICON_BUTTON]: 'hide-icon-button',
  [AttrsKey.HIDE_ICON_LIST]: 'hide-icon-list',
  [AttrsKey.HIDE_ICON_MODAL]: 'hide-icon-modal',
  [AttrsKey.HIDE_TEXT_LABEL_BUTTON]: 'hide-text-label-button',
  [AttrsKey.HIDE_TEXT_LABEL_LIST]: 'hide-text-label-list',
  [AttrsKey.IS_BUTTONS_LIST]: 'buttons-list',
  [AttrsKey.HIDE_BACKGROUND]: 'hide-background',
  [AttrsKey.HIDE_CHECKMARK]: 'hide-checkmark',
  [AttrsKey.SIZE]: 'size',
  [AttrsKey.LABEL]: 'label',
  [AttrsKey.LIGHT_MODE]: 'light-mode',
  [AttrsKey.LANGUAGE]: 'language',
  [AttrsKey.PAST_DATE_HANDLING]: 'past-date-handling',
};
