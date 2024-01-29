/*
 *  ++++++++++++++++++++++
 *  Add to Calendar Button
 *  ++++++++++++++++++++++
 *
 *  Version: 2.5.9
 *  Creator: Jens Kuerschner (https://jenskuerschner.de)
 *  Project: https://github.com/add2cal/add-to-calendar-button
 *  License: Elastic License 2.0 (ELv2) (https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt)
 *  Note:    DO NOT REMOVE THE COPYRIGHT NOTICE ABOVE!
 *
 */

import { atcbIcon, atcbStates, atcbDefaultTarget } from './atcb-globals.js';
import { atcb_toggle, atcb_close } from './atcb-control.js';
import { atcb_generate_links } from './atcb-links.js';
import { atcb_generate_time, atcb_generate_timestring, atcb_position_shadow_button, atcb_position_shadow_button_listener, atcb_manage_body_scroll, atcb_set_fullsize, atcb_set_sizes, atcb_debounce, atcb_debounce_leading } from './atcb-util.js';
import { atcb_set_fully_successful } from './atcb-links.js';
import { atcb_translate_hook } from './atcb-i18n.js';
import { atcb_load_css, atcb_set_light_mode } from './atcb-init.js';
import { atcb_log_event } from './atcb-event.js';
import { atcb_generate_rsvp } from './atcb-generate-pro.js';

// GENERATE THE ACTUAL BUTTON
// helper function to generate the labels for the button and list options
function atcb_generate_label(host, data, parent, type, icon = false, text = '', oneOption = false) {
  // setting IDs and adding event listeners
  switch (type) {
    case 'trigger':
    case 'rsvp':
    default:
      parent.id = data.identifier;
      if (!data.blockInteraction) {
        parent.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            event.preventDefault();
            if (type === 'rsvp' && typeof atcb_generate_rsvp === 'function') {
              atcb_generate_rsvp(host, data, true, false, true, parent);
            } else {
              atcb_toggle(host, 'auto', data, parent, true, true);
            }
          }
        });
        parent.addEventListener(
          'touchend',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            if (type === 'rsvp' && typeof atcb_generate_rsvp === 'function') {
              atcb_generate_rsvp(host, data, false, false, true, parent);
            } else {
              atcb_toggle(host, 'auto', data, parent, false, true);
            }
          }),
        );
        if (data.trigger === 'click' || (type === 'rsvp' && typeof atcb_generate_rsvp === 'function')) {
          parent.addEventListener(
            'mouseup',
            atcb_debounce_leading((event) => {
              event.preventDefault();
              if (type === 'rsvp' && typeof atcb_generate_rsvp === 'function') {
                atcb_generate_rsvp(host, data, false, false, true, parent);
              } else {
                atcb_toggle(host, 'auto', data, parent, false, true);
              }
            }),
          );
        } else {
          parent.addEventListener(
            'mouseenter',
            atcb_debounce_leading((event) => {
              event.preventDefault();
              atcb_toggle(host, 'open', data, parent, false, true);
            }),
          );
        }
      }
      break;
    case 'apple':
    case 'google':
    case 'ical':
    case 'msteams':
    case 'ms365':
    case 'outlookcom':
    case 'yahoo':
      parent.id = data.identifier + '-' + type;
      if (!data.blockInteraction) {
        parent.addEventListener(
          'click',
          atcb_debounce_leading(() => {
            if (oneOption) {
              host.querySelector('#' + parent.id)?.blur();
              atcb_log_event('openSingletonLink', parent.id, data.identifier);
            } else {
              atcb_toggle(host, 'close');
              atcb_log_event('openCalendarLink', parent.id, data.identifier);
            }
            atcb_generate_links(host, type, data);
          }),
        );
        parent.addEventListener('keyup', function (event) {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (oneOption) {
              host.querySelector('#' + parent.id)?.blur();
              atcb_log_event('openSingletonLink', parent.id, data.identifier);
            } else {
              atcb_toggle(host, 'close');
              atcb_log_event('openCalendarLink', parent.id, data.identifier);
            }
            atcb_generate_links(host, type, data, 'all', true);
          }
        });
      }
      break;
    case 'close':
      parent.id = data.identifier + '-close';
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          atcb_log_event('closeList', 'List Close Button', atcbStates['active']);
          atcb_toggle(host, 'close');
        }),
      );
      parent.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          atcb_log_event('closeList', 'List Close Button', atcbStates['active']);
          atcb_toggle(host, 'close', data, 'all', true);
        }
      });
      break;
  }
  // set icon and text
  atcb_generate_label_content(data, parent, type, icon, text, oneOption);
}

function atcb_generate_label_content(data, parent, type, icon, text, oneOption) {
  const defaultTriggerText = (function () {
    if (data.pastDateHandling != 'none') {
      let allOverdue = true;
      for (let i = 0; i < data.dates.length; i++) {
        if (!data.dates[`${i}`].overdue) {
          allOverdue = false;
          break;
        }
      }
      if (allOverdue) {
        return atcb_translate_hook('expired', data);
      }
    }
    return atcb_translate_hook('label.addtocalendar', data);
  })();
  // defining text labels
  // if there is only 1 option, we use the trigger text on the option label
  if (text === '') {
    if (data.options.length === 1 || type === 'trigger') {
      text = defaultTriggerText;
    } else if (type === 'close') {
      text = atcb_translate_hook('close', data);
    } else {
      text = atcb_translate_hook(type, data);
    }
  }
  // add icon and text label (not in the date style trigger case)
  if (data.buttonStyle === 'date' && (type == 'trigger' || oneOption)) {
    return;
  }
  if (icon) {
    const iconEl = document.createElement('div');
    iconEl.classList.add('atcb-icon');
    iconEl.classList.add(`atcb-icon-${type}`);
    iconEl.innerHTML = atcbIcon[`${type}`];
    parent.append(iconEl);
  }
  if (((type == 'trigger' || oneOption) && !data.hideTextLabelButton) || (!oneOption && type != 'trigger' && !data.hideTextLabelList)) {
    const textEl = document.createElement('span');
    textEl.classList.add('atcb-text');
    textEl.textContent = text;
    parent.append(textEl);
  }
  // also add text as aria-label to the parent element
  parent.setAttribute('aria-label', text);
}

// generate the triggering button
function atcb_generate_button(host, button, data) {
  // determine whether we are looking for the 1-option case (also with buttonsList)
  const oneOption = (function () {
    if (data.options.length === 1 || (data.buttonsList && data.buttonStyle != 'date')) {
      return true;
    }
    return false;
  })();
  const optionSplit = oneOption ? data.options : ['default'];
  optionSplit.forEach(function (option, index) {
    // generate the wrapper div
    const buttonTriggerWrapper = document.createElement('div');
    buttonTriggerWrapper.classList.add('atcb-button-wrapper');
    if (data.rtl) {
      buttonTriggerWrapper.classList.add('atcb-rtl');
    }
    button.append(buttonTriggerWrapper);
    atcb_set_sizes(buttonTriggerWrapper, data.sizes);
    // generate the button trigger div
    const buttonTrigger = document.createElement('button');
    buttonTrigger.classList.add('atcb-button');
    if (data.disabled) {
      buttonTrigger.setAttribute('disabled', true);
    }
    if (data.hideTextLabelButton) {
      buttonTrigger.classList.add('atcb-no-text');
    }
    if (data.trigger === 'click') {
      buttonTrigger.classList.add('atcb-click');
    }
    if (data.listStyle === 'overlay') {
      buttonTrigger.classList.add('atcb-dropoverlay');
    }
    buttonTrigger.type = 'button';
    buttonTrigger.setAttribute('aria-expanded', false); // aria-expanded default value on button generate
    buttonTriggerWrapper.append(buttonTrigger);
    // generate the label incl. eventListeners
    if (data.buttonStyle === 'date') {
      atcb_generate_date_button(data, buttonTrigger);
    }
    // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text
    if (oneOption) {
      buttonTrigger.classList.add('atcb-single');
      // if buttonsList is true and we have more than 1 option, use the option as label
      const label = (function () {
        if (data.buttonsList && data.options.length > 1) {
          return atcb_translate_hook(`${data.options[`${index}`]}`, data);
        }
        return data.label;
      })();
      // generate label
      atcb_generate_label(host, data, buttonTrigger, option, !data.hideIconButton, label, true);
      // override the id for the oneOption button, since the button always needs to have the button id, while it received the option id from the labeling function
      buttonTrigger.id = data.identifier;
      // but in case we simply render one button per option, only use the identifier for the first one and also add the info for the option
      if (data.buttonsList) {
        buttonTrigger.id = data.identifier + '-' + option;
      }
    } else {
      atcb_generate_label(host, data, buttonTrigger, 'trigger', !data.hideIconButton, data.label);
      // create an empty anchor div to place the dropdown, while the position can be defined via CSS
      const buttonDropdownAnchor = document.createElement('div');
      buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
      buttonTrigger.append(buttonDropdownAnchor);
    }
    // add checkmark (hidden first) (if button is not disabled already)
    if (!data.hideCheckmark && !data.hideTextLabelButton && !data.buttonsList && !data.disabled) {
      const btnCheck = document.createElement('div');
      btnCheck.classList.add('atcb-checkmark');
      btnCheck.innerHTML = atcbIcon['checkmark'];
      buttonTrigger.append(btnCheck);
    }
  });
  if (data.debug) {
    console.log('Add to Calendar Button "' + data.identifier + '" created');
  }
}

// generate the dropdown list (can also appear wihtin a modal, if option is set)
function atcb_generate_dropdown_list(host, data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  optionsList.role = 'list';
  if (data.rtl) {
    optionsList.classList.add('atcb-rtl');
  }
  // generate the list items
  let listCount = 0;
  data.options.forEach(function (option) {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.role = 'link';
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.append(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(host, data, optionItem, option, !data.hideIconList);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.role = 'button';
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.append(optionItem);
    atcb_generate_label(host, data, optionItem, 'close', !data.hideIconList);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
function atcb_generate_bg_overlay(host, trigger = '', modal = false, darken = true, closable = true) {
  const bgOverlay = (function () {
    if (modal) {
      return document.createElement('dialog');
    }
    return document.createElement('div');
  })();
  if (modal) {
    bgOverlay.setAttribute('open', true);
  }
  bgOverlay.id = 'atcb-bgoverlay';
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.role = 'button';
  bgOverlay.tabIndex = 0;
  if (closable) {
    bgOverlay.addEventListener(
      'mouseup',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_log_event('closeList', 'Background Hit', atcbStates['active']);
        atcb_toggle(host, 'close');
      }),
    );
    let fingerMoved = false;
    bgOverlay.addEventListener(
      'touchstart',
      atcb_debounce_leading(() => (fingerMoved = false)),
      { passive: true },
    );
    bgOverlay.addEventListener(
      'touchmove',
      atcb_debounce_leading(() => (fingerMoved = true)),
      { passive: true },
    );
    bgOverlay.addEventListener(
      'touchend',
      atcb_debounce((e) => {
        if (fingerMoved !== false || e.target !== e.currentTarget) return;
        atcb_log_event('closeList', 'Background Hit', atcbStates['active']);
        atcb_toggle(host, 'close');
      }),
      { passive: true },
    );
    if (trigger !== 'click') {
      bgOverlay.addEventListener(
        'mousemove',
        atcb_debounce_leading((e) => {
          if (e.target !== e.currentTarget) return;
          atcb_log_event('closeList', 'Background Hit', atcbStates['active']);
          atcb_toggle(host, 'close');
        }),
      );
    } else {
      // if trigger is not set to 'click', we render a close icon, when hovering over the background
      bgOverlay.classList.add('atcb-click');
    }
  }
  return bgOverlay;
}

// SMALL LOGO
function atcb_create_atcbl(host, atList = true, returnEl = false) {
  const atcbL = document.createElement('div');
  atcbL.id = 'atcb-reference';
  setTimeout(() => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.916 2.8305"><path d="M51.446 1.2565c.0708-.2518.293-.4511.5555-.4783.2211-.042.4641.0128.622.18.2474.2472.3045.6146.2916.9503v.8594h-.8307l-.0027-1.0447c-.0079-.1547-.1075-.343-.2868-.3238-.2049.0128-.3115.2421-.295.4257v.9428h-.823l-.0027-1.0435c-.0076-.1569-.1131-.3412-.2918-.3252-.2069.008-.311.2351-.2939.4188v.9499h-.8307V.8237h.8307v.4019c.0906-.2264.2876-.4188.5368-.449.2878-.0533.6071.0705.7509.3331.0279.0465.0509.0959.0699.1468zm-3.9843.5228c-.0102.1874.107.3914.3024.424.1869.0419.3799-.0941.4215-.2776.0535-.1967-.0023-.4493-.2015-.5411-.1767-.0892-.4107.0032-.483.1865-.0297.0649-.0391.1374-.0392.2082zm-.7691 0c.0037-.2984.1395-.5957.3792-.7774.3035-.2327.7168-.2798 1.0829-.2005.3299.0729.6352.3018.7481.6275.1337.3797.0441.8526-.2795 1.1099-.3184.2561-.7624.3092-1.152.2184-.3379-.0788-.6426-.3312-.7369-.6717a1.092 1.092 0 0 1-.0417-.3063zm-.2351-.3308c-.1638-.0482-.3406-.0889-.5104-.0492s-.2742.2154-.2664.3837c-.0082.1705.0998.3468.2712.3876.1657.0389.3389.0016.4979-.0492l.0769.5499c-.2369.1272-.5165.1434-.7791.1149-.3236-.0401-.6353-.2311-.7805-.529-.1237-.2511-.139-.5539-.0485-.8181.108-.3075.3782-.5432.6902-.6287.2064-.058.4286-.0585.6371-.0119.1027.0253.198.0732.2884.1269l-.0769.523zm-2.6877.9806c-.003-.1221.066-.2371.1643-.3062.1303-.0934.3092-.1186.4572-.0533.132.054.2426.1752.2607.3197s-.0575.2836-.1746.3603c-.1633.1093-.3947.1063-.5517-.0135-.0951-.0715-.1577-.187-.1559-.307zm-3.046-1.0111c-.0091-.4276.1794-.8577.5181-1.1231.3714-.2958.8865-.3488 1.3384-.2477.4065.0946.7695.3811.9242.7731.2302.553.1173 1.2562-.3406 1.6606-.4021.3563-.9997.4264-1.5018.273-.4407-.1312-.7876-.5106-.8926-.9564a1.565 1.565 0 0 1-.0458-.3795zm1.4499.6961c.2631.014.4813-.2093.5326-.4557.0785-.3033.0224-.6834-.2491-.8753-.2182-.159-.5514-.1019-.704.1211-.1692.2437-.1902.5756-.088.8501.0775.2087.2816.3661.5085.3597zm-1.631.6458c-.1978.0602-.4078.0938-.6123.0464-.2697-.0443-.5044-.2371-.6009-.4927-.0701-.1852-.1026-.3819-.154-.5728h-.1846v1.0268h-.8614V.0601l1.3192.0034c.3398.0217.7177.1323.9118.434.152.2456.127.584-.0389.8163-.0979.1284-.2387.2162-.3846.2807.0316.1513.0475.3167.1461.4418.1193.1187.3064.1031.4596.0812v.6422zm-.871-1.8651c.0103-.138-.1243-.231-.25-.2384-.1427-.0193-.2871-.0088-.4307-.0115v.5422c.1905-.0038.3947.0138.5678-.0796a.234.234 0 0 0 .1128-.2126zM35.573.0603l1.1424.0047c.3439.0209.7218.1098.9446.3944.2252.2934.2163.7545-.0512 1.0195-.279.2859-.698.3701-1.0838.362-.0329.0105-.1126-.0258-.102.0281v.8987h-.8499V.0603zm1.0192 1.2345c.1672.0054.3805-.0562.4233-.2409.0425-.1434-.0225-.3102-.1619-.3724-.1328-.0705-.2859-.0537-.4306-.0559v.6615c.0561.0073.1128.0073.1692.0077zm-2.5176.2226h1.0576v.4653h-1.0576zM32.3311.8234h.8307v.4019q.0942-.2384.25-.348.1577-.1115.3615-.1115l.1154.6442q-.375 0-.5519.0808-.175.0788-.175.2538v1.023h-.8307zm-1.2257 1.5791c-.0937.2116-.2986.3716-.5319.3897-.3887.0533-.7844-.1743-.9578-.5217-.2044-.381-.1519-.892.1543-1.2049.2461-.2614.6627-.389.9973-.2285.1574.0799.2779.2236.3381.3886V.7662h.8268v2.0017h-.8268v-.3653zm0-.6345c-.0052-.2449-.2747-.4425-.5088-.3585-.217.0615-.3402.3271-.243.5316.0896.2161.3875.3078.5783.1678.1106-.0747.179-.2073.1735-.3408zM27.7118.7662c.2401-.008.4923.1021.6064.3222.0351.0816.045.0806.0397.0023V.1721l.8307-.1231v2.7189h-.8307v-.3653c-.0907.2158-.3003.3744-.5356.39-.3605.0507-.7279-.1432-.9123-.4525-.2569-.3983-.1992-.9693.1456-1.2985.173-.1702.412-.2772.6563-.2754zm.6461 1.0018c-.0048-.2526-.2909-.4519-.5276-.3518-.2324.0782-.3309.3933-.1843.5898.1239.1938.425.2285.5871.0636.0811-.0768.1287-.1897.1248-.3015zM24.139.8233h.7922v.4019c.1006-.2169.2949-.397.5347-.4408.2696-.0572.58.0085.76.2293.2045.2403.2438.5692.2358.8734v.8802h-.8268l-.0022-1.1213c-.004-.1252-.0677-.2748-.2066-.2939-.2045-.0306-.3739.1457-.4412.3226-.0292.0785-.0098.1646-.0154.2467v.8459h-.8306V.8233zm-1.0416 1.4236c.2011-.0002.3981-.0574.5807-.1384l.0961.5288c-.3198.1421-.6806.1894-1.027.145-.3369-.0473-.6587-.2545-.8007-.5699-.1588-.3469-.1132-.7886.1413-1.0788.2741-.3191.7406-.4335 1.1413-.3308.2768.0734.5008.3019.5751.5779.0429.146.0624.3015.043.453l-1.1806.1538c.0368.134.158.2311.2944.2482.0449.0082.0907.0114.1363.0114zm.1461-.7557c-.0268-.1234-.1257-.237-.2578-.244-.143-.0241-.2868.0725-.325.2111-.0103.0527-.0737.2029.0271.1552l.5558-.1223zm-1.4939 1.1721c-.2463.1208-.5356.1686-.805.1092-.227-.0527-.3993-.2481-.4518-.4712-.0545-.2125-.0296-.4333-.0353-.6502V.1714l.8307-.1231.0011 1.9292c.002.1378.1537.1938.2711.1813.0651.0169.1819-.1.162.0152l.0274.4893zm-2.5115-.2609c-.0937.2116-.2986.3716-.5319.3897-.3887.0533-.7844-.1743-.9578-.5217-.2044-.381-.1519-.892.1543-1.2049.2461-.2614.6627-.389.9973-.2285.1574.0799.2779.2236.3381.3886V.7661h.8268v2.0017h-.8268v-.3653zm0-.6345c-.0052-.2449-.2747-.4425-.5088-.3585-.217.0615-.3402.3271-.243.5316.0896.2161.3875.3078.5783.1678.1106-.0747.179-.2073.1735-.3408zm-2.3726.35c.1696.0054.3334-.0479.4884-.1115l.1077.6249c-.5137.3026-1.2229.2625-1.6732-.1399-.2959-.2444-.4693-.6191-.4819-1.0009-.0323-.4791.181-.9792.5853-1.2496.4565-.3128 1.0898-.3142 1.5659-.0438l-.1038.6115c-.2721-.1029-.5957-.168-.8667-.0274-.2291.1239-.3077.4039-.2984.6481-.0043.2465.1061.5161.3427.6212.1037.0495.2198.0676.3339.0676zm-2.923-.6005h1.0576v.4653h-1.0576zm-1.7829.2619c-.0102.1874.107.3914.3024.424.1869.0419.3799-.0941.4215-.2776.0535-.1967-.0023-.4493-.2015-.5411-.1767-.0892-.4107.0032-.4831.1865-.0297.0649-.0391.1374-.0392.2082zm-.7691 0c.0037-.2984.1395-.5957.3792-.7774.3035-.2327.7168-.2798 1.0829-.2005.33.0729.6352.3018.7481.6275.1337.3797.0441.8526-.2795 1.1099-.3184.2561-.7624.3092-1.152.2184-.3379-.0788-.6426-.3312-.7369-.6717a1.092 1.092 0 0 1-.0417-.3063zm-.1976.8841c-.2463.1208-.5356.1686-.805.1092-.227-.0527-.3993-.2481-.4518-.4712-.0557-.2169-.0286-.4422-.0334-.6635l.0019-.3551h-.25V.7943h.3115l.3653-.7461h.4v.7461h.4538v.4884h-.4538l.0011.6943c.0034.1365.1541.1943.2715.1818.0768.006.1848-.0959.1624.0301l.0265.4744zm-2.7861-1.146h1.0575v.4653H8.4068zM6.5412.7662c.2401-.008.4923.1021.6064.3223.0351.0816.045.0806.0397.0023V.172l.8307-.1231v2.7189h-.8307v-.3653c-.0907.2158-.3003.3744-.5356.39-.3605.0507-.7279-.1432-.9123-.4525-.2569-.3983-.1992-.9693.1456-1.2985.173-.1702.412-.2772.6563-.2754zm.6461 1.0018c-.0048-.2526-.2909-.4519-.5276-.3518-.2324.0782-.3308.3933-.1843.5898.1239.1938.425.2285.5871.0636.0811-.0768.1287-.1897.1248-.3015zM3.7956.7662c.2401-.008.4923.1021.6064.3222.0351.0816.045.0806.0397.0023V.172l.8307-.1231v2.7189h-.8307v-.3653c-.0907.2158-.3003.3744-.5356.39-.3605.0507-.7279-.1432-.9123-.4525-.2569-.3983-.1992-.9693.1456-1.2985.173-.1702.4119-.2772.6563-.2754zm.6461 1.0018c-.0048-.2526-.2909-.4519-.5276-.3518-.2324.0782-.3308.3933-.1843.5898.1239.1938.425.2285.5871.0636.0811-.0768.1287-.1897.1248-.3015zM.7498.0603h1.196l.7845 2.7074h-.9268l-.1038-.5192H.9997l-.1115.5192h-.8883zm.8576 1.7037L1.3497.5795 1.0843 1.764z"/></svg>';
    atcbL.innerHTML = '<a href="https://add-to-calendar-pro.com" target="_blank" rel="noopener">' + svg + '</a>';
  }, 500);
  if (atList) {
    host.querySelector('.atcb-initialized .atcb-list-wrapper').append(atcbL);
  } else if (returnEl) {
    return atcbL;
  } else {
    if (window.innerHeight > 1000 || window.innerWidth > 1000) {
      host.append(atcbL);
      atcbL.classList.add('fixed-ref');
    }
  }
}

// FUNCTION TO CREATE MODALS
// this is only about special communication modals - not the list style modal
async function atcb_create_modal(host, data, icon = '', headline, content = '', buttons = [], subEvents = [], keyboardTrigger = false, goto = {}, closable = true) {
  atcbStates['active'] = data.identifier;
  // setting the stage
  const modalHost = await atcb_generate_modal_host(host, data, false);
  const bgOverlay = (function () {
    const el = modalHost.getElementById('atcb-bgoverlay');
    if (!el) {
      const newOverlay = atcb_generate_bg_overlay(host, 'click', true, !data.hideBackground, closable);
      modalHost.querySelector('.atcb-modal-host-initialized').append(newOverlay);
      return newOverlay;
    }
    return el;
  })();
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('atcb-modal');
  bgOverlay.append(modalWrapper);
  const modalCount = modalHost.querySelectorAll('.atcb-modal').length;
  modalWrapper.dataset.modalNr = modalCount;
  modalWrapper.tabIndex = 0;
  modalWrapper.focus({ preventScroll: true });
  modalWrapper.blur();
  const parentButton = (function () {
    const hostEl = host.getElementById(data.identifier);
    if (hostEl) {
      return hostEl;
    }
    return document.getElementById(data.identifier);
  })();
  if (parentButton) {
    parentButton.classList.add('atcb-active-modal');
  }
  // create box
  const modal = document.createElement('div');
  modal.classList.add('atcb-modal-box');
  if (data.rtl) {
    modal.classList.add('atcb-rtl');
  }
  modalWrapper.append(modal);
  atcb_set_sizes(modal, data.sizes);
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // add icon
  if (icon !== '' && !data.hideIconModal) {
    const modalIcon = document.createElement('div');
    modalIcon.classList.add('atcb-modal-icon');
    modalIcon.innerHTML = atcbIcon[`${icon}`];
    modal.append(modalIcon);
  }
  // add headline
  if (headline && headline !== '') {
    const modalHeadline = document.createElement('div');
    modalHeadline.classList.add('atcb-modal-headline');
    modalHeadline.textContent = headline;
    modal.append(modalHeadline);
  }
  // add text content
  if (content !== '') {
    const modalContent = document.createElement('div');
    modalContent.classList.add('atcb-modal-content');
    modalContent.innerHTML = content;
    modal.append(modalContent);
  }
  if (!data.hideBranding) {
    atcb_create_atcbl(modalHost, false);
  }
  // add subEvent buttons (array with type first and subEvent numbers following)
  if (subEvents.length > 1) {
    const modalsubEventsContentWrapper = document.createElement('div');
    modalsubEventsContentWrapper.classList.add('atcb-modal-content');
    modal.append(modalsubEventsContentWrapper);
    const modalsubEventsContent = document.createElement('div');
    modalsubEventsContent.classList.add('atcb-modal-content-subevents');
    modalsubEventsContentWrapper.append(modalsubEventsContent);
    for (let i = 1; i < subEvents.length; i++) {
      const modalSubEventButton = document.createElement('button');
      modalSubEventButton.type = 'button';
      modalSubEventButton.id = data.identifier + '-' + subEvents[0] + '-' + i;
      if (atcbStates[`${data.identifier}`][`${subEvents[0]}`][i - 1] > 0) {
        modalSubEventButton.classList.add('atcb-saved');
      }
      modalSubEventButton.classList.add('atcb-subevent-btn');
      modalsubEventsContent.append(modalSubEventButton);
      atcb_generate_date_button(data, modalSubEventButton, i);
      // interaction only if not overdue and blocked
      if (!data.dates[i - 1].overdue || data.pastDateHandling === 'none') {
        if (i === 1 && keyboardTrigger) {
          modalSubEventButton.focus();
        }
        modalSubEventButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_log_event('openSubEventLink', modalSubEventButton.id, data.identifier);
            modalSubEventButton.blur();
            atcb_generate_links(host, subEvents[0], data, subEvents[`${i}`], keyboardTrigger, true);
          }),
        );
      } else {
        // if blocked, we also add styles
        modalSubEventButton.setAttribute('disabled', true);
      }
    }
  }
  // add buttons (array of objects; attributes: href, type, label, primary(boolean), small(boolean), id)
  if (buttons.length === 0) {
    buttons.push({ type: 'close', label: atcb_translate_hook('close', data), small: true });
  }
  const modalButtons = document.createElement('div');
  modalButtons.classList.add('atcb-modal-buttons');
  modal.append(modalButtons);
  buttons.forEach((button, index) => {
    let modalButton;
    if (button.href && button.href !== '') {
      modalButton = document.createElement('a');
      modalButton.setAttribute('target', atcbDefaultTarget);
      modalButton.setAttribute('href', button.href);
      modalButton.setAttribute('rel', 'noopener');
    } else {
      modalButton = document.createElement('button');
      modalButton.type = 'button';
    }
    if (button.id && button.id !== '') {
      modalButton.id = button.id;
    }
    modalButton.classList.add('atcb-modal-btn');
    if (button.primary) {
      modalButton.classList.add('atcb-modal-btn-primary');
    }
    if (button.small) {
      modalButton.classList.add('btn-small');
    }
    if (!button.label || button.label === '') {
      button.label = atcb_translate_hook('modal.button.default', data);
    }
    modalButton.textContent = button.label;
    modalButtons.append(modalButton);
    if (index === 0 && subEvents.length < 2 && keyboardTrigger) {
      modalButton.focus();
    }
    switch (button.type) {
      default:
      case 'close':
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_log_event('closeList', 'Modal Close Button', atcbStates['active']);
            atcb_close(host);
          }),
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            atcb_log_event('closeList', 'Modal Close Button', atcbStates['active']);
            atcb_toggle(host, 'close', '', '', true);
          }
        });
        break;
      case 'yahoo2nd': // for yahoo subscribe modal, where we guide the user through the process
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_close(host);
            atcb_subscribe_yahoo_modal_switch(host, data);
          }),
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            atcb_toggle(host, 'close', '', '', true);
            atcb_subscribe_yahoo_modal_switch(host, data, keyboardTrigger);
          }
        });
        break;
      case '2timeslink': // for the note that the user shall click the button twice
        modalButton.addEventListener(
          'click',
          atcb_debounce(() => {
            atcb_close(host);
            atcb_generate_links(host, goto.type, data, goto.id, keyboardTrigger, false, true);
          }),
        );
        modalButton.addEventListener('keyup', function (event) {
          if (event.key === 'Enter' || event.code == 'Space' || (event.key === 'Alt' && event.key === 'Control' && event.code === 'Space')) {
            atcb_toggle(host, 'close', '', '', true);
            atcb_generate_links(host, goto.type, data, goto.id, keyboardTrigger, false, true);
          }
        });
        break;
      case 'none':
        break;
    }
  });
  // hide prev modal
  if (modalCount > 1) {
    const prevModal = modalHost.querySelector('.atcb-modal[data-modal-nr="' + (modalCount - 1) + '"]');
    prevModal.classList.add('atcb-hidden');
  }
  // set scroll behavior
  atcb_manage_body_scroll(modalHost, modalWrapper);
}

// FUNCTION TO SWICH THE YAHOO SUBSCRIBE MODAL
function atcb_subscribe_yahoo_modal_switch(host, data, keyboardTrigger) {
  atcb_set_fully_successful(host, data);
  atcb_generate_links(host, 'yahoo2nd', data, 'all', keyboardTrigger);
}

// FUNCTION TO GENERATE A MORE DETAILED DATE BUTTON
function atcb_generate_date_button(data, parent, subEvent = 'all') {
  if (subEvent != 'all') {
    subEvent = parseInt(subEvent) - 1;
  } else if (data.dates.length == 1) {
    subEvent = 0;
  }
  const fullTimeInfo = atcb_generate_timestring(data.dates, data.language, subEvent);
  const hoverText = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return atcb_translate_hook('date.status.cancelled', data) + '<br>' + atcb_translate_hook('date.status.cancelled.cta', data);
    }
    if (data.pastDateHandling != 'none') {
      if ((subEvent == 'all' && data.allOverdue) || (subEvent != 'all' && data.dates[`${subEvent}`].overdue)) {
        return atcb_translate_hook('expired', data);
      }
    }
    if (data.label && data.label != '') {
      return data.label;
    }
    return '+ ' + atcb_translate_hook('label.addtocalendar', data);
  })();
  const cancelledInfo = (function () {
    if (subEvent != 'all' && data.dates[`${subEvent}`].status == 'CANCELLED') {
      return atcb_translate_hook('date.status.cancelled', data);
    }
    return '';
  })();
  const recurringString = (function () {
    if (fullTimeInfo.length == 0) {
      return atcb_translate_hook('recurring', data) + ' &#x27F3;';
    }
    return '&#x27F3;';
  })();
  let subEventAll = false;
  if (subEvent === 'all') {
    subEvent = 0;
    subEventAll = true;
  }
  const startDate = new Date(atcb_generate_time(data.dates[`${subEvent}`]).start);
  const allDay = atcb_generate_time(data.dates[`${subEvent}`]).allday;
  const timeZone = data.dates[`${subEvent}`].timeZone;
  const btnLeft = document.createElement('div');
  btnLeft.classList.add('atcb-date-btn-left');
  parent.append(btnLeft);
  const btnDay = document.createElement('div');
  btnDay.classList.add('atcb-date-btn-day');
  btnLeft.append(btnDay);
  const btnMonth = document.createElement('div');
  btnMonth.classList.add('atcb-date-btn-month');
  btnDay.textContent = (function () {
    if (allDay) {
      return startDate.toLocaleString(data.language, { day: 'numeric' });
    }
    return startDate.toLocaleString(data.language, {
      day: 'numeric',
      timeZone: timeZone,
    });
  })();
  btnMonth.textContent = (function () {
    if (allDay) {
      return startDate.toLocaleString(data.language, { month: 'short' });
    }
    return startDate.toLocaleString(data.language, {
      month: 'short',
      timeZone: timeZone,
    });
  })();
  btnLeft.append(btnMonth);
  const btnRight = document.createElement('div');
  btnRight.classList.add('atcb-date-btn-right');
  parent.append(btnRight);
  const btnDetails = document.createElement('div');
  btnDetails.classList.add('atcb-date-btn-details');
  btnRight.append(btnDetails);
  // headline
  const btnHeadline = document.createElement('div');
  btnHeadline.classList.add('atcb-date-btn-headline');
  if (data.dates.length > 1 && subEventAll) {
    btnHeadline.textContent = data.name; // show name of event series for multi-date
  } else {
    btnHeadline.textContent = data.dates[`${subEvent}`].name;
  }
  btnDetails.append(btnHeadline);
  // location line
  if ((data.dates[`${subEvent}`].location && data.dates[`${subEvent}`].location !== '' && !data.dates[`${subEvent}`].onlineEvent) || cancelledInfo !== '') {
    const btnLocation = document.createElement('div');
    btnLocation.classList.add('atcb-date-btn-content');
    btnDetails.append(btnLocation);
    if (cancelledInfo != '') {
      btnLocation.classList.add('atcb-date-btn-cancelled');
      btnLocation.textContent = cancelledInfo;
    } else {
      const btnLocationIcon = document.createElement('span');
      btnLocationIcon.classList.add('atcb-date-btn-content-icon');
      btnLocationIcon.innerHTML = atcbIcon['location'];
      btnLocation.append(btnLocationIcon);
      const btnLocationText = document.createElement('span');
      btnLocationText.classList.add('atcb-date-btn-content-location');
      btnLocationText.textContent = data.dates[`${subEvent}`].location;
      btnLocation.append(btnLocationText);
    }
  } else {
    // in case we would not show date details as well, show description instead
    if (data.dates[`${subEvent}`].description !== '' && fullTimeInfo.length === 0 && (!data.recurrence || data.recurrence === '')) {
      const btnDescription = document.createElement('div');
      btnDescription.classList.add('atcb-date-btn-content');
      btnDescription.textContent = data.dates[`${subEvent}`].description;
      btnDescription.style.cssText = 'overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;';
      btnDetails.append(btnDescription);
    } else {
      // in other cases, at least give the headline the option to grow
      btnHeadline.style.cssText = '-webkit-line-clamp: 2;';
      // and center, if nothing else is here
      if (fullTimeInfo.length == 0 && (data.recurrence == null || data.recurrence == '')) {
        btnRight.style.alignSelf = 'center';
        btnHeadline.style.cssText = 'text-align: center; -webkit-line-clamp: 2;';
      }
    }
  }
  // datetime line
  if (fullTimeInfo.length > 0 || (data.recurrence != null && data.recurrence != '')) {
    const btnDateTime = document.createElement('div');
    btnDateTime.classList.add('atcb-date-btn-content');
    btnDetails.append(btnDateTime);
    const btnDateTimeIcon = document.createElement('span');
    btnDateTimeIcon.classList.add('atcb-date-btn-content-icon');
    btnDateTimeIcon.innerHTML = atcbIcon['ical'];
    btnDateTime.append(btnDateTimeIcon);
    const btnDateTimeText = document.createElement('span');
    btnDateTimeText.classList.add('atcb-date-btn-content-text');
    btnDateTime.append(btnDateTimeText);
    fullTimeInfo.forEach(function (block) {
      const btnDateTimeTextBlock = document.createElement('span');
      btnDateTimeTextBlock.textContent = block;
      btnDateTimeText.append(btnDateTimeTextBlock);
    });
    if (data.recurrence != null && data.recurrence != '') {
      const recurSign = document.createElement('span');
      recurSign.innerHTML = recurringString;
      btnDateTimeText.append(recurSign);
    }
  }
  // hover text
  const btnHover = document.createElement('div');
  btnHover.classList.add('atcb-date-btn-hover');
  btnHover.innerHTML = hoverText;
  btnRight.append(btnHover);
  if (!data.hideCheckmark) {
    const btnCheck = document.createElement('div');
    btnCheck.classList.add('atcb-checkmark');
    btnCheck.innerHTML = atcbIcon['checkmark'];
    parent.append(btnCheck);
  }
}

// FUNCTION TO BUILD A SECOND SHADOWDOM FOR MODALS
async function atcb_generate_modal_host(host, data, reset = true) {
  // to clean-up the stage, we first close anything left open
  const existingModalHost = document.getElementById(data.identifier + '-modal-host');
  if (!reset && existingModalHost) {
    // return existing one, if we do not want to rebuild
    return existingModalHost.shadowRoot;
  }
  if (existingModalHost) {
    existingModalHost.remove();
  }
  // create host element and add shadowDOM
  let newModalHost = document.createElement('div');
  newModalHost.id = data.identifier + '-modal-host';
  if (host.host.hasAttribute('cspnonce')) {
    newModalHost.setAttribute('cspnonce', host.host.getAttribute('cspnonce'));
  }
  newModalHost.setAttribute('atcb-button-id', data.identifier);
  newModalHost.setAttribute('style', 'transform:translate3D(0, 0, 0);visibility:visible;opacity:1;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;z-index:13999998;');
  document.body.append(newModalHost);
  newModalHost.attachShadow({ mode: 'open', delegateFocus: true });
  const elem = document.createElement('template');
  elem.innerHTML = '<div class="atcb-modal-host-initialized" style="transform:translate3D(0, 0, 0);visibility:visible;opacity:1;position:fixed;top:0;left:0;width:100%;height:100%;display:flex;z-index:13999999;"></div>';
  newModalHost.shadowRoot.append(elem.content.cloneNode(true));
  atcb_set_light_mode(newModalHost.shadowRoot, data);
  await atcb_load_css(newModalHost.shadowRoot, null, data);
  return newModalHost.shadowRoot;
}

// FUNCTION TO COPY THE BUTTON TO A SECOND SHADOWDOM TO FORCE OVERLAY
async function atcb_generate_overlay_dom(host, data) {
  const newHost = await atcb_generate_modal_host(host, data);
  atcb_set_fullsize(newHost.querySelector('.atcb-modal-host-initialized'));
  // get all top-level nodes from host
  const nodes = Array.from(host.children);
  // duplicate all nodes into newHost, except for any style tag
  nodes.forEach((node) => {
    if (node.tagName != 'STYLE') {
      newHost.querySelector('.atcb-modal-host-initialized').append(node.cloneNode(true));
    }
  });
  // remove the id from the <button> to prevent duplicate ids
  newHost.querySelector('button.atcb-button').removeAttribute('id');
  // set the opacity of the original button to 0
  host.host.classList.add('atcb-shadow-hide');
  host.querySelector('.atcb-initialized').style.opacity = '0';
  // set the dimension and position of the .atcb-initialized to the one in the original host
  atcb_position_shadow_button(host, newHost);
  // listener for any scroll activity
  window.addEventListener('scroll', atcb_position_shadow_button_listener);
  window.addEventListener('resize', atcb_position_shadow_button_listener);
  return newHost.querySelector('.atcb-modal-host-initialized');
}

export { atcb_generate_label, atcb_generate_button, atcb_generate_dropdown_list, atcb_create_modal, atcb_generate_bg_overlay, atcb_generate_overlay_dom, atcb_create_atcbl, atcb_generate_modal_host };
