/* eslint-disable no-unused-vars */

// MODULE
// unstyle
declare module 'add-to-calendar-button/unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
  export function atcb_generate_ty(host: HTMLElement, data: object): null;
  export function atcb_generate_timestring(dates: EventDate[], language?: string, subEvent?: string | number, decorate?: boolean, browserTimeOverride?: boolean, enforceYear?: boolean, hideTimeZone?: boolean): string[];
}

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
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  sequence?: number;
  uid?: string;
  organizer?: string;
  attendee?: string;
  icsFile?: string;
  recurrence?: string;
  recurrence_interval?: number;
  recurrence_until?: string;
  recurrence_count?: number;
  recurrence_byDay?: string;
  recurrence_byMonth?: string;
  recurrence_byMonthDay?: string;
  recurrence_weekstart?: string;
  availability?: 'busy' | 'free';
  created?: string;
  updated?: string;
  subscribe?: boolean;
  // mind that the following is limited as this interface only applies to the atcb_action function!
  options?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  optionsMobile?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  optionsIOS?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  iCalFileName?: string;
  listStyle?: 'overlay' | 'modal';
  buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
  hideIconList?: boolean;
  hideIconModal?: boolean;
  hideTextLabelList?: boolean;
  hideBackground?: boolean;
  hideButton?: boolean;
  hideCheckmark?: boolean;
  hideBranding?: boolean;
  size?: string;
  customLabels?: CustomLabelsObjectType;
  customCss?: string;
  lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
  language?: 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi';
  hideRichData?: boolean;
  ty?: object;
  bypassWebViewCheck?: boolean;
  debug?: boolean;
  cspnonce?: string;
  styleLight?: string;
  styleDark?: string;
  proxy?: boolean;
  fakeMobile?: boolean;
  fakeIOS?: boolean;
  fakeAndroid?: boolean;
  forceOverlay?: boolean;
  dev?: boolean;
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
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  sequence?: number;
  uid?: string;
  organizer?: string;
  attendee?: string;
}

export type CustomLabelsObjectType = {
  [key: string]: string | null;
};
