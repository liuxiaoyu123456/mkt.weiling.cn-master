import { reactive, toRefs } from "vue";
export default function useScrollHeight() {
  const state = reactive<{
    cardHeightLock: boolean;
  }>({
    cardHeightLock: false,
  });
  const Methods = {
    // 盒子高度是否超过指定高度
    // curRef：指定盒子的ref  height：指定总高度
    onWatchCardHeight(curRef: any, height: number) {
      if (!curRef) return;
      state.cardHeightLock = curRef.scrollHeight > height;
    },
  };
  return {
    ...toRefs(state),
    ...Methods,
  };
}
