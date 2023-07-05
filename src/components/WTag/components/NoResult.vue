<template>
  <div class="no_result flex-column cross-center">
    <img :src="formatCosUrl('/worktable-erp/default_no result.png')" alt="" />
    <p>暂未搜索到相关结果</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { formatCosUrl } from "@/utils/utils";
</script>

<style scoped lang="scss">
.no_result {
  img {
    width: 220px;
    height: auto;
    margin: 40px auto 0;
  }
  p {
    font-size: 16px;
    color: #979797;
    text-align: center;
  }
}
</style>
