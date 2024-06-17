<script setup lang="ts">
import LightModeSwitch from "@/components/lightModeSwitch.vue";
import { EyeIcon, EyeSlashIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import "add-to-calendar-button";
import DateAttrsPlaceholder from "@/components/placeholders/playgroundDateAttrsPlaceholder.vue";
import LayoutAttrsPlaceholder from "@/components/placeholders/playgroundLayoutAttrsPlaceholder.vue";
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { t } = useI18n();

const showCode = ref(false);
</script>

<template>
  <div class="md:container">
    <div :class="[ !showCode ? 'rounded-none md:rounded-md' : 'rounded-none md:rounded-t-md' ]" class="grid grid-cols-1 border-b-2 border-zinc-400 shadow-lg dark:border-zinc-600 md:grid-cols-2 md:border-2 lg:grid-cols-3">
      <div id="mobile-input" class="flex justify-center bg-gradient-to-tr from-primary-dark to-primary-light p-3 dark:to-primary md:hidden">
        <AdjustmentsHorizontalIcon class="mr-14 block h-8 w-8 cursor-progress text-zinc-300" />
        <LightModeSwitch class="self-center" />
      </div>
      <div id="date-input" :class="{ 'lg:rounded-bl-md-none rounded-bl-md': !showCode }" class="hidden rounded-tl-md bg-zinc-200 p-3 dark:bg-zinc-800 md:block">
        <div class="mb-4 text-sm font-semibold uppercase text-zinc-800 dark:text-zinc-200">
          {{ t('labels.dateInput') }}
        </div>
        <DateAttrsPlaceholder />
      </div>
      <div
        id="rendering"
        :class="{ 'rounded-bl-none md:rounded-br-md lg:rounded-br-none': !showCode }"
        class="grid-bg row-span-2 flex justify-center rounded-tl-none border-0 border-zinc-400 bg-zinc-100 px-3 py-8 dark:border-zinc-600 dark:bg-zinc-900 md:rounded-tr-md md:border-l-2 lg:row-span-1 lg:rounded-tr-none"
      >
        <div class="sticky top-[30vh] z-30 h-auto py-10 md:h-[500px] md:py-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="mx-auto h-16 w-16 animate-spin text-primary">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <div id="style-input" :class="[ !showCode ? 'rounded-bl-md lg:rounded-r-md lg:rounded-bl-none' : 'rounded-none lg:rounded-tr-md' ]" class="hidden border-l-0 border-t-2 border-zinc-400 bg-zinc-200 p-3 dark:border-zinc-600 dark:bg-zinc-800 md:block lg:border-l-2 lg:border-t-0">
        <div class="mb-4 flex justify-between text-sm font-semibold uppercase text-zinc-800 dark:text-zinc-200">
          <span>{{ t('labels.layoutInput') }}</span>
          <LightModeSwitch />
        </div>
        <LayoutAttrsPlaceholder />
      </div>
    </div>
    <div id="code-output" :class="[ !showCode ? 'mx-8 bg-zinc-300 dark:bg-zinc-800' : 'mx-2 bg-zinc-200 pb-0 dark:bg-zinc-800 md:mx-0' ]" class="rounded-b-md border-2 border-t-0 border-zinc-400 p-2 shadow-lg transition-all dark:border-zinc-600">
      <div class="cursor-pointer text-center text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-secondary" @click="showCode = !showCode">
        <span :class="{ hidden: showCode }"><EyeIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.showCode') }}</span>
        <span :class="{ hidden: !showCode }"><EyeSlashIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.hideCode') }}</span>
      </div>
      <div :class="{ hidden: !showCode }" class="m-2 mt-3">
        <LazyCodeBlock>...</LazyCodeBlock>
      </div>
    </div>
  </div>
</template>
