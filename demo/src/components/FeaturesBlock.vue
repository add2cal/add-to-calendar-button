<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CalTypeImage from '@i/caltypes.webp';
import VarietyImage from '@i/variety.webp';
import MoreImage from '@i/more.webp';
import AccessibilityImage from '@i/accessibility.webp';
import StyleImage from '@i/style.webp';
const { t } = useI18n();
</script>

<template>
  <div class="my-14 mx-auto grid max-w-sm grid-cols-1 gap-x-10 md:max-w-4xl md:grid-cols-[200px_minmax(0,1fr)] md:gap-y-20">
    <img :alt="t('content.features.headline_1')" width="150" height="150" :src="CalTypeImage" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ t('content.features.headline_1') }}</h3>
      <ul>
        <li v-for="n in 5" :key="n">
          {{ t('content.features.block_1.' + n) }}
        </li>
      </ul>
    </div>
    <img :alt="t('content.features.headline_2')" width="150" height="150" :src="VarietyImage" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ t('content.features.headline_2') }}</h3>
      <ul>
        <li v-for="n in 5" :key="n">
          {{ t('content.features.block_2.' + n) }}
        </li>
      </ul>
    </div>
    <img :alt="t('content.features.headline_3')" width="150" height="150" :src="StyleImage" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ t('content.features.headline_3') }}</h3>
      <ul>
        <li v-for="n in 3" :key="n">
          {{ t('content.features.block_3.' + n) }}
        </li>
      </ul>
    </div>
    <img :alt="t('content.features.headline_4')" width="150" height="150" :src="AccessibilityImage" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ t('content.features.headline_4') }}</h3>
      <ul>
        <li v-for="n in 5" :key="n">
          {{ t('content.features.block_4.' + n) }}
        </li>
      </ul>
    </div>
    <img :alt="t('content.features.headline_5')" width="150" height="150" :src="MoreImage" class="mx-auto self-center" />
    <div>
      <h3>{{ t('content.features.headline_5') }}</h3>
      <ul>
        <li v-for="n in 3" :key="n">
          {{ t('content.features.block_5.' + n) }}
        </li>
        <li>...</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
ul {
  @apply my-4 list-disc pl-6;
}

ul li {
  @apply text-left;
}

h3 {
  @apply mt-8 text-center md:text-left;
}
</style>
