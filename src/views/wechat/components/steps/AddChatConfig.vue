<script lang="ts" setup>
import { ref, watch } from "vue";
import type { FormItemType } from "wltech-ui";

const props = defineProps<{
  form: any;
}>();
interface miniApp {
  miniprogram_welmsg: string;
}
const miniAppForm = ref<miniApp>({
  miniprogram_welmsg: props.form.miniprogram_welmsg,
});

const emit = defineEmits<{
  (e: "update:form", val: any): void;
}>();

const list: FormItemType[] = [
  {
    label: "加微引导语",
    type: "input",
    key: "miniprogram_welmsg",
    props: {
      onChangeOnce: (val: string) => {
        console.log(val);
      },
      focusShowWordLimit: true,
      maxlength: 50,
    },
  },
];

const rules = ref({
  miniprogram_welmsg: [
    { required: true, message: "请输入加微引导语", trigger: "change" },
  ],
});
const miniAppRef: any = ref(null);

const vertify = () => {
  return miniAppRef.value.validate();
};

watch(
  () => miniAppForm.value,
  (val: any) => {
    emit("update:form", { ...props.form, ...val });
  },
  { deep: true }
);

defineExpose({
  vertify,
});
</script>

<template>
  <div class="addchat-config">
    <div class="title">配置加微页面</div>
    <div class="form-wrap">
      <WlForm
        ref="miniAppRef"
        :rules="rules"
        label-position="top"
        :list="list"
        :model="miniAppForm"
      ></WlForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.addchat-config {
  .title {
    position: relative;
    color: #000000;
    font-size: 20px;
    line-height: 28px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    &::before {
      position: absolute;
      content: "";
      width: 3px;
      height: 22px;
      background: var(--wl-primary-color);
      border-radius: 4px;
      left: -8px;
    }
  }
  .form-wrap {
    width: 90%;
    margin-left: 34px;
    margin-top: 24px;
  }
}
</style>
