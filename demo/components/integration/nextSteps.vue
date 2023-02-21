<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline';

const localePath = useLocalePath();
</script>

<template>
  <div class="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2">
    <p class="self-center text-center sm:text-left">{{ $t('content.guide.next.config') }}</p>
    <NuxtLink :to="localePath('configuration')" class="button-primary w-56 self-center justify-self-center">
      {{ $t('labels.startConfiguring') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </NuxtLink>
    <p class="self-center text-center sm:text-left">{{ $t('content.guide.next.examples') }}</p>
    <NuxtLink :to="localePath('examples')" class="button-secondary w-56 self-center justify-self-center">
      {{ $t('labels.exploreExamples') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </NuxtLink>
  </div>
</template>
