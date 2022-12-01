<script setup lang="ts">
import { defineProps, ref, defineEmits } from 'vue';
import { SwitchGroup, SwitchLabel, Switch } from '@headlessui/vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: String,
  required: {
    type: Boolean,
    default: false
  },
})

defineEmits(['update:modelValue']);
</script>

<template>
  <SwitchGroup>
    <div class="flex items-center">
      <SwitchLabel
        :class="['mr-4 block text-sm font-medium text-gray-700', required && 'required']"
        v-if="label"
      >
        {{ t(label) }}
      </SwitchLabel>
      <Switch
        :value="!!modelValue"
        :class='modelValue ? "bg-blue-600" : "bg-gray-400"'
        class="relative inline-flex h-6 w-11 items-center rounded-full outline-none transition-colors focus:outline-none"
        @update:modelValue="$emit('update:modelValue', !modelValue)"
      >
        <span
          :class='modelValue ? "translate-x-6" : "translate-x-1"'
          class="inline-block h-4 w-4 transform rounded-full bg-white outline-none transition-transform"
        />
      </Switch>
    </div>
  </SwitchGroup>
</template>
