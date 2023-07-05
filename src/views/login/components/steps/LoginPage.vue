<script lang="ts" setup>
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
const route = useRoute();
const redirectUri =
  (route.query.redirect_uri as string) || import.meta.env.VITE_APP_DOMAIN;
withDefaults(
  defineProps<{
    info: any;
  }>(),
  {
    info: {},
  }
);
window.addEventListener("message", function (event: any) {
  if (event.data.msg == "SUCCESS") {
    ElMessage({
      message: "登录成功",
      type: "success",
      duration: 6000,
    });
    location.href = decodeURIComponent(event.data.redirect_uri);
  } else if (typeof event.data.msg == "string" && event.data.msg != "") {
    ElMessage({
      message: event.data.msg,
      type: "error",
      duration: 6000,
    });
  }
});
</script>

<template>
  <div class="login-page">
    <div class="title">{{ info.LoginPageTitle }}</div>
    <div class="des">{{ info.LoginPageDes }}</div>

    <div class="login-wrap">
      <div style="width: 232px; height: 232px">
        <iframe
          style="width: 100%; height: 100%"
          :src="`/user/login-to?redirect_uri=${encodeURIComponent(
            redirectUri
          )}&simple=true`"
          frameborder="no"
          scrolling="no"
          title="title"
        >
        </iframe>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 8px;
    color: var(--wl-text-color-title-1);
  }
  .des {
    line-height: 22px;
    color: var(--wl-text-color-secondary-2);
  }
  .login-wrap {
    margin: 28px auto 0;
    width: 240px;
    height: 240px;
    .iframe {
      height: 100%;
    }
  }
}
</style>
