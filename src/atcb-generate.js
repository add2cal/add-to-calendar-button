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

import { atcbIcon, atcbStates, atcbDefaultTarget } from './atcb-globals.js';
import { atcb_toggle, atcb_close } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links.js';
import { atcb_generate_time, atcb_generate_timestring, atcb_position_shadow_button, atcb_position_shadow_button_listener, atcb_manage_body_scroll, atcb_set_fullsize, atcb_set_sizes, atcb_debounce, atcb_debounce_leading } from './atcb-util.js';
import { atcb_set_fully_successful } from './atcb-links.js';
import { atcb_translate_hook } from './atcb-i18n.js';
import { atcb_load_css, atcb_set_light_mode } from './atcb-init.js';
import { atcb_log_event } from './atcb-event.js';
import { atcb_generate_rsvp } from './atcb-generate-pro.js';

// GENERATE THE ACTUAL BUTTON
// helper function to generate the labels for the button and list options
function atcb_generate_label(host, data, parent, type, icon = false, text = '', oneOption = false) {
  // setting IDs and adding event listeners
  switch (type) {
    case 'trigger':
    case 'rsvp':
    default:
      parent.id = data.identifier;
      if (!data.blockInteraction) {
        parent.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            event.preventDefault();
            if (type === 'rsvp' && typeof atcb_generate_rsvp === 'function') {
              atcb_generate_rsvp(host, data, true, false, true, parent);
            } else {
              atcb_toggle(host, 'auto', data, parent, true, true);
            }
          }
        });
        parent.addEventListener(
          'touchend',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            if (type === 'rsvp' && typeof atcb_generate_rsvp === 'function') {
              atcb_generate_rsvp(host, data, false, false, true, parent);
            } else {
              atcb_toggle(host, 'auto', data, parent, false, true);
            }
          }),
        );
        if (data.trigger === 'click' || (type === 'rsvp' && typeof atcb_generate_rsvp === 'function')) {
          parent.addEventListener(
            'mouseup',
            atcb_debounce_leading((event) => {
              event.preventDefault();
              if (type === 'rsvp' && typeof atcb_generate_rsvp === 'function') {
                atcb_generate_rsvp(host, data, false, false, true, parent);
              } else {
                atcb_toggle(host, 'auto', data, parent, false, true);
              }
            }),
          );
        } else {
          parent.addEventListener(
            'mouseenter',
            atcb_debounce_leading((event) => {
              event.preventDefault();
              atcb_toggle(host, 'open', data, parent, false, true);
            }),
          );
        }
      }
      break;
    case 'apple':
    case 'google':
    case 'ical':
    case 'msteams':
    case 'ms365':
    case 'outlookcom':
    case 'yahoo':
      parent.id = data.identifier + '-' + type;
      if (!data.blockInteraction) {
        parent.addEventListener(
          'click',
          atcb_debounce_leading(() => {
            if (oneOption) {
              host.querySelector('#' + parent.id)?.blur();
              atcb_log_event('openSingletonLink', parent.id, data.identifier);
            } else {
              atcb_toggle(host, 'close');
              atcb_log_event('openCalendarLink', parent.id, data.identifier);
            }
            atcb_generate_links(host, type, data);
          }),
        );
        parent.addEventListener('keyup', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (oneOption) {
              host.querySelector('#' + parent.id)?.blur();
              atcb_log_event('openSingletonLink', parent.id, data.identifier);
            } else {
              atcb_toggle(host, 'close');
              atcb_log_event('openCalendarLink', parent.id, data.identifier);
            }
            atcb_generate_links(host, type, data, 'all', true);
          }
        });
      }
      break;
    case 'close':
      parent.id = data.identifier + '-close';
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          atcb_log_event('closeList', 'List Close Button', atcbStates['active']);
          atcb_toggle(host, 'close');
        }),
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          atcb_log_event('closeList', 'List Close Button', atcbStates['active']);
          atcb_toggle(host, 'close', data, 'all', true);
        }
      });
      break;
  }
  // set icon and text
  atcb_generate_label_content(data, parent, type, icon, text, oneOption);
}

function atcb_generate_label_content(data, parent, type, icon, text, oneOption) {
  const defaultTriggerText = (function () {
    if (data.pastDateHandling != 'none') {
      let allOverdue = true;
      for (let i = 0; i < data.dates.length; i++) {
        if (!data.dates[`${i}`].overdue) {
          allOverdue = false;
          break;
        }
      }
      if (allOverdue) {
        return atcb_translate_hook('expired', data);
      }
    }
    return atcb_translate_hook('label.addtocalendar', data);
  })();
  // defining text labels
  // if there is only 1 option, we use the trigger text on the option label
  if (text === '') {
    if (data.options.length === 1 || type === 'trigger') {
      text = defaultTriggerText;
    } else if (type === 'close') {
      text = atcb_translate_hook('close', data);
    } else {
      text = atcb_translate_hook(type, data);
    }
  }
  // add icon and text label (not in the date style trigger case)
  if (data.buttonStyle === 'date' && (type == 'trigger' || oneOption)) {
    return;
  }
  if (icon) {
    const iconEl = document.createElement('div');
    iconEl.classList.add('atcb-icon');
    iconEl.classList.add(`atcb-icon-${type}`);
    iconEl.innerHTML = atcbIcon[`${type}`];
    parent.append(iconEl);
  }
  if (((type == 'trigger' || oneOption) && !data.hideTextLabelButton) || (!oneOption && type != 'trigger' && !data.hideTextLabelList)) {
    const textEl = document.createElement('span');
    textEl.classList.add('atcb-text');
    textEl.textContent = text;
    parent.append(textEl);
  }
  // also add text as aria-label to the parent element
  parent.setAttribute('aria-label', text);
}

// generate the triggering button
function atcb_generate_button(host, button, data) {
  // determine whether we are looking for the 1-option case (also with buttonsList)
  const oneOption = (function () {
    if (data.options.length === 1 || (data.buttonsList && data.buttonStyle != 'date')) {
      return true;
    }
    return false;
  })();
  const optionSplit = oneOption ? data.options : ['default'];
  optionSplit.forEach(function (option, index) {
    // generate the wrapper div
    const buttonTriggerWrapper = document.createElement('div');
    buttonTriggerWrapper.classList.add('atcb-button-wrapper');
    if (data.rtl) {
      buttonTriggerWrapper.classList.add('atcb-rtl');
    }
    button.append(buttonTriggerWrapper);
    atcb_set_sizes(buttonTriggerWrapper, data.sizes);
    // generate the button trigger div
    const buttonTrigger = document.createElement('button');
    buttonTrigger.classList.add('atcb-button');
    if (data.disabled) {
      buttonTrigger.setAttribute('disabled', true);
    }
    if (data.hideTextLabelButton) {
      buttonTrigger.classList.add('atcb-no-text');
    }
    if (data.trigger === 'click') {
      buttonTrigger.classList.add('atcb-click');
    }
    if (data.listStyle === 'overlay') {
      buttonTrigger.classList.add('atcb-dropoverlay');
    }
    buttonTrigger.type = 'button';
    buttonTrigger.setAttribute('aria-expanded', false); // aria-expanded default value on button generate
    buttonTriggerWrapper.append(buttonTrigger);
    // generate the label incl. eventListeners
    if (data.buttonStyle === 'date') {
      atcb_generate_date_button(data, buttonTrigger);
    }
    // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text
    if (oneOption) {
      buttonTrigger.classList.add('atcb-single');
      // if buttonsList is true and we have more than 1 option, use the option as label
      const label = (function () {
        if (data.buttonsList && data.options.length > 1) {
          return atcb_translate_hook(`${data.options[`${index}`]}`, data);
        }
        return data.label;
      })();
      // generate label
      atcb_generate_label(host, data, buttonTrigger, option, !data.hideIconButton, label, true);
      // override the id for the oneOption button, since the button always needs to have the button id, while it received the option id from the labeling function
      buttonTrigger.id = data.identifier;
      // but in case we simply render one button per option, only use the identifier for the first one and also add the info for the option
      if (data.buttonsList) {
        buttonTrigger.id = data.identifier + '-' + option;
      }
    } else {
      atcb_generate_label(host, data, buttonTrigger, 'trigger', !data.hideIconButton, data.label);
      // create an empty anchor div to place the dropdown, while the position can be defined via CSS
      const buttonDropdownAnchor = document.createElement('div');
      buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
      buttonTrigger.append(buttonDropdownAnchor);
    }
    // add checkmark (hidden first) (if button is not disabled already)
    if (!data.hideCheckmark && !data.hideTextLabelButton && !data.buttonsList && !data.disabled) {
      const btnCheck = document.createElement('div');
      btnCheck.classList.add('atcb-checkmark');
      btnCheck.innerHTML = atcbIcon['checkmark'];
      buttonTrigger.append(btnCheck);
    }
  });
  if (data.debug) {
    console.log('Add to Calendar Button "' + data.identifier + '" created');
  }
}

// generate the dropdown list (can also appear wihtin a modal, if option is set)
function atcb_generate_dropdown_list(host, data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  optionsList.role = 'list';
  if (data.rtl) {
    optionsList.classList.add('atcb-rtl');
  }
  // generate the list items
  let listCount = 0;
  data.options.forEach(function (option) {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.role = 'link';
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.append(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(host, data, optionItem, option, !data.hideIconList);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.role = 'button';
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.append(optionItem);
    atcb_generate_label(host, data, optionItem, 'close', !data.hideIconList);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
function atcb_generate_bg_overlay(host, trigger = '', modal = false, darken = true, closable = true) {
  const bgOverlay = (function () {
    if (modal) {
      return document.createElement('dialog');
    }
    return document.createElement('div');
  })();
  if (modal) {
    bgOverlay.setAttribute('open', true);
  }
  bgOverlay.id = 'atcb-bgoverlay';
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.role = 'button';
  bgOverlay.tabIndex = 0;
  if (closable) {
    bgOverlay.addEventListener(
      'mouseup',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_log_event('closeList', 'Background Hit', atcbStates['active']);
        atcb_toggle(host, 'close');
      }),
    );
    let fingerMoved = false;
    bgOverlay.addEventListener(
      'touchstart',
      atcb_debounce_leading(() => (fingerMoved = false)),
      { passive: true },
    );
    bgOverlay.addEventListener(
      'touchmove',
      atcb_debounce_leading(() => (fingerMoved = true)),
      { passive: true },
    );
    bgOverlay.addEventListener(
      'touchend',
      atcb_debounce((e) => {
        if (fingerMoved !== false || e.target !== e.currentTarget) return;
        atcb_log_event('closeList', 'Background Hit', atcbStates['active']);
        atcb_toggle(host, 'close');
      }),
      { passive: true },
    );
    if (trigger !== 'click') {
      bgOverlay.addEventListener(
        'mousemove',
        atcb_debounce_leading((e) => {
          if (e.target !== e.currentTarget) return;
          atcb_log_event('closeList', 'Background Hit', atcbStates['active']);
          atcb_toggle(host, 'close');
        }),
      );
    } else {
      // if trigger is not set to 'click', we render a close icon, when hovering over the background
      bgOverlay.classList.add('atcb-click');
    }
  }
  return bgOverlay;
}

// SMALL LOGO
function atcb_create_atcbl(host, atList = true, returnEl = false) {
  const atcbL = document.createElement('div');
  atcbL.id = 'atcb-reference';
  setTimeout(() => {
    atcbL.innerHTML = '<a href="https://add-to-calendar-pro.com" target="_blank" rel="noopener">Add-to-Calendar-PRO.com</a>';
  }, 500);
  if (atList) {
    host.querySelector('.atcb-initialized .atcb-list-wrapper').append(atcbL);
  } else if (returnEl) {
    return atcbL;
  } else {
    if (window.innerHeight > 1000 || window.innerWidth > 1000) {
      host.append(atcbL);
      atcbL.classList.add('fixed-ref');
    }
  }
}

// FUNCTION TO CREATE MODALS
// this is only about special communication modals - not the list style modal
function atcb_create_modal(host, data, icon = '', headline, content = '', buttons = [], subEvents = [], keyboardTrigger = false, goto = {}, closable = true) {
  atcbStates['active'] = data.identifier;
  // setting the stage
  const modalHost = atcb_generate_modal_host(host, data, false);
  const bgOverlay = (function () {
    const el = modalHost.getElementById('atcb-bgoverlay');
    if (!el) {
      const newOverlay = atcb_generate_bg_overlay(host, 'click', true, !data.hideBackground, closable);
      modalHost.querySelector('.atcb-modal-host-initialized').append(newOverlay);
      return newOverlay;
    }
    return el;
  })();
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('atcb-modal');
  bgOverlay.append(modalWrapper);
  const modalCount = modalHost.querySelectorAll('.atcb-modal').length;
  modalWrapper.dataset.modalNr = modalCount;
  modalWrapper.tabIndex = 0;
  modalWrapper.focus({ preventScroll: true });
  modalWrapper.blur();
  const parentButton = (function () {
    const hostEl = host.getElementById(data.identifier);
    if (hostEl) {
      return hostEl;
    }
    return document.getElementById(data.identifier);
  })();
  if (parentButton) {
    parentButton.classList.add('atcb-active-modal');
  }
  // create box
  const modal = document.createElement('div');
  modal.classList.add('atcb-modal-box');
  if (data.rtl) {
    modal.classList.add('atcb-rtl');
  }
  modalWrapper.append(modal);
  atcb_set_sizes(modal, data.sizes);
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // add icon
  if (icon !== '' && !data.hideIconModal) {
    const modalIcon = document.createElement('div');
    modalIcon.classList.add('atcb-modal-icon');
    modalIcon.innerHTML = atcbIcon[`${icon}`];
    modal.append(modalIcon);
  }
  // add headline
  if (headline && headline !== '') {
    const modalHeadline = document.createElement('div');
    modalHeadline.classList.add('atcb-modal-headline');
    modalHeadline.textContent = headline;
    modal.append(modalHeadline);
  }
  // add text content
  if (content !== '') {
    const modalContent = document.createElement('div');
    modalContent.classList.add('atcb-modal-content');
    modalContent.innerHTML = content;
    modal.append(modalContent);
  }
  if (!data.hideBranding) {
    atcb_create_atcbl(modalHost, false);
  }
  // add subEvent buttons (array with type first and subEvent numbers following)
  if (subEvents.length > 1) {
    const modalsubEventsContent = document.createElement('div');
    modalsubEventsContent.classList.add('atcb-modal-content');
    modal.append(modalsubEventsContent);
    for (let i = 1; i < subEvents.length; i++) {
      const modalSubEventButton = document.createElement('button');
      modalSubEventButton.type = 'button';
      modalSubEventButton.id = data.identifier + '-' + subEvents[0] + '-' + i;
      if (atcbStates[`${data.identifier}`][`${subEvents[0]}`][i - 1] > 0) {
        modalSubEventButton.classList.add('atcb-saved');
      }
      modalSubEventButton.classList.add('atcb-subevent-btn');
      modalsubEventsContent.append(modalSubEventButton);
      atcb_generate_date_button(data, modalSubEventButton, i);
      // interaction only if not overdue and blocked
      if (!data.dates[i - 1].overdue || data.pastDateHandling === 'none') {
        if (i === 1 && keyboardTrigger) {
          modalSubEventButton.focus();
        }
        modalSubEventButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_log_event('openSubEventLink', modalSubEventButton.id, data.identifier);
            modalSubEventButton.blur();
            atcb_generate_links(host, subEvents[0], data, subEvents[`${i}`], keyboardTrigger, true);
          }),
        );
      } else {
        // if blocked, we also add styles
        modalSubEventButton.setAttribute('disabled', true);
      }
    }
  }
  // add buttons (array of objects; attributes: href, type, label, primary(boolean), small(boolean), id)
  if (buttons.length === 0) {
    buttons.push({ type: 'close', label: atcb_translate_hook('close', data), small: true });
  }
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('atcb-modal-buttons');
  modal.append(modalButtons);
  buttons.forEach((button, index) => {
    let modalButton;
    if (button.href && button.href !== '') {
      modalButton = document.createElement('a');
      modalButton.setAttribute('target', atcbDefaultTarget);
      modalButton.setAttribute('href', button.href);
      modalButton.setAttribute('rel', 'noopener');
    } else {
      modalButton = document.createElement('button');
      modalButton.type = 'button';
    }
    if (button.id && button.id !== '') {
      modalButton.id = button.id;
    }
    modalButton.classList.add('atcb-modal-btn');
    if (button.primary) {
      modalButton.classList.add('atcb-modal-btn-primary');
    }
    if (button.small) {
      modalButton.classList.add('btn-small');
    }
    if (!button.label || button.label === '') {
      button.label = atcb_translate_hook('modal.button.default', data);
    }
    modalButton.textContent = button.label;
    modalButtons.append(modalButton);
    if (index === 0 && subEvents.length < 2 && keyboardTrigger) {
      modalButton.focus();
    }
    switch (button.type) {
      default:
      case 'close':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_log_event('closeList', 'Modal Close Button', atcbStates['active']);
            atcb_close(host);
          }),
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            atcb_log_event('closeList', 'Modal Close Button', atcbStates['active']);
            atcb_toggle(host, 'close', '', '', true);
          }
        });
        break;
      case 'yahoo2nd': // for yahoo subscribe modal, where we guide the user through the process
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_close(host);
            atcb_subscribe_yahoo_modal_switch(host, data);
          }),
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            atcb_toggle(host, 'close', '', '', true);
            atcb_subscribe_yahoo_modal_switch(host, data, keyboardTrigger);
          }
        });
        break;
      case '2timeslink': // for the note that the user shall click the button twice
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_close(host);
            atcb_generate_links(host, goto.type, data, goto.id, keyboardTrigger, false, true);
          }),
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            atcb_toggle(host, 'close', '', '', true);
            atcb_generate_links(host, goto.type, data, goto.id, keyboardTrigger, false, true);
          }
        });
        break;
      case 'none':
        break;
    }
  });
  // hide prev modal
  if (modalCount > 1) {
    const prevModal = modalHost.querySelector('.atcb-modal[data-modal-nr="' + (modalCount - 1) + '"]');
    prevModal.style.display = 'none';
  }
  // set scroll behavior
  atcb_manage_body_scroll(modalHost, modalWrapper);
}

// FUNCTION TO SWICH THE YAHOO SUBSCRIBE MODAL
function atcb_subscribe_yahoo_modal_switch(host, data, keyboardTrigger) {
  atcb_set_fully_successful(host, data);
  atcb_generate_links(host, 'yahoo2nd', data, 'all', keyboardTrigger);
}

// FUNCTION TO GENERATE A MORE DETAILED DATE BUTTON
function atcb_generate_date_button(data, parent, subEvent = 'all') {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  const fullTimeInfo = atcb_generate_timestring(data.dates, data.language, subEvent);
  const hoverText = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return atcb_translate_hook('date.status.cancelled', data) + '<br>' + atcb_translate_hook('date.status.cancelled.cta', data);
    }
    if (data.pastDateHandling != 'none') {
      if ((subEvent == 'all' && data.allOverdue) || (subEvent != 'all' && data.dates[`${subEvent}`].overdue)) {
        return atcb_translate_hook('expired', data);
      }
    }
    if (data.label && data.label != '') {
      return data.label;
    }
    return '+ ' + atcb_translate_hook('label.addtocalendar', data);
  })();
  const cancelledInfo = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return atcb_translate_hook('date.status.cancelled', data);
    }
    return '';
  })();
  const recurringString = (function () {
    if (fullTimeInfo.length == 0) {
      return atcb_translate_hook('recurring', data) + ' &#x27F3;';
    }
    return '&#x27F3;';
  })();
  let subEventAll = false;
  if (subEvent === 'all') {
    subEvent = 0;
    subEventAll = true;
  }
  const startDate = new Date(atcb_generate_time(data.dates[`${subEvent}`]).start);
  const allDay = atcb_generate_time(data.dates[`${subEvent}`]).allday;
  const timeZone = data.dates[`${subEvent}`].timeZone;
  const btnLeft = document.createElement('div');
  btnLeft.classList.add('atcb-date-btn-left');
  parent.append(btnLeft);
  const btnDay = document.createElement('div');
  btnDay.classList.add('atcb-date-btn-day');
  btnLeft.append(btnDay);
  const btnMonth = document.createElement('div');
  btnMonth.classList.add('atcb-date-btn-month');
  btnDay.textContent = (function () {
    if (allDay) {
      return startDate.toLocaleString(data.language, { day: 'numeric' });
    }
    return startDate.toLocaleString(data.language, {
      day: 'numeric',
      timeZone: timeZone,
    });
  })();
  btnMonth.textContent = (function () {
    if (allDay) {
      return startDate.toLocaleString(data.language, { month: 'short' });
    }
    return startDate.toLocaleString(data.language, {
      month: 'short',
      timeZone: timeZone,
    });
  })();
  btnLeft.append(btnMonth);
  const btnRight = document.createElement('div');
  btnRight.classList.add('atcb-date-btn-right');
  parent.append(btnRight);
  const btnDetails = document.createElement('div');
  btnDetails.classList.add('atcb-date-btn-details');
  btnRight.append(btnDetails);
  // headline
  const btnHeadline = document.createElement('div');
  btnHeadline.classList.add('atcb-date-btn-headline');
  if (data.dates.length > 1 && subEventAll) {
    btnHeadline.textContent = data.name; // show name of event series for multi-date
  } else {
    btnHeadline.textContent = data.dates[`${subEvent}`].name;
  }
  btnDetails.append(btnHeadline);
  // location line
  if ((data.dates[`${subEvent}`].location && data.dates[`${subEvent}`].location !== '' && !data.dates[`${subEvent}`].onlineEvent) || cancelledInfo !== '') {
    const btnLocation = document.createElement('div');
    btnLocation.classList.add('atcb-date-btn-content');
    btnDetails.append(btnLocation);
    if (cancelledInfo != '') {
      btnLocation.classList.add('atcb-date-btn-cancelled');
      btnLocation.textContent = cancelledInfo;
    } else {
      const btnLocationIcon = document.createElement('span');
      btnLocationIcon.classList.add('atcb-date-btn-content-icon');
      btnLocationIcon.innerHTML = atcbIcon['location'];
      btnLocation.append(btnLocationIcon);
      const btnLocationText = document.createElement('span');
      btnLocationText.classList.add('atcb-date-btn-content-location');
      btnLocationText.textContent = data.dates[`${subEvent}`].location;
      btnLocation.append(btnLocationText);
    }
  } else {
    // in case we would not show date details as well, show description instead
    if (data.dates[`${subEvent}`].description !== '' && fullTimeInfo.length === 0 && (!data.recurrence || data.recurrence === '')) {
      const btnDescription = document.createElement('div');
      btnDescription.classList.add('atcb-date-btn-content');
      btnDescription.textContent = data.dates[`${subEvent}`].description;
      btnDescription.style.cssText = 'overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;';
      btnDetails.append(btnDescription);
    } else {
      // in other cases, at least give the headline the option to grow
      btnHeadline.style.cssText = '-webkit-line-clamp: 2;';
      // and center, if nothing else is here
      if (fullTimeInfo.length == 0 && (data.recurrence == null || data.recurrence == '')) {
        btnRight.style.alignSelf = 'center';
        btnHeadline.style.cssText = 'text-align: center; -webkit-line-clamp: 2;';
      }
    }
  }
  // datetime line
  if (fullTimeInfo.length > 0 || (data.recurrence != null && data.recurrence != '')) {
    const btnDateTime = document.createElement('div');
    btnDateTime.classList.add('atcb-date-btn-content');
    btnDetails.append(btnDateTime);
    const btnDateTimeIcon = document.createElement('span');
    btnDateTimeIcon.classList.add('atcb-date-btn-content-icon');
    btnDateTimeIcon.innerHTML = atcbIcon['ical'];
    btnDateTime.append(btnDateTimeIcon);
    const btnDateTimeText = document.createElement('span');
    btnDateTimeText.classList.add('atcb-date-btn-content-text');
    btnDateTime.append(btnDateTimeText);
    fullTimeInfo.forEach(function (block) {
      const btnDateTimeTextBlock = document.createElement('span');
      btnDateTimeTextBlock.textContent = block;
      btnDateTimeText.append(btnDateTimeTextBlock);
    });
    if (data.recurrence != null && data.recurrence != '') {
      const recurSign = document.createElement('span');
      recurSign.innerHTML = recurringString;
      btnDateTimeText.append(recurSign);
    }
  }
  // hover text
  const btnHover = document.createElement('div');
  btnHover.classList.add('atcb-date-btn-hover');
  btnHover.innerHTML = hoverText;
  btnRight.append(btnHover);
  if (!data.hideCheckmark) {
    const btnCheck = document.createElement('div');
    btnCheck.classList.add('atcb-checkmark');
    btnCheck.innerHTML = atcbIcon['checkmark'];
    parent.append(btnCheck);
  }
}

// FUNCTION TO BUILD A SECOND SHADOWDOM FOR MODALS
function atcb_generate_modal_host(host, data, reset = true) {
  // to clean-up the stage, we first close anything left open
  const existingModalHost = document.getElementById(data.identifier + '-modal-host');
  if (!reset && existingModalHost) {
    // return existing one, if we do not want to rebuild
    return existingModalHost.shadowRoot;
  }
  if (existingModalHost) {
    existingModalHost.remove();
  }
  // create host element and add shadowDOM
  let newModalHost = document.createElement('div');
  newModalHost.id = data.identifier + '-modal-host';
  if (data.styleLight) {
    newModalHost.setAttribute('styleLight', data.styleLight);
  }
  if (data.styleDark) {
    newModalHost.setAttribute('styleDark', data.styleDark);
  }
  if (host.host.hasAttribute('cspnonce')) {
    newModalHost.setAttribute('cspnonce', host.host.getAttribute('cspnonce'));
  }
  newModalHost.setAttribute('atcb-button-id', data.identifier);
  newModalHost.setAttribute('style', 'transform:translate3D(0, 0, 0);visibility:visible;opacity:1;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;z-index:13999998;');
  document.body.append(newModalHost);
  newModalHost.attachShadow({ mode: 'open', delegateFocus: true });
  const elem = document.createElement('template');
  elem.innerHTML = '<div class="atcb-modal-host-initialized" style="translate3D(0, 0, 0);visibility:visible;opacity:1;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;z-index:13999999;"></div>';
  newModalHost.shadowRoot.append(elem.content.cloneNode(true));
  atcb_set_light_mode(newModalHost.shadowRoot, data);
  atcb_load_css(newModalHost.shadowRoot, null, data);
  return newModalHost.shadowRoot;
}

// FUNCTION TO COPY THE BUTTON TO A SECOND SHADOWDOM TO FORCE OVERLAY
function atcb_generate_overlay_dom(host, data) {
  const newHost = atcb_generate_modal_host(host, data);
  atcb_set_fullsize(newHost.querySelector('.atcb-modal-host-initialized'));
  // get all top-level nodes from host
  const nodes = Array.from(host.children);
  // duplicate all nodes into newHost, except for any style tag
  nodes.forEach((node) => {
    if (node.tagName != 'STYLE') {
      newHost.querySelector('.atcb-modal-host-initialized').append(node.cloneNode(true));
    }
  });
  // remove the id from the <button> to prevent duplicate ids
  newHost.querySelector('button.atcb-button').removeAttribute('id');
  // set the opacity of the original button to 0
  host.host.classList.add('atcb-shadow-hide');
  host.querySelector('.atcb-initialized').style.opacity = '0';
  // set the dimension and position of the .atcb-initialized to the one in the original host
  atcb_position_shadow_button(host, newHost);
  // listener for any scroll activity
  window.addEventListener('scroll', atcb_position_shadow_button_listener);
  window.addEventListener('resize', atcb_position_shadow_button_listener);
  return newHost.querySelector('.atcb-modal-host-initialized');
}

export { atcb_generate_label, atcb_generate_button, atcb_generate_dropdown_list, atcb_create_modal, atcb_generate_bg_overlay, atcb_generate_overlay_dom, atcb_create_atcbl, atcb_generate_modal_host };
