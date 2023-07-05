<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits<{
  (e: "change"): void;
}>();

const visible = ref(props.show);
const handleClick = () => {
  emit("change");
};

watch(
  () => props.show,
  (val: boolean) => {
    visible.value = val;
  }
);
</script>

<template>
  <el-dialog v-model="visible" width="480" align-center>
    <template #header>
      <div class="dia-header">
        <el-icon class="icon-success">
          <wl-svg type="successFill" />
        </el-icon>
        <span>配置完成</span>
      </div>
    </template>

    <div class="dia-body">
      <p class="warn">
        如果您需要修改微信方案的使用员工，请务必在百度侧和集客通侧同步修改
      </p>
      <br />
      <p class="help">
        如何在百度基木鱼使用微信方案 <span @click="handleClick">查看详情</span>
      </p>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dia-header {
  display: flex;
  align-items: center;
  .icon-success {
    font-size: 24px;
    margin-right: 6px;
    color: var(--wl-success-color);
  }
  > span {
    font-size: 16px;
    color: var(--wl-text-color-title-1);
  }
}
.dia-body {
  color: var(--wl-text-color-title-2);
  position: relative;
  top: -20px;
  .help {
    // text-align: right;
    font-size: 15px;
    > span {
      cursor: pointer;
      color: var(--wl-primary-color);
    }
  }
  .warn {
    font-size: 16px;
    color: var(--wl-error-color);
  }
}
</style>
