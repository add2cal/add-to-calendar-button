<script setup lang="ts">
import { watch } from 'vue';
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
  // page title
  const title = (function () {
    if (rName != 'home' && rName != 'home-i18n') {
      return (
        t('navigation.' + rName) +
        ' | Add to Calendar Button'
      );
    }
    return 'Add to Calendar Button | ' + t('meta.titleSlug');
  })();
  document.title = `${title}`;
  const titleOgEl = document.querySelector('meta[property="og:title"]');
  if (titleOgEl) titleOgEl.setAttribute('content', `${title}`);
  const titleTwEl = document.querySelector('meta[name="twitter:title"');
  if (titleTwEl) titleTwEl.setAttribute('content', `${title}`);
  // keywords
  const keywordsEl = document.querySelector('meta[name="keywords"]');
  if (keywordsEl)
    keywordsEl.setAttribute('content', `${t('meta.keywords')}`);
  // description
  const descriptionEl = document.querySelector('meta[name="description"]');
  if (descriptionEl)
    descriptionEl.setAttribute(
      'content',
      `${t('meta.description')}`
    );
  const descriptionOgEl = document.querySelector(
    'meta[property="og:description"]'
  );
  if (descriptionOgEl)
    descriptionOgEl.setAttribute(
      'content',
      `${t('meta.description')}`
    );
  const descriptionTwEl = document.querySelector(
    'meta[name="twitter:description"'
  );
  if (descriptionTwEl)
    descriptionTwEl.setAttribute(
      'content',
      `${t('meta.description')}`
    );
  // hreflang entries
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
  const hreflangDefault = document.querySelector(
    'link[hreflang="x-default"]'
  );
  if (hreflangDefault) hreflangDefault.setAttribute('href', `${urlEn}`);
  const hreflangEn = document.querySelector('link[hreflang="en"]');
  if (hreflangEn) hreflangEn.setAttribute('href', `${urlEn}`);
  const hreflangDe = document.querySelector('link[hreflang="de"]');
  if (hreflangDe) hreflangDe.setAttribute('href', `${urlDe}`);
});
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderLarge v-if="$route.name=='home' || $route.name=='home-i18n'" />
      <HeaderSmall v-if="$route.name!=='home' && $route.name!='home-i18n'" />
    </div>
  </header>

  <div
    class="mt-16 mb-20 text-center md:text-left"
    :class="($route.name!=='home' && $route.name!='home-i18n') ? 'container max-w-screen-xl' : ''"
  >
    <RouterView />
  </div>

  <footer>
    <FooterArea />
  </footer>
</template>
