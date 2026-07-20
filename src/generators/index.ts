import { atcbIsAndroid, atcb_result_channel } from '../core/globals';
import { getOptionStates } from '../core/store';
import { atcb_toggle } from '../ui/control';
import { atcb_saved_hook } from '../core/util';
import { atcb_create_modal } from '../ui/generate';
import { atcb_translate_hook } from '../i18n/index';
import { atcb_generate_ical, atcb_subscribe_ical, atcb_open_cal_url, atcb_clipboard_note_content, atcb_wire_clipboard_input } from './ical';
import { atcb_generate_google, atcb_subscribe_google } from './google';
import { atcb_generate_msteams } from './msteams';
import { atcb_generate_microsoft, atcb_subscribe_microsoft } from './outlook';
import { atcb_generate_yahoo } from './yahoo';
import type { ATCBConfig } from '../types';

// MIDDLEWARE FUNCTION TO GENERATE THE CALENDAR LINKS
async function atcb_generate_links(host: ShadowRoot, type: string, data: ATCBConfig, subEvent: 'all' | number | string = 'all', keyboardTrigger = false, multiDateModal = false, skipDoubleLink = false): Promise<void> {
  // we differentiate between the type the user triggered and the type of link it shall activate
  let linkType = type;
  // the apple type would trigger the same as ical, for example
  if (type === 'apple') {
    linkType = 'ical';
  }
  // adjust for subEvent and case
  if (subEvent !== 'all') {
    subEvent = parseInt(subEvent as string) - 1;
  } else if (data.dates!.length == 1) {
    subEvent = 0;
  }
  // if this is a calendar subscription case, we can take the short route here
  if (data.subscribe) {
    await atcb_generate_subscribe_links(host, type, linkType, data, keyboardTrigger);
    return;
  }
  // for single-date events or if a specific subEvent is given, we can simply call the respective endpoints
  if (subEvent !== 'all') {
    // for cancelled dates, we show a modal - except for iCal, where we can send Cancel-ics-files
    if (data.dates![`${subEvent}`]!.status === 'cancelled' && linkType !== 'ical') {
      atcb_create_modal(host, data, 'warning', atcb_translate_hook('date.status.cancelled', data), atcb_translate_hook('date.status.cancelled_cta', data), [] as unknown as never[], [] as unknown as never[], keyboardTrigger);
    } else {
      // in some cases, we want to inform the user about specifics for the link type, before actually following the link
      if (!skipDoubleLink) {
        // nothing to show here at the moment...
        // if something comes up, we can use something like the following:
        // if ((atcbIsiOS() || data.fakeIOS) && linkType === 'google') {
        // atcb_create_modal(host, data, 'warning', '', atcb_translate_hook('modal.warn.1.text', data), [{ label: atcb_translate_hook('continue', data), primary: true, type: '2timeslink' },{ label: atcb_translate_hook('cancel', data) }], [], keyboardTrigger, { type: type, id: subEvent + 1 });
        // return;
        // }
      }
      // apart from that, we generate the link
      switch (linkType) {
        case 'ical': // also for apple (see above)
          atcb_generate_ical(host, data, type, subEvent, keyboardTrigger);
          break;
        case 'google':
          atcb_generate_google(data, data.dates![`${subEvent}`]!, subEvent);
          break;
        case 'msteams':
          atcb_generate_msteams(data, data.dates![`${subEvent}`]!, subEvent);
          break;
        case 'ms365':
          atcb_generate_microsoft(data, data.dates![`${subEvent}`]!, subEvent);
          break;
        case 'outlookcom':
          atcb_generate_microsoft(data, data.dates![`${subEvent}`]!, subEvent, 'outlookcom');
          break;
        case 'yahoo':
          atcb_generate_yahoo(data, data.dates![`${subEvent}`]!, subEvent);
          break;
      }
      // we mark the clicked date - in the multi-date case, this would be one out of many - not for cancelled (ical case)
      // programmatic flows got their value with the dispatch above - the saved-state
      // bookkeeping below is pure ui
      if (atcb_result_channel.active()) {
        return;
      }
      const modalHost = document.getElementById(data.identifier + '-modal-host');
      if (modalHost) {
        const subEventButton = modalHost.shadowRoot!.getElementById(data.identifier + '-' + type + '-' + ((subEvent as number) + 1));
        if (subEventButton) {
          subEventButton.classList.add('atcb-saved');
        }
      }
      if (data.dates![`${subEvent}`]!.status !== 'cancelled') getOptionStates(data.identifier!)[`${type}`]![subEvent as number]!++;
      const filteredStates = getOptionStates(data.identifier!)[`${type}`]!.filter(function (value: number) {
        return value < 1;
      });
      if (filteredStates.length == 0) {
        atcb_set_fully_successful(host, data, multiDateModal);
      }
    }
    return;
  }
  // if not a single date case, we continue for multi-date
  atcb_generate_multidate_links(host, type, linkType, data, keyboardTrigger, multiDateModal);
}

function atcb_generate_multidate_links(host: ShadowRoot, type: string, linkType: string, data: ATCBConfig, keyboardTrigger: boolean, multiDateModal: boolean): void {
  // in the multi-date event case, when all subEvent have no organizer OR the same organizer AND are not cancelled, we can also go the short way (for iCal)
  if (linkType === 'ical' && !data.dates!.some((theSubEvent) => theSubEvent.status === 'cancelled') && data.dates!.every((theSubEvent) => (theSubEvent.organizer || '') === (data.dates![0]!.organizer || ''))) {
    atcb_generate_ical(host, data, type, 'all', keyboardTrigger);
    // we mark the whole event as clicked
    for (let i = 0; i < getOptionStates(data.identifier!)[`${type}`]!.length; i++) {
      getOptionStates(data.identifier!)[`${type}`]![`${i}` as unknown as number]!++;
    }
    atcb_set_fully_successful(host, data, multiDateModal);
    return;
  }
  // for multi-date events in all other cases, we show an intermediate layer
  if (!multiDateModal) {
    const individualButtons: (string | number)[] = [type];
    for (let i = 0; i < data.dates!.length; i++) {
      individualButtons.push(i + 1);
    }
    atcb_create_modal(host, data, type, atcb_translate_hook('modal.multidate.h', data), atcb_translate_hook('modal.multidate.text', data), [] as unknown as never[], individualButtons as unknown as never[], keyboardTrigger);
  }
}

async function atcb_generate_subscribe_links(host: ShadowRoot, type: string, linkType: string, data: ATCBConfig, keyboardTrigger: boolean): Promise<void> {
  const adjustedFileUrl = data.icsFile!.replace('https://', 'webcal://');
  let clipboardNote: string;
  switch (linkType) {
    case 'ical': // also for apple (see above)
      if (atcbIsAndroid() || data.fakeAndroid) {
        // workaround for Android as it does not play nicely with webcal (still leads to wrong behavior. TODO: Rather show an error message here)
        atcb_subscribe_ical(data, data.icsFile!, type);
        break;
      }
      atcb_subscribe_ical(data, adjustedFileUrl, type, host, keyboardTrigger);
      break;
    case 'google':
      atcb_subscribe_google(data, adjustedFileUrl);
      break;
    case 'ms365':
      atcb_subscribe_microsoft(data, adjustedFileUrl, data.name!);
      break;
    case 'outlookcom':
      atcb_subscribe_microsoft(data, adjustedFileUrl, data.name!, 'outlookcom');
      break;
    case 'yahoo':
      if (data.proxy) {
        atcb_open_cal_url(data, 'yahoo', '', true);
        return;
      }
      clipboardNote = await atcb_clipboard_note_content(data.icsFile as string, data);
      await atcb_create_modal(
        host,
        data,
        'yahoo',
        atcb_translate_hook('modal.subscribe.yahoo.h', data),
        clipboardNote + '<br>' + atcb_translate_hook('modal.subscribe.yahoo.text', data),
        [
          {
            label: atcb_translate_hook('modal.subscribe.yahoo.button', data),
            primary: true,
            type: 'yahoo2nd',
            href: 'https://www.yahoo.com/calendar',
          },
          { label: atcb_translate_hook('cancel', data) },
        ] as unknown as never[],
        [] as unknown as never[],
        keyboardTrigger,
      );
      atcb_wire_clipboard_input(data);
      return;
    case 'yahoo2nd':
      // step 2 of the yahoo subscribe flow: the link was already copied to the clipboard
      // in step 1 (yahoo), so we do NOT copy again here - a second copy of the same value
      // is pointless and its failure path would wrongly claim copying did not work. The
      // secondary button just closes the modal (relabeled from cancel to close)
      await atcb_create_modal(
        host,
        data,
        'yahoo',
        atcb_translate_hook('modal.subscribe.yahoo.h', data),
        atcb_translate_hook('modal.subscribe.yahoo.text', data),
        [
          {
            label: atcb_translate_hook('modal.subscribe.yahoo.button', data),
            type: 'none',
            href: 'https://www.yahoo.com/calendar',
          },
          { label: atcb_translate_hook('close', data) },
        ] as unknown as never[],
        [] as unknown as never[],
        keyboardTrigger,
      );
      return;
  }
  // mark as successful (except for the Yahoo case, with returned)
  atcb_set_fully_successful(host, data);
}

function atcb_set_fully_successful(host: ShadowRoot, data: ATCBConfig, multiDateModal = false): void {
  // pure ui feedback - nothing to do for programmatic flows
  if (atcb_result_channel.active()) {
    return;
  }
  const trigger = host.getElementById(data.identifier as string);
  if (trigger) {
    trigger.classList.add('atcb-saved');
  }
  atcb_saved_hook(host, data);
  if (multiDateModal && host.querySelectorAll('.atcb-modal[data-modal-nr]').length < 2) {
    atcb_toggle(host, 'close');
  }
}

export { atcb_generate_links, atcb_set_fully_successful };
