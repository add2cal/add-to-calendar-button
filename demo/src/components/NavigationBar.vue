<script setup lang="ts">
import { RouterLink } from "vue-router";
import LightModeSwitch from "@/components/LightModeSwitch.vue";
import { SparklesIcon } from '@heroicons/vue/24/outline';
import LogoGithub from "@/components/LogoGithub.vue";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <nav class="flex space-x-3 self-center text-white">
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      v-if="locale=='en'"
      :to="{ name: 'home', hash: '#demo', params: { locale } }"
    >
      {{ t('navigation.home') }}
    </RouterLink>
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      v-if="locale!='en'"
      :to="{ name: 'home-i18n', hash: '#demo', params: { locale } }"
    >
      {{ t('navigation.home') }}
    </RouterLink>
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      v-if="locale=='en'"
      :to="{ name: 'home', hash: '#installation', params: { locale } }"
    >
      {{ t('navigation.installation') }}
    </RouterLink>
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      v-if="locale!='en'"
      :to="{ name: 'home-i18n', hash: '#installation', params: { locale } }"
    >
      {{ t('navigation.installation') }}
    </RouterLink>
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      v-if="locale=='en'"
      :to="{ name: 'home', hash: '#features', params: { locale } }"
    >
      {{ t('navigation.features') }}
    </RouterLink>
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      v-if="locale!='en'"
      :to="{ name: 'home-i18n', hash: '#features', params: { locale } }"
    >
      {{ t('navigation.features') }}
    </RouterLink>
    <RouterLink
      class="m-auto rounded-md border border-transparent py-2 px-3 opacity-80 hover:border-white hover:no-underline hover:opacity-100"
      :to="{ name: 'examples', params: { locale } }"
    >
      {{ t('navigation.examples') }}
    </RouterLink>
    <!--<a
      class="m-auto rounded-md border-2 text-white hover:text-black border-secondary-light from-secondary to-secondary-light py-2 px-3 hover:border-secondary hover:bg-gradient-to-tr hover:no-underline hover:shadow-md"
      target="_blank"
      rel="noopener"
      href="https://add-to-calendar-pro.com"
    >
      <SparklesIcon class="h-5 w-5 inline-block mr-2" aria-hidden="true" />go PRO
    </a>-->
    <div class="py-2 px-3 leading-none"><LightModeSwitch /></div>
    <a
      class="w-6 py-2 leading-none text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
      target="_blank"
      rel="noopener"
      href="https://github.com/add2cal/add-to-calendar-button"
      ><LogoGithub
    /></a>
  </nav>
</template>
