<template>
  <el-dialog
    :modelValue="modelValue"
    class="home-dialog"
    width="600"
    :showClose="false"
    :closeOnClickModal="false"
    append-to-body
    alignCenter
  >
    <img class="img" v-if="type == 'WeChatDefault'" :src="gift" alt="tip" />
    <img class="img opacity" v-else :src="warnTip" alt="tip" />
    <div class="bg-1"></div>
    <div class="bg-2"></div>
    <header class="dialog-header flex-col">
      <div class="welcome flex-row">
        <div>你好！</div>
        <WUser
          class="flex-1 user"
          :data="{ user }"
          :column="{ prop: 'user' }"
        />
      </div>
      <template v-if="type == 'WeChatDefault'">
        <div class="tryout">
          微信方案支持<span class="primary">7天免费试用！</span>
        </div>
        <div class="tip">
          试用期间所有基础设施均<span class="primary">由卫瓴免费提供。</span>
        </div>
      </template>
      <div v-else class="warn">
        免费试用{{ expired ? "已到期" : `还有${timeLeft}天有效期` }}
      </div>
    </header>
    <main class="dialog-body">
      <p class="border">
        试用到期后，自助充值并配置基础设施可继续使用~ <br />充值收费规则：
      </p>
      <ul>
        <li>1、按照实际加微数量计费，1元/1个加微</li>
        <li>
          2、单账户平台使用费50元，充值后自动扣除。（企业员工打开该应用的可见范围即视为开通账户。平台使用费用为企业微信收取的接口使用费。）
        </li>
        <li>
          3、支持无效返款：加微后，24小时内被用户删除，系统将自动返款到您的账户
        </li>
      </ul>
      <p class="border">基础设施配置：</p>
      <p>根据系统中操作指引配置小程序，无需做任何开发</p>
    </main>
    <template #footer>
      <div class="flex-col">
        <el-button
          type="primary"
          @click="
            emit('route', type);
            emit('update:modelValue', false);
          "
        >
          <el-icon class="arrow-right">
            <!-- <wl-svg type="arrowTipRight"></wl-svg> -->
          </el-icon>
          <span v-if="type == 'WeChatDefault'"> 快速配置微信方案 </span>
          <span v-else-if="type == 'Charge'"> 立即充值 </span>
          <span v-else-if="type == 'MinappAdd'"> 立即配置小程序 </span>
          <el-icon class="arrow-right">
            <wl-svg type="arrowTipRight"></wl-svg>
          </el-icon>
        </el-button>
        <el-link
          :underline="false"
          class="self-center"
          @click.prevent="emit('update:modelValue', false)"
          >稍后再说</el-link
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import warnTip from "@/assets/images/bg-warntip.png";
import gift from "@/assets/images/bg-gift.png";
withDefaults(
  defineProps<{
    modelValue: boolean;
    type?: "WeChatDefault" | "Charge" | "MinappAdd";
    timeLeft?: number;
    expired?: boolean;
  }>(),
  {
    type: "WeChatDefault",
    timeLeft: 0,
    expired: true,
  }
);
const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "route", to: string): void;
}>();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>
<style lang="scss">
.home-dialog {
  &.el-dialog {
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    .dialog {
      &-header {
        gap: 12px;
        margin-bottom: 16px;
        font-size: 20px;
        padding: 0 46px;
        position: relative;
        z-index: 10;
        .welcome {
          color: var(--wl-text-color-title-1);
          font-weight: 500;
          .user {
            min-width: 0;
            font-size: 16px;
            :deep(.avatar) {
              font-size: 32px;
            }
          }
        }
        .tryout {
          color: var(--wl-text-color-title-2);
        }
        .tip {
          font-size: 16px;
        }
        .warn {
          color: var(--wl-warning-color);
          font-size: 20px;
        }
      }
      &-body {
        position: relative;
        z-index: 10;
        border-radius: 16px;
        box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(20px);
        padding: 16px 24px;
        margin: 0 22px;
        color: var(--wl-text-color-title-2);
        line-height: 24px;
        .border {
          font-weight: 500;
        }
      }
    }
    .img {
      position: absolute;
      right: 36px;
      top: 0;
      &.opacity {
        opacity: 0.2;
      }
    }
    [class^="bg-"] {
      position: absolute;
      background: radial-gradient(
        closest-side,
        rgba(28, 159, 255, 0.15) 60%,
        transparent
      );
    }
    .bg-1 {
      top: -20px;
      left: -120px;
      width: 620px;
      height: 300px;
      transform: rotate(30deg);
    }
    .bg-2 {
      bottom: -80px;
      right: -200px;
      width: 800px;
      height: 320px;
      transform: rotate(15deg);
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding-bottom: 12px;
    }
    .el-dialog__footer {
      padding-bottom: 12px;
      position: relative;
      z-index: 10;
      .el-button {
        height: 56px;
        border-radius: 16px;
        & > span {
          font-weight: 500;
          font-size: 20px;
          flex: 1;
          display: flex;
          justify-content: space-between;
        }
      }
      .el-link {
        margin-top: 12px;
      }
    }
  }
}
</style>
