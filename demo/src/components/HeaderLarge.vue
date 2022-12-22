<script setup lang="ts">
import StatsBar from "@/components/StatsBar.vue";
import NavigationBar from "@/components/menu/NavigationBar.vue";
import Logo from "@/components/logos/LogoMain.vue";
import HeroImage from '@i/cal.webp';
import OvalLight from '@i/oval-light.webp';
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
</script>

<template>
  <div class="w-full bg-gradient-to-tr from-primary via-primary to-primary-light py-5 shadow-lg dark:from-primary dark:via-primary-dark dark:to-primary-dark">
    <div class="container flex justify-between">
      <div class="-mt-1 w-auto max-w-[150px] flex-grow">
        <Logo class="force-light" />
      </div>
      <NavigationBar />
    </div>
    <div class="container m-auto my-20 grid grid-cols-1 justify-items-center md:my-24 lg:my-28 lg:grid-cols-2 xl:my-32">
      <div class="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-1">
        <div class="max-w-[400px] self-center pb-14 md:pb-0 lg:pb-16">
          <h1 class="text-white">
            <span class="hidden xs:block">The Next-level</span>
            <span class="hidden xs:block">Add to Calendar Button</span>
            <span class="block xs:hidden">Make your events get saved!</span>
          </h1>
          <h2 class="mt-5 hidden italic text-white opacity-70 xs:block">Make your events get saved!</h2>
        </div>
        <div class="grid max-w-[400px] grid-cols-1 justify-items-center gap-6 self-center xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <RouterLink class="button-secondary w-40 text-white" v-if="locale=='en'" :to="{ name: 'home', hash: '#installation', params: { locale } }">
            {{ t('labels.getStarted') }}
          </RouterLink>
          <RouterLink class="button-secondary w-40 text-white" v-if="locale!='en'" :to="{ name: 'home-i18n', hash: '#installation', params: { locale } }">
            {{ t('labels.getStarted') }}
          </RouterLink>

          <RouterLink class="button-primary w-40 text-white" v-if="locale=='en'" :to="{ name: 'home', hash: '#demo', params: { locale } }">
            {{ t('labels.demo') }}
          </RouterLink>
          <RouterLink class="button-primary w-40 text-white" v-if="locale!='en'" :to="{ name: 'home-i18n', hash: '#demo', params: { locale } }">
            {{ t('labels.demo') }}
          </RouterLink>
        </div>
      </div>
      <div class="hidden self-center lg:block">
        <img alt="Mark this" class="hidden xl:block" width="400" height="198" :src="OvalLight" />
        <img alt="Add to Calendar Button" width="150" height="150" :src="HeroImage" class="animate-bounce-minimal xl:-mt-[180px] xl:ml-[125px]" />
      </div>
    </div>
  </div>
  <div class="hidden sm:block"><StatsBar /></div>
</template>
