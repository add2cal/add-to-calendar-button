/* eslint-disable no-unused-vars */

/* ATTENTION!
 * If you are updating things here, also double-check the following depending files:
 * - no-pro/index.d.ts
 * - unstyle/index.d.ts
 * - no-pro-unstyle/index.d.ts
 */

// MODULES
// default
declare module 'add-to-calendar-button' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
  export const i18nStrings: {
    [key: string]: {
      [key: string]: string;
    };
  };
  export const cssStyles: {
    [key: string]: string;
  };
  export function atcb_generate_ty(host: HTMLElement, data: object): null;
  export function atcb_generate_timestring(dates: EventDate[], language?: string, subEvent?: string | number, decorate?: boolean, browserTimeOverride?: boolean, enforceYear?: boolean, hideTimeZone?: boolean): string[];
}

// no-pro
// referenced in its own index.d.ts file, but also kept here as backup!
declare module 'add-to-calendar-button/no-pro' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
}

// unstyle
// referenced in its own index.d.ts file, but also kept here as backup!
declare module 'add-to-calendar-button/unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
  export function atcb_generate_ty(host: HTMLElement, data: object): null;
  export function atcb_generate_timestring(dates: EventDate[], language?: string, subEvent?: string | number, decorate?: boolean, browserTimeOverride?: boolean, enforceYear?: boolean, hideTimeZone?: boolean): string[];
}

// no-pro-unstyle
// referenced in its own index.d.ts file, but also kept here as backup!
declare module 'add-to-calendar-button/no-pro-unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
}

// INTERFACES AND TYPES
export interface ATCBActionEventConfig {
  proKey?: string;
  name?: string;
  dates?: EventDate[];
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  useUserTZ?: boolean;
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
  proOverride?: boolean;
  forceOverlay?: boolean;
  customVar?: CustomLabelsObjectType;
  dev?: boolean;
}

export type AddToCalendarButtonType = {
  proKey?: string;
  name?: string;
  dates?: EventDate[] | string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  useUserTZ?: boolean;
  location?: string;
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  sequence?: number | string;
  uid?: string;
  organizer?: string;
  attendee?: string;
  icsFile?: string;
  images?: string[] | string;
  recurrence?: string;
  recurrence_interval?: number | string;
  recurrence_until?: string;
  recurrence_count?: number | string;
  recurrence_byDay?: string;
  recurrence_byMonth?: string;
  recurrence_byMonthDay?: string;
  recurrence_weekstart?: string;
  availability?: 'busy' | 'free';
  created?: string;
  updated?: string;
  identifier?: string;
  subscribe?: boolean | string;
  options?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[] | string;
  optionsMobile?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[] | string;
  optionsIOS?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[] | string;
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
  customLabels?: CustomLabelsObjectType | string;
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
  proOverride?: boolean;
  forceOverlay?: boolean | string;
  instance?: number | string;
  customVar?: CustomLabelsObjectType | string;
  dev?: boolean | string;
};

export interface EventDate {
  name?: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  useUserTZ?: boolean;
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

// WEB COMPONENT DECLARATION
declare global {
  interface HTMLElementTagNameMap {
    'add-to-calendar-button': HTMLElement & AddToCalendarButtonType;
  }
  namespace JSX {
    interface IntrinsicElements {
      ['add-to-calendar-button']: AddToCalendarButtonType;
    }
  }
}
