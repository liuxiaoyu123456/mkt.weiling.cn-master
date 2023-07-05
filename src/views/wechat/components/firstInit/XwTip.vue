<script lang="ts" setup>
import { ref, watch } from "vue";
import type { FormInstance } from "element-plus";
const props = defineProps<{
  step: number;
  form: any;
  createprossList: any;
}>();

const emit = defineEmits<{
  (val: "update:form", e: any): void;
}>();

const innerForm = ref(props.form);

const addchatRules = ref({
  miniprogram_welmsg: [{ required: true, message: "", trigger: "blur" }],
});
const greetRules = ref({
  content: [{ required: true, message: "", trigger: "blur" }],
});
const addchatFormRef: any = ref<FormInstance>();
const greetFormRef: any = ref<FormInstance>();
const checkAddchat = async () => {
  if (!addchatFormRef.value) return;
  return await addchatFormRef.value.validate();
};
const checkGreet = async () => {
  if (!greetFormRef.value) return;
  return await greetFormRef.value.validate();
};

watch(
  () => innerForm.value,
  (val: any) => {
    let res = { ...props.form, ...{ ...props.form.channel, ...val } };
    emit("update:form", res);
  },
  { deep: true }
);

defineExpose({
  checkAddchat,
  checkGreet,
});
</script>

<template>
  <div class="xw-tip">
    <div class="pic-box">
      <img
        src="https://wlmvp-cos.weiling.cn/worktable-erp/images/xiaowei_zhuli.png?v=22"
        alt="xw"
      />
    </div>
    <div>
      <div class="tip-content">
        <div class="tip-item" v-if="step < 2">
          <div class="title">设置加微引导语</div>
          <div class="input-wrap">
            <el-form
              :rules="addchatRules"
              ref="addchatFormRef"
              :model="innerForm.channel"
            >
              <el-form-item prop="miniprogram_welmsg" style="margin-bottom: 0">
                <el-input
                  placeholder="请输入加微引导语"
                  v-model="innerForm.channel.miniprogram_welmsg"
                  :maxlength="50"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tip-item" v-if="step == 2">
          <div class="title">设置问候语</div>
          <div class="input-wrap">
            <el-form
              :rules="greetRules"
              ref="greetFormRef"
              :model="innerForm.channel.new_welcome_msg_info.text"
            >
              <el-form-item prop="content" style="margin-bottom: 0">
                <el-input
                  placeholder="请输入加微问候语"
                  v-model="innerForm.channel.new_welcome_msg_info.text.content"
                  :maxlength="200"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tip-item" v-if="step == 3">
          <div class="title">设置账号密码，用于在百度后台做广告账户绑定</div>
        </div>
        <div class="tip-item" v-if="step == 4">
          <div class="title">
            设置账号密码，现在，按照下方指引去百度后台进行账户绑定，操作完成后点击底部的“绑定查询”按钮
          </div>
        </div>
        <div class="tip-item" v-if="step == 5">
          <div class="title">
            最后，将百度账号授权给集客通，完成后将自动在百度营销通创建微信方案（授权方式见下方）
          </div>
        </div>
        <template v-if="step == 6">
          <div
            class="tip-item fade-in"
            v-for="(item, i) in createprossList"
            :key="i"
          >
            <div class="title">{{ item }}</div>
          </div>
        </template>

        <div class="tip-item" v-if="step == 7">
          <div class="title">
            微信方案已成功创建，现在就去基木鱼落地页上使用叭（使用方法见下方）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope>
.xw-tip {
  display: flex;
  .pic-box {
    width: 56px;
    height: 56px;
    overflow: hidden;
    border-radius: 50%;
    margin-right: 28px;
    box-shadow: 0px 0px 16px var(--wl-mask-color);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .tip-content {
    .fade-in {
      animation: fadeIn 0.4s;
    }

    .tip-item {
      padding: 12px 16px;
      background-color: #f4f9fd;
      border-radius: 8px;
      width: 500px;
      & + .tip-item {
        margin-top: 16px;
      }
      .title {
        color: var(--wl-text-color-title-1);
        font-weight: 500;
        font-size: 18px;
        line-height: 26px;
      }
      .input-wrap {
        margin-top: 12px;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0.3;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
