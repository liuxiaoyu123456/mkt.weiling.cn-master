<!-- 已选择的标签 -->
<template>
  <div class="tag_checked flex-column">
    <div class="tag_title flex-row main-between cross-center">
      <p>
        已选 <span>{{ computedData.length }}</span
        ><span v-if="multipleLimit"> / {{ multipleLimit }}</span> 个标签
      </p>
      <span class="del" @click.stop="onRemoveTag('')">清除</span>
    </div>
    <ul class="tag_content flex1" v-if="computedData.length" ref="refRagWrap">
      <li v-for="item in computedData" :key="item.tagid">
        <div class="tag_item" :class="{ is_self: item.type == 3 }">
          <span v-if="item.type == 3 || !item.groupName">{{
            item.tagName
          }}</span>
          <span v-else>{{ item.groupName }}: {{ item.tagName }}</span>

          <el-icon class="icon" @click.stop="onRemoveTag(item)"
            ><CircleCloseFilled
          /></el-icon>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, type SetupContext, computed } from "vue";
import { CircleCloseFilled } from "@element-plus/icons-vue";

export default defineComponent({
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    // 限制最大的选择数量
    multipleLimit: {
      type: Number,
      default: 0,
    },
  },
  components: { CircleCloseFilled },
  setup(props: any, { emit }: SetupContext) {
    const onRemoveTag = (item: any) => {
      emit("onRemoveTag", item);
    };
    const computedData = computed(() => {
      return props.data.filter((res: any) => !res.disabled);
    });
    return {
      onRemoveTag,
      computedData,
    };
  },
});
</script>

<style scoped lang="scss">
.tag_checked {
  height: 100%;
}
.tag_title {
  height: 36px;
  margin-bottom: 14px;
  p {
    color: #c1c1c1;
    span {
      color: #000000;
    }
  }
  span.del {
    cursor: pointer;
    color: var(--wl-primary-color);
  }
}
.tag_content {
  height: 0;
  overflow: auto;
  .tag_item {
    position: relative;
    display: inline-block;
    background: rgba(26, 58, 143, 0.08);
    border-radius: 20px;
    color: var(--wl-primary-color-dark);
    line-height: 26px;
    padding: 0 30px 0 10px;
    margin-bottom: 12px;
    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      cursor: pointer;
      color: var(--wl-text-color-placeholder);
      margin-left: 8px;
    }
    &.is_self {
      background: #f4f9fd;
      color: #000000;
    }
  }
}
</style>
