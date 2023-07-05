<template>
  <el-dialog
    v-model="state.dialogVisible"
    :width="dialogWidth"
    :title="title"
    v-bind="$attrs"
    :center="center"
    @closed="onClose"
    :class="computedClass"
  >
    <template #title v-if="!showHeader">
      <slot name="header"></slot>
    </template>
    <slot />
    <template #footer v-if="showFooter">
      <slot name="footer">
        <span class="dialog-footer flex-center">
          <el-button @click="state.dialogVisible = false" class="button_item">{{
            cancelButtonText
          }}</el-button>
          <el-button
            :disabled="submitBtnDisabled"
            type="primary"
            class="button_item"
            @click.stop="onSubmit"
            :loading="subLoading"
            >确 定</el-button
          >
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { debounce } from "lodash-es";
import { reactive, computed, toRefs, watch } from "vue";

const props = withDefaults(
  defineProps<{
    value: boolean;
    size?: string;
    title: string;
    subLoading?: boolean;
    showFooter: boolean;
    submitBtnDisabled?: boolean;
    center?: boolean;
    cancelButtonText?: string;
    customClass: string;
    showHeader?: boolean;
  }>(),
  {
    value: false,
    size: "small",
    title: "",
    subLoading: false,
    showFooter: true,
    submitBtnDisabled: false,
    center: true,
    cancelButtonText: "取 消",
    customClass: "",
    showHeader: true,
  }
);
const state = reactive<{
  dialogVisible: boolean;
  isSubmit: boolean;
}>({
  dialogVisible: false,
  isSubmit: false,
});
const emit = defineEmits<{
  (e: "update:value", val: boolean);
  (e: "cancel");
  (e: "onSure");
}>();
const computedClass = computed(() => {
  return props.center
    ? `${props.customClass} custom-dialog`
    : `${props.customClass} custom-dialog header_left`;
});
const dialogWidth = computed(() => {
  if (props.size === "small") {
    return "552px";
  } else if (props.size === "normal") {
    return "1000px";
  }
  return props.size || "1000px";
});

const onClose = () => {
  emit("update:value", false);
  if (!state.isSubmit) {
    emit("cancel");
  }
};

const onSubmit = debounce(function () {
  state.isSubmit = true;
  emit("onSure");
}, 400);

watch(
  () => props.value,
  (val) => {
    state.dialogVisible = val;
    if (val) {
      state.isSubmit = false;
    }
  },
  { immediate: true }
);

watch(
  () => state.dialogVisible,
  (val) => {
    emit("update:value", val);
  }
);
</script>

<style lang="scss">
.custom-dialog {
  .el-dialog__header {
    position: relative;
    height: 70px;
    padding-bottom: 0;
    padding-top: 0;
    border-bottom: 1px solid #eee;
    color: #000;
    font-size: 18px;
    font-weight: 500;
    margin-right: 0;

    .el-dialog__title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #000;
      font-size: 18px;
      font-weight: 500;
    }
  }
}
</style>
