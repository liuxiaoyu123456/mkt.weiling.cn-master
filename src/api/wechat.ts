// 微信方案接口及其依赖接口
import { get, post } from "@/utils";

// 时间段重复校验
export const onVerifyLiveCode = (data = {}) =>
  post("/api/live_code/verify", data);

// 权限内部门树+销售人员
export const get_authed_dept_list = (data = {}) =>
  post("/crm/dept/authed_list", data);

//上传永久图片
export const postWXmedia = (data = {}) =>
  post("/api/user/wx_media/upload_forever", data);

// 个人库
export const userMaterialList = (data = {}) =>
  post("/api/user/material/list", data);

// 企业库
export const corpMaterialList = (data = {}) =>
  post("/api/corp/material/list", data);

// 查询资料数
export const getMaterialGroupCount = (data = {}) =>
  get("/api/user/material/count", data);

// 获取常用标签
export const getRecentlyTag = (data = {}) =>
  get("/api/user/tag_group/list_recent", data);

//标签列表
export const getTagList = (data = {}) =>
  get("/api/user/tag_group/list_all", data);

//新增个人标签
export const addUserTag = (data = {}) => post("/api/user/tag/add", data);

//新增企业标签
export const addCorpTag = (data = {}) => post("/api/corp/tag/add", data);

//线索渠道来源列表
export const list_clue_channel = (data = {}) =>
  get("/crm/clue/pool/list_clue_channel", data);

//管理员获取员工简单列表
export const getStaffListData = (data = {}) => get("/api/user/list", data);

//获取资料库列表
export const getMaterialList = (type: string, data = {}) =>
  post(`/api/${type}/material/list`, data);

/**  ---------------------------------------以下是走微信流程的正经接口了------------------------------------------- */

// 微信方案列表
export const wechatList = (data = {}) => post(`/jkt/plan/list`, data);
// 微信方案加微详情
export const wechatDetail = (data = {}) => post(`/jkt/customer/detail`, data);
// 微信方案加微详情导出
export const wechatExport = (data = {}) =>
  post(`/jkt/customer/detail_export`, data);
// 校验是否绑定基木鱼
export const accountCheckBind = (data = {}) =>
  get(`/jkt/account/check/bind`, data);
// 基木鱼新增
export const jmyAdd = (data = {}) => post(`/marketing/jmy/add`, data);
// 基木鱼编辑
export const jmyEdit = (data = {}) => post(`/marketing/jmy/edit`, data);
// 基木鱼加微查询
export const jmyGet = (data = {}) => get(`/marketing/jmy/get`, data);
