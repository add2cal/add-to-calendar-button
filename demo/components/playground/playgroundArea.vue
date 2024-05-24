<script setup lang="ts">
import LightModeSwitch from "@/components/lightModeSwitch.vue";
import { EyeIcon, EyeSlashIcon, AdjustmentsHorizontalIcon, CheckIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import "add-to-calendar-button";
import DateAttrs from "@/components/playground/attrs/dateAttrs.vue";
import LayoutAttrs from "@/components/playground/attrs/layoutAttrs.vue";
import { mapAttrsObject, attrsToHtmlString } from '@/utils/attrs';
import { set, LSKey } from '@/utils/localStorage';
import { getInitialAttrs } from '@/utils/attrs/default';
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { t, locale } = useI18n();

const showCode = ref(false);

const data = ref(getInitialAttrs(t('defaults.name'), t('defaults.description'), t('defaults.location')))

watch(data, () => {
  set(LSKey.ATTRS, data.value);
}, { deep: true });

const showMC = ref(false);

// blocking page scrolling, if the mobile menu is open
watch(showMC, val => {
  if (val) {
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "auto";
  }
});
</script>

<template>
  <div class="md:container">
    <div :class="[ !showCode ? 'rounded-none md:rounded-md' : 'rounded-none md:rounded-t-md' ]" class="grid grid-cols-1 border-b-2 border-zinc-400 shadow-lg dark:border-zinc-600 md:grid-cols-2 md:border-2 lg:grid-cols-3">
      <div id="mobile-input" class="flex justify-center bg-gradient-to-tr from-primary-dark to-primary-light p-3 dark:to-primary md:hidden">
        <AdjustmentsHorizontalIcon class="mr-14 block h-8 w-8 cursor-pointer text-white hover:text-secondary" @click="(showMC = !showMC)" />
        <LightModeSwitch class="self-center" />
      </div>
      <div id="date-input" :class="{ 'lg:rounded-bl-md-none rounded-bl-md': !showCode }" class="hidden rounded-tl-md bg-zinc-200 p-3 dark:bg-zinc-800 md:block">
        <div class="mb-4 text-sm font-semibold uppercase text-zinc-800 dark:text-zinc-200">
          {{ t('labels.dateInput') }}
        </div>
        <DateAttrs v-model="data.date" />
      </div>
      <div
        id="rendering"
        :class="{ 'rounded-bl-none md:rounded-br-md lg:rounded-br-none': !showCode }"
        class="grid-bg row-span-2 flex justify-center rounded-tl-none border-0 border-zinc-400 bg-zinc-100 px-3 py-8 dark:border-zinc-600 dark:bg-zinc-900 md:rounded-tr-md md:border-l-2 lg:row-span-1 lg:rounded-tr-none"
      >
        <div class="sticky top-[30vh] z-30 h-auto py-10 md:h-[500px] md:py-0">
          <add-to-calendar-button v-bind="mapAttrsObject(data)" debug hideRichData hideBranding />
        </div>
      </div>
      <div id="style-input" :class="[ !showCode ? 'rounded-bl-md lg:rounded-r-md lg:rounded-bl-none' : 'rounded-none lg:rounded-tr-md' ]" class="hidden border-l-0 border-t-2 border-zinc-400 bg-zinc-200 p-3 dark:border-zinc-600 dark:bg-zinc-800 md:block lg:border-l-2 lg:border-t-0">
        <div class="mb-4 flex justify-between text-sm font-semibold uppercase text-zinc-800 dark:text-zinc-200">
          <span>{{ t('labels.layoutInput') }}</span>
          <LightModeSwitch />
        </div>
        <LayoutAttrs v-model="data.layout" />
        <div class="mx-auto mt-8 text-center text-xs">
          {{ t('labels.proConfig') }}
          <a class="mt-1 block" target="_blank" rel="author" :href="'https://add-to-calendar-pro.com' + (locale !== 'en' ? '/' + locale : '')">
            {{ t('labels.discoverPro') }}
            <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
    <div id="code-output" :class="[ !showCode ? 'mx-8 bg-zinc-300 dark:bg-zinc-800' : 'mx-2 bg-zinc-200 pb-0 dark:bg-zinc-800 md:mx-0' ]" class="rounded-b-md border-2 border-t-0 border-zinc-400 p-2 shadow-lg transition-all dark:border-zinc-600">
      <div class="cursor-pointer text-center text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-secondary" @click="showCode = !showCode">
        <span :class="{ hidden: showCode }"> <EyeIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.showCode') }} </span>
        <span :class="{ hidden: !showCode }"> <EyeSlashIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.hideCode') }} </span>
      </div>
      <div :class="{ hidden: !showCode }" class="m-2 mt-3">
        <LazyCodeBlock>{{ attrsToHtmlString(data) }}</LazyCodeBlock>
      </div>
    </div>
  </div>
  <!-- mobile config -->
  <nav :class="{ hidden: !showMC }" class="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden bg-zinc-200 dark:bg-zinc-800 lg:hidden">
    <div class="grid grid-cols-1 gap-10 pb-24">
      <div class="bg-zinc-500 p-4 font-semibold uppercase text-zinc-100 dark:bg-zinc-700 dark:text-zinc-400">
        {{ t('labels.dateInput') }}
      </div>
      <div class="px-8 text-left">
        <DateAttrs v-model="data.date" mobile />
      </div>
      <div class="bg-zinc-500 p-4 font-semibold uppercase text-zinc-100 dark:bg-zinc-700 dark:text-zinc-400">
        {{ t('labels.layoutInput') }}
      </div>
      <div class="px-8 text-left">
        <LayoutAttrs v-model="data.layout" mobile />
      </div>
    </div>
    <div class="sticky bottom-0 left-0 z-50 flex h-20 w-full cursor-pointer justify-center bg-secondary text-lg font-semibold text-zinc-700 hover:bg-secondary-light hover:text-black" @click="(showMC = !showMC)">
      <div class="flex self-center">
        <div>
          <CheckIcon class="-mt-1.5 mr-2 inline-block h-7 w-7" aria-hidden="true" />
          Apply
        </div>
      </div>
    </div>
  </nav>
</template>
