import { defineStore } from "pinia";
import { get_business_tenant_config } from "@/api";
const stageFailCode = 99; //丢单
//  const stageWinningCode = 100       //赢单
//  const failReasonOtherCode = 99     //丢单原因 other
//  const businessAccessTypes = {         //商机创建入口类型 1客户 2访客 3线索 4群 5公司
//     CUSTOMER: '1',
//     VISITOR: '2',
//     CLUE: '3',
//     GROUP: '4',
//     COMPANY: '5'
// }

export const useBussiness = defineStore("bussiness", {
  state: () => ({
    state_business_stage_list: [],
  }),
  getters: {
    // 商机状态可选列表
    getter_business_stage_list(state) {
      return state.state_business_stage_list;
    },
  },
  actions: {
    async action_business_stage_list() {
      return get_business_tenant_config({ name: "business_stage" }).then(
        (res: any) => {
          const { data = {} } = res;
          data.forEach((element: any) => {
            element.key = Number(element.key);
          });
          data.sort((a: any, b: any) => {
            if (b.key == stageFailCode) {
              return -1;
            }
            return 0;
          });
          this.state_business_stage_list = data;
        }
      );
    },
  },
});
