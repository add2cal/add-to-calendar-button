<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import Input from "@/components/controls/Input.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import { ListStyle, ButtonStyle, Trigger, LightMode, Size } from "@/models/addToCalendarButton";
import { Language } from "@/models/language";
import { getDefaultLayoutAttrs } from "@/utils/attrs";
import { LayoutAttrsKey } from "@/models/attrs";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Object,
    default: getDefaultLayoutAttrs()
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue || getDefaultLayoutAttrs());

const { t } = useI18n();

watch(internalValue, () => {
  emit('update:modelValue', internalValue);
}, { deep: true });
</script>

<template>
  <div class="grid">
    <Select v-model="internalValue[LayoutAttrsKey.LIST_STYLE]" :label="t(`labels.inputs.${[LayoutAttrsKey.LIST_STYLE]}`.toLocaleLowerCase())" :options="Object.values(ListStyle)" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.BUTTON_STYLE]" :label="t(`labels.inputs.${[LayoutAttrsKey.BUTTON_STYLE]}`.toLocaleLowerCase())" :options="Object.values(ButtonStyle)" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.TRIGGER]" :label="t(`labels.inputs.${[LayoutAttrsKey.TRIGGER]}`.toLocaleLowerCase())" :options="Object.values(Trigger)" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_ICON_BUTTON]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_ICON_BUTTON]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_ICON_LIST]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_ICON_LIST]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_ICON_MODAL]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_ICON_MODAL]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_TEXT_LABEL_BUTTON]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_TEXT_LABEL_BUTTON]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_TEXT_LABEL_LIST]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_TEXT_LABEL_LIST]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.IS_BUTTONS_LIST]" :label="t(`labels.inputs.${[LayoutAttrsKey.IS_BUTTONS_LIST]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_BACKGROUND]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_BACKGROUND]}`.toLocaleLowerCase())" class="mb-3" />

    <Switch v-model="internalValue[LayoutAttrsKey.HIDE_CHECKMARK]" :label="t(`labels.inputs.${[LayoutAttrsKey.HIDE_CHECKMARK]}`.toLocaleLowerCase())" class="mb-3" />

    <Input v-model="internalValue[LayoutAttrsKey.SIZE]" :label="t(`labels.inputs.${[LayoutAttrsKey.SIZE]}`.toLocaleLowerCase())" type="number" :min="Size.min" :max="Size.max" placeholder="0-10" class="mb-3" />

    <Input v-model="internalValue[LayoutAttrsKey.LABEL]" :label="t(`labels.inputs.${[LayoutAttrsKey.LABEL]}`.toLocaleLowerCase())" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.LIGHT_MODE]" :label="t(`labels.inputs.${[LayoutAttrsKey.LIGHT_MODE]}`.toLocaleLowerCase())" :options="Object.values(LightMode)" class="mb-3" />

    <Select v-model="internalValue[LayoutAttrsKey.LANGUAGE]" :label="t(`labels.inputs.${[LayoutAttrsKey.LANGUAGE]}`.toLocaleLowerCase())" :options="Object.values(Language)" class="mb-3" />
  </div>
</template>
