<template>
  <div style="height: 100%" class="flex-column">
    <div class="search_input">
      <el-input
        class="m-b-s flex0"
        placeholder="搜索或创建分组"
        clearable
        :prefix-icon="Search"
        v-model="searchValue"
      >
      </el-input>
      <template v-if="create_visible">
        <RecommendAdd
          label="是否创建分组"
          :name="searchValue"
          @onCreate="onCreateGroup"
        />
      </template>
    </div>
    <ul ref="contentRef" class="flex1">
      <el-radio-group
        v-model="checkRadio"
        v-if="group_list.length"
        @change="onTagChecked"
      >
        <li v-for="item in group_list" :key="item.group_id">
          <el-radio :label="item.group_name">
            <div class="flex-row cross-center group_name">
              <el-icon>
                <wl-svg type="folderFill" />
              </el-icon>
              {{ item.group_name }}
            </div>
          </el-radio>
        </li>
      </el-radio-group>
      <NoResult v-if="no_result" />
    </ul>
    <footer class="flex-center">
      <el-button class="btn" @click.stop="$emit('onClose')"
        >返回上一级</el-button
      >
      <el-button
        type="primary"
        :disabled="!selectedGroup.group_name"
        class="m-l-l btn"
        @click.stop="onSub"
        >确 定</el-button
      >
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, getCurrentInstance, nextTick } from "vue";
import RecommendAdd from "../components/RecommendAdd.vue";
import NoResult from "../components/NoResult.vue";

import { Search } from "@element-plus/icons-vue";
// import { folderO } from "@/utils/icons";

const emit = defineEmits<{
  (e: "onTagChecked"): void;
}>();
const { proxy } = getCurrentInstance();
const checkRadio = ref("");

// 采用ts专有声明，有默认值
interface Props {
  list?: any[];
}
const props = withDefaults(defineProps<Props>(), {
  list: () => [],
});

let groupData = ref([]);
let searchValue = ref("");
let selectedGroup = ref({});
const group_list = computed(() => {
  return searchValue.value
    ? groupData.value.filter((ele) =>
        ele.group_name.includes(searchValue.value)
      )
    : groupData.value;
});
const no_result = computed(() => {
  return group_list.value.length === 0 && searchValue.value;
});
const create_visible = computed(() => {
  if (searchValue.value) {
    const index = group_list.value.findIndex(
      (ele) => ele.group_name === searchValue.value
    );
    return index === -1 ? true : false;
  } else {
    return false;
  }
});

let contentRef = ref(null);
const onCreateGroup = () => {
  const isExit =
    groupData.value.findIndex((ele) => ele.group_name === searchValue.value) !==
    -1;
  if (isExit) {
    proxy.$message({
      message: "分组名已存在",
      type: "error",
      duration: 3000,
    });
    return;
  } else {
    const newTag = {
      group_name: searchValue.value,
      group_id: null,
    };
    const index = groupData.value.findIndex((ele) => ele.type === 3);
    groupData.value.splice(index, 0, newTag);
    selectedGroup.value = newTag;
    checkRadio.value = newTag.group_name;
    searchValue.value = "";
    nextTick(() => {
      const height = contentRef.value.scrollHeight;
      contentRef.value.scrollTo(0, height);
    });
    // emit("onTagChecked", selectedGroup.value);
  }
};
const onTagChecked = (val) => {
  let tag = group_list.value.find((res) => res.group_name == val);
  const { group_name = "" } = tag;
  if (group_name) {
    selectedGroup.value = tag;
    // emit("onTagChecked", tag);
  }
};
const onSub = () => {
  emit("onTagChecked", selectedGroup.value);
};
watch(
  () => props.list,
  (val) => {
    checkRadio.value = "";
    groupData.value = val;
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
ul {
  overflow: auto;
  li {
    cursor: pointer;
    width: 100%;
  }
}
:deep(.el-radio) {
  width: 100%;
}
.group_name {
  .el-icon {
    font-size: 28px;
    color: #e3e3e3;
    margin-right: 6px;
  }
  color: var(--wl-text-color-title-1);
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
</style>
