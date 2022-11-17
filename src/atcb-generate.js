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

import { atcbIcon, atcbStates, atcbDefaultTarget } from './atcb-globals.js';
import { atcb_toggle, atcb_close } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links.js';
import {
  atcb_generate_time,
  atcb_secure_url,
  atcb_manage_body_scroll,
  atcb_set_fullsize,
  atcb_set_sizes,
  atcb_debounce,
  atcb_debounce_leading,
} from './atcb-util.js';
import { atcb_set_fully_successful } from './atcb-links';
import { atcb_translate_hook } from './atcb-i18n.js';

// GENERATE THE ACTUAL BUTTON
// helper function to generate the labels for the button and list options
function atcb_generate_label(host, data, parent, type, icon = false, text = '', oneOption = false) {
  // setting IDs and adding event listeners
  switch (type) {
    case 'trigger':
    default:
      parent.id = data.identifier;
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle(host, 'auto', data, parent, true, true);
        }
      });
      parent.addEventListener(
        'touchend',
        atcb_debounce_leading((event) => {
          event.preventDefault();
          atcb_toggle(host, 'auto', data, parent, false, true);
        })
      );
      if (data.trigger === 'click') {
        parent.addEventListener(
          'mouseup',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            atcb_toggle(host, 'auto', data, parent, false, true);
          })
        );
      } else {
        parent.addEventListener(
          'mouseenter',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            atcb_toggle(host, 'open', data, parent, false, true);
          })
        );
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
      parent.addEventListener(
        'click',
        atcb_debounce_leading(() => {
          if (oneOption) {
            atcbStates['active'] = host.host.getAttribute('atcb-button-id');
            host.querySelector('#' + parent.id).blur();
          } else {
            atcb_toggle(host, 'close');
          }
          atcb_generate_links(host, type, data);
        })
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          if (oneOption) {
            atcbStates['active'] = host.host.getAttribute('atcb-button-id');
            host.querySelector('#' + parent.id).blur();
          } else {
            atcb_toggle(host, 'close');
          }
          atcb_generate_links(host, type, data, 'all', true);
        }
      });
      break;
    case 'close':
      parent.id = data.identifier + '-close';
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          atcb_toggle(host, 'close');
        })
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle(host, 'close', data, 'all', true);
        }
      });
      break;
  }
  // set icon and text
  atcb_generate_label_content(data, parent, type, icon, text, oneOption);
}

function atcb_generate_label_content(data, parent, type, icon, text, oneOption) {
  const defaultTriggerText = atcb_translate_hook('Add to Calendar', data);
  // if there is only 1 option, we use the trigger text on the option label. Therefore, forcing it here
  if (oneOption && text == '') {
    text = defaultTriggerText;
  }
  // defining text labels
  const labelText = {
    trigger: text || defaultTriggerText,
    apple: text || 'Apple',
    google: text || 'Google',
    ical: text || atcb_translate_hook('iCal File', data),
    msteams: text || 'Microsoft Teams',
    ms365: text || 'Microsoft 365',
    outlookcom: text || 'Outlook.com',
    yahoo: text || 'Yahoo',
    close: atcb_translate_hook('Close', data),
  };
  text = labelText[`${type}`];
  // add icon and text label (not in the date style trigger case)
  if (data.buttonStyle == 'date' && (type == 'trigger' || oneOption)) {
    return;
  }
  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('atcb-icon');
    iconEl.innerHTML = atcbIcon[`${type}`];
    parent.append(iconEl);
  }
  if (
    ((type == 'trigger' || oneOption) && data.textLabelButton == true) ||
    (!oneOption && type != 'trigger' && data.textLabelList == true)
  ) {
    const textEl = document.createElement('span');
    textEl.classList.add('atcb-text');
    textEl.textContent = text;
    parent.append(textEl);
  }
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
  optionSplit.forEach(function (option) {
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
    if (data.textLabelButton == false) {
      buttonTrigger.classList.add('atcb-no-text');
    }
    if (data.trigger === 'click') {
      buttonTrigger.classList.add('atcb-click');
    }
    if (data.listStyle === 'overlay') {
      buttonTrigger.classList.add('atcb-dropoverlay');
    }
    buttonTrigger.type = 'button';
    buttonTriggerWrapper.append(buttonTrigger);
    // generate the label incl. eventListeners
    if (data.buttonStyle == 'date') {
      atcb_generate_date_button(data, buttonTrigger);
    }
    // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text (small exception for the date style)
    if (oneOption) {
      buttonTrigger.classList.add('atcb-single');
      atcb_generate_label(host, data, buttonTrigger, option, data.iconButton, data.label, true);
      // override the id for the oneOption button, since the button always needs to have the button id, while it received the option id from the labeling function
      buttonTrigger.id = data.identifier;
      // but in case we simply render one button per option, only use the identifier for the first one and also add the info for the option
      if (data.buttonsList) {
        buttonTrigger.id = data.identifier + '-' + option;
      }
    } else {
      atcb_generate_label(host, data, buttonTrigger, 'trigger', data.iconButton, data.label);
      // create an empty anchor div to place the dropdown, while the position can be defined via CSS
      const buttonDropdownAnchor = document.createElement('div');
      buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
      buttonTrigger.append(buttonDropdownAnchor);
    }
    // add checkmark (hidden first)
    if (data.checkmark && data.textLabelButton && !data.buttonsList) {
      const btnCheck = document.createElement('div');
      btnCheck.classList.add('atcb-checkmark');
      btnCheck.innerHTML = atcbIcon['checkmark'];
      buttonTrigger.append(btnCheck);
    }
  });
  console.log('Add to Calendar Button "' + data.identifier + '" created');
}

// generate schema.org rich data
// see https://developers.google.com/search/docs/advanced/structured-data/event for more details on how this affects Google search results
// multi-date events are not 100% compliant with schema.org, since this is still a little broken and not supported by Google
function atcb_generate_rich_data(data, parent) {
  const schemaEl = document.createElement('script');
  schemaEl.type = 'application/ld+json';
  const schemaContentMulti = [];
  if (data.dates.length > 1) {
    const parts = [];
    parts.push('"@context":"https://schema.org"');
    parts.push('"@type":"EventSeries"');
    parts.push('"@id":"' + data.name.replace(/\s/g, '') + '"');
    parts.push('"name":"' + data.name + '",');
    schemaContentMulti.push('{\r\n' + parts.join(',\r\n') + '\r\n');
  }
  const schemaContentFull = [];
  for (let i = 0; i < data.dates.length; i++) {
    const schemaContent = [];
    schemaContent.push('"@context":"https://schema.org"');
    schemaContent.push('"@type":"Event"');
    if (data.dates.length > 1) {
      schemaContent.push('"@id":"' + data.name.replace(/\s/g, '') + '-' + (i + 1) + '"');
    }
    if (data.dates[`${i}`].status == 'CANCELLED') {
      schemaContent.push('"eventStatus":"https://schema.org/EventCancelled"');
    }
    schemaContent.push('"name":"' + data.dates[`${i}`].name + '"');
    if (data.dates[`${i}`].descriptionHtmlFree) {
      schemaContent.push('"description":"' + data.dates[`${i}`].descriptionHtmlFree + '"');
    }
    const formattedDate = atcb_generate_time(data.dates[`${i}`], 'delimiters', 'general', true);
    schemaContent.push('"startDate":"' + formattedDate.start + '"');
    if (formattedDate.duration != null) {
      schemaContent.push('"duration":"' + formattedDate.duration + '"');
    }
    schemaContent.push(
      data.dates[`${i}`].location.startsWith('http')
        ? '"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode",\r\n"location": {\r\n"@type":"VirtualLocation",\r\n"url":"' +
            data.dates[`${i}`].location +
            '"\r\n}'
        : '"location":"' + data.dates[`${i}`].location + '"'
    );
    if (data.recurrence != null && data.recurrence != '') {
      schemaContent.push(...atcb_generate_rich_data_recurrence(data, formattedDate));
    } else {
      schemaContent.push('"endDate":"' + formattedDate.end + '"');
    }
    if (data.dates[`${i}`].organizer != null && data.dates[`${i}`].organizer != '') {
      const organizerParts = data.dates[`${i}`].organizer.split('|');
      schemaContent.push(
        '"organizer":{\r\n"@type":"Person",\r\n"name":"' +
          organizerParts[0] +
          '",\r\n"email":"' +
          organizerParts[1] +
          '"\r\n}'
      );
    }
    const imageData = [];
    if (data.images != null) {
      if (Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          if (atcb_secure_url(data.images[`${i}`]) && data.images[`${i}`].startsWith('http')) {
            imageData.push('"' + data.images[`${i}`] + '"');
          }
        }
      }
    } else {
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/1x1.png"');
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/4x3.png"');
      imageData.push('"https://add-to-calendar-button.com/demo_assets/img/16x9.png"');
    }
    if (imageData.length > 0) {
      schemaContent.push('"image":[\r\n' + imageData.join(',\r\n') + ']');
    }
    schemaContentFull.push('{\r\n' + schemaContent.join(',\r\n') + '\r\n}');
  }
  if (data.dates.length > 1) {
    schemaEl.textContent =
      schemaContentMulti.join(',\r\n') + '"subEvents":[\r\n' + schemaContentFull.join(',\r\n') + '\r\n]\r\n}';
  } else {
    schemaEl.textContent = schemaContentFull[0];
  }
  parent.parentNode.insertBefore(schemaEl, parent);
}

function atcb_generate_rich_data_recurrence(data, formattedDate) {
  const schemaRecurrenceContent = [];
  schemaRecurrenceContent.push('"eventSchedule": { "@type": "Schedule"');
  if (data.dates[0].timeZone != null && data.dates[0].timeZone != '') {
    schemaRecurrenceContent.push('"scheduleTimezone":"' + data.dates[0].timeZone + '"');
  }
  const repeatFrequency = 'P' + data.recurrence_interval + data.recurrence_frequency.substr(0, 1);
  schemaRecurrenceContent.push('"repeatFrequency":"' + repeatFrequency + '"');
  if (data.recurrence_byDay != null && data.recurrence_byDay != '') {
    const byDayString = (function () {
      if (/\d/.test(data.recurrence_byDay)) {
        return '"' + data.recurrence_byDay + '"';
      } else {
        const byDays = data.recurrence_byDay.split(',');
        const helperMap = {
          MO: 'https://schema.org/Monday',
          TU: 'https://schema.org/Tuesday',
          WE: 'https://schema.org/Wednesday',
          TH: 'https://schema.org/Thursday',
          FR: 'https://schema.org/Friday',
          SA: 'https://schema.org/Saturday',
          SU: 'https://schema.org/Sunday',
        };
        const output = [];
        for (let i = 0; i < byDays.length; i++) {
          output.push('"' + helperMap[byDays[`${i}`]] + '"');
        }
        return '[' + output.join(',') + ']';
      }
    })();
    schemaRecurrenceContent.push('"byDay":' + byDayString);
  }
  if (data.recurrence_byMonth != null && data.recurrence_byMonth != '') {
    const byMonthString = data.recurrence_byMonth.includes(',')
      ? '[' + data.recurrence_byMonth + ']'
      : data.recurrence_byMonth;
    schemaRecurrenceContent.push('"byMonth":"' + byMonthString + '"');
  }
  if (data.recurrence_byMonthDay != null && data.recurrence_byMonthDay != '') {
    const byMonthDayString = data.recurrence_byMonthDay.includes(',')
      ? '[' + data.recurrence_byMonthDay + ']'
      : data.recurrence_byMonthDay;
    schemaRecurrenceContent.push('"byMonthDay":"' + byMonthDayString + '"');
  }
  if (data.recurrence_count != null && data.recurrence_count != '') {
    schemaRecurrenceContent.push('"repeatCount":"' + data.recurrence_count + '"');
  }
  if (data.recurrence_until != null && data.recurrence_until != '') {
    schemaRecurrenceContent.push('"endDate":"' + data.recurrence_until + '"');
  }
  if (data.startTime != null && data.startTime != '' && data.endTime != null && data.endTime != '') {
    schemaRecurrenceContent.push('"startTime":"' + data.startTime + ':00"');
    schemaRecurrenceContent.push('"endTime":"' + data.endTime + ':00"');
    schemaRecurrenceContent.push('"duration":"' + formattedDate.duration + '"');
  }
  schemaRecurrenceContent.push('"startDate":"' + data.startDate + '" }');
  return schemaRecurrenceContent;
}

// generate the dropdown list (can also appear wihtin a modal, if option is set)
function atcb_generate_dropdown_list(host, data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  if (data.rtl) {
    optionsList.classList.add('atcb-rtl');
  }
  // generate the list items
  let listCount = 0;
  data.options.forEach(function (option) {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.append(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(host, data, optionItem, option, data.iconList, data.optionLabels[listCount - 1]);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.append(optionItem);
    atcb_generate_label(host, data, optionItem, 'close', data.iconList);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
function atcb_generate_bg_overlay(host, trigger = '', darken = true) {
  const bgOverlay = document.createElement('div');
  bgOverlay.id = 'atcb-bgoverlay';
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.tabIndex = 0;
  bgOverlay.addEventListener(
    'mouseup',
    atcb_debounce_leading((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle(host, 'close');
    })
  );
  let fingerMoved = false;
  bgOverlay.addEventListener(
    'touchstart',
    atcb_debounce_leading(() => (fingerMoved = false)),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'touchmove',
    atcb_debounce_leading(() => (fingerMoved = true)),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'touchend',
    atcb_debounce((e) => {
      if (fingerMoved !== false || e.target !== e.currentTarget) return;
      atcb_toggle(host, 'close');
    }),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'focus',
    atcb_debounce((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle(host, 'close');
    })
  );
  if (trigger !== 'click') {
    bgOverlay.addEventListener(
      'mousemove',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_toggle(host, 'close');
      })
    );
  } else {
    // if trigger is not set to 'click', we render a close icon, when hovering over the background
    bgOverlay.classList.add('atcb-click');
  }
  return bgOverlay;
}

// SMALL LOGO
function atcb_create_atcbl(host, atList = true) {
  const atcbL = document.createElement('div');
  atcbL.id = 'add-to-calendar-button-reference';
  atcbL.style.width = '130px';
  atcbL.style.padding = '5px';
  atcbL.style.height = 'auto';
  atcbL.style.opacity = '.8';
  atcbL.style.transform = 'translate3d(0, 0, 0)';
  atcbL.style.zIndex = '15000000';
  setTimeout(() => {
    atcbL.innerHTML =
      '<a href="https://add-to-calendar-pro.com" target="_blank" rel="noopener">' + atcbIcon['atcb'] + '</a>';
  }, 500);
  if (atList) {
    host.querySelector('.atcb-initialized .atcb-list-wrapper').append(atcbL);
  } else {
    if (window.innerHeight > 1000 || window.innerWidth > 1000) {
      host.append(atcbL);
      atcbL.style.position = 'fixed';
      atcbL.style.bottom = '15px';
      atcbL.style.right = '30px';
    }
  }
}

// FUNCTION TO CREATE MODALS
// this is only about special communication modals - not the list style modal
function atcb_create_modal(
  host,
  data,
  icon = '',
  headline,
  content = '',
  buttons = [],
  subEvents = [],
  keyboardTrigger = false
) {
  // setting the stage
  const bgOverlay = (function () {
    const el = host.getElementById('atcb-bgoverlay');
    if (!el) {
      return atcb_generate_bg_overlay(host, 'click', data.background);
    } else {
      return el;
    }
  })();
  host.append(bgOverlay);
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('atcb-modal');
  bgOverlay.append(modalWrapper);
  const modalCount = host.querySelectorAll('.atcb-modal').length;
  modalWrapper.dataset.modalNr = modalCount;
  modalWrapper.tabIndex = 0;
  modalWrapper.focus({ preventScroll: true });
  modalWrapper.blur();
  const parentButton = host.getElementById(data.identifier);
  if (parentButton != null) {
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
  if (icon != '' && data.iconModal == true) {
    const modalIcon = document.createElement('div');
    modalIcon.classList.add('atcb-modal-icon');
    modalIcon.innerHTML = atcbIcon[`${icon}`];
    modal.append(modalIcon);
  }
  // add headline
  const modalHeadline = document.createElement('div');
  modalHeadline.classList.add('atcb-modal-headline');
  modalHeadline.textContent = headline;
  modal.append(modalHeadline);
  // add text content
  if (content != '') {
    const modalContent = document.createElement('div');
    modalContent.classList.add('atcb-modal-content');
    modalContent.innerHTML = content;
    modal.append(modalContent);
  }
  // add subEvent buttons (array with type first and subEvent numbers following)
  if (subEvents.length > 1) {
    if (data.branding) {
      atcb_create_atcbl(host, false);
    }
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
      if (i == 1 && keyboardTrigger) {
        modalSubEventButton.focus();
      }
      modalSubEventButton.addEventListener(
        'click',
        atcb_debounce(() => {
          atcb_generate_links(host, subEvents[0], data, subEvents[`${i}`], keyboardTrigger, true);
        })
      );
    }
  }
  // add buttons (array of objects; attributes: href, type, label, primary(boolean))
  if (buttons.length == 0) {
    buttons.push({ type: 'close', label: atcb_translate_hook('Close', data) });
  }
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('atcb-modal-buttons');
  modal.append(modalButtons);
  buttons.forEach((button, index) => {
    let modalButton;
    if (button.href != null && button.href != '') {
      modalButton = document.createElement('a');
      modalButton.setAttribute('target', atcbDefaultTarget);
      modalButton.setAttribute('href', button.href);
      modalButton.setAttribute('rel', 'noopener');
    } else {
      modalButton = document.createElement('button');
      modalButton.type = 'button';
    }
    modalButton.classList.add('atcb-modal-btn');
    if (button.primary) {
      modalButton.classList.add('atcb-modal-btn-primary');
    }
    if (button.label == null || button.label == '') {
      button.label = atcb_translate_hook('Click me', data);
    }
    modalButton.textContent = button.label;
    modalButtons.append(modalButton);
    if (index == 0 && subEvents.length < 2 && keyboardTrigger) {
      modalButton.focus();
    }
    switch (button.type) {
      default:
      case 'close':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => atcb_close(host))
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key == 'Enter') {
            atcb_toggle(host, 'close', '', '', true);
          }
        });
        break;
      case 'yahoo2nd':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_close(host);
            atcb_subscribe_yahoo_modal_switch(host, data);
          })
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key == 'Enter') {
            atcb_toggle(host, 'close', '', '', true);
            atcb_subscribe_yahoo_modal_switch(host, data, keyboardTrigger);
          }
        });
        break;
      case 'none':
        break;
    }
  });
  // hide prev modal
  if (modalCount > 1) {
    const prevModal = host.querySelector('.atcb-modal[data-modal-nr="' + (modalCount - 1) + '"]');
    prevModal.style.display = 'none';
  }
  // set scroll behavior
  atcb_manage_body_scroll(host, modalWrapper);
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
  const fullTimeInfo = (function () {
    let startDateInfo, endDateInfo, timeZoneInfoStart, timeZoneInfoEnd;
    let formattedTimeStart = {};
    let formattedTimeEnd = {};
    if (subEvent == 'all') {
      formattedTimeStart = atcb_generate_time(data.dates[0]);
      formattedTimeEnd = atcb_generate_time(data.dates[data.dates.length - 1]);
      timeZoneInfoStart = data.dates[0].timeZone;
      timeZoneInfoEnd = data.dates[data.dates.length - 1].timeZone;
    } else {
      formattedTimeStart = atcb_generate_time(data.dates[`${subEvent}`]);
      formattedTimeEnd = formattedTimeStart;
      timeZoneInfoStart = data.dates[`${subEvent}`].timeZone;
      timeZoneInfoEnd = timeZoneInfoStart;
    }
    startDateInfo = new Date(formattedTimeStart.start);
    endDateInfo = new Date(formattedTimeEnd.end);
    // set UTC for undefined cases or allday events to prevent any time zone mismatches
    if (timeZoneInfoStart == undefined || timeZoneInfoStart == '' || formattedTimeStart.allday) {
      timeZoneInfoStart = 'UTC';
    }
    if (timeZoneInfoEnd == undefined || timeZoneInfoEnd == '' || formattedTimeEnd.allday) {
      timeZoneInfoEnd = 'UTC';
    }
    let timeString = '';
    let timeZoneInfoStringStart = '';
    let timeZoneInfoStringEnd = '';
    if (
      !formattedTimeStart.allday &&
      Intl.DateTimeFormat().resolvedOptions().timeZone != timeZoneInfoStart &&
      timeZoneInfoStart != timeZoneInfoEnd
    ) {
      timeZoneInfoStringStart = ' (' + timeZoneInfoStart + ')';
    }
    if (
      (!formattedTimeEnd.allday && Intl.DateTimeFormat().resolvedOptions().timeZone != timeZoneInfoEnd) ||
      timeZoneInfoStart != timeZoneInfoEnd
    ) {
      timeZoneInfoStringEnd = ' (' + timeZoneInfoEnd + ')';
    }
    const formatOptionsStart = get_format_options(timeZoneInfoStart);
    const formatOptionsEnd = get_format_options(timeZoneInfoEnd);
    if (
      startDateInfo.getFullYear() === endDateInfo.getFullYear() &&
      startDateInfo.getMonth() === endDateInfo.getMonth() &&
      startDateInfo.getDate() === endDateInfo.getDate()
    ) {
      if (formattedTimeStart.allday) {
        timeString = startDateInfo.toLocaleDateString(data.language, formatOptionsStart.DateShort);
      } else {
        timeString =
          startDateInfo.toLocaleString(data.language, formatOptionsStart.DateTimeShort) +
          timeZoneInfoStringStart +
          ' - ' +
          endDateInfo.toLocaleTimeString(data.language, formatOptionsEnd.Time) +
          timeZoneInfoStringEnd;
      }
    } else {
      if (formattedTimeStart.allday) {
        timeString = startDateInfo.toLocaleDateString(data.language, formatOptionsStart.DateShort);
      } else {
        timeString = startDateInfo.toLocaleString(data.language, formatOptionsStart.DateTimeShort);
      }
      timeString += timeZoneInfoStringStart + ' - ';
      if (formattedTimeEnd.allday) {
        timeString += endDateInfo.toLocaleDateString(data.language, formatOptionsEnd.DateLong);
      } else {
        timeString += endDateInfo.toLocaleString(data.language, formatOptionsEnd.DateTimeLong);
      }
      timeString += timeZoneInfoStringEnd;
    }
    return timeString;
  })();
  const hoverText = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return (
        atcb_translate_hook('Cancelled Date', data) +
        '<br>' +
        atcb_translate_hook('Delete from Calendar', data)
      );
    }
    return '+ ' + atcb_translate_hook('Add to Calendar', data);
  })();
  const cancelledInfo = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return atcb_translate_hook('Cancelled Date', data);
    }
    return '';
  })();
  if (subEvent == 'all') {
    subEvent = 0;
  }
  const startDate = new Date(data.dates[`${subEvent}`].startDate);
  const timeZone = (function () {
    if (data.dates[`${subEvent}`].timeZone != null && data.dates[`${subEvent}`].timeZone != '') {
      return data.dates[`${subEvent}`].timeZone;
    } else {
      return 'UTC';
    }
  })();
  const btnLeft = document.createElement('div');
  btnLeft.classList.add('atcb-date-btn-left');
  parent.append(btnLeft);
  const btnDay = document.createElement('div');
  btnDay.classList.add('atcb-date-btn-day');
  btnLeft.append(btnDay);
  const btnMonth = document.createElement('div');
  btnMonth.classList.add('atcb-date-btn-month');
  btnDay.textContent = startDate.toLocaleString(data.language, {
    day: 'numeric',
    timeZone: timeZone,
  });
  btnMonth.textContent = startDate.toLocaleString(data.language, {
    month: 'short',
    timeZone: timeZone,
  });
  btnLeft.append(btnMonth);
  const btnRight = document.createElement('div');
  btnRight.classList.add('atcb-date-btn-right');
  parent.append(btnRight);
  const btnDetails = document.createElement('div');
  btnDetails.classList.add('atcb-date-btn-details');
  btnRight.append(btnDetails);
  const btnHeadline = document.createElement('div');
  btnHeadline.classList.add('atcb-date-btn-headline');
  btnHeadline.textContent = data.dates[`${subEvent}`].name;
  btnDetails.append(btnHeadline);
  if ((data.location != null && data.location != '') || cancelledInfo != '') {
    const btnLocation = document.createElement('div');
    btnLocation.classList.add('atcb-date-btn-content');
    btnDetails.append(btnLocation);
    if (cancelledInfo != '') {
      btnLocation.textContent = cancelledInfo;
      btnLocation.style.fontWeight = '600';
      btnLocation.style.color = '#9c1a23';
    } else {
      btnLocation.classList.add('atcb-date-btn-content-location');
      const btnLocationIcon = document.createElement('span');
      btnLocationIcon.classList.add('atcb-date-btn-content-icon');
      btnLocationIcon.innerHTML = atcbIcon['location'];
      btnLocation.append(btnLocationIcon);
      const btnLocationText = document.createElement('span');
      btnLocationText.textContent = data.location;
      btnLocation.append(btnLocationText);
    }
  }
  const btnDateTime = document.createElement('div');
  btnDateTime.classList.add('atcb-date-btn-content');
  btnDetails.append(btnDateTime);
  const btnDateTimeIcon = document.createElement('span');
  btnDateTimeIcon.classList.add('atcb-date-btn-content-icon');
  btnDateTimeIcon.innerHTML = atcbIcon['ical'];
  btnDateTime.append(btnDateTimeIcon);
  const btnDateTimeText = document.createElement('span');
  btnDateTimeText.textContent = fullTimeInfo;
  btnDateTime.append(btnDateTimeText);
  if (data.recurrence != null && data.recurrence != '') {
    const recurSign = document.createElement('span');
    recurSign.classList.add('atcb-date-btn-content-recurr-icon');
    btnDateTime.append(recurSign);
    recurSign.innerHTML = '&#x27F3;';
  }
  const btnHover = document.createElement('div');
  btnHover.classList.add('atcb-date-btn-hover');
  btnHover.innerHTML = hoverText;
  btnRight.append(btnHover);
  if (data.checkmark) {
    const btnCheck = document.createElement('div');
    btnCheck.classList.add('atcb-checkmark');
    btnCheck.innerHTML = atcbIcon['checkmark'];
    parent.append(btnCheck);
  }
}

function get_format_options(timeZoneInfo) {
  return {
    DateShort: {
      timeZone: timeZoneInfo,
      year: 'numeric',
    },
    DateLong: {
      timeZone: timeZoneInfo,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    DateTimeShort: {
      timeZone: timeZoneInfo,
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h23',
    },
    DateTimeLong: {
      timeZone: timeZoneInfo,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h23',
    },
    Time: {
      timeZone: timeZoneInfo,
      hour: 'numeric',
      minute: '2-digit',
      hourCycle: 'h23',
    },
  };
}

export {
  atcb_generate_label,
  atcb_generate_button,
  atcb_generate_dropdown_list,
  atcb_create_modal,
  atcb_generate_bg_overlay,
  atcb_create_atcbl,
  atcb_generate_rich_data,
};
