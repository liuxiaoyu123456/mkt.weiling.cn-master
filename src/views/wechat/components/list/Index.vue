<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useWechat from "@/hooks/wechat/useWechat";

// const route: any = useRoute();
const router: any = useRouter();

const state = reactive<{
  clientHeight: any;
  tableColumns: any;
}>({
  clientHeight: "",
  tableColumns: [],
});
const {
  init,
  formList,
  loading,
  model,
  data,
  columns,
  handleSortChange,
  page,
  limit,
  total,
} = useWechat();

const handleAdd = () => {
  router.push({
    name: "WeChatEdit",
    query: {
      type: "add",
    },
  });
};

//编辑页面
const handleEdit = (val: any) => {
  router.push({
    name: "WeChatEdit",
    query: {
      id: val,
      type: "edit",
    },
  });
};

const handleClick = (val: any) => {
  // console.log(1, val);
  if (val.prop === "buttonName") {
    router.push({
      name: "WechatDetail",
      query: {
        id: val.row.id,
      },
    });
  } else if (val.prop === "customerCount") {
    router.push({
      name: "FormDetail",
      query: {
        id: val.row.id,
        create_time: val.row.createTime,
      },
    });
  }
};

/**展示的？的内容 */
const toolTipContent = computed(() => {
  return "加微率=扫码加微数/按钮点击数";
  // state.isInWhiteList

  // : "加微率=扫码加微数/按钮点击数";
});

const refTable: any = ref(null);
onMounted(() => {
  state.clientHeight = refTable.value.clientHeight;
  init();
});
</script>

<!-- 微信方案 -->
<template>
  <div class="card wechat-list">
    <div class="table-header">
      <WlForm
        ref="miniAppForm"
        :inline="true"
        label-position="top"
        :list="formList"
        :model="model"
        :field-space="10"
      ></WlForm>
      <el-button type="primary" class="add-btn" @click="handleAdd">
        <el-icon class="icon">
          <wl-svg type="add"></wl-svg>
        </el-icon>
        新建
      </el-button>
    </div>
    <div class="table-wrap" ref="refTable">
      <SurelyTable
        :loading="loading"
        row-key="id"
        height="calc(100vh - 264px)"
        :sorter="true"
        :columns="columns"
        :data="data"
        @change="handleSortChange"
        @resizeColumn="onResizeColumn"
        @cellClick="handleClick"
      >
        <template #customerRate>
          <div class="span-relative">
            <span>加微率</span>
            <el-tooltip
              popper-class="item-absolute"
              effect="dark"
              placement="top"
            >
              <template v-slot:content>
                <div v-html="toolTipContent"></div>
              </template>
              <el-icon class="comment">
                <wl-svg type="explain" />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #operation="row">
          <div class="flex-row items-center">
            <div
              class="flex-center pointer"
              @click.stop="handleEdit(row.id)"
              v-if="row.wxStatus != 0 && row.wxStatus != 3"
            >
              <!-- 引入elementui中的小图标 -->
              <el-icon class="edit-icon" style="color: var(--wl-primary-color)">
                <wl-svg type="edit" />
              </el-icon>
              <span style="color: var(--wl-primary-color); font-size: 12px"
                >编辑</span
              >
            </div>
            <template v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="方案更新中..."
                placement="top"
              >
                <div class="flex-center cursor-not-allowed">
                  <el-icon class="edit-icon" style="color: #ccc">
                    <wl-svg type="edit" />
                  </el-icon>
                  <span style="color: #ccc; font-size: 12px">编辑</span>
                </div>
              </el-tooltip>
            </template>
          </div>
        </template>
      </SurelyTable>
    </div>
    <div class="bottom">
      <Pagination :total="total" v-model:limit="limit" v-model:page="page" />
    </div>
  </div>
</template>

<style lang="scss" scope>
.wechat-list {
  height: calc(100vh - 104px);
  display: flex;
  flex-direction: column;

  .table-header {
    display: flex;
    justify-content: space-between;

    .add-btn {
      .icon {
        font-size: 20px;
        margin-right: 4px;
      }
    }
  }

  .table-wrap {
    flex: 1;
    min-height: 0;

    .comment {
      vertical-align: middle;
      font-size: 14px;
      margin-left: 4px;
      margin-bottom: 4px;
    }
  }

  .bottom {
    display: flex;
    justify-content: center;
  }
}

.edit-icon {
  font-size: 16px;
  cursor: pointer;
  margin-right: 4px;
}
.cursor-not-allowed {
  cursor: not-allowed !important;
}
</style>
