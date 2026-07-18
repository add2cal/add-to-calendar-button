import { getActiveButton } from '../core/store';

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE DROPDOWN LIST
function atcb_position_list(host: ShadowRoot, trigger: HTMLElement, list: HTMLElement, blockUpwards = false, blockDownwards = false): void {
  // check for position anchor
  let anchorSet = false;
  const originalTrigger = trigger;
  if (trigger.querySelector('.atcb-dropdown-anchor') !== null) {
    trigger = trigger.querySelector('.atcb-dropdown-anchor')!;
    anchorSet = true;
  }
  // changing the lists css position and display type temporarily to get the ideal width of the content
  list.style.position = 'relative';
  list.style.display = 'inline-block';
  // calculate position
  let triggerDim = trigger.getBoundingClientRect();
  const btnDim = originalTrigger.getBoundingClientRect();
  const btnParentDim = (originalTrigger.parentNode as Element).getBoundingClientRect();
  const viewportHeight = document.documentElement.clientHeight;
  if (anchorSet === true && !list.classList.contains('atcb-dropoverlay')) {
    let listDim = list.getBoundingClientRect();
    list.style.width = listDim.width + 'px';
    // in the regular case, we also check for the ideal direction
    // not in the !blockUpwards case and not if there is not enough space above
    if (list.classList.contains('atcb-dropup') || (!blockUpwards && triggerDim.top + listDim.height > viewportHeight - 20 && 2 * btnDim.top + btnDim.height - triggerDim.top - listDim.height > 20) || blockDownwards) {
      originalTrigger.classList.add('atcb-dropup');
      list.classList.add('atcb-dropup');
      list.style.bottom = btnParentDim.bottom - btnDim.bottom + (triggerDim.top - btnDim.top) + 'px';
    } else {
      list.style.top = btnDim.top - btnParentDim.top + (triggerDim.top - btnDim.top) + 'px';
      if (originalTrigger.classList.contains('atcb-dropup')) {
        originalTrigger.classList.remove('atcb-dropup');
      }
    }
    // read trigger dimensions again, since after adjusting the top value of the list, something might have changed (e.g. re-adjustment due to missing scrollbars at this point in time)
    triggerDim = trigger.getBoundingClientRect();
    if (!list.classList.contains('atcb-style-simple') && !list.classList.contains('atcb-style-round') && !list.classList.contains('atcb-style-text') && !list.classList.contains('atcb-style-neumorphism')) {
      list.style.minWidth = triggerDim.width + 'px';
      if (list.classList.contains('atcb-dropdown')) {
        list.style.maxWidth = triggerDim.width + 'px';
      }
    }
    // read list dimensions again, since we altered the width in the step before
    listDim = list.getBoundingClientRect();
    list.style.left = Math.round(triggerDim.left - btnParentDim.left - (listDim.width - triggerDim.width) / 2) + 'px';
  } else {
    // when there is no anchor set (only the case with custom implementations) or the listStyle is set respectively (overlay), we render the modal centered above the trigger
    list.style.minWidth = btnDim.width + 20 + 'px';
    // read list dimensions again, since we altered it in the steps before
    const listDim = list.getBoundingClientRect();
    list.style.width = listDim.width + 'px';
    const sideMargin = Math.round((btnDim.width - listDim.width) / 2);
    list.style.margin = -Math.round((listDim.height + btnDim.height) / 2) + 'px ' + sideMargin + 'px 0 ' + sideMargin + 'px';
  }
  // changing the list's position back to absolute and display to block
  list.style.position = 'absolute';
  list.style.display = 'block';
  // adjust branding message, if set
  const atcbL = host.querySelector('#atcb-reference');
  if (atcbL) {
    if (originalTrigger.classList.contains('atcb-dropup')) {
      (originalTrigger.parentNode as Element).after(atcbL);
      atcbL.classList.add('atcb-dropup');
    }
  }
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE SHADOW OVERLAY BUTTON
function atcb_position_shadow_button(originalShadowHost: ShadowRoot, modalShadowHost: ShadowRoot): void {
  const wrapperDim = originalShadowHost.querySelector('.atcb-initialized ')!.getBoundingClientRect();
  const newWrapper = modalShadowHost.querySelector('.atcb-initialized') as HTMLElement;
  let widthVal = wrapperDim.width;
  if (wrapperDim.width < 250) {
    widthVal = 250;
  }
  newWrapper.style.width = widthVal + 'px';
  newWrapper.style.height = wrapperDim.height + 'px';
  newWrapper.style.top = wrapperDim.top + 'px';
  newWrapper.style.left = wrapperDim.left + 'px';
}

function atcb_position_shadow_button_listener(): void {
  const active = getActiveButton();
  if (active !== null && active !== '') {
    const originalEl = document.querySelector('add-to-calendar-button[atcb-button-id=' + active + ']')!.shadowRoot!;
    const shadowEl = document.querySelector('div[atcb-button-id=' + active + ']')!.shadowRoot!;
    atcb_position_shadow_button(originalEl, shadowEl);
  }
}

// SHARED FUNCTION TO CALCULATE WHETHER WE BLOCK SCROLLING OR NOT
function atcb_manage_body_scroll(host: ShadowRoot, modalObj: Element | null = null): void {
  const modal = (function (): Element | null | undefined {
    // if a specific modal is defined, we take it. Otherwise we go for the latest one
    if (modalObj != null) {
      return modalObj;
    } else {
      const allModals = host.querySelectorAll('.atcb-modal');
      if (allModals.length === 0) {
        return null;
      }
      return allModals[allModals.length - 1];
      // since ES2022 this could also simply be return host.querySelectorAll('.atcb-modal').at(-1); - let's change this in the future
    }
  })();
  if (modal == null) {
    return;
  }
  document.body.classList.add('atcb-modal-no-scroll');
  document.documentElement.classList.add('atcb-modal-no-scroll');
}

// SHARED FUNCTION TO UPDATE GLOBAL SIZES
function atcb_set_sizes(el: HTMLElement, sizes: { [key: string]: number | string }): void {
  el.style.setProperty('--base-font-size-l', sizes['l'] + 'px');
  el.style.setProperty('--base-font-size-m', sizes['m'] + 'px');
  el.style.setProperty('--base-font-size-s', sizes['s'] + 'px');
}

export { atcb_position_list, atcb_position_shadow_button, atcb_position_shadow_button_listener, atcb_manage_body_scroll, atcb_set_sizes };
