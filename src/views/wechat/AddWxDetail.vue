<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import useWechatForm from "@/hooks/wechat/useWechatForm";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { downloadFile } from "@/utils/utils";
import { useUserStore } from "@/stores";

const route: any = useRoute();
const { userInfo }: any = useUserStore();
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
  onResizeColumn,
} = useWechatForm();
const state = reactive<{
  clientHeight: any;
}>({
  clientHeight: "",
});

// 数据导出
const onOutput = () => {
  let pData = {
    sort_param: {
      page_count: page.value,
      limit: limit.value,
    },
    rule_id: route.query.id,
    keyword: model.value.keyword,
    start: (model.value.create_time && model.value.create_time[0]) || "",
    end: (model.value.create_time && model.value.create_time[1]) || "",
    stages: model.value.stages || [], //商机阶段
    user_ids: model.value.user_ids,
  };
  if (total.value > 20000) {
    ElMessageBox.confirm(
      "不可以一次性导出超过两万条的数据哦～<br />重新筛选一下时间范围吧",
      "",
      {
        distinguishCancelAndClose: true,
        confirmButtonText: "我知道了",
        customClass: "message-box",
        buttonSize: "large",
        showClose: false,
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
      }
    )
      .then((res: any) => {
        console.log(res, "res");
      })
      .catch((action: any) => {
        console.log(action, "action");
      });
  } else {
    downloadFile(
      `${import.meta.env.VITE_APP_API}/jkt/customer/detail_export?corp_id=${
        userInfo?.corp?.corpId
      }`,
      pData
    );
  }
};

const refTable: any = ref(null);
onMounted(() => {
  state.clientHeight = refTable.value.clientHeight;
  init();
});
</script>

<template>
  <div class="card wechat-list">
    <div class="table-header">
      <div class="flex-row">
        <Navbar
          text="方案列表"
          path="/wechat"
          style="top: -10px; margin-right: 24px"
        />
        <WlForm
          ref="miniAppForm"
          :inline="true"
          label-position="top"
          :list="formList"
          :model="model"
          :field-space="10"
        ></WlForm>
      </div>

      <!-- <el-tooltip class="item" effect="dark" content="导出" placement="top">
        <ExportButton
            class="m-l-l"
            @onClick="onOutput"
            :isBlue="false"
        ></ExportButton>
      </el-tooltip> -->
    </div>
    <div class="table-wrap" ref="refTable">
      <SurelyTable
        :loading="loading"
        :height="state.clientHeight - 55"
        row-key="id"
        :sorter="true"
        :columns="columns"
        :data="data"
        @change="handleSortChange"
        @resizeColumn="onResizeColumn"
      >
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
</style>
