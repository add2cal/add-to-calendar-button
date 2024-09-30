<script setup lang="ts">
import { set, LSKey } from '@/utils/localStorage';
const { locale } = useI18n();

if (import.meta.client) {
  set(LSKey.LANG, locale.value);
}

useSchemaOrg([
  defineOrganization({
    name: 'Add to Calendar'
  }),
  defineWebSite({
    name: 'Add to Calendar Button',
    image: ['https://add-to-calendar-button.com/assets/img/website1x1.png','https://add-to-calendar-button.com/assets/img/website4x3.png','https://add-to-calendar-button.com/assets/img/website16x9.png']
  }),
  defineWebPage(),
])
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtLoadingIndicator color="#ffa255" :height="5" />
    <NuxtPage />
  </NuxtLayout>
</template>
