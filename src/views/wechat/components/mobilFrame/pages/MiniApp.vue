<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useUserStore } from "@/stores";
import { defaultAvatar } from "@/utils";

const store: any = useUserStore();
const props = withDefaults(
  defineProps<{
    miniApp?: any;
    isOverlayShow: boolean;
    form: any;
  }>(),
  {
    miniApp: {
      introText: "立即获取更多产品详情",
    },
    isOverlayShow: false,
    form: {},
  }
);

const randomStaff: any = computed(() => {
  if (props.form?.channel?.time_cut_flag) {
    if (props.form.channel.staffList.schedule_user_list[0].user_list?.length) {
      return props.form.channel.staffList.schedule_user_list[0].user_list[0];
    } else {
      return {};
    }
  } else {
    if (props.form?.channel?.user_list.length) {
      return props.form?.channel?.user_list[0];
    } else {
      return {};
    }
  }
});

const getCurCorpName: any = computed(() => {
  return store.userInfo?.corp?.corpName;
});

const drawPos = ref(100);

const getDetailAvatar = (imgUrl: any) => {
  if (imgUrl) return imgUrl;
  else {
    return defaultAvatar;
  }
};

watch(
  () => props.isOverlayShow,
  (val: boolean) => {
    setTimeout(() => {
      if (val) {
        drawPos.value = 0;
      } else {
        drawPos.value = 100;
      }
    }, 100);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="mini-app">
    <!-- <div class="flex-column cross-center main-content">
      <img
        class="qrCode"
        src="@/assets/images/virtualPhone/smart_code.png"
        alt="qrcode"
      />
      <span class="span-2">长按识别图中二维码加微信</span>
      <span class="span-3" v-if="form?.channel?.miniprogram_welmsg">{{
        form?.channel.miniprogram_welmsg
      }}</span>
    </div> -->

    <div class="main-content">
      <div class="welmsg-box" v-if="form?.channel?.miniprogram_welmsg">
        {{ form?.channel?.miniprogram_welmsg }}
      </div>
    </div>

    <template v-if="isOverlayShow">
      <div class="overlay-mask"></div>
      <div
        class="bottom-drawer"
        :style="{ transform: `translateY(${drawPos}%)` }"
      >
        <img
          class="wx-buttom-drawer"
          src="https://wlmvp-cos.weiling.cn/worktable-erp/bigPic/wx-buttom-drawer.svg"
          alt="button drawer"
        />
        <div class="flex-column main-center random-staff">
          <span class="span-1"> 打开对方的企业微信名片 </span>
          <div class="main-center flex-row namecard">
            <img
              class="avatar"
              :src="getDetailAvatar(randomStaff.avatar || randomStaff.avatar)"
              alt="avatar"
            />
            <OpenData
              class="span-2 namecard_name"
              :openid="randomStaff.name || randomStaff.nickName"
            />
            <!-- <span class="span-2 namecard_name">{{
              randomStaff.nickName
            }}</span> -->
            <span class="span-3 namecard_corpname"
              >@{{ randomStaff.corpName || getCurCorpName }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.mini-app {
  display: flex;
  height: 100%;
  align-items: center;
  .main-content {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url("@/assets/images/virtualPhone/welcome-bg.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    .welmsg-box {
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      width: 100%;
      height: 158px;
      font-weight: 500;
      font-size: 16px;
      word-wrap: break-word;
      color: #fff;
      // border: 1px red solid;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      word-break: break-all;
    }
  }

  .overlay-mask {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    background-color: var(--wl-mask-color);
    z-index: 1;
  }
  .bottom-drawer {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 270px;
    background: white;
    left: 0;
    bottom: 0;
    border: 1px solid #e4e9ed;
    border-radius: 10px 10px 30px 30px;
    transition: 0.3s;
    img.wx-buttom-drawer {
      border-radius: 0 0 30px 30px;
      width: 100%;
    }
    img.avatar {
      width: 19px;
      height: 19px;
      border-radius: 3px;
    }
  }
  .show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
  .random-staff {
    position: absolute;
    width: 100%;
    background: white;
    height: 60px;
    top: 158px;
    text-align: center;
    line-height: 19px;
    .span-1 {
      font-size: 13px;
      color: var(--wl-text-color-placeholder);
      margin-bottom: 5px;
    }
    .span-2 {
      margin-left: 7px;
      font-size: 16px;
    }
    .span-3 {
      margin-left: 7px;
      font-size: 11px;
      color: #f0b36f;
    }
  }
  .namecard {
    padding: 0 5px;
    .namecard_name {
      max-width: 224px;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .namecard_corpname {
      margin-left: 5px;
      max-width: 64px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
