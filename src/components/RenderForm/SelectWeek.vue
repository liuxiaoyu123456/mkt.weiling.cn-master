<template>
  <el-popover
    placement="bottom-start"
    popper-class="popper_width_initial"
    width="120"
    trigger="click"
  >
    <div class="week_wrap">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-checkbox-group
        v-model="checkedWeekDays"
        :min="1"
        @change="handleCheckedCitiesChange"
        class="flex-column"
      >
        <el-checkbox v-for="item in weeks" :label="item.id" :key="item.id">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <template v-slot:reference>
      <slot />
    </template>
  </el-popover>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  props: {
    checkedWeeks: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props: any, { emit }: SetupContext) {
    let weekList = [
      {
        id: 0,
        name: "周一",
      },
      {
        id: 1,
        name: "周二",
      },
      {
        id: 2,
        name: "周三",
      },
      {
        id: 3,
        name: "周四",
      },
      {
        id: 4,
        name: "周五",
      },
      {
        id: 5,
        name: "周六",
      },
      {
        id: 6,
        name: "周日",
      },
    ];
    const state = reactive<{
      checkAll: boolean;
      checkedWeekDays: Array<any>;
      weeks: Array<any>;
      isIndeterminate: boolean;
    }>({
      checkAll: false,
      checkedWeekDays: [],
      weeks: weekList,
      isIndeterminate: true,
    });
    const Methods = {
      handleCheckAllChange(val: any) {
        state.checkedWeekDays = val ? [0, 1, 2, 3, 4, 5, 6] : [0];
        state.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value: any) {
        let checkedCount = value.length;
        state.checkAll = checkedCount === state.weeks.length;
        state.isIndeterminate =
          checkedCount > 0 && checkedCount < state.weeks.length;
      },
    };
    watch(
      () => props.checkedWeeks,
      (val) => {
        state.checkedWeekDays = val;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => state.checkedWeekDays,
      (val) => {
        emit("onWeeksChange", val);
      }
    );
    return {
      ...toRefs(state),
      ...Methods,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep() {
  .el-checkbox__label {
    margin-left: 12px;
  }
  .el-checkbox {
    height: 34px;
  }
}
.week_wrap {
  margin-left: 10px;
}
</style>
