<template>
  <div class="fields">
    <div class="fields-row fields-title">
      <div
        class="fields-cell"
        v-for="(col, index) in columns"
        :style="col.style"
        :key="col.prop || index"
      >
        <slot name="header" :column="col">
          {{ col.name }}
        </slot>
      </div>
    </div>
    <TransitionGroup name="list" tag="div" class="fields-body">
      <div
        class="fields-row"
        v-for="(item, index) in data"
        :key="item.rowKey || index"
      >
        <div
          class="fields-cell"
          v-for="(col, index) in columns"
          :style="col.style"
          :key="col.prop || index"
        >
          <slot name="cell" :column="col" :cell="item">
            {{ item[col.prop] }}
          </slot>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
interface Column {
  name: string;
  prop: string;
  style?: any;
}
interface Item {
  [attrs: string]: any;
}
withDefaults(
  defineProps<{
    columns: Column[];
    data: Item[];
  }>(),
  {
    columns: () => [],
    data: () => [],
  }
);
</script>
<style lang="scss" scoped>
.fields {
  display: flex;
  flex-direction: column;

  &-cell {
    flex: none;
  }

  &-row {
    display: flex;
  }
  &-title {
    flex: none;
  }
  &-body {
    flex: 1;
    overflow: auto;
    position: relative;
    .list-move,
    .list-enter-active,
    .list-leave-active {
      transition: all 0.3s ease;
    }

    .list-enter-from,
    .list-leave-to {
      opacity: 0;
    }
    .list-leave-active {
      position: absolute;
    }
  }
}
</style>
