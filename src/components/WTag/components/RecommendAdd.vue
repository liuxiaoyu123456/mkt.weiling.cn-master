<!-- 标签推荐创建 -->
<template>
  <div class="flex-row main-between tag_add">
    <div class="flex-row cross-center tag_add_text flex1">
      <span class="flex0">{{ label }}:</span>
      <span class="name">{{ name }}</span>
    </div>
    <el-button type="primary" class="tag_add_btn" @click.stop="onCreate"
      >创建</el-button
    >
  </div>
</template>

<script lang="tsx">
import { defineComponent, type SetupContext } from "vue";
export default defineComponent({
  props: {
    name: {
      type: String,
    },
    label: {
      type: String,
      default: "是否创建标签",
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const onCreate = () => {
      emit("onCreate");
    };
    return {
      onCreate,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.tag_add_btn.el-button.el-button--primary) {
  border-radius: 4px;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  width: 40px;
  margin-left: 4px;
  padding: 0;
}
.tag_add {
  padding: 10px 0;
  border-bottom: 1px solid #eeeeee;
  &_text {
    color: var(--wl-text-color-secondary-2);
    span.name {
      background: #ffffff;
      border: 1px solid var(--wl-text-color-placeholder);
      border-radius: 20px;
      padding: 0 8px;
      height: 26px;
      line-height: 26px;
      margin-left: 4px;
      color: var(--wl-text-color-title-1);
      @extend %ov1;
    }
  }
}
</style>
