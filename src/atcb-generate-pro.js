/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.4.1
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
  // define css
  const scopedCss = document.createElement('style');
  if (host.host.hasAttribute('cspnonce')) {
    scopedCss.setAttribute('nonce', host.host.getAttribute('cspnonce'));
  }
  scopedCss.innerText = '.ty { text-align:center; } .atcb-modal-content p { margin:0; } p.ty-pt { margin-top:1.5em; }';
  if (tyData.type === 'share') {
    scopedCss.innerText += '.ty-buttons { display:flex;justify-content:center;flex-wrap:wrap; } .ty .btn-flex { display:flex;align-items:center; } .atcb-modal-btn svg { height:1.5em;width:auto;fill:none;stroke:currentColor;margin-right:.5em; }';
  }
  if (tyData.type === 'form') {
    scopedCss.innerText += '.ty-form { margin-top:1.5em;padding-top:1.5em;border-top:1px solid var(--modal-btn-border);text-align:left; } .ty-field+.ty-field { padding-top: 1.3em; } .ty-field-checkradio { display:flex;align-items:center; } .ty-field-checkradio input { cursor:pointer; }';
    scopedCss.innerText += '.ty-field p { font-size:.9em; } .ty-field label { display:block;opacity:.8;font-size:.9em; } .ty-field label.ty-sublabel { opacity:.7;padding-left:.3em;cursor:pointer; }';
    scopedCss.innerText +=
      '.ty-field input[type="text"], .ty-field input[type="number"] { width:100%;box-sizing:border-box;padding:.7em;font-size:.9em;opacity:.8;border:1px solid var(--modal-btn-border);border-radius:var(--modal-input-border-radius); } .ty-field input[type="text"]:hover, .ty-field input[type="number"]:hover { opacity:1; } .ty-field input[type="text"]:focus, .ty-field input[type="number"]:focus { outline:none;border-color:var(--keyboard-focus); }';
    scopedCss.innerText += '.ty-field input[type="checkbox"], .ty-field input[type="radio"] { width:1.2em;height:1.2rem;accent-color:var(--keyboard-focus); } .ty-field input[type="checkbox"]:focus, .ty-field input[type="radio"]:focus { outline-color:var(--keyboard-focus); }';
    scopedCss.innerText +=
      '#submit-error { display:none;font-weight:bold;color:#f44336;text-align:center;padding-top:1.5em; } .ty-form.ty-error #submit-error { display:block; } label span { font-weight:bold;color:#f44336;padding-left:2px;} .ty-field input.ty-error { border:2px solid #f44336;accent-color:#f44336; } .ty-field input.ty-error+.ty-sublabel { opacity:1;color:#f44336; }';
    scopedCss.innerText += '#ty-form-submit { min-width:150px;margin-left:auto;display:block;margin-right:auto; }';
  }
  tyHost.appendChild(scopedCss);
  // set default, if type is missing required information
  if ((tyData.type === 'link' || tyData.type === 'form') && (!tyData.url || tyData.url === '' || !tyData.url.startsWith('http'))) {
    tyData.type = 'text';
  }
  // define default headline
  if (!tyData.headline || tyData.headline === '') {
    tyData.headline = atcb_translate_hook('thank_you', data); // TODO: Add to i18n strings
  }
  // prepare content with...
  let tyContent = '<div class="ty">';
  // intro text
  if (tyData.text && tyData.text !== '') {
    tyContent += '<p>' + atcb_rewrite_html_elements(tyData.text) + '</p>';
  }
  // share buttons, if type = share
  if (tyData.type === 'share') {
    tyContent += `<p class="ty-pt ty-buttons">
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
  if (tyData.type === 'form') {
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return atcb_translate_hook('submit', data); // TODO: Add to i18n strings
    })();
    tyContent += '<form action="' + tyData.url + '" id="' + data.identifier + '-ty-form" class="ty-form">'; // TODO: Set action URL!
    // for each field, add respective html
    let i = 0;
    let n = 0;
    let prevType = '';
    tyData.fields.forEach(function (field) {
      i++;
      if ((prevType === 'radio' && field.type !== 'radio') || prevType !== 'radio') {
        n = i;
      }
      const fieldId = data.identifier + '-ty-' + i;
      field.fieldId = fieldId;
      const fieldName = data.identifier + '-ty-' + n;
      const fieldValue = field.default || '';
      const fieldLabel = field.label || '';
      const fieldPlaceholder = field.placeholder || '';
      let fieldHtml = '';
      if (prevType !== 'hidden' && i === n && i !== 1) {
        fieldHtml += '</div>';
      }
      if (field.type !== 'hidden' && i === n) {
        fieldHtml += '<div class="ty-field' + (field.type === 'checkbox' ? ' ty-field-checkradio' : '') + '">';
      }
      if (field.type === 'label') {
        fieldHtml += '<p>' + field.label + '</p>';
      } else {
        if (field.type === 'radio') {
          fieldHtml += '<div class="ty-field-checkradio">';
        }
        // add label
        if ((field.type === 'text' || field.type === 'number') && field.label && field.label !== '') {
          fieldHtml += '<label for="' + fieldId + '">' + field.label + (field.required ? '<span>*</span>' : '') + '</label>';
        }
        // add input
        fieldHtml +=
          '<input type="' +
          field.type +
          '"' +
          (field.type === 'number' ? ' min="0"' : '') +
          ((field.type === 'checkbox' || field.type === 'radio') && field.default && (field.default === 'true' || field.default === true) ? ' checked' : '') +
          ' name="' +
          fieldName +
          '" id="' +
          fieldId +
          '" placeholder="' +
          fieldPlaceholder +
          '" aria-label="' +
          fieldLabel +
          '" value="' +
          fieldValue +
          '" />';
        // add label for checkboxes and radio buttons
        if ((field.type === 'checkbox' || field.type === 'radio') && field.label && field.label !== '') {
          fieldHtml += '<label for="' + fieldId + '" class="ty-sublabel">' + field.label + (field.required ? '<span>*</span>' : '') + '</label>';
        }
        if (field.type === 'radio') {
          fieldHtml += '</div>';
        }
      }
      tyContent += fieldHtml;
      prevType = field.type;
    });
    if (prevType !== 'hidden') {
      tyContent += '</div>';
    }
    tyContent += '<p id="submit-error">' + atcb_translate_hook('label.form.required.error', data) + '</p>'; // TODO: Add to i18n strings
    tyContent += '<p class="ty-pt"><button id="ty-form-submit" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</button></p>';
    tyContent += '</form>';
  }
  // button with url param, if provided and type = link
  if (tyData.type === 'link') {
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return atcb_translate_hook('continue', data);
    })();
    tyContent += '<p class="ty-pt"><a href="' + tyData.url + '" target="_blank" rel="noopener" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</a></p>';
  }
  tyContent += '</div>';
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
    const tyFormSubmit = tyHost.getElementById('ty-form-submit');
    tyFormSubmit.addEventListener('click', function (e) {
      e.preventDefault();
      let valid = true;
      // validate fields
      tyData.fields.forEach(function (field) {
        if (field.type !== 'label') {
          const input = tyHost.getElementById(field.fieldId);
          if (field.type !== 'radio' && field.type !== 'checkbox') {
            input.value = atcb_secure_content(input.value.trim());
            if (field.type === 'number') {
              input.value = input.value.replace(/\D/g, '');
            }
            if (field.required && input.value === '') {
              input.classList.add('ty-error');
              valid = false;
            } else {
              input.classList.remove('ty-error');
            }
          } else {
            if (field.required && input.checked === false) {
              input.classList.add('ty-error');
              valid = false;
            } else {
              input.classList.remove('ty-error');
            }
          }
        }
      });
      // submit form
      if (valid) {
        tyForm.submit();
      } else {
        tyForm.classList.add('ty-error');
      }
    });
    tyFormSubmit.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        tyFormSubmit.click();
      }
    });
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
  if button and booked out, show
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
