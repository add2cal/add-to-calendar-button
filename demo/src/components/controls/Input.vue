<script setup lang="ts">
defineProps<{
  modelValue?: string | number | unknown[];
  label?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  hidelabel?: boolean;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div>
    <label v-if="label" :class="['text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">{{ label }}</label>
    <div class="flex items-center py-2 pl-2">
      <template v-if="type !== 'range'">
        <input v-if="disabled" :type="type || 'text'" :placeholder="placeholder" disabled :aria-label="label" class="block w-full flex-1 cursor-progress rounded-md bg-zinc-50 px-3 py-2 text-sm leading-5 shadow placeholder:text-xs dark:bg-zinc-700" :value="modelValue" />
        <input
          v-else
          :aria-label="label"
          :value="modelValue"
          class="caret-secondary focus-visible:ring-secondary/75 block w-full flex-1 rounded-md bg-zinc-50 px-3 py-2 text-sm leading-5 shadow placeholder:text-xs hover:bg-white hover:shadow-md focus:bg-white focus:outline-none focus-visible:ring dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:bg-zinc-600"
          :type="type || 'text'"
          :placeholder="placeholder"
          :min="min"
          :max="max"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </template>
      <template v-else>
        <input :aria-label="label" :value="disabled ? 6 : modelValue" class="form-range block w-full flex-1 appearance-none bg-transparent p-0 focus:outline-none" type="range" :min="min" :max="max" step="1" :disabled="disabled" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
        <div class="ml-3 inline-block min-w-8 cursor-default rounded-lg bg-zinc-100 px-2 py-1 text-center text-xs font-semibold opacity-70 dark:bg-zinc-700">{{ disabled ? '-' : modelValue }}</div>
      </template>
    </div>
  </div>
</template>

<style>
@reference '../../styles/tailwind.config.css';
input[type='range']::-webkit-slider-runnable-track {
  @apply h-2 w-full rounded-md bg-zinc-300 shadow-inner dark:bg-zinc-700;
}
input[type='range']::-webkit-slider-thumb {
  @apply -mt-2 block h-6 w-6 cursor-pointer appearance-none rounded-full bg-white shadow-inner drop-shadow-md dark:bg-zinc-400;
}
input[type='range']:hover:not(:disabled)::-webkit-slider-runnable-track {
  @apply bg-zinc-400 dark:bg-zinc-600;
}
input[type='range']:hover:not(:disabled)::-webkit-slider-thumb,
input[type='range']:focus:not(:disabled)::-webkit-slider-thumb {
  @apply bg-secondary;
}
input[type='range']::-moz-range-track {
  @apply h-2 w-full rounded-md bg-zinc-300 shadow-inner dark:bg-zinc-700;
}
input[type='range']::-moz-range-thumb {
  @apply h-6 w-6 rounded-full border-0 bg-white shadow-inner dark:bg-zinc-400;
}
input[type='range']:focus:not(:disabled)::-moz-range-thumb {
  @apply bg-secondary;
}
</style>
