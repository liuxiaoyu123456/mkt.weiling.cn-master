import { smsSend, smsValidate } from "@/api";
import type { Ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
export const useVerificationCode = (
  formRef: Ref<FormInstance>,
  option: {
    phoneField: "mobile";
    codeField: "smsCode";
  }
) => {
  // /^1\d{10}$/
  const { phoneField, codeField } = option;
  const phoneRule = [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { type: /^1\d{10}$/, message: "手机号格式不正确", trigger: "blur" },
  ];
  const codeRule = [
    {
      validator: (rule: any, value: any, callback: any) => {
        // console.log(rule, value);
      },
      trigger: "blur",
    },
  ];
  const sendSms = (phoneNum: string) =>
    new Promise((resolve) => {
      formRef.value.validateField(phoneField, () => {
        resolve(smsSend({ mobile: phoneNum }));
      });
    });
  const confirm = () => {
    formRef.value.validate();
  };
  return {
    sendSms,
    confirm,
    phoneRule,
    codeRule,
  };
};
