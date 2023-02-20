<script setup lang="ts">
import NavigationBar from "@/components/menu/navigationBar.vue";
import Logo from "@/components/logos/logoMain.vue";

const localePath = useLocalePath();
</script>

<template>
  <div class="w-full bg-gradient-to-tr from-primary via-primary to-primary-light py-5 shadow-lg dark:from-primary dark:via-primary-dark dark:to-primary-dark">
    <div class="container flex justify-between">
      <div class="-mt-1 -ml-2 w-auto max-w-[150px] grow xl:ml-0">
        <NuxtLink :to="localePath('index')"><Logo class="force-light" /></NuxtLink>
      </div>
      <NavigationBar />
    </div>
  </div>
</template>
