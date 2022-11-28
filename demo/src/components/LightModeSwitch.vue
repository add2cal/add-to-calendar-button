<script setup lang="ts">
import { ref, onMounted } from 'vue';

export type UserTheme = 'light' | 'dark';

const setTheme = (theme: UserTheme) => {
  localStorage.setItem('user-theme', theme);
  userTheme.value = theme;
};

const getTheme = (): UserTheme => {
  return localStorage.getItem('user-theme') as UserTheme;
};

const toggleTheme = (): void => {
  const activeTheme = localStorage.getItem('user-theme');
  if (activeTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
  document.body.classList.toggle('atcb-dark');
  document.documentElement.classList.toggle('atcb-dark');
};

const getMediaPreference = (): UserTheme => {
  /*const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (hasDarkPreference) {
    return 'dark';
  } else {
    return 'light';
  }*/
  // for now, we will not adapt to any system setting, but always start light, since it better suits the button. Might change this in the future. Therefore, we leave it commented
  return 'light';
};

const userTheme = ref<UserTheme>(getTheme() || getMediaPreference());

onMounted(() => {
  if (userTheme.value == 'dark') {
    document.body.classList.add('atcb-dark');
    document.documentElement.classList.add('atcb-dark');
  }
  setTheme(userTheme.value);
});
</script>

<template>
  <button @click="toggleTheme" class="light-mode-switch" aria-label="Light/Dark Mode Switch">
    <div class="planet"></div>
    <div class="elements">
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
      <svg version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="200" />
      </svg>
    </div>
  </button>
</template>

<style scoped>
/*Copyright (c) 2022 by Anthony Lio (https://codepen.io/antlio/pen/LYVVXLJ)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

button {
  padding: 1em;
  position: relative;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  --bg-planet: #F2C94C;
  --bg-planet-shadow: #828894;
  --bg-planet-lightshadow: #D7D7D820;
}

body.atcb-dark button {
  --bg-planet: #d7d7d8;
}

.planet {
  width: 2em;
  height: 2em;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(3.75em, 99%, transparent 100%);
  background-color: var( --bg-planet);
  background-repeat: no-repeat;
  position: relative;
  will-change: background;
  transition: all 400ms ease;
 /* Safari transition issue */
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}
.planet::after {
  content: "";
  background-color: var(--bg-planet-shadow);
  width: 2em;
  height: 2em;
  position: absolute;
  border-radius: 50%;
  will-change: opacity, transform, background-color;
  opacity: 0;
  transform: translate(2em, -2em);
  transition: opacity 400ms ease, transform 400ms ease, background-color 400ms ease;
}
.elements {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 400ms ease;
}
.elements svg {
  position: absolute;
  width: 7px;
  height: 7px;
  opacity: 1;
  transition: transform 400ms ease, opacity 200ms ease, width 200ms ease, height 200ms ease;
}
.elements svg circle {
  fill: var( --bg-planet);
  transition: fill 400ms ease;
}
.elements svg:first-child {
  transform: translate(1.8em, 0.35em);
}
.elements svg:nth-child(2) {
  transform: translate(2.8em, 0.7em);
}
.elements svg:nth-child(3) {
  transform: translate(3.2em, 1.8em);
}
.elements svg:nth-child(4) {
  transform: translate(2.8em, 2.8em);
}
.elements svg:nth-child(5) {
  transform: translate(1.8em, 3.2em);
}
.elements svg:nth-child(6) {
  transform: translate(0.7em, 2.8em);
}
.elements svg:nth-child(7) {
  transform: translate(0.35em, 1.8em);
}
.elements svg:nth-child(8) {
  transform: translate(0.7em, 0.7em);
}
body.atcb-dark .planet::after {
  opacity: 1;
  transform: translate(-0.5em, -0.4em);
}
body.atcb-dark .elements {
  transform: rotate(180deg);
}
body.atcb-dark .elements svg:first-child {
  transform: translate(2em, 1em);
  opacity: 0;
}
body.atcb-dark .elements svg:nth-child(2) {
  transform: translate(3em, 1.5em);
  opacity: 0;
}
body.atcb-dark .elements svg:nth-child(3) {
  transform: translate(3em, 2em);
  opacity: 0;
}
body.atcb-dark .elements svg:nth-child(4) {
  transform: translate(3em, 2em);
  opacity: 0;
}
body.atcb-dark .elements svg:nth-child(5) {
  transform: translate(1.9em, 2.6em);
  width: 0.3em;
  height: 0.3em;
}
body.atcb-dark .elements svg:nth-child(5) circle {
  fill: var(--bg-planet-lightshadow);
}
body.atcb-dark .elements svg:nth-child(6) {
  transform: translate(1.4em, 2.5em);
  width: 0.3em;
  height: 0.3em;
}
body.atcb-dark .elements svg:nth-child(6) circle {
  fill: var(--bg-planet-lightshadow);
}
body.atcb-dark .elements svg:nth-child(7) {
  transform: translate(1.1em, 1.6em);
  width: 0.7em;
  height: 0.7em;
}
body.atcb-dark .elements svg:nth-child(7) circle {
  fill: var(--bg-planet-lightshadow);
}
body.atcb-dark .elements svg:nth-child(8) {
  width: 0.45em;
  height: 0.45em;
  transform: translate(1.7em, 2.1em);
}
body.atcb-dark .elements svg:nth-child(8) circle {
  fill: var(--bg-planet-lightshadow);
}
</style>
