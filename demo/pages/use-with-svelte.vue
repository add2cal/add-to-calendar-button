<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import GuideSidebar from "@/components/integration/guideSidebar.vue";
const localePath = useLocalePath();
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { locale } = useI18n();

definePageMeta({
  title: 'navigation.use-with-svelte',
  description: 'meta.use-with-svelte.description',
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
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ $t('content.guide.svelte.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ $t('content.guide.step1') }}: {{ $t('content.guide.step_npm') }}</h2>
        <p>{{ $t('content.guide.install_npm') }}</p>
        <LazyCodeBlock language="shell"><pre>npm install add-to-calendar-button</pre></LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step2') }}: {{ $t('content.guide.step_import') }}</h2>
        <p>{{ $t('content.guide.import_npm') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step3') }}: {{ $t('content.guide.step_use') }}</h2>
        <p>
          {{ $t('content.guide.step_use_start') }}
        </p>
        <p class="font-semibold italic">{{ $t('content.guide.step_use_simple') }}</p>
        <p>{{ $t('content.guide.step_use_example') }}</p>
        <LazyCodeBlock>
          <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name_dummy') }}"
  options="'apple','google'"
  location="{{ $t('demo_data.location') }}"
  start-date="{{ defaultDate }}"
  end-date="{{ defaultDate }}"
  start-time="10:15"
  end-time="23:30"
  time-zone="{{ $t('demo_data.default_timezone') }}"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;</pre>
        </LazyCodeBlock>
        <p class="mt-10">
          {{ $t('content.guide.ssr_note') }}
          <NuxtLink :to="{path: localePath('advanced-use'), hash: '#case-12'}">{{ $t('content.advanced.12_long') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
        </p>
        <p>{{ $t('content.guide.ssr_example') }}</p>
        <LazyCodeBlock language="html">
          <pre>
&lt;!-- +page.svelte (SvelteKit, SSR enabled) --&gt;
&lt;script&gt;
  import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';
  import { onMount } from 'svelte';

  const ssrHtml = atcb_generate_ssr_html({
    name: 'Reminder to check the add-to-calendar-button demo',
    options: ['Apple', 'Google'],
    location: 'World Wide Web',
    startDate: '{{ defaultDate }}',
    endDate: '{{ defaultDate }}',
    startTime: '10:15',
    endTime: '23:30',
    timeZone: 'Europe/Berlin',
  });

  onMount(async () => {
    await import('add-to-calendar-button'); // client-side upgrade
  });
&lt;/script&gt;

{@html ssrHtml}</pre>
        </LazyCodeBlock>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="svelte" />
    </div>
  </div>
</template>
