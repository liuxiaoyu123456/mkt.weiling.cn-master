<template>
  <div class="preview_wrap" v-if="iframeUrl">
    <div class="del_view" @click="onclose">
      <img :src="formatCosUrl('/worktable-erp/code/frame_icon.png')" alt="" />
      关闭预览
    </div>
    <div class="content">
      <iframe
        frameborder="no"
        style="height: 100%; width: 100%"
        :src="iframeUrl"
        title=""
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
import { formatCosUrl } from "@/utils/utils";
// <><><这里有个坑,晚点来看看><><>
export default defineComponent({
  components: {},
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const state = reactive<{
      showPreview: boolean;
      iframeUrl: string;
    }>({
      showPreview: true,
      iframeUrl: "",
    });
    const Methods = {
      formatCosUrl(url: any) {
        return formatCosUrl(url);
      },
      onclose() {
        emit("onClose");
      },
    };
    watch(
      () => props.value,
      (url) => {
        state.iframeUrl = url;
      }
    );
    return {
      ...toRefs(state),
      ...Methods,
    };
  },
});
</script>

<style lang="scss" scoped>
.preview_wrap {
  position: fixed;
  box-sizing: content-box;
  width: 375px;
  height: 80%;
  border-radius: 12px;
  right: 610px;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  z-index: 80000;
  padding: 10px 14px;
  .content {
    width: 100%;
    height: 100%;
    &::-webkit-scrollbar,
    &::-webkit-scrollbar-thumb {
      display: none;
    }
  }
  .del_view {
    cursor: pointer;
    position: absolute;
    box-sizing: border-box;
    right: 0;
    top: -38px;
    width: 68px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border-radius: 100px;
    color: #ffffff;
    font-weight: 500;
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
}
</style>
