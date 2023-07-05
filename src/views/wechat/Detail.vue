<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { defaultAvatar } from "@/utils";
import useScheduleUser from "@/hooks/wechat/useScheduleUser";
import FinalPage from "./components/steps/FinalPage.vue";
import MobilFrame from "./components/mobilFrame/Index.vue";
import useWechatEdit from "@/hooks/wechat/useWechatEdit";

const route = useRoute();
const { formatHalfTime, timeIntervalWeek } = useScheduleUser();
const { queryDetail, form } = useWechatEdit();

const pageIndex = ref(0);

/**tag的动态样式 */
// const tagStyle = computed(() => {
//   return function (tagType: any) {
//     switch (tagType) {
//       case 1:
//         return {
//           background: "var(--wl-primary-color-light)",
//         };
//       case 3:
//         return {
//           background: "#fff",
//         };
//       default:
//         break;
//     }
//   };
// });

queryDetail(route.query.id);
</script>

<template>
  <div class="wechat-detail">
    <div class="wechat-detail-container">
      <div class="left-wrap card">
        <div class="card-top">
          <Navbar text="方案列表" path="/wechat" />
        </div>
        <div class="card-body">
          <div class="title">加微页面</div>
          <div class="item">
            <div class="item-label">加微引导语</div>
            <div class="item-val">{{ form?.channel?.miniprogram_welmsg }}</div>
          </div>

          <div class="title">智能码</div>
          <div class="item">
            <div class="item-label">使用员工</div>
            <!-- 时段 -->
            <div
              class="flex-column staff-gap margin-bottom-init"
              v-if="form?.channel?.time_cut_flag"
            >
              <div
                v-for="(schedule, index) in form?.channel?.staffList
                  .schedule_user_list"
                :key="index"
                class="schedule_time_wrap"
              >
                <div class="schedule_time_top">
                  <span
                    v-if="!schedule.default_user_flag"
                    class="schedule_time_title"
                    >时段{{ index + 1 }}</span
                  >
                  <span v-else class="schedule_time_title">其他时段</span>
                  <span
                    v-if="!schedule.default_user_flag"
                    class="schedule_time_zone"
                    >{{ timeIntervalWeek(schedule.weekday_index) }} |
                    {{ formatHalfTime(schedule.start_half_hour_index) }}-{{
                      formatHalfTime(schedule.end_half_hour_index)
                    }}</span
                  >
                </div>
                <div
                  class="flex-row cross-center checked_user mr-12"
                  :class="item.liveCodeValid ? 'valid_user' : 'invalid_user'"
                  v-for="(item, innerIndex) in schedule.user_list"
                  :key="innerIndex"
                >
                  <img
                    class="avatar"
                    :src="item.headImgUrl || defaultAvatar"
                    alt="avatar"
                  />
                  <span>{{ item.nickName }}</span>
                </div>
              </div>
              <div class="warning-msg" v-if="form?.channel?.hasInvalidUser">
                存在使用员工无法添加，请尽快修改
              </div>
            </div>
            <!-- 正常分配样式 -->
            <div class="flex-column staff-gap margin-bottom-init" v-else>
              <div>
                <div
                  class="flex-row cross-center checked_user"
                  :class="item.liveCodeValid ? 'valid_user' : 'invalid_user'"
                  v-for="(item, index) in form?.channel?.staffList
                    .schedule_user_list[0].user_list"
                  :key="index"
                >
                  <img
                    class="avatar"
                    :src="item.headImgUrl || defaultAvatar"
                    alt="avatar"
                  />
                  <OpenData :openid="item.nickName" />
                  <!-- <span>{{ item.nickName }}</span> -->
                </div>
              </div>
              <div class="warning-msg" v-if="form?.channel?.hasInvalidUser">
                存在使用员工无法添加，请尽快修改
              </div>
            </div>
          </div>
          <div class="item">
            <div class="item-label">欢迎语</div>
            <div
              class="item-val"
              v-html="form?.channel?.new_welcome_msg_info?.text?.content"
            ></div>
          </div>
          <div
            class="item"
            v-if="form?.channel?.new_welcome_msg_info?.attachments?.length"
          >
            <div class="item-label">附件</div>
            <div class="flex-column cross-start flex1">
              <template
                v-for="(attachment, index) in form?.channel
                  ?.new_welcome_msg_info?.attachments"
                :key="index"
              >
                <div
                  v-if="attachment.msgtype == 'link'"
                  class="flex-row margin-bottom-init link-bottom"
                >
                  <div class="flex-row cross-center link-item flex1">
                    <img :src="attachment.link.picurl" alt="picture" />
                    <div
                      class="flex-column link-item-name margin-bottom-init flex1"
                    >
                      <span class="title">{{ attachment.link.title }}</span>
                      <span class="subtitle">{{ attachment.link.desc }}</span>
                    </div>
                  </div>
                </div>
                <div
                  v-if="attachment.msgtype == 'image'"
                  class="margin-bottom-init pic"
                >
                  <img :src="attachment.image.pic_url" alt="picture" />
                </div>
              </template>
            </div>
          </div>
          <!-- <div class="item">
            <div class="item-label">标签</div>
            <div class="item-val">
              <el-tag
                v-for="tag in form?.channel?.tagList"
                class="tag-item"
                :key="tag.tagId"
                :style="tagStyle(tag.type)"
                :class="{ crop_tag: tag.type == 1 }"
              >
                {{ tag.tagName }}
              </el-tag>
            </div>
          </div> -->

          <div class="title">基础信息</div>
          <div class="item">
            <div class="item-label">方案名称</div>
            <div class="item-val">{{ form.button.button_name }}</div>
          </div>

          <FinalPage :form="form" />
        </div>
      </div>
      <div class="right-wrap card">
        <span>预览</span>
        <div class="phone-wrap">
          <MobilFrame v-model:pageIndex="pageIndex" :form="form" type="view" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wechat-detail {
  &-container {
    padding-top: 12px;
    display: flex;
    min-height: calc(100vh - 116px);
    height: 788px;

    .left-wrap {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 100%;

      .card-top {
        border-bottom: 1px solid var(--wl-line-color-light);
        padding-bottom: 18px;
      }

      .card-body {
        padding-top: 18px;
        overflow-y: auto;
        > .title {
          position: relative;
          color: #000000;
          font-size: 20px;
          line-height: 28px;
          display: flex;
          align-items: center;
          margin-left: 20px;
          margin-bottom: 24px;

          &::before {
            position: absolute;
            content: "";
            width: 3px;
            height: 22px;
            background: var(--wl-primary-color);
            border-radius: 4px;
            left: -12px;
          }
        }

        .item {
          margin-left: 20px;
          display: flex;
          font-size: 16px;
          line-height: 24px;
          margin-bottom: 24px;

          &-label {
            color: var(--wl-text-color-primary-3);
            width: 120px;
          }

          &-val {
            font-weight: 600;
            flex: 1;
            font-size: 16px;
            color: var(--wl-text-color-title-2);
          }
          .tag-item {
            margin-right: 10px;
            margin-bottom: 5px;
            height: 32px !important;
          }
          .pic {
            max-height: 120px;
            width: 100px;
            img {
              margin-bottom: 20px;
              width: 100px;
              height: 100px;
              object-fit: cover;
            }
          }

          .margin-bottom-init {
            margin-bottom: 0px !important;
          }

          .staff-gap {
            flex: 1;
          }
          .schedule_time_wrap {
            border: 1px solid var(--wl-line-color-dark);
            border-radius: 8px;
            width: 85%;
            & + .schedule_time_wrap {
              margin-top: 20px;
            }
            .schedule_time_top {
              border-bottom: 1px solid var(--wl-line-color-dark);
              padding: 8px 12px;
              margin-bottom: 12px;
              .schedule_time_title {
                font-weight: 600;
              }
              .schedule_time_zone {
                padding-left: 16px;
                color: var(--wl-text-color-secondary-2);
              }
            }
          }
          .warning-msg {
            background: var(--wl-error-color-light);
            color: var(--wl-error-color);
            width: fit-content;
            padding: 3px 6px;
            border-radius: 4px;
          }

          .mr-12 {
            margin-left: 12px !important;
          }
          .checked_user {
            display: inline-block;
            padding: 4px 6px;
            border-radius: 4px;
            color: #000000;
            margin-bottom: 10px !important;
            & + .checked_user {
              margin-left: 12px;
            }
            img {
              width: 24px;
              height: 24px;
              -o-object-fit: cover;
              object-fit: cover;
              border-radius: 50%;
              vertical-align: middle;
            }
            span {
              margin: 0 6px;
              vertical-align: middle;
            }
          }
          .valid_user {
            background: rgba(28, 159, 255, 0.08);
            border: 1px solid rgba(28, 159, 255, 0.08);
          }
          .invalid_user {
            background: var(--wl-error-color-light);
            border: 1px solid var(--wl-error-color);
          }

          .link-bottom {
            height: 82px;
            width: 100%;
            .link-item {
              position: relative;
              padding-right: 10px;
              height: 66px;
              background: var(--wl-primary-color-lightest);
              border-radius: 8px;
              margin-right: 5%;
              img {
                width: 54px;
                height: 54px;
                margin-left: 6px;
                border-radius: 6px;
                object-fit: cover;
              }
              .cancel-icon-2 {
                position: absolute;
                border-radius: 6px;
                width: 14px;
                right: 30px;
                height: 14px;
                cursor: pointer;
              }
              .link-item-name {
                margin-left: 6px;
                span {
                  display: block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .title {
                // width: 90%;
                height: 100%;
                margin-bottom: 12px;
                font-weight: 600;
                font-size: 16px;
                color: #0e0e0e;
              }
              .subtitle {
                width: 100%;
                font-size: 14px;
                color: var(--wl-text-color-secondary-2);
              }
            }
          }
        }
      }
    }

    .right-wrap {
      width: 460px;
      margin-left: 10px;
      height: 100%;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      > span {
        color: var(--wl-text-color-title-1);
        font-size: 18px;
      }
    }
  }
}
</style>
