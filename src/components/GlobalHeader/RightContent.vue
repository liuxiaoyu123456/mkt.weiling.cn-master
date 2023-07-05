<template>
  <div class="right-content-wrap">
    <wl-popover
      placement="bottom-end"
      :width="112"
      :offset="20"
      :show-arrow="false"
      :disabled="!accountState.haveSolution && isWXWork()"
    >
      <template #reference>
        <div class="right-content">
          <img class="portrait" :src="userStore?.userInfo?.headImgUrl" />
          <!-- <span class="nickname">
            {{ userStore?.userInfo?.nickName }}
          </span> -->
          <OpenData class="nickname" :openid="userStore?.userInfo?.nickName" />
        </div>
      </template>

      <div class="right-content-popover">
        <div v-if="accountState.haveSolution">
          <RouterLink :to="{ path: '/account' }">账户中心</RouterLink>
        </div>
        <div v-if="!isWXWork()">
          <a @click="handleLogout" href="javascript:;">退出</a>
        </div>
      </div>
    </wl-popover>

    <!-- {{ userStore.userInfo }} -->
  </div>
</template>
<script setup lang="ts">
import { useUserStore, useAccountState } from "@/stores";
import { loginQuit } from "@/api";
import { isWXWork } from "@/utils";
import { storeToRefs } from "pinia";
const userStore: any = useUserStore();
const accountStore = useAccountState();
const { accountState } = storeToRefs(accountStore);
const handleLogout = () => {
  loginQuit().then(() => {
    location.reload();
  });
};
</script>
<style>
/* .el-popper{--el-popper-border-radius:var(--el-popover-border-radius, 4px)}.el-popper{position:absolute;border-radius:var(--el-popper-border-radius);padding:5px 11px;z-index:2000;font-size:12px;line-height:20px;min-width:10px;word-wrap:break-word;visibility:visible}.el-popper.is-dark{color:var(--el-bg-color);background:var(--el-text-color-primary);border:1px solid var(--el-text-color-primary)}.el-popper.is-dark .el-popper__arrow::before{border:1px solid var(--el-text-color-primary);background:var(--el-text-color-primary);right:0}.el-popper.is-light{background:var(--el-bg-color-overlay);border:1px solid var(--el-border-color-light)}.el-popper.is-light .el-popper__arrow::before{border:1px solid var(--el-border-color-light);background:var(--el-bg-color-overlay);right:0}.el-popper.is-pure{padding:0}.el-popper__arrow{position:absolute;width:10px;height:10px;z-index:-1}.el-popper__arrow::before{position:absolute;width:10px;height:10px;z-index:-1;content:" ";transform:rotate(45deg);background:var(--el-text-color-primary);box-sizing:border-box}.el-popper[data-popper-placement^=top]>.el-popper__arrow{bottom:-5px}.el-popper[data-popper-placement^=top]>.el-popper__arrow::before{border-bottom-right-radius:2px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow{top:-5px}.el-popper[data-popper-placement^=bottom]>.el-popper__arrow::before{border-top-left-radius:2px}.el-popper[data-popper-placement^=left]>.el-popper__arrow{right:-5px}.el-popper[data-popper-placement^=left]>.el-popper__arrow::before{border-top-right-radius:2px}.el-popper[data-popper-placement^=right]>.el-popper__arrow{left:-5px}.el-popper[data-popper-placement^=right]>.el-popper__arrow::before{border-bottom-left-radius:2px}.el-popper[data-popper-placement^=top] .el-popper__arrow::before{border-top-color:transparent!important;border-left-color:transparent!important}.el-popper[data-popper-placement^=bottom] .el-popper__arrow::before{border-bottom-color:transparent!important;border-right-color:transparent!important}.el-popper[data-popper-placement^=left] .el-popper__arrow::before{border-left-color:transparent!important;border-bottom-color:transparent!important}.el-popper[data-popper-placement^=right] .el-popper__arrow::before{border-right-color:transparent!important;border-top-color:transparent!important}.el-popover{--el-popover-bg-color:var(--el-bg-color-overlay);--el-popover-font-size:var(--el-font-size-base);--el-popover-border-color:var(--el-border-color-lighter);--el-popover-padding:12px;--el-popover-padding-large:18px 20px;--el-popover-title-font-size:16px;--el-popover-title-text-color:var(--el-text-color-primary);--el-popover-border-radius:4px}.el-popover.el-popper{background:var(--el-popover-bg-color);min-width:150px;border-radius:var(--el-popover-border-radius);border:1px solid var(--el-popover-border-color);padding:var(--el-popover-padding);z-index:var(--el-index-popper);color:var(--el-text-color-regular);line-height:1.4;text-align:justify;font-size:var(--el-popover-font-size);box-shadow:var(--el-box-shadow-light);word-break:break-all;box-sizing:border-box}.el-popover.el-popper--plain{padding:var(--el-popover-padding-large)}.el-popover__title{color:var(--el-popover-title-text-color);font-size:var(--el-popover-title-font-size);line-height:1;margin-bottom:12px}.el-popover__reference:focus:hover,.el-popover__reference:focus:not(.focusing){outline-width:0}.el-popover.el-popper.is-dark{--el-popover-bg-color:var(--el-text-color-primary);--el-popover-border-color:var(--el-text-color-primary);--el-popover-title-text-color:var(--el-bg-color);color:var(--el-bg-color)}.el-popover.el-popper:focus,.el-popover.el-popper:focus:active{outline-width:0} */
.right-content-wrap {
  margin: 0 48px;
}
.right-content {
  display: flex;
  align-items: center;
}
.right-content .portrait {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}
.right-content .nickname {
  max-width: 126px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.right-content-popover a {
  display: block;
  color: var(--wl-black);
  font-size: 14px;
  line-height: 20px;
  padding: 10px;
}
</style>
