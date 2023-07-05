<template>
  <div class="w-click-text">{{ data[column.prop] }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "wClickText",
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

<style lang="scss" scoped>
.w-click-text {
  color: var(--wl-primary-color-dark);
  font-weight: 500;
  cursor: pointer;
}
.w-click-text:hover {
  color: #4b6fc4;
}
</style>
