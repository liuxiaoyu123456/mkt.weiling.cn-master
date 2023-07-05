<script lang="ts" setup>
import { ref } from "vue";
import { getCosImageUrl } from "@/utils";
const imgList = [
  getCosImageUrl("/guide1.png"),
  getCosImageUrl("/guide2.png"),
  getCosImageUrl("/guide3.png"),
];

defineProps<{
  accountForm: any;
  loading: boolean;
}>();
</script>

<template>
  <div class="create-guide">
    <p class="title">如何在百度后台绑定账号密码</p>
    <p>
      1.进入<a
        target="_blank"
        href="https://yingxiaotong.baidu.com/vector/user/33229238/component/wechat/list"
        >百度营销通</a
      >，点击微信->选择服务商
    </p>
    <el-image
      :preview-src-list="imgList"
      :src="imgList[0]"
      :initial-index="0"
      class="el-img"
    >
    </el-image>
    <p>2.选择“卫瓴集客通”</p>
    <el-image
      :preview-src-list="imgList"
      :src="imgList[1]"
      :initial-index="1"
      class="el-img"
    >
    </el-image>
    <p>
      3.将设置好的账号密码复制到百度后台的账号绑定区域，并点击“提交”（账号密码填写位置见下图）
    </p>
    <div class="account-info">
      <div class="account-info-item">
        <span>账号</span>
        <el-input
          disabled
          class="input"
          v-model="accountForm.account_name"
        ></el-input>
        <el-button type="primary" v-copyText="accountForm.account_name"
          >复制</el-button
        >
      </div>
      <div class="account-info-item">
        <span>密码</span>
        <el-input
          disabled
          class="input"
          v-model="accountForm.account_password"
        ></el-input>
        <el-button type="primary" v-copyText="accountForm.account_password"
          >复制</el-button
        >
      </div>
    </div>
    <el-image
      :preview-src-list="imgList"
      :src="imgList[2]"
      :initial-index="2"
      class="el-img"
    >
    </el-image>

    <div class="search-loading-box-mask" v-if="loading">
      <div class="search-loading-box-warp">
        <div class="loading-box">
          <img src="@/assets/images/wechat/loading.gif" alt="loading" />
        </div>
        <span>正在查询账户是否成功绑定</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.create-guide {
  width: 640px;
  margin: 0 auto;
  .title {
    color: var(--wl-text-color-title-1);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }

  .el-img {
    box-shadow: 6px 6px 24px rgb(0 0 0 / 12%);
    border-radius: 16px;
  }

  > p {
    font-size: 16px;
    line-height: 24px;
    color: var(--wl-text-color-title-1);
    margin-bottom: 8px;
    margin-top: 24px;
    > a {
      color: var(--wl-primary-color);
    }
  }

  .account-info {
    padding: 24px 20px;
    &-item {
      display: flex;
      align-items: center;
      & + .account-info-item {
        margin-top: 16px;
      }
      > span {
        font-weight: 500;
        font-size: 18px;
        line-height: 26px;
        margin-right: 33px;
      }
      .input {
        margin-right: 17px;
        width: 202px;
      }
    }
  }
}

.search-loading-box-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  .search-loading-box-warp {
    width: 480px;
    height: 242px;
    background: #ffffff;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    padding-top: 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 200px auto 0;
    .loading-box {
      width: 124px;
      height: 124px;
      margin-bottom: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    > span {
      color: var(--wl-text-color-title-1);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
