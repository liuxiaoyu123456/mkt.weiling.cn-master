import { get, post } from "@/utils";

// 新增集客通账户
export const accountAdd = (data = {}) => post("/jkt/account/add", data);
// 修改集客通账户
export const accountEdit = (data = {}) => post("/jkt/account/edit", data);
// 获取集客通账户详情
export const accountDetail = (data = {}) => post("/jkt/account/detail", data);
// 校验是否绑定基木鱼
export const checkBind = (data = {}) => get("/jkt/account/check/bind", data);
// 校验oauth授权
export const checkAuth = (data = {}) => get("/jkt/account/check/auth", data);
// 微信方案加微详情导出
export const customerDetailExport = (data = {}) =>
  post("/jkt/customer/detail_export", data);
// 微信方案加微详情
export const customerDetail = (data = {}) => post("/jkt/customer/detail", data);
// 微信方案列表
export const planList = (data = {}) => post("/jkt/plan/list", data);
// 小程序列表
export const programList = (data = {}) => post("/jkt/mini/program/list", data);

//租户配置(商机阶段、丢单原因枚举)
export const get_business_tenant_config = (data = {}) =>
  get("/crm_v2/web/common/tenant_config", data);

// 首页列表
export const customerList = (data = {}) => post("/jkt/list_all_customer", data);
// 首页列表好友详情
export const customerMutualFriendList = (data = {}) =>
  post("/crm/customer/mutual_friend_list", data);
enum LOST_STATE {
  NOT_LOST, // 0: "未流失"
  BEDELETE, // 1: "已被客户删除"
  DELETE, // 2: "已删除客户"
  BOTHDELETE, // 3: "已与客户互删"
}
customerMutualFriendList.LOST_STATE = LOST_STATE;
customerMutualFriendList.getStateName = (state: LOST_STATE) => {
  switch (state) {
    case LOST_STATE.BEDELETE:
      return "已被客户删除";
    case LOST_STATE.DELETE:
      return "已删除客户";
    case LOST_STATE.BOTHDELETE:
      return "已与客户互删";
    default:
      return "";
  }
};

// 首页图表
export const planStatis = (data = {}) => post("/jkt/plan/statis", data);
// 首页排行
export const planRank = (data = {}) => post("/jkt/plan/rank", data);
