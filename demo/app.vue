<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    name: 'Add to Calendar Button',
    image: ['https://add-to-calendar-button.com/assets/img/website1x1.png','https://add-to-calendar-button.com/assets/img/website4x3.png','https://add-to-calendar-button.com/assets/img/website16x9.png']
  }),
  defineWebPage(),
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
