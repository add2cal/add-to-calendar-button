<script setup lang="ts">
import Angular from "@/components/logos/logoAngular.vue";
import Astro from "@/components/logos/logoAstro.vue";
import React from "@/components/logos/logoReact.vue";
import Svelte from "@/components/logos/logoSvelte.vue";
import Vue from "@/components/logos/logoVue.vue";
import WordPress from "@/components/logos/logoWordPress.vue";
import { CodeBracketIcon } from '@heroicons/vue/24/solid';

const localePath = useLocalePath();
</script>

<template>
  <div>
    <p>{{ $t('content.installation.intro_1') }}<br />{{ $t('content.installation.intro_2') }}</p>
    <p class="font-semibold">{{ $t('content.installation.intro_3') }}</p>
    <div class="flex flex-col py-24 xl:flex-row">
      <div class="mx-auto grid grid-cols-1 gap-14 pb-8 pr-0 xs:grid-cols-2 md:grid-cols-3 xl:pb-0 xl:pr-8">
        <NuxtLink class="tech-stack-button group h-36 w-40 hover:border-angular hover:from-angular hover:to-angular hover:text-white dark:hover:border-angular dark:hover:from-angular dark:hover:to-angular dark:hover:text-white" :to="localePath('use-with-angular')">
          <Angular class="self-center p-4" />
          <div class="self-center p-4 pt-0">Angular</div>
        </NuxtLink>
        <NuxtLink class="tech-stack-button group h-36 w-40 hover:border-astro hover:from-astro hover:to-astro hover:text-white dark:hover:border-astro dark:hover:from-astro dark:hover:to-astro dark:hover:text-white" :to="localePath('use-with-astro')">
          <Astro class="self-center p-4" />
          <div class="self-center p-4 pt-0">Astro</div>
        </NuxtLink>
        <NuxtLink class="tech-stack-button group h-36 w-40 hover:border-react hover:from-react hover:to-react hover:text-white dark:hover:border-react dark:hover:from-react dark:hover:to-react dark:hover:text-white" :to="localePath('use-with-react')">
          <React class="self-center p-4" />
          <div class="self-center p-4 pt-0">React</div>
        </NuxtLink>
        <NuxtLink class="tech-stack-button group h-36 w-40 hover:border-svelte hover:from-svelte hover:to-svelte hover:text-white dark:hover:border-svelte dark:hover:from-svelte dark:hover:to-svelte dark:hover:text-white" :to="localePath('use-with-svelte')">
          <Svelte class="self-center p-4" />
          <div class="self-center p-4 pt-0">Svelte</div>
        </NuxtLink>
        <NuxtLink class="tech-stack-button group h-36 w-40 hover:border-vue hover:from-vue hover:to-vue hover:text-white dark:hover:border-vue dark:hover:from-vue dark:hover:to-vue dark:hover:text-white" :to="localePath('use-with-vue')">
          <Vue class="self-center p-4" />
          <div class="self-center p-4 pt-0">Vue 3</div>
        </NuxtLink>
        <NuxtLink class="tech-stack-button h-36 w-40 hover:border-wordpress hover:from-wordpress hover:to-wordpress hover:text-white dark:hover:border-wordpress dark:hover:from-wordpress dark:hover:to-wordpress dark:hover:text-white" :to="localePath('use-with-wordpress')">
          <WordPress class="self-center p-4" />
          <div class="self-center p-4 pt-0">WordPress</div>
        </NuxtLink>
      </div>
      <div class="mt-8 flex w-full flex-col justify-center self-center border-t border-l-0 border-zinc-300 pt-8 pb-12 pl-0 dark:border-zinc-700 md:flex-row xl:mt-0 xl:w-auto xl:flex-col xl:border-t-0 xl:border-l xl:pl-8">
        <div class="mr-0 mb-6 max-w-xs self-center text-center md:mr-10 md:mb-0 xl:mr-0 xl:mb-10 xl:self-end">
          {{ $t('content.installation.other_stack_1') }}
          <br />
          {{ $t('content.installation.other_stack_2') }}
        </div>
        <NuxtLink class="tech-stack-button h-36 w-56 hover:border-secondary hover:from-secondary hover:to-secondary hover:text-white dark:hover:border-secondary dark:hover:from-secondary dark:hover:to-secondary dark:hover:text-white" :to="localePath('use')">
          <CodeBracketIcon class="self-center p-4" />
          <div class="self-center p-4 pt-0">{{ $t('labels.default') }} / JavaScript</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
