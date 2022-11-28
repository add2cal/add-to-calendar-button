<script setup lang="ts">
import LightModeSwitch from "./LightModeSwitch.vue";
</script>

<template>
  <LightModeSwitch />
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/examples">Examples</RouterLink>
  </nav>
  Current Version: 2.0.0
</template>
