/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.12.3
 *  Creator: Jens Kuerschner (https://jekuer.com)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbVersion, atcbIsBrowser, atcbStates, atcbWcParams, atcbWcProParams, atcbWcBooleanParams, atcbWcObjectParams, atcbWcObjectArrayParams, atcbWcArrayParams, atcbWcNumberParams, atcbCssTemplate } from './atcb-globals.js';
import { atcb_decorate_data } from './atcb-decorate.js';
import { atcb_check_required, atcb_validate } from './atcb-validate.js';
import { atcb_generate_button, atcb_create_atcbl } from './atcb-generate.js';
import { atcb_generate_rich_data } from './atcb-generate-rich-data.js';
import { atcb_close, atcb_toggle } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links.js';
import { atcb_secure_content, atcb_manage_body_scroll, atcb_set_fullsize } from './atcb-util.js';
import { atcb_log_event } from './atcb-event.js';
import { atcb_generate_rsvp_form, atcb_generate_rsvp_button } from './atcb-generate-pro.js';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;
const lightModeMutationObserver = [];

const template = `<div class="atcb-initialized atcb-hidden"></div>`;

// we cannot load the custom element server-side - therefore, we check for a browser environment first
if (atcbIsBrowser()) {
  class AddToCalendarButton extends HTMLElement {
    constructor() {
      super();
      this._initialized = new Promise((resolve) => (this._initializedResolver = resolve));
      const elem = document.createElement('template');
      elem.innerHTML = template;
      this.attachShadow({ mode: 'open', delegateFocus: true });
      this.shadowRoot.append(elem.content.cloneNode(true));
      this.state = {
        initializing: false,
        initialized: false,
        ready: false,
        updatePending: false,
      };
      this.data = {};
      this.error = false;
    }

    connectedCallback() {
      if (!this.initializing) {
        this.initializing = true;
        // Defer the update to ensure it's non-blocking
        setTimeout(() => this.initializeComponent(), 0);
      }
    }

    async initializeComponent() {
      if (this.state.ready) {
        return;
      }
      // initial data fetch
      this.state.initializing = true;
      // first getting debug attr and saving it here - this is somehow independet of its copy at the data object
      const debugVal = this.getAttribute('debug');
      this.debug = this.hasAttribute('debug') && (!debugVal || debugVal === 'true' || debugVal === '') ? true : false;
      // same for proOverride
      if (this.hasAttribute('proOverride') || this.hasAttribute('prooverride')) {
        let proOverrideVal = null;
        if (this.hasAttribute('proOverride') && this.getAttribute('proOverride') !== '') {
          proOverrideVal = this.getAttribute('proOverride');
        } else {
          proOverrideVal = this.getAttribute('prooverride');
        }
        this.proOverride = !proOverrideVal || proOverrideVal === 'true' || proOverrideVal === '' ? true : false;
      }
      // checking for PRO key and pull data if given
      try {
        if ((this.hasAttribute('proKey') && this.getAttribute('proKey') !== '') || (this.hasAttribute('prokey') && this.getAttribute('prokey') !== '')) {
          if (this.hasAttribute('proKey') && this.getAttribute('proKey') !== '') {
            this.data = await atcb_get_pro_data(this.getAttribute('proKey'), this);
          } else {
            this.data = await atcb_get_pro_data(this.getAttribute('prokey'), this);
          }
          if (this.data.proKey) this.proKey = this.data.proKey;
        } else {
          this.data.proKey = '';
          // if no data yet, we try reading attributes or the innerHTML of the host element
          this.data = await atcb_process_inline_data(this, this.debug);
        }
      } catch (e) {
        if (this.debug) {
          console.error(e);
          atcb_render_debug_msg(this.shadowRoot, e);
        }
        this.state.initializing = false;
        this.state.ready = true;
        return;
      }
      await this.initButton();
      this.state.initializing = false;
      this.state.initialized = true;
      this.state.ready = true;
      this._initializedResolver();
      return;
    }

    whenInitialized() {
      return this._initialized;
    }

    disconnectedCallback() {
      atcb_cleanup(this.shadowRoot, this.identifier);
      if (this.debug) {
        console.log('Add to Calendar Button "' + this.identifier + '" destroyed');
      }
      // reset the count, if all buttons got destroyed
      if (document.querySelectorAll('add-to-calendar-button').length === 0) {
        atcbBtnCount = 0;
      }
    }

    static get observedAttributes() {
      const observeAdditionally = ['instance', 'prokey', 'proKey', 'prooverride', 'proOverride'];
      if (this.proKey && this.proKey !== '') {
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

    attributeChangedCallback(name, oldValue, newValue) {
      // return, if this is the very first run
      if (!this.state.ready) {
        return;
      }
      // mind that this only observes the actual attributes, not the innerHTML of the host (one would need to alter the instance attribute for that case)!
      if (this.debug && this.state.initialized) {
        // we only mention this, if it has been initialized (with Angular, e.g., a bound variable will get infused after the initial loading)
        console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
      }
      // Set a flag or enqueue changes without directly invoking async operations
      if (!this.updatePending) {
        this.updatePending = true;
        // Defer the update to ensure it's non-blocking
        setTimeout(() => this.updateComponent(), 0);
      }
    }

    async updateComponent() {
      if (!this.updatePending) return;
      // destroy and rebuild the button
      this.data = {};
      this.shadowRoot.querySelector('.atcb-initialized').remove();
      const elem = document.createElement('template');
      elem.innerHTML = template;
      this.shadowRoot.append(elem.content.cloneNode(true));
      try {
        if (this.hasAttribute('proKey') && this.getAttribute('proKey') !== '') {
          this.data = await atcb_get_pro_data(this.getAttribute('proKey'), this);
          if (this.data.proKey) this.proKey = this.data.proKey;
        } else if (this.hasAttribute('prokey') && this.getAttribute('prokey') !== '') {
          // double-checking for lower-case version
          this.data = await atcb_get_pro_data(this.getAttribute('prokey'), this);
          if (this.data.proKey) this.proKey = this.data.proKey;
        } else {
          this.data = await atcb_process_inline_data(this, this.debug);
        }
      } catch (e) {
        if (this.debug) {
          console.error(e);
          atcb_render_debug_msg(this.shadowRoot, e);
        }
        this.updatePending = false;
        return;
      }
      atcb_cleanup(this.shadowRoot, this.identifier);
      await this.initButton();
      this.updatePending = false;
    }

    async initButton() {
      if (!this.state.initialized) {
        atcbBtnCount = atcbBtnCount + 1;
      }
      // set identifier first, no matter further validation
      // we use a stored one if available (the case, if destroyed before)
      if (this.identifier && this.identifier !== '') {
        this.data.identifier = this.identifier;
      } else {
        // and create one in all other cases
        if (this.data.identifier && this.data.identifier !== '') {
          if (!/^[\w-]+$/.test(this.data.identifier)) {
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
        // we are copying the value to preserve it over re-building the data object
        this.identifier = this.data.identifier;
      }
      this.setAttribute('atcb-button-id', this.data.identifier);
      // build
      try {
        this.style.visibility = 'visible';
        this.style.opacity = '1';
        this.style.position = 'relative';
        this.style.outline = 'none';
        await atcb_build_button(this.shadowRoot, this.data);
        return true;
      } catch (e) {
        if (this.debug) {
          console.error(e.message ? e.message : e);
          atcb_render_debug_msg(this.shadowRoot, e);
        }
        return false;
      }
    }
  }

  if (!customElements.get('add-to-calendar-button')) {
    customElements.define('add-to-calendar-button', AddToCalendarButton);
  }
}

// process inline data
async function atcb_process_inline_data(el, debug = false) {
  let data;
  try {
    // Attempt to read attributes directly and validate
    data = atcb_read_attributes(el);
    await atcb_check_required(data);
  } catch {
    // If the above fails, try to parse and validate JSON from innerHTML
    const slotInput = el.innerHTML.trim();
    if (!slotInput) {
      throw new Error('Add to Calendar Button generation failed: No data provided.');
    }
    try {
      const atcbJsonInput = JSON.parse(atcb_secure_content(slotInput.replace(/(\r\n|\n|\r)/g, ''), false));
      await atcb_check_required(atcbJsonInput);
      data = atcbJsonInput;
    } catch (jsonError) {
      // Log detailed error for debugging
      if (debug) {
        console.error(jsonError);
      }
      throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
    }
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
        const cleanedInput = (function () {
          if (!inputVal || inputVal === '') {
            return '{}';
          }
          if (inputVal.substring(0, 1) != '{') {
            return '{' + inputVal + '}';
          }
          return inputVal;
        })();
        val = JSON.parse(cleanedInput);
      } else if (atcbWcObjectArrayParams.includes(attr)) {
        const cleanedInput = (function () {
          if (!inputVal || inputVal === '') {
            return '[]';
          }
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
async function atcb_build_button(host, data) {
  try {
    host.host.classList.add('add-to-calendar');
    // Rewrite dynamic dates, standardize line breaks and transform urls in the description
    data = await atcb_decorate_data(data);
    await atcb_validate(data);
    const rootObj = host.querySelector('.atcb-initialized');
    // ... and on success, load css and generate the button
    atcb_set_light_mode(host, data);
    rootObj.setAttribute('lang', data.language);
    atcb_load_css(host, rootObj, data);
    atcb_setup_state_management(data);
    // set global event listeners
    atcb_set_global_event_listener(host, data);
    atcb_init_log(data.proKey, data.hideBranding, data.debug);
    // generate the actual button or RSVP form (if not hidden)
    if (!data.hidden) {
      if (typeof atcb_generate_rsvp_form === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
        if (!data.inlineRsvp) {
          await atcb_generate_rsvp_button(host, data);
        } else {
          await atcb_generate_rsvp_form(host, data, rootObj);
        }
      } else {
        atcb_generate_button(host, rootObj, data);
      }
      // create schema.org data (https://schema.org/Event), if possible; not in the subscription case; and add it to the regular DOM
      if (!data.hideRichData && !data.subscribe && data.name && data.dates[0].location && data.dates[0].startDate) {
        atcb_generate_rich_data(data, host.host);
      }
    }
    // log event
    atcb_log_event('initialization', data.identifier, data.identifier);
    if (!data.proKey && data.hideBranding && !document.getElementById('atcb-reference')) {
      atcb_create_atcbl(document.body, false, false, true);
    }
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
}

// destroy the button
function atcb_cleanup(host, identifier) {
  // cleaning up a little bit
  atcb_close(host);
  atcb_unset_global_event_listener(identifier);
  const schemaEl = document.getElementById('atcb-schema-' + identifier);
  if (schemaEl) {
    schemaEl.remove();
  }
  Array.from(host.querySelectorAll('.atcb-debug-error-msg'))
    .concat(Array.from(host.querySelectorAll('style')))
    .concat(Array.from(host.querySelectorAll('link')))
    .concat(Array.from(host.querySelectorAll('.atcb-placeholder')))
    .concat(Array.from(host.querySelectorAll('.atcb-button-wrapper')))
    .forEach((el) => el.remove());
  delete atcbStates[`${identifier}`];
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
async function atcb_load_css(host, rootObj = null, data) {
  const nonceVal = atcb_csp_nonce(host);
  // add global no-scroll style
  if (!document.getElementById('atcb-global-style')) {
    const cssGlobalContent = document.createElement('style');
    cssGlobalContent.id = 'atcb-global-style';
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    cssGlobalContent.innerText = '.atcb-modal-no-scroll{overflow-y:hidden !important;-webkit-overflow-scrolling:touch;} body.atcb-modal-no-scroll{padding-right:' + scrollBarWidth + 'px;}.atcb-attribution{display:none;}';
    if (nonceVal) {
      cssGlobalContent.setAttribute('nonce', nonceVal);
    }
    document.head.append(cssGlobalContent);
  }
  // add hidden style
  const generalCssContent = document.createElement('style');
  const initWidth = data.inlineRsvp && data.rsvp && Object.keys(data.rsvp).length > 0 ? '100%' : 'fit-content';
  generalCssContent.innerText = `.atcb-initialized { display: block; position: relative; width: ${initWidth}; }.atcb-initialized.atcb-inline { display: inline-block; }.atcb-initialized.atcb-buttons-list { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--buttonslist-gap); }.atcb-hidden { display: none; }`;
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
    if (!rootObj) {
      // load the actual css (and re-show the content as soon as it is loaded)
      await loadExternalCssAsynch(cssFile, host, null, nonceVal, null, false, false, overrideDefaultCss + overrideDarkCss);
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
  if (data.buttonStyle !== 'none' && atcbCssTemplate[`${data.buttonStyle}`]) {
    const cssContent = document.createElement('style');
    if (nonceVal) {
      cssContent.setAttribute('nonce', nonceVal);
    }
    // add style to element
    cssContent.innerText = atcbCssTemplate[`${data.buttonStyle}`] + overrideDefaultCss + overrideDarkCss;
    host.prepend(cssContent);
  }
  if (rootObj) {
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

async function loadExternalCssAsynch(cssFile, host, rootObj = null, nonceVal = null, placeholder = null, inline = false, buttonsList = false, overrideCss = '') {
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
    if (rootObj) {
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
    }
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
  let data;
  try {
    data = await (async function () {
      const cleanedInput = atcb_secure_content(inputData);
      // pull data from PRO server, if key is given
      if (cleanedInput.prokey && cleanedInput.prokey !== '') {
        cleanedInput.proKey = cleanedInput.prokey;
      }
      if (cleanedInput.proKey && cleanedInput.proKey !== '') {
        try {
          const proData = await atcb_get_pro_data(cleanedInput.proKey, null, cleanedInput);
          return proData;
        } catch (e) {
          throw new Error(e.message);
        }
      } else {
        return cleanedInput;
      }
    })();
  } catch (e) {
    console.error(e);
    return;
  }
  // decorate & validate data
  data.debug = data.debug === 'true';
  try {
    await atcb_check_required(data);
  } catch (e) {
    if (data.debug) {
      console.error(e);
    }
    throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
  }
  data = await atcb_decorate_data(data);
  let root = document.body;
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
    return false;
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
    if (typeof atcb_generate_rsvp_form === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
      atcb_generate_rsvp_form(host.shadowRoot, data, triggerElement, keyboardTrigger);
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
  atcb_init_log(data.proKey, data.hideBranding, data.debug);
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
      // if cancelled and not ical type, we push 1, else 0
      if (data.dates[id - 1].status.toLowerCase() === 'cancelled') {
        singleDates[data.options[`${i}`]].push(1);
      } else {
        singleDates[data.options[`${i}`]].push(0);
      }
    }
  }
  atcbStates[data.identifier] = singleDates;
}

// SHARED FUNCTION TO GENERATE THE INIT LOG MESSAGE
function atcb_init_log(pro = '', hide = false, debug = false) {
  if (!atcbInitialGlobalInit) {
    const versionOutput = (function () {
      if (debug) {
        return ' (version ' + atcbVersion + ')';
      }
      return '';
    })();
    if (pro !== '') {
      if (!hide || debug) console.log('Add to Calendar PRO script initialized' + versionOutput + ' | https://add-to-calendar-pro.com');
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
      const proOverride = el ? el.proOverride : directData.proOverride;
      const dataOverrides = el ? atcb_read_attributes(el, proOverride ? atcbWcParams : atcbWcProParams) : directData;
      const response = await fetch(`https://${dataOverrides.dev ? 'event-dev.caldn.net' : 'event.caldn.net'}/${licenseKey}/config.json`);
      if (response.ok) {
        const data = await response.json();
        if (proOverride) {
          const host = window.location.hostname || '';
          const domain = host.split('.').slice(-2).join('.');
          atcbWcParams.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(dataOverrides, key) && (['hideBranding', 'ty', 'rsvp'].indexOf(key) === -1 || domain === 'caldn.net' || domain === 'add-to-calendar-pro.com')) {
              data[`${key}`] = dataOverrides[`${key}`];
            }
          });
        } else {
          atcbWcProParams.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(dataOverrides, key)) {
              data[`${key}`] = dataOverrides[`${key}`];
            }
          });
        }
        if (dataOverrides.rsvp && Object.prototype.hasOwnProperty.call(dataOverrides.rsvp, 'none')) {
          delete data.rsvp;
        }
        if ((!data.name || data.name === '') && (!data.dates || data.dates[0].name === '')) {
          throw new Error('Not possible to read proKey config from server...');
        }
        if (data.landingpage.domain && data.landingpage.domain !== '' && atcb_secure_url(data.landingpage.domain)) {
          data.domain = data.landingpage.domain;
          delete data.landingpage;
        }
        if ((!data.proxy || data.proxy === '') && (!data.hideBranding || data.hideBranding === '')) {
          for (let i = 0; i < data.dates.length; i++) {
            if (data.dates[`${i}`].description && data.dates[`${i}`].description !== '') {
              data.dates[`${i}`].description += '[br][br][p]Powered by add-to-calendar-pro.com[/p]';
            } else {
              data.dates[`${i}`].description = 'Powered by add-to-calendar-pro.com';
            }
          }
          if (data.description && data.description !== '') {
            data.description += 'Powered by add-to-calendar-pro.com';
          }
        }
        data.proKey = licenseKey;
        data.identifier = licenseKey;
        return data;
      }
      throw new Error('Not possible to read proKey config from server...');
    } catch (originalError) {
      console.error(originalError);
      throw new Error('proKey invalid or server not responding!');
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
        if (event.shiftKey) {
          // Shift+Tab: navigate backwards
          if (currFocusOption.dataset.optionNumber > 1) {
            targetFocus = parseInt(currFocusOption.dataset.optionNumber) - 1;
          } else {
            targetFocus = optionListCount;
          }
        } else {
          // Tab: navigate forwards
          if (currFocusOption.dataset.optionNumber < optionListCount) {
            targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
          } else {
            targetFocus = 1;
          }
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
