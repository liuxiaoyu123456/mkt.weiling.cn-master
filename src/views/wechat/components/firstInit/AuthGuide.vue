<script lang="ts" setup>
import { ref, computed } from "vue";
import { getCosImageUrl } from "@/utils";
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
const imgList = ref([getCosImageUrl("/auth.png")]);
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const getHref = computed(() => {
  return `https://u.baidu.com/oauth/page/index?platformId=4960345965958561794&appId=${
    import.meta.env.VITE_BAIDU_APPID
  }&scope=74,75,1001788,1001789,1001455,1001790,1001791,1002829,1004606,1002161,73,71,72,67,68,69,70,65,66&state=${
    userInfo.value?.corp?.corpId || ""
  }&callback=${import.meta.env.VITE_APP_DOMAIN}/auth-result`;
});
</script>

<template>
  <div class="auth-guide">
    <p>
      1.点击进入<a :href="getHref" target="_blank">百度账户授权界面</a
      >，登录百度广告账户，点击“同意授权”
    </p>
    <el-image
      :preview-src-list="imgList"
      :src="imgList[0]"
      :initial-index="0"
      class="el-img"
    >
    </el-image>
    <p>2.授权完成后回到此处，点击右下方“授权查询”按钮</p>
  </div>
</template>

<style lang="scss" scoped>
.auth-guide {
  width: 640px;
  margin: 0 auto;
  > p {
    font-size: 16px;
    line-height: 24px;
    color: var(--wl-text-color-title-1);
    margin-bottom: 8px;
    margin-top: 24px;
    > a {
      color: var(--wl-primary-color);
    }
  }
  .el-img {
    box-shadow: 6px 6px 24px rgb(0 0 0 / 12%);
    border-radius: 16px;
  }
}
</style>
