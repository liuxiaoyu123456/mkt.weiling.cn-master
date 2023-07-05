<template>
  <InitView type="login">
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
  </InitView>
</template>
<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { useRoute } from "vue-router";
import InitView from "../login/components/InitView.vue";

const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const redirectUri =
  (route.query.redirect_uri as string) || import.meta.env.VITE_APP_DOMAIN;

window.addEventListener("message", function (event: any) {
  if (event.data.msg == "SUCCESS") {
    proxy.$message({
      message: "登录成功",
      type: "success",
      duration: 6000,
    });
    location.href = decodeURIComponent(event.data.redirect_uri);
  } else if (typeof event.data.msg == "string" && event.data.msg != "") {
    proxy.$message({
      message: event.data.msg,
      type: "error",
      duration: 6000,
    });
  }
});
</script>
