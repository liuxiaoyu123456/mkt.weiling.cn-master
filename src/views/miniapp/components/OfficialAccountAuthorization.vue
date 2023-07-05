<template>
  <div class="developer flex-row">
    <div class="flex-col form-list">
      <div class="title">授权公众号</div>
      <div class="show-name flex-row">
        <el-input disabled :placeholder="authorizedName">
          <template #prepend>公众号名称</template>
        </el-input>
        <el-button type="primary" @click="toGrant">去授权</el-button>
      </div>
      <div
        v-if="keey"
        class="flex-row items-center propmt"
        :class="
          keey == 'querying'
            ? 'lookuping'
            : keey == 'warnning'
            ? 'err-msg'
            : 'suc-msg'
        "
      >
        <el-icon
          ><wl-svg
            :type="
              keey == 'querying'
                ? 'link'
                : keey == 'warnning'
                ? 'parsingFailed'
                : 'parsingSucceeded'
            "
        /></el-icon>
        <span class="load">{{ detectionResult[keey] }}</span>
      </div>
    </div>
    <div style="width: 100%" class="flex-center">
      <div class="example">
        <div class="example-title">授权界面示例</div>
        <img :src="getCosImageUrl('miniapp-empower.png')" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { useMiniappStore, useUserStore } from "@/stores";

const userStore: any = useUserStore();
const store = useMiniappStore();
const authorizedName = computed(() => store.getters_authorized_name || "");
const keey = computed(() => store.getters_authorized_keey || "");
const detectionResult: any = {
  querying: "正在查询授权状态...",
  warnning: "未检测到公众号成功授权",
  success: "成功授权公众号",
};
const iframeurl = ref("");
// 跳转链接去授权
const toGrant = () => {
  iframeurl.value = `${
    import.meta.env.VITE_APP_EMPOWER
  }/pcadmin/auto.html?component_app_id=${
    import.meta.env.VITE_APP_PLATFORM_ID
  }&corp_id=${userStore?.user?.corp?.corpId}&authorized_app_id=${
    store.getters_authorized_id
  }&type=2`;
  window.open(iframeurl.value, "_blank");
};
</script>
<style scoped>
@import url(./css.css);
.developer .form-list .show-name {
  min-width: 320px;
  position: relative;
}
.developer .form-list .show-name .el-input {
  height: 36px;
  width: 100%;
  margin-top: 21px;
  margin-bottom: 24px;
}
.developer .form-list .show-name .el-button {
  height: 36px;
  width: 65px;
  margin-top: 20px;
  margin-right: -1px;
  position: absolute;
  right: 1px;
  top: 1px;
}
.developer .form-list .propmt {
  padding: 6px;
  margin-top: -12px;
  border-radius: 6px;
}
.example {
  border-radius: 8px;
  background-color: var(--wl-body-color);
  max-width: 694px;
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
.example img {
  margin-top: 16px;
  width: 100%;
}
:deep(.el-input-group__prepend) {
  background-color: #efefef;
  box-shadow: 0 0 0 0;
  border-right: 1px solid #fff;
  padding: 0 10px;
}
:deep(.el-input .el-input__wrapper),
:deep(.el-input .el-input__wrapper) .el-input__inner {
  box-shadow: 0 0 0 0;
  background-color: #efefef;
}
.el-icon {
  font-size: 18px;
  margin-right: 5px;
}
.lookuping {
  background-color: var(--wl-primary-color-lightest);
}
.err-msg {
  background-color: var(--wl-error-color-light);
  border: 1px solid var(--wl-error-color);
}
.suc-msg {
  background-color: var(--wl-primary-color-light);
  border: 1px solid #35aaff;
}
.lookuping .el-icon {
  color: var(--wl-primary-color);
}
.err-msg .el-icon {
  color: var(--wl-error-color);
}
.suc-msg .el-icon {
  color: var(--wl-primary-color);
}
.load {
  font-size: 14px;
  font-weight: 400;
  color: var(--wl-text-color-title-1);
}
</style>
