/**
 * Main package entry (ES module / CommonJS via build).
 * Importing this module registers the <add-to-calendar-button> custom element
 * as a side effect and exposes the imperative API plus the public types.
 */
export { atcb_action } from './action/index';
export { i18nStrings, atcb_register_locale } from './i18n/index';
export { atcbCssTemplate as cssStyles, atcb_register_style } from './styles/css-template';
export { atcb_generate_ty } from './ui/pro';
export { atcb_generate_timestring } from './core/dates';
export { atcb_decorate_data_dates } from './core/decorate';
export type { ATCBActionEventConfig, AddToCalendarButtonType, EventDate, CustomLabelsObjectType, ATCBLanguage } from './types';
