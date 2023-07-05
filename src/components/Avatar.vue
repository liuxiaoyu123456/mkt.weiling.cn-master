<template>
  <div class="avatar flex-center">
    <img v-if="src" class="avatar-inner" :src="src" alt="avatar" />
    <el-icon class="avatar-default" v-else>
      <wl-svg type="headMale" />
    </el-icon>
    <span v-if="type" class="icon flex-center" :class="type">
      <wl-svg :type="`${type}Fill`" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { defaultAvatar } from "@/utils";
withDefaults(
  defineProps<{
    src: string;
    type?: "wechat" | "wecom";
  }>(),
  {
    src: defaultAvatar,
  }
);
</script>
<style lang="scss" scoped>
.avatar {
  font-size: 22px;
  position: relative;
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  &-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
  .icon {
    position: absolute;
    right: -10%;
    bottom: -10%;
    width: 50%;
    height: 50%;
    border: 1px solid #fff;
    border-radius: 50%;
    color: #fff;
    &.wechat {
      background-color: #74d178;
    }
    &.wecom {
      background-color: #5bbaff;
    }
    svg {
      width: 80%;
      height: 80%;
    }
  }
}
</style>
