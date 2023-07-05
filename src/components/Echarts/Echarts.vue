<template>
  <Suspense>
    <EchartsImp v-bind="attrs" :option="option" :loading="loading" />
    <template #fallback>
      <div v-bind="attrs" class="echart" v-loading="true"></div>
    </template>
  </Suspense>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, useAttrs } from "vue";
const attrs = useAttrs();
const EchartsImp = defineAsyncComponent(() => import("./EchartsImp.vue"));
defineProps<{
  option: any;
  loading?: boolean;
}>();
</script>
