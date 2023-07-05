<!-- 标签选择-弹窗 -->
<template>
  <Dialog
    v-model:value="dialogVisible"
    title="分组选择"
    size="640px"
    class="w_tag_dialog"
    :showFooter="false"
    :modal="false"
    cancelButtonText="返回上一级"
    @onSure="onSure"
  >
    <TagGroup v-bind="$attrs" @onTagChecked="onTagChecked" />
  </Dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
import TagGroup from "./TagGroup.vue";
import { debounce } from "lodash-es";
export default defineComponent({
  components: { TagGroup },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{
      dialogVisible: boolean;
      currentTag: any;
    }>({
      dialogVisible: false,
      currentTag: {},
    });
    const onSure = debounce(() => {
      emit("onConfirm", state.currentTag);
    }, 300);
    const onTagChecked = (val: any) => {
      state.currentTag = val;
      emit("onConfirm", val);
    };
    watch(
      () => props.value,
      (val) => {
        state.dialogVisible = val;
      }
    );
    watch(
      () => state.dialogVisible,
      (val) => {
        if (!val) emit("update:value", false);
      }
    );
    return {
      ...toRefs(state),
      onSure,
      onTagChecked,
    };
  },
});
</script>

<style scoped lang="scss">
.w_tag_dialog {
  .el-dialog__body {
    padding: 12px !important;
  }
}
</style>
