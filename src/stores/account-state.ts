import { defineStore } from "pinia";
import { payGetJktBalance } from "@/api";
import { reactive, toRefs } from "vue";
import dayjs from "dayjs";
export const useAccountState = defineStore("account-state", () => {
  const getDefaultState = () => ({
    status: -1,
    balance: 0,
    haveMiniApp: false,
    miniAppNum: 0,
    haveSolution: false,
    lastDay: dayjs().valueOf(),
    yesterDayAdd: 0,
    allAdd: 0,
    loginFlag: true,
  });
  const state = reactive({
    accountState: getDefaultState(),
  });
  const Actions = {
    updateAccountState: async () => {
      try {
        const res = await payGetJktBalance({});
        state.accountState = res.data
          ? { ...res.data, balance: Math.floor(res.data.balance / 100) }
          : getDefaultState();
      } catch {
        state.accountState = getDefaultState();
      }
    },
  };
  return {
    ...toRefs(state),
    ...Actions,
  };
});
