<script setup lang="ts">
import NavigationBar from "@/components/menu/navigationBar.vue";
import Logo from "@/components/logos/logoMain.vue";

const localePath = useLocalePath();
</script>

<template>
  <div class="h-[100px] w-full lg:hidden"></div>
  <div :class="view.atTopOfPage ? 'py-5 shadow-lg' : 'py-3 shadow-xl lg:py-5 lg:shadow-lg'" class="from-primary via-primary to-primary-light dark:from-primary dark:via-primary-dark dark:to-primary-dark fixed top-0 z-50 w-full bg-gradient-to-tr transition-all lg:relative">
    <div class="container flex justify-between">
      <div :class="view.atTopOfPage ? '-ml-2 max-w-[150px]' : '-ml-3 max-w-[100px] lg:-ml-2 lg:max-w-[150px]'" class="-mt-1 w-auto grow transition-all xl:ml-0">
        <NuxtLink :to="localePath('index')"><Logo class="force-light" /></NuxtLink>
      </div>
      <NavigationBar />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data () {
    return {
      view: {
        atTopOfPage: true
      }
    }
  },
  beforeMount () {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    handleScroll(){
      if (window.pageYOffset > 50) {
        if (this.view.atTopOfPage) this.view.atTopOfPage = false
      } else {
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true
      }
    }
  }
};
</script>
