<template>
  <div v-if="data" class="flex-row items-center flex-nowrap">
    <Avatar class="flex-none" :src="cellData.headImgUrl" :type="userType" />
    <div
      class="user-text flex-1"
      :class="cellData.clickable ? 'clickable' : ''"
    >
      <div class="text-l1"><OpenData :openid="cellData.nickName" /></div>
      <div
        class="corp-name text-l1"
        :class="{ active: cellData.type == 1 }"
        v-if="cellData.corpName"
      >
        @{{ cellData.corp_name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Avatar from "@/components/Avatar.vue";
const enum UserType {
  WECHAT = 1,
  WECOM = 2,
}
interface UserData {
  nickName: string;
  headImgUrl: string;
  corpName?: string;
  [attr: string]: any;
}
interface UserColumn {
  prop: string;
  showIcon?: boolean;
}
const props = defineProps<{
  data: any;
  column: UserColumn;
}>();

const cellData = computed<UserData>(() => {
  return props.data[props.column.prop];
});
const userType = computed(() => {
  return props.column.showIcon
    ? cellData.value.type == UserType.WECOM ||
      (!cellData.value.type && cellData.value.corp_name)
      ? "wecom"
      : "wechat"
    : undefined;
});
</script>

<style lang="scss" scoped>
.avatar {
  // border: 2px solid #fff;
  font-size: 32px;
  margin-right: 8px;
}
.user-text {
  color: #4c4c4c;
  min-width: 0;
  width: 100%;
  .corp-name {
    color: #fc9042;

    &.active {
      color: var(--wl-success-color);
    }
  }
}

.clickable {
  color: var(--wl-primary-color-dark);
}

.clickable:hover {
  color: #4b6fc4;
}
</style>
