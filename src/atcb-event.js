/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.12.1
 *  Creator: Jens Kuerschner (https://jekuer.com)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbIsBrowser } from './atcb-globals.js';

// LOG/TRACK FUNCTION
// add information to the parent element, which can be used for tracking
function atcb_log_event(event, trigger, identifier) {
  const parentEl = (function () {
    // since the id is only used withint the shadowDOM with generated buttons, we can search for custom (atcb_action) ones via document.getElementById
    const customTrigger = document.getElementById(identifier);
    if (customTrigger) {
      return customTrigger;
    }
    return document.querySelector('[atcb-button-id="' + identifier + '"]');
  })();
  // set log attribute
  // (mind that custom triggers won't have any information as long as they have not been fired!)
  if (parentEl) {
    parentEl.setAttribute('atcb-last-event', event + ':' + trigger);
  }
  // trigger push to data layer
  if (atcbIsBrowser()) {
    atcb_push_to_data_layer(event, trigger);
  }
}

// DATA LAYER PUSH (aka EVENT TRACKING)
// additional helper function to push stuff to the data layer, where it can be consumed directly via Google Analytics (any maybe others)
function atcb_push_to_data_layer(event, trigger) {
  let action = '';
  switch (event) {
    case 'initialization':
      action = 'Initialized';
      break;
    case 'openList':
      action = 'Opened';
      break;
    case 'closeList':
      action = 'Closed';
      break;
    case 'openCalendarLink':
      action = 'Opened';
      break;
    case 'openSingletonLink':
      action = 'Opened';
      break;
    case 'openSubEventLink':
      action = 'Opened';
      break;
    case 'openRSVP':
      action = 'Opened';
      break;
    case 'success':
      action = 'Saved';
      break;
    case 'successRSVP':
      action = 'Saved';
      break;
  }
  const category = event === 'openRSVP' || event === 'successRSVP' ? 'Add-to-Calendar-RSVP' : 'Add-to-Calendar-Button';
  const atcbDataLayer = (window.dataLayer = window.dataLayer || []);
  atcbDataLayer.push({
    eventCategory: category,
    eventAction: action,
    eventLabel: trigger,
    event: event,
  });
}

export { atcb_log_event };
