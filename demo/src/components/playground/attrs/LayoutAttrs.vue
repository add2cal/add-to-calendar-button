<script setup lang="ts">
import { computed } from 'vue';
import Autocomplete from '../../controls/Autocomplete.vue';
import Input from '../../controls/Input.vue';
import Select from '../../controls/Select.vue';
import Switch from '../../controls/Switch.vue';
import { ButtonStyle, LightMode, ListStyle, Option, OptionLabels, PastDateHandling, Size, Trigger } from '../../../models/addToCalendarButton';
import { HideIconOption, HideTextOption, LayoutAttrsKey, type LayoutAttrs } from '../../../models/attrs';
import { LanguageCode } from '../../../models/language';
import { usePlaygroundI18n } from '../../../utils/playground/i18n';

const props = defineProps<{ modelValue: LayoutAttrs; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [value: LayoutAttrs] }>();
const t = usePlaygroundI18n();
const label = (key: LayoutAttrsKey) => t(`labels.inputs.${key.toLowerCase()}`);
const optionList = (values: Record<string, string>) => Object.values(values).map((value) => ({ key: value, value }));
const languageOptions = Object.values(LanguageCode).map((value) => ({ key: `${t('languages.' + value)} (${value})`, value }));
const triggerOptions = computed(() => Object.values(Trigger).map((value) => ({ key: t(`options.trigger.${value}`), value })));
const iconOptions = computed(() => Object.entries(HideIconOption).map(([key, value]) => ({ key: t(`options.hide_icon.${key.toLowerCase()}`), value })));
const textOptions = computed(() => Object.entries(HideTextOption).map(([key, value]) => ({ key: t(`options.hide_text.${key.toLowerCase()}`), value })));
const calendarOptions = Object.values(Option).map((value) => ({ key: OptionLabels[value], value }));
const selectedIcons = computed(() => Object.keys(props.modelValue[LayoutAttrsKey.HIDE_ICON_OPTIONS]).filter((key) => props.modelValue[LayoutAttrsKey.HIDE_ICON_OPTIONS][key as HideIconOption]));
const selectedText = computed(() => Object.keys(props.modelValue[LayoutAttrsKey.HIDE_TEXT_OPTIONS]).filter((key) => props.modelValue[LayoutAttrsKey.HIDE_TEXT_OPTIONS][key as HideTextOption]));

function updateIcons(options: string[]) {
  Object.keys(props.modelValue[LayoutAttrsKey.HIDE_ICON_OPTIONS]).forEach((key) => {
    props.modelValue[LayoutAttrsKey.HIDE_ICON_OPTIONS][key as HideIconOption] = options.includes(key);
  });
}
function updateText(options: string[]) {
  Object.keys(props.modelValue[LayoutAttrsKey.HIDE_TEXT_OPTIONS]).forEach((key) => {
    props.modelValue[LayoutAttrsKey.HIDE_TEXT_OPTIONS][key as HideTextOption] = options.includes(key);
  });
}
</script>

<template>
  <div class="grid">
    <Select v-model="modelValue[LayoutAttrsKey.OPTIONS]" :disabled="disabled" multiselect :label="label(LayoutAttrsKey.OPTIONS)" :options="calendarOptions" by-key="key" by-value="value" class="z-20 mb-3 border-b border-zinc-400 pb-4 dark:border-zinc-600" />
    <div class="z-10 mb-3 flex items-center justify-between">
      <Select v-model="modelValue[LayoutAttrsKey.BUTTON_STYLE]" :disabled="disabled" :label="label(LayoutAttrsKey.BUTTON_STYLE)" :options="optionList(ButtonStyle)" by-key="key" by-value="value" class="mr-5 flex-1" />
      <Switch v-model="modelValue[LayoutAttrsKey.IS_BUTTONS_LIST]" :disabled="disabled" :label="label(LayoutAttrsKey.IS_BUTTONS_LIST)" class="pt-6 pb-0" />
    </div>
    <Input v-model="modelValue[LayoutAttrsKey.LABEL]" :disabled="disabled" :label="label(LayoutAttrsKey.LABEL)" type="text" class="mb-3" />
    <Select v-model="modelValue[LayoutAttrsKey.TRIGGER]" :disabled="disabled" :label="label(LayoutAttrsKey.TRIGGER)" :options="triggerOptions" by-key="key" by-value="value" class="mb-3" />
    <Select v-model="modelValue[LayoutAttrsKey.LIST_STYLE]" :disabled="disabled" :label="label(LayoutAttrsKey.LIST_STYLE)" :options="optionList(ListStyle)" by-key="key" by-value="value" class="mb-3" />
    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_BACKGROUND]" :disabled="disabled" :label="label(LayoutAttrsKey.HIDE_BACKGROUND)" class="mb-3" />
    <Select :model-value="selectedIcons" :disabled="disabled" :label="label(LayoutAttrsKey.HIDE_ICON_OPTIONS)" :options="iconOptions" by-key="key" by-value="value" multiselect class="mb-3" @update:model-value="updateIcons($event as string[])" />
    <Select :model-value="selectedText" :disabled="disabled" :label="label(LayoutAttrsKey.HIDE_TEXT_OPTIONS)" :options="textOptions" by-key="key" by-value="value" multiselect class="mb-3" @update:model-value="updateText($event as string[])" />
    <Switch v-model="modelValue[LayoutAttrsKey.HIDE_CHECKMARK]" :disabled="disabled" :label="label(LayoutAttrsKey.HIDE_CHECKMARK)" class="mb-3" />
    <Input v-model="modelValue[LayoutAttrsKey.SIZE]" :disabled="disabled" :label="label(LayoutAttrsKey.SIZE)" type="range" :min="Size.min" :max="Size.max" class="mb-3" />
    <Select v-model="modelValue[LayoutAttrsKey.LIGHT_MODE]" :disabled="disabled" :label="label(LayoutAttrsKey.LIGHT_MODE)" :options="optionList(LightMode)" by-key="key" by-value="value" class="mb-3" />
    <Select v-model="modelValue[LayoutAttrsKey.PAST_DATE_HANDLING]" :disabled="disabled" :label="label(LayoutAttrsKey.PAST_DATE_HANDLING)" :options="optionList(PastDateHandling)" by-key="key" by-value="value" class="mb-3" />
    <Autocomplete v-model="modelValue[LayoutAttrsKey.LANGUAGE]" :disabled="disabled" :label="label(LayoutAttrsKey.LANGUAGE)" :options="languageOptions" by-key="key" by-value="value" force-match />
  </div>
</template>
