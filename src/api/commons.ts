import { get, post } from "@/utils";

export const getCurrentUser = (data = {}) =>
  get("/api/user/get_current_user", data);

// 小薇二维码
export const getXwInfo = (data = {}) => get(`/report/user/get_xw_info`, data);
// 短信发送
export const smsSend = (data = {}) => get(`/client/sms/send`, data);
// 短信验证
export const smsValidate = (data = {}) => get(`/client/sms/validate`, data);
//获取企微sdk签名参数
export const getSDKTicket = (data = {}) => get(`/wx/authjs_ticket`, data);
// 退出登录
export const loginQuit = (data = {}) => get(`/api/login/quit`, data);
