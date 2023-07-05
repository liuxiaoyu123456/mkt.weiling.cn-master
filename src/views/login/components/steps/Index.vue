<script lang="ts" setup>
import { ref } from "vue";
import WeComJudge from "./WeComJudge.vue";
import DownCode from "./DownCode.vue";
import InstallCode from "./InstallCode.vue";
import LoginPage from "./LoginPage.vue";
import { identityConfig } from "../steps/config";
import { ElImageViewer } from "element-plus";
import "element-plus/theme-chalk/el-image-viewer.css";
import InstallGuideCode from "@/assets/images/qrcode/install-guide.png";

const props = withDefaults(
  defineProps<{
    options: any;
    process: number;
  }>(),
  {
    options: {},
    process: 0,
  }
);

const emit = defineEmits<{
  (e: "update:process", val: number): void;
}>();
const showViewer = ref(false);
const preView = () => {
  showViewer.value = true;
};

const handleGo = (type: number) => {
  if (type > 0) {
    if (props.process === 1) {
      if (props.options.wecom === 1) {
        emit("update:process", props.process + 2);
      } else {
        emit("update:process", props.process + 1);
      }
    } else {
      emit("update:process", props.process + 1);
    }
  } else {
    if (props.process === 3) {
      if (props.options.wecom === 1) {
        emit("update:process", props.process - 2);
      } else {
        emit("update:process", props.process - 1);
      }
    } else {
      emit("update:process", props.process - 1);
    }
  }
};
</script>

<template>
  <div class="steps-wrap">
    <div class="notice">
      <el-icon class="notice-icon">
        <wl-svg type="remindFill" />
      </el-icon>
      <span>免费试用 ，加微无效返款！</span>
    </div>

    <div class="steps-container">
      <div class="top-area">
        <img
          class="logo"
          :src="getCosImageUrl('logo.png')"
          alt="logo"
        />
        <div class="link" @click="preView">
          <div class="img-box">
            <img
              src="https://wlmvp-cos.weiling.cn/worktable-h5/xiaowei_code/contact_xw/contact-avater.gif?v=22"
              alt="xw"
            />
          </div>
          <span>联系客服</span>
        </div>
      </div>
      <div class="step-wrap">
        <WeComJudge
          :info="identityConfig[options.identity]"
          v-if="process === 1"
          :options="options"
        />
        <DownCode
          :info="identityConfig[options.identity]"
          v-else-if="process === 2"
        />
        <InstallCode
          :info="identityConfig[options.identity]"
          v-else-if="process === 3"
        />
        <LoginPage
          :info="identityConfig[options.identity]"
          v-else-if="process === 4"
        />
      </div>
      <div class="bottom-area">
        <el-button class="pre-btn" @click="handleGo(-1)">
          <el-icon class="pre-icon">
            <wl-svg type="arrowTipLeft" />
          </el-icon>
          上一步
        </el-button>
        <el-button
          class="next-btn"
          type="primary"
          v-if="process !== 4"
          @click="handleGo(1)"
          :disabled="!options.wecom && process === 1"
          >{{ process < 3 ? "下一步" : "去登录" }}</el-button
        >
        <div v-else></div>
      </div>
    </div>

    <el-image-viewer
      v-if="showViewer"
      hide-on-click-modal
      :url-list="[InstallGuideCode]"
      :teleported="true"
      @close="showViewer = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.steps-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
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
    margin-bottom: 18px;
    &-icon {
      margin-right: 8px;
    }
  }
  .steps-container {
    width: 806px;
    height: 556px;
    background: #ffffff;
    box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    box-sizing: border-box;
    padding-bottom: 32px;
    display: flex;
    flex-direction: column;
    .top-area {
      height: 100px;
      border-bottom: 1px solid var(--wl-line-color-light);
      display: flex;
      justify-content: space-between;
      .logo {
        height: 100%;
      }

      .link {
        display: flex;
        align-items: center;
        align-self: center;
        justify-content: space-between;
        margin-right: 24px;
        user-select: none;
        cursor: pointer;
        &:hover {
          > span {
            color: var(--wl-primary-color-hover);
            background-size: 100% 2px;
          }
        }
        .img-box {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 4px;
          box-shadow: 0 4px 16px #0000001f;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        > span {
          transition: background-size 0.2s;
          color: var(--wl-text-color-title-1);
          line-height: 20px;
          background: linear-gradient(
            to right,
            var(--wl-primary-color-hover),
            var(--wl-primary-color-light)
          );
          background-size: 0 2px;
          background-repeat: no-repeat;
          background-position: 0 18px;
        }
      }
    }
    .step-wrap {
      flex: 1;
      padding: 32px 36px 0;
    }
    .bottom-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      padding: 0 36px;
      .pre-btn {
        border: 0;
        font-size: 16px;
        .pre-icon {
          font-size: 20px;
          margin-right: 4px;
        }
      }
      .next-btn {
        font-size: 16px;
      }
    }
  }
}
</style>
