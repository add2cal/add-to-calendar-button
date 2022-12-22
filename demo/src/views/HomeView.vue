<script setup lang="ts">
import { RouterLink } from "vue-router";
import { defineAsyncComponent } from 'vue';
import { ArrowRightIcon, WrenchScrewdriverIcon, BeakerIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'
import IntegrationGuides from "@/components/integration/IntegrationGuides.vue";
import PHLightImage from '@i/ph-badge-light.svg';
import PHDarkImage from '@i/ph-badge-dark.svg';
const { t, locale } = useI18n();
</script>

<script lang="ts">
export default {
  components: {
    PlaygroundArea: defineAsyncComponent(() =>
      import('@/components/playground/PlaygroundArea.vue')
    ),
    FeaturesBlock: defineAsyncComponent(() =>
      import('@/components/FeaturesBlock.vue')
    )
  }
}
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
        ><img :src="PHDarkImage" alt="Product of the Day | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54"
      /></a>
      <a href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator" target="_blank" rel="noopener" class="block self-center drop-shadow dark:hidden md:self-start"
        ><img :src="PHLightImage" alt="Product of the Day | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54"
      /></a>
    </div>
  </div>

  <div id="demo" class="mt-20 bg-gradient-to-tr from-zinc-300 to-zinc-200 pt-12 pb-16 shadow-lg dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700 dark:shadow-xl">
    <div class="container">
      <h2 class="pb-8"><BeakerIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />{{ t('navigation.playground') }}</h2>
    </div>
    <PlaygroundArea />
    <div class="container hidden md:block">
      <div class="py-4 text-center text-sm italic text-zinc-400 dark:text-zinc-500">
        {{ t('content.demoDisclaimer') }} <RouterLink :to="{ name: 'configuration', params: { locale } }">"{{ t('labels.clickHere') }}"</RouterLink>
      </div>
    </div>
  </div>

  <div class="h-14"></div>

  <div id="installation" class="container pt-12">
    <h2 class="pb-8"><WrenchScrewdriverIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />Bringing it to your Website</h2>
    <IntegrationGuides />

    <h2 id="features" class="mt-20 pb-8"><AdjustmentsHorizontalIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />Functionality</h2>
    <div>Simple and convenient integration of 1 or many buttons, configurable directly within the HTML code!</div>
    <FeaturesBlock />

    <div class="mt-20 border-t border-zinc-300 py-14 text-center dark:border-zinc-700">
      <h3 class="pb-6">What's next?</h3>

      <RouterLink class="button-primary m-6" :to="{ name: 'examples', params: { locale } }"
        ><MagnifyingGlassIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" /> Explore Examples <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true"
      /></RouterLink>
      <RouterLink class="button-primary m-6" :to="{ name: 'configuration', params: { locale } }"
        ><AcademicCapIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" /> Learn how to configure <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true"
      /></RouterLink>
    </div>
  </div>
</template>
