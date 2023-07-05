import { requestPay as request } from "@/utils";

// 支付请求
export const payCreateOrder = (data = {}) =>
  request.post("/pay/createOrder", data);
enum PayType {
  WECHAT = 1,
}
payCreateOrder.PayType = PayType;
// 查询订单情况
export const payQueryOrder = (data = {}) =>
  request.post("/pay/queryOrder", {}, { params: data });
enum OrderStatus {
  INIT = 0, //"订单已生成"
  ING = 1, // "支付中"
  SUCCESS = 2, //"支付成功"
  FAIL = 3, //"支付失败"
  CANCEL = 4, // "已撤销"
  REFUND = 5, // "已退款"
  CLOSED = 6, //"订单关闭"
}
payQueryOrder.Status = OrderStatus;
// 退款接口
export const payBackFee = (data = {}) => request.post("/pay/backFee", data);
// 列表页面
export const payListPaymentOrder = (data = {}) =>
  request.post("/pay/listPaymentOrder", data);
// 首页查看账户状态
export const payGetJktBalance = (data = {}) =>
  request.get("/pay/getJktBalance", {
    params: data,
  });
//改变状态
export const payChangeStatus = (data = {}) =>
  request.get("/pay/changeStatus", { params: data });
