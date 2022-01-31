/**
 * ++++++++++++++++++++++
 * Add-to-Calendar Button
 * ++++++++++++++++++++++
 */
const atcbVersion = '1.4.3';
/* Creator: Jens Kuerschner (https://jenskuerschner.de)
 * Project: https://github.com/jekuer/add-to-calendar-button
 * License: MIT with “Commons Clause” License Condition v1.0
 * 
 */



// INITIALIZE THE SCRIPT AND FUNCTIONALITY
function atcb_init() {
  // let's get started
  console.log("add-to-calendar button initialized (version " + atcbVersion + ")");
  console.log ("See https://github.com/jekuer/add-to-calendar-button for details");
  // get all placeholders
  let atcButtons = document.querySelectorAll('.atcb');
  // if there are some, move on
  if (atcButtons.length > 0) {
    // get the amount of already initialized ones first
    let atcButtonsInitialized = document.querySelectorAll('.atcb_initialized');
    // generate the buttons one by one
    for (let i = 0; i < atcButtons.length; i++) {
      // skip already initialized ones
      if (atcButtons[i].classList.contains('atcb_initialized')) {
        continue;
      }
      let atcbConfig;
      // check if schema.org markup is present
      let schema = atcButtons[i].querySelector('script');
      // get their JSON content first
      if (schema && schema.innerHTML) {
        // get schema.org event markup and flatten the event block
        atcbConfig = JSON.parse(schema.innerHTML);
        atcbConfig = atcb_clean_schema_json(atcbConfig);
        // set flag to not delete HTML content later
        atcbConfig['deleteJSON'] = false;
      } else {
        // get JSON from HTML block
        atcbConfig = JSON.parse(atcButtons[i].innerHTML);
        // set flag to delete HTML content later
        atcbConfig['deleteJSON'] = true;
      }
      // rewrite config for backwards compatibility - you can remove this, if you did not use this script before v1.4.0.
      atcbConfig = atcb_rewrite_config(atcbConfig);
      // check, if all required data is available
      if (atcb_check_required(atcbConfig)) {
        // calculate the real date values in case that there are some special rules included (e.g. adding days dynamically)
        atcbConfig['startDate'] = atcb_date_calculation(atcbConfig['startDate']);
        atcbConfig['endDate'] = atcb_date_calculation(atcbConfig['endDate']);
        // validate the JSON ...
        if (atcb_validate(atcbConfig)) {
          // ... and generate the button on success
          atcb_generate(atcButtons[i], i + atcButtonsInitialized.length, atcbConfig);
        }
      }
    }
  }
}



// CLEAN/NORMALIZE JSON FROM SCHEMA.ORG MARKUP
function atcb_clean_schema_json(atcbConfig) {
  Object.keys(atcbConfig['event']).forEach(key => {
    // move entries one level up, but skip schema types
    if (key.charAt(0) !== '@') {
      atcbConfig[key] = atcbConfig['event'][key]; 
    } 
  });
  // clean schema date+time format
  const endpoints = ['start', 'end'];
  endpoints.forEach(function(point) {
    if (atcbConfig[point + 'Date'] != null) {
      let tmpSplitStartDate = atcbConfig[point + 'Date'].split('T');
      if (tmpSplitStartDate[1] != null) {
        atcbConfig[point + 'Date'] = tmpSplitStartDate[0];
        atcbConfig[point + 'Time'] = tmpSplitStartDate[1];
      }
    }
  });
  // drop the event block and return
  delete atcbConfig.event;
  return atcbConfig;
}



// BACKWARDS COMPATIBILITY REWRITE - you can remove this, if you did not use this script before v1.4.0.
function atcb_rewrite_config(atcbConfig) {
  const keyChanges = {
    'title':      'name',
    'dateStart':  'startDate',
    'dateEnd':    'endDate',
    'timeStart':  'startTime',
    'timeEnd':    'endTime',
  };
  Object.keys(keyChanges).forEach(key => {
    if (atcbConfig[keyChanges[key]] == null && atcbConfig[key] != null) {
      atcbConfig[keyChanges[key]] = atcbConfig[key];
    }
  });  
  return atcbConfig;
}



// CHECK FOR REQUIRED FIELDS
function atcb_check_required(data) {
  // check for at least 1 option
  if (data['options'] == null || data['options'].length < 1) {
    console.log("add-to-calendar button generation failed: no options set");
    return false;
  }
  // check for min required data (without "options")
  const requiredField = ['name', 'startDate', 'endDate']
  return requiredField.every(function(field) {
    if (data[field] == null || data[field] == "") {
      console.log("add-to-calendar button generation failed: required setting missing [" + field + "]");
      return false;
    }
    return true;
  });
}



// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_calculation(dateString) {
  // replace "today" with the current date first
  let today = new Date();
  let todayString = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
  dateString = dateString.replace(/today/ig, todayString);
  // check for any dynamic additions and adjust
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0].split('-');
  let newDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  if (dateStringParts[1] != null && dateStringParts[1] > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  return (((newDate.getMonth() + 1) < 10 ? '0' : '') + (newDate.getMonth() + 1)) + '-' + (newDate.getDate() < 10 ? '0' : '') + newDate.getDate() + '-' + newDate.getFullYear();
}



// VALIDATE THE JSON DATA
function atcb_validate(data) {
  // validate options
  const options = ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'Yahoo']
  if (!data['options'].every(function(option) {
    let cleanOption = option.split('|');
    if (!options.includes(cleanOption[0])) {
      console.log("add-to-calendar button generation failed: invalid option [" + cleanOption[0] + "]");
      return false;
    }
    return true;
  })) {
    return false;
  }
  // validate date
  const dates = ['startDate', 'endDate'];
  let newDate = dates;
  if (!dates.every(function(date) {
    const dateParts = data[date].split('-');
    if (dateParts.length < 3 || dateParts.length > 3) {
      console.log("add-to-calendar button generation failed: date misspelled [" + date + ": " + data[date] + "]");
      return false;
    }
    newDate[date] = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    return true;
  })) {
    return false;
  }
  // validate time
  const times = ['startTime', 'endTime'];
  if (!times.every(function(time) {
    if (data[time] != null) {
      const timeParts = data[time].split(':');
      // validate the time parts
      if (timeParts.length < 2 || timeParts.length > 2) {
        console.log("add-to-calendar button generation failed: time misspelled [" + time + ": " + data[time] + "]");
        return false;
      }
      if (timeParts[0] > 23) {
        console.log("add-to-calendar button generation failed: time misspelled - hours number too high [" + time + ": " + timeParts[0] + "]");
        return false;
      }
      if (timeParts[1] > 59) {
        console.log("add-to-calendar button generation failed: time misspelled - minutes number too high [" + time + ": " + timeParts[1] + "]");
        return false;
      }
      // update the date with the time for further validation steps
      if (time == 'startTime') {
        newDate['startDate'] = new Date(newDate['startDate'].getTime() + (timeParts[0] * 3600000) + (timeParts[1] * 60000))
      }
      if (time == 'endTime') {
        newDate['endDate'] = new Date(newDate['endDate'].getTime() + (timeParts[0] * 3600000) + (timeParts[1] * 60000))      
      }
    }
    return true;
  })) {
    return false;
  }
  if ((data['startTime'] != null && data['endTime'] == null) || (data['startTime'] == null && data['endTime'] != null)) {
    console.log("add-to-calendar button generation failed: if you set a starting time, you also need to define an end time");
    return false;
  }
  // validate whether end is not before start
  if (newDate['endDate'] < newDate['startDate']) {
    console.log("add-to-calendar button generation failed: end date before start date");
    return false;
  }
  // on passing the validation, return true
  return true;
}



// GENERATE THE ACTUAL BUTTON
function atcb_generate(button, buttonId, data) {
  // clean the placeholder, if flagged that way
  if (data['deleteJSON']) {
    button.innerHTML = '';
  }
  // generate the wrapper div
  let buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb_button_wrapper');
  button.appendChild(buttonTriggerWrapper);
  // generate the button trigger div
  let buttonTrigger = document.createElement('div');
  buttonTrigger.id = 'atcb_button_' + buttonId;
  buttonTrigger.classList.add('atcb_button');
  buttonTrigger.dataset.atcbtn = buttonId;
  buttonTriggerWrapper.appendChild(buttonTrigger);
  buttonTrigger.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M81.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zm-3.65 76.03c1.83 0 3.32 1.49 3.32 3.32s-1.49 3.32-3.32 3.32l-12.95-.04-.04 12.93c0 1.83-1.49 3.32-3.32 3.32s-3.32-1.49-3.32-3.32l.04-12.94-12.93-.05c-1.83 0-3.32-1.49-3.32-3.32s1.49-3.32 3.32-3.32l12.94.04.04-12.93c0-1.83 1.49-3.32 3.32-3.32s3.32 1.49 3.32 3.32l-.04 12.95 12.94.04h0zM29.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zM6.4 45.32h110.08V21.47c0-.8-.33-1.53-.86-2.07-.53-.53-1.26-.86-2.07-.86H103c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h10.55c2.57 0 4.9 1.05 6.59 2.74s2.74 4.02 2.74 6.59v27.06 65.03c0 2.57-1.05 4.9-2.74 6.59s-4.02 2.74-6.59 2.74H9.33c-2.57 0-4.9-1.05-6.59-2.74-1.69-1.7-2.74-4.03-2.74-6.6V48.53 21.47c0-2.57 1.05-4.9 2.74-6.59s4.02-2.74 6.59-2.74H20.6c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H9.33c-.8 0-1.53.33-2.07.86-.53.53-.86 1.26-.86 2.07v23.85h0zm110.08 6.41H6.4v61.82c0 .8.33 1.53.86 2.07.53.53 1.26.86 2.07.86h104.22c.8 0 1.53-.33 2.07-.86.53-.53.86-1.26.86-2.07V51.73h0zM50.43 18.54c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h21.49c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H50.43h0z"/></svg></span>';
  buttonTrigger.innerHTML += '<span class="atcb_text">' + (data['label'] || 'Add to Calendar') + '</span>';
  // set event listeners for the button trigger
  if (data['trigger'] == 'click') {
    buttonTrigger.addEventListener('click', atcb_toggle, {passive: true});
  } else {
    buttonTrigger.addEventListener('touchstart', atcb_toggle, {passive: true});
    buttonTrigger.addEventListener('mouseenter', atcb_open, false);
  }
  // standardize any line breaks in the description
  data['description'] = data['description'].replace(/<br\s*\/?>/gmi, '\n');
  // generate the options list
  let optionsList = document.createElement('div');
  optionsList.id = 'atcb_list_' + buttonId;
  optionsList.classList.add('atcb_list');
  optionsList.style.display = 'none';
  buttonTriggerWrapper.appendChild(optionsList);
  // generate the list items
  data['options'].forEach(function(option) {
    let optionParts = option.split('|');
    let optionItem = document.createElement('div');
    optionItem.classList.add('atcb_list_item');    
    optionsList.appendChild(optionItem);
    switch (optionParts[0]) {
      case "Apple":
        optionItem.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" viewBox="0 0 640 640"><path d="M494.782 340.02c-.803-81.025 66.084-119.907 69.072-121.832-37.595-54.993-96.167-62.552-117.037-63.402-49.843-5.032-97.242 29.362-122.565 29.362-25.253 0-64.277-28.607-105.604-27.85-54.32.803-104.4 31.594-132.403 80.245C29.81 334.457 71.81 479.58 126.816 558.976c26.87 38.882 58.914 82.56 100.997 81 40.512-1.594 55.843-26.244 104.848-26.244 48.993 0 62.753 26.245 105.64 25.406 43.606-.803 71.232-39.638 97.925-78.65 30.887-45.12 43.548-88.75 44.316-90.994-.969-.437-85.029-32.634-85.879-129.439l.118-.035zM414.23 102.178C436.553 75.095 451.636 37.5 447.514-.024c-32.162 1.311-71.163 21.437-94.253 48.485-20.729 24.012-38.836 62.28-33.993 99.036 35.918 2.8 72.591-18.248 94.926-45.272l.036-.047z"/></svg></span>';
        optionItem.innerHTML += '<span class="atcb_text">';
        optionItem.innerHTML += optionParts[1] || 'Apple';
        optionItem.innerHTML += '</span>';
        optionItem.addEventListener('click', function() {
          atcb_generate_ical(data);
          atcb_close_all();
        }, false);
        break;
      case "Google":
        optionItem.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M93.78 29.1H29.1v64.68h64.68V29.1z" fill="#fff"/><path d="M93.78 122.88l29.1-29.1h-29.1v29.1z" fill="#f72a25"/><path d="M122.88 29.1h-29.1v64.68h29.1V29.1z" fill="#fbbc04"/><path d="M93.78 93.78H29.1v29.1h64.68v-29.1z" fill="#34a853"/><path d="M0 93.78v19.4c0 5.36 4.34 9.7 9.7 9.7h19.4v-29.1H0h0z" fill="#188038"/><path d="M122.88 29.1V9.7c0-5.36-4.34-9.7-9.7-9.7h-19.4v29.1h29.1 0z" fill="#1967d2"/><path d="M93.78 0H9.7C4.34 0 0 4.34 0 9.7v84.08h29.1V29.1h64.67V0h.01z" fill="#4285f4"/><path d="M42.37 79.27c-2.42-1.63-4.09-4.02-5-7.17l5.61-2.31c.51 1.94 1.4 3.44 2.67 4.51 1.26 1.07 2.8 1.59 4.59 1.59 1.84 0 3.41-.56 4.73-1.67 1.32-1.12 1.98-2.54 1.98-4.26 0-1.76-.7-3.2-2.09-4.32s-3.14-1.67-5.22-1.67H46.4v-5.55h2.91c1.79 0 3.31-.48 4.54-1.46 1.23-.97 1.84-2.3 1.84-3.99 0-1.5-.55-2.7-1.65-3.6s-2.49-1.35-4.18-1.35c-1.65 0-2.96.44-3.93 1.32s-1.7 2-2.12 3.24l-5.55-2.31c.74-2.09 2.09-3.93 4.07-5.52s4.51-2.39 7.58-2.39c2.27 0 4.32.44 6.13 1.32s3.23 2.1 4.26 3.65c1.03 1.56 1.54 3.31 1.54 5.25 0 1.98-.48 3.65-1.43 5.03-.95 1.37-2.13 2.43-3.52 3.16v.33c1.79.74 3.36 1.96 4.51 3.52 1.17 1.58 1.76 3.46 1.76 5.66s-.56 4.16-1.67 5.88c-1.12 1.72-2.66 3.08-4.62 4.07s-4.17 1.49-6.62 1.49c-2.84 0-5.46-.81-7.88-2.45h0 0zm34.46-27.84l-6.16 4.45-3.08-4.67 11.05-7.97h4.24v37.6h-6.05V51.43h0z" fill="#1a73e8"/></svg></span>';
        optionItem.innerHTML += '<span class="atcb_text">';
        optionItem.innerHTML += optionParts[1] || 'Google';
        optionItem.innerHTML += '</span>';
        optionItem.addEventListener('click', function() {
          atcb_generate_google(data);
          atcb_close_all();
        }, false);
        break;
      case "iCal":
        optionItem.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M81.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zm-15.5 99.08c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2H81.9c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H66.11h0zM15.85 67.09c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H15.85h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H40.98h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2H81.9c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H66.11h0zm25.14 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H91.25h0zm-75.4 18.36c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H15.85h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H40.98h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2H81.9c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H66.11h0zm25.14 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H91.25h0zm-75.4 18.36c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H15.85h0zm25.13 0c-.34 0-.61-1.43-.61-3.2s.27-3.2.61-3.2h15.79c.34 0 .61 1.43.61 3.2s-.27 3.2-.61 3.2H40.98h0zM29.61 4.73c0-2.61 2.58-4.73 5.77-4.73s5.77 2.12 5.77 4.73v20.72c0 2.61-2.58 4.73-5.77 4.73s-5.77-2.12-5.77-4.73V4.73h0zM6.4 45.32h110.07V21.47c0-.8-.33-1.53-.86-2.07-.53-.53-1.26-.86-2.07-.86H103c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h10.55c2.57 0 4.9 1.05 6.59 2.74s2.74 4.02 2.74 6.59v27.06 65.03c0 2.57-1.05 4.9-2.74 6.59s-4.02 2.74-6.59 2.74H9.33c-2.57 0-4.9-1.05-6.59-2.74-1.69-1.7-2.74-4.03-2.74-6.6V48.52 21.47c0-2.57 1.05-4.9 2.74-6.59s4.02-2.74 6.59-2.74H20.6c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H9.33c-.8 0-1.53.33-2.07.86-.53.53-.86 1.26-.86 2.07v23.85h0zm110.08 6.41H6.4v61.82c0 .8.33 1.53.86 2.07.53.53 1.26.86 2.07.86h104.22c.8 0 1.53-.33 2.07-.86.53-.53.86-1.26.86-2.07V51.73h0zM50.43 18.54c-1.77 0-3.2-1.43-3.2-3.2s1.43-3.2 3.2-3.2h21.49c1.77 0 3.2 1.43 3.2 3.2s-1.43 3.2-3.2 3.2H50.43h0z"/></svg></span>';
        optionItem.innerHTML += '<span class="atcb_text">';
        optionItem.innerHTML += optionParts[1] || 'iCal File';
        optionItem.innerHTML += '</span>';
        optionItem.addEventListener('click', function() {
          atcb_generate_ical(data);
          atcb_close_all();
        }, false);
        break;
      case "Microsoft365":
        optionItem.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278050 333334" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"><path fill="#ea3e23" d="M278050 305556l-29-16V28627L178807 0 448 66971l-448 87 22 200227 60865-23821V80555l117920-28193-17 239519L122 267285l178668 65976v73l99231-27462v-316z"/></svg></span>';
        optionItem.innerHTML += '<span class="atcb_text">';
        optionItem.innerHTML += optionParts[1] || 'Microsoft 365';
        optionItem.innerHTML += '</span>';
        optionItem.addEventListener('click', function() {
          atcb_generate_microsoft(data, '365');
          atcb_close_all();
        }, false);
        break;
      case "Outlook.com":
        optionItem.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.129793726981 0 33.251996719421 32" width="2500" height="2397"><path d="M28.596 2H11.404A1.404 1.404 0 0 0 10 3.404V5l9.69 3L30 5V3.404A1.404 1.404 0 0 0 28.596 2z" fill="#0364b8"/><path d="M31.65 17.405A11.341 11.341 0 0 0 32 16a.666.666 0 0 0-.333-.576l-.013-.008-.004-.002L20.812 9.24a1.499 1.499 0 0 0-1.479-.083 1.49 1.49 0 0 0-.145.082L8.35 15.415l-.004.002-.012.007A.666.666 0 0 0 8 16a11.344 11.344 0 0 0 .35 1.405l11.492 8.405z" fill="#0a2767"/><path d="M24 5h-7l-2.021 3L17 11l7 6h6v-6z" fill="#28a8ea"/><path d="M10 5h7v6h-7z" fill="#0078d4"/><path d="M24 5h6v6h-6z" fill="#50d9ff"/><path d="M24 17l-7-6h-7v6l7 6 10.832 1.768z" fill="#0364b8"/><path d="M17 11h7v6h-7z" fill="#0078d4"/><path d="M10 17h7v6h-7z" fill="#064a8c"/><path d="M24 17h6v6h-6z" fill="#0078d4"/><path d="M20.19 25.218l-11.793-8.6.495-.87 10.909 6.212a.528.528 0 0 0 .42-.012l10.933-6.23.496.869z" fill="#0a2767" opacity=".5"/><path d="M31.667 16.577l-.014.008-.003.002-10.838 6.174a1.497 1.497 0 0 1-1.46.091l3.774 5.061 8.254 1.797v.004A1.498 1.498 0 0 0 32 28.5V16a.666.666 0 0 1-.333.577z" fill="#1490df"/><path d="M32 28.5v-.738l-9.983-5.688-1.205.687a1.497 1.497 0 0 1-1.46.091l3.774 5.061 8.254 1.797v.004A1.498 1.498 0 0 0 32 28.5z" opacity=".05"/><path d="M31.95 28.883L21.007 22.65l-.195.11a1.497 1.497 0 0 1-1.46.092l3.774 5.061 8.254 1.797v.004a1.501 1.501 0 0 0 .57-.83z" opacity=".1"/><path d="M8.35 16.59v-.01h-.01l-.03-.02A.65.65 0 0 1 8 16v12.5A1.498 1.498 0 0 0 9.5 30h21a1.503 1.503 0 0 0 .37-.05.637.637 0 0 0 .18-.06.142.142 0 0 0 .06-.02 1.048 1.048 0 0 0 .23-.13c.02-.01.03-.01.04-.03z" fill="#28a8ea"/><path d="M18 24.667V8.333A1.337 1.337 0 0 0 16.667 7H10.03v7.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v10h8.667A1.337 1.337 0 0 0 18 24.667z" opacity=".1"/><path d="M17 25.667V9.333A1.337 1.337 0 0 0 15.667 8H10.03v6.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v11h7.667A1.337 1.337 0 0 0 17 25.667z" opacity=".2"/><path d="M17 23.667V9.333A1.337 1.337 0 0 0 15.667 8H10.03v6.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v9h7.667A1.337 1.337 0 0 0 17 23.667z" opacity=".2"/><path d="M16 23.667V9.333A1.337 1.337 0 0 0 14.667 8H10.03v6.456l-1.68.958-.005.002-.012.007A.666.666 0 0 0 8 16v.005V16v9h6.667A1.337 1.337 0 0 0 16 23.667z" opacity=".2"/><path d="M1.333 8h13.334A1.333 1.333 0 0 1 16 9.333v13.334A1.333 1.333 0 0 1 14.667 24H1.333A1.333 1.333 0 0 1 0 22.667V9.333A1.333 1.333 0 0 1 1.333 8z" fill="#0078d4"/><path d="M3.867 13.468a4.181 4.181 0 0 1 1.642-1.814A4.965 4.965 0 0 1 8.119 11a4.617 4.617 0 0 1 2.413.62 4.14 4.14 0 0 1 1.598 1.733 5.597 5.597 0 0 1 .56 2.55 5.901 5.901 0 0 1-.577 2.666 4.239 4.239 0 0 1-1.645 1.794A4.8 4.8 0 0 1 7.963 21a4.729 4.729 0 0 1-2.468-.627 4.204 4.204 0 0 1-1.618-1.736 5.459 5.459 0 0 1-.567-2.519 6.055 6.055 0 0 1 .557-2.65zm1.75 4.258a2.716 2.716 0 0 0 .923 1.194 2.411 2.411 0 0 0 1.443.435 2.533 2.533 0 0 0 1.541-.449 2.603 2.603 0 0 0 .897-1.197 4.626 4.626 0 0 0 .286-1.665 5.063 5.063 0 0 0-.27-1.686 2.669 2.669 0 0 0-.866-1.24 2.387 2.387 0 0 0-1.527-.473 2.493 2.493 0 0 0-1.477.439 2.741 2.741 0 0 0-.944 1.203 4.776 4.776 0 0 0-.007 3.44z" fill="#fff"/></svg></span>';
        optionItem.innerHTML += '<span class="atcb_text">';
        optionItem.innerHTML += optionParts[1] || 'Outlook.com';
        optionItem.innerHTML += '</span>';
        optionItem.addEventListener('click', function() {
          atcb_generate_microsoft(data, 'outlook');
          atcb_close_all();
        }, false);
        break;
      case "Yahoo":
        optionItem.innerHTML = '<span class="atcb_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3386.34 3010.5" shape-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"><path d="M0 732.88h645.84l376.07 962.1 380.96-962.1h628.76l-946.8 2277.62H451.98l259.19-603.53L.02 732.88zm2763.84 768.75h-704.26L2684.65 0l701.69.03-622.5 1501.6zm-519.78 143.72c216.09 0 391.25 175.17 391.25 391.22 0 216.06-175.16 391.23-391.25 391.23-216.06 0-391.19-175.17-391.19-391.23 0-216.05 175.16-391.22 391.19-391.22z" fill="#5f01d1" fill-rule="nonzero"/></svg></span>';
        optionItem.innerHTML += '<span class="atcb_text">';
        optionItem.innerHTML += optionParts[1] || 'Yahoo';
        optionItem.innerHTML += '</span>';
        optionItem.addEventListener('click', function() {
          atcb_generate_yahoo(data);
          atcb_close_all();
        }, false);
        break;
    }
  });
  // create the background overlay, which also acts as trigger to close any dropdowns
  let bgOverlay = document.createElement('div');
  bgOverlay.id = 'atcb_bgoverlay_' + buttonId;
  bgOverlay.classList.add('atcb_bgoverlay');
  bgOverlay.style.display = 'none';
  button.appendChild(bgOverlay);
  bgOverlay.addEventListener('click', atcb_close_all, {passive: true});
  bgOverlay.addEventListener('touchstart', atcb_close_all, {passive: true});
  bgOverlay.addEventListener('mouseenter', atcb_close_all, false);
  // update the placeholder class to prevent multiple initializations
  button.classList.remove('atcb');
  button.classList.add('atcb_initialized');
  // show the placeholder div
  if (data['inline']) {
    button.style.display = 'inline-block';
  } else {
    button.style.display = 'block';
  }
  // console log
  console.log("add-to-calendar button #" + (buttonId + 1) + " created");
}



// FUNCTIONS TO CONTROL THE INTERACTION
function atcb_toggle() {
  // check for state and adjust accordingly
  if (this.classList.contains('active')) {
    atcb_close.call(this);
  } else {
    atcb_open.call(this);
  }
}

function atcb_open() {
  // add open class and show the list (+ the background overlay)
  this.classList.add('active');
  let list = document.getElementById('atcb_list_' + this.dataset.atcbtn);
  list.style.display = 'block';
  document.getElementById('atcb_bgoverlay_' + this.dataset.atcbtn).style.display = 'block';
}

function atcb_close() {
  // remove the active class, hide the list and the background overlay
  this.classList.remove('active');
  let list = document.getElementById('atcb_list_' + this.dataset.atcbtn);
  list.style.display = 'none';
  document.getElementById('atcb_bgoverlay_' + this.dataset.atcbtn).style.display = 'none';
}


function atcb_close_all() {
  // get all buttons
  let atcButtons = document.querySelectorAll('.atcb_button');
  // and close them one by one
	for (let i = 0; i < atcButtons.length; i++) {
    atcb_close.call(atcButtons[i]);
  }
}



// FUNCTION TO GENERATE THE GOOGLE URL
function atcb_generate_google(data) {
  // base url
  let url = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  // generate and add date
  let formattedDate = atcb_generate_time(data, 'clean', 'google');
  url += '&dates=' + formattedDate['start'] + '%2F' + formattedDate['end'];
  // add details (if set)
  if (data['description'] != null && data['description'] != '') {
    url += '&details=' + encodeURIComponent(data['description']);
  }
  if (data['location'] != null && data['location'] != '') {
    url += '&location=' + encodeURIComponent(data['location']);
  }
  if (data['name'] != null && data['name'] != '') {
    url += '&text=' + encodeURIComponent(data['name']);
  }
  window.open(url, '_blank').focus();
}



// FUNCTION TO GENERATE THE YAHOO URL
function atcb_generate_yahoo(data) {
  // base url
  let url = 'https://calendar.yahoo.com/?v=60';
  // generate and add date
  let formattedDate = atcb_generate_time(data, 'clean');
  url += '&st=' + formattedDate['start'] + '&et=' + formattedDate['end'];
  if (formattedDate['allday']) {
    url += '&dur=allday';
  }
  // add details (if set)
  if (data['description'] != null && data['description'] != '') {
    url += '&desc=' + encodeURIComponent(data['description']);
  }
  if (data['location'] != null && data['location'] != '') {
    url += '&in_loc=' + encodeURIComponent(data['location']);
  }
  if (data['name'] != null && data['name'] != '') {
    url += '&title=' + encodeURIComponent(data['name']);
  }
  window.open(url, '_blank').focus();
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
  let formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');  
  url += '&startdt=' + formattedDate['start'] + '&enddt=' + formattedDate['end'];
  if (formattedDate['allday']) {
    url += '&allday=true';
  }
  // add details (if set)
  if (data['description'] != null && data['description'] != '') {
    url += '&body=' + encodeURIComponent(data['description']);
  }
  if (data['location'] != null && data['location'] != '') {
    url += '&location=' + encodeURIComponent(data['location']);
  }
  if (data['name'] != null && data['name'] != '') {
    url += '&subject=' + encodeURIComponent(data['name']);
  }
  window.open(url, '_blank').focus();
}



// FUNCTION TO GENERATE THE iCAL FILE (also for the Apple option)
function atcb_generate_ical(data) {   
  let now = new Date();
  now = now.toISOString().replace(/\-/g, '').replace(/\:/g, '').replace(/\..../g, '');
  let formattedDate = atcb_generate_time(data, 'clean', 'ical');
  let timeslot = '';
  if (formattedDate['allday']) {
    timeslot = ';VALUE=DATE';
  } 
  let ics_lines = [
   "BEGIN:VCALENDAR",
   "VERSION:2.0",
   "CALSCALE:GREGORIAN",
   "BEGIN:VEVENT",
   "DTSTAMP:" + formattedDate['start'],
   "DTSTART" + timeslot + ":" + formattedDate['start'],
   "DTEND" + timeslot + ":" + formattedDate['end'],
   "DESCRIPTION:" + data['description'].replace(/\n/g, '\\n'),
   "SUMMARY:" + data['name'],
   "LOCATION:" + data['location'],
   "STATUS:CONFIRMED",
   "LAST-MODIFIED:" + now,
   "SEQUENCE:0",
   "END:VEVENT",
   "END:VCALENDAR"
  ];
  let dlurl = 'data:text/calendar;base64,'+btoa(ics_lines.join('\r\n').replace(/[\u00A0-\u2666]/g, function(c) { return '&#' + c.charCodeAt(0) + ';'; })); // includes a fix to not throw an error with non-Latin1 characters. However, still needs improvement, since it shows up encoded in the iCal file.
  try {
    if (!window.ActiveXObject) {
      let save = document.createElement('a');
      save.href = dlurl;
      save.target = '_blank';
      save.download = data['iCalFileName'] || 'event-to-save-in-my-calendar';
      let evt = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
      });
      save.dispatchEvent(evt);  
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }
  } catch(e) {
    console.log(e);
  }
}



// SHARED FUNCTION TO GENERATE A TIME STRING
function atcb_generate_time(data, style = 'delimiters', targetCal = 'general') {
  let startDate = data['startDate'].split('-');
  let endDate = data['endDate'].split('-');
  let start = '';
  let end = '';
  let allday = false;
  if (data['startTime'] != null && data['endTime'] != null) {
    // Adjust for timezone, if set (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for either the TZ name or the offset)
    if (data['timeZoneOffset'] != null && data['timeZoneOffset'] != '') {
      // if we have a timezone offset given, consider it
      start = new Date( startDate[2] + '-' + startDate[0] + '-' + startDate[1] + 'T' + data['startTime'] + ':00.000' + data['timeZoneOffset'] );
      end = new Date( endDate[2] + '-' + endDate[0] + '-' + endDate[1] + 'T' + data['endTime'] + ':00.000' + data['timeZoneOffset'] );
      start = start.toISOString().replace('.000', '');
      end = end.toISOString().replace('.000', '');
      if (style == 'clean') {
        start = start.replace(/\-/g, '').replace(/\:/g, '');
        end = end.replace(/\-/g, '').replace(/\:/g, '');
      }
    } else {
      // if there is no offset, we prepare the time, assuming it is UTC formatted
      start = new Date( startDate[2] + '-' + startDate[0] + '-' + startDate[1] + 'T' + data['startTime'] + ':00.000+00:00' );
      end = new Date( endDate[2] + '-' + endDate[0] + '-' + endDate[1] + 'T' + data['endTime'] + ':00.000+00:00' );
      if (data['timeZone'] != null && data['timeZone'] != '') {
        // if a timezone is given, we adjust dynamically with the modern toLocaleString function
        let utcDate = new Date(start.toLocaleString('en-US', { timeZone: "UTC" }));
        if (data['timeZone'] == 'currentBrowser') {
          data['timeZone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        let tzDate = new Date(start.toLocaleString('en-US', { timeZone: data['timeZone'] }));
        let offset = utcDate.getTime() - tzDate.getTime();
        start.setTime( start.getTime() + offset );
        end.setTime( end.getTime() + offset );
      }
      start = start.toISOString().replace('.000', '');
      end = end.toISOString().replace('.000', '');
      if (style == 'clean') {
        start = start.replace(/\-/g, '').replace(/\:/g, '');
        end = end.replace(/\-/g, '').replace(/\:/g, '');
      }
    }
  } else { // would be an allday event then
    allday = true;
    start = new Date( startDate[2], startDate[0] - 1, startDate[1]);
    start.setDate(start.getDate() + 1); // increment the day by 1
    let breakStart = start.toISOString().split('T');
    end = new Date( endDate[2], endDate[0] - 1, endDate[1]);
    if (targetCal == 'google' || targetCal == 'microsoft' || targetCal == 'ical') {
      end.setDate(end.getDate() + 2); // increment the day by 2 for Google Calendar, iCal and Outlook
    } else {
      end.setDate(end.getDate() + 1); // otherwise by 1
    }
    let breakEnd = end.toISOString().split('T');
    if (style == 'clean') {
      breakStart[0] = breakStart[0].replace(/\-/g, '');
      breakEnd[0] = breakEnd[0].replace(/\-/g, '');
    }
    start = breakStart[0];
    end = breakEnd[0];
  }
  let returnObject = {'start':start, 'end':end, 'allday':allday};
  return returnObject;
}



// START INIT
document.addEventListener('DOMContentLoaded', atcb_init, false); // init the magic as soon as the DOM has been loaded
//export { atcb_init }; // export statement - requires explicit init somewhere else. Remove the line above, if you want to use this one here
// END INIT