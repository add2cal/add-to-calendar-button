/**
 * atcb_action - the imperative API for custom triggers (no web component markup needed).
 */
import { isBrowser, isIOS, resultChannel } from '../core/globals';
import { getActiveButton, getButtonInstance, deleteButtonInstance } from '../core/store';
import { decorate_data } from '../core/decorate';
import { check_required, validate } from '../core/validate';
import { close, toggle } from '../ui/control';
import { generate_links } from '../generators/index';
import { generate_ical, static_ics_file } from '../generators/ical';
import { secure_content } from '../core/text';
import { log_event } from '../core/events';
import { generate_rsvp_form } from '../ui/pro';
import { create_modal } from '../ui/generate';
import { can_group_ics, revoke_ics_blob_urls } from '../ui/ics-links';
import type { ATCBIcsAction } from '../generators/ical';
import { ensure_locale } from '../i18n/index';
import { get_pro_data, init_log, setup_state_management, set_global_event_listener, load_css, set_light_mode, shadowTemplate } from '../element/index';
import type { ATCBInputConfig, ATCBConfig } from '../types';

// prepare data when not using the web component, but some custom trigger instead
async function atcb_action(inputData: ATCBInputConfig, triggerElement?: HTMLElement, keyboardTrigger = false): Promise<string> {
  const sinkMode = (inputData as { [key: string]: unknown }).sink === true;
  // return if not within a browser environment
  if (!isBrowser() && !sinkMode) {
    return undefined as unknown as string;
  }
  // get data
  let data: ATCBConfig;
  try {
    data = await (async function () {
      const cleanedInput = secure_content(inputData) as ATCBInputConfig & { proOverride?: boolean };
      const internalInput = cleanedInput as unknown as ATCBConfig;
      // pull data from PRO server, if key is given
      if (cleanedInput.prokey && cleanedInput.prokey !== '') {
        internalInput.proKey = cleanedInput.prokey;
      }
      if (internalInput.proKey && internalInput.proKey !== '') {
        try {
          const proData = await get_pro_data(internalInput.proKey, undefined, internalInput);
          return proData;
        } catch (e) {
          throw new Error((e as { message?: string }).message);
        }
      } else {
        return internalInput;
      }
    })();
  } catch (e) {
    console.error(e);
    return undefined as unknown as string;
  }
  // decorate & validate data
  data.debug = (data.debug as unknown as string) === 'true';
  try {
    await check_required(data);
  } catch (e) {
    if (data.debug) {
      console.error(e);
    }
    throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
  }
  data = await decorate_data(data);
  // translations are needed synchronously at render time - load the pack first
  await ensure_locale(data);
  if (sinkMode) {
    await validate(data);
    if (!data.options || data.options.length !== 1) {
      throw new Error('Add to Calendar Button generation failed: exactly one option required');
    }
    if (data.options[0] === 'apple' || data.options[0] === 'ical') {
      if (data.dates!.length > 1 && !can_group_ics(data)) {
        throw new Error('Add to Calendar Button generation failed: option does not resolve to a single value');
      }
      const subEvent = data.dates!.length === 1 ? 0 : 'all';
      const action = generate_ical(null, data, data.options[0], subEvent, false, true) as ATCBIcsAction | undefined;
      if (!action) throw new Error('Add to Calendar Button generation failed: option does not resolve to a single value');
      return action.content || action.href;
    }
    resultChannel.open();
    try {
      await generate_links(null as unknown as ShadowRoot, data.options[0]!, data, 'all', false, false, true);
    } catch (e) {
      resultChannel.close();
      throw e instanceof Error ? e : new Error(String(e));
    }
    const value = resultChannel.close();
    if (!value) {
      throw new Error('Add to Calendar Button generation failed: option does not resolve to a single value');
    }
    return value;
  }
  let root: HTMLElement = document.body;
  // we always force the click trigger in the custom case
  data.trigger = 'click';
  if (triggerElement) {
    root = triggerElement;
    // overriding the identifier with the id of the triggering element
    if (triggerElement.id && triggerElement.id !== '') {
      data.identifier = triggerElement.id;
    } else {
      // however, if the trigger has no id, we set it with the identifier or a default fallback
      if (data.identifier && data.identifier != '' && /^[\w-]+$/.test(data.identifier)) {
        data.identifier = 'atcb-btn-' + data.identifier;
      } else {
        data.identifier = 'atcb-btn-custom';
      }
      triggerElement.id = data.identifier;
    }
    // for custom triggers, we block any dropdown, since this would look shit 99% of the time. Overlay is a little better, but modal would be recommended
    if (data.listStyle === 'dropdown' || data.listStyle === 'dropdown-static' || data.listStyle === 'dropup-static') {
      data.listStyle = 'modal';
    }
  } else {
    data.identifier = 'atcb-btn-custom';
    // if no button is defined, fallback to listStyle "modal" in any case
    data.listStyle = 'modal';
  }
  try {
    await validate(data);
  } catch (e) {
    console.error(e);
    return false as unknown as string;
  }
  // determine whether we are looking for the 1-option case (also with buttonsList)
  const oneOption = (function () {
    if (data.options!.length === 1) {
      return true;
    }
    return false;
  })();
  // to clean-up the stage, we first close anything left open
  const potentialExistingHost = document.getElementById('atcb-customTrigger-' + data.identifier + '-host');
  if (potentialExistingHost) {
    revoke_ics_blob_urls(data.identifier);
    close(potentialExistingHost.shadowRoot!, false);
    // unset whatever possible for customTriggers
    if (getButtonInstance(getActiveButton())) {
      deleteButtonInstance(getActiveButton());
    }
    potentialExistingHost.remove();
  }
  // log event
  log_event('initialization', data.identifier!, data.identifier!);
  // we would only render something, if interaction is not blocked and button not hidden
  if (!data.blockInteraction && !data.hidden) {
    // prepare shadow dom and load style
    const host = document.createElement('div');
    // if config includes cspnonce, we add it to the host
    if (data.cspnonce && data.cspnonce !== '') {
      host.setAttribute('cspnonce', data.cspnonce);
    }
    host.id = 'atcb-customTrigger-' + data.identifier + '-host';
    if (root === document.body) {
      document.body.append(host);
    } else {
      root.after(host);
    }
    if (triggerElement) {
      const btnDim = triggerElement.getBoundingClientRect();
      host.style.position = 'relative';
      host.style.left = -btnDim.width + 'px';
      host.style.top = btnDim.height + 'px';
    }
    host.setAttribute('atcb-button-id', data.identifier);
    host.attachShadow({ mode: 'open', delegatesFocus: true });
    const elem = document.createElement('template');
    elem.innerHTML = shadowTemplate;
    host.shadowRoot!.append(elem.content.cloneNode(true));
    const rootObj = host.shadowRoot!.querySelector('.atcb-initialized') as HTMLElement;
    setup_state_management(data);
    set_light_mode(host.shadowRoot!, data);
    (host.shadowRoot!.querySelector('.atcb-initialized') as HTMLElement).setAttribute('lang', data.language!);
    await load_css(host.shadowRoot!, rootObj, data);
    // set global event listeners
    set_global_event_listener(host.shadowRoot!, data);
    // if all is fine, ...
    // ... trigger RSVP form, or ...
    if (typeof generate_rsvp_form === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
      generate_rsvp_form(host.shadowRoot!, data, triggerElement!, keyboardTrigger);
    } else {
      // ... trigger link at the oneOption case, or ...
      if (oneOption) {
        const option = data.options![0]!;
        const isDynamicIcs = (option === 'apple' || option === 'ical') && static_ics_file(host.shadowRoot!, data, data.dates!.length === 1 ? 0 : 'all') === '';
        if (isDynamicIcs && (isIOS() || data.fakeIOS)) {
          const subEvents: (string | number)[] = [option];
          if (data.dates!.length === 1 || can_group_ics(data)) {
            subEvents.push(data.dates!.length === 1 ? 1 : 'all');
          } else {
            for (let i = 0; i < data.dates!.length; i++) subEvents.push(i + 1);
          }
          await create_modal(host.shadowRoot!, data, option, '', '', [], subEvents, keyboardTrigger);
        } else {
          await generate_links(host.shadowRoot!, option, data, 'all', keyboardTrigger);
          log_event('openSingletonLink', data.identifier!, data.identifier!);
        }
      } else {
        // ... open the options list
        toggle(host.shadowRoot!, 'open', data, triggerElement ?? null, keyboardTrigger);
      }
    }
  }
  init_log(data.proKey, data.hideBranding, data.debug);
  if (data.debug) {
    console.log('Add to Calendar Button "' + data.identifier + '" triggered');
  }
  return data.identifier as string;
}

export { atcb_action };
