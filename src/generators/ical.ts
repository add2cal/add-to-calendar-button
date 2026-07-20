import { tzlib_get_ical_block } from 'timezones-ical-library';
import { atcbVersion, atcbIsiOS, atcbIsAndroid, atcbIsSafari, atcbIsWebView, atcbIsProblematicWebView, atcbDefaultTarget } from '../core/globals';
import { atcb_generate_time, atcb_format_datetime } from '../core/dates';
import { atcb_secure_url, atcb_rewrite_ical_text, atcb_format_ical_lines } from '../core/text';
import { atcb_save_file, atcb_copy_to_clipboard } from '../core/util';
import { atcb_result_channel } from '../core/globals';
import { atcb_create_modal } from '../ui/generate';
import { atcb_translate_hook } from '../i18n/index';
import type { ATCBConfig } from '../types';

// FUNCTION TO OPEN THE URL
// normalize a list-ish ics option value (array or comma-separated string)
function atcb_ics_option_list(value: string[] | string | undefined): string[] {
  if (!value) return [];
  // attribute parsing may deliver arrays whose items still carry commas - flatten those too
  return (Array.isArray(value) ? value : [String(value)])
    .flatMap((item) => String(item).split(','))
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

function atcb_open_cal_url(data: ATCBConfig, type: string, url = '', subscribe = false, subEvent: 'all' | number | string | null = null, target = ''): void {
  if (target === '') {
    target = atcbDefaultTarget;
  }
  if (data.proxy && data.proKey && data.proKey !== '') {
    const urlType = subscribe ? 's' : 'o';
    const query = (function () {
      const parts: string[] = [];
      if (data.dates![0]!.attendee && data.dates![0]!.attendee !== '') {
        parts.push('attendee=' + encodeURIComponent(data.dates![0]!.attendee));
      }
      if (data.customVar && typeof data.customVar === 'object' && Object.keys(data.customVar).length > 0) {
        parts.push('customvar=' + encodeURIComponent(JSON.stringify(data.customVar)));
      }
      if (data.dates && data.dates.length > 1 && subEvent !== null && subEvent !== 'all') {
        parts.push('sub-event=' + subEvent);
      }
      if (parts.length > 0) {
        return '?' + parts.join('&');
      }
      return '';
    })();
    const host = data.domain ? data.domain : data.dev ? 'dev.caldn.net' : 'caldn.net';
    url = `https://${host}/${data.proKey}/${urlType}/${type}${query}`;
    if (!atcb_secure_url(url)) {
      return;
    }
  }
  if (atcb_secure_url(url)) {
    if (atcb_result_channel.active()) {
      atcb_result_channel.push(url);
      return;
    }
    const newTab = window.open(url, target);
    if (newTab) {
      newTab.focus();
    }
  }
}

// ICAL SUBSCRIPTION
function atcb_subscribe_ical(data: ATCBConfig, fileUrl: string, type: string, host: ShadowRoot | null = null, keyboardTrigger = false): void {
  // for Chrome on iOS, we can not directly open the file, but we can show a modal with instructions
  if (atcbIsiOS() && !atcbIsSafari()) {
    atcb_ical_copy_note(host as unknown as ShadowRoot, fileUrl, data, keyboardTrigger);
    return;
  }
  atcb_open_cal_url(data, type, fileUrl, true);
}

// FUNCTION TO GENERATE THE iCAL FILE (also for apple - see above)
// See specs at: https://www.rfc-editor.org/rfc/rfc5545.html
function atcb_generate_ical(host: ShadowRoot, data: ATCBConfig, type: string, subEvent: 'all' | number | string = 'all', keyboardTrigger = false): void {
  if (subEvent !== 'all') {
    subEvent = parseInt(subEvent as string);
  }
  // define the right filename
  const filename = atcb_determine_ical_filename(data, subEvent);
  // check for a given explicit file...
  const givenIcsFile = (function () {
    // ignore a given file, if there is an attendee or customVar provided at the host level, as this would need to be added to the file
    const potentialHostAttendee = (host && host.host && host.host.getAttribute('attendee')) || '';
    const potentialHostCustomVar = (host && host.host && host.host.getAttribute('customVar')) || '';
    if ((data.attendee && data.attendee !== '' && potentialHostAttendee !== '') || (data.customVar && (data.customVar as unknown) !== '' && potentialHostCustomVar !== '')) {
      return '';
    }
    // otherwise, we check for a given explicit file
    if (subEvent !== 'all' && data.dates![`${subEvent}`]!.icsFile && data.dates![`${subEvent}`]!.icsFile !== '') {
      return data.dates![`${subEvent}`]!.icsFile;
    }
    if (data.icsFile && data.icsFile !== '') {
      return data.icsFile;
    }
    return '';
  })() as string;
  // if we are in proxy mode, we can directly redirect
  if (data.proxy) {
    atcb_open_cal_url(data, type, '', false, subEvent);
    return;
  }
  // else, we directly load it (not if iOS and WebView - will be catched further down - except it is explicitely bridged)
  if (givenIcsFile !== '' && ((!atcbIsiOS() && !data.fakeIOS) || !atcbIsWebView() || data.bypassWebViewCheck)) {
    if (atcb_result_channel.active()) {
      atcb_result_channel.push(givenIcsFile);
      return;
    }
    atcb_save_file(givenIcsFile, filename);
    return;
  }
  // otherwise, generate one on the fly
  const now = new Date();
  const ics_lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
  ics_lines.push('PRODID:-// https://add-to-calendar-pro.com // button v' + atcbVersion + ' //EN');
  ics_lines.push('CALSCALE:GREGORIAN');
  // we set CANCEL, whenever the status says so
  // mind that in the multi-date case (where we create 1 ics file), CANCEL is no option
  if (subEvent === 'all') {
    // we use REQUEST for organized/hosted events, ...
    if (data.dates![0]!.organizer && data.dates![0]!.organizer !== '') {
      ics_lines.push('METHOD:REQUEST');
    } else {
      // and PUBLISH for events without a host
      ics_lines.push('METHOD:PUBLISH');
    }
  } else {
    if (data.dates![`${subEvent}`]!.status && (data.dates![`${subEvent}`]!.status as string).toLowerCase() === 'cancelled') {
      ics_lines.push('METHOD:CANCEL');
    } else {
      if (data.dates![`${subEvent}`]!.organizer && data.dates![`${subEvent}`]!.organizer !== '') {
        ics_lines.push('METHOD:REQUEST');
      } else {
        ics_lines.push('METHOD:PUBLISH');
      }
    }
  }
  const usedTimeZones: string[] = [];
  const loopStart = (function () {
    if (subEvent != 'all') {
      return subEvent as number;
    }
    return 0;
  })();
  const loopEnd = (function () {
    if (subEvent != 'all') {
      return subEvent as number;
    }
    return data.dates!.length - 1;
  })();
  for (let i = loopStart; i <= loopEnd; i++) {
    const formattedDate = atcb_generate_time(data.dates![`${i}`]!, 'clean', 'ical');
    // get the timezone addon string for dates and include time zone information, if set and if not allday (not necessary in that case)
    const timeAddon = (function () {
      if (formattedDate.allday) {
        return ';VALUE=DATE';
      }
      if (data.dates![`${i}`]!.timeZone && data.dates![`${i}`]!.timeZone !== '') {
        // for certain time zones (mostly GMT +/- something and some US time zones), we use GMT and a converted datetime as this would not be supported by Google Calendar and one could use the ics there
        const timeZone = /GMT[+|-]\d{1,2}|Etc\/U|Etc\/Zulu|CET|CST6CDT|EET|EST|MET|MST|PST8PDT|WET|PST|PDT|MDT|CST|CDT|EDT|EEST|CEST|HST|HDT|AKST|AKDT|AST|ADT|AEST|AEDT|NZST|NZDT|IST|IDT|WEST|ACST|ACDT|BST/i.test(data.dates![`${i}`]!.timeZone as string)
          ? 'GMT'
          : (data.dates![`${i}`]!.timeZone as string);
        const timeZoneBlock = tzlib_get_ical_block(timeZone);
        if (!usedTimeZones.includes(timeZone)) {
          ics_lines.push(timeZoneBlock[0]!);
        }
        usedTimeZones.push(timeZone);
        return ';' + timeZoneBlock[1];
      }
      return undefined;
    })();
    ics_lines.push('BEGIN:VEVENT');
    if (data.dates![`${i}`]!.uid && data.dates![`${i}`]!.uid !== '') {
      ics_lines.push('UID:' + data.dates![`${i}`]!.uid);
    }
    ics_lines.push('DTSTAMP:' + atcb_format_datetime(now, 'clean', true));
    ics_lines.push('DTSTART' + timeAddon + ':' + formattedDate.start);
    ics_lines.push('DTEND' + timeAddon + ':' + formattedDate.end);
    ics_lines.push('SUMMARY:' + atcb_rewrite_ical_text(data.dates![`${i}`]!.name!));
    if (data.dates![`${i}`]!.descriptionHtmlFreeICal && data.dates![`${i}`]!.descriptionHtmlFreeICal !== '') {
      ics_lines.push('DESCRIPTION:' + atcb_rewrite_ical_text(data.dates![`${i}`]!.descriptionHtmlFreeICal as string));
    }
    if (data.dates![`${i}`]!.description && data.dates![`${i}`]!.description !== '') {
      ics_lines.push('X-ALT-DESC;FMTTYPE=text/html:\r\n <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2//EN">\r\n <HTML><BODY>\r\n ' + atcb_rewrite_ical_text(data.dates![`${i}`]!.description!) + '\r\n </BODY></HTML>');
    }
    if (data.dates![`${i}`]!.location && data.dates![`${i}`]!.location !== '') {
      ics_lines.push('LOCATION:' + atcb_rewrite_ical_text(data.dates![`${i}`]!.location!));
    }
    if (data.dates![`${i}`]!.organizer && data.dates![`${i}`]!.organizer !== '') {
      const organizerParts = (data.dates![`${i}`]!.organizer as string).split('|');
      ics_lines.push('ORGANIZER;CN=' + atcb_rewrite_ical_text(organizerParts[0]!, true) + ':MAILTO:' + organizerParts[1]);
    }
    if (data.dates![`${i}`]!.attendee && data.dates![`${i}`]!.attendee !== '') {
      const attendeeParts = (data.dates![`${i}`]!.attendee as string).split('|');
      if (attendeeParts.length === 2) {
        ics_lines.push('ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=' + atcb_rewrite_ical_text(attendeeParts[0]!, true) + ';X-NUM-GUESTS=0:mailto:' + attendeeParts[1]);
      } else {
        ics_lines.push('ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=' + attendeeParts[0] + ';X-NUM-GUESTS=0:mailto:' + attendeeParts[0]);
      }
    }
    if (data.recurrence && data.recurrence !== '') {
      ics_lines.push(data.recurrence);
    }
    if (data.dates![`${i}`]!.availability && data.dates![`${i}`]!.availability !== '') {
      const transpVal = (function () {
        if (data.dates![`${i}`]!.availability == 'free') {
          return 'TRANSPARENT';
        }
        return 'OPAQUE';
      })();
      ics_lines.push('TRANSP:' + transpVal);
    }
    ics_lines.push('SEQUENCE:' + data.dates![`${i}`]!.sequence);
    ics_lines.push('STATUS:' + data.dates![`${i}`]!.status);
    ics_lines.push('CREATED:' + data.created);
    ics_lines.push('LAST-MODIFIED:' + data.updated);
    // ics-only extra options (these shape the generated file only - other calendar
    // types ignore them by design, since their generators never read these keys)
    const entry = data.dates![`${i}`]!;
    if (entry.icsUrl && entry.icsUrl !== '') {
      ics_lines.push('URL:' + entry.icsUrl);
    }
    const categories = atcb_ics_option_list(entry.icsCategories);
    if (categories.length > 0) {
      ics_lines.push('CATEGORIES:' + categories.map((category) => atcb_rewrite_ical_text(category)).join(','));
    }
    if (entry.icsClass && String(entry.icsClass) !== '') {
      ics_lines.push('CLASS:' + String(entry.icsClass).toUpperCase());
    }
    if (entry.icsPriority !== undefined && String(entry.icsPriority) !== '') {
      ics_lines.push('PRIORITY:' + parseInt(String(entry.icsPriority), 10));
    }
    if (entry.icsGeo && String(entry.icsGeo) !== '') {
      const [latRaw, lonRaw] = String(entry.icsGeo).split(',');
      const lat = parseFloat(latRaw!.trim());
      const lon = parseFloat(lonRaw!.trim());
      ics_lines.push('GEO:' + lat + ';' + lon);
      // Apple Calendar only renders its map preview when the structured location's
      // title matches the LOCATION property - so it is derived, not configurable
      if (entry.location && entry.location !== '') {
        ics_lines.push('X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-APPLE-RADIUS=100;X-TITLE=' + atcb_rewrite_ical_text(entry.location, true) + ':geo:' + lat + ',' + lon);
      }
    }
    for (const attachUrl of atcb_ics_option_list(entry.icsAttach)) {
      ics_lines.push('ATTACH:' + attachUrl);
    }
    // exdate pairs with recurrence (single-date configs only) and mirrors the
    // DTSTART form: same value type, same time zone reference, same wall-clock time
    if (i === 0 && data.recurrence && data.recurrence !== '') {
      const exdates = atcb_ics_option_list(data.icsExdate);
      if (exdates.length > 0) {
        const exdateValues = exdates.map((exdate) => {
          const datePart = exdate.replace(/-/g, '');
          if (formattedDate.allday) {
            return datePart;
          }
          return datePart + 'T' + (entry.startTime ? entry.startTime.replace(':', '') : '0000') + '00';
        });
        ics_lines.push('EXDATE' + (timeAddon || '') + ':' + exdateValues.join(','));
      }
    }
    if (entry.icsReminder !== undefined && String(entry.icsReminder) !== '') {
      const trigger = /^\d+$/.test(String(entry.icsReminder)) ? '-PT' + parseInt(String(entry.icsReminder), 10) + 'M' : String(entry.icsReminder).toUpperCase();
      ics_lines.push('BEGIN:VALARM');
      ics_lines.push('ACTION:DISPLAY');
      ics_lines.push('DESCRIPTION:' + atcb_rewrite_ical_text(entry.name || 'Reminder'));
      ics_lines.push('TRIGGER:' + trigger);
      ics_lines.push('END:VALARM');
    }
    ics_lines.push('END:VEVENT');
  }
  ics_lines.push('END:VCALENDAR');
  // if we got to this point with an explicitely given iCal file, we are on an iOS device
  // (but at some wrong environment). In this case, we use it as dataUrl to then show a modal
  const icsContent = givenIcsFile !== '' ? '' : atcb_format_ical_lines(ics_lines.join('\r\n'));
  const dataUrl = givenIcsFile !== '' ? givenIcsFile : 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
  if (atcb_result_channel.active()) {
    atcb_result_channel.push(givenIcsFile !== '' ? givenIcsFile : icsContent);
    return;
  }
  // in in-app browser cases (WebView), we offer a copy option, since the on-the-fly client side generation is usually not supported
  // for Android, we are more specific than with iOS and only go for specific apps at the moment
  // for Chrome on iOS we basically do the same
  if ((atcbIsiOS() && !atcbIsSafari()) || (atcbIsWebView() && (atcbIsiOS() || (atcbIsAndroid() && atcbIsProblematicWebView())))) {
    atcb_ical_copy_note(host, dataUrl, data, keyboardTrigger);
    return;
  }
  // save the file dialog in all other cases
  atcb_save_file(dataUrl, filename);
}

function atcb_determine_ical_filename(data: ATCBConfig, subEvent: 'all' | number | string): string {
  const filenameSuffix = (function () {
    if (subEvent != 'all' && subEvent != 0) {
      return '-' + parseInt(subEvent as string) + 1;
    }
    return '';
  })();
  if (data.iCalFileName != null && data.iCalFileName != '') {
    return data.iCalFileName + filenameSuffix;
  }
  if (data.icsFile != null && data.icsFile != '') {
    const filenamePart = data.icsFile.split('/').pop()!.split('.')[0];
    if (filenamePart != '') {
      return filenamePart + filenameSuffix;
    }
  }
  return 'event' + filenameSuffix;
}

// Copy a link to the clipboard and return the matching modal content: the confirmation
// text on success, or an honest failure text plus a readonly input carrying the link
// for manual copying (select-on-focus is wired by atcb_wire_clipboard_input after the
// modal rendered)
async function atcb_clipboard_note_content(copyValue: string, data: ATCBConfig): Promise<string> {
  try {
    await atcb_copy_to_clipboard(copyValue);
    return atcb_translate_hook('modal.clipboard.text', data);
  } catch (e) {
    console.warn(e);
    const escaped = copyValue.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return atcb_translate_hook('modal.clipboard.failed', data) + '<br><input type="text" class="atcb-modal-clipboard-input" readonly value="' + escaped + '" aria-label="' + atcb_translate_hook('label.share.copy', data) + '" />';
  }
}

// make a manual-copy input select its content on focus (nothing to do when the
// clipboard write succeeded and no input was rendered)
function atcb_wire_clipboard_input(data: ATCBConfig): void {
  const modalHost = document.getElementById(data.identifier + '-modal-host');
  const input = modalHost && modalHost.shadowRoot ? (modalHost.shadowRoot.querySelector('.atcb-modal-clipboard-input') as HTMLInputElement | null) : null;
  if (input) {
    input.addEventListener('focus', () => input.select());
  }
}

async function atcb_ical_copy_note(host: ShadowRoot, dataUrl: string, data: ATCBConfig, keyboardTrigger: boolean): Promise<void> {
  // putting the download url to the clipboard (with a manual-copy fallback in the note)
  const clipboardNote = await atcb_clipboard_note_content(dataUrl, data);
  // creating the modal
  if (atcbIsiOS() && !atcbIsSafari()) {
    await atcb_create_modal(
      host,
      data,
      'warning',
      atcb_translate_hook('modal.opensafari.ical.h', data),
      atcb_translate_hook('modal.opensafari.ical.text', data) + '<br>' + clipboardNote + '<br>' + atcb_translate_hook('modal.opensafari.ical.steps', data),
      [] as unknown as never[],
      [] as unknown as never[],
      keyboardTrigger,
    );
    atcb_wire_clipboard_input(data);
    return;
  }
  await atcb_create_modal(
    host,
    data,
    'warning',
    atcb_translate_hook('modal.webview.ical.h', data),
    atcb_translate_hook('modal.webview.ical.text', data) + '<br>' + clipboardNote + '<br>' + atcb_translate_hook('modal.webview.ical.steps', data),
    [] as unknown as never[],
    [] as unknown as never[],
    keyboardTrigger,
  );
  atcb_wire_clipboard_input(data);
}

export { atcb_open_cal_url, atcb_subscribe_ical, atcb_generate_ical, atcb_determine_ical_filename, atcb_ical_copy_note, atcb_clipboard_note_content, atcb_wire_clipboard_input };
