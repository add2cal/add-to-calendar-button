<script setup lang="ts">
import { watch } from 'vue';
import { useHead } from '@vueuse/head';
import FooterArea from "@/components/FooterArea.vue";
import HeaderLarge from "@/components/HeaderLarge.vue";
import HeaderSmall from "@/components/HeaderSmall.vue";

import { RouterView, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter();

watch(router.currentRoute, newRoute =>  {
  const rName = newRoute.name as string;
  // set meta information (except for robots and canonical)
  // prepare page title
  const title = (function () {
    if (rName != 'home' && rName != 'home-i18n' && rName != 'seo') {
      return (
        t('navigation.' + rName) +
        ' | Add to Calendar Button'
      );
    }
    if (rName == 'seo') {
      return (
        t('meta.seo-title')
      );
    }
    return 'Add to Calendar Button | ' + t('meta.titleSlug');
  })();
  // prepare robots
  const robots = (function () {
    if (rName == 'legal-notice' || rName == 'privacy-policy') {
      return 'noindex, nofollow';
    }
    return 'index, follow';
  })();
  // prepare hreflang entries
  const urlEn = (function () {
    if (rName == 'home' || rName == 'home-i18n') {
      return 'http://add-to-calendar-button.com';
    }
    return 'http://add-to-calendar-button.com/en/' + rName;
  })();
  const urlDe = (function () {
    if (rName == 'home' || rName == 'home-i18n') {
      return 'http://add-to-calendar-button.com/de';
    }
    return 'http://add-to-calendar-button.com/de/' + rName;
  })();
  // output
  useHead({
    title: `${title}`,
    meta: [
      {
        name: "robots",
        content: `${robots}`
      },
      {
        property: "og:title",
        content: `${title}`
      },
      {
        name: "twitter:title",
        content: `${title}`
      },
      {
        name: "keywords",
        content: `${t('meta.keywords')}`
      },
      {
        name: "description",
        content: `${t('meta.description')}`
      },
      {
        property: "og:description",
        content: `${t('meta.description')}`
      },
      {
        name: "twitter:description",
        content: `${t('meta.description')}`
      },
    ],
    link: [
      {
        rel: "canonical",
        href: `${urlEn}`
      },
      {
        rel: "alternate",
        hreflang: "x-default",
        href: `${urlEn}`,
        key: "hreflang-default"
      },
      {
        rel: "alternate",
        hreflang: "en",
        href: `${urlEn}`,
        key: "hreflang-en"
      },
      {
        rel: "alternate",
        hreflang: "de",
        href: `${urlDe}`,
        key: "hreflang-de"
      }
    ]
  });
});
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderLarge v-if="$route.name=='home' || $route.name=='home-i18n'" />
      <HeaderSmall v-else />
    </div>
  </header>

  <div class="mt-16 mb-20 text-center md:text-left" :class="($route.name!=='home' && $route.name!='home-i18n') ? 'container' : ''">
    <RouterView />
  </div>

  <footer>
    <FooterArea />
  </footer>
</template>
