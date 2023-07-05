<template>
  <div
    class="background"
    @click="$emit(`close`)"
    :style="{
      visibility: show ? `visible` : `hidden`,
    }"
  >
    <div class="dialog">
      <el-icon class="close" @click="$emit(`close`)">
        <wl-svg type="close" />
      </el-icon>
      <video
        src="https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/images/jiketong.mp4"
        class="video"
        ref="video"
        controls="controls"
        @click.stop
      >
        your browser does not support the video tag
      </video>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    show: boolean;
  }>(),
  {
    show: false,
  }
);
const video: any = ref(null);
watch(
  () => props.show,
  (res) => {
    nextTick(() => {
      res ? video.value.play() : video.value.pause();
    });
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
@use "sass:math";

@function vw($px) {
  @return math.div($px, 1440) * 100vw;
}
.background {
  position: fixed;
  z-index: 10000;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  .dialog {
    position: relative;
    // width: 30vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    .close {
      font-size: 48px;
      color: #fff;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(80%, -80%);
    }
    .video {
      flex: 1;
      object-fit: contain;
      transform: translate(0);
      max-width: 100%;
      max-height: 100%;
      width: 100%;
    }
  }
}
</style>
