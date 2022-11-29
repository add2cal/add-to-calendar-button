<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import StatsBar from "@/components/StatsBar.vue";
import Logo from "@/components/LogoMain.vue";
</script>

<template>
  <div
    class="w-full bg-gradient-to-tr from-primary via-primary to-primary-light py-8 shadow-lg dark:from-primary dark:via-primary-dark dark:to-primary-dark"
  >
    <div class="container flex w-full flex-row-reverse"><NavigationBar /></div>
    <div class="container m-auto my-16 flex items-center justify-between">
      <div
        class="mx-auto w-auto max-w-[400px] flex-grow pb-0 lg:mx-20 xl:mx-14 xl:pb-8 2xl:mx-0"
      >
        <Logo class="force-light" />
      </div>
      <div class=" mr-30 hidden self-end pb-3 lg:block xl:mr-60">
        <img
          class="hidden xl:block"
          width="400"
          height="198"
          src="../../public/assets/img/oval-light.png"
        />
        <img
          alt="Add to Calendar Button"
          width="150"
          height="150"
          src="../../public/assets/img/cal.png"
          class="animate-bounce-minimal mr-[150px] xl:mr-0 xl:-mt-[170px] xl:ml-[125px]"
        />
      </div>
    </div>
  </div>
  <div class="hidden sm:block"><StatsBar /></div>
</template>
