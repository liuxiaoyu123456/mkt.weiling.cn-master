<template>
  <div class="card">
    <el-button @click="inline = !inline">{{
      inline ? "inline:true" : "inline:false"
    }}</el-button>
    <br /><br />
    <div>
      {{ model }}
    </div>
    <br />
    <WlForm
      :class="inline ? 'label-hidden' : ''"
      ref="wlform"
      :inline="inline"
      :list="list"
      :model="model"
      :label-width="inline ? undefined : '100px'"
      :field-space="[10, 10]"
    >
    </WlForm>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { FormItemType } from "wltech-ui";

import { FormStaffSelect } from "@/components/RenderForm/";
import FormDepartment from "@/components/RenderForm/form-department.vue";
// import { FormDateRange } from "@/components/RenderForm/";

const inline = ref(false);
const model: any = ref({
  mselectKey: ["nihao2", "nihao3"],
  daterange: [0, 0, "lastWeek"],
});

// const wlform = ref();
// onMounted(() => {
//   console.log(wlform.value);
// });

const autocompleteList = [
  { value: "vue", link: "https://github.com/vuejs/vue" },
  { value: "element", link: "https://github.com/ElemeFE/element" },
  { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
  { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
  { value: "vuex", link: "https://github.com/vuejs/vuex" },
  { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
  { value: "babel", link: "https://github.com/babel/babel" },
];

const list: FormItemType[] = [
  {
    label: "部门选择器",
    key: "department",
    component: FormDepartment,
  },
  // {
  //   label: "员工选择器",
  //   key: "staff",
  //   component: FormStaffSelect,
  //   setup: {
  //     loadData: () => {
  //       return [];
  //     },
  //   },
  // },

  {
    label: "下拉框单选",
    type: "select",
    // component: FormSelect,
    key: "selectKey",
    // options: [
    //   {
    //     label: "你好",
    //     value: "nihao",
    //   },
    //   {
    //     label: "你好2",
    //     value: "nihao2",
    //   },
    // ],
    // options() {
    //   return [
    //     {
    //       label: "你好",
    //       value: "nihao",
    //     },
    //     {
    //       label: "你好2",
    //       value: "nihao2",
    //     },
    //     {
    //       label: "你好3",
    //       value: "nihao3",
    //     },
    //   ];
    // },
    options: () => {
      return Promise.resolve([
        {
          label: "你好",
          value: "nihao",
        },
        {
          label: "你好2",
          value: "nihao2",
        },
        {
          label: "你好3",
          value: "nihao3",
        },
        {
          label: "你好4",
          value: "nihao4",
        },
      ]);
    },
  },

  {
    label: "下拉框多选",
    type: "select",
    // component: FormSelect,
    key: "mselectKey",
    props: {
      multiple: true,
      clearable: true,
    },
    setting: {
      selectAllText: "全部商机阶段",
    },

    // options:()=> {
    //   return Promise.resolve([
    //     {
    //       label: "你好",
    //       value: "nihao",
    //     },
    //     {
    //       label: "好你好2",
    //       value: "nihao2",
    //     },
    //     {
    //       label: "好你好3",
    //       value: "nihao3",
    //     },
    //     {
    //       label: "好你好4",
    //       value: "nihao4",
    //     }
    //   ]);
    // },
    options() {
      return [
        {
          label: "你好",
          value: "nihao",
        },
        {
          label: "你好2",
          value: "nihao2",
        },
        {
          label: "你好3",
          value: "nihao3",
        },
      ];
    },
    // options: [
    //   {
    //     label: "你好",
    //     value: "nihao",
    //   },
    //   {
    //     label: "你好2",
    //     value: "nihao2",
    //   },
    //   {
    //     label: "你好3",
    //     value: "nihao3",
    //   },
    // ],
  },

  {
    label: "日期选择器",
    type: "datepicker",
    key: "datepicker",
  },
  {
    label: "日期范围",
    type: "daterange",
    key: "daterange",
    props: {},
    setting: {
      // shortcutOpt: "none",
      // shortcutOpt: ["lastMonth"],
      // shortcutOpt: "future",
      // shortcutOpt: ["lastMonth","lastQuarter","yesterday"],
      echoShortcut: true,
    },
  },
  {
    label: "自动完成",
    // component: FormAutoComponent,
    type: "autocomplete",
    key: "autocomponent",
    props: {
      fetchSuggestions(
        queryString: string,
        cb: (data: Record<string, any>[]) => {}
      ) {
        const results = queryString
          ? autocompleteList.filter((item) => {
              return (
                item.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
                -1
              );
            })
          : autocompleteList;
        // call callback function to return suggestions
        // cb(results);
        // console.log(queryString)
        // return results //同步
        // cb(results)  //同步
        // setTimeout(() => {  //异步
        //   cb(results)
        // }, 1000);

        return Promise.resolve(results); //异步
      },
    },
  },
  {
    label: "输入框",
    type: "input",
    key: "inputKey",
    props: {
      onChangeOnce: (val: string) => {},

      maxlength: 20,
      placeholder: "输入 123 此框消失",
    },
    setting: {
      // trigger: "blur" ,
      focusShowWordLimit: true,
    },
    visible: (modelData: any) => {
      return !!modelData && modelData.inputKey !== "123";
    },
  },
  {
    label: "文本域",
    type: "input",
    key: "inputKey",
    props: {
      rows: 4,
      type: "textarea",
    },
    setting: {},
    visible: () => {
      return !inline.value;
    },
  },

  {
    label: "单选",
    type: "radio",
    key: "radiokey",
    options: [
      {
        label: "你好",
        value: "nihao",
      },
      {
        label: "你好2",
        value: "nihao2",
      },
    ],
  },
  {
    label: "多选",
    type: "checkbox",
    key: "checkboxkey",
    options: [
      {
        label: "你好",
        value: "nihao",
      },
      {
        label: "你好2",
        value: "nihao2",
      },
    ],
  },
  {
    label: "颜色",
    type: "color",
    key: "colorkey",
  },
  {
    label: "开关",
    type: "switch",
    key: "switch",
  },
];
</script>
<style>
.label-hidden .el-form-item__label {
  display: none;
}
</style>
