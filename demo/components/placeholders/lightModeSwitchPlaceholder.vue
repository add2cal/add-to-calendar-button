<script setup lang="ts">
import { Switch } from '@headlessui/vue';
import { SunIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <Switch class="relative inline-flex h-[24px] w-[40px] cursor-progress items-center rounded-full border border-zinc-300 bg-zinc-200 shadow dark:border-zinc-500 dark:bg-zinc-700">
    <span class="sr-only">{{ $t('labels.enableDarkMode') }}</span>
    <span class="ml-[1px] inline-block h-[19px] w-[19px] rounded-full bg-white text-zinc-900 shadow-md dark:bg-zinc-900 dark:text-white">
      <SunIcon class="m-[2px]" />
    </span>
  </Switch>
</template>
