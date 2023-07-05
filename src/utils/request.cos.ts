import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
import { getQueryVariable } from "./utils";
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_COS_API,
});

// 异常拦截处理器
const errorHandler = (error: any) => {
  return Promise.reject(error?.response?.data);
};

request.interceptors.request.use((config) => {
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  return response.data;
}, errorHandler);

export default request;
