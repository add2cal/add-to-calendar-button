/**
 * Shared internal types for the add-to-calendar-button source.
 *
 * Two config shapes flow through the code:
 * - ATCBInputConfig: what users provide (attributes arrive as strings, flags may be
 *   string-y booleans, options may be JSON strings). Aligned with the public
 *   AddToCalendarButtonType in index.d.ts (asserted by the type compatibility test).
 * - ATCBConfig: the decorated shape produced by atcb_decorate_data (flags coerced to
 *   real booleans, options normalized, dates array populated, internal fields added).
 *
 * Migration note (phase 2): decorated fields stay optional on purpose - the runtime
 * behavior of v2 is preserved exactly, so functions guard or assert presence the same
 * way the JS did. Tightening required fields is deferred (see .ai/REFACTOR-PLAN.md).
 */

export type ATCBOptionName = 'Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo';

export type ATCBEventStatus = 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';

export type ATCBButtonStyle = 'default' | 'simple' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';

export type ATCBListStyle = 'dropdown' | 'dropdown-static' | 'dropup-static' | 'overlay' | 'modal';

export type ATCBLightMode = 'system' | 'dark' | 'light' | 'bodyScheme';

export type CustomLabelsObject = {
  [key: string]: string | null | undefined;
};

/**
 * One event date entry (multi-date configs carry several).
 * Post-decoration, entries also carry computed internals (e.g. overdue).
 */
export interface ATCBDateEntryInput {
  name?: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  useUserTZ?: boolean;
  location?: string;
  status?: ATCBEventStatus | Lowercase<ATCBEventStatus> | string;
  sequence?: number | string;
  uid?: string;
  organizer?: string;
  attendee?: string;
}

/**
 * Decorated date entry: input fields plus computed internals and the dynamic-access
 * escape hatch the decoration pipeline relies on. The input variant stays CLOSED
 * (no index signature) so public closed interfaces like EventDate remain assignable.
 */
export interface ATCBDateEntry extends ATCBDateEntryInput {
  overdue?: boolean;
  [key: string]: unknown;
}

/**
 * Raw input config (web component attributes or atcb_action argument).
 * Attribute values arrive as strings; boolean-ish fields accept both.
 */
export interface ATCBInputConfig {
  proKey?: string;
  name?: string;
  dates?: ATCBDateEntryInput[] | string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  useUserTZ?: boolean | string;
  location?: string;
  status?: ATCBEventStatus | string;
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
  availability?: 'busy' | 'free' | string;
  created?: string;
  updated?: string;
  identifier?: string;
  subscribe?: boolean | string;
  options?: ATCBOptionName[] | string[] | string;
  optionsMobile?: ATCBOptionName[] | string[] | string;
  optionsIOS?: ATCBOptionName[] | string[] | string;
  iCalFileName?: string;
  listStyle?: ATCBListStyle | string;
  buttonStyle?: ATCBButtonStyle | string;
  trigger?: 'hover' | 'click' | string;
  inline?: boolean | string;
  inlineRsvp?: string;
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
  hideRichData?: boolean | string;
  size?: string;
  label?: string;
  customLabels?: CustomLabelsObject | string;
  customCss?: string;
  lightMode?: ATCBLightMode | string;
  language?: string;
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
  proOverride?: boolean | string;
  forceOverlay?: boolean | string;
  instance?: number | string;
  customVar?: CustomLabelsObject | string;
  domain?: string;
  dev?: boolean | string;
}

/**
 * Decorated config as produced by atcb_decorate_data and consumed by
 * validation, generation, links, and control code.
 */
export interface ATCBConfig {
  proKey?: string;
  name?: string;
  dates?: ATCBDateEntry[];
  description?: string;
  descriptionHtmlFree?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  useUserTZ?: boolean;
  location?: string;
  onlineEvent?: boolean;
  status?: string;
  sequence?: number | string;
  uid?: string;
  organizer?: string;
  attendee?: string;
  icsFile?: string;
  images?: string[];
  recurrence?: string;
  recurrence_interval?: number | string;
  recurrence_until?: string;
  recurrence_count?: number | string;
  recurrence_byDay?: string;
  recurrence_byMonth?: string;
  recurrence_byMonthDay?: string;
  recurrence_weekstart?: string;
  recurrence_frequency?: string;
  recurrence_simplified?: boolean;
  availability?: string;
  created?: string;
  updated?: string;
  identifier?: string;
  subscribe?: boolean;
  options?: string[];
  optionsMobile?: string[];
  optionsIOS?: string[];
  iCalFileName?: string;
  listStyle?: ATCBListStyle | string;
  buttonStyle?: ATCBButtonStyle | string;
  trigger?: 'hover' | 'click' | string;
  inline?: boolean;
  inlineRsvp?: string;
  inlineRSVP?: boolean;
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
  hideRichData?: boolean;
  size?: string;
  sizes?: { [key: string]: number | string };
  label?: string;
  customLabels?: CustomLabelsObject;
  customCss?: string;
  lightMode?: string;
  language?: string;
  rtl?: boolean;
  ty?: { [key: string]: unknown };
  rsvp?: { [key: string]: unknown };
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
  proOverride?: boolean;
  forceOverlay?: boolean;
  instance?: number | string;
  customVar?: CustomLabelsObject;
  dev?: boolean;
  // PRO / server-provided internals
  landingpage?: { [key: string]: unknown };
  domain?: string;
  // computed internals
  allOverdue?: boolean;
  allCancelled?: boolean;
  js?: boolean;
  [key: string]: unknown;
}

/**
 * Translation map shape: language code -> key -> string.
 */
export type I18nStrings = {
  [language: string]: {
    [key: string]: string;
  };
};

// Global augmentations used across the source
declare global {
  interface Window {
    dataLayer?: { [key: string]: unknown }[];
    atcb_action?: (data: ATCBInputConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean) => Promise<string>;
  }
}
