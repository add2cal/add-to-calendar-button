<script setup lang="ts">
const { locale } = useI18n();
</script>

<template>
  <div class="mb-16 mt-20 w-full rounded-xl bg-gradient-to-tr from-brand-blue-dark to-brand-blue text-white drop-shadow-xl hover:drop-shadow-2xl dark:drop-shadow-light-lg dark:hover:drop-shadow-light-xl">
    <div class="container grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2">
      <div class="mx-auto -mt-10 w-28 sm:ml-2 sm:mt-6 md:-mt-10 md:w-52 lg:-mt-12 lg:ml-6 lg:w-64 xl:ml-10">
        <nuxt-img loading="lazy" sizes="112px md:208px lg:256px" class="drop-shadow-xl" alt="Get blown away by the PRO offering" width="800" height="821" src="/assets/img/gift.webp" />
      </div>
      <div class="flex flex-col items-center gap-8 pb-12 pt-8 sm:col-span-2 sm:pb-8 md:col-span-1 md:pb-12 md:pt-10 lg:pb-16 lg:pt-14">
        <h3 class="text-center drop-shadow-lg">{{ $t('labels.discoverProDetails_short') }}</h3>
        <a target="_blank" rel="author" :href="'https://add-to-calendar-pro.com' + (locale !== 'en' ? '/' + locale : '')" class="button-primary-animated text-white">{{ $t('labels.discoverPro') }}</a>
      </div>
    </div>
  </div>
</template>
