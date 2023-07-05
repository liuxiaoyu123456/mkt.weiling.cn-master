<template>
  <Cell
    v-if="data[column.prop] !== undefined"
    :innerText="data[column.prop]"
    :style="{ ...column.style }"
  />
</template>

<script setup lang="ts">
import Cell from "./TableCell.vue";
const props = withDefaults(
  defineProps<{
    data?: any;
    column?: any;
  }>(),
  {
    data: () => ({}),
    column: () => ({}),
  }
);
</script>
