<script setup lang="ts">
import { RouterLink } from "vue-router";
import PlaygroundArea from "@/components/playground/PlaygroundArea.vue";
import { ArrowRightIcon, WrenchScrewdriverIcon, BeakerIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'
import IntegrationGuides from "@/components/integration/IntegrationGuides.vue";
const { t, locale } = useI18n();
</script>

<template>
  <div class="container pt-8 pb-5">
    <div class="flex flex-col justify-between lg:flex-row">
      <div class="flex-1 pr-0 pb-16 lg:pb-0 lg:pr-20">
        <h2 class="pb-16 text-zinc-600 dark:text-zinc-300">Let users add events to their calendar.<br />Fast and hustle-free 🔥🚀😏</h2>
        <p>
          Welcome to the maybe most conveniant way working with Add to Calendar Buttons.<br />
          Designed to reduce developer headaches down to zero.
        </p>
        <p>Supporting all major calendars; in all modern browsers (Chrome, Edge, Firefox, Safari); on Windows, Mac, Android, and iOS as well as rather restricted webview environments like the Instagram in-app browser.</p>
        <p class="font-semibold">Built as a Web Component, you can easily integrate it basically everywhere. Enjoy!</p>
      </div>
      <a
        href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator"
        target="_blank"
        rel="noopener"
        class="hidden self-center drop-shadow-light-md dark:block md:self-start"
        ><img src="../../public/assets/img/ph-badge-dark.svg" alt="Product of the Day | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54"
      /></a>
      <a href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator" target="_blank" rel="noopener" class="block self-center drop-shadow dark:hidden md:self-start"
        ><img src="../../public/assets/img/ph-badge-light.svg" alt="Product of the Day | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54"
      /></a>
    </div>
  </div>

  <div id="demo" class="mt-20 bg-gradient-to-tr from-zinc-300 to-zinc-200 pt-12 pb-16 shadow-lg dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700 dark:shadow-xl">
    <div class="container">
      <h2 class="pb-8"><BeakerIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />Playground</h2>
      <PlaygroundArea />
    </div>
  </div>

  <div class="h-14"></div>

  <div id="installation" class="container pt-12">
    <h2 class="pb-8"><WrenchScrewdriverIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />Bringing it to your Website</h2>
    <IntegrationGuides />

    <h2 id="features" class="mt-20 pb-8"><AdjustmentsHorizontalIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />Functionality</h2>
    <div>Simple and convenient integration of 1 or many buttons, configurable directly within the HTML code!</div>
    <div class="my-14 mx-auto grid max-w-sm grid-cols-1 gap-x-10 md:max-w-4xl md:grid-cols-[200px_minmax(0,1fr)] md:gap-y-20">
      <img alt="Supported Calendars" width="150" height="150" src="../../public/assets/img/caltypes.png" class="mx-auto self-center" />
      <div class="mb-20 md:mb-0">
        <h3 class="mt-8 text-left">Supported Calendars</h3>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">Google Calendar.</li>
          <li class="text-left">Apple Calendar.</li>
          <li class="text-left">Microsoft 365, Outlook, and Teams.</li>
          <li class="text-left">Yahoo Calender.</li>
          <li class="text-left">Automatically generated iCal/ics files (for all other calendars and cases).</li>
        </ul>
      </div>
      <img alt="Event Types" width="150" height="150" src="../../public/assets/img/variety.png" class="mx-auto self-center" />
      <div class="mb-20 md:mb-0">
        <h3 class="mt-8 text-left">Event Types</h3>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">Timed and all-day events.</li>
          <li class="text-left">One-time, multi-date, recurring, or fluid.</li>
          <li class="text-left">Calendar subscription.</li>
          <li class="text-left">Most robust time zone and daylight saving management (via our own TimeZones iCal Library).</li>
          <li class="text-left">Dynamic dates (like "today + 3").</li>
        </ul>
      </div>
      <img alt="Look" width="150" height="150" src="../../public/assets/img/style.png" class="mx-auto self-center" />
      <div class="mb-20 md:mb-0">
        <h3 class="mt-8 text-left">Look</h3>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">Beautiful and adjustable UI.</li>
          <li class="text-left">Light and dark mode.</li>
          <li class="text-left">Multiple themes.</li>
        </ul>
      </div>
      <img alt="Accessibility" width="150" height="150" src="../../public/assets/img/accessibility.png" class="mx-auto self-center" />
      <div class="mb-20 md:mb-0">
        <h3 class="mt-8 text-left">Accessibility</h3>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">Optimized and adjustable UX (for desktop and mobile).</li>
          <li class="text-left">Dynamic dropdown positioning.</li>
          <li class="text-left">Taking care of all those edge cases, where some scenarios do not support specific setups (like WebView blocking downloads); utilizing beautiful user guidance workarounds.</li>
          <li class="text-left">Full support for mouse, touch, or keyboard input (W3C WAI compliant).</li>
          <li class="text-left">Supporting 20+ languages, incl. RTL text for Arabic; but also custom labels and text blocks.</li>
        </ul>
      </div>
      <img alt="More" width="150" height="150" src="../../public/assets/img/more.png" class="mx-auto self-center" />
      <div>
        <h3 class="mt-8 text-left">And much more</h3>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">Auto-generated Schema.org rich (structured) data for better SEO.</li>
          <li class="text-left">Fully GDPR, CCPA, and LGPD compliant - without the need of signing some data processing agreement.</li>
          <li class="text-left">Security by design.</li>
          <li class="text-left">...</li>
        </ul>
      </div>
    </div>

    <div class="mt-20 border-t border-zinc-300 py-14 text-center dark:border-zinc-700">
      <h3 class="pb-6">What's next?</h3>

      <RouterLink class="button-primary m-6" :to="{ name: 'examples', params: { locale } }"> Explore Examples <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" /></RouterLink>
      <RouterLink class="button-primary m-6" :to="{ name: 'configuration', params: { locale } }"> Learn how to configure <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" /></RouterLink>
    </div>
  </div>
</template>
