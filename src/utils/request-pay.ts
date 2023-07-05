import axios from "axios";
import { reqInterceptor, errorHandler, resInterceptor } from "./request";

// 创建 axios 实例
export const requestPay = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_PAY_API,
  withCredentials: true,
  timeout: 60000, // 请求超时时间
  responseType: "json",
  headers: {
    common: {
      "Cache-Control": "no-cache",
    },
    get: {
      "If-Modified-Since": 0,
    },
  },
});

requestPay.interceptors.request.use(reqInterceptor, errorHandler);

requestPay.interceptors.response.use(resInterceptor, errorHandler);
