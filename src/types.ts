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
 * Decorated fields stay optional on purpose: the decoration pipeline fills them at
 * runtime and consuming functions guard or assert presence where needed. Tightening
 * them to required fields would be a type-only change with a large diff surface -
 * a candidate for a later minor release, not something to mix into feature work.
 */

export type ATCBOptionName = 'apple' | 'google' | 'ical' | 'ms365' | 'msteams' | 'outlookcom' | 'yahoo';

/**
 * Legacy v2 option spellings. Still fully supported as aliases: the runtime
 * normalizes any casing (plus the "Microsoft ..." / "Outlook.com" long forms)
 * to the official lowercase keys above.
 */
export type ATCBOptionNameLegacy = 'Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo';

export type ATCBEventStatus = 'tentative' | 'confirmed' | 'cancelled';

/**
 * Legacy v2 status spelling. Still fully supported: status input is
 * case-insensitive and normalized to lowercase during decoration.
 */
export type ATCBEventStatusLegacy = Uppercase<ATCBEventStatus>;

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
  status?: ATCBEventStatus | ATCBEventStatusLegacy | string;
  sequence?: number | string;
  uid?: string;
  organizer?: string;
  attendee?: string;
  // ics-only extras (only reflected in the generated ics file for the apple/ical options)
  icsReminder?: number | string;
  icsUrl?: string;
  icsCategories?: string[] | string;
  icsClass?: string;
  icsPriority?: number | string;
  icsGeo?: string;
  icsAttach?: string[] | string;
  icsCreated?: string;
  icsUpdated?: string;
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
  status?: ATCBEventStatus | ATCBEventStatusLegacy | string;
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
  icsCreated?: string;
  icsUpdated?: string;
  identifier?: string;
  subscribe?: boolean | string;
  options?: (ATCBOptionName | ATCBOptionNameLegacy)[] | string[] | string;
  optionsMobile?: (ATCBOptionName | ATCBOptionNameLegacy)[] | string[] | string;
  optionsIOS?: (ATCBOptionName | ATCBOptionNameLegacy)[] | string[] | string;
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
  styleSource?: string;
  loadAllStyles?: boolean | string;
  // ics-only extras (only reflected in the generated ics file for the apple/ical options)
  icsReminder?: number | string;
  icsUrl?: string;
  icsCategories?: string[] | string;
  icsClass?: string;
  icsPriority?: number | string;
  icsGeo?: string;
  icsAttach?: string[] | string;
  icsExdate?: string[] | string;
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
  icsCreated?: string;
  icsUpdated?: string;
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
  formatLocale?: string;
  translationLocale?: string;
  rtl?: boolean;
  ty?: { [key: string]: unknown };
  rsvp?: { [key: string]: unknown };
  bypassWebViewCheck?: boolean;
  debug?: boolean;
  cspnonce?: string;
  blockInteraction?: boolean;
  styleLight?: string;
  styleDark?: string;
  styleSource?: string;
  loadAllStyles?: boolean;
  icsExdate?: string[] | string;
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

// ---------------------------------------------------------------------------
// Public surface types
//
// These are the types consumers import from the package root. They describe the
// DOCUMENTED configuration surface and stay deliberately narrower than the
// internal input types above (which additionally accept everything the runtime
// tolerates). Compatibility contract: every value that satisfies a public type
// must be accepted by the corresponding internal type, and every config a v2
// consumer wrote against the v2 typings must keep compiling (asserted by the
// type gate in test/types/).
// ---------------------------------------------------------------------------

export type ATCBLanguage = 'en' | 'de' | 'nl' | 'fa' | 'fr' | 'es' | 'et' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi' | 'hu' | 'he' | 'uk';

export type CustomLabelsObjectType = {
  [key: string]: string | null;
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
  status?: ATCBEventStatus | ATCBEventStatusLegacy;
  sequence?: number;
  uid?: string;
  organizer?: string;
  attendee?: string;
  // only reflected in the generated ics file (Apple/iCal options)
  icsReminder?: number | string;
  icsUrl?: string;
  icsCategories?: string[] | string;
  icsClass?: 'public' | 'private' | 'confidential';
  icsPriority?: number;
  icsGeo?: string;
  icsAttach?: string[] | string;
}

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
  status?: ATCBEventStatus | ATCBEventStatusLegacy;
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
  icsCreated?: string;
  icsUpdated?: string;
  subscribe?: boolean;
  // the option surface is limited compared to the web component, since the
  // atcb_action function skips list rendering for single options
  options?: (ATCBOptionName | ATCBOptionNameLegacy)[];
  optionsMobile?: (ATCBOptionName | ATCBOptionNameLegacy)[];
  optionsIOS?: (ATCBOptionName | ATCBOptionNameLegacy)[];
  iCalFileName?: string;
  listStyle?: 'overlay' | 'modal';
  buttonStyle?: ATCBButtonStyle;
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
  lightMode?: ATCBLightMode;
  language?: ATCBLanguage;
  hideRichData?: boolean;
  ty?: object;
  bypassWebViewCheck?: boolean;
  debug?: boolean;
  cspnonce?: string;
  styleLight?: string;
  styleDark?: string;
  styleSource?: string;
  loadAllStyles?: boolean;
  // only reflected in the generated ics file (Apple/iCal options)
  icsReminder?: number | string;
  icsUrl?: string;
  icsCategories?: string[] | string;
  icsClass?: 'public' | 'private' | 'confidential';
  icsPriority?: number;
  icsGeo?: string;
  icsAttach?: string[] | string;
  icsExdate?: string[] | string;
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
  status?: ATCBEventStatus | ATCBEventStatusLegacy;
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
  icsCreated?: string;
  icsUpdated?: string;
  identifier?: string;
  subscribe?: boolean | string;
  options?: (ATCBOptionName | ATCBOptionNameLegacy)[] | string;
  optionsMobile?: (ATCBOptionName | ATCBOptionNameLegacy)[] | string;
  optionsIOS?: (ATCBOptionName | ATCBOptionNameLegacy)[] | string;
  iCalFileName?: string;
  listStyle?: ATCBListStyle;
  buttonStyle?: ATCBButtonStyle;
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
  lightMode?: ATCBLightMode;
  language?: ATCBLanguage;
  hideRichData?: boolean | string;
  ty?: object | string;
  rsvp?: object | string;
  bypassWebViewCheck?: boolean | string;
  debug?: boolean | string;
  cspnonce?: string;
  blockInteraction?: boolean | string;
  styleLight?: string;
  styleDark?: string;
  styleSource?: string;
  loadAllStyles?: boolean | string;
  // only reflected in the generated ics file (Apple/iCal options)
  icsReminder?: number | string;
  icsUrl?: string;
  icsCategories?: string[] | string;
  icsClass?: 'public' | 'private' | 'confidential';
  icsPriority?: number | string;
  icsGeo?: string;
  icsAttach?: string[] | string;
  icsExdate?: string[] | string;
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

// Global augmentations used across the source
declare global {
  interface Window {
    dataLayer?: { [key: string]: unknown }[];
    atcb_action?: (data: ATCBInputConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean) => Promise<string>;
  }
  interface HTMLElementTagNameMap {
    'add-to-calendar-button': HTMLElement & AddToCalendarButtonType;
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ['add-to-calendar-button']: AddToCalendarButtonType;
    }
  }
}
