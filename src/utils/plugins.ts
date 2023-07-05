import { ElMessage } from "element-plus";
import "element-plus/es/components/message/style/css";
import { WlMessageBox } from "wltech-ui";
import "wltech-ui/es/components/message-box/style/css";
import * as directives from "@/utils/directives";

// import "element-plus/es/components/loading/style/css";

export default {
  install(Vue: any) {
    Object.keys(directives).forEach((key) => {
      // @ts-ignore
      Vue.directive(key, directives[key]);
    });
  },
};

export function initPlugin(app: any) {
  app.config.globalProperties.$message = ElMessage;
  app.config.globalProperties.$confirm = WlMessageBox.confirm;
  app.config.globalProperties.$alert = WlMessageBox.alert;

  // app.config.globalProperties.Loading = ElLoading.service

  // app.config.globalProperties.$mainLoading = (target: HTMLElement | string) => {
  //   return ElLoading.service({
  //     target,
  //     fullscreen: false,
  //     lock: true,
  //   })
  // }
}
