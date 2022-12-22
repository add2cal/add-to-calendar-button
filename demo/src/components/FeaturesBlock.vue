<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CalTypeImage from '@i/caltypes.webp';
import VarietyImage from '@i/variety.webp';
import MoreImage from '@i/more.webp';
import AccessibilityImage from '@i/accessibility.webp';
import StyleImage from '@i/style.webp';
const { t, locale } = useI18n();
</script>

<template>
  <div class="my-14 mx-auto grid max-w-sm grid-cols-1 gap-x-10 md:max-w-4xl md:grid-cols-[200px_minmax(0,1fr)] md:gap-y-20">
    <img alt="Supported Calendars" width="150" height="150" :src="CalTypeImage" class="mx-auto self-center" />
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
    <img alt="Event Types" width="150" height="150" :src="VarietyImage" class="mx-auto self-center" />
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
    <img alt="Look" width="150" height="150" :src="StyleImage" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3 class="mt-8 text-left">Look</h3>
      <ul class="my-4 list-disc pl-6">
        <li class="text-left">Beautiful and adjustable UI.</li>
        <li class="text-left">Light and dark mode.</li>
        <li class="text-left">Multiple themes.</li>
      </ul>
    </div>
    <img alt="Accessibility" width="150" height="150" :src="AccessibilityImage" class="mx-auto self-center" />
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
    <img alt="More" width="150" height="150" :src="MoreImage" class="mx-auto self-center" />
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
</template>
