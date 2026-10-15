<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

const props = defineProps<{ options: string[]; label: string; placeholder: string; locale: string }>();
const query = ref('');
const open = ref(false);
const active = ref(-1);
const normalize = (value: string) => value.toLowerCase().replaceAll(/[\s_-]/g, '');
const filtered = computed(() => {
  const search = normalize(query.value);
  return (search ? props.options.filter((option) => normalize(option).includes(search)) : props.options).slice(0, 20);
});

const select = async (name: string) => {
  const target = document.getElementById(name);
  if (!target) return;
  query.value = name;
  open.value = false;
  history.replaceState(null, '', `#${name}`);
  await nextTick();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const move = (direction: number) => {
  if (!filtered.value.length) return;
  open.value = true;
  active.value = (active.value + direction + filtered.value.length) % filtered.value.length;
};
const close = () => window.setTimeout(() => (open.value = false), 100);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    move(event.key === 'ArrowDown' ? 1 : -1);
  } else if (event.key === 'Enter' && open.value && active.value >= 0) {
    event.preventDefault();
    void select(filtered.value[active.value]);
  } else if (event.key === 'Escape') {
    open.value = false;
  }
};
</script>

<template>
  <div class="relative w-full">
    <label for="configuration-search" class="sr-only">{{ label }}</label>
    <input
      id="configuration-search"
      v-model="query"
      type="search"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-controls="configuration-search-options"
      :aria-expanded="open"
      :aria-activedescendant="active >= 0 ? `configuration-option-${active}` : undefined"
      :placeholder="placeholder"
      class="input-primary max-w-none"
      @focus="open = true"
      @input="
        active = -1;
        open = true;
      "
      @blur="close"
      @keydown="handleKeydown"
    />
    <ul v-if="open" id="configuration-search-options" role="listbox" class="absolute z-20 !mt-1 !mb-0 !ml-0 max-h-72 w-full !list-none overflow-y-auto rounded-xl border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-700 dark:bg-stone-800">
      <li v-for="(option, index) in filtered" :id="`configuration-option-${index}`" :key="option" role="option" :aria-selected="index === active" :class="index === active && 'bg-primary text-white'" class="hover:bg-primary cursor-pointer rounded-lg px-3 py-2.5 text-sm hover:text-white" @mouseenter="active = index" @mousedown.prevent="select(option)">
        {{ option }}
      </li>
      <li v-if="!filtered.length" class="px-3 py-2.5 text-sm text-stone-500">{{ placeholder }}</li>
    </ul>
  </div>
</template>
