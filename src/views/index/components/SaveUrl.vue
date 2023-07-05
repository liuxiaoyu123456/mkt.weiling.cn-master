<template>
  <teleport v-if="modelValue" to="#app">
    <div class="favorites card">
      <div class="favorites-pic">
        <div class="favorites-bar flex-row justify-between items-center">
          <span>https://www.jkt.com</span>
          <el-icon><Star /></el-icon>
        </div>
      </div>
      <p class="favorites-des">
        点击上方浏览器中的“⭐”按钮，将集客通保存在书签中，下次打开更方便~
      </p>
      <div class="favorites-close">
        <el-button type="primary" @click="emit('update:modelValue', false)"
          >我已保存</el-button
        >
      </div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import { Star } from "@element-plus/icons-vue";
defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", show: boolean): void;
}>();
</script>
<style lang="scss">
.favorites {
  position: fixed;
  top: 16px;
  right: 64px;
  width: 318px;
  z-index: 999;
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.16);
  &-pic {
    border-radius: 2px;
    background-color: var(--wl-line-color-light);
    padding: 38px 28px;
    margin-bottom: 12px;
  }
  &-bar {
    border-radius: 4px;
    background-color: #fff;
    padding: 8px;
  }
  &-des {
    color: var(--wl-text-color-primary-2);
  }
  &-close {
    text-align: right;
  }
}
</style>
