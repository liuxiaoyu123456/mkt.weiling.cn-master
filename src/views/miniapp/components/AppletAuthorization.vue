<template>
  <div class="developer flex-row">
    <div class="flex-col form-list">
      <div class="title">授权小程序</div>
      <div class="show-name flex-row">
        <!-- <el-input  v-model="keyName" disabled placeholder="联系帮手" >
          <template #prepend>小程序名称</template>
        </el-input> -->
        <el-button type="primary" @click="toGrant">去授权</el-button>
      </div>
      <div
        v-if="stateShow"
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
        <div class="example-title">授权界面事例</div>
        <img :src="getCosImageUrl('/miniapp-create-app.png')" alt="" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onUnmounted } from "vue";
import { wxopenComponentTry } from "@/api";
import { useMiniappStore, useUserStore } from "@/stores";

const userStore: any = useUserStore();
const store = useMiniappStore();

const keyName: any = computed(() => store.getters_miniapp_name || ""); // 小程序名称
const keey = ref(store.getters_miniapp_keey || ""); // 小程序授权状态
const detectionResult: any = {
  querying: "正在查询授权状态...",
  warnning: "未检测到小程序成功授权",
  success: "成功授权小程序",
};
const stateShow = computed(() => {
  return keey.value ? true : false;
});
const miniAppId = ref(""); // 小程序id
const iframeurl = ref("");
const ranDomNum = new Date().getTime();
let timer: any = null;
// 小程序授权
const toGrant = () => {
  keey.value = "querying";
  iframeurl.value = `${
    import.meta.env.VITE_APP_EMPOWER
  }pcadmin/auto.html?component_app_id=${
    import.meta.env.VITE_APP_PLATFORM_ID
  }&corp_id=${userStore?.user?.corp?.corpId}&authorized_app_id=${
    store.getters_authorized_id
  }&type=101&name=${keyName.value}&uid=${ranDomNum}&wl_userid=${
    userStore.user.id
  }`;

  window.open(iframeurl.value, "_blank");
  clearInterval(timer);
  // 轮询查小程序id
  timer = setInterval(() => {
    wxopenComponentTry({
      corpId: userStore?.user?.corp?.corpId,
      uid: ranDomNum,
    }).then((res: any) => {
      if (res.code == 200) {
        miniAppId.value = res.msg;
        store.setMiniAppId(miniAppId.value);
        keey.value = "success";
        clearInterval(timer);
      } else {
        keey.value = "warnning";
      }
    });
    store.setMiniappKeey(keey.value, "miniapp");
  }, 1000);
};
onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style scoped>
@import url(./css.css);
.developer .form-list .show-name {
  min-width: 320px;
  position: relative;
}
.developer .form-list .show-name .el-button {
  height: 36px;
  width: 100%;
  margin-top: 20px;
}
.developer .form-list .propmt {
  padding: 6px;
  margin-top: 5px;
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
