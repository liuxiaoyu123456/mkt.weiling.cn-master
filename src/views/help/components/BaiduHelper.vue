<template>
  <h2 class="help-title">如何在百度基木鱼使用微信方案</h2>
  <ul class="help-list">
    <li class="help-list-item">
      <p>
        1.点击进入<el-link
          :href="oAuthUrl"
          target="_blank"
          :underline="false"
          type="primary"
          >百度基木鱼</el-link
        >，打开需要使用微信方案的基木鱼落地页
      </p>
      <el-image
        :preview-src-list="imgList"
        :src="imgList[0]"
        :initial-index="0"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>
        2.选择微信组件并添加到落地页中，然后选择设置企业微信号类型的微信方案
      </p>
      <el-image
        :preview-src-list="imgList"
        :src="imgList[1]"
        hide-on-click-modal
        :initial-index="1"
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>
        3.点击“保存”，提交审核落地页并用于广告投放即可（也可点击“预览”，查看加微效果）
      </p>
      <el-image
        :preview-src-list="imgList"
        hide-on-click-modal
        :src="imgList[2]"
        :initial-index="2"
        fit="contain"
      ></el-image>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores";
import { getCosImageUrl } from "@/utils/utils";
const userStore = useUserStore();
const imgList = [
  getCosImageUrl("/jmy-1.png"),
  getCosImageUrl("/jmy-2.png"),
  getCosImageUrl("/jmy-3.png"),
];
const oAuthUrl = computed(
  () =>
    `https://u.baidu.com/oauth/page/index?platformId=4960345965958561794&appId=${
      import.meta.env.VITE_BAIDU_APPID
    }&scope=74,75,1001788,1001789,1001455,1001790,1001791,1002829,1004606,1002161,73,71,72,67,68,69,70,65,66&state=${
      userStore.userInfo?.corp?.corpId || ""
    }&callback=${import.meta.env.VITE_APP_DOMAIN}/auth-result`
);
</script>