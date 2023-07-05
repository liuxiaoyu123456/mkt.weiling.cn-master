<template>
  <wl-layout v-bind="layoutConf" v-model:selectedKeys="selectedKeys">
    <template v-slot:logo>
      <div style="height: 64px; width: 212px">
        <img :src="getCosImageUrl('logo.png')" style="height: 100%" />
      </div>
    </template>
    <template v-slot:rightContent>
      <div>
        <RightContent />
      </div>
    </template>
    <div class="main-container">
      <router-view />
      <HelpCenter />
    </div>
  </wl-layout>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, type Ref } from "vue";
import { useRouter } from "vue-router";
import { getMenuData, clearMenuItem } from "wltech-ui";
import HelpCenter from "@/components/HelpCenter.vue";

const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
const selectedKeys: Ref<string[]> = ref([]);

const layoutConf = reactive({
  menuData,
});

watch(
  router.currentRoute,
  () => {
    const matched = router.currentRoute.value.matched.concat();
    selectedKeys.value = matched.map((r) => r.path);
  },
  {
    immediate: true,
  }
);
</script>
<style>
html,
body,
#app,
.ant-layout,
.ant-layout-footer {
  background: none;
}
html .ant-layout-header {
  background: #fff;
}
html .ant-layout-header .ant-menu {
  background-color: inherit;
}
html .ant-layout-header + .ant-layout-content {
  position: static;
  z-index: unset;
}
</style>
