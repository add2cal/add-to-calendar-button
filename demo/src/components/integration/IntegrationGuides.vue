<script setup lang="ts">
import Angular from "@/components/logos/LogoAngular.vue";
import Astro from "@/components/logos/LogoAstro.vue";
import React from "@/components/logos/LogoReact.vue";
import Svelte from "@/components/logos/LogoSvelte.vue";
import Vue from "@/components/logos/LogoVue.vue";
import WordPress from "@/components/logos/LogoWordPress.vue";
import { CodeBracketIcon } from '@heroicons/vue/24/solid';
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div>
    <p>
      The script is built as a "Web Component".<br />
      This means that you can use it similar to any other HTML element and it is working out-of-the-box for all setups.
    </p>
    <p class="font-semibold">Find a step-by-step guide by selecting your environment.</p>
    <div class="flex flex-col py-24 xl:flex-row">
      <div class="mx-auto grid grid-cols-1 gap-14 xs:grid-cols-2 md:grid-cols-3">
        <RouterLink class="tech-stack-button group h-36 w-40 hover:border-angular hover:from-angular hover:to-angular hover:text-white dark:hover:border-angular dark:hover:from-angular dark:hover:to-angular dark:hover:text-white" :to="{ name: 'use-with-angular', params: { locale } }">
          <Angular class="self-center p-4" />
          <div class="self-center p-4 pt-0">Angular</div>
        </RouterLink>
        <RouterLink class="tech-stack-button group h-36 w-40 hover:border-astro hover:from-astro hover:to-astro hover:text-white dark:hover:border-astro dark:hover:from-astro dark:hover:to-astro dark:hover:text-white" :to="{ name: 'use-with-astro', params: { locale } }">
          <Astro class="self-center p-4" />
          <div class="self-center p-4 pt-0">Astro</div>
        </RouterLink>
        <RouterLink class="tech-stack-button group h-36 w-40 hover:border-react hover:from-react hover:to-react hover:text-white dark:hover:border-react dark:hover:from-react dark:hover:to-react dark:hover:text-white" :to="{ name: 'use-with-react', params: { locale } }">
          <React class="self-center p-4" />
          <div class="self-center p-4 pt-0">React</div>
        </RouterLink>
        <RouterLink class="tech-stack-button group h-36 w-40 hover:border-svelte hover:from-svelte hover:to-svelte hover:text-white dark:hover:border-svelte dark:hover:from-svelte dark:hover:to-svelte dark:hover:text-white" :to="{ name: 'use-with-svelte', params: { locale } }">
          <Svelte class="self-center p-4" />
          <div class="self-center p-4 pt-0">Svelte</div>
        </RouterLink>
        <RouterLink class="tech-stack-button group h-36 w-40 hover:border-vue hover:from-vue hover:to-vue hover:text-white dark:hover:border-vue dark:hover:from-vue dark:hover:to-vue dark:hover:text-white" :to="{ name: 'use-with-vue', params: { locale } }">
          <Vue class="self-center p-4" />
          <div class="self-center p-4 pt-0">Vue 3</div>
        </RouterLink>
        <RouterLink class="tech-stack-button h-36 w-40 hover:border-wordpress hover:from-wordpress hover:to-wordpress hover:text-white dark:hover:border-wordpress dark:hover:from-wordpress dark:hover:to-wordpress dark:hover:text-white" :to="{ name: 'use-with-wordpress', params: { locale } }">
          <WordPress class="self-center p-4" />
          <div class="self-center p-4 pt-0">WordPress</div>
        </RouterLink>
      </div>
      <div class="flex flex-col justify-center self-center pt-24 pb-12 md:flex-row xl:flex-col xl:pt-12">
        <div class="mr-0 mb-6 max-w-xs self-center text-center md:mr-10 md:mb-0 xl:mr-0 xl:mb-10 xl:self-end">
          You are using another stack?
          <br />
          The default setup is the way to go!
        </div>
        <RouterLink class="tech-stack-button h-36 w-56 hover:border-secondary hover:from-secondary hover:to-secondary hover:text-white dark:hover:border-secondary dark:hover:from-secondary dark:hover:to-secondary dark:hover:text-white" :to="{ name: 'use', params: { locale } }">
          <CodeBracketIcon class="self-center p-4" />
          <div class="self-center p-4 pt-0">{{ t('labels.default') }} / JavaScript</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
