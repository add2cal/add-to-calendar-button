<script setup lang="ts">
import HeaderLarge from "@/components/HeaderLarge.vue";
import HeaderSmall from "@/components/HeaderSmall.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <HeaderLarge v-if="route.name=='home' || route.name=='home-i18n'" />
  <HeaderSmall v-else />
</template>
