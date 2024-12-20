<script setup lang="ts">
import GuideSidebar from "@/components/integration/guideSidebar.vue";
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { locale } = useI18n();

definePageMeta({
  title: 'navigation.use-with-astro',
  description: 'meta.use-with-astro.description',
});

const today = new Date();
const nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
let defaultLang = (function () {
  if (locale.value != 'en') {
    return '\n      language="' + locale.value + '"';
  }
  return '';
})();
watch(locale, value => {
  if (value != 'en') {
    defaultLang = '\n      language="' + locale.value + '"';
  } else {
    defaultLang = '';
  }
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ $t('content.guide.astro.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ $t('content.guide.step0') }}: {{ $t('content.guide.astro.step_pick_solution') }}</h2>
        <p>{{ $t('content.guide.astro.intro_1') }}</p>
        <p>{{ $t('content.guide.astro.intro_2') }}</p>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step1') }}: {{ $t('content.guide.astro.step_setup') }}</h2>
        <h3 class="mb-6">{{ $t('content.guide.astro.setup_1') }}</h3>
        <p>{{ $t('content.guide.astro.new_component') }}</p>
        <h3 class="mb-6 mt-20">{{ $t('content.guide.astro.setup_2') }}</h3>
        <p>{{ $t('content.guide.astro.npm_setup_1') }}</p>
        <LazyCodeBlock language="shell"><pre>npm install add-to-calendar-button-react</pre></LazyCodeBlock>
        <div class="mb-6 mt-10 font-bold">{{ $t('content.guide.astro.npm_setup_2') }}</div>
        <LazyCodeBlock language="js"><pre>import { AddToCalendarButton } from 'add-to-calendar-button-react';</pre></LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step2') }}: {{ $t('content.guide.astro.step_define') }}</h2>
        <p>
          {{ $t('content.guide.astro.define') }}
        </p>
        <LazyCodeBlock language="js">
          <pre>
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import type { AddToCalendarButtonType } from 'add-to-calendar-button-react';

export default function atcb(props: AddToCalendarButtonType) {
  return (
    &lt;AddToCalendarButton
      label={props.label}
      name="{{ $t('demo_data.name_dummy') }}"
      options="'Apple','Google'"
      location="{{ $t('demo_data.location') }}"
      startDate="{{ defaultDate }}"
      endDate="{{ defaultDate }}"
      startTime="10:15"
      endTime="23:30"
      timeZone="{{ $t('demo_data.default_timezone') }}"{{ defaultLang }}
      options="'Apple','Google','iCal','Outlook.com','Yahoo'"
    &gt;&lt;/AddToCalendarButton&gt;
  );
}</pre
          >
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step3') }}: {{ $t('content.guide.step_use') }}</h2>
        <p>{{ $t('content.guide.astro.use') }}</p>
        <p>{{ $t('content.guide.step_use_example') }}</p>
        <LazyCodeBlock>
          <pre>
---
import AddToCalendarButton from '../components/AddToCalendarButton.tsx';
import Layout from '../layouts/Layout.astro';
---
&lt;Layout&gt;
&lt;AddToCalendarButton client:only="react" label="Woohooo" /&gt;
&lt;/Layout&gt;</pre
          >
        </LazyCodeBlock>
        <p class="font-semibold italic">{{ $t('content.guide.step_use_simple') }}</p>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="astro" />
    </div>
  </div>
</template>
