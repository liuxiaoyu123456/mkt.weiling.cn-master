<template>
  <s-table
    class="w-table-wrapper"
    :rowKey="rowKey"
    :custom-header-cell="customHeaderCell"
    :columns="comColumns"
    :scroll="{
      y: '100%',
      scrollToFirstRowOnChange: true,
    }"
    :data-source="data"
    :showSorterTooltip="false"
    :pagination="false"
    :animateRows="false"
  >
    <template #headerCell="{ column }">
      <slot v-if="column.headSlot" :name="column.headSlot" />
    </template>
    <template #bodyCell="{ column, record }">
      <slot v-if="column.slot" :name="column.slot" v-bind="record" />
      <template v-if="column.type">
        <component
          :data="record"
          :column="column"
          :is="allasMap[column.type]"
          show-in="table"
          :class="{ clickable: !!column.clickable }"
          @click.stop="
            !!column.clickable
              ? emit('cellClick', { row: record, column, prop: column.prop })
              : undefined
          "
        ></component>
      </template>
    </template>
    <template #emptyText>
      <div
        v-if="!loading"
        class="flex-col items-center justify-center empty-footer"
      >
        <img
          class="empty-footer-img"
          src="@/assets/images/default_no_result.png"
          width="260"
          alt=""
        />
        <span class="empty-footer-text">{{
          attrs["empty-text"] || "暂无数据"
        }}</span>
        <slot name="emptyFooter" />
      </div>
    </template>
  </s-table>
</template>
<script lang="ts" setup>
import { computed, useAttrs, defineAsyncComponent, ref, shallowRef } from "vue";
import STable from "@surely-vue/table";
import { setLicenseKey } from "@surely-vue/table";
const wDate = defineAsyncComponent(() => import("./components/wDate.vue"));
const wUser = defineAsyncComponent(() => import("./components/wUser.vue"));
const wUserGroup = defineAsyncComponent(
  () => import("./components/wUserGroup.vue")
);
const wClickText = defineAsyncComponent(
  () => import("./components/wClickText.vue")
);
const wTwoLineText = defineAsyncComponent(
  () => import("./components/wTwoLineText.vue")
);
const allas = {
  clickText: wClickText,
  date: wDate,
  user: wUser,
  userGroup: wUserGroup,
  twoLine: wTwoLineText,
};
interface Column {
  title: string;
  prop: string;
  type?: keyof typeof allas;
  slot?: string;
  sortable?: boolean;
  clickable?: boolean;
  [attrs: string]: any;
}
interface CellEvent {
  prop: string;
  row: any;
  column: Column;
}

const props = defineProps<{
  columns: Column[];
  data: any[];
  rowKey: string;
  loading?: boolean;
}>();
const attrs = useAttrs();
const emit = defineEmits<{
  (e: "cellClick", val: CellEvent): void;
}>();
const allasMap: any = shallowRef(allas);
const comColumns = computed(() =>
  props.columns.map((item, index) => ({
    ...item,
    dataIndex: item.prop,
    sorter: !!item.sortable,
    resizable: index !== props.columns.length - 1,
    width: +item["width"] || undefined,
    minWidth: +item["minWidth"] || 120,
  }))
);

const customHeaderCell = () => ({
  style: { background: "#fff", color: "var(--wl-text-color-secondary-2)" },
});

setLicenseKey(
  "6ea54abaf19b8ebc2c1f52ef61a19da8T1JERVI6MTAwMDIyLEVYUElSWT0xNjg5Mzc5MjAwMDAwLERPTUFJTj13ZWlsaW5nLmNuLFVMVElNQVRFPTAsS0VZVkVSU0lPTj0x"
);
</script>

<style lang="scss">
@import "@surely-vue/table/dist/index.min.css";
body {
  background-color: transparent;
}
.w-table-wrapper {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  .clickable {
    color: var(--wl-primary-color-dark);
    cursor: pointer;
  }
  .surely-table-empty-container {
    // box-sizing: content-box;
    padding: 0;
    border: none;
  }
  .surely-table-cell-content:empty::after {
    content: "—";
    color: #a5a5a5;
  }
  .empty-footer {
    height: 360px;
    &-img {
      max-width: 260px;
      max-height: 260px;
    }
    &-text {
      color: #979797;
      font-size: 16px;
    }
  }
}
.surely-table-header-scrollbar {
  background-color: #fff;
}
</style>
