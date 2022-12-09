<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: [String, Number, Array],
  label: String,
  required: {
    type: Boolean,
    default: false
  },
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label
      v-if="label"
      :class="['block text-sm font-medium text-gray-700 ', required && 'required']"
    >
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full rounded-md border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-none focus:border-none focus:ring-0"
      v-bind="{
        type: $attrs.type,
        placeholder: $attrs.placeholder,
        min: $attrs.min,
        max: $attrs.max,
      }"
    />
  </div>
</template>
