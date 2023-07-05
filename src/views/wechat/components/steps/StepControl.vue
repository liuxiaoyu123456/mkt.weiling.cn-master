<script lang="ts" setup>
withDefaults(
  defineProps<{
    step: number;
    loading: boolean
  }>(),
  {
    step: 0,
    loading: false
  }
);

const emit = defineEmits<{
  (e: "stepChange", val: number): void;
}>();

const handleClick = (val: number) => {
  emit("stepChange", val);
};
</script>

<template>
  <div>
    <el-button :disabled="loading" v-if="step > 0 && step < 3" @click="handleClick(-1)"
      >上一步</el-button
    >
    <el-button :loading="loading" type="primary" @click="handleClick(1)" v-if="step < 3">{{
      step == 2 ? "保存" : "下一步"
    }}</el-button>
  </div>
</template>
