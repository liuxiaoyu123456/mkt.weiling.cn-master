import dayjs from "dayjs";

export const useLineChart = ({ data }: any) => {
  return {
    dataset: {
      source:
        data.map((i: any) => ({
          ...i,
          time: dayjs(+i.timestamp).format("MM/DD"),
        })) || [],
      dimensions: ["time", "todayCount", "customerRate", "totalCount"],
    },
    title: {
      text: "",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.6)",
    },
    axisPointer: {
      lineStyle: {
        type: "solid",
        width: 24,
        cap: "round",
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(28, 159, 255, 0)",
            },
            {
              offset: 0.5,
              color: "rgba(28, 159, 255, 0.4)",
            },
            {
              offset: 1,
              color: "rgba(28, 159, 255, 0)",
            },
          ],
        },
      },
    },
    grid: {
      left: "48px",
      right: "48px",
      top: "24px",
      bottom: "24px",
      containtitle: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#e1e1e1",
        },
      },
      axistitle: {
        textStyle: {
          color: "#c1c1c1",
        },
      },
    },

    yAxis: [
      {
        minInterval: 1,
        axistitle: {
          textStyle: {
            color: "#e1e1e1",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#f4f9fd",
          },
        },
      },
      {
        minInterval: 1,
        axistitle: {
          textStyle: {
            color: "#e1e1e1",
          },
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value}%",
        },
      },
    ],
    series: ["加微数", "加微率", "点击数"].map((name, index) => ({
      name,
      type: "line",
      smooth: true,
      showSymbol: false,
      yAxisIndex: index == 1 ? 1 : 0,
      tooltip: {
        valueFormatter:
          index == 1
            ? (value: any) =>
                typeof value === "undefined" ? "--%" : value + "%"
            : (value: any) => (typeof value === "undefined" ? "0" : value + ""),
      },
      lineStyle: {
        width: 0,
      },
      symbolSize: 6,
      itemStyle: {
        color: "var(--wl-primary-color)",
      },
      areaStyle: {
        opcity: "0.8",
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.1,
              color: "rgba(28, 159, 255, 0.4)",
            },
            {
              offset: 1,
              color: "rgba(28, 159, 255, 0.1)",
            },
          ],
        },
      },
    })),
  };
};
