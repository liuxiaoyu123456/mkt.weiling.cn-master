<template>
  <div class="echart" ref="chartRef"></div>
</template>
<script lang="ts" setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  option: any;
  loading?: boolean;
}>();

const chartRef = ref<HTMLElement>();
const chartInstance = shallowRef<echarts.EChartsType>();
const handleResize = () => {
  chartInstance.value!.resize();
};
onMounted(() => {
  if (chartRef.value) {
    chartInstance.value = echarts.init(chartRef.value, undefined, {
      devicePixelRatio: devicePixelRatio * 2,
    });
    props.option && chartInstance.value!.setOption(props.option);
  }
  window.addEventListener("resize", handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  chartInstance.value!.dispose();
});
watch(
  () => props.option,
  (val, pre) => {
    if (chartInstance.value) {
      pre && chartInstance.value.clear();
      val && chartInstance.value.setOption(val);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
watch(
  () => props.loading,
  (val) => {
    if (chartInstance.value) {
      val
        ? chartInstance.value.showLoading()
        : chartInstance.value.hideLoading();
    }
  }
);
</script>
