<script setup lang="ts">
import StatsBar from "@/components/statsBar.vue";
import StatsBarPlaceholder from "@/components/placeholders/statsBarPlaceholder.vue";
import NavigationBar from "@/components/menu/navigationBar.vue";
import Logo from "@/components/logos/logoMain.vue";
import { ArrowDownIcon } from '@heroicons/vue/24/solid';

const localePath = useLocalePath();
</script>

<template>
  <div class="from-primary via-primary to-primary-light dark:from-primary dark:via-primary-dark dark:to-primary-dark w-full bg-gradient-to-tr py-5 shadow-lg">
    <div class="xs:justify-between xs:py-0 container flex justify-end py-3">
      <div class="xs:block -mt-1 hidden w-auto max-w-[150px] grow">
        <Logo class="force-light" />
      </div>
      <NavigationBar />
    </div>
    <div :class="view.atTopOfPage ? 'top-[-80px]' : 'top-0'" class="from-primary via-primary to-primary-light dark:from-primary dark:via-primary-dark dark:to-primary-dark fixed z-50 w-full bg-gradient-to-tr py-3 shadow-xl transition-all lg:hidden">
      <div class="container flex justify-between">
        <div class="-mt-1 -ml-3 w-auto max-w-[100px] grow xl:ml-0">
          <Logo variation="mobile-small" class="force-light" />
        </div>
        <NavigationBar />
      </div>
    </div>
    <div class="xs:my-20 container m-auto mb-16 mt-8 grid grid-cols-1 justify-items-center md:my-24 lg:my-28 lg:grid-cols-2 xl:my-32">
      <div class="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-1">
        <div class="max-w-[400px] self-center pb-14 md:pb-0 lg:pb-16">
          <div class="xs:hidden mx-auto mb-16 -mt-4 block w-auto max-w-[280px]">
            <Logo class="force-light" variation="mobile" />
          </div>
          <h1 class="text-white">
            <span class="xs:block hidden">{{ $t('content.home.header_prefix') }}</span>
            <span class="xs:block hidden">Add to Calendar Button</span>
            <span class="xs:hidden block text-4xl opacity-70">{{ $t('content.home.header_slogan') }}</span>
          </h1>
          <h2 class="xs:block mt-5 hidden italic text-white opacity-70">{{ $t('content.home.header_slogan') }}</h2>
        </div>
        <div class="xs:grid-cols-2 grid max-w-[400px]  grid-cols-1 justify-items-center gap-6 self-center md:grid-cols-1 lg:grid-cols-2">
          <div class="xs:block hidden">
            <NuxtLink :to="{path: localePath('index'), hash: '#installation'}" class="button-secondary order-first w-40 text-white md:order-last lg:order-first">{{ $t('labels.getStarted') }}</NuxtLink>
          </div>
          <div>
            <NuxtLink :to="{path: localePath('index'), hash: '#demo'}" class="button-primary order-first w-40 text-white md:order-last lg:order-first">{{ $t('labels.demo') }} <ArrowDownIcon class="xs:hidden -mt-1 ml-2 inline-block h-4 w-4" aria-hidden="true" /></NuxtLink>
          </div>
        </div>
      </div>
      <div class="hidden self-center lg:block">
        <img :alt="$t('labels.markThis')" class="hidden xl:block" width="400" height="198" src="~/assets/img/oval-light.webp" />
        <img alt="Add to Calendar Button" width="150" height="150" src="~/assets/img/cal.webp" class="animate-bounce-minimal xl:mt-[-180px] xl:ml-[125px]" />
      </div>
    </div>
  </div>
  <div class="hidden sm:block">
    <ClientOnly>
      <StatsBar />
      <template #fallback>
        <StatsBarPlaceholder />
      </template>
    </ClientOnly>
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
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll(){
      if (window.pageYOffset > 500) {
        if (this.view.atTopOfPage) this.view.atTopOfPage = false
      } else {
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true
      }
    }
  }
};
</script>
