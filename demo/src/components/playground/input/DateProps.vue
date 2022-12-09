<script setup lang="ts">
import { ref, computed } from "vue";
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
import Recurrence from "@/components/playground/input/props/recurrence/Recurrence.vue";
import { getAvailableTimezones } from "@/utils/timezone.js";
import { Status, Availability, Option } from "@/models/addToCalendarButton";

const data = ref({
  name: "",
  description: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  timezone: null,
  location: "",
  status: "",
  organizer: {
    name: "",
    email: ""
  },
  iscFile: "",
  recurrence: {
    isSimple: true,
    recurrence: "",
    recurrenceInterval: 0,
    recurrenceCount: 0,
    recurrenceByDay: "",
    recurrenceByMonth: [],
    recurrenceByMonthDay: ""
  },
  availability: "",
  isSubscribed: false,
  options: [Option.APPLE, Option.GOOGLE, Option.ICAL, Option.OUTLOOK, Option.YAHOO],
  iCalFileName: ""
});
const timezoneOptions = getAvailableTimezones();
</script>

<template>
  <div class="grid">
    <Input v-model="data.name" required label="Name" class="mb-3" />
    <Input v-model="data.description" label="Description" class="mb-3" />
    <Input v-model="data.startDate" label="Start date" placeholder="YYYY-MM-DD" class="mb-3" />
    <Input v-model="data.startTime" label="Start time" placeholder="HH:MM" class="mb-3" />
    <Input v-model="data.endDate" label="End date" placeholder="YYYY-MM-DD" class="mb-3" />
    <Input v-model="data.endTime" label="End time" placeholder="HH:MM" class="mb-3" />
    <Combobox label="Timezone" :options="timezoneOptions" v-model="data.timezone" class="mb-3" />
    <Input v-model="data.location" label="Location" class="mb-3" />
    <Select v-model="data.status" label="Status" :options="Object.values(Status)" class="mb-3" />
    <Input v-model="data.organizer.name" label="Organizer Name" class="mb-3" />
    <Input v-model="data.organizer.email" label="Organizer Email" class="mb-3" />

    <Input v-model="data.iscFile" label="*.isc file" placeholder="https://..." class="mb-3" />
    <Recurrence v-model="data.recurrence" />
    <Select v-model="data.availability" label="Availability" :options="Object.values(Availability)" class="mb-3" />
    <Switch v-model="data.isSubscribed" label="Subscribe" class="mb-3" />

    <Select v-model="data.options" multiselect required label="Options" :options="Object.values(Option)" class="mb-3" />

    <Input v-model="data.iCalFileName" label="iCalFileName" class="mb-3" />
  </div>
</template>
