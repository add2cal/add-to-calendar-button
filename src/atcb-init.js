/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.0.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbVersion, isBrowser, atcbStates, atcbWcParams, atcbWcBooleanParams, atcbWcObjectParams, atcbWcArrayParams, atcbCssTemplate } from './atcb-globals.js';
import { atcb_decorate_data } from './atcb-decorate.js';
import { atcb_check_required, atcb_validate } from './atcb-validate.js';
import { atcb_generate_button, atcb_generate_rich_data } from './atcb-generate.js';
import { atcb_close, atcb_toggle } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links';
import {
  atcb_secure_content,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_throttle,
} from './atcb-util.js';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;
const lightModeMutationObserver = [];
let template;

if (isBrowser()) {
  template = document.createElement('template');
  template.innerHTML = `<div class="atcb-initialized" style="display:none;position:relative;max-width:max-content;"></div>`;

  class AddToCalendarButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegateFocus: true });
      this.shadowRoot.append(template.content.cloneNode(true));
      this.initialized = false;
      this.data = {};
      this.error = false;
      atcbBtnCount = atcbBtnCount + 1;
    }

    connectedCallback() {
      // initial data fetch
      this.debug = this.hasAttribute('debug');
      // checking for PRO key and pull data if given
      if (this.getAttribute('proKey') != null && this.getAttribute('proKey') != '') {
        this.data = atcb_get_pro_data(this.getAttribute('proKey'));
      }
      if (this.data.name == null || this.data.name == '') {
        // if no data yet, we try reading attributes or the innerHTML of the host element
        try {
          this.data = atcb_read_attributes(this);
        } catch (e) {
          if (this.debug) {
            atcb_render_debug_msg(this.shadowRoot, e);
            console.error(e);
            return;
          }
        }
        this.data.proKey = '';
      }
      // set identifier first, no matter further validation
      if (this.data.identifier != null && this.data.identifier != '') {
        if (!/^[\w-]+$/.test(this.data.identifier)) {
          this.data.identifier = '';
          console.warn('Add to Calendar Button generation: identifier invalid - using auto numbers instead');
        } else {
          this.data.identifier = 'atcb-btn-' + this.data.identifier;
        }
      }
      if (this.data.identifier == null || this.data.identifier == '') {
        this.data.identifier = 'atcb-btn-' + atcbBtnCount;
      }
      // we are copying the value to presever it over re-building the data object
      this.identifier = this.data.identifier;
      this.setAttribute('atcb-button-id', this.data.identifier);
      this.initialized = true;
      try {
        atcb_build_button(this.shadowRoot, this.data, this.debug);
      } catch (e) {
        if (this.debug) {
          atcb_render_debug_msg(this.shadowRoot, e);
          console.error(e);
          return;
        }
      }
    }

    disconnectedCallback() {
      atcb_cleanup(this.shadowRoot, this.data);
      console.log('Add to Calendar Button "' + this.data.identifier + '" destroyed');
    }

    static get observedAttributes() {
      const observeAdditionally = ['instance'];
      return atcbWcParams
        .map((element) => {
          return element.toLowerCase();
        })
        .concat(observeAdditionally);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      // updating whenever attributes update
      // but not if we are loading external data (which may not change dynamically)
      if (this.data.proKey != null && this.data.proKey != '') {
        return;
      }
      // also return, if this is the first initialization
      if (!this.initialized) {
        return;
      }
      // in all other cases, destroy and rebuild the button
      // mind that this only observes the actual attributes, not the innerHTML of the host (one would need to alter the instance attribute for that case)!
      console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
      atcb_cleanup(this.shadowRoot, this.data);
      this.data = {};
      this.shadowRoot.querySelector('.atcb-initialized').remove();
      this.shadowRoot.append(template.content.cloneNode(true));
      this.shadowRoot.querySelector('style').remove();
      try {
        this.data = atcb_read_attributes(this);
      } catch (e) {
        if (this.debug) {
          atcb_render_debug_msg(this.shadowRoot, e);
          console.error(e);
          return;
        }
      }
      this.data.identifier = this.identifier;
      try {
        atcb_build_button(this.shadowRoot, this.data, this.debug);
      } catch (e) {
        if (this.debug) {
          atcb_render_debug_msg(this.shadowRoot, e);
          console.error(e);
          return;
        }
      }
    }
  }

  if (!customElements.get('add-to-calendar-button')) {
    customElements.define('add-to-calendar-button', AddToCalendarButton);
  }
}

// read data attributes
function atcb_read_attributes(el) {
  let data = {};
  //data['hideBranding'] = true;
  for (let i = 0; i < atcbWcParams.length; i++) {
    // reading data, but removing real code line breaks before parsing.
    // use <br> or \n explicitely in the description to create a line break.
    let attr = atcbWcParams[`${i}`];
    if (el.hasAttribute(`${attr}`)) {
      let inputVal = atcb_secure_content(el.getAttribute(`${attr}`).replace(/(\r\n|\n|\r)/g, ''), false);
      let val;
      if (atcbWcBooleanParams.includes(attr)) {
        // if a boolean param has no value, it is handles as prop and set true
        if (inputVal == '') {
          val = true;
        } else {
          // otherwise, we parse the text
          val = inputVal === 'true';
        }
      } else if (atcbWcObjectParams.includes(attr)) {
        val = JSON.parse(inputVal);
      } else if (atcbWcArrayParams.includes(attr)) {
        const cleanedInput = (function () {
          if (inputVal.includes('"') || inputVal.includes("'")) {
            if (inputVal.includes('[')) {
              return inputVal.substring(2, inputVal.length - 2).replace(/\s/g, '');
            }
            return inputVal.substring(1, inputVal.length - 1).replace(/\s/g, '');
          } else {
            return inputVal.replace(/\s/g, '');
          }
        })();
        if (cleanedInput.includes("','")) {
          val = cleanedInput.split("','");
        } else {
          val = cleanedInput.split('","');
        }
      } else {
        val = inputVal;
      }
      data[`${attr}`] = val;
    }
    // getting identifier separartely
    const identifierAttr = el.getAttribute('identifier');
    if (identifierAttr != null && identifierAttr != '') {
      data['identifier'] = atcb_secure_content(identifierAttr.replace(/(\r\n|\n|\r)/g, ''), false);
    }
  }
  // if we receive no data that way, we try to get a potential JSON from the innerHTML
  if (!atcb_check_required(data, false)) {
    const slotInput = el.innerHTML;
    const atcbJsonInput = (function () {
      if (slotInput != '') {
        try {
          return JSON.parse(atcb_secure_content(slotInput.replace(/(\r\n|\n|\r)/g, ''), false));
        } catch (e) {
          throw new Error(
            'Add to Calendar Button generation failed: JSON content provided, but badly formatted (in doubt, try some tool like https://jsonformatter.org/ to validate).\r\nError message: ' +
              e
          );
        }
      }
      return '';
    })();
    // abort on missing input data
    if (atcbJsonInput.length == 0) {
      throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
    }
    data = atcbJsonInput;
  }
  return data;
}

// build the button
function atcb_build_button(host, data, debug = false) {
  // check, if all required data is available
  if (atcb_check_required(data)) {
    // Rewrite dynamic dates, standardize line breaks and transform urls in the description
    data = atcb_decorate_data(data);
    if (atcb_validate(data)) {
      const rootObj = host.querySelector('.atcb-initialized');
      // ... and on success, load css and generate the button
      atcb_set_light_mode(host, data);
      atcb_load_css(host, rootObj, data.buttonStyle, data.inline, data.customCss);
      atcb_setup_state_management(data);
      // set global event listeners
      atcb_set_global_event_listener(host, data);
      atcb_init_log();
      // generate the actual button
      atcb_generate_button(host, rootObj, data);
      // create schema.org data (https://schema.org/Event), if possible; and add it to the regular DOM
      if (!data.hideRichData && data.name && data.dates[0].location && data.dates[0].startDate) {
        atcb_generate_rich_data(data, host.host);
        data.schemaEl = host.host.previousSibling;
      }
    } else if (debug) {
      // in this case, since we do not throw any hard error, if validation fails, we need to trigger the debug message here
      atcb_render_debug_msg(host, 'Add to Calendar Button generation failed: invalid data; see console logs for details');
    }
  }
}

// destroy the button
function atcb_cleanup(host, data) {
  // cleaning up a little bit
  atcb_close(host);
  atcb_unset_global_event_listener(data.identifier);
  if (data.schemaEl != null) {
    data.schemaEl.remove();
  }
  delete atcbStates[`${data.identifier}`];
}

// set light mode
function atcb_set_light_mode(shadowRoot, data) {
  shadowRoot.host.classList.remove('atcb-dark', 'atcb-light', 'atcb-bodyScheme');
  let hostLightMode = data.lightMode;
  // Safari + Firefox combat hack
  // could be removed as soon as those browsers support the :host-context selector
  if (hostLightMode == 'bodyScheme' && (document.body.classList.contains('atcb-dark') || document.documentElement.classList.contains('atcb-dark'))) {
    hostLightMode = 'dark';
  } else {
    hostLightMode = 'light';
  }
  // apply
  shadowRoot.host.classList.add('atcb-' + hostLightMode);
}

// load the right css
function atcb_load_css(host, rootObj, style = '', inline = false, customCss = '') {
  // add global no-scroll style
  if (!document.getElementById('atcb-global-style')) {
    const cssGlobalContent = document.createElement('style');
    cssGlobalContent.id = 'atcb-global-style';
    cssGlobalContent.innerText = '.atcb-modal-no-scroll { overflow-y: hidden; }';
    document.head.append(cssGlobalContent);
  }
  // we load custom styles dynamically
  if (customCss != '' && style == 'custom') {
    // first, create placeholder
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'width: 150px; height: 40px; border-radius: 13px; background-color: #777; opacity: .3;';
    host.prepend(placeholder);
    // second, load the actual css
    const cssUrl = customCss;
    const cssFile = document.createElement('link');
    cssFile.setAttribute('rel', 'stylesheet');
    cssFile.setAttribute('type', 'text/css');
    cssFile.setAttribute('href', cssUrl);
    host.prepend(cssFile);
    // third, remove placeholder and render object as soon as loaded
    if (rootObj != null) {
      cssFile.onload = function () {
        placeholder.remove();
        if (inline) {
          rootObj.style.display = 'inline-block';
        } else {
          rootObj.style.display = 'block';
        }
      };
    }
    return;
  }
  // otherwise, we load it from a variable
  if (style != 'none' && atcbCssTemplate[`${style}`] != null) {
    const cssContent = document.createElement('style');
    cssContent.innerText = atcbCssTemplate[`${style}`];
    host.prepend(cssContent);
  }
  if (rootObj != null) {
    if (inline) {
      rootObj.style.display = 'inline-block';
    } else {
      rootObj.style.display = 'block';
    }
  }
}

function atcb_render_debug_msg(host, error) {
  const errorBanner = document.createElement('div');
  errorBanner.style.cssText = 'color: #bf2e2e; font-size: 12px; font-weight: bold; padding: 12px 15px; border: 2px solid #bf2e2e; max-width: 180px; border-radius: 13px;';
  errorBanner.textContent = error;
  host.append(errorBanner);
}

// prepare data when not using the web component, but some custom trigger instead
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = false) {
  data = atcb_secure_content(data);
  // pull data from PRO server, if key is given
  if (data.proKey != null && data.proKey != '') {
    data = atcb_get_pro_data(data.proKey);
  }
  // decorate & validate data
  if (!atcb_check_required(data)) {
    throw new Error('Add to Calendar Button generation failed: required data missing; see console logs');
  }
  data = atcb_decorate_data(data);
  let root = document.body;
  if (triggerElement) {
    root = triggerElement;
    // overriding the identifier with the id of the triggering element
    if (triggerElement.id != null && triggerElement.id != '') {
      data.identifier = triggerElement.id;
    } else {
      // however, if the trigger has no id, we set it with the identifier or a default fallback
      if (data.identifier != null && data.identifier != '') {
        if (!/^[\w-]+$/.test(data.identifier)) {
          data.identifier = 'atcb-btn-custom';
        } else {
          this.data.identifier = 'atcb-btn-' + this.data.identifier;
        }
      }
      triggerElement.id = data.identifier;
    }
    // for custom triggers, we block any dropdown, since this would look shit 99% of the time
    if (data.listStyle == 'dropdown') {
      data.listStyle = 'overlay';
    }
  } else {
    data.identifier = 'atcb-btn-custom';
    // if no button is defined, fallback to listStyle "modal" and "click" trigger
    data.listStyle = 'modal';
    data.trigger = 'click';
  }
  if (!atcb_validate(data)) {
    throw new Error(
      'Add to Calendar Button generation (' + data.identifier + ') failed: invalid data; see console logs'
    );
  }
  // determine whether we are looking for the 1-option case (also with buttonsList)
  const oneOption = (function () {
    if (data.options.length === 1) {
      return true;
    }
    return false;
  })();
  // to clean-up the stage, we first close anything left open
  const potentialExistingHost = document.getElementById('atcb-customTrigger-' + data.identifier + '-host');
  if (potentialExistingHost) {
    atcb_close(potentialExistingHost.shadowRoot, false);
  }
  // prepare shadow dom and load style
  let host = document.createElement('div');
  host.id = 'atcb-customTrigger-' + data.identifier + '-host';
  if (root == document.body) {
    document.body.append(host);
  } else {
    root.after(host);
  }
  host.setAttribute('atcb-button-id', data.identifier);
  host.attachShadow({ mode: 'open', delegateFocus: true });
  host.shadowRoot.append(template.content.cloneNode(true));
  const rootObj = host.shadowRoot.querySelector('.atcb-initialized');
  atcb_setup_state_management(data);
  atcb_set_light_mode(host.shadowRoot, data);
  atcb_load_css(host.shadowRoot, rootObj, data.buttonStyle, data.inline, data.customCss);
  // set global event listeners
  atcb_set_global_event_listener(host.shadowRoot, data);
  // if all is fine, ...
  // trigger link at in oneoption case, or ...
  if (oneOption) {
    atcbStates['active'] = data.identifier;
    document.body.classList.add('atcb-customTrigger-active');
    atcb_generate_links(host.shadowRoot, data.options[0], data, 'all', keyboardTrigger);
  } else {
    // open the options list
    document.body.classList.add('atcb-customTrigger-active');
    atcb_toggle(host.shadowRoot, 'open', data, triggerElement, keyboardTrigger);
  }
  atcb_init_log();
  console.log('Add to Calendar Button "' + data.identifier + '" triggered');
  return data.identifier;
}

// update global state management
function atcb_setup_state_management(data) {
  const singleDates = [];
  for (let i = 0; i < data.options.length; i++) {
    singleDates[data.options[`${i}`]] = [];
    for (let id = 1; id <= data.dates.length; id++) {
      singleDates[data.options[`${i}`]].push(0);
    }
  }
  atcbStates[data.identifier] = singleDates;
}

// SHARED FUNCTION TO GENERATE THE INIT LOG MESSAGE
function atcb_init_log() {
  if (!atcbInitialGlobalInit) {
    console.log('Add to Calendar Button Script initialized (version ' + atcbVersion + ')');
    console.log('See https://github.com/add2cal/add-to-calendar-button for details');
    atcbInitialGlobalInit = true;
  }
}

// PULLING PRO DATA
function atcb_get_pro_data(licenseKey) {
  const data = {};
  if (licenseKey != null && licenseKey != '') {
    data.proKey = licenseKey;
    // TODO: Pull data from server
    console.error('Add to Calendar Button proKey invalid! Falling back to local data...');
  }
  return data;
}

// GLOBAL KEYBOARD AND DEVICE LISTENERS
function atcb_set_global_event_listener(host, data) {
  // return, if we are not in a browser
  if (!isBrowser()) {
    return;
  }
  // temporary listener to any class change at the body for the light mode Safari/Firefox hack
  if (data.lightMode == 'bodyScheme') {
    lightModeMutationObserver[data.identifier] = new MutationObserver(function (mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          atcb_set_light_mode(host, data);
        }
      });
    });
    lightModeMutationObserver[data.identifier].observe(document.body, { attributes: true });
  }
  if (!atcbInitialGlobalInit) {
    // global listener for ESC key to close dropdown
    document.addEventListener('keyup', atcb_global_listener_keyup);
    // global listener for arrow key optionlist navigation
    document.addEventListener('keydown', atcb_global_listener_keydown);
    // Global listener for any screen changes
    window.addEventListener('resize', atcb_global_listener_resize);
  }
}

function atcb_global_listener_keyup(event) {
  const root = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]');
  const host = (function () {
    if (root != null) {
      return root.shadowRoot;
    }
    return null;
  })();
  if (host != null && event.key === 'Escape') {
    atcb_toggle(host, 'close', '', '', true);
  }
}

function atcb_global_listener_keydown(event) {
  const root = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]');
  const host = (function () {
    if (root != null) {
      return root.shadowRoot;
    }
    return null;
  })();
  if (
    host != null &&
    host.querySelector('.atcb-list') &&
    (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')
  ) {
    let targetFocus = 0;
    let currFocusOption = host.activeElement;
    const optionListCount = host.querySelectorAll('.atcb-list-item').length;
    if (currFocusOption != null && currFocusOption.classList.contains('atcb-list-item')) {
      if (event.key === 'ArrowDown' && currFocusOption.dataset.optionNumber < optionListCount) {
        event.preventDefault();
        targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
      } else if (event.key === 'ArrowUp' && currFocusOption.dataset.optionNumber >= 1) {
        event.preventDefault();
        targetFocus = parseInt(currFocusOption.dataset.optionNumber) - 1;
      }
      if (targetFocus > 0) {
        host.querySelector('.atcb-list-item[data-option-number="' + targetFocus + '"]').focus();
      }
    } else {
      event.preventDefault();
      switch (event.key) {
        default:
          host.querySelector('.atcb-list-item[data-option-number="1"]').focus();
          break;
        case 'ArrowUp':
          host.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]').focus();
          break;
      }
    }
  }
}

function atcb_global_listener_resize() {
  const root = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]');
  const host = (function () {
    if (root != null) {
      return root.shadowRoot;
    }
    return null;
  })();
  if (host != null) {
    atcb_throttle(() => {
      const activeOverlay = host.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
        atcb_manage_body_scroll(host);
      }
    });
  }
}

function atcb_unset_global_event_listener(identifier) {
  if (typeof lightModeMutationObserver[`${identifier}`] !== 'undefined') {
    lightModeMutationObserver[`${identifier}`].disconnect();
  }
}

export { atcb_unset_global_event_listener };
