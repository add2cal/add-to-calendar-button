<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
</script>

<template>
  <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">{{ t('navigation.legal-notice') }}</h1>
  <p>{{ t('content.legal.intro') }}</p>
  <p class="select-none pt-6 text-sm">
    <strong>Peltmonger Projects</strong><br />
    Jens K&uuml;rschner<br />
    Tal 44<br />
    80331 M&uuml;nchen<br />
    GERMANY<br />
    <br />
    <span style="display:none; ">are-</span><span style="display:inline; ">&#x6D;&#x61;&#x69;&#x6C;</span><span style="display:none; ">-xya34</span><span style="display:inline; ">[at]</span><span style="display:none; ">ddks-</span
    ><span style="display:inline; ">&#97;&#100;&#100;&#45;&#116;&#111;&#45;&#99;&#97;&#108;&#101;&#110;&#100;&#97;&#114;&#45;&#112;&#114;&#111;&#46;&#99;&#111;&#109;</span>
  </p>
</template>
