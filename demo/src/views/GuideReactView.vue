<script setup lang="ts">
import { watch } from 'vue';
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
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
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ t('content.guide.react.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ t('content.guide.step0') }}: {{ t('content.guide.react.step_pick') }}</h2>
        <p>{{ t('content.guide.react.pick_intro') }}</p>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">{{ t('content.guide.react.pick_option1') }}</li>
          <li class="mt-3 text-left">{{ t('content.guide.react.pick_option2') }}</li>
          <li class="mt-3 text-left">
            {{ t('content.guide.react.pick_option3_1') }}<a href="https://github.com/add2cal/add-to-calendar-button-react" target="_blank" rel="noopener">{{ t('content.guide.react.pick_option3_2') }} <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a
            >{{ t('content.guide.react.pick_option3_3') }}
          </li>
        </ul>
        <p class="pt-5">{{ t('content.guide.options_intro_1') }}</p>
        <p class="italic">{{ t('content.guide.options_intro_2') }}</p>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step1') }}: {{ t('content.guide.step_npm') }}</h2>
        <h3 class="mb-6">{{ t('content.guide.optionA') }}: Web Component</h3>
        <p>{{ t('content.guide.install_npm') }}</p>
        <CodeBlock><pre>npm install add-to-calendar-button</pre></CodeBlock>
        <h3 class="mt-12 mb-6">{{ t('content.guide.optionB') }}: React Wrapper</h3>
        <p>{{ t('content.guide.react.install_wrapper') }}</p>
        <CodeBlock>
          <pre>npm install add-to-calendar-button-react</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step2') }}: {{ t('content.guide.step_import') }}</h2>
        <h3 class="mb-6">{{ t('content.guide.optionA') }}: Web Component</h3>
        <p>{{ t('content.guide.import_npm') }}</p>
        <CodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </CodeBlock>
        <h3 class="mt-12 mb-6">{{ t('content.guide.optionB') }}: React Wrapper</h3>
        <p>{{ t('content.guide.react.import_wrapper') }}</p>
        <CodeBlock language="javascript">
          <pre>import { AddToCalendarButton } from 'add-to-calendar-button-react';</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step3') }}: {{ t('content.guide.react.step_optimize_ts') }}</h2>
        <p class="font-semibold">{{ t('content.guide.react.optimize_ts_1') }}</p>
        <p>{{ t('content.guide.react.optimize_ts_2') }}</p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
// global.d.ts

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['add-to-calendar-button']: CustomElement&lt;AddToCalendarButton&gt;;
    }
  }
}</pre
          >
        </CodeBlock>
        <h2 class="mt-20 mb-6">{{ t('content.guide.step4') }}: {{ t('content.guide.step_use') }}</h2>
        <h3 class="mb-6">{{ t('content.guide.optionA') }}: Web Component</h3>
        <p>
          {{ t('content.guide.step_use_start') }}
        </p>
        <p>{{ t('content.guide.step_use_example') }}</p>
        <CodeBlock class="line-numbers">
          <pre>
&lt;add-to-calendar-button
  name="{{ t('demo_data.name_dummy') }}"
  options="'Apple','Google'"
  location="{{ t('demo_data.location') }}"
  startDate="{{defaultDate}}"
  endDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ t('demo_data.default_timezone') }}"{{defaultLang}}
&gt;&lt;/add-to-calendar-button&gt;</pre
          >
        </CodeBlock>
        <h3 class="mt-12 mb-6">{{ t('content.guide.optionB') }}: React Wrapper</h3>
        <p>{{ t('content.guide.react.start_wrapper_1') }}</p>
        <p>{{ t('content.guide.react.start_wrapper_2') }}</p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
&lt;AddtoCalendarButton
  name="{{ t('demo_data.name_dummy') }}"
  options=['Apple','Google']
  location="{{ t('demo_data.location') }}"
  startDate="{{defaultDate}}"
  endDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ t('demo_data.default_timezone') }}"{{defaultLang}}
&gt;&lt;/AddtoCalendarButton&gt;</pre
          >
        </CodeBlock>
        <p class="font-semibold">{{ t('content.guide.react.start_wrapper_3') }}</p>
        <p>{{ t('content.guide.react.start_wrapper_4') }}<br />{{ t('content.guide.react.start_wrapper_5') }}</p>
        <h2 class="mt-24">{{ t('content.guide.next.headline') }}:</h2>
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="react" />
    </div>
  </div>
</template>
