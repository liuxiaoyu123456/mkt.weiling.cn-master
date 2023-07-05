<template>
  <div class="assistant-xiaowei" ref="assContainer">
    <WlPopover
      v-model:visible="helpCenterState.showHelp"
      placement="left-end"
      popper-class="assistant-pop"
      :teleported="true"
      width="auto"
      :height="244"
    >
      <div
        class="container"
        @mouseenter="keepVisible(true)"
        @mouseleave="keepVisible(false)"
      >
        <div class="content flex-column">
          <h2 class="title">
            {{ textComputed || "是遇到什么问题了吗？" }}
          </h2>
          <div class="content_con">
            <span class="qr-text">手机扫码，添加小微为好友</span>
            <img alt="" src="/jktPhone/imgs/xiaowei.png" class="qr-code" />
          </div>
        </div>
      </div>
      <template #reference>
        <div
          class="assistant-reference"
          @mouseenter="changeVisible(true)"
          @mouseleave="changeVisible(false)"
        >
          <img
            @click.stop="openXW"
            src="https://wlmvp-cos.weiling.cn/worktable-erp/images/xiaowei_zhuli.png?v=22"
            class="assistant-icon"
            alt=""
          />
        </div>
      </template>
    </WlPopover>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
  nextTick,
} from "vue";
import { useHelpCenter } from "@/stores";
import { storeToRefs } from "pinia";
import { useDrag } from "@/hooks";
const store = useHelpCenter();
const { helpCenterState } = storeToRefs(store);
const { updateHelpCenterState } = store;
if (!helpCenterState.value.xwCodeUrl) {
  updateHelpCenterState();
}
const { proxy }: any = getCurrentInstance();

let timer: any;
function changeVisible(bool: boolean) {
  if (!bool) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setVisible(bool);
    }, 400);
  }
  if (bool) {
    setVisible(bool);
    _index.value = (_index.value + 1) % 5;
  }
}
function keepVisible(bool: boolean) {
  if (!bool) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setVisible(bool);
    }, 500);
  }
  if (bool) {
    setVisible(bool);
  }
}
function setVisible(bool: boolean) {
  clearTimeout(timer);
  helpCenterState.value.showHelp = bool;
}

// watch(
//   () => store.getters.getter_assistant_status,
//   (val) => {
//     if (!XWUrl.value && val) {
//       getXWUrl();
//     }
//     visible.value = val;
//   }
// );

const drag = useDrag();
const assContainer = ref(null);
watch(
  () => helpCenterState.value.showInvoiceHelper,
  (val) => {
    if (val) {
      helpCenterState.value.showHelp = true;
      _index.value = 5;
      nextTick(() => {
        helpCenterState.value.showInvoiceHelper = false;
      });
    }
  }
);
onMounted(() => {
  // if (store.getters.getter_assistant_status) {
  //   getXWUrl();
  // visible.value = true;
  // }
  drag.dragFn(
    "xiaoweiAssitantLocation",
    ".assistant-helpcenter",
    assContainer.value,
    {},
    () => {}
  );
});
function openXW() {
  if (drag.isdrag()) return;
  if (
    helpCenterState.value.userVo.id &&
    /wxwork/i.test(window.navigator.userAgent.toLowerCase())
  ) {
    proxy.$wx.onOpenEnterpriseChat("", helpCenterState.value.userVo.id);
  }
}

const _index = ref(Date.now() % 5);

const textArr = [
  "是遇到什么问题了吗？",
  "有问题的话，就来问我吧~",
  "遇到问题了嘛~请扫码联系我为您排查呀~",
  "遇到问题，欢迎联系小微哦",
  "很高兴认识您，有问题欢迎戳我",
  "申请开票，请联系小微哦",
];
const textComputed = computed(() => {
  return textArr[_index.value];
});
</script>

<style lang="scss" scoped>
.assistant-xiaowei {
  position: fixed;
  z-index: 2000;
  right: 16px;
  bottom: 136px;
  width: 64px;
  height: 48px;
  :deep(.assistant-pop.el-popper.is-light) {
    border: none;
    padding: 0;
    .el-popper__arrow {
      display: none;
    }
  }
}
.assistant-reference {
  width: 64px;
  display: flex;
  justify-content: flex-end;
}
.assistant-icon {
  width: 48px;
  height: 48px;
  cursor: pointer;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  &:hover {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  }
}
.title {
  font-weight: 550;
  font-size: 16px;
  color: var(--wl-text-color-title-1);
  text-align: center;
  margin-top: 18px;
  white-space: nowrap;
}
.container {
  padding: 16px;
}
.content {
  position: relative;
  padding: 0 18px;
  .close-icon {
    color: var(--wl-text-color-disabled);
    position: absolute;
    cursor: pointer;
    width: 24px;
    height: 24px;
    right: -4px;
    top: -4px;
  }
  .content_con {
    height: 100%;
    padding-top: 6px;
    text-align: center;
    padding-bottom: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .qr-text {
      color: var(--wl-text-color-primary-3);
      font-size: 14px;
      white-space: nowrap;
    }
    .qr-code {
      margin: 12px;
      width: 122px;
      height: 122px;
    }
  }
}
</style>
