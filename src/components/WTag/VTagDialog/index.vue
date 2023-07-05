<!-- 标签选择-弹窗 -->
<template>
  <Dialog
    v-model:value="dialogVisible"
    title="标签选择"
    size="640px"
    custom-class="w_tag_dialog"
    :showFooter="false"
  >
    <TagSelect
      ref="tagSelectRef"
      :visible="dialogVisible"
      @onClose="onClose"
      :can-add="canAdd"
      :lock-self="lockSelf"
      :checked-tag="checkedTag"
      :multiple-limit="multipleLimit"
      @onTagCheck="onTagCheck"
    />
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
import TagSelect from "@/components/WTag/components/TagSelect.vue";
export default defineComponent({
  components: { TagSelect },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    checkedTag: {
      type: Array,
      default() {
        return [];
      },
    },
    canAdd: {
      type: Boolean,
      default: false,
    },
    lockSelf: {
      type: Boolean,
      default: false,
    },
    multipleLimit: {
      type: Number,
      default: 0,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{
      dialogVisible: boolean;
      dialogGroupVisible: boolean;
      tagSelectRef: any;
    }>({
      dialogVisible: false,
      dialogGroupVisible: false,
      tagSelectRef: null,
    });
    const onClose = () => {
      state.dialogVisible = false;
    };
    const onTagCheck = (val: any) => {
      emit("onTagCheck", val);
    };
    // 清除选中的标签
    const clearCheckedTag = () => {
      state.tagSelectRef.clearCheckedTag();
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
      onClose,
      onTagCheck,
      clearCheckedTag,
    };
  },
});
</script>
