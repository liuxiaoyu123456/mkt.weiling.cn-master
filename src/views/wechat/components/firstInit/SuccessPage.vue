<script lang="ts" setup>
import { ref } from "vue";
import { getCosImageUrl } from "@/utils";
const jmy1 = getCosImageUrl("/jmy-1.png");
const jmy2 = getCosImageUrl("/jmy-2.png");
const jmy3 = getCosImageUrl("/jmy-3.png");
const imgList = ref([jmy1, jmy2, jmy3]);
</script>

<template>
  <div class="success-page">
    <p>1.点击进入百度基木鱼，打开需要使用微信方案的基木鱼落地页</p>
    <el-image
      :preview-src-list="imgList"
      :src="jmy1"
      :initial-index="0"
      class="el-img"
    >
    </el-image>
    <p>2.选择微信组件并添加到落地页中，然后选择设置企业微信号类型的微信方案</p>
    <el-image
      :preview-src-list="imgList"
      :src="jmy2"
      :initial-index="1"
      class="el-img"
    ></el-image>
    <p>
      3.点击“保存”，提交审核落地页并用于广告投放即可（也可点击“预览”，查看加微效果）
    </p>
    <el-image
      :preview-src-list="imgList"
      :src="jmy3"
      :initial-index="2"
      class="el-img"
    ></el-image>
  </div>
</template>

<style lang="scss" scoped>
.success-page {
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
