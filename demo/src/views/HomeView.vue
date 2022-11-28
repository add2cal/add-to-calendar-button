<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Playground from "../components/Playground.vue";
const { t } = useI18n(); // same as `useI18n({ useScope: 'global' })`
</script>

<template>
  <p>{{ $t("message.hello") }}</p>
  <Playground />
</template>
