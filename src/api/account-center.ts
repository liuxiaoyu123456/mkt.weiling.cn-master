import { get, post } from "@/utils";
// 账户状态改变
export const accountStatus = (data = {}) =>
  post("/marketing/corp/account/status", data);
enum Status {
  DISABLED,
  NORMAL,
}
accountStatus.Status = Status;
// 员工列表
export const JktUserList = (data = {}) => post("/jkt/user/list", data);
// 编辑手机号
export const JktEditMobile = (data = {}) => get("/jkt/user/edit_mobile", data);
