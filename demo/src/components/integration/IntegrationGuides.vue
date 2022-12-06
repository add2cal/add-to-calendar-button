<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div>
    <p>
      The script is built as a "Web Component"!<br />
      This means that you can use it similar to any other HTML element and it is
      working out-of-the-box for all setups.
    </p>
    <p>
      However, if you are using some kind of framework or library, you might
      want to check out the specific guides, to get it even stronger
      integrated.<br />
      No worries! This makes it even more convenient.
    </p>
    <div class="m-20 flex justify-between">
      <RouterLink class="border p-20" :to="{ name: 'use', params: { locale } }">
        {{ t('navigation.advanced') }}
      </RouterLink>
      <RouterLink
        class="border p-20"
        :to="{ name: 'use-with-angular', params: { locale } }"
      >
        {{ t('navigation.advanced') }}
      </RouterLink>
    </div>
  </div>
</template>
