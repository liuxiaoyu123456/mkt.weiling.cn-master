import { reactive, toRefs } from "vue";
import { userPickerDept, wechatDetail } from "@/api";
import { useFilterTable, type ApiFnType } from "@/hooks";
import type { FormItemType } from "wltech-ui";
import { Search } from "@element-plus/icons-vue";
import useTableColumnWidth from "@/hooks/useTableColumnWidth";
import { useRoute } from "vue-router";
import { useBussiness } from "@/stores";
import OpenData from "@/components/OpenData.vue";

const useWechatForm: any = () => {
  const route: any = useRoute();
  const store: any = useBussiness();
  const { marketComponentsWidth, onResizeColumn } = useTableColumnWidth(
    `router-${route.name}`
  );
  const state = reactive<{
    tableColumns: any;
    formList: FormItemType[];
  }>({
    tableColumns: [],
    formList: [],
  });

  // const business_stage_list = computed(()=>{
  //   return store.getter_business_all_stage_list || []
  // })

  // 获取微信方案加微列表
  const getList: ApiFnType = ({
    limit = 10,
    page = 1,
    model = {},
    sort = {},
  }: any) => {
    const newParams = {
      sort_param: {
        limit,
        page_count: page,
        sort,
      },
      rule_id: route.query.id,
      start: model.create_time && model.create_time[0],
      end: model.create_time && model.create_time[1],
      ...model,
    };

    return wechatDetail(newParams).then((res: any) => {
      return [res.data.dataList, Number(res.data.count)];
    });
  };

  // 使用冬冬的大宝剑
  const {
    model,
    loading,
    data,
    columns,
    sort,
    handleSortChange,
    page,
    limit,
    total,
  } = useFilterTable(getList, {
    getColumns: (_: any) => state.tableColumns,
    defaultModel: { keyword: "", create_time: ["", ""] },
    defalutPagination: { page: 1, limit: 10 },
  });

  const init = async () => {
    await store.action_business_stage_list();
    state.formList = [
      {
        label: "",
        type: "input",
        key: "keyword",
        props: {
          onChangeOnce: (val: string) => {},
          onInput: (val: string) => {},
          // focusShowWordLimit: true,
          maxlength: 20,
          palaceholder: "搜索",
          "prefix-icon": Search,
          style: {
            width: "200px",
          },
        },
      },
      {
        label: "",
        key: "create_time",
        type: "daterange",
        props: {
          style: {
            width: "220px",
          },
          placeholder: "添加时间",
          shortcut: true,
          clearable: true,
        },
      },
      {
        label: "",
        key: "user_ids",
        type: "staffTree",
        //筛选使用员工属性配置
        props: {
          // style: {
          //   width: "140px",
          // },
          placeholder: "选择添加员工",
          multiple: true,
          // label:'归属人',
          innerLabel: "添加员工", //label在回显区
          clearable: true,
          maxEchoCount: 2,
          multipleLimit: 100,
        },
        options: () =>
          userPickerDept({ filter: { status: 5 } }).then((res) => {
            return res.data?.dataList || [];
          }),
        setting: {
          nameRender: (staff) => {
            return <OpenData openid={staff.name} />;
          },
          searchAble: false,
        },
      },
      // {
      //   type: "select",
      //   key: "stages",
      //   props:{
      //     multiple: true,
      //     placeholder: "选择商机阶段",
      //     allItemText: "全部商机阶段",

      //   },
      //   optionProps: {
      //     label: "value",
      //     value: "key"
      //   },
      //   options: store.getter_business_stage_list || [],
      //   setting:{
      //     selectAllText: "全部商机阶段",
      //   }
      // }
    ];

    const list = [
      {
        title: "微信昵称",
        "show-overflow-tooltip": false,
        prop: "nickName",
        fixed: "left",
      },
      // {
      //   title: "标签",
      //   prop: "tagList",
      //   type: "tag"
      // },
      // {
      //   title: "商机阶段",
      //   prop: "clueBusinessOpportunityList",
      //   type: "businessStage",
      //   viewMore: true,
      //   className: "click-able",
      // },
      {
        title: "方案名称",
        prop: "componentName",
        type: "twoLine",
      },
      {
        type: "userGroup",
        title: "添加员工",
        prop: "friendList",
        canClick: true,
      },
      {
        title: "添加时间",
        prop: "createTime",
        sortable: true,
        type: "date",
      },
      // {
      //   type: "userGroup",
      //   title: "跟进人",
      //   prop: "followPersonList",
      // },
      // {
      //   title: "跟进记录摘要",
      //   prop: "summaryDictionaryVoList"
      // }
    ];

    state.tableColumns = marketComponentsWidth(list);
  };

  return {
    ...toRefs(state),
    init,
    model,
    loading,
    data,
    columns,
    handleSortChange,
    page,
    limit,
    total,
    onResizeColumn,
  };
};

export default useWechatForm;
