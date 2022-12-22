<script setup lang="ts">
import "add-to-calendar-button";
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div>
    <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
      {{ t('navigation.configuration') }}
    </h1>
    <p>The following list holds all potential attributes to set up and customize your next Add to Calendar Button.</p>
    <p class="italic">Check the Demo to play with most of them and explore the examples pages for more extensive descriptions for specific cases.</p>

    <div class="my-8 grid grid-cols-3 border border-zinc-500">
      <!-- Header -->
      <div class="border-r border-b border-zinc-500 bg-zinc-200 p-3 font-semibold">Name/Key</div>
      <div class="border-r border-b border-zinc-500 bg-zinc-200 p-3 font-semibold">Value</div>
      <div class="border-b border-zinc-500 bg-zinc-200 p-3 font-semibold">Details</div>

      <!-- Content -->
      <div class="border-r border-zinc-500 p-3">name</div>
      <div class="border-r border-zinc-500 p-3">_string_<br /><br />Required!</div>
      <div class="p-3">
        The name of your event. Should be a rather short string. In case you set the "dates" attribute (multi-date), the name is still required. It then acts as fallback and name for the event series. In the subscription case, the name would be used as calendar name for Microsoft services.
      </div>
    </div>

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
</template>
