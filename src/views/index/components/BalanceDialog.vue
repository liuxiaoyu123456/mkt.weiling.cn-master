<template>
  <el-dialog
    v-model="dialogBalance"
    width="600px"
    :show-close="false"
    align-center
    append-to-body
    class="balance-dialog"
    :close-on-click-modal="false"
  >
    <div class="flex-col">
      <div class="warnning-title">
        您的账户余额{{ accountState.balance > 0 ? "已不足100元" : "为0" }}！
      </div>
      <div class="warnning-msg">
        {{
          accountState.balance > 0
            ? "余额为0后客户将无法添加员工好友。"
            : "客户现已经无法添加员工好友，请立即充值！"
        }}如遇问题，可随时咨询小微。
      </div>
      <el-button
        @click="
          dialogBalance = false;
          emit('confirm');
        "
        class="submit"
        type="primary"
        >立即充值</el-button
      >
      <el-button
        @click="
          dialogBalance = false;
          emit('cancel');
        "
        class="cancal"
        type="info"
        link
        >稍后再说</el-button
      >
      <img class="err-img" :src="getCosImageUrl('miniapp-error.png')" alt="" />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useAccountState } from "@/stores";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useSessionStorage } from "@vueuse/core";
const props = defineProps<{
  forceHidden: boolean;
}>();
const accountStore = useAccountState();
const { accountState } = storeToRefs(accountStore);
const showDialog = useSessionStorage("showBalanceDialog", true);
const dialogBalance = computed({
  get() {
    return (
      !props.forceHidden &&
      accountState.value.status === 1 &&
      accountState.value.balance < 100 &&
      showDialog.value
    );
  },
  set(val) {
    !val && (showDialog.value = false);
  },
});
const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>
<style lang="scss">
.balance-dialog {
  border-radius: 24px;
  // height: 292px;
  box-sizing: border-box;
  .warnning-title {
    color: var(--wl-warning-color);
    font-size: 20px;
    font-weight: 500;
  }
  .warnning-msg {
    color: var(--wl-text-color-primary-2);
    font-size: 20px;
    font-weight: 400;
    margin-top: 25px;
  }
  .err-img {
    position: absolute;
    width: 181px;
    height: 160px;
    top: 0;
    right: 33px;
  }
  .submit {
    margin-top: 45px;
    height: 56px;
    border-radius: 16px;
    font-size: 20px;
    box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.06);
  }
  .cancal {
    font-weight: 500;
    font-size: 14px;
    line-height: 40px;
    color: #b1b1b1;
  }
}
.el-dialog.balance-dialog .el-dialog__header {
  display: none;
}
.el-dialog.balance-dialog .el-dialog__body {
  width: 516px;
  padding: 48px 42px 0;
  position: relative;
}
</style>
