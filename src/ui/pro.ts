import { rewrite_html_elements, secure_content } from '../core/text';
import { set_sizes } from './positioning';
import { copy_to_clipboard, validEmail } from '../core/util';
import { generate_modal_host, create_modal, generate_label, create_atcbl } from './generate';
import { renderButton } from './templates';
import { translate_hook } from '../i18n/index';
import { log_event } from '../core/events';
import { decorate_data } from '../core/decorate';
import type { ATCBConfig } from '../types';

// local shape for one entry of a custom PRO form (ty or rsvp), as produced/consumed by the shared form helpers
interface ATCBProFormField {
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  default?: string | boolean;
  required?: boolean;
  fieldId?: string;
  [key: string]: unknown;
}

// local shape for data.ty, decorated PRO "thank you" config
interface ATCBTyData {
  type?: string;
  url?: string;
  headline?: string;
  text?: string;
  button_label?: string;
  fields?: ATCBProFormField[];
  [key: string]: unknown;
}

// local shape for data.rsvp, decorated PRO RSVP config
interface ATCBRsvpData {
  text?: string;
  headline?: string;
  initial_confirmation?: boolean;
  maybe_option?: boolean;
  maxpp?: number;
  seatsLeft?: number;
  expired?: boolean;
  bookedOut?: boolean;
  fields?: ATCBProFormField[];
  [key: string]: unknown;
}

// local shape of one entry sent to sendPostRequest
interface ATCBPostField {
  name: string;
  value: unknown;
}

// local shape of the sendPostRequest result when the server responds with an error payload
interface ATCBPostErrorResult {
  error?: number;
  [key: string]: unknown;
}

interface ATCBFormValidationResult {
  valid: boolean;
  firstInvalid: HTMLInputElement | null;
}

function mark_invalid_input(input: HTMLInputElement, currentFirstInvalid: HTMLInputElement | null): HTMLInputElement {
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  return currentFirstInvalid || input;
}

function clear_invalid_input(input: HTMLInputElement): void {
  input.classList.remove('error');
  input.removeAttribute('aria-invalid');
}

function show_submit_error(form: HTMLFormElement, errorEl: HTMLElement, msg: string, firstInvalid: HTMLInputElement | null = null): void {
  errorEl.textContent = msg;
  form.classList.add('form-error');
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  errorEl.focus();
}

// FUNCTION TO GENERATE A THANK YOU NOTE
async function generate_ty(hostEl: ShadowRoot | HTMLElement, dataObj: ATCBConfig): Promise<void> {
  let host = hostEl as ShadowRoot;
  let data = dataObj;
  // if host is no shadowRoot, try to get the child shadowRoot (case, if called directly)
  if (!(hostEl as ShadowRoot).host) {
    host = (hostEl as HTMLElement).shadowRoot as ShadowRoot;
    // in this case, we also decorate the data (again)
    data = await decorate_data(data);
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
  const tyHost = (await generate_modal_host(host, data))!;
  // get data
  const tyData = data.ty as ATCBTyData;
  // set default, if type is missing required information
  if ((tyData.type === 'link' || tyData.type === 'form') && (!tyData.url || tyData.url === '' || !tyData.url.startsWith('http'))) {
    tyData.type = 'text';
  }
  // define default headline
  if (!tyData.headline || tyData.headline === '') {
    tyData.headline = translate_hook('thankyou', data) + '!';
  }
  // prepare content with...
  let tyContent = '<div class="pro"><p id="ty-success-msg">' + translate_hook('form.success.title', data) + '</p><div id="ty-content">';
  // intro text
  if (tyData.text && tyData.text !== '') {
    tyContent += '<div class="pro-intro">' + rewrite_html_elements(tyData.text) + '</div>';
  }
  // share buttons, if type = share
  if (tyData.type === 'share') {
    tyContent += `<p class="pro-pt pro-share-buttons">
    <a href="mailto:?subject=${encodeURIComponent(translate_hook('label.share.email_subject', data))}&body=%0A&#10142;%20${encodeURIComponent(tyData.url!)}%0A%0A" target="_blank" rel="noopener" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border btn-flex">
      ${mailIcon}
      ${translate_hook('label.share.email', data)}
    </a>
    <button id="atcb-ty-share-copy" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border btn-flex">
      ${copyIcon}
      ${translate_hook('label.share.copy', data)}
    </button>
    </p>`;
  }
  // form, if type = form
  let header: { [key: string]: unknown } = {};
  if (tyData.type === 'form') {
    const noIntro = !tyData.text || tyData.text === '' || tyData.text === undefined;
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return translate_hook('submit', data);
    })();
    tyContent += '<form id="' + data.identifier + '-ty-form" class="pro-form' + (noIntro ? ' no-intro' : '') + '">';
    if (tyData.fields && tyData.fields.length > 0) {
      // if there is a field with name "header" of type "hidden" and a value with a valid JSON string, we set the header
      const headerField = tyData.fields.find((field) => field.name === 'header' && field.type === 'hidden');
      if (headerField && headerField.default && headerField.default !== '' && (headerField.default as string).startsWith('{')) {
        try {
          header = JSON.parse(headerField.default as string);
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
      const customForm = build_form(tyData.fields, data.identifier + '-ty');
      tyData.fields = customForm.fields;
      tyContent += customForm.html;
    }
    tyContent += '<p id="submit-error" role="alert" aria-live="assertive" aria-atomic="true" tabindex="-1"></p>';
    tyContent +=
      '<p class="pro-pt"><button type="submit" id="pro-form-submit" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' +
      label +
      '</button><span id="pro-form-submitting" class="pro-waiting" role="status" aria-live="polite" aria-hidden="true"><span>.</span><span>.</span><span>.</span><span class="atcb-sr-only">' +
      translate_hook('submit', data) +
      '</span></span></p>';
    tyContent += '</form>';
  }
  // button with url param, if provided and type = link
  if (tyData.type === 'link') {
    const label = (function () {
      if (tyData.button_label && tyData.button_label !== '') {
        return tyData.button_label;
      }
      return translate_hook('continue', data);
    })();
    tyContent += '<p class="pro-pt"><a href="' + tyData.url + '" target="_blank" rel="noopener" class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' + label + '</a></p>';
  }
  tyContent += '</div></div>';
  // create modal
  await create_modal(tyHost, data, '', tyData.headline, tyContent);
  // set enhanced click functionality
  // copy to clipboard, if type = share
  if (tyData.type === 'share') {
    const copyBtn = tyHost.getElementById('atcb-ty-share-copy') as HTMLButtonElement;
    copyBtn.addEventListener('click', async function () {
      try {
        await copy_to_clipboard(tyData.url);
        copyBtn.innerHTML = copiedIcon + translate_hook('label.share.copied', data) + '!';
        setTimeout(function () {
          copyBtn.innerHTML = copyIcon + translate_hook('label.share.copy', data);
        }, 3000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    });
    copyBtn.addEventListener('keyup', function (event) {
      if ((event as KeyboardEvent).key === 'Enter') {
        event.preventDefault();
        copyBtn.click();
      }
    });
  }
  // validate and submit form, if type = form
  if (tyData.type === 'form') {
    const tyForm = tyHost.getElementById(data.identifier + '-ty-form') as HTMLFormElement;
    const errorMsg = tyHost.getElementById('submit-error') as HTMLElement;
    const tyFormSubmit = tyHost.getElementById('pro-form-submit') as HTMLButtonElement;
    const tyFormSubmitting = tyHost.getElementById('pro-form-submitting') as HTMLElement;
    tyForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      tyForm.classList.remove('form-error');
      errorMsg.textContent = '';
      tyFormSubmitting.setAttribute('aria-hidden', 'false');
      tyFormSubmitting.style.display = 'block';
      tyFormSubmit.style.display = 'none';
      const validation = validate_form(tyHost, tyData.fields!);
      const valid = validation.valid;
      if (!valid) {
        show_submit_error(tyForm, errorMsg, translate_hook('form.error.required', data) + '.', validation.firstInvalid);
      }
      // submit data
      if (valid) {
        const bodyData: ATCBPostField[] = [];
        let skipRadio = false;
        tyData.fields!.forEach((field) => {
          // push fields to data array except for labels - for radio buttons, we only push the checked one
          if (field.type !== 'label') {
            if (field.type === 'radio') {
              if (!skipRadio) {
                const radioGroup = tyHost.querySelectorAll('[name="' + field.name + '"]');
                radioGroup.forEach(function (radio) {
                  if ((radio as HTMLInputElement).checked) {
                    bodyData.push({ name: field.name as string, value: (radio as HTMLInputElement).value });
                  }
                });
                skipRadio = true;
              }
            } else if (field.type === 'checkbox') {
              bodyData.push({ name: field.name as string, value: (tyHost.getElementById(field.fieldId as string) as HTMLInputElement).checked });
              skipRadio = false;
            } else {
              bodyData.push({ name: field.name as string, value: (tyHost.getElementById(field.fieldId as string) as HTMLInputElement).value });
              skipRadio = false;
            }
          }
        });
        const request = await sendPostRequest(tyData.url as string, bodyData, header);
        if (request === true) {
          (tyHost.getElementById('ty-success-msg') as HTMLElement).style.display = 'block';
          (tyHost.getElementById('ty-content') as HTMLElement).style.display = 'none';
          return;
        }
        show_submit_error(tyForm, errorMsg, translate_hook('form.error.sending', data) + '.');
      }
      tyFormSubmitting.setAttribute('aria-hidden', 'true');
      tyFormSubmitting.style.display = 'none';
      tyFormSubmit.style.display = 'block';
    });
  }
}

// FUNCTION TO GENERATE AN RSVP FORM
async function generate_rsvp_form(host: ShadowRoot, data: ATCBConfig, hostEl: HTMLElement, keyboardTrigger: boolean = false): Promise<void> {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  // prepare the form
  const rsvpData = data.rsvp as ATCBRsvpData;
  const noIntro = !rsvpData.text || rsvpData.text === '' || rsvpData.text === undefined;
  const noHeadline = !rsvpData.headline || rsvpData.headline === '' || rsvpData.headline === undefined;
  // prepare content with...
  let hiddenContent = '';
  let rsvpContent = '<div class="pro">';
  // show success message, if already sent
  const sentStatus = localStorage.getItem(data.proKey + '-rsvp-sent') === 'true' || null;
  if (sentStatus) {
    rsvpContent += '<div id="rsvp-sent-content">';
    rsvpContent += '<p>' + translate_hook('form.success.already', data) + '</p>';
    // button
    if (!data.hideButton) rsvpContent += '<div id="rsvp-atcb"></div>';
    if (data.inlineRsvp) rsvpContent += '<button id="pro-form-restart" ' + (data.disabled && 'disabled') + ' class="atcb-modal-btn atcb-modal-btn btn-small atcb-modal-btn-border">' + translate_hook('label.rsvp.restart', data) + '</button>';
    rsvpContent += '</div>';
  }
  rsvpContent += '<div id="rsvp-success-msg"><p>' + translate_hook('form.success.sent', data) + '</p><p id="rsvp-success-msg-email">' + translate_hook('form.success.email', data) + '</p><p id="rsvp-success-msg-doi">' + translate_hook('form.success.doi', data) + '</p></div>';
  rsvpContent += '<div id="rsvp-success-msg-demo">' + translate_hook('form.success.demo', data) + '</div>';
  rsvpContent += '<div id="rsvp-content">';
  // intro text
  if (rsvpData.text && rsvpData.text !== '') {
    rsvpContent += '<div class="pro-intro">' + rewrite_html_elements(rsvpData.text) + '</div>';
  }
  rsvpContent += '<form id="' + data.identifier + '-rsvp-form" class="pro-form' + (noIntro ? ' no-intro' : '') + (noHeadline ? ' no-headline' : '') + '">';
  // add status, amount, and email fields based on situation
  const staticID = data.proKey || 'demo-rsvp';
  if (rsvpData.initial_confirmation === false) {
    rsvpContent += '<div id="rsvp-status-group" role="radiogroup" aria-labelledby="' + data.identifier + '-rsvp-status-title">';
    rsvpContent += '<p id="' + data.identifier + '-rsvp-status-title">' + translate_hook('form.status.title', data) + '</p>';
    rsvpContent +=
      '<div class="pro-field pro-field-type-radio"><div><input type="radio" name="' +
      staticID +
      '-status" id="' +
      data.identifier +
      '-rsvp-status-confirmed" aria-label="' +
      translate_hook('form.status.confirmed', data) +
      '" checked value="confirmed" ' +
      (data.disabled && 'disabled') +
      ' /><label for="' +
      data.identifier +
      '-rsvp-status-confirmed" class="status-confirmed"><span>' +
      translate_hook('form.status.confirmed', data) +
      '</span></label></div>';
    if (rsvpData.maybe_option === true) {
      rsvpContent +=
        '<div><input type="radio" name="' +
        staticID +
        '-status" id="' +
        data.identifier +
        '-rsvp-status-undecided" aria-label="' +
        translate_hook('form.status.undecided', data) +
        '" value="undecided" ' +
        (data.disabled && 'disabled') +
        ' /><label for="' +
        data.identifier +
        '-rsvp-status-undecided" class="status-undecided"><span>' +
        translate_hook('form.status.undecided', data) +
        '</span></label></div>';
    }
    rsvpContent +=
      '<div><input type="radio" name="' +
      staticID +
      '-status" id="' +
      data.identifier +
      '-rsvp-status-declined" aria-label="' +
      translate_hook('form.status.declined', data) +
      '" value="declined" ' +
      (data.disabled && 'disabled') +
      ' /><label for="' +
      data.identifier +
      '-rsvp-status-declined" class="status-declined"><span>' +
      translate_hook('form.status.declined', data) +
      '</span></label></div></div>';
    rsvpContent += '</div>';
  } else {
    hiddenContent += '<input type="hidden" name="' + staticID + '-status" id="' + data.identifier + '-rsvp-status-confirmed" value="confirmed" />';
  }
  const maxAmount = rsvpData.maxpp || 1;
  if (maxAmount === 1) {
    hiddenContent += '<input type="hidden" name="' + staticID + '-amount" id="' + data.identifier + '-rsvp-amount" value="1" />';
  } else {
    rsvpContent += '<div class="pro-field"><label for="' + data.identifier + '-rsvp-amount">' + translate_hook('form.amount', data) + ' (' + translate_hook('form.max', data) + ' ' + maxAmount + ')<span>*</span></label>';
    rsvpContent += '<input type="number" name="' + staticID + '-amount" min="1" max="' + maxAmount + '" id="' + data.identifier + '-rsvp-amount" ' + (data.disabled && 'disabled') + ' required aria-required="true" aria-label="' + translate_hook('form.amount', data) + '" value="1" /></div>';
  }
  const attendee = (function () {
    if (data.dates![0]!.attendee && data.dates![0]!.attendee !== '') {
      const attendeeParts = data.dates![0]!.attendee.split('|');
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
      rsvpContent += '<div class="pro-field"><label for="' + data.identifier + '-rsvp-email">' + translate_hook('form.email', data) + '<span>*</span></label>';
      rsvpContent += '<input type="email" name="email" id="' + data.identifier + '-rsvp-email" ' + (data.disabled && 'disabled') + ' required aria-required="true" autocomplete="email" aria-label="' + translate_hook('form.email', data) + '" value="" /></div>';
    }
  } else {
    rsvpData.fields = rsvpData.fields!.map((field): ATCBProFormField => {
      if (field.name === 'email') {
        return { ...field, required: true, type: 'email', default: (attendee !== '' ? attendee : field.default) as string | boolean };
      }
      return field;
    });
  }
  // add custom fields
  if (rsvpData.fields && rsvpData.fields.length > 0) {
    const customForm = build_form(rsvpData.fields, data.identifier + '-rsvp', data.disabled);
    rsvpData.fields = customForm.fields;
    rsvpContent += customForm.html;
  }
  rsvpContent += hiddenContent;
  rsvpContent += '<p id="submit-error" role="alert" aria-live="assertive" aria-atomic="true" tabindex="-1"></p>';
  rsvpContent +=
    '<p class="pro-pt"><button type="submit" id="pro-form-submit" ' +
    (data.disabled && 'disabled') +
    ' class="atcb-modal-btn atcb-modal-btn-primary atcb-modal-btn-border">' +
    translate_hook('submit', data) +
    '</button><span id="pro-form-submitting" class="pro-waiting" role="status" aria-live="polite" aria-hidden="true"><span>.</span><span>.</span><span>.</span><span class="atcb-sr-only">' +
    translate_hook('submit', data) +
    '</span></span></p>';
  if (rsvpData.seatsLeft && rsvpData.seatsLeft > 0) {
    rsvpContent += '<p class="pro-form-fine">' + translate_hook('form.seatsleft', data) + ': <b>' + rsvpData.seatsLeft + '</b></p>';
  }
  rsvpContent += '</form>';
  rsvpContent += '</div></div>';

  // the host for the form now is either the host or the modal host
  let rsvpHost = null as unknown as ShadowRoot;
  if (!data.inlineRsvp) {
    rsvpHost = (await generate_modal_host(host, data)) as ShadowRoot;
    await create_modal(rsvpHost, data, undefined, rsvpData.headline, rsvpContent, [{ type: 'none', label: translate_hook('label.rsvp.restart', data), small: true, primary: true, id: 'pro-form-restart' }] as never[], [], keyboardTrigger, {}, false);
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
      const list = create_atcbl(rsvpHost, false, true);
      rsvpInlineWrapper.append(list as HTMLDivElement);
    }
    if (rsvpData.expired) {
      rsvpInlineContent.innerHTML = '<div class="pro"><p>' + translate_hook('label.rsvp.expired', data) + '</p></div>';
      return;
    } else if (rsvpData.bookedOut) {
      rsvpInlineContent.innerHTML = '<div class="pro"><p>' + translate_hook('label.rsvp.bookedout', data) + '</p></div>';
      return;
    } else {
      rsvpInlineContent.innerHTML = rsvpContent;
    }
  }
  if (sentStatus) (rsvpHost.getElementById('rsvp-content') as HTMLElement).style.display = 'none';
  const restartBtn = rsvpHost.getElementById('pro-form-restart') as HTMLElement | null;
  const hideRestartButton = (): void => {
    if (!restartBtn) return;
    restartBtn.style.display = 'none';
    if (restartBtn.parentElement) restartBtn.parentElement.style.display = 'none';
  };
  log_event('openRSVP', data.identifier as string, data.identifier as string);
  if (data.debug) {
    console.log('RSVP form for "' + data.identifier + '" created');
  }
  // if we are on the already-sent-screen, we render an atcb if not disabled
  if (sentStatus) {
    const buttonHost = rsvpHost.getElementById('rsvp-atcb');
    if (buttonHost && !data.hideButton) {
      // make a copy of the data
      const buttonData = JSON.parse(JSON.stringify(data));
      // force individual buttons without label
      buttonData.hideTextLabelButton = true;
      buttonData.hideIconButton = false;
      buttonData.buttonsList = true;
      renderButton(host, buttonHost as HTMLElement, buttonData);
    }
  } else {
    hideRestartButton();
  }
  // validation and processing of the form
  // validate and submit
  const rsvpForm = rsvpHost.getElementById(data.identifier + '-rsvp-form') as HTMLFormElement;
  const errorMsg = rsvpHost.getElementById('submit-error') as HTMLElement;
  const rsvpFormSubmit = rsvpHost.getElementById('pro-form-submit') as HTMLButtonElement | null;
  const rsvpFormSubmitting = rsvpHost.getElementById('pro-form-submitting') as HTMLElement;
  const rsvpRestart = rsvpHost.getElementById('pro-form-restart') as HTMLElement | null;
  if (rsvpFormSubmit) {
    rsvpForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      rsvpForm.classList.remove('form-error');
      errorMsg.textContent = '';
      rsvpFormSubmitting.setAttribute('aria-hidden', 'false');
      rsvpFormSubmitting.style.display = 'block';
      rsvpFormSubmit.style.display = 'none';
      const staticFields: ATCBProFormField[] = [{ type: 'number', name: data.proKey + '-amount', fieldId: data.identifier + '-rsvp-amount', required: true }];
      if (!customEmailField) staticFields.push({ type: 'email', name: 'email', fieldId: data.identifier + '-rsvp-email', required: true });
      const dynamicFields = Array.isArray(rsvpData.fields) ? rsvpData.fields : [];
      const validation = validate_form(rsvpHost, [...staticFields, ...dynamicFields]);
      let valid = validation.valid;
      let firstInvalid = validation.firstInvalid;
      // if maxpp, make sure amount is not bigger
      const amountEl = rsvpHost.getElementById(data.identifier + '-rsvp-amount') as HTMLInputElement;
      const amount = parseInt(amountEl.value) || 1;
      if (rsvpData.maxpp && rsvpData.maxpp > 0 && amount > rsvpData.maxpp) {
        firstInvalid = mark_invalid_input(amountEl, firstInvalid);
        valid = false;
      }
      if (!valid) {
        show_submit_error(rsvpForm, errorMsg, translate_hook('form.error.required', data) + '.', firstInvalid);
      }
      // submit data
      if (valid) {
        if (!data.proKey || data.proKey === '') {
          // if no prokey, we just show a demo success message
          (rsvpHost.getElementById('rsvp-success-msg-demo') as HTMLElement).style.display = 'block';
          (rsvpHost.getElementById('rsvp-content') as HTMLElement).style.display = 'none';
          log_event('successRSVP', data.identifier as string, data.identifier as string);
          return;
        }
        let fieldsCopy: ATCBProFormField[] = rsvpData.fields ? JSON.parse(JSON.stringify(rsvpData.fields)) : [];
        const bodyData: ATCBPostField[] = [];
        bodyData.push({ name: 'prokey', value: data.proKey });
        bodyData.push({ name: 'language', value: data.language });
        const statusValEl = rsvpHost.querySelector('[name="' + data.proKey + '-status"]:checked') as HTMLInputElement | null;
        bodyData.push({ name: 'status', value: statusValEl ? statusValEl.value : 'confirmed' });
        bodyData.push({ name: 'amount', value: amount });
        if (!customEmailField) {
          bodyData.push({ name: 'email', value: (rsvpHost.getElementById(data.identifier + '-rsvp-email') as HTMLInputElement).value });
        } else {
          const emailFieldId = fieldsCopy.find((field) => field.name === 'email')?.fieldId as string;
          bodyData.push({ name: 'email', value: (rsvpHost.getElementById(emailFieldId) as HTMLInputElement).value });
          fieldsCopy = fieldsCopy.filter((field) => field.fieldId !== emailFieldId);
        }
        const bodyData_payload: { [key: string]: unknown } = {};
        let skipRadio = false;
        fieldsCopy.forEach((field) => {
          // push fields to data array except for labels - for radio buttons, we only push the checked one
          if (field.type !== 'label') {
            if (field.type === 'radio') {
              if (!skipRadio) {
                const radioGroup = rsvpHost.querySelectorAll('[name="' + field.name + '"]');
                radioGroup.forEach(function (radio) {
                  if ((radio as HTMLInputElement).checked) {
                    bodyData_payload[field.name as string] = (radio as HTMLInputElement).value;
                  }
                });
                skipRadio = true;
              }
            } else if (field.type === 'checkbox') {
              bodyData_payload[field.name as string] = (rsvpHost.getElementById(field.fieldId as string) as HTMLInputElement).checked;
              skipRadio = false;
            } else {
              bodyData_payload[field.name as string] = (rsvpHost.getElementById(field.fieldId as string) as HTMLInputElement).value;
              skipRadio = false;
            }
          }
        });
        if (Object.keys(bodyData_payload).length > 0) {
          bodyData.push({ name: 'payload', value: bodyData_payload });
        }
        const request = await sendPostRequest(`https://api${data.dev ? '-dev' : ''}.add-to-calendar-pro.com/24586219-9910-41fe-9b59-df53de9db7af`, bodyData, { rsvp: true });
        if (request === 'doi' || request === true) {
          (rsvpHost.getElementById('rsvp-success-msg') as HTMLElement).style.display = 'block';
          if (request === 'doi') {
            (rsvpHost.getElementById('rsvp-success-msg-doi') as HTMLElement).style.display = 'block';
          } else {
            (rsvpHost.getElementById('rsvp-success-msg-email') as HTMLElement).style.display = 'block';
          }
          (rsvpHost.getElementById('rsvp-content') as HTMLElement).style.display = 'none';
          log_event('successRSVP', data.identifier as string, data.identifier as string);
          // note: original passes a boolean here; Storage.setItem stringifies it at runtime to "true" (matching the getItem check above)
          localStorage.setItem(data.proKey + '-rsvp-sent', true as unknown as string);
          return;
        }
        const requestResult = request as ATCBPostErrorResult;
        if (requestResult.error && requestResult.error === 2) {
          show_submit_error(rsvpForm, errorMsg, translate_hook('form.error.email', data) + '.');
        } else if (requestResult.error && requestResult.error === 5) {
          show_submit_error(rsvpForm, errorMsg, translate_hook('label.rsvp.expired', data) + '.');
        } else if (requestResult.error && requestResult.error === 6) {
          if (amount > 1) {
            show_submit_error(rsvpForm, errorMsg, translate_hook('form.error.bookedoutmany', data) + '.');
          } else {
            show_submit_error(rsvpForm, errorMsg, translate_hook('label.rsvp.bookedout', data) + '.');
          }
        } else {
          show_submit_error(rsvpForm, errorMsg, translate_hook('form.error.sending', data) + '.');
        }
      }
      rsvpFormSubmitting.setAttribute('aria-hidden', 'true');
      rsvpFormSubmitting.style.display = 'none';
      rsvpFormSubmit.style.display = 'block';
    });
  }
  // reset
  if (rsvpRestart) {
    rsvpRestart.addEventListener('click', function (e) {
      e.preventDefault();
      (rsvpHost.getElementById('rsvp-sent-content') as HTMLElement).style.display = 'none';
      (rsvpHost.getElementById('rsvp-content') as HTMLElement).style.display = 'block';
      hideRestartButton();
    });
    rsvpRestart.addEventListener('keyup', function (event) {
      if ((event as KeyboardEvent).key === 'Enter') {
        event.preventDefault();
        rsvpRestart.click();
      }
    });
  }
}

async function generate_rsvp_button(host: ShadowRoot, data: ATCBConfig): Promise<boolean> {
  const btnHostEl = host.querySelector('.atcb-initialized') as HTMLElement;
  // generate the wrapper div
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  if (data.rtl) {
    buttonTriggerWrapper.classList.add('atcb-rtl');
  }
  btnHostEl.append(buttonTriggerWrapper);
  set_sizes(buttonTriggerWrapper, data.sizes!);
  // generate the button trigger div
  const buttonTrigger = document.createElement('button');
  buttonTrigger.classList.add('atcb-button', 'atcb-click', 'atcb-single');
  if (data.disabled) {
    // note: original passes a boolean here; Element.setAttribute stringifies it at runtime
    buttonTrigger.setAttribute('disabled', true as unknown as string);
  }
  if (data.hideTextLabelButton) {
    buttonTrigger.classList.add('atcb-no-text');
  }
  buttonTrigger.type = 'button';
  buttonTrigger.setAttribute('aria-expanded', false as unknown as string); // aria-expanded default value on button generate
  buttonTriggerWrapper.append(buttonTrigger);
  // determine label
  const rsvpData = data.rsvp as ATCBRsvpData;
  const label = (function () {
    if (rsvpData.expired) {
      return translate_hook('label.rsvp.expired', data);
    }
    if (rsvpData.bookedOut) {
      return translate_hook('label.rsvp.bookedout', data);
    }
    return translate_hook('label.rsvp.title', data);
  })();
  // generate the label incl. eventListeners
  generate_label(host, data, buttonTrigger, 'rsvp', !data.hideIconButton, label, true);
  if (data.debug) {
    console.log('Add to Calendar RSVP Button "' + data.identifier + '" created');
  }
  return true;
}

async function check_bookings(proKey: string, dev: boolean = false): Promise<number> {
  try {
    const response = await fetch(`https://api${dev ? '-dev' : ''}.add-to-calendar-pro.com/dffb8bbd-ee5e-4a4f-a7ea-503af98ca468?prokey=${proKey}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseJson = (await response.json()) as { [key: string]: unknown };
    return parseInt(responseJson.total as string);
  } catch (error) {
    console.error('Error:', error);
  }
  return 0;
}

// SHARED FORM FUNCTIONS
function build_form(fields: ATCBProFormField[], identifier: string = '', disabled: boolean = false): { html: string; fields: ATCBProFormField[] } {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  let form = '';
  let hiddenForm = '';
  // for each field, add respective html
  let n = 0;
  let prevType = '';
  let prevSkipped: boolean | undefined;
  for (let i = 1; i <= fields.length; i++) {
    prevSkipped = false;
    const field = fields[i - 1]!;
    if (field.type !== 'label' && (!field.name || field.name === '')) {
      prevSkipped = true;
      continue;
    }
    if ((prevType === 'radio' && field.type !== 'radio') || prevType !== 'radio') {
      n = i;
    }
    fields[i - 1]!.fieldId = identifier + '-' + i;
    const fieldValue = field.type === 'radio' ? field.placeholder || '' : field.default || '';
    const fieldLabel = field.label || '';
    const fieldPlaceholder = field.type === 'radio' ? '' : field.placeholder || '';
    let fieldHtml = '';
    if (prevType !== 'hidden' && i === n && i !== 1) {
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
        fieldHtml += create_field_html(field.type as string, field.name as string, fieldLabel, field.fieldId as string, field.required, fieldValue, field.default as string | boolean, fieldPlaceholder, disabled);
      }
      if (field.type === 'radio') {
        fieldHtml += '</div>';
      }
    }
    form += fieldHtml;
    prevType = field.type as string;
  }
  if (prevType !== 'hidden' || prevSkipped) {
    form += '</div>';
  }
  form += hiddenForm;
  return { html: form, fields: fields };
}

function create_field_html(type: string, name: string, fieldLabel: string, fieldId: string, required: boolean = false, fieldValue: string | boolean, defaultVal: string | boolean | null = null, fieldPlaceholder: string = '', disabled: boolean = false): string {
  let fieldHtml = '';
  const accessibleLabel = fieldLabel !== '' ? fieldLabel : fieldPlaceholder !== '' ? fieldPlaceholder : name;
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
    (required ? ' required aria-required="true"' : '') +
    (type === 'email' ? ' autocomplete="email"' : '') +
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
    accessibleLabel +
    '" value="' +
    fieldValue +
    '" />';
  // add label for checkboxes and radio buttons
  if ((type === 'checkbox' || type === 'radio') && (fieldLabel !== '' || required)) {
    fieldHtml += '<label for="' + fieldId + '">' + fieldLabel + (required ? '<span>*</span>' : '') + '</label>';
  }
  return fieldHtml;
}

function validate_form(host: ShadowRoot, fields: ATCBProFormField[]): ATCBFormValidationResult {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  let state = true;
  let firstInvalid: HTMLInputElement | null = null;
  fields.forEach(function (field) {
    if (field.type !== 'label' && field.type !== 'radio') {
      const input = host.getElementById(field.fieldId as string) as HTMLInputElement;
      if (field.type !== 'checkbox') {
        input.value = secure_content(input.value.trim()) as string;
        if (field.type === 'number') {
          input.value = input.value.replace(/\D/g, '');
        }
        if (field.type === 'email' && input.value !== '' && !validEmail(input.value)) {
          firstInvalid = mark_invalid_input(input, firstInvalid);
          state = false;
          return;
        }
        if (field.required && input.value === '') {
          firstInvalid = mark_invalid_input(input, firstInvalid);
          state = false;
          return;
        } else {
          clear_invalid_input(input);
        }
      } else {
        if (field.required && input.checked === false) {
          firstInvalid = mark_invalid_input(input, firstInvalid);
          state = false;
          return;
        } else {
          clear_invalid_input(input);
        }
      }
    }
    if (field.type === 'radio') {
      const radioGroup = host.querySelectorAll('[name="' + field.name + '"]');
      let checked = false;
      radioGroup.forEach(function (radio) {
        if ((radio as HTMLInputElement).checked) {
          checked = true;
        }
      });
      if (checked === false) {
        firstInvalid = mark_invalid_input(radioGroup[0] as HTMLInputElement, firstInvalid);
        state = false;
        return;
      } else {
        clear_invalid_input(radioGroup[0] as HTMLInputElement);
      }
    }
  });
  return { valid: state, firstInvalid };
}

// FUNCTION TO SEND A REQUEST TO THE SERVER
async function sendPostRequest(url: string, fields: ATCBPostField[], header: { [key: string]: unknown } = {}): Promise<boolean | 'doi' | ATCBPostErrorResult> {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  const formData = new FormData();
  const data: { [key: string]: unknown } = {};
  let requestData: RequestInit;
  if (Object.keys(header).length === 0) {
    // if there is no header information, we use FormData
    fields.forEach((field) => {
      formData.append(field.name, field.value as string);
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
    requestData = { method: 'POST', headers: header as HeadersInit, body: JSON.stringify(data) };
  }
  // Send the FormData object using fetch
  try {
    const response = await fetch(url, requestData);
    const responseJson = (await response.json()) as ATCBPostErrorResult;
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

export { generate_ty, generate_rsvp_form, generate_rsvp_button, check_bookings };
