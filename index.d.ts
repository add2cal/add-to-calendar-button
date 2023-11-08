/* eslint-disable no-unused-vars */

// INTERFACES
interface EventConfig {
  proKey?: string;
  name?: string;
  dates?: EventDate[];
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  location?: string;
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED' | string;
  sequence?: bigint;
  uid?: string;
  organizer?: string;
  attendee?: string;
  icsFile?: string;
  images?: string[] | string;
  recurrence?: string;
  recurrence_interval?: bigint | string;
  recurrence_until?: string;
  recurrence_count?: bigint;
  recurrence_byDay?: string;
  recurrence_byMonth?: string;
  recurrence_byMonthDay?: string;
  recurrence_weekstart?: string;
  availability?: 'busy' | 'free';
  created?: string;
  updated?: string;
  identifier?: string;
  subscribe?: boolean | string;
  options?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  iCalFileName?: string;
  listStyle?: 'dropdown' | 'dropdown-static' | 'dropup-static' | 'overlay' | 'modal';
  buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
  trigger?: 'hover' | 'click';
  inline?: boolean | string;
  buttonsList?: boolean | string;
  hideIconButton?: boolean | string;
  hideIconList?: boolean | string;
  hideIconModal?: boolean | string;
  hideTextLabelButton?: boolean | string;
  hideTextLabelList?: boolean | string;
  hideBackground?: boolean | string;
  hideCheckmark?: boolean | string;
  hideBranding?: boolean | string;
  hideButton?: boolean | string;
  size?: string;
  label?: string;
  inlineRsvp?: string;
  customLabels?: object | string;
  customCss?: string;
  lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
  language?: 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi';
  hideRichData?: boolean | string;
  ty?: object | string;
  rsvp?: object | string;
  bypassWebViewCheck?: boolean | string;
  debug?: boolean | string;
  cspnonce?: string;
  blockInteraction?: boolean | string;
  styleLight?: string;
  styleDark?: string;
  disabled?: boolean | string;
  hidden?: boolean | string;
  pastDateHandling?: string;
  proxy?: boolean | string;
  fakeMobile?: boolean | string;
  fakeIOS?: boolean | string;
  fakeAndroid?: boolean | string;
  forceOverlay?: boolean | string;
}

interface EventDate {
  name?: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  location?: string;
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED' | string;
  sequence?: bigint;
  uid?: string;
  organizer?: string;
  attendee?: string;
}

// MODULES
// default
declare module 'add-to-calendar-button' {
  export const i18nStrings: {
    [key: string]: {
      [key: string]: string;
    };
  };
  export const cssStyles: {
    [key: string]: string;
  };
  export function atcb_generate_ty(host: HTMLElement, data: object): null;
  export function atcb_action(config: EventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}

// no-pro
declare module 'add-to-calendar-button/no-pro' {
  export function atcb_action(config: EventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}

// unstyle
declare module 'add-to-calendar-button/unstyle' {
  export function atcb_action(config: EventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}

// no-pro-unstyle
declare module 'add-to-calendar-button/no-pro-unstyle' {
  export function atcb_action(config: EventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}
