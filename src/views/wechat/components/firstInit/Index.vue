<script lang="ts" setup>
import { ref, watch } from "vue";
import XwTip from "./XwTip.vue";
import Swipe from "./Swipe.vue";
import StepControl from "./StepControl.vue";
import AccountForm from "./AccountForm.vue";
import CreatGuide from "./CreatGuide.vue";
import AuthGuide from "./AuthGuide.vue";
import SuccessPage from "./SuccessPage.vue";
import useWechatFirst from "@/hooks/wechat/useWechatFirst";

const {
  step,
  loading,
  form,
  createprossList,
  accountForm,
  addAccount,
  isBind,
  isAuth,
  load,
} = useWechatFirst();

const xwTip: any = ref(null);
const AccountFormRef: any = ref(null);

const emits = defineEmits<{
  (val: "refresh"): void;
}>();

const stepChange = (val: number) => {
  // 大于0表示点击的下一步
  if (val > 0) {
    if (step.value == 1) {
      xwTip.value
        .checkAddchat()
        .then((valid: any) => {
          if (valid) {
            step.value++;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else if (step.value == 2) {
      xwTip.value
        .checkGreet()
        .then((valid: any) => {
          if (valid) {
            step.value++;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else if (step.value == 3) {
      AccountFormRef.value
        .checkAccount()
        .then((valid: any) => {
          if (valid) {
            addAccount();
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else if (step.value == 4) {
      //校验绑定
      isBind();
    } else if (step.value == 5) {
      //校验授权
      isAuth();
    } else if (step.value == 7) {
      //完成去首页(重新调取接口)
      emits("refresh");
    }
  } else {
    step.value--;
  }
};

// 监听步骤条
watch(
  () => step.value,
  (val: number) => {
    if (val === 0) {
      setTimeout(() => {
        if (step.value == 0) {
          step.value++;
        }
      }, 500);
    }
  },
  { immediate: true }
);

load();
</script>

<template>
  <div class="first-init card">
    <div class="top-xw">
      <XwTip
        v-model:step="step"
        v-model:form="form"
        :createprossList="createprossList"
        ref="xwTip"
      />
    </div>
    <div class="mid-box" v-if="step !== 6">
      <Swipe v-model:step="step" :form="form" v-if="step < 3" />
      <AccountForm
        v-if="step == 3"
        ref="AccountFormRef"
        v-model:accountForm="accountForm"
      />
      <CreatGuide
        v-if="step == 4"
        :accountForm="accountForm"
        :loading="loading"
      />
      <AuthGuide v-if="step == 5" />
      <SuccessPage v-if="step == 7" />
    </div>
    <div class="step-box">
      <StepControl
        v-model:step="step"
        v-if="step > 0 && step != 6"
        @stepChange="stepChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scope>
.first-init {
  // background-color: #fff;
  // border-radius: 16px;
  min-height: calc(100vh - 104px);
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
  justify-content: space-between;
  .top-xw {
    margin: 4px auto 36px;
  }
  .mid-box {
    flex: 1;
    padding-bottom: 24px;
    max-height: calc(100vh - 344px);
    min-height: 585px;
    overflow-y: auto;
  }
  .step-box {
    min-height: 100px;
  }
}
</style>
