import { ref, computed } from "vue";
import { getMpList } from "@/api";
import { Search } from "@element-plus/icons-vue";

export const STATUSOPTION: any = [
  { label: "使用中", value: 10 },
  { label: "待使用", value: 20 },
  { label: "审核中", value: 30 },
  { label: "被封禁", value: 40 },
  { label: "试用期已过", value: 50 },
];
// 公众号筛选项集合
export const OFFICIALLIST = computed(() => getMpDataList());
// 获取公众号列表 (待修改)
const getMpDataList = async () => {
  const mpDataList: any = await getMpList();
  // console.log(mpDataList)
  const list = mpDataList.data.dataList;
  const dataList = new Array(list).fill({});
  for (let i = 0; i < list.length; i++) {
    dataList[i] = {
      label: list[i]?.nickName || "",
      value: list[i]?.appId || "",
    };
  }
  if (Object.keys(dataList[0]).length == 0) {
    return [];
  } else {
    return dataList;
  }
};
export function statusFilter(val: number) {
  let label = "";
  STATUSOPTION.forEach((item: any) => {
    if (item.value == val) label = item.label;
  });
  return label;
}
// 处理列表返回的数据
export const responseDataList = (data: any) => {
  const dataList = new Array(data).fill({});
  for (let i = 0; i < data?.length; i++) {
    dataList[i] = {
      ...data[i],
      appName: data[i].tenantId == 1 ? "免费小程序" : data[i]?.appName || "",
      headImg: data[i]?.headImg,
      status: +data[i]?.status || 30,
      createTime: data[i]?.createTime,
      createUser:
        data[i].tenantId == 1
          ? [
              {
                nickName: "小微",
                headImgUrl:
                  "https://wlmvp-cos.weiling.cn/worktable-erp/images/xiaowei_zhuli.png?v=22",
              },
            ]
          : [data[i]?.createUser],
      bindMp: data[i]?.bindMp,
    };
  }
  return dataList;
};
// 状态style
export const textColor: any = {
  10: "#FF0000",
  20: "var(--wl-primary-color)",
  30: "#008E4A",
  40: "#FF9900",
  50: "var(--wl-text-color-secondary-1)",
};
export const backGroupColor: any = {
  10: "rgba(255, 0, 0, 0.15)",
  20: "rgba(28, 159, 255, 0.15)",
  30: "rgba(0, 142, 74, 0.15)",
  40: "rgba(255, 153, 0, 0.15)",
  50: "var(--wl-line-color-light)",
};
// 表头筛选项
export const formList = ref<any>([
  {
    type: "input",
    key: "keyword",
    // span: 12,
    props: {
      placeholder: "搜索",
      style: {
        // width: "253px",
        marginRight: "10px",
        marginLeft: "10px",
      },
    },
    "prefix-icon": Search,
  },
  {
    type: "select",
    key: "statuses",
    // span: 12,
    props: {
      placeholder: "筛选状态",
      style: {
        // width: "166px",
        marginRight: "10px",
      },
      multiple: true,
    },
    options: STATUSOPTION.filter((item: any) => item.value != 50),
  },
  {
    type: "select",
    key: "bind_mp_ids",
    props: {
      placeholder: "关联公众号",
      style: {
        width: "180px",
        marginRight: "10px",
      },
      multiple: true,
    },
    options: OFFICIALLIST.value,
  },
]);
