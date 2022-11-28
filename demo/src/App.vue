<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import FooterArea from "./components/FooterArea.vue";
import HeaderLarge from "./components/HeaderLarge.vue";
import HeaderSmall from "./components/HeaderSmall.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderLarge v-if="$route.name=='home'" />
      <HeaderSmall v-if="$route.name!=='home'" />
    </div>
  </header>

  <RouterView />

  <footer>
    <FooterArea />
  </footer>
</template>
