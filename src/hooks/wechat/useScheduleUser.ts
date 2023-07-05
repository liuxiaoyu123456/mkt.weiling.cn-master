import { reactive, toRefs } from "vue";
import { arrayCompare } from "@/utils/utils";

const useScheduleUser = () => {
  const state = reactive<{
    weekList: any;
  }>({
    weekList: [
      {
        name: "一",
        active: false,
        id: 0,
      },
      {
        name: "二",
        active: false,
        id: 1,
      },
      {
        name: "三",
        active: false,
        id: 2,
      },
      {
        name: "四",
        active: false,
        id: 3,
      },
      {
        name: "五",
        active: false,
        id: 4,
      },
      {
        name: "六",
        active: false,
        id: 5,
      },
      {
        name: "日",
        active: false,
        id: 6,
      },
    ],
  });

  // 00:30-1 | 23:30-47
  const initHalfTime = (time: any) => {
    if (!time) return;
    const date = time.split(":");
    if (date[1] == "30") {
      return date[0] * 2 + 1;
    } else {
      return date[0] * 2;
    }
  };
  // 0-00:00  1-00:30  2-01:30
  const formatHalfTime = (index: any) => {
    if (!index) {
      return "00:00";
    } else {
      const h = parseInt(String(index / 2)).toString();
      const hour = h.length > 1 ? h : `0${h}`;
      const m = index % 2 == 0 ? "00" : "30";
      return `${hour}:${m}`;
    }
  };
  const timeIntervalWeek = (weekday_index: any = []) => {
    if (!weekday_index) return;
    let week = "";
    if (arrayCompare([0, 1, 2, 3, 4], weekday_index)) {
      week = "周一～周五";
    } else if (arrayCompare([0, 1, 2, 3, 4, 5, 6], weekday_index)) {
      week = "周一～周日";
    } else {
      const list = state.weekList.filter((res: any) => {
        return weekday_index.includes(res.id);
      });
      week =
        (list.length && "周" + list.map((res: any) => res.name).join("、")) ||
        "";
    }

    return week;
  };
  const formatCutTime = (start: any, end: any) => {
    if (start == "00:00" && end == "00:00") {
      return "全天";
    } else {
      return `${start}-${end}`;
    }
  };

  return {
    ...toRefs(state),
    initHalfTime,
    formatHalfTime,
    timeIntervalWeek,
    formatCutTime,
  };
};
export default useScheduleUser;
