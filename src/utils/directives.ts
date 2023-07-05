import { ElMessage } from "element-plus";
export const copy = {
  // 当传进来的值更新的时候触发
  updated(el: any, context: any) {
    el.$value = context.value;
  },
  // 指令与元素解绑的时候，移除事件绑定
  unmounted(el: any) {
    el.removeEventListener("click", el.handler);
  },
};

export const copytext = {
  // mounted: function(el:any, binding:any) {
  //   el.onclick= function() {
  //     let oInput = document.createElement("input"); //创建input
  //     oInput.value = binding.value; //把值赋值到input里
  //     document.body.appendChild(oInput);
  //     oInput.select(); // 选择对象
  //     document.execCommand("Copy"); // 执行浏览器复制命令
  //     oInput.className = "oInput";
  //     oInput.style.display = "none";
  //     ElMessage({
  //       ElMessage: '复制成功',
  //       type: 'success',
  //       duration: 3000,
  //     });
  //     document.body.removeChild(oInput)
  //   }
  // },
  beforeMount(el, { value }) {
    el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
        ElMessage.warning("无复制内容");
        return;
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement("textarea");
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = true;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand("Copy");
      if (result) {
        ElMessage.success("复制成功");
      }
      document.body.removeChild(textarea);
    };
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener("click", el.handler);
  },
  //
  updated(el, { value }) {
    // binding.value = value;
    el.$value = value;
  },
  unmounted(el) {
    el.removeEventListener("click", el.handler);
  },
};

export const debounce = {
  mounted(el: any, binding: any) {
    const [fn, event = "click", wait = 300] = binding.value;
    let timer: any;
    el.addEventListener(event, () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn();
      }, wait);
    });
  },
};

export const draggable = {
  mounted: function (el: any) {
    // el.style.cursor = 'move'
    el.onmousedown = function (e: any) {
      const disx = e.pageX - el.offsetLeft;
      // let disy = e.pageY - el.offsetTop;
      document.onmousemove = function (e) {
        let x = e.pageX - disx;
        // let y = e.pageY - disy;
        const maxX =
          document.body.clientWidth -
          parseInt(window.getComputedStyle(el).width);
        // let maxY =
        //   document.body.clientHeight -
        //   parseInt(window.getComputedStyle(el).height);
        if (x < 0) {
          x = 0;
        } else if (x > maxX) {
          x = maxX;
        }

        // if (y < 0) {
        //   y = 0;
        // } else if (y > maxY) {
        //   y = maxY;
        // }

        el.style.left = x + "px";
        // el.style.top = y + 'px'
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
        el.style.left = 0 + "px";
        el.style.top = 0 + "px";
      };
    };
  },
};

export const bottomScroll = {
  mounted: function (el: any, binding: any) {
    el.addEventListener("scroll", () => {
      const [clientHeight, scrollHeight, scrollTop] = [
        el.clientHeight,
        el.scrollHeight,
        el.scrollTop,
      ];
      if (clientHeight + scrollTop == scrollHeight) binding.value("bottom");
    });
  },
};

export const topScroll = {
  mounted: function (el: any, binding: any) {
    el.addEventListener("scroll", () => {
      if (el.scrollTop == 0) binding.value("top");
    });
  },
};

export const copyText = {
  beforeMount(el: any, context: any) {
    el.$value = context.value;
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示。可根据项目UI仔细设计
        return;
      }
      // 动态创建 textarea 标签
      const textarea: any = document.createElement("textarea");
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = "readonly";
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      const result = document.execCommand("Copy");
      if (result) {
        ElMessage.success("复制成功");
      }
      document.body.removeChild(textarea);
    };
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener("click", el.handler);
  },
  // 当传进来的值更新的时候触发
  updated(el: any, context: any) {
    el.$value = context.value;
  },
  // 指令与元素解绑的时候，移除事件绑定
  unmounted(el: any) {
    el.removeEventListener("click", el.handler);
  },
};

export const clickOutside = {
  // 初始化指令
  beforeMount(el, binding) {
    function clickHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        // if(e.target === el){
        return false;
      }
      // 判断指令中是否绑定了函数
      if (typeof binding.value === "function") {
        // if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unmounted中可以解除事件监听
    el.__vueClickOutside__ = clickHandler;
    document.addEventListener("click", el.__vueClickOutside__);
  },
  unmounted(el) {
    // 解除事件监听
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__; // 删除属性
  },
};

export const clickOutsideParams = {
  // 初始化指令
  beforeMount(el, binding) {
    function clickHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (typeof binding.value.fn === "function") {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value.fn(binding.value.args);
      }
    }
    // 给当前元素绑定个私有变量，方便在unmounted中可以解除事件监听
    // el.__vueClickOutside__ = clickHandler;
    document.addEventListener("click", clickHandler);
  },
  unmounted(el) {
    // 解除事件监听
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__; // 删除属性
  },
};

// import InfiniteScrollReplenish from './InfiniteScrollReplenish';
// export { InfiniteScrollReplenish };
