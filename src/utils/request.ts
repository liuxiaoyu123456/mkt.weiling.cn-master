import axios from "axios";
import { ElMessage } from "element-plus";
import { camelizeKeys, decamelizeKeys, decamelize } from "humps";
import { useHelpCenter } from "@/stores";

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API,
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

// 异常拦截处理器
export const errorHandler = (error: any) => {
  // 接口异常显示小微帮助
  // const store = useHelpCenter();
  // store.helpCenterState.showHelp = true;
  return Promise.reject(error?.response?.data);
};
// 请求拦截处理器
export const reqInterceptor = (config) => {
  const params = {
    // corpId: "wpK9-UBwAA_FpZOPXmb_I1sI-yVd4YmQ",
  };

  config.params = Object.assign({}, params, config.params);

  if (config.params) {
    config.params = decamelizeKeys(config.params);
    if (config.params.sort_param?.sort?.length) {
      config.params.sort_param.sort.forEach((sort: any) => {
        if (sort.prop) {
          sort.prop = decamelize(sort.prop);
        }
      });
    }
  }
  if (config.data) {
    config.data = decamelizeKeys(config.data);
    if (config.data.sort_param?.sort?.length) {
      config.data.sort_param.sort.forEach((sort: any) => {
        if (sort.prop) {
          sort.prop = decamelize(sort.prop);
        }
      });
    }
  }
  return config;
};
// 响应拦截处理器
const errCodeList = [500, 9002];
export const resInterceptor = (response) => {
  if (errCodeList.includes(response.data.code)) {
    ElMessage.error(response.data.msg || "系统错误");
    const store = useHelpCenter();
    store.helpCenterState.showHelp = true;
  }
  if (
    response.data
    // response.headers["content-type"] === "application/json"
  ) {
    response.data = camelizeKeys(response.data);
  }

  return response.data;
};

request.interceptors.request.use(reqInterceptor, errorHandler);

request.interceptors.response.use(resInterceptor, errorHandler);

export default request;
