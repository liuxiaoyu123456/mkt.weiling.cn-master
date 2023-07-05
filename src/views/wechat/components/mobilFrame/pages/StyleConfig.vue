<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    tabsValue?: string;
    ruleFormHoverButton?: any;
  }>(),
  {
    tabsValue: "bottomHoverButtonForm",
    ruleFormHoverButton: {
      colorChoosed: {
        background: "var(--wl-primary-color)",
        color: "#fff",
      },
    },
  }
);

//底部悬浮按钮的动态样式
const bottomHoverButtonFormStyle = computed(() => {
  let { background, color } = props.ruleFormHoverButton.colorChoosed;
  return {
    background,
    color,
    boxShadow: `0 5px 10px ${background}`,
  };
});
</script>

<template>
  <div class="style-config">
    <iframe
      class="iframe"
      src="https://ad.weiling.cn/worktable-erp-preview-page"
      ref="iframe"
      title="preview website"
    />
    <!-- 底部悬浮按钮 v-show="tabsValue == 'bottomHoverButtonForm'"-->
    <div
      class="flex-center bottomButtonFixed bottomHoverButtonForm"
      :style="bottomHoverButtonFormStyle"
    >
      <!-- <span>{{ ruleFormHoverButton.buttonText }}</span> -->
      <span>立即加微</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.style-config {
  position: relative;
  width: 100%;
  height: 100%;
  .iframe {
    width: 100%;
    height: 4000px;
    border: 0;
    margin-top: 35px;
  }
  .bottomButtonFixed {
    position: absolute;
    right: 8%;
    top: 570px;
    cursor: pointer;
  }
  .bottomHoverButtonForm {
    height: 48px;
    width: 84%;
    color: #ffffff;
    background: var(--wl-primary-color);
    border-radius: 24px;
    font-size: 16px;
    box-shadow: 0 5px 10px rgba(28, 159, 255, 0.58);
  }
}
</style>
