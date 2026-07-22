<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import GuideSidebar from "@/components/integration/guideSidebar.vue";
const localePath = useLocalePath();
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));

definePageMeta({
  title: 'navigation.use-with-astro',
  description: 'meta.use-with-astro.description',
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
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step1') }}: {{ $t('content.guide.astro.npm_setup_1') }}</h2>
        <p>{{ $t('content.guide.astro.npm_setup_2') }}</p>
        <LazyCodeBlock language="shell"><pre>npm install add-to-calendar-button</pre></LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step2') }}: {{ $t('content.guide.astro.setup_1') }}</h2>
        <p>{{ $t('content.guide.astro.new_component') }}</p>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step3') }}: {{ $t('content.guide.astro.step_define') }}</h2>
        <p>{{ $t('content.guide.astro.define') }}</p>
        <LazyCodeBlock language="js">
          <pre>
import type { AddToCalendarButtonType } from 'add-to-calendar-button';

interface Props {
  prokey: AddToCalendarButtonType['proKey'];
}

const { prokey } = Astro.props as Props;</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.astro.setup_2') }}</h2>
        <p>{{ $t('content.guide.astro.add_block') }}</p>
        <LazyCodeBlock language="html">
          <pre>&lt;add-to-calendar-button prokey={prokey} /&gt;</pre>
        </LazyCodeBlock>
        <p>{{ $t('content.guide.astro.add_script') }}</p>
        <LazyCodeBlock language="html">
          <pre>
&lt;script&gt;
  import 'add-to-calendar-button';
&lt;/script&gt;</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step4') }}: {{ $t('content.guide.step_use') }}</h2>
        <p>{{ $t('content.guide.astro.use') }}</p>
        <p>{{ $t('content.guide.step_use_example') }}</p>
        <LazyCodeBlock language="html">
          <pre>
---
import AddToCalendarButton from '../components/add-to-calendar.astro';
import Layout from '../layouts/Layout.astro';
---
&lt;Layout&gt;
  &lt;AddToCalendarButton prokey="prokey-of-your-event" /&gt;
&lt;/Layout&gt;</pre>
        </LazyCodeBlock>
        <p class="font-semibold italic">{{ $t('content.guide.step_use_simple') }}</p>
        <p class="mb-10">
          {{ $t('content.guide.ssr_note') }}
          <NuxtLink :to="{path: localePath('advanced-use'), hash: '#case-12'}">{{ $t('content.advanced.12_long') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
        </p>
        <p>{{ $t('content.guide.ssr_example') }}</p>
        <LazyCodeBlock language="html">
          <pre>
---
// add-to-calendar.astro
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';

const html = atcb_generate_ssr_html({
  name: 'Reminder to check the add-to-calendar-button demo',
  options: ['Apple', 'Google'],
  location: 'World Wide Web',
  startDate: '2050-06-15',
  startTime: '10:15',
  endTime: '23:30',
  timeZone: 'Europe/Berlin',
});
---
&lt;Fragment set:html={html} /&gt;
&lt;script&gt;
  import 'add-to-calendar-button'; // client-side upgrade
&lt;/script&gt;</pre>
        </LazyCodeBlock>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="astro" />
    </div>
  </div>
</template>
