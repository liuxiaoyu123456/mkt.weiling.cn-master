<template>
  <div style="width: 100%; height: 100%">
    <iframe
      style="width: 100%; height: 100%"
      ref="iframeRef"
      :src="`${url}?appid=${appid}&usertype=${usertype}&redirect_uri=${redirect_uri}&href=${href}`"
      frameborder="no"
      scrolling="no"
      :onload="frameOnload()"
      title="title"
    >
    </iframe>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const domain = "https://open.work.weixin.qq.com";
const url = domain + "/wwopen/sso/3rd_qrConnect";
const appid = import.meta.env.VITE_WECOM_APP_ID;
const usertype = "member";
// const href = "data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIzMnB4O2hlaWdodDogMjMycHg7fQouaW1wb3dlckJveCAudGl0bGUge2Rpc3BsYXk6IG5vbmU7fQouaW1wb3dlckJveCAuaW5mbyB7ZGlzcGxheTogbm9uZTt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O30KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30KLmltcG93ZXJCb3ggLndycF9jb2RlX2lmcmFtZSB7bWFyZ2luLXRvcDogMHB4ICFpbXBvcnRhbnQ7fQ==%20"
const href =
  import.meta.env.VITE_APP_COS_URL +
  "/website/mkt.weiling.cn/styles/wecom-login-qrcode.css";
const redirect_uri = encodeURIComponent(
  `${
    import.meta.env.VITE_APP_DOMAIN
  }/wx/auth_callback/cp/login?redirect_uri=${encodeURIComponent(
    (route.query.redirect_uri as string) || ""
  )}`
);

let timer: number;
window.addEventListener("message", function (event: any) {
  // console.log(event);
  // let origin = event.origin || event.originalEvent.origin;
  if (event.origin !== domain) return;

  if (event.data) {
    let nextUrl = event.data + `&mine=${route.query.mine}`;
    // console.log(nextUrl, "nextUrl");
    if (typeof nextUrl != "string" || !/^https?/.test(nextUrl)) {
      return;
    }
    if (timer) {
      clearInterval(timer);
    }
    window.location.href = nextUrl;
  }
});

window.parent.postMessage(
  {
    msg: route.query.msg || "",
    redirect_uri: route.query.redirect_uri,
  },
  "*"
);

const iframeRef = ref<any>(null);
const notifyPostMessage = () => {
  nextTick(() => {
    if (
      iframeRef.value &&
      iframeRef.value.contentWindow &&
      iframeRef.value.contentWindow.postMessage
    ) {
      iframeRef.value.contentWindow.postMessage("ask_usePostMessage", "*");
    }
  });
};
const frameOnload = () => {
  // console.log('iframe loaded')
  notifyPostMessage();
  timer = setInterval(function () {
    notifyPostMessage();
  }, 1000);
};
</script>
<style>
html[data-route-name="login-to"],
html[data-route-name="login-to"] body {
  min-width: auto;
}
</style>
