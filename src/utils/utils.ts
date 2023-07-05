import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores";
import useUpload from "@/hooks/useUpload";

let store: any = null;

export function setDocumentTitle(title: string) {
  document.title = title;
  const ua = navigator.userAgent;
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement("iframe");
    i.src = "/favicon.ico";
    i.style.display = "none";
    i.onload = function () {
      setTimeout(function () {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
}

/**
 * 序列化 api 参数, 相等的对象，返回相同的字符串
 */
export function serializeParams(params: any): string {
  return JSON.stringify(params, function (key: string, value: any) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((pre: any, cur: string) => {
          pre[cur] = value[cur];
          return pre;
        }, {});
    }
    return value;
  });
}

/**
 * 获取URL参数
 * @param variable 参数名称
 */
export const getQueryVariable = (variable: string): string => {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return "";
};

export const RoleThemeMap = {
  default: "default",
  sale: "azure",
  market: "purple",
} as const;
type RoleType = keyof typeof RoleThemeMap;
/**
 * @returns {String} 返回主题角色
 */
function getThemeRole(): RoleType {
  return "default";
  // return store.getters.getter_is_pure_market ? 'market' : (store.getters.getter_is_sale ? 'sale' : 'default')
}

export function getThemeName(): string {
  const theme = getQueryVariable("theme");
  if (theme && Object.values(RoleThemeMap).includes(theme as any)) {
    return theme;
  }
  return RoleThemeMap[getThemeRole()] || RoleThemeMap.default;
}

/**
 * @param key css变量名
 * @param el 所在元素
 * @returns {String} 返回css变量的值
 */
export function getCssVariable(
  key: string,
  el = document.documentElement
): string {
  return getComputedStyle(el).getPropertyValue(key).trim();
}

export function getCosImageUrl(fileName: string): string {
  return (
    import.meta.env.VITE_APP_COS_URL +
    "/website/mkt.weiling.cn/images/" +
    fileName
  );
}

export function getCosThemeImageUrl(fileName: string): string {
  return (
    import.meta.env.VITE_APP_COS_URL +
    "/website/mkt.weiling.cn/images/" +
    getThemeName() +
    "/" +
    fileName
  );
}

/**
 * 通过imgurl下载图片
 * author vastwu
 */
export const downloadImage = (imageUrl: string, name: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function (): void {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      context.drawImage(image, 0, 0, image.width, image.height);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.download = name;
      a.href = url;
      a.dispatchEvent(event);
      ElMessage({
        message: "下载成功",
        type: "success",
      });
      resolve(image);
    };
    image.src = imageUrl;
  });
};

export const arrayCompare = (source: any, target: any) => {
  return (
    source.length == target.length &&
    [...source].sort().toString() == [...target].sort().toString()
  );
};

export const formatCosUrl = (url: string) => {
  return `https://wlmvp-cos.weiling.cn${url}`;
};

/**
 * 字节转成 B KB MB GB
 * @param func 目标函数
 */
export const sizeTostr = (byte: any): string => {
  const bytes = parseInt(byte);
  if (bytes === 0 || !bytes) return "0 B";
  const k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};

/**
 * 资料库详情iframe url
 * @param material_id 资料id
 * @param source_type 资料来源 user/corp
 */
export const splicingMonitorFile = (
  material_id: string,
  source_type: any,
  need_auth = true,
  channel?: string,
  action_list?: string
) => {
  store = useUserStore();
  const corp_id: string = getQueryVariable("corp_id");
  const agent_id: string =
    getQueryVariable("agent_id") || store.userInfo.agent_id;
  const rc_id: string = "";

  const params = {
    corp_id,
    agent_id,
    material_id,
    source_type,
    channel,
    rc_id,
    action_list,
  };
  if (need_auth) {
    return `${
      import.meta.env.VITE_APP_DOMAIN
    }/h5/monitorFile/index.html?${JSON.stringify(params)}`;
  } else {
    return `${
      import.meta.env.VITE_APP_DOMAIN
    }/h5/monitorFile/index.html?${JSON.stringify(params)}&need_auth=false`;
  }
};

/**
 * 设置storage
 * @param value
 */
export const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * 获取storage
 * @param value
 */
export const getStorage = (key: string) => {
  const temp: any = localStorage.getItem(key);
  if (temp === null || typeof temp === "undefined") return null;
  return JSON.parse(temp);
};

/**
 * 根据url后拽判断文件类型
 */
export const judgeFileType = (fileName: string): string => {
  // 后缀获取
  let suffix = "";
  // 获取类型结果
  let result = "";
  try {
    const flieArr = fileName.split(".");
    suffix = flieArr[flieArr.length - 1];
  } catch (err) {
    suffix = "";
  }
  // fileName无后缀返回 false
  if (!suffix) {
    return "";
  }
  suffix = suffix.toLocaleLowerCase();
  // 图片格式
  const imglist = ["png", "jpg", "jpeg", "bmp", "gif"];
  // 进行图片匹配
  result = imglist.find((item) => item === suffix) || "";
  if (result) {
    return "image";
  }
  // 匹配 pdf
  const pdflist = ["pdf"];
  result = pdflist.find((item) => item === suffix) || "";
  if (result) {
    return "pdf";
  }
  // 匹配 视频
  const videolist = ["mp4", "avi", "mov", "MP4", "AVI", "MOV"];
  result = videolist.find((item) => item === suffix) || "";
  if (result) {
    return "video";
  }
  // 其他 文件类型
  return "";
};

/**
 * @description 检测图片文件是否为完整图片
 * @param { File } 要传入的图片文件
 * @return { Boolean } 返回布尔值
 */
export const checkCompletePicture = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (event: any) => {
      const blob = new Blob([event.target.result], { type: file.type });
      window.URL = window.URL || window.webkitURL;
      const blobURL = window.URL.createObjectURL(blob);
      const img = new Image();
      img.src = blobURL;
      img.onload = () => {
        if (img.width > 0 && img.height > 0) resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
    };
  });
};

/**
 * url 下载url
 * filename 下载文件名称
 */
export const downloadFile = function (
  url: string,
  params: any,
  isIframe?: boolean
): void {
  function createTagA(href: any, download?: any, target?: any) {
    const a = document.createElement("a");
    a.href = href;
    download && (a.download = download);
    target && (a.target = target);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  const ua: any = window.navigator.userAgent.toLowerCase();
  const wxwork =
    ua.match(/MicroMessenger/i) == "micromessenger" &&
    ua.match(/wxwork/i) == "wxwork";
  const isObject = Object.prototype.toString.call(params) === "[object Object]";
  if (!params || (isObject && !Object.keys(params).length)) {
    createTagA(url, "", wxwork && isMac && isIframe ? "_blank" : "");
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.responseType = "blob";
  xhr.onload = function (res) {
    if (this.status !== 200) return;
    const type: any = xhr.getResponseHeader("Content-Type");
    const disposition: any = xhr.getResponseHeader("Content-disposition");
    const filename = decodeURIComponent(disposition.split("=")[1]);
    const blob = new Blob([this.response], { type: type });
    if (typeof (window.navigator as any).msSaveBlob !== "undefined") {
      /** For IE >=IE10*/
      (window.navigator as any).msSaveBlob(blob, filename);
      return;
    }
    /** For Non-IE (chrome, firefox)*/
    const URL = window.URL || window.webkitURL;
    const objectUrl = URL.createObjectURL(blob);
    if (!filename) {
      window.location.href = objectUrl;
      return;
    }
    const a = document.createElement("a");
    if (!(wxwork && isMac)) {
      if (typeof a.download === "undefined") {
        window.location.href = objectUrl;
        return;
      }
      //为了兼容safari浏览器
      createTagA(objectUrl, filename.replace(/^utf-8''/, ""));
      return;
    }
    const files = new window.File([blob], filename, { type: blob.type });
    const { onMacFileAfterRead } = useUpload();
    onMacFileAfterRead(
      files,
      () => {},
      () => {}
    ).then((res: any) => {
      createTagA(
        res?.cos_url,
        filename.replace(/^utf-8''/, ""),
        isIframe ? "_blank" : ""
      );
    });
  };
  xhr.send(JSON.stringify(params));
};
export const isWXWork = () => {
  const ua: any = window.navigator.userAgent;
  return /wxwork/i.test(ua) && /micromessenger/i.test(ua);
};

// 获取cookie
export const getCookie = (key: string) => {
  const result: any = {};
  const keyValuePairs = document.cookie.split("; ");
  for (const pair of keyValuePairs) {
    const [key, value] = pair.split("=");
    result[key] = value;
  }
  return result[key];
};
