/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.12.6
 *  Creator: Jens Kuerschner (https://jekuer.com)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcb_set_fullsize, atcb_rewrite_html_elements, atcb_copy_to_clipboard, atcb_secure_content, atcb_set_sizes, atcb_validEmail } from './atcb-util.js';
import { atcb_generate_button, atcb_generate_modal_host, atcb_create_modal, atcb_generate_label, atcb_create_atcbl } from './atcb-generate.js';
import { atcb_translate_hook } from './atcb-i18n.js';
import { atcb_log_event } from './atcb-event.js';
import { atcb_decorate_data } from './atcb-decorate.js';

// FUNCTION TO GENERATE A THANK YOU NOTE
async function atcb_generate_ty(hostEl, dataObj) {
  let host = hostEl;
  let data = dataObj;
  // if host is no shadowRoot, try to get the child shadowRoot (case, if called directly)
  if (!hostEl.host) {
    host = host.shadowRoot;
    // in this case, we also decorate the data (again)
    data = await atcb_decorate_data(data);
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
    return;
  }
  const tyHost = await atcb_generate_modal_host(host, data);
  atcb_set_fullsize(tyHost.querySelector('.atcb-modal-host-initialized'));
  // get data
  const tyData = data.ty;
  // set default, if type is missing required information
  if ((tyData.type === 'link' || tyData.type === 'form') && (!tyData.url || tyData.url === '' || !tyData.url.startsWith('http'))) {
    tyData.type = 'text';
  }
  // define default headline
  if (!tyData.headline || tyData.headline === '') {
    tyData.headline = atcb_translate_hook('thankyou', data) + '!';
  }
  // prepare content with...
  let tyContent = '<div class="pro"><p id="ty-success-msg">' + atcb_translate_hook('form.success', data) + '</p><div id="ty-content">';
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
    </p>`;
  }
  // form, if type = form
  let header = {};
  if (tyData.type === 'form') {
    const noIntro = !tyData.text || tyData.text === '' || tyData.text === undefined;
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return atcb_translate_hook('submit', data);
    })();
    tyContent += '<form id="' + data.identifier + '-ty-form" class="pro-form' + (noIntro ? ' no-intro' : '') + '">';
    if (tyData.fields && tyData.fields.length > 0) {
      // if there is a field with name "header" of type "hidden" and a value with a valid JSON string, we set the header
      const headerField = tyData.fields.find((field) => field.name === 'header' && field.type === 'hidden');
      if (headerField && headerField.default && headerField.default !== '' && headerField.default.startsWith('{')) {
        try {
          header = JSON.parse(headerField.default);
          // if header is still empty, we set an entry "atcb" with the value "true" as default to make sure the request is sent as JSON
          if (Object.keys(header).length === 0) {
            header.atcb = true;
          }
          // delete this field from the fields array
          tyData.fields = tyData.fields.filter((field) => field.name !== 'header');
        } catch {
          /* do nothing */
        }
      }
      const customForm = atcb_build_form(tyData.fields, data.identifier + '-ty');
      tyData.fields = customForm.fields;
      tyContent += customForm.html;
    }
    tyContent += '<p id="submit-error"></p>';
    tyContent += '<p class="pro-pt"><button type="submit" id="pro-form-submit" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</button><span id="pro-form-submitting" class="pro-waiting"><span>.</span><span>.</span><span>.</span></span></p>';
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
    tyContent += '<p class="pro-pt"><a href="' + tyData.url + '" target="_blank" rel="noopener" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</a></p>';
  }
  tyContent += '</div></div>';
  // create modal
  await atcb_create_modal(tyHost, data, 'checkmark', tyData.headline, tyContent);
  // set enhanced click functionality
  // copy to clipboard, if type = share
  if (tyData.type === 'share') {
    const copyBtn = tyHost.getElementById('atcb-ty-share-copy');
    copyBtn.addEventListener('click', function () {
      atcb_copy_to_clipboard(tyData.url);
      copyBtn.innerHTML = copiedIcon + atcb_translate_hook('label.share.copied', data) + '!';
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
      let valid = atcb_validate_form(tyHost, tyData.fields);
      if (!valid) {
        errorMsg.textContent = atcb_translate_hook('form.error.required', data) + '.';
      }
      // submit data
      if (valid) {
        const bodyData = [];
        let skipRadio = false;
        tyData.fields.forEach((field) => {
          // push fields to data array except for labels - for radio buttons, we only push the checked one
          if (field.type !== 'label') {
            if (field.type === 'radio') {
              if (!skipRadio) {
                const radioGroup = tyHost.querySelectorAll('[name="' + field.name + '"]');
                radioGroup.forEach(function (radio) {
                  if (radio.checked) {
                    bodyData.push({ name: field.name, value: radio.value });
                  }
                });
                skipRadio = true;
              }
            } else if (field.type === 'checkbox') {
              bodyData.push({ name: field.name, value: tyHost.getElementById(field.fieldId).checked });
              skipRadio = false;
            } else {
              bodyData.push({ name: field.name, value: tyHost.getElementById(field.fieldId).value });
              skipRadio = false;
            }
          }
        });
        const request = await sendPostRequest(tyData.url, bodyData, header);
        if (request === true) {
          tyHost.getElementById('ty-success-msg').style.display = 'block';
          tyHost.getElementById('ty-content').style.display = 'none';
          return;
        }
        errorMsg.textContent = atcb_translate_hook('form.error.sending', data) + '.';
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

// FUNCTION TO GENERATE AN RSVP FORM
async function atcb_generate_rsvp_form(host, data, hostEl, keyboardTrigger = false) {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  // prepare the form
  const rsvpData = data.rsvp;
  const noIntro = !rsvpData.text || rsvpData.text === '' || rsvpData.text === undefined;
  const noHeadline = !rsvpData.headline || rsvpData.headline === '' || rsvpData.headline === undefined;
  // prepare content with...
  let hiddenContent = '';
  let rsvpContent = '<div class="pro">';
  // show success message, if already sent
  const sentStatus = localStorage.getItem(data.proKey + '-rsvp-sent') === 'true' || null;
  if (sentStatus) {
    rsvpContent += '<div id="rsvp-sent-content">';
    rsvpContent += '<p>' + atcb_translate_hook('form.success.already', data) + '</p>';
    // button
    if (!data.hideButton) rsvpContent += '<div id="rsvp-atcb"></div>';
    if (data.inlineRsvp) rsvpContent += '<button id="pro-form-restart" ' + (data.disabled && 'disabled') + ' class="atcb-modal-btn atcb-modal-btn btn-small atcb-modal-btn-border">' + atcb_translate_hook('label.rsvp.restart', data) + '</button>';
    rsvpContent += '</div>';
  }
  rsvpContent += '<div id="rsvp-success-msg"><p>' + atcb_translate_hook('form.success.sent', data) + '</p><p id="rsvp-success-msg-email">' + atcb_translate_hook('form.success.email', data) + '</p><p id="rsvp-success-msg-doi">' + atcb_translate_hook('form.success.doi', data) + '</p></div>';
  rsvpContent += '<div id="rsvp-success-msg-demo">' + atcb_translate_hook('form.success.demo', data) + '</div>';
  rsvpContent += '<div id="rsvp-content">';
  // intro text
  if (rsvpData.text && rsvpData.text !== '') {
    rsvpContent += atcb_rewrite_html_elements(rsvpData.text);
  }
  rsvpContent += '<form id="' + data.identifier + '-rsvp-form" class="pro-form' + (noIntro ? ' no-intro' : '') + (noHeadline ? ' no-headline' : '') + '">';
  // add status, amount, and email fields based on situation
  const staticID = data.proKey || 'demo-rsvp';
  if (rsvpData.initial_confirmation === false) {
    rsvpContent += '<div id="rsvp-status-group">';
    rsvpContent += '<p>' + atcb_translate_hook('form.status', data) + '</p>';
    rsvpContent +=
      '<div class="pro-field pro-field-type-radio"><div><input type="radio" name="' +
      staticID +
      '-status" id="' +
      data.identifier +
      '-rsvp-status-confirmed" aria-label="' +
      atcb_translate_hook('form.status.confirmed', data) +
      '" checked value="confirmed" ' +
      (data.disabled && 'disabled') +
      ' /><label for="' +
      data.identifier +
      '-rsvp-status-confirmed" class="status-confirmed"><span>' +
      atcb_translate_hook('form.status.confirmed', data) +
      '</span></label></div>';
    if (rsvpData.maybe_option === true) {
      rsvpContent +=
        '<div><input type="radio" name="' +
        staticID +
        '-status" id="' +
        data.identifier +
        '-rsvp-status-undecided" aria-label="' +
        atcb_translate_hook('form.status.undecided', data) +
        '" value="undecided" ' +
        (data.disabled && 'disabled') +
        ' /><label for="' +
        data.identifier +
        '-rsvp-status-undecided" class="status-undecided"><span>' +
        atcb_translate_hook('form.status.undecided', data) +
        '</span></label></div>';
    }
    rsvpContent +=
      '<div><input type="radio" name="' +
      staticID +
      '-status" id="' +
      data.identifier +
      '-rsvp-status-declined" aria-label="' +
      atcb_translate_hook('form.status.declined', data) +
      '" value="declined" ' +
      (data.disabled && 'disabled') +
      ' /><label for="' +
      data.identifier +
      '-rsvp-status-declined" class="status-declined"><span>' +
      atcb_translate_hook('form.status.declined', data) +
      '</span></label></div></div>';
    rsvpContent += '</div>';
  } else {
    hiddenContent += '<input type="hidden" name="' + staticID + '-status" id="' + data.identifier + '-rsvp-status-confirmed" value="confirmed" />';
  }
  const maxAmount = rsvpData.maxpp || 1;
  if (maxAmount === 1) {
    hiddenContent += '<input type="hidden" name="' + staticID + '-amount" id="' + data.identifier + '-rsvp-amount" value="1" />';
  } else {
    rsvpContent += '<div class="pro-field"><label for="' + data.identifier + '-rsvp-amount">' + atcb_translate_hook('form.amount', data) + ' (' + atcb_translate_hook('form.max', data) + ' ' + maxAmount + ')<span>*</span></label>';
    rsvpContent += '<input type="number" name="' + staticID + '-amount" min="1" max="' + maxAmount + '" id="' + data.identifier + '-rsvp-amount" ' + (data.disabled && 'disabled') + ' aria-label="' + atcb_translate_hook('form.amount', data) + '" value="1" /></div>';
  }
  const attendee = (function () {
    if (data.attendee && data.attendee !== '') {
      const attendeeParts = data.attendee.split('|');
      if (attendeeParts.length > 1) {
        return attendeeParts[1];
      }
      return attendeeParts[0];
    }
    return null;
  })();
  const customEmailField = rsvpData.fields?.find((field) => field.name === 'email');
  if (!customEmailField) {
    if (attendee) {
      hiddenContent += '<input type="hidden" name="email" id="' + data.identifier + '-rsvp-email" value="' + attendee + '" />';
    } else {
      rsvpContent += '<div class="pro-field"><label for="' + data.identifier + '-rsvp-email">' + atcb_translate_hook('form.email', data) + '<span>*</span></label>';
      rsvpContent += '<input type="email" name="email" id="' + data.identifier + '-rsvp-email" ' + (data.disabled && 'disabled') + ' aria-label="' + atcb_translate_hook('form.email', data) + '" value="" /></div>';
    }
  } else {
    rsvpData.fields = rsvpData.fields.map((field) => {
      if (field.name === 'email') {
        return { ...field, required: true, type: 'email', default: attendee !== '' ? attendee : field.default };
      }
      return field;
    });
  }
  // add custom fields
  if (rsvpData.fields && rsvpData.fields.length > 0) {
    const customForm = atcb_build_form(rsvpData.fields, data.identifier + '-rsvp', data.disabled);
    rsvpData.fields = customForm.fields;
    rsvpContent += customForm.html;
  }
  rsvpContent += hiddenContent;
  rsvpContent += '<p id="submit-error"></p>';
  rsvpContent +=
    '<p class="pro-pt"><button type="submit" id="pro-form-submit" ' +
    (data.disabled && 'disabled') +
    ' class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' +
    atcb_translate_hook('submit', data) +
    '</button><span id="pro-form-submitting" class="pro-waiting"><span>.</span><span>.</span><span>.</span></span></p>';
  if (rsvpData.seatsLeft && rsvpData.seatsLeft > 0) {
    rsvpContent += '<p class="pro-form-fine">' + atcb_translate_hook('form.seatsleft', data) + ': <b>' + rsvpData.seatsLeft + '</b></p>';
  }
  rsvpContent += '</form>';
  rsvpContent += '</div></div>';

  // the host for the form now is either the host or the modal host
  let rsvpHost = null;
  if (!data.inlineRsvp) {
    rsvpHost = await atcb_generate_modal_host(host, data);
    atcb_set_fullsize(rsvpHost.querySelector('.atcb-modal-host-initialized'));
    await atcb_create_modal(
      rsvpHost,
      data,
      undefined,
      rsvpData.headline,
      rsvpContent,
      [
        { type: 'none', label: atcb_translate_hook('label.rsvp.restart', data), small: true, primary: true, id: 'pro-form-restart' },
        { type: 'close', label: atcb_translate_hook('close', data), small: true, id: 'modal-btn-close' },
        { type: 'close', label: atcb_translate_hook('cancel', data), small: true, id: 'modal-btn-cancel' },
      ],
      [],
      keyboardTrigger,
      {},
      false,
    );
  } else {
    rsvpHost = host;
    const rsvpInlineWrapper = document.createElement('div');
    rsvpInlineWrapper.classList.add('atcb-modal-box', 'rsvp-inline-wrapper');
    rsvpInlineWrapper.setAttribute('part', 'atcb-modal-box');
    if (data.rtl) {
      rsvpInlineWrapper.classList.add('atcb-rtl');
    }
    hostEl.append(rsvpInlineWrapper);
    if (rsvpData.headline) {
      const rsvpInlineHeadline = document.createElement('div');
      rsvpInlineHeadline.classList.add('atcb-modal-headline');
      rsvpInlineWrapper.append(rsvpInlineHeadline);
      rsvpInlineHeadline.innerHTML = rsvpData.headline;
    }
    const rsvpInlineContent = document.createElement('div');
    rsvpInlineContent.classList.add('atcb-modal-content');
    rsvpInlineWrapper.append(rsvpInlineContent);
    if (!data.hideBranding) {
      const atcbL = atcb_create_atcbl(rsvpHost, false, true);
      rsvpInlineWrapper.append(atcbL);
    }
    if (rsvpData.expired) {
      rsvpInlineContent.innerHTML = '<div class="pro"><p>' + atcb_translate_hook('label.rsvp.expired', data) + '</p></div>';
      return;
    } else if (rsvpData.bookedOut) {
      rsvpInlineContent.innerHTML = '<div class="pro"><p>' + atcb_translate_hook('label.rsvp.bookedout', data) + '</p></div>';
      return;
    } else {
      rsvpInlineContent.innerHTML = rsvpContent;
    }
  }
  if (sentStatus) rsvpHost.getElementById('rsvp-content').style.display = 'none';
  const closeBtn = rsvpHost.getElementById('modal-btn-close');
  const cancelBtn = rsvpHost.getElementById('modal-btn-cancel');
  const restartBtn = rsvpHost.getElementById('pro-form-restart');
  atcb_log_event('openRSVP', data.identifier, data.identifier);
  if (data.debug) {
    console.log('RSVP form for "' + data.identifier + '" created');
  }
  // if we are on the already-sent-screen, we render an atcb if not disabled
  if (sentStatus) {
    if (cancelBtn) cancelBtn.style.display = 'none';
    const atcbHost = rsvpHost.getElementById('rsvp-atcb');
    if (atcbHost && !data.hideButton) {
      // make a copy of the data
      const atcbData = JSON.parse(JSON.stringify(data));
      // force individual buttons without label
      atcbData.hideTextLabelButton = true;
      atcbData.hideIconButton = false;
      atcbData.buttonsList = true;
      atcb_generate_button(host, atcbHost, atcbData);
    }
  } else {
    if (closeBtn) closeBtn.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'none';
  }
  // validation and processing of the form
  // validate and submit
  const rsvpForm = rsvpHost.getElementById(data.identifier + '-rsvp-form');
  const errorMsg = rsvpHost.getElementById('submit-error');
  const rsvpFormSubmit = rsvpHost.getElementById('pro-form-submit');
  const rsvpFormSubmitting = rsvpHost.getElementById('pro-form-submitting');
  const rsvpRestart = rsvpHost.getElementById('pro-form-restart');
  if (rsvpFormSubmit) {
    rsvpFormSubmit.addEventListener('click', async function (e) {
      e.preventDefault();
      rsvpFormSubmitting.style.display = 'block';
      rsvpFormSubmit.style.display = 'none';
      const staticFields = [{ type: 'number', name: data.proKey + '-amount', fieldId: data.identifier + '-rsvp-amount', required: true }];
      if (!customEmailField) staticFields.push({ type: 'email', name: 'email', fieldId: data.identifier + '-rsvp-email', required: true });
      let valid = atcb_validate_form(rsvpHost, [...staticFields, ...rsvpData.fields]);
      // if maxpp, make sure amount is not bigger
      const amountEl = rsvpHost.getElementById(data.identifier + '-rsvp-amount');
      const amount = parseInt(amountEl.value) || 1;
      if (rsvpData.maxpp && rsvpData.maxpp > 0 && amount > rsvpData.maxpp) {
        amountEl.classList.add('error');
        valid = false;
      }
      if (!valid) {
        errorMsg.textContent = atcb_translate_hook('form.error.required', data) + '.';
      }
      // submit data
      if (valid) {
        if (!data.proKey || data.proKey === '') {
          // if no prokey, we just show a demo success message
          rsvpHost.getElementById('rsvp-success-msg-demo').style.display = 'block';
          rsvpHost.getElementById('rsvp-content').style.display = 'none';
          atcb_log_event('successRSVP', data.identifier, data.identifier);
          if (cancelBtn) cancelBtn.style.display = 'none';
          if (closeBtn) closeBtn.style.display = 'block';
          return;
        }
        let fieldsCopy = JSON.parse(JSON.stringify(rsvpData.fields));
        const bodyData = [];
        bodyData.push({ name: 'prokey', value: data.proKey });
        bodyData.push({ name: 'language', value: data.language });
        const statusValEl = rsvpHost.querySelector('[name="' + data.proKey + '-status"]:checked');
        bodyData.push({ name: 'status', value: statusValEl ? statusValEl.value : 'confirmed' });
        bodyData.push({ name: 'amount', value: amount });
        if (!customEmailField) {
          bodyData.push({ name: 'email', value: rsvpHost.getElementById(data.identifier + '-rsvp-email').value });
        } else {
          const emailFieldId = fieldsCopy.find((field) => field.name === 'email')?.fieldId;
          bodyData.push({ name: 'email', value: rsvpHost.getElementById(emailFieldId).value });
          fieldsCopy = fieldsCopy.filter((field) => field.fieldId !== emailFieldId);
        }
        const bodyData_payload = {};
        let skipRadio = false;
        fieldsCopy.forEach((field) => {
          // push fields to data array except for labels - for radio buttons, we only push the checked one
          if (field.type !== 'label') {
            if (field.type === 'radio') {
              if (!skipRadio) {
                const radioGroup = rsvpHost.querySelectorAll('[name="' + field.name + '"]');
                radioGroup.forEach(function (radio) {
                  if (radio.checked) {
                    bodyData_payload[field.name] = radio.value;
                  }
                });
                skipRadio = true;
              }
            } else if (field.type === 'checkbox') {
              bodyData_payload[field.name] = rsvpHost.getElementById(field.fieldId).checked;
              skipRadio = false;
            } else {
              bodyData_payload[field.name] = rsvpHost.getElementById(field.fieldId).value;
              skipRadio = false;
            }
          }
        });
        if (Object.keys(bodyData_payload).length > 0) {
          bodyData.push({ name: 'payload', value: bodyData_payload });
        }
        const request = await sendPostRequest(`https://api${data.dev ? '-dev' : ''}.add-to-calendar-pro.com/24586219-9910-41fe-9b59-df53de9db7af`, bodyData, { rsvp: true });
        if (request === 'doi' || request === true) {
          rsvpHost.getElementById('rsvp-success-msg').style.display = 'block';
          if (request === 'doi') {
            rsvpHost.getElementById('rsvp-success-msg-doi').style.display = 'block';
          } else {
            rsvpHost.getElementById('rsvp-success-msg-email').style.display = 'block';
          }
          rsvpHost.getElementById('rsvp-content').style.display = 'none';
          if (cancelBtn) cancelBtn.style.display = 'none';
          if (closeBtn) closeBtn.style.display = 'block';
          atcb_log_event('successRSVP', data.identifier, data.identifier);
          localStorage.setItem(data.proKey + '-rsvp-sent', true);
          return;
        }
        if (request.error && request.error === 2) {
          errorMsg.textContent = atcb_translate_hook('form.error.email', data) + '.';
        } else if (request.error && request.error === 5) {
          errorMsg.textContent = atcb_translate_hook('label.rsvp.expired', data) + '.';
        } else if (request.error && request.error === 6) {
          if (amount > 1) {
            errorMsg.textContent = atcb_translate_hook('form.error.bookedoutmany', data) + '.';
          } else {
            errorMsg.textContent = atcb_translate_hook('label.rsvp.bookedout', data) + '.';
          }
        } else {
          errorMsg.textContent = atcb_translate_hook('form.error.sending', data) + '.';
        }
      }
      rsvpForm.classList.add('form-error');
      rsvpFormSubmitting.style.display = 'none';
      rsvpFormSubmit.style.display = 'block';
    });
    rsvpFormSubmit.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        rsvpFormSubmit.click();
      }
    });
  }
  // reset
  if (rsvpRestart) {
    rsvpRestart.addEventListener('click', function (e) {
      e.preventDefault();
      rsvpHost.getElementById('rsvp-sent-content').style.display = 'none';
      rsvpHost.getElementById('rsvp-content').style.display = 'block';
      if (closeBtn) closeBtn.style.display = 'none';
      if (restartBtn) restartBtn.style.display = 'none';
      if (cancelBtn) cancelBtn.style.display = 'block';
    });
    rsvpRestart.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        rsvpRestart.click();
      }
    });
  }
}

async function atcb_generate_rsvp_button(host, data) {
  const btnHostEl = host.querySelector('.atcb-initialized');
  // generate the wrapper div
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  if (data.rtl) {
    buttonTriggerWrapper.classList.add('atcb-rtl');
  }
  btnHostEl.append(buttonTriggerWrapper);
  atcb_set_sizes(buttonTriggerWrapper, data.sizes);
  // generate the button trigger div
  const buttonTrigger = document.createElement('button');
  buttonTrigger.classList.add('atcb-button', 'atcb-click', 'atcb-single');
  if (data.disabled) {
    buttonTrigger.setAttribute('disabled', true);
  }
  if (data.hideTextLabelButton) {
    buttonTrigger.classList.add('atcb-no-text');
  }
  buttonTrigger.type = 'button';
  buttonTrigger.setAttribute('aria-expanded', false); // aria-expanded default value on button generate
  buttonTriggerWrapper.append(buttonTrigger);
  // determine label
  const label = (function () {
    if (data.rsvp.expired) {
      return atcb_translate_hook('label.rsvp.expired', data);
    }
    if (data.rsvp.bookedOut) {
      return atcb_translate_hook('label.rsvp.bookedout', data);
    }
    return atcb_translate_hook('label.rsvp', data);
  })();
  // generate the label incl. eventListeners
  atcb_generate_label(host, data, buttonTrigger, 'rsvp', !data.hideIconButton, label, true);
  if (data.debug) {
    console.log('Add to Calendar RSVP Button "' + data.identifier + '" created');
  }
  return true;
}

async function atcb_check_bookings(proKey, dev = false) {
  try {
    const response = await fetch(`https://api${dev ? '-dev' : ''}.add-to-calendar-pro.com/dffb8bbd-ee5e-4a4f-a7ea-503af98ca468?prokey=${proKey}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseJson = await response.json();
    return parseInt(responseJson.total);
  } catch (error) {
    console.error('Error:', error);
  }
  return 0;
}

// SHARED FORM FUNCTIONS
function atcb_build_form(fields, identifier = '', disabled = false) {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  let form = '';
  let hiddenForm = '';
  // for each field, add respective html
  let n = 0;
  let prevType = '';
  let skipped = false;
  for (let i = 1; i <= fields.length; i++) {
    skipped = false;
    const field = fields[i - 1];
    if (field.type !== 'label' && (!field.name || field.name === '')) {
      skipped = true;
      continue;
    }
    if ((prevType === 'radio' && field.type !== 'radio') || prevType !== 'radio') {
      n = i;
    }
    fields[i - 1].fieldId = identifier + '-' + i;
    const fieldValue = field.type === 'radio' ? field.placeholder || '' : field.default || '';
    const fieldLabel = field.label || '';
    const fieldPlaceholder = field.type === 'radio' ? '' : field.placeholder || '';
    let fieldHtml = '';
    if (prevType !== 'hidden' && i === n && i !== 1 && !skipped) {
      fieldHtml += '</div>';
    }
    if (field.type !== 'hidden' && i === n) {
      fieldHtml += '<div class="pro-field' + ' pro-field-type-' + field.type + '">';
    }
    if (field.type === 'label') {
      fieldHtml += '<p>' + fieldLabel + '</p>';
    } else {
      if (field.type === 'radio') {
        fieldHtml += '<div>';
      }
      if (field.type === 'hidden') {
        hiddenForm += '<input type="hidden" name="' + field.name + '" id="' + field.fieldId + '" value="' + fieldValue + '" />';
      } else {
        fieldHtml += atcb_create_field_html(field.type, field.name, fieldLabel, field.fieldId, field.required, fieldValue, field.default, fieldPlaceholder, disabled);
      }
      if (field.type === 'radio') {
        fieldHtml += '</div>';
      }
    }
    form += fieldHtml;
    prevType = field.type;
  }
  if (prevType !== 'hidden') {
    form += '</div>';
  }
  form += hiddenForm;
  return { html: form, fields: fields };
}

function atcb_create_field_html(type, name, fieldLabel, fieldId, required = false, fieldValue, defaultVal = null, fieldPlaceholder = '', disabled = false) {
  let fieldHtml = '';
  // add label
  if ((type === 'text' || type === 'email' || type === 'number') && fieldLabel !== '') {
    fieldHtml += '<label for="' + fieldId + '">' + fieldLabel + (required ? '<span>*</span>' : '') + '</label>';
  }
  // add input
  fieldHtml +=
    '<input type="' +
    type +
    '"' +
    (type === 'number' ? ' min="0"' : '') +
    ((type === 'checkbox' || type === 'radio') && defaultVal && (defaultVal === 'true' || defaultVal === true) ? ' checked' : '') +
    ' name="' +
    name +
    '" id="' +
    fieldId +
    '" placeholder="' +
    fieldPlaceholder +
    '" ' +
    (disabled && 'disabled') +
    ' aria-label="' +
    fieldLabel +
    '" value="' +
    fieldValue +
    '" />';
  // add label for checkboxes and radio buttons
  if ((type === 'checkbox' || type === 'radio') && (fieldLabel !== '' || required)) {
    fieldHtml += '<label for="' + fieldId + '">' + fieldLabel + (required ? '<span>*</span>' : '') + '</label>';
  }
  return fieldHtml;
}

function atcb_validate_form(host, fields) {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  let state = true;
  fields.forEach(function (field) {
    if (field.type !== 'label' && field.type !== 'radio') {
      const input = host.getElementById(field.fieldId);
      if (field.type !== 'checkbox') {
        input.value = atcb_secure_content(input.value.trim());
        if (field.type === 'number') {
          input.value = input.value.replace(/\D/g, '');
        }
        if (field.type === 'email' && input.value !== '' && !atcb_validEmail(input.value)) {
          input.classList.add('error');
          state = false;
          return;
        }
        if (field.required && input.value === '') {
          input.classList.add('error');
          state = false;
          return;
        } else {
          input.classList.remove('error');
        }
      } else {
        if (field.required && input.checked === false) {
          input.classList.add('error');
          state = false;
          return;
        } else {
          input.classList.remove('error');
        }
      }
    }
    if (field.type === 'radio') {
      const radioGroup = host.querySelectorAll('[name="' + field.name + '"]');
      let checked = false;
      radioGroup.forEach(function (radio) {
        if (radio.checked) {
          checked = true;
        }
      });
      if (checked === false) {
        radioGroup[0].classList.add('error');
        state = false;
        return;
      } else {
        radioGroup[0].classList.remove('error');
      }
    }
  });
  return state;
}

// FUNCTION TO SEND A REQUEST TO THE SERVER
async function sendPostRequest(url, fields, header = {}) {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
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
    header['Cache-Control'] = 'no-cache';
    header['Content-Type'] = 'application/json';
    header['Accept'] = '*/*';
    fields.forEach((field) => {
      data[field.name] = field.value;
    });
    requestData = { method: 'POST', headers: header, body: JSON.stringify(data) };
  }
  // Send the FormData object using fetch
  try {
    const response = await fetch(url, requestData);
    const responseJson = await response.json();
    if (!response.ok) {
      console.error('Network response was not ok');
      if (responseJson.error) return responseJson;
      return false;
    }
    if (responseJson.status && responseJson.status === 'doi') {
      return 'doi';
    }
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export { atcb_generate_ty, atcb_generate_rsvp_form, atcb_generate_rsvp_button, atcb_check_bookings };
