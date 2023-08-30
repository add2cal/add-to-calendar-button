<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CodeBlock from "@/components/codeBlock.vue";
import NextSteps from "@/components/integration/nextSteps.vue";
import GuideSidebar from "@/components/integration/guideSidebar.vue";
const { locale } = useI18n();

definePageMeta({
  title: 'navigation.use-with-angular',
  description: 'meta.use-with-angular.description',
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
      <h1 class="decoration-primary-light dark:decoration-primary-dark mb-16 underline decoration-4">{{ $t('content.guide.angular.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">{{ $t('content.guide.step1') }}: {{ $t('content.guide.step_npm') }}</h2>
        <p>{{ $t('content.guide.install_npm') }}</p>
        <LazyCodeBlock><pre>npm install add-to-calendar-button</pre></LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step2') }}: {{ $t('content.guide.step_import') }}</h2>
        <p>{{ $t('content.guide.import_npm') }}</p>
        <LazyCodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step3') }}: {{ $t('content.guide.angular.step_optimize') }}</h2>
        <p>{{ $t('content.guide.angular.config_1') }}<span class="font-semibold italic">CUSTOM_ELEMENTS_SCHEMA</span>{{ $t('content.guide.angular.config_2') }}<span class="font-semibold italic">@NgModule</span>{{ $t('content.guide.angular.config_3') }}.</p>
        <LazyCodeBlock language="javascript" class="line-numbers">
          <pre>
// app.module.ts

import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
//(...)

@NgModule({
  //(...),
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
//(...)</pre
          >
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.step4') }}: {{ $t('content.guide.step_use') }}</h2>
        <p>
          {{ $t('content.guide.step_use_start') }}
        </p>
        <p class="font-semibold italic">{{ $t('content.guide.step_use_simple') }}</p>
        <p>{{ $t('content.guide.step_use_example') }}</p>
        <LazyCodeBlock class="line-numbers">
          <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name_dummy') }}"
  options="'Apple','Google'"
  location="{{ $t('demo_data.location') }}"
  startDate="{{ defaultDate }}"
  endDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;</pre
          >
        </LazyCodeBlock>
        <h2 class="mb-6 mt-20">{{ $t('content.guide.angular.binding_headline') }}</h2>
        <p>{{ $t('content.guide.angular.binding_guide_1') }}</p>
        <p>{{ $t('content.guide.angular.binding_guide_2') }}</p>
        <LazyCodeBlock class="line-numbers">
          <pre>
&lt;add-to-calendar-button
  [attr.name]="titleVar"
  options="'Apple','Google'"
  [attr.startDate]="dateVar"
&gt;&lt;/add-to-calendar-button&gt;</pre
          >
        </LazyCodeBlock>
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="angular" />
    </div>
  </div>
</template>
