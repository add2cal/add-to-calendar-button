<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import Autocomplete from '../../controls/Autocomplete.vue';
import { providePlaygroundI18n, type PlaygroundLocale } from '../../../utils/playground/i18n';

const props = defineProps<{ options: string[]; label: string; placeholder: string; locale: PlaygroundLocale }>();
providePlaygroundI18n(props.locale);
const selection = ref<string | null>(null);

watch(selection, async (name) => {
  if (!name) return;
  document.getElementById(name)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${name}`);
  selection.value = null;
  await nextTick();
});
</script>

<template>
  <Autocomplete v-model="selection" :options="options" :label="label" :placeholder="placeholder" hidelabel style-class="" />
</template>
