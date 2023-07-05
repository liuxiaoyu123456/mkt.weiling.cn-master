<script lang="ts" setup>
import { ref, watch } from "vue";
import type { FormItemType } from "wltech-ui";

const props = defineProps<{
  form: any;
}>();

const emit = defineEmits<{
  (e: "update:form", val: any): void;
}>();

const basicForm = ref({ button_name: props.form.button_name });

const list: FormItemType[] = [
  {
    label: "方案名称",
    type: "input",
    key: "button_name",
    props: {
      onChangeOnce: (val: string) => {
        console.log(val);
      },
      focusShowWordLimit: true,
      maxlength: 20,
    },
  },
];

const rules = ref({
    button_name: [
        { required: true, message: '请输入方案名称', trigger: 'change' },
        { min: 4, message: '方案名称少于4个字符', trigger: 'blur' }
    ],
})
const basicRef:any = ref(null)

const vertify = async () => {
  return await basicRef.value.validate();
};

watch(
  () => basicForm.value,
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
  <div class="base-config">
    <div class="title">设置基础信息</div>

    <div class="form-wrap">
      <WlForm
        ref="basicRef"
        :rules="rules"
        label-position="top"
        :list="list"
        :model="basicForm"
      >
      </WlForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-config {
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
