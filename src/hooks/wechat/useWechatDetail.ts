import { reactive, toRefs } from "vue";
import { wechatList } from "@/api";
import { useFilterTable } from "@/hooks";
import type { FormItemType } from "wltech-ui";
import { Search } from "@element-plus/icons-vue";
import useTableColumnWidth from "@/hooks/useTableColumnWidth";
import { useRoute } from "vue-router";

const useWechatDetail: any = () => {
  const route: any = useRoute();
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

  // 获取微信方案列表
  const getList = ({ limit, page, model, sort }: any) => {
    const newParams = {
      sort_param: {
        limit,
        page_count: page,
        sort: [{ ...sort }],
      },
      ...model,
    };

    return new Promise((resolve) => {
      wechatList(newParams).then((res: any) => {
        resolve([res.data.dataList, Number(res.data.count)]);
      });
    }) as Promise<[any[], number]>;
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
    defaultModel: { keyword: "" },
    defalutPagination: { page: 1, limit: 10 },
  });

  const init = () => {
    state.formList = [
      {
        label: "",
        type: "input",
        key: "introText",
        props: {
          onChangeOnce: (val: string) => {},
          onInput: (val: string) => {},
          // focusShowWordLimit: true,
          maxlength: 20,
          palaceholder: "搜索",
          "prefix-icon": Search,
          style: {
            width: "200px",
            "margin-right": "16px",
          },
        },
      },
      {
        label: "",
        type: "datepicker",
        key: "datepicker",
      },
      {
        label: "",
        type: "select",
        key: "iselectKey",
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
    ];

    const list = [
      {
        type: "user",
        title: "微信昵称",
        "show-overflow-tooltip": false,
        prop: "user_info",
        // width: 264,
        fixed: "left",
      },
      {
        title: "标签",
        prop: "tag_list",
        type: "tag",
        // width: 304
      },
      {
        title: "商机阶段",
        prop: "clue_business_opportunity_list",
        type: "businessStage",
        viewMore: true,
        className: "click-able",
        // width: 184,
        // on: {
        //   stageClick(data) {
        //     methods.onViewMoreBusiness(data);
        //   }
        // }
      },
      {
        title: "方案名称",
        prop: "component_name",
      },
      {
        type: "userGroup",
        title: "添加员工",
        prop: "friend",
        // width: 204,
        canClick: true,
      },
      {
        title: "添加时间",
        prop: "create_time",
        sortable: true,
      },
      {
        type: "userGroup",
        title: "跟进人",
        prop: "follow_person_list",
        // width:204,
      },
      {
        title: "跟进记录摘要",
        prop: "summary_dictionary_vo_list",
        // width: 392,
      },
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

export default useWechatDetail;
