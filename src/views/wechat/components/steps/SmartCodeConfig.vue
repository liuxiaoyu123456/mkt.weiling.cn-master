<script lang="ts" setup>
import { ref, watch } from "vue";
// import CodeScheduleUser from "./components/CodeScheduleUser.vue";
import CodeUser from "./components/CodeUser.vue";
// import CodeCustomerLabel from "./components/CodeCustomerLabel.vue";
// import CodeWelcomeInfo from "./components/CodeWelcomeInfo.vue";
// import {isEqual} from "lodash-es";
import type { FormItemType } from "wltech-ui";

const props = defineProps<{
  form: any;
}>();

const emit = defineEmits<{
  (e: "change", val: number): void;
  (e: "update:form", val: any): void;
}>();

const modelFrom = ref({
  user_list: props.form.user_list,
  new_welcome_msg_info: {
    text: { content: props.form.new_welcome_msg_info?.text?.content || "" },
  },
});

const onCkeckStaffChange = (res: any) => {
  modelFrom.value.user_list = res;
  emit("change", 1);
};

const list: FormItemType[] = [
  {
    label: "欢迎语",
    type: "input",
    key: "content",
    props: {
      onInput: (val: string) => {
        emit("change", 2);
      },
      // focusShowWordLimit: true,
      // maxlength: 20,
      type: "textarea",
      maxlength: 200,
    },
  },
];

const CodeUserRef: any = ref(null);
const vertify = () => {
  return CodeUserRef.value.valid();
};

watch(
  () => modelFrom.value,
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
  <div class="smartcode-config">
    <div class="title">设置智能码</div>
    <div class="form-wrap">
      <section class="section_division">
        <CodeUser
          ref="CodeUserRef"
          :userList="modelFrom.user_list"
          @onCkeckStaffChange="onCkeckStaffChange"
        />
      </section>
      <!-- <section class="section_division">
        <CodeCustomerLabel :tagGroups="form.tagList" @onTabChange="onTabChange" />
      </section> -->
      <section class="section_division">
        <!-- <CodeWelcomeInfo
          :isMarketEnv="true"
          :currentUser="computedUser"
          :welcomeMsgInfo="modelFrom.new_welcome_msg_info"
          @onWelcomeChange="onWelcomeChange"
        /> -->
        <WlForm
          label-position="top"
          :list="list"
          :model="modelFrom.new_welcome_msg_info.text"
        ></WlForm>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.smartcode-config {
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
    .section_division {
      margin-bottom: 24px;
    }
  }

  :deep(
      .el-form--default.el-form--label-top .el-form-item .el-form-item__label
    ) {
    font-size: 18px;
  }
}
</style>
