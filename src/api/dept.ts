import { get, post } from "@/utils";

// 员工选择器-基础列表版
export const corpUserPicker = (data = {}) =>
  post("/api/corp/user_picker", data);
// 员工选择器-组织架构版
export const userPickerDept = (data = {}) =>
  post("/api/corp/user_picker/dept", data);
// 员工选择器-获取场景前5人
export const userPickerTop5 = (data = {}) =>
  get("/api/corp/user_picker/top5", data);
// 员工选择器-获取上下游企业影子员工
export const userPickerCorpchain = (data = {}) =>
  get("/api/corp/user_picker/corpchain", data);
