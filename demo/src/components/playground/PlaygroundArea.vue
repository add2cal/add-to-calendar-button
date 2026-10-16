<script setup lang="ts">
import { AdjustmentsHorizontalIcon, ArrowTopRightOnSquareIcon, CheckIcon, ClipboardDocumentIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import 'add-to-calendar-button/styles/all';
import 'add-to-calendar-button/i18n/all';
import 'add-to-calendar-button';
import { trackAnalyticsEvent } from '../../utils/analytics';
import { type Attrs } from '../../models/attrs';
import { attrsToHtmlString, mapAttrsObject } from '../../utils/playground/attrs';
import { getDefaultAttrs, getInitialAttrs, saveAttrs } from '../../utils/playground/default';
import { providePlaygroundI18n, type PlaygroundLocale } from '../../utils/playground/i18n';
import DateAttrs from './attrs/DateAttrs.vue';
import LayoutAttrs from './attrs/LayoutAttrs.vue';
import ThemeSwitch from './ThemeSwitch.vue';

const props = withDefaults(defineProps<{ locale?: PlaygroundLocale; themeSwitchLabel?: string }>(), { locale: 'en', themeSwitchLabel: '' });
const t = providePlaygroundI18n(props.locale);
const data = ref<Attrs>(getDefaultAttrs(t('defaults.name'), t('defaults.description'), t('defaults.location'), props.locale));
const renderButton = ref(false);
const loaded = ref(false);
const showCode = ref(false);
const showMobileConfig = ref(false);
const settingsDialog = ref<HTMLDialogElement>();
const copied = ref(false);
const trackedDemoActions = new Set<string>();
const buttonAttrs = computed(() => mapAttrsObject(data.value));
const markup = computed(() => attrsToHtmlString(data.value));
const buttonTop = computed(() => {
  if (data.value.layout.IS_BUTTONS_LIST) return '70px';
  if (data.value.layout.LIST_STYLE === 'dropup-static') return '60%';
  if (data.value.layout.LIST_STYLE === 'overlay') return '40%';
  return '70px';
});

onMounted(async () => {
  data.value = getInitialAttrs(t('defaults.name'), t('defaults.description'), t('defaults.location'), props.locale);
  renderButton.value = true;
  await nextTick();
  loaded.value = true;
});

watch(
  data,
  (value) => {
    if (renderButton.value) saveAttrs(value);
    if (loaded.value) trackDemoUse('configure');
  },
  { deep: true },
);
watch(showMobileConfig, async (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : '';
  await nextTick();
  if (open && !settingsDialog.value?.open) settingsDialog.value?.showModal();
  else if (!open && settingsDialog.value?.open) settingsDialog.value.close();
});
onBeforeUnmount(() => {
  document.documentElement.style.overflow = '';
  settingsDialog.value?.close();
});

async function copyCode() {
  await navigator.clipboard.writeText(markup.value);
  trackDemoUse('copy_code');
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1600);
}

function trackDemoUse(action: 'configure' | 'preview' | 'show_code' | 'copy_code') {
  if (trackedDemoActions.has(action)) return;
  trackedDemoActions.add(action);
  trackAnalyticsEvent('demo_used', { surface: 'playground', action });
}

function toggleCode() {
  showCode.value = !showCode.value;
  if (showCode.value) trackDemoUse('show_code');
}
</script>

<template>
  <div class="select-none md:container">
    <div :class="!showCode ? 'rounded-none md:rounded-md' : 'rounded-none md:rounded-t-md'" class="grid grid-cols-1 border-b-2 border-zinc-400 shadow-lg md:grid-cols-2 md:border-2 lg:grid-cols-3 dark:border-zinc-600">
      <div id="mobile-input" class="from-primary-dark to-primary-light dark:to-primary flex justify-center bg-linear-to-tr p-3 md:hidden">
        <button type="button" :aria-label="t('labels.layoutInput')" class="btn-control mr-14" @click="showMobileConfig = !showMobileConfig"><AdjustmentsHorizontalIcon class="hover:text-secondary block h-8 w-8 text-white" /></button>
        <ThemeSwitch class="self-center" :label="props.themeSwitchLabel" />
      </div>
      <div id="date-input" :class="{ 'rounded-bl-md lg:rounded-bl-none': !showCode }" class="hidden rounded-tl-md bg-zinc-200 p-3 md:block dark:bg-zinc-800">
        <div class="mb-4 text-sm font-semibold text-zinc-800 uppercase dark:text-zinc-200">{{ t('labels.dateInput') }}</div>
        <DateAttrs v-model="data.date" :disabled="!loaded" />
      </div>
      <div id="rendering" :class="{ 'rounded-bl-none md:rounded-br-md lg:rounded-br-none': !showCode }" class="grid-bg row-span-2 flex justify-center rounded-tl-none border-0 border-zinc-400 bg-zinc-100 px-3 py-8 md:rounded-tr-md md:border-l-2 lg:row-span-1 lg:rounded-tr-none dark:border-zinc-600 dark:bg-zinc-900" @click.capture="trackDemoUse('preview')">
        <div class="sticky z-30 h-fit min-h-50 w-fit p-8 transition-all" :style="{ top: buttonTop }">
          <component :is="'add-to-calendar-button'" v-if="renderButton" v-bind="buttonAttrs" debug hide-rich-data hide-branding />
        </div>
      </div>
      <div id="style-input" :class="!showCode ? 'rounded-bl-md lg:rounded-r-md lg:rounded-bl-none' : 'rounded-none lg:rounded-tr-md'" class="hidden border-t-2 border-l-0 border-zinc-400 bg-zinc-200 p-3 md:block lg:border-t-0 lg:border-l-2 dark:border-zinc-600 dark:bg-zinc-800">
        <div class="mb-4 flex justify-between text-sm font-semibold text-zinc-800 uppercase dark:text-zinc-200">
          <span>{{ t('labels.layoutInput') }}</span>
          <ThemeSwitch :label="props.themeSwitchLabel" />
        </div>
        <LayoutAttrs v-model="data.layout" :disabled="!loaded" />
        <div class="mx-auto mt-8 mb-5 text-center text-xs">
          {{ t('labels.proConfig') }}
          <a class="mt-1 block" target="_blank" rel="author" :href="`https://add-to-calendar-pro.com${props.locale !== 'en' ? `/${props.locale}` : ''}`">{{ t('labels.discoverPro') }} <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>
        </div>
      </div>
    </div>
    <div id="code-output" :class="!showCode ? 'mx-8 bg-zinc-300 dark:bg-zinc-800' : 'mx-2 bg-zinc-200 pb-0 md:mx-0 dark:bg-zinc-800'" class="rounded-b-md border-2 border-t-0 border-zinc-400 p-2 shadow-lg transition-all dark:border-zinc-600">
      <button type="button" class="btn-control dark:hover:text-secondary block w-full text-center text-sm font-semibold text-zinc-600 hover:text-black dark:text-zinc-400" @click="toggleCode">
        <span v-if="!showCode"><EyeIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.showCode') }}</span>
        <span v-else><EyeSlashIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.hideCode') }}</span>
      </button>
      <figure v-if="showCode && loaded" class="playground-code relative m-2 mt-3 overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 shadow-lg">
        <figcaption class="border-b border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 uppercase">HTML</figcaption>
        <button type="button" class="btn-control hover:bg-primary absolute top-1.5 right-2 z-10 flex items-center rounded px-2 py-1 text-xs text-white" @click="copyCode"><ClipboardDocumentIcon class="mr-1 inline h-4 w-4" aria-hidden="true" />{{ copied ? t('labels.copied') : t('labels.copyCode') }}</button>
        <pre class="overflow-x-auto p-5 text-sm leading-6 text-zinc-100"><code>{{ markup }}</code></pre>
      </figure>
    </div>
  </div>
  <dialog ref="settingsDialog" class="m-0 h-dvh max-h-none w-dvw max-w-none overflow-x-hidden overflow-y-auto border-0 bg-zinc-200 p-0 backdrop:bg-black/40 lg:hidden dark:bg-zinc-800" :aria-label="t('labels.layoutInput')" @close="showMobileConfig = false">
    <div class="grid grid-cols-1 gap-10 pb-24">
      <div class="bg-zinc-500 p-4 font-semibold text-zinc-100 uppercase dark:bg-zinc-700 dark:text-zinc-400">{{ t('labels.dateInput') }}</div>
      <div class="px-8 text-left"><DateAttrs v-model="data.date" mobile /></div>
      <div class="bg-zinc-500 p-4 font-semibold text-zinc-100 uppercase dark:bg-zinc-700 dark:text-zinc-400">{{ t('labels.layoutInput') }}</div>
      <div class="px-8 text-left"><LayoutAttrs v-model="data.layout" /></div>
    </div>
    <button type="button" class="btn-control bg-secondary hover:bg-secondary-light sticky bottom-0 left-0 z-50 flex h-20 w-full justify-center text-lg font-semibold text-zinc-700 hover:text-black" @click="showMobileConfig = false">
      <span class="self-center"><CheckIcon class="-mt-1.5 mr-2 inline-block h-7 w-7" aria-hidden="true" />{{ t('labels.apply') }}</span>
    </button>
  </dialog>
</template>

<style scoped>
.grid-bg {
  background-image: linear-gradient(rgb(113 113 122 / 13%) 1px, transparent 1px), linear-gradient(90deg, rgb(113 113 122 / 13%) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
