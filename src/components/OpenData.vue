<template>
  <ww-open-data ref="opendata" :type="type" :openid="openid"></ww-open-data>
</template>
<script lang="ts" setup>
import { useOpenData } from "@/hooks";
import { watch } from "vue";
const props = withDefaults(
  defineProps<{
    openid: string;
    type?: "userName" | "departmentName"; //待补全
  }>(),
  {
    type: "userName",
  }
);
const { opendata, update } = useOpenData();
watch(() => props.openid, update);
</script>
