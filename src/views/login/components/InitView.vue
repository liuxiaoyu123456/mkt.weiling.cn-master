<script lang="ts" setup>
import { ref } from "vue";
import VedioDia from "./VedioDia.vue";
import { identityMap } from "./steps/config";
// import Saying from "./Saying.vue"
// import {ElCarousel} from "element-plus"
// import "element-plus/theme-chalk/src/carousel.scss"

withDefaults(
  defineProps<{
    type: string;
    options: any;
  }>(),
  {
    type: "install",
    options: {},
  }
);

const emit = defineEmits<{
  (e: "start"): void;
}>();

const centerDialog = ref(false);
// const identity = ref(null)
const closeDialog = () => {
  centerDialog.value = false;
};
const showDialog = () => {
  centerDialog.value = true;
};

const handleStart = () => {
  emit("start");
};

const openAgreement = () => {
  window.location.href = `${import.meta.env.VITE_APP_DOMAIN}/agreement`;
};
</script>

<template>
  <div class="init-view">
    <div class="init-view-left">
      <!-- <el-carousel arrow="always" :autoplay="false" class="my-carousel" height="100%">
                <el-carousel-item class="my-carousel-item">
                    <Saying />
                </el-carousel-item>
                <el-carousel-item class="my-carousel-item"> -->
      <div class="vedio-wrap" @click="showDialog">
        <img class="cover" src="@/assets/images/vedio-cover.png" alt="cover" />
        <img
          class="play"
          src="@/assets/images/login/play.png"
          alt="play"
        />
      </div>
      <!-- </el-carousel-item> 
            </el-carousel>-->
    </div>
    <div class="init-view-right">
      <div class="logo-box">
        <img
          :src="getCosImageUrl('logo.png')"
          alt="logo"
        />
      </div>

      <div class="opt-box" v-if="type === 'install'">
        <p>首先，请选择您的身份</p>
        <div class="radio-group">
          <el-radio-group v-model="options.identity">
            <el-radio
              :label="identityMap.ADVERTISERS"
              class="radio-item"
              :class="{ active: options.identity == identityMap.ADVERTISERS }"
              >我是广告主</el-radio
            >
            <el-radio
              :label="identityMap.AGENT"
              class="radio-item"
              :class="{ active: options.identity == identityMap.AGENT }"
              >我是代理商</el-radio
            >
          </el-radio-group>
        </div>
        <div class="bottom-btn">
          <el-button
            type="primary"
            @click="handleStart"
            :disabled="!options.identity"
            >开始</el-button
          >
        </div>
      </div>
      <div class="login-wrap" v-if="type === 'login'">
        <div class="code-box">
          <slot></slot>
        </div>
        <div class="agreement">
          登录即代表同意<span @click="openAgreement">用户服务协议</span>
        </div>
      </div>

      <div class="notice">
        <el-icon class="notice-icon">
          <wl-svg type="remindFill" />
        </el-icon>
        <span>免费试用 ，加微无效返款！</span>
      </div>
    </div>

    <VedioDia :show="centerDialog" @close="closeDialog" />
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

@function vw($px) {
  @return math.div($px, 1440) * 100vw;
}

.init-view {
  display: flex;
  height: 100vh;

  &-left {
    background: url("@/assets/images/login/left-background.png");
    background-size: 100% auto;
    background-position-y: center;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    // .my-carousel{
    //     width: 100%;
    //     height: 100%;
    // }
    // .my-carousel-item{
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    // }
    .vedio-wrap {
      position: relative;
      width: vw(343);
      height: vw(610);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      cursor: pointer;
      &:hover {
        .cover {
          transform: scale(1.1);
        }
      }

      .cover {
        position: absolute;
        width: 100%;
        transform: scale(1);
        transition: all 0.3s;
      }

      .play {
        position: absolute;
        width: vw(64);
        cursor: pointer;
      }
    }
  }

  &-right {
    width: vw(611);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo-box {
      width: 330px;
      height: 108px;
      margin-bottom: 20px;

      img {
        width: 100%;
      }
    }

    .opt-box {
      width: 336px;
      height: 400px;
      background: #ffffff;
      box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.06);
      border-radius: 16px;
      box-sizing: border-box;
      padding: 32px 36px;
      display: flex;
      flex-direction: column;
      > p {
        color: #000000;
        font-weight: 500;
        font-size: 20px;
        line-height: 29px;
        margin-bottom: 36px;
      }
      .el-radio-group {
        width: 100%;
      }
      .radio-group {
        flex: 1;
        .radio-item {
          width: 100%;
          height: 56px;
          margin-right: 0;
          margin-bottom: 12px;
          border: 1px solid var(--wl-line-color);
          display: flex;
          align-items: center;
          border-radius: 5px;
          padding-left: 24px;
          box-sizing: border-box;
          transition: all 0.3s;
          cursor: pointer;

          &:hover {
            border: 1px solid var(--wl-primary-color);
          }
        }
        .active {
          border: 1px solid var(--wl-primary-color);
        }
      }
      .bottom-btn {
        display: flex;
        justify-content: flex-end;
      }
    }

    .login-wrap {
      width: 336px;
      background: #ffffff;
      box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.06);
      border-radius: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 0 12px;
      .code-box {
        width: 240px;
        height: 240px;
        display: flex;
        justify-content: center;
      }
      .agreement {
        color: var(--wl-text-color-title-1);
        > span {
          color: var(--wl-primary-color-dark);
          cursor: pointer;
        }
      }
    }
    .notice {
      width: 334px;
      height: 28px;
      color: var(--wl-primary-color-dark);
      background: linear-gradient(
        270deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.9) 12.86%,
        rgba(255, 255, 255, 0.9) 86.78%,
        rgba(255, 255, 255, 0) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin-top: 28px;
      &-icon {
        margin-right: 8px;
      }
    }
  }
}

:deep() {
  .el-radio__input.is-checked + .el-radio__label {
    color: var(--wl-primary-color);
  }
}
</style>
