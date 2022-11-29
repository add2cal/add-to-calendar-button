<script setup lang="ts">
import { RouterLink } from "vue-router";
import LightModeSwitch from "@/components/LightModeSwitch.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { ArrowUpIcon } from '@heroicons/vue/24/solid';
import Logo from "@/components/LogoMain.vue";
import LogoGithub from "@/components/LogoGithub.vue";
import LogoTwitter from "@/components/LogoTwitter.vue";
import LogoNpm from "@/components/LogoNpm.vue";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div
    class="max-w-full bg-gradient-to-t from-zinc-100 to-gray-300 dark:from-zinc-800 dark:to-zinc-900"
  >
    <div class="container">
      <div class="mx-6 pt-12 pb-16 md:m-auto md:pt-16">
        <div
          class="flex flex-col-reverse items-center sm:flex-row sm:justify-between"
        >
          <div class="hidden w-auto max-w-[200px] sm:block">
            <RouterLink
              v-if="locale=='en'"
              :to="{ name: 'home', params: { locale } }"
            >
              <Logo />
            </RouterLink>
            <RouterLink
              v-if="locale!='en'"
              :to="{ name: 'home-i18n', params: { locale } }"
            >
              <Logo />
            </RouterLink>
          </div>
          <div class="flex">
            <a
              href="#"
              class="mr-8 hidden self-center opacity-40 hover:pb-2 hover:opacity-100 md:inline-block"
              ><ArrowUpIcon class="h-6 w-6" aria-hidden="true"
            /></a>
            <div class="inline-block"><LanguageSwitcher /></div>
          </div>
        </div>
        <hr class="mt-6 mb-4 border-gray-300 dark:border-zinc-700" />
        <div
          class="flex flex-col-reverse text-xs sm:flex-row sm:justify-between"
        >
          <div class="px-1 pt-10 pb-2 text-center sm:pt-1 sm:text-left">
            <RouterLink :to="{ name: 'legal-notice', params: { locale } }">
              {{ t('navigation.legal-notice') }}
            </RouterLink>
            |
            <RouterLink :to="{ name: 'privacy-policy', params: { locale } }">
              {{ t('navigation.privacy-policy') }}
            </RouterLink>
            <div class="mt-2">
              <span class="font-semibold text-zinc-500 dark:text-zinc-400">
                &copy; {{new Date().getFullYear()}}
              </span>
              <span class="lowercase text-zinc-400 dark:text-zinc-500">
                , Current Version: 2.0.0
              </span>
            </div>
          </div>
          <div class="hidden self-center sm:block"><LightModeSwitch /></div>
          <div class="flex justify-center space-x-6 pt-3 sm:pt-0">
            <a
              class="w-9 self-center p-1 text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
              target="_blank"
              rel="noopener"
              href="https://github.com/add2cal/add-to-calendar-button"
              ><LogoGithub
            /></a>
            <a
              class="w-9 self-center p-1 text-zinc-700 hover:text-twitter dark:text-zinc-300 dark:hover:text-twitter"
              target="_blank"
              rel="noopener"
              href="https://twitter.com/add2calendar"
              ><LogoTwitter
            /></a>
            <a
              class="w-12 self-center p-1 text-zinc-700 hover:text-npm dark:text-zinc-300 dark:hover:text-npm"
              target="_blank"
              rel="noopener"
              href="https://www.npmjs.com/package/add-to-calendar-button"
              ><LogoNpm
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
