<template>
  <div class="card help">
    <div class="help-wrapper">
      <component :is="helperMap[$route.query.type as string]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import StaffCode from "./components/StaffCode.vue";
import StaffVisible from "./components/StaffVisible.vue";
import BaiduHelper from "./components/BaiduHelper.vue";
import AddStaffHelper from "./components/AddStaffHelper.vue";
import AddPhone from "./components/AddPhone.vue";
import type { Component } from "vue";
const helperMap: Record<string, Component> = {
  baidu: BaiduHelper,
  qrcode: StaffCode,
  visible: StaffVisible,
  tel: AddPhone,
  "add-staff": AddStaffHelper,
};
</script>
<style lang="scss" scoped>
.help {
  min-height: calc(100vh - 104px);
  &-wrapper {
    width: 734px;
    margin: auto;
    color: var(--wl-text-color-title-1);
  }
  &-title {
    color: var(--wl-text-color-title-1);
    font-weight: 600;
    font-size: 24px;
  }
  &-list {
    &-item {
      font-size: 18px;
      line-height: 2;
      .el-link {
        font-size: 18px;
        line-height: 2;
        vertical-align: baseline;
      }
      .danger {
        color: var(--wl-error-color-active);
      }
      .qr-code {
        height: 150px;
      }
      .phone-shot {
        height: 375px;
      }
    }
  }
}
</style>
