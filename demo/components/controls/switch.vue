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
  disabled: {
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
      <SwitchLabel v-if="props.label" :class="['mr-2 block text-sm text-zinc-500', props.required && 'required', hidelabel ? 'hidden' : 'block']"> {{ props.label }}: </SwitchLabel>
      <Switch v-if="props.disabled" :aria-label="label" class="relative inline-flex h-[24px] w-[40px] cursor-progress items-center rounded-full border border-zinc-300 bg-zinc-400 shadow dark:border-zinc-600 dark:bg-zinc-700">
        <span class="ml-[1px] inline-block h-[19px] w-[19px] rounded-full bg-zinc-200 shadow-md dark:bg-zinc-600" />
      </Switch>
      <Switch
        v-else
        :aria-label="label"
        value="{modelValue}"
        :class='modelValue ? "bg-primary-dark dark:bg-primary" : "bg-zinc-400 dark:bg-zinc-700"'
        class="focus-visible:ring-secondary/75 relative inline-flex h-[24px] w-[40px] items-center rounded-full border border-zinc-300 shadow outline-none transition-colors hover:border-zinc-400 hover:shadow-md focus:outline-none focus-visible:ring dark:border-zinc-500 dark:hover:border-zinc-400"
        @update:model-value="$emit('update:modelValue', !modelValue)"
      >
        <span :class='modelValue ? "ml-[18px] bg-white dark:bg-zinc-200" : "ml-[1px] bg-zinc-100 dark:bg-zinc-400"' class="inline-block h-[19px] w-[19px] rounded-full shadow-md outline-none transition" />
      </Switch>
    </div>
  </SwitchGroup>
</template>
