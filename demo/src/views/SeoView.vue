<script setup lang="ts">
import View_DE from "@/views/SeoView-de.vue";
import "add-to-calendar-button";
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">What is an Add to Calendar Button</h1>
  <View_DE v-if="locale=='de'" />
  <div v-else>English</div>
</template>
