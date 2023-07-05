<template>
  <div class="flex-row items-center" v-if="cellData?.length">
    <div class="flex-row cross-center user_wrap">
      <ul class="user-groups">
        <li
          class="flex-center"
          v-for="(item, index) in cellData.slice(0, 3)"
          :key="index"
          :class="{ no_border: cellData.length == 1 }"
        >
          <Avatar class="flex-none" :src="item?.headImgUrl" />
        </li>
      </ul>
      <div v-if="cellData.length > 1">共{{ cellData.length }}人</div>
      <div class="user_name text-l1" v-else>
        <OpenData :openid="cellData[0]?.nickName" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import Avatar from "@/components/Avatar.vue";

export default defineComponent({
  name: "wUserGroup",
  components: {
    Avatar,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    column: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  setup(props) {
    const Computed = {
      cellData: computed(() => props.data[props.column.prop]),
    };
    return {
      ...Computed,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-groups {
  display: flex;
  margin-right: 5px;
  margin-bottom: 0;
  > li {
    .avatar {
      border: 2px solid #fff;
    }

    &:not(:first-child) {
      margin-left: -12px;
    }

    &.no_border {
      border: none;
    }
  }
}

.user_wrap {
  // max-width: 140px;
  overflow: hidden;
}

.wp100 {
  width: 100%;
  max-width: initial;
}

.user_name {
  flex: 1;
}

.click_class {
  box-sizing: border-box;
  cursor: pointer;
  color: var(--wl-primary-color-dark);
  background: #f2f3f7;
  border-radius: 6px;
  height: 28px;
  padding: 0 7px;
}

.gray_class {
  box-sizing: border-box;
  background: #f7f7f7;
  border-radius: 6px;
  height: 28px;
  padding: 0 7px;
  color: #4c4c4c;
}
.no-bg {
  background-color: unset;
}
.content-list {
  min-width: 110px;
  max-height: 216px;
  overflow-y: scroll;

  .content-item {
    width: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 16px 0;
    flex-wrap: nowrap;

    .content-img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }
  }
}

.pointer {
  position: absolute;
  left: 140px;
}
.empty_count {
  color: var(--wl-primary-color-dark);
  background: #f2f3f7;
  border-radius: 6px;
  height: 28px;
  padding: 0 7px;
  line-height: 28px;
  cursor: pointer;
}
</style>
<style lang="scss">
.el-popper.is-light.company-view-list-tooltip {
  .el-popper__arrow {
    display: none;
  }
}
</style>
