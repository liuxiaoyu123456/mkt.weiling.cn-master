// 小程序相关接口
import { get, post } from "@/utils";

// 获取小程序列表
export const getMiniProgramList = (data = {}) =>
  post("/jkt/mini/program/list", data);
// 获取公众号列表
export const getMpList = (data = {}) => get("/jkt/mp/list", data);
// 公众号授权
export const buildAuthUrl = (data = {}) =>
  get("/wxopen_component/build_auth_url", data);
// 小程序授权
export const createMiniApp = (data = {}) =>
  get("/wxopen_component/create_mini_app", data);
// 获取上传图片的mediaId
export const getUploadMedia = (data = {}) =>
  post("/wxopen_component/upload_media", data);
// 完善小程序信息
export const completeInformation = (data = {}) =>
  post("/wxopen_component/complete_information", data);
// 检查公众号是否授权成功
export const jktCheckAuth = (data = {}) => get("/jkt/check_auth", data);

//查询小程序id
export const wxopenComponentTry = (data = {}) =>
  get("/wxopen_component/try", data);
//集客通部署代码提交审核
export const jktPushAudit = (data = {}) => get("/jkt/push_audit", data);
//小程序名称校验
export const checkWxKname = (data = {}) =>
  get("/jkt/checkwxverifynickname", data);
