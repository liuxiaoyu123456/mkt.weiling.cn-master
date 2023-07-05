import { defineStore } from "pinia";
import { getMaterialGroupCount } from "@/api";

export const useMaterial = defineStore("material", {
  state: () => ({
    material_group_list: {},
  }),
  getters: {
    getters_material_group_by_type:
      (state) =>
      (type = "") => {
        const list: any = state.material_group_list;
        if (!type)
          return {
            count: 0,
            data: [],
          };
        if (type == "user") {
          return {
            count: list.personCount,
            data: list.personCountList || [],
          };
        } else if (type == "corp") {
          return {
            count: list.corpCount,
            data: list.corpCountList || [],
          };
        }
      },
  },
  actions: {
    onGetMaterialGroupList(params: any) {
      return getMaterialGroupCount(params).then((res) => {
        const { corpCount, personCount, corpCountList, personCountList } =
          res.data || {};
        let obj = {};
        if (params.only_person) {
          obj = {
            personCount,
            personCountList,
          };
        } else {
          obj = {
            corpCount,
            corpCountList,
          };
        }
        this.material_group_list = obj;
      });
    },
  },
});
