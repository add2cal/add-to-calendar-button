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

import { atcb_set_fullsize, atcb_rewrite_html_elements, atcb_copy_to_clipboard, atcb_secure_content } from './atcb-util.js';
import { atcb_generate_modal_host, atcb_create_modal } from './atcb-generate.js';
import { atcb_translate_hook } from './atcb-i18n.js';
import { atcb_log_event } from './atcb-event.js';
import { atcb_decorate_data } from './atcb-decorate.js';

// FUNCTION TO GENERATE A THANK YOU NOTE
function atcb_generate_ty(host, data) {
  // if host is no shadowRoot, try to get the child shadowRoot (case, if called directly)
  if (!host.host) {
    host = host.shadowRoot;
    // in this case, we also decorate the data (again)
    data = atcb_decorate_data(data);
  }
  // inline svg icons
  const copyIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" /></svg>';
  const copiedIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" /></svg>';
  const mailIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>';
  // abort if proKey is not given and we are also not at localhost or add-to-calendar-pro.com
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  if ((!data.proKey || data.proKey === '') && !window.location.hostname.match(/^(localhost|.*\.add-to-calendar-pro.com)$/)) {
    //return;
  }
  const tyHost = atcb_generate_modal_host(host, data);
  atcb_set_fullsize(tyHost.querySelector('.atcb-modal-host-initialized'));
  // get data
  const tyData = data.ty;
  // set default, if type is missing required information
  if ((tyData.type === 'link' || tyData.type === 'form') && (!tyData.url || tyData.url === '' || !tyData.url.startsWith('http'))) {
    tyData.type = 'text';
  }
  // define default headline
  if (!tyData.headline || tyData.headline === '') {
    tyData.headline = atcb_translate_hook('thank_you', data); // TODO: Add to i18n strings
  }
  // prepare content with...
  let tyContent = '<div class="pro"><p id="ty-success-msg">' + atcb_translate_hook('sent_successfully', data) + '</p><div id="ty-content">'; // TODO: Add to i18n strings
  // intro text
  if (tyData.text && tyData.text !== '') {
    tyContent += atcb_rewrite_html_elements(tyData.text);
  }
  // share buttons, if type = share
  if (tyData.type === 'share') {
    tyContent += `<p class="pro-pt pro-share-buttons">
    <a href="mailto:?subject=${encodeURIComponent(atcb_translate_hook('label.share.email.subject', data))}&body=%0A&#10142;%20${encodeURIComponent(tyData.url)}%0A%0A" target="_blank" rel="noopener" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border btn-flex">
      ${mailIcon}
      ${atcb_translate_hook('label.share.email', data)}
    </a>
    <button id="atcb-ty-share-copy" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border btn-flex">
      ${copyIcon}
      ${atcb_translate_hook('label.share.copy', data)}
    </button>
    </p>`; // TODO: Add to i18n strings
  }
  // form, if type = form
  let header = {};
  if (tyData.type === 'form') {
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return atcb_translate_hook('submit', data); // TODO: Add to i18n strings
    })();
    tyContent += '<div id="' + data.identifier + '-ty-form" class="pro-form">';
    // for each field, add respective html
    let n = 0;
    let prevType = '';
    for (let i = 1; i <= tyData.fields.length; i++) {
      const field = tyData.fields[i - 1];
      if (!field.name || field.name === '') {
        continue;
      }
      if (field.type === 'hidden' && field.name.toLowerCase() === 'header' && field.default && field.default !== '') {
        header = JSON.parse(field.default);
        tyData.fields.splice(i - 1, 1);
        continue;
      }
      if ((prevType === 'radio' && field.type !== 'radio') || prevType !== 'radio') {
        n = i;
      }
      tyData.fields[i - 1].fieldId = data.identifier + '-ty-' + i;
      const fieldValue = field.type === 'radio' ? field.placeholder || '' : field.default || '';
      const fieldLabel = field.label || '';
      const fieldPlaceholder = field.type === 'radio' ? '' : field.placeholder || '';
      let fieldHtml = '';
      if (prevType !== 'hidden' && i === n && i !== 1) {
        fieldHtml += '</div>';
      }
      if (field.type !== 'hidden' && i === n) {
        fieldHtml += '<div class="pro-field' + (field.type === 'checkbox' ? ' pro-field-checkradio' : '') + '">';
      }
      if (field.type === 'label') {
        fieldHtml += '<p>' + field.label + '</p>';
      } else {
        if (field.type === 'radio') {
          fieldHtml += '<div class="pro-field-checkradio">';
        }
        // add label
        if ((field.type === 'text' || field.type === 'number') && field.label && field.label !== '') {
          fieldHtml += '<label for="' + field.fieldId + '">' + field.label + (field.required ? '<span>*</span>' : '') + '</label>';
        }
        // add input
        fieldHtml +=
          '<input type="' +
          field.type +
          '"' +
          (field.type === 'number' ? ' min="0"' : '') +
          ((field.type === 'checkbox' || field.type === 'radio') && field.default && (field.default === 'true' || field.default === true) ? ' checked' : '') +
          ' name="' +
          field.name +
          '" id="' +
          field.fieldId +
          '" placeholder="' +
          fieldPlaceholder +
          '" aria-label="' +
          fieldLabel +
          '" value="' +
          fieldValue +
          '" />';
        // add label for checkboxes and radio buttons
        if ((field.type === 'checkbox' || field.type === 'radio') && field.label && field.label !== '') {
          fieldHtml += '<label for="' + field.fieldId + '" class="pro-checkradio-label">' + field.label + (field.required ? '<span>*</span>' : '') + '</label>';
        }
        if (field.type === 'radio') {
          fieldHtml += '</div>';
        }
      }
      tyContent += fieldHtml;
      prevType = field.type;
    }
    if (prevType !== 'hidden') {
      tyContent += '</div>';
    }
    tyContent += '<p id="submit-error"></p>';
    tyContent += '<p class="pro-pt"><button id="pro-form-submit" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</button><span id="pro-form-submitting" class="pro-waiting"><span>.</span><span>.</span><span>.</span></span></p>';
    tyContent += '</div>';
  }
  // button with url param, if provided and type = link
  if (tyData.type === 'link') {
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return atcb_translate_hook('continue', data);
    })();
    tyContent += '<p class="pro-pt"><a href="' + tyData.url + '" target="_blank" rel="noopener" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</a></p>';
  }
  tyContent += '</div></div>';
  // create modal
  atcb_create_modal(tyHost, data, 'checkmark', tyData.headline, tyContent);
  // set enhanced click functionality
  // copy to clipboard, if type = share
  if (tyData.type === 'share') {
    const copyBtn = tyHost.getElementById('atcb-ty-share-copy');
    copyBtn.addEventListener('click', function () {
      atcb_copy_to_clipboard(tyData.url);
      copyBtn.innerHTML = copiedIcon + atcb_translate_hook('label.share.copied', data); // TODO: Add to i18n strings
      setTimeout(function () {
        copyBtn.innerHTML = copyIcon + atcb_translate_hook('label.share.copy', data);
      }, 3000);
    });
    copyBtn.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        copyBtn.click();
      }
    });
  }
  // validate and submit form, if type = form
  if (tyData.type === 'form') {
    const tyForm = tyHost.getElementById(data.identifier + '-ty-form');
    const errorMsg = tyHost.getElementById('submit-error');
    const tyFormSubmit = tyHost.getElementById('pro-form-submit');
    const tyFormSubmitting = tyHost.getElementById('pro-form-submitting');
    tyFormSubmit.addEventListener('click', async function (e) {
      e.preventDefault();
      tyFormSubmitting.style.display = 'block';
      tyFormSubmit.style.display = 'none';
      let valid = true;
      tyData.fields.forEach(function (field) {
        if (field.type !== 'label' && field.type !== 'radio') {
          const input = tyHost.getElementById(field.fieldId);
          if (field.type !== 'checkbox') {
            input.value = atcb_secure_content(input.value.trim());
            if (field.type === 'number') {
              input.value = input.value.replace(/\D/g, '');
            }
            if (field.required && input.value === '') {
              input.classList.add('error');
              errorMsg.textContent = atcb_translate_hook('label.form.error.required', data);
              valid = false;
            } else {
              input.classList.remove('error');
            }
          } else {
            if (field.required && input.checked === false) {
              input.classList.add('error');
              errorMsg.textContent = atcb_translate_hook('label.form.error.required', data);
              valid = false;
            } else {
              input.classList.remove('error');
            }
          }
        }
        if (field.type === 'radio') {
          const radioGroup = tyHost.querySelectorAll('[name="' + field.name + '"]');
          let checked = false;
          radioGroup.forEach(function (radio) {
            if (radio.checked) {
              checked = true;
            }
          });
          if (checked === false) {
            radioGroup[0].classList.add('error');
            errorMsg.textContent = atcb_translate_hook('label.form.error.required', data);
            valid = false;
          } else {
            radioGroup[0].classList.remove('error');
          }
        }
      });
      // submit data
      if (valid) {
        const data = [];
        let skipRadio = false;
        tyData.fields.forEach((field) => {
          // push fields to data array except for labels - for radio buttons, we only push the checked one
          if (field.type !== 'label') {
            if (field.type === 'radio') {
              if (!skipRadio) {
                const radioGroup = tyHost.querySelectorAll('[name="' + field.name + '"]');
                radioGroup.forEach(function (radio) {
                  if (radio.checked) {
                    data.push({ name: field.name, value: radio.value });
                  }
                });
                skipRadio = true;
              }
            } else {
              data.push({ name: field.name, value: tyHost.getElementById(field.fieldId).value });
              skipRadio = false;
            }
          }
        });
        const request = await sendPostRequest(tyData.url, data, header);
        if (request === true) {
          tyHost.getElementById('ty-success-msg').style.display = 'block';
          tyHost.getElementById('ty-content').style.display = 'none';
          return;
        }
        errorMsg.textContent = atcb_translate_hook('label.form.error.sending', data);
      }
      tyForm.classList.add('form-error');
      tyFormSubmitting.style.display = 'none';
      tyFormSubmit.style.display = 'block';
    });
    tyFormSubmit.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        tyFormSubmit.click();
      }
    });
  }
}

// FUNCTION TO SEND A REQUEST TO THE SERVER
async function sendPostRequest(url, fields, header = {}) {
  let formData = new FormData();
  let data = {};
  let requestData = {};
  if (Object.keys(header).length === 0) {
    // if there is no header information, we use FormData
    fields.forEach((field) => {
      formData.append(field.name, field.value);
    });
    requestData = { method: 'POST', body: formData };
  } else {
    // otherwise, we prepare and send data as JSON
    header['Content-Type'] = 'application/json';
    fields.forEach((field) => {
      data[field.name] = field.value;
    });
    requestData = { method: 'POST', headers: header, body: JSON.stringify(data) };
  }
  // Send the FormData object using fetch
  try {
    const response = await fetch(url, requestData);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// FUNCTION TO GENERATE AN RSVP FORM
function atcb_generate_rsvp(host, data, keyboardTrigger = false, inline = false) {
  // abort if proKey is not given and we are also not at localhost or add-to-calendar-pro.com
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  if ((!data.proKey || data.proKey === '') && !window.location.hostname.match(/^(localhost|.*\.add-to-calendar-pro.com)$/)) {
    //return;
  }
  /*
  On load:
  if button and expired, show
  if inline and booked out, show
  if inline, show expired inline
  if modal, pull stats and show booked out if booked out
  Render form.
  if maxpp, show amount and limit to maxpp or max (whatever is lower)
  */
  atcb_log_event('openRSVP', data.identifier, data.identifier);

  /*
  On validation:
  check required
  check form (especially email)
  check against max
  check against expired
  */

  /*
  try to submit:
  on fail, check error:
  - prokey wrong -> general error
  - email wrong -> email error
  - invalid status or inactive -> general error
  - no rsvp -> general error
  - rsvp expired -> expired
  - limit exceeded -> if = 1 -> booked out; else: limit exceeded (+ pull stats again)
  */

  /*
  on success:
  if DOI, show instruction
  if no DOI, show thank you + button
  if not inline, show checkmark
  */
  atcb_log_event('successRSVP', data.identifier, data.identifier);

  if (data.debug) {
    console.log('RSVP form for "' + data.identifier + '" created');
  }
}

export { atcb_generate_ty };
