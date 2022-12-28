export enum Status {
  TENTATIVE = 'tentative',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

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
  APPLE = 'Apple',
  GOOGLE = 'Google',
  ICAL = 'iCal',
  MICROSOFT365 = 'Microsoft365',
  MICROSOFT_TEAMS = 'MicrosoftTeams',
  OUTLOOK = 'Outlook.com',
  YAHOO = 'Yahoo',
}

export enum ListStyle {
  DROPDOWN = 'dropdown',
  DROPDOWN_STATIC = 'dropdown-static',
  OVERLAY = 'overlay',
  MODAL = 'modal',
}

export enum ButtonStyle {
  DEFAULT = 'default',
  '3D' = '3d',
  FLAT = 'flat',
  ROUND = 'round',
  NEUMORPHISM = 'neumorphism',
  TEXT = 'text',
  DATE = 'date',
  //CUSTOM = 'custom',
  //NONE = 'none',
}

export const DefaultButtonStyle = ButtonStyle.DEFAULT;

export enum Trigger {
  HOVER = 'hover',
  CLICK = 'click',
}

export const DefaultTrigger = Trigger.HOVER;

export enum LightMode {
  SYSTEM = 'system',
  DARK = 'dark',
  LIGHT = 'light',
  BODY_SCHEME = 'bodyScheme',
}

export const DefaultLightMode = LightMode.LIGHT;

export const Size = {
  default: 6,
  min: 0,
  max: 10,
};
