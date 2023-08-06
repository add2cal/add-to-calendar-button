<script setup lang="ts">
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

const route = useRoute();
const { t } = useI18n();

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
});

const title = computed(() => route.meta.title ? t('meta.title', { title: t(route.meta.title.toString()) }) : t('meta.title_main') + ' | ' + t('meta.title_slug'));
const description = computed(() => route.meta.description ? t(route.meta.description.toString()) : t('meta.description'));
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
        <Meta property="og:title" :content="title" />
        <Meta name="twitter:title" :content="title" />
        <Meta property="og:description" :content="description" />
        <Meta name="twitter:description" :content="description" />
        <Meta name="description" :content="description" />
      </Head>
      <Body>
        <a href="https://www.producthunt.com/posts/add-to-calendar-button-v2" target="_blank" class="hidden w-full flex-wrap items-center justify-center bg-[#FF6154] p-3 text-white hover:no-underline hover:opacity-90 lg:flex">
          <span class="mr-3 h-6 w-6 rounded-full border border-white">P</span>
          <span class="mr-2 font-normal">We are live on Product Hunt.</span><span class="mr-2 hidden font-normal md:inline-block">Support us with an Upvote! 🚀</span>
          <span>Click here &raquo;</span>
        </a>
        <Header />
        <div class="container relative z-10 mb-20 mt-16 text-center md:text-left">
          <slot />
        </div>
        <Footer />
      </Body>
    </Html>
  </div>
</template>
