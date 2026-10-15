export enum Availability {
  BUSY = 'busy',
  FREE = 'free',
}

export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum Option {
  APPLE = 'apple',
  GOOGLE = 'google',
  ICAL = 'ical',
  MICROSOFT365 = 'ms365',
  MICROSOFT_TEAMS = 'msteams',
  OUTLOOK = 'outlookcom',
  YAHOO = 'yahoo',
}

export const OptionLabels: Record<Option, string> = {
  [Option.APPLE]: 'Apple',
  [Option.GOOGLE]: 'Google',
  [Option.ICAL]: 'iCal',
  [Option.MICROSOFT365]: 'Microsoft 365',
  [Option.MICROSOFT_TEAMS]: 'Microsoft Teams',
  [Option.OUTLOOK]: 'Outlook.com',
  [Option.YAHOO]: 'Yahoo',
};

export enum ListStyle {
  DROPDOWN = 'dropdown',
  DROPDOWN_STATIC = 'dropdown-static',
  DROPUP_STATIC = 'dropup-static',
  OVERLAY = 'overlay',
  MODAL = 'modal',
}

export enum ButtonStyle {
  DEFAULT = 'default',
  SIMPLE = 'simple',
  '3D' = '3d',
  FLAT = 'flat',
  ROUND = 'round',
  NEUMORPHISM = 'neumorphism',
  TEXT = 'text',
  DATE = 'date',
}

export enum Trigger {
  HOVER = 'hover',
  CLICK = 'click',
}

export enum LightMode {
  SYSTEM = 'system',
  DARK = 'dark',
  LIGHT = 'light',
  BODY_SCHEME = 'bodyScheme',
}

export enum PastDateHandling {
  NONE = 'none',
  DISABLE = 'disable',
  HIDE = 'hide',
}

export const DefaultListStyle = ListStyle.DROPDOWN;
export const DefaultButtonStyle = ButtonStyle.DEFAULT;
export const DefaultTrigger = Trigger.HOVER;
export const DefaultLightMode = LightMode.LIGHT;
export const DefaultPastDateHandling = PastDateHandling.NONE;
export const Size = { default: 6, min: 0, max: 10 };
