/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.17.0
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
import { atcb_toggle } from './atcb-control.js';
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
      if (atcbJsonInput === '') {
        continue;
      }
      // rewrite config for backwards compatibility
      const atcbJsonInputPatched = atcb_patch_config(atcbJsonInput);
      // check, if all required data is available
      if (atcb_check_required(atcbJsonInputPatched)) {
        // Rewrite dynamic dates, standardize line breaks and transform urls in the description
        const data = atcb_decorate_data(atcbJsonInputPatched);
        // set identifier
        if (data.identifier == null || data.identifier == '') {
          data.identifier = 'atcb-btn-' + (i + atcButtonsInitialized.length + 1);
        }
        // validate the config (JSON iput) ...
        if (atcb_validate(data)) {
          // ... and generate the button on success
          atcb_generate_button(atcButtons[parseInt(i)], data);
          atcb_update_state_management(data);
        }
      }
    }
  }
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
  // decorate & validate data
  if (!atcb_check_required(data)) {
    throw new Error('Add to Calendar Button generation failed: required data missing; see console logs');
  }
  data = atcb_decorate_data(data);
  if (triggerElement) {
    data.identifier = triggerElement.id;
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
      const activeList = document.querySelector('.atcb-dropdown');
      if (activeButton != null && activeList != null) {
        atcb_position_list(activeButton, activeList, false, true);
      }
    })
  );
}

export { atcb_init, atcb_action };
