<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel, provideUseId } from '@headlessui/vue';
import { useId } from 'vue';

provideUseId(() => useId());
defineProps<{ modelValue?: boolean; label?: string; required?: boolean; disabled?: boolean; hidelabel?: boolean }>();
defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <SwitchGroup>
    <div class="flex items-center py-2">
      <SwitchLabel v-if="label" :class="['mr-2 text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">{{ label }}:</SwitchLabel>
      <Switch
        :model-value="modelValue"
        :disabled="disabled"
        :aria-label="label"
        :class="[modelValue ? 'bg-primary-dark dark:bg-primary' : 'bg-zinc-400 dark:bg-zinc-700', disabled ? 'cursor-progress opacity-70' : 'cursor-pointer']"
        class="focus-visible:ring-secondary/75 relative inline-flex h-6 w-10 items-center rounded-full border border-zinc-300 shadow transition-colors outline-none hover:border-zinc-400 hover:shadow-md focus-visible:ring dark:border-zinc-500"
        @update:model-value="$emit('update:modelValue', $event)"
      >
        <span :class="modelValue ? 'ml-[18px] bg-white dark:bg-zinc-200' : 'ml-px bg-zinc-100 dark:bg-zinc-400'" class="inline-block h-[19px] w-[19px] rounded-full shadow-md transition" />
      </Switch>
    </div>
  </SwitchGroup>
</template>
