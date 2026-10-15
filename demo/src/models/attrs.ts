import type { ButtonStyle, LightMode, ListStyle, Option, PastDateHandling, Trigger } from './addToCalendarButton';
import type { LanguageCode } from './language';

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
  HIDE_ICON_OPTIONS = 'HIDE_ICON_OPTIONS',
  HIDE_TEXT_OPTIONS = 'HIDE_TEXT_OPTIONS',
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

export const AttrsKey = { ...DateAttrsKey, ...DateRecurrenceAttrsKey, ...LayoutAttrsKey, HIDE_ICON_BUTTON: 'HIDE_ICON_BUTTON', HIDE_ICON_LIST: 'HIDE_ICON_LIST', HIDE_ICON_MODAL: 'HIDE_ICON_MODAL', HIDE_TEXT_LABEL_BUTTON: 'HIDE_TEXT_LABEL_BUTTON', HIDE_TEXT_LABEL_LIST: 'HIDE_TEXT_LABEL_LIST' } as const;

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
  [DateAttrsKey.ORGANIZER]: { [DateAttrsKey.ORGANIZER_NAME]: string; [DateAttrsKey.ORGANIZER_EMAIL]: string };
  [DateAttrsKey.ISC_FILE]: string;
  [DateAttrsKey.RECURRENCE_OBJECT]: DateRecurrenceAttrs;
  [DateAttrsKey.AVAILABILITY]: string;
  [DateAttrsKey.IS_SUBSCRIBED]: boolean;
  [DateAttrsKey.ICAL_FILE_NAME]: string;
}

export interface LayoutAttrs {
  [LayoutAttrsKey.OPTIONS]: Option[];
  [LayoutAttrsKey.LIST_STYLE]: ListStyle | null;
  [LayoutAttrsKey.BUTTON_STYLE]: ButtonStyle;
  [LayoutAttrsKey.TRIGGER]: Trigger;
  [LayoutAttrsKey.HIDE_ICON_OPTIONS]: Record<HideIconOption, boolean>;
  [LayoutAttrsKey.HIDE_TEXT_OPTIONS]: Record<HideTextOption, boolean>;
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

export const ComponentAttrKeyMap = new Map<string, string>(
  Object.entries({
    NAME: 'name',
    DESCRIPTION: 'description',
    START_DATE: 'start-date',
    START_TIME: 'start-time',
    END_DATE: 'end-date',
    END_TIME: 'end-time',
    TIMEZONE: 'time-zone',
    LOCATION: 'location',
    STATUS: 'status',
    ORGANIZER: 'organizer',
    ISC_FILE: 'ics-file',
    RRULE_VALUE: 'recurrence',
    FREQUENCY: 'recurrence',
    INTERVAL: 'recurrence-interval',
    COUNT: 'recurrence-count',
    BY_DAY: 'recurrence-by-day',
    BY_MONTH: 'recurrence-by-month',
    BY_MONTH_DAY: 'recurrence-by-month-day',
    AVAILABILITY: 'availability',
    IS_SUBSCRIBED: 'subscribe',
    OPTIONS: 'options',
    ICAL_FILE_NAME: 'ical-file-name',
    LIST_STYLE: 'list-style',
    BUTTON_STYLE: 'button-style',
    TRIGGER: 'trigger',
    HIDE_ICON_BUTTON: 'hide-icon-button',
    HIDE_ICON_LIST: 'hide-icon-list',
    HIDE_ICON_MODAL: 'hide-icon-modal',
    HIDE_TEXT_LABEL_BUTTON: 'hide-text-label-button',
    HIDE_TEXT_LABEL_LIST: 'hide-text-label-list',
    IS_BUTTONS_LIST: 'buttons-list',
    HIDE_BACKGROUND: 'hide-background',
    HIDE_CHECKMARK: 'hide-checkmark',
    SIZE: 'size',
    LABEL: 'label',
    LIGHT_MODE: 'light-mode',
    LANGUAGE: 'language',
    PAST_DATE_HANDLING: 'past-date-handling',
  }),
);
