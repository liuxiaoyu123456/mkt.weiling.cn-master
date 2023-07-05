import { defineStore } from "pinia";
import { list_clue_channel } from "@/api";

const loadings: any = {};
export const useClueChannel = defineStore("clueChannel", {
  state: () => ({
    state_clue_channel: [],
    firstLittleTips: "yes",
    globalMsg: "",
  }),
  getters: {
    getter_clue_channel: (state) => {
      const { state_clue_channel = [] } = state;
      return state_clue_channel;
    },
    getter_first_tips: (state: any) => {
      return state.firstLittleTips;
    },
    getter_globalMsg: (state: any) => {
      return state.globalMsg;
    },
  },
  actions: {
    action_clue_channel(params: any) {
      const key = "action_clue_channel__" + JSON.stringify(params);
      if (!loadings[key]) {
        loadings[key] = list_clue_channel(params).then((res: any) => {
          const { data = {} } = res.data;
          const { data_list = [] } = data;
          this.state_clue_channel = data_list;
        });
      }
      return loadings[key];
    },
    mutation_first_tips(val: any) {
      this.firstLittleTips = val;
    },
    mutation_globalMsg(val: any) {
      this.globalMsg = val;
    },
  },
});
