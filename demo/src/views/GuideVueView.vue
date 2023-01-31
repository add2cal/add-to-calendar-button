<script setup lang="ts">
import { watch } from 'vue';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const today = new Date();
const nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
let defaultLang = (function () {
  if (locale.value != 'en') {
    return '\n  language="' + locale.value + '"';
  }
  return '';
})();
watch(locale, value => {
  if (value != 'en') {
    defaultLang = '\n  language="' + locale.value + '"';
  } else {
    defaultLang = '';
  }
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ t('content.guide.vue.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ t('content.guide.step1') }}: {{ t('content.guide.step_npm') }}</h2>
        <p>{{ t('content.guide.install_npm') }}</p>
        <CodeBlock><pre>npm install add-to-calendar-button</pre></CodeBlock>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step2') }}: {{ t('content.guide.step_import') }}</h2>
        <p>{{ t('content.guide.import_npm') }}</p>
        <CodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step3') }}: {{ t('content.guide.vue.step_optimize') }}</h2>
        <p>
          {{ t('content.guide.vue.optimize_1') }}<br />
          {{ t('content.guide.vue.optimize_2') }}
        </p>
        <p>
          {{ t('content.guide.vue.config_1') }}<br />
          {{ t('content.guide.vue.config_2') }}
        </p>
        <p>
          {{ t('content.guide.vue.config_3') }}:
          <a href="https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue" target="_blank" rel="noopener" class="whitespace-nowrap">{{ t('labels.clickHere') }} <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>.
        </p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
// vite.config.js or vite.config.ts

compilerOptions: {
  isCustomElement: (tag) => tag.includes('-')
}</pre
          >
        </CodeBlock>
        <p>{{ t('content.guide.vue.config_4') }}<br />{{ t('content.guide.vue.config_5') }}</p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
// vite.config.js or vite.config.ts

compilerOptions: {
  isCustomElement: (tag) => tag.startsWith('add-')
}</pre
          >
        </CodeBlock>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step4') }}: {{ t('content.guide.step_use') }}</h2>
        <p>
          {{ t('content.guide.step_use_start') }}
        </p>
        <p class="font-semibold italic">{{ t('content.guide.step_use_simple') }}</p>
        <p>{{ t('content.guide.step_use_example') }}</p>
        <CodeBlock class="line-numbers">
          <pre>
&lt;add-to-calendar-button
  name="{{ t('demo_data.name_dummy') }}"
  options="'Apple','Google'"
  location="{{ t('demo_data.location') }}"
  startDate="{{ defaultDate }}"
  endDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ t('demo_data.default_timezone') }}"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;</pre
          >
        </CodeBlock>
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="vue" />
    </div>
  </div>
</template>
