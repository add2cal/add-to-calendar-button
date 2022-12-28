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
const { locale } = useI18n();
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
    <CodeBracketIcon v-if="(stack=='default')" class="w-24" />
    <Angular v-if="(stack=='angular')" class="w-24" />
    <Astro v-if="(stack=='astro')" class="w-24" />
    <React v-if="(stack=='react')" class="w-24" />
    <Svelte v-if="(stack=='svelte')" class="w-24" />
    <Vue v-if="(stack=='vue')" class="w-24" />
    <span v-if="(stack=='wordpress')" class="text-wordpress dark:text-white"><WordPress class="w-24" /></span>
  </div>

  <p v-if="(stack=='default')">You are using Angular, React, Vue, or other frameworks?</p>
  <p v-if="(stack!='default')">Not your tech stack?</p>
  <p class="font-semibold">
    <RouterLink v-if="locale=='en'" :to="{ name: 'home', hash: '#installation', params: { locale } }"> Check out the "Installation" section! </RouterLink>
    <RouterLink v-if="locale!='en'" :to="{ name: 'home-i18n', hash: '#installation', params: { locale } }"> Check out the "Installation" section! </RouterLink>
  </p>
  <p>We have strong guides and solutions for all big frontend stacks as well things like WordPress.</p>
</template>
