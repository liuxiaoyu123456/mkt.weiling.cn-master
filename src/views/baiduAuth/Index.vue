<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { getQueryVariable } from "@/utils";
const status = ref("");
const init = () => {
  let platform_id = "";
  if (document.referrer.startsWith("https://u.baidu.com/")) {
    platform_id = "&platform_id=1";
  }
  axios
    .get(
      import.meta.env.VITE_APP_BAIDU_AUTH + window.location.search + platform_id
    )
    .then(function (response) {
      if (response.data.code == 200) {
        status.value = "success";
        localStorage.setItem("uc_id", getQueryVariable("userId"));
      } else {
        status.value = "fail";
        ElMessage({
          message: response.data.msg,
          type: "error",
        });
      }
    })
    .catch(function (err) {
      status.value = "fail";
      ElMessage({
        message: err.data.msg,
        type: "error",
      });
    });
};
init();
</script>

<template>
  <div>
    <div class="res-wrap" v-if="status === 'success'">
      <el-icon class="icon success">
        <wl-svg type="successFill" />
      </el-icon>
      <span>您已成功授权百度账号</span>
    </div>

    <div class="res-wrap" v-if="status === 'fail'">
      <el-icon class="icon fail">
        <wl-svg type="closeCircularLine" />
      </el-icon>
      <span>授权失败，请重新授权</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.res-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  .icon {
    font-size: 80px;
    margin-bottom: 30px;
  }
  .success {
    color: var(--wl-success-color);
  }
  .fail {
    color: var(--wl-error-color);
  }
  > span {
    font-size: 20px;
    color: #000;
  }
}
</style>
