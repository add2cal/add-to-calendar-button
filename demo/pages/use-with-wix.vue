<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid';
import GuideSidebar from "@/components/integration/guideSidebar.vue";

definePageMeta({
  title: 'navigation.use-with-wix',
  description: 'meta.use-with-wix.description',
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ $t('content.guide.wix.headline') }}</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <p>{{ $t('content.guide.wix.intro_1') }}</p>
        <p class="font-semibold">{{ $t('content.guide.wix.intro_2') }}</p>
        <p>{{ $t('content.guide.wix.intro_3') }}</p>
        <p>{{ $t('content.guide.wix.intro_4') }}</p>
        <a class="button-primary mx-auto mb-16 mt-10 !flex w-fit md:mx-0" href="https://www.wix.com/app-market/add-to-calendar-button" target="_blank">
          <span>{{ $t('content.guide.wix.link') }}</span>
          <ArrowTopRightOnSquareIcon class="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="wix" />
    </div>
  </div>
</template>
