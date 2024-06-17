<script setup lang="ts">
const props = defineProps({
  modelValue: [String, Number, Array],
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
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
    <label v-if="label" :class="['block text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">
      {{ label }}
    </label>
    <div class="flex items-center py-2 pl-2">
      <template v-if="props.type !== 'range'">
        <input v-if="props.disabled" :type="props.type" :placeholder="props.placeholder" disabled :aria-label="label" class="block w-full flex-1 cursor-progress rounded-md bg-zinc-50 px-3 py-2 text-sm leading-5 shadow dark:bg-zinc-700" :value="modelValue" />
        <input
          v-else
          :aria-label="label"
          :value="modelValue"
          class="block w-full flex-1 caret-secondary placeholder:text-xs focus:outline-none rounded-md bg-zinc-50 px-3 py-2 text-sm leading-5 shadow hover:bg-white hover:shadow-md focus:bg-white focus-visible:ring focus-visible:ring-secondary/75 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:bg-zinc-600"
          :type="props.type"
          :placeholder="props.placeholder"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
      </template>
      <template v-else>
        <input v-if="props.disabled" :placeholder="props.placeholder" :aria-label="label" type="range" :min="props.min" :value="6" :max="props.max" disabled class="form-range block w-full flex-1 cursor-progress appearance-none bg-transparent p-0" />
        <input
          v-else
          :aria-label="label"
          :value="modelValue"
          class="block w-full flex-1 caret-secondary placeholder:text-xs focus:outline-none form-range cursor-ew-resize appearance-none bg-transparent p-0 focus:ring-0'"
          type="range"
          :placeholder="props.placeholder"
          :min="props.min"
          :max="props.max"
          step="1"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <div class="ml-3 inline-block min-w-[32px] cursor-default rounded-lg bg-zinc-100 px-2 py-1 text-center text-xs font-semibold opacity-70 dark:bg-zinc-700">{{ props.disabled ? '-' : modelValue }}</div>
      </template>
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
input[type=range]:hover:not(:disabled)::-webkit-slider-runnable-track {
  @apply bg-zinc-400 dark:bg-zinc-600;
}
input[type=range]:hover:not(:disabled)::-webkit-slider-thumb,
input[type=range]:focus:not(:disabled)::-webkit-slider-thumb {
  @apply bg-secondary;
}
input[type=range]::-moz-range-track {
  @apply rounded-md bg-zinc-300 h-2 w-full shadow-inner dark:bg-zinc-700;
}
input[type=range]::-moz-range-thumb {
  @apply rounded-md bg-white dark:bg-zinc-400 h-2 w-full shadow-inner;
}
input[type=range]:focus:not(:disabled)::-moz-range-thumb {
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
input[type=range]:focus:not(:disabled)::-ms-fill-lower {
  @apply bg-secondary;
}
input[type=range]:focus:not(:disabled)::-ms-fill-upper {
  @apply bg-secondary;
}
</style>
