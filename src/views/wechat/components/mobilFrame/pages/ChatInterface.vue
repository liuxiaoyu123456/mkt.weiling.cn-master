<script setup lang="ts">
import { ref, watch, computed } from "vue";
import zhangyong from "@/assets/images/wechat/avator-zhangyong.png";
import { useUserStore } from "@/stores";

const store: any = useUserStore();
const props = withDefaults(
  defineProps<{
    form: any;
  }>(),
  {
    form: {},
  }
);

const currentStaff: any = computed(() => {
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

const applyHighlights = (content: any) => {
  content = content
    .replace(/\n$/g, "\n\n")
    .replace(/\[员工名称\]/g, "<span>$&</span>")
    .replace(/\[客户昵称\]/g, "<span>$&</span>")
    .replace(/[\r\n]/g, "<br>")
    .replace(/\s/g, "&nbsp;");
  return content;
};
const text = computed(() => {
  return applyHighlights(
    props.form.channel.new_welcome_msg_info?.text?.content || ""
  );
});
</script>

<template>
  <div class="main-center prview-bottom">
    <div class="flex-column phone-model">
      <img
        class="mobile-chart"
        src="@/assets/images/virtualPhone/mobile-chart.png"
        alt="mobile chart"
      />
      <div class="flex-column main-content">
        <div class="flex-row main-between cross-center title">
          <em class="el-icon-arrow-left" />
          <div class="flex-column currentStaffInfo">
            <OpenData
              class="nick-name"
              :openid="currentStaff.name || currentStaff.nickName"
            />
            <span>{{ store.userInfo.corp.corpName }}</span>
          </div>
          <em class="el-icon-more" />
        </div>
        <div class="flex-column main-part">
          <div class="flex-row top-gap chart-part" v-if="text.length !== 0">
            <div class="left">
              <img
                :src="
                  currentStaff.headImgUrl || currentStaff.avatar || zhangyong
                "
                alt="avatar"
              />
            </div>
            <div class="hight-light-span right">
              <div class="cross-center text-shell">
                <div v-html="text"></div>
              </div>
              <div class="triangle" />
            </div>
          </div>
          <template
            v-for="(attachment, index) in form.channel.new_welcome_msg_info
              .attachments"
            :key="index"
          >
            <div
              class="flex-row chart-part"
              v-if="attachment.msgtype == 'link'"
            >
              <div class="left">
                <img
                  :src="
                    currentStaff.headImgUrl
                      ? currentStaff.headImgUrl
                      : zhangyong
                  "
                  alt="avator"
                />
              </div>
              <div class="flex-column right">
                <div class="triangle" />
                <span class="article-title">{{ attachment.link.title }}</span>
                <div class="flex-row main-between">
                  <span class="article-subTitle">{{
                    attachment.link.desc
                  }}</span>
                  <div class="flex-column cross-center">
                    <img :src="attachment.link.picurl" alt="welcome picture" />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex-row chart-part"
              v-if="attachment.msgtype == 'image'"
            >
              <div class="left">
                <img
                  :src="
                    currentStaff.headImgUrl
                      ? currentStaff.headImgUrl
                      : zhangyong
                  "
                  alt="avator"
                />
              </div>
              <div class="equal-scaling-shell">
                <img
                  class="equal-scaling"
                  :src="attachment.image.picUrl"
                  alt="picture"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.prview-bottom {
  width: 100%;
  position: relative;
}

.iframe {
  width: 100%;
  height: 100%;
  border-radius: 0 0 30px 30px;
}

.mobile-chart {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

.main-content {
  position: absolute;
  width: 100%;
  top: 30px;
  left: 0;
}

.title {
  height: 40px;

  .currentStaffInfo {
    text-align: center;
    min-width: 0;
    .nick-name {
      @extend %ov1;
      font-size: 13px;
      font-weight: 600;
    }
  }
}

.chart-part {
  .equal-scaling-shell {
    height: auto;
    width: 144px;
    margin-left: 10px;
    margin-bottom: 20px;

    .equal-scaling {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }

  img {
    width: 33px;
    height: 33px;
  }

  .right {
    position: relative;
    width: 70%;
    margin-left: 10px;
    margin-bottom: 20px;
    background: white;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    height: max-content;

    .text-shell {
      min-height: 25px;
    }

    .article-title {
      letter-spacing: 0.5px;
      font-size: 13px;
      color: #0e0e0e;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .article-subTitle {
      font-size: 10px;
      overflow: hidden;
      color: var(--wl-text-color-secondary-2);
      word-wrap: break-word;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
    }

    .triangle {
      position: absolute;
      width: 0;
      height: 0;
      border: 4px solid transparent;
      border-right: 9px solid white;
      top: 8px;
      left: -10px;
    }
  }
}

.top-gap {
  margin-top: 50px;
  display: block;
}

.el-icon-arrow-left {
  margin-left: 5px;
}

.el-icon-more {
  margin-right: 10px;
}

.hight-light-span {
  float: left;
  word-break: break-all;

  :deep() {
    span {
      color: #26a2ff !important;
    }
  }
}

.left {
  float: left;
}

.main-part {
  height: 512px;
  overflow-y: auto;
  overflow: overlay;
  position: relative;
  z-index: 10;
  padding-left: 4px;
}
</style>
