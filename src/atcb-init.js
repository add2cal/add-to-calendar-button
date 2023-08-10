/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.3.2
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbVersion, isBrowser, atcbStates, atcbWcParams, atcbWcBooleanParams, atcbWcObjectParams, atcbWcObjectArrayParams, atcbWcArrayParams, atcbCssTemplate, isMobile } from './atcb-globals.js';
import { atcb_decorate_data } from './atcb-decorate.js';
import { atcb_check_required, atcb_validate } from './atcb-validate.js';
import { atcb_generate_button } from './atcb-generate.js';
import { atcb_generate_rich_data } from './atcb-generate-rich-data.js';
import { atcb_close, atcb_toggle } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links';
import { atcb_secure_content, atcb_manage_body_scroll, atcb_set_fullsize } from './atcb-util.js';
import { atcb_log_event } from './atcb-event';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;
const lightModeMutationObserver = [];

const template = `<div class="atcb-initialized" style="display:none;position:relative;width:fit-content;"></div>`;

// we cannot load the custom element server-side - therefore, we check for a browser environment first
if (isBrowser()) {
  class AddToCalendarButton extends HTMLElement {
    constructor() {
      super();
      const elem = document.createElement('template');
      elem.innerHTML = template;
      this.attachShadow({ mode: 'open', delegateFocus: true });
      this.shadowRoot.append(elem.content.cloneNode(true));
      this.loaded = false;
      this.initialized = false;
      this.data = {};
      this.error = false;
    }

    async connectedCallback() {
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
          this.loaded = true;
        } catch (e) {
          if (this.debug) {
            atcb_render_debug_msg(this.shadowRoot, e);
          }
          this.loaded = true;
          return;
        }
        this.data.proKey = '';
      }
      this.initButton();
    }

    disconnectedCallback() {
      atcb_cleanup(this.shadowRoot, this.data);
      if (this.debug) {
        console.log('Add to Calendar Button "' + this.data.identifier + '" destroyed');
      }
      // reset the count, if all buttons got destroyed
      if (document.querySelectorAll('add-to-calendar-button').length == 0) {
        atcbBtnCount = 0;
      }
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
      // also return, if this is the very first run
      if (!this.loaded) {
        return;
      }
      // in all other cases, destroy and rebuild the button
      // mind that this only observes the actual attributes, not the innerHTML of the host (one would need to alter the instance attribute for that case)!
      if (this.debug && this.initialized) {
        // we only mention this, if it has been initialized (with Angular, e.g., a bound variable will get infused after the initial loading)
        console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
      }
      atcb_cleanup(this.shadowRoot, this.data);
      this.data = {};
      this.shadowRoot.querySelector('.atcb-initialized').remove();
      const elem = document.createElement('template');
      elem.innerHTML = template;
      this.shadowRoot.append(elem.content.cloneNode(true));
      try {
        this.data = atcb_read_attributes(this);
      } catch (e) {
        if (this.debug) {
          atcb_render_debug_msg(this.shadowRoot, e);
        }
        return;
      }
      this.initButton();
    }

    initButton() {
      if (!this.initialized) {
        this.initialized = true;
        atcbBtnCount = atcbBtnCount + 1;
      }
      // set identifier first, no matter further validation
      // we use a stored one if available (the case, if destroyed before)
      if (this.identifier && this.identifier != '') {
        this.data.identifier = this.identifier;
      } else {
        // and create one in all other cases
        if (this.data.identifier && this.data.identifier != '') {
          if (!/^[\w\-_]+$/.test(this.data.identifier)) {
            this.data.identifier = '';
            if (this.debug) {
              console.warn('Add to Calendar Button generation: identifier invalid - using auto numbers instead');
            }
          } else {
            this.data.identifier = 'atcb-btn-' + this.data.identifier;
          }
        }
        if (this.data.identifier == null || this.data.identifier == '') {
          this.data.identifier = 'atcb-btn-' + atcbBtnCount;
        }
        // we are copying the value to presever it over re-building the data object
        this.identifier = this.data.identifier;
      }
      this.setAttribute('atcb-button-id', this.data.identifier);
      // build the button
      try {
        this.style.visibility = 'visible';
        this.style.opacity = '1';
        this.style.position = 'relative';
        atcb_build_button(this.shadowRoot, this.data, this.debug);
      } catch (e) {
        if (this.debug) {
          atcb_render_debug_msg(this.shadowRoot, e);
        }
        return;
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
  data['hideBranding'] = true;
  for (let i = 0; i < atcbWcParams.length; i++) {
    // reading data, but removing real code line breaks before parsing.
    // use [br] in the description to create a line break.
    let attr = atcbWcParams[`${i}`];
    if (el.hasAttribute(`${attr}`)) {
      let inputVal = atcb_secure_content(el.getAttribute(`${attr}`).replace(/(\\r\\n|\\n|\\r)/g, ''), false);
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
      } else if (atcbWcObjectArrayParams.includes(attr)) {
        const cleanedInput = (function () {
          if (inputVal.substring(0, 1) != '[') {
            return '[' + inputVal + ']';
          }
          return inputVal;
        })();
        val = JSON.parse(cleanedInput);
      } else if (atcbWcArrayParams.includes(attr)) {
        const cleanedInput = (function () {
          let newVal = inputVal;
          if (inputVal.includes('"') || inputVal.includes("'")) {
            if (inputVal.includes('[')) {
              newVal = inputVal.substring(2, inputVal.length - 2);
            } else {
              newVal = inputVal.substring(1, inputVal.length - 1);
            }
          }
          if (!inputVal.includes('|')) {
            newVal = newVal.replace(/\s/g, '');
          }
          return newVal;
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
      data['identifier'] = atcb_secure_content(identifierAttr.replace(/(\\r\\n|\\n|\\r)/g, ''), false);
    }
  }
  // if we receive no or not enough data that way, we try to get a potential JSON from the innerHTML
  if (!atcb_check_required(data)) {
    const slotInput = el.innerHTML;
    const atcbJsonInput = (function () {
      if (slotInput != '') {
        try {
          return JSON.parse(atcb_secure_content(slotInput.replace(/(\\r\\n|\\n|\\r)/g, ''), false));
        } catch (e) {
          throw new Error('Add to Calendar Button generation failed: JSON content provided, but badly formatted (in doubt, try some tool like https://jsonformatter.org/ to validate).\r\nError message: ' + e);
        }
      }
      return '';
    })();
    // abort on missing input data
    if (atcbJsonInput.length == 0) {
      console.error(data.validationError);
      throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
    }
    data = atcbJsonInput;
  }
  return data;
}

// build the button
function atcb_build_button(host, data, debug = false) {
  // Rewrite dynamic dates, standardize line breaks and transform urls in the description
  data = atcb_decorate_data(data);
  if (atcb_validate(data)) {
    const rootObj = host.querySelector('.atcb-initialized');
    // ... and on success, load css and generate the button
    atcb_set_light_mode(host, data);
    rootObj.setAttribute('lang', data.language);
    atcb_load_css(host, rootObj, data.buttonStyle, data.inline, data.buttonsList, data.customCss);
    atcb_setup_state_management(data);
    // set global event listeners
    atcb_set_global_event_listener(host, data);
    atcb_init_log(data.proKey, debug);
    // generate RSVP form (if not hidden)
    // generate the actual button (if not hidden)
    if (!data.hidden) {
      atcb_generate_button(host, rootObj, data, debug);
      // create schema.org data (https://schema.org/Event), if possible; and add it to the regular DOM
      if (!data.hideRichData && data.name && data.dates[0].location && data.dates[0].startDate) {
        atcb_generate_rich_data(data, host.host);
        data.schemaEl = host.host.previousSibling;
      }
    }
    // log event
    atcb_log_event('initialization', data.identifier, data.identifier);
  } else if (debug) {
    console.error(data.validationError);
    throw new Error(data.validationError);
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
  Array.from(host.querySelectorAll('.atcb-debug-error-msg'))
    .concat(Array.from(host.querySelectorAll('style')))
    .concat(Array.from(host.querySelectorAll('.atcb-button-wrapper')))
    .forEach((el) => el.remove());
  delete atcbStates[`${data.identifier}`];
}

// set light mode
function atcb_set_light_mode(shadowRoot, data) {
  // Safari + Firefox combat hack
  // could be removed (together with the global mutation observer on that) as soon as those browsers support the :host-context selector
  shadowRoot.host.classList.remove('atcb-dark', 'atcb-light', 'atcb-bodyScheme');
  const hostLightMode = (function () {
    if (data.lightMode == 'bodyScheme') {
      if (document.body.classList.contains('atcb-dark') || document.documentElement.classList.contains('atcb-dark')) {
        return 'dark';
      } else {
        return 'light';
      }
    }
    return data.lightMode;
  })();
  shadowRoot.host.classList.add('atcb-' + hostLightMode);
}

// load the right css
function atcb_load_css(host, rootObj = null, style = '', inline = false, buttonsList = false, customCss = '') {
  // add global no-scroll style
  if (!document.getElementById('atcb-global-style')) {
    const cssGlobalContent = document.createElement('style');
    cssGlobalContent.id = 'atcb-global-style';
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    cssGlobalContent.innerText = '.atcb-modal-no-scroll { overflow-y: hidden !important; -webkit-overflow-scrolling: touch; } body.atcb-modal-no-scroll { padding-right: ' + scrollBarWidth + 'px; }';
    document.head.append(cssGlobalContent);
  }
  // we load custom styles dynamically
  if (customCss != '' && style == 'custom') {
    const cssFile = document.createElement('link');
    cssFile.setAttribute('rel', 'stylesheet');
    cssFile.setAttribute('type', 'text/css');
    cssFile.setAttribute('href', customCss);
    // if we have no rootObject, we are loading a modal in a new shadowDOM, which can and should be blocking.
    if (rootObj == null) {
      // first, hide the content
      host.host.style.display = 'none';
      // second, load the actual css (and re-show the content as soon as it is loaded)
      loadExternalCssAsynch(cssFile, host, host.host);
    } else {
      // else, it should be rather non-blocking.
      // first, create a button placeholder
      const placeholder = document.createElement('div');
      placeholder.style.cssText = 'width: 150px; height: 40px; border-radius: 200px; background-color: #777; opacity: .3;';
      host.prepend(placeholder);
      // second, load the actual css (and remove the placeholder as soon as it is loaded)
      loadExternalCssAsynch(cssFile, host, rootObj, placeholder, inline, buttonsList);
    }
    return;
  }
  // otherwise, we load it from a variable
  if (style != 'none' && atcbCssTemplate[`${style}`] != null) {
    const cssContent = document.createElement('style');
    // get custom override information
    const overrideDefaultCss = (function () {
      if (host.host.hasAttribute('styleLight')) {
        const output = ':host { ' + atcb_secure_content(host.host.getAttribute('styleLight').replace(/(\\r\\n|\\n|\\r)/g, ''), false) + ' }';
        return output;
      }
      return '';
    })();
    const overrideDarkCss = (function () {
      if (host.host.hasAttribute('styleDark')) {
        const output = ':host(.atcb-dark), :host-context(html.atcb-dark):host(.atcb-bodyScheme), :host-context(body.atcb-dark):host(.atcb-bodyScheme) { ' + atcb_secure_content(host.host.getAttribute('styleDark').replace(/(\\r\\n|\\n|\\r)/g, ''), false) + ' }';
        return output;
      }
      return '';
    })();
    // add style to element
    cssContent.innerText = atcbCssTemplate[`${style}`] + overrideDefaultCss + overrideDarkCss;
    host.prepend(cssContent);
  }
  if (rootObj != null) {
    if (inline) {
      rootObj.style.display = 'inline-block';
    } else {
      if (buttonsList) {
        rootObj.style.display = 'flex';
        rootObj.style.flexWrap = 'wrap';
        rootObj.style.justifyContent = 'center';
      } else {
        rootObj.style.display = 'block';
      }
    }
  }
}

async function loadExternalCssAsynch(cssFile, host, rootObj, placeholder = null, inline = false, buttonsList = false) {
  host.prepend(cssFile);
  // remove placeholder and render object as soon as loaded - only relevant if given
  await new Promise((resolve) => {
    cssFile.onload = resolve;
  });
  if (placeholder != null) {
    placeholder.remove();
  }
  if (inline) {
    rootObj.style.display = 'inline-block';
  } else {
    if (buttonsList) {
      rootObj.style.display = 'flex';
      rootObj.style.flexWrap = 'wrap';
      rootObj.style.justifyContent = 'center';
    } else {
      rootObj.style.display = 'block';
    }
  }
}

function atcb_render_debug_msg(host, error) {
  if (host.querySelector('.atcb-debug-error-msg')) return;
  const errorBanner = document.createElement('div');
  errorBanner.classList.add('atcb-debug-error-msg');
  errorBanner.style.cssText = 'color: #bf2e2e; font-size: 12px; font-weight: bold; padding: 12px 15px; border: 2px solid #bf2e2e; max-width: 180px; border-radius: 13px;';
  errorBanner.textContent = error;
  host.append(errorBanner);
}

// prepare data when not using the web component, but some custom trigger instead
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = false) {
  // return if not within a browser environment
  if (!isBrowser()) {
    return;
  }
  // get data
  data = atcb_secure_content(data);
  data.hideBranding = true;
  // pull data from PRO server, if key is given
  if (data.proKey != null && data.proKey != '') {
    data = atcb_get_pro_data(data.proKey);
  }
  // decorate & validate data
  data.debug = data.debug === 'true';
  if (!atcb_check_required(data)) {
    console.error(data.validationError);
    return;
  }
  data = atcb_decorate_data(data);
  let root = document.body;
  // we always force the click trigger in the custom case
  data.trigger = 'click';
  if (triggerElement) {
    root = triggerElement;
    // overriding the identifier with the id of the triggering element
    if (triggerElement.id != null && triggerElement.id != '') {
      data.identifier = triggerElement.id;
    } else {
      // however, if the trigger has no id, we set it with the identifier or a default fallback
      if (data.identifier != null && data.identifier != '' && /^[\w\-_]+$/.test(data.identifier)) {
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
  if (!atcb_validate(data)) {
    console.error(data.validationError);
    return;
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
    // unset whatever possible for customTriggers
    if (atcbStates[`${atcbStates['active']}`]) {
      delete atcbStates[`${atcbStates['active']}`];
    }
    potentialExistingHost.remove();
  }
  // log event
  atcb_log_event('initialization', data.identifier, data.identifier);
  // we would only render something, if interaction is not blocked
  if (!data.blockInteraction) {
    // prepare shadow dom and load style (not necessary if iCal or Apple, and not on mobile and not multi-date with organizer)
    let host = null;
    if (!oneOption || (data.options[0] !== 'apple' && data.options[0] !== 'ical') || (data.dates && data.dates.length > 1 && data.dates.organizer) || (isMobile())) {
      host = document.createElement('div');
      host.id = 'atcb-customTrigger-' + data.identifier + '-host';
      if (root == document.body) {
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
      host.attachShadow({ mode: 'open', delegateFocus: true });
      const elem = document.createElement('template');
      elem.innerHTML = template;
      host.shadowRoot.append(elem.content.cloneNode(true));
      const rootObj = host.shadowRoot.querySelector('.atcb-initialized');
      atcb_setup_state_management(data);
      atcb_set_light_mode(host.shadowRoot, data);
      host.shadowRoot.querySelector('.atcb-initialized').setAttribute('lang', data.language);
      atcb_load_css(host.shadowRoot, rootObj, data.buttonStyle, false, false, data.customCss);
      // set global event listeners
      atcb_set_global_event_listener(host.shadowRoot, data);
    }
    // if all is fine, ...
    // trigger link at the oneoption case, or ...
    if (oneOption) {
      atcb_generate_links(host.shadowRoot, data.options[0], data, 'all', keyboardTrigger);
      // log event
      atcb_log_event('openSingletonLink', data.identifier, data.identifier);
    } else {
      // open the options list
      atcb_toggle(host.shadowRoot, 'open', data, triggerElement, keyboardTrigger);
    }
  }
  atcb_init_log(data.proKey, data.debug);
  if (data.debug) {
    console.log('Add to Calendar Button "' + data.identifier + '" triggered');
  }
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
function atcb_init_log(pro = '', debug = false) {
  if (!atcbInitialGlobalInit) {
    const versionOutput = (function () {
      if (debug) {
        return ' (version ' + atcbVersion + ')';
      }
      return '';
    })();
    if (pro != '') {
      console.log('Add to Calendar PRO script initialized' + versionOutput + ' | https://add-to-calendar-pro.com');
    } else {
      console.log('%c\nAdd to Calendar Button script initialized' + versionOutput + '\n' + 'see https://add-to-calendar-button.com for details.\n', 'font-weight: bold;');
      //console.log('✨ %cPRO version available at https://add-to-calendar-pro.com ← check it out!', 'font-weight: bold; line-height: 60px;');
    }
    atcbInitialGlobalInit = true;
  }
}

// PULLING PRO DATA
function atcb_get_pro_data(licenseKey) {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  const data = {};
  if (licenseKey != null && licenseKey != '') {
    data.proKey = licenseKey;
    data.identifier = licenseKey;
    // TODO: Pull data from server
    console.error('Add to Calendar Button proKey invalid! Falling back to local data...');
    // data.proKey = '';
  }
  return data;
}

// GLOBAL KEYBOARD AND DEVICE LISTENERS
function atcb_set_global_event_listener(host, data) {
  // return, if we are not in a browser
  if (!isBrowser()) {
    return;
  }
  // temporary listener to any class change at the body or html for the light mode Safari/Firefox hack
  if (data.lightMode == 'bodyScheme') {
    lightModeMutationObserver[data.identifier] = new MutationObserver(function (mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          atcb_set_light_mode(host, data);
        }
      });
    });
    lightModeMutationObserver[data.identifier].observe(document.documentElement, { attributes: true });
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
  const host = (function () {
    const root = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]');
    if (root) {
      return root.shadowRoot;
    }
    return null;
  })();
  if (host && event.key === 'Escape') {
    atcb_log_event('closeList', 'Ecs Hit', atcbStates['active']);
    atcb_toggle(host, 'close', '', '', true);
  }
}

function atcb_global_listener_keydown(event) {
  const host = (function () {
    const root = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]');
    const rootModal = document.getElementById(atcbStates['active'] + '-modal-host');
    if (rootModal) {
      return rootModal.shadowRoot;
    }
    if (root) {
      return root.shadowRoot;
    }
    return null;
  })();
  if (host && host.querySelector('.atcb-list') && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')) {
    event.preventDefault();
    let targetFocus = 0;
    let currFocusOption = host.activeElement;
    const optionListCount = host.querySelectorAll('.atcb-list-item').length;
    if (currFocusOption && currFocusOption.classList.contains('atcb-list-item')) {
      if (event.key === 'ArrowDown' && currFocusOption.dataset.optionNumber < optionListCount) {
        targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
      } else if (event.key === 'Tab') {
        if (currFocusOption.dataset.optionNumber < optionListCount) {
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
        } else {
          targetFocus = 1;
        }
      } else if (event.key === 'ArrowUp' && currFocusOption.dataset.optionNumber >= 1) {
        targetFocus = parseInt(currFocusOption.dataset.optionNumber) - 1;
      }
      if (targetFocus > 0) {
        host.querySelector('.atcb-list-item[data-option-number="' + targetFocus + '"]').focus();
      }
    } else {
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
  const host = (function () {
    const root = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]');
    const rootModal = document.getElementById(atcbStates['active'] + '-modal-host');
    if (rootModal) {
      return rootModal.shadowRoot;
    }
    if (root) {
      return root.shadowRoot;
    }
    return null;
  })();
  if (host) {
    const activeOverlay = host.querySelector('#atcb-bgoverlay');
    if (activeOverlay) {
      atcb_set_fullsize(activeOverlay);
      atcb_manage_body_scroll(host);
    }
  }
}

function atcb_unset_global_event_listener(identifier) {
  if (typeof lightModeMutationObserver[`${identifier}`] !== 'undefined') {
    lightModeMutationObserver[`${identifier}`].disconnect();
  }
}

export { atcb_unset_global_event_listener, atcb_load_css, atcb_set_light_mode };
