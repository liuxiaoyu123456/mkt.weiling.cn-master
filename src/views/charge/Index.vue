<template>
  <Transition mode="out-in">
    <div v-if="orderStatus !== Status.SUCCESS" class="card flex-row h-full">
      <!-- 左侧返回 start -->
      <div class="left flex-1">
        <el-link
          :underline="false"
          @click="router.push({ name: 'IndexDefault' })"
        >
          <el-icon><wl-svg type="arrowTipLeft" /></el-icon>返回</el-link
        >
      </div>
      <!-- 左侧返回end -->
      <!-- 主体 start-->
      <div class="center">
        <h3 class="center-title">充值中心</h3>
        <div class="center-balance">
          当前余额：<span class="money">{{ accountState.balance }}</span
          >元
        </div>
        <div class="center-choose">选择金额</div>
        <MoneySelector v-model="money" />
        <div class="center-custom">
          <el-input
            v-model="money"
            placeholder="输入自定义金额"
            :formatter="inputFormatter"
            :parser="inputParser"
          ></el-input
          ><span class="unit">元</span>
        </div>
        <div class="flex-row center-qrcode">
          <div v-loading="loading" class="qr-wrapper">
            <img v-if="codeUrl" class="qr-img" alt="qr" :src="qrcode" />
            <p v-if="tip" class="qr-tip flex-center">{{ tip }}</p>
          </div>
          <div class="flex-col justify-center">
            <div class="pay-info">
              应付金额：¥<span class="pay-info-money">{{ targetMoney }}</span>
            </div>
            <div class="pay-type flex-row">
              <div class="icon flex-center">
                <el-icon><wl-svg type="wechatFill" /></el-icon>
              </div>
              使用微信扫码支付
            </div>
          </div>
        </div>
      </div>
      <!-- 主体end -->
      <div class="right flex-1">
        <el-link :underline="false" @click="showRule = true">
          <img
            src="@/assets/images/icon_rule.png"
            alt="icon"
            class="rule-icon"
          />收费规则</el-link
        >
      </div>
    </div>
    <!-- 充值成功start -->
    <div
      v-else
      class="card charge-success flex-col items-center justify-center h-full"
    >
      <el-icon class="icon">
        <wl-svg type="successFill" />
      </el-icon>
      <p class="money">成功充值 {{ targetMoney }} 元</p>
      <p class="order">
        该订单{{ orderId }}已支付成功，进入
        <router-link :to="{ name: 'ChargeDetail' }">订单详情</router-link>
      </p>
      <el-button
        v-if="accountState.haveMiniApp && accountState.haveSolution"
        type="primary"
        size="small"
        @click="router.push({ name: 'IndexDefault' })"
        >完成</el-button
      >
      <el-button
        v-else-if="!accountState.haveSolution"
        type="primary"
        @click="router.push({ name: 'WeChatDefault' })"
        >去配置微信方案
      </el-button>
      <el-button
        v-else
        type="primary"
        @click="router.push({ name: 'MiniAppDefault' })"
        >去配置小程序
      </el-button>
      <el-link
        class="mt-4"
        @click="router.push({ name: 'IndexDefault' })"
        v-if="!accountState.haveMiniApp || !accountState.haveSolution"
        :underline="false"
        type="info"
        >暂不配置，返回首页</el-link
      >
    </div>
    <!-- 充值成功 end -->
  </Transition>
  <ChargeDialog v-model="showRule" />
</template>

<script lang="ts" setup>
import { debounce } from "lodash-es";
import { ref, watch, onBeforeUnmount } from "vue";
import MoneySelector from "./components/MoneySelector.vue";
import ChargeDialog from "./components/ChargeDialog.vue";
import { useAccountState } from "@/stores";
import { payCreateOrder, payQueryOrder } from "@/api";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQRCode } from "@vueuse/integrations/useQRCode";

const router = useRouter();
const store = useAccountState();
const { updateAccountState } = store;
const { accountState } = storeToRefs(store);
const money = ref(1000);
const targetMoney = ref(1000);
const inputFormatter = (input: number) => {
  return Number.isNaN(input) ? 0 : input;
};
const inputParser = (input: string) => {
  const num = Math.abs(Number.parseInt(input));
  return Math.min(num, 1000000);
};

const loading = ref(true);
const codeUrl = ref("");
const orderId = ref("");
const orderStatus = ref(-1);
const tip = ref("");
const qrcode = useQRCode(codeUrl);
const showRule = ref(false);
watch(
  money,
  debounce(async (val) => {
    if (!val) {
      return;
    }
    try {
      loading.value = true;
      targetMoney.value = val;
      const res = await payCreateOrder({
        payWay: payCreateOrder.PayType.WECHAT,
        fee: targetMoney.value * 100,
      });
      codeUrl.value = res.data?.codeUrl || "";
      orderId.value = res.data?.orderId || "";
    } catch {
      codeUrl.value = "";
      orderId.value = "";
    } finally {
      loading.value = false;
    }
  }, 1000),
  {
    immediate: true,
  }
);
let stop: any;
watch(orderId, () => {
  stop && stop();
  const timer = setInterval(() => {
    checkOrder();
  }, 800);
  stop = () => {
    clearInterval(timer);
    stop = null;
  };
});
onBeforeUnmount(() => {
  stop && stop();
});
const checkOrder = async () => {
  const { data } = await payQueryOrder({ orderId: orderId.value });
  orderStatus.value = data.status;
};
const Status = payQueryOrder.Status;
watch(orderStatus, (status) => {
  if (status === Status.ING) {
    tip.value = "支付中...";
  } else if (status === Status.SUCCESS) {
    updateAccountState();
    stop && stop();
  }
});
//init
store.updateAccountState();
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.left {
  min-width: 80px;
  .el-link {
    font-size: 16px;
  }
}
.right {
  min-width: 80px;
  .rule-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}
.h-full {
  min-height: calc(100vh - 104px);
}
.mt-4 {
  margin-top: 16px;
}
.center {
  width: 880px;
  &-title {
    font-size: 20px;
    line-height: 28px;
    color: var(--wl-text-color-title-1);
    margin-bottom: 36px;
  }
  &-balance {
    color: var(--wl-text-color-title-2);
    line-height: 1;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--wl-line-color);
    margin-bottom: 42px;
    .money {
      color: var(--wl-primary-color);
      font-weight: 600;
      vertical-align: -4px;
      font-size: 32px;
      margin: 8px;
    }
  }
  &-choose {
    margin-bottom: 36px;
  }
  &-custom {
    padding: 24px 0 36px;
    .el-input {
      width: 176px;
      height: 60px;
      font-size: 16px;
    }
    .unit {
      margin-left: 8px;
    }
  }
  &-qrcode {
    background-color: var(--wl-body-color);
    border-radius: 8px;
    padding: 24px;
    gap: 24px;
    .qr-wrapper {
      position: relative;
      background-color: #fff;
      width: 128px;
      height: 128px;
    }
    .qr-img {
      display: block;
      width: 128px;
      height: 128px;
    }
    .qr-tip {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.95);
    }
    .pay-info {
      color: var(--wl-text-color-title-2);
      line-height: 1;
      margin-bottom: 22px;
      &-money {
        color: var(--wl-error-color);
        font-weight: 600;
        font-size: 40px;
      }
    }
    .pay-type {
      color: var(--wl-text-color-secondary-1);
      .icon {
        width: 24px;
        height: 24px;
        background: linear-gradient(0deg, #07c160 1.63%, #02e36f 99.89%);
        margin-right: 8px;
      }
      :deep(.el-icon) {
        color: #fff;
        font-size: 20px;
      }
    }
  }
}
.charge-success {
  background: url("https://wlmvp-cos.weiling.cn/worktable-erp/bigPic/home_xiaowei.png?v=000")
    left calc(50% - 256px) top calc(50% + 60px) / 170px 156px no-repeat #fff;
  .icon {
    font-size: 80px;
    color: var(--wl-success-color);
    margin-bottom: 24px;
  }
  .money {
    color: var(--wl-text-color-title-1);
    margin-bottom: 18px;
    font-weight: 500;
    font-size: 20px;
    line-height: 140%;
  }
  .order {
    margin-bottom: 72px;
  }
  .el-button {
    width: 278px;
  }
}
</style>
