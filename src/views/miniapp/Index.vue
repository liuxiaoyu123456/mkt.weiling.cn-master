<template>
  <div class="min-app">
    <div class="top-xiaowei flex-row flex-center">
      <img
        src="https://wlmvp-cos.weiling.cn/worktable-erp/bigPic/home_xiaowei.png?v=000"
        alt=""
      />
      <div class="xiaowei-msg">
        <p>说明：</p>
        <p>1. 试用期结束后，如需使用微信方案必须创建小程序</p>
        <p>2. 至少需要3个可使用的小程序</p>
        <p>3. 小程序因用户投诉等原因导致不能使用，集客通将第一时间自动切换</p>
      </div>
    </div>
    <div class="bottom-table">
      <div class="filter-items flex-row justify-between">
        <div class="flex-row items-center">
          <div class="table-title">小程序列表</div>
          <WlForm inline :list="formList" :model="model"></WlForm>
        </div>
        <el-button type="primary" @click="toAdd"
          ><el-icon><wl-svg type="add" /></el-icon>新增</el-button
        >
      </div>
      <SurelyTable
        :loading="loading"
        row-key="id"
        :columns="columns"
        :data="data"
        @change="handleSortChange"
        :height="tableHeight"
      >
        <!-- 插槽 -->
        <template #miniAppName="row">
          <div class="flex-row items-center mini-app-name">
            <img
              class="flex-none"
              v-if="row?.headImg"
              :src="row?.headImg"
              alt=""
            />
            <el-icon class="flex-none" v-if="row?.tenantId == '1'"
              ><wl-svg type="applet"
            /></el-icon>
            <div class="cell-name">{{ row?.appName || "" }}</div>
          </div>
        </template>
        <!-- 包含row参数的插槽 -->
        <template #status="row">
          <div class="flex-row items-center">
            <div class="status-type" :style="statusType(row?.status)">
              {{ statusFilter(row?.status) }}
            </div>
          </div>
        </template>
        <!-- 关联公众号 -->
        <template #bindMp="row">
          <div v-if="row?.bindMp" style="color: var(--wl-text-color-primary-2)">
            {{ row?.bindMp?.nickName ? row?.bindMp?.nickName : "--" }}
          </div>
        </template>
      </SurelyTable>
      <!-- 分页组件 -->
      <div class="bottom flex-center">
        <Pagination :total="total" v-model:limit="limit" v-model:page="page" />
      </div>
    </div>
    <el-dialog
      v-if="accountStore.accountState.status == 1"
      v-model="dialogMiniapp"
      width="600px"
      :show-close="false"
      align-center
      append-to-body
      class="miniapp-dialog"
      :close-on-click-modal="false"
    >
      <div class="flex-col">
        <template v-if="miniAppNum == 0">
          <div class="warnning-title">已经没有可以使用的小程序！</div>
          <div class="warnning-msg">为避免影响后续的加微效果请立即创建</div>
        </template>
        <div v-if="miniAppNum != 0" class="warnning-msg-num">
          您账户的备用小程序还剩余
          <span style="color: red">{{ miniAppNum }}</span>
          个，没有可使用的小程序后，客户将无法添加员工好友，您可进入系統创建新的小程序。如遇问题，可随时咨询小微
        </div>
        <el-button @click="toAddPage" class="submit" type="primary"
          >立即创建</el-button
        >
        <el-button
          @click="dialogMiniapp = false"
          class="cancal"
          type="info"
          link
          >稍后再说</el-button
        >
        <img
          class="err-img"
          :src="getCosImageUrl('miniapp-error.png')"
          alt=""
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, h, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import { type ApiFnType, useFilterTable } from "@/hooks";
import { getMiniProgramList, payGetJktBalance } from "@/api";
import { useHelpCenter, useMiniappStore, useAccountState } from "@/stores";
import {
  statusFilter,
  formList,
  responseDataList,
  textColor,
  backGroupColor,
} from "./dataHooks";
const { proxy } = getCurrentInstance() as any;
const $confirm = proxy.$confirm;
const accountStore = useAccountState();
const { updateAccountState } = accountStore;
updateAccountState();
const dialogMiniapp = ref(false);
const router = useRouter();
const stores = useMiniappStore();
const store = useHelpCenter();
const toAddPage = () => {
  router.push({
    name: "MinappAdd",
  });
  dialogMiniapp.value = false;
};
const tableHeight = ref("calc(100vh - 475px)");
// 列表数据请求
const getListData: ApiFnType = async ({
  page: pageCount,
  limit: l,
  model: m,
  sort: sorter,
}) => {
  const params = {
    pageCount,
    limit: l,
    keyword: m?.keyword || "",
    statuses: m?.statuses || [],
    bindMpIds: m?.bind_mp_ids || [],
    sort: sorter || [],
  };
  let res = await getMiniProgramList(params);
  let list =
    Object.keys(responseDataList(res.data?.dataList)[0]).length == 0
      ? []
      : responseDataList(res.data?.dataList);
  if (+res.data?.count > 10) {
    tableHeight.value = "calc(100vh - 250px)";
  }
  return [list, +res.data?.count];
};
const { model, loading, data, columns, handleSortChange, page, limit, total } =
  useFilterTable(getListData, {
    getColumns: (_: any) => [
      {
        title: "小程序名称",
        slot: "miniAppName",
        // prop: "miniAppName"
      },
      {
        title: "状态",
        slot: "status",
        prop: "status",
      },
      {
        title: "小程序原始ID",
        prop: "originId",
      },
      {
        title: "关联公众号",
        slot: "bindMp",
        prop: "bindMp",
      },
      {
        title: "创建人",
        type: "userGroup",
        prop: "createUser",
      },
      {
        title: "创建时间",
        type: "date",
        prop: "createTime",
        sortable: true,
      },
    ],
  });
// 页面的跳转
const toAdd = () => {
  router.push({
    name: "MinappAdd",
  });
};
const statusType = (val: number) => {
  return `color: ${textColor[val]}; background-color: ${backGroupColor[val]}`;
};
const configData = {
  class: "pointer",
  style: { color: "var(--wl-primary-color-dark)" },
  innerHTML: "联系小微",
  onClick: () => {
    store.helpCenterState.showHelp = true;
    document.querySelector(".el-overlay.is-message-box").style.display = "none";
  },
};
const miniAppNum = ref(4); // 剩余待使用小程序
const init = async () => {
  let res: any = await payGetJktBalance({});
  let appNum = res.data.miniAppNum - 1;
  switch (appNum) {
    case 2:
      miniAppNum.value = 2;
      break;
    case 1:
      miniAppNum.value = 1;
      break;
    case 0:
      miniAppNum.value = 0;
      break;
    case -1:
      miniAppNum.value = 0;
      break;
  }
  if (
    !stores.getters_is_dialog &&
    miniAppNum.value <= 2 &&
    !sessionStorage.getItem("miniAppDialog")
  ) {
    dialogMiniapp.value = true;
    sessionStorage.setItem("miniAppDialog", "true");
  }
};
onMounted(() => {
  init();
  if (stores.getters_is_dialog) {
    $confirm("", "配置完成后：", {
      type: "warning",
      // size: size,
      message: h("div", [
        h("span", "1.如需修改信息，请"),
        h("span", configData),
        h("p", "2.卫瓴集客通将自动进行小程序审核、发布和使用"),
      ]),
    })
      .then((data: any) => {
        // console.log("data", data)
      })
      .catch((e: any) => {
        console.log("catch", e);
      });
    stores.setDialog(false);
    stores.$reset();
  }
});
</script>
<style scoped lang="scss">
.min-app .top-xiaowei {
  width: 100%;
  height: 200px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
}
.min-app .top-xiaowei img {
  width: 157px;
  height: 144px;
  margin-top: 60px;
}
.min-app .top-xiaowei .xiaowei-msg {
  /* height: 120px; */
  width: 754px;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--wl-body-color);
  margin: 30px 0 0 50px;
}
.min-app .top-xiaowei .xiaowei-msg p:first-child {
  line-height: 30px;
}
.min-app .top-xiaowei .xiaowei-msg p {
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: var(--wl-text-color-title-2);
}
.min-app .bottom-table {
  min-height: calc(100vh - 322px);
  background-color: #fff;
  border-radius: 12px;
  /* box-sizing: border-box; */
  margin-top: 16px;
  overflow: hidden;
}
.warnning-title {
  color: var(--wl-error-color);
  font-size: 20px;
  font-weight: 500;
}
.warnning-msg {
  color: var(--wl-text-color-primary-2);
  font-size: 20px;
  font-weight: 400;
  margin-top: 25px;
}
.warnning-msg-num {
  color: var(--wl-text-color-primary-2);
  font-size: 18px;
  font-weight: 400;
}
.submit {
  margin-top: 45px;
  height: 56px;
  border-radius: 16px;
  font-size: 20px;
  box-shadow: 6px 6px 24px rgba(0, 0, 0, 0.06);
}
.cancal {
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  color: #b1b1b1;
}
.err-img {
  position: absolute;
  width: 181px;
  height: 160px;
  top: 0;
  right: 33px;
}
.mini-app-name .el-icon {
  color: var(--wl-primary-color);
  font-size: 24px;
}
.mini-app-name img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
}
.mini-app-name .cell-name {
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  margin-left: 5px;
  color: var(--wl-primary-color-dark);
  @extend %ov2;
}
.status-type {
  padding: 3px 6px;
  border-radius: 2px;
}
.filter-items {
  padding: 25px;
}
.filter-items .table-title {
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}
.filter-items .el-button {
  width: 91px;
  height: 34px;
}
.filter-items .el-button .el-icon {
  font-size: 20px;
  margin-left: -8px;
}
.bottom {
  height: 60px;
}
:deep(.el-form-item) {
  margin: 0;
}
.status-name {
  color: aqua;
}
</style>
<style>
.miniapp-dialog {
  border-radius: 24px;
  height: 292px;
  box-sizing: border-box;
}
.el-dialog.miniapp-dialog .el-dialog__header {
  display: none;
}
.el-dialog.miniapp-dialog .el-dialog__body {
  width: 516px;
  padding: 48px 42px 0;
  position: relative;
}
</style>
