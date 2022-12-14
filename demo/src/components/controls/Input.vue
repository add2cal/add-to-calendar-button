<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Array],
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text',
    required: true
  },
  placeholder: {
    type: String,
    required: false
  },
  min: {
    type: Number,
    required: false
  },
  max: {
    type: Number,
    required: false
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm text-zinc-400 dark:text-zinc-500 ', required && 'required']">
      {{ label }}
    </label>
    <div class="mt-1 flex items-center pl-2 pt-1 pb-2">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="block w-full flex-1 placeholder:text-xs focus:outline-none"
        :class="props.type == 'range' ? 'form-range cursor-ew-resize appearance-none bg-transparent p-0 focus:ring-0' : 'rounded-md bg-zinc-50 py-2 px-3 text-sm leading-5 shadow hover:bg-white hover:shadow-md focus:bg-white  focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:bg-zinc-600'"
        :type="props.type"
        :placeholder="props.placeholder"
        :min="props.min"
        :max="props.max"
        step="1"
      />
      <div v-if="props.type == 'range'" class="ml-3 inline-block min-w-[32px] cursor-default rounded-lg bg-zinc-100 py-1 px-2 text-center text-xs font-semibold opacity-70 dark:bg-zinc-700">{{ modelValue }}</div>
    </div>
  </div>
</template>
