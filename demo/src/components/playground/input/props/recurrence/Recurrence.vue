<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import Input from "@/components/controls/Input.vue";
import Combobox from "@/components/controls/Combobox.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import { getMonthList } from "@/utils/date.js";

defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      isSimple: true,
      recurrence: "",
      recurrenceInterval: 0,
      recurrenceCount: 0,
      recurrenceByDay: "",
      recurrenceByMonth: [],
      recurrenceByMonthDay: ""
    })
  },
});

const monthList = getMonthList();
</script>

<template>
  <div class="grid">
    <Switch
      label="Simply Reccurence Input"
      class="mb-3"
      v-model="modelValue.isSimple"
    />

    <Input
      v-if="!modelValue.isSimple"
      v-model="modelValue.recurrence"
      label="Recurrence"
      placeholder="RRULE :FREQ=…"
      class="mb-3"
    />

    <template v-else>
      <Input
        v-model="modelValue.recurrenceInterval"
        label="Recurrence Interval"
        type="number"
        class="mb-3"
      />
      <Input
        v-model="modelValue.recurrenceCount"
        label="Recurrence Count"
        type="number"
        class="mb-3"
      />
      <Input
        v-model="modelValue.recurrenceByDay"
        label="Recurrence by Day"
        placeholder="e.g. “MO,SA” or “-2MO"
        class="mb-3"
      />
      <Select
        v-model="modelValue.recurrenceByMonth"
        :options="monthList"
        label="Recurrence by Month"
        multiselect
        class="mb-3"
        byKey="key"
        byValue="value"
      />
      <Input
        v-model="modelValue.recurrenceByMonthDay"
        label="Recurrence by Month Day"
        placeholder="e.g. “4,5”"
        class="mb-3"
      />
    </template>
  </div>
</template>
