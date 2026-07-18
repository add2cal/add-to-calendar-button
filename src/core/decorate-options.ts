import { atcbIsiOS, atcbIsAndroid, atcbIsMobile, atcbValidRecurrOptions, atcbInvalidSubscribeOptions, atcbIOSInvalidOptions, atcbAndroidInvalidOptions } from './globals';
import type { ATCBConfig } from '../types';

// cleanup options, standardizing names, and check for mobile special rules
function atcb_decorate_data_options(data: ATCBConfig): ATCBConfig {
  const { options, source } = atcb_determine_options_source(data);
  const processedOptions = atcb_process_options(options, data);
  let newOptions = processedOptions.newOptions;
  let iCalGiven = processedOptions.iCalGiven;
  const appleGiven = processedOptions.appleGiven;
  newOptions = atcb_handle_special_google_calendar_case(data, newOptions);
  ({ newOptions, iCalGiven } = atcb_ensure_fallback_options(newOptions, iCalGiven));
  const normalizedSourceOptions = options.map((option) => atcb_normalize_option_name(option));
  const mobileOptionsUsedWithIcs = source !== 'general' && (normalizedSourceOptions.includes('ical') || normalizedSourceOptions.includes('apple'));
  newOptions = atcb_adjust_platform_specific_options(newOptions, data, iCalGiven, appleGiven, mobileOptionsUsedWithIcs);
  // sort options alphabetically and update data
  newOptions.sort();
  data.options = newOptions;
  return data;
}

// determine which options array to use based on platform and availability
function atcb_determine_options_source(data: ATCBConfig): { options: string[]; source: string } {
  let source = 'general';
  let options = data.options || ['ical'];
  if (atcbIsiOS() || data.fakeIOS) {
    // the more specific optionsIOS wins over optionsMobile; the latter only serves as fallback
    if (data.optionsIOS && data.optionsIOS.length > 0) {
      source = 'ios';
      options = data.optionsIOS;
    } else if (data.optionsMobile && data.optionsMobile.length > 0) {
      source = 'mobile';
      options = data.optionsMobile;
    }
  } else if ((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && data.optionsMobile && data.optionsMobile.length > 0) {
    source = 'mobile';
    options = data.optionsMobile;
  }
  return { options, source };
}

// process options array and filter invalid options
function atcb_process_options(theOptions: string[], data: ATCBConfig): { newOptions: string[]; iCalGiven: boolean; appleGiven: boolean } {
  const newOptions: string[] = [];
  let iCalGiven = false;
  let appleGiven = false;
  for (let i = 0; i < theOptions.length; i++) {
    const optionName = atcb_normalize_option_name(theOptions[`${i}`]!);
    // track which ical-type options were provided
    if (optionName === 'apple') appleGiven = true;
    if (optionName === 'ical') iCalGiven = true;
    // skip invalid options based on various criteria
    if (atcb_should_skip_option(optionName, data)) {
      continue;
    }
    newOptions.push(optionName);
  }
  return { newOptions, iCalGiven, appleGiven };
}

// normalize option name (clean and standardize)
function atcb_normalize_option_name(option: string): string {
  const cleanOption = option.split('|');
  return cleanOption[0]!.toLowerCase().replace('microsoft', 'ms').replace(/\./, '');
}

// determine if an option should be skipped based on platform and context
function atcb_should_skip_option(optionName: string, data: ATCBConfig): boolean {
  return atcb_is_platform_invalid_option(optionName, data) || atcb_is_recurrence_invalid_option(optionName, data) || atcb_is_subscription_invalid_option(optionName, data) || atcb_is_microsoft_mobile_subscription_case(optionName, data);
}

// check if option is invalid for current platform
function atcb_is_platform_invalid_option(optionName: string, data: ATCBConfig): boolean {
  const isIOSWithInvalidOption = !!((atcbIsiOS() || data.fakeIOS) && atcbIOSInvalidOptions.includes(optionName) && (!data.optionsIOS || data.optionsIOS.length === 0) && (!data.optionsMobile || data.optionsMobile.length === 0));
  const isAndroidWithInvalidOption = !!((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && atcbAndroidInvalidOptions.includes(optionName) && (!data.optionsMobile || data.optionsMobile.length === 0));
  return isIOSWithInvalidOption || isAndroidWithInvalidOption;
}

// check if option is invalid for recurrence events
function atcb_is_recurrence_invalid_option(optionName: string, data: ATCBConfig): boolean {
  if (!data.recurrence || data.recurrence === '') return false;
  const isInvalidForRecurrence = !atcbValidRecurrOptions.includes(optionName);
  const isGoogleOnIOS = !!((atcbIsiOS() || data.fakeIOS) && optionName === 'google');
  return isInvalidForRecurrence || isGoogleOnIOS;
}

// check if option is invalid for subscription events
function atcb_is_subscription_invalid_option(optionName: string, data: ATCBConfig): boolean {
  return !!(data.subscribe && atcbInvalidSubscribeOptions.includes(optionName));
}

// tmp patch to reflect the fact that Microsoft is routing mobile traffic differently. We handle regular events on the link level, but subscription cases need to be stripped out
// TODO: remove this, when Microsoft has fixed this
function atcb_is_microsoft_mobile_subscription_case(optionName: string, data: ATCBConfig): boolean {
  return !!((atcbIsMobile() || data.fakeMobile) && data.subscribe && (optionName === 'ms365' || optionName === 'outlookcom'));
}

// if we are in a subscription case and the icsFile starts with https://calendar.google.com/calendar/ and does not end with .ics, we only set the google option as everything else would not work
function atcb_handle_special_google_calendar_case(data: ATCBConfig, newOptions: string[]): string[] {
  if (data.subscribe && data.icsFile && data.icsFile.startsWith('https://calendar.google.com/calendar/') && !data.icsFile.endsWith('.ics')) {
    return ['google'];
  }
  return newOptions;
}

// since the above can lead to excluding all options, we add the iCal option as default, if no other option is left
function atcb_ensure_fallback_options(newOptions: string[], iCalGiven: boolean): { newOptions: string[]; iCalGiven: boolean } {
  if (newOptions.length === 0) {
    newOptions.push('ical');
    iCalGiven = true;
  }
  return { newOptions, iCalGiven };
}

// adjust options based on platform-specific requirements
function atcb_adjust_platform_specific_options(options: string[], data: ATCBConfig, iCalGiven: boolean, appleGiven: boolean, mobileOptionsUsed: boolean = false): string[] {
  // generally, only adjust if not intentionally specified via mobile options
  if (!mobileOptionsUsed) {
    // for iOS, force Apple option if iCal was given but Apple wasn't
    if ((atcbIsiOS() || data.fakeIOS) && iCalGiven && !appleGiven) {
      options.push('apple');
      // drop iCal option, since it does not make sense on iOS (as the apple option covers it)
      options = options.filter((option) => option !== 'ical');
    }
    // for Android, force iCal option if Apple was given but iCal wasn't
    else if ((atcbIsAndroid() || data.fakeMobile || data.fakeAndroid) && appleGiven && !iCalGiven) {
      options.push('ical');
      // drop Apple option, since it does not make sense on Android
      options = options.filter((option) => option !== 'apple');
    }
  }
  return options;
}

export {
  atcb_decorate_data_options,
  atcb_determine_options_source,
  atcb_process_options,
  atcb_normalize_option_name,
  atcb_should_skip_option,
  atcb_is_platform_invalid_option,
  atcb_is_recurrence_invalid_option,
  atcb_is_subscription_invalid_option,
  atcb_is_microsoft_mobile_subscription_case,
  atcb_handle_special_google_calendar_case,
  atcb_ensure_fallback_options,
  atcb_adjust_platform_specific_options,
};
