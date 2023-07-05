<template>
  <h2 class="help-title">如何为员工开启集客通的可见范围</h2>
  <ul class="help-list">
    <li class="help-list-item">
      <p>
        1.用企业管理员的身份，进入<el-link
          :href="wxAdminUrl"
          target="_blank"
          :underline="false"
          type="primary"
          >企业微信后台</el-link
        >，并找到应用管理-应用-卫瓴·集客通
      </p>
      <el-image
        :preview-src-list="visibleGuideList"
        :src="visibleGuideList[0]"
        :initial-index="0"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>2.找到“可见范围”设置，将对应的员工添加到可见范围</p>
      <el-image
        :preview-src-list="visibleGuideList"
        :src="visibleGuideList[1]"
        hide-on-click-modal
        :initial-index="1"
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>
        3.添加员工到可见范围后，点击“完成”进行保存，最后在集客通中再次保存微信方案即可
      </p>
      <el-image
        :preview-src-list="visibleGuideList"
        hide-on-click-modal
        :src="visibleGuideList[2]"
        :initial-index="2"
        fit="contain"
      ></el-image>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { getCosImageUrl } from "@/utils/utils";
const visibleGuideList = [
  getCosImageUrl("/visible-guide-step-1.png"),
  getCosImageUrl("/visible-guide-step-2.png"),
  getCosImageUrl("/visible-guide-step-3.jpg"),
];
const wxAdminUrl = `https://work.weixin.qq.com/`
</script>
