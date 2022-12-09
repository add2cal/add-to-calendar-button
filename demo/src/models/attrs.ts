import type {
  Option,
  ListStyle,
  ButtonStyle,
  Trigger,
  LightMode,
} from '@/models/addToCalendarButton';
import type { Language } from '@/models//language';

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
  OPTIONS = 'OPTIONS',
  ICAL_FILE_NAME = 'ICAL_FILE_NAME',
}

export enum DateRecurrenceAttrsKey {
  IS_SIMPLE = 'IS_SIMPLE',
  RECURRENCE = 'RECURRENCE',
  RECURRENCE_INTERVAL = 'RECURRENCE_INTERVAL',
  RECURRENCE_COUNT = 'RECURRENCE_COUNT',
  RECURRENCE_BY_DAY = 'RECURRENCE_BY_DAY',
  RECURRENCE_BY_MONTH = 'RECURRENCE_BY_MONTH',
  RECURRENCE_BY_MONTH_DAY = 'RECURRENCE_BY_MONTH_DAY',
}

export enum LayoutAttrsKey {
  LIST_STYLE = 'LIST_STYLE',
  BUTTON_STYLE = 'BUTTON_STYLE',
  TRIGGER = 'TRIGGER',
  HIDE_ICON_BUTTON = 'HIDE_ICON_BUTTON',
  HIDE_ICON_LIST = 'HIDE_ICON_LIST',
  HIDE_ICON_MODAL = 'HIDE_ICON_MODAL',
  HIDE_TEXT_LABEL_BUTTON = 'HIDE_TEXT_LABEL_BUTTON',
  HIDE_TEXT_LABEL_LIST = 'HIDE_TEXT_LABEL_LIST',
  IS_BUTTONS_LIST = 'IS_BUTTONS_LIST',
  HIDE_BACKGROUND = 'HIDE_BACKGROUND',
  HIDE_CHECKMARK = 'HIDE_CHECKMARK',
  SIZE = 'SIZE',
  LABEL = 'LABEL',
  LIGHT_MODE = 'LIGHT_MODE',
  LANGUAGE = 'LANGUAGE',
}

// merged enum
export const AttrsKey = {
  ...DateAttrsKey,
  ...DateRecurrenceAttrsKey,
  ...LayoutAttrsKey,
};
// export type AttrsKey = typeof AttrsKey;

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
  [DateAttrsKey.OPTIONS]: Option[];
  [DateAttrsKey.ICAL_FILE_NAME]: string;
}

export interface DateRecurrenceAttrs {
  [DateRecurrenceAttrsKey.IS_SIMPLE]: boolean;
  [DateRecurrenceAttrsKey.RECURRENCE]: string;
  [DateRecurrenceAttrsKey.RECURRENCE_INTERVAL]: number;
  [DateRecurrenceAttrsKey.RECURRENCE_COUNT]: number;
  [DateRecurrenceAttrsKey.RECURRENCE_BY_DAY]: string;
  [DateRecurrenceAttrsKey.RECURRENCE_BY_MONTH]: number[];
  [DateRecurrenceAttrsKey.RECURRENCE_BY_MONTH_DAY]: string;
}

export interface LayoutAttrs {
  [LayoutAttrsKey.LIST_STYLE]: ListStyle | null;
  [LayoutAttrsKey.BUTTON_STYLE]: ButtonStyle;
  [LayoutAttrsKey.TRIGGER]: Trigger;
  [LayoutAttrsKey.HIDE_ICON_BUTTON]: boolean;
  [LayoutAttrsKey.HIDE_ICON_LIST]: boolean;
  [LayoutAttrsKey.HIDE_ICON_MODAL]: boolean;
  [LayoutAttrsKey.HIDE_TEXT_LABEL_BUTTON]: boolean;
  [LayoutAttrsKey.HIDE_TEXT_LABEL_LIST]: boolean;
  [LayoutAttrsKey.IS_BUTTONS_LIST]: boolean;
  [LayoutAttrsKey.HIDE_BACKGROUND]: boolean;
  [LayoutAttrsKey.HIDE_CHECKMARK]: boolean;
  [LayoutAttrsKey.SIZE]: number;
  [LayoutAttrsKey.LABEL]: string;
  [LayoutAttrsKey.LIGHT_MODE]: LightMode;
  [LayoutAttrsKey.LANGUAGE]: Language;
}

export interface Attrs {
  date: DateAttrs;
  layout: LayoutAttrs;
}

export const ComponentAttrKeyMap: { [key in string]: string } = {
  [AttrsKey.NAME]: 'name',
  [AttrsKey.DESCRIPTION]: 'decription',
  [AttrsKey.START_DATE]: 'startDate',
  [AttrsKey.START_TIME]: 'startTime',
  [AttrsKey.END_DATE]: 'endDate',
  [AttrsKey.END_TIME]: 'endTime',
  [AttrsKey.TIMEZONE]: 'timeZone',
  [AttrsKey.LOCATION]: 'location',
  [AttrsKey.STATUS]: 'status',
  [AttrsKey.ORGANIZER]: 'organizer',
  [AttrsKey.ISC_FILE]: 'icsFile',
  [AttrsKey.RECURRENCE]: 'recurrence',
  [AttrsKey.RECURRENCE_INTERVAL]: 'recurrence_interval',
  [AttrsKey.RECURRENCE_COUNT]: 'recurrence_count',
  [AttrsKey.RECURRENCE_BY_DAY]: 'recurrence_byDay',
  [AttrsKey.RECURRENCE_BY_MONTH]: 'recurrence_byMonth',
  [AttrsKey.RECURRENCE_BY_MONTH_DAY]: 'recurrence_byMonthDay',
  [AttrsKey.AVAILABILITY]: 'availability',
  [AttrsKey.IS_SUBSCRIBED]: 'subscribe',
  [AttrsKey.OPTIONS]: 'options',
  [AttrsKey.ICAL_FILE_NAME]: 'iCalFileName',
  // todo: map layout fields
  [AttrsKey.LIST_STYLE]: 'listStyle',
  [AttrsKey.BUTTON_STYLE]: 'buttonStyle',
  [AttrsKey.TRIGGER]: 'trigger',
  [AttrsKey.HIDE_ICON_BUTTON]: 'hideIconButton',
  [AttrsKey.HIDE_ICON_LIST]: 'hideIconList',
  [AttrsKey.HIDE_ICON_MODAL]: 'hideIconModal',
  [AttrsKey.HIDE_TEXT_LABEL_BUTTON]: 'hideTextLabelButton',
  [AttrsKey.HIDE_TEXT_LABEL_LIST]: 'hideTextLabelList',
  [AttrsKey.IS_BUTTONS_LIST]: 'buttonsList',
  [AttrsKey.HIDE_BACKGROUND]: 'hideBackground',
  [AttrsKey.HIDE_CHECKMARK]: 'hideCheckmark',
  [AttrsKey.SIZE]: 'size',
  [AttrsKey.LABEL]: 'label',
  [AttrsKey.LIGHT_MODE]: 'lightMode',
  [AttrsKey.LANGUAGE]: 'language',
};
