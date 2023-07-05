import { computed, nextTick, reactive, ref, toRefs, watch } from "vue";
import { cloneDeep, debounce, isEqual, snakeCase } from "lodash-es";

export const useForm = (
  defaultModel: any,
  {
    debounce: debounceTime,
    immediate,
    action,
  }: {
    debounce?: number;
    immediate?: boolean;
    action?: any;
  }
) => {
  const model = ref(defaultModel || {});
  const realAction = (val: any) => {
    action && action(val);
  };
  watch(model, debounceTime ? debounce(realAction, debounceTime) : realAction, {
    immediate,
    deep: true,
  });
  return {
    model,
  };
};
interface Pagination {
  page: number;
  limit: number;
  total: number;
  type: "limit" | "page";
}
export const usePagination = (defaultPagination: Pagination, action: any) => {
  const state = reactive({
    page: defaultPagination?.page || 1,
    limit: defaultPagination?.limit || 10,
    total: 0,
    type: "page",
  });
  watch([() => state.page, () => state.type], (pre, curr) => {
    const [prePage] = pre;
    const [currPage] = curr;
    if (state.type == "page" && prePage == currPage) {
      return;
    }
    state.type = "page";
    action && action({ ...state });
  });
  watch(
    () => state.limit,
    () => {
      state.type = "limit";
      state.page = 1;
    }
  );
  return {
    ...toRefs(state),
  };
};
interface FilterTableOption {
  defaultModel?: any;
  defalutPagination?: any;
  getColumns: (param: any) => any[];
}
export type ApiFnType = (params: {
  page?: number;
  limit?: number;
  model?: any;
  sort?: any;
}) => Promise<[any[], number]>;
interface Sort {
  prop: string;
  order: 1 | 2;
}
export const useFilterTable = (
  apiFn: ApiFnType,
  { getColumns, defaultModel, defalutPagination }: FilterTableOption
) => {
  const state = reactive({
    loading: true,
    data: [] as any[],
    sort: [] as Sort[],
    shouldFetch: false,
  });
  const columns = computed(() => getColumns(state));
  const fetchData = async () => {
    try {
      state.loading = true;
      const [dataList, totalCount] = await apiFn({
        ...state,
        model: model.value,
        page: page.value,
        limit: limit.value,
      });

      state.data = dataList || [];
      total.value = +totalCount || 0;
    } catch (err) {
      console.log(err);
      state.data = [];
      total.value = 0;
    } finally {
      state.loading = false;
    }
  };

  const { model } = useForm(defaultModel, {
    debounce: 600,
    action: () => {
      state.shouldFetch = true;
      page.value = 1;
    },
    immediate: true,
  });
  const { page, limit, total } = usePagination(defalutPagination, () => {
    state.shouldFetch = true;
  });
  const handleSortChange = (_0: any, _1: any, { field, order }: any) => {
    if (order) {
      state.sort = [
        {
          prop: snakeCase(field),
          order: order === "ascend" ? 1 : 2,
          // [field]: order==='ascend'?1:2,
        },
      ];
    } else {
      state.sort = [];
    }
  };
  watch(
    () => state.sort,
    () => {
      page.value = 1;
      state.shouldFetch = true;
    }
  );
  watch(
    () => state.shouldFetch,
    () => {
      if (!state.shouldFetch) {
        return;
      }
      fetchData();
      nextTick(() => {
        state.shouldFetch = false;
      });
    }
  );
  return {
    ...toRefs(state),
    page,
    limit,
    total,
    model,
    columns,
    handleSortChange,
  };
};
