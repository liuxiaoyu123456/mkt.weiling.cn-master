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

const downCode = (type: string) => {
  switch (type) {
    case "ios":
      downloadImage(
        "https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/genqrcode-ios.png",
        "ios"
      );
      break;
    case "android":
      downloadImage(
        "https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/genqrcode-android.png",
        "android"
      );
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="down-code">
    <div class="title">{{ info.DownCodeTitle }}</div>
    <div class="des">{{ info.DownCodeDes }}</div>

    <div class="down-code-wrap">
      <div class="code-item" @click="downCode('ios')">
        <div class="top-box">
          <div class="logo-box">
            <el-icon class="logo">
              <wl-svg type="logoApple" />
            </el-icon>
          </div>
          <div class="code-box">
            <img
              src="https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/genqrcode-ios.png"
              alt="code"
            />
          </div>
        </div>
        <span class="name">iOS版</span>
        <span class="download">点击下载二维码</span>
      </div>
      <div class="code-item" @click="downCode('android')">
        <div class="top-box">
          <div class="logo-box">
            <el-icon class="logo">
              <wl-svg type="logoAndroid" />
            </el-icon>
          </div>
          <div class="code-box">
            <img
              src="https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/genqrcode-android.png"
              alt="code"
            />
          </div>
        </div>
        <span class="name">Android版</span>
        <span class="download">点击下载二维码</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.down-code {
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 8px;
    color: var(--wl-text-color-title-1);
  }
  .des {
    line-height: 22px;
    color: var(--wl-text-color-secondary-2);
  }

  &-wrap {
    display: flex;
    width: 360px;
    margin: 48px auto 0;
    justify-content: space-between;
    .code-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 200px;
      .top-box {
        position: relative;
        width: 120px;
        height: 120px;
        .logo-box {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #f7f8f8;
          border-radius: 50%;
          transform: scale(1);
          opacity: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s;
          .logo {
            font-size: 50px;
          }
        }

        .code-box {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform: scale(1.2);
          transition: all 0.4s;
          opacity: 0;
          img {
            width: 100%;
          }
        }
      }

      .name {
        color: var(--wl-text-color-title-2);
        font-size: 16px;
        line-height: 24px;
        transition: all 0.4s;
        transform: translateY(24px);
      }
      .download {
        font-size: 16px;
        line-height: 24px;
        color: var(--wl-text-color-secondary-1);
        transform: translateY(24px);
        opacity: 0;
        transition: all 0.4s;
      }

      &:hover {
        .top-box {
          .logo-box {
            transform: scale(0);
            opacity: 0;
          }
          .code-box {
            transform: scale(1);
            opacity: 1;
          }
        }
        .name {
          transform: translateY(6px);
        }
        .download {
          transform: translateY(6px);
          opacity: 1;
        }
      }
    }
  }
}
</style>
