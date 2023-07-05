<script lang="ts" setup>
import { ref, watch } from "vue";
import InitView from "./components/InitView.vue";
import steps from "./components/steps/Index.vue";

const options: any = ref({
  identity: 0, //身份
  wecom: 0, //企微
});
const process: any = ref(0);

const handleStart = () => {
  process.value++;
};

watch(
  () => process.value,
  // 回调函数，当process的值发生变化时，会将新的val值打印到控制台上
  (val: number) => {
    console.log(val);
  }
);
</script>

<template>
  <InitView
    type="install"
    :options="options"
    @start="handleStart"
    v-if="process === 0"
  />
  <steps v-else :options="options" v-model:process="process" />
</template>
