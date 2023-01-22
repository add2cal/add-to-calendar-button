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
  },
  hidelabel: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue']);
</script>

<template>
  <SwitchGroup>
    <div class="flex items-center py-2">
      <SwitchLabel :class="['mr-2 block text-sm text-zinc-500', props.required && 'required', hidelabel ? 'hidden' : 'block']" v-if="props.label"> {{ props.label }}: </SwitchLabel>
      <Switch
        :aria-label="label"
        value="{modelValue}"
        :class='modelValue ? "bg-primary-dark dark:bg-primary" : "bg-zinc-400 dark:bg-zinc-700"'
        class="relative inline-flex h-[24px] w-[40px] items-center rounded-full border border-zinc-300 shadow outline-none transition-colors hover:border-zinc-400 hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:border-zinc-500 dark:hover:border-zinc-400"
        @update:modelValue="$emit('update:modelValue', !modelValue)"
      >
        <span :class='modelValue ? "ml-[18px] bg-white dark:bg-zinc-200" : "ml-[1px] bg-zinc-100 dark:bg-zinc-400"' class="inline-block h-[19px] w-[19px] transform rounded-full shadow-md outline-none transition" />
      </Switch>
    </div>
  </SwitchGroup>
</template>
