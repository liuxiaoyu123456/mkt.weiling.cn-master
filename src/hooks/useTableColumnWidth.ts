import { setStorage, getStorage } from "@/utils/utils";
const fixColumnWidth = {
  nick_name: "260",
  user_name: "148",
  mobile: "130",
  create_user: "180",
  customer_company_list: "280",
  recycle_reason: "240",
  recycle_time: "170",
  register_address: "209",
  searchword: "210",
  keyword: "210",
  source: "148",
  create_time: "187",
  belong_user: "148",
  user_list: "180",
  tag_groups: "280",
  clue_business_opportunity_list: "170",
  customer_business_opportunity_list: "170",
  company_business_opportunity_list: "170",
  remark_mobiles: "198",
  add_users: "148",
  key_people: "100",
  contact_case_list: "170",
  newest_progress_time: "176",
  form_name: "264",
  submit_count: "124",
  submit_count_today: "124",
  user: "124",
  customerRate: "148",
  channel_ids: "302",
  customerCount: "148",
  useScence: "150",
  button: "320",
  comp: "320",
  users: "158",
  tag_list: "302",
  clue_count: "106",
  template_name: "172",
  template_content: "400",
  send_count: "100",
  wx_count: "100",
  nick_name_info: "260",
  component_name: "212",
  follow_person: "204",
  last_messege_info: "200",
  user_info: "264",
  channel: "144",
  friend: "204",
  follow_person_list: "204",
  summary_dictionary_vo_list: "392",
  total_count: "140",
  today_count: "140",
  code_version: "140",
  location_remark: "200",
  welcome: "320",
  creater: "164",
  group_chat_code_name: "252",
  real_num: "150",
  join_num: "150",
  quit_num: "150",
  room_num: "150",
  status: "128",
};
const useTableColumnWidth = (module: string) => {
  const curModule: string = module;
  const fieldColumnWidth =
    getStorage("storageTableColumnWidth")?.[curModule] || fixColumnWidth;
  const onSaveColumnWidth = (
    newWidth: any,
    oldWidth: any,
    column: any,
    event: any
  ) => {
    fieldColumnWidth[column.property || column.property_name] = newWidth;
    const tableColumnWidth = getStorage("storageTableColumnWidth");
    if (tableColumnWidth) {
      tableColumnWidth[curModule] = fieldColumnWidth;
      setStorage("storageTableColumnWidth", tableColumnWidth);
    } else {
      setStorage("storageTableColumnWidth", {
        [curModule]: fieldColumnWidth,
      });
    }
  };
  const onResizeColumn = (newWidth: number, column: any) => {
    fieldColumnWidth[column.prop || column.property || column.property_name] =
      newWidth;
    const tableColumnWidth = getStorage("storageTableColumnWidth");
    if (tableColumnWidth) {
      tableColumnWidth[curModule] = fieldColumnWidth;
      setStorage("storageTableColumnWidth", tableColumnWidth);
    } else {
      setStorage("storageTableColumnWidth", {
        [curModule]: fieldColumnWidth,
      });
    }
  };
  const onFormatTableColumnWidth = (tableColumns: any) => {
    return tableColumns.map((res: any) => {
      return {
        ...res,
        minWidth: fieldColumnWidth[res.prop] || res.minWidth || res.width,
      };
    });
  };
  // 处理营销组件中的列宽问题
  const marketComponentsWidth = (columns: any) => {
    return columns.filter((item: any) => {
      if (item?.slot == "operation") {
        item.width = 60;
      } else {
        item.width = +fieldColumnWidth[item.prop || item.property_name];
      }
      // 列少并且在大屏显示时，右侧有操作项的情况处理
      if (item.prop == "group_chat_code_name") item.width = undefined;
      return item;
    });
  };
  return {
    fieldColumnWidth,
    onSaveColumnWidth,
    onFormatTableColumnWidth,
    onResizeColumn,
    marketComponentsWidth,
  };
};
export default useTableColumnWidth;
