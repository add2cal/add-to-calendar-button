<script setup lang="ts">
import { CodeBracketIcon } from '@heroicons/vue/24/outline';
import Angular from "@/components/logos/LogoAngular.vue";
import Astro from "@/components/logos/LogoAstro.vue";
import React from "@/components/logos/LogoReact.vue";
import Svelte from "@/components/logos/LogoSvelte.vue";
import Vue from "@/components/logos/LogoVue.vue";
import WordPress from "@/components/logos/LogoWordPress.vue";
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
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
    <Vue v-else-if="(stack=='vue')" class="w-24" />
    <span v-else-if="(stack=='wordpress')" class="text-wordpress dark:text-white"><WordPress class="w-24" /></span>
    <CodeBracketIcon v-else class="w-24" />
  </div>

  <p v-if="(stack=='default')">{{ t('content.guide.sidebar.framework') }}</p>
  <p v-else>{{ t('content.guide.sidebar.tech_stack') }}</p>
  <p class="font-semibold">
    <RouterLink v-if="locale=='en'" :to="{ name: 'home', hash: '#installation', params: { locale } }">{{ t('content.guide.sidebar.cta') }}</RouterLink>
    <RouterLink v-else :to="{ name: 'home-i18n', hash: '#installation', params: { locale } }">{{ t('content.guide.sidebar.cta') }}</RouterLink>
  </p>
  <p>{{ t('content.guide.sidebar.explainer') }}</p>
</template>
