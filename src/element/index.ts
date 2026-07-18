import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { atcbVersion, atcbIsBrowser, atcbWcParams, atcbWcProParams, atcbWcBooleanParams, atcbWcObjectParams, atcbWcObjectArrayParams, atcbWcArrayParams, atcbWcNumberParams } from '../core/globals';
import { getActiveButton, createButtonInstance, deleteButtonInstance } from '../core/store';
import { atcb_ensure_style, atcb_prefetch_all_styles } from '../styles/css-template';
import { atcb_decorate_data } from '../core/decorate';
import { atcb_check_required, atcb_validate } from '../core/validate';
import { atcb_create_atcbl } from '../ui/generate';
import { buttonTemplate } from '../ui/templates';
import { atcb_generate_rich_data } from '../generators/rich-data';
import { atcb_close, atcb_toggle } from '../ui/control';
import { atcb_secure_content, atcb_secure_url } from '../core/text';
import { atcb_manage_body_scroll, atcb_set_sizes } from '../ui/positioning';
import { atcb_log_event } from '../core/events';
import { atcb_generate_rsvp_form, atcb_generate_rsvp_button } from '../ui/pro';
import { resolveAttributeName, hasConfigAttribute, getConfigAttribute, observedConfigAttributes } from '../compat/attributes';
import type { ATCBInputConfig, ATCBConfig } from '../types';

let atcbInitialGlobalInit = false;
let atcbBtnCount = 0;
const lightModeMutationObserver: Map<string, MutationObserver> = new Map();

const template = `<div class="atcb-initialized atcb-hidden"></div>`;

// structural stand-in for the AddToCalendarButton custom element, since the class itself
// is block-scoped inside the atcbIsBrowser() guard below and not usable as a type out here
interface ATCBHostElement extends HTMLElement {
  proOverride?: boolean;
}

// we cannot load the custom element server-side - therefore, we check for a browser environment first
if (atcbIsBrowser()) {
  class AddToCalendarButton extends LitElement {
    // internal reactive state driving the lit render (no public reactive properties on
    // purpose: config params like `hidden`/`disabled` would collide with native element
    // semantics; attribute-driven re-initialization below provides the reactivity)
    static override properties = {
      _buttonTemplate: { state: true, attribute: false },
    };

    declare _buttonTemplate: TemplateResult | null;
    _initialized: Promise<void>;
    _initializedResolver!: () => void;
    state: { initializing: boolean; initialized: boolean; ready: boolean; updatePending: boolean };
    data: ATCBConfig;
    error: boolean;
    debug?: boolean;
    proOverride?: boolean;
    proKey?: string;
    identifier?: string;
    initializing?: boolean;
    updatePending?: boolean;

    constructor() {
      super();
      this._initialized = new Promise((resolve) => (this._initializedResolver = resolve));
      // attach the shadow root exactly like v2 did (Lit adopts a pre-attached root via
      // createRenderRoot below). Mind that `delegateFocus` is the historic misspelling of
      // `delegatesFocus` - it is preserved on purpose until the phase 9 WCAG pass, since
      // fixing it changes focus behavior.
      this.attachShadow({ mode: 'open', delegateFocus: true } as unknown as ShadowRootInit);
      this._buttonTemplate = null;
      this.state = {
        initializing: false,
        initialized: false,
        ready: false,
        updatePending: false,
      };
      this.data = {};
      this.error = false;
    }

    override createRenderRoot(): ShadowRoot {
      return this.shadowRoot!;
    }

    override render(): TemplateResult {
      // the shell div carries NO bindings on itself: the init pipeline mutates its
      // classes/lang imperatively (exactly like v2), and static parts survive re-renders
      return html`<div class="atcb-initialized atcb-hidden">${this._buttonTemplate ?? nothing}</div>`;
    }

    override connectedCallback(): void {
      super.connectedCallback();
      if (!this.initializing) {
        this.initializing = true;
        // Defer the update to ensure it's non-blocking
        setTimeout(() => this.initializeComponent(), 0);
      }
    }

    async initializeComponent(): Promise<void> {
      if (this.state.ready) {
        return;
      }
      // make sure the first lit render (the shell) has happened
      await this.updateComplete;
      // initial data fetch
      this.state.initializing = true;
      // first getting debug attr and saving it here - this is somehow independet of its copy at the data object
      const debugVal = getConfigAttribute(this, 'debug');
      this.debug = hasConfigAttribute(this, 'debug') && (!debugVal || debugVal === 'true' || debugVal === '') ? true : false;
      // same for proOverride
      if (hasConfigAttribute(this, 'proOverride')) {
        const proOverrideVal = getConfigAttribute(this, 'proOverride');
        this.proOverride = !proOverrideVal || proOverrideVal === 'true' || proOverrideVal === '' ? true : false;
      }
      // checking for PRO key and pull data if given
      try {
        const proKeyVal = getConfigAttribute(this, 'proKey');
        if (proKeyVal && proKeyVal !== '') {
          this.data = await atcb_get_pro_data(proKeyVal, this);
          if (this.data.proKey) this.proKey = this.data.proKey;
        } else {
          this.data.proKey = '';
          // if no data yet, we try reading attributes or the innerHTML of the host element
          this.data = (await atcb_process_inline_data(this, this.debug)) as unknown as ATCBConfig;
        }
      } catch (e) {
        if (this.debug) {
          console.error(e);
          atcb_render_debug_msg(this.shadowRoot!, e);
        }
        this.error = true;
        this.state.initializing = false;
        this.state.ready = true;
        this._initializedResolver();
        return;
      }
      await this.initButton();
      this.state.initializing = false;
      this.state.initialized = true;
      this.state.ready = true;
      this._initializedResolver();
      return;
    }

    whenInitialized(): Promise<void> {
      return this._initialized;
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      atcb_cleanup(this.shadowRoot!, this.identifier);
      if (this.debug) {
        console.log('Add to Calendar Button "' + this.identifier + '" destroyed');
      }
      // reset the count, if all buttons got destroyed
      if (document.querySelectorAll('add-to-calendar-button').length === 0) {
        atcbBtnCount = 0;
      }
    }

    static override get observedAttributes(): string[] {
      // keep Lit's own observed attributes (also triggers its class finalization) and add
      // the official kebab-case names, the legacy spellings, and the control attributes
      const litObserved = (super.observedAttributes as string[] | undefined) ?? [];
      return [...new Set([...litObserved, ...observedConfigAttributes(atcbWcParams)])];
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      // return, if this is the very first run
      if (!this.state.ready) {
        return;
      }
      // mind that this only observes the actual attributes, not the innerHTML of the host (one would need to alter the instance attribute for that case)!
      if (this.debug && this.state.initialized) {
        // we only mention this, if it has been initialized (with Angular, e.g., a bound variable will get infused after the initial loading)
        console.log(`${name}'s value has been changed from ${oldValue} to ${newValue}`);
      }
      // Set a flag or enqueue changes without directly invoking async operations
      if (!this.updatePending) {
        this.updatePending = true;
        // Defer the update to ensure it's non-blocking
        setTimeout(() => this.updateComponent(), 0);
      }
    }

    async updateComponent(): Promise<void> {
      if (!this.updatePending) return;
      // destroy and rebuild the button
      this.data = {};
      this._buttonTemplate = null;
      await this.updateComplete;
      const rootObj = this.shadowRoot!.querySelector('.atcb-initialized') as HTMLElement | null;
      if (rootObj) {
        // reset the shell to its pristine state (v2 recreated the node; we reuse the
        // lit-rendered one). Foreign element children (e.g. an RSVP form) are removed;
        // lit's marker comment nodes must survive, so only element nodes go
        Array.from(rootObj.children).forEach((child) => child.remove());
        rootObj.className = 'atcb-initialized atcb-hidden';
        rootObj.removeAttribute('lang');
        rootObj.removeAttribute('style');
      }
      try {
        const proKeyVal = getConfigAttribute(this, 'proKey');
        if (proKeyVal && proKeyVal !== '') {
          this.data = await atcb_get_pro_data(proKeyVal, this);
          if (this.data.proKey) this.proKey = this.data.proKey;
        } else {
          this.data = (await atcb_process_inline_data(this, this.debug)) as unknown as ATCBConfig;
        }
      } catch (e) {
        if (this.debug) {
          console.error(e);
          atcb_render_debug_msg(this.shadowRoot!, e);
        }
        this.updatePending = false;
        return;
      }
      atcb_cleanup(this.shadowRoot!, this.identifier);
      await this.initButton();
      this.updatePending = false;
    }

    async initButton(): Promise<boolean> {
      if (!this.state.initialized) {
        atcbBtnCount = atcbBtnCount + 1;
      }
      // set identifier first, no matter further validation
      // we use a stored one if available (the case, if destroyed before)
      if (this.identifier && this.identifier !== '') {
        this.data.identifier = this.identifier;
      } else {
        // and create one in all other cases
        if (this.data.identifier && this.data.identifier !== '') {
          if (!/^[\w-]+$/.test(this.data.identifier)) {
            this.data.identifier = '';
            if (this.debug) {
              let prefix = 'Add to Calendar Button';
              if (this.data.rsvp && Object.keys(this.data.rsvp).length > 0) {
                prefix = 'RSVP';
              }
              console.warn(prefix + ' generation: identifier invalid - using auto numbers instead');
            }
          } else {
            this.data.identifier = 'atcb-btn-' + this.data.identifier;
          }
        }
        if (this.data.identifier == null || this.data.identifier == '') {
          this.data.identifier = 'atcb-btn-' + atcbBtnCount;
        }
        // we are copying the value to preserve it over re-building the data object
        this.identifier = this.data.identifier;
      }
      this.setAttribute('atcb-button-id', this.data.identifier!);
      // build
      try {
        this.style.visibility = 'visible';
        this.style.opacity = '1';
        this.style.position = 'relative';
        this.style.outline = 'none';
        await this.buildButton();
        return true;
      } catch (e) {
        if (this.debug) {
          console.error((e as { message?: string }).message ? (e as { message?: string }).message : e);
          atcb_render_debug_msg(this.shadowRoot!, e);
        }
        return false;
      }
    }

    // build the button (formerly the module-level atcb_build_button)
    async buildButton(): Promise<boolean> {
      const host = this.shadowRoot!;
      try {
        (host.host as Element).classList.add('add-to-calendar');
        // Rewrite dynamic dates, standardize line breaks and transform urls in the description
        const data = await atcb_decorate_data(this.data);
        this.data = data;
        await atcb_validate(data);
        const rootObj = host.querySelector('.atcb-initialized') as HTMLElement;
        // ... and on success, load css and generate the button
        atcb_set_light_mode(host, data);
        rootObj.setAttribute('lang', data.language!);
        atcb_load_css(host, rootObj, data);
        // eagerly prefetch all style deltas when runtime style switching is requested
        if (data.loadAllStyles) {
          atcb_prefetch_all_styles(data);
        }
        atcb_setup_state_management(data);
        // set global event listeners
        atcb_set_global_event_listener(host, data);
        atcb_init_log(data.proKey, data.hideBranding, data.debug);
        // generate the actual button or RSVP form (if not hidden)
        if (!data.hidden) {
          if (typeof atcb_generate_rsvp_form === 'function' && data.rsvp && Object.keys(data.rsvp).length > 0) {
            if (!data.inlineRsvp) {
              await atcb_generate_rsvp_button(host, data);
            } else {
              await atcb_generate_rsvp_form(host, data, rootObj);
            }
          } else {
            // render the button via the lit template and finish up imperatively
            this._buttonTemplate = buttonTemplate(host, data);
            await this.updateComplete;
            host.querySelectorAll('.atcb-button-wrapper').forEach((wrapper) => {
              atcb_set_sizes(wrapper as HTMLElement, data.sizes!);
            });
            if (data.debug) {
              console.log('Add to Calendar Button "' + data.identifier + '" created');
            }
          }
          // create schema.org data (https://schema.org/Event), if possible; not in the subscription case; and add it to the regular DOM
          if (!data.hideRichData && !data.subscribe && data.name && data.dates![0]!.location && data.dates![0]!.startDate) {
            atcb_generate_rich_data(data, host.host);
          }
        }
        // log event
        atcb_log_event('initialization', data.identifier!, data.identifier!);
        if (!data.proKey && data.hideBranding && !document.getElementById('atcb-reference')) {
          atcb_create_atcbl(document.body as unknown as ShadowRoot, false, false, true);
        }
        return true;
      } catch (e) {
        throw new Error((e as { message?: string }).message);
      }
    }
  }

  if (!customElements.get('add-to-calendar-button')) {
    customElements.define('add-to-calendar-button', AddToCalendarButton);
  }
}

// process inline data
async function atcb_process_inline_data(el: ATCBHostElement, debug = false): Promise<ATCBInputConfig> {
  let data: ATCBInputConfig;
  try {
    // Attempt to read attributes directly and validate
    data = atcb_read_attributes(el);
    await atcb_check_required(data);
  } catch {
    // If the above fails, try to parse and validate JSON from innerHTML
    const slotInput = el.innerHTML.trim();
    if (!slotInput) {
      throw new Error('Add to Calendar Button generation failed: No data provided.');
    }
    try {
      const atcbJsonInput = JSON.parse(atcb_secure_content(slotInput.replace(/(\r\n|\n|\r)/g, ''), false) as string) as ATCBInputConfig;
      await atcb_check_required(atcbJsonInput);
      data = atcbJsonInput;
    } catch (jsonError) {
      // Log detailed error for debugging
      if (debug) {
        console.error(jsonError);
      }
      throw new Error('Add to Calendar Button generation failed: no data provided or missing required fields - see console logs for details');
    }
  }
  return data;
}

// read data attributes (official kebab-case names win over legacy spellings)
function atcb_read_attributes(el: ATCBHostElement, params: (keyof ATCBInputConfig)[] = atcbWcParams): ATCBInputConfig {
  const data: { [key: string]: unknown } = {};
  for (let i = 0; i < params.length; i++) {
    // reading data, but removing real code line breaks before parsing.
    // use [br] in the description to create a line break.
    const attr = params[`${i}`]!;
    const attributeName = resolveAttributeName(el, attr);
    if (attributeName !== null) {
      const inputVal = atcb_secure_content(el.getAttribute(attributeName)!.replace(/(\\r\\n|\\n|\\r)/g, ''), false) as string;
      let val: unknown;
      if ((atcbWcBooleanParams as (keyof ATCBInputConfig)[]).includes(attr)) {
        // if a boolean param has no value, it is handled as prop and set true
        val = !inputVal || inputVal === '' || inputVal.toLowerCase() === 'true' ? true : false;
      } else if ((atcbWcObjectParams as (keyof ATCBInputConfig)[]).includes(attr)) {
        const cleanedInput = (function () {
          if (!inputVal || inputVal === '') {
            return '{}';
          }
          if (inputVal.substring(0, 1) != '{') {
            return '{' + inputVal + '}';
          }
          return inputVal;
        })();
        val = JSON.parse(cleanedInput);
      } else if ((atcbWcObjectArrayParams as (keyof ATCBInputConfig)[]).includes(attr)) {
        const cleanedInput = (function () {
          if (!inputVal || inputVal === '') {
            return '[]';
          }
          if (inputVal.substring(0, 1) != '[') {
            return '[' + inputVal + ']';
          }
          return inputVal;
        })();
        val = JSON.parse(cleanedInput);
      } else if ((atcbWcArrayParams as (keyof ATCBInputConfig)[]).includes(attr)) {
        let arrVal = inputVal;
        if (inputVal.includes('[')) {
          arrVal = arrVal.substring(1, arrVal.length - 1);
        }
        if (inputVal.includes('"') || inputVal.includes("'")) {
          arrVal = arrVal.substring(1, arrVal.length - 1);
        }
        if (!inputVal.includes('|')) {
          // legacy support for translating options within the array. As this could include spaces, we skip them here
          arrVal = arrVal.replace(/\s/g, '');
        }
        if (arrVal.includes("','")) {
          val = arrVal.split("','");
        } else {
          val = arrVal.split('","');
        }
      } else if ((atcbWcNumberParams as (keyof ATCBInputConfig)[]).includes(attr)) {
        val = parseInt(inputVal);
      } else {
        val = inputVal;
      }
      // only set, if no empty object or empty array
      if ((typeof val === 'object' && val !== null && Object.keys(val).length === 0) || (Array.isArray(val) && (val.length === 0 || (val.length === 1 && val[0] === '')))) {
        continue;
      }
      data[`${attr}`] = val;
    }
  }
  return data as ATCBInputConfig;
}

// destroy the button
function atcb_cleanup(host: ShadowRoot, identifier?: string): void {
  // cleaning up a little bit
  atcb_close(host);
  atcb_unset_global_event_listener(identifier);
  const schemaEl = document.getElementById('atcb-schema-' + identifier);
  if (schemaEl) {
    schemaEl.remove();
  }
  Array.from(host.querySelectorAll('.atcb-debug-error-msg'))
    .concat(Array.from(host.querySelectorAll('style')))
    .concat(Array.from(host.querySelectorAll('link')))
    .concat(Array.from(host.querySelectorAll('.atcb-placeholder')))
    .concat(Array.from(host.querySelectorAll('.atcb-button-wrapper')))
    .forEach((el) => el.remove());
  deleteButtonInstance(`${identifier}`);
}

// set light mode
function atcb_set_light_mode(shadowRoot: ShadowRoot, data: ATCBConfig): void {
  // Safari + Firefox combat hack
  // could be removed (together with the global mutation observer on that) as soon as those browsers support the :host-context selector
  (shadowRoot.host as Element).classList.remove('atcb-dark', 'atcb-light', 'atcb-bodyScheme');
  const hostLightMode = (function () {
    if (data.lightMode == 'bodyScheme') {
      if (
        document.body.classList.contains('atcb-dark') ||
        document.documentElement.classList.contains('atcb-dark') ||
        document.body.classList.contains('atcp-dark') ||
        document.documentElement.classList.contains('atcp-dark') ||
        document.body.classList.contains('dark') ||
        document.documentElement.classList.contains('dark')
      ) {
        return 'dark';
      } else {
        return 'light';
      }
    }
    return data.lightMode;
  })();
  (shadowRoot.host as Element).classList.add('atcb-' + hostLightMode);
}

// get csp nonce
function atcb_csp_nonce(host: ShadowRoot): string | null {
  const cspnonceRegex = /[`'"()[\]{}<>\s]/;
  if (!(host.host as Element).hasAttribute('cspnonce')) {
    return null;
  }
  if (cspnonceRegex.test((host.host as Element).getAttribute('cspnonce')!)) {
    throw new Error('cspnonce input contains forbidden characters.');
  }
  return (host.host as Element).getAttribute('cspnonce');
}

// load the right css
async function atcb_load_css(host: ShadowRoot, rootObj: HTMLElement | null = null, data: ATCBConfig): Promise<void> {
  const nonceVal = atcb_csp_nonce(host);
  // add global no-scroll style
  if (!document.getElementById('atcb-global-style')) {
    const cssGlobalContent = document.createElement('style');
    cssGlobalContent.id = 'atcb-global-style';
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    cssGlobalContent.innerText = '.atcb-modal-no-scroll{overflow-y:hidden !important;-webkit-overflow-scrolling:touch;} body.atcb-modal-no-scroll{padding-right:' + scrollBarWidth + 'px;}.atcb-attribution{display:none;}';
    if (nonceVal) {
      cssGlobalContent.setAttribute('nonce', nonceVal);
    }
    document.head.append(cssGlobalContent);
  }
  // add hidden style
  const generalCssContent = document.createElement('style');
  const initWidth = data.inlineRsvp && data.rsvp && Object.keys(data.rsvp).length > 0 ? '100%' : 'fit-content';
  generalCssContent.innerText = `.atcb-initialized { display: block; position: relative; width: ${initWidth}; }.atcb-initialized.atcb-inline { display: inline-block; }.atcb-initialized.atcb-buttons-list { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--buttonslist-gap); }.atcb-hidden { display: none; }`;
  if (nonceVal) {
    generalCssContent.setAttribute('nonce', nonceVal);
  }
  host.prepend(generalCssContent);
  // get custom override information
  const overrideDefaultCss = (function () {
    if (data.styleLight) {
      return ':host{' + atcb_secure_content(data.styleLight.replace(/(\\r\\n|\\n|\\r)/g, ''), false) + '}';
    }
    return '';
  })();
  const overrideDarkCss = (function () {
    if (data.styleDark) {
      // the next line is commented out, since it is currently not possible to use the :host-context selector in Safari and Firefox - the workaround is the global mutation observer setting the style at the host. We keep this line as a reminder, though.
      //const output = ':host(.atcb-dark), :host-context(html.atcb-dark):host(.atcb-bodyScheme), :host-context(body.atcb-dark):host(.atcb-bodyScheme) { ' + atcb_secure_content(data.styleDark.replace(/(\\r\\n|\\n|\\r)/g, ''), false) + ' }';
      return ':host(.atcb-dark){' + atcb_secure_content(data.styleDark.replace(/(\\r\\n|\\n|\\r)/g, ''), false) + '}';
    }
    return '';
  })();
  // we load custom styles dynamically
  if (data.customCss && data.customCss !== '') {
    const cssFile = document.createElement('link');
    cssFile.setAttribute('rel', 'stylesheet');
    cssFile.setAttribute('type', 'text/css');
    cssFile.setAttribute('href', data.customCss);
    if (nonceVal) {
      cssFile.setAttribute('nonce', nonceVal);
    }
    // if we have no rootObject, we are loading a modal in a new shadowDOM, which can and should be blocking.
    if (!rootObj) {
      // load the actual css (and re-show the content as soon as it is loaded)
      await loadExternalCssAsynch(cssFile, host, null, nonceVal, null, false, false, overrideDefaultCss + overrideDarkCss);
    } else {
      // else, it should be rather non-blocking.
      // first, create a button placeholder
      const placeholder = document.createElement('div');
      placeholder.classList.add('atcb-placeholder');
      host.prepend(placeholder);
      const placeholderCssContent = document.createElement('style');
      placeholderCssContent.innerText = '.atcb-placeholder { background-color: #777; border-radius: 200px; height: 40px; opacity: .3; width: 150px; }';
      if (nonceVal) {
        placeholderCssContent.setAttribute('nonce', nonceVal);
      }
      host.prepend(placeholderCssContent);
      // second, load the actual css (and remove the placeholder as soon as it is loaded)
      loadExternalCssAsynch(cssFile, host, rootObj, nonceVal, placeholder, data.inline, data.buttonsList, overrideDefaultCss + overrideDarkCss);
    }
    return;
  }
  // otherwise, we load it from the style registry (inline core+default, on-demand deltas)
  const styleCss = await atcb_ensure_style(data);
  if (styleCss) {
    const cssContent = document.createElement('style');
    if (nonceVal) {
      cssContent.setAttribute('nonce', nonceVal);
    }
    // add style to element
    cssContent.innerText = styleCss + overrideDefaultCss + overrideDarkCss;
    host.prepend(cssContent);
  }
  if (rootObj) {
    if (data.inline) {
      rootObj.style.display = 'inline-block';
      rootObj.classList.add('atcb-inline');
    } else {
      if (data.buttonsList) {
        rootObj.classList.add('atcb-buttons-list');
      }
    }
    rootObj.classList.remove('atcb-hidden');
  }
}

async function loadExternalCssAsynch(cssFile: HTMLLinkElement, host: ShadowRoot, rootObj: HTMLElement | null = null, nonceVal: string | null = null, placeholder: HTMLElement | null = null, inline: boolean = false, buttonsList: boolean = false, overrideCss: string = ''): Promise<void> {
  // load custom override information
  if (overrideCss !== '') {
    const cssContent = document.createElement('style');
    cssContent.innerText = overrideCss;
    if (nonceVal) {
      cssContent.setAttribute('nonce', nonceVal);
    }
    host.prepend(cssContent);
  }
  // load external css
  try {
    host.prepend(cssFile);
    // remove placeholder and render object as soon as loaded - only relevant if given
    await new Promise((resolve) => {
      cssFile.onload = resolve;
    });
    if (rootObj) {
      if (placeholder) {
        placeholder.remove();
      }
      if (inline) {
        rootObj.style.display = 'inline-block';
        rootObj.classList.add('atcb-inline');
      } else {
        if (buttonsList) {
          rootObj.classList.add('atcb-buttons-list');
        }
      }
      rootObj.classList.remove('atcb-hidden');
    }
  } catch (e) {
    console.log(e);
  }
}

function atcb_render_debug_msg(host: ShadowRoot, error: unknown): void {
  if (host.querySelector('.atcb-debug-error-msg')) return;
  const nonceVal = atcb_csp_nonce(host);
  const errorBanner = document.createElement('div');
  errorBanner.classList.add('atcb-debug-error-msg');
  const cssContent = document.createElement('style');
  cssContent.innerText = '.atcb-debug-error-msg { color: #bf2e2e; font-size: 12px; font-weight: bold; padding: 12px 15px; border: 2px solid #bf2e2e; max-width: 180px; border-radius: 13px; }';
  if (nonceVal) {
    cssContent.setAttribute('nonce', nonceVal);
  }
  host.prepend(cssContent);
  errorBanner.textContent = error as string;
  host.append(errorBanner);
}

// update global state management
function atcb_setup_state_management(data: ATCBConfig): void {
  const singleDates: { [key: string]: number[] } = {};
  for (let i = 0; i < data.options!.length; i++) {
    singleDates[data.options![`${i}`]!] = [];
    for (let id = 1; id <= data.dates!.length; id++) {
      // if cancelled and not ical type, we push 1, else 0
      if ((data.dates![id - 1]!.status as string).toLowerCase() === 'cancelled') {
        singleDates[data.options![`${i}`]!]!.push(1);
      } else {
        singleDates[data.options![`${i}`]!]!.push(0);
      }
    }
  }
  createButtonInstance(data.identifier!, data, singleDates);
}

// SHARED FUNCTION TO GENERATE THE INIT LOG MESSAGE
function atcb_init_log(pro: string = '', hide: boolean = false, debug: boolean = false): void {
  if (!atcbInitialGlobalInit) {
    const versionOutput = (function () {
      if (debug) {
        return ' (version ' + atcbVersion + ')';
      }
      return '';
    })();
    if (pro !== '') {
      if (!hide || debug) console.log('Add to Calendar PRO script initialized' + versionOutput + ' | https://add-to-calendar-pro.com');
    } else {
      console.log('%c\nAdd to Calendar Button script initialized' + versionOutput + '\n' + 'see https://add-to-calendar-button.com for details.\n', 'font-weight: bold;');
      console.log('✨ %cPRO version available at https://add-to-calendar-pro.com ← check it out!', 'font-weight: bold; line-height: 60px;');
    }
    atcbInitialGlobalInit = true;
  }
}

// PULLING PRO DATA
async function atcb_get_pro_data(licenseKey?: string, el?: ATCBHostElement, directData: ATCBInputConfig & { proOverride?: boolean } = {}): Promise<ATCBConfig> {
  /*!
   *  @preserve
   *  PER LICENSE AGREEMENT, YOU ARE NOT ALLOWED TO REMOVE OR CHANGE THIS FUNCTION!
   */
  if (licenseKey && licenseKey !== '') {
    // Try to read data from server and log error if not possible
    try {
      const proOverride = el ? el.proOverride : directData.proOverride;
      const dataOverrides: { [key: string]: unknown } = el ? (atcb_read_attributes(el, proOverride ? atcbWcParams : atcbWcProParams) as unknown as { [key: string]: unknown }) : (directData as unknown as { [key: string]: unknown });
      const response = await fetch(`https://${dataOverrides.dev ? 'event-dev.caldn.net' : 'event.caldn.net'}/${licenseKey}/config.json`);
      if (response.ok) {
        const data = (await response.json()) as ATCBConfig;
        if (proOverride) {
          const host = window.location.hostname || '';
          const domain = host.split('.').slice(-2).join('.');
          atcbWcParams.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(dataOverrides, key) && (['hideBranding', 'ty', 'rsvp'].indexOf(key) === -1 || domain === 'caldn.net' || domain === 'add-to-calendar-pro.com')) {
              (data as { [key: string]: unknown })[`${key}`] = dataOverrides[`${key}`];
            }
          });
        } else {
          atcbWcProParams.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(dataOverrides, key)) {
              (data as { [key: string]: unknown })[`${key}`] = dataOverrides[`${key}`];
            }
          });
        }
        if (dataOverrides.rsvp && Object.prototype.hasOwnProperty.call(dataOverrides.rsvp, 'none')) {
          delete data.rsvp;
        }
        if ((!data.name || data.name === '') && (!data.dates || data.dates[0]!.name === '')) {
          throw new Error('Not possible to read proKey config from server...');
        }
        if (data.landingpage!.domain && (data.landingpage!.domain as string) !== '' && atcb_secure_url(data.landingpage!.domain as string)) {
          data.domain = data.landingpage!.domain as string;
          delete data.landingpage;
        }
        if ((!data.proxy || (data.proxy as unknown as string) === '') && (!data.hideBranding || (data.hideBranding as unknown as string) === '')) {
          for (let i = 0; i < data.dates!.length; i++) {
            if (data.dates![`${i}`]!.description && data.dates![`${i}`]!.description !== '') {
              data.dates![`${i}`]!.description += '[br][br][p]Powered by add-to-calendar-pro.com[/p]';
            } else {
              data.dates![`${i}`]!.description = 'Powered by add-to-calendar-pro.com';
            }
          }
          if (data.description && data.description !== '') {
            data.description += 'Powered by add-to-calendar-pro.com';
          }
        }
        data.proKey = licenseKey;
        data.identifier = licenseKey;
        return data;
      }
      throw new Error('Not possible to read proKey config from server...');
    } catch (originalError) {
      console.error(originalError);
      throw new Error('proKey invalid or server not responding!');
    }
  }
  return {} as ATCBConfig;
}

// GLOBAL KEYBOARD AND DEVICE LISTENERS
function atcb_set_global_event_listener(host: ShadowRoot, data: ATCBConfig): void {
  // return, if we are not in a browser
  if (!atcbIsBrowser()) {
    return;
  }
  // temporary listener to any class change at the body or html for the light mode Safari/Firefox hack
  if (data.lightMode == 'bodyScheme') {
    // disconnect any previous observer for this identifier to avoid leaking observers
    const existingObserver = lightModeMutationObserver.get(data.identifier!);
    if (existingObserver) {
      existingObserver.disconnect();
    }
    const observer = new MutationObserver(function (mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          atcb_set_light_mode(host, data);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    lightModeMutationObserver.set(data.identifier!, observer);
  }
  if (!atcbInitialGlobalInit) {
    // global listener for ESC key to close dropdown
    document.addEventListener('keyup', atcb_global_listener_keyup);
    // global listener for arrow key optionlist navigation
    document.addEventListener('keydown', atcb_global_listener_keydown);
    // global listener for any screen changes
    window.addEventListener('resize', atcb_global_listener_resize);
  }
}

function atcb_global_listener_keyup(event: KeyboardEvent): void {
  const host: ShadowRoot | null = (function () {
    const root = document.querySelector('[atcb-button-id="' + getActiveButton() + '"]');
    if (root) {
      return (root as HTMLElement).shadowRoot;
    }
    return null;
  })();
  if (host && event.key === 'Escape') {
    atcb_log_event('closeList', 'Ecs Hit', getActiveButton());
    atcb_toggle(host, 'close', '', '', true);
  }
}

function atcb_global_listener_keydown(event: KeyboardEvent): void {
  const host: ShadowRoot | null = (function () {
    const root = document.querySelector('[atcb-button-id="' + getActiveButton() + '"]');
    const rootModal = document.getElementById(getActiveButton() + '-modal-host');
    if (rootModal) {
      return (rootModal as HTMLElement).shadowRoot;
    }
    if (root) {
      return (root as HTMLElement).shadowRoot;
    }
    return null;
  })();
  if (host && host.querySelector('.atcb-list') && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')) {
    event.preventDefault();
    let targetFocus = 0;
    const currFocusOption = (host as unknown as { activeElement: Element | null }).activeElement as HTMLElement | null;
    const optionListCount = host.querySelectorAll('.atcb-list-item').length;
    if (currFocusOption && currFocusOption.classList.contains('atcb-list-item')) {
      if (event.key === 'ArrowDown' && (currFocusOption.dataset.optionNumber as unknown as number) < optionListCount) {
        targetFocus = parseInt(currFocusOption.dataset.optionNumber!) + 1;
      } else if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift+Tab: navigate backwards
          if ((currFocusOption.dataset.optionNumber as unknown as number) > 1) {
            targetFocus = parseInt(currFocusOption.dataset.optionNumber!) - 1;
          } else {
            targetFocus = optionListCount;
          }
        } else {
          // Tab: navigate forwards
          if ((currFocusOption.dataset.optionNumber as unknown as number) < optionListCount) {
            targetFocus = parseInt(currFocusOption.dataset.optionNumber!) + 1;
          } else {
            targetFocus = 1;
          }
        }
      } else if (event.key === 'ArrowUp' && (currFocusOption.dataset.optionNumber as unknown as number) >= 1) {
        targetFocus = parseInt(currFocusOption.dataset.optionNumber!) - 1;
      }
      if (targetFocus > 0) {
        (host.querySelector('.atcb-list-item[data-option-number="' + targetFocus + '"]') as HTMLElement)!.focus();
      }
    } else {
      switch (event.key) {
        default:
          (host.querySelector('.atcb-list-item[data-option-number="1"]') as HTMLElement)!.focus();
          break;
        case 'ArrowUp':
          (host.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]') as HTMLElement)!.focus();
          break;
      }
    }
  }
}

function atcb_global_listener_resize(): void {
  const host: ShadowRoot | null = (function () {
    const root = document.querySelector('[atcb-button-id="' + getActiveButton() + '"]');
    const rootModal = document.getElementById(getActiveButton() + '-modal-host');
    if (rootModal) {
      return (rootModal as HTMLElement).shadowRoot;
    }
    if (root) {
      return (root as HTMLElement).shadowRoot;
    }
    return null;
  })();
  if (host) {
    const activeOverlay = host.querySelector('#atcb-bgoverlay');
    if (activeOverlay) {
      atcb_manage_body_scroll(host);
    }
  }
}

function atcb_unset_global_event_listener(identifier?: string): void {
  const observer = lightModeMutationObserver.get(identifier!);
  if (observer) {
    observer.disconnect();
    lightModeMutationObserver.delete(identifier!);
  }
}

export { template as atcbShadowTemplate, atcb_unset_global_event_listener, atcb_load_css, atcb_set_light_mode, atcb_get_pro_data, atcb_init_log, atcb_setup_state_management, atcb_set_global_event_listener };
