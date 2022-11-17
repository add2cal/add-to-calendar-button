/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.18.7
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbVersion, isBrowser, atcbStates } from './atcb-globals.js';
import { atcb_decorate_data, atcb_patch_config } from './atcb-decorate.js';
import { atcb_check_required, atcb_validate } from './atcb-validate.js';
import { atcb_generate_button } from './atcb-generate.js';
import { atcb_close, atcb_toggle } from './atcb-control.js';
import {
  atcb_secure_content,
  atcb_position_list,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_throttle,
} from './atcb-util.js';

let atcbInitialInit = false;

// INITIALIZE THE SCRIPT AND FUNCTIONALITY
function atcb_init() {
  // set global event listeners
  if (!atcbInitialInit) {
    atcb_set_global_event_listener();
  }
  atcb_init_log_msg();
  // abort early, if not in a browser
  if (!isBrowser()) {
    console.error('no further initialization due to wrong environment (no browser)');
    return;
  }
  // get all placeholders
  const atcButtons = document.querySelectorAll('.atcb');
  const btnIDs = [];
  if (atcButtons.length > 0) {
    // get the amount of already initialized ones first
    const atcButtonsInitialized = document.querySelectorAll('.atcb-initialized');
    // generate the buttons one by one
    for (let i = 0; i < atcButtons.length; i++) {
      // skip already initialized ones
      if (atcButtons[parseInt(i)].classList.contains('atcb-initialized')) {
        continue;
      }
      // get JSON from HTML block, but remove real code line breaks before parsing.
      // use <br> or \n explicitely in the description to create a line break.
      const atcbJsonInput = (function () {
        try {
          return JSON.parse(
            atcb_secure_content(atcButtons[parseInt(i)].innerHTML.replace(/(\r\n|\n|\r)/g, ''), false)
          );
        } catch (e) {
          console.error(
            'Add to Calendar Button generation failed: JSON content provided, but badly formatted (in doubt, try some tool like https://jsonformatter.org/ to validate).\r\nError message: ' +
              e
          );
          return '';
        }
      })();
      // rewrite config for backwards compatibility
      const atcbJsonInputPatched = atcb_patch_config(atcbJsonInput);
      // pull data from PRO server, if key is given
      const atcbInputData = atcb_get_pro_data(atcbJsonInputPatched);
      // abort on missing input data
      if (atcbInputData.length == 0) {
        continue;
      }
      // check, if all required data is available
      if (atcb_check_required(atcbInputData)) {
        // Rewrite dynamic dates, standardize line breaks and transform urls in the description
        const data = atcb_decorate_data(atcbInputData);
        // set identifier if not provided
        if (data.identifier == null || data.identifier == '') {
          data.identifier = 'atcb-btn-' + (i + atcButtonsInitialized.length + 1);
        }
        // validate the config (JSON iput) ...
        if (atcb_validate(data)) {
          // ... and generate the button on success
          atcb_generate_button(atcButtons[parseInt(i)], data);
          atcb_update_state_management(data);
          btnIDs.push(data.identifier);
        }
      }
    }
  }
  return btnIDs;
}

// prepare data when not using the init function, but some custom trigger instead
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = true) {
  // set global event listeners
  if (!atcbInitialInit) {
    atcb_set_global_event_listener();
  }
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
  // if all is fine, open the options list
  atcb_toggle('open', data, triggerElement, keyboardTrigger);
  console.log('Add to Calendar Button "' + data.identifier + '" triggered');
  return [data.identifier];
}

// destorying a specific button
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_destroy(id) {
  // close everything before killing the element
  atcb_close();
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
  if (!atcbInitialInit) {
    console.log('Add to Calendar Button Script initialized (version ' + atcbVersion + ')');
    console.log('See https://github.com/add2cal/add-to-calendar-button for details');
    atcbInitialInit = true;
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
function atcb_set_global_event_listener() {
  // return, if we are not in a browser
  if (!isBrowser()) {
    return;
  }
  // global listener for ESC key to close dropdown
  document.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      atcb_toggle('close', '', '', true);
    }
  });
  // global listener for arrow key optionlist navigation
  document.addEventListener('keydown', (event) => {
    if (
      document.querySelector('.atcb-list') &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')
    ) {
      let targetFocus = 0;
      let currFocusOption = document.activeElement;
      const optionListCount = document.querySelectorAll('.atcb-list-item').length;
      if (currFocusOption.classList.contains('atcb-list-item')) {
        if (event.key === 'ArrowDown' && currFocusOption.dataset.optionNumber < optionListCount) {
          event.preventDefault();
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
        } else if (event.key === 'ArrowUp' && currFocusOption.dataset.optionNumber >= 1) {
          event.preventDefault();
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) - 1;
        }
        if (targetFocus > 0) {
          document.querySelector('.atcb-list-item[data-option-number="' + targetFocus + '"]').focus();
        }
      } else {
        event.preventDefault();
        switch (event.key) {
          case 'ArrowDown':
            document.querySelector('.atcb-list-item[data-option-number="1"]').focus();
            break;
          case 'ArrowUp':
            document.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]').focus();
            break;
          default:
            document.querySelector('.atcb-list-item[data-option-number="1"]').focus();
            break;
        }
      }
    }
  });
  // Global listener for any screen changes
  window.addEventListener(
    'resize',
    atcb_throttle(() => {
      const activeOverlay = document.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
        atcb_manage_body_scroll();
      }
      const activeButton = document.querySelector('.atcb-active');
      if (activeButton != null) {
        const activeList = document.querySelector('.atcb-dropdown');
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
      const activeButton = document.querySelector('.atcb-active');
      if (activeButton != null) {
        const activeList = document.querySelector('.atcb-dropdown');
        if (activeList != null) {
          if (activeList.classList.contains('atcb-mind-scrolling')) {
            atcb_position_list(activeButton, activeList, false, true);
          }
        }
      }
    }, 20)
  );
}

export { atcb_init, atcb_action, atcb_destroy };
