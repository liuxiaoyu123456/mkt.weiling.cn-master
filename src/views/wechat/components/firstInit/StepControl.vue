<script lang="ts" setup>
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    step: number;
  }>(),
  {
    step: 0,
  }
);

const emits = defineEmits<{
  (val: "stepChange", e: number): void;
}>();

const nextGetText = computed(() => {
  let str = "下一步";
  if (props.step == 4) {
    str = "绑定查询";
  } else if (props.step == 5) {
    str = "授权查询";
  } else if (props.step == 7) {
    str = "完成";
  }
  return str;
});

const handleClick = (val: number) => {
  if ((props.step == 0 && val < 0) || (props.step > 7 && val > 0)) {
    return;
  }
  emits("stepChange", val);
};
</script>

<template>
  <div class="step-control">
    <div
      class="step-line"
      :style="{ width: 20 * step + '%' }"
      v-if="step != 7"
    ></div>
    <el-link
      class="pre-btn"
      @click="handleClick(-1)"
      v-if="step != 7 && step > 1"
    >
      <el-icon class="pre-icon">
        <wl-svg type="arrowTipLeft" />
      </el-icon>
      上一步
    </el-link>
    <div v-else></div>
    <el-button class="next-btn" type="primary" @click="handleClick(1)">{{
      nextGetText
    }}</el-button>
  </div>
</template>

<style lang="scss" scope>
.step-control {
  width: 858px;
  height: 100px;
  box-sizing: border-box;
  position: relative;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    top: 0;
    left: 0;
    background-color: var(--wl-line-color);
  }
  .step-line {
    position: absolute;
    height: 4px;
    left: 0;
    top: 0;
    background-color: var(--wl-primary-color);
    transition: all 0.3s;
  }
  .pre-btn {
    font-size: 16px;
    color: var(--wl-text-color-title-2);
    .pre-icon {
      font-size: 24px;
      margin-right: 4px;
    }
  }
  .next-btn {
    font-size: 16px;
  }
}

.el-link.is-underline:hover:after {
  display: none;
}
</style>
