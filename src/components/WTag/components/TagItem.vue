<!-- 标签组 -->
<template>
  <div class="tag_item" v-if="data.tagInfo && data.tagInfo.length > 0">
    <p class="title" @click.stop="onClickGroupName">{{ data.groupName }}</p>
    <ul
      class="flex-row flex-wrap"
      :class="{ height_row_2: isStowed }"
      ref="refRagWrap"
    >
      <li
        v-for="item in data.tagInfo"
        :key="item.tagId"
        :class="computedClass(item)"
        @click.stop="onClickTag(item)"
      >
        {{ item.tagName }}
        <img :src="formatCosUrl('/worktable-erp/icon/selected.png ')" alt="" />
      </li>
      <div
        class="expend"
        :class="{ transform: !isStowed }"
        v-show="cardHeightLock"
        @click.stop="onExpend"
      >
        <img :src="formatCosUrl('/worktable-h5/icon/expand.png')" alt="" />
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
  nextTick,
} from "vue";
import { useUserStore } from "@/stores";
import { formatCosUrl } from "@/utils/utils";
import useScrollHeight from "@/hooks/wechat/useScrollHeight";

export default defineComponent({
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    "checked-data": {
      type: Array,
      default() {
        return [];
      },
    },
    expend: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    let initialVisible = false;
    const store = useUserStore();
    const userInfo: any = store.userInfo;
    const is_administrator = store.getter_is_administrator;
    const state = reactive<{ refRagWrap: any; isStowed: boolean }>({
      refRagWrap: null,
      isStowed: true,
    });
    const { cardHeightLock, onWatchCardHeight } = useScrollHeight(); // 超过高度显示展开的变量和方法
    const onClickTag = (item: any) => {
      let data = props.checkedData.find((res: any) => res.tagId == item.tagId);
      if (data?.disabled) return;
      emit("tagClick", {
        ...item,
        tag_user_id: userInfo.id,
      });
    };
    const onClickGroupName = () => {
      // let bol = props.data.tag_info?.length == props.checkedData?.length;
      // 当前组是否全选中
      let bol = props.data.tagInfo?.every((item: any) =>
        props.checkedData.find((res: any) => res.tagId == item.tagId)
      );
      if (bol) {
        emit("groupNameClick", {
          type: "cancel",
          list: props.data.tagInfo,
        });
      } else {
        let list = props.data.tagInfo.map((res: any) => {
          return {
            ...res,
            tag_user_id: userInfo.id,
          };
        });
        emit("groupNameClick", {
          type: "selectAll",
          list,
        });
      }
    };
    const onExpend = () => {
      state.isStowed = !state.isStowed;
    };
    const onCheckDisable = (item: any) => {
      return (
        !is_administrator && !item.is_leader && item.tag_user_id !== userInfo.id
      );
    };
    const computedClass = (item: any) => {
      let data = props.checkedData.find((res: any) => res.tagId == item.tagId);
      if (!data) return;
      if (data.disabled) return "disabled";
      return data.type == 3 ? "self_active" : "active";
    };
    watch(
      () => props.visible,
      (val) => {
        if (!val || initialVisible) return;
        nextTick(() => {
          initialVisible = true;
          onWatchCardHeight(state.refRagWrap, 76);
          state.isStowed = cardHeightLock.value;
        });
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      () => props.expend,
      (val) => {
        if (val) state.isStowed = false;
      }
    );
    watch(
      () => props.data,
      () => {
        nextTick(() => {
          onWatchCardHeight(state.refRagWrap, 76);
          state.isStowed = cardHeightLock.value;
        });
      },
      {
        deep: true,
      }
    );

    return {
      ...toRefs(state),
      onClickTag,
      computedClass,
      formatCosUrl,
      cardHeightLock,
      onExpend,
      onClickGroupName,
    };
  },
});
</script>

<style scoped lang="scss">
.tag_item {
  .title {
    cursor: pointer;
    color: var(--wl-text-color-title-1);
    font-weight: 500;
    display: inline-block;
  }
  ul {
    position: relative;
    height: initial;
    padding-left: 0;
    &.height_row_2 {
      max-height: 76px;
      overflow: hidden;
    }
    li {
      position: relative;
      cursor: pointer;
      box-sizing: content-box;
      margin: 10px 12px 0 0;
      padding: 0 8px;
      line-height: 26px;
      border-radius: 20px;
      border: 1px solid var(--wl-text-color-placeholder);
      color: var(--wl-text-color-secondary-2);
      max-width: 100%;
      @extend %ov1;
      img {
        display: none;
        position: absolute;
        width: 18px;
        top: 0;
        right: 0;
      }
      &.active {
        background: rgba(26, 58, 143, 0.08);
        color: var(--wl-primary-color-dark);
        border-color: transparent;
      }
      &.self_active {
        background: #f4f9fd;
        color: #000000;
        border-color: transparent;
      }
      &.disabled {
        cursor: not-allowed;
        color: #c1c1c1;
        img {
          display: block;
        }
      }
    }
    .expend {
      position: absolute;
      right: 0;
      top: 48px;
      width: 28px;
      height: 28px;
      background-color: white;
      cursor: pointer;
      transition: transform 0.1s;
      img {
        width: 100%;
        height: 100%;
      }
      &.transform {
        transform: rotate(180deg);
        position: initial;
        margin-top: 11px;
      }
    }
  }
}
</style>
