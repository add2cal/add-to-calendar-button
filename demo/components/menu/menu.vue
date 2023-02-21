<script setup lang="ts">
//import { SparklesIcon, } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close-mobile-menu']);
const localePath = useLocalePath();
</script>

<template>
  <NuxtLink :to="{path: localePath('index'), hash: '#demo'}" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.home') }} </NuxtLink>
  <NuxtLink :to="{path: localePath('index'), hash: '#installation'}" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.installation') }} </NuxtLink>
  <NuxtLink :to="localePath('configuration')" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.configuration') }} </NuxtLink>
  <NuxtLink :to="localePath('examples')" class="menu-item" @click="emit('close-mobile-menu')"> {{ $t('navigation.examples') }} </NuxtLink>
  <!--<a
        class="menu-item-pro"
        @click="emit"
        target="_blank"
        rel="noopener"
        href="https://add-to-calendar-pro.com"
      >
        <SparklesIcon class="h-5 w-5 inline-block mr-2" aria-hidden="true" />go PRO
      </a>-->
  <!-- mobile menu -->
</template>

<style scoped>
.menu-item {
  @apply m-auto rounded-md border border-transparent py-2 px-3 text-2xl opacity-80 hover:border-white hover:no-underline hover:opacity-100 lg:text-base;
}

.menu-item-pro {
  @apply m-auto rounded-md border-2 text-white hover:text-black border-secondary-light from-secondary to-secondary-light py-2 px-3 hover:border-secondary hover:bg-gradient-to-tr hover:no-underline hover:shadow-md text-2xl lg:text-base;
}
</style>
