<template>
  <div class="list-item flex-row items-center">
    <div class="list-item-rank flex-center" :class="iconList[index]">
      <span v-if="index > 2">{{ index + 1 }}</span>
      <div class="list-item-rank-icon" v-else>
        <el-icon :class="iconList[index]">
          <wl-svg :type="iconList[index]" />
        </el-icon>
        <div class="mask"></div>
      </div>
    </div>
    <div class="line flex-row flex-1">
      <div class="list-item-main flex-1 flex-col justify-center">
        <div class="list-item-main-title text-l1">{{ item.state || "" }}</div>
        <div class="list-item-main-detail flex-row items-center">
          <WUser :data="item" :column="{ prop: 'creator' }" class="user" />
          <span class="flex-none">创建</span>
        </div>
      </div>
      <!-- @click="emit('toDetail', item)" -->
      <div class="list-item-friends flex-col cross-center main-center">
        <div class="flex-row cross-center">
          <el-icon>
            <wl-svg type="wecom" />
          </el-icon>
          <span style="color: var(--wl-text-color-secondary-1)">带来加微</span>
        </div>
        <div class="count">{{ item.customerCount || 0 }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  index: number;
  item: any;
}>();
const emit = defineEmits<{
  (e: "toDetail", val: string): void;
}>();
const iconList = ["medal1", "medal2", "medal3"];
</script>
<style lang="scss" scoped>
.list-item {
  .line {
    padding: 8px 0;
    margin-right: 26px;
    border-bottom: 0.5px solid var(--wl-line-color-light);
    width: 0;
  }

  &-rank {
    width: 72px;
    font-weight: 600;
    font-size: 22px;
    color: var(--wl-text-color-secondary-2);
    .el-icon {
      display: block;
      &.medal1 {
        color: #f2c951;
      }
      &.medal2 {
        color: #a8acc2;
      }
      &.medal3 {
        left: 0;
        background: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.6) 25%,
          transparent 75%
        );
        right: 0;
        top: 0;
        bottom: 0;
      }
    }
    &-icon {
      position: relative;
      height: 1em;
      font-size: 44px;
      > .mask {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.6) 25%,
          transparent 75%
        );
      }
    }
  }
  &-main {
    gap: 4px;
    width: 0;

    &-title {
      font-weight: 500;
      font-size: 18px;
      color: var(--wl-text-color-title-2);
    }

    &-detail {
      overflow: hidden;
      gap: 4px;
      .qr-code {
        color: #ccced7;
      }
      color: var(--wl-text-color-secondary-1);
      .user {
        max-width: calc(100% - 40px);
        :deep(> .avatar) {
          font-size: 22px;
        }
      }
    }
  }

  &-friends {
    box-sizing: border-box;
    width: 86px;
    height: 64px;
    background: var(--wl-primary-color-lightest);
    border-radius: 8px;
    margin-left: 16px;
    gap: 4px;
    font-size: 12px;

    .el-icon {
      font-size: 18px;
    }

    .count {
      font-weight: 600;
      font-size: 22px;
      line-height: 1;
      color: var(--wl-text-color-primary-1);
    }
  }
}
</style>
