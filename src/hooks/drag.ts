import { useHelpCenter, useUserStore } from "@/stores";

export const useDrag = () => {
  const userStore = useUserStore();
  const helpCenterStore = useHelpCenter();

  const BOX_HEIGHT = 48;
  const DISTANCE_VALUE = 22;
  let distance: any = {};
  const dragFn = (local: string, item, o, tVisible, Fn) => {
    // 获取DOM元素

    const container = document;
    //获取缓存内的位置
    let lo: any = localStorage.getItem(local);
    try {
      let location;
      if (lo) lo = JSON.parse(lo);
      if (Object.prototype.toString.call(lo) === "[object Object]") {
        location = lo[userStore.user?.id];
      }
      if (location) {
        lo = location.split("-");
        o.style.left = null;
        o.style.right = "16px";
        o.style.top = lo[1];
      }
    } catch (error) {
      console.log(error);
    }
    //鼠标按下
    o.onmousedown = function (downEvent: MouseEvent) {
      // console.log(downEvent, "downEvent");
      if (local === "helpCenterAssitantLocation") {
        helpCenterStore.helpCenterState.showHelp = false;
        tVisible.value = true;
        if (Object.prototype.toString.call(Fn) === "[object Function]") Fn();
      }
      if (o.setCapture) {
        //IE低版本
        o.setCapture();
      }
      downEvent = downEvent || window.event;
      //鼠标相对于盒子的位置
      const offsetX = downEvent.clientX - o.offsetLeft;
      const offsetY = downEvent.clientY - o.offsetTop;
      distance = {
        x: downEvent.clientX,
        y: downEvent.clientY,
        l: o.offsetLeft,
        t: o.offsetTop,
      };

      let thisY: number;
      const windowWidth =
        document.documentElement.clientWidth || document.body.clientWidth;
      const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //鼠标移动
      container.onmousemove = function (moveEvent: any) {
        moveEvent = moveEvent || window.event;
        let l = moveEvent.clientX - offsetX;
        let t = moveEvent.clientY - offsetY;
        if (l <= -16) {
          l = -16;
        }
        if (l >= windowWidth - o.offsetWidth) {
          l = windowWidth - o.offsetWidth;
        }
        if (t <= 0) {
          t = 0;
        }
        if (t >= windowHeight - o.offsetHeight) {
          t = windowHeight - o.offsetHeight;
        }
        thisY = t;
        o.style.left = (l / windowWidth) * 100 + "%";
        o.style.top = (t / windowHeight) * 100 + "%";
        o.style.zIndex = 15001;
        if (local === "xiaoweiAssitantLocation") {
          helpCenterStore.helpCenterState.showHelp = false;
        }
      };
      //鼠标抬起
      document.onmouseup = function (upEvent) {
        o.style.zIndex = 2000;
        // console.log(upEvent, "upEvent");
        if (local === "helpCenterAssitantLocation") {
          tVisible.value = false;
        }
        //拖动重叠-校正
        checkDrag(o, item, thisY);

        distance.l = upEvent.clientX;
        distance.t = upEvent.clientY;
        localStorage.setItem(
          local,
          `{"${userStore.user?.id}":"${o.style.left}-${o.style.top}"}`
        );
        o.style.left = null;
        o.style.right = "16px";
        container.onmousemove = null;
        document.onmouseup = null;
        if (o.releaseCapture) {
          o.releaseCapture(); //释放全局捕获
        }
      };
      return false; //标准浏览器的默认行为
    };
    window.addEventListener("resize", () => {
      o.style.left = null;
      o.style.top = null;

      localStorage.setItem(local, "");
    });
  };
  function isdrag() {
    const { x, y, l, t } = distance;
    // console.log(x, y, l, t);
    if (Math.sqrt((x - l) * (x - l) + (y - t) * (y - t)) <= 5) {
      return false;
    }
    return true;
  }
  function checkDrag(o: any, item: any, thisY: any) {
    // console.log(o, item, thisY, "test");
    const windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    //拖动重叠-获取另一个
    const other = document.querySelector(item);
    //拖动重叠-校正
    const otherY = other?.getBoundingClientRect().y;
    const topLine = Number(otherY - DISTANCE_VALUE);
    // console.log(topLine + DISTANCE_VALUE, "topline");
    const middleLine = Number(otherY + BOX_HEIGHT / 2);
    const bottomLine = Number(otherY + BOX_HEIGHT + DISTANCE_VALUE);
    if (topLine < Number(thisY + BOX_HEIGHT) && Number(thisY) < bottomLine) {
      if (Number(thisY) <= middleLine) {
        o.style.top = ((topLine - BOX_HEIGHT) / windowHeight) * 100 + "%";
        if (topLine - BOX_HEIGHT < 0) {
          o.style.top = (bottomLine / windowHeight) * 100 + "%";
        }
      } else {
        if (bottomLine > windowHeight - (BOX_HEIGHT + DISTANCE_VALUE)) {
          o.style.top = ((topLine - BOX_HEIGHT) / windowHeight) * 100 + "%";
        }
        o.style.top = (bottomLine / windowHeight) * 100 + "%";
      }
    }
  }

  return {
    isdrag,
    dragFn,
    checkDrag,
  };
};
