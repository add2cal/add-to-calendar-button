<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from "vue";
import Input from "@/components/controls/Input.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import { ListStyle, ButtonStyle, Trigger, LightMode, Size, Option } from "@/models/addToCalendarButton";
import { LanguageCode, LanguageNames } from "@/models/language";
import { getDefaultLayoutAttrs } from "@/utils/attrs";
import { LayoutAttrsKey, HideIconOption, HideTextOption } from "@/models/attrs";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    default: getDefaultLayoutAttrs()
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue || getDefaultLayoutAttrs());

watch(internalValue, () => {
  emit('update:modelValue', internalValue);
}, { deep: true });

const languageOptions = computed(() =>
  Object.values(LanguageCode).map((item) =>
    ({
      key: LanguageNames[item] +  ` (${item})`,
      value: item
    })
  )
)

const i18nHideIconOptions = computed(() =>
  Object.keys(HideIconOption).map((key: string) =>
    ({
      key: t(`options.hide_icon.${key}`.toLowerCase()),
      value: HideIconOption[key as keyof typeof HideIconOption]
    })
  )
)

const i18nHideTextOptions = computed(() =>
  Object.keys(HideTextOption).map((key: string) =>
    ({
      key: t(`options.hide_text.${key}`.toLowerCase()),
      value: HideTextOption[key as keyof typeof HideTextOption]
    })
  )
)

function onHideIconOptionsUpdate(options: string[]) {
  Object.keys(internalValue.value[LayoutAttrsKey.HIDE_ICON_OPTIONS]).forEach((key) => {
    internalValue.value[LayoutAttrsKey.HIDE_ICON_OPTIONS][key] = options.includes(key);
  });
}

function onHideTextOptionsUpdate(options: string[]) {
  Object.keys(internalValue.value[LayoutAttrsKey.HIDE_TEXT_OPTIONS]).forEach((key) => {
    internalValue.value[LayoutAttrsKey.HIDE_TEXT_OPTIONS][key] = options.includes(key);
  });
}
</script>

<template>
  <div class="grid">
    <Select v-model="internalValue[LayoutAttrsKey.OPTIONS]" multiselect required :label="t(`labels.inputs.${[LayoutAttrsKey.OPTIONS]}`.toLocaleLowerCase())" :options="Object.values(Option)" class="mb-3 border-b border-zinc-300 pb-4 dark:border-zinc-600" />

    <div class="mb-3 flex items-center justify-between">
      <Select v-model="internalValue[LayoutAttrsKey.BUTTON_STYLE]" :label="t(`labels.inputs.${[LayoutAttrsKey.BUTTON_STYLE]}`.toLocaleLowerCase())" :options="Object.values(ButtonStyle)" class="mr-5 flex-1" />
      <Switch v-model="internalValue[LayoutAttrsKey.IS_BUTTONS_LIST]" :label="t(`labels.inputs.${[LayoutAttrsKey.IS_BUTTONS_LIST]}`.toLocaleLowerCase())" class="pt-6" />
    </div>
    <Input v-model="internalValue[LayoutAttrsKey.LABEL]" :label="t(`labels.inputs.${[LayoutAttrsKey.LABEL]}`.toLocaleLowerCase())" type="text" class="mb-3" />
    <Select v-model="internalValue[LayoutAttrsKey.TRIGGER]" :label="t(`labels.inputs.${[LayoutAttrsKey.TRIGGER]}`.toLocaleLowerCase())" :options="Object.values(Trigger)" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.LIST_STYLE]" :label="t(`labels.inputs.${[LayoutAttrsKey.LIST_STYLE]}`.toLocaleLowerCase())" :options="Object.values(ListStyle)" class="mb-3" />
    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_BACKGROUND]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_BACKGROUND]}`.toLocaleLowerCase())" class="mb-3" />

    <Select
      :modelValue="Object.keys(internalValue[LayoutAttrsKey.HIDE_ICON_OPTIONS]).filter((key) => !!internalValue[LayoutAttrsKey.HIDE_ICON_OPTIONS][key])"
      :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_ICON_OPTIONS]}`.toLocaleLowerCase())"
      :options="i18nHideIconOptions"
      byKey="key"
      byValue="value"
      multiselect
      class="mb-3"
      @update:modelValue="onHideIconOptionsUpdate"
    />
    <Select
      :modelValue="Object.keys(internalValue[LayoutAttrsKey.HIDE_TEXT_OPTIONS]).filter((key) => !!internalValue[LayoutAttrsKey.HIDE_TEXT_OPTIONS][key])"
      :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_TEXT_OPTIONS]}`.toLocaleLowerCase())"
      :options="i18nHideTextOptions"
      byKey="key"
      byValue="value"
      multiselect
      class="mb-3"
      @update:modelValue="onHideTextOptionsUpdate"
    />
    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_CHECKMARK]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_CHECKMARK]}`.toLocaleLowerCase())" class="mb-3" />

    <Input v-model="internalValue[LayoutAttrsKey.SIZE]" :label="t(`labels.inputs.${[LayoutAttrsKey.SIZE]}`.toLocaleLowerCase())" type="range" :min="Size.min" :max="Size.max" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.LIGHT_MODE]" :label="t(`labels.inputs.${[LayoutAttrsKey.LIGHT_MODE]}`.toLocaleLowerCase())" :options="Object.values(LightMode)" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.LANGUAGE]" :label="t(`labels.inputs.${[LayoutAttrsKey.LANGUAGE]}`.toLocaleLowerCase())" :options="languageOptions" byKey="key" byValue="value" />
  </div>
</template>
