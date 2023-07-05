import { watch, reactive, toRefs } from "vue";
import { useFilterTable } from "@/hooks";
import type { FormItemType } from "wltech-ui";
import { Search } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores";
import { userPickerDept, corpUserPicker, wechatList } from "@/api";
import OpenData from "@/components/OpenData.vue";

const useWechat: any = () => {
  const route: any = useRoute();
  const store: any = useUserStore();
  const state = reactive<{
    tableColumns: any;
    formList: FormItemType[];
  }>({
    tableColumns: [],
    formList: [],
  });

  // 获取微信方案列表
  const getList = ({ limit = 10, page = 1, model = {}, sort = [] }) => {
    const newParams = {
      sort_param: {
        limit,
        page_count: page,
        sort,
      },
      ...model,
    };

    return new Promise((resolve, resject) => {
      wechatList(newParams).then((res: any) => {
        resolve([
          res.data.dataList.map((i) => ({
            ...i,
            customerRate: `${i.customerRate ?? "--"}%`,
          })),
          Number(res.data.count),
        ]);
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
        key: "keyword",
        props: {
          onChange: (val: string) => {},
          onInput: (val: string) => {},
          // focusShowWordLimit: true,
          maxlength: 20,
          placeholder: "搜索",
          "prefix-icon": Search,
          style: {
            width: "200px",
            // "margin-right": "16px",
          },
        },
      },
      // {
      //   label: "",
      //   key: "user_ids",
      //   component: wStaffTree,
      //   //筛选使用员工属性配置
      //   props:{
      //     style: {
      //       width: "140px",
      //       // marginRight: "10px"
      //     },
      //     placeholder: "选择使用员工",
      //     multiple: true,
      //     // label:'归属人',
      //     innerLabel: "使用员工", //label在回显区
      //     clearable: true,
      //     multipleLimit: 100
      //   },
      //   setup:{
      //     showWith: "popover",
      //     isEmployee:0, // 0表示搜索员工
      //     apiParam: {
      //       role_types: [1],
      //       admin_view_forced: true,
      //       scene: 2
      //     }
      //   }
      // },
      {
        label: "",
        key: "user_ids",
        type: "staffTree",
        props: {
          style: {
            width: "160px",
          },
          placeholder: "选择使用员工",
          multiple: true,
          innerLabel: "使用员工",
          clearable: true,
          maxEchoCount: 2,
        },
        setting: {
          nameRender: (staff) => {
            return <OpenData openid={staff.name} />;
          },
          searchAble: false,
        },
        options: () =>
          userPickerDept({ filter: { status: 5 } }).then((res) => {
            return res.data?.dataList || [];
          }),
      },
      {
        type: "staffSelect",
        key: "create_user_id",
        options: async () => {
          const { data } = await corpUserPicker({ filter: { status: 5 } });
          return data?.dataList || [];
        },
        props: {
          style: {
            width: "135px",
          },
          clearable: true,
          placeholder: "创建人筛选",
        },
        setting: {
          nameRender: (staff) => {
            return (
              <>
                <OpenData openid={staff.name} />
                {staff.status == 5 && <span>（已离职）</span>}
              </>
            );
          },
          searchAble: false,
        },
        //筛选创建者属性配置
        visible: store.getter_is_administrator_or_leader,
      },
    ];

    const list = [
      {
        title: "方案名称",
        prop: "buttonName",
        type: "twoLine",
        clickable: true,
      },
      {
        title: "加微数",
        prop: "customerCount",
        type: "twoLine",
        sortable: true,
        clickable: true,
      },
      {
        prop: "customerRate",
        headSlot: "customerRate",
        sortable: true,
      },
      // {
      //   title: "使用渠道",
      //   prop: "useScence",
      //   type: "userGroup",
      //   // width: 126
      // },
      {
        title: "使用员工",
        prop: "userList",
        type: "userGroup",
        // width: 160,
      },
      // {
      //   title: "标签",
      //   prop: "tagList",
      //   type: "tag",
      //   // width: 302
      // },
      {
        title: "创建人",
        prop: "createUser",
        type: "user",
        // width: 124
      },
      {
        title: "创建时间",
        prop: "createTime",
        type: "date",
        // width: 200,
      },
      {
        title: "操作",
        slot: "operation",
        // width: 60,
        fixed: "right",
      },
    ];

    state.tableColumns = list;
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
  };
};

export default useWechat;
