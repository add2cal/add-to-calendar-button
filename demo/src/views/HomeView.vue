<script setup lang="ts">
import { RouterLink } from "vue-router";
import PlaygroundArea from "@/components/playground/PlaygroundArea.vue";
import { CalendarDaysIcon, WrenchScrewdriverIcon, BeakerIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div class="container max-w-screen-xl pt-6">
    <h2>
      <CalendarDaysIcon
        class="-mt-1 mr-3 inline-block h-6 w-6"
        aria-hidden="true"
      />Welcome to your next
    </h2>
    <h1 class="mb-6">Add to Calendar Button!</h1>
    <div class="flex flex-col justify-between lg:flex-row">
      <div class="pr-0 pb-16 lg:pb-0 lg:pr-20">
        <h3 class="pb-6 text-left opacity-50">
          The hustle-free JavaScript component, enabling people to add events to
          their calendars.
        </h3>
        <p>Intro...</p>
      </div>
      <a
        href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator"
        target="_blank"
        rel="noopener"
        class="hidden self-center dark:block md:self-start"
        ><img
          src="../../public/assets/img/ph-badge-dark.svg"
          alt="Product of the Day | Product Hunt"
          style="width: 250px; height: 54px;"
          width="250"
          height="54"
      /></a>
      <a
        href="https://www.producthunt.com/posts/add-to-calendar-button-generator?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-add&#0045;to&#0045;calendar&#0045;button&#0045;generator"
        target="_blank"
        rel="noopener"
        class="block self-center dark:hidden md:self-start"
        ><img
          src="../../public/assets/img/ph-badge-light.svg"
          alt="Product of the Day | Product Hunt"
          style="width: 250px; height: 54px;"
          width="250"
          height="54"
      /></a>
    </div>
  </div>

  <div
    id="demo"
    class="mt-20 bg-gradient-to-tr from-zinc-300 to-zinc-200 pt-12 pb-16 shadow-lg dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-700 dark:shadow-xl"
  >
    <div class="container">
      <h2 class="pb-6">
        <BeakerIcon
          class="-mt-1 mr-3 inline-block h-6 w-6"
          aria-hidden="true"
        />Playground
      </h2>
      <PlaygroundArea />
    </div>
  </div>

  <div id="installation" class="container max-w-screen-xl pt-6">
    <h2 class="pt-16 pb-6">
      <WrenchScrewdriverIcon
        class="-mt-1 mr-3 inline-block h-6 w-6"
        aria-hidden="true"
      />Bringing it to your Website
    </h2>

    <h2 id="features" class="pt-16 pb-6">
      <AdjustmentsHorizontalIcon
        class="-mt-1 mr-3 inline-block h-6 w-6"
        aria-hidden="true"
      />Functionality &amp; Setup
    </h2>
    <RouterLink
      class="button-primary m-auto"
      :to="{ name: 'advanced-use', params: { locale } }"
    >
      {{ t('navigation.advanced') }}
    </RouterLink>
    <RouterLink
      class="button-primary m-auto"
      :to="{ name: 'examples', params: { locale } }"
    >
      {{ t('navigation.examples') }}
    </RouterLink>
  </div>
</template>
