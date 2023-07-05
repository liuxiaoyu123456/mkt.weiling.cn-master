<template>
  <div class="rank-list flex-1">
    <slot />
    <div v-if="empty && finished" class="gray empty flex-center flex-col">
      <img src="@/assets/images/default_no_result.png" alt="result" />
      <span>暂无数据</span>
    </div>
    <div v-else class="gray end flex-center">
      {{ finished ? "暂无更多" : "加载中..." }}
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    finished?: boolean;
    empty?: boolean;
  }>(),
  {
    finished: false,
    empty: false,
  }
);
</script>
<style scoped lang="scss">
.rank-list {
  overflow: auto;
  min-height: 0;
  contain: strict;
}
.empty {
  height: 100%;

  img {
    max-width: 60%;
    width: 200px;
  }
}
.end {
  height: 68px;
}
.gray {
  color: #c1c1c1;
}
</style>
