<template>
  <el-link
    v-if="data[column.prop]"
    :href="data[column.prop]"
    target="_blank"
    type="primary"
    >{{ data[column.prop] }}</el-link
  >
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "wLink",
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    column: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
});
</script>
