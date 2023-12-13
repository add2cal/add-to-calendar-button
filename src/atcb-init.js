/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.5.0
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbVersion, atcbIsBrowser, atcbStates, atcbWcParams, atcbWcProParams, atcbWcBooleanParams, atcbWcObjectParams, atcbWcObjectArrayParams, atcbWcArrayParams, atcbWcNumberParams, atcbCssTemplate } from './atcb-globals.js';
import { atcb_decorate_data } from './atcb-decorate.js';
import { atcb_check_required, atcb_validate } from './atcb-validate.js';
import { atcb_generate_button } from './atcb-generate.js';
import { atcb_generate_rich_data } from './atcb-generate-rich-data.js';
import { atcb_close, atcb_toggle } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links.js';
import { atcb_secure_content, atcb_manage_body_scroll, atcb_set_fullsize } from './atcb-util.js';
import { atcb_log_event } from './atcb-event.js';
import { atcb_generate_rsvp } from './atcb-generate-pro.js';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;
const lightModeMutationObserver = [];

const template = `<div class="atcb-initialized atcb-hidden"></div>`;

// we cannot load the custom element server-side - therefore, we check for a browser environment first
if (atcbIsBrowser()) {
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
      // first getting debug attr and saving it here - this is somehow independet of its copy at the data object
      const debugVal = this.getAttribute('debug');
      this.debug = this.hasAttribute('debug') && (!debugVal || debugVal === 'true' || debugVal === '') ? true : false;
      // checking for PRO key and pull data if given
      if (this.hasAttribute('proKey') && this.getAttribute('proKey') !== '') {
        const dev = this.hasAttribute('dev') && (this.getAttribute('dev') === null || this.getAttribute('dev') === '' || this.getAttribute('dev') === 'true') ? true : false;
        this.data = await atcb_get_pro_data(this.getAttribute('proKey'), this, { dev: dev });
        if (this.data.proKey) this.proKey = this.data.proKey;
      }
      if (!this.data.name || this.data.name === '') {
        // if no data yet, we try reading attributes or the innerHTML of the host element
        try {
          this.data = atcb_process_inline_data(this, this.debug);
        } catch (e) {
          if (this.debug) {
            atcb_render_debug_msg(this.shadowRoot, e);
          }
          return;
        } finally {
          this.data.proKey = '';
        }
      }
      this.loaded = true;
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
      const observeAdditionally = ['instance', 'proKey'];
      if (this.proKey != null && this.proKey != '') {
        return atcbWcProParams
          .map((element) => {
            return element.toLowerCase();
          })
          .concat(observeAdditionally);
      }
      return atcbWcParams
        .map((element) => {
          return element.toLowerCase();
        })
        .concat(observeAdditionally);
    }

    async attributeChangedCallback(name, oldValue, newValue) {
      // updating whenever attributes update
      // return, if this is the very first run
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
      if (this.hasAttribute('proKey') && this.getAttribute('proKey') !== '') {
        this.data = await atcb_get_pro_data(this.getAttribute('proKey'), this);
        if (this.data.proKey) this.proKey = this.data.proKey;
      }
      if (!this.data.name || this.data.name === '') {
        try {
          this.data = atcb_process_inline_data(this, this.debug);
        } catch (e) {
          if (this.debug) {
            atcb_render_debug_msg(this.shadowRoot, e);
          }
          return;
        }
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
              let prefix = 'Add to Calendar Button';
              if (this.data.rsvp && Object.keys(this.data.rsvp).length > 0) {
                prefix = 'RSVP';
              }
              console.warn(prefix + ' generation: identifier invalid - using auto numbers instead');
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
      // build
      try {
        this.style.visibility = 'visible';
        this.style.opacity = '1';
        this.style.position = 'relative';
        atcb_build_button(this.shadowRoot, this.data);
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

// process inline data
function atcb_process_inline_data(el, debug = false) {
  let data = atcb_read_attributes(el);
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
    if (atcbJsonInput.length === 0 && debug) {
      console.error(data.validationError);
      throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
    }
    data = atcbJsonInput;
  }
  return data;
}

// read data attributes
function atcb_read_attributes(el, params = atcbWcParams) {
  let data = {};
  for (let i = 0; i < params.length; i++) {
    // reading data, but removing real code line breaks before parsing.
    // use [br] in the description to create a line break.
    let attr = params[`${i}`];
    if (el.hasAttribute(`${attr}`)) {
      let inputVal = atcb_secure_content(el.getAttribute(`${attr}`).replace(/(\\r\\n|\\n|\\r)/g, ''), false);
      let val;
      if (atcbWcBooleanParams.includes(attr)) {
        // if a boolean param has no value, it is handled as prop and set true
        val = !inputVal || inputVal === '' || inputVal.toLowerCase() === 'true' ? true : false;
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
      } else if (atcbWcNumberParams.includes(attr)) {
        val = parseInt(inputVal);
      } else {
        val = inputVal;
      }
      // only set, if no empty object or empty array
      if ((typeof val === 'object' && Object.keys(val).length === 0) || (Array.isArray(val) && (val.length === 0 || (val.length === 1 && val[0] === '')))) {
        continue;
      }
      data[`${attr}`] = val;
    }
  }
  return data;
}

// build the button
function atcb_build_button(host, data) {
  // Rewrite dynamic dates, standardize line breaks and transform urls in the description
  data = atcb_decorate_data(data);
  if (atcb_validate(data)) {
    const rootObj = host.querySelector('.atcb-initialized');
    // ... and on success, load css and generate the button
    atcb_set_light_mode(host, data);
    rootObj.setAttribute('lang', data.language);
    atcb_load_css(host, rootObj, data);
    atcb_setup_state_management(data);
    // set global event listeners
    atcb_set_global_event_listener(host, data);
    atcb_init_log(data.proKey, data.debug);
    // generate the actual button or RSVP form (if not hidden)
    if (!data.hidden) {
      if (typeof atcb_generate_rsvp === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
        atcb_generate_rsvp(host, data, false, data.inlineRsvp, false, rootObj);
      } else {
        atcb_generate_button(host, rootObj, data);
      }
      // create schema.org data (https://schema.org/Event), if possible; and add it to the regular DOM
      if (!data.hideRichData && data.name && data.dates[0].location && data.dates[0].startDate) {
        atcb_generate_rich_data(data, host.host);
      }
    }
    // log event
    atcb_log_event('initialization', data.identifier, data.identifier);
  } else if (data.debug) {
    console.error(data.validationError);
    throw new Error(data.validationError);
  }
}

// destroy the button
function atcb_cleanup(host, data) {
  // cleaning up a little bit
  atcb_close(host);
  atcb_unset_global_event_listener(data.identifier);
  const schemaEl = document.getElementById('atcb-schema-' + data.identifier);
  if (schemaEl) {
    schemaEl.remove();
  }
  Array.from(host.querySelectorAll('.atcb-debug-error-msg'))
    .concat(Array.from(host.querySelectorAll('style')))
    .concat(Array.from(host.querySelectorAll('link')))
    .concat(Array.from(host.querySelectorAll('.atcb-placeholder')))
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
      if (
        document.body.classList.contains('atcb-dark') ||
        document.documentElement.classList.contains('atcb-dark') ||
        document.body.classList.contains('atcp-dark') ||
        document.documentElement.classList.contains('atcp-dark') ||
        document.body.classList.contains('dark') ||
        document.documentElement.classList.contains('dark')
      ) {
        return 'dark';
      } else {
        return 'light';
      }
    }
    return data.lightMode;
  })();
  shadowRoot.host.classList.add('atcb-' + hostLightMode);
}

// get csp nonce
function atcb_csp_nonce(host) {
  const cspnonceRegex = /[`'"()[\]{}<>\s]/;
  if (!host.host.hasAttribute('cspnonce')) {
    return null;
  }
  if (cspnonceRegex.test(host.host.getAttribute('cspnonce'))) {
    throw new Error('cspnonce input contains forbidden characters.');
  }
  return host.host.getAttribute('cspnonce');
}

// load the right css
function atcb_load_css(host, rootObj = null, data) {
  const nonceVal = atcb_csp_nonce(host);
  // add global no-scroll style
  if (!document.getElementById('atcb-global-style')) {
    const cssGlobalContent = document.createElement('style');
    cssGlobalContent.id = 'atcb-global-style';
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    cssGlobalContent.innerText = '.atcb-modal-no-scroll{overflow-y:hidden !important;-webkit-overflow-scrolling:touch;} body.atcb-modal-no-scroll{padding-right:' + scrollBarWidth + 'px;}';
    if (nonceVal) {
      cssGlobalContent.setAttribute('nonce', nonceVal);
    }
    document.head.append(cssGlobalContent);
  }
  // add hidden style
  const generalCssContent = document.createElement('style');
  generalCssContent.innerText =
    '.atcb-initialized { display: block; position: relative; width: fit-content; }.atcb-initialized.atcb-inline { display: inline-block; }.atcb-initialized.atcb-buttons-list { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--buttonslist-gap); }.atcb-hidden { display: none; }';
  if (nonceVal) {
    generalCssContent.setAttribute('nonce', nonceVal);
  }
  host.prepend(generalCssContent);
  // get custom override information
  const overrideDefaultCss = (function () {
    if (data.styleLight) {
      return ':host{' + atcb_secure_content(data.styleLight.replace(/(\\r\\n|\\n|\\r)/g, ''), false) + '}';
    }
    return '';
  })();
  const overrideDarkCss = (function () {
    if (data.styleDark) {
      // the next line is commented out, since it is currently not possible to use the :host-context selector in Safari and Firefox - the workaround is the global mutation observer setting the style at the host. We keep this line as a reminder, though.
      //const output = ':host(.atcb-dark), :host-context(html.atcb-dark):host(.atcb-bodyScheme), :host-context(body.atcb-dark):host(.atcb-bodyScheme) { ' + atcb_secure_content(data.styleDark.replace(/(\\r\\n|\\n|\\r)/g, ''), false) + ' }';
      return ':host(.atcb-dark){' + atcb_secure_content(data.styleDark.replace(/(\\r\\n|\\n|\\r)/g, ''), false) + '}';
    }
    return '';
  })();
  // we load custom styles dynamically
  if (data.customCss && data.customCss !== '') {
    const cssFile = document.createElement('link');
    cssFile.setAttribute('rel', 'stylesheet');
    cssFile.setAttribute('type', 'text/css');
    cssFile.setAttribute('href', data.customCss);
    if (nonceVal) {
      cssFile.setAttribute('nonce', nonceVal);
    }
    // if we have no rootObject, we are loading a modal in a new shadowDOM, which can and should be blocking.
    if (rootObj == null) {
      // first, hide the content
      host.host.style.display = 'none';
      // second, load the actual css (and re-show the content as soon as it is loaded)
      loadExternalCssAsynch(cssFile, host, host.host, nonceVal);
    } else {
      // else, it should be rather non-blocking.
      // first, create a button placeholder
      const placeholder = document.createElement('div');
      placeholder.classList.add('atcb-placeholder');
      host.prepend(placeholder);
      const placeholderCssContent = document.createElement('style');
      placeholderCssContent.innerText = '.atcb-placeholder { background-color: #777; border-radius: 200px; height: 40px; opacity: .3; width: 150px; }';
      if (nonceVal) {
        placeholderCssContent.setAttribute('nonce', nonceVal);
      }
      host.prepend(placeholderCssContent);
      // second, load the actual css (and remove the placeholder as soon as it is loaded)
      loadExternalCssAsynch(cssFile, host, rootObj, nonceVal, placeholder, data.inline, data.buttonsList, overrideDefaultCss + overrideDarkCss);
    }
    return;
  }
  // otherwise, we load it from a variable
  if (data.buttonStyle !== 'none' && atcbCssTemplate[`${data.buttonStyle}`] != null) {
    const cssContent = document.createElement('style');
    if (nonceVal) {
      cssContent.setAttribute('nonce', nonceVal);
    }
    // add style to element
    cssContent.innerText = atcbCssTemplate[`${data.buttonStyle}`] + overrideDefaultCss + overrideDarkCss;
    host.prepend(cssContent);
  }
  if (rootObj != null) {
    if (data.inline) {
      rootObj.style.display = 'inline-block';
      rootObj.classList.add('atcb-inline');
    } else {
      if (data.buttonsList) {
        rootObj.classList.add('atcb-buttons-list');
      }
    }
    rootObj.classList.remove('atcb-hidden');
  }
}

async function loadExternalCssAsynch(cssFile, host, rootObj, nonceVal = null, placeholder = null, inline = false, buttonsList = false, overrideCss = '') {
  // load custom override information
  if (overrideCss !== '') {
    const cssContent = document.createElement('style');
    cssContent.innerText = overrideCss;
    if (nonceVal) {
      cssContent.setAttribute('nonce', nonceVal);
    }
    host.prepend(cssContent);
  }
  // load external css
  try {
    host.prepend(cssFile);
    // remove placeholder and render object as soon as loaded - only relevant if given
    await new Promise((resolve) => {
      cssFile.onload = resolve;
    });
    if (placeholder) {
      placeholder.remove();
    }
    if (inline) {
      rootObj.style.display = 'inline-block';
      rootObj.classList.add('atcb-inline');
    } else {
      if (buttonsList) {
        rootObj.classList.add('atcb-buttons-list');
      }
    }
    rootObj.classList.remove('atcb-hidden');
  } catch (e) {
    console.log(e);
  }
}

function atcb_render_debug_msg(host, error) {
  if (host.querySelector('.atcb-debug-error-msg')) return;
  const nonceVal = atcb_csp_nonce(host);
  const errorBanner = document.createElement('div');
  errorBanner.classList.add('atcb-debug-error-msg');
  const cssContent = document.createElement('style');
  cssContent.innerText = '.atcb-debug-error-msg { color: #bf2e2e; font-size: 12px; font-weight: bold; padding: 12px 15px; border: 2px solid #bf2e2e; max-width: 180px; border-radius: 13px; }';
  if (nonceVal) {
    cssContent.setAttribute('nonce', nonceVal);
  }
  host.prepend(cssContent);
  errorBanner.textContent = error;
  host.append(errorBanner);
}

// prepare data when not using the web component, but some custom trigger instead
async function atcb_action(inputData, triggerElement, keyboardTrigger = false) {
  // return if not within a browser environment
  if (!atcbIsBrowser()) {
    return;
  }
  // get data
  let data = await (async function () {
    const cleanedInput = atcb_secure_content(inputData);
    // pull data from PRO server, if key is given
    if (cleanedInput.proKey != null && cleanedInput.proKey != '') {
      const proData = await atcb_get_pro_data(cleanedInput.proKey, null, cleanedInput);
      if (proData.name && proData.name != '') {
        return proData;
      }
    }
    return cleanedInput;
  })();
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
  // we would only render something, if interaction is not blocked and button not hidden
  if (!data.blockInteraction && !data.hidden) {
    // prepare shadow dom and load style
    const host = document.createElement('div');
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
    host.attachShadow({ mode: 'open', delegateFocus: true });
    const elem = document.createElement('template');
    elem.innerHTML = template;
    host.shadowRoot.append(elem.content.cloneNode(true));
    const rootObj = host.shadowRoot.querySelector('.atcb-initialized');
    atcb_setup_state_management(data);
    atcb_set_light_mode(host.shadowRoot, data);
    host.shadowRoot.querySelector('.atcb-initialized').setAttribute('lang', data.language);
    atcb_load_css(host.shadowRoot, rootObj, data);
    // set global event listeners
    atcb_set_global_event_listener(host.shadowRoot, data);
    // if all is fine, ...
    // ... trigger RSVP form, or ...
    if (typeof atcb_generate_rsvp === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
      atcb_generate_rsvp(host.shadowRoot, data, keyboardTrigger, false, true, triggerElement);
    } else {
      // ... trigger link at the oneOption case, or ...
      if (oneOption) {
        atcb_generate_links(host.shadowRoot, data.options[0], data, 'all', keyboardTrigger);
        atcb_log_event('openSingletonLink', data.identifier, data.identifier);
      } else {
        // ... open the options list
        atcb_toggle(host.shadowRoot, 'open', data, triggerElement, keyboardTrigger);
      }
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
      console.log('✨ %cPRO version available at https://add-to-calendar-pro.com ← check it out!', 'font-weight: bold; line-height: 60px;');
    }
    atcbInitialGlobalInit = true;
  }
}

// PULLING PRO DATA
async function atcb_get_pro_data(licenseKey, el = null, directData = {}) {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  if (licenseKey && licenseKey !== '') {
    // Try to read data from server and log error if not possible
    try {
      const response = await fetch((directData.dev ? 'https://caldn.blob.core.windows.net/eventdata-dev/' : 'https://event.caldn.net/') + licenseKey + '/config.json');
      if (response.ok) {
        const data = await response.json();
        if (!data.name || data.name === '') {
          throw new Error('Not possible to read proKey config from server...');
        }
        const dataOverrides = el ? atcb_read_attributes(el, atcbWcProParams) : directData;
        atcbWcProParams.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(dataOverrides, key)) {
            data[`${key}`] = dataOverrides[`${key}`];
          }
        });
        data.proKey = licenseKey;
        data.identifier = licenseKey;
        return data;
      }
      throw new Error('Not possible to read proKey config from server...');
    } catch (e) {
      console.error('Add to Calendar Button proKey invalid or server not responding! Falling back to local data...');
    }
  }
  return {};
}

// GLOBAL KEYBOARD AND DEVICE LISTENERS
function atcb_set_global_event_listener(host, data) {
  // return, if we are not in a browser
  if (!atcbIsBrowser()) {
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
    // global listener for any screen changes
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

export { atcb_action, atcb_unset_global_event_listener, atcb_load_css, atcb_set_light_mode };
