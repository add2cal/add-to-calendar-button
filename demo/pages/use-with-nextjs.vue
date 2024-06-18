<script setup lang="ts">
import GuideSidebar from "@/components/integration/guideSidebar.vue";
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { locale } = useI18n();

definePageMeta({
  title: 'navigation.use-with-react',
  description: 'meta.use-with-react.description',
});

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
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ $t('content.guide.nextjs.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ $t('content.guide.step1') }}: {{ $t('content.guide.step_npm') }}</h2>
        <p>
          {{ $t('content.guide.nextjs.intro_1') }}
          <a href="https://github.com/add2cal/add-to-calendar-button-react" target="_blank">{{ $t('content.guide.nextjs.intro_2') }}</a>
          {{ $t('content.guide.nextjs.intro_3') }}
        </p>
        <p>{{ $t('content.guide.nextjs.intro_4') }}</p>
        <LazyCodeBlock language="shell"><pre>npm install add-to-calendar-button-react</pre></LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step2') }}: {{ $t('content.guide.step_import') }}</h2>
        <p>{{ $t('content.guide.import_npm') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>import { AddToCalendarButton } from 'add-to-calendar-button-react';</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step3') }}: {{ $t('content.guide.step_use') }}</h2>
        <p>
          {{ $t('content.guide.nextjs.start_wrapper') }}
        </p>
        <p class="font-semibold italic">{{ $t('content.guide.step_use_simple') }}</p>
        <p>{{ $t('content.guide.step_use_example') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>
&lt;AddToCalendarButton
  name="{{ $t('demo_data.name_dummy') }}"
  options={['Apple','Google']}
  location="{{ $t('demo_data.location') }}"
  startDate="{{ defaultDate }}"
  endDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"{{ defaultLang }}
&gt;&lt;/AddToCalendarButton&gt;</pre
          >
        </LazyCodeBlock>
        <p class="mb-10 font-semibold">{{ $t('content.guide.step_use_client') }}</p>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="nextjs" />
    </div>
  </div>
</template>
