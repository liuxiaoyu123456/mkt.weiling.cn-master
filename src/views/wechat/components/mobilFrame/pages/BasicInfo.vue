<script setup lang="ts">
import { computed } from "vue";
import { defaultAvatar } from "@/utils";
defineProps<{
  tabsValue?: string;
  form: any;
}>();

/**获取头像 */
const getAvatar = (url: string) => {
  return url?.length != 0 ? url : defaultAvatar;
};

/**tag的计算属性 */
const clientTagStyle = computed(() => {
  return function (tagType: number) {
    switch (tagType) {
      case 1:
        return {
          background: "#E9EFF7",
          color: "#4B6FC4",
        };
      case 3:
        return {
          background: "#F4F5F6",
          color: "#303233",
        };

      default:
        break;
    }
  };
});
</script>

<template>
  <div class="basic-info mobil-basic-info">
    <img
      src="@/assets/images/virtualPhone/mobil-basic-info-top.svg"
      class="mobil-basic-info-top"
      alt="mobile top info"
    />
    <div class="flex-row flex-wrap tag-group">
      <img
        class="bottom-gap"
        src="@/assets/images/virtualPhone/edit-tag.svg"
        alt="edit tag"
      />
      <div
        class="flex-row bottom-gap client-tag"
        v-for="(tag, index) in form.channel?.tagList"
        :style="clientTagStyle(tag.type)"
        :key="index"
      >
        <span>{{ tag.tagName }}</span>
      </div>
    </div>
    <div class="basic-info-bottom">
      <img
        src="@/assets/images/virtualPhone/mobil-basic-info-bottom-jmy.svg"
        class="mobil-basic-info-bottom-jmy"
        alt="mobile bottom info"
      />
      <div class="flex-row source" v-if="form.button.button_name != ''">
        <span class="span-1">基木鱼加微组件</span>
        <span class="span-2">{{
          form.button.button_name != "" ? form.button.button_name : ""
        }}</span>
      </div>
      <div
        class="flex-row cross-center add-friend"
        v-if="
          form.channel.staffList?.length != 0 &&
          form.channel.staffList?.schedule_user_list[0]?.user_list?.length != 0
        "
      >
        <img
          :src="
            getAvatar(
              form.channel.staffList?.schedule_user_list[0].user_list[0]
                .head_img_url || defaultAvatar
            )
          "
          alt="avatar"
        />
        <span class="span-1">{{
          form.channel.staffList?.schedule_user_list[0].user_list[0]
            .nick_name || ""
        }}</span>
        <span class="span-2"
          >来源：{{
            form.button.button_name != ""
              ? "基木鱼加微组件:" + form.button.button_name
              : "基木鱼加微组件"
          }}</span
        >
      </div>

      <!-- <span class="website-name">{{ basicInfo.websiteName }}</span> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.basic-info,
.mobil-basic-info {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgb(247, 247, 247);

  .mobil-basic-info-top {
    width: 100%;
    margin-top: 35px;
  }
}

.basic-info-bottom {
  position: relative;

  .mobil-basic-info-bottom-jmy {
    width: 100%;
  }
}

.tag-group {
  background: white;
  width: 100%;
  margin-top: -3px;

  .bottom-gap {
    margin-bottom: 5px;
    margin-left: 5px;
  }
}

.client-tag {
  align-items: center;
  background: #e9eff7;
  color: #4b6fc4;
  border-radius: 17.313px;
  padding: 0 8px;
  height: 23px;
}

.website-name {
  position: absolute;
  top: 324px;
  left: 114px;
  font-size: 12px;
  font-weight: 600;
  line-height: 12px;
}

.source {
  position: absolute;
  top: 11px;
  right: 3px;

  .span {
    font-size: 14px;
  }

  .span-1 {
    line-height: 24px;
    font-weight: 600;
    margin-right: 10px;
    color: var(--wl-text-color-primary-2);
  }

  .span-2 {
    line-height: 24px;
    font-weight: 600;
    color: var(--wl-primary-color);
    max-width: 130px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 4px;
  }
}

.add-friend {
  position: absolute;
  top: 243px;
  width: 229px;
  right: 15px;
  font-size: 12px;

  img {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .span-1 {
    margin-left: 2px;
    max-width: 74px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .span-2 {
    font-weight: 600;
    font-size: 11px;
    color: var(--wl-text-color-placeholder);
    margin-left: 10px;
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
