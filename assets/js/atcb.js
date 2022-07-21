/**
 * ++++++++++++++++++++++
 * Add-to-Calendar Button
 * ++++++++++++++++++++++
 */
const atcbVersion = '1.11.4';
/* Creator: Jens Kuerschner (https://jenskuerschner.de)
 * Project: https://github.com/jekuer/add-to-calendar-button
 * License: MIT with “Commons Clause” License Condition v1.0
 *
 */

// CHECKING FOR SPECIFIC DEVICED AND SYSTEMS
// browser
const isBrowser = new Function('try { return this===window; }catch(e){ return false; }');
// iOS
const isiOS = isBrowser()
  ? new Function(
      "if ((/iPad|iPhone|iPod/.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){ return true; }else{ return false; }"
    )
  : new Function('return false;');
// Instagram
const isInstagram = isBrowser()
  ? new Function(
      'if (/Instagram/.test(navigator.userAgent || navigator.vendor || window.opera)){ return true; }else{ return false; }'
    )
  : new Function('return false;');

// INITIALIZE THE SCRIPT AND FUNCTIONALITY
function atcb_init() {
  // let's get started
  console.log('add-to-calendar button initialized (version ' + atcbVersion + ')');
  console.log('See https://github.com/jekuer/add-to-calendar-button for details');
  // get all placeholders
  const atcButtons = document.querySelectorAll('.atcb');
  // if there are some, move on
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
      // also strip HTML tags (especially since stupid Safari adds stuff).
      let atcbConfig = JSON.parse(
        atcButtons[parseInt(i)].innerHTML.replace(/(\r\n|\n|\r)/g, '').replace(/(<(?!br)([^>]+)>)/gi, '')
      );
      // rewrite config for backwards compatibility - you can remove this, if you did not use this script before v1.4.0.
      atcbConfig = atcb_patch_config(atcbConfig);
      // check, if all required data is available
      if (atcb_check_required(atcbConfig)) {
        // Rewrite dynamic dates, standardize line breaks and transform urls in the description
        atcbConfig = atcb_decorate_data(atcbConfig);
        // validate the config (JSON iput) ...
        if (atcb_validate(atcbConfig)) {
          // ... and generate the button on success
          // set identifier
          if (atcbConfig.identifier == null || atcbConfig.identifier == '') {
            atcbConfig.identifier = 'atcb-btn-' + (i + atcButtonsInitialized.length + 1);
          }
          // generate the button
          atcb_generate(atcButtons[parseInt(i)], atcbConfig);
        }
      }
    }
  }
}

// BACKWARDS COMPATIBILITY REWRITE - you can remove this, if you did not use this script before v1.4.0.
function atcb_patch_config(atcbConfig) {
  const keyChanges = {
    title: 'name',
    dateStart: 'startDate',
    dateEnd: 'endDate',
    timeStart: 'startTime',
    timeEnd: 'endTime',
  };
  Object.keys(keyChanges).forEach((key) => {
    if (atcbConfig[keyChanges[`${key}`]] == null && atcbConfig[`${key}`] != null) {
      atcbConfig[keyChanges[`${key}`]] = atcbConfig[`${key}`];
    }
  });
  return atcbConfig;
}

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
function atcb_decorate_data(atcbConfig) {
  // cleanup different date-time formats
  atcbConfig = atcb_date_cleanup(atcbConfig);
  // calculate the real date values in case that there are some special rules included (e.g. adding days dynamically)
  atcbConfig.startDate = atcb_date_calculation(atcbConfig.startDate);
  atcbConfig.endDate = atcb_date_calculation(atcbConfig.endDate);
  // force click trigger on modal style
  if (atcbConfig.listStyle === 'modal') {
    atcbConfig.trigger = 'click';
  }
  // set language if not set
  if (atcbConfig.language == null || atcbConfig.language == '') {
    atcbConfig.language = 'en';
  }
  // format RRULE (remove spaces)
  if (atcbConfig.recurrence != null && atcbConfig.recurrence != '') {
    atcbConfig.recurrence = atcbConfig.recurrence.replace(/\s+/g, '');
  }

  // if no description or already decorated, return early here
  if (!atcbConfig.description || atcbConfig.descriptionHtmlFree) return atcbConfig;

  // make a copy of the given argument rather than mutating in place
  const data = Object.assign({}, atcbConfig);
  // standardize any line breaks in the description and transform URLs (but keep a clean copy without the URL magic for iCal)
  data.description = data.description.replace(/<br\s*\/?>/gi, '\n');
  data.descriptionHtmlFree = data.description
    .replace(/\[url\]/gi, '')
    .replace(/(\|.*)\[\/url\]/gi, '')
    .replace(/\[\/url\]/gi, '');
  data.description = data.description.replace(
    /\[url\]([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\[\/url\]/gi,
    function (match, p1) {
      const urlText = p1.split('|');
      let link = '<a href="' + urlText[0] + '" target="_blank" rel="noopener">';
      if (urlText.length > 1 && urlText[1] != '') {
        link += urlText[1];
      } else {
        link += urlText[0];
      }
      return link + '</a>';
    }
  );
  return data;
}

// CHECK FOR REQUIRED FIELDS
function atcb_check_required(data) {
  // check for at least 1 option
  if (data.options == null || data.options.length < 1) {
    console.error('add-to-calendar button generation failed: no options set');
    return false;
  }
  // check for min required data (without "options")
  const requiredField = ['name', 'startDate'];
  return requiredField.every(function (field) {
    if (data[`${field}`] == null || data[`${field}`] == '') {
      console.error('add-to-calendar button generation failed: required setting missing [' + field + ']');
      return false;
    }
    return true;
  });
}

// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_cleanup(data) {
  // set endDate = startDate, if not provided
  if ((data.endDate == null || data.endDate == '') && data.startDate != null) {
    data.endDate = data.startDate;
  }
  // parse date+time format (unofficial alternative to the main implementation)
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    if (data[point + 'Date'] != null) {
      // remove any milliseconds information
      data[point + 'Date'] = data[point + 'Date'].replace(/\.\d{3}/, '').replace('Z', '');
      // identify a possible time information within the date string
      const tmpSplitStartDate = data[point + 'Date'].split('T');
      if (tmpSplitStartDate[1] != null) {
        data[point + 'Date'] = tmpSplitStartDate[0];
        data[point + 'Time'] = tmpSplitStartDate[1];
      }
    }
    // remove any seconds from time information
    if (data[point + 'Time'] != null && data[point + 'Time'].length === 8) {
      const timeStr = data[point + 'Time'];
      data[point + 'Time'] = timeStr.substring(0, timeStr.length - 3);
    }
  });
  return data;
}

function atcb_date_calculation(dateString) {
  // replace "today" with the current date first
  const today = new Date();
  const todayString = today.getUTCMonth() + 1 + '-' + today.getUTCDate() + '-' + today.getUTCFullYear();
  dateString = dateString.replace(/today/gi, todayString);
  // check for any dynamic additions and adjust
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0].split('-');
  let newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  if (dateParts[0].length < 4) {
    // backwards compatibility for version <1.5.0
    newDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  }
  if (dateStringParts[1] != null && dateStringParts[1] > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  return (
    newDate.getFullYear() +
    '-' +
    ((newDate.getMonth() + 1 < 10 ? '0' : '') + (newDate.getMonth() + 1)) +
    '-' +
    (newDate.getDate() < 10 ? '0' : '') +
    newDate.getDate()
  );
}

// VALIDATE THE INPUT DATA
function atcb_validate(data) {
  // validate prefix
  if (data.identifier != null && data.identifier != '') {
    if (!/^[\w-]+$/.test(data.identifier)) {
      data.identifier = '';
      console.error('add-to-calendar button generation: identifier invalid - using auto numbers instead');
    }
  }
  // validate explicit ics file
  if (data.icsFile != null && data.icsFile != '') {
    if (!atcb_secure_url(data.icsFile, false) || !/\.ics$/.test(data.icsFile)) {
      console.error('add-to-calendar button generation failed: explicit ics file path not valid');
      return false;
    }
  }
  // validate options
  const options = ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'MicrosoftTeams', 'Yahoo'];
  if (
    !data.options.every(function (option) {
      const cleanOption = option.split('|');
      if (!options.includes(cleanOption[0])) {
        console.error('add-to-calendar button generation failed: invalid option [' + cleanOption[0] + ']');
        return false;
      }
      return true;
    })
  ) {
    return false;
  }
  // validate date
  const dates = ['startDate', 'endDate'];
  const newDate = dates;
  if (
    !dates.every(function (date) {
      if (data[`${date}`].length !== 10) {
        console.error('add-to-calendar button generation failed: date misspelled [-> YYYY-MM-DD]');
        return false;
      }
      const dateParts = data[`${date}`].split('-');
      if (dateParts.length < 3 || dateParts.length > 3) {
        console.error(
          'add-to-calendar button generation failed: date misspelled [' + date + ': ' + data[`${date}`] + ']'
        );
        return false;
      }
      newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return true;
    })
  ) {
    return false;
  }
  // validate time
  const times = ['startTime', 'endTime'];
  if (
    !times.every(function (time) {
      if (data[`${time}`] != null) {
        if (data[`${time}`].length !== 5) {
          console.error('add-to-calendar button generation failed: time misspelled [-> HH:MM]');
          return false;
        }
        const timeParts = data[`${time}`].split(':');
        // validate the time parts
        if (timeParts.length < 2 || timeParts.length > 2) {
          console.error(
            'add-to-calendar button generation failed: time misspelled [' +
              time +
              ': ' +
              data[`${time}`] +
              ']'
          );
          return false;
        }
        if (timeParts[0] > 23) {
          console.error(
            'add-to-calendar button generation failed: time misspelled - hours number too high [' +
              time +
              ': ' +
              timeParts[0] +
              ']'
          );
          return false;
        }
        if (timeParts[1] > 59) {
          console.error(
            'add-to-calendar button generation failed: time misspelled - minutes number too high [' +
              time +
              ': ' +
              timeParts[1] +
              ']'
          );
          return false;
        }
        // update the date with the time for further validation steps
        if (time == 'startTime') {
          newDate.startDate = new Date(
            newDate.startDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
          );
        }
        if (time == 'endTime') {
          newDate.endDate = new Date(
            newDate.endDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
          );
        }
      }
      return true;
    })
  ) {
    return false;
  }
  if ((data.startTime != null && data.endTime == null) || (data.startTime == null && data.endTime != null)) {
    console.error(
      'add-to-calendar button generation failed: if you set a starting time, you also need to define an end time'
    );
    return false;
  }
  // validate whether end is not before start
  if (newDate.endDate < newDate.startDate) {
    console.error('add-to-calendar button generation failed: end date before start date');
    return false;
  }
  // validate any given RRULE (or respective other parameters)
  if (data.recurrence != null && data.recurrence != '') {
    if (!/^[\w=;:*+-/\\]+$/.test(data.recurrence)) {
      console.error('add-to-calendar button generation failed: RRULE data misspelled');
      return false;
    }
  }
  // on passing the validation, return true
  return true;
}

// GENERATE THE ACTUAL BUTTON
// helper function to generate the labels for the button and list options
function atcb_generate_label(data, parent, type, icon = false, text = '', oneOption = false) {
  let defaultTriggerText = atcb_translate('Add to Calendar', data.language);
  // if there is only 1 option, we use the trigger text on the option label. Therefore, forcing it here
  if (oneOption && text == '') {
    text = defaultTriggerText;
  }
  let iconSvg = '';
  switch (type) {
    case 'Trigger':
    default:
      if (data.trigger === 'click') {
        parent.addEventListener(
          'click',
          atcb_debounce_leading(() => atcb_toggle(data, parent, false, true))
        );
      } else {
        parent.addEventListener(
          'touchstart',
          atcb_debounce_leading(() => atcb_toggle(data, parent, false, true)),
          {
            passive: true,
          }
        );
        parent.addEventListener(
          'mouseenter',
          atcb_debounce_leading(() => atcb_open(data, parent, false, true))
        );
      }
      parent.setAttribute('id', data.identifier);
      text = text || defaultTriggerText;
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M81.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zm-3.65 76.03c1.83 0 3.32 1.49 3.32 3.32s-1.49 3.32-3.32 3.32l-12.95-.04-.04 12.93c0 1.83-1.49 3.32-3.32 3.32s-3.32-1.49-3.32-3.32l.04-12.94-12.93-.05c-1.83 0-3.32-1.49-3.32-3.32s1.49-3.32 3.32-3.32l12.94.04.04-12.93c0-1.83 1.49-3.32 3.32-3.32s3.32 1.49 3.32 3.32l-.04 12.95 12.94.04h0zM29.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zM6.4 45.32h110.08V21.47c0-.8-.33-1.53-.86-2.07-.53-.53-1.26-.86-2.07-.86H103c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h10.55c2.57 0 4.9 1.05 6.59 2.74s2.74 4.02 2.74 6.59v27.06 65.03c0 2.57-1.05 4.9-2.74 6.59s-4.02 2.74-6.59 2.74H9.33c-2.57 0-4.9-1.05-6.59-2.74-1.69-1.7-2.74-4.03-2.74-6.6V48.53 21.47c0-2.57 1.05-4.9 2.74-6.59s4.02-2.74 6.59-2.74H20.6c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H9.33c-.8 0-1.53.33-2.07.86-.53.53-.86 1.26-.86 2.07v23.85h0zm110.08 6.41H6.4v61.82c0 .8.33 1.53.86 2.07.53.53 1.26.86 2.07.86h104.22c.8 0 1.53-.33 2.07-.86.53-.53.86-1.26.86-2.07V51.73h0zM50.43 18.54c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h21.49c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H50.43h0z"/></svg>';
      break;
    case 'Apple':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_close();
          atcb_generate_ical(data);
        })
      );
      parent.setAttribute('id', data.identifier + '-apple');
      text = text || 'Apple';
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" viewBox="0 0 640 640"><path d="M494.782 340.02c-.803-81.025 66.084-119.907 69.072-121.832-37.595-54.993-96.167-62.552-117.037-63.402-49.843-5.032-97.242 29.362-122.565 29.362-25.253 0-64.277-28.607-105.604-27.85-54.32.803-104.4 31.594-132.403 80.245C29.81 334.457 71.81 479.58 126.816 558.976c26.87 38.882 58.914 82.56 100.997 81 40.512-1.594 55.843-26.244 104.848-26.244 48.993 0 62.753 26.245 105.64 25.406 43.606-.803 71.232-39.638 97.925-78.65 30.887-45.12 43.548-88.75 44.316-90.994-.969-.437-85.029-32.634-85.879-129.439l.118-.035zM414.23 102.178C436.553 75.095 451.636 37.5 447.514-.024c-32.162 1.311-71.163 21.437-94.253 48.485-20.729 24.012-38.836 62.28-33.993 99.036 35.918 2.8 72.591-18.248 94.926-45.272l.036-.047z"/></svg>';
      break;
    case 'Google':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_close();
          atcb_generate_google(data);
        })
      );
      parent.setAttribute('id', data.identifier + '-google');
      text = text || 'Google';
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M93.78 29.1H29.1v64.68h64.68V29.1z" fill="#fff"/><path d="M93.78 122.88l29.1-29.1h-29.1v29.1z" fill="#f72a25"/><path d="M122.88 29.1h-29.1v64.68h29.1V29.1z" fill="#fbbc04"/><path d="M93.78 93.78H29.1v29.1h64.68v-29.1z" fill="#34a853"/><path d="M0 93.78v19.4c0 5.36 4.34 9.7 9.7 9.7h19.4v-29.1H0h0z" fill="#188038"/><path d="M122.88 29.1V9.7c0-5.36-4.34-9.7-9.7-9.7h-19.4v29.1h29.1 0z" fill="#1967d2"/><path d="M93.78 0H9.7C4.34 0 0 4.34 0 9.7v84.08h29.1V29.1h64.67V0h.01z" fill="#4285f4"/><path d="M42.37 79.27c-2.42-1.63-4.09-4.02-5-7.17l5.61-2.31c.51 1.94 1.4 3.44 2.67 4.51 1.26 1.07 2.8 1.59 4.59 1.59 1.84 0 3.41-.56 4.73-1.67 1.32-1.12 1.98-2.54 1.98-4.26 0-1.76-.7-3.2-2.09-4.32s-3.14-1.67-5.22-1.67H46.4v-5.55h2.91c1.79 0 3.31-.48 4.54-1.46 1.23-.97 1.84-2.3 1.84-3.99 0-1.5-.55-2.7-1.65-3.6s-2.49-1.35-4.18-1.35c-1.65 0-2.96.44-3.93 1.32s-1.7 2-2.12 3.24l-5.55-2.31c.74-2.09 2.09-3.93 4.07-5.52s4.51-2.39 7.58-2.39c2.27 0 4.32.44 6.13 1.32s3.23 2.1 4.26 3.65c1.03 1.56 1.54 3.31 1.54 5.25 0 1.98-.48 3.65-1.43 5.03-.95 1.37-2.13 2.43-3.52 3.16v.33c1.79.74 3.36 1.96 4.51 3.52 1.17 1.58 1.76 3.46 1.76 5.66s-.56 4.16-1.67 5.88c-1.12 1.72-2.66 3.08-4.62 4.07s-4.17 1.49-6.62 1.49c-2.84 0-5.46-.81-7.88-2.45h0 0zm34.46-27.84l-6.16 4.45-3.08-4.67 11.05-7.97h4.24v37.6h-6.05V51.43h0z" fill="#1a73e8"/></svg>';
      break;
    case 'iCal':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_close();
          atcb_generate_ical(data);
        })
      );
      parent.setAttribute('id', data.identifier + '-ical');
      text = text || atcb_translate('iCal File', data.language);
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M81.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zm-15.5 99.08c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2H81.9c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H66.11h0zM15.85 67.09c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H15.85h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H40.98h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2H81.9c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H66.11h0zm25.14 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H91.25h0zm-75.4 18.36c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H15.85h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H40.98h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2H81.9c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H66.11h0zm25.14 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H91.25h0zm-75.4 18.36c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H15.85h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H40.98h0zM29.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zM6.4 45.32h110.07V21.47c0-.8-.33-1.53-.86-2.07-.53-.53-1.26-.86-2.07-.86H103c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h10.55c2.57 0 4.9 1.05 6.59 2.74s2.74 4.02 2.74 6.59v27.06 65.03c0 2.57-1.05 4.9-2.74 6.59s-4.02 2.74-6.59 2.74H9.33c-2.57 0-4.9-1.05-6.59-2.74-1.69-1.7-2.74-4.03-2.74-6.6V48.52 21.47c0-2.57 1.05-4.9 2.74-6.59s4.02-2.74 6.59-2.74H20.6c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H9.33c-.8 0-1.53.33-2.07.86-.53.53-.86 1.26-.86 2.07v23.85h0zm110.08 6.41H6.4v61.82c0 .8.33 1.53.86 2.07.53.53 1.26.86 2.07.86h104.22c.8 0 1.53-.33 2.07-.86.53-.53.86-1.26.86-2.07V51.73h0zM50.43 18.54c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h21.49c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H50.43h0z"/></svg>';
      break;
    case 'MicrosoftTeams':
      if (data.recurrence == null || data.recurrence == '') {
        parent.addEventListener(
          'click',
          atcb_debounce(() => {
            oneOption ? parent.blur() : atcb_close();
            atcb_generate_teams(data);
          })
        );
      } else {
        parent.remove();
        return;
      }
      parent.setAttribute('id', data.identifier + '-msteams');
      text = text || 'Microsoft Teams';
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2228.833 2073.333"><g fill="#5059c9"><path d="M1554.637 777.5h575.713c54.391 0 98.483 44.092 98.483 98.483v524.398c0 199.901-162.051 361.952-361.952 361.952h0-1.711c-199.901.028-361.975-162-362.004-361.901v-.052-571.409c.001-28.427 23.045-51.471 51.471-51.471h0z"/><circle cx="1943.75" cy="440.583" r="233.25"/></g><g fill="#7b83eb"><circle cx="1218.083" cy="336.917" r="336.917"/><path d="M1667.323 777.5H717.01c-53.743 1.33-96.257 45.931-95.01 99.676v598.105c-7.505 322.519 247.657 590.16 570.167 598.053 322.51-7.893 577.671-275.534 570.167-598.053V877.176c1.245-53.745-41.268-98.346-95.011-99.676z"/></g><path opacity=".1" d="M1244 777.5v838.145c-.258 38.435-23.549 72.964-59.09 87.598-11.316 4.787-23.478 7.254-35.765 7.257H667.613c-6.738-17.105-12.958-34.21-18.142-51.833-18.144-59.477-27.402-121.307-27.472-183.49V877.02c-1.246-53.659 41.198-98.19 94.855-99.52H1244z"/><path opacity=".2" d="M1192.167 777.5v889.978a91.84 91.84 0 0 1-7.257 35.765c-14.634 35.541-49.163 58.833-87.598 59.09H691.975c-8.812-17.105-17.105-34.21-24.362-51.833s-12.958-34.21-18.142-51.833a631.28 631.28 0 0 1-27.472-183.49V877.02c-1.246-53.659 41.198-98.19 94.855-99.52h475.313z"/><path opacity=".2" d="M1192.167 777.5v786.312c-.395 52.223-42.632 94.46-94.855 94.855h-447.84A631.28 631.28 0 0 1 622 1475.177V877.02c-1.246-53.659 41.198-98.19 94.855-99.52h475.312z"/><path opacity=".2" d="M1140.333 777.5v786.312c-.395 52.223-42.632 94.46-94.855 94.855H649.472A631.28 631.28 0 0 1 622 1475.177V877.02c-1.246-53.659 41.198-98.19 94.855-99.52h423.478z"/><path opacity=".1" d="M1244 509.522v163.275c-8.812.518-17.105 1.037-25.917 1.037s-17.105-.518-25.917-1.037c-17.496-1.161-34.848-3.937-51.833-8.293a336.92 336.92 0 0 1-233.25-198.003 288.02 288.02 0 0 1-16.587-51.833h258.648c52.305.198 94.657 42.549 94.856 94.854z"/><use xlink:href="#C" opacity=".2"/><use xlink:href="#C" opacity=".2"/><path opacity=".2" d="M1140.333 561.355v103.148A336.92 336.92 0 0 1 907.083 466.5h138.395c52.305.199 94.656 42.551 94.855 94.855z"/><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="198.099" y1="392.261" x2="942.234" y2="1681.073"><stop offset="0" stop-color="#5a62c3"/><stop offset=".5" stop-color="#4d55bd"/><stop offset="1" stop-color="#3940ab"/></linearGradient><path fill="url(#A)" d="M95.01 466.5h950.312c52.473 0 95.01 42.538 95.01 95.01v950.312c0 52.473-42.538 95.01-95.01 95.01H95.01c-52.473 0-95.01-42.538-95.01-95.01V561.51c0-52.472 42.538-95.01 95.01-95.01z"/><path fill="#fff" d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844h500.088V828.193z"/><defs ><path id="C" d="M1192.167 561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293a336.92 336.92 0 0 1-233.25-198.003h190.228c52.304.198 94.656 42.55 94.855 94.854z"/></defs></svg>';
      break;
    case 'Microsoft365':
      if (data.recurrence == null || data.recurrence == '') {
        parent.addEventListener(
          'click',
          atcb_debounce(() => {
            oneOption ? parent.blur() : atcb_close();
            atcb_generate_microsoft(data, '365');
          })
        );
      } else {
        parent.remove();
        return;
      }
      parent.setAttribute('id', data.identifier + '-ms365');
      text = text || 'Microsoft 365';
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278050 333334" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"><path fill="#ea3e23" d="M278050 305556l-29-16V28627L178807 0 448 66971l-448 87 22 200227 60865-23821V80555l117920-28193-17 239519L122 267285l178668 65976v73l99231-27462v-316z"/></svg>';
      break;
    case 'Outlook.com':
      if (data.recurrence == null || data.recurrence == '') {
        parent.addEventListener(
          'click',
          atcb_debounce(() => {
            oneOption ? parent.blur() : atcb_close();
            atcb_generate_microsoft(data, 'outlook');
          })
        );
      } else {
        parent.remove();
        return;
      }
      parent.setAttribute('id', data.identifier + '-outlook');
      text = text || 'Outlook.com';
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.129793726981 0 33.251996719421 32" width="2500" height="2397"><path d="M28.596 2H11.404A1.404 1.404 0 0 0 10 3.404V5l9.69 3L30 5V3.404A1.404 1.404 0 0 0 28.596 2z" fill="#0364b8"/><path d="M31.65 17.405A11.341 11.341 0 0 0 32 16a.666.666 0 0 0-.333-.576l-.013-.008-.004-.002L20.812 9.24a1.499 1.499 0 0 0-1.479-.083 1.49 1.49 0 0 0-.145.082L8.35 15.415l-.004.002-.012.007A.666.666 0 0 0 8 16a11.344 11.344 0 0 0 .35 1.405l11.492 8.405z" fill="#0a2767"/><path d="M24 5h-7l-2.021 3L17 11l7 6h6v-6z" fill="#28a8ea"/><path d="M10 5h7v6h-7z" fill="#0078d4"/><path d="M24 5h6v6h-6z" fill="#50d9ff"/><path d="M24 17l-7-6h-7v6l7 6 10.832 1.768z" fill="#0364b8"/><path d="M17 11h7v6h-7z" fill="#0078d4"/><path d="M10 17h7v6h-7z" fill="#064a8c"/><path d="M24 17h6v6h-6z" fill="#0078d4"/><path d="M20.19 25.218l-11.793-8.6.495-.87 10.909 6.212a.528.528 0 0 0 .42-.012l10.933-6.23.496.869z" fill="#0a2767" opacity=".5"/><path d="M31.667 16.577l-.014.008-.003.002-10.838 6.174a1.497 1.497 0 0 1-1.46.091l3.774 5.061 8.254 1.797v.004A1.498 1.498 0 0 0 32 28.5V16a.666.666 0 0 1-.333.577z" fill="#1490df"/><path d="M32 28.5v-.738l-9.983-5.688-1.205.687a1.497 1.497 0 0 1-1.46.091l3.774 5.061 8.254 1.797v.004A1.498 1.498 0 0 0 32 28.5z" opacity=".05"/><path d="M31.95 28.883L21.007 22.65l-.195.11a1.497 1.497 0 0 1-1.46.092l3.774 5.061 8.254 1.797v.004a1.501 1.501 0 0 0 .57-.83z" opacity=".1"/><path d="M8.35 16.59v-.01h-.01l-.03-.02A.65.65 0 0 1 8 16v12.5A1.498 1.498 0 0 0 9.5 30h21a1.503 1.503 0 0 0 .37-.05.637.637 0 0 0 .18-.06.142.142 0 0 0 .06-.02 1.048 1.048 0 0 0 .23-.13c.02-.01.03-.01.04-.03z" fill="#28a8ea"/><path d="M18 24.667V8.333A1.337 1.337 0 0 0 16.667 7H10.03v7.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v10h8.667A1.337 1.337 0 0 0 18 24.667z" opacity=".1"/><path d="M17 25.667V9.333A1.337 1.337 0 0 0 15.667 8H10.03v6.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v11h7.667A1.337 1.337 0 0 0 17 25.667z" opacity=".2"/><path d="M17 23.667V9.333A1.337 1.337 0 0 0 15.667 8H10.03v6.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v9h7.667A1.337 1.337 0 0 0 17 23.667z" opacity=".2"/><path d="M16 23.667V9.333A1.337 1.337 0 0 0 14.667 8H10.03v6.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v9h6.667A1.337 1.337 0 0 0 16 23.667z" opacity=".2"/><path d="M1.333 8h13.334A1.333 1.333 0 0 1 16 9.333v13.334A1.333 1.333 0 0 1 14.667 24H1.333A1.333 1.333 0 0 1 0 22.667V9.333A1.333 1.333 0 0 1 1.333 8z" fill="#0078d4"/><path d="M3.867 13.468a4.181 4.181 0 0 1 1.642-1.814A4.965 4.965 0 0 1 8.119 11a4.617 4.617 0 0 1 2.413.62 4.14 4.14 0 0 1 1.598 1.733 5.597 5.597 0 0 1 .56 2.55 5.901 5.901 0 0 1-.577 2.666 4.239 4.239 0 0 1-1.645 1.794A4.8 4.8 0 0 1 7.963 21a4.729 4.729 0 0 1-2.468-.627 4.204 4.204 0 0 1-1.618-1.736 5.459 5.459 0 0 1-.567-2.519 6.055 6.055 0 0 1 .557-2.65zm1.75 4.258a2.716 2.716 0 0 0 .923 1.194 2.411 2.411 0 0 0 1.443.435 2.533 2.533 0 0 0 1.541-.449 2.603 2.603 0 0 0 .897-1.197 4.626 4.626 0 0 0 .286-1.665 5.063 5.063 0 0 0-.27-1.686 2.669 2.669 0 0 0-.866-1.24 2.387 2.387 0 0 0-1.527-.473 2.493 2.493 0 0 0-1.477.439 2.741 2.741 0 0 0-.944 1.203 4.776 4.776 0 0 0-.007 3.44z" fill="#fff"/></svg>';
      break;
    case 'Yahoo':
      if (data.recurrence == null || data.recurrence == '') {
        parent.addEventListener(
          'click',
          atcb_debounce(() => {
            oneOption ? parent.blur() : atcb_close();
            atcb_generate_yahoo(data);
          })
        );
      } else {
        parent.remove();
        return;
      }
      parent.setAttribute('id', data.identifier + '-yahoo');
      text = text || 'Yahoo';
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3386.34 3010.5" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"><path d="M0 732.88h645.84l376.07 962.1 380.96-962.1h628.76l-946.8 2277.62H451.98l259.19-603.53L.02 732.88zm2763.84 768.75h-704.26L2684.65 0l701.69.03-622.5 1501.6zm-519.78 143.72c216.09 0 391.25 175.17 391.25 391.22 0 216.06-175.16 391.23-391.25 391.23-216.06 0-391.19-175.17-391.19-391.23 0-216.05 175.16-391.22 391.19-391.22z" fill="#5f01d1" fill-rule="nonzero"/></svg>';
      break;
    case 'Close':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_close();
        })
      );
      parent.addEventListener(
        'focus',
        atcb_debounce(() => atcb_close(false))
      );
      parent.setAttribute('id', data.identifier + '-close');
      text = atcb_translate('Close', data.language);
      iconSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill-rule="evenodd" d="M11.991.69a2.35 2.35 0 0 1 3.318-.009c.918.911.922 2.392.009 3.307l-4.009 4.014 4.013 4.018c.906.909.893 2.38-.027 3.287a2.35 2.35 0 0 1-3.307-.004l-3.985-3.99-3.993 3.997a2.35 2.35 0 0 1-3.318.009c-.918-.911-.922-2.392-.009-3.307l4.009-4.014L.678 3.98C-.228 3.072-.215 1.6.706.693a2.35 2.35 0 0 1 3.307.004l3.985 3.99z"/></svg>';
      break;
  }
  // override the id for the oneOption button, since the button always needs to have the button id
  if (oneOption) {
    parent.setAttribute('id', data.identifier);
  }
  // support keyboard input
  if (!oneOption && type === 'Trigger') {
    parent.addEventListener(
      'keydown',
      atcb_debounce_leading((event) => {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle(data, parent, true, true);
        }
      })
    );
  } else {
    parent.addEventListener(
      'keydown',
      atcb_debounce_leading((event) => {
        if (event.key == 'Enter') {
          event.preventDefault();
          parent.click();
        }
      })
    );
  }
  // add icon and text label
  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('atcb-icon');
    iconEl.innerHTML = iconSvg;
    parent.appendChild(iconEl);
  }
  const textEl = document.createElement('span');
  textEl.classList.add('atcb-text');
  textEl.textContent = text;
  parent.appendChild(textEl);
}

// generate the triggering button
function atcb_generate(button, data) {
  // clean the placeholder
  button.textContent = '';
  // create schema.org data, if possible (https://schema.org/Event)
  // TODO: support recurring events
  if (data.name && data.location && data.startDate) {
    const schemaEl = document.createElement('script');
    schemaEl.setAttribute('type', 'application/ld+json');
    schemaEl.textContent = '{ "event": { "@context":"https://schema.org", "@type":"Event", ';
    schemaEl.textContent += '"name":"' + data.name + '", ';
    if (data.descriptionHtmlFree)
      schemaEl.textContent += '"description":"' + data.descriptionHtmlFree + '", ';
    const formattedDate = atcb_generate_time(data, 'delimiters', 'general', true);
    schemaEl.textContent += '"startDate":"' + formattedDate.start + '", ';
    schemaEl.textContent += '"endDate":"' + formattedDate.end + '", ';
    if (data.location.startsWith('http')) {
      schemaEl.textContent += '"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode", ';
      schemaEl.textContent += '"location": { "@type":"VirtualLocation", "url":"' + data.location + '" } ';
    } else {
      schemaEl.textContent += '"location":"' + data.location + '" ';
    }
    schemaEl.textContent += '} }';
    button.appendChild(schemaEl);
  }
  // generate the wrapper div
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  button.appendChild(buttonTriggerWrapper);
  // generate the button trigger div
  const buttonTrigger = document.createElement('button');
  buttonTrigger.classList.add('atcb-button');
  buttonTrigger.setAttribute('type', 'button');
  buttonTriggerWrapper.appendChild(buttonTrigger);
  // generate the label incl. eventListeners
  // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text
  if (data.options.length === 1) {
    const optionParts = data.options[0].split('|');
    atcb_generate_label(data, buttonTrigger, optionParts[0], true, data.label, true);
  } else {
    atcb_generate_label(data, buttonTrigger, 'Trigger', true, data.label);
    // create an empty anchor div to place the dropdown, while the position can be defined via CSS
    const buttonDropdownAnchor = document.createElement('div');
    buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
    buttonTriggerWrapper.appendChild(buttonDropdownAnchor);
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
  // console log
  console.log('add-to-calendar button "' + data.identifier + '" created');
}

// generate the dropdown list (can also appear wihtin a modal, if option is set)
function atcb_generate_dropdown_list(data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  // generate the list items
  data.options.forEach(function (option) {
    const optionParts = option.split('|');
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.tabIndex = 0;
    optionsList.appendChild(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(data, optionItem, optionParts[0], true, optionParts[1]);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.tabIndex = 0;
    optionsList.appendChild(optionItem);
    atcb_generate_label(data, optionItem, 'Close', true);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
function atcb_generate_bg_overlay(listStyle = 'dropdown', trigger = '', darken = true) {
  const bgOverlay = document.createElement('div');
  bgOverlay.setAttribute('id', 'atcb-bgoverlay');
  if (listStyle !== 'modal' && darken) {
    bgOverlay.classList.add('atcb-animate-bg');
  }
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.tabIndex = 0;
  bgOverlay.addEventListener(
    'click',
    atcb_debounce((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_close(true);
    })
  );
  let fingerMoved = false;
  bgOverlay.addEventListener(
    'touchstart',
    atcb_debounce_leading(() => (fingerMoved = false)),
    {
      passive: true,
    }
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
      atcb_close(true);
    }),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'focus',
    atcb_debounce_leading((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_close();
    })
  );
  if (trigger !== 'click') {
    bgOverlay.addEventListener(
      'mousemove',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_close(true);
      })
    );
  } else {
    // if trigger is not set to 'click', we render a close icon, when hovering over the background
    bgOverlay.classList.add('atcb-click');
  }
  return bgOverlay;
}

// FUNCTIONS TO CONTROL THE INTERACTION
function atcb_toggle(data, button, keyboardTrigger = false, generatedButton = false) {
  // check for state and adjust accordingly
  if (button.classList.contains('atcb-active') || document.querySelector('.atcb-active-modal')) {
    atcb_close();
  } else {
    atcb_open(data, button, keyboardTrigger, generatedButton);
  }
}

// show the dropdown list + background overlay
function atcb_open(data, button, keyboardTrigger = false, generatedButton = false) {
  // abort early if an add-to-calendar dropdown or modal already opened
  if (document.querySelector('.atcb-list') || document.querySelector('.atcb-modal')) return;
  // generate list
  const list = atcb_generate_dropdown_list(data);
  // set list styles, set button to atcb-active and force modal listStyle if no button is set
  if (button) {
    button.classList.add('atcb-active');
    if (data.listStyle === 'modal') {
      button.classList.add('atcb-modal-style');
      list.classList.add('atcb-modal');
    } else {
      atcb_position_list(button, list);
      list.classList.add('atcb-dropdown');
      if (generatedButton) {
        list.classList.add('atcb-generated-button'); // if the button has been generated by the script, we add some more specifics
      }
    }
  } else {
    list.classList.add('atcb-modal');
  }
  // define background overlay
  const bgOverlay = atcb_generate_bg_overlay(data.listStyle, data.trigger, data.background);
  // render the items depending on the liststyle
  if (data.listStyle === 'modal') {
    document.body.appendChild(bgOverlay);
    bgOverlay.appendChild(list);
    document.body.classList.add('atcb-modal-no-scroll');
  } else {
    document.body.appendChild(list);
    document.body.appendChild(bgOverlay);
  }
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // give keyboard focus to first item in list, if not blocked, because there is definitely no keyboard trigger
  if (keyboardTrigger) {
    list.firstChild.focus();
  } else {
    // for everything else, we focus as well, but blur immediately to only set the pointer
    list.firstChild.focus();
    list.firstChild.blur();
  }
}

function atcb_close(blockFocus = false) {
  // focus triggering button - especially relevant for keyboard navigation
  if (!blockFocus) {
    let newFocusEl = document.querySelector('.atcb-active, .atcb-active-modal');
    if (newFocusEl) {
      newFocusEl.focus();
    }
  }
  // inactivate all buttons
  Array.from(document.querySelectorAll('.atcb-active')).forEach((button) => {
    button.classList.remove('atcb-active');
  });
  Array.from(document.querySelectorAll('.atcb-active-modal')).forEach((button) => {
    button.classList.remove('atcb-active-modal');
  });
  // make body scrollable again
  document.body.classList.remove('atcb-modal-no-scroll');
  // remove dropdowns, modals, and bg overlays (should only be one of each at max)
  Array.from(document.querySelectorAll('.atcb-list'))
    .concat(Array.from(document.querySelectorAll('.atcb-info-modal')))
    .concat(Array.from(document.querySelectorAll('#atcb-bgoverlay')))
    .forEach((el) => el.remove());
}

// prepare data when not using the init function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = true) {
  // validate & decorate data
  if (!atcb_check_required(data)) {
    throw new Error('data missing; see logs');
  }
  data = atcb_decorate_data(data);
  if (!atcb_validate(data)) {
    throw new Error('Invalid data; see logs');
  }
  if (triggerElement) {
    data.identifier = triggerElement.id;
  } else {
    data.identifier = 'atcb-btn-custom';
    // if no button is defined, fallback to listStyle "modal" and "click" trigger
    data.listStyle = 'modal';
    data.trigger = 'click';
  }
  atcb_open(data, triggerElement, keyboardTrigger);
}

// FUNCTION TO GENERATE THE GOOGLE URL
function atcb_generate_google(data) {
  // base url
  let url = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean', 'google');
  url += '&dates=' + formattedDate.start + '%2F' + formattedDate.end;
  // add details (if set)
  if (data.name != null && data.name != '') {
    url += '&text=' + encodeURIComponent(data.name);
  }
  let tmpDataDescription = '';
  if (data.description != null && data.description != '') {
    tmpDataDescription = data.description;
  }
  if (data.location != null && data.location != '') {
    url += '&location=' + encodeURIComponent(data.location);
    // TODO: Find a better solution for the next temporary workaround.
    if (isiOS()) {
      // workaround to cover a bug, where, when using Google Calendar on an iPhone, the location is not recognized. So, for the moment, we simply add it to the description.
      if (tmpDataDescription != '') {
        tmpDataDescription += '<br><br>';
      }
      tmpDataDescription += '&#128205;: ' + data.location;
    }
  }
  if (tmpDataDescription != '') {
    url += '&details=' + encodeURIComponent(tmpDataDescription);
  }
  if (data.recurrence != null && data.recurrence != '') {
    url += '&recur=' + encodeURIComponent(data.recurrence);
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, '_blank').focus();
  }
}

// FUNCTION TO GENERATE THE YAHOO URL
function atcb_generate_yahoo(data) {
  // base url
  let url = 'https://calendar.yahoo.com/?v=60';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean');
  url += '&st=' + formattedDate.start + '&et=' + formattedDate.end;
  if (formattedDate.allday) {
    url += '&dur=allday';
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    url += '&title=' + encodeURIComponent(data.name);
  }
  if (data.location != null && data.location != '') {
    url += '&in_loc=' + encodeURIComponent(data.location);
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Yahoo does not support html tags in a stable way
    url += '&desc=' + encodeURIComponent(data.descriptionHtmlFree);
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, '_blank').focus();
  }
}

// FUNCTION TO GENERATE THE MICROSOFT 365 OR OUTLOOK WEB URL
function atcb_generate_microsoft(data, type = '365') {
  // base url
  let url = 'https://';
  if (type == 'outlook') {
    url += 'outlook.live.com';
  } else {
    url += 'outlook.office.com';
  }
  url += '/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  url += '&startdt=' + formattedDate.start + '&enddt=' + formattedDate.end;
  if (formattedDate.allday) {
    url += '&allday=true';
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    url += '&subject=' + encodeURIComponent(data.name);
  }
  if (data.location != null && data.location != '') {
    url += '&location=' + encodeURIComponent(data.location);
  }
  if (data.description != null && data.description != '') {
    url += '&body=' + encodeURIComponent(data.description.replace(/\n/g, '<br>'));
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, '_blank').focus();
  }
}

// FUNCTION TO GENERATE THE MICROSOFT TEAMS URL
// Mind that this is still in development mode by Microsoft! (https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links#deep-linking-to-the-scheduling-dialog)
// Location, html tags and linebreaks in the description are not supported yet.
function atcb_generate_teams(data) {
  // base url
  let url = 'https://teams.microsoft.com/l/meeting/new?';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  url += '&startTime=' + formattedDate.start + '&endTime=' + formattedDate.end;
  // add details (if set)
  let locationString = '';
  if (data.name != null && data.name != '') {
    url += '&subject=' + encodeURIComponent(data.name);
  }
  if (data.location != null && data.location != '') {
    locationString = encodeURIComponent(data.location);
    url += '&location=' + locationString;
    locationString += ' // '; // preparing the workaround putting the location into the description, since the native field is not supported yet
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Teams does not support html tags
    url += '&content=' + locationString + encodeURIComponent(data.descriptionHtmlFree);
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, '_blank').focus();
  }
}

// FUNCTION TO GENERATE THE iCAL FILE (also for the Apple option)
function atcb_generate_ical(data) {
  // check for a given explicit file
  if (data.icsFile != null && data.icsFile != '') {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(data.icsFile, '_self');
    return;
  }
  // otherwise, generate one on the fly
  let now = new Date();
  now = now.toISOString();
  const formattedDate = atcb_generate_time(data, 'clean', 'ical');
  let timeslot = '';
  if (formattedDate.allday) {
    timeslot = ';VALUE=DATE';
  }
  const ics_lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
  const corp = 'github.com/jekuer/add-to-calendar-button';
  ics_lines.push('PRODID:-// ' + corp + ' // atcb v' + atcbVersion + ' //EN');
  ics_lines.push('CALSCALE:GREGORIAN');
  ics_lines.push('BEGIN:VEVENT');
  ics_lines.push('UID:' + now + '@add-to-calendar-button');
  ics_lines.push(
    'DTSTAMP:' + formattedDate.start,
    'DTSTART' + timeslot + ':' + formattedDate.start,
    'DTEND' + timeslot + ':' + formattedDate.end,
    'SUMMARY:' + data.name.replace(/.{65}/g, '$&' + '\r\n ') // making sure it does not exceed 75 characters per line
  );
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    ics_lines.push(
      'DESCRIPTION:' + data.descriptionHtmlFree.replace(/\n/g, '\\n').replace(/.{60}/g, '$&' + '\r\n ') // adjusting for intended line breaks + making sure it does not exceed 75 characters per line
    );
  }
  if (data.description != null && data.description != '') {
    ics_lines.push(
      'X-ALT-DESC;FMTTYPE=text/html:\r\n <!DOCTYPE HTML PUBLIC ""-//W3C//DTD HTML 3.2//EN"">\r\n <HTML><BODY>\r\n ' +
        data.description.replace(/\n/g, '<br>').replace(/.{60}/g, '$&' + '\r\n ') +
        '\r\n </BODY></HTML>'
    );
  }
  if (data.location != null && data.location != '') {
    ics_lines.push('LOCATION:' + data.location);
  }
  if (data.recurrence != null && data.recurrence != '') {
    ics_lines.push(data.recurrence);
  }
  now = now.replace(/\.\d{3}/g, '').replace(/[^a-z\d]/gi, '');
  ics_lines.push('STATUS:CONFIRMED', 'LAST-MODIFIED:' + now, 'SEQUENCE:0', 'END:VEVENT', 'END:VCALENDAR');
  const dlurl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics_lines.join('\r\n'));
  const filename = data.iCalFileName || 'event-to-save-in-my-calendar';
  // in the Instagram in-app browser case, we offer a copy option, since the on-the-fly client side generation is not supported at the moment
  if (isInstagram()) {
    // putting the download url to the clipboard
    const tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    var editable = tmpInput.contentEditable;
    var readOnly = tmpInput.readOnly;
    tmpInput.value = dlurl;
    tmpInput.contentEditable = true;
    tmpInput.readOnly = false;
    if (isiOS()) {
      var range = document.createRange();
      range.selectNodeContents(tmpInput);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      tmpInput.setSelectionRange(0, 999999);
    } else {
      navigator.clipboard.writeText(dlurl);
      tmpInput.select();
    }
    tmpInput.contentEditable = editable;
    tmpInput.readOnly = readOnly;
    document.execCommand('copy');
    tmpInput.remove();
    // creating the modal
    const buttons = [{ label: atcb_translate('Close note', data.language), type: 'close' }];
    atcb_create_modal(
      data,
      atcb_translate('Instagram iCal', data.language),
      atcb_translate('Instagram info description', data.language),
      buttons,
      'instagram'
    );
  } else {
    try {
      if (!window.ActiveXObject) {
        const save = document.createElement('a');
        save.href = dlurl;
        save.target = '_blank';
        save.download = filename;
        const evt = new MouseEvent('click', {
          view: window,
          button: 0,
          bubbles: true,
          cancelable: false,
        });
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
      }
      // for IE < 11 (even no longer officially supported)
      else if (!!window.ActiveXObject && document.execCommand) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const _window = window.open(dlurl, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, filename || dlurl);
        _window.close();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

// SHARED FUNCTION TO GENERATE A TIME STRING
function atcb_generate_time(data, style = 'delimiters', targetCal = 'general', addTimeZoneOffset = false) {
  const startDate = data.startDate.split('-');
  const endDate = data.endDate.split('-');
  let start = '';
  let end = '';
  let allday = false;
  if (data.startTime != null && data.endTime != null) {
    // Adjust for timezone, if set (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for either the TZ name or the offset)
    if (data.timeZoneOffset != null && data.timeZoneOffset != '') {
      // if we have a timezone offset given, consider it
      start = new Date(
        startDate[0] +
          '-' +
          startDate[1] +
          '-' +
          startDate[2] +
          'T' +
          data.startTime +
          ':00.000' +
          data.timeZoneOffset
      );
      end = new Date(
        endDate[0] +
          '-' +
          endDate[1] +
          '-' +
          endDate[2] +
          'T' +
          data.endTime +
          ':00.000' +
          data.timeZoneOffset
      );
    } else {
      // if there is no offset, we prepare the time, assuming it is UTC formatted
      start = new Date(
        startDate[0] + '-' + startDate[1] + '-' + startDate[2] + 'T' + data.startTime + ':00.000+00:00'
      );
      end = new Date(endDate[0] + '-' + endDate[1] + '-' + endDate[2] + 'T' + data.endTime + ':00.000+00:00');
      if (data.timeZone != null && data.timeZone != '') {
        // if a timezone is given, we adjust dynamically with the modern toLocaleString function
        const utcDate = new Date(start.toLocaleString('en-US', { timeZone: 'UTC' }));
        if (data.timeZone == 'currentBrowser') {
          data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        const tzDate = new Date(start.toLocaleString('en-US', { timeZone: data.timeZone }));
        const calcOffset = utcDate.getTime() - tzDate.getTime();
        start.setTime(start.getTime() + calcOffset);
        end.setTime(end.getTime() + calcOffset);
      }
    }
    start = start.toISOString().replace('.000', '');
    end = end.toISOString().replace('.000', '');
    if (style == 'clean') {
      start = start.replace(/-/g, '').replace(/:/g, '');
      end = end.replace(/-/g, '').replace(/:/g, '');
    }
    if (addTimeZoneOffset) {
      let tzOffsetStart = '';
      let tzOffsetEnd = '';
      if (data.timeZoneOffset != null && data.timeZoneOffset != '') {
        tzOffsetStart = data.timeZoneOffset;
        tzOffsetEnd = data.timeZoneOffset;
      } else if (data.timeZone != null && data.timeZone != '') {
        let tzOffsetDateStart = new Date(start.toLocaleString('sv', { timeZone: data.timeZone }));
        let tzOffsetStartSearch = tzOffsetDateStart.toString().match(/GMT(.{5})/g);
        tzOffsetStart = tzOffsetStartSearch[0].replace(/GMT(.{3})(.{2})/g, '$1:$2');
        let tzOffsetDateEnd = new Date(end.toLocaleString('sv', { timeZone: data.timeZone }));
        let tzOffsetEndSearch = tzOffsetDateEnd.toString().match(/GMT(.{5})/g);
        tzOffsetEnd = tzOffsetEndSearch[0].replace(/GMT(.{3})(.{2})/g, '$1:$2');
      }
      start = start.slice(0, -1) + tzOffsetStart;
      end = end.slice(0, -1) + tzOffsetEnd;
    }
  } else {
    // would be an allday event then
    allday = true;
    start = new Date(Date.UTC(startDate[0], startDate[1] - 1, startDate[2]));
    let breakStart = start.toISOString().replace(/T(.+)Z/g, '');
    end = new Date(Date.UTC(endDate[0], endDate[1] - 1, endDate[2]));
    if (targetCal == 'google' || targetCal == 'microsoft' || targetCal == 'ical') {
      end.setDate(end.getDate() + 1); // increment the day by 1 for Google Calendar, iCal and Outlook
    }
    let breakEnd = end.toISOString().replace(/T(.+)Z/g, '');
    if (style == 'clean') {
      breakStart = breakStart.replace(/-/g, '');
      breakEnd = breakEnd.replace(/-/g, '');
    }
    start = breakStart;
    end = breakEnd;
  }
  const returnObject = { start, end, allday };
  return returnObject;
}

// SHARED FUNCTION TO SECURE URLS
function atcb_secure_url(url, throwError = true) {
  if (
    url.match(
      /((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi
    )
  ) {
    if (throwError) {
      console.error(
        'Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!'
      );
    }
    return false;
  } else {
    return true;
  }
}

// SHARED FUNCTION TO CREATE INFO MODALS
function atcb_create_modal(data, headline, content, buttons, type = '') {
  // setting the stage
  const bgOverlay = atcb_generate_bg_overlay('modal', 'click', data.background);
  const infoModalWrapper = document.createElement('div');
  infoModalWrapper.classList.add('atcb-modal', 'atcb-info-modal');
  infoModalWrapper.tabIndex = 0;
  bgOverlay.appendChild(infoModalWrapper);
  document.body.appendChild(bgOverlay);
  document.body.classList.add('atcb-modal-no-scroll');
  const parentButton = document.getElementById(data.identifier);
  if (parentButton != null) {
    parentButton.classList.add('atcb-active-modal');
  }
  const infoModal = document.createElement('div');
  infoModal.classList.add('atcb-modal-box');
  switch (type) {
    case 'instagram':
      infoModal.classList.add('atcb-modal-instagram');
      break;
  }
  infoModalWrapper.appendChild(infoModal);
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // adding headline
  const infoModalHeadline = document.createElement('div');
  infoModalHeadline.classList.add('atcb-modal-headline');
  infoModalHeadline.textContent = headline;
  infoModal.appendChild(infoModalHeadline);
  // and text content
  const infoModalContent = document.createElement('div');
  infoModalContent.classList.add('atcb-modal-content');
  infoModalContent.innerHTML = content;
  infoModal.appendChild(infoModalContent);
  // and a buttons
  buttons.forEach((button, index) => {
    let infoModalButton = document.createElement('button');
    infoModalButton.setAttribute('type', 'button');
    infoModalButton.classList.add('atcb-modal-btn');
    infoModalButton.textContent = button.label;
    infoModal.appendChild(infoModalButton);
    if (index == 0) {
      infoModalButton.focus();
    }
    switch (button.type) {
      case 'close':
      default:
        infoModalButton.addEventListener(
          'click',
          atcb_debounce(() => atcb_close())
        );
        infoModalButton.addEventListener(
          'keydown',
          atcb_debounce_leading((event) => {
            if (event.key == 'Enter') {
              event.preventDefault();
              atcb_close();
            }
          })
        );
        break;
    }
  });
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE DROPDOWN LIST
function atcb_position_list(trigger, list) {
  let anchorSet = false;
  if (trigger.nextElementSibling !== null) {
    if (trigger.nextElementSibling.classList.contains('atcb-dropdown-anchor')) {
      trigger = trigger.nextSibling;
      anchorSet = true;
    }
  }
  const rect = trigger.getBoundingClientRect();
  list.style.width = rect.width + 'px';
  if (anchorSet === true) {
    list.style.top = rect.top + window.scrollY + 'px';
  } else {
    list.style.top = rect.bottom + window.scrollY + 'px';
  }
  list.style.left = rect.left + 'px';
}

// SHARED FUNCTION TO DEFINE WIDTH AND HEIGHT FOR "FULLSCREEN" FULLSIZE ELEMENTS
function atcb_set_fullsize(el) {
  el.style.width = window.innerWidth + 'px';
  el.style.height = window.innerHeight + 100 + 'px';
}

// SHARED DEBOUNCE AND THROTTLE FUNCTIONS
// going for last call debounce
function atcb_debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
// dropping subsequent calls debounce
function atcb_debounce_leading(func, timeout = 200) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}
// throttle
function atcb_throttle(func, delay = 10) {
  let result;
  let timeout = null;
  let previous = 0;
  let later = (...args) => {
    previous = Date.now();
    timeout = null;
    result = func.apply(this, args);
  };
  return (...args) => {
    let now = Date.now();
    let remaining = delay - (now - previous);
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

// GLOBAL LISTENERS
if (isBrowser()) {
  // Global listener to ESC key to close dropdown
  document.addEventListener(
    'keydown',
    atcb_debounce_leading((event) => {
      if (event.key === 'Escape') {
        atcb_close();
      }
    })
  );
  // Global listener to any screen changes
  window.addEventListener(
    'resize',
    atcb_throttle(() => {
      let activeOverlay = document.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
      }
      let activeButton = document.querySelector('.atcb-active');
      let activeList = document.querySelector('.atcb-dropdown');
      if (activeButton != null && activeList != null) {
        atcb_position_list(activeButton, activeList);
      }
    })
  );
}

// TRANSLATIONS
function atcb_translate(identifier, language) {
  switch (language) {
    case 'en':
    default:
      switch (identifier) {
        case 'Add to Calendar':
          return 'Add to Calendar';
        case 'iCal File':
          return 'iCal File';
        case 'Close':
          return 'Close';
        case 'Close Selection':
          return 'Close Selection';
        case 'Close note':
          return 'Close note';
        case 'Instagram iCal':
          return 'Instagram iCal';
        case 'Instagram info description':
          return "Unfortunately, the Instagram browser has its problems with the way we generate the calendar file.<br>We automatically put a magical URL into your phone's clipboard.<br><ol><li>Close this note, ...</li><li><strong>Open any other browser</strong> on your phone, ...</li><li><strong>Paste</strong> the clipboard content and go.";
      }
      break;
    case 'de':
      switch (identifier) {
        case 'Add to Calendar':
          return 'Im Kalender speichern';
        case 'iCal File':
          return 'iCal-Datei';
        case 'Close':
          return 'Schließen';
        case 'Close Selection':
          return 'Auswahl schließen';
        case 'Close note':
          return 'Fenster schließen';
        case 'Instagram iCal':
          return 'Instagram iCal';
        case 'Instagram info description':
          return 'Leider hat der Instagram-Browser so seine Probleme mit der Art, wie wir Kalender-Dateien erzeugen.<br>Wir haben automatisch eine magische URL in die Zwischenablage deines Smartphones kopiert.<br><ol><li>Schließe dieses Fenster, ...</li><li><strong>Öffne einen anderen Browser</strong> auf deinem Smartphone, ...</li><li>Nutze die <strong>Einfügen</strong>-Funktion, um fortzufahren.';
      }
      break;
  }
  // if nothing found, return the original identifier
  return identifier;
}

// START INIT
if (isBrowser()) {
  if (document.readyState !== 'loading') {
    // if the script is loaded after the page has been loaded, run the initilization
    atcb_init();
  } else {
    // otherwise, init the magic as soon as the DOM has been loaded
    document.addEventListener('DOMContentLoaded', atcb_init, false);
  }
}
// END INIT
