<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps({
  modelValue: [String, Number, Array],
  label: String,
  type: String,
  required: {
    type: Boolean,
    default: false
  },
  placeholder: String
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label
      v-if="label"
      :class="['block text-sm font-medium text-gray-700 ', required && 'required']"
    >
      {{ t(label) }}
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder && t(placeholder)"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full rounded-md border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-none focus:border-none focus:ring-0"
    />
  </div>
</template>
