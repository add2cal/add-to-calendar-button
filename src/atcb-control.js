/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.18.5
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Apache-2.0 with “Commons Clause” License Condition v1.0
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcb_generate_dropdown_list, atcb_generate_bg_overlay, atcb_create_atcbl } from './atcb-generate.js';
import {
  atcb_position_list,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_set_sizes,
} from './atcb-util.js';

// FUNCTIONS TO CONTROL THE INTERACTION
function atcb_toggle(host, action, data = '', button = '', keyboardTrigger = false, generatedButton = false) {
  // check for state and adjust accordingly
  // action can be 'open', 'close', or 'auto'
  if (action == 'open') {
    atcb_open(host, data, button, keyboardTrigger, generatedButton);
  } else if (
    action == 'close' ||
    button.classList.contains('atcb-active') ||
    host.querySelector('.atcb-active-modal')
  ) {
    atcb_close(host, keyboardTrigger);
  } else {
    atcb_open(host, data, button, keyboardTrigger, generatedButton);
  }
}

// show the dropdown list + background overlay
function atcb_open(host, data, button, keyboardTrigger = false, generatedButton = false) {
  // abort early if an add to calendar dropdown or modal already opened
  if (host.querySelector('.atcb-list') || host.querySelector('.atcb-modal')) return;
  // generate list and prepare wrapper
  const list = atcb_generate_dropdown_list(host, data);
  const listWrapper = document.createElement('div');
  listWrapper.classList.add('atcb-list-wrapper');
  if (data.textLabelList == false) {
    listWrapper.classList.add('atcb-no-text');
  }
  // set list styles, set button to atcb-active and force modal listStyle if no button is set
  if (button) {
    button.classList.add('atcb-active');
    if (data.listStyle === 'modal') {
      button.classList.add('atcb-modal-style');
      list.classList.add('atcb-modal');
    } else {
      listWrapper.append(list);
      listWrapper.classList.add('atcb-dropdown');
      if (data.listStyle === 'overlay') {
        listWrapper.classList.add('atcb-dropoverlay');
      }
      if (data.mindScrolling) {
        listWrapper.classList.add('atcb-mind-scrolling');
      }
    }
    if (generatedButton) {
      list.classList.add('atcb-generated-button'); // if the button has been generated by the script, we add some more specifics
    }
  } else {
    list.classList.add('atcb-modal');
  }
  // define background overlay
  const bgOverlay = atcb_generate_bg_overlay(host, data.listStyle, data.trigger, data.background);
  // render the items depending on the liststyle
  if (data.listStyle === 'modal') {
    host.append(bgOverlay);
    bgOverlay.append(list);
    if (data.branding) {
      atcb_create_atcbl(host, false);
    }
    atcb_set_sizes(list, data.sizes);
    atcb_manage_body_scroll(host);
  } else {
    host.append(listWrapper);
    listWrapper.append(list);
    if (data.buttonStyle != 'default') {
      listWrapper.classList.add('atcb-style-' + data.buttonStyle);
    }
    if (data.branding) {
      atcb_create_atcbl(host);
    }
    host.append(bgOverlay);
    atcb_set_sizes(list, data.sizes);
    // setting the position with a tiny timeout to prevent any edge case situations, where the order gets mixed up
    listWrapper.style.display = 'none';
    setTimeout(function () {
      listWrapper.style.display = 'block';
      if (data.listStyle === 'dropdown-static') {
        // in the dropdown-static case, we do not dynamically adjust whether we show the dropdown upwards
        atcb_position_list(button, listWrapper, true);
      } else {
        atcb_position_list(button, listWrapper);
      }
    }, 5);
  }
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // give keyboard focus to first item in list, if not blocked, because there is definitely no keyboard trigger
  if (keyboardTrigger) {
    list.firstChild.focus();
  } else {
    list.firstChild.focus({ preventScroll: true });
  }
  list.firstChild.blur();
}

function atcb_close(host, keyboardTrigger = false) {
  // if we have a modal on a modal, close the latest first
  const allModals = host.querySelectorAll('.atcb-modal[data-modal-nr]');
  if (allModals.length > 1) {
    host.querySelectorAll('.atcb-modal[data-modal-nr="' + allModals.length + '"]')[0].remove();
    const nextModal = host.querySelectorAll(
      '.atcb-modal[data-modal-nr="' + (allModals.length - 1) + '"]'
    )[0];
    nextModal.style.display = 'block';
    let focusEl = nextModal;
    const availableButtons = nextModal.getElementsByTagName('button');
    if (availableButtons.length > 0) {
      focusEl = availableButtons[0];
    }
    focusEl.focus();
    if (!keyboardTrigger) {
      focusEl.blur();
    }
  } else {
    // focus triggering button if available - especially relevant for keyboard navigation
    const newFocusEl = host.querySelector('.atcb-active, .atcb-active-modal');
    if (newFocusEl) {
      newFocusEl.focus({ preventScroll: true });
      if (!keyboardTrigger) {
        newFocusEl.blur();
      }
    }
    // inactivate all buttons
    Array.from(host.querySelectorAll('.atcb-active')).forEach((button) => {
      button.classList.remove('atcb-active');
    });
    Array.from(host.querySelectorAll('.atcb-active-modal')).forEach((modal) => {
      modal.classList.remove('atcb-active-modal');
    });
    // make body scrollable again
    document.body.classList.remove('atcb-modal-no-scroll');
    // remove dropdowns, modals, and bg overlays (should only be one of each at max)
    Array.from(host.querySelectorAll('.atcb-list-wrapper'))
      .concat(Array.from(host.querySelectorAll('.atcb-list')))
      .concat(Array.from(host.querySelectorAll('.atcb-modal[data-modal-nr]')))
      .concat(Array.from(host.querySelectorAll('#add-to-calendar-button-reference')))
      .concat(Array.from(host.querySelectorAll('#atcb-bgoverlay')))
      .forEach((el) => el.remove());
  }
}

export { atcb_toggle, atcb_open, atcb_close };
