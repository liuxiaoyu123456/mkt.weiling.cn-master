<template>
  <Cell v-if="data[column.prop]" :innerText="formatTime" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import dayjs from "dayjs";
import Cell from "./TableCell.vue";
export default defineComponent({
  name: "wDate",
  components: {
    Cell,
  },
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
  setup(props) {
    const formatTime = computed(() => {
      return props.data[props.column.prop]
        ? dayjs(+props.data[props.column.prop]).format("YYYY年MM月DD日 HH:mm")
        : "";
    });
    return {
      formatTime,
    };
  },
});
</script>
