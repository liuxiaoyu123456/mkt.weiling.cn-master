<template>
  <h2 class="help-title">如何为员工开启二维码获客功能</h2>
  <ul class="help-list">
    <li class="help-list-item">
      <p>
        1.用企业管理员的身份，进入<el-link
          :href="wxAdminUrl"
          target="_blank"
          :underline="false"
          type="primary"
          >企业微信后台</el-link
        >，并找到客户与上下游-客户联系
      </p>
      <el-image
        :preview-src-list="codeGuideList"
        :src="codeGuideList[0]"
        :initial-index="0"
        hide-on-click-modal
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>
        2.进入“权限配置”，然后配置“客户联系和客户群”的使用范围，将对应的员工添加进去
      </p>
      <el-image
        :preview-src-list="codeGuideList"
        :src="codeGuideList[1]"
        hide-on-click-modal
        :initial-index="1"
        fit="contain"
      ></el-image>
    </li>
    <li class="help-list-item">
      <p>
        3.添加员工到使用范围后，点击“完成”进行保存，最后在集客通中再次保存微信方案即可
      </p>
      <el-image
        :preview-src-list="codeGuideList"
        hide-on-click-modal
        :src="codeGuideList[2]"
        :initial-index="2"
        fit="contain"
      ></el-image>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { getCosImageUrl } from "@/utils/utils";

const wxAdminUrl = `https://work.weixin.qq.com/`;
const codeGuideList = [
  getCosImageUrl("/code-guide-step-1.png"),
  getCosImageUrl("/code-guide-step-2.png"),
  getCosImageUrl("/code-guide-step-3.jpg"),
];
</script>
