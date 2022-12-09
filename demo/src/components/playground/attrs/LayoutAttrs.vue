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
import { Status, Availability, Option, ListStyle, ButtonStyle, Trigger, LightMode, Size } from "@/models/addToCalendarButton";
import { Language } from "@/models/language";
import { getDefaultLayoutAttrs } from "@/utils/attrs";
import { LayoutAttrsKey } from "@/models/attrs";

defineProps({
  modelValue: {
    type: Object,
    default: getDefaultLayoutAttrs()
  },
});
const timezoneOptions = getAvailableTimezones();
</script>

<template>
  <div class="grid">
    <Select v-model="modelValue[LayoutAttrsKey.LIST_STYLE]" label="List Style" :options="Object.values(ListStyle)" class="mb-3" />

    <Select v-model="modelValue[LayoutAttrsKey.BUTTON_STYLE]" label="Button Style" :options="Object.values(ButtonStyle)" class="mb-3" />

    <Select v-model="modelValue[LayoutAttrsKey.TRIGGER]" label="Trigger" :options="Object.values(Trigger)" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_ICON_BUTTON]" label="Hide Icon Button" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_ICON_LIST]" label="Hide Icon List" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_ICON_MODAL]" label="Hide Icon Modal" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_TEXT_LABEL_BUTTON]" label="Hide Text Label Button" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_TEXT_LABEL_LIST]" label="Hide Text Label List" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.IS_BUTTONS_LIST]" label="Button list mode" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_BACKGROUND]" label="Hide Background" class="mb-3" />

    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_CHECKMARK]" label="Hide Checkmark" class="mb-3" />

    <Input v-model="modelValue[LayoutAttrsKey.SIZE]" label="Size" type="number" :min="Size.min" :max="Size.max" placeholder="0-10" class="mb-3" />

    <Input v-model="modelValue[LayoutAttrsKey.LABEL]" label="Label" class="mb-3" />

    <Select v-model="modelValue[LayoutAttrsKey.LIGHT_MODE]" label="Light Mode" :options="Object.values(LightMode)" class="mb-3" />

    <Select v-model="modelValue[LayoutAttrsKey.LANGUAGE]" label="Language" :options="Object.values(Language)" class="mb-3" />
  </div>
</template>
