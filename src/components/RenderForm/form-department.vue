<template>
  <DepartmentTree v-model="localValue" v-bind="item.props"> </DepartmentTree>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import DepartmentTree from "./DepartmentTree.vue";

import type { FormItemType } from "wltech-ui";

type valueType = string | undefined;
const props = defineProps({
  modelValue: {
    type: [String, undefined] as PropType<valueType>,
    default: "",
  },
  item: {
    type: Object as PropType<FormItemType>,
    required: true,
  },
});
const emit = defineEmits<{
  (e: "update:modelValue", value: valueType): void;
}>();

const localValue = ref<valueType>();

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val;
  },
  {
    immediate: true,
  }
);

watch(
  () => localValue.value,
  (val: valueType) => {
    emit("update:modelValue", val && val.trim());
  }
);
</script>
