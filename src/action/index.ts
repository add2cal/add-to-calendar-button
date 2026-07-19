/**
 * atcb_action - the imperative API for custom triggers (no web component markup needed).
 */
import { atcbIsBrowser, atcb_result_channel } from '../core/globals';
import { getActiveButton, getButtonInstance, deleteButtonInstance } from '../core/store';
import { atcb_decorate_data } from '../core/decorate';
import { atcb_check_required, atcb_validate } from '../core/validate';
import { atcb_close, atcb_toggle } from '../ui/control';
import { atcb_generate_links } from '../generators/index';
import { atcb_secure_content } from '../core/text';
import { atcb_log_event } from '../core/events';
import { atcb_generate_rsvp_form } from '../ui/pro';
import { atcb_ensure_locale } from '../i18n/index';
import { atcb_get_pro_data, atcb_init_log, atcb_setup_state_management, atcb_set_global_event_listener, atcb_load_css, atcb_set_light_mode, atcbShadowTemplate } from '../element/index';
import type { ATCBInputConfig, ATCBConfig } from '../types';

// prepare data when not using the web component, but some custom trigger instead
async function atcb_action(inputData: ATCBInputConfig, triggerElement?: HTMLElement, keyboardTrigger = false): Promise<string> {
  const sinkMode = (inputData as { [key: string]: unknown }).sink === true;
  // return if not within a browser environment
  if (!atcbIsBrowser() && !sinkMode) {
    return undefined as unknown as string;
  }
  // get data
  let data: ATCBConfig;
  try {
    data = await (async function () {
      const cleanedInput = atcb_secure_content(inputData) as ATCBInputConfig & { prokey?: string; proOverride?: boolean };
      // pull data from PRO server, if key is given
      if (cleanedInput.prokey && cleanedInput.prokey !== '') {
        cleanedInput.proKey = cleanedInput.prokey;
      }
      if (cleanedInput.proKey && cleanedInput.proKey !== '') {
        try {
          const proData = await atcb_get_pro_data(cleanedInput.proKey, undefined, cleanedInput);
          return proData;
        } catch (e) {
          throw new Error((e as { message?: string }).message);
        }
      } else {
        return cleanedInput as unknown as ATCBConfig;
      }
    })();
  } catch (e) {
    console.error(e);
    return undefined as unknown as string;
  }
  // decorate & validate data
  data.debug = (data.debug as unknown as string) === 'true';
  try {
    await atcb_check_required(data);
  } catch (e) {
    if (data.debug) {
      console.error(e);
    }
    throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
  }
  data = await atcb_decorate_data(data);
  // translations are needed synchronously at render time - load the pack first
  await atcb_ensure_locale(data);
  if (sinkMode) {
    await atcb_validate(data);
    if (!data.options || data.options.length !== 1) {
      throw new Error('Add to Calendar Button generation failed: exactly one option required');
    }
    atcb_result_channel.open();
    try {
      await atcb_generate_links(null as unknown as ShadowRoot, data.options[0]!, data, 'all', false, false, true);
    } catch (e) {
      atcb_result_channel.close();
      throw e instanceof Error ? e : new Error(String(e));
    }
    const value = atcb_result_channel.close();
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
    await atcb_validate(data);
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
    atcb_close(potentialExistingHost.shadowRoot!, false);
    // unset whatever possible for customTriggers
    if (getButtonInstance(getActiveButton())) {
      deleteButtonInstance(getActiveButton());
    }
    potentialExistingHost.remove();
  }
  // log event
  atcb_log_event('initialization', data.identifier!, data.identifier!);
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
    elem.innerHTML = atcbShadowTemplate;
    host.shadowRoot!.append(elem.content.cloneNode(true));
    const rootObj = host.shadowRoot!.querySelector('.atcb-initialized') as HTMLElement;
    atcb_setup_state_management(data);
    atcb_set_light_mode(host.shadowRoot!, data);
    (host.shadowRoot!.querySelector('.atcb-initialized') as HTMLElement).setAttribute('lang', data.language!);
    atcb_load_css(host.shadowRoot!, rootObj, data);
    // set global event listeners
    atcb_set_global_event_listener(host.shadowRoot!, data);
    // if all is fine, ...
    // ... trigger RSVP form, or ...
    if (typeof atcb_generate_rsvp_form === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
      atcb_generate_rsvp_form(host.shadowRoot!, data, triggerElement!, keyboardTrigger);
    } else {
      // ... trigger link at the oneOption case, or ...
      if (oneOption) {
        await atcb_generate_links(host.shadowRoot!, data.options![0]!, data, 'all', keyboardTrigger);
        atcb_log_event('openSingletonLink', data.identifier!, data.identifier!);
      } else {
        // ... open the options list
        atcb_toggle(host.shadowRoot!, 'open', data, triggerElement ?? null, keyboardTrigger);
      }
    }
  }
  atcb_init_log(data.proKey, data.hideBranding, data.debug);
  if (data.debug) {
    console.log('Add to Calendar Button "' + data.identifier + '" triggered');
  }
  return data.identifier as string;
}

export { atcb_action };
