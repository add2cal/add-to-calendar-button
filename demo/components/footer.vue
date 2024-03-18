<script setup lang="ts">
import { ArrowUpIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid';

import LanguageSwitcher from "@/components/languageSwitcher.vue";
import LightModeSwitch from "@/components/lightModeSwitch.vue";
import LightModeSwitchPlaceholder from "@/components/placeholders/lightModeSwitchPlaceholder.vue";

import Logo from "@/components/logos/logoMain.vue";
import LogoGithub from "@/components/logos/logoGithub.vue";
import LogoX from "@/components/logos/logoX.vue";
import LogoNpm from "@/components/logos/logoNpm.vue";

const localePath = useLocalePath();
const { locale } = useI18n();
</script>

<script lang="ts">
function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <div class="w-full bg-gradient-to-tr from-brand-blue-dark to-brand-blue text-white drop-shadow-2xl dark:drop-shadow-light-lg">
    <div class="container grid grid-cols-1 sm:grid-cols-2">
      <div class="mx-auto -mt-4 w-32 sm:mx-0 sm:w-48 md:w-64 lg:mx-auto lg:-mt-6 lg:w-80">
        <nuxt-img placeholder loading="lazy" sizes="128px sm:192px md:256px lg:320px" class="drop-shadow-xl" alt="Get blown away by the PRO offering" width="800" height="920" src="/assets/img/bomb.webp" />
      </div>
      <div class="flex flex-col items-center gap-8 pb-14 pt-10 md:pb-24 md:pt-16 lg:pb-24 lg:pt-20">
        <div>
          <h2 class="text-3xl drop-shadow-lg md:text-4xl lg:text-5xl">{{ $t('labels.discoverPro') }}</h2>
          <p class="mt-3 opacity-70 lg:mt-6">{{ $t('labels.discoverProDetails') }}</p>
        </div>
        <a target="_blank" rel="author" :href="'https://add-to-calendar-pro.com' + (locale !== 'en' ? '/' + locale : '')" class="button-primary-animated text-white">{{ $t('labels.learnMore') }}</a>
      </div>
    </div>
  </div>
  <div class="max-w-full bg-gradient-to-t from-zinc-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-900">
    <div class="container">
      <div class="mx-6 pb-16 pt-12 md:m-auto md:pt-16">
        <div class="flex flex-col-reverse items-center sm:flex-row sm:justify-between">
          <div class="hidden w-auto max-w-[200px] sm:block">
            <NuxtLink :to="localePath('index')">
              <Logo variation="footer" />
            </NuxtLink>
          </div>
          <div class="flex">
            <div role="button" class="mr-8 hidden cursor-pointer self-center opacity-40 hover:pb-2 hover:opacity-100 md:inline-block" :aria-label="$t('labels.toTop')" @click="topFunction()">
              <ArrowUpIcon class="h-6 w-6" aria-hidden="true" />
            </div>
            <div class="inline-block"><LanguageSwitcher /></div>
          </div>
        </div>
        <hr class="mb-4 mt-6 border-gray-300 dark:border-zinc-700" />
        <div class="flex flex-col-reverse text-xs sm:flex-row sm:justify-between">
          <div class="px-1 pb-2 pt-10 text-center text-sm sm:pt-1 sm:text-left sm:text-xs">
            <NuxtLink :to="localePath('legal-notice')">{{ $t('navigation.legal-notice') }}</NuxtLink>
            |
            <NuxtLink :to="localePath('privacy-policy')">{{ $t('navigation.privacy-policy') }}</NuxtLink>
            <span class="inline sm:hidden md:inline"> | </span>
            <span class="inline whitespace-nowrap pt-0 sm:block sm:pt-2 md:inline md:pt-0">
              <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt" class="inline-block p-1 sm:p-0" target="_blank" rel="license">
                {{ $t('navigation.license') }}
                <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" />
              </a>
              |
              <a href="https://github.com/add2cal/add-to-calendar-button/discussions" class="inline-block p-1 sm:p-0" target="_blank" rel="help">
                {{ $t('navigation.help') }}
                <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" />
              </a>
            </span>
            <div class="mt-6 text-xs sm:mt-5 md:mt-3">
              <span class="font-semibold text-zinc-500 dark:text-zinc-400"> &copy; {{new Date().getFullYear()}} </span>
              <span class="lowercase text-zinc-400 dark:text-zinc-500"> , Current Version: 2.6.8 </span>
            </div>
          </div>
          <div class="hidden self-center sm:block">
            <ClientOnly>
              <LightModeSwitch />
              <template #fallback>
                <LightModeSwitchPlaceholder />
              </template>
            </ClientOnly>
          </div>
          <div class="flex justify-center space-x-6 pt-3 sm:pt-0">
            <a class="footer-icon-base w-9 hover:text-primary dark:hover:text-primary" target="_blank" rel="noopener" href="https://github.com/add2cal/add-to-calendar-button"><LogoGithub /></a>
            <a class="footer-icon-base w-8 hover:text-primary dark:hover:text-primary" target="_blank" rel="noopener" href="https://x.com/add2calendar"><LogoX /></a>
            <a class="footer-icon-base w-12  hover:text-npm dark:hover:text-npm" target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button"><LogoNpm /></a>
          </div>
        </div>
        <div role="button" class="mx-auto flex w-fit cursor-pointer justify-center pt-10 opacity-40 hover:-mt-2 hover:pb-2 hover:opacity-100 md:hidden" :aria-label="$t('labels.toTop')" @click="topFunction()"><ArrowUpIcon class="h-6 w-6" aria-hidden="true" /></div>
      </div>
    </div>
  </div>
</template>

<style>
.footer-icon-base {
  @apply self-center p-1 text-zinc-700 dark:text-zinc-300;
}
</style>
