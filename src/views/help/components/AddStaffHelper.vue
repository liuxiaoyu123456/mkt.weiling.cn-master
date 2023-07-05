<template>
  <h2 class="help-title">如何为更多员工开启集客通使用权限</h2>
  <ul class="help-list">
    <li class="help-list-item">
      <p>1.让需要开通权限的员工用企业微信扫描下方二维码</p>
      <el-image
        class="qr-code"
        :preview-src-list="addStaffList"
        :src="addStaffList[0]"
        :initial-index="0"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>2.点击页面右下角的“添加应用”按钮，进入下一个页面</p>
      <el-image
        class="phone-shot"
        :preview-src-list="addStaffList"
        :src="addStaffList[1]"
        :initial-index="1"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>
        3.<span class="danger">注意</span
        >！此时请点击可见范围，然后勾选要开启权限的员工，并点击“确定”
      </p>
      <el-image
        class="phone-shot"
        :preview-src-list="addStaffList"
        :src="addStaffList[2]"
        :initial-index="2"
        hide-on-click-modal
        fit="contain"
      ></el-image>
      <el-image
        class="phone-shot"
        :preview-src-list="addStaffList"
        :src="addStaffList[3]"
        :initial-index="3"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>4.最后，点击页面下方“同意以上授权，并添加”即可</p>
      <el-image
        class="phone-shot"
        :preview-src-list="addStaffList"
        :src="addStaffList[4]"
        :initial-index="4"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { getCosImageUrl } from "@/utils/utils";

const addStaffList = [
  getCosImageUrl("/add-staff-step-1.png"),
  getCosImageUrl("/add-staff-step-2.png"),
  getCosImageUrl("/add-staff-step-3.jpg"),
  getCosImageUrl("/add-staff-step-4.png"),
  getCosImageUrl("/add-staff-step-5.jpg"),
];
</script>
