<script setup lang="ts">
import HeroHeader from "@/components/hero.vue";
import Footer from "@/components/footer.vue";

const { t } = useI18n();

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
});

const title = computed(() => t('meta.title_main') + ' | ' + t('meta.title_slug'));
const description = computed(() => t('meta.description'));
</script>

<template>
  <div>
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
      <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
        <Meta name="keywords" :content="t('meta.keywords')" />
        <Meta property="og:site_name" :content="title" />
        <Meta name="twitter:title" :content="title" />
        <Meta property="og:description" :content="description" />
        <Meta name="twitter:description" :content="description" />
        <Meta name="description" :content="description" />
      </Head>
      <Body>
        <HeroHeader />
        <div class="mb-20 mt-16 text-center md:text-left">
          <slot />
        </div>
        <Footer />
      </Body>
    </Html>
  </div>
</template>
