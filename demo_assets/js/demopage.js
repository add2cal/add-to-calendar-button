/**
 * +++++++++++++++++++++++++++++++++++++++++
 * Add-to-Calendar Button - Demo Page Script
 * +++++++++++++++++++++++++++++++++++++++++
 *
 * Creator: Jens Kuerschner (https://jenskuerschner.de)
 * Project: https://github.com/add2cal/add-to-calendar-button
 * License: MIT with “Commons Clause” License Condition v1.0
 *
 */

const lightModeButton = document.getElementById('light-mode-switch');
const cval = document.cookie.match('(^|;)\\s*atcb-light-mode\\s*=\\s*([^;]+)')?.pop() || '';

if (cval == '') {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.toggle('atcb-dark');
  }
} else {
  if (cval == 'dark') {
    document.body.classList.toggle('atcb-dark');
  }
}

lightModeButton.addEventListener('click', () => {
  document.body.classList.toggle('atcb-dark');
  // also save as cookie
  let newCval = 'light';
  if (document.body.classList.contains('atcb-dark')) {
    newCval = 'dark';
  }
  const d = new Date();
  d.setTime(d.getTime() + 90 * 24 * 60 * 60 * 1000);
  document.cookie = 'atcb-light-mode=' + newCval + ';expires=' + d.toUTCString();
});
