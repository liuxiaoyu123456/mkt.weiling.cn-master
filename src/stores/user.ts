import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { getCurrentUser, get_authed_dept_list } from "@/api";
const loadings: any = {};

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    authedStaffList: [], // 权限内部门树
  }),
  getters: {
    userInfo: (state) => state.user,
    getter_role_type_arr: (state: any): number => {
      const { roles = [] } = state.user;
      const rolesArr = roles.map((res: any) => res.roleType);
      return rolesArr;
    },
    // 判断是否是管理员或超管
    getter_is_administrator: (state: any): boolean => {
      const arr = [2, 3];
      const { roles = [] } = state.user;
      const rolesArr = roles.map((res: any) => res.roleType);
      return rolesArr.find((res: any) => arr.includes(res)) && true;
    },
    getters_autheds_staff_list: (state: any) => {
      const list = state.authedStaffList.filter(
        (res: any) => res.leafType == 2
      );
      const newL = list.map((res: any) => {
        return {
          ...res.staffInfo,
        };
      });
      const newRL: any = [];
      for (const item of newL) {
        if (!newRL.find((res: any) => res.id == item.id)) {
          newRL.push(item);
        }
      }
      return newRL;
    },
  },
  actions: {
    getCurrentUser() {
      return getCurrentUser().then((res) => {
        this.user = res.data;
        return res;
      });
    },
    getAuthedDeptList(params: any) {
      const key = "authed_staff_list__" + JSON.stringify(params);
      if (!loadings[key])
        loadings[key] = get_authed_dept_list(params).then((res: any) => {
          this.authedStaffList = res.data || [];
        });
      return loadings[key];
    },
  },
});
