<script setup lang="ts">
import "add-to-calendar-button";
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
        {{ t('navigation.configuration') }}
      </h1>
      <p>The following examples are demonstrating parts of the functionality.<br />We recommend you to play with the demo to experience all variations.</p>
      <p class="italic">On this page, all buttons have some shared parameters. Beside the base date sample, all have the default style, no endDate (defaults to the startDate), and adapt to the lightMode of the website.</p>
      <p>
        For more advanced expert cases, have a look at the <RouterLink :to="{ name: 'advanced-use', params: { locale } }">"{{ t('navigation.advanced-use') }}"</RouterLink> page.
      </p>
      <section id="1"></section>

      <div class="mt-14 grid grid-cols-1 gap-12 border-t border-zinc-300 pt-14 dark:border-zinc-700 sm:grid-cols-2">
        <p class="self-center text-center sm:text-left">Let's directly test most of the options at our playground!</p>
        <RouterLink class="button-primary w-56 self-center" v-if="locale=='en'" :to="{ name: 'home', hash: '#demo', params: { locale } }">
          {{ t('labels.startPlaying') }}
          <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </RouterLink>
        <RouterLink class="button-primary w-56 self-center" v-if="locale!='en'" :to="{ name: 'home-i18n', hash: '#demo', params: { locale } }">
          {{ t('labels.startPlaying') }}
          <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </RouterLink>
        <p class="self-center text-center sm:text-left">Or explore more specific examples.</p>
        <RouterLink class="button-secondary w-56 self-center" :to="{ name: 'examples', params: { locale } }">
          {{ t('labels.exploreExamples') }}
          <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </RouterLink>
        <p class="self-center text-center sm:text-left">For the edge cases, you can check the "danger zone".</p>
        <RouterLink class="button-secondary w-56 self-center" :to="{ name: 'advanced-use', params: { locale } }">
          {{ t('navigation.advanced-use') }}
          <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 h-96 pt-4">
        <a href="#1" class="my-4 block">#1: The usual</a>
        <a href="#2" class="my-4 block">#2: All-Day</a>
        <a href="#3" class="my-4 block">#3: Dynamic Dates</a>
        <a href="#4" class="my-4 block">#4: Recurrence</a>
        <a href="#5" class="my-4 block">#5: Multi-Date</a>
        <a href="#6" class="my-4 block">#6: Custom Labels</a>
        <a href="#7" class="my-4 block">#7: Inline</a>
        <a href="#8" class="my-4 block">#8: Single Type</a>
        <a href="#9" class="my-4 block">#9: Splitting</a>
      </div>
    </div>
  </div>
</template>
