<script lang="ts" setup>
import { downloadImage } from "@/utils/utils";

withDefaults(
  defineProps<{
    info: any;
  }>(),
  {
    info: {},
  }
);

const downCode = () => {
  downloadImage(
    "https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/wecom-code.png",
    "集客通"
  );
};
</script>

<template>
  <div class="install-code">
    <div class="title">{{ info.InstallCodeTitle }}</div>
    <div class="code-wrap" @click="downCode">
      <div class="code-box">
        <img
          src="https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/wecom-code.png"
          alt="qw-code"
        />
      </div>
      <span>点击下载二维码</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.install-code {
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 32px;
    color: var(--wl-text-color-title-1);
  }
  .code-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 240px;
    margin: 0 auto;
    cursor: pointer;
    .code-box {
      width: 240px;
      height: 240px;
      margin-bottom: 4px;
      img {
        width: 100%;
      }
    }
    > span {
      font-size: 16px;
      line-height: 24px;
      color: var(--wl-text-color-secondary-1);
    }
  }
}
</style>
