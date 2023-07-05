<template>
  <el-dialog
    :modelValue="modelValue"
    class="charge-dialog"
    width="600"
    :showClose="false"
    :closeOnClickModal="false"
    alignCenter
  >
    <header class="dialog-header">你好 请仔细阅读下方充值收费规则</header>
    <main class="dialog-body">
      <ul>
        <li>1、按照实际加微数量计费，1元/1个加微</li>
        <li>
          2、单账户平台使用费50元，充值后自动扣除。（该费用为企业微信收取的接口使用费）
        </li>
        <li>
          3、支持无效返款：加微后，24小时内被用户删除，系统将自动返款到您的账户
        </li>
      </ul>
    </main>
    <template #footer>
      <el-button type="primary" @click="$emit('update:modelValue', false)">
        我已知晓
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    type?: "first" | "warn";
    timeLeft?: number;
  }>(),
  {
    type: "first",
    timeLeft: 0,
  }
);
const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (e: "route", to: string): void;
}>();
</script>
<style lang="scss">
.charge-dialog {
  &.el-dialog {
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    .dialog {
      &-header {
        font-weight: 600;
        font-size: 16px;
        color: var(--wl-text-color-title-2);
        text-align: center;
      }
      &-body {
        padding: 16px 0;
        line-height: 22px;
      }
    }

    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 36px 42px 0;
    }
    .el-dialog__footer {
      padding: 0 0 62px;
      text-align: center;
      .el-button {
        height: 56px;
        width: 302px;
        border-radius: 16px;
        font-weight: 500;
        font-size: 20px;
      }
    }
  }
}
</style>
