<script lang="ts" setup>
import { computed, watch, ref } from "vue";
import StyleConfig from "./pages/StyleConfig.vue";
import MiniApp from "./pages/MiniApp.vue";
import BasicInfo from "./pages/BasicInfo.vue";

const props = withDefaults(
  defineProps<{
    type?: string;
    pageList?: any;
    form: any;
    pageIndex: number;
  }>(),
  {
    type: "view",
    pageList: [
      { page: StyleConfig },
      { page: MiniApp },
      { page: MiniApp, isOverlayShow: true },
      // {page:BasicInfo}
    ],
    form: () => ({}),
    pageIndex: 0,
  }
);

const emit = defineEmits<{
  (e: "update:pageIndex", val: number): void;
}>();

const getPage = computed(() => {
  return props.pageList[props.pageIndex];
});
const isLeftAmi = ref(true);
let timer: any = null;
const init = () => {
  if (props.type === "view") {
    timer = setInterval(() => {
      if (props.pageIndex == props.pageList.length - 1) {
        emit("update:pageIndex", 0);
      } else {
        emit("update:pageIndex", props.pageIndex + 1);
      }
    }, 5000);
  } else {
    if (timer) clearInterval(timer);
  }
};
watch(
  () => props.pageIndex,
  (newVal: number, oldVal: number) => {
    isLeftAmi.value = newVal > oldVal;
  }
);
watch(
  () => props.type,
  () => {
    init();
  },
  { immediate: true }
);
</script>

<template>
  <div class="mobile-wrap">
    <img
      src="@/assets/images/virtualPhone/iphone-border.png"
      alt="iphone-border"
      class="phone-border"
    />
    <div class="mobile-content">
      <transition :name="isLeftAmi ? 'moveLeft' : 'moveRight'">
        <component
          :is="getPage['page']"
          :isOverlayShow="getPage['isOverlayShow']"
          :form="form"
        ></component>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-wrap {
  position: relative;
  height: 730px;
  .phone-border {
    position: relative;
    width: 100%;
    z-index: 10;
  }
  .mobile-content {
    position: absolute;
    left: 56px;
    right: 56px;
    top: 30px;
    bottom: 50px;
    overflow: hidden;
    border-radius: 30px;
  }
}

.moveLeft-enter-active,
.moveLeft-leave-active,
.moveRight-enter-active,
.moveRight-leave-active {
  transition: all 0.5s;
}
.moveLeft-enter-from {
  transform: translateX(100%);
}
.moveLeft-leave-to {
  transform: translateX(-100%);
}

.moveRight-enter-from {
  transform: translateX(-100%);
}
.moveRight-leave-to {
  transform: translateX(100%);
}
</style>
