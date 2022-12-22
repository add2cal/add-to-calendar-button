<script setup lang="ts">
import { SwitchGroup, SwitchLabel, Switch } from '@headlessui/vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: String,
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue']);
</script>

<template>
  <SwitchGroup>
    <div class="flex items-center">
      <SwitchLabel :class="['mr-3 block text-sm text-zinc-500', required && 'required']" v-if="label"> {{ label }}: </SwitchLabel>
      <Switch
        :aria-label="label"
        value="{modelValue}"
        :class='modelValue ? "bg-primary-dark" : "bg-zinc-400 dark:bg-zinc-700"'
        class="relative inline-flex h-[24px] w-[40px] items-center rounded-full border border-zinc-300 shadow outline-none transition-colors hover:border-zinc-400 hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:border-zinc-500 dark:hover:border-zinc-400"
        @update:modelValue="$emit('update:modelValue', !modelValue)"
      >
        <span :class='modelValue ? "ml-[18px]" : "ml-[1px]"' class="inline-block h-[19px] w-[19px] transform rounded-full bg-white shadow-md outline-none transition dark:bg-zinc-900" />
      </Switch>
    </div>
  </SwitchGroup>
</template>
