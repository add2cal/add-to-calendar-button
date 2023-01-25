<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
</script>

<template>
  <div class="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2">
    <p class="self-center text-center sm:text-left">{{ t('content.guide.next.config') }}</p>
    <RouterLink class="button-primary w-56 self-center justify-self-center" :to="{ name: 'configuration', params: { locale } }">
      {{ t('labels.startConfiguring') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
    <p class="self-center text-center sm:text-left">{{ t('content.guide.next.examples') }}</p>
    <RouterLink class="button-secondary w-56 self-center justify-self-center" :to="{ name: 'examples', params: { locale } }">
      {{ t('labels.exploreExamples') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
  </div>
</template>
