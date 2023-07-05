<script lang="ts" setup>
import { shallowRef } from "vue";
import { useAccountState } from "@/stores";
import FirstInit from "./components/firstInit/Index.vue";
import List from "./components/list/Index.vue";
import { wechatList } from "@/api";
const store = useAccountState();
const { updateAccountState } = store;
const viewType: any = shallowRef(null);

const checkData = () => {
  updateAccountState();
  const newParams = {
    sort_param: {
      limit: 10,
      page_count: 1,
      sort: [],
    },
  };
  wechatList(newParams).then((res: any) => {
    viewType.value = res.data.dataList?.length ? List : FirstInit;
  });
};

checkData();
</script>

<template>
  <component :is="viewType" @refresh="checkData"></component>
</template>
