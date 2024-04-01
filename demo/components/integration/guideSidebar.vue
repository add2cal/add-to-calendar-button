<script setup lang="ts">
import { CodeBracketIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import Angular from "@/components/logos/logoAngular.vue";
import Astro from "@/components/logos/logoAstro.vue";
import React from "@/components/logos/logoReact.vue";
import Svelte from "@/components/logos/logoSvelte.vue";
import Vue from "@/components/logos/logoVue.vue";
import NextJS from "@/components/logos/logoNextJS.vue";
import Nuxt from "@/components/logos/logoNuxt.vue";
import Wix from "@/components/logos/logoWix.vue";
import WordPress from "@/components/logos/logoWordPress.vue";

const localePath = useLocalePath();
</script>

<script lang="ts">
export default {
  props: {
    stack: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<template>
  <div class="pb-28 pl-2" :class="{ 'pt-3': stack!='default' }">
    <Angular v-if="(stack=='angular')" class="w-24" />
    <Astro v-else-if="(stack=='astro')" class="w-24" />
    <React v-else-if="(stack=='react')" class="w-24" />
    <Svelte v-else-if="(stack=='svelte')" class="w-24" />
    <NextJS v-else-if="(stack=='nextjs')" class="w-24" />
    <Nuxt v-else-if="(stack=='nuxt')" class="w-24" />
    <Vue v-else-if="(stack=='vue')" class="w-24" />
    <Wix v-else-if="(stack=='wix')" class="w-24" />
    <span v-else-if="(stack=='wordpress')" class="text-wordpress dark:text-white">
      <WordPress class="w-24" />
    </span>
    <CodeBracketIcon v-else class="w-24" />
  </div>

  <p v-if="(stack=='default')">{{ $t('content.guide.sidebar.framework') }}</p>
  <p v-else>{{ $t('content.guide.sidebar.tech_stack') }}</p>
  <p class="font-semibold">
    <NuxtLink :to="{path: localePath('index'), hash: '#installation'}">{{ $t('content.guide.sidebar.cta') }}</NuxtLink>
  </p>
  <p>{{ $t('content.guide.sidebar.explainer') }}</p>
  <div class="mt-7 border-t border-zinc-300 pt-7 dark:border-zinc-700"></div>
  <p>
    {{ $t('content.guide.sidebar.stackblitz') }}:
    <a href="https://stackblitz.com/@add-to-calendar/collections/add-to-calendar-button-integration-examples" target="_blank" rel="noopener" class="whitespace-nowrap">{{ $t('labels.clickHere') }} <ArrowTopRightOnSquareIcon class="mr-0.5 inline-block h-2.5 w-2.5" aria-hidden="true" /></a>.
  </p>
</template>
