<template>
  <div class="progress-bar">
    <div
      class="progress-bar-item"
      v-for="(item, i) in list"
      :key="i"
      :class="{
        todo: step < i,
        doing: step === i,
        done: step > i,
      }"
    >
      <div class="progress-bar-item-top">{{ item.text }}</div>
      <div class="progress-bar-item-bar"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    list: any;
    step: number;
  }>(),
  {
    list: [],
    step: 0,
  }
);
</script>

<style lang="scss" scoped>
.progress-bar {
  display: flex;
  align-items: center;
  width: 100%;

  &-item {
    flex: 1;

    &-top {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 8px;
      white-space: nowrap;
    }

    &-bar {
      width: 100%;
      height: 8px;
    }

    &:first-child {
      .progress-bar-item-bar {
        border-radius: 20px 0 0 20px;
      }
    }
    &:last-child {
      .progress-bar-item-bar {
        border-radius: 0 20px 20px 0;
      }
    }
  }

  .done {
    .progress-bar-item-top {
      color: var(--wl-text-color-title-1);
    }

    .progress-bar-item-bar {
      background: var(--wl-primary-color);
    }
  }

  .doing {
    .progress-bar-item-top {
      color: var(--wl-text-color-title-1);
    }

    .progress-bar-item-bar {
      background: linear-gradient(
          90deg,
          var(--wl-primary-color) 0%,
          rgba(28, 159, 255, 0) 100%
        ),
        #ebf0f5;
    }
  }

  .todo {
    .progress-bar-item-top {
      color: var(--wl-text-color-placeholder);
    }

    .progress-bar-item-bar {
      background: #ebf0f5;
    }
  }
}
</style>
