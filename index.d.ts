/* eslint-disable no-unused-vars */

// INTERFACES
interface ATCBActionEventConfig {
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
  subscribe?: boolean | string;
  // mind that the following is limited as this interface only applies to the atcb_action function!
  options?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  optionsMobile?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  optionsIOS?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  iCalFileName?: string;
  listStyle?: 'overlay' | 'modal';
  hideIconList?: boolean | string;
  hideIconModal?: boolean | string;
  hideTextLabelList?: boolean | string;
  hideBackground?: boolean | string;
  hideCheckmark?: boolean | string;
  hideBranding?: boolean | string;
  size?: string;
  customLabels?: object | string;
  customCss?: string;
  lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
  language?: 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi';
  hideRichData?: boolean | string;
  ty?: object | string;
  bypassWebViewCheck?: boolean | string;
  debug?: boolean | string;
  cspnonce?: string;
  styleLight?: string;
  styleDark?: string;
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
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}

// no-pro
declare module 'add-to-calendar-button/no-pro' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}

// unstyle
declare module 'add-to-calendar-button/unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}

// no-pro-unstyle
declare module 'add-to-calendar-button/no-pro-unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): string;
}
