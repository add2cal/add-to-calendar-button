/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 1.18.4
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
function atcb_generate_label(data, parent, type, icon = false, text = '', oneOption = false) {
  // setting IDs and adding event listeners
  switch (type) {
    case 'trigger':
    default:
      parent.id = data.identifier;
      if (data.trigger === 'click') {
        parent.addEventListener('click', (event) => {
          event.preventDefault();
          atcb_toggle('auto', data, parent, false, true);
        });
      } else {
        parent.addEventListener('touchend', (event) => {
          event.preventDefault();
          atcb_toggle('auto', data, parent, false, true);
        });
        parent.addEventListener(
          'mouseenter',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            atcb_toggle('open', data, parent, false, true);
          })
        );
      }
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle('auto', data, parent, true, true);
        }
      });
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
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_links(type, data);
        })
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_links(type, data, 'all', true);
        }
      });
      break;
    case 'close':
      parent.id = data.identifier + '-close';
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          atcb_toggle('close');
        })
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle('close', data, 'all', true);
        }
      });
      break;
  }
  // override the id for the oneOption button, since the button always needs to have the button id
  if (oneOption) {
    parent.id = data.identifier;
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
  // defining labels
  switch (type) {
    case 'trigger':
    default:
      text = text || defaultTriggerText;
      break;
    case 'apple':
      text = text || 'Apple';
      break;
    case 'google':
      text = text || 'Google';
      break;
    case 'ical':
      text = text || atcb_translate_hook('iCal File', data);
      break;
    case 'msteams':
      text = text || 'Microsoft Teams';
      break;
    case 'ms365':
      text = text || 'Microsoft 365';
      break;
    case 'outlookcom':
      text = text || 'Outlook.com';
      break;
    case 'yahoo':
      text = text || 'Yahoo';
      break;
    case 'close':
      text = atcb_translate_hook('Close', data);
      break;
  }
  // add icon and text label (not in the date style trigger case)
  if (data.buttonStyle == 'date' && (type == 'trigger' || oneOption)) {
    return;
  }
  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('atcb-icon');
    iconEl.innerHTML = atcbIcon[`${type}`];
    parent.appendChild(iconEl);
  }
  if (
    (type == 'trigger' && data.textLabelButton == true) ||
    (type != 'trigger' && data.textLabelList == true)
  ) {
    const textEl = document.createElement('span');
    textEl.classList.add('atcb-text');
    textEl.textContent = text;
    parent.appendChild(textEl);
  }
}

// generate the triggering button
function atcb_generate_button(button, data) {
  // clean the placeholder
  button.textContent = '';
  // create schema.org data, if possible (https://schema.org/Event)
  if (data.richData && data.name && data.dates[0].location && data.dates[0].startDate) {
    atcb_generate_rich_data(data, button);
  }
  // generate the wrapper div
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  buttonTriggerWrapper.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    buttonTriggerWrapper.classList.add('atcb-rtl');
  }
  button.appendChild(buttonTriggerWrapper);
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
  buttonTriggerWrapper.appendChild(buttonTrigger);
  // generate the label incl. eventListeners
  if (data.buttonStyle == 'date') {
    atcb_generate_date_button(data, buttonTrigger);
  }
  // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text (small exception for the date style)
  if (data.options.length === 1) {
    buttonTrigger.classList.add('atcb-single');
    atcb_generate_label(data, buttonTrigger, data.options[0], data.iconButton, data.label, true);
  } else {
    atcb_generate_label(data, buttonTrigger, 'trigger', data.iconButton, data.label);
    // create an empty anchor div to place the dropdown, while the position can be defined via CSS
    const buttonDropdownAnchor = document.createElement('div');
    buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
    buttonTrigger.appendChild(buttonDropdownAnchor);
  }
  // add checkmark (hidden first)
  if (data.checkmark) {
    const btnCheck = document.createElement('div');
    btnCheck.classList.add('atcb-checkmark');
    btnCheck.innerHTML = atcbIcon['checkmark'];
    buttonTrigger.appendChild(btnCheck);
  }
  // update the placeholder class to prevent multiple initializations
  button.classList.remove('atcb');
  button.classList.add('atcb-initialized');
  // show the placeholder div
  if (data.inline) {
    button.style.display = 'inline-block';
  } else {
    button.style.display = 'block';
  }
  console.log('Add to Calendar Button "' + data.identifier + '" created');
}

// generate schema.org rich data
// see https://developers.google.com/search/docs/advanced/structured-data/event for more details on how this affects Google search results
// multi-date events are not 100% compliant with schema.org, since this is still a little broken and not supported by Google
function atcb_generate_rich_data(data, button) {
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
  button.appendChild(schemaEl);
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
function atcb_generate_dropdown_list(data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  optionsList.classList.add('atcb-' + data.lightMode);
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
    optionsList.appendChild(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(data, optionItem, option, data.iconList, data.optionLabels[listCount - 1]);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.tabIndex = 0;
    optionsList.appendChild(optionItem);
    atcb_generate_label(data, optionItem, 'close', data.iconList);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
function atcb_generate_bg_overlay(listStyle = 'dropdown', trigger = '', lightMode = 'light', darken = true) {
  const bgOverlay = document.createElement('div');
  bgOverlay.id = 'atcb-bgoverlay';
  if (listStyle !== 'modal' && darken) {
    bgOverlay.classList.add('atcb-animate-bg');
  }
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.classList.add('atcb-' + lightMode);
  bgOverlay.tabIndex = 0;
  bgOverlay.addEventListener(
    'click',
    atcb_debounce((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle('close');
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
      atcb_toggle('close');
    }),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'focus',
    atcb_debounce_leading((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle('close');
    })
  );
  if (trigger !== 'click') {
    bgOverlay.addEventListener(
      'mousemove',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_toggle('close');
      })
    );
  } else {
    // if trigger is not set to 'click', we render a close icon, when hovering over the background
    bgOverlay.classList.add('atcb-click');
  }
  return bgOverlay;
}

// SMALL LOGO
function atcb_create_atcbl(atList = true) {
  /*const atcbL = document.createElement('div');
  atcbL.id = 'add-to-calendar-button-reference';
  atcbL.style.width = '150px';
  atcbL.style.padding = '10px 0';
  atcbL.style.height = 'auto';
  atcbL.style.transform = 'translate3d(0, 0, 0)';
  atcbL.style.zIndex = '15000000';
  setTimeout(() => {
    atcbL.innerHTML =
      '<a href="https://add-to-calendar-pro.com" target="_blank" rel="noopener">' +
      atcbIcon['atcb'] +
      '</a>';
  }, 500);  
  document.body.appendChild(atcbL);
  if (atList) {
    atcbL.style.position = 'absolute';
  } else {
    if (window.innerHeight > 1000 || window.innerWidth > 1000) {
      atcbL.style.position = 'fixed';
      atcbL.style.bottom = '15px';
      atcbL.style.right = '30px';
    }
  }*/
}

// FUNCTION TO CREATE MODALS
// this is only about special communication modals - not the list style modal
function atcb_create_modal(
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
    const el = document.getElementById('atcb-bgoverlay');
    if (!el) {
      return atcb_generate_bg_overlay('modal', 'click', data.lightMode, data.background);
    } else {
      return el;
    }
  })();
  bgOverlay.classList.add('atcb-no-animation');
  document.body.appendChild(bgOverlay);
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('atcb-modal');
  bgOverlay.appendChild(modalWrapper);
  const modalCount = document.querySelectorAll('.atcb-modal').length;
  modalWrapper.dataset.modalNr = modalCount;
  modalWrapper.tabIndex = 0;
  modalWrapper.focus({ preventScroll: true });
  modalWrapper.blur();
  const parentButton = document.getElementById(data.identifier);
  if (parentButton != null) {
    parentButton.classList.add('atcb-active-modal');
  }
  // create box
  const modal = document.createElement('div');
  modal.classList.add('atcb-modal-box');
  modal.classList.add('atcb-' + data.lightMode);
  if (data.rtl) {
    modal.classList.add('atcb-rtl');
  }
  modalWrapper.appendChild(modal);
  atcb_set_sizes(modal, data.sizes);
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // add icon
  if (icon != '' && data.iconModal == true) {
    const modalIcon = document.createElement('div');
    modalIcon.classList.add('atcb-modal-icon');
    modalIcon.innerHTML = atcbIcon[`${icon}`];
    modal.appendChild(modalIcon);
  }
  // add headline
  const modalHeadline = document.createElement('div');
  modalHeadline.classList.add('atcb-modal-headline');
  modalHeadline.textContent = headline;
  modal.appendChild(modalHeadline);
  // add text content
  if (content != '') {
    const modalContent = document.createElement('div');
    modalContent.classList.add('atcb-modal-content');
    modalContent.innerHTML = content;
    modal.appendChild(modalContent);
  }
  // add subEvent buttons (array with type first and subEvent numbers following)
  if (subEvents.length > 1) {
    if (data.branding) {
      atcb_create_atcbl(false);
    }
    const modalsubEventsContent = document.createElement('div');
    modalsubEventsContent.classList.add('atcb-modal-content');
    modal.appendChild(modalsubEventsContent);
    for (let i = 1; i < subEvents.length; i++) {
      const modalSubEventButton = document.createElement('button');
      modalSubEventButton.type = 'button';
      modalSubEventButton.id = data.identifier + '-' + subEvents[0] + '-' + i;
      if (atcbStates[`${data.identifier}`][`${subEvents[0]}`][i - 1] > 0) {
        modalSubEventButton.classList.add('atcb-saved');
      }
      modalSubEventButton.classList.add('atcb-subevent-btn');
      modalsubEventsContent.appendChild(modalSubEventButton);
      atcb_generate_date_button(data, modalSubEventButton, i);
      if (i == 1 && keyboardTrigger) {
        modalSubEventButton.focus();
      }
      switch (subEvents[0]) {
        case 'apple':
        case 'google':
        case 'ical':
        case 'msteams':
        case 'ms365':
        case 'outlookcom':
        case 'yahoo':
          modalSubEventButton.addEventListener(
            'click',
            atcb_debounce(() => {
              atcb_generate_links(subEvents[0], data, subEvents[`${i}`], keyboardTrigger, true);
            })
          );
          break;
      }
    }
  }
  // add buttons (array of objects; attributes: href, type, label, primary(boolean))
  if (buttons.length == 0) {
    buttons.push({ type: 'close', label: atcb_translate_hook('Close', data) });
  }
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('atcb-modal-buttons');
  modal.appendChild(modalButtons);
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
    modalButtons.appendChild(modalButton);
    if (index == 0 && subEvents.length < 2 && keyboardTrigger) {
      modalButton.focus();
    }
    switch (button.type) {
      default:
      case 'close':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => atcb_close())
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key == 'Enter') {
            atcb_toggle('close', '', '', true);
          }
        });
        break;
      case 'yahoo2nd':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_close();
            atcb_subscribe_yahoo_modal_switch(data);
          })
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key == 'Enter') {
            atcb_toggle('close', '', '', true);
            atcb_subscribe_yahoo_modal_switch(data, keyboardTrigger);
          }
        });
        break;
      case 'none':
        break;
    }
  });
  // hide prev modal
  if (modalCount > 1) {
    const prevModal = document.querySelectorAll('.atcb-modal[data-modal-nr="' + (modalCount - 1) + '"]')[0];
    prevModal.style.display = 'none';
  }
  // set scroll behavior
  atcb_manage_body_scroll(modalWrapper);
}

// FUNCTION TO SWICH THE YAHOO SUBSCRIBE MODAL
function atcb_subscribe_yahoo_modal_switch(data, keyboardTrigger) {
  atcb_set_fully_successful(data.identifier);
  atcb_generate_links('yahoo2nd', data, 'all', keyboardTrigger);
}

// FUNCTION TO GENERATE A MORE DETAILED DATE BUTTON
function atcb_generate_date_button(data, parent, subEvent = 'all') {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  const fullTimeInfo = (function () {
    let startDateInfo, endDateInfo, timeZoneInfo;
    if (subEvent == 'all') {
      startDateInfo = new Date(atcb_generate_time(data.dates[0])['start']);
      endDateInfo = new Date(atcb_generate_time(data.dates[data.dates.length - 1])['end']);
      timeZoneInfo = data.dates[0].timeZone;
    } else {
      const formattedTime = atcb_generate_time(data.dates[`${subEvent}`]);
      startDateInfo = new Date(formattedTime['start']);
      endDateInfo = new Date(formattedTime['end']);
      timeZoneInfo = data.dates[`${subEvent}`].timeZone;
    }
    let timeString = '';
    const optionsDateTimeShort = {
      timeZone: timeZoneInfo,
      hour12: false,
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    const optionsDateTimeLong = {
      timeZone: timeZoneInfo,
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    const optionsTime = {
      timeZone: timeZoneInfo,
      hour12: false,
      hour: 'numeric',
      minute: '2-digit',
    };
    if (
      startDateInfo.getFullYear() === endDateInfo.getFullYear() &&
      startDateInfo.getMonth() === endDateInfo.getMonth() &&
      startDateInfo.getDate() === endDateInfo.getDate()
    ) {
      timeString =
        startDateInfo.toLocaleString(data.language, optionsDateTimeShort) +
        ' - ' +
        endDateInfo.toLocaleTimeString(data.language, optionsTime);
    } else {
      timeString =
        startDateInfo.toLocaleString(data.language, optionsDateTimeShort) +
        ' - ' +
        endDateInfo.toLocaleString(data.language, optionsDateTimeLong);
    }
    if (timeZoneInfo != null) {
      if (Intl.DateTimeFormat().resolvedOptions().timeZone != timeZoneInfo) {
        timeString += '; ' + timeZoneInfo;
      }
    } else {
      timeString += '; UTC';
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
  const btnLeft = document.createElement('div');
  btnLeft.classList.add('atcb-date-btn-left');
  parent.appendChild(btnLeft);
  const btnDay = document.createElement('div');
  btnDay.classList.add('atcb-date-btn-day');
  btnLeft.appendChild(btnDay);
  const btnMonth = document.createElement('div');
  btnMonth.classList.add('atcb-date-btn-month');
  btnDay.textContent = String(startDate.getDate()).padStart(2, '0');
  btnMonth.textContent = startDate.toLocaleString(data.language, {
    month: 'short',
  });
  btnLeft.appendChild(btnMonth);
  const btnRight = document.createElement('div');
  btnRight.classList.add('atcb-date-btn-right');
  parent.appendChild(btnRight);
  const btnDetails = document.createElement('div');
  btnDetails.classList.add('atcb-date-btn-details');
  btnRight.appendChild(btnDetails);
  const btnHeadline = document.createElement('div');
  btnHeadline.classList.add('atcb-date-btn-headline');
  btnHeadline.textContent = data.dates[`${subEvent}`].name;
  btnDetails.appendChild(btnHeadline);
  if ((data.location != null && data.location != '') || cancelledInfo != '') {
    const btnLocation = document.createElement('div');
    btnLocation.classList.add('atcb-date-btn-content');
    btnDetails.appendChild(btnLocation);
    if (cancelledInfo != '') {
      btnLocation.textContent = cancelledInfo;
      btnLocation.style.fontWeight = '600';
      btnLocation.style.color = '#9c1a23';
    } else {
      btnLocation.classList.add('atcb-date-btn-content-location');
      const btnLocationIcon = document.createElement('span');
      btnLocationIcon.classList.add('atcb-date-btn-content-icon');
      btnLocationIcon.innerHTML = atcbIcon['location'];
      btnLocation.appendChild(btnLocationIcon);
      const btnLocationText = document.createElement('span');
      btnLocationText.textContent = data.location;
      btnLocation.appendChild(btnLocationText);
    }
  }
  const btnDateTime = document.createElement('div');
  btnDateTime.classList.add('atcb-date-btn-content');
  btnDetails.appendChild(btnDateTime);
  const btnDateTimeIcon = document.createElement('span');
  btnDateTimeIcon.classList.add('atcb-date-btn-content-icon');
  btnDateTimeIcon.innerHTML = atcbIcon['ical'];
  btnDateTime.appendChild(btnDateTimeIcon);
  const btnDateTimeText = document.createElement('span');
  btnDateTimeText.textContent = fullTimeInfo;
  btnDateTime.appendChild(btnDateTimeText);
  if (data.recurrence != null && data.recurrence != '') {
    const recurSign = document.createElement('span');
    recurSign.classList.add('atcb-date-btn-content-recurr-icon');
    btnDateTime.appendChild(recurSign);
    recurSign.innerHTML = '&#x27F3;';
  }
  const btnHover = document.createElement('div');
  btnHover.classList.add('atcb-date-btn-hover');
  btnHover.innerHTML = hoverText;
  btnRight.appendChild(btnHover);
  if (data.checkmark) {
    const btnCheck = document.createElement('div');
    btnCheck.classList.add('atcb-checkmark');
    btnCheck.innerHTML = atcbIcon['checkmark'];
    parent.appendChild(btnCheck);
  }
}

export {
  atcb_generate_label,
  atcb_generate_button,
  atcb_generate_dropdown_list,
  atcb_create_modal,
  atcb_generate_bg_overlay,
  atcb_create_atcbl,
};
