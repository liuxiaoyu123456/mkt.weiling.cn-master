<template>
  <div class="friend-zone">
    <header class="friend-zone-header flex-row items-center">
      <Avatar :src="customer.headImgUrl" />
      <div class="flex-col">
        <div class="name">
          <OpenData :openid="customer.nickName" />
          <img
            v-if="customer.gender"
            class="genderImg"
            :src="customer.gender == 1 ? iconMale : iconFemale"
            alt=""
          />
        </div>
        <div class="source" :class="{ comany: customer.corpName }">
          {{ customer.corpName ? "@" + customer.corpName : "@微信" }}
        </div>
      </div>
    </header>
    <main class="friend-zone-body">
      <ul
        class="item_group"
        v-infinite-scroll="loadFn"
        :infinite-scroll-disabled="isEnd"
        :infinite-scroll-delay="300"
        :infinite-scroll-distance="20"
      >
        <li
          class="item flex-row"
          v-for="(friend, index) in friendsList"
          :key="index"
        >
          <div class="item-icon"></div>
          <Avatar class="self-center" :src="friend.headImgUrl" />
          <div class="item-right flex-1 flex-col justify-center">
            <div class="top flex-row">
              <OpenData class="text-l1" :openid="friend.nickName" />
              <div v-if="friend.lostState" class="lost-state flex-none text-l1">
                {{ getStateName(friend.lostState) }}
              </div>
              <div
                v-if="friend.resignationFlag == 1"
                class="lost-state flex-none text-l1 lost-state--gray"
              >
                已离职
              </div>
            </div>
            <div class="bottom flex-row justify-between">
              <div class="text-l1">
                <span>添加方式：</span>
                <span>{{ friend.addWayDesc }}</span>
                <span class="bottom_text">{{ friend.codeState }}</span>
              </div>
              <div class="date flex-none">
                {{ dayjs(+friend.createTime).format("YYYY-MM-DD HH:mm:ss") }}
              </div>
            </div>
          </div>
        </li>
        <li class="bottom-notice">
          {{ isEnd ? "没有更多了" : "加载中..." }}
        </li>
      </ul>
    </main>
  </div>
</template>

<script lang="ts" setup>
import iconMale from "@/assets/images/icon_male.png";
import iconFemale from "@/assets/images/icon_female.png";
import Avatar from "@/components/Avatar.vue";
import dayjs from "dayjs";
import { customerMutualFriendList } from "@/api";

defineProps<{
  customer: any;
  friendsList: any[];
  isEnd: boolean;
  loadFn: any;
}>();
const getStateName = customerMutualFriendList.getStateName;
</script>

<style lang="scss" scoped>
.friend-zone {
  position: relative;
  &-header {
    margin: -24px -24px 0;
    padding: 24px;
    box-shadow: 0px 12px 20px -10px #eeeeee;
    background-color: #fff;
    gap: 8px;
    :deep(.avatar) {
      font-size: 60px;
    }
    .name {
      font-size: 22px;
      font-weight: 600;
    }
    .source {
      font-size: 16px;
      color: #76bf74;
      &.company {
        color: #fc9042;
      }
    }
  }
  &-body {
    .item_group {
      height: 300px;
      margin: 0 -24px -24px;
      overflow-y: scroll;
      overflow-x: hidden;
      > .bottom-notice {
        text-align: center;
        height: 50px;
        line-height: 50px;
      }
    }
    .item {
      padding-left: 25px;
      padding-right: 25px;
      height: 70px;
      :deep(.avatar) {
        font-size: 46px;
      }
      &-icon {
        position: relative;
        width: 20px;
        &::before {
          content: "";
          border-radius: 50%;
          display: block;
          width: 8px;
          height: 8px;
          background: #cccccc;
          position: absolute;
          bottom: 50%;
          right: 50%;
          transform: translate(50%, 50%);
        }
      }
      &:not(:first-child) {
        .item-icon {
          &::after {
            content: "";
            display: block;
            width: 1px;
            height: 100%;
            background: #cccccc;
            position: absolute;
            bottom: 50%;
            right: 50%;
            transform: translate(50%, 0);
          }
        }
      }
      &-right {
        margin-left: 8px;
        gap: 8px;
        width: 0;
        .top {
          color: var(--wl-text-color-primary-3);
          gap: 8px;
        }
        .bottom {
          font-size: 12px;
          color: #b4b4b4;
          .bottom_text {
            margin-left: 10px;
            color: var(--wl-primary-color);
          }
          .date {
            color: #b4b4b4;
          }
        }
        .lost-state {
          padding: 2px 6px;
          background: #ffebe8;
          border-radius: 4px;
          color: var(--wl-error-color);
          font-size: 12px;
          &--gray {
            background: var(--wl-line-color-light);
            color: #797979;
          }
        }
      }
    }
  }
}
</style>
