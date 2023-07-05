<template>
  <div>
    <div class="card_title">
      <p class="main_title">客户标签</p>
      <p class="sub_title">
        客户加你为好友后，你可以在客户画像中看到下方标签
        <el-popover trigger="hover" width="initial" v-if="showExample">
          <img
            class="example_label"
            :src="formatCosUrl('/worktable-h5/icon/example_label.png')"
            alt=""
          />
          <template v-slot:reference>
            <img
              class="active_icon"
              :src="formatCosUrl('/worktable-h5/icon/question_icon.png')"
              alt=""
            />
          </template>
        </el-popover>
      </p>
    </div>
    <div class="flex-row flex-wrap">
      <div
        class="flex-row main-center cross-center staff-btn tag_btn"
        @click="state.tagDialogVisible = true"
      >
        <el-icon class="cross-img">
          <wl-svg type="add" />
        </el-icon>
        <span>标签</span>
      </div>
      <div
        class="flex-row cross-center checked_user checked_tag"
        v-for="item in state.tagList"
        :key="item.tagId"
        :class="{ crop_tag: item.type == 1 }"
      >
        <!-- <span>{{ item.computed_name || item.tag_name }}</span> -->
        <span>{{
          (item.type === 1 ? item.groupName + ":" : "") + item.tagName
        }}</span>
        <el-icon
          @click="onHandleDelTag(item)"
          class="el-icon-error"
          style="color: #b9b9b9; cursor: pointer"
          ><circle-close-filled
        /></el-icon>
      </div>
    </div>
    <div v-if="tagRecommendList.length" class="recommonend_tags flex-row">
      <span>推荐标签</span>
      <ul class="flex-row cross-center flex1 flex-wrap">
        <li
          v-for="item in tagRecommendList"
          :key="item.tagId"
          @click.stop="checkRecommendTag(item)"
        >
          {{ item.tagName }}
        </li>
      </ul>
    </div>

    <!-- <TagDialog
      v-model:value="tagDialogVisible"
      :checked_tags="tagList"
      @handleChosed="onhandleChosedTag"
    /> -->
    <VTagDialog
      v-model:value="state.tagDialogVisible"
      :checked-tag="state.tagList"
      :can-add="true"
      @onTagCheck="onhandleChosedTag"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import VTagDialog from "@/components/WTag/VTagDialog/index.vue";
import { CircleCloseFilled } from "@element-plus/icons-vue";

const props = withDefaults(
  defineProps<{
    tagGroups: any;
    tagRecommendList: any;
    showExample: boolean;
  }>(),
  {
    tagGroups: [],
    tagRecommendList: [],
    showExample: false,
  }
);

const emit = defineEmits<{
  (e: "onTabChange", val: any): void;
}>();
const state = reactive<{
  tagDialogVisible: boolean;
  tagList: any;
}>({
  tagList: [],
  tagDialogVisible: false,
});
//删除标签
const onHandleDelTag = (tag: any) => {
  state.tagList = state.tagList.filter((res: any) => res.tagId != tag.tagId);
  emit("onTabChange", state.tagList);
};
const onhandleChosedTag = (val: any) => {
  state.tagList = val;
  emit("onTabChange", state.tagList);
  state.tagDialogVisible = false;
};
const formatCosUrl = (url: any) => {
  return `https://wlmvp-cos.weiling.cn${url}`;
};
const checkRecommendTag = (item: any) => {
  if (state.tagList.find((res: any) => res.tagId == item.tagId)) return;
  state.tagList.push(item);
  emit("onTabChange", state.tagList);
};

watch(
  () => props.tagGroups,
  (res) => {
    state.tagList = [...res];
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.staff-btn {
  width: 72px;
  height: 30px;
  margin-bottom: 10px;
  background: #f4f9fd;
  border-radius: 6px;
  box-sizing: border-box;
  border: 1px dashed #dce1e5;
  cursor: pointer;
  &.tag_btn {
    border-radius: 100px;
    margin-right: 12px;
  }
  span {
    margin-left: 6px;
    color: #494b4d;
  }
  img {
    width: 14px;
    height: auto;
  }
}
.checked_user {
  height: 30px;
  padding: 0 6px;
  background: #f4f9fd;
  border-radius: 4px;
  color: #000000;
  margin-bottom: 10px;
  margin-right: 12px;
  &.checked_tag {
    border-radius: 100px;
    background: #f4f5f6;
    color: #4c4c4c;
    &.crop_tag {
      color: #193591;
      background: #e9eff7;
    }
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
.active_icon {
  width: 16px;
  height: auto;
  margin-left: 6px;
  vertical-align: text-bottom;
}
.example_label {
  width: 274px;
  height: auto;
}
.recommonend_tags {
  border-top: 1px solid #ebebeb;
  padding-top: 14px;
  // margin-top: 12px;
  span {
    color: var(--wl-text-color-secondary-2);
    margin-right: 22px;
    line-height: 25px;
  }
  ul {
    li {
      cursor: pointer;
      background: #ffffff;
      border: 1px solid #eeeeee;
      border-radius: 12px;
      padding: 2px 8px;
      color: var(--wl-text-color-secondary-2);
      margin-right: 10px;
      margin-bottom: 4px;
    }
  }
}

.cross-img {
  font-size: 14px;
}
</style>
