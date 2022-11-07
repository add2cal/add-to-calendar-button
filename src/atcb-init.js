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
  atcb_position_list,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_throttle,
} from './atcb-util.js';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;

// DEFINING THE WEB COMPONENT
const template = document.createElement('template');
template.innerHTML = `<div class="atcb-initialized" style="display:none;"></div>`;

class AddToCalendarButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    atcb_init_log_msg();
    this.shadowRoot.append(template.content.cloneNode(true));
    // get updates when content is updated in the slot
    this.shadowRoot.addEventListener('slotchange', event => console.log(event));
  };
  
  connectedCallback() {
    const componentButtonId = this.getAttribute('atcb-button-id');
    if (componentButtonId == null || componentButtonId == '') {
      atcbBtnCount = atcbBtnCount + 1;
    }
    // load attributes
    this.name = this.getAttribute('name');
    //...

    // get JSON from HTML block, but remove real code line breaks before parsing.
    // use <br> or \n explicitely in the description to create a line break.
    const rootObj = this.shadowRoot.querySelector('.atcb-initialized');
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
    // pull data from PRO server, if key is given
    const atcbInputData = atcb_get_pro_data(atcbJsonInput);
    // abort on missing input data
    if (atcbInputData.length == 0) {
      throw new Error('Add to Calendar Button generation failed: no data provided');
    }
    // check, if all required data is available
    if (atcb_check_required(atcbInputData)) {
      // Rewrite dynamic dates, standardize line breaks and transform urls in the description
      const data = atcb_decorate_data(atcbInputData);
      // set identifier if not provided (but only if not yet constructed)
      if (data.identifier == null || data.identifier == '') {
        if (componentButtonId == null || componentButtonId == '') {
          data.identifier = 'atcb-btn-' + atcbBtnCount;
        } else {
          data.identifier = componentButtonId;
        }
      }
      if (atcb_validate(data)) {
        // ... and on success, load css and generate the button
        atcb_set_light_mode(this.shadowRoot, data);
        atcb_load_css(this.shadowRoot, rootObj, data.buttonStyle, data.inline, data.customCss);
        atcb_generate_button(this.shadowRoot, rootObj, data);
        atcb_update_state_management(data);
        // set global event listeners
        atcb_set_global_event_listener(this.shadowRoot, data);
        this.setAttribute('atcb-button-id', data.identifier);
        // create schema.org data (https://schema.org/Event), if possible; and add it to the regular DOM
        if (data.richData && data.name && data.dates[0].location && data.dates[0].startDate) {
          atcb_generate_rich_data(data, this);
        }
      }
    }
  }

  disconnectedCallback() {
    // TODO: destroy button in this case too!
  }

  static get observedAttributes() {
    return ['name', 'startDate', 'options'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
  }

  // TODO: on any change (attr or slot): destroy button (using this.id) and re-construct from scratch!!
  // for the wrappers, this would mean that they simply can push changes and the web component catches it.

}

window.customElements.define('add-to-calendar-button', AddToCalendarButton);

// set light mode
function atcb_set_light_mode(shadowRoot, data) {
  shadowRoot.host.classList.remove('atcb-dark', 'atcb-light', 'atcb-bodyScheme');
  let hostLightMode = data.lightMode;
  // Safari + Firefox combat hack
  if (hostLightMode == 'bodyScheme' && document.body.classList.contains('atcb-dark')) {
    hostLightMode = 'dark';
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
    const cssUrl = customCss;
    const cssFile = document.createElement("link");
    cssFile.setAttribute("rel", "stylesheet");
    cssFile.setAttribute("type", "text/css");
    cssFile.setAttribute("href", cssUrl);
    host.prepend(cssFile);
    if (rootObj != null) {
      cssFile.onload = function(){
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
  if (style != 'none') {
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
  atcb_init_log_msg();
  data = atcb_secure_content(data);
  // pull data from PRO server, if key is given
  data = atcb_get_pro_data(data);
  // decorate & validate data
  if (!atcb_check_required(data)) {
    throw new Error('Add to Calendar Button generation failed: required data missing; see console logs');
  }
  data = atcb_decorate_data(data);
  if (triggerElement) {
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
  atcb_update_state_management(data);
  // set global event listeners
  if (!atcbInitialGlobalInit) {
    atcb_set_global_event_listener(document, data);
  }
  // if all is fine, open the options list
  // TODO: load css here too, but only after moving elements to shadowRoot: atcb_load_css(this.shadowRoot, rootObj, data.buttonStyle, data.inline);
  atcb_toggle(document.body, 'open', data, triggerElement, keyboardTrigger);
  console.log('Add to Calendar Button "' + data.identifier + '" triggered');
  return [data.identifier];
}

// destorying a specific button
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_destroy(id) {
  // close everything before killing the element
  atcb_close(); // TODO: needs a host information!! -> rebuild the killing procedure. Rather kill the whole component!
  const el = document.getElementById(id);
  if (atcbStates[`${id}`] == null || !el) {
    console.error('Add to Calendar Button could not be destroyed! ID unknown.');
    return false;
  }
  delete atcbStates[`${id}`];
  // in case this is a generated button, we also need to remove the wrapper
  if (el.parentElement.parentElement.classList.contains('atcb-initialized')) {
    el.parentElement.parentElement.remove();
  } else {
    el.remove();
  }
  console.log('Add to Calendar Button "' + id + '" destroyed');
  return true;
}

// update global state management
function atcb_update_state_management(data) {
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
function atcb_init_log_msg() {
  if (!atcbInitialGlobalInit) {
    console.log('Add to Calendar Button Script initialized (version ' + atcbVersion + ')');
    console.log('See https://github.com/add2cal/add-to-calendar-button for details');
    atcbInitialGlobalInit = true;
  }
}

// PULLING PRO DATA
function atcb_get_pro_data(data) {
  if (data.proKey != null && data.proKey != '') {
    console.error('Add to Calendar Button generation failed: proKey invalid!');
    return [];
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
    atcb_set_light_mode(host, data);
  }
  // global listener for ESC key to close dropdown
  document.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      atcb_toggle(host, 'close', '', '', true);
    }
  });
  // global listener for arrow key optionlist navigation
  document.addEventListener('keydown', (event) => {
    if (
      host.querySelector('.atcb-list') &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')
    ) {
      let targetFocus = 0;
      let currFocusOption = host.activeElement;
      const optionListCount = host.querySelectorAll('.atcb-list-item').length;
      if (currFocusOption.classList.contains('atcb-list-item')) {
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
          case 'ArrowDown':
            host.querySelector('.atcb-list-item[data-option-number="1"]').focus();
            break;
          case 'ArrowUp':
            host.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]').focus();
            break;
          default:
            host.querySelector('.atcb-list-item[data-option-number="1"]').focus();
            break;
        }
      }
    }
  });
  // Global listener for any screen changes
  window.addEventListener(
    'resize',
    atcb_throttle(() => {
      const activeOverlay = host.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
        atcb_manage_body_scroll(host);
      }
      const activeButton = host.querySelector('.atcb-active');
      if (activeButton != null) {
        const activeList = host.querySelector('.atcb-dropdown');
        if (activeList != null) {
          atcb_position_list(activeButton, activeList, false, true);
        }
      }
    })
  );
  // Global listener for scrolling (relevant, if the button changes its position on scroll) (since quite "expensive", only runs if explicitely activated!)
  window.addEventListener(
    'scroll',
    atcb_throttle(() => {
      const activeButton = host.querySelector('.atcb-active');
      if (activeButton != null) {
        const activeList = host.querySelector('.atcb-dropdown');
        if (activeList != null) {
          if (activeList.classList.contains('atcb-mind-scrolling')) {
            atcb_position_list(activeButton, activeList, false, true);
          }
        }
      }
    }, 20)
  );
}

export { AddToCalendarButton, atcb_action, atcb_destroy };
