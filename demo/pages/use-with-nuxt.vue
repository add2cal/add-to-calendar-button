<script setup lang="ts">
import { ArrowRightIcon, ArrowTopRightOnSquareIcon  } from '@heroicons/vue/24/outline';
import GuideSidebar from "@/components/integration/guideSidebar.vue";
const localePath = useLocalePath();
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { locale } = useI18n();

definePageMeta({
  title: 'navigation.use-with-nuxt',
  description: 'meta.use-with-nuxt.description',
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
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ $t('content.guide.nuxt.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ $t('content.guide.step1') }}: {{ $t('content.guide.step_npm') }}</h2>
        <p>{{ $t('content.guide.install_npm') }}</p>
        <LazyCodeBlock language="shell"><pre>npm install add-to-calendar-button</pre></LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step2') }}: {{ $t('content.guide.step_import') }}</h2>
        <p>{{ $t('content.guide.import_npm') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step3') }}: {{ $t('content.guide.vue.step_optimize') }}</h2>
        <p>
          {{ $t('content.guide.vue.optimize_1') }}<br />
          {{ $t('content.guide.vue.optimize_2') }}
        </p>
        <p>
          {{ $t('content.guide.vue.config_1') }}<br />
          {{ $t('content.guide.vue.config_2') }}
        </p>
        <p>
          {{ $t('content.guide.vue.config_3') }}:
          <a href="https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue" target="_blank" rel="noopener" class="whitespace-nowrap">{{ $t('labels.clickHere') }} <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>.
        </p>
        <LazyCodeBlock language="javascript">
          <pre>
// vite.config.js or vite.config.ts

compilerOptions: {
  isCustomElement: (tag) => tag.includes('-')
}</pre>
        </LazyCodeBlock>
        <p>{{ $t('content.guide.vue.config_4') }}<br />{{ $t('content.guide.vue.config_5') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>
// vite.config.js or vite.config.ts

compilerOptions: {
  isCustomElement: (tag) => tag.startsWith('add-')
}</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step4') }}: {{ $t('content.guide.step_use') }}</h2>
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
        <h2 class="mb-6 mt-20">{{ $t('content.guide.styles_lang_headline') }}</h2>
        <p>{{ $t('content.guide.styles_lang_default') }}</p>
        <p class="pt-5">{{ $t('content.guide.styles_lang_ondemand') }}</p>
        <h3 class="mb-6 mt-12">{{ $t('content.guide.styles_lang_npm_heading') }}</h3>
        <p>{{ $t('content.guide.styles_lang_npm_body') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>
import 'add-to-calendar-button/styles/3d';   // any style besides "default"
import 'add-to-calendar-button/i18n/de';       // any language besides English</pre>
        </LazyCodeBlock>
        <p class="mt-10">{{ $t('content.guide.styles_lang_more') }}</p>
        <h2 class="mb-6 mt-20">Server Side Rendering (SSR)</h2>
        <p>
          {{ $t('content.guide.ssr_note') }}
          <NuxtLink :to="{path: localePath('advanced-use'), hash: '#case-12'}">{{ $t('content.advanced.12_long') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
        </p>
        <p>{{ $t('content.guide.ssr_example') }}</p>
        <LazyCodeBlock language="html">
          <pre>
&lt;!-- any .vue file in your Nuxt app --&gt;
&lt;script setup&gt;
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';

// hydrate the shell without re-parsing it: v-html would re-assign innerHTML
// during hydration, which does not parse declarative shadow DOM and would
// destroy the pre-rendered shadow root (visible flash + console warnings)
const vSsrHtml = {
  mounted(el, binding) {
    if (el.querySelector('add-to-calendar-button')) return; // already server-rendered
    el.innerHTML = binding.value;
  },
  getSSRProps: (binding) => ({ innerHTML: binding.value }),
};

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

// client-side upgrade of the shell into the full button
onMounted(() => import('add-to-calendar-button'));
&lt;/script&gt;

&lt;template&gt;
  &lt;div v-ssr-html="ssrHtml"&gt;&lt;/div&gt;
&lt;/template&gt;</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.nuxt.ssr_notes_headline') }}</h2>
        <ul class="ml-6 list-disc pb-4">
          <li class="pb-2">{{ $t('content.guide.nuxt.ssr_note_vhtml') }}</li>
          <li class="pb-2">{{ $t('content.guide.nuxt.ssr_note_server_only') }}</li>
          <li class="pb-2">{{ $t('content.guide.nuxt.ssr_note_client_import') }}</li>
          <li>{{ $t('content.guide.nuxt.ssr_note_attrs') }}</li>
        </ul>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="nuxt" />
    </div>
  </div>
</template>
