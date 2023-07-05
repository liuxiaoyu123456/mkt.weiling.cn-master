<template>
  <div class="flex-column main-between container">
    <div class="flex-column containerTop" v-loading="loading">
      <div class="flex-row cross-center title">
        <span>部署手册</span>
      </div>
      <div class="form-wrap">
        <div class="flex-row main-between cross-center content-item">
          <div class="flex-row" style="flex: 1; min-width: 0">
            <img src="@/assets/images/wechat/txt.png" alt="txt icon" />
            <div class="flex-column main-center text-content">
              <span class="top">{{ articleNames.codeFileName }}.txt</span>
              <!-- <span class="bottom"
                >该文档需要给到贵公司的技术人员进行开发部署</span
              > -->
            </div>
          </div>
          <el-button
            class="button"
            type="primary"
            v-on:click="onDownload(1)"
            v-if="isShow"
            >下载</el-button
          >
        </div>
        <div class="flex-row main-between cross-center content-item">
          <div class="flex-row" style="flex: 1; min-width: 0">
            <img src="@/assets/images/wechat/pdf.png" alt="pdf icon" />
            <div class="flex-column main-center text-content">
              <span class="top">{{ articleNames.operationFileName }}.pdf</span>
              <span class="bottom">
                请根据本文档内容，在百度后台进行微信方案的配置
              </span>
            </div>
          </div>
          <el-button
            class="button"
            type="primary"
            v-on:click="onDownload(2)"
            v-if="isShow"
            >下载</el-button
          >
        </div>
        <div class="flex-row-reverse">
          <el-button v-on:click="onDownload(0)">一键下载全部</el-button>
        </div>
      </div>
    </div>
    <div class="containerBottom">
      <el-button
        class="button"
        type="primary"
        v-on:click="backAdvert"
        v-if="$route.query?.source && isDownload"
        >返回广告营销</el-button
      >
      <el-button
        class="button"
        type="primary"
        v-on:click="handlerSubmit"
        v-else-if="!$route.query?.source && isDownload"
        >完成</el-button
      >
    </div>

    <!-- 提示语 -->
    <div class="tips-outer" v-if="tVisible">
      <div class="tips-top">
        <div class="tips-text">
          <p class="text-bold">点击右上角</p>
          <p class="text-normal">选择“在浏览器打开”<br />下载文件更稳定！</p>
        </div>
        <div class="tips-icon">
          <img
            class="arrow"
            src="@/assets/images/wechat/littleTips.png"
            alt=""
          />
        </div>
      </div>
      <div class="tips-bottom">
        <el-button class="button" type="primary" @click="closeTips"
          >知道了</el-button
        >
      </div>
    </div>

    <OptionTip v-model:show="showTip" @change="goEdit" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import useGetIdsFromUrl from "@/hooks/useGetIdsFromUrl";
import { getQueryVariable } from "@/utils/utils";
import JSZip from "jszip";
import OptionTip from "../OptionTip.vue";
import { saveAs } from "file-saver";
import qs from "qs";

const api = import.meta.env.VITE_APP_API;
import { useClueChannel } from "@/stores";

export default defineComponent({
  components: { OptionTip },
  name: "fianlPage",
  props: {
    form: { type: Object as any },
    // basicInfo: {
    //   type: Object,
    //   default() {
    //     return {
    //       componentName: "", //组件名称
    //       from_channel_ids: "", //使用渠道
    //       websiteName: "", //网站名称
    //       webType: "0", //网站类型
    //     };
    //   },
    // },
    // button_id: {
    //   type: String,
    //   default: "",
    // },
    // button_style: {
    //   type: String,
    //   default: "",
    // },
    // custom: {
    //   type: Object,
    //   default() {
    //     return {
    //       domainName: "",
    //     };
    //   },
    // },
  },
  setup(props) {
    const store = useClueChannel();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      showTip: false,
      isDownload: false,
      checked: false,
      tVisible: false,
      client: "",
      isShow: true,
      isWXWork: false,
      loading: false,
      clue_channel: store.getter_clue_channel,
      jsCodeContent: ``,
      // 需要替换 cos上的 文件地址
      articleUrls: {
        jmyOperationUrl: `https://wlmvp-cos.weiling.cn/website/mkt.weiling.cn/files/%E9%9B%86%E5%AE%A2%E9%80%9A%E5%BE%AE%E4%BF%A1%E6%96%B9%E6%A1%88%E9%85%8D%E7%BD%AE%E5%B8%AE%E5%8A%A9%E6%89%8B%E5%86%8C.pdf`, // 加微部署手册
        // buttonRulesUrl:     `https://wlmvp-cos.weiling.cn/worktable-erp/%E6%8A%95%E6%94%BE%E9%93%BE%E6%8E%A5%E6%8F%92%E7%A0%81%E8%A7%84%E5%88%99%E9%83%A8%E7%BD%B2%E6%89%8B%E5%86%8C20220707.pdf`, // 投放链接插码规则部署手册
      },
      articleNames: {
        codeFileName: "配置信息",
        operationFileName: "集客通微信方案配置帮助手册",
        // rulesFileName: '投放链接插码规则部署手册',
      },
      extraParameters: {
        ipv6Param: "&wl_cl_fwd=1",
      },
    });
    const addClick = () => {
      let fn = () => {
        setTimeout(() => {
          state.tVisible = false;
          window.removeEventListener("click", fn);
        }, 100);
      };
      window.addEventListener("click", fn);
    };
    const updateStatus = () => {
      const status = localStorage.getItem("noLittleTips");
      if (status === "yes") {
        state.tVisible = false;
      }
      if (status === "no") {
        state.tVisible = true;
      }
    };
    //浏览器刷新才做一下动作
    if (store.getter_first_tips === "yes") {
      //顺序很重要
      updateStatus();
      if (state.tVisible) addClick();
      store.mutation_first_tips("no");
    }

    // const Computed = {
    //   getContainer: computed(() => {
    //     if (state.main_container) return () => state.main_container;
    //   }),
    // };
    const { corp_id } = useGetIdsFromUrl();
    const methods = {
      goEdit() {
        window.open(`${import.meta.env.VITE_APP_DOMAIN}/help?type=baidu`);
        // router.push("/help?type=baidu")
      },
      closeTips() {
        state.tVisible = false;
      },
      initArticle: () => {
        //下载键判断环境
        (window as any).isMac = /macintosh|mac os x/i.test(navigator.userAgent);
        state.isWXWork = /wxwork/i.test(window.navigator.userAgent); // 企微
        if ((window as any).isMac == true && state.isWXWork == true) {
          state.isShow = false;
        }
      },
      initJsCodeContent: () => {
        console.log(props.form);
        
        // 绑定服务商账号信息
        // 账号：${props.form?.account?.username || ""}
        // 密码：${props.form?.account?.password || ""}
        state.jsCodeContent = `授权小程序信息
小程序名称：${props.form?.jmyInfo?.name}
小程序原始ID：请联系小微获取
path地址：${props.form?.jmyInfo?.path}
获取urlScheme地址：${props.form?.jmyInfo?.getSchemeUrl}`;
      },
      convertStrToBlob: (content: any) => {
        return new Blob([content], {
          type: "text/plain;charset=utf-8",
        });
      },
      downloadFile: (fileName: any, blob: any) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e: any) {
          let a: any = document.createElement("a");
          a.download = fileName;
          a.href = e.target.result;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };
      },
      getPdfBlob: (url: any) => {
        const baseConfig = {
          app_id: getQueryVariable("app_id"),
          corp_id: getQueryVariable("corp_id"),
          agent_id: getQueryVariable("agent_id"),
          sid: getQueryVariable("sid"),
        };
        let link = `${api}/api/cos/download?${qs.stringify({
          url,
          name,
          ...baseConfig,
        })}`;
        return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          xhr.open("get", link, true);
          xhr.setRequestHeader("Content-Type", `application/pdf`);
          xhr.responseType = "blob";
          xhr.onload = function () {
            if (this.status == 200) {
              //接受二进制文件流
              var blob = this.response;
              resolve(blob);
            }
          };
          xhr.send();
        });
      },
      getMultiZip: (blobs: any, fileNames: any) => {
        var zip = new JSZip();
        blobs.forEach((blob: any, i: any) => {
          // 添加要压缩的pdf
          zip.file(fileNames[i], blob, { binary: true });
        });
        zip.generateAsync({ type: "blob" }).then(function (content: any) {
          //生成zip并保存
          saveAs(content, `部署手册${dayjs().format("YYMMDDHHmm")}.zip`);
          state.loading = false;
        });
      },
      onDownload: (type: any) => {
        state.isDownload = true;
        (window as any).isMac = /macintosh|mac os x/i.test(navigator.userAgent);
        state.isWXWork = /wxwork/i.test(window.navigator.userAgent); // 企微
        //提示语判断环境
        if ((window as any).isMac == true && state.isWXWork == true) {
          state.tVisible = true;
        } else {
          methods.initJsCodeContent();
          if (type === 1) {
            methods.downloadFile(
              `${state.articleNames.codeFileName}${dayjs().format(
                "YYMMDDHHmm"
              )}`,
              methods.convertStrToBlob(state.jsCodeContent)
            );
          } else if (type === 2) {
            // loading = proxy.$mainLoading(state.main_container);
            state.loading = true;
            methods
              .getPdfBlob(state.articleUrls.jmyOperationUrl)
              .then((blob) => {
                saveAs(
                  blob,
                  `${state.articleNames.operationFileName}${dayjs().format(
                    "YYMMDDHHmm"
                  )}.pdf`
                ); // 拿到 blob 并下载 pdf
                state.loading = false;
              });
          } else {
            // loading = proxy.$mainLoading(state.main_container);
            state.loading = true;
            let tempMethodsArr: any = [];
            let tempfilesArr: any = [];
            tempMethodsArr = [
              methods.convertStrToBlob(state.jsCodeContent),
              methods.getPdfBlob(state.articleUrls.jmyOperationUrl),
            ];
            tempfilesArr = [
              `${state.articleNames.codeFileName}${dayjs().format(
                "YYMMDDHHmm"
              )}.txt`,
              `${state.articleNames.operationFileName}${dayjs().format(
                "YYMMDDHHmm"
              )}.pdf`,
            ];
            Promise.all(tempMethodsArr).then((res) => {
              // res结构：[blob, blob, blob, ...]
              let fileNames = tempfilesArr;
              methods.getMultiZip(res, fileNames);
              state.loading = false;
            });
          }
        }
      },
      handlerSubmit() {
        router.push({ name: "WeChatDefault" });
      },
      backAdvert() {
        router.push({ name: "AdvertReport" });
      },
    };

    // watch(
    //   () => props.button_style,
    //   () => {
    //     methods.initArticle();
    //   }
    // );
    watch(
      () => state.checked,
      (nV: any) => {
        if (nV) {
          state.tVisible = false;
          localStorage.setItem("noLittleTips", "yes");
        } else {
          state.tVisible = true;
          localStorage.setItem("noLittleTips", "no");
        }
      }
    );
    methods.initArticle();
    const addTip = () => {
      if (route.name == "WeChatEdit") {
        state.showTip = true;
      }
    };
    addTip();
    return {
      ...toRefs(state),
      ...methods,
      // ...Computed,
    };
  },
});
</script>

<style lang="scss" scoped>
.tips-outer {
  width: 289px;
  height: 120px;
  padding: 16px 12px 12px 24px;
  position: fixed;
  top: 8px;
  right: 12px;
  background-color: #fff;
  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 100;
  .tips-top {
    display: flex;
  }
  .tips-text {
    font-size: 16px;
    width: 220px;
    height: 50px;
    .text-bold {
      font-weight: bold;
    }
    .text-normal {
      font-weight: normal;
    }
  }
  .tips-icon {
    .arrow {
      width: 28px;
      height: 32px;
    }
  }
  .tips-bottom {
    display: flex;
    margin-top: 16px;
    justify-content: flex-end;
    :deep(.el-checkbox) {
      margin-top: 5px;
      .el-checkbox__label {
        font-size: 12px;
        padding-left: 5px;
      }
    }
    :deep(.el-button) {
      width: 68px;
      height: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
  }
}
// .container {
//   height: 844px;
// }
.containerTop {
  width: 90%;
  margin-top: 20px;
  display: block;
  > .title {
    position: relative;
    color: #000000;
    font-size: 20px;
    line-height: 28px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-bottom: 24px;

    &::before {
      position: absolute;
      content: "";
      width: 3px;
      height: 22px;
      background: var(--wl-primary-color);
      border-radius: 4px;
      left: -12px;
    }
  }
}
.containerBottom {
  width: 80%;
  .button {
    margin-bottom: 100px;
    // width: 100px;
    height: 40px;
    // font-size: 16px;
  }
}
.form-wrap {
  width: 90%;
  margin-left: 34px;
  margin-top: 30px;
}
.left-bar {
  width: 3px;
  height: 22px;
  background: var(--wl-primary-color);
  border-radius: 4px;
  margin-right: 4px;
}
.background {
  width: 160px;
  height: 40px;
  border: 1px solid #ebf0f5;
  border-radius: 4px;
  font-size: 16px;
  /* line-height: 24px; */
  text-align: center;
}
.titleWidth {
  width: 330px;
}
.content-item {
  height: 66px;
  background: var(--wl-primary-color-lightest);
  border-radius: 8px;
  margin-bottom: 24px;
  img {
    margin-left: 6px;
    width: 54px;
    height: 54px;
  }
  .button {
    margin-right: 30px;
  }
  .text-content {
    margin-left: 10px;
    flex: 1;
    min-width: 0;
    .top {
      font-weight: 600;
      font-size: 16px;
      color: var(--wl-text-color-title-1);
      @extend %ov1;
    }
    .bottom {
      font-size: 14px;
      color: var(--wl-text-color-secondary-2);
      margin-right: 28px;
      @extend %ov1;
    }
  }
}
:deep() {
  .el-form-item__label {
    font-size: 16px;
  }
}
</style>
