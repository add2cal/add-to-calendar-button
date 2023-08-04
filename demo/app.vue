<script setup lang="ts">
import { set, LSKey } from '@/utils/localStorage';
const { locale } = useI18n();

if (process.client) {
  set(LSKey.LANG, locale.value);
}

useSchemaOrg([
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
    <NuxtLoadingIndicator :throttle="5" color="#ffa255" :height="5" />
    <NuxtPage />
  </NuxtLayout>
</template>
