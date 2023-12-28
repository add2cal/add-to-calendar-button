/* eslint-disable no-unused-vars */

/* ATTENTION!
 * If you are updating types here, also update the types in the following files:
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

// INTERFACES
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

export type AddToCalendarButtonType = {
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
  images?: string[] | string;
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
  identifier?: string;
  subscribe?: boolean;
  options?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  optionsMobile?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  optionsIOS?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
  iCalFileName?: string;
  listStyle?: 'dropdown' | 'dropdown-static' | 'dropup-static' | 'overlay' | 'modal';
  buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
  trigger?: 'hover' | 'click';
  inline?: boolean;
  buttonsList?: boolean;
  hideIconButton?: boolean;
  hideIconList?: boolean;
  hideIconModal?: boolean;
  hideTextLabelButton?: boolean;
  hideTextLabelList?: boolean;
  hideBackground?: boolean;
  hideCheckmark?: boolean;
  hideBranding?: boolean;
  hideButton?: boolean;
  size?: string;
  label?: string;
  inlineRsvp?: string;
  customLabels?: CustomLabelsObjectType;
  customCss?: string;
  lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
  language?: 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi';
  hideRichData?: boolean;
  ty?: object;
  rsvp?: object;
  bypassWebViewCheck?: boolean;
  debug?: boolean;
  cspnonce?: string;
  blockInteraction?: boolean;
  styleLight?: string;
  styleDark?: string;
  disabled?: boolean;
  hidden?: boolean;
  pastDateHandling?: string;
  proxy?: boolean;
  fakeMobile?: boolean;
  fakeIOS?: boolean;
  fakeAndroid?: boolean;
  forceOverlay?: boolean;
  instance?: number;
  dev?: boolean;
};

export interface EventDate {
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

declare global {
  interface HTMLElementTagNameMap {
    'add-to-calendar-button': AddToCalendarButtonType;
  }
  namespace JSX {
    interface IntrinsicElements {
      ['add-to-calendar-button']: AddToCalendarButtonType;
    }
  }
}
