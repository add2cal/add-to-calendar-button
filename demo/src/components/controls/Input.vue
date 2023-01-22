<script setup lang="ts">
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
  },
  hidelabel: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm text-zinc-500 ', required && 'required', hidelabel ? 'hidden' : 'block']">
      {{ label }}
    </label>
    <div class="flex items-center py-2 pl-2">
      <input
        :aria-label="label"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="block w-full flex-1 placeholder:text-xs focus:outline-none"
        :class="props.type == 'range' ? 'form-range cursor-ew-resize appearance-none bg-transparent p-0 focus:ring-0' : 'rounded-md bg-zinc-50 py-2 px-3 text-sm leading-5 shadow hover:bg-white hover:shadow-md focus:bg-white focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:bg-zinc-600'"
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

<style>
input[type=range]::-webkit-slider-runnable-track {
  @apply rounded-md bg-zinc-300 h-2 w-full shadow-inner dark:bg-zinc-700;
}
input[type=range]::-webkit-slider-thumb {
  @apply rounded-full h-6 w-6 -mt-2 block appearance-none bg-white dark:bg-zinc-400 shadow-inner drop-shadow-md;
}
input[type=range]:hover::-webkit-slider-runnable-track {
  @apply bg-zinc-400 dark:bg-zinc-600;
}
input[type=range]:hover::-webkit-slider-thumb,
input[type=range]:focus::-webkit-slider-thumb {
  @apply bg-secondary;
}
input[type=range]::-moz-range-track {
  @apply rounded-md bg-zinc-300 h-2 w-full shadow-inner dark:bg-zinc-700;
}
input[type=range]::-moz-range-thumb {
  @apply rounded-md bg-white dark:bg-zinc-400 h-2 w-full shadow-inner;
}
input[type=range]:focus::-moz-range-thumb {
  @apply bg-secondary;
}
input[type=range]::-ms-track {
  @apply rounded-md bg-transparent border-transparent text-transparent h-2 w-full;
}
input[type=range]::-ms-fill-lower {
  @apply rounded-md bg-zinc-300 dark:bg-zinc-700;
}
input[type=range]::-ms-fill-upper {
  @apply rounded-md bg-zinc-300 dark:bg-zinc-700;
}
input[type=range]::-ms-thumb {
  @apply rounded-full h-6 w-6 -mt-2 block appearance-none bg-white dark:bg-zinc-400 shadow-inner drop-shadow-md;
}
input[type=range]:focus::-ms-fill-lower {
  @apply bg-secondary;
}
input[type=range]:focus::-ms-fill-upper {
  @apply bg-secondary;
}
</style>
