<script setup lang="ts">
import { ArrowRightIcon, WrenchScrewdriverIcon, BeakerIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import IntegrationGuidesOverview from "@/components/integration/integrationGuidesOverview.vue";
import PlaygroundArea from "@/components/playground/playgroundArea.vue";
import PlaygroundAreaPlaceholder from "@/components/placeholders/playgroundAreaPlaceholder.vue";
import FeaturesBlock from "@/components/featuresBlock.vue";

definePageMeta({
  layout: "home",
});

const localePath = useLocalePath();
</script>

<template>
  <div class="container pt-8 pb-5">
    <div class="flex flex-col justify-between lg:flex-row">
      <div class="flex-1 pr-0 pb-16 lg:pb-0 lg:pr-20">
        <h2 class="pb-16 text-zinc-600 dark:text-zinc-300">{{ $t('content.home.intro_slogan_1') }}.<br />{{ $t('content.home.intro_slogan_2') }}<span class="block py-3 sm:inline sm:py-0 sm:px-2">🔥🚀😏</span></h2>
        <p>{{ $t('content.home.intro_block_1') }}<br />{{ $t('content.home.intro_block_2') }}</p>
        <p>{{ $t('content.home.intro_block_3') }}</p>
        <p class="font-semibold">{{ $t('content.home.intro_block_4') }}</p>
      </div>
      <a
        href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator"
        target="_blank"
        rel="noopener"
        class="hidden self-center drop-shadow-light-md dark:block md:self-start"
        ><img src="/assets/img/ph-badge-dark.svg" alt="Product of the Day | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54"
      /></a>
      <a href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator" target="_blank" rel="noopener" class="block self-center drop-shadow dark:hidden md:self-start"
        ><img src="/assets/img/ph-badge-light.svg" alt="Product of the Day | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54"
      /></a>
    </div>
  </div>

  <div class="mt-20 bg-gradient-to-tr from-zinc-300 to-zinc-200 pt-12 pb-16 shadow-lg dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700 dark:shadow-xl">
    <div id="demo" class="container">
      <h2 class="pb-8"><BeakerIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />{{ $t('navigation.playground') }}</h2>
    </div>
    <ClientOnly>
      <LazyPlaygroundArea />
      <template #fallback>
        <PlaygroundAreaPlaceholder />
      </template>
    </ClientOnly>
    <div class="container hidden md:block">
      <div class="py-4 text-center text-sm italic text-zinc-400 dark:text-zinc-500">
        {{ $t('content.home.demoDisclaimer') }} <NuxtLink :to="localePath('configuration')">"{{ $t('labels.clickHere') }}"</NuxtLink>
      </div>
    </div>
  </div>

  <div class="h-14"></div>

  <div id="installation" class="container mt-12">
    <h2 class="pb-8"><WrenchScrewdriverIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />{{ $t('content.home.headline_installation') }}</h2>
    <IntegrationGuidesOverview />

    <h2 id="features" class="mt-20 pb-8"><AdjustmentsHorizontalIcon class="-mt-1 mr-3 inline-block h-6 w-6" aria-hidden="true" />{{ $t('content.home.headline_functionality') }}</h2>
    <div>{{ $t('content.home.functionality_intro') }}</div>
    <FeaturesBlock />

    <div class="mt-20 border-t border-zinc-300 py-14 text-center dark:border-zinc-700">
      <h3 class="pb-6">{{ $t('content.home.next') }}</h3>

      <div class="grid grid-cols-1 text-center md:grid-cols-2">
        <div class="py-6 sm:p-6 md:text-right">
          <NuxtLink class="button-primary w-full max-w-xs" :to="localePath('examples')">{{ $t('content.home.button_examples') }} <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" /></NuxtLink>
        </div>
        <div class="py-6 sm:p-6 md:text-left">
          <NuxtLink class="button-primary w-full max-w-xs" :to="localePath('configuration')">{{ $t('content.home.button_configure') }} <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" /></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
