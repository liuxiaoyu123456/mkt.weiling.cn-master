<template>
  <div class="flex-row flex-wrap radio-group">
    <div
      v-for="count in counts"
      class="radio-group-item flex-none"
      :class="{
        selected: count == modelValue,
      }"
      @click="emit('update:modelValue', count == modelValue ? 0 : count)"
      :key="count"
    >
      {{ count }}<span class="unit">元</span>
      <div class="recommend" v-if="recommend == count">新客推荐</div>
      <div class="select-icon"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: number;
    counts?: number[];
    recommend?: number;
  }>(),
  {
    counts: () => [100, 200, 500, 1000, 2000, 5000, 10000],
    recommend: 1000,
    modelValue: 1000,
  }
);
const emit = defineEmits<{
  (e: "update:modelValue", val: number): void;
}>();
</script>
<style lang="scss" scoped>
.radio-group {
  gap: 16px 24px;
  &-item {
    position: relative;
    user-select: none;
    height: 60px;
    border: 1px solid var(--wl-line-color);
    width: 20%;
    border-radius: 8px;
    line-height: 58px;
    text-align: center;
    font-weight: 600;
    font-size: 28px;
    color: var(--wl-text-color-title-2);
    cursor: pointer;
    .select-icon {
      display: none;
      position: absolute;
      right: -1px;
      bottom: -1px;
      width: 16px;
      height: 16px;
      background-color: var(--wl-primary-color);
      border-radius: 8px 0;

      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 6px;
        height: 2px;
        background-color: #fff;
        border-radius: 1px;
        bottom: 3px;
        right: 8px;
        transform-origin: right;
        transform: rotate(45deg);
      }
      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 2px;
        height: 9px;
        background-color: #fff;
        border-radius: 1px;
        bottom: 4px;
        right: 8px;
        transform-origin: bottom center;
        transform: rotate(45deg);
      }
    }
    &.selected {
      border-color: var(--wl-primary-color);
      color: var(--wl-primary-color);
      box-shadow: 6px 6px 24px var(--wl-primary-color-light);
      background-color: var(--wl-primary-color-light);
      .select-icon {
        display: block;
      }
    }
    .unit {
      font-size: 20px;
      font-weight: 400;
    }
    .recommend {
      position: absolute;
      background-color: var(--wl-error-color);
      color: #fff;
      font-weight: 400;
      font-size: 16px;
      border-radius: 6px;
      line-height: 24px;
      padding: 0 12px;
      top: -12px;
      left: 0;
    }
  }
}
</style>
