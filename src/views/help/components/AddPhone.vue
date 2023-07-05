<template>
  <h2 class="help-title">如何为员工绑定手机号</h2>
  <ul class="help-list">
    <li class="help-list-item">
      <p>1.在集客通后台，点击右上角头像，然后选择账户中心</p>
    </li>
    <li class="help-list-item">
      <p>2.在账户中心最底部的使用员工板块，为员工绑定手机号</p>
      <el-image
        :preview-src-list="addPhone"
        :src="addPhone[1]"
        :initial-index="1"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { getCosImageUrl } from "@/utils/utils";

const addPhone = [getCosImageUrl("/add-tel-step-1.png")];
</script>
