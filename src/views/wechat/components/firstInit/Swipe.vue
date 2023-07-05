<script lang="ts" setup>
import { ref, computed, watch } from "vue";

const direction = ref("r");

const props = withDefaults(
  defineProps<{
    step: number;
    form: any;
  }>(),
  {
    step: 0,
    form: {},
  }
);

// const emits = defineEmits<{
// (val:'update:step',e:number):any
// }>()

const pos = computed(() => {
  return -(props.step * 246) + "px";
});

watch(
  () => props.step,
  (n, o) => {
    direction.value = n > o ? "r" : "l";
  }
);

const step1Style = computed(() => ({
  current: props.step == 0,
  pre: props.step - 1 == 0,
  next: props.step + 1 == 0,
  pre1: props.step - 2 == 0,
  next1: props.step + 2 == 0,
}));
const step2Style = computed(() => ({
  current: props.step == 1,
  pre: props.step - 1 == 1,
  next: props.step + 1 == 1,
  pre1: props.step - 2 == 1,
  next1: props.step + 2 == 1,
}));
const step3Style = computed(() => ({
  current: props.step == 2,
  pre: props.step - 1 == 2,
  next: props.step + 1 == 2,
  pre1: props.step - 2 == 2,
  next1: props.step + 2 == 2,
}));
</script>

<template>
  <div class="wh-swipe">
    <div class="wh-swipe-item" :style="{ left: pos }" :class="step1Style">
      <img
        class="main-img"
        src="@/assets/images/wechat/wechat-one.png"
        alt="wechat-one"
      />
    </div>
    <div class="wh-swipe-item" :style="{ left: pos }" :class="step2Style">
      <img
        class="main-img"
        src="@/assets/images/wechat/wechat-two.png"
        alt="wechat-two"
      />
      <div class="add-chat-demo">
        {{ form.channel.miniprogram_welmsg }}
      </div>
    </div>
    <div class="wh-swipe-item" :style="{ left: pos }" :class="step3Style">
      <img
        class="main-img"
        src="@/assets/images/wechat/wechat-three.png"
        alt="wechat-three"
      />
      <div class="greet-header-demo">
        <span class="name">霍冬冬</span>
        <span class="corp">@卫瓴科技</span>
      </div>
      <div class="greet-demo">
        <div class="avatar-box">
          <img src="@/assets/images/wechat/avatar.png" alt="avatar" />
        </div>
        <div class="message-box">
          {{ form.channel.new_welcome_msg_info?.text?.content || "" }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scope>
.wh-swipe {
  display: flex;
  width: 738px;
  margin: 0 auto;
  padding-left: 246px;
  overflow: hidden;
  &-item {
    position: relative;
    transition: all 0.3s ease-in-out;
    .main-img {
      width: 246px;
    }
    .add-chat-demo {
      width: 190px;
      height: 100px;
      position: absolute;
      top: 60px;
      left: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #ffffff;
      line-height: 16px;
      font-size: 12px;
      word-break: break-all;
      text-align: center;
    }
    .greet-header-demo {
      position: absolute;
      width: 190px;
      top: 35px;
      left: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--wl-text-color-title-1);
      .name {
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
        transform: scale(0.95);
      }
      .corp {
        font-size: 12px;
        line-height: 11px;
        transform: scale(0.75);
      }
    }
    .greet-demo {
      position: absolute;
      width: 190px;
      left: 28px;
      top: 63px;
      display: flex;
      box-sizing: border-box;
      padding: 12px 15px 0;
      height: 326px;
      overflow-y: auto;
      .avatar-box {
        width: 16px;
        height: 16px;
        border: 1px solid var(--wl-primary-color);
        border-radius: 2px;
        overflow: hidden;
        margin-right: 4px;
        display: flex;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .message-box {
        background: #f5f5f5;
        border-radius: 2.48951px;
        width: 140px;
        box-sizing: border-box;
        font-size: 10px;
        line-height: 18px;
        color: var(--wl-text-color-title-1);
        padding: 4px;
        word-break: break-all;
        align-self: flex-start;
        margin-bottom: 8px;
      }
    }
  }
  .pre {
    transform: perspective(7px) rotateY(-0.5deg);
    transform-origin: right;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, #fff, #ffffff33);
      z-index: 9;
    }
  }
  .pre1 {
    transform: perspective(7px) rotateY(-90deg);
    transform-origin: right;
    opacity: 0;
  }
  .next {
    transform: perspective(7px) rotateY(0.5deg);
    transform-origin: left;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(to left, #fff, #ffffff33);
      z-index: 9;
    }
  }
  .next1 {
    transform: perspective(7px) rotateY(90deg);
    transform-origin: left;
    opacity: 0;
  }
  .current {
    transform: perspective(7px) rotateY(0);
  }
}
</style>
