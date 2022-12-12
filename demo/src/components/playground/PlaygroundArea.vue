<script setup lang="ts">
import { ref, watch } from 'vue';
import LightModeSwitch from "@/components/LightModeSwitch.vue";
import { EyeIcon, EyeSlashIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
import "add-to-calendar-button";
import CodeBlock from "@/components/CodeBlock.vue";
import DateAttrs from "@/components/playground/attrs/DateAttrs.vue";
import LayoutAttrs from "@/components/playground/attrs/LayoutAttrs.vue";
import { useI18n } from 'vue-i18n'
import { getDefaultAttrs, mapAttrsObject, attrsToHtmlString } from '@/utils/attrs';
import { set, LSKey } from '@/utils/localStorage';
import { getInitialAttrs } from '@/utils/attrs/default';
const { t } = useI18n();

const showCode = ref(false);

const data = ref(getInitialAttrs())

watch(data, () => {
  set(LSKey.ATTRS, data.value);
}, { deep: true });
</script>

<template>
  <div class="md:container">
    <div :class="[ !showCode ? 'rounded-none md:rounded-md' : 'rounded-none md:rounded-t-md' ]" class="grid grid-cols-1 border-2 border-x-0 border-zinc-400 shadow-lg dark:border-zinc-600 md:grid-cols-2 md:border-x-2 lg:grid-cols-3">
      <div id="mobile-input" class="border-b-2 flex justify-center border-zinc-400 bg-zinc-200 p-3 dark:border-zinc-600 dark:bg-zinc-800 md:hidden">
        <AdjustmentsHorizontalIcon class="block h-8 w-8 mr-14 cursor-pointer hover:text-secondary" />
        <LightModeSwitch class="self-center" />
      </div>
      <div id="date-input" :class="{ 'lg:rounded-bl-md-none rounded-bl-md': !showCode }" class="hidden rounded-tl-md bg-zinc-200 p-3 dark:bg-zinc-800 md:block">
        <div class="mb-4 text-sm font-semibold uppercase text-zinc-400 dark:text-zinc-600">
          {{ t('labels.dateInput') }}
        </div>
        <DateAttrs v-model="data.date" />
      </div>
      <div
        id="rendering"
        :class="{ 'rounded-bl-none md:rounded-br-md lg:rounded-br-none': !showCode }"
        class="row-span-2 flex justify-center rounded-tl-none border-0 border-zinc-400 bg-zinc-100 py-8 px-3 dark:border-zinc-600 dark:bg-zinc-900 md:rounded-tr-md md:border-l-2 lg:row-span-1 lg:rounded-tr-none"
      >
        <div class="sticky top-[30vh] h-auto py-10 md:h-[500px] md:py-0">
          <add-to-calendar-button v-bind="mapAttrsObject(data)" debug />
        </div>
      </div>
      <div id="style-input" :class="[ !showCode ? 'rounded-bl-md lg:rounded-r-md lg:rounded-bl-none' : 'rounded-none lg:rounded-tr-md' ]" class="hidden border-l-0 border-t-2 border-zinc-400 bg-zinc-200 p-3 dark:border-zinc-600 dark:bg-zinc-800 md:block lg:border-t-0 lg:border-l-2">
        <div class="mb-4 flex justify-between text-sm font-semibold uppercase text-zinc-400 dark:text-zinc-600">
          <span>{{ t('labels.layoutInput') }}</span>
          <LightModeSwitch />
        </div>
        <LayoutAttrs v-model="data.layout" />
      </div>
    </div>
    <div id="code-output" :class="[ !showCode ? 'mx-8 bg-zinc-300 dark:bg-zinc-800' : 'mx-2 bg-zinc-200 pb-0 dark:bg-zinc-800 md:mx-0' ]" class="rounded-b-md border-2 border-t-0 border-zinc-400 p-2 shadow-lg transition-all dark:border-zinc-600">
      <div class="cursor-pointer text-center text-sm font-semibold text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-secondary" @click="showCode = !showCode">
        <span :class="{ hidden: showCode }"><EyeIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.showCode') }}</span>
        <span :class="{ hidden: !showCode }"><EyeSlashIcon class="-mt-1 mr-2 inline-block h-5 w-5" aria-hidden="true" />{{ t('labels.hideCode') }}</span>
      </div>
      <div :class="{ hidden: !showCode }" class="m-2 mt-3">
        <CodeBlock class="line-numbers">
          {{ attrsToHtmlString(data) }}
        </CodeBlock>
      </div>
    </div>
  </div>
</template>
