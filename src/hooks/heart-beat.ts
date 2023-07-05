import { onBeforeUnmount, onMounted, ref } from "vue";

export const useTimeInterval = (action: any, interval = 60000) => {
  const timer = ref(0);
  const stop = () => {
    timer.value && clearInterval(timer.value);
    timer.value = 0;
  };
  onMounted(() => {
    timer.value = setInterval(() => {
      action && action();
    }, interval);
  });
  onBeforeUnmount(stop);
  return stop;
};
