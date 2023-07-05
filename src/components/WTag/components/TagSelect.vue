<!-- jajaj  -->
<template>
  <div @click.stop class="tag_select_wrap flex-column">
    <div class="flex-row flex1" style="height: 0">
      <div class="tag_list_wrap flex-column flex1">
        <div class="search_input">
          <el-input
            class="m-b-s flex0"
            :placeholder="canAdd ? '搜索或创建标签' : '搜索标签'"
            clearable
            :prefix-icon="Search"
            v-model.trim="keyword"
            @input="onSearch"
          >
          </el-input>
          <template v-if="createVisibel">
            <RecommendAdd :name="keyword" @onCreate="onCreateTag" />
          </template>
        </div>
        <div class="tag_content flex1" ref="contentRef" id="content">
          <template v-if="tag_list && tag_list.length">
            <TagItem
              v-for="item in tag_list"
              :key="item.groupId"
              :data="item"
              :visible="visible"
              :checked-data="computedCheckedTags"
              class="tag_list_item"
              :expend="new_tag_data.groupId == item.groupId"
              @tagClick="ontTagClicked"
              @groupNameClick="groupNameClick"
            />
          </template>
          <NoResult v-if="!tag_list.length && keyword" class="tag_content" />
        </div>
      </div>
      <div class="tag_checked_wrap flex0">
        <TagChecked
          :multiple-limit="multipleLimit"
          :data="computedCheckedTags"
          @onRemoveTag="onRemoveTag"
        />
      </div>
    </div>
    <footer class="flex-center">
      <el-button class="btn" @click.stop="$emit('onClose')">取 消</el-button>
      <el-button type="primary" class="m-l-l btn" @click.stop="onSub"
        >确 定</el-button
      >
    </footer>
    <TagGroupDialog
      v-model:value="choose_group_visible"
      :list="group_list"
      @onClose="choose_group_visible = false"
      @onConfirm="onConfirm"
    />
  </div>
</template>

<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { formatCosUrl } from "@/utils/utils";
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
  computed,
  nextTick,
} from "vue";
// import { useStore } from "vuex";
import TagItem from "./TagItem.vue";
import TagChecked from "./TagChecked.vue";
import RecommendAdd from "./RecommendAdd.vue";
import TagGroupDialog from "@/components/WTag/TagGroupDialog/index.vue";
import NoResult from "./NoResult.vue";
import { useUserStore } from "@/stores";
import { getRecentlyTag, getTagList, addUserTag, addCorpTag } from "@/api";
import { ClickOutside as vClickOutside } from "element-plus";
import { ElMessage } from "element-plus";

export default defineComponent({
  components: { TagItem, TagChecked, RecommendAdd, TagGroupDialog, NoResult },
  props: {
    checkedTag: {
      type: Array,
      default() {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    canAdd: {
      // 是否允许新建标签
      type: Boolean,
      default: false,
    },
    lockSelf: {
      // 仅看自己创建的
      type: Boolean,
      default: false,
    },
    // 限制最大的选择数量
    multipleLimit: {
      type: Number,
      default: 0,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    const store = useUserStore();
    const userInfo: any = store.userInfo;
    const is_administrator = store.getter_is_administrator;
    const state = reactive<{
      keyword: string;
      recently_tag_list: any;
      new_tag_flag: boolean;
      user_tag_list: any;
      group_tag_list: any;
      tag_list: any;
      group_list: any;
      checked_tag_list: any;
      choose_group_visible: boolean;
      new_tag_data: any;
      seleted_tag_list: any;
      contentRef: any;
      originCheckedList: any;
    }>({
      keyword: "",
      recently_tag_list: [],
      new_tag_flag: false,
      user_tag_list: [],
      group_tag_list: [],
      tag_list: [],
      group_list: [],
      checked_tag_list: [],
      choose_group_visible: false,
      new_tag_data: {},
      seleted_tag_list: [],
      contentRef: null,
      originCheckedList: [],
    });
    // 指定某一组标签滚动到顶部
    const scrollToTop = (group_id: any) => {
      let index = state.tag_list.findIndex(
        (res: any) => res.groupId == group_id
      );
      nextTick(() => {
        let childNodes = [...state.contentRef.childNodes];
        let innerChild = childNodes.filter((res) => {
          return res.className?.includes("tag_list_item");
        });
        let height = 0;
        for (let i = 0; i < index; i++) {
          height += innerChild[i].getBoundingClientRect().height;
        }
        if (height) state.contentRef.scrollTo(0, height);
      });
    };
    const handleData = (dataList: any, recently_list: any) => {
      let recently = recently_list.reduce((pre: any, cur: any) => {
        const { tag_info = [] } = cur;
        const list = tag_info.map((ele: any) => {
          return {
            ...ele,
            ...cur,
          };
        });
        return [...pre, ...list];
      }, []);
      recently = [{ tagInfo: recently, groupName: "最近常用" }];
      let user_list = [],
        group_list = [];
      for (let i = 0; i < dataList.length; i++) {
        const {
          type = 1,
          tagInfo = [],
          groupId = "",
          groupName = "",
        } = dataList[i];
        const tag_group_info = tagInfo.map((ele: any) => {
          return {
            ...ele,
            groupId,
            groupName,
          };
        });
        if (type === 3) {
          user_list.push({
            ...dataList[i],
            tagInfo: tag_group_info,
          });
        } else {
          group_list.push({
            ...dataList[i],
            tagInfo: tag_group_info,
          });
        }
      }
      state.user_tag_list = user_list;
      state.group_tag_list = group_list;
      state.tag_list = [...recently, ...group_list, ...user_list];
      state.group_list = [...group_list, ...user_list];

      // 当没有列表的时候，展示缺省页面
      // if (!this.searchValue && this.tag_list.length === 0) {
      //   this.no_group_visible = true;
      // }
    };
    const onGetData = async () => {
      const recently_list_data = await getRecentlyTag({});
      let user_list_data = await getTagList({ keyword: "" });

      let { dataList: recently = [] } = recently_list_data.data;
      let { dataList = [] } = user_list_data.data;

      state.recently_tag_list = recently;

      handleData(dataList, recently);
      state.new_tag_flag = false;
      return user_list_data;
    };
    const handleNewTagData = async (data: any) => {
      const { tagInfo = [], groupId = "", groupName } = data;
      const [tag = {}] = tagInfo;
      const { tagId } = tag;
      state.checked_tag_list.push({
        ...tag,
        groupName,
        groupId,
      });
      ElMessage.success("创建成功");
      await onGetData();
      state.choose_group_visible = false;
      state.keyword = "";
      scrollToTop(groupId);
      state.new_tag_data = {
        ...tag,
        groupId,
        tagId,
      };
      state.new_tag_flag = true;
    };
    const onCreateUserTag = () => {
      const [user_tag_group = {}] = state.user_tag_list;
      const { groupId = "" } = user_tag_group;
      addUserTag({ tag_name: state.keyword, group_id: groupId }).then(
        (res: any) => {
          const { data = {} } = res.data;
          handleNewTagData(data);
        }
      );
    };
    const Methods = {
      ontTagClicked(item: any) {
        let index = state.checked_tag_list.findIndex(
          (res: any) => res.tagId == item.tagId
        );
        if (index >= 0) {
          state.checked_tag_list.splice(index, 1);
        } else {
          if (
            props.multipleLimit &&
            state.checked_tag_list.length >= props.multipleLimit
          ) {
            return;
          }
          state.checked_tag_list.push(item);
        }
      },
      groupNameClick(res: any) {
        const { type, list } = res;
        if (type == "cancel") {
          state.checked_tag_list = state.checked_tag_list.filter(
            (val: any) => !list.find((item: any) => item.tagId == val.tagId)
          );
        } else {
          let newTags = list.filter(
            (res: any) =>
              !state.checked_tag_list.find((val: any) => val.tagId == res.tagId)
          );
          let checkList = [...state.checked_tag_list, ...newTags];
          if (props.multipleLimit && checkList.length > props.multipleLimit) {
            return;
          }
          state.checked_tag_list = checkList;
        }
      },
      onRemoveTag(item: any) {
        if (item) {
          let index = state.checked_tag_list.findIndex(
            (res: any) => res.tagId == item.tagId
          );
          state.checked_tag_list.splice(index, 1);
        } else {
          state.checked_tag_list = [];
        }
      },
      async onSearch(val: any) {
        let keyword = val.trim();
        if (!keyword) {
          await onGetData();
          nextTick(() => {
            state.contentRef.scrollTop = 0;
          });
        } else {
          const result = await getTagList({
            keyword,
          });
          const { dataList = [] } = result.data;
          let user_list = [],
            group_list = [];
          for (let i = 0; i < dataList.length; i++) {
            const {
              type = 1,
              tagInfo = [],
              groupId = "",
              groupName = "",
            } = dataList[i];
            const tag_group_info = tagInfo.map((ele: any) => {
              return {
                ...ele,
                groupId,
                groupName,
              };
            });
            if (type === 3) {
              user_list.push({
                ...dataList[i],
                tagInfo: tag_group_info,
              });
            } else {
              group_list.push({
                ...dataList[i],
                tagInfo: tag_group_info,
              });
            }
          }
          state.tag_list = [...group_list, ...user_list];
          nextTick(() => {
            state.contentRef.scrollTop = 0;
          });
        }
      },
      onConfirm(val: any) {
        const { groupId = "", groupName = "", type = 1 } = val;
        if (type === 1) {
          addCorpTag({
            tag_name: state.keyword,
            groupId,
            groupName,
          }).then((res: any) => {
            const { data = {} } = res.data;
            handleNewTagData(data);
          });
        } else {
          addUserTag({ tag_name: state.keyword, groupId }).then((res: any) => {
            const { data = {} } = res.data;
            handleNewTagData(data);
          });
        }
      },
      onSub() {
        // const info = props.lockSelf
        //   ? [...state.originCheckedList, ...state.checked_tag_list]
        //   : [...state.checked_tag_list];
        const info = [...state.checked_tag_list];
        state.originCheckedList = [...state.checked_tag_list];
        emit("onTagCheck", info);
      },
      async onCreateTag() {
        if (state.keyword.length > 20) {
          ElMessage({
            message: "创建的标签不能超过20个字",
            type: "error",
            duration: 3000,
          });
          return;
        }
        if (store.getter_is_administrator) {
          state.choose_group_visible = true;
        } else {
          onCreateUserTag();
        }
      },
    };
    const createVisibel = computed(() => {
      if (!props.canAdd) return false;
      if (state.keyword) {
        const tags = state.tag_list.reduce((pre: any, cur: any) => {
          const { tagInfo = [] } = cur;
          return [...pre, ...tagInfo];
        }, []);
        const index = tags.findIndex(
          (ele: any) => ele.tagName === state.keyword
        );
        return index === -1 ? true : false;
      } else {
        return false;
      }
    });
    const computedCheckedTags = computed(() => {
      return state.checked_tag_list.map((res: any) => {
        return {
          ...res,
          disabled:
            !is_administrator &&
            !res.is_leader &&
            res.tag_user_id !== userInfo.id,
        };
      });
    });
    // 清除选中的标签
    const clearCheckedTag = () => {
      state.originCheckedList = [];
      state.checked_tag_list = [];
    };
    watch(
      () => props.checkedTag,
      (val) => {
        state.originCheckedList = [...val];
        state.checked_tag_list = [...val];
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      () => props.visible,
      (bol) => {
        if (bol) {
          state.checked_tag_list = [...state.originCheckedList];
        }
      }
    );
    onGetData();
    return {
      ...toRefs(state),
      ...Methods,
      Search,
      createVisibel,
      formatCosUrl,
      computedCheckedTags,
      clearCheckedTag,
    };
  },
});
</script>

<style scoped lang="scss">
.tag_select_wrap {
  height: 100%;
}
footer {
  padding-top: 15px;
  border-top: 0.5px solid #eeeeee;
}
:deep(.el-button.el-button) {
  width: 108px;
  height: 40px;
  font-size: 18px;
  border-radius: 8px;
}
.tag_list_wrap {
  height: 100%;
  .search_input {
    padding-right: 24px;
  }
  .tag_content {
    overflow: auto;
    padding-right: 24px;
    .tag_list_item {
      padding: 10px 0 14px;
      border-bottom: 1px solid #eeeeee;
      &:last-child {
        border: none;
      }
    }
  }
}
.tag_checked_wrap {
  width: 220px;
  padding: 0 0 10px 20px;
  border-left: 1px solid #e4e9ed;
}
</style>
