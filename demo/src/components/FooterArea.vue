<script setup lang="ts">
import { RouterLink } from "vue-router";
import LightModeSwitch from "@/components/LightModeSwitch.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { ArrowUpIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid';
import Logo from "@/components/logos/LogoMain.vue";
import LogoGithub from "@/components/logos/LogoGithub.vue";
import LogoTwitter from "@/components/logos/LogoTwitter.vue";
import LogoNpm from "@/components/logos/LogoNpm.vue";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
</script>

<template>
  <div class="max-w-full bg-gradient-to-t from-zinc-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-900">
    <div class="container">
      <div class="mx-6 pt-12 pb-16 md:m-auto md:pt-16">
        <div class="flex flex-col-reverse items-center sm:flex-row sm:justify-between">
          <div class="hidden w-auto max-w-[200px] sm:block">
            <RouterLink v-if="locale=='en'" :to="{ name: 'home', params: { locale } }">
              <Logo variation="footer" />
            </RouterLink>
            <RouterLink v-else :to="{ name: 'home-i18n', params: { locale } }">
              <Logo variation="footer" />
            </RouterLink>
          </div>
          <div class="flex">
            <a href="#" class="mr-8 hidden self-center opacity-40 hover:pb-2 hover:opacity-100 md:inline-block" :aria-label="t('labels.toTop')"><ArrowUpIcon class="h-6 w-6" aria-hidden="true" /></a>
            <div class="inline-block"><LanguageSwitcher /></div>
          </div>
        </div>
        <hr class="mt-6 mb-4 border-gray-300 dark:border-zinc-700" />
        <div class="flex flex-col-reverse text-xs sm:flex-row sm:justify-between">
          <div class="px-1 pt-10 pb-2 text-center text-sm sm:pt-1 sm:text-left sm:text-xs">
            <RouterLink class="inline-block p-1 sm:p-0" :to="{ name: 'legal-notice', params: { locale } }">
              {{ t('navigation.legal-notice') }}
            </RouterLink>
            |
            <RouterLink class="inline-block p-1 sm:p-0" :to="{ name: 'privacy-policy', params: { locale } }">
              {{ t('navigation.privacy-policy') }}
            </RouterLink>
            <span class="inline sm:hidden md:inline"> | </span>
            <span class="inline whitespace-nowrap pt-0 sm:block sm:pt-2 md:inline md:pt-0">
              <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt" class="inline-block p-1 sm:p-0" target="_blank" rel="noopener">{{ t('navigation.license') }} <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>
              |
              <a href="https://github.com/add2cal/add-to-calendar-button/discussions" class="inline-block p-1 sm:p-0" target="_blank" rel="noopener">{{ t('navigation.help') }} <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>
            </span>
            <div class="mt-6 text-xs sm:mt-5 md:mt-3">
              <span class="font-semibold text-zinc-500 dark:text-zinc-400"> &copy; {{new Date().getFullYear()}} </span>
              <span class="lowercase text-zinc-400 dark:text-zinc-500"> , Current Version: 2.1.2 </span>
            </div>
          </div>
          <div class="hidden self-center sm:block"><LightModeSwitch /></div>
          <div class="flex justify-center space-x-6 pt-3 sm:pt-0">
            <a class="footer-icon-base w-9 hover:text-black dark:hover:text-white" target="_blank" rel="noopener" href="https://github.com/add2cal/add-to-calendar-button"><LogoGithub /></a>
            <a class="footer-icon-base w-9 hover:text-twitter dark:hover:text-twitter" target="_blank" rel="noopener" href="https://twitter.com/add2calendar"><LogoTwitter /></a>
            <a class="footer-icon-base w-12  hover:text-npm dark:hover:text-npm" target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button"><LogoNpm /></a>
          </div>
        </div>
        <a href="#" class="mx-auto flex w-fit justify-center pt-10 opacity-40 hover:-mt-2 hover:pb-2 hover:opacity-100 md:hidden" :aria-label="t('labels.toTop')"><ArrowUpIcon class="h-6 w-6" aria-hidden="true" /></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer-icon-base {
  @apply self-center p-1 text-zinc-700 dark:text-zinc-300;
}
</style>
