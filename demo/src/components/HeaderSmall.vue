<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import Logo from "@/components/LogoMain.vue";
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n'
const { locale } = useI18n();
</script>

<template>
  <div
    class="w-full bg-gradient-to-tr from-primary via-primary to-primary-light py-5 shadow-lg dark:from-primary-dark dark:via-primary dark:to-primary-light"
  >
    <div class="container flex justify-between">
      <div class="-mt-1 w-auto max-w-[150px] flex-grow">
        <RouterLink
          v-if="locale=='en'"
          :to="{ name: 'home', params: { locale } }"
        >
          <Logo class="force-light" />
        </RouterLink>
        <RouterLink
          v-if="locale!='en'"
          :to="{ name: 'home-i18n', params: { locale } }"
        >
          <Logo class="force-light" />
        </RouterLink>
      </div>
      <NavigationBar />
    </div>
  </div>
</template>
