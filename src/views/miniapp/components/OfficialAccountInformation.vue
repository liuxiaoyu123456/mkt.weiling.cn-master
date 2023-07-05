<template>
  <div class="developer flex-row">
    <div class="flex-col form-list">
      <div class="title">公众号开发者ID</div>
      <el-input v-model="inputKey" placeholder="请填写公众号开发者ID" />
      <div class="title">公众号名称</div>
      <el-input v-model="keyName" placeholder="请填写公众号名称" />
    </div>
    <div style="width: 100%" class="flex-center">
      <div class="example">
        <div class="example-title">
          开发者ID查看路径：登录<a
            href="https://mp.weixin.qq.com/"
            rel="noopener"
            target="_blank"
            class="to-back pointer"
            >公众号后台</a
          >->设置与开发->基本配置->公众号开发信息->开发者ID(AppID)
        </div>
        <img :src="getCosImageUrl('miniapp-configure.png')" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useMiniappStore, useUserStore } from "@/stores";
const store = useMiniappStore();
const inputKey: any = ref(store.getters_authorized_id || "");
const keyName: any = ref(store.getters_authorized_name || "");
watch(
  [() => inputKey.value, () => keyName.value],
  () => {
    if (inputKey.value || keyName.value) {
      store.onGetOfficialAccount(inputKey.value, "inputKey");
      store.onGetOfficialAccount(keyName.value, "keyName");
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>
<style scoped>
@import url(./css.css);
.developer .form-list .el-input {
  height: 44px;
  width: 100%;
  margin-top: 21px;
  margin-bottom: 24px;
}
.example {
  border-radius: 8px;
  background-color: var(--wl-body-color);
  width: 694px;
  /* height: 429px; */
  box-sizing: border-box;
  padding: 12px 16px;
  margin-top: 10px;
}
.example .example-title {
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.01em;
  color: var(--wl-text-color-title-2);
}
.example .example-title .to-back {
  color: var(--wl-primary-color);
}
.example img {
  margin-top: 16px;
  width: 100%;
}
</style>
