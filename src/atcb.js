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

import { isBrowser } from './atcb-globals.js';
import { atcb_init } from './atcb-init.js';

/*! START INIT */
if (isBrowser()) {
  if (document.readyState !== 'loading') {
    // if the script is loaded after the page has been loaded, run the initilization
    atcb_init();
  } else {
    // otherwise, init the magic as soon as the DOM has been loaded
    document.addEventListener('DOMContentLoaded', atcb_init, false);
  }
}
/*! END INIT */
