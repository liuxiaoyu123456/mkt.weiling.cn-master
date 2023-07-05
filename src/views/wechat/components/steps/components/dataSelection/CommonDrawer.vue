<template>
  <el-drawer v-bind="$attrs" custom-class="common_drawer" v-model="drawer">
    <slot />
  </el-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  name: "CommonEldrawer",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{
      drawer: boolean;
    }>({
      drawer: false,
    });
    watch(
      () => props.value,
      (bol) => {
        state.drawer = bol;
      }
    );
    watch(
      () => state.drawer,
      (bol) => {
        if (!bol) emit("update:value", false);
      }
    );
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
:deep() {
  .el-drawer__header {
    font-size: 18px;
    color: #202d40;
    padding-bottom: 14px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 0;
    .el-drawer__title {
      font-size: inherit;
    }
    span {
      font-weight: 500;
    }
    &:before {
      content: "";
      width: 3px;
      height: 14px;
      background: var(--wl-primary-color);
      border-radius: 4px;
      margin-right: 8px;
    }
  }
}
</style>
