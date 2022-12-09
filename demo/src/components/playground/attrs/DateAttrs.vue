<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import Input from "@/components/controls/Input.vue";
import Combobox from "@/components/controls/Combobox.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import Recurrence from "@/components/playground/attrs/recurrence/Recurrence.vue";
import { getAvailableTimezones } from "@/utils/timezone.js";
import { Status, Availability, Option } from "@/models/addToCalendarButton";
import { getDefaultDateAttrs } from "@/utils/attrs";
import { DateAttrsKey } from "@/models/attrs";

defineProps({
  modelValue: {
    type: Object,
    default: getDefaultDateAttrs()
  },
});
const timezoneOptions = getAvailableTimezones();
</script>

<template>
  <div class="grid">
    <Input
      v-model="modelValue[DateAttrsKey.NAME]"
      required
      label="Name"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.DESCRIPTION]"
      label="Description"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.START_DATE]"
      label="Start date"
      placeholder="YYYY-MM-DD"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.START_TIME]"
      label="Start time"
      placeholder="HH:MM"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.END_DATE]"
      label="End date"
      placeholder="YYYY-MM-DD"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.END_TIME]"
      label="End time"
      placeholder="HH:MM"
      class="mb-3"
    />
    <Combobox
      label="Timezone"
      :options="timezoneOptions"
      v-model="modelValue[DateAttrsKey.TIMEZONE]"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.LOCATION]"
      label="Location"
      class="mb-3"
    />
    <Select
      v-model="modelValue[DateAttrsKey.STATUS]"
      label="Status"
      :options="Object.values(Status)"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_NAME]"
      label="Organizer Name"
      class="mb-3"
    />
    <Input
      v-model="modelValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_EMAIL]"
      label="Organizer Email"
      class="mb-3"
    />

    <Input
      v-model="modelValue[DateAttrsKey.ISC_FILE]"
      label="*.isc file"
      placeholder="https://..."
      class="mb-3"
    />
    <Recurrence v-model="modelValue[DateAttrsKey.RECURRENCE_OBJECT]" />
    <Select
      v-model="modelValue[DateAttrsKey.AVAILABILITY]"
      label="Availability"
      :options="Object.values(Availability)"
      class="mb-3"
    />
    <Switch
      v-model="modelValue[DateAttrsKey.IS_SUBSCRIBED]"
      label="Subscribe"
      class="mb-3"
    />

    <Select
      v-model="modelValue[DateAttrsKey.OPTIONS]"
      multiselect
      required
      label="Options"
      :options="Object.values(Option)"
      class="mb-3"
    />

    <Input
      v-model="modelValue[DateAttrsKey.ICAL_FILE_NAME]"
      label="iCalFileName"
      class="mb-3"
    />
  </div>
</template>
