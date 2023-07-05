/// <reference types="vite/client" />

import { getCosImageUrl, getCosThemeImageUrl } from "@/utils/utils";
declare module "vue" {
  interface ComponentCustomProperties {
    getCosImageUrl: typeof getCosImageUrl;
  }
  interface GlobalComponents {
    WlSvg: typeof import("@wltech/svg")["default"];
  }
}
declare global {
  declare const wx: any;
  declare const WWOpenData: any;
}
