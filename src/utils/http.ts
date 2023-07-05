import request from "./request";
import { serializeParams } from "./utils";

interface Setting {
  isCache?: boolean;
}

const cache: Record<string, any> = {};

export const get = ((window as any).get = (
  url: string,
  data = {},
  setting: Setting = { isCache: false }
) => {
  return send(
    {
      url,
      method: "get",
      params: data,
    },
    setting
  );
});

export const post = ((window as any).post = (
  url: string,
  data = {},
  setting: Setting = { isCache: false }
) => {
  return send(
    {
      url: url,
      method: "post",
      data: data,
    },
    setting
  );
});

function send(config: any, setting: Setting) {
  let apiKey: string;
  //如果接口需要缓存
  if (setting.isCache) {
    apiKey = serializeParams(config);
    // 如果有缓存直接返回
    if (cache[apiKey]) {
      return Promise.resolve(cache[apiKey]);
    }
  }
  return request(config)
    .then((res) => {
      if (setting.isCache) {
        cache[apiKey] = res;
      }
      return res;
    })
    .catch((error) => {
      throw error;
    });
}
