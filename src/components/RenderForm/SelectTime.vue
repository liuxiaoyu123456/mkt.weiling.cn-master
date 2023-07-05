<template>
  <div class="flex-row cross-center">
    <WlPopover
      v-model:visible="popoverValue"
      placement="bottom-start"
      popper-class="popper_width_initial"
      width="74"
      trigger="manual"
      :disabled="onlyShow"
    >
      <div class="time_wrap flex-column">
        <p class="time_item" :class="{ active: type == 1 }" @click="onClick(1)">
          全天
        </p>
        <p class="time_item" :class="{ active: type == 2 }" @click="onClick(2)">
          自定义
        </p>
      </div>
      <template v-slot:reference>
        <span @click="popoverValue = !popoverValue" class="time_day">{{
          type == 1 ? "全天" : onlyShow ? "" : "自定义"
        }}</span>
      </template>
    </WlPopover>
    <div class="time_picker flex-row cross-centers" v-if="type == 2">
      <span class="dian flex-center" v-if="onlyShow">|</span>
      <span class="dian flex-center" v-else>:</span>
      <div class="time_picker_select flex-center">
        {{ startTime || "开始时间" }}
        <el-time-select
          :start="startOptions && startOptions.start"
          :end="startOptions && startOptions.end"
          :step="startOptions && startOptions.step"
          :min-time="startOptions && startOptions.minTime"
          :max-time="startOptions && startOptions.maxTime"
          class="el_time_select"
          placeholder="起始时间"
          popper-class="timer_select_code"
          @change="onTimeChange"
          :clearable="false"
          :disabled="onlyShow"
          v-model="startTime"
        >
        </el-time-select>
      </div>
      <span class="line flex-center">—</span>
      <div class="time_picker_select flex-center">
        {{ endTime || "结束时间" }}
        <el-time-select
          :start="endOptions && endOptions.start"
          :end="endOptions && endOptions.end"
          :step="endOptions && endOptions.step"
          :min-time="endOptions && endOptions.minTime"
          :max-time="endOptions && endOptions.maxTime"
          popper-class="timer_select_code"
          class="el_time_select"
          placeholder="结束时间"
          @change="onTimeChange"
          v-model="endTime"
          :disabled="onlyShow"
          :clearable="false"
        >
        </el-time-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  type SetupContext,
  toRefs,
  watch,
} from "vue";
export default defineComponent({
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    onlyShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any, { emit }: SetupContext) {
    // 00:30-1 | 23:30-47
    const initHalfTime = (time: any) => {
      if (!time) return;
      const date = time.split(":");
      if (time == "24:00") return 0;
      if (date[1] == "30") {
        return date[0] * 2 + 1;
      } else {
        return date[0] * 2;
      }
    };
    // 0-00:00  1-00:30  2-01:30
    const formatHalfTime = (index: any, isEnd = false) => {
      if (isEnd && !index) {
        return "24:00";
      }
      if (!index) {
        return "00:00";
      } else {
        let h = parseInt(String(index / 2)).toString();
        let hour = h.length > 1 ? h : `0${h}`;
        let m = index % 2 == 0 ? "00" : "30";
        return `${hour}:${m}`;
      }
    };
    const state = reactive<{
      startTime: string;
      endTime: string;
      type: number;
      popoverValue: boolean;
    }>({
      startTime: "",
      endTime: "",
      type: 1,
      popoverValue: false,
    });

    const Computed = {
      startOptions: computed(() => {
        return {
          start: "00: 00",
          step: "00:30",
          end: state.endTime || "24:00",
          maxTime: state.endTime || "24:00",
          minTime: "",
        };
      }),
      endOptions: computed(() => {
        return {
          maxTime: "",
          minTime: state.startTime || "00:00",
          start: "00:00",
          step: "00:30",
          end: "24: 00",
        };
      }),
      emitData: computed(() => {
        return {
          type: state.type,
          startTime: state.startTime,
          endTime: state.endTime,
          startTimeIndex: initHalfTime(state.startTime),
          endTimeIndex: initHalfTime(state.endTime),
        };
      }),
    };
    const Methods = {
      onClick(type: any) {
        if (props.onlyShow) {
          return;
        }
        if (type == 2) {
          state.startTime = "09:00";
          state.endTime = "18:00";
        }
        state.type = type;
        state.popoverValue = false;
        emit("onTimeChange", Computed.emitData.value);
      },
      onTimeChange() {
        emit("onTimeChange", Computed.emitData.value);
      },
    };
    watch(
      () => props.data,
      (res) => {
        const { start_half_hour_index, end_half_hour_index } = res;
        state.startTime = formatHalfTime(start_half_hour_index);
        state.endTime = formatHalfTime(end_half_hour_index, true);
        if (!start_half_hour_index && !end_half_hour_index) {
          state.type = 1;
        } else {
          state.type = 2;
        }
      },
      {
        immediate: true,
      }
    );
    return {
      ...toRefs(state),
      ...Methods,
      ...Computed,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep() {
  .el-popover {
    min-width: initial !important;
  }
  .el_time_select {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    input {
      padding: 0;
    }
  }
  .aa {
    width: 100px !important;
  }
}
.time_picker {
  // height: 36px;
  // padding-right: 8px;
  .time_picker_select {
    position: relative;
    padding: 0 8px;
    cursor: text;
  }
  .dian {
    color: #000000;
    // margin-right: 8px;
  }
  .line {
    color: #000000;
    // margin: 0 12px;
  }
}
.time_wrap {
  position: relative;
  margin-left: 10px;
  .time_item {
    color: #000000;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    &.active {
      color: var(--wl-primary-color);
    }
  }
}
.time_day {
  display: inline-block;
  padding: 0 8px;
  // height: 36px;
  // line-height: 36px;
  cursor: pointer;
}
</style>
