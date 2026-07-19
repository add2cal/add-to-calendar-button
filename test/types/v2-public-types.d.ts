/**
 * FROZEN v2 public types (verbatim from the v2.15 index.d.ts, with the ambient
 * module and global declaration blocks stripped and type names prefixed V2).
 * This file is the compatibility oracle for the type gate: values typed against
 * these v2 declarations must keep satisfying the current public types.
 * Do not update it to match new functionality.
 */
/* eslint-disable no-unused-vars */
// INTERFACES AND TYPES
export interface V2ATCBActionEventConfig {
  proKey?: string;
  name?: string;
  dates?: V2EventDate[];
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
  recurrence_byDay?: string[] | string;
  recurrence_byMonth?: string[] | string | number[] | number;
  recurrence_byMonthDay?: string[] | string | number[] | number;
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
  buttonStyle?: 'default' | 'simple' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
  hideIconList?: boolean;
  hideIconModal?: boolean;
  hideTextLabelList?: boolean;
  hideBackground?: boolean;
  hideButton?: boolean;
  hideCheckmark?: boolean;
  hideBranding?: boolean;
  size?: string;
  customLabels?: V2CustomLabelsObjectType;
  customCss?: string;
  lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
  language?: 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi' | 'hu';
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
  customVar?: V2CustomLabelsObjectType;
  dev?: boolean;
}

export type V2AddToCalendarButtonType = {
  proKey?: string;
  name?: string;
  dates?: V2EventDate[] | string;
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
  recurrence_byDay?: string[] | string;
  recurrence_byMonth?: string[] | string | number[] | number;
  recurrence_byMonthDay?: string[] | string | number[] | number;
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
  buttonStyle?: 'default' | 'simple' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
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
  customLabels?: V2CustomLabelsObjectType | string;
  customCss?: string;
  lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
  language?: 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi' | 'hu';
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
  customVar?: V2CustomLabelsObjectType | string;
  dev?: boolean | string;
};

export interface V2EventDate {
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

export type V2CustomLabelsObjectType = {
  [key: string]: string | null;
};

// WEB COMPONENT DECLARATION
