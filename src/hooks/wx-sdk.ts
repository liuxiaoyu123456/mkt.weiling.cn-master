import { ref, watch } from "vue";
import { useWxSDK } from "@/stores/wx-sdk";
import { storeToRefs } from "pinia";

export const useOpenData = () => {
  const opendata = ref();
  const shouldUpdate = ref(false);
  const wxSDKStore = useWxSDK();
  const { agentConfigCache, checking } = storeToRefs(wxSDKStore);
  const { addAgentconfig } = wxSDKStore;
  if (
    !agentConfigCache.value.includes(location.href) &&
    checking.value != location.href
  ) {
    addAgentconfig(location.href);
  }

  watch([opendata, checking, shouldUpdate], () => {
    if (opendata.value && !checking.value) {
      WWOpenData.bind(opendata.value);
      shouldUpdate.value = false;
    }
  });
  const update = () => {
    shouldUpdate.value = true;
  };
  return {
    opendata,
    update,
  };
};
