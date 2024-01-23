<template>
  <div class="mx-auto my-14 grid max-w-sm grid-cols-1 gap-x-10 md:max-w-4xl md:grid-cols-[200px_minmax(0,1fr)] md:gap-y-20">
    <nuxt-img placeholder loading="lazy" :alt="$t('content.features.headline_1')" width="150" height="125" src="/assets/img/caltypes.webp" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ $t('content.features.headline_1') }}</h3>
      <ul>
        <li v-for="n in 5" :key="n">
          {{ $t('content.features.block_1.' + n) }}
        </li>
      </ul>
    </div>
    <nuxt-img placeholder loading="lazy" :alt="$t('content.features.headline_2')" width="150" height="150" src="/assets/img/variety.webp" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ $t('content.features.headline_2') }}</h3>
      <ul>
        <li v-for="n in 5" :key="n">
          {{ $t('content.features.block_2.' + n) }}
        </li>
      </ul>
    </div>
    <nuxt-img placeholder loading="lazy" :alt="$t('content.features.headline_3')" width="150" height="150" src="/assets/img/style.webp" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ $t('content.features.headline_3') }}</h3>
      <ul>
        <li v-for="n in 3" :key="n">
          {{ $t('content.features.block_3.' + n) }}
        </li>
      </ul>
    </div>
    <nuxt-img placeholder loading="lazy" :alt="$t('content.features.headline_4')" width="150" height="180" src="/assets/img/accessibility.webp" class="mx-auto self-center" />
    <div class="mb-20 md:mb-0">
      <h3>{{ $t('content.features.headline_4') }}</h3>
      <ul>
        <li v-for="n in 5" :key="n">
          {{ $t('content.features.block_4.' + n) }}
        </li>
      </ul>
    </div>
    <nuxt-img placeholder loading="lazy" :alt="$t('content.features.headline_5')" width="150" height="143" src="/assets/img/more.webp" class="mx-auto self-center" />
    <div>
      <h3>{{ $t('content.features.headline_5') }}</h3>
      <ul>
        <li v-for="n in 3" :key="n">
          {{ $t('content.features.block_5.' + n) }}
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
