<script setup lang="ts">
import { RouterLink } from "vue-router";
import { defineAsyncComponent } from 'vue';
import { ArrowRightIcon, WrenchScrewdriverIcon, BeakerIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';
import IntegrationGuides from "@/components/integration/IntegrationGuides.vue";
import PlaygroundPlaceholder from "@/components/placeholders/PlaygroundPlaceholder.vue";
import FeaturesBlock from "@/components/FeaturesBlock.vue";
import PHLightImage from '@i/ph-badge-light.svg';
import PHDarkImage from '@i/ph-badge-dark.svg';
const { t, locale } = useI18n();
</script>

<script lang="ts">
const PlaygroundArea = defineAsyncComponent({
  loader: () => import('@/components/playground/PlaygroundArea.vue'),
  loadingComponent: PlaygroundPlaceholder,
  delay: 0,
  errorComponent: PlaygroundPlaceholder,
  timeout: 5000
});
</script>

<template>
  <div class="container pt-8 pb-5">
    <div class="flex flex-col justify-between lg:flex-row">
      <div class="flex-1 pr-0 pb-16 lg:pb-0 lg:pr-20">
        <h2 class="pb-16 text-zinc-600 dark:text-zinc-300">{{ t('content.home.intro_slogan_1') }}.<br />{{ t('content.home.intro_slogan_2') }}<span class="block py-3 sm:inline sm:py-0 sm:px-2">🔥🚀😏</span></h2>
        <p>{{ t('content.home.intro_block_1') }}<br />{{ t('content.home.intro_block_2') }}</p>
        <p>{{ t('content.home.intro_block_3') }}</p>
        <p class="font-semibold">{{ t('content.home.intro_block_4') }}</p>
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
        {{ t('content.home.demoDisclaimer') }} <RouterLink :to="{ name: 'configuration', params: { locale } }">"{{ t('labels.clickHere') }}"</RouterLink>
      </div>
    </div>
  </div>

  <div class="h-14"></div>

  <div id="installation" class="container pt-12">
    <h2 class="pb-8"><WrenchScrewdriverIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />{{ t('content.home.headline_installation') }}</h2>
    <IntegrationGuides />

    <h2 id="features" class="mt-20 pb-8"><AdjustmentsHorizontalIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />{{ t('content.home.headline_functionality') }}</h2>
    <div>{{ t('content.home.functionality_intro') }}</div>
    <FeaturesBlock />

    <div class="mt-20 border-t border-zinc-300 py-14 text-center dark:border-zinc-700">
      <h3 class="pb-6">{{ t('content.home.next') }}</h3>

      <RouterLink class="button-primary m-6" :to="{ name: 'examples', params: { locale } }"
        ><MagnifyingGlassIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" /> {{ t('content.home.button_examples') }} <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true"
      /></RouterLink>
      <RouterLink class="button-primary m-6" :to="{ name: 'configuration', params: { locale } }"
        ><AcademicCapIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" /> {{ t('content.home.button_configure') }} <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true"
      /></RouterLink>
    </div>
  </div>
</template>
