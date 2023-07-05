<template>
  <div class="card charge-detail flex-col" v-loading="loading">
    <div class="flex-row items-center p-b-6">
      <el-link class="return-btn" :underline="false" @click="$router.go(-1)">
        <el-icon><wl-svg type="arrowTipLeft" /></el-icon>返回</el-link
      >
      <div class="flex-1 flex-row item-center justify-between">
        <WlForm
          :inline="true"
          :list="formList"
          :model="model"
          :field-space="[16, 0]"
        ></WlForm>
        <el-button
          @click="helpCenterStore.helpCenterState.showInvoiceHelper = true"
          >申请开票</el-button
        >
        <!-- <el-button class="export"
          ><el-icon><wl-svg type="download" /></el-icon
        ></el-button> -->
      </div>
    </div>
    <SurelyTable
      :loading="loading"
      :data="data"
      :columns="columns"
      rowKey="id"
      @change="handleSortChange"
      @cellClick="handleCellClick"
      height="calc(100vh - 270px)"
    >
    </SurelyTable>
    <div class="flex-center charge-detail-pager">
      <Pagination :total="total" v-model:limit="limit" v-model:page="page" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useFilterTable, type ApiFnType } from "@/hooks";
import { payListPaymentOrder } from "@/api";
import type { FormItemType } from "wltech-ui";
import dayjs from "dayjs";
import { useHelpCenter } from "@/stores";
const helpCenterStore = useHelpCenter();
const formList = shallowRef<FormItemType[]>([
  {
    type: "daterange",
    key: "time",
    props: {
      clearable: false,
      style: {
        width: "230px",
      },
    },
  },
  {
    label: "",
    type: "select",
    key: "type",
    props: {
      style: {},
      // multiple: true,1 '充值' 2 '平台使用' 3 '删好友退款'4 '人工退款'
    },
    options: [
      {
        label: "全部订单",
        value: "",
      },
      {
        label: "充值",
        value: "1",
      },
      {
        label: "平台使用",
        value: "2",
      },
      {
        label: "删好友退款",
        value: "3",
      },
      {
        label: "人工退款",
        value: "4",
      },
    ],
  },
]);
const apiFn: ApiFnType = async ({ page, limit, model, sort }) => {
  const data = {
    start: model.time?.[0] || "",
    end: model.time?.[1] || "",
    sortParam: {
      limit: limit || 10,
      pageCount: page || 1,
      sort,
    },
    type: +model.type || "",
  };
  const res = await payListPaymentOrder(data);
  return [
    res.data?.orderResultDtos?.map((i) => ({
      ...i,
      balance: Math.floor(i.fee / 100),
    })),
    res.data?.count,
  ];
};
const handleCellClick = (val: any) => {};
const { model, loading, data, columns, handleSortChange, page, limit, total } =
  useFilterTable(apiFn, {
    defaultModel: {
      time: [dayjs().startOf("w").valueOf(), dayjs().endOf("w").valueOf()],
      type: "",
    },
    getColumns: (_: any) => [
      {
        title: "流水号",
        prop: "id",
        // type: "user",
        fixed: "left",
      },
      {
        title: "交易类型",
        prop: "typeCn",
        // sortable: true,
      },
      {
        title: "金额",
        prop: "balance",
      },
      {
        title: "交易时间",
        prop: "createTime",
        sortable: true,
        type: "date",
      },
      {
        title: "支付订单号",
        prop: "orderNo",
      },
      // {
      //   title: "操作",
      //   prop: "operation",
      //   slot: "operation",
      // },
    ],
  });
</script>
<style lang="scss" scoped>
.charge-detail {
  .p-b-6 {
    padding-bottom: 24px;
  }
  .return-btn {
    font-size: 18px;
    color: var(--wl-text-color-primary-2);
    margin-right: 32px;
  }
  .export {
    width: 36px;
    font-size: 24px;
    color: var(--wl-text-color-primary-2);
  }
  &-pager {
    margin-top: 24px;
  }
}
</style>
