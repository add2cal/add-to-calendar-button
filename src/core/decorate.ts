import { atcbIsBrowser, atcbWcBooleanParams } from './globals';
import { atcb_decorate_data_options } from './decorate-options';
import { atcb_decorate_data_dates } from './decorate-dates';
import { availableLanguages, rtlLanguages } from '../i18n/index';
import { atcb_check_bookings } from '../ui/pro';
import type { ATCBConfig, ATCBInputConfig, ATCBDateEntry } from '../types';

export { atcb_decorate_data_dates } from './decorate-dates';

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
async function atcb_decorate_data(data: ATCBConfig | ATCBInputConfig): Promise<ATCBConfig> {
  let cfg = data as ATCBConfig;
  cfg = atcb_decorate_data_boolean(cfg);
  cfg = atcb_decorate_data_defaults(cfg);
  cfg = atcb_decorate_data_options(cfg);
  cfg = atcb_decorate_data_style(cfg);
  cfg.sizes = atcb_decorate_sizes(cfg.size as string | undefined);
  cfg.lightMode = atcb_decorate_light_mode(cfg.lightMode);
  cfg = atcb_decorate_data_i18n(cfg);
  cfg = atcb_decorate_data_dates(cfg);
  cfg = await atcb_decorate_data_rsvp(cfg);
  return cfg;
}

// setting boolean parameters right, since they can be provided or not
function atcb_decorate_data_boolean(data: ATCBConfig): ATCBConfig {
  for (let i = 0; i < atcbWcBooleanParams.length; i++) {
    const attr = atcbWcBooleanParams[`${i}`]! as string;
    if (data[`${attr}`]) {
      // only do something if not already a boolean
      if (typeof data[`${attr}`] !== 'boolean') {
        const val = (data[`${attr}`] as unknown as { toString(): string }).toString().trim().toLowerCase() || '';
        data[`${attr}`] = val === '' || val === 'true' ? true : false;
      }
    } else {
      data[`${attr}`] = false;
    }
  }
  return data;
}

function atcb_set_date_defaults(dateEntry: ATCBDateEntry | ATCBConfig): void {
  // set time zone
  if (!dateEntry.timeZone || dateEntry.timeZone === '') {
    dateEntry.timeZone = 'GMT';
  }
  // set default status
  if (!dateEntry.status || dateEntry.status === '') {
    dateEntry.status = 'CONFIRMED';
  }
  // set default sequence
  if (!dateEntry.sequence || dateEntry.sequence === '') {
    dateEntry.sequence = 0;
  } else {
    dateEntry.sequence = parseInt(dateEntry.sequence as string);
    if (isNaN(dateEntry.sequence) || dateEntry.sequence < 0) {
      dateEntry.sequence = 0;
    }
  }
}

function atcb_decorate_data_defaults(data: ATCBConfig): ATCBConfig {
  if (data.dates) {
    for (let i = 0; i < data.dates.length; i++) {
      atcb_set_date_defaults(data.dates[`${i}`]!);
    }
  } else {
    atcb_set_date_defaults(data);
  }
  // set language if not set; full locales (en_US / en-GB) are validated via their base
  if (!data.language || data.language === '') {
    data.language = 'en';
  } else if (!availableLanguages.includes(String(data.language).length > 2 ? String(data.language).substring(0, 2) : String(data.language))) {
    data.language = 'en';
  }
  return data;
}

function atcb_decorate_data_style(data: ATCBConfig): ATCBConfig {
  // set inline if inlineRSVP
  if (data.inlineRSVP) {
    data.inline = true;
  }
  // set default listStyle
  if (!data.listStyle || data.listStyle === '') {
    data.listStyle = 'dropdown';
  }
  // force click trigger on modal style
  if (data.listStyle === 'modal') {
    data.trigger = 'click';
  }
  // set button style and force click on styles, where the dropdown is not attached to the button
  if (data.buttonStyle && data.buttonStyle !== '' && data.buttonStyle != 'default') {
    if (data.buttonStyle == 'simple' || data.buttonStyle == 'round' || data.buttonStyle == 'text' || data.buttonStyle == 'date' || data.buttonStyle == 'neumorphism') {
      data.trigger = 'click';
    }
  } else {
    data.buttonStyle = 'default';
  }
  // force overlay when the button label is ommited, but the list labels are not (which would make the list need to be way larger than the button) - at dropdown cases
  if ((data.buttonStyle == 'default' || data.buttonStyle == '3d' || data.buttonStyle == 'flat') && !data.hideTextLabelList && data.hideTextLabelButton && (data.listStyle == 'dropdown' || data.listStyle == 'dropdown-static' || data.listStyle == 'dropup-static')) {
    data.listStyle = 'overlay';
  }
  // force buttonsList false on date style button
  if (data.buttonsList && data.buttonStyle == 'date') {
    data.buttonsList = false;
  }
  // return result
  return data;
}

// prepare sizes
function atcb_decorate_sizes(size?: string): { [key: string]: number | string } {
  const sizes: { [key: string]: number | string } = [] as unknown as { [key: string]: number | string };
  sizes['l'] = sizes['m'] = sizes['s'] = 16;
  if (size && size !== '') {
    const sizeParts: (string | number)[] = size.split('|');
    for (let i = 0; i < sizeParts.length; i++) {
      sizeParts[`${i}`] = parseInt(sizeParts[`${i}`] as string);
    }
    if ((sizeParts[0] as number) >= 0 && (sizeParts[0] as number) < 11) {
      sizes['l'] = sizes['m'] = sizes['s'] = 10 + (sizeParts[0] as number);
    }
    if (sizeParts.length > 2) {
      if ((sizeParts[1] as number) >= 0 && (sizeParts[1] as number) < 11) {
        sizes['m'] = 10 + (sizeParts[1] as number);
      }
      if ((sizeParts[2] as number) >= 0 && (sizeParts[2] as number) < 11) {
        sizes['s'] = 10 + (sizeParts[2] as number);
      }
    } else if (sizeParts.length == 2) {
      if ((sizeParts[1] as number) >= 0 && (sizeParts[1] as number) < 11) {
        sizes['m'] = sizes['s'] = 10 + (sizeParts[1] as number);
      }
    }
  }
  return sizes;
}

// determine dark mode
function atcb_decorate_light_mode(lightMode: string = ''): string {
  if (lightMode == 'system' && atcbIsBrowser()) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  if (lightMode != 'bodyScheme' && lightMode != 'dark') {
    return 'light';
  }
  return lightMode;
}

function atcb_decorate_data_i18n(data: ATCBConfig): ATCBConfig {
  const raw = String(data.language || 'en');
  let region = '';
  // reduce language identifier, if long version is used - keeping the region part
  // for date formatting and for regional translation packs (like en_GB)
  if (raw.length > 2) {
    const match = raw.match(/^([a-z]{2})[-_]([a-z]{2})$/i);
    if (match) {
      region = match[2]!.toUpperCase();
    }
    data.language = raw.substring(0, 2);
  }
  // the formatting locale drives Intl date/time output: an explicit region on the
  // language attribute wins; otherwise the browser region refines the base language
  const browserRegion = (function () {
    if (typeof navigator === 'undefined' || !navigator.language) return '';
    const parts = navigator.language.split('-');
    const last = parts[parts.length - 1] || '';
    return parts.length > 1 && /^[a-z]{2}$/i.test(last) ? last.toUpperCase() : '';
  })();
  const effectiveRegion = region || browserRegion;
  data.formatLocale = effectiveRegion ? data.language + '-' + effectiveRegion : data.language;
  // regional translation packs are looked up first when registered (en_GB before en)
  data.translationLocale = region ? data.language + '_' + region : data.language;
  // set right-to-left for relevant languages
  if (rtlLanguages.includes(data.language!)) {
    data.rtl = true;
  } else {
    data.rtl = false;
  }
  return data;
}

async function atcb_decorate_data_rsvp(data: ATCBConfig): Promise<ATCBConfig> {
  if (typeof atcb_check_bookings !== 'function' || !data.rsvp || !data.proKey || Object.keys(data.rsvp).length === 0) return data;
  // determine whether RSVP is expired
  data.rsvp.expired = (function () {
    if (data.rsvp && data.rsvp.expires && new Date(data.rsvp.expires as string) < new Date()) {
      return true;
    }
    return false;
  })();
  // determine whether RSVP is booked out and set # seats left
  if (data.rsvp.max) {
    const bookings = await atcb_check_bookings(data.proKey, data.dev);
    data.rsvp.seatsLeft = (data.rsvp.max as number) - bookings;
    if ((data.rsvp.seatsLeft as number) < 1) {
      data.rsvp.bookedOut = true;
    }
    if (data.rsvp.expired || data.rsvp.bookedOut) {
      data.blockInteraction = true;
    }
    if (data.blockInteraction) {
      data.disabled = true;
    }
  }
  return data;
}

export { atcb_decorate_data };
