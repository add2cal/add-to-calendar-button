<script setup lang="ts">
import { RouterLink } from "vue-router";
//import { SparklesIcon, } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const emit = defineEmits(['closeMM']);
</script>

<template>
  <RouterLink class="menu-item" @click="emit('closeMM')" v-if="locale=='en'" :to="{ name: 'home', hash: '#demo', params: { locale } }">
    {{ t('navigation.home') }}
  </RouterLink>
  <RouterLink class="menu-item" @click="emit('closeMM')" v-else :to="{ name: 'home-i18n', hash: '#demo', params: { locale } }">
    {{ t('navigation.home') }}
  </RouterLink>
  <RouterLink class="menu-item" @click="emit('closeMM')" v-if="locale=='en'" :to="{ name: 'home', hash: '#installation', params: { locale } }">
    {{ t('navigation.installation') }}
  </RouterLink>
  <RouterLink class="menu-item" @click="emit('closeMM')" v-else :to="{ name: 'home-i18n', hash: '#installation', params: { locale } }">
    {{ t('navigation.installation') }}
  </RouterLink>
  <RouterLink class="menu-item" @click="emit('closeMM')" :to="{ name: 'configuration', params: { locale } }">
    {{ t('navigation.configuration') }}
  </RouterLink>
  <RouterLink class="menu-item" @click="emit('closeMM')" :to="{ name: 'examples', params: { locale } }">
    {{ t('navigation.examples') }}
  </RouterLink>
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
