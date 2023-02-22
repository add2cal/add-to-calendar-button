<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  label: Boolean,
});
</script>

<template>
  <div>
    <label v-if="label" class="hidden pr-5 text-sm text-zinc-500 sm:inline-block">{{ $t('content.config.find_params') }}: </label>
    <div class="relative" :class="label ? 'block sm:inline-block' : 'block w-full'">
      <div class="relative">
        <div class="group mt-1 grid w-full cursor-progress rounded-md bg-zinc-50 shadow dark:bg-zinc-700">
          <div class="w-60 rounded-md bg-zinc-50 py-2 pr-10 pl-3 text-left text-sm text-gray-400 dark:bg-zinc-700">{{ $t('labels.inputs.search') }}</div>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
