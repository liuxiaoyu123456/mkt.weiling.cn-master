import { defineStore, storeToRefs } from "pinia";
import { getSDKTicket } from "@/api";
import { reactive, toRefs } from "vue";
import { useUserStore } from "@/stores";
export const useWxSDK = defineStore("wx-sdk", () => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { getCurrentUser } = userStore;
  const state = reactive({
    agentConfigCache: [] as string[],
    checking: "",
  });
  const Actions = {
    addAgentconfig: (href: string) => {
      state.checking = href;
      // return Promise.all([
      //   getSDKTicket({
      //     url: href,
      //     useTp: 1,
      //   }).then(({ data }) => {
      //     const { agentSignData, signData } = data;
      //     return new Promise((resove) => {
      //       wx.config({
      //         jsApiList: [],
      //         beta: true,
      //         debug: true,
      //         ...signData,
      //       });
      //       resove(agentSignData);
      //     });
      //   }),
      //   Promise.resolve(user.value ? "" : getCurrentUser()),
      // ])
      return Promise.resolve(user.value ? "" : getCurrentUser())
        .then(() => {
          return getSDKTicket({
            corpId: (user.value as any).corp.corpId,
            url: href,
            useTp: 1,
          }).then(({ data }) => {
            const { agentSignData, signData } = data;
            return new Promise((resove) => {
              wx.config({
                jsApiList: [],
                beta: true,
                debug: false,
                ...signData,
              });
              resove(agentSignData);
            });
          });
        })
        .then((agentSignData: any) => {
          return new Promise((success, fail) => {
            wx.agentConfig({
              ...agentSignData,
              jsApiList: [],
              agentid: (user.value as any).agentIdThird,
              corpid: (user.value as any).corp.corpId,
              success,
              fail,
            });
          });
        })
        .then(() => {
          state.agentConfigCache.push(href);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          state.checking = "";
        });
    },
  };
  return {
    ...toRefs(state),
    ...Actions,
  };
});
