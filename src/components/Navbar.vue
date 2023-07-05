<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = withDefaults(
  defineProps<{
    text: string;
    path: string;
    query?: any;
  }>(),
  {
    text: "",
    path: "/",
    query: null,
  }
);
const handleClick = () => {
  router.replace({
    path: props.path,
    query: props.query,
  });
};
</script>

<template>
  <el-link class="nav-btn" @click="handleClick">
    <el-icon class="nav-icon">
      <wl-svg type="arrowTipLeft" />
    </el-icon>
    {{ text }}
  </el-link>
</template>

<style lang="scss" scope>
.nav-btn {
  font-size: 16px;
  color: var(--wl-text-color-title-2);

  .nav-icon {
    font-size: 24px;
    margin-right: 4px;
  }
}

.el-link.is-underline:hover:after {
  display: none;
}
</style>
