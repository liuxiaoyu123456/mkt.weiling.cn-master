<template>
  <div
    @mouseleave="showTooltip = false"
    @mouseenter="showTips"
    v-if="innerText !== undefined"
  >
    <el-tooltip
      popper-class="table-cell-tooltip"
      effect="dark"
      :visible="showTooltip"
      :content="String(innerText)"
      placement="top"
      :offset="24"
      :disabled="!showTooltip"
    >
      <span class="inner-text">{{ innerText }}</span>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  innerText: string | number;
}>();
const showTooltip = ref(false);
const showTips = (e: any) => {
  /*e为鼠标移入时的事件对象*/
  /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
  let TemporaryTag = document.createElement("span");
  TemporaryTag.innerText = props.innerText + "";
  TemporaryTag.className = "getTextWidth";
  document.querySelector("body")?.appendChild(TemporaryTag);
  let currentWidth = (
    document.querySelector(".getTextWidth") as HTMLSpanElement
  ).offsetWidth;
  document.querySelector(".getTextWidth")?.remove();

  /*cellWidth为表格容器的宽度*/
  const cellWidth = e.target.offsetWidth;

  /*当文本宽度小于||等于容器宽度两倍时，代表文本显示未超过两行*/
  showTooltip.value = currentWidth > 2 * cellWidth;
};
</script>
<style scoped lang="scss">
.inner-text {
  @extend %ov2;
}
</style>
