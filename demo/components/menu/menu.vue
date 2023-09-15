<script setup lang="ts">
import { SparklesIcon, } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close-mobile-menu']);
const localePath = useLocalePath();
</script>

<template>
  <NuxtLink :to="{path: localePath('index'), hash: '#demo'}" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.home') }} </NuxtLink>
  <NuxtLink :to="{path: localePath('index'), hash: '#installation'}" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.installation') }} </NuxtLink>
  <NuxtLink :to="localePath('configuration')" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.configuration') }} </NuxtLink>
  <NuxtLink :to="localePath('examples')" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.examples') }} </NuxtLink>
  <a class="menu-item-pro" target="_self" rel="noopener" href="https://add-to-calendar-pro.com" @click="emit('close-mobile-menu')"> <SparklesIcon class="mr-2 inline-block h-5 w-5" aria-hidden="true" />go PRO </a>
</template>

<style scoped>
.menu-item {
  @apply m-auto rounded-md border border-transparent py-2 px-3 text-2xl opacity-80 hover:border-white hover:no-underline hover:opacity-100 hover:shadow-md lg:text-base;
}

.menu-item-pro {
  @apply m-auto rounded-md border-2 text-white hover:text-black border-secondary from-secondary to-secondary-light py-2 px-3 hover:border-secondary-light hover:bg-gradient-to-tr hover:no-underline hover:shadow-md text-2xl lg:text-base;
}
</style>
