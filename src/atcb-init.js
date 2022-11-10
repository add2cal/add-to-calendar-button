/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.18.6
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbVersion, isBrowser, atcbStates, atcbCssTemplate } from './atcb-globals.js';
import { atcb_decorate_data, atcb_patch_config } from './atcb-decorate.js';
import { atcb_check_required, atcb_validate } from './atcb-validate.js';
import { atcb_generate_button, atcb_generate_rich_data } from './atcb-generate.js';
import { atcb_close, atcb_toggle } from './atcb-control.js';
import {
  atcb_secure_content,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_throttle,
} from './atcb-util.js';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;
const lightModeMutationObserver = [];

// DEFINING THE WEB COMPONENT
const atcbWcParams = [
  "name",
  "dates",
  "description",
  "startDate",
  "startTime",
  "endDate",
  "endTime",
  "timeZone",
  "location",
  "status",
  "sequence",
  "uid",
  "organizer",
  "icsFile",
  "images",
  "recurrence",
  "recurrence_interval",
  "recurrence_until",
  "recurrence_count",
  "recurrence_byDay",
  "recurrence_byMonth",
  "recurrence_byMonthDay",
  "recurrence_weekstart",
  "availability",
  "created",
  "updated",
  "identifier",
  "subscribe",
  "options",
  "iCalFileName",
  "listStyle",
  "buttonStyle",
  "trigger",
  "icons",
  "textLabels",
  "background",
  "checkmark",
  "branding",
  "size",
  "label",
  "ty",
  "rsvp",
  "inlineRsvp",
  "customLabels",
  "lightMode",
  "language",
  "richData"
];

const template = document.createElement('template');
template.innerHTML = `<div class="atcb-initialized" style="display:none;position:relative;max-width:max-content;"></div>`;

class AddToCalendarButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open', delegateFocus: true});
    this.shadowRoot.append(template.content.cloneNode(true));
  };
  
  connectedCallback() {
    const componentButtonId = this.getAttribute('atcb-button-id');
    if (componentButtonId == null || componentButtonId == '') {
      atcbBtnCount = atcbBtnCount + 1;
    }
    const rootObj = this.shadowRoot.querySelector('.atcb-initialized');
    this.data = {};
    // checking for PRO key first and pull data if given
    if (this.getAttribute('proKey') != null && this.getAttribute('proKey') != '') {
      this.data = atcb_get_pro_data(this.getAttribute('proKey'));
    } else {
      // otherwise, we try reading attributes
      const wcBooleanParams = [
        "subscribe",
        "background",
        "checkmark",
        "branding",
        "inlineRsvp",
        "richData"
      ];
      const wcObjectParams = [
        "customLabels",
        "ty",
        "rsvp"
      ];
      const wcArrayParams = [
        "images",
        "options"
      ];
      for (let i = 0; i < atcbWcParams.length; i++) {
        // reading data, but removing real code line breaks before parsing.
        // use <br> or \n explicitely in the description to create a line break.
        let attr = atcbWcParams[`${i}`];
        if (this.getAttribute(`${attr}`) != null) {
          let inputVal = atcb_secure_content(this.getAttribute(`${attr}`).replace(/(\r\n|\n|\r)/g, ''), false);
          let val;
          if (wcBooleanParams.includes(attr)) {
            val = (inputVal === 'true');
          } else if (wcObjectParams.includes(attr)) {
            val = JSON.parse(inputVal);
          } else if (wcArrayParams.includes(attr)) {
            val = (inputVal).substring(1, inputVal.length - 1).replace(/\s/g, '').split('","');
          } else {
            val = inputVal;
          }
          this.data[`${attr}`] = val;
        }
      }
    }
    if (!atcb_check_required(this.data, false)) {
      // if we still have no data, we get a potential JSON from the innerHTML
      const slotInput = this.innerHTML;
      const atcbJsonInput = (function () {
        if (slotInput != '') {
          try {
            const input = JSON.parse(
              atcb_secure_content(slotInput.replace(/(\r\n|\n|\r)/g, ''), false)
            );
            // we immediately patch for backwards compatibility
            return atcb_patch_config(input);
          } catch (e) {
            throw new Error('Add to Calendar Button generation failed: JSON content provided, but badly formatted (in doubt, try some tool like https://jsonformatter.org/ to validate).\r\nError message: ' + e);
          }
        }
        return '';
      })();
      // abort on missing input data
      if (atcbJsonInput.length == 0) {
        throw new Error('Add to Calendar Button generation failed: no data provided');
      }
      this.data = atcbJsonInput;
    }
    // check, if all required data is available
    if (atcb_check_required(this.data)) {
      // Rewrite dynamic dates, standardize line breaks and transform urls in the description
      this.data = atcb_decorate_data(this.data);
      // set identifier if not provided (but only if not yet constructed)
      if (this.data.identifier == null || this.data.identifier == '') {
        if (componentButtonId == null || componentButtonId == '') {
          this.data.identifier = 'atcb-btn-' + atcbBtnCount;
        } else {
          this.data.identifier = componentButtonId;
        }
      }
      if (atcb_validate(this.data)) {
        // ... and on success, load css and generate the button
        atcb_set_light_mode(this.shadowRoot, this.data);
        atcb_load_css(this.shadowRoot, rootObj, this.data.buttonStyle, this.data.inline, this.data.customCss);
        atcb_setup_state_management(this.data);
        // set global event listeners
        atcb_set_global_event_listener(this.shadowRoot, this.data);
        atcb_init_log();
        this.setAttribute('atcb-button-id', this.data.identifier);
        // generate the actual button
        atcb_generate_button(this.shadowRoot, rootObj, this.data);
        // create schema.org data (https://schema.org/Event), if possible; and add it to the regular DOM
        if (this.data.richData && this.data.name && this.data.dates[0].location && this.data.dates[0].startDate) {
          atcb_generate_rich_data(this.data, this);
          this.data.schemaEl = this.previousSibling;
        }
      }
    }
  }

  disconnectedCallback() {
    atcb_cleanup(this.shadowRoot, this.data);
    console.log('Add to Calendar Button "' + this.data.identifier + '" destroyed');
  }

  static get observedAttributes() {
    return atcbWcParams.map(element => {
      return element.toLowerCase();
    });
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    // updating whenever attributes update
    // mind that this only observes the actual attributes, not the innerHTML of the host!
    if (atcbInitialGlobalInit) {
      console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
      atcb_cleanup(this.shadowRoot, this.data);
    }
  }
}

window.customElements.define('add-to-calendar-button', AddToCalendarButton);

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
  if (hostLightMode == 'bodyScheme' && document.body.classList.contains('atcb-dark')) {
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
    const cssGlobalContent = document.createElement("style");
    cssGlobalContent.id = 'atcb-global-style'
    cssGlobalContent.innerText = '.atcb-modal-no-scroll { overflow-y: hidden; }';
    document.head.append(cssGlobalContent);
  }
  // we load custom styles dynamically
  if (customCss != '' && style == 'custom') {
    // first, create placeholder
    const placeholder = document.createElement('div');
    placeholder.style.width = '150px';
    placeholder.style.height = '40px';
    placeholder.style.borderRadius = '13px';
    placeholder.style.backgroundColor = '#777';
    placeholder.style.opacity = '.3';
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
      cssFile.onload = function(){
        placeholder.remove();
        if (inline) {
          rootObj.style.display = 'inline-block';
        } else {
          rootObj.style.display = 'block';
        }
      }
    }
    return;
  }
  // otherwise, we load it from a variable
  if (style != 'none' && atcbCssTemplate[`${style}`] != null) {
    const cssContent = document.createElement("style");
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

// prepare data when not using the web component, but some custom trigger instead
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = true) {
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
        triggerElement.id = data.identifier;
      } else {
        data.identifier = 'atcb-btn-custom';
      }
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
  // prepare shadow dom and load style
  let host = document.createElement('div');
  host.id = 'atcb-customTrigger-' + data.identifier + '-host'; 
  if (root == document.body) {
    document.body.append(host);
  } else {
    root.after(host);
  }
  host.setAttribute('atcb-button-id', data.identifier);
  host.attachShadow({mode: 'open', delegateFocus: true});
  host.shadowRoot.append(template.content.cloneNode(true));
  const rootObj = host.shadowRoot.querySelector('.atcb-initialized');
  atcb_setup_state_management(data);
  atcb_set_light_mode(host.shadowRoot, data);
  atcb_load_css(host.shadowRoot, rootObj, data.buttonStyle, data.inline, data.customCss);
  // set global event listeners
  atcb_set_global_event_listener(host.shadowRoot, data);
  // if all is fine, open the options list
  document.body.classList.add('atcb-customTrigger-active');
  atcb_toggle(host.shadowRoot, 'open', data, triggerElement, keyboardTrigger);
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
    console.error('Add to Calendar Button proKey invalid! Falling back to local data...');    
    // TODO: Pull data from server
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
    lightModeMutationObserver[data.identifier] = new MutationObserver(function(mutationsList) {
      mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          atcb_set_light_mode(host, data);
        }
      });
    });
    lightModeMutationObserver[data.identifier].observe(document.body, { attributes: true })
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
  const host = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]').shadowRoot;
  if (event.key === 'Escape') {
    atcb_toggle(host, 'close', '', '', true);
  }
}

function atcb_global_listener_keydown(event) {
  const host = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]').shadowRoot;
  if (
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
  const host = document.querySelector('[atcb-button-id="' + atcbStates['active'] + '"]').shadowRoot;
  atcb_throttle(() => {
    const activeOverlay = host.getElementById('atcb-bgoverlay');
    if (activeOverlay != null) {
      atcb_set_fullsize(activeOverlay);
      atcb_manage_body_scroll(host);
    }
  })
}

function atcb_unset_global_event_listener(identifier) {
  if (typeof lightModeMutationObserver[`${identifier}`] !== 'undefined') {
    lightModeMutationObserver[`${identifier}`].disconnect();
  }
  // TODO: Remove global event listeners as well (might require refactoring of how we set them in the first place)
}

export { atcb_unset_global_event_listener };
