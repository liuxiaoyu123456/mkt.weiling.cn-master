import { defineStore } from "pinia";
import { getXwInfo } from "@/api";
import { ref } from "vue";

export const useHelpCenter = defineStore("help-center", () => {
  const getDefaultState = () => ({
    userVo: {} as Record<string, any>,
    friendFlag: false,
    xwCodeUrl: "",
    showHelp: false,
    showInvoiceHelper: false,
  });
  const helpCenterState = ref(getDefaultState());
  const Actions = {
    updateHelpCenterState: async () => {
      try {
        const res = await getXwInfo({ scene: "contact_xw_for_help_pc" });
        helpCenterState.value = { ...helpCenterState.value, ...res.data };
      } catch {
        helpCenterState.value = getDefaultState();
      }
    },
  };
  return {
    helpCenterState,
    ...Actions,
  };
});
