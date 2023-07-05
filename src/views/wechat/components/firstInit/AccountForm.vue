<script lang="ts" setup>
import { ref, watch } from "vue";
import { smsSend } from "@/api";
import { ElMessage } from "element-plus";

const props = defineProps<{
  accountForm: any;
}>();

const emit = defineEmits<{
  (e: "update:accountForm", val: any): void;
}>();

const innerForm = ref(props.accountForm);
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    if (!/^1[3-9]\d{9}$/.test(value)) {
      callback(new Error("手机号不合法"));
    }
    callback();
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  const check = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/;
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!check.test(value)) {
    callback(new Error("密码必须包含数字、英文字母大小写"));
  } else {
    if (innerForm.value.account_password !== "") {
      if (!accountFormRef.value) return;
      accountFormRef.value.validateField("account_password2", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== innerForm.value.account_password) {
    callback(new Error("两次密码不一致!"));
  } else {
    callback();
  }
};
const rules = ref({
  account_name: [{ validator: validatePhone, trigger: ["blur", "change"] }],
  vCode: [
    { required: true, message: "请输入验证码", trigger: ["blur", "change"] },
  ],
  account_password: [
    { validator: validatePass, trigger: ["blur", "change"] },
    {
      min: 8,
      max: 30,
      message: "请输入8到30位密码",
      trigger: ["blur", "change"],
    },
  ],
  account_password2: [
    { validator: validatePass2, trigger: ["blur", "change"] },
    {
      min: 8,
      max: 30,
      message: "请输入8到30位密码",
      trigger: ["blur", "change"],
    },
  ],
});

const accountFormRef: any = ref(null);

const checkAccount = async () => {
  if (!accountFormRef.value) return;
  return await accountFormRef.value.validate();
};
const time = ref(60);
const codeBtnText = ref("获取验证码");
const getCode = () => {
  accountFormRef.value.validateField("account_name", (valid: boolean) => {
    if (valid) {
      smsSend({
        mobile: innerForm.value.account_name,
      })
        .then((res: any) => {
          if (res.code == 200) {
            ElMessage.success("发送成功！");
            let m = setInterval(() => {
              codeBtnText.value = time.value + "秒后重发";
              time.value--;
              if (time.value == 0) {
                clearInterval(m);
                codeBtnText.value = "获取验证码";
                time.value = 60;
              }
            }, 1000);
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch((err: any) => {
          ElMessage({
            message: err.msg,
            type: "error",
          });
        });
    }
  });
};

const handleInput = () => {
  innerForm.value.account_name = innerForm.value.account_name
    .replace(/[^\d]/g, "")
    .slice(0, 11);
};
const handleTrimvCode = () => {
  innerForm.value.vCode = innerForm.value.vCode
    .replace(/[^\d]/g, "")
    .slice(0, 6);
  // if (/\s/.test(innerForm.value.vCode)) {
  //     innerForm.value.vCode = innerForm.value.vCode.replace(/\s/g, '');
  // }
  // if (/[\u4e00-\u9fa5]/.test(innerForm.value.vCode)){
  //     innerForm.value.vCode = innerForm.value.vCode.replace(/[\u4e00-\u9fa5]/g, '');
  // }
};
const handlePassword = () => {
  if (/\s/.test(innerForm.value.account_password)) {
    innerForm.value.account_password = innerForm.value.account_password.replace(
      /\s/g,
      ""
    );
  }
  if (/[\u4e00-\u9fa5]/.test(innerForm.value.account_password)) {
    innerForm.value.account_password = innerForm.value.account_password.replace(
      /[\u4e00-\u9fa5]/g,
      ""
    );
  }
};
const handlePassword2 = () => {
  if (/\s/.test(innerForm.value.account_password2)) {
    innerForm.value.account_password2 =
      innerForm.value.account_password2.replace(/\s/g, "");
  }
  if (/[\u4e00-\u9fa5]/.test(innerForm.value.account_password2)) {
    innerForm.value.account_password2 =
      innerForm.value.account_password2.replace(/[\u4e00-\u9fa5]/g, "");
  }
};

watch(
  () => innerForm.value,
  (val: any) => {
    emit("update:accountForm", { ...props.accountForm, ...val });
  },
  { deep: true }
);

defineExpose({
  checkAccount,
});
</script>

<template>
  <el-form
    :model="innerForm"
    :rules="rules"
    ref="accountFormRef"
    class="account-form"
    label-width="80px"
    label-position="left"
    hide-required-asterisk
  >
    <el-form-item label="账号" prop="account_name" class="main-info">
      <el-input
        v-model="innerForm.account_name"
        placeholder="请输入手机号"
        @input="handleInput"
        :maxlength="11"
      />
    </el-form-item>
    <el-form-item label="验证码" prop="vCode" class="main-info">
      <div class="flex-row">
        <el-input
          v-model="innerForm.vCode"
          placeholder="请输入验证码"
          class="flex1"
          :maxlength="6"
          @input="handleTrimvCode"
        />
        <el-button
          type="primary"
          class="btn"
          @click="getCode"
          :disabled="codeBtnText !== '获取验证码'"
          >{{ codeBtnText }}</el-button
        >
      </div>
    </el-form-item>
    <el-form-item label="密码" prop="account_password" class="main-info">
      <el-input
        v-model="innerForm.account_password"
        placeholder="请输入8-30位密码"
        type="password"
        :maxlength="30"
        show-password
        @input="handlePassword"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="account_password2">
      <el-input
        v-model="innerForm.account_password2"
        placeholder="请输入8-30位密码"
        type="password"
        :maxlength="30"
        show-password
        @input="handlePassword2"
      />
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.account-form {
  width: 450px;
  margin: 0 auto;
  .flex-row {
    display: flex;
    width: 100%;
    .btn {
      margin-left: 16px;
    }
    .flex1 {
      flex: 1;
    }
  }
  .main-info {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: -14px;
      background: var(--wl-primary-color);
      border-radius: 2px;
      width: 4px;
      height: 16px;
      top: 8px;
    }
  }
}
// :deep(){
//     input[type=number] {
//         -moz-appearance:textfield;
//     }
//     input[type=number]::-webkit-inner-spin-button,
//     input[type=number]::-webkit-outer-spin-button {
//         -webkit-appearance: none;
//         margin: 0;
//     }
// }
</style>
