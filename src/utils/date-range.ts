import { pick } from "lodash-es";
import dayjs from "dayjs";
// 全部shortcutMap
const mixedMap = {
  today: {
    text: "今天",
    value: () => {
      return [dayjs().startOf("d").valueOf(), dayjs().endOf("d").valueOf()];
    },
  },
  yesterday: {
    text: "昨天",
    value: () => {
      return [
        dayjs().subtract(1, "d").startOf("d").valueOf(),
        dayjs().subtract(1, "d").endOf("d").valueOf(),
      ];
    },
  },
  tomorrow: {
    text: "明天",
    value: () => {
      return [
        dayjs().add(1, "d").startOf("d").valueOf(),
        dayjs().add(1, "d").endOf("d").valueOf(),
      ];
    },
  },
  thisWeek: {
    text: "本周",
    value: () => {
      return [dayjs().startOf("w").valueOf(), dayjs().endOf("w").valueOf()];
    },
  },
  lastWeek: {
    text: "上周",
    value: () => {
      return [
        dayjs().subtract(1, "w").startOf("w").valueOf(),
        dayjs().subtract(1, "w").endOf("w").valueOf(),
      ];
    },
  },
  nextWeek: {
    text: "下周",
    value: () => {
      return [
        dayjs().add(1, "w").startOf("w").valueOf(),
        dayjs().add(1, "w").endOf("w").valueOf(),
      ];
    },
  },
  thisMonth: {
    text: "本月",
    value: () => {
      return [dayjs().startOf("M").valueOf(), dayjs().endOf("M").valueOf()];
    },
  },
  lastMonth: {
    text: "上月",
    value: () => {
      return [
        dayjs().subtract(1, "M").startOf("M").valueOf(),
        dayjs().subtract(1, "M").endOf("M").valueOf(),
      ];
    },
  },
  nextMonth: {
    text: "下月",
    value: () => {
      return [
        dayjs().add(1, "M").startOf("M").valueOf(),
        dayjs().add(1, "M").endOf("M").valueOf(),
      ];
    },
  },
  thisQuarter: {
    text: "本季度",
    value: () => {
      return [dayjs().startOf("Q").valueOf(), dayjs().endOf("Q").valueOf()];
    },
  },
  lastQuarter: {
    text: "上季度",
    value: () => {
      return [
        dayjs().subtract(1, "Q").startOf("Q").valueOf(),
        dayjs().subtract(1, "Q").endOf("Q").valueOf(),
      ];
    },
  },
  nextQuarter: {
    text: "下季度",
    value: () => {
      return [
        dayjs().add(1, "Q").startOf("Q").valueOf(),
        dayjs().add(1, "Q").endOf("Q").valueOf(),
      ];
    },
  },
  thisYear: {
    text: "今年",
    value: () => {
      return [dayjs().startOf("y").valueOf(), dayjs().endOf("y").valueOf()];
    },
  },
  lastYear: {
    text: "去年",
    value: () => {
      return [
        dayjs().subtract(1, "y").startOf("y").valueOf(),
        dayjs().subtract(1, "y").endOf("y").valueOf(),
      ];
    },
  },
  nextYear: {
    text: "明年",
    value: () => {
      return [
        dayjs().add(1, "y").startOf("y").valueOf(),
        dayjs().add(1, "y").endOf("y").valueOf(),
      ];
    },
  },
};
// 默认shortcutMap
const shortcutsDefaultMap = pick(mixedMap, [
  "today",
  "yesterday",
  "thisWeek",
  "lastWeek",
  "thisMonth",
  "lastMonth",
  "thisQuarter",
  "lastQuarter",
  "thisYear",
  "lastYear",
]);

// 未来shortcutMap
const shortcutsFutureMap = pick(mixedMap, [
  "tomorrow",
  "nextWeek",
  "nextMonth",
  "nextQuarter",
  "nextYear",
]);

// 年范围shortcutMap
const yearFutureMap = pick(mixedMap, ["thisYear", "lastYear", "nextYear"]);

// 月范围shortcutMap
const monthFutureMap = pick(mixedMap, [
  "thisMonth",
  "lastMonth",
  "nextMonth",
  "thisQuarter",
  "lastQuarter",
  "nextQuarter",
  "thisYear",
  "lastYear",
  "nextYear",
]);

export const getShortcutsMap = (
  opt: Array<keyof typeof mixedMap> | "future" | "both" | "year" | "month"
) => {
  if (Array.isArray(opt)) {
    return pick(mixedMap, opt);
  }
  switch (opt) {
    case "future":
      return shortcutsFutureMap;
    case "both":
      return mixedMap;
    case "year":
      return yearFutureMap;
    case "month":
      return monthFutureMap;
    default:
      return shortcutsDefaultMap;
  }
};
export const getShortcutText = (
  formValue: Array<number | "">,
  shortcutsMap: Partial<typeof mixedMap>
) => {
  if (!formValue || !formValue.length) {
    return "";
  }
  for (const [key, val] of Object.entries(shortcutsMap)) {
    if (
      formValue.every((item, index) =>
        dayjs(+item).isSame(dayjs(val.value()[index]), "d")
      )
    ) {
      return [val.text, key];
    }
  }
  return "";
};

// datarange组件数据按照shortcut刷新数据
export const shortcut2daterange = (shortcutKey: keyof typeof mixedMap) => {
  return mixedMap[shortcutKey].value();
};
// shortcut2daterange 参数合法值
export const enum shortcutKeyMap {
  TODAY = "today",
  YESTERDAY = "yesterday",
  TOMORROW = "tomorrow",
  THIS_WEEK = "thisWeek",
  LAST_WEEK = "lastWeek",
  NEXT_WEEK = "nextWeek",
  THIS_MONTH = "thisMonth",
  LAST_MONTH = "lastMonth",
  NEXT_MONTH = "nextMonth",
  THIS_QUARTER = "thisQuarter",
  LAST_QUARTER = "lastQuarter",
  NEXT_QUARTER = "nextQuarter",
  THIS_YEAR = "thisYear",
  LAST_YEAR = "lastYear",
  NEXT_YEAR = "nextYear",
}
