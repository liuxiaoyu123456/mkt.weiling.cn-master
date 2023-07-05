<template>
  <div class="developer flex-col">
    <div class="flex-col form-list" style="width: 100%; position: relative">
      <div class="title">名称</div>
      <span class="msg"
        >长度为4-30个字符，一个中文字符等于2个字符。点击了解更多
        <a
          href="https://kf.qq.com/faq/170109umMvm6170109MZNnYV.html"
          rel="noopener"
          target="_blank"
          class="can-click pointer"
          >小程序名称规则</a
        ></span
      >
      <el-input
        v-model="appName"
        maxlength="30"
        show-word-limit
        placeholder="请输入小程序名称，例如：卫瓴小助手"
        @blur="onBlur"
      />
      <span v-if="showWarnning" class="warnning-title">
        请输入正确的小程序名称
      </span>
    </div>
    <div class="flex-col form-list" style="width: 100%">
      <div class="title">头像</div>
      <span class="msg"
        >头像不允许涉及政治敏感与色情;<br />图片格式必须为：png,bmp,jpeg,jpg,gif；不可大于2M；建议使用png格式图片，以保持最佳效果；建议图片尺寸为144px*144px</span
      >
      <div class="header-list flex-row">
        <UploadImg v-model:formValue="formValue" :item="item" />
        <div class="flex-col preview-img">
          <div class="header-img-title">头像预览</div>
          <div class="flex-row">
            <img :src="getCosImageUrl('miniapp-square-header.png')" alt="" />
            <img
              style="border-radius: 50%"
              :src="getCosImageUrl('miniapp-round-header.png')"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMiniappStore } from "@/stores";
import { checkWxKname } from "@/api";

const store = useMiniappStore();
const appName = ref(store.getters_miniapp_name || "");
const showWarnning = ref(false);
const formValue = ref(store.getters_miniapp_url || "");
interface ConfigItem {
  sizeBox?: number; // 裁剪盒子的比例
  maxSize?: number; // 最大尺寸
}
const item: ConfigItem = {
  sizeBox: 1,
  maxSize: 2,
};
const onBlur = () => {
  if (!appName.value) {
    showWarnning.value = true;
  } else {
    showWarnning.value = false;
    checkWxKname({
      appId: store.getters_miniapp_id,
      componentAppId: import.meta.env.VITE_APP_PLATFORM_ID,
      nickName: appName.value,
    }).then((res) => {
      if (res.code == 200) {
        showWarnning.value = false;
        store.miniappInformation(appName.value, "name");
      } else {
        showWarnning.value = true;
      }
    });
  }
};
watch(
  () => formValue.value,
  () => {
    store.miniappInformation(formValue.value, "url");
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style scoped>
@import url(./css.css);
.developer {
  margin-bottom: 40px;
}
.can-click {
  color: #577aca;
}
.el-input {
  width: 394px;
  margin-top: 12px;
}
.warnning-title {
  position: absolute;
  left: 10px;
  font-size: 12px;
  bottom: -8px;
  color: red;
}
.header-list {
  margin-top: 16px;
}
.header-list .preview-img {
  padding: 8px 11px;
  border-radius: 5px;
  background-color: #fafafa;
  margin-left: 20px;
}
.header-list .preview-img .header-img-title {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #b5b5b5;
}
.header-list .preview-img img {
  width: 113px;
  height: 113px;
  object-fit: cover;
  overflow: hidden;
}
</style>
