<!-- <script setup lang="ts">
import { ref } from "vue"
import gift from "@/assets/images/bg-gift.png";
import {ElImageViewer} from 'element-plus'
import "element-plus/theme-chalk/el-image-viewer.css"
const code = `${import.meta.env.VITE_APP_DOMAIN}/jktPhone/imgs/xiaowei.png`
const showViewer = ref(false)
const preView = () => {
    showViewer.value = true
}
</script>
<template>
    <div class="saying">
        <img :src="gift" alt="gift" class="img">
        <div class="bg-1"></div>
        <div class="bg-2"></div>
         <p class="title mb-20">你好！</p>
         <p class="title">集客通支持7天免费试用！</p>
         <p class="sub-title">试用期间所有基础设施均由卫瓴·集客通免费提供。</p>

         <div class="saying-content">
            <p class="bold">试用到期后，自助充值并配置基础设施可继续使用~ </p>
            <p class="bold">充值收费规则：</p>
            <p>1、按照实际加微数量计费，1元/1个加微 </p>
            <p>2、单账户平台使用费50元，充值后自动扣除。（企业员工打开该应用的可见范围即视为开通账户。平台使用费用为企业微信收取的接口使用费。）</p>
            <p class="mb-20">3、支持无效返款：加微后，24小时内被用户删除，系统将自动返款到您的账户</p>
            <p class="bold">基础设施配置：</p>
            <p>根据系统中操作指引配置小程序，无需做任何开发</p>
         </div>

         <div class="link">
            <span @click="preView">联系客服</span>
        </div>
            <el-image-viewer
            v-if="showViewer"
            hide-on-click-modal
            :url-list="[code]" 
            :teleported="true"
            @close="showViewer=false" />
        
    </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

@function vw($px) {
    @return math.div($px, 1440) * 100vw;
}

.saying{
    position: relative;
    width: vw(658);
    background: #fff;
    border-radius: vw(28);
    padding-top: vw(35);
    [class^="bg-"] {
      position: absolute;
      background: radial-gradient(
        closest-side,
        rgba(103, 245, 233, 0.2) 60%,
        transparent
      );
    }
    .img {
      position: absolute;
      right: vw(40);
      top: vw(20);
      width: vw(100);
    }
    .bg-1 {
      top: -20px;
      left: -120px;
      width: 620px;
      height: 300px;
      transform: rotate(30deg);
    }
    .bg-2 {
      bottom: -80px;
      right: -200px;
      width: 800px;
      height: 320px;
      transform: rotate(15deg);
    }
    > p {
        padding-left: vw(100);
    }
    .title{
        color: var(--wl-text-color-title-1);
        font-size: vw(24);
    }
    .mb-20{
        margin-bottom: vw(20);
    }
    .sub-title{
        color: var(--wl-text-color-primary-3);
        font-size: vw(20);
        margin-bottom: vw(20);
    }
    .saying-content{
        background: rgba(255, 255, 255, 0.2);
        box-shadow: vw(4) vw(4) vw(18) rgba(0, 0, 0, 0.08);
        backdrop-filter: blur(vw(24));
        border-radius: vw(18);
        margin: 0 vw(60);
        padding: vw(30) vw(50);
        .bold{
            font-weight: 500;
            color: var(--wl-text-color-title-1);
        }
        > p{
            color: var(--wl-text-color-title-2);
            font-size: vw(16);
        }
    }

    .link{
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--wl-primary-color);
        margin-top: vw(18);
        margin-bottom: vw(22);
        > span{
            position: relative;
            user-select: none;
            cursor: pointer;
            font-size: vw(16);
        }
    }

    .code-mask{
        background-color: var(--wl-mask-color);
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 98;
    }
}
</style> -->
