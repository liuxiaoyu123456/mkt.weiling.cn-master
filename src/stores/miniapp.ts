import { defineStore } from "pinia";

export const useMiniappStore = defineStore("miniapp", {
  state: () => ({
    authorizedAppId: "", // 公众号id
    authorizedAppName: "", // 公众号名称
    miniappName: "", // 小程序名称
    miniappUrl: "", // 上传的图片
    keey: "", // 公众号授权状态
    miniappKeey: "", // 小程序授权状态
    link: "", // 公众号授权链接
    appLink: "", // 小程序授权链接
    file: undefined, // 上传的文件
    miniappId: "", // 小程序id
    isDialog: false, // 完成后的弹框
  }),
  getters: {
    getters_authorized_id: (state: any) => state.authorizedAppId,
    getters_authorized_name: (state: any) => state.authorizedAppName,
    getters_miniapp_name: (state: any) => state.miniappName,
    getters_miniapp_url: (state: any) => state.miniappUrl,
    getters_authorized_keey: (state: any) => state.keey,
    getters_miniapp_keey: (state: any) => state.miniappKeey,
    getters_link: (state: any) => state.link,
    getters_app_link: (state: any) => state.appLink,
    getters_file: (state: any) => state.file,
    getters_miniapp_id: (state: any) => state.miniappId,
    getters_is_dialog: (state: any) => state.isDialog,
  },
  actions: {
    onGetOfficialAccount(params: any, type: string) {
      if (type == "inputKey") {
        return (this.authorizedAppId = params);
      }
      if (type == "keyName") {
        return (this.authorizedAppName = params);
      }
    },
    miniappInformation(params: any, type: string) {
      if (type == "name") {
        return (this.miniappName = params);
      }
      if (type == "url") {
        return (this.miniappUrl = params);
      }
    },
    setMiniappKeey(params: any, type: string) {
      if (type == "official") {
        return (this.keey = params);
      } else {
        return (this.miniappKeey = params);
      }
    },
    setLink(params: any, type: string) {
      if (type == "app") {
        return (this.appLink = params);
      } else {
        return (this.link = params);
      }
    },
    setFile(params: any) {
      return (this.file = params);
    },
    setMiniAppId(params: string) {
      return (this.miniappId = params);
    },
    setDialog(params: boolean) {
      return (this.isDialog = params);
    },
  },
});
