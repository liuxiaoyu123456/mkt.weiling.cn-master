<template>
  <el-pagination
    class="pagination"
    layout="total, sizes, prev, pager, next"
    :page-sizes="defaultSizes"
    :total="total"
    :pageSize="limit"
    :currentPage="page"
    @update:pageSize="
      (val:number) => {
        emit('update:limit', val);
      }
    "
    @update:currentPage="
      (val:number) => {
        emit('update:page', val);
      }
    "
  >
  </el-pagination>
</template>
<script setup lang="ts">
defineProps<{
  total: number;
  limit: number;
  page: number;
}>();
const emit = defineEmits<{
  (e: "update:limit", val: number): void;
  (e: "update:page", val: number): void;
}>();
const defaultSizes = [10, 20, 50, 100];
</script>
<style lang="scss">
.el-pagination {
  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-pager {
    margin: 0 8px;
    > li:not(:first-child) {
      margin-left: 8px;
    }
  }
  .btn-prev,
  .number,
  .btn-quicknext,
  .btn-next {
    border-radius: 4px;
    color: #000;
    border: 1px solid #eee;
    &:hover {
      color: var(--wl-primary-color);
      border: 1px solid var(--wl-primary-color);
    }
  }
}
</style>
